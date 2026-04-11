const { getTopbarMenuButton } = require("../../dom/topbar-controls");
const { attachTooltip } = require("../../dom/tooltip");

const pageDimmedAtt = "data-cmf-page-dimmed";

function getVisibleRect(element) {
  if (!element || typeof element.getBoundingClientRect !== "function") {
    return null;
  }

  const rect = element.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  return rect;
}

function parseRgbColor(color) {
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
    r: parseFloat(match[1]),
    g: parseFloat(match[2]),
    b: parseFloat(match[3]),
    a: Number.isNaN(alpha) ? 1 : alpha,
  };
}

function isModalScrimColor(color) {
  const parsed = parseRgbColor(color);
  if (!parsed) {
    return false;
  }

  const maxChannel = Math.max(parsed.r, parsed.g, parsed.b);
  const minChannel = Math.min(parsed.r, parsed.g, parsed.b);
  return parsed.a >= 0.2 && (maxChannel <= 120 || minChannel >= 180);
}

function isVisibleElement(element) {
  const rect = getVisibleRect(element);
  if (!rect) {
    return false;
  }

  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
}

function hasVisibleDialog() {
  return Array.from(document.querySelectorAll('[role="dialog"], [aria-modal="true"]')).some(
    isVisibleElement
  );
}

