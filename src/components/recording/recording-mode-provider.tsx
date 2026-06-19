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
  applyRecordingModeDom,
  readRecordingModeEnabled,
  writeRecordingModeEnabled,
} from "@/lib/recording-mode/storage";
import { RecordingModeIndicator } from "./recording-mode-indicator";
import { RecordingModeEffects } from "./recording-mode-effects";

type RecordingModeContextValue = {
  enabled: boolean;
  hydrated: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
};

const RecordingModeContext = createContext<RecordingModeContextValue>({
  enabled: false,
  hydrated: false,
  enable: () => {},
  disable: () => {},
  toggle: () => {},
});

export function RecordingModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initial = readRecordingModeEnabled();
    setEnabled(initial);
    applyRecordingModeDom(initial);
    setHydrated(true);
  }, []);

  const setMode = useCallback((next: boolean) => {
    setEnabled(next);
    writeRecordingModeEnabled(next);
    applyRecordingModeDom(next);
  }, []);

  const enable = useCallback(() => setMode(true), [setMode]);
  const disable = useCallback(() => setMode(false), [setMode]);
  const toggle = useCallback(() => setMode(!enabled), [setMode, enabled]);

  const value = useMemo(
    () => ({
      enabled: hydrated ? enabled : false,
      hydrated,
      enable,
      disable,
      toggle,
    }),
    [enabled, hydrated, enable, disable, toggle]
  );

  return (
    <RecordingModeContext.Provider value={value}>
      {children}
      <RecordingModeEffects />
      <RecordingModeIndicator />
    </RecordingModeContext.Provider>
  );
}

export function useRecordingMode() {
  return useContext(RecordingModeContext);
}
