// SPDX-License-Identifier: GPL-3.0-only

import type { DialogState } from "./types";
import type { Keywords } from "../../i18n";
import { getTopbarControlButtons, isTopbarControlButton } from "../../dom/topbar-controls";
import { createToggleButton } from "../controls/toggle-button";
import { UiLifecycle } from "../lifecycle";

/**
 * Remove dialog visibility and its active toggle marker without destroying mounted settings controls.
 * @param state Shared presentation state retained by mounted listeners.
 */
export function closeDialogIfOpen(state: DialogState | null) {
  const elDialog = document.getElementById("fbcmf");
  if (!elDialog || !state) {
    return;
  }
  if (elDialog.hasAttribute(state.showAtt)) {
    elDialog.removeAttribute(state.showAtt);
    if (state.btnToggleEl) {
      state.btnToggleEl.removeAttribute("data-cmf-open");
    }
  }
}

/**
 * Hide the redundant header close control when the topbar toggle supplies the close affordance.
 * @param state Shared presentation state retained by mounted listeners.
 * @returns Whether the selected placement requires a separate header close button.
 */
export function shouldShowHeaderClose(state: DialogState | null) {
  const btnLocation =
    state && state.options && state.options.CMF_BTN_OPTION
      ? state.options.CMF_BTN_OPTION.toString()
      : "0";
  return btnLocation !== "1";
}

/**
 * Apply the selected toggle placement to the mounted header’s close affordance.
 * @param dialog Mounted settings root, or null when it is not available.
 * @param state Shared presentation state retained by mounted listeners.
 */
export function updateHeaderCloseVisibility(dialog: HTMLElement | null, state: DialogState | null) {
  if (!dialog || !state) {
    return;
  }
  const closeWrap = dialog.querySelector(".fb-cmf-close");
  if (!closeWrap) {
    return;
  }
  if (shouldShowHeaderClose(state)) {
    closeWrap.removeAttribute("hidden");
  } else {
    closeWrap.setAttribute("hidden", "");
  }
}

/**
 * Delegate host-control discovery to the shared DOM adapter so UI uses consistent menu anchors.
 * @returns The host controls identified by the shared topbar adapter.
 */
export function getTopbarMenuButtons() {
  return getTopbarControlButtons().filter(
    (button): button is HTMLElement => button instanceof HTMLElement
  );
}

/**
 * Resolve a descendant event target to its actionable host control before menu synchronization.
 * @param element Candidate DOM element from the host page.
 * @returns Whether the element or its closest actionable ancestor is a recognized host control.
 */
export function isTopbarMenuButton(element: Element | null) {
  if (!element || typeof element.closest !== "function") {
    return false;
  }
  const control = element.closest('button, [role="button"]');
  return control ? isTopbarControlButton(control) : false;
}

/**
 * Replace the toggle through its lifecycle owner and synchronize its initial active state.
 * @param state Shared presentation state retained by mounted listeners.
 * @param keyWords Resolved localized labels, including English fallbacks.
 * @returns The newly mounted toggle, or null when mounting is unavailable.
 */
export function mountToggleButton(state: DialogState, keyWords: Keywords) {
  if (!state || !keyWords) {
    return null;
  }
  const button = createToggleButton(state, keyWords, () => toggleDialog(state));
  syncToggleButtonOpenState(state);
  return button;
}

/**
 * Close expanded host controls before opening settings, optionally preserving the initiating control.
 * @param exceptButton Optional host control that should remain expanded.
 */
export function closeFacebookMenus(exceptButton?: Element) {
  const buttons = getTopbarMenuButtons();
  buttons.forEach((button) => {
    if (button === exceptButton) {
      return;
    }
    if (button.getAttribute("aria-expanded") === "true") {
      button.click();
    }
  });
}

/**
 * Install one document-level pointer listener per state and honor shadow-DOM composed event paths.
 * @param state Shared presentation state retained by mounted listeners.
 */