function isFullViewportDimmer(element) {
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

function isFacebookPageDimmed() {
  if (!document.body || !hasVisibleDialog()) {
    return false;
  }

  return Array.from(document.body.querySelectorAll("*")).some(isFullViewportDimmer);
}

function destroyToggleButton(state) {
  if (!state) {
    return;
  }

  if (typeof state.destroyToggleButton === "function") {
    const teardown = state.destroyToggleButton;
    state.destroyToggleButton = null;
    teardown();
    return;
  }

  if (state.btnToggleEl && state.btnToggleEl.parentNode) {
    state.btnToggleEl.parentNode.removeChild(state.btnToggleEl);
  }
  state.btnToggleEl = null;
  state.syncToggleButtonTheme = null;
}

function createToggleButton(state, keyWords, onToggle) {
  if (!state || !keyWords || typeof onToggle !== "function") {
    return null;
  }

  if (!document.body) {
    return null;
  }

  destroyToggleButton(state);

  const btnLocation =
    state.options && state.options.CMF_BTN_OPTION ? state.options.CMF_BTN_OPTION.toString() : "0";
  const useTopRight = btnLocation === "1";
  const btn = document.createElement(useTopRight ? "div" : "button");
  const cleanupFns = [];
  const addCleanup = (cleanup) => {
    if (typeof cleanup === "function") {
      cleanupFns.push(cleanup);
    }
  };
  btn.innerHTML = state.iconToggleHTML;
  btn.id = "fbcmfToggle";
  btn.removeAttribute("title");
  btn.className = "fb-cmf-toggle fb-cmf-icon";
  if (useTopRight) {
    btn.classList.add("fb-cmf-toggle-topbar");
  }
  const toggleHandler = (event) => {
    if (btn.getAttribute(pageDimmedAtt) === "true") {
      if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      if (event && typeof event.stopPropagation === "function") {
        event.stopPropagation();
      }
      return;
    }
    onToggle();
  };
  if (useTopRight) {
    btn.setAttribute("role", "button");
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-label", keyWords.DLG_TITLE);
    const onKeyDown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleHandler();
      }
    };
    btn.addEventListener("keydown", onKeyDown);
    addCleanup(() => btn.removeEventListener("keydown", onKeyDown));
  }
  btn.addEventListener("click", toggleHandler, false);
  addCleanup(() => btn.removeEventListener("click", toggleHandler, false));
  const tooltipPlacement = btnLocation === "0" ? "right" : "auto";
  addCleanup(attachTooltip(btn, keyWords.DLG_TITLE, { placement: tooltipPlacement }));
  let cachedIconColor = "";
  let cachedBtnBg = "";
  let cachedHover = "";
  let cachedPress = "";
  let lastMenuRect = null;
  let observedMenuButton = null;
  let updateScheduled = false;
  let pageDimmedUpdateScheduled = false;
  let themeDirty = false;
  let resizeObserver = null;
  const hexToRgba = (value, alpha) => {
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
  const isUsableColor = (value) => {
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
    const icon = btn.querySelector("svg, .cmf-icon");
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
  const scheduleUpdate = () => {
    if (updateScheduled) {
      return;
    }
    updateScheduled = true;
    const runUpdate = () => {
      updateScheduled = false;
      updateTopRightPosition();
    };
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(runUpdate);
    } else {
      setTimeout(runUpdate, 0);
    }
  };
  const getMenuButton = () => getTopbarMenuButton();
  const observeMenuButton = () => {
    const menuButton = getMenuButton();
    if (menuButton === observedMenuButton) {
      return;
    }
    if (resizeObserver && observedMenuButton) {
      resizeObserver.unobserve(observedMenuButton);
    }
    observedMenuButton = menuButton;
    if (resizeObserver && observedMenuButton) {
      resizeObserver.observe(observedMenuButton);
    }
    cachedIconColor = "";
    cachedBtnBg = "";
    cachedHover = "";
    cachedPress = "";
    scheduleUpdate();
  };
  const needsMenuSync = () => {
    const menuButton = getMenuButton();
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
  const syncPageDimmedState = () => {
    if (isFacebookPageDimmed()) {
      btn.setAttribute(pageDimmedAtt, "true");
    } else {
      btn.removeAttribute(pageDimmedAtt);
    }
  };
  const schedulePageDimmedStateSync = () => {
    if (pageDimmedUpdateScheduled) {
      return;
    }
    pageDimmedUpdateScheduled = true;
    const runUpdate = () => {
      pageDimmedUpdateScheduled = false;
      if (btn.isConnected) {
        syncPageDimmedState();
      }
    };
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(runUpdate);
    } else {
      setTimeout(runUpdate, 0);
    }
  };
  if (useTopRight) {
    if (!btn.isConnected) {
      document.body.appendChild(btn);
    }
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        scheduleUpdate();
      });
      addCleanup(() => resizeObserver.disconnect());
    }
    observeMenuButton();
    const banner = document.querySelector('[role="banner"]');
    if (banner && typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver(() => {
        observeMenuButton();
        scheduleUpdate();
      });
      observer.observe(banner, { childList: true, subtree: true });
      addCleanup(() => observer.disconnect());
    }
    if (typeof window !== "undefined") {
      window.addEventListener("resize", scheduleUpdate);
      addCleanup(() => window.removeEventListener("resize", scheduleUpdate));
      const intervalId = setInterval(() => {
        if (needsMenuSync()) {
          scheduleUpdate();
        }
      }, 2000);
      addCleanup(() => clearInterval(intervalId));
    }
    if (typeof MutationObserver !== "undefined") {
      const stateObserver = new MutationObserver(() => {
        if (btn.getAttribute("data-cmf-open") === "true") {
          btn.style.color = "";
        }
        scheduleUpdate();
      });
      stateObserver.observe(btn, { attributes: true, attributeFilter: ["data-cmf-open"] });
      addCleanup(() => stateObserver.disconnect());
    }
  } else {
    document.body.appendChild(btn);
  }
  if (typeof MutationObserver !== "undefined") {
    const pageDimmedObserver = new MutationObserver(() => {
      schedulePageDimmedStateSync();
    });
    pageDimmedObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["aria-hidden", "aria-modal", "class", "hidden", "role", "style"],
      childList: true,
      subtree: true,
    });
    addCleanup(() => pageDimmedObserver.disconnect());
  }
  syncPageDimmedState();
  state.btnToggleEl = btn;
  if (state.isAF) {
    btn.setAttribute(state.showAtt, "");
  }
  if (useTopRight) {
    const dialog = document.getElementById("fbcmf");
    if (dialog && dialog.hasAttribute(state.showAtt)) {
      btn.setAttribute("data-cmf-open", "true");
    }
  }
  const syncToggleButtonTheme = () => {
    cachedIconColor = "";
    cachedBtnBg = "";
    cachedHover = "";
    cachedPress = "";
    themeDirty = true;
    scheduleUpdate();
    setTimeout(scheduleUpdate, 250);
  };
  state.destroyToggleButton = () => {
    cleanupFns.splice(0).forEach((cleanup) => cleanup());
    if (btn.parentNode) {
      btn.parentNode.removeChild(btn);
    }
    if (state.btnToggleEl === btn) {
      state.btnToggleEl = null;
    }
    if (state.syncToggleButtonTheme === syncToggleButtonTheme) {
      state.syncToggleButtonTheme = null;
    }
  };
  state.syncToggleButtonTheme = syncToggleButtonTheme;
  return btn;
}

module.exports = {
  createToggleButton,
  destroyToggleButton,
  isFacebookPageDimmed,
  pageDimmedAtt,
};
