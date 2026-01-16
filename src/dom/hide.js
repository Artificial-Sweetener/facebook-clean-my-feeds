const { generateRandomString } = require("../utils/random");

const { postAtt, postAttCPID, postAttTab } = require("./attributes");

function sanitizeReason(reason) {
  if (typeof reason !== "string") {
    return "";
  }

  return reason.replaceAll('"', "");
}

function addCaptionForHiddenPost(post, reason, marker, keyWords, attributes, state, options) {
  if (!post || !keyWords || !attributes || !state || !options) {
    return;
  }

  const elDetails = document.createElement("details");
  const elSummary = document.createElement("summary");
  if (!Array.isArray(keyWords.VERBOSITY_MESSAGE)) {
    return;
  }

  if (!post.parentNode) {
    return;
  }

  const elText = document.createTextNode(`${keyWords.VERBOSITY_MESSAGE[1]}${reason}`);

  elSummary.appendChild(elText);
  elDetails.appendChild(elSummary);
  elDetails.setAttribute(attributes.postAtt, marker === false ? "" : marker);

  if (post.classList.length > 0) {
    elDetails.classList.add(...post.classList);
  }

  post.parentNode.appendChild(elDetails);
  elDetails.appendChild(post);

  if (options.VERBOSITY_DEBUG) {
    elDetails.setAttribute("open", "");
    post.setAttribute(state.showAtt, "");
  }
}

function addMiniCaption(post, reason, attributes, state) {
  if (!post || !attributes || !state) {
    return;
  }

  post.setAttribute(state.hideAtt, "");
  const elTab = document.createElement("h6");
  elTab.setAttribute(attributes.postAttTab, "0");
  elTab.textContent = reason;

  post.insertBefore(elTab, post.firstElementChild);
}

function hideBlock(block, link, reason, state, options, attributes) {
  if (!block || !link || !state || !options || !attributes) {
    return;
  }

  block.setAttribute(state.cssHideEl, "");
  link.setAttribute(attributes.postAtt, sanitizeReason(reason));

  if (options.VERBOSITY_DEBUG) {
    block.setAttribute(state.showAtt, "");
  }
}

function hidePost(post, reason, marker, context) {
  if (!post || !context) {
    return;
  }

  const { options, keyWords, attributes, state } = context;
  if (!options || !keyWords || !attributes || !state) {
    return;
  }

  post.setAttribute(attributes.postAtt, sanitizeReason(reason));

  if (options.VERBOSITY_LEVEL !== "0" && reason !== "") {
    addCaptionForHiddenPost(post, reason, marker, keyWords, attributes, state, options);
  } else {
    post.setAttribute(state.hideAtt, "");
    if (options.VERBOSITY_DEBUG) {
      addMiniCaption(
        post,
        reason,
        {
          postAttTab: attributes.postAttTab,
        },
        state
      );
      post.setAttribute(state.showAtt, "");
    }
  }
}

function hideFeature(post, reason, marker, context) {
  if (!post || !context) {
    return;
  }

  const { options, keyWords, state } = context;
  if (!options || !keyWords || !state) {
    return;
  }

  post.setAttribute(postAtt, sanitizeReason(reason));

  if (options.VERBOSITY_LEVEL !== "0" && reason !== "") {
    addCaptionForHiddenPost(post, reason, marker, keyWords, { postAtt }, state, options);
  } else {
    post.setAttribute(state.hideAtt, "");
    if (options.VERBOSITY_DEBUG) {
      addMiniCaption(post, reason, { postAttTab }, state);
    }
  }
}

function toggleHiddenElements(state, options) {
  if (!state || !options) {
    return;
  }

  const containers = Array.from(document.querySelectorAll(`[${state.hideAtt}]`));
  const blocks = Array.from(document.querySelectorAll(`[${state.cssHideEl}]`));
  const shares = Array.from(document.querySelectorAll(`[${state.cssHideNumberOfShares}]`));
  const elements = [...containers, ...blocks, ...shares];

  if (options.VERBOSITY_DEBUG) {
    for (const element of elements) {
      element.setAttribute(state.showAtt, "");
    }
  } else {
    for (const element of elements) {
      element.removeAttribute(state.showAtt);
    }
  }
}

function toggleConsecutivesElements(ev, state) {
  if (!ev || !state) {
    return;
  }

  ev.stopPropagation();
  const elSummary = ev.target;
  const elDetails = elSummary.parentElement;
  const elPostContent = elDetails.querySelector("div");
  const cpidValue = elPostContent.getAttribute(postAttCPID);

  const collection = document.querySelectorAll(`div[${postAttCPID}="${cpidValue}"]`);

  if (elDetails.hasAttribute("open")) {
    collection.forEach((post) => {
      post.removeAttribute(state.showAtt);
    });
  } else {
    collection.forEach((post) => {
      post.setAttribute(state.showAtt, "");
    });
  }
}

function hideGroupPost(post, reason, marker, context) {
  if (!post || !context) {
    return;
  }

  const { options, keyWords, state } = context;
  if (!options || !keyWords || !state) {
    return;
  }

  post.setAttribute(postAtt, sanitizeReason(reason));

  if (options.VERBOSITY_LEVEL !== "0" && reason !== "") {
    const elPostContent = post.querySelector("div");
    if (!elPostContent) {
      return;
    }

    if (options.VERBOSITY_LEVEL === "1") {
      addCaptionForHiddenPost(elPostContent, reason, marker, keyWords, { postAtt }, state, options);
    } else {
      if (state.echoCount === 1) {
        addCaptionForHiddenPost(elPostContent, reason, marker, keyWords, { postAtt }, state, options);
        state.echoCPID = generateRandomString();
        state.echoEl = elPostContent;
        state.echoEl.setAttribute(postAttCPID, state.echoCPID);
      } else {
        const elDetails = state.echoEl ? state.echoEl.closest("details") : null;
        if (!elDetails) {
          return;
        }

        if (state.echoCount === 2) {
          addMiniCaption(state.echoEl, reason, { postAttTab }, state);
          elDetails.addEventListener("click", (event) => toggleConsecutivesElements(event, state));
        }

        const summary = elDetails.querySelector("summary");
        if (summary && summary.lastChild) {
          summary.lastChild.textContent = `${state.echoCount}${keyWords.VERBOSITY_MESSAGE[1]}`;
        }

        addMiniCaption(elPostContent, reason, { postAttTab }, state);
        elPostContent.setAttribute(postAttCPID, state.echoCPID);
      }
    }
  } else {
    post.setAttribute(state.hideAtt, "");
    if (options.VERBOSITY_DEBUG) {
      addMiniCaption(post, reason, { postAttTab }, state);
      post.setAttribute(state.showAtt, "");
    }
  }
}

function hideVideoPost(post, reason, marker, context) {
  hidePost(post, reason, marker, context);
}

function hideNewsPost(post, reason, marker, context) {
  hidePost(post, reason, marker, context);
}

module.exports = {
  addCaptionForHiddenPost,
  addMiniCaption,
  hideBlock,
  hideFeature,
  hideGroupPost,
  hideNewsPost,
  hidePost,
  hideVideoPost,
  sanitizeReason,
  toggleConsecutivesElements,
  toggleHiddenElements,
};
