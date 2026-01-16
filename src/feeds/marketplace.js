const { findFirstMatch } = require("../core/filters/matching");
const { mainColumnAtt, postAtt, postAttMPSkip } = require("../dom/attributes");
const { hasSizeChanged } = require("../dom/dirty-check");
const { mpScanTreeForText } = require("../dom/walker");
const { sanitizeReason } = require("../dom/hide");
const { climbUpTheTree } = require("../utils/dom");

function mpHideBox(box, reason, state, options) {
  if (!box || !state || !options) {
    return;
  }

  box.setAttribute(state.hideWithNoCaptionAtt, "");
  box.setAttribute(postAtt, sanitizeReason(reason));
  if (options.VERBOSITY_DEBUG) {
    box.setAttribute(state.showAtt, "");
  }
}

function mpStopTrackingDirtIntoMyHouse() {
  const collectionOfLinks = document.querySelectorAll('a[href*="/?ref="]');
  for (const trackingLink of collectionOfLinks) {
    trackingLink.href = trackingLink.href.split("/?ref")[0];
  }
}

function mpHideSponsoredItems(keyWords, state, options) {
  const query = `div[${mainColumnAtt}] > div > div > div > div > div > div[style] > span`;
  const items = document.querySelectorAll(query);
  for (const item of items) {
    const box = item.parentElement;
    if (box.hasAttribute(postAttMPSkip)) {
      if (box.innerHTML.length === box.getAttribute(postAttMPSkip)) {
        continue;
      }
    }
    mpHideBox(box, keyWords.SPONSORED, state, options);
  }
}

function mpGetBlockedPrices(elBlockOfText, filters) {
  if (filters.MP_BLOCKED_TEXT.length > 0) {
    const itemPrices = mpScanTreeForText(elBlockOfText);
    return findFirstMatch(itemPrices, filters.MP_BLOCKED_TEXT_LC);
  }
  return "";
}

function mpGetBlockedTextDescription(collectionBlocksOfText, filters, skipFirstBlock = true) {
  if (filters.MP_BLOCKED_TEXT_DESCRIPTION.length > 0) {
    const startIndex = skipFirstBlock ? 1 : 0;
    for (let i = startIndex; i < collectionBlocksOfText.length; i += 1) {
      const descriptionTextList = mpScanTreeForText(collectionBlocksOfText[i]);
      const descriptionText = descriptionTextList.join(" ").toLowerCase();
      const blockedText = findFirstMatch(descriptionText, filters.MP_BLOCKED_TEXT_DESCRIPTION_LC);
      if (blockedText.length > 0) {
        return blockedText;
      }
    }
  }
  return "";
}

function mpDoBlockingByBlockedText(filters, keyWords, state, options) {
  const queries = [
    `div[style]:not([${postAtt}]) > div > div > span > div > div > div > div > a[href*="/marketplace/item/"]`,
    `div[style]:not([${postAtt}]) > div > div > span > div > div > div > div > a[href*="/marketplace/np/item/"]`,
    `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/item/"]`,
    `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/np/item/"]`,
    `div[style]:not([${postAtt}]) > div > div > span > div > div > a[href*="/marketplace/item/"]`,
    `div[style]:not([${postAtt}]) > div > div > span > div > div > a[href*="/marketplace/np/item/"]`,
    `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/item/"]`,
    `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/np/item/"]`,
  ];
  let items = [];
  for (const query of queries) {
    items = document.querySelectorAll(query);
    if (items.length > 0) {
      break;
    }
  }

  for (const item of items) {
    const box = item.closest("div[style]");
    if (!box) {
      continue;
    }
    if (box.hasAttribute(postAttMPSkip)) {
      if (box.innerHTML.length === box.getAttribute(postAttMPSkip)) {
        continue;
      }
    }

    const queryTextBlock = ":scope > div > div:nth-of-type(2) > div";
    const blocksOfText = item.querySelectorAll(queryTextBlock);
    if (blocksOfText.length > 0) {
      const blockedTextPrices = mpGetBlockedPrices(blocksOfText[0], filters);
      const blockedTextDescription = mpGetBlockedTextDescription(blocksOfText, filters, true);

      if (blockedTextPrices.length > 0) {
        mpHideBox(box, blockedTextPrices, state, options);
      } else if (blockedTextDescription.length > 0) {
        mpHideBox(box, blockedTextDescription, state, options);
      } else {
        box.setAttribute(postAtt, "");
      }
    }
  }
}

