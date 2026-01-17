function isSponsored(post, state) {
  if (!post || !state) {
    return false;
  }

  let isSponsoredPost = false;

  if (state.isNF) {
    isSponsoredPost = isSponsoredPlain(post, state.dictionarySponsored);
    if (!isSponsoredPost) {
      isSponsoredPost = isSponsoredShadowRoot1(post, state.dictionarySponsored);
      if (!isSponsoredPost) {
        isSponsoredPost = isSponsoredShadowRoot2(post, state.dictionarySponsored);
      }
    }
  }

  if (!isSponsoredPost) {
    const paramFind = "__cft__[0]=";
    const paramMinSize = state.isSF ? 250 : state.isVF ? 299 : 311;

    let elLinks = [];
    if (state.isNF || state.isGF) {
      elLinks = Array.from(
        post.querySelectorAll(
          `div[aria-posinset] span > a[href*="${paramFind}"]:not([href^="/groups/"]):not([href*="section_header_type"])`
        )
      );
      if (elLinks.length === 0) {
        elLinks = Array.from(
          post.querySelectorAll(
            `div[aria-describedby] span > a[href*="${paramFind}"]:not([href^="/groups/"]):not([href*="section_header_type"])`
          )
        );
      }
    } else if (state.isVF) {
      elLinks = Array.from(
        post.querySelectorAll(`div > div > div > div > span > span > div > a[href*="${paramFind}"]`)
      );
    } else if (state.isSF) {
      elLinks = Array.from(
        post.querySelectorAll(`div[role="article"] span > a[href*="${paramFind}"]`)
      );
    }

    if (elLinks.length > 0 && elLinks.length < 10) {
      const elMax = Math.min(2, elLinks.length);

      for (let i = 0; i < elMax; i += 1) {
        const el = elLinks[i];
        const pos = el.href.indexOf(paramFind);
        if (pos >= 0 && el.href.slice(pos).length >= paramMinSize) {
          isSponsoredPost = true;
          break;
        }
      }
    }
  }

  return isSponsoredPost;
}

function isSponsoredPlain(post, dictionarySponsored) {
  if (!Array.isArray(dictionarySponsored)) {
    return false;
  }

  let hasSponsoredText = false;
  const queryElement = 'div[id] > span > a[role="link"] > span';
  const elSpans = post.querySelectorAll(queryElement);

  elSpans.forEach((elSpan) => {
    if (!elSpan.querySelector("svg")) {
      const lcText = elSpan.textContent.trim().toLowerCase();
      hasSponsoredText = dictionarySponsored.includes(lcText);
    }
  });

  return hasSponsoredText;
}

function isSponsoredShadowRoot1(post, dictionarySponsored) {
  if (!Array.isArray(dictionarySponsored)) {
    return false;
  }

  let hasSponsoredText = false;
  const elCanvas = post.querySelector("a > span > span[aria-labelledby] > canvas");
  if (elCanvas) {
    const elementId = elCanvas.parentElement.getAttribute("aria-labelledby");
    if (elementId && elementId.slice(0, 1) === ":") {
      const escapedId = elementId.replace(/(:)/g, "\\$1");
      const elSpan = document.querySelector(`[id="${escapedId}"]`);
      if (elSpan) {
        const lcText = elSpan.textContent.trim().toLowerCase();
        hasSponsoredText = dictionarySponsored.includes(lcText);
      }
    }
  }
  return hasSponsoredText;
}

function isSponsoredShadowRoot2(post, dictionarySponsored) {
  if (!Array.isArray(dictionarySponsored)) {
    return false;
  }

  let hasSponsoredText = false;
  const elUse = post.querySelector("a > span > span[aria-labelledby] svg > use[*|href]");
  if (elUse) {
    const elementId = elUse.href.baseVal;
    if (elementId !== "" && elementId.slice(0, 1) === "#") {
      const elText = document.querySelector(`${elementId}`);
      if (elText) {
        const lcText = elText.textContent.trim().toLowerCase();
        hasSponsoredText = dictionarySponsored.includes(lcText);
      }
    }
  }
  return hasSponsoredText;
}

module.exports = {
  isSponsored,
};
