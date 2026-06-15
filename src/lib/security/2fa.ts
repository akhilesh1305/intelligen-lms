import { generateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";
import { encrypt, decrypt } from "@/lib/encryption";
import { db } from "@/lib/db";

export function generateTwoFactorSecret() {
  return generateSecret();
}

export function verifyTotpCode(secret: string, code: string) {
  return verifySync({ token: code, secret }).valid;
}

export async function getQrCodeDataUrl(email: string, secret: string) {
  const otpauth = generateURI({
    issuer: "IntelliGen LMS",
    label: email,
    secret,
  });
  return QRCode.toDataURL(otpauth);
}

export async function enableTwoFactor(userId: string, secret: string) {
  const encrypted = encrypt(secret);
  await db.user.update({
    where: { id: userId },
    data: { twoFactorSecret: encrypted },
  });
  await syncTwoFactorEnabled(userId);
}

type TwoFactorUser = {
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  twoFactorEmailEnabled: boolean;
  twoFactorAltEmailVerified: boolean;
  twoFactorSmsEnabled: boolean;
  twoFactorAltPhoneVerified: boolean;
};

export function getAvailable2FAMethods(user: TwoFactorUser) {
  if (!user.twoFactorEnabled) return [];

  const methods: Array<"authenticator" | "email" | "sms"> = [];
  if (user.twoFactorSecret) methods.push("authenticator");
  if (user.twoFactorEmailEnabled && user.twoFactorAltEmailVerified) {
    methods.push("email");
  }
  if (user.twoFactorSmsEnabled && user.twoFactorAltPhoneVerified) {
    methods.push("sms");
  }
  return methods;
}

export async function syncTwoFactorEnabled(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      twoFactorSecret: true,
      twoFactorEmailEnabled: true,
      twoFactorAltEmailVerified: true,
      twoFactorSmsEnabled: true,
      twoFactorAltPhoneVerified: true,
    },
  });
  if (!user) return;

  const hasAuthenticator = Boolean(user.twoFactorSecret);
  const hasEmail =
    user.twoFactorEmailEnabled && user.twoFactorAltEmailVerified;
  const hasSms = user.twoFactorSmsEnabled && user.twoFactorAltPhoneVerified;
  const enabled = hasAuthenticator || hasEmail || hasSms;

  await db.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: enabled,
      ...(!enabled
        ? {
            twoFactorEmailEnabled: false,
            twoFactorSmsEnabled: false,
          }
        : {}),
    },
  });
}

export async function disableAuthenticator(userId: string) {
  await db.user.update({
    where: { id: userId },
    data: { twoFactorSecret: null },
  });
  await syncTwoFactorEnabled(userId);
}

export async function disableTwoFactor(userId: string) {
  await db.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorEmailEnabled: false,
      twoFactorSmsEnabled: false,
    },
  });
}

export async function setBackupTwoFactor(
  userId: string,
  channel: "email" | "sms",
  enabled: boolean
) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      twoFactorAltEmail: true,
      twoFactorAltEmailVerified: true,
      twoFactorAltPhone: true,
      twoFactorAltPhoneVerified: true,
    },
  });
  if (!user) throw new Error("User not found");

  if (channel === "email") {
    if (enabled && (!user.twoFactorAltEmail || !user.twoFactorAltEmailVerified)) {
      throw new Error("Verify your alternate email first");
    }
    await db.user.update({
      where: { id: userId },
      data: { twoFactorEmailEnabled: enabled },
    });
  } else {
    if (enabled && (!user.twoFactorAltPhone || !user.twoFactorAltPhoneVerified)) {
      throw new Error("Verify your alternate phone first");
    }
    await db.user.update({
      where: { id: userId },
      data: { twoFactorSmsEnabled: enabled },
    });
  }

  await syncTwoFactorEnabled(userId);
}

export async function getUserTwoFactorSecret(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true, twoFactorSecret: true },
  });
  if (!user?.twoFactorEnabled || !user.twoFactorSecret) return null;
  return decrypt(user.twoFactorSecret);
}
