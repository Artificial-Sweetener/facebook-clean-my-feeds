// SPDX-License-Identifier: GPL-3.0-only
import type { StyleState, VisibilityState } from "../types";

/** The style generator consumes marker names and mount state, without UI object references. */
export type StyleContext = Pick<StyleState, "cssID" | "tempStyleSheetCode"> &
  Pick<
    VisibilityState,
    | "hideAtt"
    | "showAtt"
    | "hideWithNoCaptionAtt"
    | "cssHideNumberOfShares"
    | "cssHideVerifiedBadge"
  > & { iconNewWindowClass: string };

/** Mount styles in the head, falling back to the root during early page startup. */
export function ensureStyleTag(id: string, doc: Document = document): HTMLElement | null {
  if (!doc || typeof doc.getElementById !== "function") {
    return null;
  }

  let styleTag = doc.getElementById(id);
  if (!styleTag) {
    styleTag = doc.createElement("style");
    styleTag.setAttribute("type", "text/css");
    styleTag.setAttribute("id", id);
  }

  if (!styleTag.isConnected) {
    const mountTarget = doc.head || doc.documentElement;
    if (mountTarget && typeof mountTarget.appendChild === "function") {
      mountTarget.appendChild(styleTag);
    }
  }

  return styleTag;
}

/**
 * Preserve readable generated CSS while accumulating rules before a single DOM write.
 * @param state Buffer owned by the current style-generation pass.
 * @param classes Comma-delimited selectors; empty entries are discarded.
 * @param styles Semicolon-delimited property declarations used by CMF's static rules.
 */
export function addToSS(
  state: Pick<StyleState, "tempStyleSheetCode">,
  classes: string,
  styles: string
): void {
  const listOfClasses = classes
    .split(",")
    .filter((entry) => entry.trim())
    .map((entry) => entry.trim());
  let styleLines = styles.split(";").filter((entry) => entry.trim());
  styleLines = styleLines.map((entry) => {
    const temp = entry.split(":");
    return `    ${temp[0]?.trim() ?? ""}:${temp[1]?.trim() ?? ""}`;
  });

  let temp = `${listOfClasses.join(",\n")} {\n`;
  temp += `${styleLines.join(";\n")};\n`;
  temp += "}\n";
  state.tempStyleSheetCode += temp;
}
