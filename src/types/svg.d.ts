// SPDX-License-Identifier: GPL-3.0-only

/** The build validates inert SVG geometry and embeds its text without runtime asset requests. */
declare module "*.svg" {
  const markup: string;
  export default markup;
}
