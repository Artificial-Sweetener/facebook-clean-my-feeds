// SPDX-License-Identifier: GPL-3.0-only

import { UiLifecycle } from "../lifecycle";
import { getTopbarMenuButton } from "../../dom/topbar-controls";
import { attachTooltip } from "../../dom/tooltip";
import { createTopbarPositioning } from "./toggle-position";
import { isFacebookPageDimmed } from "./modal-scrim";
import type { ToggleState } from "../dialog/types";
import type { Keywords } from "../../i18n";
export { isFacebookPageDimmed } from "./modal-scrim";
export const pageDimmedAtt = "data-cmf-page-dimmed";

/**
 * Release observers, timers, listeners, and DOM references before replacing or removing the toggle.
 * @param state Shared presentation state retained by mounted listeners.
 * @returns Completes after releasing owned lifecycle resources.
 */
export function destroyToggleButton(state: ToggleState | null) {
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

/**
 * Mount a floating or topbar toggle, mirror host theme/geometry, and register complete lifecycle cleanup.
 * @param state Shared presentation state retained by mounted listeners.
 * @param keyWords Resolved localized labels, including English fallbacks.
 * @param onToggle Application callback invoked only for unblocked activation.
 * @returns The mounted toggle, or null when required state or document body is unavailable.
 */
export function createToggleButton(
  state: ToggleState | null,
  keyWords: Pick<Keywords, "DLG_TITLE"> | null,
  onToggle: (() => void) | null
) {
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
  const lifecycle = new UiLifecycle();
  /** A host window may close after queuing observer delivery but before its callbacks run. */
  const hasLiveDocument = () => typeof document !== "undefined" && !!document.body;
  /**
   * Collect teardown operations so replacing the control cannot leave active observers or listeners.
   * @param cleanup Lifecycle teardown operation to run exactly once on removal.
   */
  const addCleanup = (cleanup: (() => void) | undefined) => {
    lifecycle.add(cleanup);
  };
  btn.innerHTML = state.iconToggleHTML;
  btn.id = "fbcmfToggle";
  btn.removeAttribute("title");
  btn.className = "fb-cmf-toggle fb-cmf-icon";
  btn.setAttribute("aria-label", keyWords.DLG_TITLE);
  if (useTopRight) {
    btn.classList.add("fb-cmf-toggle-topbar");
  }
  /**
   * Suppress activation while Facebook is dimmed; otherwise dispatch the injected settings toggle intent.
   * @param event Native activation/input event, when provided by the caller.
   */
  const toggleHandler = (event?: Event) => {
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
    /**
     * Support Enter and Space for the topbar div’s button semantics without scrolling the page.
     * @param event Native activation/input event, when provided by the caller.
     */
    const onKeyDown = (event: Event) => {
      if (!(event instanceof KeyboardEvent)) return;
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
  const positioning = createTopbarPositioning(btn);
  let observedMenuButton: Element | null = null;
  let updateScheduled = false;
  let pageDimmedUpdateScheduled = false;
  let resizeObserver: ResizeObserver | null = null;
  /**
   * Coalesce geometry/theme work into one animation frame, with a timer fallback for limited hosts.
   */
  const scheduleUpdate = () => {
    if (!lifecycle.active || !hasLiveDocument() || updateScheduled) {
      return;
    }
    updateScheduled = true;
    /**
     * Release the coalescing flag before recomputing the control’s current position or modal state.
     */
    const runUpdate = () => {
      updateScheduled = false;
      if (hasLiveDocument()) positioning.updatePosition();
    };
    lifecycle.frame(runUpdate);
  };
  /**
   * Resolve the current host anchor because Facebook may replace header nodes during navigation.
   * @returns The current host anchor, or null while the header is unavailable.
   */
  const getMenuButton = () => getTopbarMenuButton();
  /**
   * Move the resize observer to a replaced host anchor and invalidate its cached theme colors.
   */
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
    positioning.invalidateTheme();
    scheduleUpdate();
  };
  /**
   * Reflect Facebook modal blocking in the toggle’s data attribute for pointer and keyboard guards.
   */
  const syncPageDimmedState = () => {
    if (isFacebookPageDimmed()) {
      btn.setAttribute(pageDimmedAtt, "true");
    } else {
      btn.removeAttribute(pageDimmedAtt);
    }
  };
  /**
   * Coalesce broad body mutations and avoid touching a detached toggle after teardown.
   */
  const schedulePageDimmedStateSync = () => {
    if (!lifecycle.active || !hasLiveDocument() || pageDimmedUpdateScheduled) {
      return;
    }
    pageDimmedUpdateScheduled = true;
    /**
     * Release the coalescing flag before recomputing the control’s current position or modal state.
     */
    const runUpdate = () => {
      pageDimmedUpdateScheduled = false;
      if (hasLiveDocument() && btn.isConnected) {
        syncPageDimmedState();
      }
    };
    lifecycle.frame(runUpdate);
  };
  /** Recover only this live generation after host DOM replacement, never a disabled or superseded toggle. */
  const restoreOwnedToggle = () => {
    if (
      lifecycle.active &&
      hasLiveDocument() &&
      btnLocation !== "2" &&
      state.btnToggleEl === btn &&
      state.isAF &&
      !btn.isConnected &&
      document.body &&
      !document.getElementById(btn.id)
    ) {
      document.body.appendChild(btn);
      if (useTopRight) scheduleUpdate();
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
      addCleanup(() => resizeObserver?.disconnect());
    }
    observeMenuButton();
    // The header can arrive late or be replaced outside its original subtree.
    scheduleUpdate();
    if (typeof MutationObserver !== "undefined") {
      lifecycle.observe(
        document.documentElement,
        { attributes: true, attributeFilter: ["class", "style"] },
        () => {
          positioning.invalidateTheme(true);
          scheduleUpdate();
        }
      );
    }
    if (typeof window !== "undefined") {
      window.addEventListener("resize", scheduleUpdate);
      addCleanup(() => window.removeEventListener("resize", scheduleUpdate));
      const intervalId = setInterval(() => {
        if (!hasLiveDocument()) return;
        restoreOwnedToggle();
        observeMenuButton();
        if (positioning.needsMenuSync()) {
          scheduleUpdate();
        }
      }, 2000);
      addCleanup(() => clearInterval(intervalId));
    }
    if (typeof MutationObserver !== "undefined") {
      lifecycle.observe(btn, { attributes: true, attributeFilter: ["data-cmf-open"] }, () => {
        if (btn.getAttribute("data-cmf-open") === "true") {
          btn.style.color = "";
        }
        scheduleUpdate();
      });
    }
  } else {
    document.body.appendChild(btn);
  }
  if (typeof MutationObserver !== "undefined") {
    lifecycle.observe(
      document.body,
      {
        attributes: true,
        attributeFilter: ["aria-hidden", "aria-modal", "class", "hidden", "role", "style"],
        childList: true,
        subtree: true,
      },
      (records) => {
        if (!hasLiveDocument()) return;
        schedulePageDimmedStateSync();
        restoreOwnedToggle();
        if (!useTopRight) return;
        const hostChanged = records.some(({ target, type, addedNodes, removedNodes }) => {
          if (!(target instanceof Element) || target === btn || btn.contains(target)) return false;
          if (target.closest('[role="banner"]')) return true;
          if (
            type === "attributes" &&
            (!observedMenuButton || target.contains(observedMenuButton))
          ) {
            positioning.invalidateTheme(true);
            return true;
          }
          return [...addedNodes, ...removedNodes].some(
            (node) =>
              node instanceof Element &&
              (node.matches('[role="banner"]') || !!node.querySelector('[role="banner"]'))
          );
        });
        if (hostChanged) {
          observeMenuButton();
          scheduleUpdate();
        }
      }
    );
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
  /**
   * Invalidate cached host colors and schedule immediate plus delayed refresh for asynchronous theme changes.
   */
  const syncToggleButtonTheme = () => {
    if (!lifecycle.active) return;
    positioning.invalidateTheme(true);
    scheduleUpdate();
    lifecycle.defer(scheduleUpdate, 250);
  };
  state.destroyToggleButton = () => {
    lifecycle.dispose();
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
