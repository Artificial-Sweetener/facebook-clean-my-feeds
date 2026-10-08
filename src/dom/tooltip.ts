// SPDX-License-Identifier: GPL-3.0-only
/** Tooltips support automatic vertical placement or an explicitly requested horizontal placement. */
export interface TooltipOptions {
  placement?: "auto" | "right";
}
import { generateRandomString } from "../utils/random";

/**
 * Place the tooltip within the viewport, flipping sides when its preferred edge overflows.
 * @param target Control whose current bounding rectangle anchors the tooltip.
 * @param tooltip Mounted tooltip whose measured dimensions constrain placement.
 * @param placement Automatic below/above placement or preferred right/left placement.
 */
export function positionTooltip(
  target: HTMLElement | null,
  tooltip: HTMLElement | null,
  placement: "auto" | "right" = "auto"
): void {
  if (!target || !tooltip || typeof target.getBoundingClientRect !== "function") {
    return;
  }
  if (typeof window === "undefined") {
    return;
  }

  const rect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const gap = 8;
  const edgePadding = 8;

  let top = rect.bottom + gap;
  let left = rect.left + rect.width / 2 - tooltipRect.width / 2;

  if (placement === "right") {
    top = rect.top + rect.height / 2 - tooltipRect.height / 2;
    left = rect.right + gap;
    if (left + tooltipRect.width + edgePadding > window.innerWidth) {
      left = rect.left - tooltipRect.width - gap;
    }
    top = Math.max(
      edgePadding,
      Math.min(top, window.innerHeight - tooltipRect.height - edgePadding)
    );
  } else {
    if (top + tooltipRect.height + edgePadding > window.innerHeight) {
      top = rect.top - tooltipRect.height - gap;
    }
  }

  left = Math.max(edgePadding, Math.min(left, window.innerWidth - tooltipRect.width - edgePadding));

  tooltip.style.top = `${Math.round(top)}px`;
  tooltip.style.left = `${Math.round(left)}px`;
}

/**
 * Own a delayed tooltip and every associated listener so removed controls can clean up completely.
 * @param target Interactive control, optionally absent during page initialization.
 * @param text Plain translated text; never interpreted as markup.
 * @param options Preferred placement; viewport constraints always take priority.
 * @returns Idempotent cleanup that hides the tooltip and unregisters listeners.
 */
export function attachTooltip(
  target: HTMLElement | null,
  text: string,
  options: TooltipOptions = {}
): () => void {
  if (!target || !text) {
    return () => {};
  }

  let tooltip: HTMLDivElement | null = null;
  let showTimer: ReturnType<typeof setTimeout> | null = null;
  const placement = options && options.placement ? options.placement : "auto";
  const tooltipId = target.dataset.cmfTooltipId || `fbcmf-tooltip-${generateRandomString(8)}`;
  target.dataset.cmfTooltipId = tooltipId;
  target.setAttribute("aria-describedby", tooltipId);

  /** Re-measure the anchor after scrolling or viewport resizing. */
  const updatePosition = () => {
    if (!tooltip) {
      return;
    }
    positionTooltip(target, tooltip, placement);
  };

  /** Create one tooltip only while its control remains connected to the page. */
  const show = () => {
    if (tooltip || !document.body || !target.isConnected) {
      return;
    }
    tooltip = document.createElement("div");
    tooltip.id = tooltipId;
    tooltip.className = "fb-cmf-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.textContent = text;
    tooltip.style.visibility = "hidden";
    document.body.appendChild(tooltip);
    updatePosition();
    tooltip.style.visibility = "visible";
  };

  /** Cancel delayed display before removing any currently visible tooltip. */
  const hide = () => {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  };

  /** Delay pointer hover feedback to avoid flashing during cursor transit. */
  const onEnter = () => {
    if (showTimer) {
      clearTimeout(showTimer);
    }
    showTimer = setTimeout(show, 400);
  };

  /** Hide immediately when the pointer leaves the owning control. */
  const onLeave = () => {
    hide();
  };

  target.addEventListener("pointerenter", onEnter);
  target.addEventListener("pointerleave", onLeave);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
  }

  return () => {
    hide();
    target.removeEventListener("pointerenter", onEnter);
    target.removeEventListener("pointerleave", onLeave);
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    }
  };
}
