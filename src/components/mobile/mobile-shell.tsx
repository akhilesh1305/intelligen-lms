"use client";

import { useEffect, useState } from "react";
import { OfflineBanner } from "./offline-banner";
import { PwaInstallPrompt } from "./pwa-install-prompt";
import { registerServiceWorker } from "./register-sw";
import { flushSyncQueue } from "@/lib/offline/sync";

export function MobileShell() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    registerServiceWorker();

    async function handleOnline() {
      const result = await flushSyncQueue();
      if (result.synced > 0) {
        window.dispatchEvent(
          new CustomEvent("intelligen-sync-complete", { detail: result })
        );
      }
    }

    window.addEventListener("online", handleOnline);
    if (navigator.onLine) handleOnline();

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <OfflineBanner />
      <PwaInstallPrompt />
    </>
  );
}
