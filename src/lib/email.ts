import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || "IntelliGen LMS <noreply@intelligen.lms>";

  if (!transporter) {
    console.log("\n📧 Email (dev mode — no SMTP configured)");
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${html.replace(/<[^>]+>/g, " ").slice(0, 200)}...\n`);
    return { success: true, dev: true };
  }

  await transporter.sendMail({ from, to, subject, html });
  return { success: true, dev: false };
}

export async function sendEnrollmentEmail(to: string, name: string, courseTitle: string) {
  return sendEmail({
    to,
    subject: `Enrolled in ${courseTitle}`,
    html: `<p>Hi ${name},</p><p>You've successfully enrolled in <strong>${courseTitle}</strong>. Start learning now on IntelliGen LMS!</p>`,
  });
}

export async function sendCertificateEmail(
  to: string,
  name: string,
  courseTitle: string,
  certificateNo: string
) {
  return sendEmail({
    to,
    subject: `Certificate earned: ${courseTitle}`,
    html: `<p>Congratulations ${name}!</p><p>You've completed <strong>${courseTitle}</strong>. Your certificate number is <strong>${certificateNo}</strong>.</p>`,
  });
}

export async function sendTwoFactorCodeEmail(to: string, code: string) {
  return sendEmail({
    to,
    subject: "Your IntelliGen LMS verification code",
    html: `<p>Your verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
  });
}

export async function sendCourseApprovalEmail(
  to: string,
  name: string,
  courseTitle: string,
  approved: boolean,
  reason?: string
) {
  return sendEmail({
    to,
    subject: approved ? `Course approved: ${courseTitle}` : `Course rejected: ${courseTitle}`,
    html: approved
      ? `<p>Hi ${name},</p><p>Your course <strong>${courseTitle}</strong> has been approved and is now live!</p>`
      : `<p>Hi ${name},</p><p>Your course <strong>${courseTitle}</strong> was not approved.${reason ? ` Reason: ${reason}` : ""}</p>`,
  });
}
