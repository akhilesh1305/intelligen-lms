"use client";

import { useEffect, useState } from "react";
import { CloudOff, RefreshCw } from "lucide-react";
import { flushSyncQueue } from "@/lib/offline/sync";

export function OfflineBanner() {
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOnline(navigator.onLine);

    function handleOnline() {
      setOnline(true);
      setMessage("Back online — syncing progress...");
      setSyncing(true);
      flushSyncQueue().then((result) => {
        setSyncing(false);
        if (result.synced > 0) {
          setMessage(`Synced ${result.synced} offline update${result.synced > 1 ? "s" : ""}`);
          setTimeout(() => setMessage(""), 4000);
        } else {
          setMessage("");
        }
      });
    }

    function handleOffline() {
      setOnline(false);
      setMessage("");
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online && !message) return null;

  return (
    <div
      className={`safe-bottom fixed bottom-20 left-4 right-4 z-50 mx-auto flex max-w-lg items-center gap-2 rounded-sm px-4 py-3 text-sm font-semibold shadow-elevated sm:bottom-4 sm:left-auto ${
        online
          ? "bg-emerald-600 text-white"
          : "bg-amber-600 text-white"
      }`}
      role="status"
    >
      {online ? (
        syncing ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : null
      ) : (
        <CloudOff className="h-4 w-4" />
      )}
      {online ? message || "Back online" : "You're offline — downloaded lessons still work"}
    </div>
  );
}
