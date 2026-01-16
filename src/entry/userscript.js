const { hydrateOptions } = require("../core/options/hydrate");
const { createState } = require("../core/state/vars");
const { addCSS, addExtraCSS } = require("../dom/styles");
const { initializeRuntimeAttributes } = require("../dom/attributes");
const { mopGroupsFeed } = require("../feeds/groups");
const { mopMarketplaceFeed } = require("../feeds/marketplace");
const { mopNewsFeed } = require("../feeds/news");
const { mopProfileFeed } = require("../feeds/profile");
const { mopReelsFeed } = require("../feeds/reels");
const { mopSearchFeed } = require("../feeds/search");
const { mopVideosFeed } = require("../feeds/videos");
const { defaults, pathInfo } = require("../ui/i18n/translations");
const { buildDictionaries } = require("../ui/i18n/dictionaries");
const { initDialog, toggleDialog } = require("../ui/dialog/dialog");
const { getOptions } = require("../storage/idb");

const ICON_CLOSE =
  '<svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M15.543 3.043a1 1 0 1 1 1.414 1.414L11.414 10l5.543 5.542a1 1 0 0 1-1.414 1.415L10 11.414l-5.543 5.543a1 1 0 0 1-1.414-1.415L8.586 10 3.043 4.457a1 1 0 1 1 1.414-1.414L10 8.586z"/></svg>';
