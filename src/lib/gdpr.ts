import { GdprRequestType } from "@prisma/client";
import { db } from "@/lib/db";

export async function requestGdprExport(userId: string) {
  return db.gdprRequest.create({
    data: { userId, type: GdprRequestType.EXPORT },
  });
}

export async function requestGdprDeletion(userId: string) {
  return db.gdprRequest.create({
    data: { userId, type: GdprRequestType.DELETION },
  });
}

export async function exportUserData(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          course: { select: { id: true, title: true } },
        },
      },
      progress: true,
      certificates: true,
      userBadges: { include: { badge: true } },
      notifications: { take: 100, orderBy: { createdAt: "desc" } },
      devices: true,
      gdprRequests: true,
      challengeAttempts: { take: 50, orderBy: { completedAt: "desc" } },
    },
  });

  if (!user) return null;

  const {
    passwordHash: _passwordHash,
    twoFactorSecret: _twoFactorSecret,
    ...safeUser
  } = user;

  return {
    exportedAt: new Date().toISOString(),
    user: safeUser,
  };
}

export async function completeGdprRequest(requestId: string) {
  return db.gdprRequest.update({
    where: { id: requestId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
}

export async function anonymizeUser(userId: string) {
  const anonymizedEmail = `deleted-${userId.slice(0, 8)}@anonymized.local`;
  await db.user.update({
    where: { id: userId },
    data: {
      name: "Deleted User",
      email: anonymizedEmail,
      passwordHash: "",
      avatarUrl: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorAltEmail: null,
      twoFactorAltEmailVerified: false,
      twoFactorAltPhone: null,
      twoFactorAltPhoneVerified: false,
      twoFactorEmailEnabled: false,
      twoFactorSmsEnabled: false,
      instructorStatus: null,
      instructorRejectionReason: null,
      instructorReviewedAt: null,
      ssoProvider: null,
      ssoSubjectId: null,
      marketingConsent: false,
    },
  });

  await db.userDevice.updateMany({
    where: { userId },
    data: { revokedAt: new Date(), trusted: false },
  });
}
