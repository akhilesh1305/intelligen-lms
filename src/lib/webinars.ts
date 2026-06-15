import type { WebinarStatus } from "@prisma/client";
import { db } from "./db";

export type EffectiveWebinarStatus = WebinarStatus | "UPCOMING" | "LIVE" | "ENDED";

export function getEffectiveStatus(
  scheduledAt: Date,
  durationMinutes: number,
  storedStatus: WebinarStatus
): EffectiveWebinarStatus {
  if (storedStatus === "CANCELLED") return "CANCELLED";
  if (storedStatus === "COMPLETED") return "COMPLETED";

  const now = Date.now();
  const start = new Date(scheduledAt).getTime();
  const end = start + durationMinutes * 60 * 1000;

  if (now < start) return "UPCOMING";
  if (now >= start && now <= end) return "LIVE";
  return "ENDED";
}

export function isWebinarLive(
  scheduledAt: Date,
  durationMinutes: number,
  storedStatus: WebinarStatus
) {
  return getEffectiveStatus(scheduledAt, durationMinutes, storedStatus) === "LIVE";
}

export async function getWebinars(filter?: "upcoming" | "past" | "all") {
  const webinars = await db.webinar.findMany({
    where: { status: { not: "CANCELLED" } },
    orderBy: { scheduledAt: filter === "past" ? "desc" : "asc" },
    include: {
      host: { select: { id: true, name: true, avatarUrl: true } },
      course: { select: { id: true, title: true } },
      _count: { select: { registrations: true, attendance: true } },
    },
  });

  const now = Date.now();
  const filtered = webinars.filter((w) => {
    const end =
      new Date(w.scheduledAt).getTime() + w.durationMinutes * 60 * 1000;
    if (filter === "upcoming") return end >= now;
    if (filter === "past") return end < now;
    return true;
  });

  return filtered;
}

export async function getWebinar(id: string) {
  return db.webinar.findUnique({
    where: { id },
    include: {
      host: { select: { id: true, name: true, avatarUrl: true, email: true } },
      course: { select: { id: true, title: true } },
      registrations: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { registeredAt: "asc" },
      },
      attendance: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { joinedAt: "asc" },
      },
      _count: { select: { registrations: true, attendance: true } },
    },
  });
}

export async function getHostWebinars(hostId: string) {
  return db.webinar.findMany({
    where: { hostId },
    orderBy: { scheduledAt: "desc" },
    include: {
      course: { select: { id: true, title: true } },
      _count: { select: { registrations: true, attendance: true } },
    },
  });
}

export async function registerForWebinar(webinarId: string, userId: string) {
  const webinar = await db.webinar.findUnique({ where: { id: webinarId } });
  if (!webinar || webinar.status === "CANCELLED") return null;

  if (webinar.maxAttendees) {
    const count = await db.webinarRegistration.count({ where: { webinarId } });
    if (count >= webinar.maxAttendees) {
      throw new Error("Webinar is full");
    }
  }

  return db.webinarRegistration.upsert({
    where: { webinarId_userId: { webinarId, userId } },
    create: { webinarId, userId },
    update: {},
  });
}

export async function recordJoin(webinarId: string, userId: string) {
  const webinar = await db.webinar.findUnique({ where: { id: webinarId } });
  if (!webinar) return null;

  const live = isWebinarLive(
    webinar.scheduledAt,
    webinar.durationMinutes,
    webinar.status
  );

  if (!live && webinar.status !== "LIVE") {
    throw new Error("Webinar is not live yet");
  }

  if (webinar.status === "SCHEDULED" && live) {
    await db.webinar.update({
      where: { id: webinarId },
      data: { status: "LIVE" },
    });
  }

  await db.webinarRegistration.upsert({
    where: { webinarId_userId: { webinarId, userId } },
    create: { webinarId, userId },
    update: {},
  });

  return db.webinarAttendance.upsert({
    where: { webinarId_userId: { webinarId, userId } },
    create: { webinarId, userId, joinedAt: new Date(), present: false },
    update: { joinedAt: new Date() },
  });
}

export async function recordLeave(webinarId: string, userId: string) {
  const attendance = await db.webinarAttendance.findUnique({
    where: { webinarId_userId: { webinarId, userId } },
  });
  if (!attendance) return null;

  const webinar = await db.webinar.findUnique({ where: { id: webinarId } });
  if (!webinar) return null;

  const leftAt = new Date();
  const durationMinutes = Math.round(
    (leftAt.getTime() - attendance.joinedAt.getTime()) / 60000
  );
  const present =
    durationMinutes >= Math.max(15, Math.floor(webinar.durationMinutes * 0.5));

  return db.webinarAttendance.update({
    where: { id: attendance.id },
    data: { leftAt, durationMinutes, present },
  });
}

export async function getAttendanceReport(webinarId: string) {
  const webinar = await getWebinar(webinarId);
  if (!webinar) return null;

  const registered = webinar.registrations.length;
  const attended = webinar.attendance.filter((a) => a.present).length;
  const joined = webinar.attendance.length;

  return {
    webinar,
    stats: {
      registered,
      joined,
      attended,
      attendanceRate: registered > 0 ? Math.round((attended / registered) * 100) : 0,
    },
  };
}