const LOGO_HTML =
  '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32"><g id="Layer" fill="currentColor"><path id="Layer" fill-rule="evenodd" class="s0" d="m51 3.2c0.7 1.1 0.7 1-1.6 9.2-1.4 5-2.1 7.4-2.3 7.6-0.1 0.1-0.3 0.2-0.6 0.2-0.4 0-0.9-0.4-0.9-0.7 0-0.1 1-3.5 2-7.4 1.2-4 2-7.3 2-7.5 0-0.4-0.6-1-0.9-1-0.2 0-0.5 0.2-0.7 0.3-0.3 0.3-0.7 1.8-5.5 19.2l-5.3 18.9 0.9 0.5c0.5 0.3 0.9 0.5 0.9 0.5 0 0 1.3-4.4 2.8-9.8 1.5-5.3 2.8-10 2.8-10.3 0.2-0.5 0.3-0.7 0.6-0.9 0.3-0.1 0.4-0.1 0.8 0 0.2 0.2 0.4 0.3 0.4 0.5 0.1 0.2-0.4 2.2-1.5 6.1-0.9 3.2-1.6 5.8-1.6 5.9 0 0 0.5 0.1 1.3 0.1 1.9 0 2.7 0.4 3.2 1.5 0.3 0.6 0.3 2.7 0 3.4-0.3 0.9-1.2 1.4-2 1.4-0.3 0-0.5 0.1-0.5 0.1 0 0.2-2.3 20.2-2.3 20.4-0.2 0.8 0.7 0.7-14.1 0.7-15.3 0-14.3 0.1-15.3-1-0.8-0.8-1.1-1.5-1-2.9 0.2-3.6 2.7-6.7 6.3-7.8 0.4-0.2 0.9-0.3 1-0.3 0.6 0 0.6 0.1 0.1-4.5-0.3-2.4-0.5-4.4-0.5-4.5-0.1-0.1-0.3-0.1-0.7-0.2-0.6 0-1.1-0.3-1.6-1-0.3-0.4-0.3-0.5-0.4-1.8 0-1.7 0.1-2.1 0.6-2.7 0.7-0.6 1-0.7 2.5-0.8h1.3v-2.9c0-3.1 0-3.4 0.6-3.6 0.2-0.1 2.4-0.1 7.1-0.1 6.5 0.1 6.9 0.1 7.1 0.3 0.2 0.2 0.2 0.3 0.2 3.3v3h0.6l0.6-0.1 4.3-15.3c2.4-8.5 4.4-15.6 4.5-15.9 0.4-0.6 0.9-1 1.5-1.3 1.2-0.4 2.6 0.1 3.3 1.2zm-26.6 26.6h-0.7c-0.3 0-0.6 0-0.7 0 0 0.1-0.1 1.2-0.1 2.5v2.3h1.5zm3.4 0h-0.7c-0.5 0-0.9 0-0.9 0.1 0 0-0.1 1.1-0.1 2.4v2.3h1.8v-2.4zm3.4 0h-1.6v4.8h1.6zm3.2 0h-1.3v4.8h1.3zm-6.4 6.6c-7.9 0-9 0-9.2 0.2-0.3 0.2-0.3 0.3-0.3 1.3 0 0.7 0.1 1.1 0.2 1.2 0.1 0.1 2.3 0.1 7.3 0.1 6.9 0.1 7.2 0.1 7.5 0.3 0.3 0.3 0.3 1 0 1.3-0.2 0.2-0.8 0.2-6.3 0.2h-6l0.1 0.5c0 0.3 0.2 2.3 0.5 4.5l0.4 4h0.4c0.6 0 1.5-0.3 2-0.7 0.3-0.3 0.7-0.8 0.9-1.3 0.6-1.1 1.3-2 2.1-2.7 1.1-0.9 2.8-1.5 4-1.5h0.6l0.7-1.1c0.6-1 0.8-1.2 1.3-1.5 0.4-0.2 0.6-0.2 0.9-0.2 0.4 0.1 0.5 0.1 0.5-0.1 0.1-0.1 0.3-1.1 0.6-2.1 0.3-1.1 0.6-2.1 0.6-2.2 0.1-0.2-0.4-0.2-8.8-0.2zm16.2 0h-1.5l-0.4 1.3c-0.2 0.8-0.4 1.4-0.4 1.5 0 0 0.9 0 2 0 2.3 0 2.3 0.1 2.3-1.4 0-0.9-0.1-1-0.3-1.2-0.2-0.2-0.6-0.2-1.7-0.2zm-2.8 4.7c0 0.1-0.2 0.8-0.5 1.6-0.2 1-0.3 1.4-0.2 1.5 0 0 0.3 0.2 0.6 0.4 0.4 0.4 0.4 0.5 0.5 1.2 0 0.6 0 0.7-0.8 2-0.7 1.1-0.8 1.3-1.3 1.6l-0.5 0.2v1.8c0 1.3-0.1 2-0.2 2.5-0.1 0.4-0.2 0.8-0.2 0.8 0 0 0.7 0.1 1.5 0.1 1.2 0 1.6-0.1 1.6-0.2 0-0.1 0.4-3.1 0.8-6.8 0.4-3.6 0.7-6.7 0.7-6.7-0.1-0.2-1.9-0.1-2 0zm-6.3 1.8c-0.2-0.1-0.3 0-0.9 1-0.2 0.4-0.4 0.8-0.3 0.8 0 0.1 1.1 0.7 2.3 1.5 1.3 0.7 2.4 1.4 2.5 1.5 0.3 0.1 0.3 0.1 0.8-0.8 0.3-0.6 0.6-1 0.5-1 0 0-1.1-0.7-2.4-1.5-1.3-0.8-2.4-1.4-2.5-1.5zm-4.5 2.8c-1.6 0.5-2.7 1.5-3.5 3.1-0.6 1.2-1.3 2-2.4 2.5-0.9 0.4-0.9 0.4-2.9 0.5-2.8 0.1-3.9 0.6-5.4 2.1-0.8 0.8-1 1.1-1.4 1.9-1 2.2-0.9 4 0.2 4.4 0.7 0.3 0.8 0.3 1-0.5 0.8-2.4 2.7-4.5 5.1-5.5 1.1-0.4 1.6-0.5 3.2-0.6 2-0.2 2.8-0.7 3.4-2.2 0.3-0.5 0.6-1.2 0.8-1.6 0.8-1.3 2.4-2.5 3.8-2.9 0.4-0.1 0.8-0.2 0.8-0.2q0.2-0.1-0.3-0.4c-0.3-0.2-0.6-0.4-0.6-0.5-0.1-0.3-1.1-0.3-1.8-0.1zm3.2 2.7c-0.9 0.2-2 0.8-2.8 1.5-0.7 0.6-0.8 0.9-1.6 2.6-0.7 1.5-2.2 2.5-3.9 2.7-3.4 0.4-4.3 0.8-5.8 2.2-0.7 0.8-1 1.2-1.4 1.9l-0.5 1 0.9 0.1c0.9 0 0.9 0 1.2-0.4q2.7-3.2 7.3-3.2c2.2 0 2.9-0.5 3.9-2.3 0.3-0.5 0.7-1.2 0.9-1.5 1-1.2 3-2.3 4.6-2.4l0.8-0.1-0.1-0.5c-0.1-0.8-0.3-1.2-0.9-1.4-0.7-0.2-1.9-0.3-2.6-0.2zm3.6 3.9h-0.4c-0.5 0-1.6 0.3-2.3 0.7-0.7 0.5-1.6 1.5-2.2 2.6-1.1 2.1-2.5 2.9-5.2 2.9-0.6 0-1.6 0.1-2 0.2-1 0.2-2.3 0.8-2.9 1.3l-0.4 0.4h4.1c4.6-0.1 4.7-0.1 6.5-1 0.9-0.5 1.3-0.7 2.2-1.6 1.4-1.4 2.2-3 2.5-4.9zm4.3 4.2h-1.9-1.8l-0.5 0.8c-0.6 0.9-1.5 1.9-2.4 2.6l-0.6 0.5h3.4c2.6 0 3.4 0 3.4-0.1 0-0.1 0.1-1 0.2-2z"/></g></svg>';
