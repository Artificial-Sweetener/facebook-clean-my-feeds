// SPDX-License-Identifier: GPL-3.0-only

/** Render a decorative mask icon using a bundled data URI and optional semantic class. */
export function buildIconHTML(dataUri: string, extraClassName = ""): string {
  const classes = ["cmf-icon"];
  if (extraClassName) classes.push(extraClassName);
  return `<span class="${classes.join(" ")}" aria-hidden="true" style="--cmf-icon-url: url('${dataUri}')"></span>`;
}
