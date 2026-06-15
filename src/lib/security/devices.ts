import { createHash } from "crypto";
import { db } from "@/lib/db";

function parseUserAgent(userAgent: string) {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS Device";
  if (/Android/i.test(userAgent)) return "Android Device";
  if (/Windows/i.test(userAgent)) return "Windows PC";
  if (/Macintosh|Mac OS/i.test(userAgent)) return "Mac";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Unknown device";
}

export function getDeviceHash(userAgent: string, ipAddress?: string | null) {
  return createHash("sha256")
    .update(`${userAgent}|${ipAddress ?? "unknown"}`)
    .digest("hex")
    .slice(0, 32);
}

export async function trackDevice(
  userId: string,
  userAgent: string,
  ipAddress?: string | null
) {
  const deviceHash = getDeviceHash(userAgent, ipAddress);
  const deviceName = parseUserAgent(userAgent);

  const existing = await db.userDevice.findUnique({
    where: { userId_deviceHash: { userId, deviceHash } },
  });

  if (existing?.revokedAt) {
    return { allowed: false, device: existing };
  }

  const device = await db.userDevice.upsert({
    where: { userId_deviceHash: { userId, deviceHash } },
    create: {
      userId,
      deviceHash,
      deviceName,
      userAgent: userAgent.slice(0, 500),
      ipAddress: ipAddress ?? null,
    },
    update: {
      lastSeenAt: new Date(),
      ipAddress: ipAddress ?? null,
    },
  });

  return { allowed: true, device };
}

export async function getUserDevices(userId: string) {
  return db.userDevice.findMany({
    where: { userId, revokedAt: null },
    orderBy: { lastSeenAt: "desc" },
  });
}

export async function revokeDevice(userId: string, deviceId: string) {
  const device = await db.userDevice.findFirst({
    where: { id: deviceId, userId },
  });
  if (!device) return null;

  return db.userDevice.update({
    where: { id: deviceId },
    data: { revokedAt: new Date(), trusted: false },
  });
}