export function setupOutsideClickClose(state: DialogState) {
  if (!state || state.cmfOutsideClickInit) {
    return;
  }
  const lifecycle = state.dialogLifecycle;
  if (!lifecycle?.active) return;
  state.cmfOutsideClickInit = true;
  lifecycle.add(() => {
    delete state.cmfOutsideClickInit;
  });

  /**
   * Check composed paths first, then containment, so shadow-root clicks do not close the dialog accidentally.
   * @param event Native activation/input event, when provided by the caller.
   * @param element Candidate DOM element from the host page.
   * @returns Whether the event traversed or targeted the candidate element.
   */
  const isEventInside = (event: Event, element: Element | null) => {
    if (!element) {
      return false;
    }
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    if (path.includes(element)) {
      return true;
    }
    const target = event.target instanceof Element ? event.target : null;
    return target ? element.contains(target) : false;
  };

  /**
   * Close open settings only when the activation occurred outside both dialog and toggle.
   * @param event Native activation/input event, when provided by the caller.
   */
  const onOutsideActivate = (event: Event) => {
    const dialog = document.getElementById("fbcmf");
    if (!dialog || !dialog.hasAttribute(state.showAtt)) {
      return;
    }
    if (isEventInside(event, dialog)) {
      return;
    }
    if (isEventInside(event, state.btnToggleEl)) {
      return;
    }
    closeDialogIfOpen(state);
  };

  lifecycle.listen(document, "pointerdown", onOutsideActivate, true);
}

/**
 * Watch host controls and delegated activation so opening Facebook menus consistently dismisses settings.
 * Per-button and per-banner owners are retired on replacement; the session retains only live controls.
 * @param state Shared presentation state retained by mounted listeners.
 */
export function setupTopbarMenuSync(state: DialogState) {
  if (!state || state.cmfTopbarSyncInit || state.cmfTopbarSyncPending) {
    return;
  }

  const lifecycle = state.dialogLifecycle;
  if (!lifecycle?.active) return;

  const buttonOwners = new Map<HTMLElement, UiLifecycle>();
  let bannerOwner: UiLifecycle | null = null;
  let observedBanner: Element | null = null;

  /** Reconcile per-control resources so replaced buttons are released before new controls are bound. */
  const bindButtons = () => {
    const buttons = new Set(getTopbarMenuButtons());
    for (const [button, owner] of buttonOwners) {
      if (button.isConnected && buttons.has(button)) continue;
      owner.dispose();
      buttonOwners.delete(button);
    }
    buttons.forEach((button) => {
      if (buttonOwners.has(button) || button.dataset.cmfMenuSync === "1") {
        return;
      }
      const owner = new UiLifecycle();
      buttonOwners.set(button, owner);
      button.dataset.cmfMenuSync = "1";
      owner.add(() => {
        delete button.dataset.cmfMenuSync;
      });
      owner.listen(button, "click", () => closeDialogIfOpen(state));
      if (typeof MutationObserver !== "undefined") {
        owner.observe(button, { attributes: true, attributeFilter: ["aria-expanded"] }, () => {
          if (button.getAttribute("aria-expanded") === "true") closeDialogIfOpen(state);
        });
      }
    });
  };

  const banner = getTopbarMenuButtons()[0]?.closest('[role="banner"]');
  if (!banner) {
    state.cmfTopbarSyncPending = true;
    lifecycle.defer(() => {
      delete state.cmfTopbarSyncPending;
      setupTopbarMenuSync(state);
    }, 200);
    return;
  }

  state.cmfTopbarSyncInit = true;
  lifecycle.add(() => {
    delete state.cmfTopbarSyncInit;
    delete state.cmfTopbarSyncPending;
  });
  lifecycle.add(() => {
    for (const owner of buttonOwners.values()) owner.dispose();
    buttonOwners.clear();
    bannerOwner?.dispose();
    bannerOwner = null;
    observedBanner = null;
  });

  /**
   * Transfer banner observation when SPA rendering replaces its root rather than only its buttons.
   * @returns Whether banner ownership changed, so unrelated document churn can skip geometry discovery.
   */
  const syncBanner = () => {
    const current = getTopbarMenuButtons()[0]?.closest('[role="banner"]') ?? null;
    if (current === observedBanner) return false;
    bannerOwner?.dispose();
    bannerOwner = null;
    observedBanner = current;
    if (!current) return true;
    bannerOwner = new UiLifecycle();
    bannerOwner.observe(
      current,
      {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["aria-expanded", "aria-label", "role", "tabindex"],
      },
      (mutations) => {
        bindButtons();
        mutations.forEach((mutation) => {
          const target = mutation.target instanceof Element ? mutation.target : null;
          if (
            target &&
            mutation.type === "attributes" &&
            mutation.attributeName === "aria-expanded" &&
            isTopbarMenuButton(target) &&
            target.getAttribute("aria-expanded") === "true"
          ) {
            closeDialogIfOpen(state);
          }
        });
      }
    );
    return true;
  };
  syncBanner();
  bindButtons();

  if (typeof MutationObserver !== "undefined") {
    lifecycle.observe(document, { childList: true, subtree: true }, (mutations) => {
      // A closed host window can deliver a queued record after its document global has gone away.
      if (typeof document === "undefined") return;
      const bannerChanged =
        !observedBanner?.isConnected ||
        mutations.some((mutation) =>
          [...mutation.addedNodes, ...mutation.removedNodes].some(
            (node) =>
              node instanceof Element &&
              (node.matches('[role="banner"]') || !!node.querySelector('[role="banner"]'))
          )
        );
      if (bannerChanged && syncBanner()) bindButtons();
      mutations.forEach((mutation) => {
        if (mutation.type !== "childList") {
          return;
        }
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) {
            return;
          }
          const dialog = node.matches('[role="dialog"][aria-label]')
            ? node
            : node.querySelector
              ? node.querySelector('[role="dialog"][aria-label]')
              : null;
          if (dialog && isTopbarMenuButton(dialog)) {
            closeDialogIfOpen(state);
          }
        });
      });
    });
  }

  /**
   * Inspect composed event paths before falling back to the nearest semantic control.
   * @param event Native activation/input event, when provided by the caller.
   * @returns The recognized topbar control found in the event path, or null.
   */
  const getMenuButtonFromEvent = (event: Event) => {
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    for (const entry of path) {
      if (entry instanceof Element && isTopbarMenuButton(entry)) {
        return entry;
      }
    }
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return null;
    }
    const closest = target.closest('button, [role="button"]');
    return closest && isTopbarMenuButton(closest) ? closest : null;
  };

  /**
   * Dismiss settings when pointer or keyboard activation targets a recognized host topbar control.
   * @param event Native activation/input event, when provided by the caller.
   */
  const onTopbarActivate = (event: Event) => {
    const topbarButton = getMenuButtonFromEvent(event);
    if (!topbarButton) {
      return;
    }
    closeDialogIfOpen(state);
  };

  lifecycle.listen(document, "pointerdown", onTopbarActivate, true);
  lifecycle.listen(document, "click", onTopbarActivate, true);
  lifecycle.listen(document, "keydown", (event) => {
    if (!(event instanceof KeyboardEvent) || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }
    onTopbarActivate(event);
  });
}

