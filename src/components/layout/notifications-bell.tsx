"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnread(data.unread ?? 0);
        }
      });
  }, []);

  async function markRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    setUnread(0);
    setNotifications((n) => n.map((item) => ({ ...item, read: true })));
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          if (!open && unread > 0) markRead();
        }}
        className="touch-target relative flex items-center justify-center rounded-lg p-2 text-muted hover:bg-surface hover:text-ink"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed right-4 top-16 z-50 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border bg-panel shadow-elevated sm:absolute sm:right-0 sm:top-auto sm:mt-2">
            <div className="border-b border-border px-4 py-3">
              <p className="font-semibold text-ink">Notifications</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted">
                  No notifications yet
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "border-b border-border px-4 py-3 last:border-0",
                      !n.read && "bg-brand-50/50 dark:bg-brand-500/10"
                    )}
                  >
                    {n.link ? (
                      <Link
                        href={n.link}
                        onClick={() => setOpen(false)}
                        className="block hover:text-brand-600"
                      >
                        <p className="text-sm font-semibold text-ink">{n.title}</p>
                        <p className="mt-0.5 text-xs text-muted line-clamp-2">{n.message}</p>
                      </Link>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-ink">{n.title}</p>
                        <p className="mt-0.5 text-xs text-muted line-clamp-2">{n.message}</p>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
