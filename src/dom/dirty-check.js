const { postAtt, postAttTab } = require("./attributes");

const dirtyTokens = new WeakMap();
const postSignatures = new WeakMap();
const observers = new WeakMap();

function hasSizeChanged(oldValue, newValue, tolerance = 16) {
  if (oldValue === null || oldValue === undefined) {
    return true;
  }

  const oldNumber = parseInt(oldValue, 10);
  const newNumber = parseInt(newValue, 10);

  if (Number.isNaN(oldNumber) || Number.isNaN(newNumber)) {
    return true;
  }

  return Math.abs(newNumber - oldNumber) > tolerance;
}

function getDirtyEntry(target) {
  if (!target) {
    return null;
  }

  if (!dirtyTokens.has(target)) {
    dirtyTokens.set(target, { dirtyToken: 0, lastProcessedToken: -1 });
  }

  return dirtyTokens.get(target);
}

function getDirtyToken(target) {
  const entry = getDirtyEntry(target);
  return entry ? entry.dirtyToken : 0;
}

function buildPostSignature(post) {
  if (!post) {
    return "";
  }

  const pos = post.getAttribute("aria-posinset") || "";
  const textLen = post.textContent ? post.textContent.length : 0;
  const firstLink = post.querySelector("a[href]");
  const href = firstLink ? firstLink.getAttribute("href") || "" : "";
  return `${pos}|${textLen}|${href}`;
}

function hasPostChanged(post) {
  if (!post) {
    return false;
  }

  const signature = buildPostSignature(post);
  const previous = postSignatures.get(post);
  postSignatures.set(post, signature);
  if (previous === undefined) {
    return false;
  }

  return previous !== signature;
}

function trackPostSignature(post) {
  if (!post) {
    return;
  }
  postSignatures.set(post, buildPostSignature(post));
}

function resetPostState(post, state) {
  if (!post || !state) {
    return;
  }

  const wrapper = post.closest(`details[${postAtt}]`);
  if (wrapper && wrapper.parentNode) {
    wrapper.parentNode.insertBefore(post, wrapper);
    wrapper.remove();
  }

  const nestedWrappers = Array.from(post.querySelectorAll(`details[${postAtt}]`));
  nestedWrappers.forEach((details) => {
    const parent = details.parentNode;
    if (!parent) {
      return;
    }
    while (details.firstChild) {
      parent.insertBefore(details.firstChild, details);
    }
    details.remove();
  });

  post.removeAttribute(postAtt);
  post.removeAttribute(state.hideAtt);
  post.removeAttribute(state.hideWithNoCaptionAtt);
  post.removeAttribute(state.showAtt);

  const nestedNoCaptionRows = Array.from(post.querySelectorAll(`[${state.hideWithNoCaptionAtt}]`));
  nestedNoCaptionRows.forEach((element) => {
    element.removeAttribute(postAtt);
    element.removeAttribute(state.hideWithNoCaptionAtt);
    element.removeAttribute(state.showAtt);
  });

  const miniCaption = post.querySelector(`[${postAttTab}]`);
  if (miniCaption) {
    miniCaption.remove();
  }
}

function markElementDirty(target) {
  const entry = getDirtyEntry(target);
  if (!entry) {
    return;
  }
  entry.dirtyToken += 1;
}

function markElementClean(target) {
  const entry = getDirtyEntry(target);
  if (!entry) {
    return;
  }
  entry.lastProcessedToken = entry.dirtyToken;
}

function markElementCleanIfUnchanged(target, token) {
  const entry = getDirtyEntry(target);
  if (!entry) {
    return;
  }
  if (entry.dirtyToken === token) {
    entry.lastProcessedToken = entry.dirtyToken;
  }
}

function isElementDirty(target) {
  const entry = getDirtyEntry(target);
  if (!entry) {
    return false;
  }
  return entry.dirtyToken !== entry.lastProcessedToken;
}

function ensureDirtyObserver(target) {
  if (!target || typeof MutationObserver === "undefined") {
    return null;
  }

  const existing = observers.get(target);
  if (existing) {
    return existing;
  }

  const observer = new MutationObserver(() => {
    markElementDirty(target);
  });
  observer.observe(target, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });
  observers.set(target, observer);
  markElementDirty(target);
  return observer;
}

function disconnectDirtyObserver(target) {
  const observer = observers.get(target);
  if (!observer) {
    return;
  }

  observer.disconnect();
  observers.delete(target);
}

module.exports = {
  disconnectDirtyObserver,
  ensureDirtyObserver,
  getDirtyToken,
  hasPostChanged,
  hasSizeChanged,
  isElementDirty,
  markElementClean,
  markElementCleanIfUnchanged,
  markElementDirty,
  resetPostState,
  trackPostSignature,
};