const ICON_NEW_WINDOW =
  '<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><title>Open post in a new window</title><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';

async function loadOptions(state) {
  const rawOptions = await getOptions();
  let storedOptions = {};
  if (typeof rawOptions === "string") {
    try {
      storedOptions = JSON.parse(rawOptions);
    } catch (error) {
      storedOptions = {};
    }
  } else if (rawOptions && typeof rawOptions === "object") {
    storedOptions = rawOptions;
  }

  const siteLanguage = document.documentElement ? document.documentElement.lang : "en";
  const { options, filters, language, hideAnInfoBox, keyWords } = hydrateOptions(
    storedOptions,
    siteLanguage
  );

  state.options = options;
  state.filters = filters;
  state.language = language;
  state.hideAnInfoBox = hideAnInfoBox;
  state.optionsReady = true;

  const dictionaries = buildDictionaries();
  state.dictionarySponsored = dictionaries.dictionarySponsored;
  state.dictionaryReelsAndShortVideos = dictionaries.dictionaryReelsAndShortVideos;
  state.dictionaryFollow = dictionaries.dictionaryFollow;

  return { options, filters, keyWords };
}

function setFeedSettings(state, options, forceUpdate = false) {
  if (!state || !options) {
    return false;
  }

  if (state.prevURL !== window.location.href || forceUpdate) {
    state.prevURL = window.location.href;
    state.prevPathname = window.location.pathname;
    state.prevQuery = window.location.search;

    state.isNF = false;
    state.isGF = false;
    state.isVF = false;
    state.isMF = false;
    state.isSF = false;
    state.isRF = false;
    state.isPP = false;
    state.gfType = "";
    state.vfType = "";
    state.mpType = "";

    if (state.prevPathname === "/" || state.prevPathname === "/home.php") {
      if (state.prevQuery.indexOf("?filter=groups") < 0) {
        state.isNF = true;
      } else {
        state.isGF = true;
        state.gfType = "groups-recent";
      }
    } else if (state.prevPathname.includes("/groups/")) {
      state.isGF = true;
      if (state.prevPathname.includes("/groups/feed")) {
        state.gfType = "groups";
      } else if (state.prevPathname.includes("/groups/search")) {
        state.gfType = "search";
      } else if (state.prevPathname.includes("?filter=groups&sk=h_chr")) {
        state.gfType = "groups-recent";
      } else {
        state.gfType = "group";
      }
    } else if (state.prevPathname.includes("/watch")) {
      state.isVF = true;
      if (state.prevPathname.includes("/watch/search")) {
        state.vfType = "search";
      } else if (state.prevQuery.includes("?ref=seach")) {
        state.vfType = "item";
      } else if (state.prevQuery.includes("?v=")) {
        state.vfType = "item";
      } else {
        state.vfType = "videos";
      }
    } else if (state.prevPathname.includes("/marketplace")) {
      state.isMF = true;
      if (state.isMF && state.prevPathname.includes("/item/")) {
        state.mpType = "item";
      } else if (state.prevPathname.includes("/search")) {
        state.mpType = "search";
      } else if (state.prevPathname.includes("/category/")) {
        state.mpType = "category";
      } else {
        const urlBits = state.prevPathname.split("/");
        if (urlBits.length > 3) {
          state.mpType = "category";
        } else {
          state.mpType = "marketplace";
        }
      }
    } else if (state.prevPathname.includes("/commerce/listing/")) {
      state.isMF = true;
      state.mpType = "item";
    } else if (
      ["/search/top/", "/search/top", "/search/posts/", "/search/posts", "/search/pages/"].includes(
        state.prevPathname
      )
    ) {
      state.isSF = true;
    } else if (state.prevPathname.includes("/reel/")) {
      state.isRF = options.REELS_CONTROLS === true || options.REELS_DISABLE_LOOPING === true;
    } else if (state.prevPathname.includes("/profile.php")) {
      state.isPP = true;
    } else if (
      state.prevPathname.substring(1).length > 1 &&
      state.prevPathname.substring(1).indexOf("/") < 0
    ) {
      state.isPP = true;
    }

    state.isAF =
      state.isNF || state.isGF || state.isVF || state.isMF || state.isSF || state.isRF || state.isPP;
    state.echoCount = 0;
    state.noChangeCounter = 0;

    return true;
  }

  return false;
}

