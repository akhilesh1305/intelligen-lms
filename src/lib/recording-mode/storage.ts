export const RECORDING_MODE_STORAGE_KEY = "intelligen-recording-mode";

export function readRecordingModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(RECORDING_MODE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeRecordingModeEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      sessionStorage.setItem(RECORDING_MODE_STORAGE_KEY, "1");
    } else {
      sessionStorage.removeItem(RECORDING_MODE_STORAGE_KEY);
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function applyRecordingModeDom(enabled: boolean): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (enabled) {
    root.setAttribute("data-recording-mode", "true");
  } else {
    root.removeAttribute("data-recording-mode");
    root.removeAttribute("data-charts-ready");
  }
}
