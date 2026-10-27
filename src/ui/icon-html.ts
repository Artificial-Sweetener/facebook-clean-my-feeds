// SPDX-License-Identifier: GPL-3.0-only

/**
 * Wrap build-validated, repository-owned SVG as decorative markup inheriting the control color.
 * Never pass user content, downloaded SVG, URLs or settings into this trusted HTML boundary.
 *
 * @param markup Static geometry accepted by the build-time SVG allowlist.
 * @param extraClassName Optional internal CSS class; unsafe tokens are discarded.
 * @returns Non-focusable, assistive-technology-hidden artwork with no raster mask compositing.
 */
export function buildIconHTML(markup: string, extraClassName = ""): string {
  const classes = ["cmf-icon"];
  if (/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(extraClassName)) classes.push(extraClassName);
  const decorativeSvg = markup.replace("<svg", '<svg aria-hidden="true" focusable="false"');
  return `<span class="${classes.join(" ")}" aria-hidden="true">${decorativeSvg}</span>`;
}