function processPage(state, options, filters, keyWords, context, eventType = "timing") {
  if (!state.isAF) {
    return;
  }

  if (state.isNF) {
    mopNewsFeed(context);
  } else if (state.isGF) {
    mopGroupsFeed(context);
  } else if (state.isVF) {
    mopVideosFeed(context);
  } else if (state.isMF) {
    mopMarketplaceFeed(context);
  } else if (state.isSF) {
    mopSearchFeed(context);
  } else if (state.isRF) {
    mopReelsFeed(context, eventType === "timing" ? "sleeping" : eventType);
  } else if (state.isPP) {
    mopProfileFeed(context);
  }
}

function startLoop(state, options, filters, keyWords, context) {
  let prevScrollY = window.scrollY;
  let lastCleaningTime = 0;
  let sleepDuration = 50;

  const run = (eventType = "timing") => {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - lastCleaningTime;

    if (eventType === "url-changed") {
      setFeedSettings(state, options);
    } else if (eventType === "scrolling") {
      if (sleepDuration < 151) {
        return;
      }
    } else if (elapsedTime < sleepDuration) {
      return;
    }

    processPage(state, options, filters, keyWords, context, eventType);

    if (state.isAF) {
      if (state.noChangeCounter < 16) {
        sleepDuration = 50;
      } else if (state.noChangeCounter < 31) {
        sleepDuration = 75;
      } else if (state.noChangeCounter < 46) {
        sleepDuration = 100;
      } else if (state.noChangeCounter < 61) {
        sleepDuration = 150;
      } else {
        sleepDuration = 1000;
      }
    }

    lastCleaningTime = currentTime;
    setTimeout(run, sleepDuration);
  };

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const scrollingDistance = Math.abs(currentScrollY - prevScrollY);
    prevScrollY = currentScrollY;
    if (scrollingDistance > 20) {
      run("scrolling");
    }
  });

  window.addEventListener("popstate", () => {
    run("url-changed");
  });

  setInterval(() => {
    if (state.prevURL !== window.location.href) {
      run("url-changed");
    }
  }, 500);

  run("url-changed");
}

async function startUserscript() {
  const state = createState();
  state.iconClose = ICON_CLOSE;
  state.logoHTML = LOGO_HTML;
  state.iconNewWindow = ICON_NEW_WINDOW;
  const unsafeWindowRef =
    typeof globalThis !== "undefined" ? globalThis.unsafeWindow : undefined;
  state.isChromium =
    !!(unsafeWindowRef && unsafeWindowRef.chrome) && /Chrome|CriOS/.test(navigator.userAgent);

  initializeRuntimeAttributes(state);

  const { options, filters, keyWords } = await loadOptions(state);
  const context = { state, options, filters, keyWords, pathInfo };

  addCSS(state, options, defaults);
  setTimeout(() => addExtraCSS(state, options, defaults), 150);

  setFeedSettings(state, options, true);

  initDialog(context, {
    setFeedSettings: (forceUpdate) => setFeedSettings(state, context.options, forceUpdate),
    rerunFeeds: (reason) =>
      processPage(state, context.options, context.filters, context.keyWords, context, reason),
  });

  const gm = typeof globalThis !== "undefined" ? globalThis.GM : undefined;
  if (gm && typeof gm.registerMenuCommand === "function") {
    gm.registerMenuCommand(context.keyWords.GM_MENU_SETTINGS, () => toggleDialog(state));
  }

  startLoop(state, options, filters, keyWords, context);
}

startUserscript();
