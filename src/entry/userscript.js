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
const { buildIconHTML } = require("../ui/icon-html");
const { initDialog, toggleDialog } = require("../ui/dialog/dialog");
const { getOptions } = require("../storage/idb");
const {
    aboutIcon,
    bugIcon,
    checkIcon,
    exportIcon,
  groupsIcon,
  importIcon,
  infoIcon,
  marketplaceIcon,
  mopIcon,
  newsIcon,
  prefIcon,
  profileIcon,
  reelsIcon,
  resetIcon,
  saveIcon,
  searchIcon,
  videosIcon,
} = require("../core/assets");

const ICON_CLOSE =
  '<svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M15.543 3.043a1 1 0 1 1 1.414 1.414L11.414 10l5.543 5.542a1 1 0 0 1-1.414 1.415L10 11.414l-5.543 5.543a1 1 0 0 1-1.414-1.415L8.586 10 3.043 4.457a1 1 0 1 1 1.414-1.414L10 8.586z"/></svg>';
const ICON_NEW_WINDOW =
  '<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><title>Open post in a new window</title><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
const ICON_TOGGLE_HTML = buildIconHTML(mopIcon, "cmf-icon--toggle");
const ICON_DIALOG_HEADER_HTML = buildIconHTML(mopIcon, "cmf-icon--dialog-header");
const ICON_DIALOG_SEARCH_HTML = buildIconHTML(searchIcon, "cmf-icon--dialog-search");
const ICON_DIALOG_FOOTER_HTML = buildIconHTML(mopIcon, "cmf-icon--dialog-footer");
const ICON_LEGEND_HTML = buildIconHTML(mopIcon, "cmf-icon--legend");
  const ICON_FOOTER_SAVE_HTML = buildIconHTML(saveIcon, "cmf-icon--footer-save");
  const ICON_FOOTER_CHECK_HTML = buildIconHTML(checkIcon, "cmf-icon--footer-check");
  const ICON_FOOTER_EXPORT_HTML = buildIconHTML(exportIcon, "cmf-icon--footer-export");
const ICON_FOOTER_IMPORT_HTML = buildIconHTML(importIcon, "cmf-icon--footer-import");
const ICON_FOOTER_RESET_HTML = buildIconHTML(resetIcon, "cmf-icon--footer-reset");
const ICON_LEGEND_NEWS_HTML = buildIconHTML(newsIcon, "cmf-icon--legend-news");
const ICON_LEGEND_GROUPS_HTML = buildIconHTML(groupsIcon, "cmf-icon--legend-groups");
const ICON_LEGEND_MARKETPLACE_HTML = buildIconHTML(marketplaceIcon, "cmf-icon--legend-marketplace");
const ICON_LEGEND_VIDEOS_HTML = buildIconHTML(videosIcon, "cmf-icon--legend-videos");
const ICON_LEGEND_PROFILE_HTML = buildIconHTML(profileIcon, "cmf-icon--legend-profile");
const ICON_LEGEND_OTHER_HTML = buildIconHTML(infoIcon, "cmf-icon--legend-other");
const ICON_LEGEND_REELS_HTML = buildIconHTML(reelsIcon, "cmf-icon--legend-reels");
const ICON_LEGEND_PREFERENCES_HTML = buildIconHTML(prefIcon, "cmf-icon--legend-preferences");
const ICON_LEGEND_REPORT_BUG_HTML = buildIconHTML(bugIcon, "cmf-icon--legend-report-bug");
const ICON_LEGEND_TIPS_HTML = buildIconHTML(aboutIcon, "cmf-icon--legend-tips");

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
      state.isNF ||
      state.isGF ||
      state.isVF ||
      state.isMF ||
      state.isSF ||
      state.isRF ||
      state.isPP;
    state.echoCount = 0;
    state.noChangeCounter = 0;
    if (state.btnToggleEl) {
      if (state.isAF) {
        state.btnToggleEl.setAttribute(state.showAtt, "");
      } else {
        state.btnToggleEl.removeAttribute(state.showAtt);
      }
    }

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
  state.iconToggleHTML = ICON_TOGGLE_HTML;
  state.iconDialogHeaderHTML = ICON_DIALOG_HEADER_HTML;
    state.iconDialogSearchHTML = ICON_DIALOG_SEARCH_HTML;
    state.iconDialogFooterHTML = ICON_DIALOG_FOOTER_HTML;
    state.iconFooterSaveHTML = ICON_FOOTER_SAVE_HTML;
    state.iconFooterCheckHTML = ICON_FOOTER_CHECK_HTML;
  state.iconLegendHTML = ICON_LEGEND_HTML;
  state.dialogSectionIcons = {
    DLG_NF: ICON_LEGEND_NEWS_HTML,
    DLG_GF: ICON_LEGEND_GROUPS_HTML,
    DLG_MP: ICON_LEGEND_MARKETPLACE_HTML,
    DLG_VF: ICON_LEGEND_VIDEOS_HTML,
    DLG_PP: ICON_LEGEND_PROFILE_HTML,
    DLG_OTHER: ICON_LEGEND_OTHER_HTML,
    REELS_TITLE: ICON_LEGEND_REELS_HTML,
    DLG_PREFERENCES: ICON_LEGEND_PREFERENCES_HTML,
    DLG_REPORT_BUG: ICON_LEGEND_REPORT_BUG_HTML,
    DLG_TIPS: ICON_LEGEND_TIPS_HTML,
  };
    state.dialogFooterIcons = {
      BTNSave: ICON_FOOTER_SAVE_HTML,
    BTNExport: ICON_FOOTER_EXPORT_HTML,
    BTNImport: ICON_FOOTER_IMPORT_HTML,
    BTNReset: ICON_FOOTER_RESET_HTML,
  };
  state.iconNewWindow = ICON_NEW_WINDOW;
  const unsafeWindowRef = typeof globalThis !== "undefined" ? globalThis.unsafeWindow : undefined;
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