function isMarketplaceDirty(state) {
  if (state.mpType === "item") {
    const mainColumnDM = document.querySelector('div[hidden] ~ div[class*="__"] div[role="dialog"]');
    if (mainColumnDM) {
      if (mainColumnDM.hasAttribute(mainColumnAtt)) {
        if (hasSizeChanged(mainColumnDM.getAttribute(mainColumnAtt), mainColumnDM.innerHTML.length)) {
          return mainColumnDM;
        }
      } else {
        return mainColumnDM;
      }
    }
    const mainColumnPM = document.querySelector('div[role="navigation"] ~ div[role="main"]');
    if (mainColumnPM) {
      if (mainColumnPM.hasAttribute(mainColumnAtt)) {
        if (
          hasSizeChanged(
            mainColumnPM.getAttribute(mainColumnAtt),
            mainColumnPM.innerHTML.length.toString()
          )
        ) {
          return mainColumnPM;
        }
      } else {
        return mainColumnPM;
      }
    }
  } else {
    const mainColumn = document.querySelector(`[${mainColumnAtt}]`);
    if (mainColumn) {
      if (hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)) {
        return mainColumn;
      }
    } else {
      const query = 'div[role="navigation"] ~ div[role="main"]';
      const mainColumn = document.querySelector(query);
      if (mainColumn) {
        return mainColumn;
      }
    }
  }

  if (state) {
    state.noChangeCounter += 1;
  }

  return null;
}

function mopMarketplaceFeed(context) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords } = context;
  if (!state || !options || !filters || !keyWords) {
    return null;
  }

  const mainColumn = isMarketplaceDirty(state);
  if (!mainColumn) {
    return null;
  }

  mpStopTrackingDirtIntoMyHouse();

  if (state.mpType === "marketplace" || state.mpType === "item") {
    if (options.MP_SPONSORED) {
      mpHideSponsoredItems(keyWords, state, options);

      const queryHeadings = `div:not([${postAtt}]) > a[href="/ads/about/?entry_product=ad_preferences"], div:not([${postAtt}]) > object > a[href="/ads/about/?entry_product=ad_preferences"]`;
      const headings = document.querySelectorAll(queryHeadings);

      let queryItems = `div[style]:not([${postAtt}]) > span > div:first-of-type > a:not([href*="marketplace"])`;
      let items = document.querySelectorAll(queryItems);
      if (items.length === 0) {
        queryItems = `div[style]:not([${postAtt}]) > span > div:first-of-type > div > a:not([href*="marketplace"])`;
        items = document.querySelectorAll(queryItems);
      }

      if (headings.length > 0 && items.length > 0) {
        for (const heading of headings) {
          mpHideBox(heading.parentElement, keyWords.SPONSORED, state, options);
        }
        for (const item of items) {
          const parentItem = climbUpTheTree(item, 4);
          mpHideBox(parentItem, keyWords.SPONSORED, state, options);
        }
      }
    }

    if (options.MP_BLOCKED_ENABLED) {
      mpDoBlockingByBlockedText(filters, keyWords, state, options);
    }
  }

  if (state.mpType === "item") {
    if (options.MP_SPONSORED) {
      const elDialog = document.querySelector('div[role="dialog"]');
      if (elDialog) {
        const query = `span h2 [href*="/ads/about/"]:not([${postAtt}])`;
        const elLink = elDialog.querySelector(query);
        if (elLink) {
          const box = elLink.closest("h2").closest("span");
          mpHideBox(box, keyWords.SPONSORED, state, options);
          elLink.setAttribute(postAtt, keyWords.SPONSORED);
        }
      } else {
        const query = `div[${mainColumnAtt}] span h2 [href*="/ads/about/"]:not([${postAtt}])`;
        const elLink = document.querySelector(query);
        if (elLink) {
          const box = elLink.closest("h2").closest("span");
          mpHideBox(box, keyWords.SPONSORED, state, options);
          elLink.setAttribute(postAtt, keyWords.SPONSORED);
        }
      }
    }
  } else if (state.mpType === "category" || state.mpType === "search") {
    if (options.MP_SPONSORED) {
      mpHideSponsoredItems(keyWords, state, options);
    }
    if (options.MP_BLOCKED_ENABLED) {
      mpDoBlockingByBlockedText(filters, keyWords, state, options);
    }
  }

  mainColumn.setAttribute(mainColumnAtt, mainColumn.innerHTML.length.toString());
  state.noChangeCounter = 0;

  return mainColumn;
}

module.exports = {
  mpGetBlockedPrices,
  mpGetBlockedTextDescription,
  mopMarketplaceFeed,
};
