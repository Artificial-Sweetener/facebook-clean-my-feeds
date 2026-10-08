// SPDX-License-Identifier: GPL-3.0-only

/** esbuild embeds PNG source bytes as data URLs; no image loader runs in the browser. */
declare module "*.png" {
  const dataUrl: string;
  export default dataUrl;
}