/**
 * Toggle the visibility marker, close competing host menus, and reapply the current settings search.
 * @param state Shared presentation state retained by mounted listeners.
 */
export function toggleDialog(state: DialogState | null) {
  const elDialog = document.getElementById("fbcmf");
  if (!elDialog || !state) {
    return;
  }

  if (elDialog.hasAttribute(state.showAtt)) {
    elDialog.removeAttribute(state.showAtt);
    if (state.btnToggleEl) {
      state.btnToggleEl.removeAttribute("data-cmf-open");
    }
  } else {
    setupTopbarMenuSync(state);
    closeFacebookMenus();
    elDialog.setAttribute(state.showAtt, "");
    if (state.btnToggleEl) {
      state.btnToggleEl.setAttribute("data-cmf-open", "true");
    }
    if (typeof state.syncDialogSearch === "function") {
      state.syncDialogSearch();
    }
  }
}

/**
 * Mirror dialog visibility onto the toggle without assuming either node is still mounted.
 * @param state Shared presentation state retained by mounted listeners.
 */
export function syncToggleButtonOpenState(state: DialogState | null) {
  const elDialog = document.getElementById("fbcmf");
  const toggleButton = state && state.btnToggleEl ? state.btnToggleEl : null;
  if (!elDialog || !toggleButton || !state) {
    return;
  }
  if (elDialog.hasAttribute(state.showAtt)) {
    toggleButton.setAttribute("data-cmf-open", "true");
  } else {
    toggleButton.removeAttribute("data-cmf-open");
  }
}
