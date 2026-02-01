const { generateRandomString } = require("../utils/random");

function positionTooltip(target, tooltip, placement = "auto") {
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

function attachTooltip(target, text, options = {}) {
  if (!target || !text) {
    return () => {};
  }

  let tooltip = null;
  let showTimer = null;
  const placement = options && options.placement ? options.placement : "auto";
  const tooltipId = target.dataset.cmfTooltipId || `fbcmf-tooltip-${generateRandomString(8)}`;
  target.dataset.cmfTooltipId = tooltipId;
  target.setAttribute("aria-describedby", tooltipId);

  const updatePosition = () => {
    if (!tooltip) {
      return;
    }
    positionTooltip(target, tooltip, placement);
  };

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

  const onEnter = () => {
    if (showTimer) {
      clearTimeout(showTimer);
    }
    showTimer = setTimeout(show, 400);
  };

  const onLeave = () => {
    hide();
  };

  target.addEventListener("pointerenter", onEnter);
  target.addEventListener("pointerleave", onLeave);
  target.addEventListener("focus", onEnter);
  target.addEventListener("blur", onLeave);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
  }

  return () => {
    hide();
    target.removeEventListener("pointerenter", onEnter);
    target.removeEventListener("pointerleave", onLeave);
    target.removeEventListener("focus", onEnter);
    target.removeEventListener("blur", onLeave);
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    }
  };
}

module.exports = {
  attachTooltip,
};
