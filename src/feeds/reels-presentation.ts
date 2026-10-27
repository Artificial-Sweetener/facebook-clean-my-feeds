// SPDX-License-Identifier: GPL-3.0-only

import type { Options } from "../core/options/types";
import { rvAtt } from "../dom/attributes";

/** Store exactly the native value replaced by CMF, plus the value CMF currently owns. */
interface OwnedAttribute {
  element: Element;
  name: string;
  original: string | null;
  applied: string | null;
}

/** Track one CSS property independently so unrelated native style edits cannot become owned state. */
interface OwnedStyle {
  element: HTMLElement | SVGElement;
  name: string;
  original: string;
  originalPriority: string;
  applied: string;
  originalAttribute: string | null;
  originalCssText: string;
}

/** Keep media listeners separate from controls so either preference can change independently. */
interface ReelPresentation {
  controls: Map<string, OwnedAttribute>;
  styles: Map<string, OwnedStyle>;
  looping: Map<string, OwnedAttribute>;
  marker: Map<string, OwnedAttribute>;
  ended: EventListener | null;
}

const presentations = new Map<HTMLVideoElement, ReelPresentation>();

/** Restore only unchanged CMF-owned values, preserving later page or user edits to the attribute. */
function restoreAttribute(change: OwnedAttribute): void {
  if (change.element.getAttribute(change.name) !== change.applied) return;
  if (change.original === null) change.element.removeAttribute(change.name);
  else change.element.setAttribute(change.name, change.original);
}

/** Restore a named group and release its references before a feature is disabled or replaced. */
function restoreChanges(changes: Map<string, OwnedAttribute>): void {
  for (const change of changes.values()) restoreAttribute(change);
  changes.clear();
}

/**
 * Reconcile one property without losing the original value or creating repeated mutations.
 * Replaced DOM targets are restored independently; later native changes become the new baseline.
 */
function applyAttribute(
  changes: Map<string, OwnedAttribute>,
  key: string,
  element: Element,
  name: string,
  value: string | null
): void {
  let change = changes.get(key);
  if (change && change.element !== element) {
    restoreAttribute(change);
    changes.delete(key);
    change = undefined;
  }
  const current = element.getAttribute(name);
  if (!change) {
    change = { element, name, original: current, applied: value };
    changes.set(key, change);
  } else {
    if (current !== change.applied) change.original = current;
    change.applied = value;
  }
  if (current === value) return;
  if (value === null) element.removeAttribute(name);
  else element.setAttribute(name, value);
}

/** Restore targets that disappeared while allowing late/replaced overlays to be reconciled next pass. */
function retainChanges(changes: Map<string, OwnedAttribute>, keys: ReadonlySet<string>): void {
  for (const [key, change] of changes) {
    if (keys.has(key)) continue;
    restoreAttribute(change);
    changes.delete(key);
  }
}

/**
 * Restore only the owned CSS property, preserving unrelated inline properties and later native edits.
 * Exact attribute formatting is recovered only when the resulting declarations still equal the original.
 */
function restoreStyle(change: OwnedStyle): void {
  const style = change.element.style;
  if (
    style.getPropertyValue(change.name) !== change.applied ||
    style.getPropertyPriority(change.name) !== ""
  )
    return;
  if (change.original === "") style.removeProperty(change.name);
  else style.setProperty(change.name, change.original, change.originalPriority);
  if (style.cssText !== change.originalCssText) return;
  if (change.originalAttribute === null) change.element.removeAttribute("style");
  else change.element.setAttribute("style", change.originalAttribute);
}

/** Restore each independently owned CSS property before releasing an obsolete presentation. */
function restoreStyles(styles: Map<string, OwnedStyle>): void {
  for (const change of styles.values()) restoreStyle(change);
  styles.clear();
}

/**
 * Reconcile one CSS declaration without recording CMF values as part of another property's baseline.
 * @param styles Previously owned declarations, indexed by their role in the Reels presentation.
 * @param key Stable role identifying the video overlay or description target.
 * @param element Current target; unsupported element types are left untouched.
 * @param name CSS property owned by this feature, rather than the entire style attribute.
 * @param value Active CMF value; the original value and priority remain available for restoration.
 */
