// SPDX-License-Identifier: GPL-3.0-only

/**
 * Reject collapsed or unmeasurable elements before using geometry for modal detection.
 * @param element Candidate DOM element from the host page.
 * @returns Visible element geometry, or null for an unmeasurable element.
 */
export function getVisibleRect(element: Element | null) {
  if (!element || typeof element.getBoundingClientRect !== "function") {
    return null;
  }

  const rect = element.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  return rect;
}

/**
 * Decode browser-computed RGB/RGBA colors, including percentage alpha, for scrim classification.
 * @param color Computed CSS color string supplied by the browser.
 * @returns Parsed channel and alpha values, or null for unsupported syntax.
 */
export function parseRgbColor(color: string) {
  if (typeof color !== "string") {
    return null;
  }

  const match = color
    .trim()
    .match(
      /^rgba?\(\s*([0-9.]+)(?:,|\s)\s*([0-9.]+)(?:,|\s)\s*([0-9.]+)(?:\s*[,/]\s*([0-9.]+%?))?\s*\)$/i
    );
  if (!match) {
    return null;
  }

  const alphaValue = match[4] || "1";
  const alpha = alphaValue.endsWith("%")
    ? parseFloat(alphaValue.slice(0, -1)) / 100
    : parseFloat(alphaValue);

  return {
    r: parseFloat(match[1] || "0"),
    g: parseFloat(match[2] || "0"),
    b: parseFloat(match[3] || "0"),
    a: Number.isNaN(alpha) ? 1 : alpha,
  };
}

/**
 * Recognize translucent dark or light overlays using conservative brightness and opacity thresholds.
 * @param color Computed CSS color string supplied by the browser.
 * @returns True only for sufficiently opaque dark or light scrim colors.
 */
export function isModalScrimColor(color: string) {
  const parsed = parseRgbColor(color);
  if (!parsed) {
    return false;
  }

  const maxChannel = Math.max(parsed.r, parsed.g, parsed.b);
  const minChannel = Math.min(parsed.r, parsed.g, parsed.b);
  return parsed.a >= 0.2 && (maxChannel <= 120 || minChannel >= 180);
}

/**
 * Exclude hidden, transparent, or zero-area dialogs from page-dimming detection.
 * @param element Candidate DOM element from the host page.
 * @returns True when layout and computed visibility allow the element to be seen.
 */
export function isVisibleElement(element: Element) {
  const rect = getVisibleRect(element);
  if (!rect) {
    return false;
  }

  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
}

/**
 * Require a visible modal semantic before treating a large translucent rectangle as a scrim.
 * @returns Whether at least one visible dialog or aria-modal element exists.
 */
export function hasVisibleDialog() {
  return Array.from(document.querySelectorAll('[role="dialog"], [aria-modal="true"]')).some(
    isVisibleElement
  );
}

/**
 * Identify fixed viewport-covering overlays while excluding this extension’s own controls.
 * @param element Candidate DOM element from the host page.
 * @returns Whether the candidate is a qualifying fixed viewport-covering scrim.
 */
export function isFullViewportDimmer(element: Element) {
  if (!element || element.id === "fbcmf" || element.id === "fbcmfToggle") {
    return false;
  }
  if (element.closest && element.closest("#fbcmf, .fb-cmf-toggle")) {
    return false;
  }

  const rect = getVisibleRect(element);
  if (!rect || rect.bottom <= 0 || rect.right <= 0) {
    return false;
  }

  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  if (viewportWidth === 0 || viewportHeight === 0) {
    return false;
  }

  if (rect.width < viewportWidth * 0.8 || rect.height < viewportHeight * 0.8) {
    return false;
  }

  const style = window.getComputedStyle(element);
  return style.position === "fixed" && isModalScrimColor(style.backgroundColor);
}

/**
 * Combine modal semantics and scrim geometry to prevent the floating control from bypassing Facebook dialogs.
 * @returns Whether Facebook currently displays both a visible modal and a qualifying scrim.
 */
export function isFacebookPageDimmed() {
  if (!document.body || !hasVisibleDialog()) {
    return false;
  }

  return Array.from(document.body.querySelectorAll("*")).some(isFullViewportDimmer);
}
