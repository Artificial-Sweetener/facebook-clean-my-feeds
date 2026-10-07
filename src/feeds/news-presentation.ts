// SPDX-License-Identifier: GPL-3.0-only

/** The two news features that own reversible inline layout changes independently. */
type NewsFeature = "badge" | "sidebar";

/** Retain native CSS values per declaration so later page edits to other properties survive restoration. */
interface NativeStyle {
  original: string;
  priority: string;
  applied: string;
}

/** Retain only declarations and the marker this feature actually changed on a single node. */
interface NewsPresentation {
  styles: Map<string, NativeStyle>;
  marker: string;
  originalMarker: string | null;
  originalStyle: string | null;
  appliedCssText: string;
  unchangedBaseline: boolean;
}

const presentations: Record<NewsFeature, Map<HTMLElement | SVGElement, NewsPresentation>> = {
  badge: new Map(),
  sidebar: new Map(),
};

/** Read longhand priority even when CSSOM stores the declaration as a margin/padding shorthand. */
function inlinePriority(style: CSSStyleDeclaration, name: string): string {
  const shorthand = /^(margin|padding)-/.exec(name)?.[1];
  return style.getPropertyPriority(name) || (shorthand ? style.getPropertyPriority(shorthand) : "");
}

/** Restore spacing as one declaration family because CSSOM may serialize four owned longhands into one shorthand. */
function restoreSpacing(
  element: HTMLElement | SVGElement,
  change: NewsPresentation,
  prefix: "margin" | "padding"
): void {
  const declarations = ["top", "right", "bottom", "left"].map((side) => {
    const name = `${prefix}-${side}`;
    const owned = change.styles.get(name);
    const value = element.style.getPropertyValue(name);
    const priority = inlinePriority(element.style, name);
    const unchanged = owned && value === owned.applied && priority === "";
    return {
      name,
      value: unchanged ? owned.original : value,
      priority: unchanged ? owned.priority : priority,
    };
  });
  element.style.removeProperty(prefix);
  for (const { name } of declarations) element.style.removeProperty(name);
  for (const { name, value, priority } of declarations)
    if (value !== "") element.style.setProperty(name, value, priority);
}

/** Restore unchanged owned declarations while preserving native modifications and exact original formatting when possible. */
function restoreElement(element: HTMLElement | SVGElement, change: NewsPresentation): void {
  if (change.unchangedBaseline && element.style.cssText === change.appliedCssText) {
    if (change.originalStyle === null) element.removeAttribute("style");
    else element.setAttribute("style", change.originalStyle);
  } else {
    for (const [name, style] of change.styles) {
      if (/^(margin|padding)-/.test(name)) continue;
      if (
        element.style.getPropertyValue(name) !== style.applied ||
        element.style.getPropertyPriority(name) !== ""
      )
        continue;
      if (style.original === "") element.style.removeProperty(name);
      else element.style.setProperty(name, style.original, style.priority);
    }
    restoreSpacing(element, change, "margin");
    restoreSpacing(element, change, "padding");
  }
  if (element.getAttribute(change.marker) !== "") return;
  if (change.originalMarker === null) element.removeAttribute(change.marker);
  else element.setAttribute(change.marker, change.originalMarker);
}

/** Release a feature's inline changes on option reset or lifecycle exit, including detached nodes. */
export function restoreNewsPresentation(feature?: NewsFeature): void {
  const features: readonly NewsFeature[] = feature ? [feature] : ["badge", "sidebar"];
  for (const name of features) {
    for (const [element, change] of presentations[name]) restoreElement(element, change);
    presentations[name].clear();
  }
}

/**
 * Reconcile exact feature targets without overwriting native baselines on repeated processing.
 * Removed or no-longer-matching nodes are restored and released; newer native edits become the next baseline.
 * @param feature Independent owner whose prior targets are reconciled.
 * @param targets Nodes and CSS longhand declarations to collapse; display becomes none and dimensions/spacing become zero.
 * @param marker Runtime attribute identifying this feature's changes for styling and diagnostics.
 */
export function reconcileNewsPresentation(
  feature: NewsFeature,
  targets: ReadonlyMap<Element, readonly string[]>,
  marker: string
): void {
  const owned = presentations[feature];
  for (const [element, change] of owned) {
    if (targets.has(element) && change.marker === marker) continue;
    restoreElement(element, change);
    owned.delete(element);
  }
  for (const [element, properties] of targets) {
    if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) continue;
    let change = owned.get(element);
    if (!change) {
      change = {
        styles: new Map(),
        marker,
        originalMarker: element.getAttribute(marker),
        originalStyle: element.getAttribute("style"),
        appliedCssText: "",
        unchangedBaseline: true,
      };
      owned.set(element, change);
    } else if (element.style.cssText !== change.appliedCssText) {
      change.unchangedBaseline = false;
    }
    if (element.getAttribute(marker) !== "") change.originalMarker = element.getAttribute(marker);
    const currentDeclarations = properties.map((name) => ({
      name,
      current: element.style.getPropertyValue(name),
      priority: inlinePriority(element.style, name),
    }));
    for (const { name, current, priority } of currentDeclarations) {
      const previous = change.styles.get(name);
      const value = name === "display" ? "none" : "0px";
      if (!previous || current !== previous.applied || priority !== "")
        change.styles.set(name, { original: current, priority, applied: value });
      if (current !== value || priority !== "") element.style.setProperty(name, value);
    }
    change.appliedCssText = element.style.cssText;
    if (element.getAttribute(marker) !== "") element.setAttribute(marker, "");
  }
}

/** Collapse spacing by longhand so shorthand expansion cannot erase an unrelated native side adjustment. */
export const newsCollapsedSpacing = [
  "display",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
] as const;
