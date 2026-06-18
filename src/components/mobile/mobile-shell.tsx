"use client";

import { useEffect, useState } from "react";
import { PwaInstallPrompt } from "./pwa-install-prompt";
import { registerServiceWorker } from "./register-sw";

export function MobileShell() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    registerServiceWorker();
  }, []);

  if (!mounted) return null;

  return <PwaInstallPrompt />;
}
