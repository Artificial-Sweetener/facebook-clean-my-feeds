// SPDX-License-Identifier: GPL-3.0-only

import { getTopbarMenuButton } from "../../dom/topbar-controls";

/**
 * Convert computed three- or six-digit hex colors into the translucent active-button background.
 * @param value Input value to validate or convert before presentation.
 * @param alpha Opacity fraction used for the active background.
 * @returns A CSS rgba() value, or an empty string when the input is not a supported hex color.
 */
const hexToRgba = (value: string, alpha: number) => {
  if (!value) {
    return "";
  }
  const hex = value.trim();
  if (!hex.startsWith("#")) {
    return "";
  }
  const normalized =
    hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
  if (normalized.length !== 7) {
    return "";
  }
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return "";
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Ignore unresolved transparent colors when choosing a readable host-derived icon color.
 * @param value Input value to validate or convert before presentation.
 * @returns Whether the computed color is nonempty and not transparent.
 */
const isUsableColor = (value: string) => {
  if (!value) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === "transparent" || normalized === "none") {
    return false;
  }
  if (normalized.startsWith("rgba(") && normalized.endsWith(", 0)")) {
    return false;
  }
  return true;
};

/**
 * Own the topbar toggle’s host-derived geometry and neutral theme color cache.
 * @param btn Mounted or soon-to-be-mounted control whose styles this controller owns.
 * @returns Position, dirty-check, and theme invalidation operations with no listeners or timers.
 */
export function createTopbarPositioning(btn: HTMLElement) {
  let cachedIconColor = "";
  let cachedBtnBg = "";
  let cachedHover = "";
  let cachedPress = "";
  let lastMenuRect: Pick<DOMRect, "left" | "top" | "width" | "height"> | null = null;
  let themeDirty = false;
  /**
   * Align the toggle beside Facebook’s leftmost topbar control and cache neutral theme colors across expanded menus.
   * @returns True when a host control supplied geometry; false when corner fallback positioning was used.
   */
  const updateTopRightPosition = () => {
    const menuButton = getTopbarMenuButton();
    if (!menuButton) {
      btn.style.position = "fixed";
      btn.style.top = "0.5rem";
      btn.style.right = "0.5rem";
      btn.style.left = "auto";
      btn.style.zIndex = "999";
      lastMenuRect = null;
      return false;
    }

    const rect = menuButton.getBoundingClientRect();
    lastMenuRect = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
    const menuStyle = window.getComputedStyle(menuButton);
    const hoverOverlay = menuStyle.getPropertyValue("--hover-overlay");
    const pressOverlay = menuStyle.getPropertyValue("--press-overlay");
    const secondaryBg = menuStyle.getPropertyValue("--secondary-button-background");
    const accent = menuStyle.getPropertyValue("--accent");
    const primaryButtonBg = menuStyle.getPropertyValue("--primary-button-background");
    const isMenuExpanded = menuButton.getAttribute("aria-expanded") === "true";
    const gap = 8;
    const left = Math.max(0, rect.left - rect.width - gap);

    btn.style.position = "fixed";
    btn.style.top = `${rect.top}px`;
    btn.style.left = `${left}px`;
    btn.style.right = "auto";
    btn.style.width = `${rect.width}px`;
    btn.style.height = `${rect.height}px`;
    btn.style.borderRadius = menuStyle.borderRadius;
    btn.style.boxShadow = menuStyle.boxShadow;
    const iconElement = menuButton.querySelector("svg, i, span");
    const iconStyle = iconElement ? window.getComputedStyle(iconElement) : null;
    const iconColor = iconStyle ? iconStyle.color : "";
    const iconFill = iconStyle ? iconStyle.getPropertyValue("fill") : "";
    const menuColor = menuStyle.color;
    const secondaryIcon = menuStyle.getPropertyValue("--secondary-icon");
    const resolvedIconColor =
      [iconColor, iconFill, menuColor, secondaryIcon].find(isUsableColor) ||
      "var(--secondary-icon)";
    if (themeDirty || !isMenuExpanded || !cachedIconColor) {
      cachedIconColor = resolvedIconColor;
    }
    const finalIconColor = cachedIconColor || resolvedIconColor;
    btn.style.setProperty("--cmf-icon-color", finalIconColor);
    if (btn.getAttribute("data-cmf-open") === "true") {
      btn.style.color = "";
    } else {
      btn.style.color = finalIconColor;
    }
    const activeBg = hexToRgba(primaryButtonBg, 0.2);
    if (activeBg) {
      btn.style.setProperty("--cmf-active-bg", activeBg);
    }
    if (accent) {
      btn.style.setProperty("--cmf-active-icon", accent);
    }
    const icon = btn.querySelector<HTMLElement | SVGElement>("svg, .cmf-icon");
    if (icon) {
      if (icon.tagName && icon.tagName.toLowerCase() === "svg") {
        icon.style.fill = "currentColor";
      }
      if (iconStyle && iconStyle.width && iconStyle.height) {
        icon.style.width = iconStyle.width;
        icon.style.height = iconStyle.height;
      }
    }

    const zIndexValue = menuStyle.zIndex;
    if (zIndexValue && zIndexValue !== "auto" && zIndexValue !== "0") {
      btn.style.zIndex = zIndexValue;
    } else {
      btn.style.zIndex = "9999";
    }
    btn.style.padding = "0";
    btn.style.margin = "0";
    if (themeDirty || !isMenuExpanded || !cachedBtnBg) {
      if (secondaryBg) {
        cachedBtnBg = secondaryBg;
      } else if (menuStyle.backgroundColor) {
        cachedBtnBg = menuStyle.backgroundColor;
      }
    }
    if (cachedBtnBg) {
      btn.style.setProperty("--cmf-btn-bg", cachedBtnBg);
    }
    btn.style.backgroundColor = "";

    if (themeDirty || !isMenuExpanded || !cachedHover) {
      cachedHover = hoverOverlay || "var(--hover-overlay)";
    }
    if (themeDirty || !isMenuExpanded || !cachedPress) {
      cachedPress = pressOverlay || "var(--press-overlay)";
    }
    btn.style.setProperty("--cmf-btn-hover", cachedHover || hoverOverlay || "var(--hover-overlay)");
    btn.style.setProperty("--cmf-btn-press", cachedPress || pressOverlay || "var(--press-overlay)");
    themeDirty = false;
    return true;
  };

  /**
   * Detect layout shifts larger than one CSS pixel without scheduling needless geometry writes.
   * @returns Whether the host anchor changed or moved by more than one CSS pixel.
   */
  const needsMenuSync = () => {
    const menuButton = getTopbarMenuButton();
    if (!menuButton) {
      return lastMenuRect !== null;
    }
    const rect = menuButton.getBoundingClientRect();
    if (!lastMenuRect) {
      return true;
    }
    return (
      Math.abs(rect.left - lastMenuRect.left) > 1 ||
      Math.abs(rect.top - lastMenuRect.top) > 1 ||
      Math.abs(rect.width - lastMenuRect.width) > 1 ||
      Math.abs(rect.height - lastMenuRect.height) > 1
    );
  };
  /** Clear cached neutral colors after a host anchor or theme change. */
  const invalidateTheme = (themeChanged = false): void => {
    cachedIconColor = "";
    cachedBtnBg = "";
    cachedHover = "";
    cachedPress = "";
    if (themeChanged) themeDirty = true;
  };
  return { updatePosition: updateTopRightPosition, needsMenuSync, invalidateTheme };
}
