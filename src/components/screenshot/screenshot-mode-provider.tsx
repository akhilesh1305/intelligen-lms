"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyScreenshotModeDom,
  readScreenshotModeEnabled,
  writeScreenshotModeEnabled,
} from "@/lib/screenshot-mode/storage";
import { ScreenshotModeIndicator } from "./screenshot-mode-indicator";

type ScreenshotModeContextValue = {
  enabled: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
};

const ScreenshotModeContext = createContext<ScreenshotModeContextValue | null>(null);

export function ScreenshotModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initial = readScreenshotModeEnabled();
    setEnabled(initial);
    applyScreenshotModeDom(initial);
    setHydrated(true);
  }, []);

  const setMode = useCallback((next: boolean) => {
    setEnabled(next);
    writeScreenshotModeEnabled(next);
    applyScreenshotModeDom(next);
  }, []);

  const enable = useCallback(() => setMode(true), [setMode]);
  const disable = useCallback(() => setMode(false), [setMode]);
  const toggle = useCallback(() => setMode(!enabled), [setMode, enabled]);

  const value = useMemo(
    () => ({ enabled: hydrated ? enabled : false, enable, disable, toggle }),
    [enabled, enable, disable, toggle, hydrated]
  );

  return (
    <ScreenshotModeContext.Provider value={value}>
      {children}
      <ScreenshotModeIndicator />
    </ScreenshotModeContext.Provider>
  );
}

export function useScreenshotMode() {
  const ctx = useContext(ScreenshotModeContext);
  if (!ctx) {
    throw new Error("useScreenshotMode must be used within ScreenshotModeProvider");
  }
  return ctx;
}
