// SPDX-License-Identifier: GPL-3.0-only

import { collectGifControls, isGifMediaPlaying } from "../../src/dom/gif-controls";
import { swatTheMosquitos } from "../../src/dom/animated-gifs";
import { postAtt } from "../../src/dom/attributes";
import { clearDirtyTracking } from "../../src/dom/dirty-check";

/** Reproduce the three separately painted overlay layers observed on both live image and video GIF players. */
function gifFixture(
  media = '<img src="https://external.example.fbcdn.net/emg1/v/t13/123?stp=dst-gif_fr_q75">'
) {
  const root = document.createElement("div");
  root.innerHTML = `<div>${media}<div role="button"><i>${[
    [72, 72],
    [66, 66],
    [32, 17],
  ]
    .map(
      ([width, height]) =>
        `<span><i data-visualcompletion="css-img" style="width:${width}px;height:${height}px;background-image:url(https://static.xx.fbcdn.net/rsrc.php/sprite.webp)"></i></span>`
    )
    .join("")}</i></div></div>`;
  document.body.append(root);
  const control = root.querySelector<HTMLElement>('[role="button"]');
  if (!control) throw new Error("Fixture requires a playback control");
  return { root, control };
}

afterEach(() => {
  jest.restoreAllMocks();
  clearDirtyTracking();
  document.body.replaceChildren();
});

test.each(["", "未知", "Unrelated words"])("GIF media detection ignores caption %p", (caption) => {
  const { root, control } = gifFixture();
  control.setAttribute("aria-label", caption);
  const labels = jest.spyOn(control, "getAttribute");
  expect(collectGifControls(root).map((match) => match.control)).toEqual([control]);
  expect(labels.mock.calls.some(([attribute]) => attribute === "aria-label")).toBe(false);
});

test.each([
  "missing layer",
  "different sprite",
  "wrong dimensions",
  "no media",
  "two media",
  "menu",
  "neighbor control",
  "hidden",
  "comment",
  "nested post",
])("GIF structure rejects %s", (variant) => {
  const { root, control } = gifFixture();
  const layers = control.querySelectorAll("span > i");
  const layer = layers[0];
  if (!(layer instanceof HTMLElement)) throw new Error("Fixture requires an icon layer");
  if (variant === "missing layer") layer.parentElement?.remove();
  if (variant === "different sprite")
    layer.style.backgroundImage = "url(https://example.org/other.webp)";
  if (variant === "wrong dimensions") layer.style.width = "16px";
  if (variant === "no media") root.querySelector("img")?.remove();
  if (variant === "two media") control.insertAdjacentHTML("beforebegin", "<video></video>");
  if (variant === "menu") control.setAttribute("aria-haspopup", "dialog");
  if (variant === "neighbor control")
    control.insertAdjacentHTML("beforebegin", "<button>Other action</button>");
  if (variant === "hidden") control.setAttribute("hidden", "");
  if (variant === "comment") control.parentElement?.setAttribute("data-commentid", "1");
  if (variant === "nested post") control.parentElement?.setAttribute("role", "article");
  expect(collectGifControls(root)).toEqual([]);
});

test("an animated image is paused once, before a synchronous rescan", () => {
  const { root, control } = gifFixture();
  const clicks = jest.spyOn(control, "click");
  control.addEventListener("click", () => swatTheMosquitos(root));
  swatTheMosquitos(root);
  swatTheMosquitos(root);
  expect(clicks).toHaveBeenCalledTimes(1);
  expect(control.hasAttribute(postAtt)).toBe(true);
});

test.each([
  "https://external.example.fbcdn.net/image?stp=dst-emg0_q75",
  "https://fbcdn.net.example.org/image?stp=dst-gif_q75",
  "https://user@external.example.fbcdn.net/image?stp=dst-gif_q75",
])("an image without a verified animated rendition is never started: %s", (source) => {
  const { root, control } = gifFixture(`<img src="${source}">`);
  const clicks = jest.spyOn(control, "click");
  swatTheMosquitos(root);
  expect(clicks).not.toHaveBeenCalled();
});

test.each([true, false])("video-backed GIF playback uses paused=%s", (paused) => {
  const { root, control } = gifFixture("<video></video>");
  const video = root.querySelector("video");
  if (!video) throw new Error("Fixture requires a video");
  Object.defineProperty(video, "paused", { value: paused });
  expect(isGifMediaPlaying(video)).toBe(!paused);
  const clicks = jest.spyOn(control, "click");
  swatTheMosquitos(root);
  expect(clicks).toHaveBeenCalledTimes(paused ? 0 : 1);
});
