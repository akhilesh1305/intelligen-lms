import { NotificationType } from "@prisma/client";
import { db } from "./db";
import { sendPushToUser } from "./push";

export async function createNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  const notification = await db.notification.create({ data });

  sendPushToUser(data.userId, {
    title: data.title,
    body: data.message,
    url: data.link ?? "/dashboard",
    tag: data.type,
  }).catch(() => {});

  return notification;
}

export async function getUnreadCount(userId: string) {
  return db.notification.count({ where: { userId, read: false } });
}

export async function markAllRead(userId: string) {
  return db.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}
