import { db } from "./db";
import { createCertificationPost } from "./feed";
import { sendCertificateEmail } from "./email";
import { createNotification } from "./notifications";

function generateCertificateNo() {
  const segment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `IG-${segment()}-${segment()}-${Date.now().toString(36).toUpperCase()}`;
}

export async function issueCertificate(userId: string, courseId: string) {
  const existing = await db.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return existing;

  const [user, course] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.course.findUnique({ where: { id: courseId } }),
  ]);
  if (!user || !course) return null;

  const certificate = await db.certificate.create({
    data: {
      userId,
      courseId,
      certificateNo: generateCertificateNo(),
    },
  });

  await createNotification({
    userId,
    type: "CERTIFICATE_EARNED",
    title: "Certificate earned!",
    message: `You've completed ${course.title}`,
    link: `/feed`,
  });

  await createCertificationPost(userId, certificate, course);

  await sendCertificateEmail(
    user.email,
    user.name,
    course.title,
    certificate.certificateNo
  );

  return certificate;
}

export async function getCertificate(id: string) {
  return db.certificate.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, instructor: { select: { name: true } } } },
    },
  });
}
