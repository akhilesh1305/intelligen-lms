export const SCREENSHOT_MODE_STORAGE_KEY = "intelligen-screenshot-mode";

export function readScreenshotModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SCREENSHOT_MODE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeScreenshotModeEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      sessionStorage.setItem(SCREENSHOT_MODE_STORAGE_KEY, "1");
    } else {
      sessionStorage.removeItem(SCREENSHOT_MODE_STORAGE_KEY);
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function applyScreenshotModeDom(enabled: boolean): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (enabled) {
    root.setAttribute("data-screenshot-mode", "true");
  } else {
    root.removeAttribute("data-screenshot-mode");
  }
}
