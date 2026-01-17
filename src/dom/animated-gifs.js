const { climbUpTheTree } = require("../utils/dom");

const { postAtt } = require("./attributes");

function getMosquitosQuery() {
  return `div[role="button"][aria-label*="GIF"]:not([${postAtt}]) > i:not([data-visualcompletion])`;
}

function swatTheMosquitos(post) {
  if (!post || typeof post.querySelectorAll !== "function") {
    return;
  }

  const animatedGIFs = post.querySelectorAll(getMosquitosQuery());
  for (const gif of animatedGIFs) {
    let parent = climbUpTheTree(gif, 2);
    let sibling = parent ? parent.querySelector(":scope > a") : null;
    if (!sibling) {
      parent = climbUpTheTree(gif, 3);
      sibling = parent ? parent.querySelector(":scope > a") : null;
    }

    if (sibling) {
      const siblingCS = window.getComputedStyle(sibling);
      if (siblingCS.opacity === "0" && gif.parentElement) {
        gif.parentElement.click();
      }
      if (gif.parentElement) {
        gif.parentElement.setAttribute(postAtt, "1");
      }
    }
  }
}

module.exports = {
  getMosquitosQuery,
  swatTheMosquitos,
};
