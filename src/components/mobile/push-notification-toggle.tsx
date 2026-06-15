"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPushRegistration } from "./register-sw";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function PushNotificationToggle() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const ok =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setSupported(ok);
    if (!ok) return;

    setEnabled(Notification.permission === "granted");

    fetch("/api/push/subscribe")
      .then((r) => r.json())
      .then((data) => setConfigured(Boolean(data.configured)))
      .catch(() => {});
  }, []);

  async function enablePush() {
    setLoading(true);
    setMessage("");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setLoading(false);
      setMessage("Notification permission denied.");
      return;
    }

    const configRes = await fetch("/api/push/subscribe");
    const config = await configRes.json();
    if (!config.publicKey) {
      setLoading(false);
      setMessage("Push not configured on server yet.");
      return;
    }

    const registration = await getPushRegistration();
    if (!registration) {
      setLoading(false);
      setMessage("Service worker unavailable.");
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.publicKey),
    });

    const json = subscription.toJSON();
    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    });

    setLoading(false);
    if (!res.ok) {
      setMessage("Could not save push subscription.");
      return;
    }

    setEnabled(true);
    setMessage("Push notifications enabled.");
  }

  async function disablePush() {
    setLoading(true);
    const registration = await getPushRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    if (subscription) {
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      await subscription.unsubscribe();
    }
    setEnabled(false);
    setLoading(false);
    setMessage("Push notifications disabled.");
  }

  if (!supported) {
    return (
      <p className="text-sm text-muted">
        Push notifications are not supported in this browser.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Get notified about enrollments, grades, certificates, and webinars — even when the app is closed.
      </p>
      {!configured ? (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Server push keys not configured. Add VAPID keys to enable mobile push.
        </p>
      ) : null}
      <Button
        variant={enabled ? "outline" : "primary"}
        onClick={enabled ? disablePush : enablePush}
        disabled={loading || !configured}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : enabled ? (
          <BellOff className="h-4 w-4" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {enabled ? "Disable push notifications" : "Enable push notifications"}
      </Button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </div>
  );
}
