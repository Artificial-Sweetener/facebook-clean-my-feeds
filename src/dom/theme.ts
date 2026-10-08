// SPDX-License-Identifier: GPL-3.0-only
import type { StyleState } from "./types";
/**
 * Prefer Facebook theme classes, then estimate luminance from the computed body background.
 * @returns Whether presentation should use dark-mode styling; absent color information falls back to light.
 */
export function detectDarkMode(): boolean {
  if (typeof document === "undefined" || !document.documentElement) {
    return false;
  }

  if (document.documentElement.classList.contains("__fb-light-mode")) {
    return false;
  }

  if (document.documentElement.classList.contains("__fb-dark-mode")) {
    return true;
  }

  if (document.body) {
    const bodyBackgroundColour = window.getComputedStyle(document.body).backgroundColor;
    const rgb = bodyBackgroundColour.match(/\d+/g);
    if (rgb && rgb[0] && rgb[1] && rgb[2]) {
      const red = parseInt(rgb[0], 10);
      const green = parseInt(rgb[1], 10);
      const blue = parseInt(rgb[2], 10);
      const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;
      return luminance < 128;
    }
  }

  return false;
}

/** The caller owns every observer created while waiting for or monitoring the document root. */
export interface ThemeWatcher {
  disconnect: () => void;
}

/**
 * Observe theme changes even when the document root is created after userscript startup.
 * @param state Last observed theme; null starts with a fresh detection.
 * @param onChange Callback triggered only when the detected boolean changes.
 * @returns An owner that disconnects bootstrap and active observers, or null without observer support.
 */
export function watchDarkMode(
  state: Pick<StyleState, "isDarkMode"> | null,
  onChange?: (mode: boolean) => void
): ThemeWatcher | null {
  if (!state || typeof MutationObserver === "undefined") return null;
  let active: MutationObserver | null = null;
  let bootstrap: MutationObserver | null = null;
  let stopped = false;

  /** Suppress duplicate rebuilds when unrelated root classes change. */
  function syncMode(): void {
    if (stopped || typeof document === "undefined" || !document.documentElement) return;
    const mode = detectDarkMode();
    if (state && state.isDarkMode !== mode) {
      state.isDarkMode = mode;
      onChange?.(mode);
    }
  }

  /** Transfer ownership from the bootstrap observer once a root can express its theme. */
  function startObserving(): void {
    if (stopped || typeof document === "undefined" || !document.documentElement || active) return;
    bootstrap?.disconnect();
    bootstrap = null;
    active = new MutationObserver((mutations) => {
      if (
        mutations.some(
          (mutation) => mutation.type === "attributes" && mutation.attributeName === "class"
        )
      )
        syncMode();
    });
    active.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    syncMode();
  }

  syncMode();
  startObserving();
  if (!active) {
    bootstrap = new MutationObserver(startObserving);
    bootstrap.observe(document, { childList: true });
  }
  return {
    /** Stop late bootstrap callbacks as well as the currently attached root observer. */
    disconnect: () => {
      if (stopped) return;
      stopped = true;
      bootstrap?.disconnect();
      active?.disconnect();
    },
  };
}
