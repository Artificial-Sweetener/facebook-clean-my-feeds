const { attachTooltip } = require("../../dom/tooltip");

function createToggleButton(state, keyWords, onToggle) {
  if (!state || !keyWords || typeof onToggle !== "function") {
    return null;
  }

  if (!document.body) {
    return null;
  }

  const btnLocation =
    state.options && state.options.CMF_BTN_OPTION ? state.options.CMF_BTN_OPTION.toString() : "0";
  const useTopRight = btnLocation === "1";
  const btn = document.createElement(useTopRight ? "div" : "button");
  btn.innerHTML = state.iconToggleHTML;
  btn.id = "fbcmfToggle";
  btn.removeAttribute("title");
  btn.className = "fb-cmf-toggle fb-cmf-icon";
  if (useTopRight) {
    btn.classList.add("fb-cmf-toggle-topbar");
  }
  let toggleHandler = onToggle;
  if (useTopRight) {
    toggleHandler = () => {
      onToggle();
    };
    btn.setAttribute("role", "button");
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-label", keyWords.DLG_TITLE);
    btn.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleHandler();
      }
    });
  }
  btn.addEventListener("click", toggleHandler, false);
  const tooltipPlacement = btnLocation === "0" ? "right" : "auto";
  attachTooltip(btn, keyWords.DLG_TITLE, { placement: tooltipPlacement });
  let cachedIconColor = "";
  let cachedBtnBg = "";
  let cachedHover = "";
  let cachedPress = "";
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
  const updateTopRightPosition = () => {
    const menuButton = document.querySelector('[role="banner"] [aria-label="Menu"]');
    if (!menuButton) {
      btn.style.position = "fixed";
      btn.style.top = "0.5rem";
      btn.style.right = "0.5rem";
      btn.style.left = "auto";
      btn.style.zIndex = "999";
      return false;
    }

    const rect = menuButton.getBoundingClientRect();
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
    const iconColor = iconStyle && iconStyle.color ? iconStyle.color : "";
    const resolvedIconColor =
      iconColor && iconColor !== "rgba(0, 0, 0, 0)" ? iconColor : "var(--secondary-icon)";
    if (!isMenuExpanded || !cachedIconColor) {
      cachedIconColor = resolvedIconColor;
    }
    btn.style.setProperty("--cmf-icon-color", cachedIconColor || resolvedIconColor);
    const activeBg = hexToRgba(primaryButtonBg, 0.2);
    if (activeBg) {
      btn.style.setProperty("--cmf-active-bg", activeBg);
    }
    if (accent) {
      btn.style.setProperty("--cmf-active-icon", accent);
    }
    btn.style.color = "";
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
    if (!isMenuExpanded || !cachedBtnBg) {
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

    if (!isMenuExpanded || !cachedHover) {
      cachedHover = hoverOverlay || "var(--hover-overlay)";
    }
    if (!isMenuExpanded || !cachedPress) {
      cachedPress = pressOverlay || "var(--press-overlay)";
    }
    btn.style.setProperty("--cmf-btn-hover", cachedHover || hoverOverlay || "var(--hover-overlay)");
    btn.style.setProperty("--cmf-btn-press", cachedPress || pressOverlay || "var(--press-overlay)");
    return true;
  };
  if (useTopRight) {
    if (!btn.isConnected) {
      document.body.appendChild(btn);
    }
    updateTopRightPosition();
    const banner = document.querySelector('[role="banner"]');
    if (banner && typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver(() => {
        updateTopRightPosition();
      });
      observer.observe(banner, { childList: true, subtree: true });
    }
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateTopRightPosition);
      const interval = setInterval(() => {
        updateTopRightPosition();
      }, 1000);
      setTimeout(() => clearInterval(interval), 15000);
    }
  } else {
    document.body.appendChild(btn);
  }
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
  return btn;
}

module.exports = {
  createToggleButton,
};
