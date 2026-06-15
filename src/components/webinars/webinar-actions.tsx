"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Loader2, UserCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WebinarActions({
  webinarId,
  isRegistered,
  isLive,
  meetingUrl,
  hasAttendance,
  attended,
}: {
  webinarId: string;
  isRegistered: boolean;
  isLive: boolean;
  meetingUrl: string | null;
  hasAttendance: boolean;
  attended: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister() {
    setLoading(true);
    setMessage("");
    const res = await fetch(`/api/webinars/${webinarId}/register`, {
      method: "POST",
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Registration failed");
      return;
    }
    router.refresh();
  }

  async function handleAttend(action: "join" | "leave") {
    setLoading(true);
    setMessage("");
    const res = await fetch(`/api/webinars/${webinarId}/attend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error || "Attendance update failed");
      return;
    }
    if (action === "leave" && data.present) {
      setMessage("Attendance recorded — marked present.");
    } else if (action === "join") {
      setMessage("Joined — attendance tracking started.");
    }
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3">
      {!isRegistered ? (
        <Button onClick={handleRegister} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Register
        </Button>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <UserCheck className="h-4 w-4" />
          Registered
        </span>
      )}

      {isLive && isRegistered ? (
        <>
          {!hasAttendance ? (
            <Button variant="outline" onClick={() => handleAttend("join")} disabled={loading}>
              Mark as joined
            </Button>
          ) : !attended ? (
            <Button variant="outline" onClick={() => handleAttend("leave")} disabled={loading}>
              Mark as left / end session
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
              <UserCheck className="h-4 w-4" />
              Attendance recorded
            </span>
          )}
        </>
      ) : null}

      {meetingUrl && (isLive || isRegistered) ? (
        <a href={meetingUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4" />
            Join meeting
          </Button>
        </a>
      ) : null}

      {message ? <p className="w-full text-sm text-muted">{message}</p> : null}
    </div>
  );
}
