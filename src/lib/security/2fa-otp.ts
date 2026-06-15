import { createHash, randomInt } from "crypto";
import { TwoFactorChannel } from "@prisma/client";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { sendSms } from "@/lib/sms";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_PER_HOUR = 5;

function getOtpPepper() {
  return process.env.SESSION_SECRET ?? "intelligen-dev-otp";
}

export function generateOtpCode(): string {
  return String(randomInt(100000, 999999));
}

export function hashOtpCode(code: string): string {
  return createHash("sha256").update(`${code}:${getOtpPepper()}`).digest("hex");
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"*".repeat(Math.max(1, local.length - visible.length))}@${domain}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  return `***${digits.slice(-4)}`;
}

async function assertRateLimit(userId: string, channel: TwoFactorChannel) {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await db.twoFactorOtp.count({
    where: { userId, channel, createdAt: { gte: since } },
  });
  if (recent >= MAX_OTP_PER_HOUR) {
    throw new Error("Too many verification codes requested. Try again later.");
  }

  const latest = await db.twoFactorOtp.findFirst({
    where: { userId, channel },
    orderBy: { createdAt: "desc" },
  });
  if (latest && Date.now() - latest.createdAt.getTime() < OTP_COOLDOWN_MS) {
    throw new Error("Please wait a minute before requesting another code.");
  }
}

export async function createAndDeliverOtp(
  userId: string,
  channel: TwoFactorChannel,
  destination: string,
  purpose: "setup" | "login"
) {
  await assertRateLimit(userId, channel);

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await db.twoFactorOtp.deleteMany({ where: { userId, channel } });
  await db.twoFactorOtp.create({
    data: {
      userId,
      channel,
      codeHash: hashOtpCode(code),
      expiresAt,
    },
  });

  if (channel === "EMAIL") {
    await sendEmail({
      to: destination,
      subject: "Your IntelliGen LMS verification code",
      html: `<p>Your verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
    });
  } else {
    await sendSms({
      to: destination,
      body: `IntelliGen LMS ${purpose === "login" ? "sign-in" : "verification"} code: ${code}. Expires in 10 minutes.`,
    });
  }

  return { expiresAt };
}

export async function verifyOtpCode(
  userId: string,
  channel: TwoFactorChannel,
  code: string
): Promise<boolean> {
  const record = await db.twoFactorOtp.findFirst({
    where: { userId, channel },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.expiresAt < new Date()) {
    return false;
  }

  const valid = record.codeHash === hashOtpCode(code);
  if (valid) {
    await db.twoFactorOtp.deleteMany({ where: { userId, channel } });
  }
  return valid;
}