function applyStyle(
  styles: Map<string, OwnedStyle>,
  key: string,
  element: Element,
  name: string,
  value: string
): void {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) return;
  let change = styles.get(key);
  if (change && change.element !== element) {
    restoreStyle(change);
    styles.delete(key);
    change = undefined;
  }
  const current = element.style.getPropertyValue(name);
  const priority = element.style.getPropertyPriority(name);
  if (!change) {
    change = {
      element,
      name,
      original: current,
      originalPriority: priority,
      applied: value,
      originalAttribute: element.getAttribute("style"),
      originalCssText: element.style.cssText,
    };
    styles.set(key, change);
  } else {
    if (current !== change.applied || priority !== "") {
      change.original = current;
      change.originalPriority = priority;
      change.originalAttribute = element.getAttribute("style");
      change.originalCssText = element.style.cssText;
    }
    change.applied = value;
  }
  if (current === value && priority === "") return;
  element.style.setProperty(name, value);
  if (element.style.length === 1) element.setAttribute("style", `${name}:${value};`);
}

/** Restore individual CSS properties when their overlay disappears or controls are disabled. */
function retainStyles(styles: Map<string, OwnedStyle>, keys: ReadonlySet<string>): void {
  for (const [key, change] of styles) {
    if (keys.has(key)) continue;
    restoreStyle(change);
    styles.delete(key);
  }
}

/**
 * Reconcile native controls and their two companion overlays using currently available structure.
 * Missing descriptions remain retryable; unrelated overlays outside the video holder are untouched.
 * @param video Playback element whose current holder determines its overlays.
 * @param presentation Retained native values, updated only for attributes owned by the controls feature.
 * @param enabled Whether to reconcile controls or restore their previous native presentation.
 * @param isChromium Chooses the legacy control-bar clearance in rem units.
 */
function reconcileControls(
  video: HTMLVideoElement,
  presentation: ReelPresentation,
  enabled: boolean,
  isChromium: boolean
): void {
  const descriptionOverlay = video.closest("[data-video-id]")?.parentElement?.nextElementSibling;
  const active = new Set<string>();
  if (enabled && descriptionOverlay) {
    active.add("controls");
    applyAttribute(presentation.controls, "controls", video, "controls", "true");
    const description = descriptionOverlay.children[0];
    if (description) {
      active.add("description");
      applyStyle(
        presentation.styles,
        "description",
        description,
        "margin-bottom",
        `${isChromium ? "4.5" : "2.25"}rem`
      );
    }
    const overlay = video.nextElementSibling;
    if (overlay) {
      active.add("overlay");
      applyStyle(presentation.styles, "overlay", overlay, "display", "none");
    }
  }
  retainChanges(presentation.controls, active);
  retainStyles(presentation.styles, active);
}

/**
 * Apply current preferences to an existing or newly discovered video without duplicating listeners.
 * @param video Active Reels playback element whose native state is retained until CMF releases it.
 * @param options Independent controls and looping preferences, re-read on every polling pass.
 * @param isChromium Chooses the control-bar clearance for the description overlay.
 */
export function reconcileReelPresentation(
  video: HTMLVideoElement,
  options: Pick<Options, "REELS_CONTROLS" | "REELS_DISABLE_LOOPING">,
  isChromium: boolean
): void {
  let presentation = presentations.get(video);
  if (!presentation) {
    presentation = {
      controls: new Map(),
      styles: new Map(),
      looping: new Map(),
      marker: new Map(),
      ended: null,
    };
    presentations.set(video, presentation);
  }
  reconcileControls(video, presentation, options.REELS_CONTROLS === true, isChromium);
  if (options.REELS_DISABLE_LOOPING === true) {
    applyAttribute(presentation.looping, "loop", video, "loop", null);
    if (!presentation.ended) {
      presentation.ended = () => video.pause();
      video.addEventListener("ended", presentation.ended);
    }
  } else {
    if (presentation.ended) video.removeEventListener("ended", presentation.ended);
    presentation.ended = null;
    restoreChanges(presentation.looping);
  }
  applyAttribute(presentation.marker, "marker", video, rvAtt, "1");
}

/** Release one retired video without retaining detached elements or callbacks. */
function restoreVideo(video: HTMLVideoElement, presentation: ReelPresentation): void {
  if (presentation.ended) video.removeEventListener("ended", presentation.ended);
  restoreChanges(presentation.controls);
  restoreStyles(presentation.styles);
  restoreChanges(presentation.looping);
  restoreChanges(presentation.marker);
  presentations.delete(video);
}

/** Stop owning videos removed from the active Reels layout while retaining still-visible records. */
export function pruneReelPresentations(active: ReadonlySet<HTMLVideoElement>): void {
  for (const [video, presentation] of presentations) {
    if (!active.has(video)) restoreVideo(video, presentation);
  }
}

/** Restore native media properties, inline styles and callbacks on settings reset or lifecycle exit. */
export function restoreReelsPresentation(): void {
  for (const [video, presentation] of presentations) restoreVideo(video, presentation);
}
