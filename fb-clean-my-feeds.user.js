// ==UserScript==
// @name         FB - Clean my feeds (6.1.2)
// @description  Hide Sponsored and Suggested posts in FB's News Feed, Groups Feed, Watch Videos Feed and Marketplace Feed
// @namespace    https://greasyfork.org/en/users/1357440
// @supportURL   https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/issues
// @version      6.1.2
// @author       Artificial Sweetener - Current Maintainer (https://github.com/Artificial-Sweetener/)
// @author       zbluebugz - Founder (https://github.com/zbluebugz/)
// @author       Quoc Viet Rtinh - Simplified UI Branch (merged/forked from) (https://github.com/trinhquocviet/)
// @match        https://www.facebook.com/*
// @match        https://web.facebook.com/*
// @match        https://facebook.com/*
// @noframes
// @grant        GM.registerMenuCommand
// @grant        GM.info
// @grant        unsafeWindow
// @license      GPL-3.0-only; https://www.gnu.org/licenses/gpl-3.0.html
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAIVBMVEVMaXH7/PzGyMivsLH19fXU1dbd3uDl5ubv8PDr6+v///8zVrECAAAACnRSTlMA/UMo8WaEotq+aCzdfQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAw9JREFUeNqdl9uS4yoMRZckIGH+/1/lGITOQ3r6TGbciRPyEMpVkhdo62LjrXVpsh6f2Hv2JsajB33H3gL/+1l5x0Ex73vyMYEFoPE5gZV/Ad4hMP1N8SGB6gHAWwRHAG+s+kt+yb/vO09QgOv63IFuwO3Y77kTmPdcfExgOzD5nKCY9zX4mMACCD4nsPIDwFkCBRafE9RDFb9BoAd5/LXkjHmJvIyMT49gUlbZCT49QmnebNmTFHklAcPpyacEWbz3YxmfINCq+6a5/aCil1FoZZeCYyX3TxxcbJciOesYTwvdz+/3quqSRtH1HoGp3mploSwRpqi/EYV6ua6alvhNHdkgNTkbBTNVYKyq+0W9u+GdUbkc3+PfBE3KDU9dVV0nOO1iO20R5aqvL7HWiCtyKxQvpXhP3bXqsgwT1fn8CGZhrCWxWmGJiIPFNVigjCWtjqcOiuVsMGCftkrxzsy2NRZsuuJ6FDN93FeaAqyRuvC5Z6CsyCJclHyuA1Wd2nYb6/f9hOmwXIDWaKztlZBUsil+kUhCAguMNJGoSzT3eKUDtdtQQykws0CB6ABT9+O6/ODAWtBiyBSZdzsA3GzNLkOOPDw4SCDLajFANkOAJGTN1iFFXktZEaKV4lZkkYBSMm/qtsp6mQtCsgyH/iDSrQ9NK0dBeHQQ62b3UP+RvD39Iot2q/I6G7PPWfrd/v7Xfe5dNlJPFRRblllstDtEhzWQELQ5PW4vszFb1ZHBRMa1Vi9zr02SvHqfdcXrdA5BL6MpA8kgVGrcanTvzBrrVE2sFYAx1MrWc6eJ0wG2daoqr5BpkNb2LCPKrE4Hr/tRMh50psZkK+yaktk2695fDcB/j0OjaUaravMi1WcHr06Vca43JihWAen3UHrvdP+hhfzrIGb/1mEHvIN3/2nIkoOBpP1x6u+t97mf60xR7slw//XvHXm2N3Y5JhhnB804JOh+esxTbV/S+5/A6YfV4Li912z+HYR7aeis/fyoOzQfbIHd5nprwNCvNge4FZnrx6+1JzOSJQaBPP3U+w836Imm1xDP2QAAAABJRU5ErkJggg==
// @icon64       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAIVBMVEVMaXH7/PzGyMivsLH19fXU1dbd3uDl5ubv8PDr6+v///8zVrECAAAACnRSTlMA/UMo8WaEotq+aCzdfQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAw9JREFUeNqdl9uS4yoMRZckIGH+/1/lGITOQ3r6TGbciRPyEMpVkhdo62LjrXVpsh6f2Hv2JsajB33H3gL/+1l5x0Ex73vyMYEFoPE5gZV/Ad4hMP1N8SGB6gHAWwRHAG+s+kt+yb/vO09QgOv63IFuwO3Y77kTmPdcfExgOzD5nKCY9zX4mMACCD4nsPIDwFkCBRafE9RDFb9BoAd5/LXkjHmJvIyMT49gUlbZCT49QmnebNmTFHklAcPpyacEWbz3YxmfINCq+6a5/aCil1FoZZeCYyX3TxxcbJciOesYTwvdz+/3quqSRtH1HoGp3mploSwRpqi/EYV6ua6alvhNHdkgNTkbBTNVYKyq+0W9u+GdUbkc3+PfBE3KDU9dVV0nOO1iO20R5aqvL7HWiCtyKxQvpXhP3bXqsgwT1fn8CGZhrCWxWmGJiIPFNVigjCWtjqcOiuVsMGCftkrxzsy2NRZsuuJ6FDN93FeaAqyRuvC5Z6CsyCJclHyuA1Wd2nYb6/f9hOmwXIDWaKztlZBUsil+kUhCAguMNJGoSzT3eKUDtdtQQykws0CB6ABT9+O6/ODAWtBiyBSZdzsA3GzNLkOOPDw4SCDLajFANkOAJGTN1iFFXktZEaKV4lZkkYBSMm/qtsp6mQtCsgyH/iDSrQ9NK0dBeHQQ62b3UP+RvD39Iot2q/I6G7PPWfrd/v7Xfe5dNlJPFRRblllstDtEhzWQELQ5PW4vszFb1ZHBRMa1Vi9zr02SvHqfdcXrdA5BL6MpA8kgVGrcanTvzBrrVE2sFYAx1MrWc6eJ0wG2daoqr5BpkNb2LCPKrE4Hr/tRMh50psZkK+yaktk2695fDcB/j0OjaUaravMi1WcHr06Vca43JihWAen3UHrvdP+hhfzrIGb/1mEHvIN3/2nIkoOBpP1x6u+t97mf60xR7slw//XvHXm2N3Y5JhhnB804JOh+esxTbV/S+5/A6YfV4Li912z+HYR7aeis/fyoOzQfbIHd5nprwNCvNge4FZnrx6+1JzOSJQaBPP3U+w836Imm1xDP2QAAAABJRU5ErkJggg==
// @run-at       document-start
// ==/UserScript==

(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/ui/i18n/translations.js
  var require_translations = __commonJS({
    "src/ui/i18n/translations.js"(exports, module) {
      module.exports = {
        translations: {
          // - NF_ = News Feed
          // - GF_ = Groups Feed
          // - VF_ = Videos Feed
          // - MP_ = Marketplace Feed
          // - PP_ = Person/Page Profile
          // - DLG_ = CMF's Dialog box
          // - CMF_ = CMF's Dialog box
          // - GM_ = Userscript manager
          // -- English
          en: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Sponsored",
            NF_TABLIST_STORIES_REELS_ROOMS: '"Stories | Reels | Rooms" tabs list box',
            NF_STORIES: "Stories",
            NF_TOP_CARDS_PAGES: "Top Cards (for Pages)",
            NF_HIDE_VERIFIED_BADGE: "Hide verified badges",
            NF_FILTER_VERIFIED_BADGE: "Filter verified accounts",
            NF_AI_SIDE_PANELS: "AI in Side Panels",
            NF_SURVEY: "Survey",
            NF_PEOPLE_YOU_MAY_KNOW: "People you may know",
            NF_PAID_PARTNERSHIP: "Paid partnership",
            NF_SPONSORED_PAID: "Sponsored \xB7 Paid for by ______",
            NF_SUGGESTIONS: "Suggestions / Recommendations",
            NF_FOLLOW: "Follow",
            NF_PARTICIPATE: "Participate / Join",
            NF_REELS_SHORT_VIDEOS: "Reels and short videos",
            NF_SHORT_REEL_VIDEO: "Reel/short video",
            NF_META_AI: "Try Meta AI",
            NF_EVENTS_YOU_MAY_LIKE: "Events you may like",
            NF_ANIMATED_GIFS_POSTS: "Animated GIFs",
            NF_ANIMATED_GIFS_PAUSE: "Pause animated GIFs",
            NF_SHARES: "# shares",
            NF_LIKES_MAXIMUM: "Maximum number of Likes",
            GF_PAID_PARTNERSHIP: "Paid partnership",
            GF_SUGGESTIONS: "Suggestions / Recommendations",
            GF_SHORT_REEL_VIDEO: "Reel/short video",
            GF_ANIMATED_GIFS_POSTS: "Animated GIFs",
            GF_ANIMATED_GIFS_PAUSE: "Pause animated GIFs",
            GF_SHARES: "# shares",
            VF_LIVE: "LIVE",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Duplicate video",
            VF_ANIMATED_GIFS_PAUSE: "Pause animated GIFs",
            PP_ANIMATED_GIFS_POSTS: "Animated GIFs",
            PP_ANIMATED_GIFS_PAUSE: "Pause animated GIFs",
            NF_BLOCKED_FEED: ["News Feed", "Groups Feed", "Videos Feed"],
            GF_BLOCKED_FEED: ["News Feed", "Groups Feed", "Videos Feed"],
            VF_BLOCKED_FEED: ["News Feed", "Groups Feed", "Videos Feed"],
            MP_BLOCKED_FEED: ["Marketplace Feed"],
            PP_BLOCKED_FEED: ["Profile page"],
            OTHER_INFO_BOX_CORONAVIRUS: "Coronavirus (information box)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Climate Science (information box)",
            OTHER_INFO_BOX_SUBSCRIBE: "Subscribe (information box)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Playback controls and looping.",
            REELS_CONTROLS: "Show video controls",
            REELS_DISABLE_LOOPING: "Disable looping",
            DLG_TITLE: "Clean My Feeds",
            DLG_NF: "News Feed",
            DLG_NF_DESC: "Clean up suggestions and set how strict the feed feels.",
            DLG_GF: "Groups Feed",
            DLG_GF_DESC: "Tidy group feeds by trimming extras and noisy bits.",
            DLG_VF: "Videos Feed",
            DLG_VF_DESC: "Keep video feeds focused by reducing repeats and clutter.",
            DLG_MP: "Marketplace Feed",
            DLG_MP_DESC: "Filter listings by price and words you care about.",
            DLG_PP: "Profile / Page",
            DLG_PP_DESC: "Tune what shows on profiles and pages.",
            DLG_OTHER: "Supplementary Notes",
            DLG_OTHER_DESC: "Hide extra boxes you don\u2019t want.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Text filter",
            DLG_BLOCK_NEW_LINE: "(Separate words or phrases with a line break, Regular Expressions are supported)",
            NF_BLOCKED_ENABLED: "Enabled",
            GF_BLOCKED_ENABLED: "Enabled",
            VF_BLOCKED_ENABLED: "Enabled",
            MP_BLOCKED_ENABLED: "Enabled",
            PP_BLOCKED_ENABLED: "Enabled",
            NF_BLOCKED_RE: "Regular Expressions (RegExp)",
            GF_BLOCKED_RE: "Regular Expressions (RegExp)",
            VF_BLOCKED_RE: "Regular Expressions (RegExp)",
            MP_BLOCKED_RE: "Regular Expressions (RegExp)",
            PP_BLOCKED_RE: "Regular Expressions (RegExp)",
            DLG_VERBOSITY: "Options for Hidden Posts",
            DLG_PREFERENCES: "Preferences",
            DLG_PREFERENCES_DESC: "Labels, placement, colors, and language.",
            DLG_REPORT_BUG: "Report a Bug",
            DLG_REPORT_BUG_DESC: "Generate a diagnostic report for issues.",
            DLG_REPORT_BUG_NOTICE: "Help us fix it:\n1. Scroll so the problematic post is visible.\n2. Click 'Generate report' then 'Copy report'.\n3. Click 'Open issues' and paste the report into a new issue.\n4. Add a short description of the problem.\n(We redact names/text, but please review before sharing!)",
            DLG_REPORT_BUG_GENERATE: "Generate report",
            DLG_REPORT_BUG_COPY: "Copy report",
            DLG_REPORT_BUG_OPEN_ISSUES: "Open issues",
            DLG_REPORT_BUG_STATUS_READY: "Report ready.",
            DLG_REPORT_BUG_STATUS_COPIED: "Report copied to clipboard.",
            DLG_REPORT_BUG_STATUS_FAILED: "Copy failed. Please copy manually.",
            DLG_VERBOSITY_CAPTION: "Show a label if a post is hidden",
            VERBOSITY_MESSAGE: [
              "no label",
              "Post hidden. Rule: ",
              " posts hidden",
              "7 posts hidden ~ (Groups Feed only)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Text colour",
            VERBOSITY_MESSAGE_BG_COLOUR: "Background colour",
            VERBOSITY_DEBUG: 'Highlight "hidden" posts',
            CMF_CUSTOMISATIONS: "Customisations",
            CMF_BTN_LOCATION: "Location of CMF button:",
            CMF_BTN_OPTION: [
              "bottom left",
              "top right",
              'disabled (use "Settings" in User Script Commands menu")'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds Language:",
            CMF_DIALOG_LANGUAGE: "English",
            CMF_DIALOG_LANGUAGE_DEFAULT: "Use site language",
            GM_MENU_SETTINGS: "Settings",
            CMF_DIALOG_LOCATION: "Location of this menu:",
            CMF_DIALOG_OPTION: ["left side", "right side"],
            CMF_BORDER_COLOUR: "Border colour",
            DLG_TIPS: "About",
            DLG_TIPS_DESC: "Project links and maintainer info.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "If it helps, a star on {github} would mean a lot.",
            DLG_TIPS_FACEBOOK: "Come say hi on {facebook} page - I share my art and poetry there.",
            DLG_TIPS_SITE: "If you want to see what I'm up to around the web, {site} is the best place to start.",
            DLG_TIPS_CREDITS: "Special thanks to {zbluebugz} for the original project, and to {trinhquocviet} for the simplified UI branch I originally forked from - plus the filter maintenance during that stretch.",
            DLG_TIPS_MAINTAINER: "I hope this script helps you reclaim your feed. I promise to be your ally in the fight against stuff you don't want to see online.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "my Facebook",
            DLG_TIPS_LINK_SITE: "my website",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Save", "Close", "Export", "Import", "Reset"],
            DLG_BUTTON_TOOLTIPS: [
              "Save changes to this browser. Clearing site data/private mode removes them.",
              "Export a backup file to keep settings safe and move between devices.",
              "Import a settings file to restore or move your setup.",
              "Reset all settings to defaults."
            ],
            DLG_FB_COLOUR_HINT: "Leave blank to use FB's colour scheme"
          },
          // -- العربية (Arabic)
          ar: {
            LANGUAGE_DIRECTION: "rtl",
            SPONSORED: "\u0645\u064F\u0645\u0648\u064E\u0651\u0644",
            NF_TABLIST_STORIES_REELS_ROOMS: '"\u0627\u0644\u0642\u0635\u0635 | \u0631\u064A\u0644\u0632 | \u0627\u0644\u063A\u0631\u0641" \u0645\u0631\u0628\u0639 \u0642\u0627\u0626\u0645\u0629 \u0639\u0644\u0627\u0645\u0627\u062A \u062A\u0628\u0648\u064A\u0628',
            NF_STORIES: "\u0627\u0644\u0642\u0635\u0635",
            NF_TOP_CARDS_PAGES: "\u0628\u0637\u0627\u0642\u0627\u062A \u0641\u064A \u0627\u0644\u0623\u0639\u0644\u0649 (\u0644\u0644\u0635\u0641\u062D\u0627\u062A)",
            NF_META_AI: "\u062C\u0631\u0651\u0628 Meta AI",
            NF_HIDE_VERIFIED_BADGE: "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0634\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0648\u062B\u0642\u0629",
            NF_FILTER_VERIFIED_BADGE: "\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0645\u0648\u062B\u0642\u0629",
            NF_AI_SIDE_PANELS: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0641\u064A \u0627\u0644\u0644\u0648\u062D\u0627\u062A \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0629",
            NF_SURVEY: "\u0627\u0633\u062A\u0628\u064A\u0627\u0646",
            NF_PEOPLE_YOU_MAY_KNOW: "\u0623\u0634\u062E\u0627\u0635 \u0642\u062F \u062A\u0639\u0631\u0641\u0647\u0645",
            NF_PAID_PARTNERSHIP: "\u0634\u0631\u0627\u0643\u0629 \u0645\u062F\u0641\u0648\u0639\u0629",
            NF_SPONSORED_PAID: "\u0628\u0631\u0639\u0627\u064A\u0629 \xB7 \u0645\u062F\u0641\u0648\u0639\u0629 \u0628\u0648\u0627\u0633\u0637\u0629 ______",
            NF_SUGGESTIONS: "\u0627\u0644\u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A / \u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A",
            NF_FOLLOW: "\u062A\u0627\u0628\u0639",
            NF_PARTICIPATE: "\u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629",
            NF_REELS_SHORT_VIDEOS: "\u0631\u064A\u0644\u0632 \u0648\u0645\u0642\u0627\u0637\u0639 \u0627\u0644\u0641\u064A\u062F\u064A\u0648 \u0627\u0644\u0642\u0635\u064A\u0631\u0629",
            NF_SHORT_REEL_VIDEO: "\u0628\u0643\u0631\u0629 / \u0641\u064A\u062F\u064A\u0648 \u0642\u0635\u064A\u0631",
            NF_EVENTS_YOU_MAY_LIKE: "\u0623\u062D\u062F\u0627\u062B \u0642\u062F \u062A\u0639\u062C\u0628\u0643",
            NF_ANIMATED_GIFS_POSTS: "\u0635\u0648\u0631 GIF \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629",
            NF_ANIMATED_GIFS_PAUSE: "\u0648\u0642\u0641\u0629 \u0645\u0644\u0641\u0627\u062A GIF \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629",
            NF_SHARES: "# \u0645\u0634\u0627\u0631\u0643\u0627\u062A",
            NF_LIKES_MAXIMUM: "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0639\u062F\u062F \u0627\u0644\u0625\u0639\u062C\u0627\u0628\u0627\u062A",
            GF_PAID_PARTNERSHIP: "\u0634\u0631\u0627\u0643\u0629 \u0645\u062F\u0641\u0648\u0639\u0629",
            GF_SUGGESTIONS: "\u0627\u0644\u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A / \u0627\u0644\u062A\u0648\u0635\u064A\u0627\u062A",
            GF_SHORT_REEL_VIDEO: "\u0628\u0643\u0631\u0629 / \u0641\u064A\u062F\u064A\u0648 \u0642\u0635\u064A\u0631",
            GF_ANIMATED_GIFS_POSTS: "\u0635\u0648\u0631 GIF \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629",
            GF_ANIMATED_GIFS_PAUSE: "\u0648\u0642\u0641\u0629 \u0645\u0644\u0641\u0627\u062A GIF \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629",
            GF_SHARES: "# \u0645\u0634\u0627\u0631\u0643\u0627\u062A",
            VF_LIVE: "\u0645\u0628\u0627\u0634\u0631",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "\u0641\u064A\u062F\u064A\u0648 \u0645\u0643\u0631\u0631",
            VF_ANIMATED_GIFS_PAUSE: "\u0648\u0642\u0641\u0629 \u0645\u0644\u0641\u0627\u062A GIF \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629",
            PP_ANIMATED_GIFS_POSTS: "\u0635\u0648\u0631 GIF \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629",
            PP_ANIMATED_GIFS_PAUSE: "\u0648\u0642\u0641\u0629 \u0645\u0644\u0641\u0627\u062A GIF \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629",
            NF_BLOCKED_FEED: ["\u0645\u0648\u062C\u0632 \u0627\u0644\u0623\u062E\u0628\u0627\u0631", "\u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A", "\u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u0641\u064A\u062F\u064A\u0648"],
            GF_BLOCKED_FEED: ["\u0645\u0648\u062C\u0632 \u0627\u0644\u0623\u062E\u0628\u0627\u0631", "\u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A", "\u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u0641\u064A\u062F\u064A\u0648"],
            VF_BLOCKED_FEED: ["\u0645\u0648\u062C\u0632 \u0627\u0644\u0623\u062E\u0628\u0627\u0631", "\u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A", "\u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u0641\u064A\u062F\u064A\u0648"],
            MP_BLOCKED_FEED: ["\u0627\u0644\u0633\u0648\u0642 \u062A\u063A\u0630\u064A\u0629"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "\u0641\u064A\u0631\u0648\u0633 \u0643\u0648\u0631\u0648\u0646\u0627 (\u0635\u0646\u062F\u0648\u0642 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "\u0639\u0644\u0648\u0645 \u0627\u0644\u0645\u0646\u0627\u062E (\u0635\u0646\u062F\u0648\u0642 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A)",
            OTHER_INFO_BOX_SUBSCRIBE: "(\u0635\u0646\u062F\u0648\u0642 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A) \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643",
            REELS_TITLE: "\u0631\u064A\u0644\u0632",
            // -- FB's label
            DLG_REELS_DESC: "\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u062A\u062D\u0643\u0645 \u0641\u064A \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0648\u0627\u0644\u062A\u0643\u0631\u0627\u0631.",
            REELS_CONTROLS: "\u0639\u0631\u0636 \u0623\u062F\u0648\u0627\u062A \u0627\u0644\u062A\u062D\u0643\u0645 \u0641\u064A \u0627\u0644\u0641\u064A\u062F\u064A\u0648",
            REELS_DISABLE_LOOPING: "\u062A\u0639\u0637\u064A\u0644 \u0627\u0644\u062A\u0643\u0631\u0627\u0631",
            DLG_TITLE: "\u062A\u0646\u0638\u064A\u0641 \u062E\u0644\u0627\u0635\u0627\u062A\u064A",
            DLG_NF: "\u0627\u0644\u0623\u062E\u0628\u0627\u0631 \u062A\u063A\u0630\u064A\u0629",
            DLG_NF_DESC: "\u062A\u0646\u0638\u064A\u0641 \u0627\u0644\u0627\u0642\u062A\u0631\u0627\u062D\u0627\u062A \u0648\u062A\u062D\u062F\u064A\u062F \u0645\u062F\u0649 \u0635\u0631\u0627\u0645\u0629 \u0627\u0644\u062E\u0644\u0627\u0635\u0629.",
            DLG_GF: "\u0645\u062C\u0645\u0648\u0639\u0627\u062A \u062A\u063A\u0630\u064A\u0629",
            DLG_GF_DESC: "\u062A\u0646\u0638\u064A\u0641 \u062E\u0644\u0627\u0635\u0627\u062A \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A \u0628\u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u0632\u0648\u0627\u0626\u062F \u0648\u0627\u0644\u0636\u062C\u064A\u062C.",
            DLG_VF: "\u0627\u0644\u0641\u064A\u062F\u064A\u0648 \u062A\u063A\u0630\u064A\u0629",
            DLG_VF_DESC: "\u0627\u062C\u0639\u0644 \u062E\u0644\u0627\u0635\u0629 \u0627\u0644\u0641\u064A\u062F\u064A\u0648 \u0623\u0643\u062B\u0631 \u062A\u0631\u0643\u064A\u0632\u064B\u0627 \u0628\u062A\u0642\u0644\u064A\u0644 \u0627\u0644\u062A\u0643\u0631\u0627\u0631 \u0648\u0627\u0644\u0627\u0632\u062F\u062D\u0627\u0645.",
            DLG_MP: "\u0627\u0644\u0633\u0648\u0642 \u062A\u063A\u0630\u064A\u0629",
            DLG_MP_DESC: "\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0642\u0648\u0627\u0626\u0645 \u062D\u0633\u0628 \u0627\u0644\u0633\u0639\u0631 \u0648\u0627\u0644\u0643\u0644\u0645\u0627\u062A \u0627\u0644\u062A\u064A \u062A\u0647\u0645\u0643.",
            DLG_PP: "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A / \u0627\u0644\u0635\u0641\u062D\u0629",
            DLG_PP_DESC: "\u0627\u0636\u0628\u0637 \u0645\u0627 \u064A\u0638\u0647\u0631 \u0641\u064A \u0627\u0644\u0645\u0644\u0641\u0627\u062A \u0627\u0644\u0634\u062E\u0635\u064A\u0629 \u0648\u0627\u0644\u0635\u0641\u062D\u0627\u062A.",
            DLG_OTHER: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629",
            DLG_OTHER_DESC: "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0635\u0646\u0627\u062F\u064A\u0642 \u0627\u0644\u0625\u0636\u0627\u0641\u064A\u0629 \u0627\u0644\u062A\u064A \u0644\u0627 \u062A\u0631\u064A\u062F\u0647\u0627.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "\u0645\u0631\u0634\u062D \u0627\u0644\u0646\u0635",
            DLG_BLOCK_NEW_LINE: "(\u0627\u0641\u0635\u0644 \u0627\u0644\u0643\u0644\u0645\u0627\u062A \u0623\u0648 \u0627\u0644\u0639\u0628\u0627\u0631\u0627\u062A \u0628\u0641\u0627\u0635\u0644 \u0633\u0637\u0631\u060C \u064A\u062A\u0645 \u062F\u0639\u0645 \u0627\u0644\u062A\u0639\u0628\u064A\u0631\u0627\u062A \u0627\u0644\u0639\u0627\u062F\u064A\u0629)",
            NF_BLOCKED_ENABLED: "\u062A\u0645\u0643\u064A\u0646",
            GF_BLOCKED_ENABLED: "\u062A\u0645\u0643\u064A\u0646",
            VF_BLOCKED_ENABLED: "\u062A\u0645\u0643\u064A\u0646",
            MP_BLOCKED_ENABLED: "\u062A\u0645\u0643\u064A\u0646",
            PP_BLOCKED_ENABLED: "\u062A\u0645\u0643\u064A\u0646",
            NF_BLOCKED_RE: "\u0627\u0644\u062A\u0639\u0628\u064A\u0631\u0627\u062A \u0627\u0644\u0639\u0627\u062F\u064A\u0629 (RegExp)",
            GF_BLOCKED_RE: "\u0627\u0644\u062A\u0639\u0628\u064A\u0631\u0627\u062A \u0627\u0644\u0639\u0627\u062F\u064A\u0629 (RegExp)",
            VF_BLOCKED_RE: "\u0627\u0644\u062A\u0639\u0628\u064A\u0631\u0627\u062A \u0627\u0644\u0639\u0627\u062F\u064A\u0629 (RegExp)",
            MP_BLOCKED_RE: "\u0627\u0644\u062A\u0639\u0628\u064A\u0631\u0627\u062A \u0627\u0644\u0639\u0627\u062F\u064A\u0629 (RegExp)",
            PP_BLOCKED_RE: "\u0627\u0644\u062A\u0639\u0628\u064A\u0631\u0627\u062A \u0627\u0644\u0639\u0627\u062F\u064A\u0629 (RegExp)",
            DLG_VERBOSITY: "\u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0627\u062A \u0627\u0644\u0645\u062E\u0641\u064A\u0629",
            DLG_PREFERENCES: "\u0627\u0644\u062A\u0641\u0636\u064A\u0644\u0627\u062A",
            DLG_PREFERENCES_DESC: "\u0627\u0644\u062A\u0633\u0645\u064A\u0627\u062A\u060C \u0627\u0644\u0645\u0648\u0636\u0639\u060C \u0627\u0644\u0623\u0644\u0648\u0627\u0646\u060C \u0648\u0627\u0644\u0644\u063A\u0629.",
            DLG_REPORT_BUG: "\u0627\u0644\u0625\u0628\u0644\u0627\u063A \u0639\u0646 \u062E\u0637\u0623",
            DLG_REPORT_BUG_DESC: "\u0623\u0646\u0634\u0626 \u062A\u0642\u0631\u064A\u0631\u064B\u0627 \u062A\u0634\u062E\u064A\u0635\u064A\u064B\u0627 \u0644\u0644\u0645\u0634\u0643\u0644\u0627\u062A.",
            DLG_REPORT_BUG_NOTICE: "\u0633\u0627\u0639\u062F\u0646\u0627 \u0641\u064A \u0627\u0644\u0625\u0635\u0644\u0627\u062D:\n1. \u0645\u0631\u0631 \u0627\u0644\u0634\u0627\u0634\u0629 \u062D\u062A\u0649 \u064A\u0638\u0647\u0631 \u0627\u0644\u0645\u0646\u0634\u0648\u0631 \u0627\u0644\u0630\u064A \u0628\u0647 \u0645\u0634\u0643\u0644\u0629.\n2. \u0627\u0646\u0642\u0631 \u0639\u0644\u0649 '\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062A\u0642\u0631\u064A\u0631' \u062B\u0645 '\u0646\u0633\u062E \u0627\u0644\u062A\u0642\u0631\u064A\u0631'.\n3. \u0627\u0646\u0642\u0631 \u0639\u0644\u0649 '\u0641\u062A\u062D \u0627\u0644\u0628\u0644\u0627\u063A\u0627\u062A' \u0648\u0627\u0644\u0635\u0642 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0641\u064A \u0645\u0634\u0643\u0644\u0629 \u062C\u062F\u064A\u062F\u0629.\n4. \u0623\u0636\u0641 \u0648\u0635\u0641\u064B\u0627 \u0645\u0648\u062C\u0632\u064B\u0627 \u0644\u0644\u0645\u0634\u0643\u0644\u0629.\n(\u0646\u0642\u0648\u0645 \u0628\u062D\u062C\u0628 \u0627\u0644\u0623\u0633\u0645\u0627\u0621/\u0627\u0644\u0646\u0635\u0648\u0635\u060C \u0644\u0643\u0646 \u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0642\u0628\u0644 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629!)",
            DLG_REPORT_BUG_GENERATE: "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062A\u0642\u0631\u064A\u0631",
            DLG_REPORT_BUG_COPY: "\u0646\u0633\u062E \u0627\u0644\u062A\u0642\u0631\u064A\u0631",
            DLG_REPORT_BUG_OPEN_ISSUES: "\u0641\u062A\u062D \u0627\u0644\u0628\u0644\u0627\u063A\u0627\u062A",
            DLG_REPORT_BUG_STATUS_READY: "\u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u062C\u0627\u0647\u0632.",
            DLG_REPORT_BUG_STATUS_COPIED: "\u062A\u0645 \u0646\u0633\u062E \u0627\u0644\u062A\u0642\u0631\u064A\u0631.",
            DLG_REPORT_BUG_STATUS_FAILED: "\u0641\u0634\u0644 \u0627\u0644\u0646\u0633\u062E. \u0627\u0646\u0633\u062E \u064A\u062F\u0648\u064A\u064B\u0627.",
            DLG_VERBOSITY_CAPTION: "\u0625\u0638\u0647\u0627\u0631 \u0625\u0634\u0639\u0627\u0631 \u0628\u0639\u0631\u0636 \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062A \u0627\u0644\u0645\u062E\u0641\u064A\u0629",
            VERBOSITY_MESSAGE: [
              "\u0644\u0627 \u062A\u0633\u0645\u064A\u0629",
              "\u0645\u0634\u0627\u0631\u0643\u0629 \u0648\u0627\u062D\u062F\u0629 \u0645\u062E\u0641\u064A\u0629. \u062D\u0643\u0645: ",
              " \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0627\u062A \u0627\u0644\u0645\u062E\u0641\u064A\u0629",
              "7 \u0645\u0634\u0627\u0631\u0643\u0627\u062A \u0645\u062E\u0641\u064A\u0629 ~ (\u0641\u0642\u0637 \u0641\u064A \u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "\u0644\u0648\u0646 \u0627\u0644\u0646\u0635",
            VERBOSITY_MESSAGE_BG_COLOUR: "\u0644\u0648\u0646 \u0627\u0644\u062E\u0644\u0641\u064A\u0629",
            VERBOSITY_DEBUG: '\u062A\u0633\u0644\u064A\u0637 \u0627\u0644\u0636\u0648\u0621 \u0639\u0644\u0649 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0627\u062A "\u0627\u0644\u0645\u062E\u0641\u064A\u0629"',
            CMF_CUSTOMISATIONS: "\u0627\u0644\u062A\u062E\u0635\u064A\u0635\u0627\u062A",
            CMF_BTN_LOCATION: "\u0645\u0648\u0642\u0639 \u0632\u0631 CMF:",
            CMF_BTN_OPTION: [
              "\u0623\u0633\u0641\u0644 \u0627\u0644\u064A\u0633\u0627\u0631",
              "\u0623\u0639\u0644\u0649 \u0627\u0644\u064A\u0645\u064A\u0646",
              '\u0645\u0639\u0637\u0644 (\u0627\u0633\u062A\u062E\u062F\u0645 "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A" \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u0623\u0648\u0627\u0645\u0631 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C \u0627\u0644\u0646\u0635\u064A \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "\u0644\u063A\u0629 Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
            CMF_DIALOG_LANGUAGE_DEFAULT: "\u0627\u0633\u062A\u062E\u062F\u0645 \u0644\u063A\u0629 \u0627\u0644\u0645\u0648\u0642\u0639",
            GM_MENU_SETTINGS: "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A",
            CMF_DIALOG_LOCATION: "\u0645\u0648\u0642\u0639 \u0647\u0630\u0647 \u0627\u0644\u0642\u0627\u0626\u0645\u0629:",
            CMF_DIALOG_OPTION: ["\u0627\u0644\u062C\u0647\u0647 \u0627\u0644\u064A\u0633\u0631\u0649", "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0635\u062D\u064A\u062D"],
            CMF_BORDER_COLOUR: "\u0644\u0648\u0646 \u0627\u0644\u062D\u062F\u0648\u062F",
            DLG_TIPS: "\u062D\u0648\u0644",
            DLG_TIPS_DESC: "\u0631\u0648\u0627\u0628\u0637 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0648\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0645\u0634\u0631\u0641.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "\u0625\u0630\u0627 \u0643\u0627\u0646 \u0647\u0630\u0627 \u0645\u0641\u064A\u062F\u064B\u0627\u060C \u0641\u0625\u0646 \u0646\u062C\u0645\u0629 \u0639\u0644\u0649 {github} \u062A\u0639\u0646\u064A \u0627\u0644\u0643\u062B\u064A\u0631.",
            DLG_TIPS_FACEBOOK: "\u0642\u0644 \u0645\u0631\u062D\u0628\u064B\u0627 \u0639\u0644\u0649 {facebook} - \u0623\u0634\u0627\u0631\u0643 \u0647\u0646\u0627\u0643 \u0623\u0639\u0645\u0627\u0644\u064A \u0627\u0644\u0641\u0646\u064A\u0629 \u0648\u0634\u0639\u0631\u064A.",
            DLG_TIPS_SITE: "\u0625\u0630\u0627 \u0623\u0631\u062F\u062A \u0645\u0639\u0631\u0641\u0629 \u0645\u0627 \u0623\u0641\u0639\u0644\u0647 \u0639\u0644\u0649 \u0627\u0644\u0648\u064A\u0628\u060C \u0641\u0640{site} \u0647\u0648 \u0623\u0641\u0636\u0644 \u0645\u0643\u0627\u0646 \u0644\u0644\u0628\u062F\u0621.",
            DLG_TIPS_CREDITS: "\u0634\u0643\u0631 \u062E\u0627\u0635 \u0644\u0640 {zbluebugz} \u0639\u0644\u0649 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u0623\u0635\u0644\u064A\u060C \u0648\u0644\u0640 {trinhquocviet} \u0639\u0644\u0649 \u0641\u0631\u0639 \u0627\u0644\u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0645\u0628\u0633\u0637\u0629 \u0627\u0644\u0630\u064A \u0628\u062F\u0623\u062A \u0645\u0646\u0647 - \u0648\u0643\u0630\u0644\u0643 \u0639\u0644\u0649 \u0635\u064A\u0627\u0646\u0629 \u0627\u0644\u0641\u0644\u0627\u062A\u0631 \u062E\u0644\u0627\u0644 \u062A\u0644\u0643 \u0627\u0644\u0641\u062A\u0631\u0629.",
            DLG_TIPS_MAINTAINER_PREFIX: "\u0645\u0646 \u0627\u0644\u0645\u064F\u0634\u0631\u0641:",
            DLG_TIPS_MAINTAINER: "\u0622\u0645\u0644 \u0623\u0646 \u064A\u0633\u0627\u0639\u062F\u0643 \u0647\u0630\u0627 \u0627\u0644\u0633\u0643\u0631\u0628\u062A \u0639\u0644\u0649 \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u062A\u063A\u0630\u064A\u062A\u0643. \u0623\u0639\u062F\u0643 \u0623\u0646 \u0623\u0643\u0648\u0646 \u062D\u0644\u064A\u0641\u0643 \u0641\u064A \u0645\u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0623\u0634\u064A\u0627\u0621 \u0627\u0644\u062A\u064A \u0644\u0627 \u062A\u0631\u064A\u062F \u0631\u0624\u064A\u062A\u0647\u0627 \u0639\u0644\u0649 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "\u0635\u0641\u062D\u062A\u064A \u0639\u0644\u0649 \u0641\u064A\u0633\u0628\u0648\u0643",
            DLG_TIPS_LINK_SITE: "\u0645\u0648\u0642\u0639\u064A",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["\u062D\u0641\u0638", "\u0642\u0631\u064A\u0628", "\u064A\u0635\u062F\u0651\u0631", "\u064A\u0633\u062A\u0648\u0631\u062F", "\u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646"],
            DLG_BUTTON_TOOLTIPS: [
              "\u0627\u062D\u0641\u0638 \u0627\u0644\u062A\u063A\u064A\u064A\u0631\u0627\u062A \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u062A\u0635\u0641\u062D. \u0645\u0633\u062D \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0648\u0642\u0639/\u0627\u0644\u062A\u0635\u0641\u062D \u0627\u0644\u062E\u0627\u0635 \u064A\u0632\u064A\u0644\u0647\u0627.",
              "\u0635\u062F\u0651\u0631 \u0645\u0644\u0641\u064B\u0627 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u064B\u0627 \u0644\u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0648\u0646\u0642\u0644\u0647\u0627 \u0628\u064A\u0646 \u0627\u0644\u0623\u062C\u0647\u0632\u0629.",
              "\u0627\u0633\u062A\u0648\u0631\u062F \u0645\u0644\u0641 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0644\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0623\u0648 \u0646\u0642\u0644 \u0625\u0639\u062F\u0627\u062F\u0627\u062A\u0643.",
              "\u0623\u0639\u062F \u0636\u0628\u0637 \u062C\u0645\u064A\u0639 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0625\u0644\u0649 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A."
            ],
            DLG_FB_COLOUR_HINT: "\u0627\u062A\u0631\u0643\u0647 \u0641\u0627\u0631\u063A\u064B\u0627 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0646\u0638\u0627\u0645 \u0623\u0644\u0648\u0627\u0646 FB"
          },
          // -- България (Bulgaria)
          bg: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "\u0421\u043F\u043E\u043D\u0441\u043E\u0440\u0438\u0440\u0430\u043D\u043E",
            NF_TABLIST_STORIES_REELS_ROOMS: "\u0421\u043F\u0438\u0441\u044A\u0447\u043D\u043E \u043F\u043E\u043B\u0435 \u043D\u0430 \u0440\u0430\u0437\u0434\u0435\u043B\u0430 \u201E\u0418\u0441\u0442\u043E\u0440\u0438\u0438 | \u041C\u0430\u043A\u0430\u0440\u0438 | \u0421\u0442\u0430\u0438\u201C",
            NF_STORIES: "\u0418\u0441\u0442\u043E\u0440\u0438\u0438",
            NF_TOP_CARDS_PAGES: "\u0413\u043E\u0440\u043D\u0438 \u043A\u0430\u0440\u0442\u0438 (\u0437\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0438)",
            NF_META_AI: "\u041E\u043F\u0438\u0442\u0430\u0439 Meta AI",
            NF_HIDE_VERIFIED_BADGE: "\u0421\u043A\u0440\u0438\u0432\u0430\u043D\u0435 \u043D\u0430 \u043F\u043E\u0442\u0432\u044A\u0440\u0434\u0435\u043D\u0438 \u0437\u043D\u0430\u0447\u043A\u0438",
            NF_FILTER_VERIFIED_BADGE: "\u0424\u0438\u043B\u0442\u0440\u0438\u0440\u0430\u043D\u0435 \u043D\u0430 \u043F\u043E\u0442\u0432\u044A\u0440\u0434\u0435\u043D\u0438 \u0430\u043A\u0430\u0443\u043D\u0442\u0438",
            NF_AI_SIDE_PANELS: "AI \u0432 \u0441\u0442\u0440\u0430\u043D\u0438\u0447\u043D\u0438\u0442\u0435 \u043F\u0430\u043D\u0435\u043B\u0438",
            NF_SURVEY: "\u0410\u043D\u043A\u0435\u0442\u0430",
            NF_PEOPLE_YOU_MAY_KNOW: "\u0425\u043E\u0440\u0430, \u043A\u043E\u0438\u0442\u043E \u043C\u043E\u0436\u0435 \u0431\u0438 \u043F\u043E\u0437\u043D\u0430\u0432\u0430\u0442\u0435",
            NF_PAID_PARTNERSHIP: "\u041F\u043B\u0430\u0442\u0435\u043D\u043E \u043F\u0430\u0440\u0442\u043D\u044C\u043E\u0440\u0441\u0442\u0432\u043E",
            NF_SPONSORED_PAID: "\u0421\u043F\u043E\u043D\u0441\u043E\u0440\u0438\u0440\u0430\u043D\u043E \xB7 \u041F\u043B\u0430\u0442\u0435\u043D\u043E \u043E\u0442 ______",
            NF_SUGGESTIONS: "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F / \u041F\u0440\u0435\u043F\u043E\u0440\u044A\u043A\u0438",
            NF_FOLLOW: "\u0421\u043B\u0435\u0434\u0432\u0430\u0439",
            NF_PARTICIPATE: "\u0423\u0447\u0430\u0441\u0442\u0432\u0430\u0439",
            NF_REELS_SHORT_VIDEOS: "\u041B\u0435\u043D\u0442\u0438 \u0438 \u043A\u0440\u0430\u0442\u043A\u0438 \u0432\u0438\u0434\u0435\u043E\u043A\u043B\u0438\u043F\u043E\u0432\u0435",
            NF_SHORT_REEL_VIDEO: "\u0420\u0438\u043B/\u043A\u044A\u0441\u043E \u0432\u0438\u0434\u0435\u043E",
            NF_EVENTS_YOU_MAY_LIKE: "\u0421\u044A\u0431\u0438\u0442\u0438\u044F, \u043A\u043E\u0438\u0442\u043E \u043C\u043E\u0436\u0435 \u0434\u0430 \u0432\u0438 \u0445\u0430\u0440\u0435\u0441\u0430\u0442",
            NF_ANIMATED_GIFS_POSTS: "\u0410\u043D\u0438\u043C\u0438\u0440\u0430\u043D\u0438 GIF \u0444\u0430\u0439\u043B\u043E\u0432\u0435",
            NF_ANIMATED_GIFS_PAUSE: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0430\u043D\u0438\u043C\u0438\u0440\u0430\u043D\u0438 GIF \u0444\u0430\u0439\u043B\u043E\u0432\u0435",
            NF_SHARES: "# \u0441\u043F\u043E\u0434\u0435\u043B\u044F\u043D\u0438\u044F",
            NF_LIKES_MAXIMUM: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u0435\u043D \u0431\u0440\u043E\u0439 \u0425\u0430\u0440\u0435\u0441\u0432\u0430\u043D\u0438\u044F",
            GF_PAID_PARTNERSHIP: "\u041F\u043B\u0430\u0442\u0435\u043D\u043E \u043F\u0430\u0440\u0442\u043D\u044C\u043E\u0440\u0441\u0442\u0432\u043E",
            GF_SUGGESTIONS: "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F / \u041F\u0440\u0435\u043F\u043E\u0440\u044A\u043A\u0438",
            GF_SHORT_REEL_VIDEO: "\u0420\u0438\u043B/\u043A\u044A\u0441\u043E \u0432\u0438\u0434\u0435\u043E",
            GF_ANIMATED_GIFS_POSTS: "\u0410\u043D\u0438\u043C\u0438\u0440\u0430\u043D\u0438 GIF \u0444\u0430\u0439\u043B\u043E\u0432\u0435",
            GF_ANIMATED_GIFS_PAUSE: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0430\u043D\u0438\u043C\u0438\u0440\u0430\u043D\u0438 GIF \u0444\u0430\u0439\u043B\u043E\u0432\u0435",
            GF_SHARES: "# \u0441\u043F\u043E\u0434\u0435\u043B\u044F\u043D\u0438\u044F",
            VF_LIVE: "\u041D\u0410 \u0416\u0418\u0412\u041E",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "\u0414\u0443\u0431\u043B\u0438\u0440\u0430\u043D\u043E \u0432\u0438\u0434\u0435\u043E",
            VF_ANIMATED_GIFS_PAUSE: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0430\u043D\u0438\u043C\u0438\u0440\u0430\u043D\u0438 GIF \u0444\u0430\u0439\u043B\u043E\u0432\u0435",
            PP_ANIMATED_GIFS_POSTS: "\u0410\u043D\u0438\u043C\u0438\u0440\u0430\u043D\u0438 GIF \u0444\u0430\u0439\u043B\u043E\u0432\u0435",
            PP_ANIMATED_GIFS_PAUSE: "\u041F\u0430\u0443\u0437\u0430 \u043D\u0430 \u0430\u043D\u0438\u043C\u0438\u0440\u0430\u043D\u0438 GIF \u0444\u0430\u0439\u043B\u043E\u0432\u0435",
            NF_BLOCKED_FEED: ["\u041D\u043E\u0432\u0438\u043D\u0430\u0440\u0441\u043A\u0438 \u043F\u043E\u0442\u043E\u043A", "\u041F\u043E\u0442\u043E\u043A \u0441 \u0433\u0440\u0443\u043F\u0438", "\u041F\u043E\u0442\u043E\u043A \u0441 \u0432\u0438\u0434\u0435\u0430"],
            GF_BLOCKED_FEED: ["\u041D\u043E\u0432\u0438\u043D\u0430\u0440\u0441\u043A\u0438 \u043F\u043E\u0442\u043E\u043A", "\u041F\u043E\u0442\u043E\u043A \u0441 \u0433\u0440\u0443\u043F\u0438", "\u041F\u043E\u0442\u043E\u043A \u0441 \u0432\u0438\u0434\u0435\u0430"],
            VF_BLOCKED_FEED: ["\u041D\u043E\u0432\u0438\u043D\u0430\u0440\u0441\u043A\u0438 \u043F\u043E\u0442\u043E\u043A", "\u041F\u043E\u0442\u043E\u043A \u0441 \u0433\u0440\u0443\u043F\u0438", "\u041F\u043E\u0442\u043E\u043A \u0441 \u0432\u0438\u0434\u0435\u0430"],
            MP_BLOCKED_FEED: ["\u041F\u043E\u0442\u043E\u043A \u0441 Marketplace"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "\u041A\u043E\u0440\u043E\u043D\u0430\u0432\u0438\u0440\u0443\u0441 (\u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u043E\u043D\u043D\u0430 \u043A\u0443\u0442\u0438\u044F)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "\u041D\u0430\u0443\u043A\u0430 \u0437\u0430 \u043A\u043B\u0438\u043C\u0430\u0442\u0430 (\u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u043E\u043D\u043D\u0430 \u043A\u0443\u0442\u0438\u044F)",
            OTHER_INFO_BOX_SUBSCRIBE: "\u0410\u0431\u043E\u043D\u0438\u0440\u0430\u0439 \u0441\u0435 (\u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u043E\u043D\u043D\u0430 \u043A\u0443\u0442\u0438\u044F)",
            REELS_TITLE: "\u041B\u0435\u043D\u0442\u0438",
            // -- FB's label
            DLG_REELS_DESC: "\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u0438 \u0437\u0430 \u0432\u044A\u0437\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0436\u0434\u0430\u043D\u0435 \u0438 \u0446\u0438\u043A\u043B\u0438\u0447\u043D\u043E\u0441\u0442.",
            REELS_CONTROLS: "\u041F\u043E\u043A\u0430\u0436\u0438 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u0438 \u043D\u0430 \u0432\u0438\u0434\u0435\u043E\u0442\u043E",
            REELS_DISABLE_LOOPING: "\u0418\u0437\u043A\u043B\u044E\u0447\u0432\u0430\u043D\u0435 \u043D\u0430 \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435\u0442\u043E",
            DLG_TITLE: "\u041F\u043E\u0447\u0438\u0441\u0442\u0438 \u043C\u043E\u0438\u0442\u0435 \u0435\u043C\u0438\u0441\u0438\u0438",
            DLG_NF: "\u041D\u043E\u0432\u0438\u043D\u0430\u0440\u0441\u043A\u0438 \u043F\u043E\u0442\u043E\u043A",
            DLG_NF_DESC: "\u041F\u043E\u0447\u0438\u0441\u0442\u0435\u0442\u0435 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F\u0442\u0430 \u0438 \u0437\u0430\u0434\u0430\u0439\u0442\u0435 \u043A\u043E\u043B\u043A\u043E \u0441\u0442\u0440\u0438\u043A\u0442\u0435\u043D \u0434\u0430 \u0435 \u043F\u043E\u0442\u043E\u043A\u044A\u0442.",
            DLG_GF: "\u041F\u043E\u0442\u043E\u043A \u0441 \u0433\u0440\u0443\u043F\u0438",
            DLG_GF_DESC: "\u041F\u043E\u0434\u0440\u0435\u0434\u0435\u0442\u0435 \u043F\u043E\u0442\u043E\u0446\u0438\u0442\u0435 \u0432 \u0433\u0440\u0443\u043F\u0438\u0442\u0435, \u043A\u0430\u0442\u043E \u043C\u0430\u0445\u043D\u0435\u0442\u0435 \u0438\u0437\u043B\u0438\u0448\u043D\u043E\u0442\u043E \u0438 \u0448\u0443\u043C\u0430.",
            DLG_VF: "\u041F\u043E\u0442\u043E\u043A \u0441 \u0432\u0438\u0434\u0435\u0430",
            DLG_VF_DESC: "\u0424\u043E\u043A\u0443\u0441\u0438\u0440\u0430\u0439\u0442\u0435 \u0432\u0438\u0434\u0435\u043E\u043F\u043E\u0442\u043E\u043A\u0430, \u043A\u0430\u0442\u043E \u043D\u0430\u043C\u0430\u043B\u0438\u0442\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u044F\u0442\u0430 \u0438 \u0448\u0443\u043C\u0430.",
            DLG_MP: "\u041F\u043E\u0442\u043E\u043A \u0441 Marketplace",
            DLG_MP_DESC: "\u0424\u0438\u043B\u0442\u0440\u0438\u0440\u0430\u0439\u0442\u0435 \u043E\u0431\u044F\u0432\u0438 \u043F\u043E \u0446\u0435\u043D\u0430 \u0438 \u043A\u043B\u044E\u0447\u043E\u0432\u0438 \u0434\u0443\u043C\u0438.",
            DLG_PP: "\u041F\u0440\u043E\u0444\u0438\u043B / \u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430",
            DLG_PP_DESC: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435 \u043A\u0430\u043A\u0432\u043E \u0441\u0435 \u043F\u043E\u043A\u0430\u0437\u0432\u0430 \u0432 \u043F\u0440\u043E\u0444\u0438\u043B\u0438 \u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0438.",
            DLG_OTHER: "\u0414\u043E\u043F\u044A\u043B\u043D\u0438\u0442\u0435\u043B\u043D\u0438 \u0431\u0435\u043B\u0435\u0436\u043A\u0438",
            DLG_OTHER_DESC: "\u0421\u043A\u0440\u0438\u0439\u0442\u0435 \u0434\u043E\u043F\u044A\u043B\u043D\u0438\u0442\u0435\u043B\u043D\u0438\u0442\u0435 \u043F\u043E\u043B\u0435\u0442\u0430, \u043A\u043E\u0438\u0442\u043E \u043D\u0435 \u0438\u0441\u043A\u0430\u0442\u0435.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "\u0422\u0435\u043A\u0441\u0442\u043E\u0432 \u0444\u0438\u043B\u0442\u044A\u0440",
            DLG_BLOCK_NEW_LINE: "(\u0420\u0430\u0437\u0434\u0435\u043B\u0435\u0442\u0435 \u0434\u0443\u043C\u0438\u0442\u0435 \u0438\u043B\u0438 \u0444\u0440\u0430\u0437\u0438\u0442\u0435 \u0441 \u043D\u043E\u0432 \u0440\u0435\u0434, \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0438\u0442\u0435 \u0438\u0437\u0440\u0430\u0437\u0438 \u0441\u0430 \u043F\u043E\u0434\u0434\u044A\u0440\u0436\u0430\u043D\u0438)",
            NF_BLOCKED_ENABLED: "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u0430\u043D\u043E",
            GF_BLOCKED_ENABLED: "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u0430\u043D\u043E",
            VF_BLOCKED_ENABLED: "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u0430\u043D\u043E",
            MP_BLOCKED_ENABLED: "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u0430\u043D\u043E",
            PP_BLOCKED_ENABLED: "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u0430\u043D\u043E",
            NF_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0438 \u0438\u0437\u0440\u0430\u0437\u0438 (RegExp)",
            GF_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0438 \u0438\u0437\u0440\u0430\u0437\u0438 (RegExp)",
            VF_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0438 \u0438\u0437\u0440\u0430\u0437\u0438 (RegExp)",
            MP_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0438 \u0438\u0437\u0440\u0430\u0437\u0438 (RegExp)",
            PP_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0438 \u0438\u0437\u0440\u0430\u0437\u0438 (RegExp)",
            DLG_VERBOSITY: "\u041E\u043F\u0446\u0438\u0438 \u0437\u0430 \u0441\u043A\u0440\u0438\u0442\u0438 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438",
            DLG_PREFERENCES: "\u041F\u0440\u0435\u0434\u043F\u043E\u0447\u0438\u0442\u0430\u043D\u0438\u044F",
            DLG_PREFERENCES_DESC: "\u0415\u0442\u0438\u043A\u0435\u0442\u0438, \u043F\u043E\u0437\u0438\u0446\u0438\u044F, \u0446\u0432\u0435\u0442\u043E\u0432\u0435 \u0438 \u0435\u0437\u0438\u043A.",
            DLG_REPORT_BUG: "\u0421\u044A\u043E\u0431\u0449\u0438 \u0437\u0430 \u0431\u044A\u0433",
            DLG_REPORT_BUG_DESC: "\u0421\u044A\u0437\u0434\u0430\u0439 \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u0447\u0435\u043D \u043E\u0442\u0447\u0435\u0442 \u0437\u0430 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0438.",
            DLG_REPORT_BUG_NOTICE: "\u041F\u043E\u043C\u043E\u0433\u043D\u0435\u0442\u0435 \u043D\u0438 \u0434\u0430 \u0433\u043E \u043F\u043E\u043F\u0440\u0430\u0432\u0438\u043C:\n1. \u041F\u0440\u0435\u0432\u044A\u0440\u0442\u0435\u0442\u0435, \u0442\u0430\u043A\u0430 \u0447\u0435 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u043D\u0438\u044F\u0442 \u043F\u043E\u0441\u0442 \u0434\u0430 \u0435 \u0432\u0438\u0434\u0438\u043C.\n2. \u041A\u043B\u0438\u043A\u043D\u0435\u0442\u0435 '\u0421\u044A\u0437\u0434\u0430\u0439 \u043E\u0442\u0447\u0435\u0442', \u0441\u043B\u0435\u0434 \u0442\u043E\u0432\u0430 '\u041A\u043E\u043F\u0438\u0440\u0430\u0439 \u043E\u0442\u0447\u0435\u0442\u0430'.\n3. \u041A\u043B\u0438\u043A\u043D\u0435\u0442\u0435 '\u041E\u0442\u0432\u043E\u0440\u0438 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0438\u0442\u0435' \u0438 \u043F\u043E\u0441\u0442\u0430\u0432\u0435\u0442\u0435 \u043E\u0442\u0447\u0435\u0442\u0430 \u0432 \u043D\u043E\u0432 \u043F\u0440\u043E\u0431\u043B\u0435\u043C.\n4. \u0414\u043E\u0431\u0430\u0432\u0435\u0442\u0435 \u043A\u0440\u0430\u0442\u043A\u043E \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043D\u0430 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0430.\n(\u041D\u0438\u0435 \u0441\u043A\u0440\u0438\u0432\u0430\u043C\u0435 \u0438\u043C\u0435\u043D\u0430\u0442\u0430/\u0442\u0435\u043A\u0441\u0442\u0430, \u043D\u043E \u043C\u043E\u043B\u044F \u043F\u0440\u0435\u0433\u043B\u0435\u0434\u0430\u0439\u0442\u0435 \u043F\u0440\u0435\u0434\u0438 \u0441\u043F\u043E\u0434\u0435\u043B\u044F\u043D\u0435!)",
            DLG_REPORT_BUG_GENERATE: "\u0421\u044A\u0437\u0434\u0430\u0439 \u043E\u0442\u0447\u0435\u0442",
            DLG_REPORT_BUG_COPY: "\u041A\u043E\u043F\u0438\u0440\u0430\u0439 \u043E\u0442\u0447\u0435\u0442\u0430",
            DLG_REPORT_BUG_OPEN_ISSUES: "\u041E\u0442\u0432\u043E\u0440\u0438 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0438\u0442\u0435",
            DLG_REPORT_BUG_STATUS_READY: "\u041E\u0442\u0447\u0435\u0442\u044A\u0442 \u0435 \u0433\u043E\u0442\u043E\u0432.",
            DLG_REPORT_BUG_STATUS_COPIED: "\u041E\u0442\u0447\u0435\u0442\u044A\u0442 \u0435 \u043A\u043E\u043F\u0438\u0440\u0430\u043D.",
            DLG_REPORT_BUG_STATUS_FAILED: "\u041A\u043E\u043F\u0438\u0440\u0430\u043D\u0435\u0442\u043E \u043D\u0435 \u0443\u0441\u043F\u044F. \u041A\u043E\u043F\u0438\u0440\u0430\u0439 \u0440\u044A\u0447\u043D\u043E.",
            DLG_VERBOSITY_CAPTION: "\u041F\u043E\u043A\u0430\u0437\u0432\u0430\u043D\u0435 \u043D\u0430 \u0435\u0442\u0438\u043A\u0435\u0442, \u0430\u043A\u043E \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F\u0442\u0430 \u0435 \u0441\u043A\u0440\u0438\u0442\u0430",
            VERBOSITY_MESSAGE: [
              "\u043D\u044F\u043C\u0430 \u0435\u0442\u0438\u043A\u0435\u0442",
              "\u0421\u043A\u0440\u0438\u0442\u0430 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F. \u041F\u0440\u0430\u0432\u0438\u043B\u043E: ",
              " \u0441\u043A\u0440\u0438\u0442\u0438 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438",
              "7 \u0441\u043A\u0440\u0438\u0442\u0438 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438 ~ (\u0441\u0430\u043C\u043E \u0437\u0430 \u0413\u0440\u0443\u043F\u043E\u0432\u0438\u044F \u043F\u043E\u0442\u043E\u043A)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "\u0426\u0432\u044F\u0442 \u043D\u0430 \u0442\u0435\u043A\u0441\u0442\u0430",
            VERBOSITY_MESSAGE_BG_COLOUR: "\u0426\u0432\u044F\u0442 \u043D\u0430 \u0444\u043E\u043D\u0430",
            VERBOSITY_DEBUG: "\u041E\u0442\u043A\u0440\u043E\u044F\u0432\u0430\u043D\u0435 \u043D\u0430 \u0441\u043A\u0440\u0438\u0442\u0438\u0442\u0435 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438",
            CMF_CUSTOMISATIONS: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
            CMF_BTN_LOCATION: "\u041C\u0435\u0441\u0442\u043E\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043D\u0430 \u0431\u0443\u0442\u043E\u043D\u0430 CMF:",
            CMF_BTN_OPTION: [
              "\u0434\u043E\u043B\u0443 \u0432\u043B\u044F\u0432\u043E",
              "\u0433\u043E\u0440\u0435 \u0432\u0434\u044F\u0441\u043D\u043E",
              '\u0434\u0435\u0430\u043A\u0442\u0438\u0432\u0438\u0440\u0430\u043D\u043E (\u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0439\u0442\u0435 "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" \u0432 \u043C\u0435\u043D\u044E\u0442\u043E \u0441 \u043A\u043E\u043C\u0430\u043D\u0434\u0438 \u0437\u0430 \u043F\u043E\u0442\u0440\u0435\u0431\u0438\u0442\u0435\u043B\u0441\u043A\u0438 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0438)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "\u0415\u0437\u0438\u043A \u043D\u0430 Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",
            CMF_DIALOG_LANGUAGE_DEFAULT: "\u0418\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u043D\u0435 \u043D\u0430 \u0435\u0437\u0438\u043A\u0430 \u043D\u0430 \u0441\u0430\u0439\u0442\u0430",
            GM_MENU_SETTINGS: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
            CMF_DIALOG_LOCATION: "\u041C\u0435\u0441\u0442\u043E\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043D\u0430 \u0442\u043E\u0432\u0430 \u043C\u0435\u043D\u044E:",
            CMF_DIALOG_OPTION: ["\u043B\u044F\u0432\u0430 \u0441\u0442\u0440\u0430\u043D\u0430", "\u0434\u044F\u0441\u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0430"],
            CMF_BORDER_COLOUR: "\u0426\u0432\u044F\u0442 \u043D\u0430 \u0440\u0430\u043C\u043A\u0430\u0442\u0430",
            DLG_TIPS: "\u0417\u0430 \u043F\u0440\u043E\u0435\u043A\u0442\u0430",
            DLG_TIPS_DESC: "\u041B\u0438\u043D\u043A\u043E\u0432\u0435 \u043A\u044A\u043C \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0438 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u0437\u0430 \u043F\u043E\u0434\u0434\u0440\u044A\u0436\u043D\u0438\u043A\u0430.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "\u0410\u043A\u043E \u0442\u043E\u0432\u0430 \u043F\u043E\u043C\u0430\u0433\u0430, \u0435\u0434\u043D\u0430 \u0437\u0432\u0435\u0437\u0434\u0430 \u0432 {github} \u0437\u043D\u0430\u0447\u0438 \u043C\u043D\u043E\u0433\u043E.",
            DLG_TIPS_FACEBOOK: "\u041A\u0430\u0436\u0438 \u0437\u0434\u0440\u0430\u0441\u0442\u0438 \u043D\u0430 {facebook} - \u0442\u0430\u043C \u0441\u043F\u043E\u0434\u0435\u043B\u044F\u043C \u0438\u0437\u043A\u0443\u0441\u0442\u0432\u043E \u0438 \u043F\u043E\u0435\u0437\u0438\u044F.",
            DLG_TIPS_SITE: "\u0410\u043A\u043E \u0438\u0441\u043A\u0430\u0448 \u0434\u0430 \u0432\u0438\u0434\u0438\u0448 \u043A\u0430\u043A\u0432\u043E \u043F\u0440\u0430\u0432\u044F \u0438\u0437 \u043C\u0440\u0435\u0436\u0430\u0442\u0430, {site} \u0435 \u043D\u0430\u0439-\u0434\u043E\u0431\u0440\u043E\u0442\u043E \u043C\u044F\u0441\u0442\u043E \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u043D\u0435\u0448.",
            DLG_TIPS_CREDITS: "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u043D\u0438 \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u043D\u043E\u0441\u0442\u0438 \u043D\u0430 {zbluebugz} \u0437\u0430 \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u043D\u0438\u044F \u043F\u0440\u043E\u0435\u043A\u0442 \u0438 \u043D\u0430 {trinhquocviet} \u0437\u0430 \u043E\u043F\u0440\u043E\u0441\u0442\u0435\u043D\u0438\u044F UI branch, \u043E\u0442 \u043A\u043E\u0439\u0442\u043E \u043F\u044A\u0440\u0432\u043E\u043D\u0430\u0447\u0430\u043B\u043D\u043E \u0444\u043E\u0440\u043A\u043D\u0430\u0445 - \u0438 \u0437\u0430 \u043F\u043E\u0434\u0434\u0440\u044A\u0436\u043A\u0430\u0442\u0430 \u043D\u0430 \u0444\u0438\u043B\u0442\u0440\u0438\u0442\u0435 \u043F\u0440\u0435\u0437 \u0442\u043E\u0437\u0438 \u043F\u0435\u0440\u0438\u043E\u0434.",
            DLG_TIPS_MAINTAINER_PREFIX: "\u041E\u0442 \u043F\u043E\u0434\u0434\u0440\u044A\u0436\u043D\u0438\u043A\u0430:",
            DLG_TIPS_MAINTAINER: "\u041D\u0430\u0434\u044F\u0432\u0430\u043C \u0441\u0435 \u0442\u043E\u0437\u0438 \u0441\u043A\u0440\u0438\u043F\u0442 \u0434\u0430 \u0442\u0438 \u043F\u043E\u043C\u043E\u0433\u043D\u0435 \u0434\u0430 \u0441\u0438 \u0432\u044A\u0440\u043D\u0435\u0448 \u0435\u043C\u0438\u0441\u0438\u044F\u0442\u0430. \u041E\u0431\u0435\u0449\u0430\u0432\u0430\u043C \u0434\u0430 \u0431\u044A\u0434\u0430 \u0442\u0432\u043E\u0439 \u0441\u044A\u044E\u0437\u043D\u0438\u043A \u0432 \u0431\u0438\u0442\u043A\u0430\u0442\u0430 \u0441\u0440\u0435\u0449\u0443 \u043D\u0435\u0449\u0430\u0442\u0430, \u043A\u043E\u0438\u0442\u043E \u043D\u0435 \u0438\u0441\u043A\u0430\u0448 \u0434\u0430 \u0432\u0438\u0436\u0434\u0430\u0448 \u043E\u043D\u043B\u0430\u0439\u043D.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "\u043C\u043E\u044F Facebook \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430",
            DLG_TIPS_LINK_SITE: "\u043C\u043E\u044F\u0442 \u0441\u0430\u0439\u0442",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["\u0417\u0430\u043F\u0430\u0437\u0438", "\u0417\u0430\u0442\u0432\u043E\u0440\u0438", "\u0415\u043A\u0441\u043F\u043E\u0440\u0442", "\u0418\u043C\u043F\u043E\u0440\u0442", "\u041D\u0443\u043B\u0438\u0440\u0430\u043D\u0435"],
            DLG_BUTTON_TOOLTIPS: [
              "\u0417\u0430\u043F\u0430\u0437\u0432\u0430 \u043F\u0440\u043E\u043C\u0435\u043D\u0438\u0442\u0435 \u0432 \u0442\u043E\u0437\u0438 \u0431\u0440\u0430\u0443\u0437\u044A\u0440. \u0418\u0437\u0447\u0438\u0441\u0442\u0432\u0430\u043D\u0435 \u043D\u0430 \u0434\u0430\u043D\u043D\u0438/\u0438\u043D\u043A\u043E\u0433\u043D\u0438\u0442\u043E \u0433\u0438 \u043F\u0440\u0435\u043C\u0430\u0445\u0432\u0430.",
              "\u0415\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u0430 \u0440\u0435\u0437\u0435\u0440\u0432\u0435\u043D \u0444\u0430\u0439\u043B \u0437\u0430 \u0437\u0430\u043F\u0430\u0437\u0432\u0430\u043D\u0435 \u0438 \u043F\u0440\u0435\u0445\u0432\u044A\u0440\u043B\u044F\u043D\u0435 \u043C\u0435\u0436\u0434\u0443 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430.",
              "\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u0430 \u0444\u0430\u0439\u043B \u0441 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0437\u0430 \u0432\u044A\u0437\u0441\u0442\u0430\u043D\u043E\u0432\u044F\u0432\u0430\u043D\u0435 \u0438\u043B\u0438 \u043F\u0440\u0435\u0445\u0432\u044A\u0440\u043B\u044F\u043D\u0435.",
              "\u041D\u0443\u043B\u0438\u0440\u0430 \u0432\u0441\u0438\u0447\u043A\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0434\u043E \u043F\u043E\u0434\u0440\u0430\u0437\u0431\u0438\u0440\u0430\u043D\u0435."
            ],
            DLG_FB_COLOUR_HINT: "\u041E\u0441\u0442\u0430\u0432\u0435\u0442\u0435 \u043F\u0440\u0430\u0437\u043D\u043E, \u0437\u0430 \u0434\u0430 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0442\u0435 \u0446\u0432\u0435\u0442\u043E\u0432\u0430\u0442\u0430 \u0441\u0445\u0435\u043C\u0430 \u043D\u0430 FB"
          },
          // -- Čeština (Czechia)
          cs: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Sponzorov\xE1no",
            NF_TABLIST_STORIES_REELS_ROOMS: 'Seznam karet "Stories | Reels | M\xEDstnosti"',
            NF_STORIES: "Stories",
            NF_TOP_CARDS_PAGES: "Horn\xED karty (pro str\xE1nky)",
            NF_META_AI: "Vyzkou\u0161ejte Meta AI",
            NF_HIDE_VERIFIED_BADGE: "Skr\xFDt ov\u011B\u0159en\xE9 odznaky",
            NF_FILTER_VERIFIED_BADGE: "Filtrovat ov\u011B\u0159en\xE9 \xFA\u010Dty",
            NF_AI_SIDE_PANELS: "AI v postrann\xEDch panelech",
            NF_SURVEY: "Pr\u016Fzkum",
            NF_PEOPLE_YOU_MAY_KNOW: "Koho mo\u017En\xE1 zn\xE1te",
            NF_PAID_PARTNERSHIP: "Placen\xE9 partnerstv\xED",
            NF_SPONSORED_PAID: "Sponzorov\xE1no \xB7 Plat\xED za to ______",
            NF_SUGGESTIONS: "N\xE1vrhy / Doporu\u010Den\xED",
            NF_FOLLOW: "Sledovat",
            NF_PARTICIPATE: "Participovat",
            NF_REELS_SHORT_VIDEOS: "Sekvence a kr\xE1tk\xE1 videa",
            NF_SHORT_REEL_VIDEO: "Navij\xE1k/kr\xE1tk\xE9 video",
            NF_EVENTS_YOU_MAY_LIKE: "Ud\xE1losti, kter\xE9 se v\xE1m mohou l\xEDbit",
            NF_ANIMATED_GIFS_POSTS: "Animovan\xE9 GIFy",
            NF_ANIMATED_GIFS_PAUSE: "Pozastavit animovan\xE9 GIFy",
            NF_SHARES: "# sd\xEDlen\xED",
            NF_LIKES_MAXIMUM: "Maxim\xE1ln\xED po\u010Det hodnocen\xED L\xEDb\xED se mi",
            GF_PAID_PARTNERSHIP: "Placen\xE9 partnerstv\xED",
            GF_SUGGESTIONS: "N\xE1vrhy / Doporu\u010Den\xED",
            GF_SHORT_REEL_VIDEO: "Navij\xE1k/kr\xE1tk\xE9 video",
            GF_ANIMATED_GIFS_POSTS: "Animovan\xE9 GIFy",
            GF_ANIMATED_GIFS_PAUSE: "Pozastavit animovan\xE9 GIFy",
            GF_SHARES: "# sd\xEDlen\xED",
            VF_LIVE: "\u017DIV\u011A",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Duplikovan\xE9 video",
            VF_ANIMATED_GIFS_PAUSE: "Pozastavit animovan\xE9 GIFy",
            PP_ANIMATED_GIFS_POSTS: "Animovan\xE9 GIFy",
            PP_ANIMATED_GIFS_PAUSE: "Pozastavit animovan\xE9 GIFy",
            NF_BLOCKED_FEED: ["Informa\u010Dn\xED kan\xE1l", "Skupinov\xFD kan\xE1l", "Video kan\xE1l"],
            GF_BLOCKED_FEED: ["Informa\u010Dn\xED kan\xE1l", "Skupinov\xFD kan\xE1l", "Video kan\xE1l"],
            VF_BLOCKED_FEED: ["Informa\u010Dn\xED kan\xE1l", "Skupinov\xFD kan\xE1l", "Video kan\xE1l"],
            MP_BLOCKED_FEED: ["Marketplace kan\xE1l"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Coronavirus (informa\u010Dn\xED box)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Klimatick\xE1 v\u011Bda (informa\u010Dn\xED box)",
            OTHER_INFO_BOX_SUBSCRIBE: "Odeb\xEDrat (informa\u010Dn\xED box)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Ovl\xE1d\xE1n\xED p\u0159ehr\xE1v\xE1n\xED a opakov\xE1n\xED.",
            REELS_CONTROLS: "Zobrazit ovl\xE1d\xE1n\xED videa",
            REELS_DISABLE_LOOPING: "Vypnout smy\u010Den\xED",
            DLG_TITLE: "Vy\u010Dist\u011Bte m\xE9 kan\xE1ly",
            DLG_NF: "Informa\u010Dn\xED kan\xE1l",
            DLG_NF_DESC: "Vy\u010Dist\u011Bte n\xE1vrhy a nastavte, jak p\u0159\xEDsn\xFD m\xE1 b\xFDt feed.",
            DLG_GF: "Skupinov\xFD kan\xE1l",
            DLG_GF_DESC: "Upravte skupinov\xE9 feedy odstran\u011Bn\xEDm balastu a \u0161umu.",
            DLG_VF: "Video kan\xE1l",
            DLG_VF_DESC: "Udr\u017Ete video feed p\u0159ehledn\xFD omezen\xEDm opakov\xE1n\xED a nepo\u0159\xE1dku.",
            DLG_MP: "Marketplace kan\xE1l",
            DLG_MP_DESC: "Filtrujte nab\xEDdky podle ceny a kl\xED\u010Dov\xFDch slov.",
            DLG_PP: "Profil / Str\xE1nka",
            DLG_PP_DESC: "Upravte, co se zobrazuje na profilech a str\xE1nk\xE1ch.",
            DLG_OTHER: "Dopl\u0148kov\xE9 pozn\xE1mky",
            DLG_OTHER_DESC: "Skryjte extra boxy, kter\xE9 nechcete.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Textov\xFD filtr",
            DLG_BLOCK_NEW_LINE: "(Odd\u011Blte slova nebo fr\xE1ze pomoc\xED nov\xE9ho \u0159\xE1dku, regul\xE1rn\xED v\xFDrazy jsou podporov\xE1ny)",
            NF_BLOCKED_ENABLED: "Zapnuto",
            GF_BLOCKED_ENABLED: "Zapnuto",
            VF_BLOCKED_ENABLED: "Zapnuto",
            MP_BLOCKED_ENABLED: "Zapnuto",
            PP_BLOCKED_ENABLED: "Zapnuto",
            NF_BLOCKED_RE: "Regul\xE4re Ausdr\xFCcke (RegExp)",
            GF_BLOCKED_RE: "Regul\xE4re Ausdr\xFCcke (RegExp)",
            VF_BLOCKED_RE: "Regul\xE4re Ausdr\xFCcke (RegExp)",
            MP_BLOCKED_RE: "Regul\xE4re Ausdr\xFCcke (RegExp)",
            PP_BLOCKED_RE: "Regul\xE4re Ausdr\xFCcke (RegExp)",
            DLG_VERBOSITY: "Mo\u017Enosti skryt\xFDch p\u0159\xEDsp\u011Bvk\u016F",
            DLG_PREFERENCES: "P\u0159edvolby",
            DLG_PREFERENCES_DESC: "\u0160t\xEDtky, um\xEDst\u011Bn\xED, barvy a jazyk.",
            DLG_REPORT_BUG: "Nahl\xE1sit chybu",
            DLG_REPORT_BUG_DESC: "Vytvo\u0159 diagnostickou zpr\xE1vu k probl\xE9mu.",
            DLG_REPORT_BUG_NOTICE: "Pomozte n\xE1m to opravit:\n1. Posu\u0148te zobrazen\xED tak, aby byl probl\xE9mov\xFD p\u0159\xEDsp\u011Bvek viditeln\xFD.\n2. Klikn\u011Bte na 'Vytvo\u0159it zpr\xE1vu' a pot\xE9 na 'Kop\xEDrovat zpr\xE1vu'.\n3. Klikn\u011Bte na 'Otev\u0159\xEDt hl\xE1\u0161en\xED' a vlo\u017Ete zpr\xE1vu do nov\xE9ho hl\xE1\u0161en\xED.\n4. P\u0159idejte stru\u010Dn\xFD popis probl\xE9mu.\n(Jm\xE9na/text redigujeme, ale p\u0159ed sd\xEDlen\xEDm zkontrolujte!)",
            DLG_REPORT_BUG_GENERATE: "Vytvo\u0159it zpr\xE1vu",
            DLG_REPORT_BUG_COPY: "Kop\xEDrovat zpr\xE1vu",
            DLG_REPORT_BUG_OPEN_ISSUES: "Otev\u0159\xEDt hl\xE1\u0161en\xED",
            DLG_REPORT_BUG_STATUS_READY: "Zpr\xE1va je p\u0159ipravena.",
            DLG_REPORT_BUG_STATUS_COPIED: "Zpr\xE1va zkop\xEDrov\xE1na.",
            DLG_REPORT_BUG_STATUS_FAILED: "Kop\xEDrov\xE1n\xED se nezda\u0159ilo. Zkop\xEDruj ru\u010Dn\u011B.",
            DLG_VERBOSITY_CAPTION: "Zobrazit popisek, pokud je p\u0159\xEDsp\u011Bvek skryt\xFD",
            VERBOSITY_MESSAGE: [
              "\u017E\xE1dn\xFD popisek",
              "P\u0159\xEDsp\u011Bvek byl skryt. Pravidlo: ",
              " p\u0159\xEDsp\u011Bvk\u016F skryt\xFDch",
              "7 p\u0159\xEDsp\u011Bvk\u016F skryt\xFDch ~ (pouze ve skupinov\xE9m zpravodaji)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Barva textu",
            VERBOSITY_MESSAGE_BG_COLOUR: "Barva pozad\xED",
            VERBOSITY_DEBUG: "Zv\xFDrazn\u011Bte \u201Eskryt\xE9\u201C p\u0159\xEDsp\u011Bvky",
            CMF_CUSTOMISATIONS: "P\u0159izp\u016Fsoben\xED",
            CMF_BTN_LOCATION: "Um\xEDst\u011Bn\xED tla\u010D\xEDtka CMF:",
            CMF_BTN_OPTION: [
              "vlevo dole",
              "vpravo naho\u0159e",
              'zak\xE1z\xE1no (pou\u017Eijte "Nastaven\xED" v nab\xEDdce P\u0159\xEDkazy u\u017Eivatelsk\xE9ho skriptu)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Jazyk Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "\u010Ce\u0161tina",
            CMF_DIALOG_LANGUAGE_DEFAULT: "Pou\u017E\xEDt jazyk webu",
            GM_MENU_SETTINGS: "Nastaven\xED",
            CMF_DIALOG_LOCATION: "Um\xEDst\u011Bn\xED tohoto menu:",
            CMF_DIALOG_OPTION: ["lev\xE1 strana", "prav\xE1 strana"],
            CMF_BORDER_COLOUR: "Barva ohrani\u010Den\xED",
            DLG_TIPS: "O projektu",
            DLG_TIPS_DESC: "Odkazy na projekt a informace o spr\xE1vci.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Pokud to pom\xE1h\xE1, hv\u011Bzda na {github} pro m\u011B hodn\u011B znamen\xE1.",
            DLG_TIPS_FACEBOOK: "Pozdrav na {facebook} - sd\xEDl\xEDm tam sv\xE9 um\u011Bn\xED a poezii.",
            DLG_TIPS_SITE: "Chce\u0161-li vid\u011Bt, co d\u011Bl\xE1m na webu, {site} je nejlep\u0161\xED start.",
            DLG_TIPS_CREDITS: "Speci\xE1ln\xED pod\u011Bkov\xE1n\xED {zbluebugz} za p\u016Fvodn\xED projekt a {trinhquocviet} za zjednodu\u0161enou UI v\u011Btev, ze kter\xE9 jsem p\u016Fvodn\u011B forknul - i za \xFAdr\u017Ebu filtr\u016F v t\xE9 dob\u011B.",
            DLG_TIPS_MAINTAINER_PREFIX: "Od spr\xE1vce:",
            DLG_TIPS_MAINTAINER: "Douf\xE1m, \u017Ee v\xE1m tento skript pom\u016F\u017Ee z\xEDskat zp\u011Bt v\xE1\u0161 feed. Slibuji, \u017Ee budu va\u0161\xEDm spojencem v boji proti v\u011Bcem, kter\xE9 nechcete vid\u011Bt online.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "m\u016Fj Facebook",
            DLG_TIPS_LINK_SITE: "m\u016Fj web",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Ulo\u017Eit", "Zav\u0159\xEDt", "Export", "Import", "Resetovat"],
            DLG_BUTTON_TOOLTIPS: [
              "Ulo\u017E\xED zm\u011Bny v tomto prohl\xED\u017Ee\u010Di. Smaz\xE1n\xED dat/inkognito je odstran\xED.",
              "Exportuje z\xE1lo\u017En\xED soubor pro uchov\xE1n\xED a p\u0159enos mezi za\u0159\xEDzen\xEDmi.",
              "Importuje soubor s nastaven\xEDm pro obnoven\xED nebo p\u0159enos.",
              "Obnov\xED v\u0161echna nastaven\xED na v\xFDchoz\xED."
            ],
            DLG_FB_COLOUR_HINT: "Chcete-li pou\u017E\xEDt barevn\xE9 sch\xE9ma FB, nechte pr\xE1zdn\xE9"
          },
          // -- Deutsch (Germany)
          de: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Gesponsert",
            SPONSORED_EXTRA: "Anzeige",
            NF_TABLIST_STORIES_REELS_ROOMS: 'Listenfeld der Registerkarte "Stories | Reels | Rooms"',
            NF_STORIES: "Stories",
            NF_TOP_CARDS_PAGES: "Top-Karten (f\xFCr Seiten)",
            NF_META_AI: "Meta AI ausprobieren",
            NF_HIDE_VERIFIED_BADGE: "Verifizierte Abzeichen ausblenden",
            NF_FILTER_VERIFIED_BADGE: "Verifizierte Konten filtern",
            NF_AI_SIDE_PANELS: "KI in Seitenleisten",
            NF_SURVEY: "Umfrage",
            NF_PEOPLE_YOU_MAY_KNOW: "Personen, die du kennen k\xF6nntest",
            NF_PAID_PARTNERSHIP: "Bezahlte Werbepartnerschaft",
            NF_SPONSORED_PAID: "Gesponsert \xB7 Finanziert von ______",
            NF_SUGGESTIONS: "Vorschl\xE4ge / Empfehlungen",
            NF_FOLLOW: "Folgen",
            NF_PARTICIPATE: "Teilnehmen",
            NF_REELS_SHORT_VIDEOS: "Reels und Kurzvideos",
            NF_SHORT_REEL_VIDEO: "Reel/kurzes Video",
            NF_EVENTS_YOU_MAY_LIKE: "Veranstaltungen, die Ihnen gefallen k\xF6nnten",
            NF_ANIMATED_GIFS_POSTS: "Animierte GIFs",
            NF_ANIMATED_GIFS_PAUSE: "Animierte GIFs pausieren",
            NF_SHARES: "# Mal geteilt",
            NF_LIKES_MAXIMUM: "Maximale Anzahl an Likes",
            GF_PAID_PARTNERSHIP: "Bezahlte Werbepartnerschaft",
            GF_SUGGESTIONS: "Vorschl\xE4ge / Empfehlungen",
            GF_SHORT_REEL_VIDEO: "Reel/kurzes Video",
            GF_ANIMATED_GIFS_POSTS: "Animierte GIFs",
            GF_ANIMATED_GIFS_PAUSE: "Animierte GIFs pausieren",
            GF_SHARES: "# Mal geteilt",
            VF_LIVE: "LIVE",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Dupliziertes Video",
            VF_ANIMATED_GIFS_PAUSE: "Animierte GIFs pausieren",
            PP_ANIMATED_GIFS_POSTS: "Animierte GIFs",
            PP_ANIMATED_GIFS_PAUSE: "Animierte GIFs pausieren",
            NF_BLOCKED_FEED: ["Newsfeed", "Gruppen-Feed", "Video-Feed"],
            GF_BLOCKED_FEED: ["Newsfeed", "Gruppen-Feed", "Video-Feed"],
            VF_BLOCKED_FEED: ["Newsfeed", "Gruppen-Feed", "Video-Feed"],
            MP_BLOCKED_FEED: ["Marktplatz-Feed"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Coronavirus (Infobox)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Klimawissenschaft (Infobox)",
            OTHER_INFO_BOX_SUBSCRIBE: "Abonnieren (Infobox)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Wiedergabe- und Loop-Steuerung.",
            REELS_CONTROLS: "Video-Steuerung anzeigen",
            REELS_DISABLE_LOOPING: "Wiederholung deaktivieren",
            DLG_TITLE: "Bereinige meine Feeds",
            DLG_NF: "Newsfeed",
            DLG_NF_DESC: "Vorschl\xE4ge aufr\xE4umen und festlegen, wie streng der Feed ist.",
            DLG_GF: "Gruppen-Feed",
            DLG_GF_DESC: "Gruppenfeeds aufr\xE4umen, Extras und L\xE4rm reduzieren.",
            DLG_VF: "Video-Feed",
            DLG_VF_DESC: "Video-Feed fokussieren, Wiederholungen und Unordnung reduzieren.",
            DLG_MP: "Marktplatz-Feed",
            DLG_MP_DESC: "Angebote nach Preis und Schl\xFCsselw\xF6rtern filtern.",
            DLG_PP: "Profil / Seite",
            DLG_PP_DESC: "Anpassen, was in Profilen und Seiten erscheint.",
            DLG_OTHER: "Zus\xE4tzliche Hinweise",
            DLG_OTHER_DESC: "Blenden Sie zus\xE4tzliche K\xE4sten aus, die Sie nicht m\xF6chten.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Textfilter",
            DLG_BLOCK_NEW_LINE: "(Trennen Sie W\xF6rter oder Phrasen mit einem Zeilenumbruch, regul\xE4re Ausdr\xFCcke werden unterst\xFCtzt)",
            NF_BLOCKED_ENABLED: "Erm\xF6glichte",
            GF_BLOCKED_ENABLED: "Erm\xF6glichte",
            VF_BLOCKED_ENABLED: "Erm\xF6glichte",
            MP_BLOCKED_ENABLED: "Erm\xF6glichte",
            PP_BLOCKED_ENABLED: "Erm\xF6glichte",
            NF_BLOCKED_RE: "Regul\xE4re Ausdr\xFCcke (RegExp)",
            GF_BLOCKED_RE: "Regul\xE4re Ausdr\xFCcke (RegExp)",
            VF_BLOCKED_RE: "Regul\xE4re Ausdr\xFCcke (RegExp)",
            MP_BLOCKED_RE: "Regul\xE4re Ausdr\xFCcke (RegExp)",
            PP_BLOCKED_RE: "Regul\xE4re Ausdr\xFCcke (RegExp)",
            DLG_VERBOSITY: "Optionen f\xFCr ausgeblendete Beitr\xE4ge",
            DLG_PREFERENCES: "Einstellungen",
            DLG_PREFERENCES_DESC: "Labels, Position, Farben und Sprache.",
            DLG_REPORT_BUG: "Fehler melden",
            DLG_REPORT_BUG_DESC: "Erstelle einen Diagnosebericht f\xFCr Probleme.",
            DLG_REPORT_BUG_NOTICE: "Hilf uns, es zu beheben:\n1. Scrolle so, dass der problematische Beitrag sichtbar ist.\n2. Klicke auf 'Bericht erstellen' und dann auf 'Bericht kopieren'.\n3. Klicke auf 'Issues \xF6ffnen' und f\xFCge den Bericht in ein neues Issue ein.\n4. F\xFCge eine kurze Beschreibung des Problems hinzu.\n(Wir schw\xE4rzen Namen/Texte, aber bitte vor dem Teilen \xFCberpr\xFCfen!)",
            DLG_REPORT_BUG_GENERATE: "Bericht erstellen",
            DLG_REPORT_BUG_COPY: "Bericht kopieren",
            DLG_REPORT_BUG_OPEN_ISSUES: "Issues \xF6ffnen",
            DLG_REPORT_BUG_STATUS_READY: "Bericht bereit.",
            DLG_REPORT_BUG_STATUS_COPIED: "Bericht in die Zwischenablage kopiert.",
            DLG_REPORT_BUG_STATUS_FAILED: "Kopieren fehlgeschlagen. Bitte manuell kopieren.",
            DLG_VERBOSITY_CAPTION: "Ein Label anzeigen, wenn ein Beitrag ausgeblendet ist",
            VERBOSITY_MESSAGE: [
              "kein Label",
              "Beitrag ausgeblendet. Regel: ",
              " Beitr\xE4ge versteckt",
              "7 Beitr\xE4ge versteckt ~ (nur Gruppen-Feed)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Textfarbe",
            VERBOSITY_MESSAGE_BG_COLOUR: "Hintergrundfarbe",
            VERBOSITY_DEBUG: 'Markieren Sie "versteckte" Beitr\xE4ge',
            CMF_CUSTOMISATIONS: "Anpassungen",
            CMF_BTN_LOCATION: "Position der CMF-Schaltfl\xE4che:",
            CMF_BTN_OPTION: [
              "unten links",
              "oben rechts",
              'deaktiviert (verwenden Sie "Einstellungen" im Men\xFC "Benutzerskriptbefehle")'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Sprache von Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "Deutsch",
            CMF_DIALOG_LANGUAGE_DEFAULT: "Website-Sprache verwenden",
            GM_MENU_SETTINGS: "Einstellungen",
            CMF_DIALOG_LOCATION: "Position dieses Men\xFCs:",
            CMF_DIALOG_OPTION: ["linke Seite", "rechte Seite"],
            CMF_BORDER_COLOUR: "Farbe der Umrandung",
            DLG_TIPS: "Info",
            DLG_TIPS_DESC: "Projektlinks und Infos zum Maintainer.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Wenn das hilft, bedeutet mir ein Stern auf {github} viel.",
            DLG_TIPS_FACEBOOK: "Sag gern Hallo auf {facebook} - dort teile ich Kunst und Poesie.",
            DLG_TIPS_SITE: "Wenn du sehen willst, was ich im Netz mache, ist meine {site} der beste Start.",
            DLG_TIPS_CREDITS: "Besonderer Dank an {zbluebugz} f\xFCr das urspr\xFCngliche Projekt und an {trinhquocviet} f\xFCr den vereinfachten UI-Branch, von dem ich urspr\xFCnglich geforkt habe - plus die Filterpflege in dieser Phase.",
            DLG_TIPS_MAINTAINER_PREFIX: "Vom Maintainer:",
            DLG_TIPS_MAINTAINER: "Ich hoffe, dieses Skript hilft dir, deinen Feed zur\xFCckzuholen. Ich verspreche, dein Verb\xFCndeter im Kampf gegen Dinge zu sein, die du online nicht sehen willst.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "meine Facebook-Seite",
            DLG_TIPS_LINK_SITE: "meine Website",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Speichern", "Schlie\xDFen", "Exportieren", "Importieren", "Zur\xFCcksetzen"],
            DLG_BUTTON_TOOLTIPS: [
              "Speichert \xC4nderungen in diesem Browser. L\xF6schen von Daten/Inkognito entfernt sie.",
              "Exportiert eine Sicherungsdatei zum Behalten und \xDCbertragen.",
              "Importiert eine Einstellungsdatei zum Wiederherstellen oder \xDCbertragen.",
              "Setzt alle Einstellungen auf Standard zur\xFCck."
            ],
            DLG_FB_COLOUR_HINT: "Leer lassen, um das Farbschema von FB zu verwenden"
          },
          // -- Ελληνικά (Greece)
          el: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "\u03A7\u03BF\u03C1\u03B7\u03B3\u03BF\u03CD\u03BC\u03B5\u03BD\u03B7",
            NF_TABLIST_STORIES_REELS_ROOMS: '\u039B\u03AF\u03C3\u03C4\u03B1 \u03BA\u03B1\u03C1\u03C4\u03B5\u03BB\u03CE\u03BD "\u0399\u03C3\u03C4\u03BF\u03C1\u03AF\u03B5\u03C2 | Reels | \u0394\u03C9\u03BC\u03AC\u03C4\u03B9\u03B1"',
            NF_STORIES: "\u0399\u03C3\u03C4\u03BF\u03C1\u03AF\u03B5\u03C2",
            NF_TOP_CARDS_PAGES: "\u039A\u03BF\u03C1\u03C5\u03C6\u03B1\u03AF\u03B5\u03C2 \u03BA\u03AC\u03C1\u03C4\u03B5\u03C2 (\u03B3\u03B9\u03B1 \u03A3\u03B5\u03BB\u03AF\u03B4\u03B5\u03C2)",
            NF_META_AI: "\u0394\u03BF\u03BA\u03B9\u03BC\u03AC\u03C3\u03C4\u03B5 \u03C4\u03BF Meta AI",
            NF_HIDE_VERIFIED_BADGE: "\u0391\u03C0\u03CC\u03BA\u03C1\u03C5\u03C8\u03B7 \u03B5\u03C0\u03B1\u03BB\u03B7\u03B8\u03B5\u03C5\u03BC\u03AD\u03BD\u03C9\u03BD \u03C3\u03B7\u03BC\u03AC\u03C4\u03C9\u03BD",
            NF_FILTER_VERIFIED_BADGE: "\u03A6\u03B9\u03BB\u03C4\u03C1\u03AC\u03C1\u03B9\u03C3\u03BC\u03B1 \u03B5\u03C0\u03B1\u03BB\u03B7\u03B8\u03B5\u03C5\u03BC\u03AD\u03BD\u03C9\u03BD \u03BB\u03BF\u03B3\u03B1\u03C1\u03B9\u03B1\u03C3\u03BC\u03CE\u03BD",
            NF_AI_SIDE_PANELS: "AI \u03C3\u03C4\u03B1 \u03C0\u03BB\u03B5\u03C5\u03C1\u03B9\u03BA\u03AC \u03C0\u03AC\u03BD\u03B5\u03BB",
            NF_SURVEY: "\u03A4\u03BF\u03C0\u03BF\u03B3\u03C1\u03AC\u03C6\u03B7\u03C3\u03B7",
            NF_PEOPLE_YOU_MAY_KNOW: "\u0386\u03C4\u03BF\u03BC\u03B1 \u03C0\u03BF\u03C5 \u03AF\u03C3\u03C9\u03C2 \u03B3\u03BD\u03C9\u03C1\u03AF\u03B6\u03B5\u03C4\u03B5",
            NF_PAID_PARTNERSHIP: "\u03A0\u03BB\u03B7\u03C1\u03C9\u03BC\u03AD\u03BD\u03B7 \u03C3\u03C5\u03BD\u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1",
            NF_SPONSORED_PAID: "\u03A7\u03BF\u03C1\u03B7\u03B3\u03BF\u03CD\u03BC\u03B5\u03BD\u03BF \xB7 \u03A0\u03BB\u03B7\u03C1\u03C9\u03BC\u03AD\u03BD\u03BF \u03B1\u03C0\u03CC ______",
            NF_SUGGESTIONS: "\u03A0\u03C1\u03BF\u03C4\u03AC\u03C3\u03B5\u03B9\u03C2 / \u03A3\u03C5\u03C3\u03C4\u03AC\u03C3\u03B5\u03B9\u03C2",
            NF_FOLLOW: "\u0391\u03BA\u03BF\u03BB\u03BF\u03CD\u03B8\u03B7\u03C3\u03B5",
            NF_PARTICIPATE: "\u03A3\u03C5\u03BC\u03BC\u03B5\u03C4\u03AD\u03C7\u03C9",
            NF_REELS_SHORT_VIDEOS: "Reel \u03BA\u03B1\u03B9 \u03C3\u03CD\u03BD\u03C4\u03BF\u03BC\u03B1 \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF",
            NF_SHORT_REEL_VIDEO: "\u03A1\u03B9\u03BB\u03C2/\u03BC\u03B9\u03BA\u03C1\u03CC \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF",
            NF_EVENTS_YOU_MAY_LIKE: "\u0395\u03BA\u03B4\u03B7\u03BB\u03CE\u03C3\u03B5\u03B9\u03C2 \u03C0\u03BF\u03C5 \u03BC\u03C0\u03BF\u03C1\u03B5\u03AF \u03BD\u03B1 \u03C3\u03B1\u03C2 \u03B1\u03C1\u03AD\u03C3\u03BF\u03C5\u03BD",
            NF_ANIMATED_GIFS_POSTS: "\u039A\u03B9\u03BD\u03BF\u03CD\u03BC\u03B5\u03BD\u03B5\u03C2 \u03B5\u03B9\u03BA\u03CC\u03BD\u03B5\u03C2 GIF",
            NF_ANIMATED_GIFS_PAUSE: "\u03A0\u03B1\u03CD\u03C3\u03B7 \u03BA\u03B9\u03BD\u03BF\u03CD\u03BC\u03B5\u03BD\u03C9\u03BD GIF",
            NF_SHARES: "# \u03BC\u03B5\u03C1\u03AF\u03B4\u03B9\u03B1",
            NF_LIKES_MAXIMUM: '\u039C\u03AD\u03B3\u03B9\u03C3\u03C4\u03B1 "\u039C\u03BF\u03C5 \u03B1\u03C1\u03AD\u03C3\u03B5\u03B9"',
            GF_PAID_PARTNERSHIP: "\u03A0\u03BB\u03B7\u03C1\u03C9\u03BC\u03AD\u03BD\u03B7 \u03C3\u03C5\u03BD\u03B5\u03C1\u03B3\u03B1\u03C3\u03AF\u03B1",
            GF_SUGGESTIONS: "\u03A0\u03C1\u03BF\u03C4\u03AC\u03C3\u03B5\u03B9\u03C2 / \u03A3\u03C5\u03C3\u03C4\u03AC\u03C3\u03B5\u03B9\u03C2",
            GF_SHORT_REEL_VIDEO: "\u03A1\u03B9\u03BB\u03C2/\u03BC\u03B9\u03BA\u03C1\u03CC \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF",
            GF_ANIMATED_GIFS_POSTS: "\u039A\u03B9\u03BD\u03BF\u03CD\u03BC\u03B5\u03BD\u03B5\u03C2 \u03B5\u03B9\u03BA\u03CC\u03BD\u03B5\u03C2 GIF",
            GF_ANIMATED_GIFS_PAUSE: "\u03A0\u03B1\u03CD\u03C3\u03B7 \u03BA\u03B9\u03BD\u03BF\u03CD\u03BC\u03B5\u03BD\u03C9\u03BD GIF",
            GF_SHARES: "# \u03BC\u03B5\u03C1\u03AF\u03B4\u03B9\u03B1",
            VF_LIVE: "\u0396\u03A9\u039D\u03A4\u0391\u039D\u0391",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "\u0394\u03B9\u03C0\u03BB\u03CC\u03C4\u03C5\u03C0\u03BF \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF",
            VF_ANIMATED_GIFS_PAUSE: "\u03A0\u03B1\u03CD\u03C3\u03B7 \u03BA\u03B9\u03BD\u03BF\u03CD\u03BC\u03B5\u03BD\u03C9\u03BD GIF",
            PP_ANIMATED_GIFS_POSTS: "\u039A\u03B9\u03BD\u03BF\u03CD\u03BC\u03B5\u03BD\u03B5\u03C2 \u03B5\u03B9\u03BA\u03CC\u03BD\u03B5\u03C2 GIF",
            PP_ANIMATED_GIFS_PAUSE: "\u03A0\u03B1\u03CD\u03C3\u03B7 \u03BA\u03B9\u03BD\u03BF\u03CD\u03BC\u03B5\u03BD\u03C9\u03BD GIF",
            NF_BLOCKED_FEED: ["\u03A1\u03BF\u03AE \u03B5\u03B9\u03B4\u03AE\u03C3\u03B5\u03C9\u03BD", "\u03A1\u03BF\u03AE \u03BF\u03BC\u03AC\u03B4\u03C9\u03BD", "\u03A1\u03BF\u03AE \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF"],
            GF_BLOCKED_FEED: ["\u03A1\u03BF\u03AE \u03B5\u03B9\u03B4\u03AE\u03C3\u03B5\u03C9\u03BD", "\u03A1\u03BF\u03AE \u03BF\u03BC\u03AC\u03B4\u03C9\u03BD", "\u03A1\u03BF\u03AE \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF"],
            VF_BLOCKED_FEED: ["\u03A1\u03BF\u03AE \u03B5\u03B9\u03B4\u03AE\u03C3\u03B5\u03C9\u03BD", "\u03A1\u03BF\u03AE \u03BF\u03BC\u03AC\u03B4\u03C9\u03BD", "\u03A1\u03BF\u03AE \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF"],
            MP_BLOCKED_FEED: ["\u03A1\u03BF\u03AE Marketplace"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "\u039A\u03BF\u03C1\u03BF\u03BD\u03BF\u03CA\u03CC\u03C2 (\u03C0\u03BB\u03B1\u03AF\u03C3\u03B9\u03BF \u03C0\u03BB\u03B7\u03C1\u03BF\u03C6\u03BF\u03C1\u03B9\u03CE\u03BD)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "\u0395\u03C0\u03B9\u03C3\u03C4\u03AE\u03BC\u03B7 \u03C4\u03BF\u03C5 \u03BA\u03BB\u03AF\u03BC\u03B1\u03C4\u03BF\u03C2 (\u03C0\u03BB\u03B1\u03AF\u03C3\u03B9\u03BF \u03C0\u03BB\u03B7\u03C1\u03BF\u03C6\u03BF\u03C1\u03B9\u03CE\u03BD)",
            OTHER_INFO_BOX_SUBSCRIBE: "\u0395\u03B3\u03B3\u03C1\u03B1\u03C6\u03AE (\u03C0\u03BB\u03B1\u03AF\u03C3\u03B9\u03BF \u03C0\u03BB\u03B7\u03C1\u03BF\u03C6\u03BF\u03C1\u03B9\u03CE\u03BD)",
            REELS_TITLE: "Reel",
            DLG_REELS_DESC: "\u0388\u03BB\u03B5\u03B3\u03C7\u03BF\u03B9 \u03B1\u03BD\u03B1\u03C0\u03B1\u03C1\u03B1\u03B3\u03C9\u03B3\u03AE\u03C2 \u03BA\u03B1\u03B9 \u03B5\u03C0\u03B1\u03BD\u03AC\u03BB\u03B7\u03C8\u03B7\u03C2.",
            REELS_CONTROLS: "\u0395\u03BC\u03C6\u03AC\u03BD\u03B9\u03C3\u03B7 \u03C7\u03B5\u03B9\u03C1\u03B9\u03C3\u03C4\u03B7\u03C1\u03AF\u03C9\u03BD \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF",
            REELS_DISABLE_LOOPING: "\u0391\u03C0\u03B5\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7 \u03B5\u03C0\u03B1\u03BD\u03AC\u03BB\u03B7\u03C8\u03B7\u03C2",
            DLG_TITLE: "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C4\u03C9\u03BD \u03C1\u03BF\u03CE\u03BD \u03BC\u03BF\u03C5",
            DLG_NF: "\u03A1\u03BF\u03AE \u03B5\u03B9\u03B4\u03AE\u03C3\u03B5\u03C9\u03BD",
            DLG_NF_DESC: "\u039A\u03B1\u03B8\u03B1\u03C1\u03AF\u03C3\u03C4\u03B5 \u03C4\u03B9\u03C2 \u03C0\u03C1\u03BF\u03C4\u03AC\u03C3\u03B5\u03B9\u03C2 \u03BA\u03B1\u03B9 \u03BF\u03C1\u03AF\u03C3\u03C4\u03B5 \u03C0\u03CC\u03C3\u03BF \u03B1\u03C5\u03C3\u03C4\u03B7\u03C1\u03AE \u03B8\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03B7 \u03C1\u03BF\u03AE.",
            DLG_GF: "\u03A1\u03BF\u03AE \u03BF\u03BC\u03AC\u03B4\u03C9\u03BD",
            DLG_GF_DESC: "\u03A4\u03B1\u03BA\u03C4\u03BF\u03C0\u03BF\u03B9\u03AE\u03C3\u03C4\u03B5 \u03C4\u03B9\u03C2 \u03C1\u03BF\u03AD\u03C2 \u03BF\u03BC\u03AC\u03B4\u03C9\u03BD \u03BC\u03B5\u03B9\u03CE\u03BD\u03BF\u03BD\u03C4\u03B1\u03C2 \u03C4\u03B1 \u03C0\u03B5\u03C1\u03B9\u03C4\u03C4\u03AC \u03BA\u03B1\u03B9 \u03C4\u03BF \u03B8\u03CC\u03C1\u03C5\u03B2\u03BF.",
            DLG_VF: "\u03A1\u03BF\u03AE \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF",
            DLG_VF_DESC: "\u039A\u03C1\u03B1\u03C4\u03AE\u03C3\u03C4\u03B5 \u03C4\u03B7 \u03C1\u03BF\u03AE \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF \u03BA\u03B1\u03B8\u03B1\u03C1\u03AE \u03BC\u03B5\u03B9\u03CE\u03BD\u03BF\u03BD\u03C4\u03B1\u03C2 \u03B5\u03C0\u03B1\u03BD\u03B1\u03BB\u03AE\u03C8\u03B5\u03B9\u03C2 \u03BA\u03B1\u03B9 \u03B1\u03BA\u03B1\u03C4\u03B1\u03C3\u03C4\u03B1\u03C3\u03AF\u03B1.",
            DLG_MP: "\u03A1\u03BF\u03AE Marketplace",
            DLG_MP_DESC: "\u03A6\u03B9\u03BB\u03C4\u03C1\u03AC\u03C1\u03B5\u03C4\u03B5 \u03B1\u03B3\u03B3\u03B5\u03BB\u03AF\u03B5\u03C2 \u03BC\u03B5 \u03B2\u03AC\u03C3\u03B7 \u03C4\u03B9\u03BC\u03AE \u03BA\u03B1\u03B9 \u03BB\u03AD\u03BE\u03B5\u03B9\u03C2.",
            DLG_PP: "\u03A0\u03C1\u03BF\u03C6\u03AF\u03BB / \u03A3\u03B5\u03BB\u03AF\u03B4\u03B1",
            DLG_PP_DESC: "\u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03C4\u03B5 \u03C4\u03B9 \u03B5\u03BC\u03C6\u03B1\u03BD\u03AF\u03B6\u03B5\u03C4\u03B1\u03B9 \u03C3\u03B5 \u03C0\u03C1\u03BF\u03C6\u03AF\u03BB \u03BA\u03B1\u03B9 \u03C3\u03B5\u03BB\u03AF\u03B4\u03B5\u03C2.",
            DLG_OTHER: "\u03A3\u03C5\u03BC\u03C0\u03BB\u03B7\u03C1\u03C9\u03BC\u03B1\u03C4\u03B9\u03BA\u03AD\u03C2 \u03C3\u03B7\u03BC\u03B5\u03B9\u03CE\u03C3\u03B5\u03B9\u03C2",
            DLG_OTHER_DESC: "\u039A\u03C1\u03CD\u03C8\u03C4\u03B5 \u03B5\u03C0\u03B9\u03C0\u03BB\u03AD\u03BF\u03BD \u03C0\u03BB\u03B1\u03AF\u03C3\u03B9\u03B1 \u03C0\u03BF\u03C5 \u03B4\u03B5\u03BD \u03B8\u03AD\u03BB\u03B5\u03C4\u03B5.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "\u03A6\u03AF\u03BB\u03C4\u03C1\u03BF \u03BA\u03B5\u03B9\u03BC\u03AD\u03BD\u03BF\u03C5",
            DLG_BLOCK_NEW_LINE: "(\u0394\u03B9\u03B1\u03C7\u03C9\u03C1\u03AF\u03C3\u03C4\u03B5 \u03BB\u03AD\u03BE\u03B5\u03B9\u03C2 \u03AE \u03C6\u03C1\u03AC\u03C3\u03B5\u03B9\u03C2 \u03BC\u03B5 \u03B1\u03BB\u03BB\u03B1\u03B3\u03AE \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE\u03C2, \u03C5\u03C0\u03BF\u03C3\u03C4\u03B7\u03C1\u03AF\u03B6\u03BF\u03BD\u03C4\u03B1\u03B9 \u03BA\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AD\u03C2 \u03B5\u03BA\u03C6\u03C1\u03AC\u03C3\u03B5\u03B9\u03C2)",
            NF_BLOCKED_ENABLED: "\u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03BF",
            GF_BLOCKED_ENABLED: "\u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03BF",
            VF_BLOCKED_ENABLED: "\u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03BF",
            MP_BLOCKED_ENABLED: "\u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03BF",
            PP_BLOCKED_ENABLED: "\u0395\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03BF",
            NF_BLOCKED_RE: "\u039A\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AD\u03C2 \u0395\u03BA\u03C6\u03C1\u03AC\u03C3\u03B5\u03B9\u03C2 (RegExp)",
            GF_BLOCKED_RE: "\u039A\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AD\u03C2 \u0395\u03BA\u03C6\u03C1\u03AC\u03C3\u03B5\u03B9\u03C2 (RegExp)",
            VF_BLOCKED_RE: "\u039A\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AD\u03C2 \u0395\u03BA\u03C6\u03C1\u03AC\u03C3\u03B5\u03B9\u03C2 (RegExp)",
            MP_BLOCKED_RE: "\u039A\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AD\u03C2 \u0395\u03BA\u03C6\u03C1\u03AC\u03C3\u03B5\u03B9\u03C2 (RegExp)",
            PP_BLOCKED_RE: "\u039A\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AD\u03C2 \u0395\u03BA\u03C6\u03C1\u03AC\u03C3\u03B5\u03B9\u03C2 (RegExp)",
            DLG_VERBOSITY: "\u0395\u03C0\u03B9\u03BB\u03BF\u03B3\u03AD\u03C2 \u03B3\u03B9\u03B1 \u03BA\u03C1\u03C5\u03C6\u03AD\u03C2 \u03B1\u03BD\u03B1\u03C1\u03C4\u03AE\u03C3\u03B5\u03B9\u03C2",
            DLG_PREFERENCES: "\u03A0\u03C1\u03BF\u03C4\u03B9\u03BC\u03AE\u03C3\u03B5\u03B9\u03C2",
            DLG_PREFERENCES_DESC: "\u0395\u03C4\u03B9\u03BA\u03AD\u03C4\u03B5\u03C2, \u03B8\u03AD\u03C3\u03B7, \u03C7\u03C1\u03CE\u03BC\u03B1\u03C4\u03B1 \u03BA\u03B1\u03B9 \u03B3\u03BB\u03CE\u03C3\u03C3\u03B1.",
            DLG_REPORT_BUG: "\u0391\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC \u03C3\u03C6\u03AC\u03BB\u03BC\u03B1\u03C4\u03BF\u03C2",
            DLG_REPORT_BUG_DESC: "\u0394\u03B7\u03BC\u03B9\u03BF\u03CD\u03C1\u03B3\u03B7\u03C3\u03B5 \u03B4\u03B9\u03B1\u03B3\u03BD\u03C9\u03C3\u03C4\u03B9\u03BA\u03AE \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC \u03B3\u03B9\u03B1 \u03C0\u03C1\u03BF\u03B2\u03BB\u03AE\u03BC\u03B1\u03C4\u03B1.",
            DLG_REPORT_BUG_NOTICE: "\u0392\u03BF\u03B7\u03B8\u03AE\u03C3\u03C4\u03B5 \u03BC\u03B1\u03C2 \u03BD\u03B1 \u03C4\u03BF \u03B4\u03B9\u03BF\u03C1\u03B8\u03CE\u03C3\u03BF\u03C5\u03BC\u03B5:\n1. \u039A\u03AC\u03BD\u03C4\u03B5 \u03BA\u03CD\u03BB\u03B9\u03C3\u03B7 \u03CE\u03C3\u03C4\u03B5 \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03BF\u03C1\u03B1\u03C4\u03AE \u03B7 \u03C0\u03C1\u03BF\u03B2\u03BB\u03B7\u03BC\u03B1\u03C4\u03B9\u03BA\u03AE \u03B4\u03B7\u03BC\u03BF\u03C3\u03AF\u03B5\u03C5\u03C3\u03B7.\n2. \u039A\u03AC\u03BD\u03C4\u03B5 \u03BA\u03BB\u03B9\u03BA \u03C3\u03C4\u03BF '\u0394\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC\u03C2' \u03BA\u03B1\u03B9 \u03BC\u03B5\u03C4\u03AC \u03C3\u03C4\u03BF '\u0391\u03BD\u03C4\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC\u03C2'.\n3. \u039A\u03AC\u03BD\u03C4\u03B5 \u03BA\u03BB\u03B9\u03BA \u03C3\u03C4\u03BF '\u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1 \u03B8\u03B5\u03BC\u03AC\u03C4\u03C9\u03BD' \u03BA\u03B1\u03B9 \u03B5\u03C0\u03B9\u03BA\u03BF\u03BB\u03BB\u03AE\u03C3\u03C4\u03B5 \u03C4\u03B7\u03BD \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC \u03C3\u03B5 \u03AD\u03BD\u03B1 \u03BD\u03AD\u03BF \u03B8\u03AD\u03BC\u03B1.\n4. \u03A0\u03C1\u03BF\u03C3\u03B8\u03AD\u03C3\u03C4\u03B5 \u03BC\u03B9\u03B1 \u03C3\u03CD\u03BD\u03C4\u03BF\u03BC\u03B7 \u03C0\u03B5\u03C1\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE \u03C4\u03BF\u03C5 \u03C0\u03C1\u03BF\u03B2\u03BB\u03AE\u03BC\u03B1\u03C4\u03BF\u03C2.\n(\u0391\u03C0\u03BF\u03BA\u03C1\u03CD\u03C0\u03C4\u03BF\u03C5\u03BC\u03B5 \u03BF\u03BD\u03CC\u03BC\u03B1\u03C4\u03B1/\u03BA\u03B5\u03AF\u03BC\u03B5\u03BD\u03BF, \u03B1\u03BB\u03BB\u03AC \u03C0\u03B1\u03C1\u03B1\u03BA\u03B1\u03BB\u03BF\u03CD\u03BC\u03B5 \u03B5\u03BB\u03AD\u03B3\u03BE\u03C4\u03B5 \u03C0\u03C1\u03B9\u03BD \u03C4\u03B7\u03BD \u03BA\u03BF\u03B9\u03BD\u03BF\u03C0\u03BF\u03AF\u03B7\u03C3\u03B7!)",
            DLG_REPORT_BUG_GENERATE: "\u0394\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC\u03C2",
            DLG_REPORT_BUG_COPY: "\u0391\u03BD\u03C4\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC\u03C2",
            DLG_REPORT_BUG_OPEN_ISSUES: "\u0386\u03BD\u03BF\u03B9\u03B3\u03BC\u03B1 \u03B8\u03B5\u03BC\u03AC\u03C4\u03C9\u03BD",
            DLG_REPORT_BUG_STATUS_READY: "\u0397 \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC \u03B5\u03AF\u03BD\u03B1\u03B9 \u03AD\u03C4\u03BF\u03B9\u03BC\u03B7.",
            DLG_REPORT_BUG_STATUS_COPIED: "\u0397 \u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC \u03B1\u03BD\u03C4\u03B9\u03B3\u03C1\u03AC\u03C6\u03B7\u03BA\u03B5.",
            DLG_REPORT_BUG_STATUS_FAILED: "\u0391\u03C0\u03BF\u03C4\u03C5\u03C7\u03AF\u03B1 \u03B1\u03BD\u03C4\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE\u03C2. \u0391\u03BD\u03C4\u03AD\u03B3\u03C1\u03B1\u03C8\u03B5 \u03C7\u03B5\u03B9\u03C1\u03BF\u03BA\u03AF\u03BD\u03B7\u03C4\u03B1.",
            DLG_VERBOSITY_CAPTION: "\u0395\u03BC\u03C6\u03AC\u03BD\u03B9\u03C3\u03B7 \u03B5\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1\u03C2 \u03B1\u03BD \u03BC\u03B9\u03B1 \u03B4\u03B7\u03BC\u03BF\u03C3\u03AF\u03B5\u03C5\u03C3\u03B7 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03BA\u03C1\u03C5\u03BC\u03BC\u03AD\u03BD\u03B7",
            VERBOSITY_MESSAGE: [
              "\u03C7\u03C9\u03C1\u03AF\u03C2 \u03B5\u03C4\u03B9\u03BA\u03AD\u03C4\u03B1",
              "\u0394\u03B7\u03BC\u03BF\u03C3\u03AF\u03B5\u03C5\u03C3\u03B7 \u03BA\u03C1\u03C5\u03BC\u03BC\u03AD\u03BD\u03B7. \u039A\u03B1\u03BD\u03CC\u03BD\u03B1\u03C2: ",
              " \u03B4\u03B7\u03BC\u03BF\u03C3\u03B9\u03B5\u03CD\u03C3\u03B5\u03B9\u03C2 \u03BA\u03C1\u03C5\u03BC\u03BC\u03AD\u03BD\u03B5\u03C2",
              "7 \u03B4\u03B7\u03BC\u03BF\u03C3\u03B9\u03B5\u03CD\u03C3\u03B5\u03B9\u03C2 \u03BA\u03C1\u03C5\u03BC\u03BC\u03AD\u03BD\u03B5\u03C2 ~ (\u03BC\u03CC\u03BD\u03BF \u03C3\u03C4\u03B7\u03BD \u03C4\u03C1\u03BF\u03C6\u03BF\u03B4\u03BF\u03C3\u03AF\u03B1 \u03C4\u03C9\u03BD \u03BF\u03BC\u03AC\u03B4\u03C9\u03BD)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "\u03A7\u03C1\u03CE\u03BC\u03B1 \u03BA\u03B5\u03B9\u03BC\u03AD\u03BD\u03BF\u03C5",
            VERBOSITY_MESSAGE_BG_COLOUR: "\u03A7\u03C1\u03CE\u03BC\u03B1 \u03C6\u03CC\u03BD\u03C4\u03BF\u03C5",
            VERBOSITY_DEBUG: '\u0395\u03C0\u03B9\u03C3\u03AE\u03BC\u03B1\u03BD\u03C3\u03B7 "\u03BA\u03C1\u03C5\u03C6\u03CE\u03BD \u03B1\u03BD\u03B1\u03C1\u03C4\u03AE\u03C3\u03B5\u03C9\u03BD"',
            CMF_CUSTOMISATIONS: "\u03A0\u03C1\u03BF\u03C3\u03B1\u03C1\u03BC\u03BF\u03B3\u03AD\u03C2",
            CMF_BTN_LOCATION: "\u03A4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 \u03C4\u03BF\u03C5 \u03BA\u03BF\u03C5\u03BC\u03C0\u03B9\u03BF\u03CD CMF:",
            CMF_BTN_OPTION: [
              "\u03BA\u03AC\u03C4\u03C9 \u03B1\u03C1\u03B9\u03C3\u03C4\u03B5\u03C1\u03AC",
              "\u03C0\u03AC\u03BD\u03C9 \u03B4\u03B5\u03BE\u03B9\u03AC",
              '\u03B1\u03C0\u03B5\u03BD\u03B5\u03C1\u03B3\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03BF (\u03C7\u03C1\u03B7\u03C3\u03B9\u03BC\u03BF\u03C0\u03BF\u03B9\u03AE\u03C3\u03C4\u03B5 "\u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2" \u03C3\u03C4\u03BF \u03BC\u03B5\u03BD\u03BF\u03CD "\u0395\u03BD\u03C4\u03BF\u03BB\u03AD\u03C2 \u03C3\u03B5\u03BD\u03B1\u03C1\u03AF\u03BF\u03C5 \u03C7\u03C1\u03AE\u03C3\u03C4\u03B7")'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "\u0393\u03BB\u03CE\u03C3\u03C3\u03B1 \u03C4\u03BF\u03C5 Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC",
            CMF_DIALOG_LANGUAGE_DEFAULT: "\u03A7\u03C1\u03AE\u03C3\u03B7 \u03B3\u03BB\u03CE\u03C3\u03C3\u03B1\u03C2 \u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03BF\u03C5",
            GM_MENU_SETTINGS: "\u03A1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2",
            CMF_DIALOG_LOCATION: "\u03A4\u03BF\u03C0\u03BF\u03B8\u03B5\u03C3\u03AF\u03B1 \u03B1\u03C5\u03C4\u03BF\u03CD \u03C4\u03BF\u03C5 \u03BC\u03B5\u03BD\u03BF\u03CD:",
            CMF_DIALOG_OPTION: ["\u03B1\u03C1\u03B9\u03C3\u03C4\u03B5\u03C1\u03AE \u03C0\u03BB\u03B5\u03C5\u03C1\u03AC", "\u03B4\u03B5\u03BE\u03B9\u03AC \u03C0\u03BB\u03B5\u03C5\u03C1\u03AC"],
            CMF_BORDER_COLOUR: "\u03A7\u03C1\u03CE\u03BC\u03B1 \u03C0\u03B5\u03C1\u03B9\u03B3\u03C1\u03AC\u03BC\u03BC\u03B1\u03C4\u03BF\u03C2",
            DLG_TIPS: "\u03A3\u03C7\u03B5\u03C4\u03B9\u03BA\u03AC",
            DLG_TIPS_DESC: "\u03A3\u03CD\u03BD\u03B4\u03B5\u03C3\u03BC\u03BF\u03B9 \u03AD\u03C1\u03B3\u03BF\u03C5 \u03BA\u03B1\u03B9 \u03C0\u03BB\u03B7\u03C1\u03BF\u03C6\u03BF\u03C1\u03AF\u03B5\u03C2 \u03C3\u03C5\u03BD\u03C4\u03B7\u03C1\u03B7\u03C4\u03AE.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "\u0391\u03BD \u03B2\u03BF\u03B7\u03B8\u03AC\u03B5\u03B9, \u03AD\u03BD\u03B1 \u03B1\u03C3\u03C4\u03AD\u03C1\u03B9 \u03C3\u03C4\u03BF {github} \u03C3\u03B7\u03BC\u03B1\u03AF\u03BD\u03B5\u03B9 \u03C0\u03BF\u03BB\u03BB\u03AC.",
            DLG_TIPS_FACEBOOK: "\u03A0\u03B5\u03C2 \u03B3\u03B5\u03B9\u03B1 \u03C3\u03C4\u03B7 {facebook} - \u03B5\u03BA\u03B5\u03AF \u03BC\u03BF\u03B9\u03C1\u03AC\u03B6\u03BF\u03BC\u03B1\u03B9 \u03C4\u03AD\u03C7\u03BD\u03B7 \u03BA\u03B1\u03B9 \u03C0\u03BF\u03AF\u03B7\u03C3\u03B7.",
            DLG_TIPS_SITE: "\u0391\u03BD \u03B8\u03AD\u03BB\u03B5\u03B9\u03C2 \u03BD\u03B1 \u03B4\u03B5\u03B9\u03C2 \u03C4\u03B9 \u03BA\u03AC\u03BD\u03C9 \u03B3\u03B5\u03BD\u03B9\u03BA\u03AC \u03C3\u03C4\u03BF \u03B4\u03B9\u03B1\u03B4\u03AF\u03BA\u03C4\u03C5\u03BF, \u03C4\u03BF {site} \u03B5\u03AF\u03BD\u03B1\u03B9 \u03C4\u03BF \u03BA\u03B1\u03BB\u03CD\u03C4\u03B5\u03C1\u03BF \u03C3\u03B7\u03BC\u03B5\u03AF\u03BF.",
            DLG_TIPS_CREDITS: "\u0399\u03B4\u03B9\u03B1\u03AF\u03C4\u03B5\u03C1\u03B5\u03C2 \u03B5\u03C5\u03C7\u03B1\u03C1\u03B9\u03C3\u03C4\u03AF\u03B5\u03C2 \u03C3\u03C4\u03BF\u03BD {zbluebugz} \u03B3\u03B9\u03B1 \u03C4\u03BF \u03B1\u03C1\u03C7\u03B9\u03BA\u03CC project \u03BA\u03B1\u03B9 \u03C3\u03C4\u03BF\u03BD {trinhquocviet} \u03B3\u03B9\u03B1 \u03C4\u03BF simplified UI branch \u03B1\u03C0\u03CC \u03C4\u03BF \u03BF\u03C0\u03BF\u03AF\u03BF \u03AD\u03BA\u03B1\u03BD\u03B1 \u03B1\u03C1\u03C7\u03B9\u03BA\u03AC fork - \u03BA\u03B1\u03B8\u03CE\u03C2 \u03BA\u03B1\u03B9 \u03B3\u03B9\u03B1 \u03C4\u03B7 \u03C3\u03C5\u03BD\u03C4\u03AE\u03C1\u03B7\u03C3\u03B7 \u03C4\u03C9\u03BD \u03C6\u03AF\u03BB\u03C4\u03C1\u03C9\u03BD \u03C4\u03CC\u03C4\u03B5.",
            DLG_TIPS_MAINTAINER_PREFIX: "\u0391\u03C0\u03CC \u03C4\u03BF\u03BD \u03C3\u03C5\u03BD\u03C4\u03B7\u03C1\u03B7\u03C4\u03AE:",
            DLG_TIPS_MAINTAINER: "\u0395\u03BB\u03C0\u03AF\u03B6\u03C9 \u03B1\u03C5\u03C4\u03CC \u03C4\u03BF \u03C3\u03BA\u03C1\u03B9\u03C0\u03C4 \u03BD\u03B1 \u03C3\u03B5 \u03B2\u03BF\u03B7\u03B8\u03AE\u03C3\u03B5\u03B9 \u03BD\u03B1 \u03C0\u03AC\u03C1\u03B5\u03B9\u03C2 \u03C0\u03AF\u03C3\u03C9 \u03C4\u03BF feed \u03C3\u03BF\u03C5. \u03A5\u03C0\u03CC\u03C3\u03C7\u03BF\u03BC\u03B1\u03B9 \u03BD\u03B1 \u03B5\u03AF\u03BC\u03B1\u03B9 \u03C3\u03CD\u03BC\u03BC\u03B1\u03C7\u03CC\u03C2 \u03C3\u03BF\u03C5 \u03C3\u03C4\u03B7 \u03BC\u03AC\u03C7\u03B7 \u03B5\u03BD\u03AC\u03BD\u03C4\u03B9\u03B1 \u03C3\u03B5 \u03CC\u03C3\u03B1 \u03B4\u03B5\u03BD \u03B8\u03AD\u03BB\u03B5\u03B9\u03C2 \u03BD\u03B1 \u03B2\u03BB\u03AD\u03C0\u03B5\u03B9\u03C2 online.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "\u03C3\u03B5\u03BB\u03AF\u03B4\u03B1 \u03BC\u03BF\u03C5 \u03C3\u03C4\u03BF Facebook",
            DLG_TIPS_LINK_SITE: "\u03B9\u03C3\u03C4\u03CC\u03C4\u03BF\u03C0\u03CC \u03BC\u03BF\u03C5",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["\u0391\u03C0\u03BF\u03B8\u03AE\u03BA\u03B5\u03C5\u03C3\u03B7", "\u039A\u03BB\u03B5\u03AF\u03C3\u03B9\u03BC\u03BF", "\u0395\u03BE\u03B1\u03B3\u03C9\u03B3\u03AE", "\u0395\u03B9\u03C3\u03B1\u03B3\u03C9\u03B3\u03AE", "\u0395\u03C0\u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC"],
            DLG_BUTTON_TOOLTIPS: [
              "\u0391\u03C0\u03BF\u03B8\u03B7\u03BA\u03B5\u03CD\u03B5\u03B9 \u03C4\u03B9\u03C2 \u03B1\u03BB\u03BB\u03B1\u03B3\u03AD\u03C2 \u03C3\u03B5 \u03B1\u03C5\u03C4\u03CC\u03BD \u03C4\u03BF\u03BD browser. \u0395\u03BA\u03BA\u03B1\u03B8\u03AC\u03C1\u03B9\u03C3\u03B7/\u03B9\u03B4\u03B9\u03C9\u03C4\u03B9\u03BA\u03AE \u03C0\u03B5\u03C1\u03B9\u03AE\u03B3\u03B7\u03C3\u03B7 \u03C4\u03B9\u03C2 \u03C7\u03AC\u03BD\u03B5\u03B9.",
              "\u0395\u03BE\u03AC\u03B3\u03B5\u03B9 \u03B1\u03C1\u03C7\u03B5\u03AF\u03BF backup \u03B3\u03B9\u03B1 \u03B1\u03C3\u03C6\u03AC\u03BB\u03B5\u03B9\u03B1 \u03BA\u03B1\u03B9 \u03BC\u03B5\u03C4\u03B1\u03C6\u03BF\u03C1\u03AC \u03C3\u03B5 \u03C3\u03C5\u03C3\u03BA\u03B5\u03C5\u03AD\u03C2.",
              "\u0395\u03B9\u03C3\u03AC\u03B3\u03B5\u03B9 \u03B1\u03C1\u03C7\u03B5\u03AF\u03BF \u03C1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03C9\u03BD \u03B3\u03B9\u03B1 \u03B5\u03C0\u03B1\u03BD\u03B1\u03C6\u03BF\u03C1\u03AC \u03AE \u03BC\u03B5\u03C4\u03B1\u03C6\u03BF\u03C1\u03AC.",
              "\u0395\u03C0\u03B1\u03BD\u03B1\u03C6\u03AD\u03C1\u03B5\u03B9 \u03CC\u03BB\u03B5\u03C2 \u03C4\u03B9\u03C2 \u03C1\u03C5\u03B8\u03BC\u03AF\u03C3\u03B5\u03B9\u03C2 \u03C3\u03C4\u03B1 \u03C0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03B5\u03B3\u03BC\u03AD\u03BD\u03B1."
            ],
            DLG_FB_COLOUR_HINT: "\u0391\u03C6\u03AE\u03C3\u03C4\u03B5 \u03BA\u03B5\u03BD\u03CC \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03C7\u03C1\u03B7\u03C3\u03B9\u03BC\u03BF\u03C0\u03BF\u03B9\u03AE\u03C3\u03B5\u03C4\u03B5 \u03C4\u03BF \u03C7\u03C1\u03C9\u03BC\u03B1\u03C4\u03B9\u03BA\u03CC \u03C3\u03C7\u03AE\u03BC\u03B1 \u03C4\u03BF\u03C5 FB"
          },
          // -- Espanol (Spain)
          es: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Publicidad",
            NF_TABLIST_STORIES_REELS_ROOMS: 'Cuadro de lista de la pesta\xF1a "Historias | Reels | Salas"',
            NF_STORIES: "Historias",
            NF_TOP_CARDS_PAGES: "Tarjetas principales (para p\xE1ginas)",
            NF_META_AI: "Probar Meta AI",
            NF_HIDE_VERIFIED_BADGE: "Ocultar insignias verificadas",
            NF_FILTER_VERIFIED_BADGE: "Filtrar cuentas verificadas",
            NF_AI_SIDE_PANELS: "IA en paneles laterales",
            NF_SURVEY: "Encuesta",
            NF_PEOPLE_YOU_MAY_KNOW: "Personas que quiz\xE1 conozcas",
            NF_PAID_PARTNERSHIP: "Colaboraci\xF3n pagada",
            NF_SPONSORED_PAID: "Publicidad \xB7 Pagado por ______",
            NF_SUGGESTIONS: "Sugerencias / Recomendaciones",
            NF_FOLLOW: "Seguir",
            NF_PARTICIPATE: "Participar",
            NF_REELS_SHORT_VIDEOS: "Reels y v\xEDdeos cortos",
            NF_SHORT_REEL_VIDEO: "Reel/video corto",
            NF_EVENTS_YOU_MAY_LIKE: "Eventos que te pueden gustar",
            NF_ANIMATED_GIFS_POSTS: "GIF animados",
            NF_ANIMATED_GIFS_PAUSE: "Pausar GIF animados",
            NF_SHARES: "# veces compartida",
            NF_LIKES_MAXIMUM: "N\xFAmero m\xE1ximo de Me gusta",
            GF_PAID_PARTNERSHIP: "Colaboraci\xF3n pagada",
            GF_SUGGESTIONS: "Sugerencias / Recomendaciones",
            GF_SHORT_REEL_VIDEO: "Reel/video corto",
            GF_ANIMATED_GIFS_POSTS: "GIF animados",
            GF_ANIMATED_GIFS_PAUSE: "Pausar GIF animados",
            GF_SHARES: "# veces compartida",
            VF_LIVE: "ESTRENO",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Video duplicado",
            VF_ANIMATED_GIFS_PAUSE: "Pausar GIF animados",
            PP_ANIMATED_GIFS_POSTS: "GIF animados",
            PP_ANIMATED_GIFS_PAUSE: "Pausar GIF animados",
            NF_BLOCKED_FEED: ["Feed de noticias", "Feed de grupos", "Feed de videos"],
            GF_BLOCKED_FEED: ["Feed de noticias", "Feed de grupos", "Feed de videos"],
            VF_BLOCKED_FEED: ["Feed de noticias", "Feed de grupos", "Feed de videos"],
            MP_BLOCKED_FEED: ["Feed de Marketplace"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Coronavirus (cuadro de informaci\xF3n)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Ciencia del clima (cuadro de informaci\xF3n)",
            OTHER_INFO_BOX_SUBSCRIBE: "Suscribir (cuadro de informaci\xF3n)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Controles de reproducci\xF3n y bucle.",
            REELS_CONTROLS: "Mostrar controles de video",
            REELS_DISABLE_LOOPING: "Desactivar bucle",
            DLG_TITLE: "Limpia mis feeds",
            DLG_NF: "Feed de noticias",
            DLG_NF_DESC: "Limpia sugerencias y define lo estricto del feed.",
            DLG_GF: "Feed de grupos",
            DLG_GF_DESC: "Ordena los feeds de grupos recortando extras y ruido.",
            DLG_VF: "Feed de v\xEDdeos",
            DLG_VF_DESC: "Mant\xE9n el feed de videos enfocado reduciendo repeticiones y desorden.",
            DLG_MP: "Feed de Marketplace",
            DLG_MP_DESC: "Filtra anuncios por precio y palabras clave.",
            DLG_PP: "Perfil / P\xE1gina",
            DLG_PP_DESC: "Ajusta lo que se muestra en perfiles y p\xE1ginas.",
            DLG_OTHER: "Notas complementarias",
            DLG_OTHER_DESC: "Oculta cuadros extra que no quieras.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Filtro de texto",
            DLG_BLOCK_NEW_LINE: "(Separe palabras o frases con un salto de l\xEDnea, se admiten expresiones regulares)",
            NF_BLOCKED_ENABLED: "Habilitadas",
            GF_BLOCKED_ENABLED: "Habilitadas",
            VF_BLOCKED_ENABLED: "Habilitadas",
            MP_BLOCKED_ENABLED: "Habilitadas",
            PP_BLOCKED_ENABLED: "Habilitadas",
            NF_BLOCKED_RE: "Expresiones regulares (RegExp)",
            GF_BLOCKED_RE: "Expresiones regulares (RegExp)",
            VF_BLOCKED_RE: "Expresiones regulares (RegExp)",
            MP_BLOCKED_RE: "Expresiones regulares (RegExp)",
            PP_BLOCKED_RE: "Expresiones regulares (RegExp)",
            DLG_VERBOSITY: "Opciones para publicaciones ocultas",
            DLG_PREFERENCES: "Preferencias",
            DLG_PREFERENCES_DESC: "Etiquetas, ubicaci\xF3n, colores e idioma.",
            DLG_REPORT_BUG: "Reportar un error",
            DLG_REPORT_BUG_DESC: "Genera un informe de diagn\xF3stico para problemas.",
            DLG_REPORT_BUG_NOTICE: "Ay\xFAdanos a arreglarlo:\n1. Despl\xE1zate para que la publicaci\xF3n problem\xE1tica sea visible.\n2. Haz clic en 'Generar informe' y luego en 'Copiar informe'.\n3. Haz clic en 'Abrir incidencias' y pega el informe en una nueva incidencia.\n4. A\xF1ade una breve descripci\xF3n del problema.\n(Ocultamos nombres/texto, \xA1pero por favor revisa antes de compartir!)",
            DLG_REPORT_BUG_GENERATE: "Generar informe",
            DLG_REPORT_BUG_COPY: "Copiar informe",
            DLG_REPORT_BUG_OPEN_ISSUES: "Abrir incidencias",
            DLG_REPORT_BUG_STATUS_READY: "Informe listo.",
            DLG_REPORT_BUG_STATUS_COPIED: "Informe copiado al portapapeles.",
            DLG_REPORT_BUG_STATUS_FAILED: "Error al copiar. Copia manualmente.",
            DLG_VERBOSITY_CAPTION: "Mostrar una etiqueta si una publicaci\xF3n est\xE1 oculta",
            VERBOSITY_MESSAGE: [
              "sin etiqueta",
              "Publicaci\xF3n oculta. Regla: ",
              " publicaciones ocultas",
              "7 publicaciones ocultas ~ (solo en el Feed de Grupos)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Color del texto",
            VERBOSITY_MESSAGE_BG_COLOUR: "Color de fondo",
            VERBOSITY_DEBUG: 'Destacar publicaciones "ocultas"',
            CMF_CUSTOMISATIONS: "Personalizaciones",
            CMF_BTN_LOCATION: "Ubicaci\xF3n del bot\xF3n CMF:",
            CMF_BTN_OPTION: [
              "abajo a la izquierda",
              "arriba a la derecha",
              'deshabilitado (use "Configuraci\xF3n" en el men\xFA Comandos de script de usuario)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Idioma de Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "Espa\xF1ol",
            CMF_DIALOG_LANGUAGE_DEFAULT: "Usar idioma del sitio",
            GM_MENU_SETTINGS: "Configuraci\xF3n",
            CMF_DIALOG_LOCATION: "Ubicaci\xF3n de este men\xFA:",
            CMF_DIALOG_OPTION: ["lado izquierdo", "lado derecho"],
            CMF_BORDER_COLOUR: "Color de borde",
            DLG_TIPS: "Acerca de",
            DLG_TIPS_DESC: "Enlaces del proyecto e info del mantenedor.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Si te ayuda, una estrella en {github} significa mucho.",
            DLG_TIPS_FACEBOOK: "P\xE1sate por {facebook} - all\xED comparto mi arte y poes\xEDa.",
            DLG_TIPS_SITE: "Si quieres ver qu\xE9 hago por la web, {site} es el mejor lugar para empezar.",
            DLG_TIPS_CREDITS: "Un agradecimiento especial a {zbluebugz} por el proyecto original y a {trinhquocviet} por la rama de UI simplificada de la que hice el fork originalmente - y por el mantenimiento de filtros durante ese periodo.",
            DLG_TIPS_MAINTAINER_PREFIX: "Del mantenedor:",
            DLG_TIPS_MAINTAINER: "Espero que este script te ayude a recuperar tu feed. Prometo ser tu aliado en la lucha contra lo que no quieres ver en l\xEDnea.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "mi Facebook",
            DLG_TIPS_LINK_SITE: "mi sitio web",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Guardar", "Cerrar", "Exportar", "Importar", "Reajustar"],
            DLG_BUTTON_TOOLTIPS: [
              "Guarda cambios en este navegador. Borrar datos/modo privado los elimina.",
              "Exporta un archivo de respaldo para conservar y mover entre dispositivos.",
              "Importa un archivo de ajustes para restaurar o trasladar.",
              "Restablece todos los ajustes a valores predeterminados."
            ],
            DLG_FB_COLOUR_HINT: "Dejar en blanco para usar el esquema de color de FB"
          },
          // -- Suomi - Finnish (Finland)
          fi: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Sponsoroitu",
            NF_TABLIST_STORIES_REELS_ROOMS: '"Tarinat | Reels | Rooms" -v\xE4lilehtien luetteloruutu',
            NF_STORIES: "Tarinat",
            NF_TOP_CARDS_PAGES: "Yl\xE4kortit (sivuja varten)",
            NF_META_AI: "Kokeile Meta AI:ta",
            NF_HIDE_VERIFIED_BADGE: "Piilota varmennusmerkit",
            NF_FILTER_VERIFIED_BADGE: "Suodata varmennetut tilit",
            NF_AI_SIDE_PANELS: "Teko\xE4ly sivupaneeleissa",
            NF_SURVEY: "Kysely",
            NF_PEOPLE_YOU_MAY_KNOW: "Ihmiset, jotka saatat tuntea",
            NF_PAID_PARTNERSHIP: "Maksettu kumppanuus",
            NF_SPONSORED_PAID: "Sponsoroitu \xB7 Maksaja ______",
            NF_SUGGESTIONS: "Ehdotuksia / Suosituksia",
            NF_FOLLOW: "Seuraa",
            NF_PARTICIPATE: "Osallistua",
            NF_REELS_SHORT_VIDEOS: "Keloja ja lyhyit\xE4 videoita",
            NF_SHORT_REEL_VIDEO: "Kela/lyhyt video",
            NF_EVENTS_YOU_MAY_LIKE: "Kela/lyhyt video",
            NF_ANIMATED_GIFS_POSTS: "Animoidut GIF-kuvat",
            NF_ANIMATED_GIFS_PAUSE: "Pys\xE4yt\xE4 animoidut GIF-kuvat",
            NF_SHARES: "# jakoa",
            NF_LIKES_MAXIMUM: "Maksimim\xE4\xE4r\xE4 tykk\xE4yksi\xE4",
            GF_PAID_PARTNERSHIP: "Maksettu kumppanuus",
            GF_SUGGESTIONS: "Ehdotuksia / Suosituksia",
            GF_SHORT_REEL_VIDEO: "Keloja ja lyhyit\xE4 videoita",
            GF_ANIMATED_GIFS_POSTS: "Animoidut GIF-kuvat",
            GF_ANIMATED_GIFS_PAUSE: "Pys\xE4yt\xE4 animoidut GIF-kuvat",
            GF_SHARES: "# jakoa",
            VF_LIVE: "LIVE",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Kaksoisvideo",
            VF_ANIMATED_GIFS_PAUSE: "Pys\xE4yt\xE4 animoidut GIF-kuvat",
            PP_ANIMATED_GIFS_POSTS: "Animoidut GIF-kuvat",
            PP_ANIMATED_GIFS_PAUSE: "Pys\xE4yt\xE4 animoidut GIF-kuvat",
            NF_BLOCKED_FEED: ["Uutissy\xF6te", "Ryhm\xE4sy\xF6te", "Videosy\xF6te"],
            GF_BLOCKED_FEED: ["Uutissy\xF6te", "Ryhm\xE4sy\xF6te", "Videosy\xF6te"],
            VF_BLOCKED_FEED: ["Uutissy\xF6te", "Ryhm\xE4sy\xF6te", "Videosy\xF6te"],
            MP_BLOCKED_FEED: ["Marketplace-sy\xF6te"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Koronavirus (tietolaatikko)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Ilmastotiede (tietolaatikko)",
            OTHER_INFO_BOX_SUBSCRIBE: "Rekister\xF6idy (tietolaatikko)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Toiston ja silmukoinnin ohjaimet.",
            REELS_CONTROLS: "N\xE4yt\xE4 videon hallintaelementit",
            REELS_DISABLE_LOOPING: "Poista toisto",
            DLG_TITLE: "Puhdista sy\xF6tteeni",
            DLG_NF: "Uutisvirta",
            DLG_NF_DESC: "Siivoa ehdotukset ja m\xE4\xE4rit\xE4, kuinka tiukka sy\xF6te on.",
            DLG_GF: "Ryhm\xE4sy\xF6te",
            DLG_GF_DESC: "Siisti ryhm\xE4sy\xF6tteet karsimalla turhaa ja melua.",
            DLG_VF: "Videosy\xF6te",
            DLG_VF_DESC: "Pid\xE4 videosy\xF6te selke\xE4n\xE4 v\xE4hent\xE4m\xE4ll\xE4 toistoa ja h\xE4ly\xE4.",
            DLG_MP: "Marketplace-sy\xF6te",
            DLG_MP_DESC: "Suodata ilmoituksia hinnan ja avainsanojen mukaan.",
            DLG_PP: "Profiili / Sivu",
            DLG_PP_DESC: "S\xE4\xE4d\xE4 mit\xE4 profiileissa ja sivuilla n\xE4ytet\xE4\xE4n.",
            DLG_OTHER: "Lis\xE4huomiot",
            DLG_OTHER_DESC: "Piilota ylim\xE4\xE4r\xE4iset laatikot, joita et halua.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Tekstisuodatin",
            DLG_BLOCK_NEW_LINE: "(Erota sanat tai lauseet rivinvaihdolla, s\xE4\xE4nn\xF6lliset lausekkeet ovat tuettuja)",
            NF_BLOCKED_ENABLED: "Ota vaihtoehto k\xE4ytt\xF6\xF6n",
            GF_BLOCKED_ENABLED: "Ota vaihtoehto k\xE4ytt\xF6\xF6n",
            VF_BLOCKED_ENABLED: "Ota vaihtoehto k\xE4ytt\xF6\xF6n",
            MP_BLOCKED_ENABLED: "Ota vaihtoehto k\xE4ytt\xF6\xF6n",
            PP_BLOCKED_ENABLED: "Ota vaihtoehto k\xE4ytt\xF6\xF6n",
            NF_BLOCKED_RE: "S\xE4\xE4nn\xF6lliset lausekkeet (RegExp)",
            GF_BLOCKED_RE: "S\xE4\xE4nn\xF6lliset lausekkeet (RegExp)",
            VF_BLOCKED_RE: "S\xE4\xE4nn\xF6lliset lausekkeet (RegExp)",
            MP_BLOCKED_RE: "S\xE4\xE4nn\xF6lliset lausekkeet (RegExp)",
            PP_BLOCKED_RE: "S\xE4\xE4nn\xF6lliset lausekkeet (RegExp)",
            DLG_VERBOSITY: "Vaihtoehdot piilotetuille viesteille",
            DLG_PREFERENCES: "Asetukset",
            DLG_PREFERENCES_DESC: "Tunnisteet, sijainti, v\xE4rit ja kieli.",
            DLG_REPORT_BUG: "Ilmoita virhe",
            DLG_REPORT_BUG_DESC: "Luo diagnoosiraportti ongelmista.",
            DLG_REPORT_BUG_NOTICE: "Auta meit\xE4 korjaamaan se:\n1. Vierit\xE4 niin, ett\xE4 ongelmallinen julkaisu on n\xE4kyviss\xE4.\n2. Napsauta 'Luo raportti' ja sitten 'Kopioi raportti'.\n3. Napsauta 'Avaa tiketit' ja liit\xE4 raportti uuteen tikettiin.\n4. Lis\xE4\xE4 lyhyt kuvaus ongelmasta.\n(Muokkaamme nimet/tekstin pois, mutta tarkista ennen jakamista!)",
            DLG_REPORT_BUG_GENERATE: "Luo raportti",
            DLG_REPORT_BUG_COPY: "Kopioi raportti",
            DLG_REPORT_BUG_OPEN_ISSUES: "Avaa tiketit",
            DLG_REPORT_BUG_STATUS_READY: "Raportti valmis.",
            DLG_REPORT_BUG_STATUS_COPIED: "Raportti kopioitu leikep\xF6yd\xE4lle.",
            DLG_REPORT_BUG_STATUS_FAILED: "Kopiointi ep\xE4onnistui. Kopioi k\xE4sin.",
            DLG_VERBOSITY_CAPTION: "N\xE4yt\xE4 merkki, jos artikkeli on piilotettu",
            VERBOSITY_MESSAGE: [
              "ei tunnistetta",
              "Viesti piilotettu. S\xE4\xE4nt\xF6: ",
              " viesti\xE4 piilotettu",
              "7 viesti\xE4 piilotettu ~ (vain Ryhmien sy\xF6tteess\xE4)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Tekstin v\xE4ri",
            VERBOSITY_MESSAGE_BG_COLOUR: "Taustav\xE4ri",
            VERBOSITY_DEBUG: 'Korosta "piilotetut" postaus',
            CMF_CUSTOMISATIONS: "R\xE4\xE4t\xE4l\xF6innit",
            CMF_BTN_LOCATION: "CMF-painikkeen sijainti:",
            CMF_BTN_OPTION: [
              "alhaalla vasemmalla",
              "ylh\xE4\xE4ll\xE4 oikealle",
              'pois k\xE4yt\xF6st\xE4 (k\xE4yt\xE4 "Asetukset" User Script Commands -valikossa)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds -kieli:",
            CMF_DIALOG_LANGUAGE: "Suomi",
            CMF_DIALOG_LANGUAGE_DEFAULT: "K\xE4yt\xE4 sivuston kielt\xE4",
            GM_MENU_SETTINGS: "Asetukset",
            CMF_DIALOG_LOCATION: "T\xE4m\xE4n valikon sijainti:",
            CMF_DIALOG_OPTION: ["vasen puoli", "oikea puoli"],
            CMF_BORDER_COLOUR: "Reunuksen v\xE4ri",
            DLG_TIPS: "Tietoa",
            DLG_TIPS_DESC: "Projektin linkit ja yll\xE4pit\xE4j\xE4n tiedot.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Jos t\xE4st\xE4 on apua, {github}-t\xE4hti merkitsee paljon.",
            DLG_TIPS_FACEBOOK: "Tule moikkaamaan {facebook} - jaan siell\xE4 taidetta ja runoutta.",
            DLG_TIPS_SITE: "Jos haluat n\xE4hd\xE4 mit\xE4 puuhailen verkossa, {site} on paras paikka aloittaa.",
            DLG_TIPS_CREDITS: "Erityiskiitos {zbluebugz}:lle alkuper\xE4isest\xE4 projektista ja {trinhquocviet}:lle yksinkertaistetusta UI-haarasta, josta alun perin forkkasin - sek\xE4 suodattimien yll\xE4pidosta tuona aikana.",
            DLG_TIPS_MAINTAINER_PREFIX: "Yll\xE4pit\xE4j\xE4lt\xE4:",
            DLG_TIPS_MAINTAINER: "Toivon, ett\xE4 t\xE4m\xE4 skripti auttaa sinua saamaan feedisi takaisin. Lupaan olla liittolaisesi taistelussa sit\xE4 vastaan, mit\xE4 et halua n\xE4hd\xE4 verkossa.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "Facebook-sivuni",
            DLG_TIPS_LINK_SITE: "sivuni",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Tallentaa", "Sulkea", "Vienti", "Tuonti", "Nollaa"],
            DLG_BUTTON_TOOLTIPS: [
              "Tallentaa muutokset t\xE4h\xE4n selaimeen. Tietojen tyhjennys/yksityinen tila poistaa ne.",
              "Vie varmuuskopiotiedoston asetusten s\xE4ilytt\xE4miseen ja siirtoon.",
              "Tuo asetustiedoston palautusta tai siirtoa varten.",
              "Palauttaa kaikki asetukset oletuksiin."
            ],
            DLG_FB_COLOUR_HINT: "J\xE4t\xE4 tyhj\xE4ksi k\xE4ytt\xE4\xE4ksesi FB:n v\xE4rimaailmaa"
          },
          // -- Français (France)
          fr: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Sponsoris\xE9",
            NF_TABLIST_STORIES_REELS_ROOMS: `Zone de liste de l'onglet "Stories | Reels | Salons"`,
            NF_STORIES: "Stories",
            NF_TOP_CARDS_PAGES: "Cartes principales (pour les Pages)",
            NF_META_AI: "Essayer Meta AI",
            NF_HIDE_VERIFIED_BADGE: "Masquer les badges v\xE9rifi\xE9s",
            NF_FILTER_VERIFIED_BADGE: "Filtrer les comptes v\xE9rifi\xE9s",
            NF_AI_SIDE_PANELS: "IA dans les panneaux lat\xE9raux",
            NF_SURVEY: "Enqu\xEAte",
            NF_PEOPLE_YOU_MAY_KNOW: "Connaissez-vous...",
            NF_PAID_PARTNERSHIP: "Partenariat r\xE9mun\xE9r\xE9",
            NF_SPONSORED_PAID: "Sponsoris\xE9 \xB7 Financ\xE9 par ______",
            NF_SUGGESTIONS: "Suggestions / Recommandations",
            NF_FOLLOW: "Suivre",
            NF_PARTICIPATE: "Participer",
            NF_REELS_SHORT_VIDEOS: "Reels et vid\xE9os courtes",
            NF_SHORT_REEL_VIDEO: "Bobine/courte vid\xE9o",
            NF_EVENTS_YOU_MAY_LIKE: "\xC9v\xE8nements qui pourraient vous int\xE9resser",
            NF_ANIMATED_GIFS_POSTS: "GIF anim\xE9s",
            NF_ANIMATED_GIFS_PAUSE: "Mettre en pause les GIF anim\xE9s",
            NF_SHARES: "# partages",
            NF_LIKES_MAXIMUM: "Nombre maximum de J'aime",
            GF_PAID_PARTNERSHIP: "Partenariat r\xE9mun\xE9r\xE9",
            GF_SUGGESTIONS: "Suggestions / Recommandations",
            GF_SHORT_REEL_VIDEO: "Bobine/courte vid\xE9o",
            GF_ANIMATED_GIFS_POSTS: "GIF anim\xE9s",
            GF_ANIMATED_GIFS_PAUSE: "Mettre en pause les GIF anim\xE9s",
            GF_SHARES: "# partages",
            VF_LIVE: "EN DIRECT",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Vid\xE9o en double",
            VF_ANIMATED_GIFS_PAUSE: "Mettre en pause les GIF anim\xE9s",
            PP_ANIMATED_GIFS_POSTS: "GIF anim\xE9s",
            PP_ANIMATED_GIFS_PAUSE: "Mettre en pause les GIF anim\xE9s",
            NF_BLOCKED_FEED: ["Fil de nouvelles", "Flux de groupes", "Flux de vid\xE9os"],
            GF_BLOCKED_FEED: ["Fil de nouvelles", "Flux de groupes", "Flux de vid\xE9os"],
            VF_BLOCKED_FEED: ["Fil de nouvelles", "Flux de groupes", "Flux de vid\xE9os"],
            MP_BLOCKED_FEED: ["Flux de la place de march\xE9"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Coronavirus (encadr\xE9 d'information)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Science du climat (encadr\xE9 d'information)",
            OTHER_INFO_BOX_SUBSCRIBE: "S\u2019abonner (encadr\xE9 d'information)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Contr\xF4les de lecture et de boucle.",
            REELS_CONTROLS: "Afficher les contr\xF4les vid\xE9o",
            REELS_DISABLE_LOOPING: "D\xE9sactiver la boucle",
            DLG_TITLE: "Nettoyer mes flux",
            DLG_NF: "Fil de nouvelles",
            DLG_NF_DESC: "Nettoyez les suggestions et d\xE9finissez le niveau de s\xE9v\xE9rit\xE9 du fil.",
            DLG_GF: "Flux de groupes",
            DLG_GF_DESC: "All\xE9gez les fils de groupes en retirant le superflu et le bruit.",
            DLG_VF: "Flux de vid\xE9os",
            DLG_VF_DESC: "Gardez le fil vid\xE9o clair en r\xE9duisant r\xE9p\xE9titions et encombrement.",
            DLG_MP: "Flux de la place de march\xE9",
            DLG_MP_DESC: "Filtrez les annonces par prix et mots-cl\xE9s.",
            DLG_PP: "Profil / Page",
            DLG_PP_DESC: "R\xE9glez ce qui s\u2019affiche sur les profils et les pages.",
            DLG_OTHER: "Notes compl\xE9mentaires",
            DLG_OTHER_DESC: "Masquez les encarts suppl\xE9mentaires que vous ne voulez pas.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Filtre de texte",
            DLG_BLOCK_NEW_LINE: "(S\xE9parez les mots ou les phrases par un saut de ligne, les expressions r\xE9guli\xE8res sont prises en charge)",
            NF_BLOCKED_ENABLED: "Activ\xE9",
            GF_BLOCKED_ENABLED: "Activ\xE9",
            VF_BLOCKED_ENABLED: "Activ\xE9",
            MP_BLOCKED_ENABLED: "Activ\xE9",
            PP_BLOCKED_ENABLED: "Activ\xE9",
            NF_BLOCKED_RE: "Expressions r\xE9guli\xE8res (RegExp)",
            GF_BLOCKED_RE: "Expressions r\xE9guli\xE8res (RegExp)",
            VF_BLOCKED_RE: "Expressions r\xE9guli\xE8res (RegExp)",
            MP_BLOCKED_RE: "Expressions r\xE9guli\xE8res (RegExp)",
            PP_BLOCKED_RE: "Expressions r\xE9guli\xE8res (RegExp)",
            DLG_VERBOSITY: "Options pour les publications cach\xE9es",
            DLG_PREFERENCES: "Pr\xE9f\xE9rences",
            DLG_PREFERENCES_DESC: "Libell\xE9s, emplacement, couleurs et langue.",
            DLG_REPORT_BUG: "Signaler un bug",
            DLG_REPORT_BUG_DESC: "G\xE9n\xE9rer un rapport de diagnostic.",
            DLG_REPORT_BUG_NOTICE: "Aidez-nous \xE0 corriger le probl\xE8me :\n1. Faites d\xE9filer pour que la publication probl\xE9matique soit visible.\n2. Cliquez sur 'G\xE9n\xE9rer le rapport' puis sur 'Copier le rapport'.\n3. Cliquez sur 'Ouvrir les issues' et collez le rapport dans une nouvelle issue.\n4. Ajoutez une br\xE8ve description du probl\xE8me.\n(Nous masquons les noms/textes, mais veuillez v\xE9rifier avant de partager !)",
            DLG_REPORT_BUG_GENERATE: "G\xE9n\xE9rer le rapport",
            DLG_REPORT_BUG_COPY: "Copier le rapport",
            DLG_REPORT_BUG_OPEN_ISSUES: "Ouvrir les issues",
            DLG_REPORT_BUG_STATUS_READY: "Rapport pr\xEAt.",
            DLG_REPORT_BUG_STATUS_COPIED: "Rapport copi\xE9 dans le presse-papiers.",
            DLG_REPORT_BUG_STATUS_FAILED: "\xC9chec de la copie. Copiez manuellement.",
            DLG_VERBOSITY_CAPTION: "Afficher un libell\xE9 si une publication est masqu\xE9e",
            VERBOSITY_MESSAGE: [
              "pas de libell\xE9",
              "Poste cach\xE9. R\xE8gle: ",
              " posts cach\xE9s",
              "7 posts cach\xE9s ~ (uniquement dans le flux de groupes)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Couleur du texte",
            VERBOSITY_MESSAGE_BG_COLOUR: "Couleur de fond",
            VERBOSITY_DEBUG: "Mettez en surbrillance les messages \xAB cach\xE9s \xBB",
            CMF_CUSTOMISATIONS: "Personnalisations",
            CMF_BTN_LOCATION: "Emplacement du bouton CMF :",
            CMF_BTN_OPTION: [
              "en bas \xE0 gauche",
              "en haut \xE0 droite",
              'd\xE9sactiv\xE9 (utilisez "Param\xE8tres" dans le menu Commandes de script utilisateur)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Langue de Clean My Feeds :",
            CMF_DIALOG_LANGUAGE: "Fran\xE7ais",
            CMF_DIALOG_LANGUAGE_DEFAULT: "Utiliser la langue du site",
            GM_MENU_SETTINGS: "Param\xE8tres",
            CMF_DIALOG_LOCATION: "Emplacement de ce menu :",
            CMF_DIALOG_OPTION: ["c\xF4t\xE9 gauche", "c\xF4t\xE9 droit"],
            CMF_BORDER_COLOUR: "Couleur de bordure",
            DLG_TIPS: "\xC0 propos",
            DLG_TIPS_DESC: "Liens du projet et infos du mainteneur.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Si cela vous aide, une \xE9toile sur {github} compte beaucoup.",
            DLG_TIPS_FACEBOOK: "Passez dire bonjour sur {facebook} - j'y partage mon art et ma po\xE9sie.",
            DLG_TIPS_SITE: "Si vous voulez voir ce que je fais sur le web, {site} est le meilleur point de d\xE9part.",
            DLG_TIPS_CREDITS: "Remerciements particuliers \xE0 {zbluebugz} pour le projet original, et \xE0 {trinhquocviet} pour la branche UI simplifi\xE9e dont j'ai initialement fork\xE9 - ainsi que pour la maintenance des filtres pendant cette p\xE9riode.",
            DLG_TIPS_MAINTAINER_PREFIX: "De la part du mainteneur :",
            DLG_TIPS_MAINTAINER: "J\u2019esp\xE8re que ce script vous aidera \xE0 reprendre votre fil. Je promets d\u2019\xEAtre votre alli\xE9 dans la lutte contre ce que vous ne voulez pas voir en ligne.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "ma page Facebook",
            DLG_TIPS_LINK_SITE: "mon site",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Sauvegarder", "Fermer", "Exporter", "Importer", "R\xE9initialiser"],
            DLG_BUTTON_TOOLTIPS: [
              "Enregistre les changements dans ce navigateur. Effacer les donn\xE9es/priv\xE9 les supprime.",
              "Exporte un fichier de sauvegarde pour conserver et d\xE9placer entre appareils.",
              "Importe un fichier de r\xE9glages pour restaurer ou transf\xE9rer.",
              "R\xE9initialise tous les r\xE9glages par d\xE9faut."
            ],
            DLG_FB_COLOUR_HINT: "Laissez vide pour utiliser le jeu de couleurs de FB"
          },
          // -- עִברִית (Hebrew)
          he: {
            LANGUAGE_DIRECTION: "rtl",
            SPONSORED: "\u05DE\u05DE\u05D5\u05DE\u05DF",
            NF_TABLIST_STORIES_REELS_ROOMS: '\u05EA\u05D9\u05D1\u05EA \u05E8\u05E9\u05D9\u05DE\u05D4 \u05E9\u05DC \u05DB\u05E8\u05D8\u05D9\u05E1\u05D9\u05D5\u05EA "\u05E1\u05D8\u05D5\u05E8\u05D9\u05D6 | Reels | \u05D7\u05D3\u05E8\u05D9\u05DD"',
            NF_STORIES: "\u05E1\u05D8\u05D5\u05E8\u05D9\u05D6 ",
            NF_TOP_CARDS_PAGES: "\u05DB\u05E8\u05D8\u05D9\u05E1\u05D9\u05DD \u05DE\u05D5\u05D1\u05D9\u05DC\u05D9\u05DD (\u05DC\u05D3\u05E4\u05D9\u05DD)",
            NF_META_AI: "\u05E0\u05E1\u05D4 \u05D0\u05EA Meta AI",
            NF_HIDE_VERIFIED_BADGE: "\u05D4\u05E1\u05EA\u05E8 \u05EA\u05D2\u05D9 \u05D0\u05D9\u05DE\u05D5\u05EA",
            NF_FILTER_VERIFIED_BADGE: "\u05E1\u05E0\u05DF \u05D7\u05E9\u05D1\u05D5\u05E0\u05D5\u05EA \u05DE\u05D0\u05D5\u05DE\u05EA\u05D9\u05DD",
            NF_AI_SIDE_PANELS: "\u05D1\u05D9\u05E0\u05D4 \u05DE\u05DC\u05D0\u05DB\u05D5\u05EA\u05D9\u05EA \u05D1\u05DC\u05D5\u05D7\u05D5\u05EA \u05D4\u05E6\u05D3",
            NF_SURVEY: "\u05E1\u05E7\u05E8",
            NF_PEOPLE_YOU_MAY_KNOW: "\u05D0\u05E0\u05E9\u05D9\u05DD \u05E9\u05D0\u05D5\u05DC\u05D9 \u05D0\u05EA\u05D4 \u05DE\u05DB\u05D9\u05E8",
            NF_PAID_PARTNERSHIP: "\u05E9\u05D5\u05EA\u05E4\u05D5\u05EA \u05D1\u05EA\u05E9\u05DC\u05D5\u05DD",
            NF_SPONSORED_PAID: "\u05DE\u05DE\u05D5\u05DE\u05DF \xB7 \u05E9\u05D5\u05DC\u05DD \u05E2\u05DC \u05D9\u05D3\u05D9 ______",
            NF_SUGGESTIONS: "\u05D4\u05E6\u05E2\u05D5\u05EA / \u05D4\u05DE\u05DC\u05E6\u05D5\u05EA",
            NF_FOLLOW: "\u05E2\u05E7\u05D5\u05D1",
            NF_PARTICIPATE: "\u05D4\u05E9\u05EA\u05EA\u05E3",
            NF_REELS_SHORT_VIDEOS: "\u05E1\u05E8\u05D8\u05D5\u05E0\u05D9 Reels \u05D5\u05E7\u05D8\u05E2\u05D9 \u05D5\u05D9\u05D3\u05D0\u05D5 \u05E7\u05E6\u05E8\u05D9\u05DD",
            NF_SHORT_REEL_VIDEO: "\u05E1\u05DC\u05D9\u05DC/\u05E1\u05E8\u05D8\u05D5\u05DF \u05E7\u05E6\u05E8",
            NF_EVENTS_YOU_MAY_LIKE: "\u05D0\u05D9\u05E8\u05D5\u05E2\u05D9\u05DD \u05E9\u05D0\u05D5\u05DC\u05D9 \u05EA\u05D0\u05D4\u05D1\u05D5",
            NF_ANIMATED_GIFS_POSTS: "\u05E7\u05D5\u05D1\u05E6\u05D9 GIF \u05DE\u05D5\u05E0\u05E4\u05E9\u05D9\u05DD",
            NF_ANIMATED_GIFS_PAUSE: "\u05D4\u05E9\u05D4\u05D4 \u05E7\u05D5\u05D1\u05E6\u05D9 GIF \u05DE\u05D5\u05E0\u05E4",
            NF_SHARES: "# \u05E9\u05D9\u05EA\u05D5\u05E4\u05D9\u05DD",
            NF_LIKES_MAXIMUM: "\u05DE\u05E1\u05E4\u05E8 \u05DC\u05D9\u05D9\u05E7\u05D9\u05DD \u05DE\u05E7\u05E1\u05D9\u05DE\u05DC\u05D9",
            GF_PAID_PARTNERSHIP: "\u05E9\u05D5\u05EA\u05E4\u05D5\u05EA \u05D1\u05EA\u05E9\u05DC\u05D5\u05DD",
            GF_SUGGESTIONS: "\u05D4\u05E6\u05E2\u05D5\u05EA / \u05D4\u05DE\u05DC\u05E6\u05D5\u05EA",
            GF_SHORT_REEL_VIDEO: "\u05E1\u05DC\u05D9\u05DC/\u05E1\u05E8\u05D8\u05D5\u05DF \u05E7\u05E6\u05E8",
            GF_ANIMATED_GIFS_POSTS: "\u05E7\u05D5\u05D1\u05E6\u05D9 GIF \u05DE\u05D5\u05E0\u05E4\u05E9\u05D9\u05DD",
            GF_ANIMATED_GIFS_PAUSE: "\u05D4\u05E9\u05D4\u05D4 \u05E7\u05D5\u05D1\u05E6\u05D9 GIF \u05DE\u05D5\u05E0\u05E4",
            GF_SHARES: "# \u05E9\u05D9\u05EA\u05D5\u05E4\u05D9\u05DD",
            VF_LIVE: "\u05E9\u05D9\u05D3\u05D5\u05E8 \u05D7\u05D9",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "\u05D5\u05D9\u05D3\u05D0\u05D5 \u05DB\u05E4\u05D5\u05DC",
            VF_ANIMATED_GIFS_PAUSE: "\u05D4\u05E9\u05D4\u05D4 \u05E7\u05D5\u05D1\u05E6\u05D9 GIF \u05DE\u05D5\u05E0\u05E4",
            PP_ANIMATED_GIFS_POSTS: "\u05E7\u05D5\u05D1\u05E6\u05D9 GIF \u05DE\u05D5\u05E0\u05E4\u05E9\u05D9\u05DD",
            PP_ANIMATED_GIFS_PAUSE: "\u05D4\u05E9\u05D4\u05D4 \u05E7\u05D5\u05D1\u05E6\u05D9 GIF \u05DE\u05D5\u05E0\u05E4",
            NF_BLOCKED_FEED: ["\u05E0\u05D9\u05D5\u05D6 \u05E4\u05D9\u05D3", "\u05E4\u05D9\u05D3 \u05E7\u05D1\u05D5\u05E6\u05D5\u05EA", "\u05E6\u05E4\u05D4 \u05D1\u05E4\u05D9\u05D3 \u05E1\u05E8\u05D8\u05D5\u05E0\u05D9\u05DD"],
            GF_BLOCKED_FEED: ["\u05E0\u05D9\u05D5\u05D6 \u05E4\u05D9\u05D3", "\u05E4\u05D9\u05D3 \u05E7\u05D1\u05D5\u05E6\u05D5\u05EA", "\u05E6\u05E4\u05D4 \u05D1\u05E4\u05D9\u05D3 \u05E1\u05E8\u05D8\u05D5\u05E0\u05D9\u05DD"],
            VF_BLOCKED_FEED: ["\u05E0\u05D9\u05D5\u05D6 \u05E4\u05D9\u05D3", "\u05E4\u05D9\u05D3 \u05E7\u05D1\u05D5\u05E6\u05D5\u05EA", "\u05E6\u05E4\u05D4 \u05D1\u05E4\u05D9\u05D3 \u05E1\u05E8\u05D8\u05D5\u05E0\u05D9\u05DD"],
            MP_BLOCKED_FEED: ["\u05D6\u05D9\u05E8\u05EA \u05DE\u05E1\u05D7\u05E8"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "\u05D5\u05D9\u05E8\u05D5\u05E1 \u05E7\u05D5\u05E8\u05D5\u05E0\u05D4 (\u05EA\u05D9\u05D1\u05EA \u05DE\u05D9\u05D3\u05E2)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "\u05DE\u05D3\u05E2 \u05D4\u05D0\u05E7\u05DC\u05D9\u05DD (\u05EA\u05D9\u05D1\u05EA \u05DE\u05D9\u05D3\u05E2)",
            OTHER_INFO_BOX_SUBSCRIBE: "\u05D4\u05D9\u05E8\u05E9\u05DD (\u05EA\u05D9\u05D1\u05EA \u05DE\u05D9\u05D3\u05E2)",
            REELS_TITLE: "Reels",
            // -- FB's label
            DLG_REELS_DESC: "\u05D1\u05E7\u05E8\u05D5\u05EA \u05D4\u05E4\u05E2\u05DC\u05D4 \u05D5\u05DC\u05D5\u05DC\u05D0\u05D4.",
            REELS_CONTROLS: "\u05D4\u05E6\u05D2 \u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D1\u05E7\u05E8\u05EA \u05D5\u05D9\u05D3\u05D0\u05D5",
            REELS_DISABLE_LOOPING: "\u05D4\u05E9\u05D1\u05EA \u05DC\u05D5\u05DC\u05D0\u05D4",
            DLG_TITLE: "\u05EA\u05E0\u05E7\u05D4 \u05D0\u05EA \u05D4\u05D6\u05E0\u05D5\u05EA \u05E9\u05DC\u05D9",
            DLG_NF: "\u05E0\u05D9\u05D5\u05D6 \u05E4\u05D9\u05D3",
            DLG_NF_DESC: "\u05E0\u05E7\u05D4 \u05D4\u05E6\u05E2\u05D5\u05EA \u05D5\u05E7\u05D1\u05E2 \u05DB\u05DE\u05D4 \u05E7\u05E4\u05D3\u05E0\u05D9 \u05D9\u05D4\u05D9\u05D4 \u05D4\u05E4\u05D9\u05D3.",
            DLG_GF: "\u05E4\u05D9\u05D3 \u05E7\u05D1\u05D5\u05E6\u05D5\u05EA",
            DLG_GF_DESC: "\u05E1\u05D3\u05E8 \u05E4\u05D9\u05D3\u05D9\u05DD \u05E9\u05DC \u05E7\u05D1\u05D5\u05E6\u05D5\u05EA \u05E2\u05DC-\u05D9\u05D3\u05D9 \u05E6\u05DE\u05E6\u05D5\u05DD \u05EA\u05D5\u05E1\u05E4\u05D5\u05EA \u05D5\u05E8\u05E2\u05E9.",
            DLG_VF: "\u05E6\u05E4\u05D4 \u05D1\u05E4\u05D9\u05D3 \u05D4\u05E1\u05E8\u05D8\u05D5\u05E0\u05D9\u05DD",
            DLG_VF_DESC: "\u05E9\u05DE\u05D5\u05E8 \u05E2\u05DC \u05E4\u05D9\u05D3 \u05D4\u05D5\u05D5\u05D9\u05D3\u05D0\u05D5 \u05DE\u05DE\u05D5\u05E7\u05D3 \u05E2\u05DD \u05E4\u05D7\u05D5\u05EA \u05D7\u05D6\u05E8\u05D5\u05EA \u05D5\u05E2\u05D5\u05DE\u05E1.",
            DLG_MP: "\u05D6\u05D9\u05E8\u05EA \u05DE\u05E1\u05D7\u05E8",
            DLG_MP_DESC: "\u05E1\u05E0\u05DF \u05DE\u05D5\u05D3\u05E2\u05D5\u05EA \u05DC\u05E4\u05D9 \u05DE\u05D7\u05D9\u05E8 \u05D5\u05DE\u05D9\u05DC\u05D5\u05EA \u05DE\u05E4\u05EA\u05D7.",
            DLG_PP: "\u05E4\u05E8\u05D5\u05E4\u05D9\u05DC / \u05D3\u05E3",
            DLG_PP_DESC: "\u05D4\u05EA\u05D0\u05DD \u05DE\u05D4 \u05DE\u05D5\u05E6\u05D2 \u05D1\u05E4\u05E8\u05D5\u05E4\u05D9\u05DC\u05D9\u05DD \u05D5\u05D1\u05D3\u05E4\u05D9\u05DD.",
            DLG_OTHER: "\u05D4\u05E2\u05E8\u05D5\u05EA \u05E0\u05D5\u05E1\u05E4\u05D5\u05EA",
            DLG_OTHER_DESC: "\u05D4\u05E1\u05EA\u05E8 \u05EA\u05D9\u05D1\u05D5\u05EA \u05E0\u05D5\u05E1\u05E4\u05D5\u05EA \u05E9\u05D0\u05D9\u05E0\u05DA \u05E8\u05D5\u05E6\u05D4.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "\u05DE\u05E1\u05E0\u05DF \u05D8\u05E7\u05E1\u05D8",
            DLG_BLOCK_NEW_LINE: "(\u05D4\u05E4\u05E8\u05D3 \u05DE\u05D9\u05DC\u05D9\u05DD \u05D0\u05D5 \u05D1\u05D9\u05D8\u05D5\u05D9\u05D9\u05DD \u05E2\u05DD \u05D9\u05E8\u05D9\u05D3\u05EA \u05E9\u05D5\u05E8\u05D4, \u05D1\u05D9\u05D8\u05D5\u05D9\u05D9\u05DD \u05E8\u05D2\u05D5\u05DC\u05E8\u05D9\u05D9\u05DD \u05E0\u05EA\u05DE\u05DB\u05D9\u05DD)",
            NF_BLOCKED_ENABLED: "\u05DE\u05D5\u05E4\u05E2\u05DC",
            GF_BLOCKED_ENABLED: "\u05DE\u05D5\u05E4\u05E2\u05DC",
            VF_BLOCKED_ENABLED: "\u05DE\u05D5\u05E4\u05E2\u05DC",
            MP_BLOCKED_ENABLED: "\u05DE\u05D5\u05E4\u05E2\u05DC",
            PP_BLOCKED_ENABLED: "\u05DE\u05D5\u05E4\u05E2\u05DC",
            NF_BLOCKED_RE: "\u05D1\u05D9\u05D8\u05D5\u05D9\u05D9\u05DD \u05E8\u05D2\u05D5\u05DC\u05E8\u05D9\u05D9\u05DD (RegExp)",
            GF_BLOCKED_RE: "\u05D1\u05D9\u05D8\u05D5\u05D9\u05D9\u05DD \u05E8\u05D2\u05D5\u05DC\u05E8\u05D9\u05D9\u05DD (RegExp)",
            VF_BLOCKED_RE: "\u05D1\u05D9\u05D8\u05D5\u05D9\u05D9\u05DD \u05E8\u05D2\u05D5\u05DC\u05E8\u05D9\u05D9\u05DD (RegExp)",
            MP_BLOCKED_RE: "\u05D1\u05D9\u05D8\u05D5\u05D9\u05D9\u05DD \u05E8\u05D2\u05D5\u05DC\u05E8\u05D9\u05D9\u05DD (RegExp)",
            PP_BLOCKED_RE: "\u05D1\u05D9\u05D8\u05D5\u05D9\u05D9\u05DD \u05E8\u05D2\u05D5\u05DC\u05E8\u05D9\u05D9\u05DD (RegExp)",
            DLG_VERBOSITY: "\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05DC\u05E4\u05D5\u05E1\u05D8\u05D9\u05DD \u05DE\u05D5\u05E1\u05EA\u05E8\u05D9\u05DD",
            DLG_PREFERENCES: "\u05D4\u05E2\u05D3\u05E4\u05D5\u05EA",
            DLG_PREFERENCES_DESC: "\u05EA\u05D5\u05D5\u05D9\u05D5\u05EA, \u05DE\u05D9\u05E7\u05D5\u05DD, \u05E6\u05D1\u05E2\u05D9\u05DD \u05D5\u05E9\u05E4\u05D4.",
            DLG_REPORT_BUG: "\u05D3\u05D5\u05D5\u05D7 \u05E2\u05DC \u05D1\u05D0\u05D2",
            DLG_REPORT_BUG_DESC: "\u05E6\u05D5\u05E8 \u05D3\u05D5\u05D7 \u05D0\u05D1\u05D7\u05D5\u05DF \u05DC\u05D1\u05E2\u05D9\u05D5\u05EA.",
            DLG_REPORT_BUG_NOTICE: "\u05E2\u05D6\u05E8\u05D5 \u05DC\u05E0\u05D5 \u05DC\u05EA\u05E7\u05DF \u05D0\u05EA \u05D6\u05D4:\n1. \u05D2\u05DC\u05D5\u05DC \u05DB\u05DA \u05E9\u05D4\u05E4\u05D5\u05E1\u05D8 \u05D4\u05D1\u05E2\u05D9\u05D9\u05EA\u05D9 \u05D9\u05D4\u05D9\u05D4 \u05D2\u05DC\u05D5\u05D9.\n2. \u05DC\u05D7\u05E5 \u05E2\u05DC '\u05E6\u05D5\u05E8 \u05D3\u05D5\u05D7' \u05D5\u05D0\u05D6 '\u05D4\u05E2\u05EA\u05E7 \u05D3\u05D5\u05D7'.\n3. \u05DC\u05D7\u05E5 \u05E2\u05DC '\u05E4\u05EA\u05D7 \u05EA\u05E7\u05DC\u05D5\u05EA' \u05D5\u05D4\u05D3\u05D1\u05E7 \u05D0\u05EA \u05D4\u05D3\u05D5\u05D7 \u05DC\u05EA\u05E7\u05DC\u05D4 \u05D7\u05D3\u05E9\u05D4.\n4. \u05D4\u05D5\u05E1\u05E3 \u05EA\u05D9\u05D0\u05D5\u05E8 \u05E7\u05E6\u05E8 \u05E9\u05DC \u05D4\u05D1\u05E2\u05D9\u05D4.\n(\u05D0\u05E0\u05D5 \u05DE\u05E1\u05EA\u05D9\u05E8\u05D9\u05DD \u05E9\u05DE\u05D5\u05EA/\u05D8\u05E7\u05E1\u05D8, \u05D0\u05DA \u05D0\u05E0\u05D0 \u05D1\u05D3\u05D5\u05E7 \u05DC\u05E4\u05E0\u05D9 \u05D4\u05E9\u05D9\u05EA\u05D5\u05E3!)",
            DLG_REPORT_BUG_GENERATE: "\u05E6\u05D5\u05E8 \u05D3\u05D5\u05D7",
            DLG_REPORT_BUG_COPY: "\u05D4\u05E2\u05EA\u05E7 \u05D3\u05D5\u05D7",
            DLG_REPORT_BUG_OPEN_ISSUES: "\u05E4\u05EA\u05D7 \u05EA\u05E7\u05DC\u05D5\u05EA",
            DLG_REPORT_BUG_STATUS_READY: "\u05D4\u05D3\u05D5\u05D7 \u05DE\u05D5\u05DB\u05DF.",
            DLG_REPORT_BUG_STATUS_COPIED: "\u05D4\u05D3\u05D5\u05D7 \u05D4\u05D5\u05E2\u05EA\u05E7 \u05DC\u05DC\u05D5\u05D7.",
            DLG_REPORT_BUG_STATUS_FAILED: "\u05D4\u05D4\u05E2\u05EA\u05E7\u05D4 \u05E0\u05DB\u05E9\u05DC\u05D4. \u05D4\u05E2\u05EA\u05E7 \u05D9\u05D3\u05E0\u05D9\u05EA.",
            DLG_VERBOSITY_CAPTION: "\u05D4\u05E6\u05D2 \u05EA\u05D5\u05D9\u05EA \u05D0\u05DD \u05DE\u05D0\u05DE\u05E8 \u05DE\u05D5\u05E1\u05EA\u05E8",
            VERBOSITY_MESSAGE: [
              "\u05D0\u05D9\u05DF \u05EA\u05D5\u05D5\u05D9\u05EA",
              "\u05E4\u05D5\u05E1\u05D8 \u05D0\u05D7\u05D3 \u05DE\u05D5\u05E1\u05EA\u05E8. \u05DB\u05DC\u05DC: ",
              " \u05E4\u05D5\u05E1\u05D8\u05D9\u05DD \u05DE\u05D5\u05E1\u05EA\u05E8\u05D9\u05DD",
              "7 \u05E4\u05D5\u05E1\u05D8\u05D9\u05DD \u05DE\u05D5\u05E1\u05EA\u05E8\u05D9\u05DD ~ (\u05E8\u05E7 \u05D1\u05E1\u05D3\u05E8 \u05D7\u05D1\u05E8\u05D9\u05DD)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "\u05E6\u05D1\u05E2 \u05D8\u05E7\u05E1\u05D8",
            VERBOSITY_MESSAGE_BG_COLOUR: "\u05E6\u05D1\u05E2 \u05D4\u05E8\u05E7\u05E2",
            VERBOSITY_DEBUG: '\u05D4\u05D3\u05D2\u05E9 \u05E4\u05D5\u05E1\u05D8\u05D9\u05DD "\u05DE\u05D5\u05E1\u05EA\u05E8\u05D9\u05DD"',
            CMF_CUSTOMISATIONS: "\u05D4\u05EA\u05D0\u05DE\u05D5\u05EA \u05D0\u05D9\u05E9\u05D9\u05D5\u05EA",
            CMF_BTN_LOCATION: "\u05DE\u05D9\u05E7\u05D5\u05DD \u05DB\u05E4\u05EA\u05D5\u05E8 CMF:",
            CMF_BTN_OPTION: [
              "\u05E9\u05DE\u05D0\u05DC \u05DC\u05DE\u05D8\u05D4",
              "\u05D9\u05DE\u05D9\u05E0\u05D4 \u05DC\u05DE\u05E2\u05DC\u05D4",
              '\u05DE\u05D5\u05E9\u05D1\u05EA (\u05D4\u05E9\u05EA\u05DE\u05E9 \u05D1"\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA" \u05D1\u05EA\u05E4\u05E8\u05D9\u05D8 \u05E4\u05E7\u05D5\u05D3\u05D5\u05EA \u05E1\u05E7\u05E8\u05D9\u05E4\u05D8 \u05DE\u05E9\u05EA\u05DE\u05E9)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "\u05E9\u05E4\u05EA Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "\u05E2\u05B4\u05D1\u05B0\u05E8\u05B4\u05D9\u05EA",
            CMF_DIALOG_LANGUAGE_DEFAULT: "\u05D4\u05E9\u05EA\u05DE\u05E9 \u05D1\u05E9\u05E4\u05EA \u05D4\u05D0\u05EA\u05E8",
            GM_MENU_SETTINGS: "\u05D4\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA",
            CMF_DIALOG_LOCATION: "\u05DE\u05D9\u05E7\u05D5\u05DD \u05D4\u05EA\u05E4\u05E8\u05D9\u05D8 \u05D4\u05D6\u05D4:",
            CMF_DIALOG_OPTION: ["\u05E6\u05D3 \u05E9\u05DE\u05D0\u05DC", "\u05E6\u05D3 \u05D9\u05DE\u05D9\u05DF"],
            CMF_BORDER_COLOUR: "\u05E6\u05D1\u05E2 \u05D2\u05D1\u05D5\u05DC",
            DLG_TIPS: "\u05D0\u05D5\u05D3\u05D5\u05EA",
            DLG_TIPS_DESC: "\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9 \u05D4\u05E4\u05E8\u05D5\u05D9\u05E7\u05D8 \u05D5\u05DE\u05D9\u05D3\u05E2 \u05E2\u05DC \u05D4\u05DE\u05EA\u05D7\u05D6\u05E7.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "\u05D0\u05DD \u05D6\u05D4 \u05E2\u05D5\u05D6\u05E8, \u05DB\u05D5\u05DB\u05D1 \u05D1-{github} \u05E9\u05D5\u05D5\u05D4 \u05D4\u05E8\u05D1\u05D4.",
            DLG_TIPS_FACEBOOK: "\u05D1\u05D5\u05D0\u05D5 \u05DC\u05D4\u05D2\u05D9\u05D3 \u05E9\u05DC\u05D5\u05DD \u05D1-{facebook} - \u05E9\u05DD \u05D0\u05E0\u05D9 \u05DE\u05E9\u05EA\u05E3 \u05D0\u05DE\u05E0\u05D5\u05EA \u05D5\u05E9\u05D9\u05E8\u05D4.",
            DLG_TIPS_SITE: "\u05D0\u05DD \u05E8\u05D5\u05E6\u05D9\u05DD \u05DC\u05E8\u05D0\u05D5\u05EA \u05DE\u05D4 \u05D0\u05E0\u05D9 \u05E2\u05D5\u05E9\u05D4 \u05D1\u05E8\u05D7\u05D1\u05D9 \u05D4\u05E8\u05E9\u05EA, {site} \u05D4\u05D5\u05D0 \u05D4\u05DE\u05E7\u05D5\u05DD \u05D4\u05DB\u05D9 \u05D8\u05D5\u05D1 \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC.",
            DLG_TIPS_CREDITS: "\u05EA\u05D5\u05D3\u05D4 \u05DE\u05D9\u05D5\u05D7\u05D3\u05EA \u05DC-{zbluebugz} \u05E2\u05DC \u05D4\u05E4\u05E8\u05D5\u05D9\u05E7\u05D8 \u05D4\u05DE\u05E7\u05D5\u05E8\u05D9, \u05D5\u05DC-{trinhquocviet} \u05E2\u05DC \u05E2\u05E0\u05E3 \u05D4-UI \u05D4\u05DE\u05E4\u05D5\u05E9\u05D8 \u05E9\u05DE\u05DE\u05E0\u05D5 \u05E4\u05D5\u05E8\u05E7\u05EA\u05D9 \u05D1\u05EA\u05D7\u05D9\u05DC\u05D4 - \u05D5\u05D2\u05DD \u05E2\u05DC \u05EA\u05D7\u05D6\u05D5\u05E7\u05EA \u05D4\u05E4\u05D9\u05DC\u05D8\u05E8\u05D9\u05DD \u05D1\u05D0\u05D5\u05EA\u05D4 \u05EA\u05E7\u05D5\u05E4\u05D4.",
            DLG_TIPS_MAINTAINER_PREFIX: "\u05DE\u05D4\u05DE\u05EA\u05D7\u05D6\u05E7:",
            DLG_TIPS_MAINTAINER: "\u05D0\u05E0\u05D9 \u05DE\u05E7\u05D5\u05D5\u05D4 \u05E9\u05D4\u05E1\u05E7\u05E8\u05D9\u05E4\u05D8 \u05D4\u05D6\u05D4 \u05D9\u05E2\u05D6\u05D5\u05E8 \u05DC\u05DA \u05DC\u05D4\u05D7\u05D6\u05D9\u05E8 \u05DC\u05E2\u05E6\u05DE\u05DA \u05D0\u05EA \u05D4\u05E4\u05D9\u05D3. \u05D0\u05E0\u05D9 \u05DE\u05D1\u05D8\u05D9\u05D7 \u05DC\u05D4\u05D9\u05D5\u05EA \u05D1\u05DF \u05D1\u05E8\u05D9\u05EA \u05D1\u05DE\u05D0\u05D1\u05E7 \u05E0\u05D2\u05D3 \u05D3\u05D1\u05E8\u05D9\u05DD \u05E9\u05DC\u05D0 \u05EA\u05E8\u05E6\u05D4 \u05DC\u05E8\u05D0\u05D5\u05EA \u05D1\u05E8\u05E9\u05EA.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "\u05E2\u05DE\u05D5\u05D3 \u05D4\u05E4\u05D9\u05D9\u05E1\u05D1\u05D5\u05E7 \u05E9\u05DC\u05D9",
            DLG_TIPS_LINK_SITE: "\u05D4\u05D0\u05EA\u05E8 \u05E9\u05DC\u05D9",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["\u05E9\u05DE\u05D5\u05E8", "\u05E1\u05D2\u05D5\u05E8", "\u05D9\u05D9\u05E6\u05D0", "\u05D9\u05D9\u05D1\u05D0", "\u05D0\u05D9\u05E4\u05D5\u05E1"],
            DLG_BUTTON_TOOLTIPS: [
              "\u05E9\u05D5\u05DE\u05E8 \u05E9\u05D9\u05E0\u05D5\u05D9\u05D9\u05DD \u05D1\u05D3\u05E4\u05D3\u05E4\u05DF \u05D4\u05D6\u05D4. \u05E0\u05D9\u05E7\u05D5\u05D9 \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD/\u05D2\u05DC\u05D9\u05E9\u05D4 \u05E4\u05E8\u05D8\u05D9\u05EA \u05DE\u05E1\u05D9\u05E8\u05D9\u05DD \u05D0\u05D5\u05EA\u05DD.",
              "\u05DE\u05D9\u05D9\u05E6\u05D0 \u05E7\u05D5\u05D1\u05E5 \u05D2\u05D9\u05D1\u05D5\u05D9 \u05DC\u05E9\u05DE\u05D9\u05E8\u05D4 \u05D5\u05D4\u05E2\u05D1\u05E8\u05D4 \u05D1\u05D9\u05DF \u05DE\u05DB\u05E9\u05D9\u05E8\u05D9\u05DD.",
              "\u05DE\u05D9\u05D9\u05D1\u05D0 \u05E7\u05D5\u05D1\u05E5 \u05D4\u05D2\u05D3\u05E8\u05D5\u05EA \u05DC\u05E9\u05D7\u05D6\u05D5\u05E8 \u05D0\u05D5 \u05DC\u05D4\u05E2\u05D1\u05E8\u05D4.",
              "\u05DE\u05D0\u05E4\u05E1 \u05D0\u05EA \u05DB\u05DC \u05D4\u05D4\u05D2\u05D3\u05E8\u05D5\u05EA \u05DC\u05D1\u05E8\u05D9\u05E8\u05EA \u05DE\u05D7\u05D3\u05DC."
            ],
            DLG_FB_COLOUR_HINT: "\u05D4\u05E9\u05D0\u05E8 \u05E8\u05D9\u05E7 \u05DB\u05D3\u05D9 \u05DC\u05D4\u05E9\u05EA\u05DE\u05E9 \u05D1\u05E2\u05E8\u05DB\u05EA \u05D4\u05E6\u05D1\u05E2\u05D9\u05DD \u05E9\u05DC FB"
          },
          // -- Bahasa Indonesia (Indonesia)
          id: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Bersponsor",
            NF_TABLIST_STORIES_REELS_ROOMS: 'Kotak daftar tab "Cerita | Reels | Forum"',
            NF_STORIES: "Cerita",
            NF_TOP_CARDS_PAGES: "Kartu teratas (untuk Halaman)",
            NF_META_AI: "Coba Meta AI",
            NF_HIDE_VERIFIED_BADGE: "Sembunyikan lencana terverifikasi",
            NF_FILTER_VERIFIED_BADGE: "Filter akun terverifikasi",
            NF_AI_SIDE_PANELS: "AI di panel samping",
            NF_SURVEY: "Survei",
            NF_PEOPLE_YOU_MAY_KNOW: "Orang yang Mungkin Anda Kenal",
            NF_PAID_PARTNERSHIP: "Kemitraan berbayar",
            NF_SPONSORED_PAID: "Disponsori \xB7 Dibayar oleh ______",
            NF_SUGGESTIONS: "Saran / Rekomendasi",
            NF_FOLLOW: "Ikuti",
            NF_PARTICIPATE: "Berpartisipasi",
            NF_REELS_SHORT_VIDEOS: "Reels dan Video Pendek",
            NF_SHORT_REEL_VIDEO: "Reel/video pendek",
            NF_EVENTS_YOU_MAY_LIKE: "Acara yang mungkin Anda sukai",
            NF_ANIMATED_GIFS_POSTS: "GIF animasi",
            NF_ANIMATED_GIFS_PAUSE: "Jeda GIF animasi",
            NF_SHARES: "# Kali dibagikan",
            NF_LIKES_MAXIMUM: "Jumlah maksimum Suka",
            GF_PAID_PARTNERSHIP: "Kemitraan berbayar",
            GF_SUGGESTIONS: "Saran / Rekomendasi",
            GF_SHORT_REEL_VIDEO: "Reel/video pendek",
            GF_ANIMATED_GIFS_POSTS: "GIF animasi",
            GF_ANIMATED_GIFS_PAUSE: "Jeda GIF animasi",
            GF_SHARES: "# Kali dibagikan",
            VF_LIVE: "LANGSUNG",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Video duplikat",
            VF_ANIMATED_GIFS_PAUSE: "Jeda GIF animasi",
            PP_ANIMATED_GIFS_POSTS: "GIF animasi",
            PP_ANIMATED_GIFS_PAUSE: "Jeda GIF animasi",
            NF_BLOCKED_FEED: ["Umpan Berita", "Umpan Grup", "Umpan Video"],
            GF_BLOCKED_FEED: ["Umpan Berita", "Umpan Grup", "Umpan Video"],
            VF_BLOCKED_FEED: ["Umpan Berita", "Umpan Grup", "Umpan Video"],
            MP_BLOCKED_FEED: ["Umpan Marketplace"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Virus Corona (kotak informasi)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Ilmu iklim (kotak informasi)",
            OTHER_INFO_BOX_SUBSCRIBE: "Berlangganan (kotak informasi)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Kontrol pemutaran dan pengulangan.",
            REELS_CONTROLS: "Tampilkan kontrol video",
            REELS_DISABLE_LOOPING: "Nonaktifkan pengulangan",
            DLG_TITLE: "Bersihkan feed saya",
            DLG_NF: "Umpan Berita",
            DLG_NF_DESC: "Bersihkan saran dan tentukan seberapa ketat feed.",
            DLG_GF: "Umpan Grup",
            DLG_GF_DESC: "Rapikan feed grup dengan mengurangi hal yang berlebihan dan bising.",
            DLG_VF: "Umpan Video",
            DLG_VF_DESC: "Jaga feed video tetap fokus dengan mengurangi pengulangan dan kekacauan.",
            DLG_MP: "Umpan Marketplace",
            DLG_MP_DESC: "Saring listing berdasarkan harga dan kata kunci.",
            DLG_PP: "Profil / Halaman",
            DLG_PP_DESC: "Atur apa yang tampil di profil dan halaman.",
            DLG_OTHER: "Catatan tambahan",
            DLG_OTHER_DESC: "Sembunyikan kotak tambahan yang tidak Anda inginkan.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Filter teks",
            DLG_BLOCK_NEW_LINE: "(Pisahkan kata atau frasa dengan jeda baris, Ekspresi Reguler didukung)",
            NF_BLOCKED_ENABLED: "Diaktifkan",
            GF_BLOCKED_ENABLED: "Diaktifkan",
            VF_BLOCKED_ENABLED: "Diaktifkan",
            MP_BLOCKED_ENABLED: "Diaktifkan",
            PP_BLOCKED_ENABLED: "Diaktifkan",
            NF_BLOCKED_RE: "Ekspresi Reguler (RegExp)",
            GF_BLOCKED_RE: "Ekspresi Reguler (RegExp)",
            VF_BLOCKED_RE: "Ekspresi Reguler (RegExp)",
            MP_BLOCKED_RE: "Ekspresi Reguler (RegExp)",
            PP_BLOCKED_RE: "Ekspresi Reguler (RegExp)",
            DLG_VERBOSITY: "Opsi untuk Postingan Tersembunyi",
            DLG_PREFERENCES: "Preferensi",
            DLG_PREFERENCES_DESC: "Label, penempatan, warna, dan bahasa.",
            DLG_REPORT_BUG: "Laporkan bug",
            DLG_REPORT_BUG_DESC: "Buat laporan diagnostik untuk masalah.",
            DLG_REPORT_BUG_NOTICE: "Bantu kami memperbaikinya:\n1. Gulir agar postingan yang bermasalah terlihat.\n2. Klik 'Buat laporan' lalu 'Salin laporan'.\n3. Klik 'Buka isu' dan tempel laporan ke dalam isu baru.\n4. Tambahkan deskripsi singkat tentang masalahnya.\n(Kami menyamarkan nama/teks, tetapi harap tinjau sebelum membagikan!)",
            DLG_REPORT_BUG_GENERATE: "Buat laporan",
            DLG_REPORT_BUG_COPY: "Salin laporan",
            DLG_REPORT_BUG_OPEN_ISSUES: "Buka isu",
            DLG_REPORT_BUG_STATUS_READY: "Laporan siap.",
            DLG_REPORT_BUG_STATUS_COPIED: "Laporan disalin ke clipboard.",
            DLG_REPORT_BUG_STATUS_FAILED: "Gagal menyalin. Salin manual.",
            DLG_VERBOSITY_CAPTION: "Tampilkan label jika kiriman disembunyikan",
            VERBOSITY_MESSAGE: [
              "tanpa label",
              "Pos disembunyikan. Aturan: ",
              " postingan disembunyikan",
              "7 postingan disembunyikan ~ (hanya di Feed Grup)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Warna teks",
            VERBOSITY_MESSAGE_BG_COLOUR: "Warna latar belakang",
            VERBOSITY_DEBUG: 'Sorot postingan "tersembunyi"',
            CMF_CUSTOMISATIONS: "Kustomisasi",
            CMF_BTN_LOCATION: "Lokasi tombol CMF:",
            CMF_BTN_OPTION: [
              "kiri bawah",
              "kanan atas",
              'dinonaktifkan (gunakan "Pengaturan" di menu Perintah Skrip Pengguna)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Bahasa Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "Bahasa Indonesia",
            CMF_DIALOG_LANGUAGE_DEFAULT: "Gunakan bahasa situs",
            GM_MENU_SETTINGS: "Pengaturan",
            CMF_DIALOG_LOCATION: "Lokasi menu ini:",
            CMF_DIALOG_OPTION: ["sisi kiri", "sisi kanan"],
            CMF_BORDER_COLOUR: "Warna perbatasan",
            DLG_TIPS: "Tentang",
            DLG_TIPS_DESC: "Tautan proyek dan info pengelola.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Jika ini membantu, bintang di {github} sangat berarti.",
            DLG_TIPS_FACEBOOK: "Sapa di {facebook} - saya berbagi karya seni dan puisi di sana.",
            DLG_TIPS_SITE: "Jika ingin melihat apa yang saya lakukan di web, {site} adalah tempat terbaik untuk mulai.",
            DLG_TIPS_CREDITS: "Terima kasih khusus kepada {zbluebugz} untuk proyek asli, dan {trinhquocviet} untuk cabang UI sederhana yang pertama kali saya fork - serta pemeliharaan filter pada masa itu.",
            DLG_TIPS_MAINTAINER_PREFIX: "Dari pengelola:",
            DLG_TIPS_MAINTAINER: "Saya harap skrip ini membantu Anda merebut kembali feed Anda. Saya berjanji menjadi sekutu Anda melawan hal-hal yang tidak ingin Anda lihat online.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "Facebook saya",
            DLG_TIPS_LINK_SITE: "situs saya",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Simpan", "Tutup", "Ekspor", "Impor", "Reset"],
            DLG_BUTTON_TOOLTIPS: [
              "Menyimpan perubahan di browser ini. Hapus data/privat menghapusnya.",
              "Ekspor file cadangan untuk menyimpan dan memindahkan antar perangkat.",
              "Impor file pengaturan untuk memulihkan atau memindahkan.",
              "Atur ulang semua pengaturan ke default."
            ],
            DLG_FB_COLOUR_HINT: "Biarkan kosong untuk menggunakan skema warna FB"
          },
          // -- Italino (Italy)
          it: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Sponsorizzato",
            NF_TABLIST_STORIES_REELS_ROOMS: 'Casella di riepilogo della scheda "Storie | Reels | Stanze"',
            NF_STORIES: "Storie",
            NF_TOP_CARDS_PAGES: "Schede principali (per Pagine)",
            NF_META_AI: "Prova Meta AI",
            NF_HIDE_VERIFIED_BADGE: "Nascondi badge verificati",
            NF_FILTER_VERIFIED_BADGE: "Filtra account verificati",
            NF_AI_SIDE_PANELS: "IA nei pannelli laterali",
            NF_SURVEY: "Sondaggio",
            NF_PEOPLE_YOU_MAY_KNOW: "Persone che potresti conoscere",
            NF_PAID_PARTNERSHIP: "Partnership pubblicizzata",
            NF_SPONSORED_PAID: "Sponsorizzato \xB7 Finanziato da ______",
            NF_SUGGESTIONS: "Suggerimenti / Raccomandazioni",
            NF_FOLLOW: "Segui",
            NF_PARTICIPATE: "Partecipare",
            NF_REELS_SHORT_VIDEOS: "Reel e video brevi",
            NF_SHORT_REEL_VIDEO: "Bobina/breve video",
            NF_EVENTS_YOU_MAY_LIKE: "Eventi che potrebbero piacerti",
            NF_ANIMATED_GIFS_POSTS: "GIF animate",
            NF_ANIMATED_GIFS_PAUSE: "Metti in pausa le GIF animate",
            NF_SHARES: "Condivisioni: #",
            NF_LIKES_MAXIMUM: "Numero massimo di Mi piace",
            GF_PAID_PARTNERSHIP: "Partnership pubblicizzata",
            GF_SUGGESTIONS: "Suggerimenti / Raccomandazioni",
            GF_SHORT_REEL_VIDEO: "Bobina/breve video",
            GF_ANIMATED_GIFS_POSTS: "GIF animate",
            GF_ANIMATED_GIFS_PAUSE: "Metti in pausa le GIF animate",
            GF_SHARES: "Condivisioni: #",
            VF_LIVE: "IN DIRETTA",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Video duplicato",
            VF_ANIMATED_GIFS_PAUSE: "Metti in pausa le GIF animate",
            PP_ANIMATED_GIFS_POSTS: "GIF animate",
            PP_ANIMATED_GIFS_PAUSE: "Metti in pausa le GIF animate",
            NF_BLOCKED_FEED: ["Feed di notizie", "Feed di gruppo", "Feed di video"],
            GF_BLOCKED_FEED: ["Feed di notizie", "Feed di gruppo", "Feed di video"],
            VF_BLOCKED_FEED: ["Feed di notizie", "Feed di gruppo", "Feed di video"],
            MP_BLOCKED_FEED: ["Feed id Marketplace"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Coronavirus (casella informativa)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Scienza del clima (casella informativa)",
            OTHER_INFO_BOX_SUBSCRIBE: "Iscriviti (casella informativa)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Controlli di riproduzione e loop.",
            REELS_CONTROLS: "Mostra controlli video",
            REELS_DISABLE_LOOPING: "Disattiva ripetizione",
            DLG_TITLE: "Pulisci i miei feed",
            DLG_NF: "Feed di notizie",
            DLG_NF_DESC: "Ripulisci i suggerimenti e imposta quanto \xE8 severo il feed.",
            DLG_GF: "Feed di gruppo",
            DLG_GF_DESC: "Riordina i feed dei gruppi riducendo extra e rumore.",
            DLG_VF: "Feed di video",
            DLG_VF_DESC: "Rendi il feed video pi\xF9 pulito riducendo ripetizioni e disordine.",
            DLG_MP: "Feed id Marketplace",
            DLG_MP_DESC: "Filtra gli annunci per prezzo e parole chiave.",
            DLG_PP: "Profilo / Pagina",
            DLG_PP_DESC: "Regola cosa appare su profili e pagine.",
            DLG_OTHER: "Note aggiuntive",
            DLG_OTHER_DESC: "Nascondi riquadri extra che non vuoi.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Filtro di testo",
            DLG_BLOCK_NEW_LINE: "(Separa parole o frasi con un'interruzione di riga, le espressioni regolari sono supportate)",
            NF_BLOCKED_ENABLED: "Abilita opzione",
            GF_BLOCKED_ENABLED: "Abilita opzione",
            VF_BLOCKED_ENABLED: "Abilita opzione",
            MP_BLOCKED_ENABLED: "Abilita opzione",
            PP_BLOCKED_ENABLED: "Abilita opzione",
            NF_BLOCKED_RE: "Espressioni regolari (RegExp)",
            GF_BLOCKED_RE: "Espressioni regolari (RegExp)",
            VF_BLOCKED_RE: "Espressioni regolari (RegExp)",
            MP_BLOCKED_RE: "Espressioni regolari (RegExp)",
            PP_BLOCKED_RE: "Espressioni regolari (RegExp)",
            DLG_VERBOSITY: "Opzioni per post nascosti",
            DLG_PREFERENCES: "Preferenze",
            DLG_PREFERENCES_DESC: "Etichette, posizione, colori e lingua.",
            DLG_REPORT_BUG: "Segnala un bug",
            DLG_REPORT_BUG_DESC: "Genera un report diagnostico.",
            DLG_REPORT_BUG_NOTICE: "Aiutaci a risolvere il problema:\n1. Scorri in modo che il post problematico sia visibile.\n2. Clicca su 'Genera report' poi su 'Copia report'.\n3. Clicca su 'Apri segnalazioni' e incolla il report in una nuova segnalazione.\n4. Aggiungi una breve descrizione del problema.\n(Oscuriamo nomi/testo, ma controlla prima di condividere!)",
            DLG_REPORT_BUG_GENERATE: "Genera report",
            DLG_REPORT_BUG_COPY: "Copia report",
            DLG_REPORT_BUG_OPEN_ISSUES: "Apri segnalazioni",
            DLG_REPORT_BUG_STATUS_READY: "Report pronto.",
            DLG_REPORT_BUG_STATUS_COPIED: "Report copiato negli appunti.",
            DLG_REPORT_BUG_STATUS_FAILED: "Copia non riuscita. Copia manualmente.",
            DLG_VERBOSITY_CAPTION: "Mostrare un'etichetta se un post \xE8 nascosto",
            VERBOSITY_MESSAGE: [
              "nessuna etichetta",
              "Post nascosto. Regola: ",
              " post nascosti",
              "7 post nascosti ~ (solo nel Feed di Gruppi)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Colore del testo",
            VERBOSITY_MESSAGE_BG_COLOUR: "Colore di sfondo",
            VERBOSITY_DEBUG: 'Evidenzia i post "nascosti"',
            CMF_CUSTOMISATIONS: "Personalizzazioni",
            CMF_BTN_LOCATION: "Posizione del pulsante CMF:",
            CMF_BTN_OPTION: [
              "in basso a sinistra",
              "in alto a destra",
              'disabilitato (usa "Impostazioni" nel menu Comandi script utente)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Lingua di Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "Italiano",
            CMF_DIALOG_LANGUAGE_DEFAULT: "Usa la lingua del sito",
            GM_MENU_SETTINGS: "Impostazioni",
            CMF_DIALOG_LOCATION: "Posizione di questo menu:",
            CMF_DIALOG_OPTION: ["lato sinistro", "lato destro"],
            CMF_BORDER_COLOUR: "Colore del bordo",
            DLG_TIPS: "Info",
            DLG_TIPS_DESC: "Link al progetto e info del maintainer.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Se ti \xE8 utile, una stella su {github} significa molto.",
            DLG_TIPS_FACEBOOK: "Passa a salutarmi su {facebook} - l\xEC condivido la mia arte e poesia.",
            DLG_TIPS_SITE: "Se vuoi vedere cosa faccio in giro per il web, {site} \xE8 il posto migliore da cui partire.",
            DLG_TIPS_CREDITS: "Un grazie speciale a {zbluebugz} per il progetto originale e a {trinhquocviet} per il branch UI semplificato da cui ho fatto il fork iniziale - e per la manutenzione dei filtri in quel periodo.",
            DLG_TIPS_MAINTAINER_PREFIX: "Dal maintainer:",
            DLG_TIPS_MAINTAINER: "Spero che questo script ti aiuti a riprenderti il tuo feed. Prometto di essere il tuo alleato nella lotta contro ci\xF2 che non vuoi vedere online.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "la mia pagina Facebook",
            DLG_TIPS_LINK_SITE: "il mio sito",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Salva", "Chiudi", "Esportare", "Importare", "Ripristina"],
            DLG_BUTTON_TOOLTIPS: [
              "Salva le modifiche in questo browser. Cancellare dati/privato le rimuove.",
              "Esporta un file di backup per conservarle e spostarle tra dispositivi.",
              "Importa un file di impostazioni per ripristinare o trasferire.",
              "Reimposta tutte le impostazioni ai valori predefiniti."
            ],
            DLG_FB_COLOUR_HINT: "Lascia vuoto per usare la combinazione di colori di FB"
          },
          // -- Japanese (Japan)
          ja: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "\u5E83\u544A",
            NF_TABLIST_STORIES_REELS_ROOMS: "\u300CStories | Reels | Rooms\u300D\u30BF\u30D6\u306E\u30EA\u30B9\u30C8\u30DC\u30C3\u30AF\u30B9",
            NF_STORIES: "Stories",
            NF_TOP_CARDS_PAGES: "\u30C8\u30C3\u30D7\u30AB\u30FC\u30C9\uFF08\u30DA\u30FC\u30B8\u5411\u3051\uFF09",
            NF_META_AI: "Meta AI \u3092\u8A66\u3059",
            NF_HIDE_VERIFIED_BADGE: "\u8A8D\u8A3C\u30D0\u30C3\u30B8\u3092\u975E\u8868\u793A",
            NF_FILTER_VERIFIED_BADGE: "\u8A8D\u8A3C\u6E08\u307F\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u30D5\u30A3\u30EB\u30BF\u30FC",
            NF_AI_SIDE_PANELS: "\u30B5\u30A4\u30C9\u30D1\u30CD\u30EB\u306EAI",
            NF_SURVEY: "\u30A2\u30F3\u30B1\u30FC\u30C8",
            NF_PEOPLE_YOU_MAY_KNOW: "\u3042\u306A\u305F\u304C\u77E5\u3063\u3066\u3044\u308B\u304B\u3082\u3057\u308C\u306A\u3044\u4EBA\u3005",
            NF_PAID_PARTNERSHIP: "\u6709\u511F\u30D1\u30FC\u30C8\u30CA\u30FC\u30B7\u30C3\u30D7",
            NF_SPONSORED_PAID: "\u5F8C\u63F4 \xB7 ______ \u306B\u3088\u308B\u652F\u6255\u3044",
            NF_SUGGESTIONS: "\u63D0\u6848/\u63A8\u5968\u4E8B\u9805",
            NF_FOLLOW: "\u30D5\u30A9\u30ED\u30FC",
            NF_PARTICIPATE: "\u53C2\u52A0\u3059\u308B",
            NF_REELS_SHORT_VIDEOS: "\u30EA\u30FC\u30EB\u3068\u30B7\u30E7\u30FC\u30C8\u52D5\u753B",
            NF_SHORT_REEL_VIDEO: "\u30EA\u30FC\u30EB/\u30B7\u30E7\u30FC\u30C8\u30D3\u30C7\u30AA",
            NF_EVENTS_YOU_MAY_LIKE: "\u30EA\u30FC\u30EB/\u30B7\u30E7\u30FC\u30C8\u30D3\u30C7\u30AA",
            NF_ANIMATED_GIFS_POSTS: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3 GIF",
            NF_ANIMATED_GIFS_PAUSE: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3 GIF \u3092\u4E00\u6642\u505C\u6B62\u3059\u308B",
            NF_SHARES: "\u30B7\u30A7\u30A2#\u4EF6",
            NF_LIKES_MAXIMUM: "\u300C\u3044\u3044\u306D\uFF01\u300D\u306E\u6700\u5927\u6570",
            GF_PAID_PARTNERSHIP: "\u6709\u511F\u30D1\u30FC\u30C8\u30CA\u30FC\u30B7\u30C3\u30D7",
            GF_SUGGESTIONS: "\u63D0\u6848/\u63A8\u5968\u4E8B\u9805",
            GF_SHORT_REEL_VIDEO: "\u30EA\u30FC\u30EB\u3068\u30B7\u30E7\u30FC\u30C8\u30D3\u30C7\u30AA",
            GF_ANIMATED_GIFS_POSTS: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3 GIF",
            GF_ANIMATED_GIFS_PAUSE: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3 GIF \u3092\u4E00\u6642\u505C\u6B62\u3059\u308B",
            GF_SHARES: "\u30B7\u30A7\u30A2#\u4EF6",
            VF_LIVE: "\u30E9\u30A4\u30D6",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "\u91CD\u8907\u3059\u308B\u52D5\u753B",
            VF_ANIMATED_GIFS_PAUSE: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3 GIF \u3092\u4E00\u6642\u505C\u6B62\u3059\u308B",
            PP_ANIMATED_GIFS_POSTS: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3 GIF",
            PP_ANIMATED_GIFS_PAUSE: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3 GIF \u3092\u4E00\u6642\u505C\u6B62\u3059\u308B",
            NF_BLOCKED_FEED: ["\u30CB\u30E5\u30FC\u30B9\u30D5\u30A3\u30FC\u30C9", "\u30B0\u30EB\u30FC\u30D7 \u30D5\u30A3\u30FC\u30C9", "\u52D5\u753B\u30D5\u30A3\u30FC\u30C9"],
            GF_BLOCKED_FEED: ["\u30CB\u30E5\u30FC\u30B9\u30D5\u30A3\u30FC\u30C9", "\u30B0\u30EB\u30FC\u30D7 \u30D5\u30A3\u30FC\u30C9", "\u52D5\u753B\u30D5\u30A3\u30FC\u30C9"],
            VF_BLOCKED_FEED: ["\u30CB\u30E5\u30FC\u30B9\u30D5\u30A3\u30FC\u30C9", "\u30B0\u30EB\u30FC\u30D7 \u30D5\u30A3\u30FC\u30C9", "\u52D5\u753B\u30D5\u30A3\u30FC\u30C9"],
            MP_BLOCKED_FEED: ["\u30DE\u30FC\u30B1\u30C3\u30C8\u30D7\u30EC\u30A4\u30B9 \u30D5\u30A3\u30FC\u30C9"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "\u30B3\u30ED\u30CA\u30A6\u30A4\u30EB\u30B9\uFF08\u30A4\u30F3\u30D5\u30A9\u30E1\u30FC\u30B7\u30E7\u30F3\u30DC\u30C3\u30AF\u30B9\uFF09",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "\u6C17\u5019\u79D1\u5B66\uFF08\u60C5\u5831\u30DC\u30C3\u30AF\u30B9\uFF09",
            OTHER_INFO_BOX_SUBSCRIBE: "\u8CFC\u8AAD\u3059\u308B\uFF08\u60C5\u5831\u30DC\u30C3\u30AF\u30B9\uFF09",
            REELS_TITLE: "\u30EA\u30FC\u30EB\u52D5\u753B",
            DLG_REELS_DESC: "\u518D\u751F\u3068\u30EB\u30FC\u30D7\u306E\u30B3\u30F3\u30C8\u30ED\u30FC\u30EB\u3002",
            REELS_CONTROLS: "\u30D3\u30C7\u30AA\u30B3\u30F3\u30C8\u30ED\u30FC\u30EB\u3092\u8868\u793A",
            REELS_DISABLE_LOOPING: "\u30EB\u30FC\u30D7\u306E\u7121\u52B9\u5316",
            DLG_TITLE: "\u30D5\u30A3\u30FC\u30C9\u3092\u30AF\u30EA\u30FC\u30F3\u30A2\u30C3\u30D7",
            DLG_NF: "\u30CB\u30E5\u30FC\u30B9\u30D5\u30A3\u30FC\u30C9",
            DLG_NF_DESC: "\u304A\u3059\u3059\u3081\u3092\u6574\u7406\u3057\u3001\u30D5\u30A3\u30FC\u30C9\u306E\u53B3\u3057\u3055\u3092\u8ABF\u6574\u3057\u307E\u3059\u3002",
            DLG_GF: "\u30B0\u30EB\u30FC\u30D7 \u30D5\u30A3\u30FC\u30C9",
            DLG_GF_DESC: "\u30B0\u30EB\u30FC\u30D7\u306E\u30D5\u30A3\u30FC\u30C9\u3092\u6574\u7406\u3057\u3066\u4F59\u8A08\u306A\u3082\u306E\u3084\u30CE\u30A4\u30BA\u3092\u6E1B\u3089\u3057\u307E\u3059\u3002",
            DLG_VF: "\u52D5\u753B\u30D5\u30A3\u30FC\u30C9",
            DLG_VF_DESC: "\u52D5\u753B\u30D5\u30A3\u30FC\u30C9\u306E\u91CD\u8907\u3084\u30CE\u30A4\u30BA\u3092\u6E1B\u3089\u3057\u3066\u898B\u3084\u3059\u304F\u3057\u307E\u3059\u3002",
            DLG_MP: "\u30DE\u30FC\u30B1\u30C3\u30C8\u30D7\u30EC\u30A4\u30B9 \u30D5\u30A3\u30FC\u30C9",
            DLG_MP_DESC: "\u4FA1\u683C\u3084\u30AD\u30FC\u30EF\u30FC\u30C9\u3067\u51FA\u54C1\u3092\u7D5E\u308A\u8FBC\u307F\u307E\u3059\u3002",
            DLG_PP: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB / \u30DA\u30FC\u30B8",
            DLG_PP_DESC: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3084\u30DA\u30FC\u30B8\u306B\u8868\u793A\u3055\u308C\u308B\u5185\u5BB9\u3092\u8ABF\u6574\u3057\u307E\u3059\u3002",
            DLG_OTHER: "\u88DC\u8DB3\u30E1\u30E2",
            DLG_OTHER_DESC: "\u4E0D\u8981\u306A\u8FFD\u52A0\u30DC\u30C3\u30AF\u30B9\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3059\u3002",
            DLG_BLOCK_TEXT_FILTER_TITLE: "\u30C6\u30AD\u30B9\u30C8\u30D5\u30A3\u30EB\u30BF\u30FC",
            DLG_BLOCK_NEW_LINE: "(\u5358\u8A9E\u3084\u30D5\u30EC\u30FC\u30BA\u3092\u6539\u884C\u3067\u533A\u5207\u3063\u3066\u304F\u3060\u3055\u3044\u3002\u6B63\u898F\u8868\u73FE\u304C\u30B5\u30DD\u30FC\u30C8\u3055\u308C\u3066\u3044\u307E\u3059)",
            NF_BLOCKED_ENABLED: "\u6709\u52B9\u5316",
            GF_BLOCKED_ENABLED: "\u6709\u52B9\u5316",
            VF_BLOCKED_ENABLED: "\u6709\u52B9\u5316",
            MP_BLOCKED_ENABLED: "\u6709\u52B9\u5316",
            PP_BLOCKED_ENABLED: "\u6709\u52B9\u5316",
            NF_BLOCKED_RE: "\u6B63\u898F\u8868\u73FE (RegExp)",
            GF_BLOCKED_RE: "\u6B63\u898F\u8868\u73FE (RegExp)",
            VF_BLOCKED_RE: "\u6B63\u898F\u8868\u73FE (RegExp)",
            MP_BLOCKED_RE: "\u6B63\u898F\u8868\u73FE (RegExp)",
            PP_BLOCKED_RE: "\u6B63\u898F\u8868\u73FE (RegExp)",
            DLG_VERBOSITY: "\u975E\u8868\u793A\u6295\u7A3F\u306E\u30AA\u30D7\u30B7\u30E7\u30F3",
            DLG_PREFERENCES: "\u8A2D\u5B9A",
            DLG_PREFERENCES_DESC: "\u30E9\u30D9\u30EB\u3001\u914D\u7F6E\u3001\u8272\u3001\u8A00\u8A9E\u3002",
            DLG_REPORT_BUG: "\u30D0\u30B0\u3092\u5831\u544A",
            DLG_REPORT_BUG_DESC: "\u554F\u984C\u306E\u8A3A\u65AD\u30EC\u30DD\u30FC\u30C8\u3092\u4F5C\u6210\u3057\u307E\u3059\u3002",
            DLG_REPORT_BUG_NOTICE: "\u4FEE\u6B63\u306B\u3054\u5354\u529B\u304F\u3060\u3055\u3044\uFF1A\n1. \u554F\u984C\u306E\u3042\u308B\u6295\u7A3F\u304C\u8868\u793A\u3055\u308C\u308B\u3088\u3046\u306B\u30B9\u30AF\u30ED\u30FC\u30EB\u3057\u307E\u3059\u3002\n2. '\u30EC\u30DD\u30FC\u30C8\u4F5C\u6210'\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3001\u6B21\u306B'\u30EC\u30DD\u30FC\u30C8\u3092\u30B3\u30D4\u30FC'\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u307E\u3059\u3002\n3. 'Issue \u3092\u958B\u304F'\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3001\u65B0\u3057\u3044Issue\u306B\u30EC\u30DD\u30FC\u30C8\u3092\u8CBC\u308A\u4ED8\u3051\u307E\u3059\u3002\n4. \u554F\u984C\u306E\u77ED\u3044\u8AAC\u660E\u3092\u8FFD\u52A0\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n(\u540D\u524D\u3084\u30C6\u30AD\u30B9\u30C8\u306F\u4F0F\u305B\u5B57\u306B\u3057\u307E\u3059\u304C\u3001\u5171\u6709\u524D\u306B\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\uFF01)",
            DLG_REPORT_BUG_GENERATE: "\u30EC\u30DD\u30FC\u30C8\u4F5C\u6210",
            DLG_REPORT_BUG_COPY: "\u30EC\u30DD\u30FC\u30C8\u3092\u30B3\u30D4\u30FC",
            DLG_REPORT_BUG_OPEN_ISSUES: "Issue \u3092\u958B\u304F",
            DLG_REPORT_BUG_STATUS_READY: "\u30EC\u30DD\u30FC\u30C8\u304C\u7528\u610F\u3067\u304D\u307E\u3057\u305F\u3002",
            DLG_REPORT_BUG_STATUS_COPIED: "\u30EC\u30DD\u30FC\u30C8\u3092\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F\u3002",
            DLG_REPORT_BUG_STATUS_FAILED: "\u30B3\u30D4\u30FC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u624B\u52D5\u3067\u30B3\u30D4\u30FC\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
            DLG_VERBOSITY_CAPTION: "\u6295\u7A3F\u304C\u975E\u8868\u793A\u306E\u5834\u5408\u306B\u30E9\u30D9\u30EB\u3092\u8868\u793A\u3059\u308B",
            VERBOSITY_MESSAGE: [
              "\u30E9\u30D9\u30EB\u306A\u3057",
              "\u6295\u7A3F\u3092\u975E\u8868\u793A\u306B\u3057\u307E\u3057\u305F\u3002 \u30EB\u30FC\u30EB\uFF1A ",
              " \u4EF6\u306E\u6295\u7A3F\u304C\u975E\u8868\u793A",
              "7\u4EF6\u306E\u6295\u7A3F\u304C\u975E\u8868\u793A ~ (\u30B0\u30EB\u30FC\u30D7\u30D5\u30A3\u30FC\u30C9\u306E\u307F)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "\u30C6\u30AD\u30B9\u30C8\u306E\u8272",
            VERBOSITY_MESSAGE_BG_COLOUR: "\u80CC\u666F\u8272",
            VERBOSITY_DEBUG: "\u300C\u975E\u8868\u793A\u300D\u306E\u6295\u7A3F\u3092\u5F37\u8ABF\u8868\u793A\u3059\u308B",
            CMF_CUSTOMISATIONS: "\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA",
            CMF_BTN_LOCATION: "CMF\u30DC\u30BF\u30F3\u306E\u4F4D\u7F6E:",
            CMF_BTN_OPTION: [
              "\u4E0B\u5DE6",
              "\u4E0A\u53F3",
              "\u7121\u52B9 ([\u30E6\u30FC\u30B6\u30FC \u30B9\u30AF\u30EA\u30D7\u30C8 \u30B3\u30DE\u30F3\u30C9] \u30E1\u30CB\u30E5\u30FC\u306E [\u8A2D\u5B9A] \u3092\u4F7F\u7528)"
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds\u306E\u8A00\u8A9E:",
            CMF_DIALOG_LANGUAGE: "\u65E5\u672C\u8A9E",
            CMF_DIALOG_LANGUAGE_DEFAULT: "\u30B5\u30A4\u30C8\u306E\u8A00\u8A9E\u3092\u4F7F\u7528",
            GM_MENU_SETTINGS: "\u8A2D\u5B9A",
            CMF_DIALOG_LOCATION: "\u3053\u306E\u30E1\u30CB\u30E5\u30FC\u306E\u4F4D\u7F6E:",
            CMF_DIALOG_OPTION: ["\u5DE6\u5074", "\u53F3\u5074"],
            CMF_BORDER_COLOUR: "\u30DC\u30FC\u30C0\u30FC\u30AB\u30E9\u30FC",
            DLG_TIPS: "\u6982\u8981",
            DLG_TIPS_DESC: "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30EA\u30F3\u30AF\u3068\u30E1\u30F3\u30C6\u30CA\u60C5\u5831\u3002",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "\u5F79\u306B\u7ACB\u3063\u305F\u3089 {github} \u306E\u30B9\u30BF\u30FC\u304C\u52B1\u307F\u306B\u306A\u308A\u307E\u3059\u3002",
            DLG_TIPS_FACEBOOK: "{facebook}\u3067\u58F0\u3092\u304B\u3051\u3066\u304F\u3060\u3055\u3044 - \u305D\u3053\u3067\u30A2\u30FC\u30C8\u3068\u8A69\u3092\u5171\u6709\u3057\u3066\u3044\u307E\u3059\u3002",
            DLG_TIPS_SITE: "\u6D3B\u52D5\u3092\u307E\u3068\u3081\u3066\u898B\u305F\u3044\u306A\u3089\u3001{site}\u304C\u3044\u3061\u3070\u3093\u306E\u5165\u53E3\u3067\u3059\u3002",
            DLG_TIPS_CREDITS: "\u5143\u306E\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u306E {zbluebugz} \u3068\u3001\u79C1\u304C\u6700\u521D\u306B fork \u3057\u305F\u7C21\u6613 UI \u30D6\u30E9\u30F3\u30C1\u306E {trinhquocviet} \u306B\u7279\u5225\u306A\u611F\u8B1D\u3092\u3002\u3042\u306E\u671F\u9593\u306E\u30D5\u30A3\u30EB\u30BF\u30FC\u4FDD\u5B88\u306B\u3082\u611F\u8B1D\u3057\u307E\u3059\u3002",
            DLG_TIPS_MAINTAINER_PREFIX: "\u30E1\u30F3\u30C6\u30CA\u3088\u308A\uFF1A",
            DLG_TIPS_MAINTAINER: "\u3053\u306E\u30B9\u30AF\u30EA\u30D7\u30C8\u304C\u3042\u306A\u305F\u306E\u30D5\u30A3\u30FC\u30C9\u3092\u53D6\u308A\u623B\u3059\u52A9\u3051\u306B\u306A\u308C\u3070\u5B09\u3057\u3044\u3067\u3059\u3002\u30AA\u30F3\u30E9\u30A4\u30F3\u3067\u898B\u305F\u304F\u306A\u3044\u3082\u306E\u3068\u6226\u3046\u3042\u306A\u305F\u306E\u5473\u65B9\u3067\u3044\u308B\u3068\u7D04\u675F\u3057\u307E\u3059\u3002",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "\u79C1\u306EFacebook",
            DLG_TIPS_LINK_SITE: "\u79C1\u306E\u30B5\u30A4\u30C8",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["\u30BB\u30FC\u30D6", "\u30AF\u30ED\u30FC\u30BA", "\u8F38\u51FA\u3059\u308B", "\u8F38\u5165", "\u30EA\u30BB\u30C3\u30C8"],
            DLG_BUTTON_TOOLTIPS: [
              "\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u306B\u4FDD\u5B58\u3057\u307E\u3059\u3002\u30C7\u30FC\u30BF\u524A\u9664/\u30D7\u30E9\u30A4\u30D9\u30FC\u30C8\u3067\u6D88\u3048\u307E\u3059\u3002",
              "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u7528\u30D5\u30A1\u30A4\u30EB\u3092\u66F8\u304D\u51FA\u3057\u3001\u7AEF\u672B\u9593\u3067\u79FB\u884C\u3067\u304D\u307E\u3059\u3002",
              "\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u3092\u8AAD\u307F\u8FBC\u307F\u3001\u5FA9\u5143\u307E\u305F\u306F\u79FB\u884C\u3057\u307E\u3059\u3002",
              "\u3059\u3079\u3066\u306E\u8A2D\u5B9A\u3092\u521D\u671F\u5316\u3057\u307E\u3059\u3002"
            ],
            DLG_FB_COLOUR_HINT: "\u7A7A\u767D\u306E\u307E\u307E\u306B\u3059\u308B\u3068\u3001FB \u306E\u914D\u8272\u304C\u4F7F\u7528\u3055\u308C\u307E\u3059"
          },
          // -- Latviešu (Latvia)
          lv: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Apmaks\u0101ta rekl\u0101ma",
            NF_TABLIST_STORIES_REELS_ROOMS: 'Cilnes "St\u0101sti | Video rull\u012B\u0161i | Rooms" sarakstlodzi\u0146\u0161',
            NF_STORIES: "St\u0101sti",
            NF_TOP_CARDS_PAGES: "Aug\u0161\u0113j\u0101s kart\u012Btes (lap\u0101m)",
            NF_META_AI: "Izm\u0113\u0123iniet Meta AI",
            NF_HIDE_VERIFIED_BADGE: "Sl\u0113pt verific\u0113t\u0101s noz\u012Bm\u012Btes",
            NF_FILTER_VERIFIED_BADGE: "Filtr\u0113t verific\u0113tos kontus",
            NF_AI_SIDE_PANELS: "AI s\u0101nu pane\u013Cos",
            NF_SURVEY: "Aptauja",
            NF_PEOPLE_YOU_MAY_KNOW: "Cilv\u0113ki, kurus tu var\u0113tu paz\u012Bt",
            NF_PAID_PARTNERSHIP: "Apmaks\u0101ta sadarb\u012Bba",
            NF_SPONSORED_PAID: "Apmaks\u0101ta rekl\u0101ma \xB7 Apmaks\u0101 ______",
            NF_SUGGESTIONS: "Ieteikumi",
            NF_FOLLOW: "Sekot",
            NF_PARTICIPATE: "Piedal\u012Bties",
            NF_REELS_SHORT_VIDEOS: "Reels un \u012Bsi videoklipi",
            NF_SHORT_REEL_VIDEO: "Ru\u013C\u013Ca/\u012Bss video",
            NF_EVENTS_YOU_MAY_LIKE: "Notikumi, kas jums var\u0113tu patikt",
            NF_ANIMATED_GIFS_POSTS: "Anim\u0113tos GIF",
            NF_ANIMATED_GIFS_PAUSE: "Apturiet anim\u0113tos GIF",
            NF_SHARES: "# dal\u012Bj\u0101s",
            NF_LIKES_MAXIMUM: "Maksim\u0101lais atz\u012Bmju Pat\u012Bk skaits",
            GF_PAID_PARTNERSHIP: "Apmaks\u0101ta sadarb\u012Bba",
            GF_SUGGESTIONS: "Ieteikumi",
            GF_SHORT_REEL_VIDEO: "Ru\u013C\u013Ca/\u012Bss video",
            GF_ANIMATED_GIFS_POSTS: "Anim\u0113tos GIF",
            GF_ANIMATED_GIFS_PAUSE: "Apturiet anim\u0113tos GIF",
            GF_SHARES: "# dal\u012Bj\u0101s",
            VF_LIVE: "TIE\u0160RAIDE",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Dubl\u0113tais video",
            VF_ANIMATED_GIFS_PAUSE: "Apturiet anim\u0113tos GIF",
            PP_ANIMATED_GIFS_POSTS: "Anim\u0113tos GIF",
            PP_ANIMATED_GIFS_PAUSE: "Apturiet anim\u0113tos GIF",
            NF_BLOCKED_FEED: ["Zi\u0146u pl\u016Bsma", "Grupu pl\u016Bsma", "Video pl\u016Bsma"],
            GF_BLOCKED_FEED: ["Zi\u0146u pl\u016Bsma", "Grupu pl\u016Bsma", "Video pl\u016Bsma"],
            VF_BLOCKED_FEED: ["Zi\u0146u pl\u016Bsma", "Grupu pl\u016Bsma", "Video pl\u016Bsma"],
            MP_BLOCKED_FEED: ["Marketplace"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Koronav\u012Bruss (inform\u0101cijas lodzi\u0146\u0161)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Klimata zin\u0101tne (inform\u0101cijas lodzi\u0146\u0161)",
            OTHER_INFO_BOX_SUBSCRIBE: "Abon\u0113t (inform\u0101cijas lodzi\u0146\u0161)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Atska\u0146o\u0161anas un cikla kontrole.",
            REELS_CONTROLS: "R\u0101d\u012Bt video vad\u012Bklus",
            REELS_DISABLE_LOOPING: "Atsp\u0113jot cilpoto\u0161anu",
            DLG_TITLE: "T\u012Br\u012Bt manas pl\u016Bsmas",
            DLG_NF: "Zi\u0146u pl\u016Bsma",
            DLG_NF_DESC: "Sak\u0101rto ieteikumus un nosaki, cik stingrai j\u0101b\u016Bt pl\u016Bsmai.",
            DLG_GF: "Grupu pl\u016Bsma",
            DLG_GF_DESC: "Sak\u0101rto grupu pl\u016Bsmas, mazinot lieko un troksni.",
            DLG_VF: "Video pl\u016Bsma",
            DLG_VF_DESC: "Uzturi video pl\u016Bsmu fokus\u0113tu, samazinot atk\u0101rtojumus un jucekli.",
            DLG_MP: "Marketplace",
            DLG_MP_DESC: "Filtr\u0113 sludin\u0101jumus p\u0113c cenas un atsl\u0113gv\u0101rdiem.",
            DLG_PP: "Profils / Lapa",
            DLG_PP_DESC: "Piel\u0101go, kas redzams profilos un lap\u0101s.",
            DLG_OTHER: "Papildu piez\u012Bmes",
            DLG_OTHER_DESC: "Pasl\u0113p papildu lodzi\u0146us, kurus nev\u0113laties.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Teksta filtrs",
            DLG_BLOCK_NEW_LINE: "(Atdaliet v\u0101rdus vai fr\u0101zes ar rindkopu p\u0101rtraukumu, regul\u0101rie izteicieni tiek atbalst\u012Bti)",
            NF_BLOCKED_ENABLED: "Iesp\u0113jots",
            GF_BLOCKED_ENABLED: "Iesp\u0113jots",
            VF_BLOCKED_ENABLED: "Iesp\u0113jots",
            MP_BLOCKED_ENABLED: "Iesp\u0113jots",
            PP_BLOCKED_ENABLED: "Iesp\u0113jots",
            NF_BLOCKED_RE: "Regul\u0101r\u0101s izteiksmes (RegExp)",
            GF_BLOCKED_RE: "Regul\u0101r\u0101s izteiksmes (RegExp)",
            VF_BLOCKED_RE: "Regul\u0101r\u0101s izteiksmes (RegExp)",
            MP_BLOCKED_RE: "Regul\u0101r\u0101s izteiksmes (RegExp)",
            PP_BLOCKED_RE: "Regul\u0101r\u0101s izteiksmes (RegExp)",
            DLG_VERBOSITY: "Sl\u0113pto ierakstu iesp\u0113jas",
            DLG_PREFERENCES: "Iestat\u012Bjumi",
            DLG_PREFERENCES_DESC: "Eti\u0137etes, novietojums, kr\u0101sas un valoda.",
            DLG_REPORT_BUG: "Zi\u0146ot par k\u013C\u016Bdu",
            DLG_REPORT_BUG_DESC: "Izveido diagnostikas atskaiti probl\u0113m\u0101m.",
            DLG_REPORT_BUG_NOTICE: "Pal\u012Bdzi mums to salabot:\n1. Ritiniet, lai problem\u0101tiskais ieraksts b\u016Btu redzams.\n2. Noklik\u0161\u0137iniet uz 'Izveidot atskaiti', tad 'Kop\u0113t atskaiti'.\n3. Noklik\u0161\u0137iniet uz 'Atv\u0113rt pieteikumus' un iel\u012Bm\u0113jiet atskaiti jaun\u0101 pieteikum\u0101.\n4. Pievienojiet \u012Bsu probl\u0113mas aprakstu.\n(M\u0113s redi\u0123\u0113jam v\u0101rdus/tekstu, bet l\u016Bdzu p\u0101rskatiet pirms kop\u012Bgo\u0161anas!)",
            DLG_REPORT_BUG_GENERATE: "Izveidot atskaiti",
            DLG_REPORT_BUG_COPY: "Kop\u0113t atskaiti",
            DLG_REPORT_BUG_OPEN_ISSUES: "Atv\u0113rt pieteikumus",
            DLG_REPORT_BUG_STATUS_READY: "Atskaite ir gatava.",
            DLG_REPORT_BUG_STATUS_COPIED: "Atskaite nokop\u0113ta starpliktuv\u0113.",
            DLG_REPORT_BUG_STATUS_FAILED: "Kop\u0113\u0161ana neizdev\u0101s. Kop\u0113 manu\u0101li.",
            DLG_VERBOSITY_CAPTION: "R\u0101d\u012Bt eti\u0137eti, ja raksts ir pasl\u0113pts",
            VERBOSITY_MESSAGE: [
              "nav nek\u0101da zi\u0146ojuma",
              "Zi\u0146a ir pasl\u0113pta. Noteikums: ",
              " zi\u0146as ir pasl\u0113ptas",
              "7 zi\u0146as pasl\u0113ptas ~ (tikai Grupu pl\u016Bsm\u0113)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Teksta kr\u0101sa",
            VERBOSITY_MESSAGE_BG_COLOUR: "Fona kr\u0101sa",
            VERBOSITY_DEBUG: 'Izceliet "sl\u0113ptos" rakstus',
            CMF_CUSTOMISATIONS: "Personaliz\u0113\u0161ana",
            CMF_BTN_LOCATION: "CMF pogas atra\u0161an\u0101s vieta:",
            CMF_BTN_OPTION: [
              "apak\u0161\u0113j\u0101 kreisaj\u0101 st\u016Br\u012B",
              "aug\u0161\u0113j\u0101 labaj\u0101 st\u016Br\u012B",
              "atsp\u0113jota (lietot\u0101ja skripta komandu izv\u0113ln\u0113 izmantojiet sada\u013Cu Iestat\u012Bjumi)"
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds valoda:",
            CMF_DIALOG_LANGUAGE: "Latvie\u0161u",
            CMF_DIALOG_LANGUAGE_DEFAULT: "Izmantot vietnes valodu",
            GM_MENU_SETTINGS: "Iestat\u012Bjumi",
            CMF_DIALOG_LOCATION: "\u0160\u012Bs izv\u0113lnes atra\u0161an\u0101s vieta:",
            CMF_DIALOG_OPTION: ["kreis\u0101 puse", "lab\u0101 puse"],
            CMF_BORDER_COLOUR: "Apmales kr\u0101sa",
            DLG_TIPS: "Par",
            DLG_TIPS_DESC: "Projekta saites un uztur\u0113t\u0101ja info.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Ja tas pal\u012Bdz, {github} zvaigzne man noz\u012Bm\u0113 daudz.",
            DLG_TIPS_FACEBOOK: "Ien\u0101c uz {facebook} - tur dalos ar m\u0101kslu un dzeju.",
            DLG_TIPS_SITE: "Ja gribi redz\u0113t, ar ko nodarbojos t\u012Bmekl\u012B, {site} ir lab\u0101k\u0101 vieta, kur s\u0101kt.",
            DLG_TIPS_CREDITS: "\u012Apa\u0161s paldies {zbluebugz} par ori\u0123in\u0101lo projektu un {trinhquocviet} par vienk\u0101r\u0161oto UI zaru, no kura s\u0101kotn\u0113ji forkoju - un par filtru uztur\u0113\u0161anu taj\u0101 period\u0101.",
            DLG_TIPS_MAINTAINER_PREFIX: "No uztur\u0113t\u0101ja:",
            DLG_TIPS_MAINTAINER: "Ceru, ka \u0161is skripts pal\u012Bdz\u0113s atg\u016Bt savu pl\u016Bsmu. Es apsolu b\u016Bt tavs sabiedrotais c\u012B\u0146\u0101 pret to, ko nev\u0113lies redz\u0113t tie\u0161saist\u0113.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "mana Facebook lapa",
            DLG_TIPS_LINK_SITE: "mana vietne",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Saglab\u0101jiet", "Aizveriet", "Eksport\u0113t", "Import\u0113t", "Atiestat\u012Bt"],
            DLG_BUTTON_TOOLTIPS: [
              "Saglab\u0101 izmai\u0146as \u0161aj\u0101 p\u0101rl\u016Bk\u0101. Datu t\u012Br\u012B\u0161ana/priv\u0101tais re\u017E\u012Bms t\u0101s dz\u0113\u0161.",
              "Eksport\u0113 rezerves failu saglab\u0101\u0161anai un p\u0101rnesei starp ier\u012Bc\u0113m.",
              "Import\u0113 iestat\u012Bjumu failu atjauno\u0161anai vai p\u0101rnesei.",
              "Atiestata visus iestat\u012Bjumus uz noklus\u0113jumu."
            ],
            DLG_FB_COLOUR_HINT: "Atst\u0101jiet tuk\u0161u, lai izmantotu FB kr\u0101su sh\u0113mu"
          },
          // -- Nederlands (Netherlands)
          nl: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Gesponsord",
            NF_TABLIST_STORIES_REELS_ROOMS: 'Keuzelijst tabblad "Verhalen | Reels | Ruimtes"',
            NF_STORIES: "Verhalen",
            NF_TOP_CARDS_PAGES: "Topkaarten (voor Pagina's)",
            NF_META_AI: "Probeer Meta AI",
            NF_HIDE_VERIFIED_BADGE: "Geverifieerde badges verbergen",
            NF_FILTER_VERIFIED_BADGE: "Geverifieerde accounts filteren",
            NF_AI_SIDE_PANELS: "AI in zijpanelen",
            NF_SURVEY: "Vragenlijst",
            NF_PEOPLE_YOU_MAY_KNOW: "Mensen die je misschien kent",
            NF_PAID_PARTNERSHIP: "Betaald partnerschap",
            NF_SPONSORED_PAID: "Gesponsord \xB7 Betaald door ______",
            NF_SUGGESTIONS: "Suggesties / Aanbevelingen",
            NF_FOLLOW: "Volgen",
            NF_PARTICIPATE: "Deelnemen",
            NF_REELS_SHORT_VIDEOS: "Reels en korte video's",
            NF_SHORT_REEL_VIDEO: "Spoel/korte video",
            NF_EVENTS_YOU_MAY_LIKE: "Evenementen die je misschien leuk vindt",
            NF_ANIMATED_GIFS_POSTS: "Geanimeerde GIF's",
            NF_ANIMATED_GIFS_PAUSE: "Geanimeerde GIF's pauzeren",
            NF_SHARES: "# keer gedeeld",
            NF_LIKES_MAXIMUM: "Maximaal aantal likes",
            GF_PAID_PARTNERSHIP: "Betaald partnerschap",
            GF_SUGGESTIONS: "Suggesties / Aanbevelingen",
            GF_SHORT_REEL_VIDEO: "Spoel/korte video",
            GF_ANIMATED_GIFS_POSTS: "Geanimeerde GIF's",
            GF_ANIMATED_GIFS_PAUSE: "Geanimeerde GIF's pauzeren",
            GF_SHARES: "# keer gedeeld",
            VF_LIVE: "LIVE",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Dubbel video",
            VF_ANIMATED_GIFS_PAUSE: "Geanimeerde GIF's pauzeren",
            PP_ANIMATED_GIFS_POSTS: "Geanimeerde GIF's",
            PP_ANIMATED_GIFS_PAUSE: "Geanimeerde GIF's pauzeren",
            NF_BLOCKED_FEED: ["Nieuwsfeed", "Groepsfeed", "Videofeed"],
            GF_BLOCKED_FEED: ["Nieuwsfeed", "Groepsfeed", "Videofeed"],
            VF_BLOCKED_FEED: ["Nieuwsfeed", "Groepsfeed", "Videofeed"],
            MP_BLOCKED_FEED: ["Marktplaatsfeed"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Coronavirus (informatiebox)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Klimaatwetenschap (informatiebox)",
            OTHER_INFO_BOX_SUBSCRIBE: "Abonneren (informatievak)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Afspeel- en lusbediening.",
            REELS_CONTROLS: "Toon video bedieningselementen",
            REELS_DISABLE_LOOPING: "Herhalen uitschakelen",
            DLG_TITLE: "Schoon mijn feeds",
            DLG_NF: "Nieuwsfeed",
            DLG_NF_DESC: "Ruim suggesties op en bepaal hoe streng de feed is.",
            DLG_GF: "Groepsfeed",
            DLG_GF_DESC: "Maak groepsfeeds rustiger door extra\u2019s en ruis te verminderen.",
            DLG_VF: "Videofeed",
            DLG_VF_DESC: "Houd de videofeed overzichtelijk door herhaling en rommel te beperken.",
            DLG_MP: "Marktplaatsfeed",
            DLG_MP_DESC: "Filter aanbiedingen op prijs en trefwoorden.",
            DLG_PP: "Profiel / Pagina",
            DLG_PP_DESC: "Stel in wat er op profielen en pagina\u2019s verschijnt.",
            DLG_OTHER: "Aanvullende notities",
            DLG_OTHER_DESC: "Verberg extra vakken die je niet wilt.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Tekstfilter",
            DLG_BLOCK_NEW_LINE: "(Scheid woorden of zinnen met een regeleinde, reguliere expressies worden ondersteund)",
            NF_BLOCKED_ENABLED: "Ingeschakeld",
            GF_BLOCKED_ENABLED: "Ingeschakeld",
            VF_BLOCKED_ENABLED: "Ingeschakeld",
            MP_BLOCKED_ENABLED: "Ingeschakeld",
            PP_BLOCKED_ENABLED: "Ingeschakeld",
            NF_BLOCKED_RE: "Reguliere expressies (RegExp)",
            GF_BLOCKED_RE: "Reguliere expressies (RegExp)",
            VF_BLOCKED_RE: "Reguliere expressies (RegExp)",
            MP_BLOCKED_RE: "Reguliere expressies (RegExp)",
            PP_BLOCKED_RE: "Reguliere expressies (RegExp)",
            DLG_VERBOSITY: "Opties voor verborgen berichten",
            DLG_PREFERENCES: "Voorkeuren",
            DLG_PREFERENCES_DESC: "Labels, plaatsing, kleuren en taal.",
            DLG_REPORT_BUG: "Bug melden",
            DLG_REPORT_BUG_DESC: "Maak een diagnostisch rapport voor problemen.",
            DLG_REPORT_BUG_NOTICE: "Help ons het te repareren:\n1. Scroll zodat het problematische bericht zichtbaar is.\n2. Klik op 'Rapport maken' en vervolgens op 'Rapport kopi\xEBren'.\n3. Klik op 'Issues openen' en plak het rapport in een nieuwe issue.\n4. Voeg een korte beschrijving van het probleem toe.\n(We redigeren namen/tekst, maar controleer dit voordat je het deelt!)",
            DLG_REPORT_BUG_GENERATE: "Rapport maken",
            DLG_REPORT_BUG_COPY: "Rapport kopi\xEBren",
            DLG_REPORT_BUG_OPEN_ISSUES: "Issues openen",
            DLG_REPORT_BUG_STATUS_READY: "Rapport klaar.",
            DLG_REPORT_BUG_STATUS_COPIED: "Rapport gekopieerd naar klembord.",
            DLG_REPORT_BUG_STATUS_FAILED: "Kopi\xEBren mislukt. Kopieer handmatig.",
            DLG_VERBOSITY_CAPTION: "Toon een label als een artikel verborgen is",
            VERBOSITY_MESSAGE: [
              "geen label",
              "Post verborgen. Regel: ",
              " posts verborgen",
              "7 posts verborgen ~ (alleen in Groepen Feed)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Tekstkleur",
            VERBOSITY_MESSAGE_BG_COLOUR: "Achtergrondkleur",
            VERBOSITY_DEBUG: 'Highlight "verborgen" artikelen',
            CMF_CUSTOMISATIONS: "Personalisaties",
            CMF_BTN_LOCATION: "Locatie van de CMF-knop:",
            CMF_BTN_OPTION: [
              "linksonder",
              "rechtsboven",
              'uitgeschakeld (gebruik "Instellingen" in het menu Gebruikersscriptopdrachten)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Taal van Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "Nederlands",
            CMF_DIALOG_LANGUAGE_DEFAULT: "Site-taal gebruiken",
            GM_MENU_SETTINGS: "Instellingen",
            CMF_DIALOG_LOCATION: "Locatie van dit menu:",
            CMF_DIALOG_OPTION: ["linkerkant", "rechterkant"],
            CMF_BORDER_COLOUR: "Randkleur",
            DLG_TIPS: "Over",
            DLG_TIPS_DESC: "Projectlinks en info over de beheerder.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Als dit helpt, betekent een ster op {github} veel.",
            DLG_TIPS_FACEBOOK: "Zeg hallo op {facebook} - daar deel ik mijn kunst en po\xEBzie.",
            DLG_TIPS_SITE: "Als je wilt zien wat ik online doe, is {site} de beste plek om te beginnen.",
            DLG_TIPS_CREDITS: "Speciale dank aan {zbluebugz} voor het originele project, en aan {trinhquocviet} voor de vereenvoudigde UI-branch waar ik oorspronkelijk van heb geforkt - plus het filteronderhoud in die periode.",
            DLG_TIPS_MAINTAINER_PREFIX: "Van de maintainer:",
            DLG_TIPS_MAINTAINER: "Ik hoop dat dit script je helpt je feed terug te krijgen. Ik beloof je bondgenoot te zijn in de strijd tegen dingen die je online niet wilt zien.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "mijn Facebook-pagina",
            DLG_TIPS_LINK_SITE: "mijn website",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Opslaan", "Sluiten", "Exporteren", "Importeren", "Reset"],
            DLG_BUTTON_TOOLTIPS: [
              "Slaat wijzigingen op in deze browser. Gegevens wissen/priv\xE9 verwijdert ze.",
              "Exporteert een back-upbestand om te bewaren en te verplaatsen.",
              "Importeert een instellingenbestand om te herstellen of over te zetten.",
              "Herstelt alle instellingen naar standaard."
            ],
            DLG_FB_COLOUR_HINT: "Laat leeg om het kleurenschema van FB te gebruiken"
          },
          // -- Polski (Poland)
          pl: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Sponsorowane",
            NF_TABLIST_STORIES_REELS_ROOMS: 'Pole listy zak\u0142adki "Relacje | Reels | Pokoje"',
            NF_STORIES: "Relacje",
            NF_TOP_CARDS_PAGES: "G\xF3rne karty (dla stron)",
            NF_META_AI: "Wypr\xF3buj Meta AI",
            NF_HIDE_VERIFIED_BADGE: "Ukryj zweryfikowane odznaki",
            NF_FILTER_VERIFIED_BADGE: "Filtruj zweryfikowane konta",
            NF_AI_SIDE_PANELS: "AI w panelach bocznych",
            NF_SURVEY: "Badanie",
            NF_PEOPLE_YOU_MAY_KNOW: "Osoby, kt\xF3re mo\u017Cesz zna\u0107",
            NF_PAID_PARTNERSHIP: "Post sponsorowany",
            NF_SPONSORED_PAID: "Sponsorowane \xB7 Op\u0142acona przez ______",
            NF_SUGGESTIONS: "Sugestie / Zalecenia",
            NF_FOLLOW: "Obserwuj",
            NF_PARTICIPATE: "Uczestniczy\u0107",
            NF_REELS_SHORT_VIDEOS: "Rolki i kr\xF3tkie filmy",
            NF_SHORT_REEL_VIDEO: "Reel/kr\xF3tki film",
            NF_EVENTS_YOU_MAY_LIKE: "Wydarzenia, kt\xF3re mog\u0105 Ci si\u0119 spodoba\u0107",
            NF_ANIMATED_GIFS_POSTS: "Animowane GIF-y",
            NF_ANIMATED_GIFS_PAUSE: "Wstrzymaj animowane GIF-y",
            NF_SHARES: "# udost\u0119pnienia",
            NF_LIKES_MAXIMUM: 'Maksymalna ilo\u015B\u0107 "Lubi\u0119 to!"',
            GF_PAID_PARTNERSHIP: "Post sponsorowany",
            GF_SUGGESTIONS: "Sugestie / Zalecenia",
            GF_SHORT_REEL_VIDEO: "Reel/kr\xF3tki film",
            GF_ANIMATED_GIFS_POSTS: "Animowane GIF-y",
            GF_ANIMATED_GIFS_PAUSE: "Wstrzymaj animowane GIF-y",
            GF_SHARES: "# udost\u0119pnienia",
            VF_LIVE: "NA \u017BYWO",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Duplikat wideo",
            VF_ANIMATED_GIFS_PAUSE: "Wstrzymaj animowane GIF-y",
            PP_ANIMATED_GIFS_POSTS: "Animowane GIF-y",
            PP_ANIMATED_GIFS_PAUSE: "Wstrzymaj animowane GIF-y",
            NF_BLOCKED_FEED: ["Kana\u0142 aktualno\u015Bci", "Kana\u0142 grup", "Kana\u0142 wideo"],
            GF_BLOCKED_FEED: ["Kana\u0142 aktualno\u015Bci", "Kana\u0142 grup", "Kana\u0142 wideo"],
            VF_BLOCKED_FEED: ["Kana\u0142 aktualno\u015Bci", "Kana\u0142 grup", "Kana\u0142 wideo"],
            MP_BLOCKED_FEED: ["Kana\u0142 Marketplace"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Koronawirus (skrzynka informacyjna)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Nauka o klimacie (skrzynka informacyjna)",
            OTHER_INFO_BOX_SUBSCRIBE: "Subskrybuj (pole informacyjne)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Sterowanie odtwarzaniem i p\u0119tl\u0105.",
            REELS_CONTROLS: "Poka\u017C sterowanie wideo",
            REELS_DISABLE_LOOPING: "Wy\u0142\u0105cz p\u0119tl\u0119",
            DLG_TITLE: "Wyczy\u015B\u0107 moje kana\u0142y",
            DLG_NF: "Kana\u0142 aktualno\u015Bci",
            DLG_NF_DESC: "Uporz\u0105dkuj sugestie i ustaw, jak restrykcyjny ma by\u0107 kana\u0142.",
            DLG_GF: "Kana\u0142 grup",
            DLG_GF_DESC: "Uporz\u0105dkuj kana\u0142y grup, ograniczaj\u0105c dodatki i szum.",
            DLG_VF: "Kana\u0142 wideo",
            DLG_VF_DESC: "Utrzymaj przejrzysty kana\u0142 wideo, ograniczaj\u0105c powt\xF3rki i ba\u0142agan.",
            DLG_MP: "Kana\u0142 Marketplace",
            DLG_MP_DESC: "Filtruj oferty wed\u0142ug ceny i s\u0142\xF3w kluczowych.",
            DLG_PP: "Profil / Strona",
            DLG_PP_DESC: "Dostosuj, co pojawia si\u0119 na profilach i stronach.",
            DLG_OTHER: "Dodatkowe notatki",
            DLG_OTHER_DESC: "Ukryj dodatkowe pola, kt\xF3rych nie chcesz.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Filtr tekstu",
            DLG_BLOCK_NEW_LINE: "(Oddziel s\u0142owa lub frazy za pomoc\u0105 znaku nowej linii, wyra\u017Cenia regularne s\u0105 obs\u0142ugiwane)",
            NF_BLOCKED_ENABLED: "W\u0142\u0105czone",
            GF_BLOCKED_ENABLED: "W\u0142\u0105czone",
            VF_BLOCKED_ENABLED: "W\u0142\u0105czone",
            MP_BLOCKED_ENABLED: "W\u0142\u0105czone",
            PP_BLOCKED_ENABLED: "W\u0142\u0105czone",
            NF_BLOCKED_RE: "Wyra\u017Cenia regularne (RegExp)",
            GF_BLOCKED_RE: "Wyra\u017Cenia regularne (RegExp)",
            VF_BLOCKED_RE: "Wyra\u017Cenia regularne (RegExp)",
            MP_BLOCKED_RE: "Wyra\u017Cenia regularne (RegExp)",
            PP_BLOCKED_RE: "Wyra\u017Cenia regularne (RegExp)",
            DLG_VERBOSITY: "Opcje dla ukrytych post\xF3w",
            DLG_PREFERENCES: "Preferencje",
            DLG_PREFERENCES_DESC: "Etykiety, po\u0142o\u017Cenie, kolory i j\u0119zyk.",
            DLG_REPORT_BUG: "Zg\u0142o\u015B b\u0142\u0105d",
            DLG_REPORT_BUG_DESC: "Utw\xF3rz raport diagnostyczny.",
            DLG_REPORT_BUG_NOTICE: "Pom\xF3\u017C nam to naprawi\u0107:\n1. Przewi\u0144, aby dany post by\u0142 widoczny.\n2. Kliknij \u201EGeneruj raport\u201D, a nast\u0119pnie \u201EKopiuj raport\u201D.\n3. Kliknij \u201EOtw\xF3rz zg\u0142oszenia\u201D i wklej raport do nowego zg\u0142oszenia.\n4. Dodaj kr\xF3tki opis problemu.\n(Ukrywamy nazwiska/tekst, ale sprawd\u017A przed udost\u0119pnieniem!)",
            DLG_REPORT_BUG_GENERATE: "Utw\xF3rz raport",
            DLG_REPORT_BUG_COPY: "Kopiuj raport",
            DLG_REPORT_BUG_OPEN_ISSUES: "Otw\xF3rz zg\u0142oszenia",
            DLG_REPORT_BUG_STATUS_READY: "Raport gotowy.",
            DLG_REPORT_BUG_STATUS_COPIED: "Raport skopiowany do schowka.",
            DLG_REPORT_BUG_STATUS_FAILED: "Nie uda\u0142o si\u0119 skopiowa\u0107. Skopiuj r\u0119cznie.",
            DLG_VERBOSITY_CAPTION: "Poka\u017C etykiet\u0119, je\u015Bli artyku\u0142 jest ukryty",
            VERBOSITY_MESSAGE: [
              "brak etykiety",
              "Ukryto 1 post. Regu\u0142a: ",
              " posty ukryte",
              "7 posty ukryte ~ (tylko w Kana\u0142ach Grup)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Kolor tekstu",
            VERBOSITY_MESSAGE_BG_COLOUR: "Kolor t\u0142a",
            VERBOSITY_DEBUG: "Wyr\xF3\u017Cnij \u201Eukryte\u201D posty",
            CMF_CUSTOMISATIONS: "Personalizacja",
            CMF_BTN_LOCATION: "Lokalizacja przycisku CMF:",
            CMF_BTN_OPTION: [
              "lewy dolny r\xF3g",
              "prawy g\xF3rny r\xF3g",
              'wy\u0142\u0105czone (u\u017Cyj "Ustawienia" w menu Polecenia skryptu u\u017Cytkownika)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "J\u0119zyk Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "Polski",
            CMF_DIALOG_LANGUAGE_DEFAULT: "U\u017Cyj j\u0119zyka witryny",
            GM_MENU_SETTINGS: "Ustawienia",
            CMF_DIALOG_LOCATION: "Lokalizacja tego menu:",
            CMF_DIALOG_OPTION: ["lewa strona", "prawa strona"],
            CMF_BORDER_COLOUR: "Kolor obramowania",
            DLG_TIPS: "O projekcie",
            DLG_TIPS_DESC: "Linki do projektu i informacje o opiekunie.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Je\u015Bli to pomaga, gwiazdka na {github} wiele dla mnie znaczy.",
            DLG_TIPS_FACEBOOK: "Wpadnij na {facebook} - dziel\u0119 si\u0119 tam sztuk\u0105 i poezj\u0105.",
            DLG_TIPS_SITE: "Je\u015Bli chcesz zobaczy\u0107, co robi\u0119 w sieci, {site} to najlepszy start.",
            DLG_TIPS_CREDITS: "Specjalne podzi\u0119kowania dla {zbluebugz} za oryginalny projekt oraz dla {trinhquocviet} za uproszczon\u0105 ga\u0142\u0105\u017A UI, z kt\xF3rej pierwotnie zrobi\u0142em fork - i za utrzymanie filtr\xF3w w tym czasie.",
            DLG_TIPS_MAINTAINER_PREFIX: "Od opiekuna:",
            DLG_TIPS_MAINTAINER: "Mam nadziej\u0119, \u017Ce ten skrypt pomo\u017Ce ci odzyska\u0107 feed. Obiecuj\u0119 by\u0107 twoim sojusznikiem w walce z tym, czego nie chcesz widzie\u0107 online.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "moja strona na Facebooku",
            DLG_TIPS_LINK_SITE: "moja strona",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Zapisz", "Zamknij", "Eksport", "Import", "Przesk\u0142ada\u0107"],
            DLG_BUTTON_TOOLTIPS: [
              "Zapisuje zmiany w tej przegl\u0105darce. Czyszczenie danych/tryb prywatny usuwa je.",
              "Eksportuje plik kopii zapasowej do zachowania i przenoszenia.",
              "Importuje plik ustawie\u0144 do przywr\xF3cenia lub przeniesienia.",
              "Resetuje wszystkie ustawienia do domy\u015Blnych."
            ],
            DLG_FB_COLOUR_HINT: "Pozostaw puste, aby u\u017Cy\u0107 schematu kolor\xF3w FB"
          },
          // -- Português (Portugal and Brazil)
          pt: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Patrocinado",
            NF_TABLIST_STORIES_REELS_ROOMS: 'Caixa de listagem da guia "Stories | V\xEDdeos do Reels | Salas"',
            NF_STORIES: "Stories",
            NF_TOP_CARDS_PAGES: "Cart\xF5es principais (para P\xE1ginas)",
            NF_META_AI: "Experimente o Meta AI",
            NF_HIDE_VERIFIED_BADGE: "Ocultar selos verificados",
            NF_FILTER_VERIFIED_BADGE: "Filtrar contas verificadas",
            NF_AI_SIDE_PANELS: "IA nos pain\xE9is laterais",
            NF_SURVEY: "Enquete",
            NF_PEOPLE_YOU_MAY_KNOW: "Pessoas que talvez conhe\xE7as",
            NF_PAID_PARTNERSHIP: "Parceria paga",
            NF_SPONSORED_PAID: "Patrocinado \xB7 Financiado por ______",
            NF_SUGGESTIONS: "Sugest\xF5es / Recomenda\xE7\xF5es",
            NF_FOLLOW: "Seguir",
            NF_PARTICIPATE: "Participar",
            NF_REELS_SHORT_VIDEOS: "V\xEDdeos do Reels e v\xEDdeos de curta dura\xE7\xE3o",
            NF_SHORT_REEL_VIDEO: "Rolo/v\xEDdeo curto",
            NF_EVENTS_YOU_MAY_LIKE: "Eventos que voc\xEA pode gostar",
            NF_ANIMATED_GIFS_POSTS: "GIFs animados",
            NF_ANIMATED_GIFS_PAUSE: "Pausar GIFs animados",
            NF_SHARES: "# partilhas",
            NF_LIKES_MAXIMUM: "N\xFAmero m\xE1ximo de curtidas",
            GF_PAID_PARTNERSHIP: "Parceria paga",
            GF_SUGGESTIONS: "Sugest\xF5es / Recomenda\xE7\xF5es",
            GF_SHORT_REEL_VIDEO: "Rolo/v\xEDdeo curto",
            GF_ANIMATED_GIFS_POSTS: "GIFs animados",
            GF_ANIMATED_GIFS_PAUSE: "Pausar GIFs animados",
            GF_SHARES: "# partilhas",
            VF_LIVE: "DIRETO",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "V\xEDdeo duplicado",
            VF_ANIMATED_GIFS_PAUSE: "Pausar GIFs animados",
            PP_ANIMATED_GIFS_POSTS: "GIFs animados",
            PP_ANIMATED_GIFS_PAUSE: "Pausar GIFs animados",
            NF_BLOCKED_FEED: ["Feed de not\xEDcias", "Feed de grupos", "Feed de v\xEDdeos"],
            GF_BLOCKED_FEED: ["Feed de not\xEDcias", "Feed de grupos", "Feed de v\xEDdeos"],
            VF_BLOCKED_FEED: ["Feed de not\xEDcias", "Feed de grupos", "Feed de v\xEDdeos"],
            MP_BLOCKED_FEED: ["Feed de mercado"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Coronav\xEDrus (caixa de informa\xE7\xF5es)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Ci\xEAncia do Clima (caixa de informa\xE7\xF5es)",
            OTHER_INFO_BOX_SUBSCRIBE: "Assine (caixa de informa\xE7\xF5es)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Controles de reprodu\xE7\xE3o e loop.",
            REELS_CONTROLS: "Mostrar controles do v\xEDdeo",
            REELS_DISABLE_LOOPING: "Desativar repeti\xE7\xE3o",
            DLG_TITLE: "Limpe meus feeds",
            DLG_NF: "Feed de not\xEDcias",
            DLG_NF_DESC: "Limpe sugest\xF5es e defina o qu\xE3o r\xEDgido \xE9 o feed.",
            DLG_GF: "Feed de grupos",
            DLG_GF_DESC: "Organize os feeds de grupos reduzindo extras e ru\xEDdo.",
            DLG_VF: "Feed de v\xEDdeos",
            DLG_VF_DESC: "Mantenha o feed de v\xEDdeos focado reduzindo repeti\xE7\xF5es e bagun\xE7a.",
            DLG_MP: "Feed de mercado",
            DLG_MP_DESC: "Filtre an\xFAncios por pre\xE7o e palavras-chave.",
            DLG_PP: "Perfil / P\xE1gina",
            DLG_PP_DESC: "Ajuste o que aparece em perfis e p\xE1ginas.",
            DLG_OTHER: "Notas suplementares",
            DLG_OTHER_DESC: "Oculte caixas extras que voc\xEA n\xE3o quer.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Filtro de texto",
            DLG_BLOCK_NEW_LINE: "(Separe palavras ou frases com uma quebra de linha, express\xF5es regulares s\xE3o suportadas)",
            NF_BLOCKED_ENABLED: "Habilidoso",
            GF_BLOCKED_ENABLED: "Habilidoso",
            VF_BLOCKED_ENABLED: "Habilidoso",
            MP_BLOCKED_ENABLED: "Habilidoso",
            PP_BLOCKED_ENABLED: "Habilidoso",
            NF_BLOCKED_RE: "Express\xF5es regulares (RegExp)",
            GF_BLOCKED_RE: "Express\xF5es regulares (RegExp)",
            VF_BLOCKED_RE: "Express\xF5es regulares (RegExp)",
            MP_BLOCKED_RE: "Express\xF5es regulares (RegExp)",
            PP_BLOCKED_RE: "Express\xF5es regulares (RegExp)",
            DLG_VERBOSITY: "Op\xE7\xF5es para postagens ocultas",
            DLG_PREFERENCES: "Prefer\xEAncias",
            DLG_PREFERENCES_DESC: "R\xF3tulos, posi\xE7\xE3o, cores e idioma.",
            DLG_REPORT_BUG: "Reportar bug",
            DLG_REPORT_BUG_DESC: "Gere um relat\xF3rio de diagn\xF3stico.",
            DLG_REPORT_BUG_NOTICE: "Ajude-nos a corrigir:\n1. Role para que a postagem problem\xE1tica fique vis\xEDvel.\n2. Clique em 'Gerar relat\xF3rio' e depois em 'Copiar relat\xF3rio'.\n3. Clique em 'Abrir issues' e cole o relat\xF3rio em uma nova issue.\n4. Adicione uma breve descri\xE7\xE3o do problema.\n(Ocultamos nomes/texto, mas revise antes de compartilhar!)",
            DLG_REPORT_BUG_GENERATE: "Gerar relat\xF3rio",
            DLG_REPORT_BUG_COPY: "Copiar relat\xF3rio",
            DLG_REPORT_BUG_OPEN_ISSUES: "Abrir issues",
            DLG_REPORT_BUG_STATUS_READY: "Relat\xF3rio pronto.",
            DLG_REPORT_BUG_STATUS_COPIED: "Relat\xF3rio copiado para a \xE1rea de transfer\xEAncia.",
            DLG_REPORT_BUG_STATUS_FAILED: "Falha ao copiar. Copie manualmente.",
            DLG_VERBOSITY_CAPTION: "Mostrar um r\xF3tulo se uma postagem estiver oculta",
            VERBOSITY_MESSAGE: [
              "sem r\xF3tulo",
              "Postagem oculta. Regra: ",
              " postagens ocultas",
              "7 postagens ocultas ~ (apenas no Feed de Grupos)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Cor do texto",
            VERBOSITY_MESSAGE_BG_COLOUR: "Cor de fundo",
            VERBOSITY_DEBUG: 'Destacar postagens "ocultas"',
            CMF_CUSTOMISATIONS: "Personaliza\xE7\xF5es",
            CMF_BTN_LOCATION: "Localiza\xE7\xE3o do bot\xE3o CMF:",
            CMF_BTN_OPTION: [
              "inferior esquerdo",
              "superior direito",
              'desativado (use "Configura\xE7\xF5es" no menu Comandos de script do usu\xE1rio)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Idioma do Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "Portugu\xEAs",
            CMF_DIALOG_LANGUAGE_DEFAULT: "Usar idioma do site",
            GM_MENU_SETTINGS: "Configura\xE7\xF5es",
            CMF_DIALOG_LOCATION: "Localiza\xE7\xE3o deste menu:",
            CMF_DIALOG_OPTION: ["lado esquerdo", "lado direito"],
            CMF_BORDER_COLOUR: "Cor da borda",
            DLG_TIPS: "Sobre",
            DLG_TIPS_DESC: "Links do projeto e info do mantenedor.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Se isso ajudar, uma estrela no {github} significa muito.",
            DLG_TIPS_FACEBOOK: "Diga oi na {facebook} - l\xE1 compartilho minha arte e poesia.",
            DLG_TIPS_SITE: "Se quiser ver o que ando fazendo pela web, {site} \xE9 o melhor lugar para come\xE7ar.",
            DLG_TIPS_CREDITS: "Agradecimento especial a {zbluebugz} pelo projeto original e a {trinhquocviet} pelo branch de UI simplificada de onde eu inicialmente fiz o fork - al\xE9m da manuten\xE7\xE3o dos filtros naquele per\xEDodo.",
            DLG_TIPS_MAINTAINER_PREFIX: "Do mantenedor:",
            DLG_TIPS_MAINTAINER: "Espero que este script ajude voc\xEA a recuperar o seu feed. Prometo ser seu aliado na luta contra o que voc\xEA n\xE3o quer ver online.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "minha p\xE1gina do Facebook",
            DLG_TIPS_LINK_SITE: "meu site",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Salvar", "Fechar", "Exportar", "Importar", "Redefinir"],
            DLG_BUTTON_TOOLTIPS: [
              "Salva mudan\xE7as neste navegador. Limpar dados/modo privado remove.",
              "Exporta um arquivo de backup para manter e mover entre dispositivos.",
              "Importa um arquivo de configura\xE7\xF5es para restaurar ou transferir.",
              "Redefine todas as configura\xE7\xF5es para o padr\xE3o."
            ],
            DLG_FB_COLOUR_HINT: "Deixe em branco para usar o esquema de cores do FB"
          },
          // -- Русский (Russia)
          ru: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "\u0420\u0435\u043A\u043B\u0430\u043C\u0430",
            NF_TABLIST_STORIES_REELS_ROOMS: '\u0421\u043F\u0438\u0441\u043E\u043A \u0432\u043A\u043B\u0430\u0434\u043E\u043A "\u0418\u0441\u0442\u043E\u0440\u0438\u0438 | Reels | \u041A\u043E\u043C\u043D\u0430\u0442\u044B"',
            NF_STORIES: "\u0418\u0441\u0442\u043E\u0440\u0438\u0438",
            NF_TOP_CARDS_PAGES: "\u0412\u0435\u0440\u0445\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 (\u0434\u043B\u044F \u0421\u0442\u0440\u0430\u043D\u0438\u0446)",
            NF_META_AI: "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 Meta AI",
            NF_HIDE_VERIFIED_BADGE: "\u0421\u043A\u0440\u044B\u0442\u044C \u0437\u043D\u0430\u0447\u043A\u0438 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
            NF_FILTER_VERIFIED_BADGE: "\u0424\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u043D\u044B\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u044B",
            NF_AI_SIDE_PANELS: "\u0418\u0418 \u0432 \u0431\u043E\u043A\u043E\u0432\u044B\u0445 \u043F\u0430\u043D\u0435\u043B\u044F\u0445",
            NF_SURVEY: "\u041E\u043F\u0440\u043E\u0441",
            NF_PEOPLE_YOU_MAY_KNOW: "\u041B\u044E\u0434\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u0432\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0437\u043D\u0430\u0442\u044C",
            NF_PAID_PARTNERSHIP: "\u041F\u043B\u0430\u0442\u043D\u043E\u0435 \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u0442\u0432\u043E",
            NF_SPONSORED_PAID: "\u0420\u0435\u043A\u043B\u0430\u043C\u0430 \xB7 \u041E\u043F\u043B\u0430\u0447\u0435\u043D\u043E ______",
            NF_SUGGESTIONS: "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F / \u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438",
            NF_FOLLOW: "\u041F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F",
            NF_PARTICIPATE: "\u0423\u0447\u0430\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C",
            NF_REELS_SHORT_VIDEOS: "Reels \u0438 \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0435 \u0432\u0438\u0434\u0435\u043E",
            NF_SHORT_REEL_VIDEO: "Reels/\u043A\u043E\u0440\u043E\u0442\u043A\u043E\u0435 \u0432\u0438\u0434\u0435\u043E",
            NF_EVENTS_YOU_MAY_LIKE: "\u041C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u044F, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0432\u0430\u043C \u043C\u043E\u0433\u0443\u0442 \u043F\u043E\u043D\u0440\u0430\u0432\u0438\u0442\u044C\u0441\u044F",
            NF_ANIMATED_GIFS_POSTS: "\u0410\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 GIF-\u0444\u0430\u0439\u043B\u044B",
            NF_ANIMATED_GIFS_PAUSE: "\u041F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0430\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 GIF",
            NF_SHARES: "# \u043F\u043E\u0434\u0435\u043B\u0438\u043B\u0438\u0441\u044C",
            NF_LIKES_MAXIMUM: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \xAB\u041D\u0440\u0430\u0432\u0438\u0442\u0441\u044F\xBB",
            GF_PAID_PARTNERSHIP: "\u041F\u043B\u0430\u0442\u043D\u043E\u0435 \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u0442\u0432\u043E",
            GF_SUGGESTIONS: "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F / \u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438",
            GF_SHORT_REEL_VIDEO: "Reel/\u043A\u043E\u0440\u043E\u0442\u043A\u043E\u0435 \u0432\u0438\u0434\u0435\u043E",
            GF_ANIMATED_GIFS_POSTS: "\u0410\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 GIF-\u0444\u0430\u0439\u043B\u044B",
            GF_ANIMATED_GIFS_PAUSE: "\u041F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0430\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 GIF",
            GF_SHARES: "# \u043F\u043E\u0434\u0435\u043B\u0438\u043B\u0438\u0441\u044C",
            VF_LIVE: "\u0412 \u042D\u0424\u0418\u0420\u0415",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "\u0414\u0443\u0431\u043B\u0438\u043A\u0430\u0442 \u0432\u0438\u0434\u0435\u043E",
            VF_ANIMATED_GIFS_PAUSE: "\u041F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0430\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 GIF",
            PP_ANIMATED_GIFS_POSTS: "\u0410\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 GIF-\u0444\u0430\u0439\u043B\u044B",
            PP_ANIMATED_GIFS_PAUSE: "\u041F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0430\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 GIF",
            NF_BLOCKED_FEED: ["\u041B\u0435\u043D\u0442\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0435\u0439", "\u041B\u0435\u043D\u0442\u0430 \u0433\u0440\u0443\u043F\u043F", "\u041B\u0435\u043D\u0442\u0430 \u0432\u0438\u0434\u0435\u043E"],
            GF_BLOCKED_FEED: ["\u041B\u0435\u043D\u0442\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0435\u0439", "\u041B\u0435\u043D\u0442\u0430 \u0433\u0440\u0443\u043F\u043F", "\u041B\u0435\u043D\u0442\u0430 \u0432\u0438\u0434\u0435\u043E"],
            VF_BLOCKED_FEED: ["\u041B\u0435\u043D\u0442\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0435\u0439", "\u041B\u0435\u043D\u0442\u0430 \u0433\u0440\u0443\u043F\u043F", "\u041B\u0435\u043D\u0442\u0430 \u0432\u0438\u0434\u0435\u043E"],
            MP_BLOCKED_FEED: ["\u041B\u0435\u043D\u0442\u0430 Marketplace"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "\u041A\u043E\u0440\u043E\u043D\u0430\u0432\u0438\u0440\u0443\u0441 (\u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u043E\u043D\u043D\u043E\u0435 \u043E\u043A\u043D\u043E)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "\u041D\u0430\u0443\u043A\u0430 \u043E \u043A\u043B\u0438\u043C\u0430\u0442\u0435 (\u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u043E\u043D\u043D\u043E\u0435 \u043E\u043A\u043D\u043E)",
            OTHER_INFO_BOX_SUBSCRIBE: "\u041F\u043E\u0434\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F (\u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u043E\u043D\u043D\u043E\u0435 \u043E\u043A\u043D\u043E)",
            REELS_TITLE: "\u0412\u0438\u0434\u0435\u043E Reels",
            DLG_REELS_DESC: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C \u0438 \u0446\u0438\u043A\u043B\u043E\u043C.",
            REELS_CONTROLS: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0432\u0438\u0434\u0435\u043E",
            REELS_DISABLE_LOOPING: "\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435",
            DLG_TITLE: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u043C\u043E\u0438 \u043D\u043E\u0432\u043E\u0441\u0442\u043D\u044B\u0435 \u043B\u0435\u043D\u0442\u044B",
            DLG_NF: "\u041B\u0435\u043D\u0442\u0430 \u043D\u043E\u0432\u043E\u0441\u0442\u0435\u0439",
            DLG_NF_DESC: "\u0423\u0431\u0435\u0440\u0438\u0442\u0435 \u043B\u0438\u0448\u043D\u0438\u0435 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u0438 \u0437\u0430\u0434\u0430\u0439\u0442\u0435 \u0441\u0442\u0440\u043E\u0433\u043E\u0441\u0442\u044C \u043B\u0435\u043D\u0442\u044B.",
            DLG_GF: "\u041B\u0435\u043D\u0442\u0430 \u0433\u0440\u0443\u043F\u043F",
            DLG_GF_DESC: "\u041F\u0440\u0438\u0432\u0435\u0434\u0438\u0442\u0435 \u043B\u0435\u043D\u0442\u044B \u0433\u0440\u0443\u043F\u043F \u0432 \u043F\u043E\u0440\u044F\u0434\u043E\u043A, \u0443\u0431\u0440\u0430\u0432 \u043B\u0438\u0448\u043D\u0435\u0435 \u0438 \u0448\u0443\u043C.",
            DLG_VF: "\u041B\u0435\u043D\u0442\u0430 \u0432\u0438\u0434\u0435\u043E",
            DLG_VF_DESC: "\u0421\u0434\u0435\u043B\u0430\u0439\u0442\u0435 \u043B\u0435\u043D\u0442\u0443 \u0432\u0438\u0434\u0435\u043E \u0447\u0438\u0449\u0435, \u0443\u043C\u0435\u043D\u044C\u0448\u0430\u044F \u043F\u043E\u0432\u0442\u043E\u0440\u044B \u0438 \u0448\u0443\u043C.",
            DLG_MP: "\u041B\u0435\u043D\u0442\u0430 Marketplace",
            DLG_MP_DESC: "\u0424\u0438\u043B\u044C\u0442\u0440\u0443\u0439\u0442\u0435 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u043E \u0446\u0435\u043D\u0435 \u0438 \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u043C \u0441\u043B\u043E\u0432\u0430\u043C.",
            DLG_PP: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C / \u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430",
            DLG_PP_DESC: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435, \u0447\u0442\u043E \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0432 \u043F\u0440\u043E\u0444\u0438\u043B\u044F\u0445 \u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430\u0445.",
            DLG_OTHER: "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438",
            DLG_OTHER_DESC: "\u0421\u043A\u0440\u043E\u0439\u0442\u0435 \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0431\u043B\u043E\u043A\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0432\u0430\u043C \u043D\u0435 \u043D\u0443\u0436\u043D\u044B.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "\u0422\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u0444\u0438\u043B\u044C\u0442\u0440",
            DLG_BLOCK_NEW_LINE: "(\u0420\u0430\u0437\u0434\u0435\u043B\u044F\u0439\u0442\u0435 \u0441\u043B\u043E\u0432\u0430 \u0438\u043B\u0438 \u0444\u0440\u0430\u0437\u044B \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E \u0440\u0430\u0437\u0440\u044B\u0432\u0430 \u0441\u0442\u0440\u043E\u043A\u0438, \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u044F)",
            NF_BLOCKED_ENABLED: "\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E",
            GF_BLOCKED_ENABLED: "\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E",
            VF_BLOCKED_ENABLED: "\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E",
            MP_BLOCKED_ENABLED: "\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E",
            PP_BLOCKED_ENABLED: "\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E",
            NF_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u044F (RegExp)",
            GF_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u044F (RegExp)",
            VF_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u044F (RegExp)",
            MP_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u044F (RegExp)",
            PP_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0432\u044B\u0440\u0430\u0436\u0435\u043D\u0438\u044F (RegExp)",
            DLG_VERBOSITY: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u043A\u0440\u044B\u0442\u044B\u0445 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0439",
            DLG_PREFERENCES: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
            DLG_PREFERENCES_DESC: "\u041C\u0435\u0442\u043A\u0438, \u0440\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435, \u0446\u0432\u0435\u0442\u0430 \u0438 \u044F\u0437\u044B\u043A.",
            DLG_REPORT_BUG: "\u0421\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435",
            DLG_REPORT_BUG_DESC: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0434\u0438\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043E\u0442\u0447\u0451\u0442.",
            DLG_REPORT_BUG_NOTICE: "\u041F\u043E\u043C\u043E\u0433\u0438\u0442\u0435 \u043D\u0430\u043C \u0438\u0441\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u044D\u0442\u043E:\n1. \u041F\u0440\u043E\u043A\u0440\u0443\u0442\u0438\u0442\u0435 \u0442\u0430\u043A, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u043D\u044B\u0439 \u043F\u043E\u0441\u0442 \u0431\u044B\u043B \u0432\u0438\u0434\u0435\u043D.\n2. \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043E\u0442\u0447\u0451\u0442\xBB, \u0437\u0430\u0442\u0435\u043C \xAB\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043E\u0442\u0447\u0451\u0442\xBB.\n3. \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0438\xBB \u0438 \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043E\u0442\u0447\u0451\u0442 \u0432 \u043D\u043E\u0432\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443.\n4. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043A\u0440\u0430\u0442\u043A\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u044B.\n(\u041C\u044B \u0441\u043A\u0440\u044B\u0432\u0430\u0435\u043C \u0438\u043C\u0435\u043D\u0430/\u0442\u0435\u043A\u0441\u0442, \u043D\u043E \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u0435\u0440\u0435\u0434 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u043E\u0439!)",
            DLG_REPORT_BUG_GENERATE: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043E\u0442\u0447\u0451\u0442",
            DLG_REPORT_BUG_COPY: "\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043E\u0442\u0447\u0451\u0442",
            DLG_REPORT_BUG_OPEN_ISSUES: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0438",
            DLG_REPORT_BUG_STATUS_READY: "\u041E\u0442\u0447\u0451\u0442 \u0433\u043E\u0442\u043E\u0432.",
            DLG_REPORT_BUG_STATUS_COPIED: "\u041E\u0442\u0447\u0451\u0442 \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D \u0432 \u0431\u0443\u0444\u0435\u0440.",
            DLG_REPORT_BUG_STATUS_FAILED: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C. \u0421\u043A\u043E\u043F\u0438\u0440\u0443\u0439\u0442\u0435 \u0432\u0440\u0443\u0447\u043D\u0443\u044E.",
            DLG_VERBOSITY_CAPTION: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u044F\u0440\u043B\u044B\u043A, \u0435\u0441\u043B\u0438 \u0437\u0430\u043F\u0438\u0441\u044C \u0441\u043A\u0440\u044B\u0442\u0430",
            VERBOSITY_MESSAGE: [
              "\u043D\u0435\u0442 \u044F\u0440\u043B\u044B\u043A\u0430",
              "\u041F\u043E\u0441\u0442 \u0441\u043A\u0440\u044B\u0442. \u041F\u0440\u0430\u0432\u0438\u043B\u043E: ",
              " \u043F\u043E\u0441\u0442\u043E\u0432 \u0441\u043A\u0440\u044B\u0442\u043E",
              "7 \u043F\u043E\u0441\u0442\u043E\u0432 \u0441\u043A\u0440\u044B\u0442\u043E ~ (\u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u041B\u0435\u043D\u0442\u0435 \u0413\u0440\u0443\u043F\u043F)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "\u0426\u0432\u0435\u0442 \u0442\u0435\u043A\u0441\u0442\u0430",
            VERBOSITY_MESSAGE_BG_COLOUR: "\u0426\u0432\u0435\u0442 \u0444\u043E\u043D\u0430",
            VERBOSITY_DEBUG: "\u0412\u044B\u0434\u0435\u043B\u0438\u0442\u044C \xAB\u0441\u043A\u0440\u044B\u0442\u044B\u0435\xBB \u043F\u043E\u0441\u0442\u044B",
            CMF_CUSTOMISATIONS: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
            CMF_BTN_LOCATION: "\u0420\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043A\u043D\u043E\u043F\u043A\u0438 CMF:",
            CMF_BTN_OPTION: [
              "\u0432\u043D\u0438\u0437\u0443 \u0441\u043B\u0435\u0432\u0430",
              "\u0432\u0432\u0435\u0440\u0445\u0443 \u0441\u043F\u0440\u0430\u0432\u0430",
              "\u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E (\u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \xAB\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438\xBB \u0432 \u043C\u0435\u043D\u044E \xAB\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0441\u043A\u0440\u0438\u043F\u0442\u0430\xBB)"
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "\u042F\u0437\u044B\u043A Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
            CMF_DIALOG_LANGUAGE_DEFAULT: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u044F\u0437\u044B\u043A \u0441\u0430\u0439\u0442\u0430",
            GM_MENU_SETTINGS: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
            CMF_DIALOG_LOCATION: "\u0420\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u044D\u0442\u043E\u0433\u043E \u043C\u0435\u043D\u044E:",
            CMF_DIALOG_OPTION: ["\u043B\u0435\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430", "\u043F\u0440\u0430\u0432\u0430\u044F \u0441\u0442\u043E\u0440\u043E\u043D\u0430"],
            CMF_BORDER_COLOUR: "\u0426\u0432\u0435\u0442 \u0433\u0440\u0430\u043D\u0438\u0446\u044B",
            DLG_TIPS: "\u041E \u043F\u0440\u043E\u0435\u043A\u0442\u0435",
            DLG_TIPS_DESC: "\u0421\u0441\u044B\u043B\u043A\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0438 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0441\u043E\u043F\u0440\u043E\u0432\u043E\u0436\u0434\u0430\u044E\u0449\u0435\u043C.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "\u0415\u0441\u043B\u0438 \u044D\u0442\u043E \u043F\u043E\u043C\u043E\u0433\u0430\u0435\u0442, \u0437\u0432\u0435\u0437\u0434\u0430 \u043D\u0430 {github} \u043E\u0447\u0435\u043D\u044C \u043C\u043D\u043E\u0433\u043E\u0435 \u0434\u043B\u044F \u043C\u0435\u043D\u044F \u0437\u043D\u0430\u0447\u0438\u0442.",
            DLG_TIPS_FACEBOOK: "\u0417\u0430\u0433\u043B\u044F\u043D\u0438\u0442\u0435 \u043D\u0430 {facebook} - \u0442\u0430\u043C \u044F \u0434\u0435\u043B\u044E\u0441\u044C \u0438\u0441\u043A\u0443\u0441\u0441\u0442\u0432\u043E\u043C \u0438 \u043F\u043E\u044D\u0437\u0438\u0435\u0439.",
            DLG_TIPS_SITE: "\u0415\u0441\u043B\u0438 \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0432\u0438\u0434\u0435\u0442\u044C, \u0447\u0435\u043C \u044F \u0437\u0430\u043D\u0438\u043C\u0430\u044E\u0441\u044C \u0432 \u0441\u0435\u0442\u0438, {site} \u2014 \u043B\u0443\u0447\u0448\u0435\u0435 \u043C\u0435\u0441\u0442\u043E \u043D\u0430\u0447\u0430\u0442\u044C.",
            DLG_TIPS_CREDITS: "\u041E\u0441\u043E\u0431\u0430\u044F \u0431\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u043D\u043E\u0441\u0442\u044C {zbluebugz} \u0437\u0430 \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u043E\u0435\u043A\u0442 \u0438 {trinhquocviet} \u0437\u0430 \u0443\u043F\u0440\u043E\u0449\u0451\u043D\u043D\u0443\u044E UI-\u0432\u0435\u0442\u043A\u0443, \u043E\u0442 \u043A\u043E\u0442\u043E\u0440\u043E\u0439 \u044F \u0438\u0437\u043D\u0430\u0447\u0430\u043B\u044C\u043D\u043E \u0444\u043E\u0440\u043A\u043D\u0443\u043B - \u0438 \u0437\u0430 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0443 \u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432 \u0432 \u0442\u043E\u0442 \u043F\u0435\u0440\u0438\u043E\u0434.",
            DLG_TIPS_MAINTAINER_PREFIX: "\u041E\u0442 \u0441\u043E\u043F\u0440\u043E\u0432\u043E\u0436\u0434\u0430\u044E\u0449\u0435\u0433\u043E:",
            DLG_TIPS_MAINTAINER: "\u041D\u0430\u0434\u0435\u044E\u0441\u044C, \u044D\u0442\u043E\u0442 \u0441\u043A\u0440\u0438\u043F\u0442 \u043F\u043E\u043C\u043E\u0436\u0435\u0442 \u0432\u0430\u043C \u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0441\u0432\u043E\u044E \u043B\u0435\u043D\u0442\u0443. \u042F \u043E\u0431\u0435\u0449\u0430\u044E \u0431\u044B\u0442\u044C \u0432\u0430\u0448\u0438\u043C \u0441\u043E\u044E\u0437\u043D\u0438\u043A\u043E\u043C \u0432 \u0431\u043E\u0440\u044C\u0431\u0435 \u0441 \u0442\u0435\u043C, \u0447\u0442\u043E \u0432\u044B \u043D\u0435 \u0445\u043E\u0442\u0438\u0442\u0435 \u0432\u0438\u0434\u0435\u0442\u044C \u0432 \u0441\u0435\u0442\u0438.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "\u043C\u043E\u044E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u043D\u0430 Facebook",
            DLG_TIPS_LINK_SITE: "\u043C\u043E\u0439 \u0441\u0430\u0439\u0442",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C", "\u0417\u0430\u043A\u0440\u044B\u0442\u044C", "\u042D\u043A\u0441\u043F\u043E\u0440\u0442", "\u0418\u043C\u043F\u043E\u0440\u0442", "\u0421\u0431\u0440\u043E\u0441"],
            DLG_BUTTON_TOOLTIPS: [
              "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u044D\u0442\u043E\u043C \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435. \u041E\u0447\u0438\u0441\u0442\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445/\u0438\u043D\u043A\u043E\u0433\u043D\u0438\u0442\u043E \u0443\u0434\u0430\u043B\u0438\u0442 \u0438\u0445.",
              "\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u0443\u0435\u0442 \u0444\u0430\u0439\u043B-\u0440\u0435\u0437\u0435\u0440\u0432 \u0434\u043B\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0438 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0430 \u043C\u0435\u0436\u0434\u0443 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430\u043C\u0438.",
              "\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u0443\u0435\u0442 \u0444\u0430\u0439\u043B \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u0434\u043B\u044F \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u0430.",
              "\u0421\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0435\u0442 \u0432\u0441\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043A \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E."
            ],
            DLG_FB_COLOUR_HINT: "\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u044B\u043C, \u0447\u0442\u043E\u0431\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0446\u0432\u0435\u0442\u043E\u0432\u0443\u044E \u0441\u0445\u0435\u043C\u0443 FB"
          },
          // -- Türkçe (Turkey)
          tr: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "Sponsorlu",
            NF_TABLIST_STORIES_REELS_ROOMS: '"Hikayeler | Makaralar | Odalar" sekmeleri liste kutusu',
            NF_STORIES: "Hikayeler",
            NF_TOP_CARDS_PAGES: "\xDCst kartlar (Sayfalar i\xE7in)",
            NF_META_AI: "Meta AI'yi dene",
            NF_HIDE_VERIFIED_BADGE: "Do\u011Frulanm\u0131\u015F rozetleri gizle",
            NF_FILTER_VERIFIED_BADGE: "Do\u011Frulanm\u0131\u015F hesaplar\u0131 filtrele",
            NF_AI_SIDE_PANELS: "Yan panellerde Yapay Zeka",
            NF_SURVEY: "Anket",
            NF_PEOPLE_YOU_MAY_KNOW: "Tan\u0131yor olabilece\u011Fin ki\u015Filer",
            NF_PAID_PARTNERSHIP: "\xFCcretli ortakl\u0131k",
            NF_SPONSORED_PAID: "Sponsorlu \xB7 ______ taraf\u0131ndan \xF6dendi",
            NF_SUGGESTIONS: "\xD6neriler",
            NF_FOLLOW: "Takip Et",
            NF_PARTICIPATE: "Kat\u0131lmak",
            NF_REELS_SHORT_VIDEOS: "Makaralar ve k\u0131sa videolar",
            NF_SHORT_REEL_VIDEO: "makara/k\u0131sa video",
            NF_EVENTS_YOU_MAY_LIKE: "makara/k\u0131sa video",
            NF_ANIMATED_GIFS_POSTS: "Animasyonlu GIF'ler",
            NF_ANIMATED_GIFS_PAUSE: "Hareketli GIF'leri duraklat",
            NF_SHARES: "# Payla\u015F\u0131m",
            NF_LIKES_MAXIMUM: "Maksimum Be\u011Feni say\u0131s\u0131",
            GF_PAID_PARTNERSHIP: "\xFCcretli ortakl\u0131k",
            GF_SUGGESTIONS: "\xD6neriler",
            GF_SHORT_REEL_VIDEO: "makara/k\u0131sa video",
            GF_ANIMATED_GIFS_POSTS: "Animasyonlu GIF'ler",
            GF_ANIMATED_GIFS_PAUSE: "Hareketli GIF'leri duraklat",
            GF_SHARES: "# Payla\u015F\u0131m",
            VF_LIVE: "CANLI",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "\xC7ift video",
            VF_ANIMATED_GIFS_PAUSE: "Hareketli GIF'leri duraklat",
            PP_ANIMATED_GIFS_POSTS: "Animasyonlu GIF'ler",
            PP_ANIMATED_GIFS_PAUSE: "Hareketli GIF'leri duraklat",
            NF_BLOCKED_FEED: ["Haber ak\u0131\u015F\u0131", "Gruplar Feed'i", "Video Beslemelerini \u0130zle"],
            GF_BLOCKED_FEED: ["Haber ak\u0131\u015F\u0131", "Gruplar Feed'i", "Video Beslemelerini \u0130zle"],
            VF_BLOCKED_FEED: ["Haber ak\u0131\u015F\u0131", "Gruplar Feed'i", "Video Beslemelerini \u0130zle"],
            MP_BLOCKED_FEED: ["Pazar Yeri Feed'i"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Koronavir\xFCs (bilgi kutusu)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "\u0130klim Bilimi (bilgi kutusu)",
            OTHER_INFO_BOX_SUBSCRIBE: "Abone ol (bilgi kutusu)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "Oynatma ve d\xF6ng\xFC kontrolleri.",
            REELS_CONTROLS: "Video kontrollerini g\xF6ster",
            REELS_DISABLE_LOOPING: "D\xF6ng\xFCy\xFC devre d\u0131\u015F\u0131 b\u0131rak",
            DLG_TITLE: "Feed'lerimi temizle",
            DLG_NF: "Haber ak\u0131\u015F\u0131",
            DLG_NF_DESC: "\xD6nerileri temizleyin ve ak\u0131\u015F\u0131n ne kadar s\u0131k\u0131 olaca\u011F\u0131n\u0131 ayarlay\u0131n.",
            DLG_GF: "Gruplar Feed'i",
            DLG_GF_DESC: "Grup ak\u0131\u015Flar\u0131n\u0131 d\xFCzenleyerek fazlal\u0131klar\u0131 ve g\xFCr\xFClt\xFCy\xFC azalt\u0131n.",
            DLG_VF: "Video Beslemelerini \u0130zle",
            DLG_VF_DESC: "Video ak\u0131\u015F\u0131n\u0131 tekrar ve karma\u015Fay\u0131 azaltarak odakl\u0131 tutun.",
            DLG_MP: "Pazar Yeri Feed'i",
            DLG_MP_DESC: "\u0130lanlar\u0131 fiyat ve anahtar kelimelere g\xF6re filtreleyin.",
            DLG_PP: "Profil / Sayfa",
            DLG_PP_DESC: "Profil ve sayfalarda g\xF6r\xFCnenleri ayarlay\u0131n.",
            DLG_OTHER: "Ek Notlar",
            DLG_OTHER_DESC: "\u0130stemedi\u011Finiz ek kutular\u0131 gizleyin.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "Metin filtresi",
            DLG_BLOCK_NEW_LINE: "(Kelimeleri veya ifadeleri sat\u0131r sonu ile ay\u0131r\u0131n, D\xFCzenli \u0130fadeler desteklenir)",
            NF_BLOCKED_ENABLED: "Etkinle\u015Ftirildi",
            GF_BLOCKED_ENABLED: "Etkinle\u015Ftirildi",
            VF_BLOCKED_ENABLED: "Etkinle\u015Ftirildi",
            MP_BLOCKED_ENABLED: "Etkinle\u015Ftirildi",
            PP_BLOCKED_ENABLED: "Etkinle\u015Ftirildi",
            NF_BLOCKED_RE: "D\xFCzenli \u0130fadeler (RegExp)",
            GF_BLOCKED_RE: "D\xFCzenli \u0130fadeler (RegExp)",
            VF_BLOCKED_RE: "D\xFCzenli \u0130fadeler (RegExp)",
            MP_BLOCKED_RE: "D\xFCzenli \u0130fadeler (RegExp)",
            PP_BLOCKED_RE: "D\xFCzenli \u0130fadeler (RegExp)",
            DLG_VERBOSITY: "Gizli G\xF6nderi Se\xE7enekleri",
            DLG_PREFERENCES: "Tercihler",
            DLG_PREFERENCES_DESC: "Etiketler, konum, renkler ve dil.",
            DLG_REPORT_BUG: "Hata bildir",
            DLG_REPORT_BUG_DESC: "Sorunlar i\xE7in tan\u0131lama raporu olu\u015Ftur.",
            DLG_REPORT_BUG_NOTICE: "D\xFCzeltmemize yard\u0131m edin:\n1. Sorunlu g\xF6nderi g\xF6r\xFCn\xFCr olacak \u015Fekilde kayd\u0131r\u0131n.\n2. 'Rapor olu\u015Ftur'a ve ard\u0131ndan 'Raporu kopyala'ya t\u0131klay\u0131n.\n3. 'Sorunlar\u0131 a\xE7'a t\u0131klay\u0131n ve raporu yeni bir soruna yap\u0131\u015Ft\u0131r\u0131n.\n4. Sorunun k\u0131sa bir a\xE7\u0131klamas\u0131n\u0131 ekleyin.\n(\u0130simleri/metinleri gizliyoruz, ancak payla\u015Fmadan \xF6nce l\xFCtfen kontrol edin!)",
            DLG_REPORT_BUG_GENERATE: "Rapor olu\u015Ftur",
            DLG_REPORT_BUG_COPY: "Raporu kopyala",
            DLG_REPORT_BUG_OPEN_ISSUES: "Sorunlar\u0131 a\xE7",
            DLG_REPORT_BUG_STATUS_READY: "Rapor haz\u0131r.",
            DLG_REPORT_BUG_STATUS_COPIED: "Rapor panoya kopyaland\u0131.",
            DLG_REPORT_BUG_STATUS_FAILED: "Kopyalama ba\u015Far\u0131s\u0131z. Elle kopyalay\u0131n.",
            DLG_VERBOSITY_CAPTION: "Bir g\xF6nderi gizlenmi\u015Fse bir etiket g\xF6ster",
            VERBOSITY_MESSAGE: [
              "etiket yok",
              "G\xF6nderi gizlendi. Kural: ",
              " g\xF6nderi gizlendi",
              "7 g\xF6nderi gizlendi ~ (yaln\u0131zca Grup Beslemesi)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "Metin rengi",
            VERBOSITY_MESSAGE_BG_COLOUR: "Arka plan rengi",
            VERBOSITY_DEBUG: '"Gizli" g\xF6nderileri vurgulay\u0131n',
            CMF_CUSTOMISATIONS: "\xF6zelle\u015Ftirmeler",
            CMF_BTN_LOCATION: "CMF d\xFC\u011Fmesinin konumu:",
            CMF_BTN_OPTION: [
              "sol alt",
              "sa\u011F \xFCst",
              'devre d\u0131\u015F\u0131 (Kullan\u0131c\u0131 Komut Dosyas\u0131 Komutlar\u0131 men\xFCs\xFCnde "Ayarlar"\u0131 kullan\u0131n)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds dili:",
            CMF_DIALOG_LANGUAGE: "T\xFCrk\xE7e",
            CMF_DIALOG_LANGUAGE_DEFAULT: "Site dilini kullan",
            GM_MENU_SETTINGS: "Ayarlar",
            CMF_DIALOG_LOCATION: "Bu men\xFCn\xFCn konumu:",
            CMF_DIALOG_OPTION: ["sol yan", "sa\u011F yan"],
            CMF_BORDER_COLOUR: "Kenarl\u0131k rengi",
            DLG_TIPS: "Hakk\u0131nda",
            DLG_TIPS_DESC: "Proje ba\u011Flant\u0131lar\u0131 ve bak\u0131m sorumlusu bilgisi.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "Bu i\u015Fe yararsa, {github} \xFCzerinde bir y\u0131ld\u0131z \xE7ok \u015Fey ifade eder.",
            DLG_TIPS_FACEBOOK: "{facebook} u\u011Fray\u0131p selam verin - orada sanat\u0131m\u0131 ve \u015Fiirimi payla\u015F\u0131yorum.",
            DLG_TIPS_SITE: "Webde neler yapt\u0131\u011F\u0131m\u0131 g\xF6rmek isterseniz, {site} en iyi ba\u015Flang\u0131\xE7.",
            DLG_TIPS_CREDITS: "Orijinal proje i\xE7in {zbluebugz}'a ve ilk fork ald\u0131\u011F\u0131m sadele\u015Ftirilmi\u015F UI branch'i i\xE7in {trinhquocviet}'e \xF6zel te\u015Fekk\xFCrler - o d\xF6nemdeki filtre bak\u0131m\u0131na da.",
            DLG_TIPS_MAINTAINER_PREFIX: "Geli\u015Ftiriciden:",
            DLG_TIPS_MAINTAINER: "Bu beti\u011Fin feed\u2019inizi geri alman\u0131za yard\u0131mc\u0131 olmas\u0131n\u0131 umuyorum. \u0130nternette g\xF6rmek istemedi\u011Finiz \u015Feylere kar\u015F\u0131 m\xFCttefikiniz olaca\u011F\u0131ma s\xF6z veriyorum.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "Facebook sayfam",
            DLG_TIPS_LINK_SITE: "web sitem",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["Kaydetmek", "Kapat", "\u0130hracat", "\u0130\xE7e aktarmak", "S\u0131f\u0131rla"],
            DLG_BUTTON_TOOLTIPS: [
              "De\u011Fi\u015Fiklikleri bu taray\u0131c\u0131ya kaydeder. Veri temizleme/gizli mod siler.",
              "Ayarlar\u0131 korumak ve ta\u015F\u0131mak i\xE7in yedek dosyas\u0131 d\u0131\u015Fa aktar\u0131r.",
              "Ayar dosyas\u0131n\u0131 i\xE7e aktar\u0131r; geri y\xFCkleme veya ta\u015F\u0131ma i\xE7in.",
              "T\xFCm ayarlar\u0131 varsay\u0131lana d\xF6nd\xFCr\xFCr."
            ],
            DLG_FB_COLOUR_HINT: "FB'un renk d\xFCzenini kullanmak i\xE7in bo\u015F b\u0131rak\u0131n"
          },
          // -- Україна (Ukraine)
          uk: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "\u0421\u043F\u043E\u043D\u0441\u043E\u0440\u043E\u0432\u0430\u043D\u0430",
            NF_TABLIST_STORIES_REELS_ROOMS: "\u041F\u043E\u043B\u0435 \u0441\u043F\u0438\u0441\u043A\u0443 \u0432\u043A\u043B\u0430\u0434\u043E\u043A \xAB\u0406\u0441\u0442\u043E\u0440\u0456\u0457 | Reels | \u041A\u0456\u043C\u043D\u0430\u0442\u0438\xBB",
            NF_STORIES: "\u0406\u0441\u0442\u043E\u0440\u0456\u0457",
            NF_TOP_CARDS_PAGES: "\u0412\u0435\u0440\u0445\u043D\u0456 \u043A\u0430\u0440\u0442\u043A\u0438 (\u0434\u043B\u044F \u0421\u0442\u043E\u0440\u0456\u043D\u043E\u043A)",
            NF_META_AI: "\u0421\u043F\u0440\u043E\u0431\u0443\u0432\u0430\u0442\u0438 Meta AI",
            NF_HIDE_VERIFIED_BADGE: "\u041F\u0440\u0438\u0445\u043E\u0432\u0430\u0442\u0438 \u0437\u043D\u0430\u0447\u043A\u0438 \u043F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0436\u0435\u043D\u043D\u044F",
            NF_FILTER_VERIFIED_BADGE: "\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0432\u0430\u0442\u0438 \u043F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0436\u0435\u043D\u0456 \u043E\u0431\u043B\u0456\u043A\u043E\u0432\u0456 \u0437\u0430\u043F\u0438\u0441\u0438",
            NF_AI_SIDE_PANELS: "\u0428\u0406 \u0432 \u0431\u0456\u0447\u043D\u0438\u0445 \u043F\u0430\u043D\u0435\u043B\u044F\u0445",
            NF_SURVEY: "\u041E\u043F\u0438\u0442\u0443\u0432\u0430\u043D\u043D\u044F",
            NF_PEOPLE_YOU_MAY_KNOW: "\u041B\u044E\u0434\u0438, \u044F\u043A\u0438\u0445 \u0412\u0438 \u043C\u043E\u0436\u0435\u0442\u0435 \u0437\u043D\u0430\u0442\u0438",
            NF_PAID_PARTNERSHIP: "\u041E\u043F\u043B\u0430\u0447\u0443\u0432\u0430\u043D\u0435 \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u0442\u0432\u043E",
            NF_SPONSORED_PAID: "\u0421\u043F\u043E\u043D\u0441\u043E\u0440\u043E\u0432\u0430\u043D\u043E \xB7 \u041E\u043F\u043B\u0430\u0447\u0435\u043D\u043E ______",
            NF_SUGGESTIONS: "\u041F\u0440\u043E\u043F\u043E\u0437\u0438\u0446\u0456\u0457 / \u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0456\u0457",
            NF_FOLLOW: "\u0421\u043B\u0456\u0434\u0443\u0439\u0442\u0435",
            NF_PARTICIPATE: "\u0411\u0435\u0440\u0456\u0442\u044C \u0443\u0447\u0430\u0441\u0442\u044C",
            NF_REELS_SHORT_VIDEOS: "\u0412\u0456\u0434\u0435\u043E Reels \u0456 \u043A\u043E\u0440\u043E\u0442\u043A\u0456 \u0432\u0456\u0434\u0435\u043E",
            NF_SHORT_REEL_VIDEO: "Reel/\u043A\u043E\u0440\u043E\u0442\u043A\u0435 \u0432\u0456\u0434\u0435\u043E",
            NF_EVENTS_YOU_MAY_LIKE: "\u041F\u043E\u0434\u0456\u0457, \u044F\u043A\u0456 \u043C\u043E\u0436\u0443\u0442\u044C \u0432\u0430\u043C \u0441\u043F\u043E\u0434\u043E\u0431\u0430\u0442\u0438\u0441\u044F",
            NF_ANIMATED_GIFS_POSTS: "\u0410\u043D\u0456\u043C\u043E\u0432\u0430\u043D\u0456 GIF-\u0444\u0430\u0439\u043B\u0438",
            NF_ANIMATED_GIFS_PAUSE: "\u041F\u0440\u0438\u0437\u0443\u043F\u0438\u043D\u0438\u0442\u0438 \u0430\u043D\u0456\u043C\u043E\u0432\u0430\u043D\u0456 GIF-\u0444\u0430\u0439\u043B\u0438",
            NF_SHARES: "# \u041F\u043E\u0448\u0438\u0440\u0438\u0442\u0438",
            NF_LIKES_MAXIMUM: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \xAB\u041F\u043E\u0434\u043E\u0431\u0430\u0454\u0442\u044C\u0441\u044F\xBB.",
            GF_PAID_PARTNERSHIP: "\u041E\u043F\u043B\u0430\u0447\u0443\u0432\u0430\u043D\u0435 \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u0442\u0432\u043E",
            GF_SUGGESTIONS: "\u041F\u0440\u043E\u043F\u043E\u0437\u0438\u0446\u0456\u0457 / \u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0456\u0457",
            GF_SHORT_REEL_VIDEO: "Reel/\u043A\u043E\u0440\u043E\u0442\u043A\u0435 \u0432\u0456\u0434\u0435\u043E",
            GF_ANIMATED_GIFS_POSTS: "\u0410\u043D\u0456\u043C\u043E\u0432\u0430\u043D\u0456 GIF-\u0444\u0430\u0439\u043B\u0438",
            GF_ANIMATED_GIFS_PAUSE: "\u041F\u0440\u0438\u0437\u0443\u043F\u0438\u043D\u0438\u0442\u0438 \u0430\u043D\u0456\u043C\u043E\u0432\u0430\u043D\u0456 GIF-\u0444\u0430\u0439\u043B\u0438",
            GF_SHARES: "# \u041F\u043E\u0448\u0438\u0440\u0438\u0442\u0438",
            VF_LIVE: "\u0415\u0424\u0406\u0420",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "\u0414\u0443\u0431\u043B\u044C\u043E\u0432\u0430\u043D\u0435 \u0432\u0456\u0434\u0435\u043E",
            VF_ANIMATED_GIFS_PAUSE: "\u041F\u0440\u0438\u0437\u0443\u043F\u0438\u043D\u0438\u0442\u0438 \u0430\u043D\u0456\u043C\u043E\u0432\u0430\u043D\u0456 GIF-\u0444\u0430\u0439\u043B\u0438",
            PP_ANIMATED_GIFS_POSTS: "\u0410\u043D\u0456\u043C\u043E\u0432\u0430\u043D\u0456 GIF-\u0444\u0430\u0439\u043B\u0438",
            PP_ANIMATED_GIFS_PAUSE: "\u041F\u0440\u0438\u0437\u0443\u043F\u0438\u043D\u0438\u0442\u0438 \u0430\u043D\u0456\u043C\u043E\u0432\u0430\u043D\u0456 GIF-\u0444\u0430\u0439\u043B\u0438",
            NF_BLOCKED_FEED: ["\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u043D\u043E\u0432\u0438\u043D", "\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u0413\u0440\u0443\u043F\u0438", "\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u0432\u0456\u0434\u0435\u043E"],
            GF_BLOCKED_FEED: ["\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u043D\u043E\u0432\u0438\u043D", "\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u0413\u0440\u0443\u043F\u0438", "\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u0432\u0456\u0434\u0435\u043E"],
            VF_BLOCKED_FEED: ["\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u043D\u043E\u0432\u0438\u043D", "\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u0413\u0440\u0443\u043F\u0438", "\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u0432\u0456\u0434\u0435\u043E"],
            MP_BLOCKED_FEED: ["\u0421\u0442\u0440\u0456\u0447\u043A\u0430 Marketplace"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "\u041A\u043E\u0440\u043E\u043D\u0430\u0432\u0456\u0440\u0443\u0441 (\u0456\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0456\u0439\u043D\u0435 \u0432\u0456\u043A\u043D\u043E)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "\u041D\u0430\u0443\u043A\u0430 \u043F\u0440\u043E \u043A\u043B\u0456\u043C\u0430\u0442 (\u0456\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0456\u0439\u043D\u0435 \u0432\u0456\u043A\u043D\u043E)",
            OTHER_INFO_BOX_SUBSCRIBE: "\u041F\u0456\u0434\u043F\u0438\u0441\u0430\u0442\u0438\u0441\u044F (\u0456\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0456\u0439\u043D\u0435 \u0432\u0456\u043A\u043D\u043E)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "\u041A\u0435\u0440\u0443\u0432\u0430\u043D\u043D\u044F \u0432\u0456\u0434\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F\u043C \u0456 \u0446\u0438\u043A\u043B\u043E\u043C.",
            REELS_CONTROLS: "\u0412\u0456\u0434\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432 \u043A\u0435\u0440\u0443\u0432\u0430\u043D\u043D\u044F \u0432\u0456\u0434\u0435\u043E",
            REELS_DISABLE_LOOPING: "\u0412\u0438\u043C\u043A\u043D\u0443\u0442\u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u043D\u044F",
            DLG_TITLE: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u043C\u043E\u0457 \u0441\u0442\u0440\u0456\u0447\u043A\u0438",
            DLG_NF: "\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u043D\u043E\u0432\u0438\u043D",
            DLG_NF_DESC: "\u041F\u0440\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0456\u0457 \u0442\u0430 \u0437\u0430\u0434\u0430\u0439\u0442\u0435 \u0441\u0443\u0432\u043E\u0440\u0456\u0441\u0442\u044C \u0441\u0442\u0440\u0456\u0447\u043A\u0438.",
            DLG_GF: "\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u0413\u0440\u0443\u043F\u0438",
            DLG_GF_DESC: "\u0423\u043F\u043E\u0440\u044F\u0434\u043A\u0443\u0439\u0442\u0435 \u0441\u0442\u0440\u0456\u0447\u043A\u0438 \u0433\u0440\u0443\u043F, \u043F\u0440\u0438\u0431\u0440\u0430\u0432\u0448\u0438 \u0437\u0430\u0439\u0432\u0435 \u0439 \u0448\u0443\u043C.",
            DLG_VF: "\u0421\u0442\u0440\u0456\u0447\u043A\u0430 \u0432\u0456\u0434\u0435\u043E",
            DLG_VF_DESC: "\u0417\u0440\u043E\u0431\u0456\u0442\u044C \u0432\u0456\u0434\u0435\u043E\u0441\u0442\u0440\u0456\u0447\u043A\u0443 \u0447\u0438\u0441\u0442\u0456\u0448\u043E\u044E, \u0437\u043C\u0435\u043D\u0448\u0438\u0432\u0448\u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u0438 \u0439 \u0431\u0435\u0437\u043B\u0430\u0434.",
            DLG_MP: "\u0421\u0442\u0440\u0456\u0447\u043A\u0430 Marketplace",
            DLG_MP_DESC: "\u0424\u0456\u043B\u044C\u0442\u0440\u0443\u0439\u0442\u0435 \u043E\u0433\u043E\u043B\u043E\u0448\u0435\u043D\u043D\u044F \u0437\u0430 \u0446\u0456\u043D\u043E\u044E \u0442\u0430 \u043A\u043B\u044E\u0447\u043E\u0432\u0438\u043C\u0438 \u0441\u043B\u043E\u0432\u0430\u043C\u0438.",
            DLG_PP: "\u041F\u0440\u043E\u0444\u0456\u043B\u044C / \u0421\u0442\u043E\u0440\u0456\u043D\u043A\u0430",
            DLG_PP_DESC: "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0439\u0442\u0435, \u0449\u043E \u043F\u043E\u043A\u0430\u0437\u0443\u0454\u0442\u044C\u0441\u044F \u0432 \u043F\u0440\u043E\u0444\u0456\u043B\u044F\u0445 \u0456 \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0430\u0445.",
            DLG_OTHER: "\u0414\u043E\u0434\u0430\u0442\u043A\u043E\u0432\u0456 \u043D\u043E\u0442\u0430\u0442\u043A\u0438",
            DLG_OTHER_DESC: "\u0421\u0445\u043E\u0432\u0430\u0439\u0442\u0435 \u0437\u0430\u0439\u0432\u0456 \u0431\u043B\u043E\u043A\u0438, \u044F\u043A\u0456 \u043D\u0435 \u0445\u043E\u0447\u0435\u0442\u0435.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "\u0422\u0435\u043A\u0441\u0442\u043E\u0432\u0438\u0439 \u0444\u0456\u043B\u044C\u0442\u0440",
            DLG_BLOCK_NEW_LINE: "(\u0420\u043E\u0437\u0434\u0456\u043B\u044F\u0439\u0442\u0435 \u0441\u043B\u043E\u0432\u0430 \u0430\u0431\u043E \u0444\u0440\u0430\u0437\u0438 \u0440\u043E\u0437\u0440\u0438\u0432\u043E\u043C \u0440\u044F\u0434\u043A\u0430, \u0440\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0456 \u0432\u0438\u0440\u0430\u0437\u0438 \u043F\u0456\u0434\u0442\u0440\u0438\u043C\u0443\u044E\u0442\u044C\u0441\u044F)",
            NF_BLOCKED_ENABLED: "\u0423\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",
            GF_BLOCKED_ENABLED: "\u0423\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",
            VF_BLOCKED_ENABLED: "\u0423\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",
            MP_BLOCKED_ENABLED: "\u0423\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",
            PP_BLOCKED_ENABLED: "\u0423\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",
            NF_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0456 \u0432\u0438\u0440\u0430\u0437\u0438 (RegExp)",
            GF_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0456 \u0432\u0438\u0440\u0430\u0437\u0438 (RegExp)",
            VF_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0456 \u0432\u0438\u0440\u0430\u0437\u0438 (RegExp)",
            MP_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0456 \u0432\u0438\u0440\u0430\u0437\u0438 (RegExp)",
            PP_BLOCKED_RE: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u0456 \u0432\u0438\u0440\u0430\u0437\u0438 (RegExp)",
            DLG_VERBOSITY: "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438 \u043F\u0440\u0438\u0445\u043E\u0432\u0430\u043D\u0438\u0445 \u0434\u043E\u043F\u0438\u0441\u0456\u0432",
            DLG_PREFERENCES: "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",
            DLG_PREFERENCES_DESC: "\u041C\u0456\u0442\u043A\u0438, \u0440\u043E\u0437\u0442\u0430\u0448\u0443\u0432\u0430\u043D\u043D\u044F, \u043A\u043E\u043B\u044C\u043E\u0440\u0438 \u0442\u0430 \u043C\u043E\u0432\u0430.",
            DLG_REPORT_BUG: "\u041F\u043E\u0432\u0456\u0434\u043E\u043C\u0438\u0442\u0438 \u043F\u0440\u043E \u043F\u043E\u043C\u0438\u043B\u043A\u0443",
            DLG_REPORT_BUG_DESC: "\u0421\u0442\u0432\u043E\u0440\u0456\u0442\u044C \u0434\u0456\u0430\u0433\u043D\u043E\u0441\u0442\u0438\u0447\u043D\u0438\u0439 \u0437\u0432\u0456\u0442.",
            DLG_REPORT_BUG_NOTICE: "\u0414\u043E\u043F\u043E\u043C\u043E\u0436\u0456\u0442\u044C \u043D\u0430\u043C \u0446\u0435 \u0432\u0438\u043F\u0440\u0430\u0432\u0438\u0442\u0438:\n1. \u041F\u0440\u043E\u043A\u0440\u0443\u0442\u0456\u0442\u044C \u0442\u0430\u043A, \u0449\u043E\u0431 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u043D\u0438\u0439 \u0434\u043E\u043F\u0438\u0441 \u0431\u0443\u043B\u043E \u0432\u0438\u0434\u043D\u043E.\n2. \u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \xAB\u0421\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u0437\u0432\u0456\u0442\xBB, \u0430 \u043F\u043E\u0442\u0456\u043C \xAB\u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 \u0437\u0432\u0456\u0442\xBB.\n3. \u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \xAB\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u0437\u0432\u0435\u0440\u043D\u0435\u043D\u043D\u044F\xBB \u0442\u0430 \u0432\u0441\u0442\u0430\u0432\u0442\u0435 \u0437\u0432\u0456\u0442 \u0443 \u043D\u043E\u0432\u0435 \u0437\u0432\u0435\u0440\u043D\u0435\u043D\u043D\u044F.\n4. \u0414\u043E\u0434\u0430\u0439\u0442\u0435 \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u043E\u043F\u0438\u0441 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0438.\n(\u041C\u0438 \u043F\u0440\u0438\u0445\u043E\u0432\u0443\u0454\u043C\u043E \u0456\u043C\u0435\u043D\u0430/\u0442\u0435\u043A\u0441\u0442, \u0430\u043B\u0435, \u0431\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u0442\u0435 \u043F\u0435\u0440\u0435\u0434 \u043D\u0430\u0434\u0441\u0438\u043B\u0430\u043D\u043D\u044F\u043C!)",
            DLG_REPORT_BUG_GENERATE: "\u0421\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u0437\u0432\u0456\u0442",
            DLG_REPORT_BUG_COPY: "\u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 \u0437\u0432\u0456\u0442",
            DLG_REPORT_BUG_OPEN_ISSUES: "\u0412\u0456\u0434\u043A\u0440\u0438\u0442\u0438 \u0437\u0432\u0435\u0440\u043D\u0435\u043D\u043D\u044F",
            DLG_REPORT_BUG_STATUS_READY: "\u0417\u0432\u0456\u0442 \u0433\u043E\u0442\u043E\u0432\u0438\u0439.",
            DLG_REPORT_BUG_STATUS_COPIED: "\u0417\u0432\u0456\u0442 \u0441\u043A\u043E\u043F\u0456\u0439\u043E\u0432\u0430\u043D\u043E \u0434\u043E \u0431\u0443\u0444\u0435\u0440\u0430.",
            DLG_REPORT_BUG_STATUS_FAILED: "\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0441\u043A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438. \u0421\u043A\u043E\u043F\u0456\u044E\u0439\u0442\u0435 \u0432\u0440\u0443\u0447\u043D\u0443.",
            DLG_VERBOSITY_CAPTION: "\u0412\u0456\u0434\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u0438 \u043C\u0456\u0442\u043A\u0443, \u044F\u043A\u0449\u043E \u043F\u0443\u0431\u043B\u0456\u043A\u0430\u0446\u0456\u044F \u043F\u0440\u0438\u0445\u043E\u0432\u0430\u043D\u0430",
            VERBOSITY_MESSAGE: [
              "\u0436\u043E\u0434\u043D\u043E\u0457 \u043C\u0456\u0442\u043A\u0438",
              "\u0414\u043E\u043F\u0438\u0441 \u043F\u0440\u0438\u0445\u043E\u0432\u0430\u043D\u0438\u0439. \u041F\u0440\u0430\u0432\u0438\u043B\u043E: ",
              " \u0434\u043E\u043F\u0438\u0441\u0438 \u043F\u0440\u0438\u0445\u043E\u0432\u0430\u043D\u043E",
              "7 \u0434\u043E\u043F\u0438\u0441\u0438 \u043F\u0440\u0438\u0445\u043E\u0432\u0430\u043D\u043E ~ (\u043B\u0438\u0448\u0435 \u0432 \u0441\u0442\u0440\u0456\u0447\u0446\u0456 \u0413\u0440\u0443\u043F)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "\u041A\u043E\u043B\u0456\u0440 \u0442\u0435\u043A\u0441\u0442\u0443",
            VERBOSITY_MESSAGE_BG_COLOUR: "\u041A\u043E\u043B\u0456\u0440 \u0444\u043E\u043D\u0443",
            VERBOSITY_DEBUG: "\xAB\u0412\u0438\u0434\u0456\u043B\u044F\u0442\u0438 \xAB\u043F\u0440\u0438\u0445\u043E\u0432\u0430\u043D\u0456\xBB \u0434\u043E\u043F\u0438\u0441\u0438\xBB",
            CMF_CUSTOMISATIONS: "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",
            CMF_BTN_LOCATION: "\u0420\u043E\u0437\u0442\u0430\u0448\u0443\u0432\u0430\u043D\u043D\u044F \u043A\u043D\u043E\u043F\u043A\u0438 CMF:",
            CMF_BTN_OPTION: [
              "\u0432\u043D\u0438\u0437\u0443 \u043B\u0456\u0432\u043E\u0440\u0443\u0447",
              "\u0432\u0433\u043E\u0440\u0456 \u043F\u0440\u0430\u0432\u043E\u0440\u0443\u0447",
              "\u0432\u0438\u043C\u043A\u043D\u0435\u043D\u043E (\u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0439\u0442\u0435 \xAB\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438\xBB \u0432 \u043C\u0435\u043D\u044E \u043A\u043E\u043C\u0430\u043D\u0434 \u0441\u0446\u0435\u043D\u0430\u0440\u0456\u044E \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430\xBB)"
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "\u041C\u043E\u0432\u0430 Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430",
            CMF_DIALOG_LANGUAGE_DEFAULT: "\u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0432\u0430\u0442\u0438 \u043C\u043E\u0432\u0443 \u0441\u0430\u0439\u0442\u0443",
            GM_MENU_SETTINGS: "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438",
            CMF_DIALOG_LOCATION: "\u0420\u043E\u0437\u0442\u0430\u0448\u0443\u0432\u0430\u043D\u043D\u044F \u0446\u044C\u043E\u0433\u043E \u043C\u0435\u043D\u044E:",
            CMF_DIALOG_OPTION: ["\u043B\u0456\u0432\u0430 \u0441\u0442\u043E\u0440\u043E\u043D\u0430", "\u043F\u0440\u0430\u0432\u0430 \u0441\u0442\u043E\u0440\u043E\u043D\u0430"],
            CMF_BORDER_COLOUR: "\u041A\u043E\u043B\u0456\u0440 \u043A\u043E\u0440\u0434\u043E\u043D\u0443",
            DLG_TIPS: "\u041F\u0440\u043E \u043F\u0440\u043E\u0454\u043A\u0442",
            DLG_TIPS_DESC: "\u041F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F \u043F\u0440\u043E\u0454\u043A\u0442\u0443 \u0442\u0430 \u0456\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0456\u044F \u043F\u0440\u043E \u0441\u0443\u043F\u0440\u043E\u0432\u0456\u0434\u043D\u0438\u043A\u0430.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "\u042F\u043A\u0449\u043E \u0446\u0435 \u0434\u043E\u043F\u043E\u043C\u0430\u0433\u0430\u0454, \u0437\u0456\u0440\u043A\u0430 \u043D\u0430 {github} \u0434\u0443\u0436\u0435 \u0431\u0430\u0433\u0430\u0442\u043E \u0434\u043B\u044F \u043C\u0435\u043D\u0435 \u043E\u0437\u043D\u0430\u0447\u0430\u0454.",
            DLG_TIPS_FACEBOOK: "\u0417\u0430\u0432\u0456\u0442\u0430\u0439\u0442\u0435 \u043D\u0430 {facebook} - \u0442\u0430\u043C \u044F \u0434\u0456\u043B\u044E\u0441\u044F \u043C\u0438\u0441\u0442\u0435\u0446\u0442\u0432\u043E\u043C \u0456 \u043F\u043E\u0435\u0437\u0456\u0454\u044E.",
            DLG_TIPS_SITE: "\u042F\u043A\u0449\u043E \u0445\u043E\u0447\u0435\u0442\u0435 \u043F\u043E\u0431\u0430\u0447\u0438\u0442\u0438, \u0447\u0438\u043C \u044F \u0437\u0430\u0439\u043C\u0430\u044E\u0441\u044F \u0432 \u043C\u0435\u0440\u0435\u0436\u0456, {site} \u2014 \u043D\u0430\u0439\u043A\u0440\u0430\u0449\u0435 \u043C\u0456\u0441\u0446\u0435 \u043F\u043E\u0447\u0430\u0442\u0438.",
            DLG_TIPS_CREDITS: "\u041E\u043A\u0440\u0435\u043C\u0430 \u043F\u043E\u0434\u044F\u043A\u0430 {zbluebugz} \u0437\u0430 \u043E\u0440\u0438\u0433\u0456\u043D\u0430\u043B\u044C\u043D\u0438\u0439 \u043F\u0440\u043E\u0454\u043A\u0442 \u0456 {trinhquocviet} \u0437\u0430 \u0441\u043F\u0440\u043E\u0449\u0435\u043D\u0443 UI-\u0433\u0456\u043B\u043A\u0443, \u0437 \u044F\u043A\u043E\u0457 \u044F \u0441\u043F\u0435\u0440\u0448\u0443 \u0444\u043E\u0440\u043A\u043D\u0443\u0432 - \u0456 \u0437\u0430 \u043F\u0456\u0434\u0442\u0440\u0438\u043C\u043A\u0443 \u0444\u0456\u043B\u044C\u0442\u0440\u0456\u0432 \u0443 \u0442\u043E\u0439 \u043F\u0435\u0440\u0456\u043E\u0434.",
            DLG_TIPS_MAINTAINER_PREFIX: "\u0412\u0456\u0434 \u0441\u0443\u043F\u0440\u043E\u0432\u0456\u0434\u043D\u0438\u043A\u0430:",
            DLG_TIPS_MAINTAINER: "\u0421\u043F\u043E\u0434\u0456\u0432\u0430\u044E\u0441\u044F, \u0446\u0435\u0439 \u0441\u043A\u0440\u0438\u043F\u0442 \u0434\u043E\u043F\u043E\u043C\u043E\u0436\u0435 \u0432\u0430\u043C \u043F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438 \u0441\u0432\u043E\u044E \u0441\u0442\u0440\u0456\u0447\u043A\u0443. \u041E\u0431\u0456\u0446\u044F\u044E \u0431\u0443\u0442\u0438 \u0432\u0430\u0448\u0438\u043C \u0441\u043E\u044E\u0437\u043D\u0438\u043A\u043E\u043C \u0443 \u0431\u043E\u0440\u043E\u0442\u044C\u0431\u0456 \u0437 \u0442\u0438\u043C, \u0449\u043E \u0432\u0438 \u043D\u0435 \u0445\u043E\u0447\u0435\u0442\u0435 \u0431\u0430\u0447\u0438\u0442\u0438 \u043E\u043D\u043B\u0430\u0439\u043D.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "\u043C\u043E\u044E \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0443 \u0443 Facebook",
            DLG_TIPS_LINK_SITE: "\u043C\u0456\u0439 \u0441\u0430\u0439\u0442",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438", "\u0417\u0430\u043A\u0440\u0438\u0442\u0438", "\u0415\u043A\u0441\u043F\u043E\u0440\u0442", "\u0406\u043C\u043F\u043E\u0440\u0442", "\u0421\u043A\u0438\u043D\u0443\u0442\u0438"],
            DLG_BUTTON_TOOLTIPS: [
              "\u0417\u0431\u0435\u0440\u0456\u0433\u0430\u0454 \u0437\u043C\u0456\u043D\u0438 \u0432 \u0446\u044C\u043E\u043C\u0443 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0456. \u041E\u0447\u0438\u0449\u0435\u043D\u043D\u044F \u0434\u0430\u043D\u0438\u0445/\u0456\u043D\u043A\u043E\u0433\u043D\u0456\u0442\u043E \u0457\u0445 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u044C.",
              "\u0415\u043A\u0441\u043F\u043E\u0440\u0442\u0443\u0454 \u0444\u0430\u0439\u043B-\u0440\u0435\u0437\u0435\u0440\u0432 \u0434\u043B\u044F \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F \u0456 \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0435\u043D\u043D\u044F \u043C\u0456\u0436 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u044F\u043C\u0438.",
              "\u0406\u043C\u043F\u043E\u0440\u0442\u0443\u0454 \u0444\u0430\u0439\u043B \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u044C \u0434\u043B\u044F \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0430\u0431\u043E \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0435\u043D\u043D\u044F.",
              "\u0421\u043A\u0438\u0434\u0430\u0454 \u0432\u0441\u0456 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0434\u043E \u0442\u0438\u043F\u043E\u0432\u0438\u0445."
            ],
            DLG_FB_COLOUR_HINT: "\u0417\u0430\u043B\u0438\u0448\u0442\u0435 \u043F\u043E\u0440\u043E\u0436\u043D\u0456\u043C, \u0449\u043E\u0431 \u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0432\u0430\u0442\u0438 \u043A\u043E\u043B\u0456\u0440\u043D\u0443 \u0441\u0445\u0435\u043C\u0443 FB"
          },
          // -- Tiếng Việt (Vietnam)
          vi: {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "\u0110\u01B0\u1EE3c t\xE0i tr\u1EE3",
            NF_TABLIST_STORIES_REELS_ROOMS: 'H\u1ED9p danh s\xE1ch tab "Tin | Reels | Ph\xF2ng h\u1ECDp m\u1EB7t"',
            NF_STORIES: "Tin",
            NF_TOP_CARDS_PAGES: "Th\u1EBB tr\xEAn c\xF9ng (cho Trang)",
            NF_META_AI: "Th\u1EED Meta AI",
            NF_HIDE_VERIFIED_BADGE: "\u1EA8n huy hi\u1EC7u \u0111\xE3 x\xE1c minh",
            NF_FILTER_VERIFIED_BADGE: "L\u1ECDc t\xE0i kho\u1EA3n \u0111\xE3 x\xE1c minh",
            NF_AI_SIDE_PANELS: "AI \u1EDF b\u1EA3ng b\xEAn",
            NF_SURVEY: "Kh\u1EA3o s\xE1t",
            NF_PEOPLE_YOU_MAY_KNOW: "Nh\u1EEFng ng\u01B0\u1EDDi b\u1EA1n c\xF3 th\u1EC3 bi\u1EBFt",
            NF_PAID_PARTNERSHIP: "M\u1ED1i quan h\u1EC7 t\xE0i tr\u1EE3",
            NF_SPONSORED_PAID: "\u0110\u01B0\u1EE3c t\xE0i tr\u1EE3 \xB7 T\xE0i tr\u1EE3 b\u1EDFi ______",
            NF_SUGGESTIONS: "\u0110\u1EC1 xu\u1EA5t / Khuy\u1EBFn ngh\u1ECB",
            NF_FOLLOW: "Theo d\xF5i",
            NF_PARTICIPATE: "Tham gia",
            NF_REELS_SHORT_VIDEOS: "Reels v\xE0 video ng\u1EAFn",
            NF_SHORT_REEL_VIDEO: "Reel / video ng\u1EAFn",
            NF_EVENTS_YOU_MAY_LIKE: "S\u1EF1 ki\u1EC7n b\u1EA1n c\xF3 th\u1EC3 th\xEDch",
            NF_ANIMATED_GIFS_POSTS: "GIF \u0111\u1ED9ng",
            NF_ANIMATED_GIFS_PAUSE: "T\u1EA1m d\u1EEBng c\xE1c \u1EA3nh GIF \u0111\u1ED9ng",
            NF_SHARES: "# l\u01B0\u1EE3t chia s\u1EBB",
            NF_LIKES_MAXIMUM: "S\u1ED1 l\u01B0\u1EE3t th\xEDch t\u1ED1i \u0111a",
            GF_PAID_PARTNERSHIP: "M\u1ED1i quan h\u1EC7 t\xE0i tr\u1EE3",
            GF_SUGGESTIONS: "\u0110\u1EC1 xu\u1EA5t / Khuy\u1EBFn ngh\u1ECB",
            GF_SHORT_REEL_VIDEO: "Reel / video ng\u1EAFn",
            GF_ANIMATED_GIFS_POSTS: "GIF \u0111\u1ED9ng",
            GF_ANIMATED_GIFS_PAUSE: "T\u1EA1m d\u1EEBng c\xE1c \u1EA3nh GIF \u0111\u1ED9ng",
            GF_SHARES: "# l\u01B0\u1EE3t chia s\u1EBB",
            VF_LIVE: "TR\u1EF0C TI\u1EBEP",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "Video tr\xF9ng l\u1EB7p",
            VF_ANIMATED_GIFS_PAUSE: "T\u1EA1m d\u1EEBng c\xE1c \u1EA3nh GIF \u0111\u1ED9ng",
            PP_ANIMATED_GIFS_POSTS: "GIF \u0111\u1ED9ng",
            PP_ANIMATED_GIFS_PAUSE: "T\u1EA1m d\u1EEBng c\xE1c \u1EA3nh GIF \u0111\u1ED9ng",
            NF_BLOCKED_FEED: ["Ngu\u1ED3n c\u1EA5p tin t\u1EE9c", "Ngu\u1ED3n c\u1EA5p d\u1EEF li\u1EC7u Nh\xF3m", "Ngu\u1ED3n c\u1EA5p d\u1EEF li\u1EC7u video"],
            GF_BLOCKED_FEED: ["Ngu\u1ED3n c\u1EA5p tin t\u1EE9c", "Ngu\u1ED3n c\u1EA5p d\u1EEF li\u1EC7u Nh\xF3m", "Ngu\u1ED3n c\u1EA5p d\u1EEF li\u1EC7u video"],
            VF_BLOCKED_FEED: ["Ngu\u1ED3n c\u1EA5p tin t\u1EE9c", "Ngu\u1ED3n c\u1EA5p d\u1EEF li\u1EC7u Nh\xF3m", "Ngu\u1ED3n c\u1EA5p d\u1EEF li\u1EC7u video"],
            MP_BLOCKED_FEED: ["Ngu\u1ED3n c\u1EA5p d\u1EEF li\u1EC7u Marketplace"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "Virus corona (h\u1ED9p th\xF4ng tin)",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "Khoa h\u1ECDc kh\xED h\u1EADu (h\u1ED9p th\xF4ng tin)",
            OTHER_INFO_BOX_SUBSCRIBE: "\u0110\u0103ng k\xED (h\u1ED9p th\xF4ng tin)",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "\u0110i\u1EC1u khi\u1EC3n ph\xE1t v\xE0 l\u1EB7p.",
            REELS_CONTROLS: "Hi\u1EC3n th\u1ECB \u0111i\u1EC1u khi\u1EC3n video",
            REELS_DISABLE_LOOPING: "T\u1EAFt l\u1EB7p l\u1EA1i",
            DLG_TITLE: "L\xE0m s\u1EA1ch ngu\u1ED3n c\u1EA5p d\u1EEF li\u1EC7u c\u1EE7a t\xF4i",
            DLG_NF: "Ngu\u1ED3n c\u1EA5p tin t\u1EE9c",
            DLG_NF_DESC: "D\u1ECDn g\u1EE3i \xFD v\xE0 \u0111\u1EB7t m\u1EE9c \u0111\u1ED9 nghi\xEAm kh\u1EAFc c\u1EE7a b\u1EA3ng tin.",
            DLG_GF: "Ngu\u1ED3n c\u1EA5p d\u1EEF li\u1EC7u Nh\xF3m",
            DLG_GF_DESC: "D\u1ECDn g\u1ECDn b\u1EA3ng tin nh\xF3m b\u1EB1ng c\xE1ch gi\u1EA3m ph\u1EA7n th\u1EEBa v\xE0 nhi\u1EC5u.",
            DLG_VF: "Ngu\u1ED3n c\u1EA5p d\u1EEF li\u1EC7u video",
            DLG_VF_DESC: "Gi\u1EEF b\u1EA3ng tin video g\u1ECDn b\u1EB1ng c\xE1ch gi\u1EA3m l\u1EB7p l\u1EA1i v\xE0 l\u1ED9n x\u1ED9n.",
            DLG_MP: "Ngu\u1ED3n c\u1EA5p d\u1EEF li\u1EC7u Marketplace",
            DLG_MP_DESC: "L\u1ECDc danh s\xE1ch theo gi\xE1 v\xE0 t\u1EEB kh\xF3a.",
            DLG_PP: "H\u1ED3 s\u01A1 / Trang",
            DLG_PP_DESC: "Ch\u1EC9nh nh\u1EEFng g\xEC hi\u1EC3n th\u1ECB tr\xEAn h\u1ED3 s\u01A1 v\xE0 trang.",
            DLG_OTHER: "Ghi ch\xFA b\u1ED5 sung",
            DLG_OTHER_DESC: "\u1EA8n c\xE1c h\u1ED9p b\u1ED5 sung m\xE0 b\u1EA1n kh\xF4ng mu\u1ED1n.",
            DLG_BLOCK_TEXT_FILTER_TITLE: "B\u1ED9 l\u1ECDc v\u0103n b\u1EA3n",
            DLG_BLOCK_NEW_LINE: "(Ng\u0103n c\xE1ch t\u1EEB ho\u1EB7c c\u1EE5m t\u1EEB b\u1EB1ng d\u1EA5u xu\u1ED1ng d\xF2ng, Bi\u1EC3u th\u1EE9c ch\xEDnh quy \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3)",
            NF_BLOCKED_ENABLED: "\u0110\xE3 k\xEDch ho\u1EA1t",
            GF_BLOCKED_ENABLED: "\u0110\xE3 k\xEDch ho\u1EA1t",
            VF_BLOCKED_ENABLED: "\u0110\xE3 k\xEDch ho\u1EA1t",
            MP_BLOCKED_ENABLED: "\u0110\xE3 k\xEDch ho\u1EA1t",
            PP_BLOCKED_ENABLED: "\u0110\xE3 k\xEDch ho\u1EA1t",
            NF_BLOCKED_RE: "Bi\u1EC3u th\u1EE9c ch\xEDnh quy (RegExp)",
            GF_BLOCKED_RE: "Bi\u1EC3u th\u1EE9c ch\xEDnh quy (RegExp)",
            VF_BLOCKED_RE: "Bi\u1EC3u th\u1EE9c ch\xEDnh quy (RegExp)",
            MP_BLOCKED_RE: "Bi\u1EC3u th\u1EE9c ch\xEDnh quy (RegExp)",
            PP_BLOCKED_RE: "Bi\u1EC3u th\u1EE9c ch\xEDnh quy (RegExp)",
            DLG_VERBOSITY: "T\xF9y ch\u1ECDn cho b\xE0i \u0111\u0103ng \u1EA9n",
            DLG_PREFERENCES: "T\xF9y ch\u1ECDn",
            DLG_PREFERENCES_DESC: "Nh\xE3n, v\u1ECB tr\xED, m\xE0u s\u1EAFc v\xE0 ng\xF4n ng\u1EEF.",
            DLG_REPORT_BUG: "B\xE1o l\u1ED7i",
            DLG_REPORT_BUG_DESC: "T\u1EA1o b\xE1o c\xE1o ch\u1EA9n \u0111o\xE1n cho s\u1EF1 c\u1ED1.",
            DLG_REPORT_BUG_NOTICE: "H\xE3y gi\xFAp ch\xFAng t\xF4i s\u1EEDa l\u1ED7i:\n1. Cu\u1ED9n \u0111\u1EC3 b\xE0i vi\u1EBFt b\u1ECB l\u1ED7i hi\u1EC3n th\u1ECB.\n2. Nh\u1EA5p v\xE0o 'T\u1EA1o b\xE1o c\xE1o' r\u1ED3i 'Sao ch\xE9p b\xE1o c\xE1o'.\n3. Nh\u1EA5p v\xE0o 'M\u1EDF issues' v\xE0 d\xE1n b\xE1o c\xE1o v\xE0o issue m\u1EDBi.\n4. Th\xEAm m\xF4 t\u1EA3 ng\u1EAFn v\u1EC1 v\u1EA5n \u0111\u1EC1.\n(Ch\xFAng t\xF4i \u1EA9n t\xEAn/v\u0103n b\u1EA3n, nh\u01B0ng vui l\xF2ng ki\u1EC3m tra tr\u01B0\u1EDBc khi chia s\u1EBB!)",
            DLG_REPORT_BUG_GENERATE: "T\u1EA1o b\xE1o c\xE1o",
            DLG_REPORT_BUG_COPY: "Sao ch\xE9p b\xE1o c\xE1o",
            DLG_REPORT_BUG_OPEN_ISSUES: "M\u1EDF issues",
            DLG_REPORT_BUG_STATUS_READY: "B\xE1o c\xE1o \u0111\xE3 s\u1EB5n s\xE0ng.",
            DLG_REPORT_BUG_STATUS_COPIED: "\u0110\xE3 sao ch\xE9p b\xE1o c\xE1o.",
            DLG_REPORT_BUG_STATUS_FAILED: "Kh\xF4ng th\u1EC3 sao ch\xE9p. Vui l\xF2ng sao ch\xE9p th\u1EE7 c\xF4ng.",
            DLG_VERBOSITY_CAPTION: "Hi\u1EC3n th\u1ECB m\u1ED9t nh\xE3n n\u1EBFu m\u1ED9t b\xE0i \u0111\u0103ng b\u1ECB \u1EA9n",
            VERBOSITY_MESSAGE: [
              "kh\xF4ng c\xF3 nh\xE3n",
              "B\xE0i b\u1ECB \u1EA9n. Quy t\u1EAFc: ",
              " b\xE0i vi\u1EBFt \u1EA9n",
              "7 b\xE0i vi\u1EBFt \u1EA9n ~ (ch\u1EC9 \xE1p d\u1EE5ng cho B\u1EA3ng tin Nh\xF3m)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "M\xE0u v\u0103n b\u1EA3n",
            VERBOSITY_MESSAGE_BG_COLOUR: "M\xE0u n\u1EC1n",
            VERBOSITY_DEBUG: '\u0110\xE1nh d\u1EA5u c\xE1c b\xE0i \u0111\u0103ng "\u1EA9n"',
            CMF_CUSTOMISATIONS: "C\xE1c t\xF9y ch\u1EC9nh",
            CMF_BTN_LOCATION: "V\u1ECB tr\xED n\xFAt CMF:",
            CMF_BTN_OPTION: [
              "d\u01B0\u1EDBi c\xF9ng b\xEAn tr\xE1i",
              "tr\xEAn c\xF9ng b\xEAn ph\u1EA3i",
              'b\u1ECB v\xF4 hi\u1EC7u h\xF3a (s\u1EED d\u1EE5ng "C\xE0i \u0111\u1EB7t" trong menu L\u1EC7nh c\u1EE7a T\u1EADp l\u1EC7nh Ng\u01B0\u1EDDi d\xF9ng)'
            ],
            CMF_DIALOG_LANGUAGE_LABEL: "Ng\xF4n ng\u1EEF Clean My Feeds:",
            CMF_DIALOG_LANGUAGE: "Ti\u1EBFng Vi\u1EC7t",
            CMF_DIALOG_LANGUAGE_DEFAULT: "S\u1EED d\u1EE5ng ng\xF4n ng\u1EEF trang web",
            GM_MENU_SETTINGS: "C\xE0i \u0111\u1EB7t",
            CMF_DIALOG_LOCATION: "V\u1ECB tr\xED menu n\xE0y:",
            CMF_DIALOG_OPTION: ["b\xEAn tr\xE1i", "b\xEAn ph\u1EA3i"],
            CMF_BORDER_COLOUR: "M\xE0u vi\u1EC1n",
            DLG_TIPS: "Gi\u1EDBi thi\u1EC7u",
            DLG_TIPS_DESC: "Li\xEAn k\u1EBFt d\u1EF1 \xE1n v\xE0 th\xF4ng tin ng\u01B0\u1EDDi b\u1EA3o tr\xEC.",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "N\u1EBFu th\u1EA5y h\u1EEFu \xEDch, m\u1ED9t ng\xF4i sao tr\xEAn {github} c\xF3 \xFD ngh\u0129a r\u1EA5t l\u1EDBn.",
            DLG_TIPS_FACEBOOK: "Gh\xE9 {facebook} - m\xECnh chia s\u1EBB ngh\u1EC7 thu\u1EADt v\xE0 th\u01A1 \u1EDF \u0111\xF3.",
            DLG_TIPS_SITE: "N\u1EBFu mu\u1ED1n xem m\xECnh l\xE0m g\xEC tr\xEAn web, {site} l\xE0 n\u01A1i b\u1EAFt \u0111\u1EA7u t\u1ED1t nh\u1EA5t.",
            DLG_TIPS_CREDITS: "Xin c\u1EA3m \u01A1n \u0111\u1EB7c bi\u1EC7t t\u1EDBi {zbluebugz} cho d\u1EF1 \xE1n g\u1ED1c v\xE0 {trinhquocviet} cho nh\xE1nh UI \u0111\u01A1n gi\u1EA3n h\xF3a m\xE0 m\xECnh \u0111\xE3 fork ban \u0111\u1EA7u - c\xF9ng vi\u1EC7c b\u1EA3o tr\xEC b\u1ED9 l\u1ECDc trong giai \u0111o\u1EA1n \u0111\xF3.",
            DLG_TIPS_MAINTAINER_PREFIX: "T\u1EEB ng\u01B0\u1EDDi b\u1EA3o tr\xEC:",
            DLG_TIPS_MAINTAINER: "M\xECnh hy v\u1ECDng script n\xE0y gi\xFAp b\u1EA1n gi\xE0nh l\u1EA1i b\u1EA3ng tin. M\xECnh h\u1EE9a s\u1EBD l\xE0 \u0111\u1ED3ng minh c\u1EE7a b\u1EA1n trong cu\u1ED9c chi\u1EBFn v\u1EDBi nh\u1EEFng th\u1EE9 b\u1EA1n kh\xF4ng mu\u1ED1n th\u1EA5y tr\xEAn m\u1EA1ng.",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "trang Facebook c\u1EE7a m\xECnh",
            DLG_TIPS_LINK_SITE: "trang web c\u1EE7a m\xECnh",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["L\u01B0u", "\u0110\xF3ng", "Xu\u1EA5t", "Nh\u1EADp", "\u0110\u1EB7t l\u1EA1i"],
            DLG_BUTTON_TOOLTIPS: [
              "L\u01B0u thay \u0111\u1ED5i trong tr\xECnh duy\u1EC7t n\xE0y. X\xF3a d\u1EEF li\u1EC7u/ch\u1EBF \u0111\u1ED9 ri\xEAng t\u01B0 s\u1EBD m\u1EA5t.",
              "Xu\u1EA5t t\u1EC7p sao l\u01B0u \u0111\u1EC3 gi\u1EEF v\xE0 chuy\u1EC3n gi\u1EEFa thi\u1EBFt b\u1ECB/tr\xECnh duy\u1EC7t.",
              "Nh\u1EADp t\u1EC7p c\xE0i \u0111\u1EB7t \u0111\u1EC3 kh\xF4i ph\u1EE5c ho\u1EB7c chuy\u1EC3n.",
              "\u0110\u1EB7t l\u1EA1i t\u1EA5t c\u1EA3 c\xE0i \u0111\u1EB7t v\u1EC1 m\u1EB7c \u0111\u1ECBnh."
            ],
            DLG_FB_COLOUR_HINT: "\u0110\u1EC3 tr\u1ED1ng \u0111\u1EC3 s\u1EED d\u1EE5ng b\u1EA3ng m\xE0u c\u1EE7a FB"
          },
          // -- 简体中文 (Chinese (Simplified))
          "zh-Hans": {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "\u8D5E\u52A9\u5185\u5BB9",
            NF_TABLIST_STORIES_REELS_ROOMS: "\u201C\u5FEB\u62CD|Reels|\u7545\u804A\u5BA4\u201D\u9009\u9879\u5361\u5217\u8868\u6846",
            NF_STORIES: "\u6545\u4E8B",
            NF_TOP_CARDS_PAGES: "\u9876\u90E8\u5361\u7247\uFF08\u7528\u4E8E\u9875\u9762\uFF09",
            NF_META_AI: "\u8BD5\u7528 Meta AI",
            NF_HIDE_VERIFIED_BADGE: "\u9690\u85CF\u5DF2\u9A8C\u8BC1\u5FBD\u7AE0",
            NF_FILTER_VERIFIED_BADGE: "\u8FC7\u6EE4\u5DF2\u9A8C\u8BC1\u5E10\u6237",
            NF_AI_SIDE_PANELS: "\u4FA7\u8FB9\u680F\u4E2D\u7684 AI",
            NF_SURVEY: "\u8C03\u67E5",
            NF_PEOPLE_YOU_MAY_KNOW: "\u4F60\u53EF\u80FD\u8BA4\u8BC6\u7684\u4EBA",
            NF_PAID_PARTNERSHIP: "\u4ED8\u8D39\u5408\u4F19",
            NF_SPONSORED_PAID: "\u8D5E\u52A9 \xB7 \u7531 ______ \u4ED8\u8D39",
            NF_SUGGESTIONS: "\u5EFA\u8BAE",
            NF_FOLLOW: "\u5173\u6CE8",
            NF_PARTICIPATE: "\u53C2\u4E0E",
            NF_REELS_SHORT_VIDEOS: "\u5377\u8F74\u548C\u77ED\u89C6\u9891",
            NF_SHORT_REEL_VIDEO: "\u5377\u8F74/\u77ED\u89C6\u9891",
            NF_EVENTS_YOU_MAY_LIKE: "\u60A8\u53EF\u80FD\u559C\u6B22\u7684\u6D3B\u52A8",
            NF_ANIMATED_GIFS_POSTS: "\u52A8\u56FE GIF",
            NF_ANIMATED_GIFS_PAUSE: "\u6682\u505C\u52A8\u753B GIF",
            NF_SHARES: "#\u6B21\u5206\u4EAB",
            NF_LIKES_MAXIMUM: "\u6700\u5927\u70B9\u8D5E\u6570",
            GF_PAID_PARTNERSHIP: "\u6709\u507F\u5408\u4F5C",
            GF_SUGGESTIONS: "\u5EFA\u8BAE/\u5EFA\u8BAE",
            GF_SHORT_REEL_VIDEO: "\u5377\u8F74\u548C\u77ED\u89C6\u9891",
            GF_ANIMATED_GIFS_POSTS: "\u52A8\u56FE GIF",
            GF_ANIMATED_GIFS_PAUSE: "\u6682\u505C\u52A8\u753B GIF",
            GF_SHARES: "#\u6B21\u5206\u4EAB",
            VF_LIVE: "\u73B0\u573A\u76F4\u64AD",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "\u91CD\u590D\u89C6\u9891",
            VF_ANIMATED_GIFS_PAUSE: "\u6682\u505C\u52A8\u753B GIF",
            PP_ANIMATED_GIFS_POSTS: "\u52A8\u56FE GIF",
            PP_ANIMATED_GIFS_PAUSE: "\u6682\u505C\u52A8\u753B GIF",
            NF_BLOCKED_FEED: ["\u65B0\u95FB\u63D0\u8981", "\u7EC4\u63D0\u8981", "\u89C6\u9891\u63D0\u8981"],
            GF_BLOCKED_FEED: ["\u65B0\u95FB\u63D0\u8981", "\u7EC4\u63D0\u8981", "\u89C6\u9891\u63D0\u8981"],
            VF_BLOCKED_FEED: ["\u65B0\u95FB\u63D0\u8981", "\u7EC4\u63D0\u8981", "\u89C6\u9891\u63D0\u8981"],
            MP_BLOCKED_FEED: ["\u5E02\u573A\u63D0\u8981"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "\u51A0\u72B6\u75C5\u6BD2\uFF08\u4FE1\u606F\u6846\uFF09",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "\u6C14\u5019\u79D1\u5B66\uFF08\u4FE1\u606F\u6846\uFF09",
            OTHER_INFO_BOX_SUBSCRIBE: "\u8BA2\u9605\uFF08\u4FE1\u606F\u6846\uFF09",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "\u64AD\u653E\u63A7\u5236\u548C\u5FAA\u73AF\u64AD\u653E\u3002",
            REELS_CONTROLS: "\u663E\u793A\u89C6\u9891\u63A7\u5236",
            REELS_DISABLE_LOOPING: "\u7981\u7528\u5FAA\u73AF",
            DLG_TITLE: "\u6E05\u7406\u6211\u7684\u63D0\u8981",
            DLG_NF: "\u65B0\u95FB\u63D0\u8981",
            DLG_NF_DESC: "\u6E05\u7406\u5EFA\u8BAE\u5E76\u8BBE\u7F6E\u52A8\u6001\u6D88\u606F\u7684\u4E25\u683C\u7A0B\u5EA6\u3002",
            DLG_GF: "\u7FA4\u7EC4\u63D0\u8981",
            DLG_GF_DESC: "\u901A\u8FC7\u51CF\u5C11\u591A\u4F59\u5185\u5BB9\u548C\u566A\u97F3\u6765\u6574\u7406\u7FA4\u7EC4\u52A8\u6001\u3002",
            DLG_VF: "\u89C6\u9891\u63D0\u8981",
            DLG_VF_DESC: "\u901A\u8FC7\u51CF\u5C11\u91CD\u590D\u548C\u6742\u4E71\u5185\u5BB9\uFF0C\u4FDD\u6301\u89C6\u9891\u52A8\u6001\u7684\u4E13\u6CE8\u3002",
            DLG_MP: "\u5E02\u573A\u63D0\u8981",
            DLG_MP_DESC: "\u6309\u4EF7\u683C\u548C\u60A8\u5173\u5FC3\u7684\u5173\u952E\u8BCD\u8FC7\u6EE4\u5217\u8868\u3002",
            DLG_PP: "\u4E2A\u4EBA\u8D44\u6599 / \u9875\u9762",
            DLG_PP_DESC: "\u8C03\u6574\u4E2A\u4EBA\u8D44\u6599\u548C\u9875\u9762\u4E0A\u663E\u793A\u7684\u5185\u5BB9\u3002",
            DLG_OTHER: "\u5176\u4ED6\u8BF4\u660E",
            DLG_OTHER_DESC: "\u9690\u85CF\u60A8\u4E0D\u9700\u8981\u7684\u989D\u5916\u6846\u3002",
            DLG_BLOCK_TEXT_FILTER_TITLE: "\u6587\u672C\u8FC7\u6EE4\u5668",
            DLG_BLOCK_NEW_LINE: "(\u4F7F\u7528\u6362\u884C\u7B26\u5206\u9694\u5355\u8BCD\u6216\u77ED\u8BED\uFF0C\u652F\u6301\u6B63\u5219\u8868\u8FBE\u5F0F)",
            NF_BLOCKED_ENABLED: "\u542F\u7528",
            GF_BLOCKED_ENABLED: "\u542F\u7528",
            VF_BLOCKED_ENABLED: "\u542F\u7528",
            MP_BLOCKED_ENABLED: "\u542F\u7528",
            PP_BLOCKED_ENABLED: "\u542F\u7528",
            NF_BLOCKED_RE: "\u6B63\u5219\u8868\u8FBE\u5F0F (RegExp)",
            GF_BLOCKED_RE: "\u6B63\u5219\u8868\u8FBE\u5F0F (RegExp)",
            VF_BLOCKED_RE: "\u6B63\u5219\u8868\u8FBE\u5F0F (RegExp)",
            MP_BLOCKED_RE: "\u6B63\u5219\u8868\u8FBE\u5F0F (RegExp)",
            PP_BLOCKED_RE: "\u6B63\u5219\u8868\u8FBE\u5F0F (RegExp)",
            DLG_VERBOSITY: "\u9690\u85CF\u5E16\u5B50\u9009\u9879",
            DLG_PREFERENCES: "\u504F\u597D\u8BBE\u7F6E",
            DLG_PREFERENCES_DESC: "\u6807\u7B7E\u3001\u4F4D\u7F6E\u3001\u989C\u8272\u548C\u8BED\u8A00\u3002",
            DLG_VERBOSITY_CAPTION: "\u5982\u679C\u6587\u7AE0\u88AB\u9690\u85CF\uFF0C\u5219\u663E\u793A\u6807\u7B7E",
            DLG_REPORT_BUG: "\u62A5\u544A\u9519\u8BEF",
            DLG_REPORT_BUG_DESC: "\u751F\u6210\u95EE\u9898\u8BCA\u65AD\u62A5\u544A\u3002",
            DLG_REPORT_BUG_NOTICE: "\u5E2E\u52A9\u6211\u4EEC\u4FEE\u590D\u5B83\uFF1A\n1. \u6EDA\u52A8\u9875\u9762\u4EE5\u4F7F\u6709\u95EE\u9898\u7684\u5E16\u5B50\u53EF\u89C1\u3002\n2. \u70B9\u51FB\u201C\u751F\u6210\u62A5\u544A\u201D\uFF0C\u7136\u540E\u70B9\u51FB\u201C\u590D\u5236\u62A5\u544A\u201D\u3002\n3. \u70B9\u51FB\u201C\u6253\u5F00 Issue\u201D\u5E76\u5C06\u62A5\u544A\u7C98\u8D34\u5230\u65B0\u7684 Issue \u4E2D\u3002\n4. \u6DFB\u52A0\u7B80\u77ED\u7684\u95EE\u9898\u63CF\u8FF0\u3002\n(\u6211\u4EEC\u4F1A\u9690\u85CF\u59D3\u540D/\u6587\u672C\uFF0C\u4F46\u5728\u5206\u4EAB\u524D\u8BF7\u52A1\u5FC5\u68C0\u67E5\uFF01)",
            DLG_REPORT_BUG_GENERATE: "\u751F\u6210\u62A5\u544A",
            DLG_REPORT_BUG_COPY: "\u590D\u5236\u62A5\u544A",
            DLG_REPORT_BUG_OPEN_ISSUES: "\u6253\u5F00 Issue",
            DLG_REPORT_BUG_STATUS_READY: "\u62A5\u544A\u5C31\u7EEA\u3002",
            DLG_REPORT_BUG_STATUS_COPIED: "\u62A5\u544A\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F\u3002",
            DLG_REPORT_BUG_STATUS_FAILED: "\u590D\u5236\u5931\u8D25\u3002\u8BF7\u624B\u52A8\u590D\u5236\u3002",
            VERBOSITY_MESSAGE: [
              "\u6CA1\u6709\u6807\u7B7E",
              "\u5E16\u5B50\u5DF2\u9690\u85CF\u3002\u89C4\u5219\uFF1A",
              " \u4E2A\u5E16\u5B50\u5DF2\u9690\u85CF",
              "7\u4E2A\u5E16\u5B50\u5DF2\u9690\u85CF ~ (\u4EC5\u9002\u7528\u4E8E\u7FA4\u7EC4\u52A8\u6001)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "\u6587\u5B57\u989C\u8272",
            VERBOSITY_MESSAGE_BG_COLOUR: "\u80CC\u666F\u989C\u8272",
            VERBOSITY_DEBUG: "\u7A81\u51FA\u663E\u793A\u201C\u9690\u85CF\u201D\u7684\u5E16\u5B50",
            CMF_CUSTOMISATIONS: "\u5B9A\u5236\u5316",
            CMF_BTN_LOCATION: "CMF \u6309\u94AE\u4F4D\u7F6E\uFF1A",
            CMF_BTN_OPTION: ["\u5DE6\u4E0B\u65B9", "\u53F3\u4E0A", "\u7981\u7528\uFF08\u4F7F\u7528\u7528\u6237\u811A\u672C\u547D\u4EE4\u83DC\u5355\u4E2D\u7684\u201C\u8BBE\u7F6E\u201D\uFF09"],
            CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds \u8BED\u8A00\uFF1A",
            CMF_DIALOG_LANGUAGE: "\u4E2D\u6587\uFF08\u7B80\u4F53\uFF09",
            CMF_DIALOG_LANGUAGE_DEFAULT: "\u4F7F\u7528\u7F51\u7AD9\u8BED\u8A00",
            GM_MENU_SETTINGS: "\u8BBE\u7F6E",
            CMF_DIALOG_LOCATION: "\u6B64\u83DC\u5355\u7684\u4F4D\u7F6E\uFF1A",
            CMF_DIALOG_OPTION: ["\u5DE6\u8FB9", "\u53F3\u8FB9"],
            CMF_BORDER_COLOUR: "\u8FB9\u6846\u989C\u8272",
            DLG_TIPS: "\u5173\u4E8E",
            DLG_TIPS_DESC: "\u9879\u76EE\u94FE\u63A5\u548C\u7EF4\u62A4\u8005\u4FE1\u606F\u3002",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "\u5982\u679C\u6709\u5E2E\u52A9\uFF0C\u5728 {github} \u70B9\u4E2A\u661F\u5BF9\u6211\u610F\u4E49\u5F88\u5927\u3002",
            DLG_TIPS_FACEBOOK: "\u6B22\u8FCE\u5230{facebook}\u6253\u4E2A\u62DB\u547C - \u6211\u5728\u90A3\u91CC\u5206\u4EAB\u827A\u672F\u548C\u8BD7\u6B4C\u3002",
            DLG_TIPS_SITE: "\u60F3\u770B\u770B\u6211\u5728\u7F51\u4E0A\u90FD\u5728\u505A\u4EC0\u4E48\uFF0C{site}\u662F\u6700\u597D\u7684\u8D77\u70B9\u3002",
            DLG_TIPS_CREDITS: "\u7279\u522B\u611F\u8C22 {zbluebugz} \u7684\u539F\u59CB\u9879\u76EE\uFF0C\u4EE5\u53CA {trinhquocviet} \u7684\u7B80\u5316 UI \u5206\u652F\uFF08\u6211\u6700\u521D\u5C31\u662F\u4ECE\u5B83 fork \u7684\uFF09- \u4E5F\u611F\u8C22\u90A3\u6BB5\u65F6\u95F4\u7684\u8FC7\u6EE4\u7EF4\u62A4\u3002",
            DLG_TIPS_MAINTAINER: "\u5E0C\u671B\u8FD9\u4E2A\u811A\u672C\u80FD\u5E2E\u4F60\u627E\u56DE\u6E05\u723D\u7684\u52A8\u6001\u6D88\u606F\u3002\u6211\u627F\u8BFA\u5C06\u662F\u4F60\u5BF9\u6297\u4E0D\u60F3\u770B\u5230\u7684\u7F51\u7EDC\u5185\u5BB9\u7684\u76DF\u53CB\u3002",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "\u6211\u7684 Facebook",
            DLG_TIPS_LINK_SITE: "\u6211\u7684\u7F51\u7AD9",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["\u8282\u7701", "\u5173", "\u51FA\u53E3", "\u8FDB\u53E3", "\u91CD\u7F6E"],
            DLG_BUTTON_TOOLTIPS: [
              "\u4FDD\u5B58\u5230\u6B64\u6D4F\u89C8\u5668\u3002\u6E05\u9664\u7AD9\u70B9\u6570\u636E/\u9690\u79C1\u6A21\u5F0F\u4F1A\u4E22\u5931\u3002",
              "\u5BFC\u51FA\u5907\u4EFD\u6587\u4EF6\uFF0C\u7528\u4E8E\u4FDD\u7559\u8BBE\u7F6E\u5E76\u5728\u8BBE\u5907\u95F4\u8FC1\u79FB\u3002",
              "\u5BFC\u5165\u8BBE\u7F6E\u6587\u4EF6\u4EE5\u6062\u590D\u6216\u8FC1\u79FB\u3002",
              "\u5C06\u6240\u6709\u8BBE\u7F6E\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u503C\u3002"
            ],
            DLG_FB_COLOUR_HINT: "\u7559\u7A7A\u4EE5\u4F7F\u7528 FB \u7684\u914D\u8272\u65B9\u6848"
          },
          // -- 中國傳統的 (Chinese (Traditional))
          "zh-Hant": {
            LANGUAGE_DIRECTION: "ltr",
            SPONSORED: "\u8D0A\u52A9",
            NF_TABLIST_STORIES_REELS_ROOMS: '"\u9650\u6642\u52D5\u614B | Reels | \u5305\u5EC2" \u5206\u9801\u5217\u8868\u6846',
            NF_STORIES: "\u6545\u4E8B",
            NF_TOP_CARDS_PAGES: "\u9802\u90E8\u5361\u7247\uFF08\u7528\u65BC\u9801\u9762\uFF09",
            NF_HIDE_VERIFIED_BADGE: "\u96B1\u85CF\u5DF2\u9A57\u8B49\u5FBD\u7AE0",
            NF_FILTER_VERIFIED_BADGE: "\u904E\u6FFE\u5DF2\u9A57\u8B49\u5E33\u6236",
            NF_AI_SIDE_PANELS: "\u5074\u908A\u6B04\u4E2D\u7684 AI",
            NF_META_AI: "\u8A66\u7528 Meta AI",
            NF_SURVEY: "\u8ABF\u67E5",
            NF_PEOPLE_YOU_MAY_KNOW: "\u4F60\u53EF\u80FD\u8A8D\u8B58\u7684\u4EBA",
            NF_PAID_PARTNERSHIP: "\u4ED8\u8CBB\u5408\u4F5C",
            NF_SPONSORED_PAID: "\u8D0A\u52A9 \xB7 \u51FA\u8CC7\u8005\uFF1A______",
            NF_SUGGESTIONS: "\u5EFA\u8B70/\u63A8\u85A6",
            NF_FOLLOW: "\u8FFD\u8E64",
            NF_PARTICIPATE: "\u53C3\u8207",
            NF_REELS_SHORT_VIDEOS: "Reels \u548C\u77ED\u5F71\u7247",
            NF_SHORT_REEL_VIDEO: "Reel/\u77ED\u5F71\u7247",
            NF_EVENTS_YOU_MAY_LIKE: "\u4F60\u53EF\u80FD\u611F\u8208\u8DA3\u7684\u6D3B\u52D5",
            NF_ANIMATED_GIFS_POSTS: "\u52D5\u614B GIF",
            NF_ANIMATED_GIFS_PAUSE: "\u66AB\u505C GIF \u52D5\u756B",
            NF_SHARES: "#\u6B21\u5206\u4EAB",
            NF_LIKES_MAXIMUM: "\u6700\u5927\u6309\u8B9A\u6578",
            GF_PAID_PARTNERSHIP: "\u4ED8\u8CBB\u5408\u4F5C",
            GF_SUGGESTIONS: "\u5EFA\u8B70/\u63A8\u85A6",
            GF_SHORT_REEL_VIDEO: "Reel/\u77ED\u5F71\u7247",
            GF_ANIMATED_GIFS_POSTS: "\u52D5\u614B GIF",
            GF_ANIMATED_GIFS_PAUSE: "\u66AB\u505C GIF \u52D5\u756B",
            GF_SHARES: "#\u6B21\u5206\u4EAB",
            VF_LIVE: "\u73FE\u5834\u76F4\u64AD",
            VF_INSTAGRAM: "Instagram",
            VF_DUPLICATE_VIDEOS: "\u91CD\u8907\u8996\u983B",
            VF_ANIMATED_GIFS_PAUSE: "\u66AB\u505C GIF \u52D5\u756B",
            PP_ANIMATED_GIFS_POSTS: "\u52D5\u614B GIF",
            PP_ANIMATED_GIFS_PAUSE: "\u66AB\u505C GIF \u52D5\u756B",
            NF_BLOCKED_FEED: ["\u65B0\u805E\u52D5\u614B\u6D88\u606F", "\u7FA4\u7D44\u52D5\u614B\u6D88\u606F", "\u5F71\u7247\u52D5\u614B\u6D88\u606F"],
            GF_BLOCKED_FEED: ["\u65B0\u805E\u52D5\u614B\u6D88\u606F", "\u7FA4\u7D44\u52D5\u614B\u6D88\u606F", "\u5F71\u7247\u52D5\u614B\u6D88\u606F"],
            VF_BLOCKED_FEED: ["\u65B0\u805E\u52D5\u614B\u6D88\u606F", "\u7FA4\u7D44\u52D5\u614B\u6D88\u606F", "\u5F71\u7247\u52D5\u614B\u6D88\u606F"],
            MP_BLOCKED_FEED: ["Marketplace \u52D5\u614B\u6D88\u606F"],
            PP_BLOCKED_FEED: "",
            OTHER_INFO_BOX_CORONAVIRUS: "\u6B66\u6F22\u80BA\u708E\u75C5\u6BD2\uFF08\u8CC7\u8A0A\u6846\uFF09",
            OTHER_INFO_BOX_CLIMATE_SCIENCE: "\u6C23\u5019\u79D1\u5B78\uFF08\u8CC7\u8A0A\u6846\uFF09",
            OTHER_INFO_BOX_SUBSCRIBE: "\u8A02\u95B1\uFF08\u8CC7\u8A0A\u6846\uFF09",
            REELS_TITLE: "Reels",
            DLG_REELS_DESC: "\u64AD\u653E\u63A7\u5236\u548C\u5FAA\u74B0\u64AD\u653E\u3002",
            REELS_CONTROLS: "\u986F\u793A\u5F71\u7247\u63A7\u5236",
            REELS_DISABLE_LOOPING: "\u505C\u7528\u5FAA\u74B0",
            DLG_TITLE: "\u6E05\u7406\u6211\u7684\u52D5\u614B\u6D88\u606F",
            DLG_NF: "\u65B0\u805E\u52D5\u614B\u6D88\u606F",
            DLG_NF_DESC: "\u6E05\u7406\u5EFA\u8B70\u4E26\u8A2D\u5B9A\u52D5\u614B\u6D88\u606F\u7684\u56B4\u683C\u7A0B\u5EA6\u3002",
            DLG_GF: "\u7FA4\u7D44\u52D5\u614B\u6D88\u606F",
            DLG_GF_DESC: "\u900F\u904E\u6E1B\u5C11\u591A\u9918\u5167\u5BB9\u548C\u566A\u97F3\u4F86\u6574\u7406\u7FA4\u7D44\u52D5\u614B\u3002",
            DLG_VF: "\u5F71\u7247\u52D5\u614B\u6D88\u606F",
            DLG_VF_DESC: "\u900F\u904E\u6E1B\u5C11\u91CD\u8907\u548C\u96DC\u4E82\u5167\u5BB9\uFF0C\u4FDD\u6301\u5F71\u7247\u52D5\u614B\u7684\u5C08\u6CE8\u3002",
            DLG_MP: "Marketplace \u52D5\u614B\u6D88\u606F",
            DLG_MP_DESC: "\u6309\u50F9\u683C\u548C\u60A8\u95DC\u5FC3\u7684\u95DC\u9375\u5B57\u904E\u6FFE\u5217\u8868\u3002",
            DLG_PP: "\u500B\u4EBA\u6A94\u6848 / \u9801\u9762",
            DLG_PP_DESC: "\u8ABF\u6574\u500B\u4EBA\u6A94\u6848\u548C\u9801\u9762\u4E0A\u986F\u793A\u7684\u5167\u5BB9\u3002",
            DLG_OTHER: "\u5176\u4ED6\u8AAA\u660E",
            DLG_OTHER_DESC: "\u96B1\u85CF\u60A8\u4E0D\u9700\u8981\u7684\u984D\u5916\u6846\u3002",
            DLG_BLOCK_TEXT_FILTER_TITLE: "\u6587\u5B57\u904E\u6FFE\u5668",
            DLG_BLOCK_NEW_LINE: "(\u4F7F\u7528\u63DB\u884C\u7B26\u5206\u9694\u55AE\u8A5E\u6216\u77ED\u8A9E\uFF0C\u652F\u6301\u6B63\u5247\u8868\u9054\u5F0F)",
            NF_BLOCKED_ENABLED: "\u555F\u7528",
            GF_BLOCKED_ENABLED: "\u555F\u7528",
            VF_BLOCKED_ENABLED: "\u555F\u7528",
            MP_BLOCKED_ENABLED: "\u555F\u7528",
            PP_BLOCKED_ENABLED: "\u555F\u7528",
            NF_BLOCKED_RE: "\u6B63\u5247\u8868\u9054\u5F0F (RegExp)",
            GF_BLOCKED_RE: "\u6B63\u5247\u8868\u9054\u5F0F (RegExp)",
            VF_BLOCKED_RE: "\u6B63\u5247\u8868\u9054\u5F0F (RegExp)",
            MP_BLOCKED_RE: "\u6B63\u5247\u8868\u9054\u5F0F (RegExp)",
            PP_BLOCKED_RE: "\u6B63\u5247\u8868\u9054\u5F0F (RegExp)",
            DLG_VERBOSITY: "\u96B1\u85CF\u5E16\u5B50\u9078\u9805",
            DLG_PREFERENCES: "\u504F\u597D\u8A2D\u5B9A",
            DLG_PREFERENCES_DESC: "\u6A19\u7C64\u3001\u4F4D\u7F6E\u3001\u984F\u8272\u548C\u8A9E\u8A00\u3002",
            DLG_VERBOSITY_CAPTION: "\u5982\u679C\u6587\u7AE0\u88AB\u96B1\u85CF\uFF0C\u5247\u986F\u793A\u6A19\u7C64",
            DLG_REPORT_BUG: "\u56DE\u5831\u932F\u8AA4",
            DLG_REPORT_BUG_DESC: "\u7522\u751F\u554F\u984C\u8A3A\u65B7\u5831\u544A\u3002",
            DLG_REPORT_BUG_NOTICE: "\u5354\u52A9\u6211\u5011\u4FEE\u5FA9\u5B83\uFF1A\n1. \u6372\u52D5\u9801\u9762\u4EE5\u4F7F\u6709\u554F\u984C\u7684\u8CBC\u6587\u53EF\u898B\u3002\n2. \u9EDE\u64CA\u300C\u751F\u6210\u5831\u544A\u300D\uFF0C\u7136\u5F8C\u9EDE\u64CA\u300C\u8907\u88FD\u5831\u544A\u300D\u3002\n3. \u9EDE\u64CA\u300C\u958B\u555F Issue\u300D\u4E26\u5C07\u5831\u544A\u8CBC\u4E0A\u5230\u65B0\u7684 Issue \u4E2D\u3002\n4. \u65B0\u589E\u7C21\u77ED\u7684\u554F\u984C\u63CF\u8FF0\u3002\n(\u6211\u5011\u6703\u96B1\u85CF\u59D3\u540D/\u6587\u5B57\uFF0C\u4F46\u5728\u5206\u4EAB\u524D\u8ACB\u52D9\u5FC5\u6AA2\u67E5\uFF01)",
            DLG_REPORT_BUG_GENERATE: "\u751F\u6210\u5831\u544A",
            DLG_REPORT_BUG_COPY: "\u8907\u88FD\u5831\u544A",
            DLG_REPORT_BUG_OPEN_ISSUES: "\u958B\u555F Issue",
            DLG_REPORT_BUG_STATUS_READY: "\u5831\u544A\u5C31\u7DD2\u3002",
            DLG_REPORT_BUG_STATUS_COPIED: "\u5831\u544A\u5DF2\u8907\u88FD\u5230\u526A\u8CBC\u7C3F\u3002",
            DLG_REPORT_BUG_STATUS_FAILED: "\u8907\u88FD\u5931\u6557\u3002\u8ACB\u624B\u52D5\u8907\u88FD\u3002",
            VERBOSITY_MESSAGE: [
              "\u6C92\u6709\u6A19\u7C64",
              "\u5E16\u5B50\u5DF2\u96B1\u85CF\u3002\u898F\u5247\uFF1A",
              " \u500B\u5E16\u5B50\u5DF2\u96B1\u85CF",
              "7\u500B\u5E16\u5B50\u5DF2\u96B1\u85CF ~ (\u50C5\u9069\u7528\u65BC\u7FA4\u7D44\u52D5\u614B)"
            ],
            VERBOSITY_MESSAGE_COLOUR: "\u6587\u5B57\u984F\u8272",
            VERBOSITY_MESSAGE_BG_COLOUR: "\u80CC\u666F\u984F\u8272",
            VERBOSITY_DEBUG: "\u5F37\u8ABF\u986F\u793A\u300C\u96B1\u85CF\u300D\u7684\u8CBC\u6587",
            CMF_CUSTOMISATIONS: "\u5BA2\u88FD\u5316",
            CMF_BTN_LOCATION: "CMF \u6309\u9215\u4F4D\u7F6E\uFF1A",
            CMF_BTN_OPTION: ["\u5DE6\u4E0B\u65B9", "\u53F3\u4E0A\u65B9", "\u7981\u7528\uFF08\u5728\u7528\u6237\u811A\u672C\u547D\u4EE4\u83DC\u5355\u4E2D\u4F7F\u7528\u201C\u8BBE\u7F6E\u201D\uFF09"],
            CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds \u8A9E\u8A00\uFF1A",
            CMF_DIALOG_LANGUAGE: "\u4E2D\u6587\uFF08\u7E41\u9AD4\uFF09",
            CMF_DIALOG_LANGUAGE_DEFAULT: "\u4F7F\u7528\u7DB2\u7AD9\u8A9E\u8A00",
            GM_MENU_SETTINGS: "\u8A2D\u7F6E",
            CMF_DIALOG_LOCATION: "\u6B64\u9078\u55AE\u7684\u4F4D\u7F6E\uFF1A",
            CMF_DIALOG_OPTION: ["\u5DE6\u908A", "\u53F3\u908A"],
            CMF_BORDER_COLOUR: "\u908A\u6846\u984F\u8272",
            DLG_TIPS: "\u95DC\u65BC",
            DLG_TIPS_DESC: "\u5C08\u6848\u9023\u7D50\u548C\u7DAD\u8B77\u8005\u8CC7\u8A0A\u3002",
            DLG_TIPS_CONTENT: "",
            DLG_TIPS_STAR: "\u5982\u679C\u6709\u5E6B\u52A9\uFF0C\u5728 {github} \u9EDE\u500B\u661F\u5C0D\u6211\u610F\u7FA9\u5F88\u5927\u3002",
            DLG_TIPS_FACEBOOK: "\u6B61\u8FCE\u5230{facebook}\u6253\u500B\u62DB\u547C - \u6211\u5728\u90A3\u88E1\u5206\u4EAB\u85DD\u8853\u548C\u8A69\u3002",
            DLG_TIPS_SITE: "\u60F3\u770B\u770B\u6211\u5728\u7DB2\u8DEF\u4E0A\u90FD\u5728\u505A\u4EC0\u9EBC\uFF0C{site}\u662F\u6700\u597D\u7684\u8D77\u9EDE\u3002",
            DLG_TIPS_CREDITS: "\u7279\u5225\u611F\u8B1D {zbluebugz} \u7684\u539F\u59CB\u5C08\u6848\uFF0C\u4EE5\u53CA {trinhquocviet} \u7684\u7C21\u5316 UI \u5206\u652F\uFF08\u6211\u6700\u521D\u5C31\u662F\u5F9E\u5B83 fork \u7684\uFF09- \u4E5F\u611F\u8B1D\u90A3\u6BB5\u6642\u9593\u7684\u904E\u6FFE\u7DAD\u8B77\u3002",
            DLG_TIPS_MAINTAINER: "\u5E0C\u671B\u9019\u500B\u8173\u672C\u80FD\u5E6B\u4F60\u627E\u56DE\u6E05\u723D\u7684\u52D5\u614B\u6D88\u606F\u3002\u6211\u627F\u8AFE\u5C07\u662F\u4F60\u5C0D\u6297\u4E0D\u60F3\u770B\u5230\u7684\u7DB2\u8DEF\u5167\u5BB9\u7684\u76DF\u53CB\u3002",
            DLG_TIPS_LINK_REPO: "GitHub",
            DLG_TIPS_LINK_FACEBOOK: "\u6211\u7684 Facebook",
            DLG_TIPS_LINK_SITE: "\u6211\u7684\u7DB2\u7AD9",
            DLG_TIPS_THANKS: "",
            DLG_BUTTONS: ["\u5132\u5B58", "\u95DC\u9589", "\u532F\u51FA", "\u532F\u5165", "\u91CD\u8A2D"],
            DLG_BUTTON_TOOLTIPS: [
              "\u5132\u5B58\u5728\u6B64\u700F\u89BD\u5668\u3002\u6E05\u9664\u7DB2\u7AD9\u8CC7\u6599/\u79C1\u5BC6\u6A21\u5F0F\u6703\u907A\u5931\u3002",
              "\u532F\u51FA\u5099\u4EFD\u6A94\u4EE5\u4FDD\u7559\u8A2D\u5B9A\u4E26\u5728\u88DD\u7F6E\u9593\u79FB\u8F49\u3002",
              "\u532F\u5165\u8A2D\u5B9A\u6A94\u4EE5\u9084\u539F\u6216\u79FB\u8F49\u3002",
              "\u5C07\u6240\u6709\u8A2D\u5B9A\u91CD\u8A2D\u70BA\u9810\u8A2D\u503C\u3002"
            ],
            DLG_FB_COLOUR_HINT: "\u7559\u7A7A\u4EE5\u4F7F\u7528 FB \u7684\u914D\u8272\u65B9\u6848"
          }
        },
        defaults: {
          SPONSORED: true,
          NF_TABLIST_STORIES_REELS_ROOMS: false,
          NF_STORIES: false,
          NF_SURVEY: true,
          NF_PEOPLE_YOU_MAY_KNOW: false,
          NF_PAID_PARTNERSHIP: true,
          NF_SPONSORED_PAID: true,
          NF_SUGGESTIONS: true,
          NF_FOLLOW: true,
          NF_PARTICIPATE: true,
          NF_REELS_SHORT_VIDEOS: false,
          NF_SHORT_REEL_VIDEO: false,
          NF_META_AI: true,
          NF_EVENTS_YOU_MAY_LIKE: true,
          NF_ANIMATED_GIFS_POSTS: false,
          NF_ANIMATED_GIFS_PAUSE: false,
          NF_SHARES: false,
          NF_LIKES_MAXIMUM: false,
          NF_TOP_CARDS_PAGES: false,
          NF_HIDE_VERIFIED_BADGE: false,
          NF_FILTER_VERIFIED_BADGE: false,
          NF_AI_SIDE_PANELS: false,
          GF_PAID_PARTNERSHIP: true,
          GF_SUGGESTIONS: false,
          GF_SHORT_REEL_VIDEO: false,
          GF_ANIMATED_GIFS_POSTS: false,
          GF_ANIMATED_GIFS_PAUSE: false,
          GF_SHARES: false,
          VF_LIVE: false,
          VF_INSTAGRAM: false,
          VF_DUPLICATE_VIDEOS: false,
          VF_ANIMATED_GIFS_PAUSE: false,
          PP_ANIMATED_GIFS_POSTS: false,
          PP_ANIMATED_GIFS_PAUSE: false,
          NF_BLOCKED_FEED: ["1", "0", "0"],
          GF_BLOCKED_FEED: ["0", "1", "0"],
          VF_BLOCKED_FEED: ["0", "0", "1"],
          MP_BLOCKED_FEED: ["1", "0", "0"],
          PP_BLOCKED_FEED: ["1", "0", "0"],
          OTHER_INFO_BOX_CORONAVIRUS: false,
          OTHER_INFO_BOX_CLIMATE_SCIENCE: false,
          OTHER_INFO_BOX_SUBSCRIBE: false,
          REELS_CONTROLS: true,
          REELS_DISABLE_LOOPING: true,
          NF_BLOCKED_ENABLED: false,
          GF_BLOCKED_ENABLED: false,
          VF_BLOCKED_ENABLED: false,
          MP_BLOCKED_ENABLED: false,
          PP_BLOCKED_ENABLED: false,
          NF_BLOCKED_RE: false,
          GF_BLOCKED_RE: false,
          VF_BLOCKED_RE: false,
          MP_BLOCKED_RE: false,
          PP_BLOCKED_RE: false,
          DLG_VERBOSITY: "0",
          VERBOSITY_DEBUG: false,
          VERBOSITY_MESSAGE_BG_COLOUR: "LightGrey",
          CMF_BTN_OPTION: "1",
          CMF_DIALOG_OPTION: "0",
          CMF_BORDER_COLOUR: "OrangeRed"
        },
        pathInfo: {
          OTHER_INFO_BOX_CORONAVIRUS: "/coronavirus_info/",
          OTHER_INFO_BOX_CLIMATE_SCIENCE: "/climatescienceinfo/",
          OTHER_INFO_BOX_SUBSCRIBE: "/support/"
        }
      };
    }
  });

  // src/core/state/vars.js
  var require_vars = __commonJS({
    "src/core/state/vars.js"(exports, module) {
      var SEPARATOR = "\u0130\u0130";
      function createState() {
        return {
          SEP: SEPARATOR,
          scanCountStart: 0,
          scanCountMaxLoop: 15,
          noChangeCounter: 0,
          options: {},
          optionsReady: false,
          language: "",
          filters: {},
          hideAnInfoBox: false,
          dictionarySponsored: [],
          dictionaryReelsAndShortVideos: [],
          dictionaryFollow: [],
          isNF: false,
          isGF: false,
          isVF: false,
          isMF: false,
          isAF: false,
          isSF: false,
          isRF: false,
          isPP: false,
          isRF_InTimeoutMode: false,
          gfType: "",
          vfType: "",
          mpType: "",
          prevURL: "",
          prevPathname: "",
          prevQuery: "",
          echoEl: null,
          echoElFirstNote: null,
          echoElCreatedCount: 0,
          echoELFirstPost: null,
          echoCount: 0,
          echoCPID: "",
          isDarkMode: null,
          cssID: "",
          cssOID: "",
          tempStyleSheetCode: "",
          hideAtt: "",
          showAtt: "",
          hideWithNoCaptionAtt: "",
          cssHideEl: "",
          cssEcho: "",
          cssHideNumberOfShares: "",
          btnToggleEl: null,
          iconClose: "",
          iconToggleHTML: "",
          iconDialogHeaderHTML: "",
          iconDialogSearchHTML: "",
          iconDialogFooterHTML: "",
          iconFooterSaveHTML: "",
          iconFooterCheckHTML: "",
          iconLegendHTML: "",
          dialogSectionIcons: {},
          dialogFooterIcons: {},
          iconNewWindow: "",
          iconNewWindowClass: "cmf-link-new",
          isChromium: false,
          saveFeedbackTimeoutId: null
        };
      }
      module.exports = {
        SEPARATOR,
        createState
      };
    }
  });

  // src/core/options/defaults.js
  var require_defaults = __commonJS({
    "src/core/options/defaults.js"(exports, module) {
      var { defaults } = require_translations();
      module.exports = {
        defaults
      };
    }
  });

  // src/core/options/hydrate.js
  var require_hydrate = __commonJS({
    "src/core/options/hydrate.js"(exports, module) {
      var { translations } = require_translations();
      var { SEPARATOR } = require_vars();
      var { defaults } = require_defaults();
      function cloneKeywords(language) {
        const baseKeywords = { ...translations.en };
        if (language && translations[language]) {
          return { ...baseKeywords, ...translations[language] };
        }
        return baseKeywords;
      }
      function resolveLanguage(options, siteLanguage) {
        const lang = siteLanguage || "en";
        if (!Object.prototype.hasOwnProperty.call(options, "CMF_DIALOG_LANGUAGE")) {
          return Object.prototype.hasOwnProperty.call(translations, lang) ? lang : "en";
        }
        const uiLang = options.CMF_DIALOG_LANGUAGE || "en";
        if (Object.prototype.hasOwnProperty.call(translations, uiLang)) {
          return uiLang;
        }
        if (Object.prototype.hasOwnProperty.call(translations, lang)) {
          return lang;
        }
        return lang;
      }
      function applyOptionDefaults(options, keyWords) {
        let hideAnInfoBox = false;
        if (!Object.prototype.hasOwnProperty.call(options, "NF_SPONSORED")) {
          options.NF_SPONSORED = defaults.SPONSORED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "GF_SPONSORED")) {
          options.GF_SPONSORED = defaults.SPONSORED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "VF_SPONSORED")) {
          options.VF_SPONSORED = defaults.SPONSORED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "MP_SPONSORED")) {
          options.MP_SPONSORED = defaults.SPONSORED;
        }
        for (const key of Object.keys(keyWords)) {
          if (key.startsWith("NF_") && !key.startsWith("NF_BLOCKED")) {
            if (!Object.prototype.hasOwnProperty.call(options, key)) {
              options[key] = defaults[key];
            }
          } else if (key.startsWith("GF_") && !key.startsWith("GF_BLOCKED")) {
            if (!Object.prototype.hasOwnProperty.call(options, key)) {
              options[key] = defaults[key];
            }
          } else if (key.startsWith("VF_") && !key.startsWith("VF_BLOCKED")) {
            if (!Object.prototype.hasOwnProperty.call(options, key)) {
              options[key] = defaults[key];
            }
          } else if (key.startsWith("MP_") && !key.startsWith("MP_BLOCKED")) {
            if (!Object.prototype.hasOwnProperty.call(options, key)) {
              options[key] = defaults[key];
            }
          } else if (key.startsWith("PP_") && !key.startsWith("PP_BLOCKED")) {
            if (!Object.prototype.hasOwnProperty.call(options, key)) {
              options[key] = defaults[key];
            }
          } else if (key.startsWith("OTHER_INFO")) {
            if (!Object.prototype.hasOwnProperty.call(options, key)) {
              options[key] = defaults[key];
            }
            if (options[key]) {
              hideAnInfoBox = true;
            }
          }
        }
        if (!Object.prototype.hasOwnProperty.call(options, "NF_BLOCKED_ENABLED")) {
          options.NF_BLOCKED_ENABLED = defaults.NF_BLOCKED_ENABLED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "NF_BLOCKED_FEED")) {
          options.NF_BLOCKED_FEED = defaults.NF_BLOCKED_FEED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "NF_BLOCKED_TEXT")) {
          options.NF_BLOCKED_TEXT = "";
        }
        if (!Object.prototype.hasOwnProperty.call(options, "GF_BLOCKED_ENABLED")) {
          options.GF_BLOCKED_ENABLED = defaults.GF_BLOCKED_ENABLED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "GF_BLOCKED_FEED")) {
          options.GF_BLOCKED_FEED = defaults.GF_BLOCKED_FEED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "GF_BLOCKED_TEXT")) {
          options.GF_BLOCKED_TEXT = "";
        }
        if (!Object.prototype.hasOwnProperty.call(options, "VF_BLOCKED_ENABLED")) {
          options.VF_BLOCKED_ENABLED = defaults.VF_BLOCKED_ENABLED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "VF_BLOCKED_FEED")) {
          options.VF_BLOCKED_FEED = defaults.VF_BLOCKED_FEED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "VF_BLOCKED_TEXT")) {
          options.VF_BLOCKED_TEXT = "";
        }
        if (!Object.prototype.hasOwnProperty.call(options, "MP_BLOCKED_ENABLED")) {
          options.MP_BLOCKED_ENABLED = defaults.MP_BLOCKED_ENABLED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "MP_BLOCKED_FEED")) {
          options.MP_BLOCKED_FEED = defaults.MP_BLOCKED_FEED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "MP_BLOCKED_TEXT")) {
          options.MP_BLOCKED_TEXT = "";
        }
        if (!Object.prototype.hasOwnProperty.call(options, "MP_BLOCKED_TEXT_DESCRIPTION")) {
          options.MP_BLOCKED_TEXT_DESCRIPTION = "";
        }
        if (!Object.prototype.hasOwnProperty.call(options, "PP_BLOCKED_ENABLED")) {
          options.PP_BLOCKED_ENABLED = defaults.PP_BLOCKED_ENABLED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "PP_BLOCKED_FEED")) {
          options.PP_BLOCKED_FEED = defaults.PP_BLOCKED_FEED;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "PP_BLOCKED_TEXT")) {
          options.PP_BLOCKED_TEXT = "";
        }
        if (!Object.prototype.hasOwnProperty.call(options, "VERBOSITY_LEVEL")) {
          options.VERBOSITY_LEVEL = defaults.DLG_VERBOSITY;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "VERBOSITY_MESSAGE_COLOUR")) {
          options.VERBOSITY_MESSAGE_COLOUR = "";
        }
        if (!Object.prototype.hasOwnProperty.call(options, "VERBOSITY_MESSAGE_BG_COLOUR") || options.VERBOSITY_MESSAGE_BG_COLOUR === void 0 || options.VERBOSITY_MESSAGE_BG_COLOUR.toString() === "") {
          options.VERBOSITY_MESSAGE_BG_COLOUR = defaults.VERBOSITY_MESSAGE_BG_COLOUR;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "VERBOSITY_DEBUG") || options.VERBOSITY_DEBUG === void 0 || options.VERBOSITY_DEBUG.toString() === "") {
          options.VERBOSITY_DEBUG = defaults.VERBOSITY_DEBUG;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "CMF_BTN_OPTION")) {
          options.CMF_BTN_OPTION = defaults.CMF_BTN_OPTION;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "CMF_DIALOG_OPTION")) {
          options.CMF_DIALOG_OPTION = defaults.CMF_DIALOG_OPTION;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "CMF_BORDER_COLOUR") || options.CMF_BORDER_COLOUR.toString() === void 0 || options.CMF_BORDER_COLOUR.toString() === "") {
          options.CMF_BORDER_COLOUR = defaults.CMF_BORDER_COLOUR;
        }
        if (!Object.prototype.hasOwnProperty.call(options, "NF_LIKES_MAXIMUM_COUNT")) {
          options.NF_LIKES_MAXIMUM_COUNT = "";
        }
        return hideAnInfoBox;
      }
      function buildFilters(options, separator = SEPARATOR) {
        const filters = {};
        let nfBlockedText = "";
        let gfBlockedText = "";
        let vfBlockedText = "";
        let ppBlockedText = "";
        let mpBlockedText = "";
        let mpBlockedTextDesc = "";
        if (options.NF_BLOCKED_ENABLED === true) {
          nfBlockedText = options.NF_BLOCKED_TEXT;
        }
        if (options.GF_BLOCKED_ENABLED === true) {
          gfBlockedText = options.GF_BLOCKED_TEXT;
        }
        if (options.VF_BLOCKED_ENABLED === true) {
          vfBlockedText = options.VF_BLOCKED_TEXT;
        }
        if (options.MP_BLOCKED_ENABLED === true) {
          mpBlockedText = options.MP_BLOCKED_TEXT;
          mpBlockedTextDesc = options.MP_BLOCKED_TEXT_DESCRIPTION;
        }
        if (options.PP_BLOCKED_ENABLED === true) {
          ppBlockedText = options.PP_BLOCKED_TEXT;
        }
        let nfBlockedTextList = "";
        let gfBlockedTextList = "";
        let vfBlockedTextList = "";
        let ppBlockedTextList = "";
        let mpBlockedTextList = "";
        let mpBlockedTextDescList = "";
        if (options.NF_BLOCKED_ENABLED) {
          nfBlockedTextList = nfBlockedText;
          if (options.GF_BLOCKED_ENABLED && options.GF_BLOCKED_FEED[0] === "1") {
            if (gfBlockedText.length > 0) {
              nfBlockedTextList += (nfBlockedTextList.length > 0 ? separator : "") + gfBlockedText;
            }
          }
          if (options.VF_BLOCKED_ENABLED && options.VF_BLOCKED_FEED[0] === "1") {
            if (vfBlockedText.length > 0) {
              nfBlockedTextList += (nfBlockedTextList.length > 0 ? separator : "") + vfBlockedText;
            }
          }
        }
        if (options.GF_BLOCKED_ENABLED) {
          gfBlockedTextList = gfBlockedText;
          if (options.NF_BLOCKED_ENABLED && options.NF_BLOCKED_FEED[1] === "1") {
            if (nfBlockedText.length > 0) {
              gfBlockedTextList += (gfBlockedTextList.length > 0 ? separator : "") + nfBlockedText;
            }
          }
          if (options.VF_BLOCKED_ENABLED && options.VF_BLOCKED_FEED[1] === "1") {
            if (vfBlockedText.length > 0) {
              gfBlockedTextList += (gfBlockedTextList.length > 0 ? separator : "") + vfBlockedText;
            }
          }
        }
        if (options.VF_BLOCKED_ENABLED) {
          vfBlockedTextList = vfBlockedText;
          if (options.NF_BLOCKED_ENABLED && options.NF_BLOCKED_FEED[2] === "1") {
            if (nfBlockedText.length > 0) {
              vfBlockedTextList += (vfBlockedTextList.length > 0 ? separator : "") + nfBlockedText;
            }
          }
          if (options.GF_BLOCKED_ENABLED && options.GF_BLOCKED_FEED[2] === "1") {
            if (gfBlockedText.length > 0) {
              vfBlockedTextList += (vfBlockedTextList.length > 0 ? separator : "") + gfBlockedText;
            }
          }
        }
        if (options.MP_BLOCKED_ENABLED) {
          mpBlockedTextList = mpBlockedText;
          mpBlockedTextDescList = mpBlockedTextDesc;
        }
        if (options.PP_BLOCKED_ENABLED) {
          ppBlockedTextList = ppBlockedText;
        }
        filters.NF_BLOCKED_TEXT = [];
        filters.NF_BLOCKED_TEXT_LC = [];
        filters.NF_BLOCKED_ENABLED = false;
        if (options.NF_BLOCKED_ENABLED && nfBlockedTextList.length > 0) {
          filters.NF_BLOCKED_ENABLED = true;
          filters.NF_BLOCKED_TEXT = nfBlockedTextList.split(separator);
          filters.NF_BLOCKED_TEXT_LC = filters.NF_BLOCKED_TEXT.map((text) => text.toLowerCase());
        }
        filters.GF_BLOCKED_TEXT = [];
        filters.GF_BLOCKED_TEXT_LC = [];
        filters.GF_BLOCKED_ENABLED = false;
        if (options.GF_BLOCKED_ENABLED && gfBlockedTextList.length > 0) {
          filters.GF_BLOCKED_ENABLED = true;
          filters.GF_BLOCKED_TEXT = gfBlockedTextList.split(separator);
          filters.GF_BLOCKED_TEXT_LC = filters.GF_BLOCKED_TEXT.map((text) => text.toLowerCase());
        }
        filters.VF_BLOCKED_TEXT = [];
        filters.VF_BLOCKED_TEXT_LC = [];
        filters.VF_BLOCKED_ENABLED = false;
        if (options.VF_BLOCKED_ENABLED && vfBlockedTextList.length > 0) {
          filters.VF_BLOCKED_ENABLED = true;
          filters.VF_BLOCKED_TEXT = vfBlockedTextList.split(separator);
          filters.VF_BLOCKED_TEXT_LC = filters.VF_BLOCKED_TEXT.map((text) => text.toLowerCase());
        }
        filters.MP_BLOCKED_TEXT = [];
        filters.MP_BLOCKED_TEXT_LC = [];
        filters.MP_BLOCKED_TEXT_DESCRIPTION = [];
        filters.MP_BLOCKED_TEXT_DESCRIPTION_LC = [];
        filters.MP_BLOCKED_ENABLED = false;
        if (options.MP_BLOCKED_ENABLED && (mpBlockedTextList.length > 0 || mpBlockedTextDescList.length > 0)) {
          filters.MP_BLOCKED_ENABLED = true;
          filters.MP_BLOCKED_TEXT = mpBlockedTextList.split(separator);
          filters.MP_BLOCKED_TEXT_LC = filters.MP_BLOCKED_TEXT.map((text) => text.toLowerCase());
          filters.MP_BLOCKED_TEXT_DESCRIPTION = mpBlockedTextDescList.split(separator);
          filters.MP_BLOCKED_TEXT_DESCRIPTION_LC = filters.MP_BLOCKED_TEXT_DESCRIPTION.map(
            (text) => text.toLowerCase()
          );
        }
        filters.PP_BLOCKED_TEXT = [];
        filters.PP_BLOCKED_TEXT_LC = [];
        filters.PP_BLOCKED_ENABLED = false;
        if (options.PP_BLOCKED_ENABLED && ppBlockedTextList.length > 0) {
          filters.PP_BLOCKED_ENABLED = true;
          filters.PP_BLOCKED_TEXT = ppBlockedTextList.split(separator);
          filters.PP_BLOCKED_TEXT_LC = filters.PP_BLOCKED_TEXT.map((text) => text.toLowerCase());
        }
        return filters;
      }
      function hydrateOptions(storedOptions = {}, siteLanguage = "en") {
        const options = { ...storedOptions };
        const language = resolveLanguage(options, siteLanguage);
        options.CMF_DIALOG_LANGUAGE = language;
        const keyWords = cloneKeywords(language);
        const hideAnInfoBox = applyOptionDefaults(options, keyWords);
        const filters = buildFilters(options);
        return {
          options,
          filters,
          language,
          hideAnInfoBox,
          keyWords
        };
      }
      module.exports = {
        applyOptionDefaults,
        buildFilters,
        cloneKeywords,
        hydrateOptions,
        resolveLanguage
      };
    }
  });

  // src/utils/random.js
  var require_random = __commonJS({
    "src/utils/random.js"(exports, module) {
      function generateRandomString(length = 13) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const firstChar = chars.charAt(Math.floor(Math.random() * 52));
        const strArray = [firstChar];
        for (let i = 1; i < length; i += 1) {
          strArray.push(chars.charAt(Math.floor(Math.random() * chars.length)));
        }
        return strArray.join("");
      }
      module.exports = {
        generateRandomString
      };
    }
  });

  // src/dom/attributes.js
  var require_attributes = __commonJS({
    "src/dom/attributes.js"(exports, module) {
      var { generateRandomString } = require_random();
      var postAtt = "cmfr";
      var postAttCPID = "cmfcpid";
      var postPropDS = "cmfDusted";
      var postAttChildFlag = "cmfcf";
      var postAttTab = "cmftsb";
      var postAttMPSkip = "cmfsmp";
      var rvAtt = "cmfrv";
      var mainColumnAtt = "cmfmc";
      function initializeRuntimeAttributes(state) {
        if (!state) {
          return;
        }
        state.hideAtt = generateRandomString();
        state.hideWithNoCaptionAtt = generateRandomString();
        state.showAtt = generateRandomString();
        state.cssHideEl = generateRandomString();
        state.cssHideNumberOfShares = generateRandomString();
        state.cssHideVerifiedBadge = generateRandomString();
      }
      module.exports = {
        initializeRuntimeAttributes,
        mainColumnAtt,
        postAtt,
        postAttCPID,
        postAttChildFlag,
        postAttMPSkip,
        postAttTab,
        postPropDS,
        rvAtt
      };
    }
  });

  // src/dom/styles.js
  var require_styles = __commonJS({
    "src/dom/styles.js"(exports, module) {
      var { generateRandomString } = require_random();
      var { postAtt, postAttTab } = require_attributes();
      function ensureStyleTag(id, doc = document) {
        if (!doc || typeof doc.getElementById !== "function") {
          return null;
        }
        let styleTag = doc.getElementById(id);
        if (!styleTag) {
          styleTag = doc.createElement("style");
          styleTag.setAttribute("type", "text/css");
          styleTag.setAttribute("id", id);
        }
        if (!styleTag.isConnected) {
          const mountTarget = doc.head || doc.documentElement;
          if (mountTarget && typeof mountTarget.appendChild === "function") {
            mountTarget.appendChild(styleTag);
          }
        }
        return styleTag;
      }
      function addToSS(state, classes, styles) {
        const listOfClasses = classes.split(",").filter((entry) => entry.trim()).map((entry) => entry.trim());
        let styleLines = styles.split(";").filter((entry) => entry.trim());
        styleLines = styleLines.map((entry) => {
          const temp2 = entry.split(":");
          return `    ${temp2[0].trim()}:${temp2[1].trim()}`;
        });
        let temp = `${listOfClasses.join(",\n")} {
`;
        temp += `${styleLines.join(";\n")};
`;
        temp += "}\n";
        state.tempStyleSheetCode += temp;
      }
      function addCSS(state, options, defaults) {
        if (!state || !options || !defaults) {
          return null;
        }
        let styleTag;
        let isNewCSS = true;
        if (state.cssID !== "") {
          styleTag = document.getElementById(state.cssID);
          if (styleTag) {
            styleTag.replaceChildren();
            isNewCSS = false;
          }
        }
        if (isNewCSS) {
          state.cssID = generateRandomString().toUpperCase();
          styleTag = ensureStyleTag(state.cssID);
        }
        if (!styleTag) {
          return null;
        }
        state.tempStyleSheetCode = "";
        addToSS(
          state,
          'body > div[style*="position: absolute"], body > div[style*="position:absolute"]',
          "top: -1000000px !important;"
        );
        addToSS(
          state,
          `div[${state.hideAtt}]`,
          "display:none !important; max-height: 0 !important; height: 0 !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; border: 0 !important; overflow: hidden !important; opacity: 0 !important; pointer-events: none !important;"
        );
        addToSS(
          state,
          `details[${postAtt}][open] > div, details[${postAtt}][open] > span > div, div[${state.showAtt}]:not([id="fbcmf"]):not(.fb-cmf-toggle):not(.fb-cmf-toggle-wrapper)`,
          `display:block !important; height: auto !important; min-height: auto !important; max-height: 10000px; overflow: auto; margin-bottom:1rem !important; opacity: 1 !important; pointer-events: auto !important;border:3px dotted ${options.CMF_BORDER_COLOUR} !important; border-radius:8px; padding:0.2rem 0.1rem 0.1rem 0.1rem;`
        );
        addToSS(
          state,
          `details[${postAtt}] > summary`,
          "cursor: pointer; list-style: none; position: relative; margin:1.5rem auto; padding:0.5rem 1rem; border-radius:0.55rem; width:85%; font-style:italic;" + (options.VERBOSITY_MESSAGE_COLOUR === "" ? "" : ` color: ${options.VERBOSITY_MESSAGE_COLOUR}; `) + `background-color:${options.VERBOSITY_MESSAGE_BG_COLOUR === "" ? defaults.VERBOSITY_MESSAGE_BG_COLOUR : options.VERBOSITY_MESSAGE_BG_COLOUR};`
        );
        addToSS(
          state,
          `details[${postAtt}] > summary:hover`,
          "text-decoration: underline; background-color:white; color:black;"
        );
        addToSS(
          state,
          `details[${postAtt}] > summary::after`,
          "background: darkgrey; color: white; border-radius: 50%; width: 24px; height: 24px; line-height: 20px; font-size: 1rem; font-weight: bold; transform: translateY(-50%); text-align: center; position: absolute; top: 1rem; right: 0.25rem;"
        );
        addToSS(state, `details[${postAtt}] > summary::after`, 'content:"\\002B";');
        addToSS(state, `details[${postAtt}][open] > summary::after`, 'content: "\\2212";');
        addToSS(state, `details[${postAtt}][open]`, "margin-bottom: 1rem;");
        addToSS(state, `details[${postAtt}][open] > summary`, "margin-bottom: 0.5rem;");
        addToSS(
          state,
          `div[${state.hideWithNoCaptionAtt}],span[${state.hideWithNoCaptionAtt}]`,
          "display: none;"
        );
        addToSS(
          state,
          `div[${state.hideWithNoCaptionAtt}][${state.showAtt}], span[${state.hideWithNoCaptionAtt}][${state.showAtt}]`,
          "display: block;"
        );
        addToSS(
          state,
          `h6[${postAttTab}]`,
          "border-radius: 0.55rem 0.55rem 0 0; width:75%; margin:0 auto; padding: 0.45rem 0.25rem; font-style:italic; text-align:center; font-weight:normal;" + (options.VERBOSITY_MESSAGE_COLOUR === "" ? "" : `  color: ${options.VERBOSITY_MESSAGE_COLOUR}; `) + `background-color:${options.VERBOSITY_MESSAGE_BG_COLOUR === "" ? defaults.VERBOSITY_MESSAGE_BG_COLOUR : options.VERBOSITY_MESSAGE_BG_COLOUR}; `
        );
        addToSS(state, `[${state.cssHideNumberOfShares}]`, "display:none !important;");
        addToSS(state, `[${state.cssHideVerifiedBadge}]`, "display:none !important;");
        addToSS(
          state,
          `h4 [${state.cssHideVerifiedBadge}]`,
          "margin:0 !important; padding:0 !important; width:0 !important; height:0 !important;"
        );
        const tColour = "var(--primary-text)";
        addToSS(
          state,
          ".fb-cmf ",
          "position:fixed; top:56px; bottom:16px; left:16px; display:flex; flex-direction:column; width: 608px; max-width:608px; padding:0.75rem; z-index:5;box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1); overflow:hidden;border:none; border-radius:12px; opacity:0; visibility:hidden; color:" + tColour + ";"
        );
        addToSS(state, ".fb-cmf", "background-color: var(--comment-background);");
        addToSS(state, ".fb-cmf", "-webkit-user-select: none; -ms-user-select: none; user-select: none;");
        addToSS(
          state,
          '.fb-cmf input, .fb-cmf textarea, .fb-cmf [contenteditable="true"]',
          "-webkit-user-select: text; -ms-user-select: text; user-select: text;"
        );
        addToSS(
          state,
          ".cmf-icon",
          "display:inline-block; width:20px; height:20px; background-color: currentColor;mask-image: var(--cmf-icon-url); mask-repeat:no-repeat; mask-position:center; mask-size:contain;-webkit-mask-image: var(--cmf-icon-url); -webkit-mask-repeat:no-repeat; -webkit-mask-position:center; -webkit-mask-size:contain;"
        );
        addToSS(
          state,
          ".fb-cmf-tooltip",
          "position:fixed; z-index:9999; pointer-events:none;background-color: var(--tooltip-background, rgba(255, 255, 255, 0.8));color: var(--primary-text, rgb(28, 30, 33));border-radius:12px; padding:12px; font-size:12px; font-weight:400; line-height:16.08px;box-shadow: rgba(0, 0, 0, 0.5) 0 2px 4px; max-width:334px; white-space:normal;"
        );
        addToSS(
          state,
          ".__fb-light-mode .fb-cmf-tooltip",
          "background-color: rgba(0, 0, 0, 0.8); color: #f0f2f5;"
        );
        addToSS(
          state,
          ".__fb-dark-mode .fb-cmf-tooltip",
          "background-color: rgba(255, 255, 255, 0.92); color: #1c1e21;"
        );
        addToSS(state, ".fb-cmf .cmf-report-notice", "white-space: pre-wrap; line-height: 1.4;");
        addToSS(
          state,
          ".fb-cmf header",
          "display:flex; align-items:flex-start; justify-content:space-between; direction:ltr; padding:0 1rem 0.5rem 0;"
        );
        addToSS(state, ".fb-cmf header .fb-cmf-icon", "display:none;");
        addToSS(state, ".fb-cmf header .fb-cmf-icon svg", "width:28px; height:28px; margin:0;");
        addToSS(state, ".fb-cmf header .fb-cmf-icon .cmf-icon", "width:28px; height:28px; margin:0;");
        addToSS(
          state,
          ".fb-cmf header .fb-cmf-title",
          "flex-grow:2; align-self:auto; order:2; text-align:left; padding:0;"
        );
        addToSS(
          state,
          ".fb-cmf header .fb-cmf-title .script-version",
          "font-size: 0.75rem; font-weight: normal;"
        );
        addToSS(state, ".fb-cmf header .fb-cmf-lang-1", "padding-top:0;");
        addToSS(state, ".fb-cmf header .fb-cmf-lang-2", "padding-top:0;");
        addToSS(
          state,
          ".fb-cmf header .fb-cmf-title > div",
          'font-size:24px; font-weight:700; line-height:28px; text-align:left;font-family:"Segoe UI Historic","Segoe UI",Helvetica,Arial,sans-serif;'
        );
        addToSS(
          state,
          ".fb-cmf header .fb-cmf-title > small",
          "display:block; font-size:0.75rem; text-align:left;"
        );
        addToSS(
          state,
          ".fb-cmf header .fb-cmf-close",
          "flex-grow:0; align-self:flex-start; width:auto; text-align:right; padding: 0; order:3;"
        );
        addToSS(
          state,
          ".fb-cmf header .fb-cmf-close button",
          "width: 2.25rem; height: 2.25rem; transition-property: color, fill, stroke; transition-timing-function: var(--fds-soft); transition-duration: var(--fds-fast); cursor: pointer; background-color: transparent; border-radius: 50%; border: none; color: var(--secondary-icon);"
        );
        addToSS(
          state,
          ".fb-cmf header .fb-cmf-close button:hover",
          "background-color: var(--hover-overlay);"
        );
        addToSS(
          state,
          ".fb-cmf .fb-cmf-body",
          "display:flex; gap:1rem; flex:1; overflow-y:auto; overflow-x:hidden; scrollbar-gutter: stable;"
        );
        addToSS(
          state,
          ".fb-cmf .fb-cmf-body",
          "scrollbar-width: thin; scrollbar-color: var(--secondary-icon) transparent;"
        );
        addToSS(state, ".fb-cmf .fb-cmf-body::-webkit-scrollbar", "width:4px; height:4px;");
        addToSS(state, ".fb-cmf .fb-cmf-body::-webkit-scrollbar-track", "background: transparent;");
        addToSS(
          state,
          ".fb-cmf .fb-cmf-body::-webkit-scrollbar-thumb",
          "background-color: var(--secondary-icon); border-radius: 999px;"
        );
        addToSS(
          state,
          ".fb-cmf .fb-cmf-main",
          "flex:1 1 auto; min-width:0; display:flex; flex-direction:column;"
        );
        addToSS(
          state,
          ".fb-cmf .fb-cmf-side",
          "flex:0 0 auto; width:max-content; align-self:flex-start; position:sticky; top:0;"
        );
        addToSS(
          state,
          ".fb-cmf div.content",
          "flex:0 0 auto; overflow: visible; border:none; border-radius:12px; color: var(--primary-text); padding:0.75rem; background-color: var(--card-background);"
        );
        addToSS(state, ".fb-cmf fieldset", "margin:0.5rem 0; padding:0; border:none;");
        addToSS(state, ".fb-cmf fieldset", "--cmf-section-height: 0px;");
        addToSS(state, ".fb-cmf fieldset *", "font-size: 0.8125rem;");
        addToSS(
          state,
          ".fb-cmf fieldset legend",
          "padding: 0.5rem 0.75rem; border: none;border-radius: 8px; color: var(--primary-text); position: relative; overflow: hidden;margin: 0; display:flex; align-items:center; gap:0.75rem; width:100%; box-sizing:border-box;"
        );
        addToSS(state, ".fb-cmf fieldset legend.cmf-legend", "cursor:pointer;");
        addToSS(
          state,
          ".fb-cmf fieldset legend .cmf-legend-icon",
          "width:36px; height:36px; border-radius:50%; background-color: var(--secondary-button-background);display:flex; align-items:center; justify-content:center; color: var(--primary-icon); flex-shrink:0;"
        );
        addToSS(
          state,
          ".fb-cmf fieldset legend .cmf-legend-icon.cmf-legend-rock",
          "transform-origin:center; animation: cmf-legend-rock 180ms ease-out;"
        );
        addToSS(
          state,
          ".fb-cmf fieldset legend .cmf-legend-icon svg",
          "width:20px; height:20px; fill: currentColor;"
        );
        addToSS(state, ".fb-cmf fieldset legend .cmf-legend-icon .cmf-icon", "width:26px; height:26px;");
        addToSS(
          state,
          ".fb-cmf fieldset legend .cmf-legend-icon .cmf-icon--legend-report-bug",
          "width:32px; height:32px;"
        );
        addToSS(
          state,
          ".fb-cmf fieldset legend .cmf-legend-icon .cmf-icon--legend-reels",
          "width:32px; height:32px;"
        );
        addToSS(
          state,
          ".fb-cmf fieldset legend .cmf-legend-text",
          "display:flex; flex-direction:column; align-items:flex-start; gap:0; min-width:0;"
        );
        addToSS(
          state,
          ".fb-cmf fieldset legend .cmf-legend-title",
          "font-size:0.95rem; font-weight:600; line-height:1.05; color: var(--primary-text); margin:0; padding:0;"
        );
        addToSS(
          state,
          ".fb-cmf fieldset legend .cmf-legend-subtext",
          "font-size:0.75rem; font-weight:400; line-height:1.05; color: var(--secondary-text); margin:0; padding:0;"
        );
        addToSS(
          state,
          ".fb-cmf .cmf-report-actions",
          "display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.35rem;"
        );
        addToSS(
          state,
          ".fb-cmf .cmf-report-actions button",
          "position:relative; overflow:hidden; border:none; border-radius:8px;background-color: var(--secondary-button-background); color: var(--primary-text);height:36px; padding:0 0.75rem; font-weight:600; cursor:pointer;"
        );
        addToSS(
          state,
          ".fb-cmf .cmf-report-actions button::after",
          'content:""; position:absolute; inset:0; border-radius:inherit; background-color: var(--hover-overlay);opacity:0; pointer-events:none; transition: opacity 0.1s cubic-bezier(0, 0, 1, 1);'
        );
        addToSS(state, ".fb-cmf .cmf-report-actions button:hover::after", "opacity:1;");
        addToSS(
          state,
          ".fb-cmf .cmf-report-status",
          "margin-top:0.35rem; font-size:0.75rem; color: var(--secondary-text);"
        );
        addToSS(
          state,
          ".fb-cmf .cmf-report-output",
          'display:none; width:100%; max-width:100%; box-sizing:border-box; min-height:6rem; margin-top:0.5rem; padding:0.5rem;border-radius:8px; border:1px solid var(--divider);background-color: var(--comment-background); color: var(--primary-text);font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-size:0.75rem; line-height:1.3; resize:vertical;'
        );
        addToSS(state, ".fb-cmf .cmf-report-output.cmf-report-output--visible", "display:block;");
        addToSS(
          state,
          ".fb-cmf fieldset legend::after",
          'content:""; position:absolute; inset:0; border-radius:inherit; background-color: var(--hover-overlay);opacity:0; pointer-events:none; transition: opacity 0.1s cubic-bezier(0, 0, 1, 1);'
        );
        addToSS(state, ".fb-cmf fieldset legend:hover::after", "opacity:1;");
        addToSS(
          state,
          ".fb-cmf fieldset.cmf-visible,.fb-cmf fieldset.cmf-visible legend ",
          "border-color: transparent;"
        );
        addToSS(
          state,
          ".fb-cmf fieldset.cmf-hidden,.fb-cmf fieldset.cmf-hidden legend ",
          "border-color: transparent;"
        );
        addToSS(state, ".fb-cmf fieldset legend::after", 'content: "";');
        addToSS(
          state,
          ".fb-cmf .cmf-section-body",
          "max-height: var(--cmf-section-height, 0px); overflow:hidden; opacity:0; transform: translateY(-4px);transition: max-height 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 140ms ease-out, transform 160ms ease-out;will-change: max-height, opacity, transform;"
        );
        addToSS(
          state,
          ".fb-cmf fieldset.cmf-visible .cmf-section-body",
          "opacity:1; transform: translateY(0);"
        );
        addToSS(state, ".fb-cmf.cmf-searching .cmf-section-body", "transition: none;");
        addToSS(
          state,
          ".fb-cmf fieldset label",
          "display:flex; align-items:center; gap:0.4rem; min-height:32px; padding:0.15rem 0.5rem; margin:0;color: var(--primary-text); font-weight: normal; width:100%; max-width:100%; box-sizing:border-box;border-radius:8px; position:relative; overflow:hidden;"
        );
        addToSS(state, ".fb-cmf fieldset label *", "color: inherit;");
        addToSS(state, ".fb-cmf fieldset label input", "margin: 0; vertical-align:middle;");
        addToSS(
          state,
          '.fb-cmf fieldset input[type="text"]',
          "border: 1px solid var(--divider); border-radius: 8px; padding: 0.35rem 0.5rem;background-color: var(--comment-background); color: var(--primary-text);"
        );
        addToSS(state, ".fb-cmf fieldset label[disabled]", "color:darkgrey;");
        addToSS(
          state,
          ".fb-cmf fieldset textarea",
          "width:100%; max-width:100%; height:12rem; box-sizing:border-box;"
        );
        addToSS(
          state,
          ".fb-cmf fieldset .cmf-section-body > textarea",
          "margin-left: calc(36px * 0.75); width: calc(100% - (36px * 0.75));"
        );
        addToSS(
          state,
          ".fb-cmf fieldset .cmf-section-body > strong",
          "display:block; margin:0.35rem 0 0.15rem 0; font-weight:600; color: var(--primary-text);"
        );
        addToSS(
          state,
          ".fb-cmf fieldset .cmf-section-body > small",
          "display:block; margin:0.15rem 0 0.35rem 0; color: var(--secondary-text);"
        );
        addToSS(state, ".fb-cmf .cmf-row", "margin:0.1rem 0;");
        addToSS(
          state,
          ".fb-cmf fieldset .cmf-section-body > span",
          "display:block; margin:0.35rem 0 0.15rem 0; color: var(--secondary-text);"
        );
        addToSS(
          state,
          ".fb-cmf .cmf-tips-content p",
          "margin:0.35rem 0 0.15rem 0; color: var(--secondary-text);"
        );
        addToSS(
          state,
          ".fb-cmf fieldset .cmf-section-body > .cmf-row, .fb-cmf fieldset .cmf-section-body > .cmf-report-actions, .fb-cmf fieldset .cmf-section-body > .cmf-report-status, .fb-cmf fieldset .cmf-section-body > .cmf-report-output, .fb-cmf fieldset .cmf-section-body > .cmf-tips-content, .fb-cmf fieldset .cmf-section-body > strong, .fb-cmf fieldset .cmf-section-body > small, .fb-cmf fieldset .cmf-section-body > span",
          "margin-left: calc(36px * 0.75);"
        );
        addToSS(state, ".fb-cmf .cmf-tips-content a", "color:#4fa3ff; text-decoration: underline;");
        addToSS(state, ".fb-cmf .cmf-tips-content a:hover", "color:#7bbcff;");
        addToSS(
          state,
          ".fb-cmf .fb-cmf-search",
          "display:flex; align-items:center; gap:0.5rem; padding:0.35rem 0.5rem; margin:0 0 0.5rem 0;border-radius:999px; background-color: var(--comment-background);"
        );
        addToSS(
          state,
          ".fb-cmf .fb-cmf-search-icon",
          "display:flex; align-items:center; justify-content:center; width:20px; height:20px; color: var(--secondary-icon); flex-shrink:0;"
        );
        addToSS(state, ".fb-cmf .fb-cmf-search-icon svg", "width:16px; height:16px; fill: currentColor;");
        addToSS(state, ".fb-cmf .fb-cmf-search-icon .cmf-icon", "width:22px; height:22px;");
        addToSS(
          state,
          ".fb-cmf .fb-cmf-search input",
          "background: transparent; border: none; outline: none; color: var(--primary-text); width:100%; font-size:0.95rem;"
        );
        addToSS(
          state,
          ".fb-cmf fieldset select",
          "border: 1px solid var(--divider); margin: 0 0.5rem 0 0.5rem; vertical-align:baseline;border-radius: 8px; padding: 0.35rem 0.5rem;background-color: var(--comment-background); color: var(--primary-text);"
        );
        addToSS(
          state,
          '.__fb-dark-mode .fb-cmf fieldset textarea,.__fb-dark-mode .fb-cmf fieldset input[type="text"],.__fb-dark-mode .fb-cmf fieldset select',
          "background-color:var(--comment-background); color:var(--primary-text);"
        );
        addToSS(
          state,
          ".fb-cmf footer",
          "display:flex; flex-direction:column; gap:0.5rem; padding:0.75rem; text-align:center; background-color: var(--card-background);border-radius:12px;"
        );
        addToSS(state, ".fb-cmf .buttons button", "margin-left: 0.25rem; margin-right: 0.25rem;");
        addToSS(state, ".fb-cmf .fileInput", "display:none;");
        addToSS(state, `.fb-cmf[${state.showAtt}]`, "opacity:1; visibility:visible;");
        addToSS(state, `.${state.iconNewWindowClass}`, "width: 1rem; height: 1rem;");
        addToSS(
          state,
          `.${state.iconNewWindowClass} a`,
          "width: 1rem; position: relative; display: inline-block;"
        );
        addToSS(
          state,
          `.${state.iconNewWindowClass} svg`,
          "position: absolute; top: -13.5px; stroke: rgb(101, 103, 107);"
        );
        state.tempStyleSheetCode += "@keyframes cmf-legend-rock {0% { transform: rotate(0deg); }35% { transform: rotate(-8deg); }70% { transform: rotate(6deg); }100% { transform: rotate(0deg); }}\n@media (prefers-reduced-motion: reduce) {.fb-cmf .cmf-section-body { transition: none; transform: none; }.fb-cmf fieldset legend .cmf-legend-icon.cmf-legend-rock { animation: none; }}\n";
        if (state.tempStyleSheetCode.length > 0) {
          styleTag.appendChild(document.createTextNode(state.tempStyleSheetCode));
          state.tempStyleSheetCode = "";
        }
        return styleTag;
      }
      function addExtraCSS(state, options, defaults) {
        if (!state || !options || !defaults) {
          return null;
        }
        let cmfBtnLocation = defaults.CMF_BTN_OPTION;
        let cmfDlgLocation = defaults.CMF_DIALOG_OPTION;
        if (Object.prototype.hasOwnProperty.call(options, "CMF_BTN_OPTION")) {
          if (options.CMF_BTN_OPTION.toString() !== "") {
            cmfBtnLocation = options.CMF_BTN_OPTION;
          }
        }
        if (Object.prototype.hasOwnProperty.call(options, "CMF_DIALOG_OPTION")) {
          if (options.CMF_DIALOG_OPTION.toString() !== "") {
            cmfDlgLocation = options.CMF_DIALOG_OPTION;
          }
        }
        cmfBtnLocation = cmfBtnLocation.toString();
        cmfDlgLocation = cmfDlgLocation.toString();
        const styleTag = document.getElementById(state.cssID);
        if (!styleTag) {
          return null;
        }
        state.tempStyleSheetCode = "";
        let styles = "";
        if (cmfBtnLocation === "1") {
          styles = "display:none;";
        } else if (cmfBtnLocation === "2") {
          styles = "display: none !important;";
        } else {
          styles = "position: fixed; bottom: 3rem; left: 1rem; display:none; z-index: 999;";
          styles += "background: var(--secondary-button-background-floating); padding: 0.5rem; width: 3rem; height: 3rem; border: 0; border-radius: 1.5rem;";
          styles += "box-shadow: 0 2px 4px var(--shadow-1), 0 12px 28px var(--shadow-2);";
        }
        if (styles.length > 0) {
          addToSS(state, ".fb-cmf-toggle", styles);
          addToSS(state, ".fb-cmf-toggle svg", "height: 95%; aspect-ratio : 1 / 1;");
          addToSS(state, ".fb-cmf-toggle .cmf-icon", "height: 95%; aspect-ratio : 1 / 1;");
          addToSS(state, ".fb-cmf-toggle:hover", "cursor:pointer;");
          addToSS(state, ".fb-cmf-toggle", "overflow: hidden;");
          addToSS(
            state,
            ".fb-cmf-toggle:not(.fb-cmf-toggle-topbar)::after",
            'content: ""; position: absolute; inset: 0; border-radius: inherit;background-color: rgba(255, 255, 255, 0.1); opacity: 0; pointer-events: none;'
          );
          addToSS(state, ".fb-cmf-toggle:not(.fb-cmf-toggle-topbar):hover::after", "opacity: 1;");
          addToSS(
            state,
            `.fb-cmf-toggle[${state.showAtt}]`,
            "display:flex; align-items:center; justify-content:center;"
          );
          if (cmfDlgLocation !== "1") {
            addToSS(
              state,
              '.fb-cmf-toggle:not(.fb-cmf-toggle-topbar)[data-cmf-open="true"]',
              "display:none;"
            );
          }
          addToSS(
            state,
            ".fb-cmf-toggle.fb-cmf-toggle-topbar",
            "border:none; outline:none; position: relative; overflow: hidden;color: var(--cmf-icon-color, var(--secondary-icon));background-color: var(--cmf-btn-bg, var(--secondary-button-background-floating));transition: background-color 100ms cubic-bezier(0, 0, 1, 1), color 100ms cubic-bezier(0, 0, 1, 1);"
          );
          addToSS(
            state,
            ".fb-cmf-toggle.fb-cmf-toggle-topbar::after",
            'content: ""; position: absolute; inset: 0; border-radius: inherit;background-color: var(--cmf-btn-hover, var(--hover-overlay)); opacity: 0; pointer-events: none;transition: none;'
          );
          addToSS(state, ".fb-cmf-toggle.fb-cmf-toggle-topbar:hover::after", "opacity: 1;");
          addToSS(
            state,
            ".fb-cmf-toggle.fb-cmf-toggle-topbar:active::after",
            "background-color: var(--cmf-btn-press, var(--press-overlay)); opacity: 1;"
          );
          addToSS(state, ".fb-cmf-toggle.fb-cmf-toggle-topbar:active", "color: var(--accent);");
          addToSS(
            state,
            '.fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-open="true"]',
            "color: var(--cmf-active-icon, var(--accent)); background-color: var(--cmf-active-bg, var(--primary-button-background));"
          );
        }
        if (cmfDlgLocation === "1") {
          styles = "right:16px; left:auto; margin-left:0; margin-right:0;";
        } else {
          styles = "left:16px; right:auto; margin-left:0; margin-right:0;";
        }
        addToSS(state, ".fb-cmf", styles);
        addToSS(
          state,
          "div#fbcmf footer > button",
          "font-family: inherit; cursor: pointer;height: 48px; padding: 0 0.5rem;border: none; border-radius: 8px;background-color: transparent;display:flex; align-items:center; gap:0.5rem; justify-content:flex-start;font-size: .9375rem; font-weight: 600;color: var(--primary-text); position:relative; overflow:hidden;"
        );
        addToSS(
          state,
          "#fbcmf footer > button",
          "transition: color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;"
        );
        addToSS(state, "#fbcmf footer > button.cmf-action--dirty", "color:#d93025;");
        addToSS(state, "#fbcmf footer > button.cmf-action--dirty .cmf-action-icon", "color:#d93025;");
        addToSS(
          state,
          "#fbcmf footer > button.cmf-action--confirm-blue",
          "color:#1877f2; animation: cmf-pulse-blue 0.6s ease-out;"
        );
        addToSS(
          state,
          "#fbcmf footer > button.cmf-action--confirm-blue .cmf-action-icon",
          "color:#1877f2;"
        );
        addToSS(
          state,
          "#fbcmf footer > button.cmf-action--confirm-green",
          "color:#2e7d32; animation: cmf-pulse-green 0.6s ease-out;"
        );
        addToSS(
          state,
          "#fbcmf footer > button.cmf-action--confirm-green .cmf-action-icon",
          "color:#2e7d32;"
        );
        addToSS(state, ".fb-cmf footer .cmf-action-text", "padding-right: 0.5rem;");
        addToSS(state, "#fbcmf footer > button:hover", "font-family: inherit;");
        addToSS(
          state,
          "#fbcmf footer > button::after",
          'content:""; position:absolute; inset:0; border-radius:inherit;background-color: var(--hover-overlay); opacity:0; pointer-events:none;transition: opacity 0.1s cubic-bezier(0, 0, 1, 1);'
        );
        addToSS(state, "#fbcmf footer > button:hover::after", "opacity:1;");
        addToSS(
          state,
          ".fb-cmf footer .cmf-action-icon",
          "width:36px; height:36px; border-radius:50%; background-color: var(--secondary-button-background);display:flex; align-items:center; justify-content:center; color: var(--primary-icon); flex-shrink:0;"
        );
        addToSS(
          state,
          ".fb-cmf footer .cmf-action-icon svg",
          "width:20px; height:20px; fill: currentColor;"
        );
        addToSS(state, ".fb-cmf footer .cmf-action-icon .cmf-icon", "width:32px; height:32px;");
        if (state.tempStyleSheetCode.length > 0) {
          state.tempStyleSheetCode += "@keyframes cmf-pulse-blue {0% { color: #1877f2; }50% { color: #66a3ff; }100% { color: #1877f2; }}\n@keyframes cmf-pulse-green {0% { color: #2e7d32; }50% { color: #66bb6a; }100% { color: #2e7d32; }}\n";
          styleTag.appendChild(document.createTextNode(state.tempStyleSheetCode));
          state.tempStyleSheetCode = "";
        }
        return styleTag;
      }
      module.exports = {
        addCSS,
        addExtraCSS,
        addToSS,
        ensureStyleTag
      };
    }
  });

  // src/dom/theme.js
  var require_theme = __commonJS({
    "src/dom/theme.js"(exports, module) {
      function detectDarkMode() {
        if (!document || !document.documentElement) {
          return false;
        }
        if (document.documentElement.classList.contains("__fb-light-mode")) {
          return false;
        }
        if (document.documentElement.classList.contains("__fb-dark-mode")) {
          return true;
        }
        if (document.body) {
          const bodyBackgroundColour = window.getComputedStyle(document.body).backgroundColor;
          const rgb = bodyBackgroundColour.match(/\d+/g);
          if (rgb) {
            const red = parseInt(rgb[0], 10);
            const green = parseInt(rgb[1], 10);
            const blue = parseInt(rgb[2], 10);
            const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;
            return luminance < 128;
          }
        }
        return false;
      }
      function watchDarkMode(state, onChange) {
        if (!state || typeof MutationObserver === "undefined") {
          return null;
        }
        const syncMode = () => {
          const modeNow = detectDarkMode();
          if (state.isDarkMode === null || state.isDarkMode !== modeNow) {
            state.isDarkMode = modeNow;
            if (typeof onChange === "function") {
              onChange(modeNow);
            }
          }
        };
        const startObserving = () => {
          if (!document.documentElement) {
            return null;
          }
          const observer2 = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "attributes" && mutation.attributeName === "class") {
                syncMode();
              }
            }
          });
          observer2.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
          });
          return observer2;
        };
        syncMode();
        const observer = startObserving();
        if (observer) {
          return observer;
        }
        const bootstrapObserver = new MutationObserver(() => {
          if (!document.documentElement) {
            return;
          }
          bootstrapObserver.disconnect();
          startObserving();
        });
        bootstrapObserver.observe(document, { childList: true });
        return bootstrapObserver;
      }
      module.exports = {
        watchDarkMode
      };
    }
  });

  // src/utils/dom.js
  var require_dom = __commonJS({
    "src/utils/dom.js"(exports, module) {
      function isElement(value) {
        return value instanceof Element;
      }
      function climbUpTheTree(element, numberOfBranches = 1) {
        let current = element;
        let remaining = numberOfBranches;
        while (current && remaining > 0) {
          current = current.parentNode;
          remaining -= 1;
        }
        return current || null;
      }
      function safeQuerySelector(root, selector) {
        if (!root || typeof root.querySelector !== "function") {
          return null;
        }
        return root.querySelector(selector);
      }
      function querySelectorAllNoChildren(container = document, queries = [], minText = 0, executeAllQueries = false) {
        const queryList = Array.isArray(queries) ? queries : [queries];
        if (queryList.length === 0) {
          return [];
        }
        if (executeAllQueries) {
          return Array.from(container.querySelectorAll(queryList)).filter((element) => {
            return element.children.length === 0 && element.textContent.length >= minText;
          });
        }
        for (const query of queryList) {
          const elements = container.querySelectorAll(query);
          for (const element of elements) {
            if (element.children.length === 0 && element.textContent.length >= minText) {
              return [element];
            }
          }
        }
        return [];
      }
      module.exports = {
        climbUpTheTree,
        isElement,
        querySelectorAllNoChildren,
        safeQuerySelector
      };
    }
  });

  // src/dom/animated-gifs.js
  var require_animated_gifs = __commonJS({
    "src/dom/animated-gifs.js"(exports, module) {
      var { climbUpTheTree } = require_dom();
      var { postAtt } = require_attributes();
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
        swatTheMosquitos
      };
    }
  });

  // src/dom/dirty-check.js
  var require_dirty_check = __commonJS({
    "src/dom/dirty-check.js"(exports, module) {
      function hasSizeChanged(oldValue, newValue, tolerance = 16) {
        if (oldValue === null || oldValue === void 0) {
          return true;
        }
        const oldNumber = parseInt(oldValue, 10);
        const newNumber = parseInt(newValue, 10);
        if (Number.isNaN(oldNumber) || Number.isNaN(newNumber)) {
          return true;
        }
        return Math.abs(newNumber - oldNumber) > tolerance;
      }
      module.exports = {
        hasSizeChanged
      };
    }
  });

  // src/dom/dusting.js
  var require_dusting = __commonJS({
    "src/dom/dusting.js"(exports, module) {
      var { postPropDS } = require_attributes();
      function doLightDusting(post, state) {
        if (!post || !state) {
          return;
        }
        let scanCount = state.scanCountStart;
        if (post[postPropDS] !== void 0) {
          scanCount = parseInt(post[postPropDS], 10);
          scanCount = scanCount < state.scanCountStart ? state.scanCountStart : scanCount;
        }
        if (scanCount < state.scanCountMaxLoop) {
          const dustySpots = post.querySelectorAll('[data-0="0"]');
          if (dustySpots) {
            dustySpots.forEach((element) => {
              element.remove();
            });
          }
          scanCount += 1;
          post[postPropDS] = scanCount;
        }
      }
      module.exports = {
        doLightDusting
      };
    }
  });

  // src/dom/hide.js
  var require_hide = __commonJS({
    "src/dom/hide.js"(exports, module) {
      var { generateRandomString } = require_random();
      var { postAtt, postAttCPID, postAttTab } = require_attributes();
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
                postAttTab: attributes.postAttTab
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
              addCaptionForHiddenPost(
                elPostContent,
                reason,
                marker,
                keyWords,
                { postAtt },
                state,
                options
              );
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
        toggleHiddenElements
      };
    }
  });

  // src/dom/info-boxes.js
  var require_info_boxes = __commonJS({
    "src/dom/info-boxes.js"(exports, module) {
      var { climbUpTheTree } = require_dom();
      var { postAtt } = require_attributes();
      var { hideBlock } = require_hide();
      function scrubInfoBoxes(post, options, keyWords, pathInfo, state) {
        if (!post || !options || !keyWords || !pathInfo || !state) {
          return;
        }
        let hiding = false;
        if (options.OTHER_INFO_BOX_CLIMATE_SCIENCE && pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE && pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE.pathMatch) {
          const elLink = post.querySelector(
            `a[href*="${pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE.pathMatch}"]:not([${postAtt}])`
          );
          if (elLink) {
            const block = climbUpTheTree(elLink, 5);
            hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_CLIMATE_SCIENCE, state, options, {
              postAtt
            });
            hiding = true;
          }
        }
        if (!hiding && options.OTHER_INFO_BOX_CORONAVIRUS && pathInfo.OTHER_INFO_BOX_CORONAVIRUS && pathInfo.OTHER_INFO_BOX_CORONAVIRUS.pathMatch) {
          const elLink = post.querySelector(
            `a[href*="${pathInfo.OTHER_INFO_BOX_CORONAVIRUS.pathMatch}"]:not([${postAtt}])`
          );
          if (elLink) {
            const block = climbUpTheTree(elLink, 5);
            hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_CORONAVIRUS, state, options, {
              postAtt
            });
            hiding = true;
          }
        }
        if (!hiding && options.OTHER_INFO_BOX_SUBSCRIBE && pathInfo.OTHER_INFO_BOX_SUBSCRIBE && pathInfo.OTHER_INFO_BOX_SUBSCRIBE.pathMatch) {
          const elLink = post.querySelector(
            `a[href*="${pathInfo.OTHER_INFO_BOX_SUBSCRIBE.pathMatch}"]:not([${postAtt}])`
          );
          if (elLink) {
            const block = climbUpTheTree(elLink, 5);
            hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_SUBSCRIBE, state, options, {
              postAtt
            });
          }
        }
      }
      module.exports = {
        scrubInfoBoxes
      };
    }
  });

  // src/core/filters/matching.js
  var require_matching = __commonJS({
    "src/core/filters/matching.js"(exports, module) {
      function findFirstMatch(postFullText, textValuesToFind) {
        const foundText = textValuesToFind.find((text) => postFullText.includes(text));
        return foundText !== void 0 ? foundText : "";
      }
      function findFirstMatchRegExp(postFullText, regexpTextValuesToFind) {
        for (const pattern of regexpTextValuesToFind) {
          const regex = new RegExp(pattern, "i");
          if (regex.test(postFullText)) {
            return pattern;
          }
        }
        return "";
      }
      module.exports = {
        findFirstMatch,
        findFirstMatchRegExp
      };
    }
  });

  // src/core/filters/classifiers/blocked-text.js
  var require_blocked_text = __commonJS({
    "src/core/filters/classifiers/blocked-text.js"(exports, module) {
      var { findFirstMatch, findFirstMatchRegExp } = require_matching();
      function findBlockedText(postText, patterns, useRegExp) {
        if (!Array.isArray(patterns) || patterns.length === 0) {
          return "";
        }
        if (useRegExp) {
          return findFirstMatchRegExp(postText, patterns);
        }
        return findFirstMatch(postText, patterns);
      }
      module.exports = {
        findBlockedText
      };
    }
  });

  // src/core/filters/text-normalize.js
  var require_text_normalize = __commonJS({
    "src/core/filters/text-normalize.js"(exports, module) {
      function cleanText(text) {
        return text.normalize("NFKC");
      }
      module.exports = {
        cleanText
      };
    }
  });

  // src/dom/walker.js
  var require_walker = __commonJS({
    "src/dom/walker.js"(exports, module) {
      var { cleanText } = require_text_normalize();
      function countDescendants(element) {
        return element.querySelectorAll("div, span").length;
      }
      function scanTreeForText(node) {
        const arrayTextValues = [];
        const elements = node.querySelectorAll(":scope > div, :scope > blockquote, :scope > span");
        for (const element of elements) {
          if (element.hasAttribute("aria-hidden") && element.getAttribute("aria-hidden") === "false") {
            continue;
          }
          const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
          let currentNode;
          while (currentNode = walk.nextNode()) {
            const elParent = currentNode.parentElement;
            const elParentTN = elParent.tagName.toLowerCase();
            const val = cleanText(currentNode.textContent).trim();
            if (val === "" || val.toLowerCase() === "facebook") {
              continue;
            }
            if (elParent.hasAttribute("aria-hidden") && elParent.getAttribute("aria-hidden") === "true") {
              continue;
            }
            if (elParentTN === "div" && elParent.hasAttribute("role") && elParent.getAttribute("role") === "button") {
              if (elParent.parentElement && elParent.parentElement.tagName.toLowerCase() !== "object") {
                continue;
              }
            }
            if (elParentTN === "title") {
              continue;
            }
            const elGeneric = elParent.closest('div[role="button"]');
            const elGenericDescendantsCount = elGeneric ? countDescendants(elGeneric) : 0;
            if (elGenericDescendantsCount < 2 && val.length > 1) {
              arrayTextValues.push(...val.split("\n"));
            }
          }
        }
        return [...new Set(arrayTextValues)];
      }
      function mpScanTreeForText(node) {
        const arrayTextValues = [];
        let currentNode;
        const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
        while (currentNode = walk.nextNode()) {
          const val = cleanText(currentNode.textContent).trim();
          if (val !== "" && val.length > 1 && val.toLowerCase() !== "facebook") {
            arrayTextValues.push(val.toLowerCase());
          }
        }
        return arrayTextValues;
      }
      function scanImagesForAltText(node) {
        const arrayAltTextValues = [];
        const images = node.querySelectorAll("img[alt]");
        for (const img of images) {
          if (img.alt.length > 0 && img.naturalWidth > 32) {
            const altText = cleanText(img.alt);
            if (!arrayAltTextValues.includes(altText)) {
              arrayAltTextValues.push(altText);
            }
          }
        }
        return arrayAltTextValues;
      }
      function extractTextContent(post, selector, maxBlocks) {
        const blocks = post.querySelectorAll(selector);
        const arrayTextValues = [];
        for (let b = 0; b < Math.min(maxBlocks, blocks.length); b++) {
          const block = blocks[b];
          if (countDescendants(block) > 0) {
            arrayTextValues.push(...scanTreeForText(block));
            arrayTextValues.push(...scanImagesForAltText(block));
          }
        }
        return arrayTextValues.filter((item) => item !== "");
      }
      module.exports = {
        countDescendants,
        extractTextContent,
        mpScanTreeForText,
        scanImagesForAltText,
        scanTreeForText
      };
    }
  });

  // src/feeds/shared/blocks.js
  var require_blocks = __commonJS({
    "src/feeds/shared/blocks.js"(exports, module) {
      function getNewsBlocksQuery(post) {
        let blocksQuery = "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
        const blocks = post.querySelectorAll(blocksQuery);
        if (blocks.length <= 1) {
          blocksQuery = "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";
        }
        return blocksQuery;
      }
      function getGroupsBlocksQuery(post) {
        let blocksQuery = "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
        const blocks = post.querySelectorAll(blocksQuery);
        if (blocks.length <= 1) {
          blocksQuery = "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";
        }
        return blocksQuery;
      }
      module.exports = {
        getNewsBlocksQuery,
        getGroupsBlocksQuery
      };
    }
  });

  // src/feeds/shared/blocked-text.js
  var require_blocked_text2 = __commonJS({
    "src/feeds/shared/blocked-text.js"(exports, module) {
      var { findBlockedText } = require_blocked_text();
      var { extractTextContent } = require_walker();
      var { getGroupsBlocksQuery, getNewsBlocksQuery } = require_blocks();
      function findNewsBlockedText(post, options, filters) {
        if (!post || !options || !filters) {
          return "";
        }
        const postTexts = extractTextContent(post, getNewsBlocksQuery(post), 3).join(" ").toLowerCase();
        return findBlockedText(postTexts, filters.NF_BLOCKED_TEXT_LC, options.NF_BLOCKED_RE);
      }
      function findGroupsBlockedText(post, options, filters) {
        if (!post || !options || !filters) {
          return "";
        }
        const postTexts = extractTextContent(post, getGroupsBlocksQuery(post), 3).join(" ").toLowerCase();
        return findBlockedText(postTexts, filters.GF_BLOCKED_TEXT_LC, options.GF_BLOCKED_RE);
      }
      function findVideosBlockedText(post, options, filters, queryBlocks) {
        if (!post || !options || !filters || !queryBlocks) {
          return "";
        }
        const postTexts = extractTextContent(post, queryBlocks, 1).join(" ").toLowerCase();
        return findBlockedText(postTexts, filters.VF_BLOCKED_TEXT_LC, options.VF_BLOCKED_RE);
      }
      function findProfileBlockedText(post, options, filters) {
        if (!post || !options || !filters) {
          return "";
        }
        const postTexts = extractTextContent(post, getNewsBlocksQuery(post), 3).join(" ").toLowerCase();
        return findBlockedText(postTexts, filters.PP_BLOCKED_TEXT_LC, options.PP_BLOCKED_RE);
      }
      module.exports = {
        findGroupsBlockedText,
        findNewsBlockedText,
        findProfileBlockedText,
        findVideosBlockedText
      };
    }
  });

  // src/feeds/shared/animated-gifs.js
  var require_animated_gifs2 = __commonJS({
    "src/feeds/shared/animated-gifs.js"(exports, module) {
      var { getMosquitosQuery } = require_animated_gifs();
      var { getGroupsBlocksQuery, getNewsBlocksQuery } = require_blocks();
      function hasNewsAnimatedGifContent(post, keyWords) {
        if (!post || !keyWords) {
          return "";
        }
        const postBlocks = post.querySelectorAll(getNewsBlocksQuery(post));
        if (postBlocks.length >= 2) {
          const contentBlock = postBlocks[1];
          const animatedGIFs = contentBlock.querySelectorAll(getMosquitosQuery());
          return animatedGIFs.length > 0 ? keyWords.GF_ANIMATED_GIFS_POSTS : "";
        }
        return "";
      }
      function hasGroupsAnimatedGifContent(post, keyWords) {
        if (!post || !keyWords) {
          return "";
        }
        const postBlocks = post.querySelectorAll(getGroupsBlocksQuery(post));
        if (postBlocks.length >= 2) {
          const contentBlock = postBlocks[1];
          const animatedGIFs = contentBlock.querySelectorAll(getMosquitosQuery());
          return animatedGIFs.length > 0 ? keyWords.GF_ANIMATED_GIFS_POSTS : "";
        }
        return "";
      }
      module.exports = {
        hasGroupsAnimatedGifContent,
        hasNewsAnimatedGifContent
      };
    }
  });

  // src/feeds/shared/sponsored.js
  var require_sponsored = __commonJS({
    "src/feeds/shared/sponsored.js"(exports, module) {
      function isSponsored(post, state) {
        if (!post || !state) {
          return false;
        }
        if (post.querySelector('a[href*="/ads/about/"]')) {
          return true;
        }
        let isSponsoredPost = false;
        if (state.isNF) {
          isSponsoredPost = isSponsoredAriaLabelledBy(post, state.dictionarySponsored);
          if (isSponsoredPost) {
            return true;
          }
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
      function isSponsoredAriaLabelledBy(post, dictionarySponsored) {
        if (!Array.isArray(dictionarySponsored)) {
          return false;
        }
        const labelled = post.querySelectorAll("[aria-labelledby]");
        for (const node of labelled) {
          const idValue = node.getAttribute("aria-labelledby");
          if (!idValue) {
            continue;
          }
          const label = document.getElementById(idValue);
          if (!label) {
            continue;
          }
          const lcText = label.textContent.trim().toLowerCase();
          if (dictionarySponsored.includes(lcText)) {
            return true;
          }
        }
        return false;
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
        isSponsored
      };
    }
  });

  // src/feeds/shared/shares.js
  var require_shares = __commonJS({
    "src/feeds/shared/shares.js"(exports, module) {
      var { postAtt } = require_attributes();
      function hideNumberOfShares(post, state, options) {
        if (!post || !state || !options) {
          return;
        }
        const query = `div[data-visualcompletion="ignore-dynamic"] > div:not([class]) > div:not([class]) > div:not([class]) > div[class] > div:nth-of-type(1) > div > div > span > div:not([id]) > span[dir]:not(${postAtt})`;
        const shares = post.querySelectorAll(query);
        for (const share of shares) {
          share.setAttribute(state.cssHideNumberOfShares, "");
          if (options.VERBOSITY_DEBUG) {
            share.setAttribute(state.showAtt, "");
          }
          share.setAttribute(postAtt, "Shares");
        }
      }
      function findNumberOfShares(post) {
        if (!post) {
          return 0;
        }
        const query = `div[data-visualcompletion="ignore-dynamic"] > div:not([class]) > div:not([class]) > div:not([class]) > div[class] > div:nth-of-type(1) > div > div > span > div:not([id]) > span[dir]:not(${postAtt})`;
        return post.querySelectorAll(query).length;
      }
      module.exports = {
        findNumberOfShares,
        hideNumberOfShares
      };
    }
  });

  // src/feeds/groups.js
  var require_groups = __commonJS({
    "src/feeds/groups.js"(exports, module) {
      var { mainColumnAtt, postAtt, postPropDS } = require_attributes();
      var { swatTheMosquitos } = require_animated_gifs();
      var { hasSizeChanged } = require_dirty_check();
      var { doLightDusting } = require_dusting();
      var { hideFeature, hideGroupPost } = require_hide();
      var { scrubInfoBoxes } = require_info_boxes();
      var { climbUpTheTree } = require_dom();
      var { findGroupsBlockedText } = require_blocked_text2();
      var { hasGroupsAnimatedGifContent } = require_animated_gifs2();
      var { isSponsored } = require_sponsored();
      var { hideNumberOfShares } = require_shares();
      function isGroupsColumnDirty(state) {
        const arrReturn = [null, null];
        const mainColumnQuery = 'div[role="navigation"] ~ div[role="main"]';
        const mainColumn = document.querySelector(mainColumnQuery);
        if (mainColumn) {
          if (!mainColumn.hasAttribute(mainColumnAtt)) {
            arrReturn[0] = mainColumn;
          } else if (hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)) {
            arrReturn[0] = mainColumn;
          }
        } else {
          const mainColumnQueryGP = 'div[role="main"] div[role="feed"]';
          const mainColumnGP = document.querySelector(mainColumnQueryGP);
          if (mainColumnGP) {
            if (!mainColumnGP.hasAttribute(mainColumnAtt)) {
              arrReturn[0] = mainColumnGP;
            } else if (hasSizeChanged(mainColumnGP.getAttribute(mainColumnAtt), mainColumnGP.innerHTML.length)) {
              arrReturn[0] = mainColumnGP;
            }
          }
        }
        const elDialog = document.querySelector('div[role="dialog"]');
        if (elDialog) {
          if (!elDialog.hasAttribute(mainColumnAtt)) {
            arrReturn[1] = elDialog;
          } else if (hasSizeChanged(elDialog.getAttribute(mainColumnAtt), elDialog.innerHTML.length)) {
            arrReturn[1] = elDialog;
          }
        }
        if (state) {
          state.noChangeCounter += 1;
        }
        return arrReturn;
      }
      function isGroupsSuggested(post, keyWords) {
        let results = "";
        let blocksQuery = "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
        let blocks = post.querySelectorAll(blocksQuery);
        if (blocks.length <= 1) {
          blocksQuery = "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";
          blocks = post.querySelectorAll(blocksQuery);
        }
        if (blocks.length > 1) {
          const suggIcon = blocks[0].querySelector('i[data-visualcompletion="css-img"][style]');
          if (suggIcon) {
            results = keyWords.GF_SUGGESTIONS;
          } else {
            const query = "h3 > div > span ~ span > span > div > div";
            const sneakyGroupPost = blocks[1].querySelector(query);
            if (sneakyGroupPost) {
              results = keyWords.GF_SUGGESTIONS;
            }
          }
        }
        return results;
      }
      function isGroupsShortReelVideo(post, keyWords) {
        const querySRV = 'a[href*="/reel/"]';
        const elementsSRV = Array.from(post.querySelectorAll(querySRV));
        return elementsSRV.length !== 1 ? "" : keyWords.GF_SHORT_REEL_VIDEO;
      }
      function cleanGroupsSuggestions(findItem, context) {
        const { keyWords, state, options } = context;
        if (!keyWords || !state || !options) {
          return;
        }
        const query = 'div[role="complementary"] > div > div > div > div > div:not([data-visualcompletion])';
        const asideBoxes = document.querySelectorAll(query);
        if (asideBoxes.length === 0) {
          return;
        }
        for (const asideBox of asideBoxes) {
          const elParent = climbUpTheTree(asideBox, 21);
          if (!elParent) {
            continue;
          }
          const link = asideBox.closest("a");
          if (link) {
            link.setAttribute(postAtt, keyWords.GF_SUGGESTIONS);
          }
          hideFeature(elParent, keyWords.GF_SUGGESTIONS, true, { options, keyWords, state });
        }
      }
      function setPostLinkToOpenInNewTab(post, state) {
        try {
          if (post.hasAttribute("class") && post.classList.length > 0) {
            return;
          }
          if (post.querySelector(`.${state.iconNewWindowClass}`)) {
            return;
          }
          const postLinks = post.querySelectorAll('div > div > a[href*="/groups/"][role="link"]');
          if (postLinks.length > 0) {
            const postLink = postLinks[0];
            const elHeader = climbUpTheTree(postLink, 4);
            if (!elHeader) {
              return;
            }
            const blockOfIcons = elHeader.querySelector(
              ":scope > div:nth-of-type(2) > div > div:nth-of-type(2) > span > span"
            );
            let newLink = "";
            if (blockOfIcons) {
              const postId = new URLSearchParams(postLink.href).get("multi_permalinks");
              if (postId !== null) {
                newLink = `${postLink.href.split("?")[0]}posts/${postId}/`;
              } else {
                return;
              }
            } else {
              return;
            }
            const spanSpacer = document.createElement("span");
            spanSpacer.innerHTML = '<span><span style="position:absolute;width:1px;height:1px;">&nbsp;</span><span aria-hidden="true"> \xFA </span></span>';
            blockOfIcons.appendChild(spanSpacer);
            const container = document.createElement("span");
            container.className = state.iconNewWindowClass;
            const span2 = document.createElement("span");
            const linkNew = document.createElement("a");
            linkNew.setAttribute("href", newLink);
            linkNew.innerHTML = state.iconNewWindow;
            linkNew.setAttribute("target", "_blank");
            span2.appendChild(linkNew);
            container.appendChild(span2);
            blockOfIcons.appendChild(container);
          }
        } catch (error) {
          return;
        }
      }
      function mopGroupsFeed(context) {
        if (!context) {
          return null;
        }
        const { state, options, filters, keyWords, pathInfo } = context;
        if (!state || !options || !filters || !keyWords || !pathInfo) {
          return null;
        }
        const [mainColumn, elDialog] = isGroupsColumnDirty(state);
        if (!mainColumn && !elDialog) {
          return null;
        }
        if (mainColumn) {
          if (state.gfType === "groups" || state.gfType === "groups-recent" || state.gfType === "search") {
            if (options.GF_SUGGESTIONS) {
              cleanGroupsSuggestions("Suggestions", context);
            }
            const query = state.gfType === "groups-recent" ? 'h2[dir="auto"] + div > div' : 'div[role="feed"] > div';
            const posts = Array.from(document.querySelectorAll(query));
            if (posts.length > 0) {
              const count = posts.length;
              const start = count < 25 ? 0 : count - 25;
              for (let i = start; i < count; i += 1) {
                const post = posts[i];
                if (post.innerHTML.length === 0) {
                  continue;
                }
                let hideReason = "";
                if (state.gfType === "groups" && post[postPropDS] === void 0) {
                  setPostLinkToOpenInNewTab(post, state);
                }
                if (post.hasAttribute(postAtt)) {
                  hideReason = "hidden";
                } else {
                  doLightDusting(post, state);
                  if (hideReason === "" && options.GF_SPONSORED && isSponsored(post, state)) {
                    hideReason = keyWords.SPONSORED;
                  }
                  if (hideReason === "" && options.GF_SUGGESTIONS) {
                    hideReason = isGroupsSuggested(post, keyWords);
                  }
                  if (hideReason === "" && options.GF_SHORT_REEL_VIDEO) {
                    hideReason = isGroupsShortReelVideo(post, keyWords);
                  }
                  if (hideReason === "" && options.GF_BLOCKED_ENABLED) {
                    hideReason = findGroupsBlockedText(post, options, filters);
                  }
                  if (hideReason === "" && options.GF_ANIMATED_GIFS_POSTS) {
                    hideReason = hasGroupsAnimatedGifContent(post, keyWords);
                  }
                }
                if (hideReason.length > 0) {
                  state.echoCount += 1;
                  if (hideReason !== "hidden") {
                    hideGroupPost(post, hideReason, "", {
                      options,
                      keyWords,
                      state
                    });
                  }
                } else {
                  state.echoCount = 0;
                  if (options.GF_ANIMATED_GIFS_PAUSE) {
                    swatTheMosquitos(post);
                  }
                  if (state.hideAnInfoBox) {
                    scrubInfoBoxes(post, options, keyWords, pathInfo, state);
                  }
                  if (options.GF_SHARES) {
                    hideNumberOfShares(post, state, options);
                  }
                }
              }
            }
          } else {
            const query = 'div[role="feed"] > div';
            const posts = Array.from(document.querySelectorAll(query));
            if (posts.length) {
              for (const post of posts) {
                if (post.innerHTML.length === 0) {
                  continue;
                }
                let hideReason = "";
                if (post.hasAttribute(postAtt)) {
                  hideReason = "hidden";
                } else {
                  doLightDusting(post, state);
                  if (hideReason === "" && options.GF_SHORT_REEL_VIDEO) {
                    hideReason = isGroupsShortReelVideo(post, keyWords);
                  }
                  if (hideReason === "" && options.GF_BLOCKED_ENABLED) {
                    hideReason = findGroupsBlockedText(post, options, filters);
                  }
                  if (hideReason === "" && options.GF_ANIMATED_GIFS_POSTS) {
                    hideReason = hasGroupsAnimatedGifContent(post, keyWords);
                  }
                }
                if (hideReason.length > 0) {
                  state.echoCount += 1;
                  if (hideReason !== "hidden") {
                    hideGroupPost(post, hideReason, "", {
                      options,
                      keyWords,
                      state
                    });
                  }
                } else {
                  state.echoCount = 0;
                  if (options.GF_ANIMATED_GIFS_PAUSE) {
                    swatTheMosquitos(post);
                  }
                  if (state.hideAnInfoBox) {
                    scrubInfoBoxes(post, options, keyWords, pathInfo, state);
                  }
                  if (options.GF_SHARES) {
                    hideNumberOfShares(post, state, options);
                  }
                }
              }
            }
          }
          mainColumn.setAttribute(mainColumnAtt, mainColumn.innerHTML.length.toString());
          state.noChangeCounter = 0;
        }
        if (elDialog) {
          if (options.GF_ANIMATED_GIFS_PAUSE) {
            swatTheMosquitos(elDialog);
          }
          elDialog.setAttribute(mainColumnAtt, elDialog.innerHTML.length.toString());
          state.noChangeCounter = 0;
        }
        return { mainColumn, elDialog };
      }
      module.exports = {
        isGroupsShortReelVideo,
        isGroupsSuggested,
        mopGroupsFeed
      };
    }
  });

  // src/feeds/marketplace.js
  var require_marketplace = __commonJS({
    "src/feeds/marketplace.js"(exports, module) {
      var { findFirstMatch } = require_matching();
      var { mainColumnAtt, postAtt, postAttMPSkip } = require_attributes();
      var { hasSizeChanged } = require_dirty_check();
      var { mpScanTreeForText } = require_walker();
      var { sanitizeReason } = require_hide();
      var { climbUpTheTree } = require_dom();
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
          `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/np/item/"]`
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
          const mainColumnDM = document.querySelector(
            'div[hidden] ~ div[class*="__"] div[role="dialog"]'
          );
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
              if (hasSizeChanged(
                mainColumnPM.getAttribute(mainColumnAtt),
                mainColumnPM.innerHTML.length.toString()
              )) {
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
            const mainColumn2 = document.querySelector(query);
            if (mainColumn2) {
              return mainColumn2;
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
        mopMarketplaceFeed
      };
    }
  });

  // src/core/filters/classifiers/shares-likes.js
  var require_shares_likes = __commonJS({
    "src/core/filters/classifiers/shares-likes.js"(exports, module) {
      function getFullNumber(value) {
        let numericValue = 0;
        if (value !== "") {
          const upperValue = value.toUpperCase();
          if (upperValue.endsWith("K") || upperValue.endsWith("M")) {
            let multiplier = 1;
            let powY = 0;
            if (upperValue.endsWith("K")) {
              multiplier = 1e3;
              powY = 3;
            } else if (upperValue.endsWith("M")) {
              multiplier = 1e6;
              powY = 6;
            }
            const bits = upperValue.replace(/[KM]/g, "").replace(",", ".").split(".");
            numericValue = parseInt(bits[0], 10) * multiplier;
            if (bits.length > 1) {
              numericValue += parseInt(bits[1], 10) * Math.pow(10, powY - bits[1].length);
            }
          } else {
            numericValue = parseInt(upperValue, 10);
          }
        }
        return numericValue;
      }
      function isAboveMaximumLikes(value, maxLikes) {
        if (!maxLikes || typeof value !== "string") {
          return false;
        }
        return getFullNumber(value.trim()) >= maxLikes;
      }
      module.exports = {
        getFullNumber,
        isAboveMaximumLikes
      };
    }
  });

  // src/selectors/news.js
  var require_news = __commonJS({
    "src/selectors/news.js"(exports, module) {
      var newsSelectors = {
        mainColumn: 'div[role="navigation"] ~ div[role="main"]',
        dialog: 'div[role="dialog"]',
        surveyButton: 'a[href*="/survey/?session="] > div[role="none"]',
        postQueries: [
          'h3[dir="auto"] ~ div div[aria-posinset]',
          'h2[dir="auto"] ~ div div[aria-posinset]',
          'h3[dir="auto"] ~ div div[role="article"]',
          'h2[dir="auto"] ~ div div[role="article"]',
          'div[role="main"] div[aria-posinset]',
          'div[role="main"] div[role="article"]',
          'div[role="main"] div[data-virtualized] div[role="article"]',
          'h3[dir="auto"] ~ div:not([class]) > div > div > div > div > div',
          'h2[dir="auto"] ~ div:not([class]) > div > div > div > div > div',
          'div[role="feed"] > h3[dir="auto"] ~ div:not([class]) > div[data-pagelet*="FeedUnit_"] > div > div > div > div',
          'div[role="feed"] > h2[dir="auto"] ~ div:not([class]) > div[data-pagelet*="FeedUnit_"] > div > div > div > div'
        ]
      };
      module.exports = {
        newsSelectors
      };
    }
  });

  // src/feeds/news.js
  var require_news2 = __commonJS({
    "src/feeds/news.js"(exports, module) {
      var { cleanText } = require_text_normalize();
      var { getFullNumber } = require_shares_likes();
      var { mainColumnAtt, postAtt, postAttChildFlag, postAttTab } = require_attributes();
      var { swatTheMosquitos } = require_animated_gifs();
      var { hasSizeChanged } = require_dirty_check();
      var { doLightDusting } = require_dusting();
      var { hideNewsPost, hideFeature } = require_hide();
      var { scrubInfoBoxes } = require_info_boxes();
      var { extractTextContent, scanTreeForText } = require_walker();
      var { climbUpTheTree, querySelectorAllNoChildren } = require_dom();
      var { newsSelectors } = require_news();
      var { findNewsBlockedText } = require_blocked_text2();
      var { hasNewsAnimatedGifContent } = require_animated_gifs2();
      var { getNewsBlocksQuery } = require_blocks();
      var { isSponsored } = require_sponsored();
      var { hideNumberOfShares } = require_shares();
      function isNewsDirty(state) {
        const arrReturn = [null, null];
        const mainColumn = document.querySelector(newsSelectors.mainColumn);
        if (mainColumn) {
          if (!mainColumn.hasAttribute(mainColumnAtt)) {
            arrReturn[0] = mainColumn;
          } else if (hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)) {
            arrReturn[0] = mainColumn;
          }
        }
        const elDialog = document.querySelector(newsSelectors.dialog);
        if (elDialog) {
          if (!elDialog.hasAttribute(mainColumnAtt)) {
            arrReturn[1] = elDialog;
          } else if (hasSizeChanged(elDialog.getAttribute(mainColumnAtt), elDialog.innerHTML.length)) {
            arrReturn[1] = elDialog;
          }
        }
        if (state) {
          state.noChangeCounter += 1;
        }
        return arrReturn;
      }
      function getCollectionOfNewsPosts() {
        let posts = [];
        for (const query of newsSelectors.postQueries) {
          const nodeList = document.querySelectorAll(query);
          if (nodeList.length > 0) {
            posts = Array.from(nodeList);
            break;
          }
        }
        return posts;
      }
      function isNewsSuggested(post, state, keyWords) {
        const queries = [
          "div[aria-posinset] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)",
          "div[aria-describedby] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)"
        ];
        const elSuggestion = querySelectorAllNoChildren(post, queries, 1);
        if (elSuggestion.length > 0) {
          if (isNewsReelsAndShortVideos(post, state, keyWords).length > 0) {
            return "";
          }
          const pattern = /([0-9]|[\u0660-\u0669]|[\u06F0-\u06F9]|[\u0966-\u096F]|[\u09E6-\u09EF]|[\u1040-\u1049]|[\u0E50-\u0E59]|[\u0F20-\u0F29])/;
          const firstCharacter = cleanText(elSuggestion[0].textContent).trim().slice(0, 1);
          return pattern.test(firstCharacter) ? "" : keyWords.NF_SUGGESTIONS;
        }
        if (isGroupsYouMightLike(post)) {
          return keyWords.NF_SUGGESTIONS;
        }
        return "";
      }
      function isGroupsYouMightLike(post) {
        const query = 'a[href*="/groups/discover"]';
        const results = post.querySelectorAll(query);
        return results.length > 0;
      }
      function isNewsPeopleYouMayKnow(post, keyWords) {
        const queryPYMK = 'a[href*="/friends/"][role="link"]';
        const linksPYMK = post.querySelectorAll(queryPYMK);
        return linksPYMK.length === 0 ? "" : keyWords.NF_PEOPLE_YOU_MAY_KNOW;
      }
      function isNewsPaidPartnership(post, keyWords) {
        const queryPP = 'span[dir] > span[id] a[href^="/business/help/"]';
        const elPaidPartnership = post.querySelector(queryPP);
        return elPaidPartnership === null ? "" : keyWords.NF_PAID_PARTNERSHIP;
      }
      function isNewsSponsoredPaidBy(post, keyWords) {
        const querySPB = "div:nth-child(2) > div > div:nth-child(2) > span[class] > span[id] > div:nth-child(2)";
        const sponsoredPaidBy = querySelectorAllNoChildren(post, querySPB, 1);
        return sponsoredPaidBy.length === 0 ? "" : keyWords.NF_SPONSORED_PAID;
      }
      function isNewsReelsAndShortVideos(post, state, keyWords) {
        const queryReelsAndShortVideos = 'a[href="/reel/?s=ifu_see_more"]';
        const elReelsAndShortVideos = post.querySelector(queryReelsAndShortVideos);
        if (elReelsAndShortVideos !== null) {
          return keyWords.NF_REELS_SHORT_VIDEOS;
        }
        const queryManyReels = 'a[href*="/reel/"]';
        const manyReels = post.querySelectorAll(queryManyReels);
        if (manyReels.length > 4) {
          return keyWords.NF_REELS_SHORT_VIDEOS;
        }
        const buttonDiv = post.querySelector('div[role="button"] > i ~ div');
        if (buttonDiv && buttonDiv.textContent) {
          const buttonText = buttonDiv.textContent.trim().toLowerCase();
          if (state.dictionaryReelsAndShortVideos.find((item) => item === buttonText)) {
            return keyWords.NF_REELS_SHORT_VIDEOS;
          }
        }
        return "";
      }
      function isNewsShortReelVideo(post, keyWords) {
        const querySRV = 'a[href*="/reel/"]';
        const elementsSRV = Array.from(post.querySelectorAll(querySRV));
        return elementsSRV.length !== 1 ? "" : keyWords.NF_SHORT_REEL_VIDEO;
      }
      function isNewsEventsYouMayLike(post, keyWords) {
        const query = ":scope div > div:nth-of-type(2) > div > div >  h3 > span";
        const events = querySelectorAllNoChildren(post, query, 0);
        return events.length === 0 ? "" : keyWords.NF_EVENTS_YOU_MAY_LIKE;
      }
      function isNewsFollow(post, state, keyWords) {
        const header = post.querySelector("h4");
        if (header) {
          const headerButtons = header.querySelectorAll('[role="button"]');
          if (headerButtons.length > 0) {
            const headerLinks = Array.from(header.querySelectorAll("a[href]")).map((link) => link.getAttribute("href")).filter((href) => typeof href === "string" && href !== "");
            const hasGroupLink = headerLinks.some((href) => href.includes("/groups/"));
            const hasPageLink = headerLinks.some((href) => !href.includes("/groups/"));
            if (hasPageLink && !hasGroupLink) {
              return keyWords.NF_FOLLOW;
            }
          }
        }
        const queryFollow = [
          ":scope h4[id] > span > div > span",
          ":scope h4[id] > span > span > div > span",
          ":scope h4[id] > div > span > span[class] > div[class] > span[class]"
        ];
        const elementsFollow = querySelectorAllNoChildren(post, queryFollow, 0, false);
        if (elementsFollow.length === 1) {
          return keyWords.NF_FOLLOW;
        }
        if (Array.isArray(state.dictionaryFollow) && state.dictionaryFollow.length > 0) {
          const normaliseToLower = (value) => {
            if (!value || typeof value !== "string") {
              return "";
            }
            try {
              return value.normalize("NFKC").toLowerCase();
            } catch (err) {
              return value.toLowerCase();
            }
          };
          const hasFollowKeyword = (value) => {
            const normalised = normaliseToLower(value);
            return normalised !== "" && state.dictionaryFollow.some((keyword) => normalised.includes(keyword));
          };
          const followButton = Array.from(
            post.querySelectorAll('a[role="button"], div[role="button"], span[role="button"]')
          ).find((button) => {
            const ariaLabel = button && typeof button.getAttribute === "function" ? button.getAttribute("aria-label") : "";
            const buttonText = button && typeof button.textContent === "string" ? button.textContent : "";
            return hasFollowKeyword(ariaLabel) || hasFollowKeyword(buttonText);
          });
          if (followButton) {
            return keyWords.NF_FOLLOW;
          }
          const blocks = post.querySelectorAll(getNewsBlocksQuery(post));
          if (blocks.length > 0) {
            const headerText = normaliseToLower(scanTreeForText(blocks[0]).join(" "));
            if (headerText !== "" && state.dictionaryFollow.some((keyword) => headerText.includes(keyword))) {
              return keyWords.NF_FOLLOW;
            }
          }
        }
        return "";
      }
      function isNewsParticipate(post, keyWords) {
        const header = post.querySelector("h4");
        if (header) {
          const headerButtons = header.querySelectorAll('[role="button"]');
          if (headerButtons.length > 0) {
            const headerLinks = Array.from(header.querySelectorAll("a[href]")).map((link) => link.getAttribute("href")).filter((href) => typeof href === "string" && href !== "");
            const hasGroupLink = headerLinks.some((href) => href.includes("/groups/"));
            if (hasGroupLink) {
              return keyWords.NF_PARTICIPATE;
            }
          }
        }
        const query = ":scope h4 > span > span[class] > span";
        const elements = querySelectorAllNoChildren(post, query, 0);
        if (elements.length === 1) {
          return keyWords.NF_PARTICIPATE;
        }
        const keywords = [keyWords.NF_PARTICIPATE, "Join"].filter((value) => typeof value === "string" && value.trim() !== "").map((value) => value.toLowerCase());
        if (keywords.length === 0) {
          return "";
        }
        const hasKeyword = (value) => {
          if (!value || typeof value !== "string") {
            return false;
          }
          const normalised = value.toLowerCase();
          return keywords.some((keyword) => normalised.includes(keyword));
        };
        const participateButton = Array.from(
          post.querySelectorAll('a[role="button"], div[role="button"], span[role="button"]')
        ).find((button) => {
          const ariaLabel = button && typeof button.getAttribute === "function" ? button.getAttribute("aria-label") : "";
          const buttonText = button && typeof button.textContent === "string" ? button.textContent : "";
          return hasKeyword(ariaLabel) || hasKeyword(buttonText);
        });
        if (participateButton) {
          return keyWords.NF_PARTICIPATE;
        }
        const blocks = post.querySelectorAll(getNewsBlocksQuery(post));
        if (blocks.length > 0) {
          const headerText = scanTreeForText(blocks[0]).join(" ").toLowerCase();
          if (headerText && keywords.some((keyword) => headerText.includes(keyword))) {
            return keyWords.NF_PARTICIPATE;
          }
        }
        return "";
      }
      function isNewsMetaAICard(post, keyWords) {
        const selectors = [
          'a[aria-label="Visit Meta AI"]',
          'a[aria-label="Meta AI branding"]',
          'a[href*="meta.ai"]'
        ];
        if (selectors.some((selector) => post.querySelector(selector))) {
          return keyWords.NF_META_AI;
        }
        const postTexts = extractTextContent(post, getNewsBlocksQuery(post), 3).join(" ").toLowerCase();
        if (postTexts.includes("try meta ai") || postTexts.includes("free ai creation tools")) {
          return keyWords.NF_META_AI;
        }
        return "";
      }
      function isNewsStoriesPost(post, keyWords) {
        const queryForStory = '[href^="/stories/"][href*="source=from_feed"]';
        const elStory = post.querySelector(queryForStory);
        return elStory ? keyWords.NF_STORIES : "";
      }
      function isNewsVerifiedBadge(post, keyWords) {
        const headerBadge = post.querySelector("h4 svg, h5 svg");
        if (!headerBadge) {
          return "";
        }
        return keyWords.NF_FILTER_VERIFIED_BADGE;
      }
      function findTopCardsForPagesContainer(mainColumn) {
        if (!mainColumn) {
          return null;
        }
        const labelledRegion = mainColumn.querySelector(
          'div[role="region"][aria-label="profile plus top of feed cards"]'
        );
        if (labelledRegion) {
          return labelledRegion;
        }
        const anchors = Array.from(mainColumn.querySelectorAll('a[href="/reel/"], a[href="/stories/"]'));
        if (anchors.length === 0) {
          return null;
        }
        const candidates = /* @__PURE__ */ new Set();
        anchors.forEach((anchor) => {
          if (anchor.closest('div[role="article"], div[aria-posinset]')) {
            return;
          }
          const region = anchor.closest('div[role="region"]');
          if (region && mainColumn.contains(region)) {
            candidates.add(region);
          }
        });
        for (const region of candidates) {
          if (region.querySelector('a[href="/reel/"]') && region.querySelector('a[href="/stories/"]')) {
            return region;
          }
        }
        const reelsLink = anchors.find(
          (anchor) => anchor.getAttribute("href") === "/reel/" && !anchor.closest('div[role="article"], div[aria-posinset]')
        );
        const storiesLink = anchors.find(
          (anchor) => anchor.getAttribute("href") === "/stories/" && !anchor.closest('div[role="article"], div[aria-posinset]')
        );
        if (!reelsLink || !storiesLink) {
          return null;
        }
        let node = reelsLink.parentElement;
        while (node && node !== mainColumn) {
          if (node.contains(storiesLink)) {
            return node;
          }
          node = node.parentElement;
        }
        return null;
      }
      function cleanConsoleTable(findItem, context) {
        const { keyWords, state, options } = context;
        if (!keyWords || !state || !options) {
          return;
        }
        const query = 'div[role="complementary"] > div > div > div > div > div:not([data-visualcompletion])';
        const asideBoxes = document.querySelectorAll(query);
        if (asideBoxes.length === 0) {
          return;
        }
        const asideContainer = asideBoxes[0];
        if (asideContainer.childElementCount === 0) {
          return;
        }
        let elItem = null;
        let reason = "";
        if (findItem === "Sponsored") {
          elItem = asideContainer.querySelector(`:scope > span:not([${postAtt}])`);
          if (elItem && elItem.innerHTML.length > 0) {
            reason = keyWords.SPONSORED;
          }
        } else if (findItem === "Suggestions") {
          elItem = asideContainer.querySelector(`:scope > div:not([${postAtt}])`);
          if (elItem && elItem.innerHTML.length > 0) {
            const birthdays = elItem.querySelectorAll('a[href="/events/birthdays/"]').length > 0;
            const pagesAndProfiles = elItem.querySelectorAll('div > i[data-visualcompletion="css-img"]').length > 1;
            if (!birthdays && !pagesAndProfiles) {
              reason = keyWords.NF_SUGGESTIONS;
            }
          }
        }
        if (reason.length > 0) {
          hideNewsPost(elItem, reason, false, {
            options,
            keyWords,
            attributes: {
              postAtt,
              postAttTab
            },
            state
          });
        }
      }
      function scrubTabbies(context) {
        const { keyWords, state } = context;
        if (!keyWords || !state) {
          return;
        }
        const tabLabel = keyWords.NF_TABLIST_STORIES_REELS_ROOMS && typeof keyWords.NF_TABLIST_STORIES_REELS_ROOMS === "object" ? keyWords.NF_TABLIST_STORIES_REELS_ROOMS[state.language] : keyWords.NF_TABLIST_STORIES_REELS_ROOMS;
        const queryTabList = 'div[role="main"] > div > div > div > div > div > div > div > div[role="tablist"]';
        const elTabList = document.querySelector(queryTabList);
        if (elTabList) {
          if (elTabList.hasAttribute(postAttChildFlag)) {
            return;
          }
          const elParent = climbUpTheTree(elTabList, 4);
          if (elParent) {
            if (tabLabel) {
              hideFeature(elParent, tabLabel.replaceAll('"', ""), false, context);
            }
            elTabList.setAttribute(postAttChildFlag, "tablist");
            return;
          }
        } else {
          const queryForCreateStory = 'div[role="main"] > div > div > div > div > div > div > div > div a[href*="/stories/create"]';
          const elCreateStory = document.querySelector(queryForCreateStory);
          if (elCreateStory && !elCreateStory.hasAttribute(postAttChildFlag)) {
            const elParent = getStoriesParent(elCreateStory);
            if (elParent !== null) {
              hideFeature(elParent, keyWords.NF_TABLIST_STORIES_REELS_ROOMS, false, context);
              elCreateStory.setAttribute(postAttChildFlag, "1");
            }
          }
        }
      }
      function getStoriesParent(element) {
        const elAFewBranchesUp = climbUpTheTree(element, 4);
        const moreStories = elAFewBranchesUp.querySelectorAll('a[href*="/stories/"]');
        let elParent = null;
        if (moreStories.length > 1) {
          elParent = climbUpTheTree(element.closest('div[aria-label][role="region"]'), 4);
        } else {
          elParent = climbUpTheTree(element, 7);
        }
        return elParent;
      }
      function scrubSurvey(context) {
        const { keyWords } = context;
        const btnSurvey = document.querySelector(`${newsSelectors.surveyButton}:not([${postAtt}])`);
        if (btnSurvey) {
          const elContainer = climbUpTheTree(btnSurvey.closest('[style*="border-radius"]'), 3);
          if (elContainer) {
            hideFeature(elContainer, "Survey", false, context);
            btnSurvey.setAttribute(postAttChildFlag, keyWords.NF_SURVEY);
          }
        }
      }
      function scrubTopCardsForPages(context) {
        const { keyWords } = context;
        const mainColumn = document.querySelector(newsSelectors.mainColumn);
        if (!mainColumn) {
          return;
        }
        const container = findTopCardsForPagesContainer(mainColumn);
        if (!container || container.hasAttribute(postAttChildFlag)) {
          return;
        }
        hideFeature(container, keyWords.NF_TOP_CARDS_PAGES, false, context);
        container.setAttribute(postAttChildFlag, keyWords.NF_TOP_CARDS_PAGES);
      }
      function scrubVerifiedBadges(context) {
        const { state } = context;
        if (!state) {
          return;
        }
        const hideBadge = (badge) => {
          badge.setAttribute(state.cssHideVerifiedBadge, "");
          badge.style.display = "none";
          badge.style.width = "0";
          badge.style.height = "0";
          badge.style.margin = "0";
          badge.style.padding = "0";
          let wrapper = badge.parentElement;
          let candidate = null;
          while (wrapper && wrapper.tagName === "SPAN") {
            const hasLink = wrapper.querySelector("a[href]");
            const hasButton = wrapper.getAttribute("role") === "button" || wrapper.querySelector('[role="button"]');
            if (!hasLink && !hasButton) {
              candidate = wrapper;
            }
            wrapper = wrapper.parentElement;
          }
          if (candidate) {
            candidate.setAttribute(state.cssHideVerifiedBadge, "");
            candidate.style.display = "none";
            candidate.style.margin = "0";
            candidate.style.padding = "0";
          }
        };
        const mainColumn = document.querySelector(newsSelectors.mainColumn);
        if (mainColumn) {
          const badges = mainColumn.querySelectorAll(
            'div[role="article"] h4 svg, div[aria-posinset] h4 svg, div[role="article"] h5 svg, div[aria-posinset] h5 svg'
          );
          badges.forEach(hideBadge);
        }
        const elDialog = document.querySelector(newsSelectors.dialog);
        if (elDialog) {
          const badges = elDialog.querySelectorAll(
            'div[role="article"] h4 svg, div[aria-posinset] h4 svg, div[role="article"] h5 svg, div[aria-posinset] h5 svg'
          );
          badges.forEach(hideBadge);
        }
      }
      function getSidePanelAiTargets() {
        const targets = /* @__PURE__ */ new Set();
        const navs = Array.from(document.querySelectorAll('div[role="navigation"]'));
        navs.forEach((nav) => {
          const metaLinks = nav.querySelectorAll('a[href*="meta.ai"]');
          metaLinks.forEach((link) => {
            const li = link.closest("li");
            targets.add(li || link);
          });
          const navItems = Array.from(nav.querySelectorAll("li"));
          navItems.forEach((li) => {
            const text = li.textContent ? li.textContent.trim() : "";
            if (text === "Manus AI") {
              targets.add(li);
            }
          });
        });
        const rightPanel = document.querySelector('div[role="complementary"]');
        if (rightPanel) {
          const metaThreads = rightPanel.querySelectorAll(
            'a[href*="/messages/t/36327,2227039302/"]'
          );
          metaThreads.forEach((link) => {
            const li = link.closest("li");
            targets.add(li || link);
          });
          const rightItems = Array.from(rightPanel.querySelectorAll("li"));
          rightItems.forEach((li) => {
            const text = li.textContent ? li.textContent.trim() : "";
            if (text.includes("Meta AI")) {
              targets.add(li);
            }
          });
        }
        return Array.from(targets);
      }
      function scrubSidePanelAi(context) {
        const { state } = context;
        if (!state) {
          return;
        }
        const targets = getSidePanelAiTargets();
        targets.forEach((target) => {
          target.setAttribute(state.hideAtt, "");
          target.style.display = "none";
          target.style.margin = "0";
          target.style.padding = "0";
        });
      }
      function postExceedsLikeCount(post, options, keyWords) {
        const queryLikes = 'span[role="toolbar"] ~ div div[role="button"] > span[class][aria-hidden] > span:not([class]) > span[class]';
        const elLikes = post.querySelectorAll(queryLikes);
        if (elLikes.length > 0) {
          const maxLikes = parseInt(options.NF_LIKES_MAXIMUM_COUNT, 10);
          const postLikesCount = getFullNumber(elLikes[0].textContent.trim());
          return postLikesCount >= maxLikes ? keyWords.NF_LIKES_MAXIMUM : "";
        }
        return false;
      }
      function mopNewsFeed(context) {
        if (!context) {
          return null;
        }
        const { state, options, filters, keyWords, pathInfo } = context;
        if (!state || !options || !filters || !keyWords || !pathInfo) {
          return null;
        }
        const [mainColumn, elDialog] = isNewsDirty(state);
        if (!mainColumn && !elDialog) {
          return null;
        }
        if (mainColumn) {
          if (options.NF_TABLIST_STORIES_REELS_ROOMS) {
            scrubTabbies(context);
          }
          if (options.NF_SURVEY) {
            scrubSurvey(context);
          }
          if (options.NF_TOP_CARDS_PAGES) {
            scrubTopCardsForPages(context);
          }
          if (options.NF_HIDE_VERIFIED_BADGE) {
            scrubVerifiedBadges(context);
          }
          if (options.NF_AI_SIDE_PANELS) {
            scrubSidePanelAi(context);
          }
          if (options.NF_SPONSORED) {
            cleanConsoleTable("Sponsored", context);
          }
          if (options.NF_SUGGESTIONS) {
            cleanConsoleTable("Suggestions", context);
          }
          const posts = getCollectionOfNewsPosts();
          for (const post of posts) {
            if (post.innerHTML.length === 0) {
              continue;
            }
            let hideReason = "";
            let isSponsoredPost = false;
            if (post.hasAttribute(postAtt)) {
              hideReason = "hidden";
            } else {
              doLightDusting(post, state);
              if (hideReason === "" && options.NF_REELS_SHORT_VIDEOS) {
                hideReason = isNewsReelsAndShortVideos(post, state, keyWords);
              }
              if (hideReason === "" && options.NF_SHORT_REEL_VIDEO) {
                hideReason = isNewsShortReelVideo(post, keyWords);
              }
              if (hideReason === "" && options.NF_META_AI) {
                hideReason = isNewsMetaAICard(post, keyWords);
              }
              if (hideReason === "" && options.NF_PAID_PARTNERSHIP) {
                hideReason = isNewsPaidPartnership(post, keyWords);
              }
              if (hideReason === "" && options.NF_PEOPLE_YOU_MAY_KNOW) {
                hideReason = isNewsPeopleYouMayKnow(post, keyWords);
              }
              if (hideReason === "" && options.NF_SUGGESTIONS) {
                hideReason = isNewsSuggested(post, state, keyWords);
              }
              if (hideReason === "" && options.NF_FOLLOW) {
                hideReason = isNewsFollow(post, state, keyWords);
              }
              if (hideReason === "" && options.NF_PARTICIPATE) {
                hideReason = isNewsParticipate(post, keyWords);
              }
              if (hideReason === "" && options.NF_SPONSORED_PAID) {
                hideReason = isNewsSponsoredPaidBy(post, keyWords);
              }
              if (hideReason === "" && options.NF_EVENTS_YOU_MAY_LIKE) {
                hideReason = isNewsEventsYouMayLike(post, keyWords);
              }
              if (hideReason === "" && options.NF_FILTER_VERIFIED_BADGE) {
                hideReason = isNewsVerifiedBadge(post, keyWords);
              }
              if (hideReason === "" && options.NF_STORIES) {
                hideReason = isNewsStoriesPost(post, keyWords);
              }
              if (hideReason === "" && options.NF_ANIMATED_GIFS_POSTS) {
                hideReason = hasNewsAnimatedGifContent(post, keyWords);
              }
              if (hideReason === "" && options.NF_SPONSORED && isSponsored(post, state)) {
                isSponsoredPost = true;
                hideReason = keyWords.SPONSORED;
              }
              if (hideReason === "" && options.NF_BLOCKED_ENABLED) {
                hideReason = findNewsBlockedText(post, options, filters);
              }
              if (hideReason === "" && options.NF_LIKES_MAXIMUM && options.NF_LIKES_MAXIMUM !== "") {
                hideReason = postExceedsLikeCount(post, options, keyWords);
              }
            }
            if (hideReason.length > 0) {
              if (hideReason !== "hidden") {
                hideNewsPost(post, hideReason, isSponsoredPost, {
                  options,
                  keyWords,
                  attributes: {
                    postAtt,
                    postAttTab
                  },
                  state
                });
              }
            } else {
              if (options.NF_ANIMATED_GIFS_PAUSE) {
                swatTheMosquitos(post);
              }
              if (state.hideAnInfoBox) {
                scrubInfoBoxes(post, options, keyWords, pathInfo, state);
              }
              if (options.NF_SHARES) {
                hideNumberOfShares(post, state, options);
              }
            }
          }
          mainColumn.setAttribute(mainColumnAtt, mainColumn.innerHTML.length.toString());
          state.noChangeCounter = 0;
        }
        if (elDialog) {
          if (options.NF_ANIMATED_GIFS_PAUSE) {
            swatTheMosquitos(elDialog);
          }
          elDialog.setAttribute(mainColumnAtt, elDialog.innerHTML.length.toString());
          state.noChangeCounter = 0;
        }
        return { mainColumn, elDialog };
      }
      module.exports = {
        isGroupsYouMightLike,
        isNewsEventsYouMayLike,
        isNewsFollow,
        isNewsMetaAICard,
        isNewsPaidPartnership,
        isNewsParticipate,
        isNewsPeopleYouMayKnow,
        isNewsReelsAndShortVideos,
        isNewsSuggested,
        isNewsShortReelVideo,
        isNewsSponsoredPaidBy,
        isNewsStoriesPost,
        isNewsVerifiedBadge,
        getSidePanelAiTargets,
        findTopCardsForPagesContainer,
        mopNewsFeed,
        postExceedsLikeCount
      };
    }
  });

  // src/selectors/profile.js
  var require_profile = __commonJS({
    "src/selectors/profile.js"(exports, module) {
      var profileSelectors = {
        mainColumn: 'div[role="main"]',
        dialog: 'div[role="dialog"]',
        postsQuery: 'div[role="main"] > div > div > div > div:nth-of-type(2) > div:not([class]) > div > div[class]'
      };
      module.exports = {
        profileSelectors
      };
    }
  });

  // src/feeds/profile.js
  var require_profile2 = __commonJS({
    "src/feeds/profile.js"(exports, module) {
      var { mainColumnAtt, postAtt, postAttTab } = require_attributes();
      var { swatTheMosquitos } = require_animated_gifs();
      var { hasSizeChanged } = require_dirty_check();
      var { hidePost } = require_hide();
      var { scrubInfoBoxes } = require_info_boxes();
      var { profileSelectors } = require_profile();
      var { findProfileBlockedText } = require_blocked_text2();
      var { hasNewsAnimatedGifContent } = require_animated_gifs2();
      function isProfileColumnDirty(state) {
        const arrReturn = [null, null];
        const mainColumn = document.querySelector(profileSelectors.mainColumn);
        if (mainColumn) {
          if (!mainColumn.hasAttribute(mainColumnAtt)) {
            arrReturn[0] = mainColumn;
          } else if (hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)) {
            arrReturn[0] = mainColumn;
          }
        }
        const elDialog = document.querySelector(profileSelectors.dialog);
        if (elDialog) {
          if (!elDialog.hasAttribute(mainColumnAtt)) {
            arrReturn[1] = elDialog;
          } else if (hasSizeChanged(elDialog.getAttribute(mainColumnAtt), elDialog.innerHTML.length)) {
            arrReturn[1] = elDialog;
          }
        }
        if (state) {
          state.noChangeCounter += 1;
        }
        return arrReturn;
      }
      var profilePermalinkSelectors = [
        'a[href*="/posts/"]',
        'a[href*="/story.php"]',
        'a[href*="/permalink/"]',
        'a[href*="permalink.php"]'
      ];
      function getProfilePostsFromPermalinks(mainColumn) {
        if (!mainColumn) {
          return [];
        }
        const selector = profilePermalinkSelectors.join(",");
        const permalinks = Array.from(mainColumn.querySelectorAll(selector));
        if (permalinks.length === 0) {
          return [];
        }
        const containers = /* @__PURE__ */ new Set();
        for (const link of permalinks) {
          let node = link.parentElement;
          let lastSingle = null;
          while (node && node !== mainColumn) {
            const count = node.querySelectorAll(selector).length;
            if (count === 1) {
              lastSingle = node;
            } else {
              break;
            }
            node = node.parentElement;
          }
          if (lastSingle) {
            containers.add(lastSingle);
          }
        }
        return Array.from(containers);
      }
      function mopProfileFeed(context) {
        if (!context) {
          return null;
        }
        const { state, options, filters, keyWords, pathInfo } = context;
        if (!state || !options || !filters || !keyWords || !pathInfo) {
          return null;
        }
        const proceed = options.PP_BLOCKED_ENABLED || options.PP_ANIMATED_GIFS_POSTS || options.PP_ANIMATED_GIFS_PAUSE;
        if (!proceed) {
          return null;
        }
        const [mainColumn, elDialog] = isProfileColumnDirty(state);
        if (!mainColumn && !elDialog) {
          return null;
        }
        if (mainColumn) {
          const posts = getProfilePostsFromPermalinks(mainColumn);
          if (posts.length === 0) {
            return { mainColumn, elDialog };
          }
          for (const post of posts) {
            if (post.innerHTML.length === 0) {
              continue;
            }
            let hideReason = "";
            const isSponsoredPost = false;
            if (post.hasAttribute(postAtt)) {
              hideReason = "hidden";
            } else {
              if (hideReason === "" && options.PP_ANIMATED_GIFS_POSTS) {
                hideReason = hasNewsAnimatedGifContent(post, keyWords);
              }
              if (hideReason === "" && options.PP_BLOCKED_ENABLED) {
                hideReason = findProfileBlockedText(post, options, filters);
              }
            }
            if (hideReason.length > 0) {
              if (hideReason !== "hidden") {
                hidePost(post, hideReason, isSponsoredPost, {
                  options,
                  keyWords,
                  attributes: {
                    postAtt,
                    postAttTab
                  },
                  state
                });
              }
            } else {
              if (options.PP_ANIMATED_GIFS_PAUSE) {
                swatTheMosquitos(post);
              }
              if (state.hideAnInfoBox) {
                scrubInfoBoxes(post, options, keyWords, pathInfo, state);
              }
            }
          }
          mainColumn.setAttribute(mainColumnAtt, mainColumn.innerHTML.length.toString());
          state.noChangeCounter = 0;
        }
        if (elDialog) {
          if (options.PP_ANIMATED_GIFS_PAUSE) {
            swatTheMosquitos(elDialog);
          }
          elDialog.setAttribute(mainColumnAtt, elDialog.innerHTML.length.toString());
          state.noChangeCounter = 0;
        }
        return { mainColumn, elDialog };
      }
      module.exports = {
        getProfilePostsFromPermalinks,
        mopProfileFeed
      };
    }
  });

  // src/feeds/reels.js
  var require_reels = __commonJS({
    "src/feeds/reels.js"(exports, module) {
      var { rvAtt } = require_attributes();
      function mopReelsFeed(context, caller = "self") {
        if (!context) {
          return null;
        }
        const { state, options } = context;
        if (!state || !options) {
          return null;
        }
        if (!state.isRF) {
          state.isRF_InTimeoutMode = false;
          return null;
        }
        if (caller !== "self" && state.isRF_InTimeoutMode === true) {
          return null;
        }
        const videoRules = `[data-video-id] video:not([${rvAtt}])`;
        const videos = document.querySelectorAll(videoRules);
        for (const video of videos) {
          const elVideoId = video.closest("[data-video-id]");
          if (elVideoId) {
            const videoContainer = elVideoId.parentElement;
            if (videoContainer) {
              if (options.REELS_CONTROLS === true) {
                const descriptionOverlay = videoContainer.nextElementSibling;
                if (descriptionOverlay) {
                  const elDescriptionContainer = descriptionOverlay.children[0];
                  elDescriptionContainer.setAttribute(
                    "style",
                    `margin-bottom:${state.isChromium ? "4.5" : "2.25"}rem;`
                  );
                  video.setAttribute("controls", "true");
                  const sibling = video.nextElementSibling;
                  if (sibling) {
                    sibling.setAttribute("style", "display:none;");
                  }
                }
              }
              if (options.REELS_DISABLE_LOOPING === true) {
                video.addEventListener("ended", (ev) => {
                  ev.target.pause();
                });
              }
              video.setAttribute(rvAtt, "1");
            }
          }
        }
        state.isRF_InTimeoutMode = true;
        setTimeout(() => {
          mopReelsFeed(context, "self");
        }, 1e3);
        return videos;
      }
      module.exports = {
        mopReelsFeed
      };
    }
  });

  // src/selectors/search.js
  var require_search = __commonJS({
    "src/selectors/search.js"(exports, module) {
      var searchSelectors = {
        mainColumn: 'div[role="region"] ~ div[role="main"]',
        postsQuery: 'div[role="feed"] > div > div'
      };
      module.exports = {
        searchSelectors
      };
    }
  });

  // src/feeds/search.js
  var require_search2 = __commonJS({
    "src/feeds/search.js"(exports, module) {
      var { mainColumnAtt, postAtt, postAttTab } = require_attributes();
      var { swatTheMosquitos } = require_animated_gifs();
      var { hasSizeChanged } = require_dirty_check();
      var { hidePost } = require_hide();
      var { scrubInfoBoxes } = require_info_boxes();
      var { searchSelectors } = require_search();
      var { findNewsBlockedText } = require_blocked_text2();
      var { isSponsored } = require_sponsored();
      function isSearchColumnDirty(state) {
        const mainColumn = document.querySelector(searchSelectors.mainColumn);
        if (mainColumn) {
          if (!mainColumn.hasAttribute(mainColumnAtt)) {
            return mainColumn;
          }
          if (hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)) {
            return mainColumn;
          }
        }
        if (state) {
          state.noChangeCounter += 1;
        }
        return null;
      }
      function mopSearchFeed(context) {
        if (!context) {
          return null;
        }
        const { state, options, filters, keyWords, pathInfo } = context;
        if (!state || !options || !filters || !keyWords || !pathInfo) {
          return null;
        }
        const mainColumn = isSearchColumnDirty(state);
        if (!mainColumn) {
          return null;
        }
        if (options.NF_BLOCKED_ENABLED) {
          const posts = Array.from(document.querySelectorAll(searchSelectors.postsQuery));
          for (const post of posts) {
            if (post.innerHTML.length === 0) {
              continue;
            }
            let hideReason = "";
            let isSponsoredPost = false;
            if (post.hasAttribute(postAtt)) {
              hideReason = "hidden";
            } else {
              if (options.NF_SPONSORED && isSponsored(post, state)) {
                hideReason = keyWords.SPONSORED;
                isSponsoredPost = true;
              }
              if (hideReason === "" && options.NF_BLOCKED_ENABLED) {
                hideReason = findNewsBlockedText(post, options, filters);
              }
            }
            if (hideReason.length > 0) {
              state.echoCount += 1;
              if (hideReason !== "hidden") {
                hidePost(post, hideReason, isSponsoredPost, {
                  options,
                  keyWords,
                  attributes: {
                    postAtt,
                    postAttTab
                  },
                  state
                });
              }
            } else {
              state.echoCount = 0;
              if (options.NF_ANIMATED_GIFS_PAUSE) {
                swatTheMosquitos(post);
              }
              if (state.hideAnInfoBox) {
                scrubInfoBoxes(post, options, keyWords, pathInfo, state);
              }
            }
          }
        }
        mainColumn.setAttribute(mainColumnAtt, mainColumn.innerHTML.length.toString());
        state.noChangeCounter = 0;
        return mainColumn;
      }
      module.exports = {
        mopSearchFeed
      };
    }
  });

  // src/feeds/videos.js
  var require_videos = __commonJS({
    "src/feeds/videos.js"(exports, module) {
      var { mainColumnAtt, postAtt, postAttTab, postPropDS } = require_attributes();
      var { swatTheMosquitos } = require_animated_gifs();
      var { hasSizeChanged } = require_dirty_check();
      var { doLightDusting } = require_dusting();
      var { hideVideoPost } = require_hide();
      var { scrubInfoBoxes } = require_info_boxes();
      var { countDescendants } = require_walker();
      var { climbUpTheTree } = require_dom();
      var { findVideosBlockedText } = require_blocked_text2();
      var { isSponsored } = require_sponsored();
      function isVideosDirty(state) {
        const arrReturn = [null, null];
        const mainColumnQuery = 'div[role="navigation"] ~ div[role="main"] div[role="main"] > div > div > div > div > div';
        const mainColumns = document.querySelectorAll(mainColumnQuery);
        let mainColumn = null;
        if (mainColumns.length > 0) {
          mainColumn = mainColumns[mainColumns.length - 1];
        }
        if (mainColumn) {
          if (!mainColumn.hasAttribute(mainColumnAtt)) {
            arrReturn[0] = mainColumn;
          } else if (hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)) {
            arrReturn[0] = mainColumn;
          }
        }
        const elDialog = document.querySelector('div[role="dialog"] div[role="main"]');
        if (elDialog) {
          if (!elDialog.hasAttribute(mainColumnAtt)) {
            arrReturn[1] = elDialog;
          } else if (hasSizeChanged(elDialog.getAttribute(mainColumnAtt), elDialog.innerHTML.length)) {
            arrReturn[1] = elDialog;
          }
        }
        if (state) {
          state.noChangeCounter += 1;
        }
        return arrReturn;
      }
      function isVideoLive(post, keyWords) {
        const liveRule = 'div[role="presentation"] ~ div > div:nth-of-type(1) > span';
        const elLive = post.querySelectorAll(liveRule);
        return elLive.length > 0 ? keyWords.VF_LIVE : "";
      }
      function isInstagram(post, keyWords) {
        const instagramRule = 'div > div > div > div > div > a[href="#"] > div > svg';
        const elInstagram = post.querySelectorAll(instagramRule);
        return elInstagram.length > 0 ? keyWords.VF_INSTAGRAM : "";
      }
      function findDuplicateVideos(urlQuery, postQuery, keyWords, context) {
        const watchVideos = document.querySelectorAll(urlQuery);
        if (watchVideos.length < 2) {
          return;
        }
        for (let i = 1; i < watchVideos.length; i += 1) {
          const videoPost = watchVideos[i].closest(postQuery);
          if (videoPost) {
            hideVideoPost(videoPost, keyWords.VF_DUPLICATE_VIDEOS, "", context);
          }
        }
      }
      function hideDuplicateVideos(post, postQuery, keyWords, context) {
        const elWatchVideo = post.querySelector('div > span > a[href*="/watch/?v="]');
        if (elWatchVideo) {
          const watchVideoVID = new URL(elWatchVideo.href).searchParams.get("v");
          if (watchVideoVID) {
            findDuplicateVideos(
              `div > span > a[href*="/watch/?v=${watchVideoVID}&"]`,
              postQuery,
              keyWords,
              context
            );
          }
        } else {
          const elUserVideo = post.querySelector('div > span > a[href*="/videos/"]');
          if (elUserVideo) {
            const watchVideoVID = elUserVideo.href.split("/videos/")[1].split("/")[0];
            if (watchVideoVID) {
              findDuplicateVideos(
                `div > span > a[href*="/videos/${watchVideoVID}/"]`,
                postQuery,
                keyWords,
                context
              );
            }
          }
        }
      }
      function hideSponsoredBlock(post, queryBlocks, state) {
        const videoBlocks = post.querySelectorAll(queryBlocks);
        if (videoBlocks.length < 3) {
          return;
        }
        const thirdBlock = videoBlocks[2];
        if (thirdBlock.hasAttribute("class")) {
          return;
        }
        if (thirdBlock.hasAttribute(state.hideAtt)) {
          return;
        }
        thirdBlock.setAttribute(state.hideAtt, "Sponsored Content");
      }
      function getVideoPublisherPathFromURL(videoURL) {
        const beginURL = videoURL.split("?")[0];
        if (!beginURL) {
          return "";
        }
        if (beginURL.includes("/watch/")) {
          return beginURL.replace("/watch/", "/");
        }
        return "";
      }
      function setPostLinkToOpenInNewTab(post, state) {
        try {
          if (post.querySelector(`.${state.iconNewWindowClass}`)) {
            return;
          }
          const postLinks = post.querySelectorAll('div > span > a[href*="/watch/?v="][role="link"]');
          if (postLinks.length > 0) {
            const postLink = postLinks[0];
            const elHeader = climbUpTheTree(postLink, 3);
            if (!elHeader) {
              return;
            }
            const blockOfIcons = elHeader.querySelector(":scope > div:nth-of-type(2) > span");
            let newLink = "";
            if (blockOfIcons) {
              const videoId = new URL(postLink.href).searchParams.get("v");
              if (videoId !== null) {
                const watchLink = post.querySelector('a[href*="/watch/"]');
                if (!watchLink) {
                  return;
                }
                const publisherLink = getVideoPublisherPathFromURL(watchLink.href);
                if (publisherLink === "") {
                  return;
                }
                newLink = `${publisherLink}videos/${videoId}/`;
              } else {
                return;
              }
            } else {
              return;
            }
            const spanSpacer = document.createElement("span");
            spanSpacer.innerHTML = '<span><span style="position:absolute;width:1px;height:1px;">&nbsp;</span><span aria-hidden="true"> \xFA </span></span>';
            blockOfIcons.appendChild(spanSpacer);
            const container = document.createElement("span");
            container.className = state.iconNewWindowClass;
            const span2 = document.createElement("span");
            const linkNew = document.createElement("a");
            linkNew.setAttribute("href", newLink);
            linkNew.innerHTML = state.iconNewWindow;
            linkNew.setAttribute("target", "_blank");
            span2.appendChild(linkNew);
            container.appendChild(span2);
            blockOfIcons.appendChild(container);
          }
        } catch (error) {
          return;
        }
      }
      function scrubSponsoredBlock(post, state, options) {
        const queryForContainer = ":scope > div > div > div > div > div > div:nth-of-type(2)";
        const blocksContainer = post.querySelector(queryForContainer);
        if (blocksContainer && blocksContainer.childElementCount > 0) {
          const adBlock = blocksContainer.querySelector(":scope > a");
          if (adBlock && !adBlock.hasAttribute(postAtt)) {
            adBlock.setAttribute(state.cssHideEl, "");
            adBlock.setAttribute(postAtt, "Sponsored");
            if (options.VERBOSITY_DEBUG) {
              adBlock.setAttribute(state.showAtt, "");
            }
          }
        }
      }
      function mopVideosFeed(context) {
        if (!context) {
          return null;
        }
        const { state, options, filters, keyWords, pathInfo } = context;
        if (!state || !options || !filters || !keyWords || !pathInfo) {
          return null;
        }
        const [mainColumn, elDialog] = isVideosDirty(state);
        if (!mainColumn && !elDialog) {
          return null;
        }
        const container = elDialog || mainColumn;
        if (container) {
          let query;
          let queryBlocks;
          if (state.vfType === "videos") {
            query = ":scope > div > div:not([class]) > div";
            queryBlocks = ":scope > div > div > div > div > div:nth-of-type(2) > div";
          } else if (state.vfType === "search") {
            query = 'div[role="feed"] > div[role="article"]';
            queryBlocks = ":scope > div > div > div > div > div > div > div:nth-of-type(2)";
          } else if (state.vfType === "item") {
            query = 'div[id="watch_feed"] > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div';
            queryBlocks = ":scope > div > div > div > div > div:nth-of-type(2) > div";
          } else {
            return null;
          }
          if (state.vfType !== "search") {
            const posts = container.querySelectorAll(query);
            for (const post of posts) {
              if (countDescendants(post) < 3) {
                continue;
              }
              let hideReason = "";
              if (state.vfType === "videos" && post[postPropDS] === void 0) {
                setPostLinkToOpenInNewTab(post, state);
              }
              if (post.hasAttribute(postAtt)) {
                hideReason = "hidden";
              } else {
                doLightDusting(post, state);
                if (hideReason === "" && options.VF_SPONSORED && isSponsored(post, state)) {
                  hideReason = keyWords.SPONSORED;
                }
                if (hideReason === "" && options.VF_LIVE) {
                  hideReason = isVideoLive(post, keyWords);
                }
                if (hideReason === "" && options.VF_INSTAGRAM) {
                  hideReason = isInstagram(post, keyWords);
                }
                if (hideReason === "" && options.VF_DUPLICATE_VIDEOS) {
                  hideDuplicateVideos(post, query, keyWords, context);
                  if (post.hasAttribute(postAtt)) {
                    hideReason = "hidden";
                  }
                }
                if (hideReason === "" && options.VF_BLOCKED_ENABLED) {
                  hideReason = findVideosBlockedText(post, options, filters, queryBlocks);
                }
              }
              if (hideReason.length > 0) {
                if (hideReason !== "hidden") {
                  hideVideoPost(post, hideReason, "", {
                    options,
                    keyWords,
                    attributes: { postAtt, postAttTab },
                    state
                  });
                }
              } else {
                if (options.VF_ANIMATED_GIFS_PAUSE) {
                  swatTheMosquitos(post);
                }
                if (state.hideAnInfoBox) {
                  scrubInfoBoxes(post, options, keyWords, pathInfo, state);
                }
                scrubSponsoredBlock(post, state, options);
              }
              hideSponsoredBlock(post, queryBlocks, state);
            }
          } else {
            const posts = document.querySelectorAll(query);
            for (const post of posts) {
              let hideReason = "";
              if (post.hasAttribute(postAtt)) {
                hideReason = "hidden";
              } else if (options.VF_BLOCKED_ENABLED) {
                hideReason = findVideosBlockedText(post, options, filters, queryBlocks);
              }
              if (hideReason.length > 0) {
                if (hideReason !== "hidden") {
                  hideVideoPost(post, hideReason, "", {
                    options,
                    keyWords,
                    attributes: { postAtt, postAttTab },
                    state
                  });
                }
              }
            }
          }
          container.setAttribute(mainColumnAtt, container.innerHTML.length.toString());
          state.noChangeCounter = 0;
        }
        if (elDialog) {
          if (options.NF_ANIMATED_GIFS_PAUSE) {
            swatTheMosquitos(elDialog);
          }
        }
        return { mainColumn, elDialog };
      }
      module.exports = {
        isInstagram,
        isVideoLive,
        mopVideosFeed
      };
    }
  });

  // src/ui/i18n/dictionaries.js
  var require_dictionaries = __commonJS({
    "src/ui/i18n/dictionaries.js"(exports, module) {
      var { translations } = require_translations();
      function normaliseToLower(value) {
        if (!value || typeof value !== "string") {
          return "";
        }
        try {
          return value.normalize("NFKC").toLowerCase();
        } catch (error) {
          return value.toLowerCase();
        }
      }
      function buildDictionaries() {
        const dictionarySponsored = Object.values(translations).flatMap((translation) => [
          translation.SPONSORED ? translation.SPONSORED.toLowerCase() : void 0,
          translation.SPONSORED_EXTRA ? translation.SPONSORED_EXTRA.toLowerCase() : void 0
        ]).filter(Boolean);
        const dictionaryFollow = Array.from(
          new Set(
            Object.values(translations).map((translation) => translation.NF_FOLLOW).filter((keyword) => typeof keyword === "string" && keyword.trim() !== "").map(normaliseToLower)
          )
        );
        const dictionaryReelsAndShortVideos = Object.values(translations).map(
          (translation) => translation.NF_REELS_SHORT_VIDEOS
        );
        return {
          dictionarySponsored,
          dictionaryFollow,
          dictionaryReelsAndShortVideos
        };
      }
      module.exports = {
        buildDictionaries,
        normaliseToLower
      };
    }
  });

  // src/ui/icon-html.js
  var require_icon_html = __commonJS({
    "src/ui/icon-html.js"(exports, module) {
      function buildIconHTML(dataUri, extraClassName = "") {
        const classes = ["cmf-icon"];
        if (extraClassName) {
          classes.push(extraClassName);
        }
        const className = classes.join(" ");
        return `<span class="${className}" aria-hidden="true" style="--cmf-icon-url: url('${dataUri}')"></span>`;
      }
      module.exports = {
        buildIconHTML
      };
    }
  });

  // src/vendor/idb-keyval.js
  var require_idb_keyval = __commonJS({
    "src/vendor/idb-keyval.js"(exports, module) {
      function _typeof(n) {
        if ("function" == typeof Symbol && "symbol" == typeof Symbol.iterator) {
          return typeof n;
        }
        return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
      }
      (function(n, t) {
        "object" === ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t((n = "undefined" != typeof globalThis ? globalThis : n || self).idbKeyval = {});
      })(exports, function(n) {
        "use strict";
        function t(n2) {
          return new Promise(function(t2, e2) {
            n2.oncomplete = n2.onsuccess = function() {
              return t2(n2.result);
            }, n2.onabort = n2.onerror = function() {
              return e2(n2.error);
            };
          });
        }
        function e(n2, e2) {
          var r2, o2 = (!navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(n3) {
            var t2 = function() {
              return indexedDB.databases().finally(n3);
            };
            r2 = setInterval(t2, 100), t2();
          }).finally(function() {
            return clearInterval(r2);
          }) : Promise.resolve()).then(function() {
            var r3 = indexedDB.open(n2);
            return r3.onupgradeneeded = function() {
              return r3.result.createObjectStore(e2);
            }, t(r3);
          });
          return function(n3, t2) {
            return o2.then(function(r3) {
              return t2(r3.transaction(e2, n3).objectStore(e2));
            });
          };
        }
        var r;
        function o() {
          return r || (r = e("keyval-store", "keyval")), r;
        }
        function u(n2, e2) {
          return n2("readonly", function(n3) {
            return n3.openCursor().onsuccess = function() {
              this.result && (e2(this.result), this.result.continue());
            }, t(n3.transaction);
          });
        }
        n.clear = function() {
          var n2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : o();
          return n2("readwrite", function(n3) {
            return n3.clear(), t(n3.transaction);
          });
        }, n.createStore = e, n.del = function(n2) {
          var e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o();
          return e2("readwrite", function(e3) {
            return e3.delete(n2), t(e3.transaction);
          });
        }, n.delMany = function(n2) {
          var e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o();
          return e2("readwrite", function(e3) {
            return n2.forEach(function(n3) {
              return e3.delete(n3);
            }), t(e3.transaction);
          });
        }, n.entries = function() {
          var n2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : o(), t2 = [];
          return u(n2, function(n3) {
            return t2.push([n3.key, n3.value]);
          }).then(function() {
            return t2;
          });
        }, n.get = function(n2) {
          var e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o();
          return e2("readonly", function(e3) {
            return t(e3.get(n2));
          });
        }, n.getMany = function(n2) {
          var e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o();
          return e2("readonly", function(e3) {
            return Promise.all(
              n2.map(function(n3) {
                return t(e3.get(n3));
              })
            );
          });
        }, n.keys = function() {
          var n2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : o(), t2 = [];
          return u(n2, function(n3) {
            return t2.push(n3.key);
          }).then(function() {
            return t2;
          });
        }, n.promisifyRequest = t, n.set = function(n2, e2) {
          var r2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : o();
          return r2("readwrite", function(r3) {
            return r3.put(e2, n2), t(r3.transaction);
          });
        }, n.setMany = function(n2) {
          var e2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o();
          return e2("readwrite", function(e3) {
            return n2.forEach(function(n3) {
              return e3.put(n3[1], n3[0]);
            }), t(e3.transaction);
          });
        }, n.update = function(n2, e2) {
          var r2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : o();
          return r2("readwrite", function(r3) {
            return new Promise(function(o2, u2) {
              r3.get(n2).onsuccess = function() {
                try {
                  r3.put(e2(this.result), n2), o2(t(r3.transaction));
                } catch (n3) {
                  u2(n3);
                }
              };
            });
          });
        }, n.values = function() {
          var n2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : o(), t2 = [];
          return u(n2, function(n3) {
            return t2.push(n3.value);
          }).then(function() {
            return t2;
          });
        }, Object.defineProperty(n, "__esModule", { value: true });
      });
    }
  });

  // src/storage/idb.js
  var require_idb = __commonJS({
    "src/storage/idb.js"(exports, module) {
      var idbKeyval = require_idb_keyval();
      var DB_NAME = "dbCMF";
      var DB_STORE = "Mopping";
      var DB_KEY = "Options";
      var optionsStore = idbKeyval.createStore(DB_NAME, DB_STORE);
      function getOptions() {
        return idbKeyval.get(DB_KEY, optionsStore);
      }
      function setOptions(options) {
        return idbKeyval.set(DB_KEY, options, optionsStore);
      }
      function deleteOptions() {
        return idbKeyval.del(DB_KEY, optionsStore);
      }
      module.exports = {
        DB_KEY,
        DB_NAME,
        DB_STORE,
        deleteOptions,
        getOptions,
        optionsStore,
        setOptions
      };
    }
  });

  // src/dom/tooltip.js
  var require_tooltip = __commonJS({
    "src/dom/tooltip.js"(exports, module) {
      var { generateRandomString } = require_random();
      function positionTooltip(target, tooltip, placement = "auto") {
        if (!target || !tooltip || typeof target.getBoundingClientRect !== "function") {
          return;
        }
        if (typeof window === "undefined") {
          return;
        }
        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const gap = 8;
        const edgePadding = 8;
        let top = rect.bottom + gap;
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        if (placement === "right") {
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.right + gap;
          if (left + tooltipRect.width + edgePadding > window.innerWidth) {
            left = rect.left - tooltipRect.width - gap;
          }
          top = Math.max(
            edgePadding,
            Math.min(top, window.innerHeight - tooltipRect.height - edgePadding)
          );
        } else {
          if (top + tooltipRect.height + edgePadding > window.innerHeight) {
            top = rect.top - tooltipRect.height - gap;
          }
        }
        left = Math.max(edgePadding, Math.min(left, window.innerWidth - tooltipRect.width - edgePadding));
        tooltip.style.top = `${Math.round(top)}px`;
        tooltip.style.left = `${Math.round(left)}px`;
      }
      function attachTooltip(target, text, options = {}) {
        if (!target || !text) {
          return () => {
          };
        }
        let tooltip = null;
        let showTimer = null;
        const placement = options && options.placement ? options.placement : "auto";
        const tooltipId = target.dataset.cmfTooltipId || `fbcmf-tooltip-${generateRandomString(8)}`;
        target.dataset.cmfTooltipId = tooltipId;
        target.setAttribute("aria-describedby", tooltipId);
        const updatePosition = () => {
          if (!tooltip) {
            return;
          }
          positionTooltip(target, tooltip, placement);
        };
        const show = () => {
          if (tooltip || !document.body || !target.isConnected) {
            return;
          }
          tooltip = document.createElement("div");
          tooltip.id = tooltipId;
          tooltip.className = "fb-cmf-tooltip";
          tooltip.setAttribute("role", "tooltip");
          tooltip.textContent = text;
          tooltip.style.visibility = "hidden";
          document.body.appendChild(tooltip);
          updatePosition();
          tooltip.style.visibility = "visible";
        };
        const hide = () => {
          if (showTimer) {
            clearTimeout(showTimer);
            showTimer = null;
          }
          if (tooltip) {
            tooltip.remove();
            tooltip = null;
          }
        };
        const onEnter = () => {
          if (showTimer) {
            clearTimeout(showTimer);
          }
          showTimer = setTimeout(show, 400);
        };
        const onLeave = () => {
          hide();
        };
        target.addEventListener("pointerenter", onEnter);
        target.addEventListener("pointerleave", onLeave);
        if (typeof window !== "undefined") {
          window.addEventListener("scroll", updatePosition, true);
          window.addEventListener("resize", updatePosition);
        }
        return () => {
          hide();
          target.removeEventListener("pointerenter", onEnter);
          target.removeEventListener("pointerleave", onLeave);
          if (typeof window !== "undefined") {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
          }
        };
      }
      module.exports = {
        attachTooltip
      };
    }
  });

  // src/ui/controls/toggle-button.js
  var require_toggle_button = __commonJS({
    "src/ui/controls/toggle-button.js"(exports, module) {
      var { attachTooltip } = require_tooltip();
      function createToggleButton(state, keyWords, onToggle) {
        if (!state || !keyWords || typeof onToggle !== "function") {
          return null;
        }
        if (!document.body) {
          return null;
        }
        const btnLocation = state.options && state.options.CMF_BTN_OPTION ? state.options.CMF_BTN_OPTION.toString() : "0";
        const useTopRight = btnLocation === "1";
        const btn = document.createElement(useTopRight ? "div" : "button");
        btn.innerHTML = state.iconToggleHTML;
        btn.id = "fbcmfToggle";
        btn.removeAttribute("title");
        btn.className = "fb-cmf-toggle fb-cmf-icon";
        if (useTopRight) {
          btn.classList.add("fb-cmf-toggle-topbar");
        }
        let toggleHandler = onToggle;
        if (useTopRight) {
          toggleHandler = () => {
            onToggle();
          };
          btn.setAttribute("role", "button");
          btn.setAttribute("tabindex", "0");
          btn.setAttribute("aria-label", keyWords.DLG_TITLE);
          btn.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleHandler();
            }
          });
        }
        btn.addEventListener("click", toggleHandler, false);
        const tooltipPlacement = btnLocation === "0" ? "right" : "auto";
        attachTooltip(btn, keyWords.DLG_TITLE, { placement: tooltipPlacement });
        let cachedIconColor = "";
        let cachedBtnBg = "";
        let cachedHover = "";
        let cachedPress = "";
        let lastMenuRect = null;
        let observedMenuButton = null;
        let updateScheduled = false;
        let themeDirty = false;
        let resizeObserver = null;
        const hexToRgba = (value, alpha) => {
          if (!value) {
            return "";
          }
          const hex = value.trim();
          if (!hex.startsWith("#")) {
            return "";
          }
          const normalized = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
          if (normalized.length !== 7) {
            return "";
          }
          const r = parseInt(normalized.slice(1, 3), 16);
          const g = parseInt(normalized.slice(3, 5), 16);
          const b = parseInt(normalized.slice(5, 7), 16);
          if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
            return "";
          }
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        const isUsableColor = (value) => {
          if (!value) {
            return false;
          }
          const normalized = value.trim().toLowerCase();
          if (!normalized || normalized === "transparent" || normalized === "none") {
            return false;
          }
          if (normalized.startsWith("rgba(") && normalized.endsWith(", 0)")) {
            return false;
          }
          return true;
        };
        const updateTopRightPosition = () => {
          const menuButton = document.querySelector('[role="banner"] [aria-label="Menu"]');
          if (!menuButton) {
            btn.style.position = "fixed";
            btn.style.top = "0.5rem";
            btn.style.right = "0.5rem";
            btn.style.left = "auto";
            btn.style.zIndex = "999";
            lastMenuRect = null;
            return false;
          }
          const rect = menuButton.getBoundingClientRect();
          lastMenuRect = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          };
          const menuStyle = window.getComputedStyle(menuButton);
          const hoverOverlay = menuStyle.getPropertyValue("--hover-overlay");
          const pressOverlay = menuStyle.getPropertyValue("--press-overlay");
          const secondaryBg = menuStyle.getPropertyValue("--secondary-button-background");
          const accent = menuStyle.getPropertyValue("--accent");
          const primaryButtonBg = menuStyle.getPropertyValue("--primary-button-background");
          const isMenuExpanded = menuButton.getAttribute("aria-expanded") === "true";
          const gap = 8;
          const left = Math.max(0, rect.left - rect.width - gap);
          btn.style.position = "fixed";
          btn.style.top = `${rect.top}px`;
          btn.style.left = `${left}px`;
          btn.style.right = "auto";
          btn.style.width = `${rect.width}px`;
          btn.style.height = `${rect.height}px`;
          btn.style.borderRadius = menuStyle.borderRadius;
          btn.style.boxShadow = menuStyle.boxShadow;
          const iconElement = menuButton.querySelector("svg, i, span");
          const iconStyle = iconElement ? window.getComputedStyle(iconElement) : null;
          const iconColor = iconStyle ? iconStyle.color : "";
          const iconFill = iconStyle ? iconStyle.getPropertyValue("fill") : "";
          const menuColor = menuStyle.color;
          const secondaryIcon = menuStyle.getPropertyValue("--secondary-icon");
          const resolvedIconColor = [iconColor, iconFill, menuColor, secondaryIcon].find(isUsableColor) || "var(--secondary-icon)";
          if (themeDirty || !isMenuExpanded || !cachedIconColor) {
            cachedIconColor = resolvedIconColor;
          }
          const finalIconColor = cachedIconColor || resolvedIconColor;
          btn.style.setProperty("--cmf-icon-color", finalIconColor);
          if (btn.getAttribute("data-cmf-open") === "true") {
            btn.style.color = "";
          } else {
            btn.style.color = finalIconColor;
          }
          const activeBg = hexToRgba(primaryButtonBg, 0.2);
          if (activeBg) {
            btn.style.setProperty("--cmf-active-bg", activeBg);
          }
          if (accent) {
            btn.style.setProperty("--cmf-active-icon", accent);
          }
          const icon = btn.querySelector("svg, .cmf-icon");
          if (icon) {
            if (icon.tagName && icon.tagName.toLowerCase() === "svg") {
              icon.style.fill = "currentColor";
            }
            if (iconStyle && iconStyle.width && iconStyle.height) {
              icon.style.width = iconStyle.width;
              icon.style.height = iconStyle.height;
            }
          }
          const zIndexValue = menuStyle.zIndex;
          if (zIndexValue && zIndexValue !== "auto" && zIndexValue !== "0") {
            btn.style.zIndex = zIndexValue;
          } else {
            btn.style.zIndex = "9999";
          }
          btn.style.padding = "0";
          btn.style.margin = "0";
          if (themeDirty || !isMenuExpanded || !cachedBtnBg) {
            if (secondaryBg) {
              cachedBtnBg = secondaryBg;
            } else if (menuStyle.backgroundColor) {
              cachedBtnBg = menuStyle.backgroundColor;
            }
          }
          if (cachedBtnBg) {
            btn.style.setProperty("--cmf-btn-bg", cachedBtnBg);
          }
          btn.style.backgroundColor = "";
          if (themeDirty || !isMenuExpanded || !cachedHover) {
            cachedHover = hoverOverlay || "var(--hover-overlay)";
          }
          if (themeDirty || !isMenuExpanded || !cachedPress) {
            cachedPress = pressOverlay || "var(--press-overlay)";
          }
          btn.style.setProperty("--cmf-btn-hover", cachedHover || hoverOverlay || "var(--hover-overlay)");
          btn.style.setProperty("--cmf-btn-press", cachedPress || pressOverlay || "var(--press-overlay)");
          themeDirty = false;
          return true;
        };
        const scheduleUpdate = () => {
          if (updateScheduled) {
            return;
          }
          updateScheduled = true;
          const runUpdate = () => {
            updateScheduled = false;
            updateTopRightPosition();
          };
          if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
            window.requestAnimationFrame(runUpdate);
          } else {
            setTimeout(runUpdate, 0);
          }
        };
        const getMenuButton = () => document.querySelector('[role="banner"] [aria-label="Menu"]');
        const observeMenuButton = () => {
          const menuButton = getMenuButton();
          if (menuButton === observedMenuButton) {
            return;
          }
          if (resizeObserver && observedMenuButton) {
            resizeObserver.unobserve(observedMenuButton);
          }
          observedMenuButton = menuButton;
          if (resizeObserver && observedMenuButton) {
            resizeObserver.observe(observedMenuButton);
          }
          cachedIconColor = "";
          cachedBtnBg = "";
          cachedHover = "";
          cachedPress = "";
          scheduleUpdate();
        };
        const needsMenuSync = () => {
          const menuButton = getMenuButton();
          if (!menuButton) {
            return lastMenuRect !== null;
          }
          const rect = menuButton.getBoundingClientRect();
          if (!lastMenuRect) {
            return true;
          }
          return Math.abs(rect.left - lastMenuRect.left) > 1 || Math.abs(rect.top - lastMenuRect.top) > 1 || Math.abs(rect.width - lastMenuRect.width) > 1 || Math.abs(rect.height - lastMenuRect.height) > 1;
        };
        if (useTopRight) {
          if (!btn.isConnected) {
            document.body.appendChild(btn);
          }
          if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(() => {
              scheduleUpdate();
            });
          }
          observeMenuButton();
          const banner = document.querySelector('[role="banner"]');
          if (banner && typeof MutationObserver !== "undefined") {
            const observer = new MutationObserver(() => {
              observeMenuButton();
              scheduleUpdate();
            });
            observer.observe(banner, { childList: true, subtree: true });
          }
          if (typeof window !== "undefined") {
            window.addEventListener("resize", scheduleUpdate);
            setInterval(() => {
              if (needsMenuSync()) {
                scheduleUpdate();
              }
            }, 2e3);
          }
          if (typeof MutationObserver !== "undefined") {
            const stateObserver = new MutationObserver(() => {
              if (btn.getAttribute("data-cmf-open") === "true") {
                btn.style.color = "";
              }
              scheduleUpdate();
            });
            stateObserver.observe(btn, { attributes: true, attributeFilter: ["data-cmf-open"] });
          }
        } else {
          document.body.appendChild(btn);
        }
        state.btnToggleEl = btn;
        if (state.isAF) {
          btn.setAttribute(state.showAtt, "");
        }
        if (useTopRight) {
          const dialog = document.getElementById("fbcmf");
          if (dialog && dialog.hasAttribute(state.showAtt)) {
            btn.setAttribute("data-cmf-open", "true");
          }
        }
        state.syncToggleButtonTheme = () => {
          cachedIconColor = "";
          cachedBtnBg = "";
          cachedHover = "";
          cachedPress = "";
          themeDirty = true;
          scheduleUpdate();
          setTimeout(scheduleUpdate, 250);
        };
        return btn;
      }
      module.exports = {
        createToggleButton
      };
    }
  });

  // src/selectors/groups.js
  var require_groups2 = __commonJS({
    "src/selectors/groups.js"(exports, module) {
      var groupsSelectors = {
        mainColumn: 'div[role="navigation"] ~ div[role="main"]',
        groupPageMainColumn: 'div[role="main"] div[role="feed"]',
        dialog: 'div[role="dialog"]',
        feedQueryRecent: 'h2[dir="auto"] + div > div',
        feedQueryMultiple: 'div[role="feed"] > div',
        feedQuerySingle: 'div[role="feed"] > div'
      };
      module.exports = {
        groupsSelectors
      };
    }
  });

  // src/selectors/videos.js
  var require_videos2 = __commonJS({
    "src/selectors/videos.js"(exports, module) {
      var videosSelectors = {
        mainColumn: 'div[role="navigation"] ~ div[role="main"] div[role="main"] > div > div > div > div > div',
        dialog: 'div[role="dialog"] div[role="main"]',
        feedQueries: {
          videos: ":scope > div > div:not([class]) > div",
          search: 'div[role="feed"] > div[role="article"]',
          item: 'div[id="watch_feed"] > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div'
        },
        blockQueries: {
          videos: ":scope > div > div > div > div > div:nth-of-type(2) > div",
          search: ":scope > div > div > div > div > div > div > div:nth-of-type(2)",
          item: ":scope > div > div > div > div > div:nth-of-type(2) > div"
        }
      };
      module.exports = {
        videosSelectors
      };
    }
  });

  // src/selectors/marketplace.js
  var require_marketplace2 = __commonJS({
    "src/selectors/marketplace.js"(exports, module) {
      var marketplaceSelectors = {
        mainColumn: 'div[role="navigation"] ~ div[role="main"]',
        dialogItem: 'div[hidden] ~ div[class*="__"] div[role="dialog"]'
      };
      module.exports = {
        marketplaceSelectors
      };
    }
  });

  // src/ui/reporting/bug-report.js
  var require_bug_report = __commonJS({
    "src/ui/reporting/bug-report.js"(exports, module) {
      var { postAtt } = require_attributes();
      var { newsSelectors } = require_news();
      var { groupsSelectors } = require_groups2();
      var { videosSelectors } = require_videos2();
      var { marketplaceSelectors } = require_marketplace2();
      var { profileSelectors } = require_profile();
      var { searchSelectors } = require_search();
      var { isSponsored } = require_sponsored();
      var {
        findGroupsBlockedText,
        findNewsBlockedText,
        findProfileBlockedText,
        findVideosBlockedText
      } = require_blocked_text2();
      var {
        hasGroupsAnimatedGifContent,
        hasNewsAnimatedGifContent
      } = require_animated_gifs2();
      var { findNumberOfShares } = require_shares();
      var {
        isNewsEventsYouMayLike,
        isNewsFollow,
        isNewsMetaAICard,
        isNewsPaidPartnership,
        isNewsParticipate,
        isNewsPeopleYouMayKnow,
        isNewsReelsAndShortVideos,
        isNewsShortReelVideo,
        isNewsSponsoredPaidBy,
        isNewsStoriesPost,
        isNewsSuggested,
        postExceedsLikeCount
      } = require_news2();
      var { isGroupsShortReelVideo, isGroupsSuggested } = require_groups();
      var { isInstagram, isVideoLive } = require_videos();
      var { mpGetBlockedPrices, mpGetBlockedTextDescription } = require_marketplace();
      var SUPPORT_URL_FALLBACK = "https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/issues";
      var BLOCKED_TEXT_OPTION_KEYS = [
        "NF_BLOCKED_TEXT",
        "GF_BLOCKED_TEXT",
        "VF_BLOCKED_TEXT",
        "MP_BLOCKED_TEXT",
        "MP_BLOCKED_TEXT_DESCRIPTION",
        "PP_BLOCKED_TEXT"
      ];
      var BLOCKED_TEXT_FILTER_KEYS = [
        "NF_BLOCKED_TEXT_LC",
        "GF_BLOCKED_TEXT_LC",
        "VF_BLOCKED_TEXT_LC",
        "MP_BLOCKED_TEXT_LC",
        "MP_BLOCKED_TEXT_DESCRIPTION_LC",
        "PP_BLOCKED_TEXT_LC"
      ];
      function hashText(value) {
        if (typeof value !== "string" || value.length === 0) {
          return "";
        }
        let hash = 2166136261;
        for (let i = 0; i < value.length; i += 1) {
          hash ^= value.charCodeAt(i);
          hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return `fnv1a:${(hash >>> 0).toString(16)}`;
      }
      function getSupportUrl() {
        const gm = typeof globalThis !== "undefined" ? globalThis.GM : void 0;
        if (gm && gm.info && gm.info.script && gm.info.script.supportURL) {
          return gm.info.script.supportURL;
        }
        return SUPPORT_URL_FALLBACK;
      }
      function getScriptInfo() {
        const gm = typeof globalThis !== "undefined" ? globalThis.GM : void 0;
        const script = gm && gm.info && gm.info.script ? gm.info.script : null;
        return {
          name: script && script.name ? script.name : "FB - Clean my feeds",
          version: script && script.version ? script.version : "unknown",
          supportURL: script && script.supportURL ? script.supportURL : getSupportUrl(),
          handler: gm && gm.info && gm.info.scriptHandler ? gm.info.scriptHandler : "unknown"
        };
      }
      function summarizeList(list, limit = 20) {
        if (!Array.isArray(list)) {
          return { count: 0, hashes: [], truncated: false };
        }
        const hashes = list.slice(0, limit).map((value) => hashText(String(value)));
        return {
          count: list.length,
          hashes,
          truncated: list.length > limit
        };
      }
      function redactOptions(options) {
        const redacted = { ...options };
        for (const key of BLOCKED_TEXT_OPTION_KEYS) {
          if (Object.prototype.hasOwnProperty.call(redacted, key)) {
            redacted[key] = "[redacted]";
          }
        }
        Object.keys(redacted).forEach((key) => {
          if (!key || key.trim() === "") {
            delete redacted[key];
          }
        });
        return redacted;
      }
      function redactFilters(filters) {
        const redacted = { ...filters };
        for (const key of BLOCKED_TEXT_FILTER_KEYS) {
          if (Object.prototype.hasOwnProperty.call(redacted, key)) {
            redacted[key] = "[redacted]";
          }
        }
        return redacted;
      }
      function summarizeBlockedFilters(filters) {
        if (!filters || typeof filters !== "object") {
          return {};
        }
        return {
          NF_BLOCKED_TEXT_LC: summarizeList(filters.NF_BLOCKED_TEXT_LC),
          GF_BLOCKED_TEXT_LC: summarizeList(filters.GF_BLOCKED_TEXT_LC),
          VF_BLOCKED_TEXT_LC: summarizeList(filters.VF_BLOCKED_TEXT_LC),
          MP_BLOCKED_TEXT_LC: summarizeList(filters.MP_BLOCKED_TEXT_LC),
          MP_BLOCKED_TEXT_DESCRIPTION_LC: summarizeList(filters.MP_BLOCKED_TEXT_DESCRIPTION_LC),
          PP_BLOCKED_TEXT_LC: summarizeList(filters.PP_BLOCKED_TEXT_LC)
        };
      }
      function collectSafeReasons(keyWords) {
        const safe = /* @__PURE__ */ new Set([
          "",
          "hidden",
          "Sponsored Content",
          "Survey",
          "Shares",
          "Stories | Reels | Rooms tabs list box"
        ]);
        if (!keyWords || typeof keyWords !== "object") {
          return safe;
        }
        Object.values(keyWords).forEach((value) => {
          if (typeof value === "string") {
            safe.add(value);
          } else if (Array.isArray(value)) {
            value.forEach((item) => {
              if (typeof item === "string") {
                safe.add(item);
              }
            });
          }
        });
        return safe;
      }
      function collectSignalCounts() {
        const signals = [
          "Sponsored",
          "Suggested",
          "Follow",
          "Reels",
          "Stories",
          "People you may know",
          "Paid partnership",
          "Try Meta AI",
          "Events you may like"
        ];
        const counts = {};
        for (const signal of signals) {
          counts[signal] = 0;
        }
        const spans = Array.from(document.querySelectorAll("span[dir], span, div")).filter(
          (el) => typeof el.textContent === "string" && el.textContent.trim() !== ""
        );
        for (const el of spans) {
          const text = el.textContent;
          for (const signal of signals) {
            if (text.includes(signal)) {
              counts[signal] += 1;
            }
          }
        }
        return counts;
      }
      function getSanitizedReason(reason, safeReasons) {
        if (!reason || reason.trim() === "") {
          return "unlabeled";
        }
        return safeReasons.has(reason) ? reason : `hash:${hashText(reason)}`;
      }
      function collectReasonCounts(keyWords) {
        const safeReasons = collectSafeReasons(keyWords);
        const counts = {};
        const nodes = document.querySelectorAll(`[${postAtt}]`);
        nodes.forEach((node) => {
          const reason = node.getAttribute(postAtt) || "";
          const key = getSanitizedReason(reason, safeReasons);
          counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
      }
      function collectHiddenSample(keyWords, limit = 3) {
        const sample = [];
        const safeReasons = collectSafeReasons(keyWords);
        const nodes = document.querySelectorAll(`[${postAtt}]`);
        for (const node of nodes) {
          if (sample.length >= limit) {
            break;
          }
          const reason = node.getAttribute(postAtt) || "";
          sample.push({
            reason: getSanitizedReason(reason, safeReasons),
            signature: buildDomSignature(node)
          });
        }
        return sample;
      }
      function countSelectorMatches(selectors) {
        return selectors.map((query) => ({
          query,
          count: document.querySelectorAll(query).length
        }));
      }
      function getNewsPostCollection() {
        const results = newsSelectors.postQueries.map((query) => {
          const posts = document.querySelectorAll(query);
          return { query, posts: Array.from(posts) };
        });
        const combined = [];
        results.forEach((entry) => {
          entry.posts.forEach((post) => {
            if (!combined.includes(post)) {
              combined.push(post);
            }
          });
        });
        return {
          query: results.length > 0 ? "combined" : "",
          queries: results.map((entry) => entry.query),
          posts: combined
        };
      }
      function getGroupsPostCollection(state) {
        let query = groupsSelectors.feedQuerySingle;
        if (state && (state.gfType === "groups" || state.gfType === "groups-recent" || state.gfType === "search")) {
          query = state.gfType === "groups-recent" ? groupsSelectors.feedQueryRecent : groupsSelectors.feedQueryMultiple;
        }
        return { query, posts: Array.from(document.querySelectorAll(query)) };
      }
      function getVideosPostCollection(state) {
        let query = "";
        let queryBlocks = "";
        if (state && state.vfType === "videos") {
          query = ":scope > div > div:not([class]) > div";
          queryBlocks = ":scope > div > div > div > div > div:nth-of-type(2) > div";
        } else if (state && state.vfType === "search") {
          query = 'div[role="feed"] > div[role="article"]';
          queryBlocks = ":scope > div > div > div > div > div > div > div:nth-of-type(2)";
        } else if (state && state.vfType === "item") {
          query = 'div[id="watch_feed"] > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div';
          queryBlocks = ":scope > div > div > div > div > div:nth-of-type(2) > div";
        }
        let container = document.querySelector(videosSelectors.dialog);
        if (!container) {
          container = document.querySelector(videosSelectors.mainColumn);
        }
        if (!container || query === "") {
          return { query, queryBlocks, posts: [] };
        }
        const posts = state && state.vfType === "search" ? Array.from(document.querySelectorAll(query)) : Array.from(container.querySelectorAll(query));
        return { query, queryBlocks, posts };
      }
      function getMarketplaceItems() {
        const queries = [
          `div[style]:not([${postAtt}]) > div > div > span > div > div > div > div > a[href*="/marketplace/item/"]`,
          `div[style]:not([${postAtt}]) > div > div > span > div > div > div > div > a[href*="/marketplace/np/item/"]`,
          `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/item/"]`,
          `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/np/item/"]`,
          `div[style]:not([${postAtt}]) > div > div > span > div > div > a[href*="/marketplace/item/"]`,
          `div[style]:not([${postAtt}]) > div > div > span > div > div > a[href*="/marketplace/np/item/"]`,
          `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/item/"]`,
          `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/np/item/"]`
        ];
        for (const query of queries) {
          const items = document.querySelectorAll(query);
          if (items.length > 0) {
            return { query, items: Array.from(items) };
          }
        }
        return { query: "", items: [] };
      }
      function getProfilePostCollection() {
        const posts = document.querySelectorAll(profileSelectors.postsQuery);
        return { query: profileSelectors.postsQuery, posts: Array.from(posts) };
      }
      function getSearchPostCollection() {
        const posts = document.querySelectorAll(searchSelectors.postsQuery);
        return { query: searchSelectors.postsQuery, posts: Array.from(posts) };
      }
      function buildDomSignature(post) {
        if (!post) {
          return null;
        }
        const className = typeof post.className === "string" ? post.className : "";
        return {
          tag: post.tagName,
          role: post.getAttribute("role") || "",
          classHash: className ? hashText(className) : "",
          childCount: post.children ? post.children.length : 0,
          hasReason: post.hasAttribute(postAtt)
        };
      }
      function addMatch(matches, key, value) {
        if (value) {
          matches[key] = true;
        }
      }
      function buildNewsMatches(post, context) {
        const { options, filters, keyWords, state } = context;
        const matches = {};
        addMatch(matches, "NF_SPONSORED", options.NF_SPONSORED && isSponsored(post, state));
        addMatch(
          matches,
          "NF_SUGGESTIONS",
          options.NF_SUGGESTIONS && isNewsSuggested(post, state, keyWords)
        );
        addMatch(
          matches,
          "NF_REELS_SHORT_VIDEOS",
          options.NF_REELS_SHORT_VIDEOS && isNewsReelsAndShortVideos(post, state, keyWords)
        );
        addMatch(
          matches,
          "NF_SHORT_REEL_VIDEO",
          options.NF_SHORT_REEL_VIDEO && isNewsShortReelVideo(post, keyWords)
        );
        addMatch(matches, "NF_META_AI", options.NF_META_AI && isNewsMetaAICard(post, keyWords));
        addMatch(
          matches,
          "NF_PAID_PARTNERSHIP",
          options.NF_PAID_PARTNERSHIP && isNewsPaidPartnership(post, keyWords)
        );
        addMatch(
          matches,
          "NF_PEOPLE_YOU_MAY_KNOW",
          options.NF_PEOPLE_YOU_MAY_KNOW && isNewsPeopleYouMayKnow(post, keyWords)
        );
        addMatch(matches, "NF_FOLLOW", options.NF_FOLLOW && isNewsFollow(post, state, keyWords));
        addMatch(matches, "NF_PARTICIPATE", options.NF_PARTICIPATE && isNewsParticipate(post, keyWords));
        addMatch(
          matches,
          "NF_SPONSORED_PAID",
          options.NF_SPONSORED_PAID && isNewsSponsoredPaidBy(post, keyWords)
        );
        addMatch(
          matches,
          "NF_EVENTS_YOU_MAY_LIKE",
          options.NF_EVENTS_YOU_MAY_LIKE && isNewsEventsYouMayLike(post, keyWords)
        );
        addMatch(matches, "NF_STORIES", options.NF_STORIES && isNewsStoriesPost(post, keyWords));
        addMatch(
          matches,
          "NF_ANIMATED_GIFS_POSTS",
          options.NF_ANIMATED_GIFS_POSTS && hasNewsAnimatedGifContent(post, keyWords)
        );
        if (options.NF_BLOCKED_ENABLED) {
          const blockedText = findNewsBlockedText(post, options, filters);
          if (blockedText) {
            matches.NF_BLOCKED_TEXT_HASH = hashText(blockedText);
          }
        }
        if (options.NF_LIKES_MAXIMUM && options.NF_LIKES_MAXIMUM !== "") {
          const likesMatch = postExceedsLikeCount(post, options, keyWords);
          if (likesMatch) {
            matches.NF_LIKES_MAXIMUM = true;
          }
        }
        if (options.NF_SHARES) {
          const shareMatches = findNumberOfShares(post);
          if (shareMatches > 0) {
            matches.NF_SHARES = true;
          }
        }
        return matches;
      }
      function buildGroupsMatches(post, context) {
        const { options, filters, keyWords, state } = context;
        const matches = {};
        addMatch(matches, "GF_SPONSORED", options.GF_SPONSORED && isSponsored(post, state));
        addMatch(matches, "GF_SUGGESTIONS", options.GF_SUGGESTIONS && isGroupsSuggested(post, keyWords));
        addMatch(
          matches,
          "GF_SHORT_REEL_VIDEO",
          options.GF_SHORT_REEL_VIDEO && isGroupsShortReelVideo(post, keyWords)
        );
        addMatch(
          matches,
          "GF_ANIMATED_GIFS_POSTS",
          options.GF_ANIMATED_GIFS_POSTS && hasGroupsAnimatedGifContent(post, keyWords)
        );
        if (options.GF_BLOCKED_ENABLED) {
          const blockedText = findGroupsBlockedText(post, options, filters);
          if (blockedText) {
            matches.GF_BLOCKED_TEXT_HASH = hashText(blockedText);
          }
        }
        if (options.GF_SHARES) {
          const shareMatches = findNumberOfShares(post);
          if (shareMatches > 0) {
            matches.GF_SHARES = true;
          }
        }
        return matches;
      }
      function buildVideosMatches(post, queryBlocks, context) {
        const { options, filters, keyWords, state } = context;
        const matches = {};
        addMatch(matches, "VF_SPONSORED", options.VF_SPONSORED && isSponsored(post, state));
        addMatch(matches, "VF_LIVE", options.VF_LIVE && isVideoLive(post, keyWords));
        addMatch(matches, "VF_INSTAGRAM", options.VF_INSTAGRAM && isInstagram(post, keyWords));
        if (options.VF_BLOCKED_ENABLED && queryBlocks) {
          const blockedText = findVideosBlockedText(post, options, filters, queryBlocks);
          if (blockedText) {
            matches.VF_BLOCKED_TEXT_HASH = hashText(blockedText);
          }
        }
        return matches;
      }
      function buildProfileMatches(post, context) {
        const { options, filters, keyWords } = context;
        const matches = {};
        addMatch(
          matches,
          "PP_ANIMATED_GIFS_POSTS",
          options.PP_ANIMATED_GIFS_POSTS && hasNewsAnimatedGifContent(post, keyWords)
        );
        if (options.PP_BLOCKED_ENABLED) {
          const blockedText = findProfileBlockedText(post, options, filters);
          if (blockedText) {
            matches.PP_BLOCKED_TEXT_HASH = hashText(blockedText);
          }
        }
        return matches;
      }
      function buildMarketplaceMatches(item, filters) {
        const matches = {};
        const queryTextBlock = ":scope > div > div:nth-of-type(2) > div";
        const blocksOfText = item.querySelectorAll(queryTextBlock);
        if (blocksOfText.length > 0) {
          const blockedPrices = mpGetBlockedPrices(blocksOfText[0], filters);
          if (blockedPrices) {
            matches.MP_BLOCKED_TEXT_HASH = hashText(blockedPrices);
          }
          const blockedDesc = mpGetBlockedTextDescription(blocksOfText, filters, true);
          if (blockedDesc) {
            matches.MP_BLOCKED_TEXT_DESCRIPTION_HASH = hashText(blockedDesc);
          }
        }
        return matches;
      }
      function isInViewport(element) {
        if (!element || typeof element.getBoundingClientRect !== "function") {
          return false;
        }
        const rect = element.getBoundingClientRect();
        if (!rect || rect.width === 0 || rect.height === 0) {
          return false;
        }
        return rect.bottom >= 0 && rect.top <= window.innerHeight;
      }
      function samplePosts(posts, maxSamples) {
        const samples = [];
        const inView = [];
        const outOfView = [];
        for (const post of posts) {
          if (!post) {
            continue;
          }
          if (isInViewport(post)) {
            inView.push(post);
          } else {
            outOfView.push(post);
          }
        }
        for (const post of inView) {
          if (samples.length >= maxSamples) {
            break;
          }
          samples.push(post);
        }
        for (const post of outOfView) {
          if (samples.length >= maxSamples) {
            break;
          }
          samples.push(post);
        }
        return samples;
      }
      function buildSamples(context, maxSamples = 20) {
        const { state, filters } = context;
        if (state.isNF) {
          const { query, queries, posts } = getNewsPostCollection();
          const samples = samplePosts(posts, maxSamples).map((post) => ({
            signature: buildDomSignature(post),
            matches: buildNewsMatches(post, context)
          }));
          return { feed: "news", query, queries, samples };
        }
        if (state.isGF) {
          const { query, posts } = getGroupsPostCollection(state);
          const samples = samplePosts(posts, maxSamples).map((post) => ({
            signature: buildDomSignature(post),
            matches: buildGroupsMatches(post, context)
          }));
          return { feed: "groups", query, samples };
        }
        if (state.isVF) {
          const { query, queryBlocks, posts } = getVideosPostCollection(state);
          const samples = samplePosts(posts, maxSamples).map((post) => ({
            signature: buildDomSignature(post),
            matches: buildVideosMatches(post, queryBlocks, context)
          }));
          return { feed: "videos", query, samples };
        }
        if (state.isMF) {
          const { query, items } = getMarketplaceItems();
          const samples = items.filter((item) => item && item.closest && item.closest("div[style]")).slice(0, maxSamples).map((item) => ({
            signature: buildDomSignature(item),
            matches: buildMarketplaceMatches(item, filters)
          }));
          return { feed: "marketplace", query, samples };
        }
        if (state.isSF) {
          const { query, posts } = getSearchPostCollection();
          const samples = samplePosts(posts, maxSamples).map((post) => ({
            signature: buildDomSignature(post),
            matches: buildNewsMatches(post, context)
          }));
          return { feed: "search", query, samples };
        }
        if (state.isPP) {
          const { query, posts } = getProfilePostCollection();
          const samples = samplePosts(posts, maxSamples).map((post) => ({
            signature: buildDomSignature(post),
            matches: buildProfileMatches(post, context)
          }));
          return { feed: "profile", query, samples };
        }
        return { feed: "unknown", query: "", samples: [] };
      }
      function buildMatchSummary(samples) {
        const summary = {};
        samples.forEach((sample) => {
          const matches = sample.matches || {};
          Object.keys(matches).forEach((key) => {
            const value = matches[key];
            if (value === true || typeof value === "string" && value.trim() !== "") {
              summary[key] = (summary[key] || 0) + 1;
            }
          });
        });
        return summary;
      }
      function buildSelectorDiagnostics(state) {
        return {
          news: {
            mainColumn: countSelectorMatches([newsSelectors.mainColumn])[0].count,
            dialog: countSelectorMatches([newsSelectors.dialog])[0].count,
            postQueries: countSelectorMatches(newsSelectors.postQueries)
          },
          groups: {
            mainColumn: countSelectorMatches([groupsSelectors.mainColumn])[0].count,
            dialog: countSelectorMatches([groupsSelectors.dialog])[0].count,
            groupPageMainColumn: countSelectorMatches([groupsSelectors.groupPageMainColumn])[0].count,
            feedQueries: countSelectorMatches([
              groupsSelectors.feedQueryRecent,
              groupsSelectors.feedQueryMultiple,
              groupsSelectors.feedQuerySingle
            ])
          },
          videos: {
            mainColumn: countSelectorMatches([videosSelectors.mainColumn])[0].count,
            dialog: countSelectorMatches([videosSelectors.dialog])[0].count,
            feedQueries: countSelectorMatches(Object.values(videosSelectors.feedQueries)),
            vfType: state.vfType || ""
          },
          marketplace: {
            mainColumn: countSelectorMatches([marketplaceSelectors.mainColumn])[0].count,
            dialogItem: countSelectorMatches([marketplaceSelectors.dialogItem])[0].count
          },
          search: {
            mainColumn: countSelectorMatches([searchSelectors.mainColumn])[0].count,
            postsQuery: countSelectorMatches([searchSelectors.postsQuery])[0].count
          },
          profile: {
            mainColumn: countSelectorMatches([profileSelectors.mainColumn])[0].count,
            postsQuery: countSelectorMatches([profileSelectors.postsQuery])[0].count
          }
        };
      }
      function buildHiddenCounts(state) {
        if (!state) {
          return {};
        }
        return {
          hiddenContainers: document.querySelectorAll(`[${state.hideAtt}]`).length,
          hiddenBlocks: document.querySelectorAll(`[${state.cssHideEl}]`).length,
          hiddenShares: document.querySelectorAll(`[${state.cssHideNumberOfShares}]`).length
        };
      }
      function buildEnvironmentSnapshot() {
        const gm = typeof globalThis !== "undefined" ? globalThis.GM : void 0;
        return {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          languages: navigator.languages,
          hasGM: !!gm,
          hasGMInfo: !!(gm && gm.info),
          readyState: document.readyState,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
          }
        };
      }
      function getScriptsSample(limit = 20) {
        const scripts = Array.from(document.scripts || []);
        const samples = [];
        for (const script of scripts) {
          if (samples.length >= limit) {
            break;
          }
          if (script && script.src) {
            try {
              const url = new URL(script.src, window.location.href);
              samples.push(`${url.origin}${url.pathname}`);
            } catch (error) {
              samples.push(script.src);
            }
            continue;
          }
          samples.push("inline-script");
        }
        return samples;
      }
      function buildFeedDomSnapshot() {
        const feedNodes = Array.from(document.querySelectorAll('[role="feed"]'));
        const pageletSample = Array.from(document.querySelectorAll('[role="feed"] [data-pagelet]')).slice(0, 5).map((el) => el.getAttribute("data-pagelet"));
        const mainNode = document.querySelector('div[role="main"]');
        const feedRoot = feedNodes[0] || null;
        const feedRootParent = feedRoot && feedRoot.parentElement ? feedRoot.parentElement : null;
        const mainRootParent = mainNode && mainNode.parentElement ? mainNode.parentElement : null;
        return {
          feedCount: feedNodes.length,
          pageletSample,
          mainCount: document.querySelectorAll('div[role="main"]').length,
          feedRoot: buildDomSignature(feedRoot),
          feedRootParent: buildDomSignature(feedRootParent),
          mainRoot: buildDomSignature(mainNode),
          mainRootParent: buildDomSignature(mainRootParent)
        };
      }
      function buildFeedSnapshot(state) {
        return {
          isNF: !!state.isNF,
          isGF: !!state.isGF,
          isVF: !!state.isVF,
          isMF: !!state.isMF,
          isSF: !!state.isSF,
          isRF: !!state.isRF,
          isPP: !!state.isPP,
          gfType: state.gfType || "",
          vfType: state.vfType || "",
          mpType: state.mpType || ""
        };
      }
      function buildSafeLocation() {
        const location = window.location || {};
        const origin = location.origin || "";
        const pathname = location.pathname || "";
        const href = location.href || "";
        const url = origin && pathname ? `${origin}${pathname}` : href;
        return { url, pathname, search: "" };
      }
      function buildBugReport(context) {
        if (!context) {
          return { data: { error: "No context available." }, text: "" };
        }
        const { state, options, filters, keyWords, pathInfo } = context;
        const now = /* @__PURE__ */ new Date();
        const scriptInfo = getScriptInfo();
        const safeLocation = buildSafeLocation();
        const data = {
          generatedAt: now.toISOString(),
          script: scriptInfo,
          page: {
            url: safeLocation.url,
            pathname: safeLocation.pathname,
            search: safeLocation.search,
            scriptsSample: getScriptsSample(),
            feedDom: buildFeedDomSnapshot()
          },
          feed: buildFeedSnapshot(state),
          environment: buildEnvironmentSnapshot(),
          options: redactOptions(options || {}),
          filters: redactFilters(filters || {}),
          blockedFilters: summarizeBlockedFilters(filters || {}),
          pathInfo: pathInfo || {},
          selectors: buildSelectorDiagnostics(state),
          hidden: {
            reasonCounts: collectReasonCounts(keyWords),
            hiddenElements: buildHiddenCounts(state),
            sample: collectHiddenSample(keyWords)
          },
          signals: collectSignalCounts(),
          samples: buildSamples(context),
          notes: {
            redaction: "Post text, names, and IDs are not included. Blocked keywords are hashed."
          }
        };
        data.samples.summary = buildMatchSummary(data.samples.samples || []);
        return { data, text: JSON.stringify(data, null, 2) };
      }
      module.exports = {
        buildBugReport,
        getSupportUrl
      };
    }
  });

  // src/ui/dialog/sections.js
  var require_sections = __commonJS({
    "src/ui/dialog/sections.js"(exports, module) {
      function createSingleCB(keyWords, options, cbName, cbReadOnly = false) {
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.setAttribute("cbType", "T");
        cb.name = cbName;
        cb.value = cbName;
        cb.checked = options[cbName];
        const label = document.createElement("label");
        if (cbReadOnly) {
          cb.checked = true;
          cb.disabled = true;
          label.setAttribute("disabled", "disabled");
        }
        label.appendChild(cb);
        if (keyWords[cbName]) {
          if (!Array.isArray(keyWords[cbName])) {
            label.appendChild(document.createTextNode(keyWords[cbName]));
          } else {
            label.appendChild(document.createTextNode(Array.from(keyWords[cbName]).join(", ")));
          }
        } else if (["NF_SPONSORED", "GF_SPONSORED", "VF_SPONSORED", "MP_SPONSORED"].includes(cbName)) {
          label.appendChild(document.createTextNode(keyWords.SPONSORED));
        } else {
          label.appendChild(document.createTextNode(cbName));
        }
        const div = document.createElement("div");
        div.classList.add("cmf-row");
        div.appendChild(label);
        return div;
      }
      function createMultipleCBs(keyWords, options, cbName, cbReadOnlyIdx = -1) {
        const arrElements = [];
        for (let i = 0; i < keyWords[cbName].length; i += 1) {
          const div = document.createElement("div");
          div.classList.add("cmf-row");
          const cbKeyWord = keyWords[cbName][i];
          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.setAttribute("cbType", "M");
          cb.name = cbName;
          cb.value = i;
          cb.checked = options[cbName][i] === "1";
          const label = document.createElement("label");
          if (i === cbReadOnlyIdx) {
            cb.checked = true;
            cb.disabled = true;
            label.setAttribute("disabled", "disabled");
          }
          label.appendChild(cb);
          label.appendChild(document.createTextNode(cbKeyWord));
          div.appendChild(label);
          arrElements.push(div);
        }
        return arrElements;
      }
      function createRB(options, rbName, rbValue, rbLabelText) {
        const div = document.createElement("div");
        div.classList.add("cmf-row");
        const rb = document.createElement("input");
        rb.type = "radio";
        rb.name = rbName;
        rb.value = rbValue;
        rb.checked = options[rbName] === rbValue;
        const label = document.createElement("label");
        label.appendChild(rb);
        label.appendChild(document.createTextNode(rbLabelText));
        div.appendChild(label);
        return div;
      }
      function createInput(options, inputName, inputLabel) {
        const div = document.createElement("div");
        div.classList.add("cmf-row");
        const input = document.createElement("input");
        input.type = "text";
        input.name = inputName;
        input.value = options[inputName];
        const label = document.createElement("label");
        label.appendChild(document.createTextNode(inputLabel));
        label.appendChild(document.createElement("br"));
        label.appendChild(input);
        div.appendChild(label);
        return div;
      }
      function checkInputNumber(event) {
        const el = event.target;
        if (el.value === "") {
          return;
        }
        const digitsValues = el.value.replace(/\D/g, "");
        el.value = digitsValues.length > 0 ? parseInt(digitsValues, 10) : "";
      }
      function createCheckboxAndInput(keyWords, options, cbName, inputName) {
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.setAttribute("cbType", "T");
        cb.name = cbName;
        cb.value = cbName;
        cb.checked = options[cbName];
        const input = document.createElement("input");
        input.type = "text";
        input.name = inputName;
        input.value = options[inputName];
        input.placeholder = "1000";
        input.size = 6;
        input.addEventListener("input", checkInputNumber, false);
        const label = document.createElement("label");
        label.appendChild(cb);
        label.appendChild(document.createTextNode(`${keyWords[cbName]}: `));
        label.appendChild(input);
        const div = document.createElement("div");
        div.classList.add("cmf-row");
        div.appendChild(label);
        return div;
      }
      function createSelectLanguage(state, keyWords, translations) {
        const div = document.createElement("div");
        div.classList.add("cmf-row");
        const select = document.createElement("select");
        select.name = "CMF_DIALOG_LANGUAGE";
        Object.keys(translations).forEach((languageCode) => {
          const elOption = document.createElement("option");
          elOption.value = languageCode;
          elOption.textContent = translations[languageCode].CMF_DIALOG_LANGUAGE;
          if (languageCode === state.language) {
            elOption.setAttribute("selected", "");
          }
          select.appendChild(elOption);
        });
        const label = document.createElement("label");
        label.appendChild(document.createTextNode(`${keyWords.CMF_DIALOG_LANGUAGE_LABEL}:`));
        label.appendChild(document.createElement("br"));
        label.appendChild(select);
        div.appendChild(label);
        return div;
      }
      function getKeyword(keyWords, translations, key) {
        if (keyWords && typeof keyWords[key] === "string" && keyWords[key].trim() !== "") {
          return keyWords[key];
        }
        const fallback = translations && translations.en && typeof translations.en[key] === "string" ? translations.en[key] : "";
        return fallback;
      }
      function appendTextWithLinks(container, template, links) {
        if (!container || !template) {
          return;
        }
        let remaining = template;
        while (remaining.length > 0) {
          let nextToken = null;
          let nextIndex = -1;
          links.forEach((link) => {
            const idx = remaining.indexOf(link.token);
            if (idx !== -1 && (nextIndex === -1 || idx < nextIndex)) {
              nextIndex = idx;
              nextToken = link;
            }
          });
          if (!nextToken) {
            container.appendChild(document.createTextNode(remaining));
            break;
          }
          if (nextIndex > 0) {
            container.appendChild(document.createTextNode(remaining.slice(0, nextIndex)));
          }
          const anchor = document.createElement("a");
          anchor.href = nextToken.href;
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
          anchor.textContent = nextToken.label;
          container.appendChild(anchor);
          remaining = remaining.slice(nextIndex + nextToken.token.length);
        }
      }
      function createLegend(state, title, subtitle, iconHTML = "") {
        const legend = document.createElement("legend");
        legend.classList.add("cmf-legend");
        if (title) {
          legend.dataset.cmfTitle = title;
        }
        if (subtitle) {
          legend.dataset.cmfSubtitle = subtitle;
        }
        const iconWrap = document.createElement("span");
        iconWrap.className = "cmf-legend-icon";
        iconWrap.innerHTML = iconHTML || state.iconLegendHTML;
        const textWrap = document.createElement("span");
        textWrap.className = "cmf-legend-text";
        const titleWrap = document.createElement("span");
        titleWrap.className = "cmf-legend-title";
        titleWrap.textContent = title || "";
        textWrap.appendChild(titleWrap);
        if (subtitle) {
          const subtitleWrap = document.createElement("span");
          subtitleWrap.className = "cmf-legend-subtext";
          subtitleWrap.textContent = subtitle;
          textWrap.appendChild(subtitleWrap);
        }
        legend.appendChild(iconWrap);
        legend.appendChild(textWrap);
        return legend;
      }
      function createTipsContent(keyWords, translations) {
        const wrap = document.createElement("div");
        wrap.className = "cmf-tips-content";
        const maintainerText = getKeyword(keyWords, translations, "DLG_TIPS_MAINTAINER");
        if (maintainerText) {
          const p = document.createElement("p");
          p.textContent = maintainerText;
          wrap.appendChild(p);
        }
        const linkLabels = {
          github: getKeyword(keyWords, translations, "DLG_TIPS_LINK_REPO"),
          facebook: getKeyword(keyWords, translations, "DLG_TIPS_LINK_FACEBOOK"),
          site: getKeyword(keyWords, translations, "DLG_TIPS_LINK_SITE")
        };
        const linkMap = [
          {
            token: "{github}",
            label: linkLabels.github || "GitHub",
            href: "https://github.com/Artificial-Sweetener/facebook-clean-my-feeds"
          },
          {
            token: "{facebook}",
            label: linkLabels.facebook || "Facebook",
            href: "https://www.facebook.com/artificialsweetenerai"
          },
          {
            token: "{site}",
            label: linkLabels.site || "website",
            href: "https://artificialsweetener.ai"
          }
        ];
        const starText = getKeyword(keyWords, translations, "DLG_TIPS_STAR");
        if (starText) {
          const p = document.createElement("p");
          appendTextWithLinks(p, starText, linkMap);
          wrap.appendChild(p);
        }
        const facebookText = getKeyword(keyWords, translations, "DLG_TIPS_FACEBOOK");
        if (facebookText) {
          const p = document.createElement("p");
          appendTextWithLinks(p, facebookText, linkMap);
          wrap.appendChild(p);
        }
        const siteText = getKeyword(keyWords, translations, "DLG_TIPS_SITE");
        if (siteText) {
          const p = document.createElement("p");
          appendTextWithLinks(p, siteText, linkMap);
          wrap.appendChild(p);
        }
        const creditsText = getKeyword(keyWords, translations, "DLG_TIPS_CREDITS");
        if (creditsText) {
          const p = document.createElement("p");
          appendTextWithLinks(p, creditsText, [
            {
              token: "{zbluebugz}",
              label: "zbluebugz",
              href: "https://github.com/zbluebugz"
            },
            {
              token: "{trinhquocviet}",
              label: "trinhquocviet",
              href: "https://github.com/trinhquocviet"
            }
          ]);
          wrap.appendChild(p);
        }
        const thanksText = getKeyword(keyWords, translations, "DLG_TIPS_THANKS");
        if (thanksText) {
          const p = document.createElement("p");
          p.textContent = thanksText;
          wrap.appendChild(p);
        }
        return wrap;
      }
      function wrapFieldsetBody(fieldset) {
        if (!fieldset) {
          return;
        }
        const existingBody = fieldset.querySelector(".cmf-section-body");
        if (existingBody) {
          return;
        }
        const legend = fieldset.querySelector("legend");
        const body = document.createElement("div");
        body.className = "cmf-section-body";
        const children = Array.from(fieldset.children);
        children.forEach((child) => {
          if (child === legend) {
            return;
          }
          body.appendChild(child);
        });
        fieldset.appendChild(body);
      }
      function buildDialogSections({ state, options, keyWords, translations }) {
        const sections = [];
        const dialogSectionIcons = state.dialogSectionIcons || {};
        const iconFor = (key) => dialogSectionIcons[key] || state.iconLegendHTML;
        let fs = document.createElement("fieldset");
        let l = createLegend(
          state,
          getKeyword(keyWords, translations, "DLG_NF"),
          getKeyword(keyWords, translations, "DLG_NF_DESC"),
          iconFor("DLG_NF")
        );
        fs.appendChild(l);
        fs.appendChild(createSingleCB(keyWords, options, "NF_SPONSORED", false));
        const newsFeedOrder = [
          "NF_TABLIST_STORIES_REELS_ROOMS",
          "NF_STORIES",
          "NF_TOP_CARDS_PAGES",
          "NF_REELS_SHORT_VIDEOS",
          "NF_SHORT_REEL_VIDEO",
          "NF_FOLLOW",
          "NF_PARTICIPATE",
          "NF_PEOPLE_YOU_MAY_KNOW",
          "NF_SUGGESTIONS",
          "NF_EVENTS_YOU_MAY_LIKE",
          "NF_SURVEY",
          "NF_PAID_PARTNERSHIP",
          "NF_SPONSORED_PAID",
          "NF_META_AI",
          "NF_AI_SIDE_PANELS",
          "NF_HIDE_VERIFIED_BADGE",
          "NF_FILTER_VERIFIED_BADGE",
          "NF_ANIMATED_GIFS_POSTS",
          "NF_ANIMATED_GIFS_PAUSE",
          "NF_SHARES",
          "NF_LIKES_MAXIMUM"
        ];
        const newsFeedKeys = Object.keys(keyWords).filter(
          (key) => key.startsWith("NF_") && !key.startsWith("NF_BLOCK")
        );
        const orderedNewsFeedKeys = [
          ...newsFeedOrder.filter((key) => newsFeedKeys.includes(key)),
          ...newsFeedKeys.filter((key) => !newsFeedOrder.includes(key) && key !== "NF_SPONSORED")
        ];
        orderedNewsFeedKeys.forEach((key) => {
          if (key.startsWith("NF_LIKES")) {
            if (key === "NF_LIKES_MAXIMUM") {
              fs.appendChild(createCheckboxAndInput(keyWords, options, key, "NF_LIKES_MAXIMUM_COUNT"));
            }
            return;
          }
          if (key !== "NF_SPONSORED") {
            fs.appendChild(createSingleCB(keyWords, options, key));
          }
        });
        l = document.createElement("strong");
        l.textContent = `${keyWords.DLG_BLOCK_TEXT_FILTER_TITLE}:`;
        fs.appendChild(l);
        createMultipleCBs(keyWords, options, "NF_BLOCKED_FEED", 0).forEach((el) => fs.appendChild(el));
        fs.appendChild(createSingleCB(keyWords, options, "NF_BLOCKED_ENABLED"));
        fs.appendChild(createSingleCB(keyWords, options, "NF_BLOCKED_RE"));
        let s = document.createElement("small");
        s.appendChild(document.createTextNode(keyWords.DLG_BLOCK_NEW_LINE));
        fs.appendChild(s);
        let ta = document.createElement("textarea");
        ta.name = "NF_BLOCKED_TEXT";
        ta.textContent = options.NF_BLOCKED_TEXT.split(state.SEP).join("\n");
        fs.appendChild(ta);
        wrapFieldsetBody(fs);
        sections.push(fs);
        fs = document.createElement("fieldset");
        l = createLegend(
          state,
          getKeyword(keyWords, translations, "DLG_GF"),
          getKeyword(keyWords, translations, "DLG_GF_DESC"),
          iconFor("DLG_GF")
        );
        fs.appendChild(l);
        fs.appendChild(createSingleCB(keyWords, options, "GF_SPONSORED", false));
        Object.keys(keyWords).forEach((key) => {
          if (key.startsWith("GF_") && !key.startsWith("GF_BLOCK")) {
            fs.appendChild(createSingleCB(keyWords, options, key));
          }
        });
        l = document.createElement("strong");
        l.textContent = `${keyWords.DLG_BLOCK_TEXT_FILTER_TITLE}:`;
        fs.appendChild(l);
        createMultipleCBs(keyWords, options, "GF_BLOCKED_FEED", 1).forEach((el) => fs.appendChild(el));
        fs.appendChild(createSingleCB(keyWords, options, "GF_BLOCKED_ENABLED"));
        fs.appendChild(createSingleCB(keyWords, options, "GF_BLOCKED_RE"));
        s = document.createElement("small");
        s.appendChild(document.createTextNode(keyWords.DLG_BLOCK_NEW_LINE));
        fs.appendChild(s);
        ta = document.createElement("textarea");
        ta.name = "GF_BLOCKED_TEXT";
        ta.textContent = options.GF_BLOCKED_TEXT.split(state.SEP).join("\n");
        fs.appendChild(ta);
        wrapFieldsetBody(fs);
        sections.push(fs);
        fs = document.createElement("fieldset");
        l = createLegend(
          state,
          getKeyword(keyWords, translations, "DLG_MP"),
          getKeyword(keyWords, translations, "DLG_MP_DESC"),
          iconFor("DLG_MP")
        );
        fs.appendChild(l);
        fs.appendChild(createSingleCB(keyWords, options, "MP_SPONSORED", false));
        l = document.createElement("strong");
        l.textContent = `${keyWords.DLG_BLOCK_TEXT_FILTER_TITLE}:`;
        fs.appendChild(l);
        createMultipleCBs(keyWords, options, "MP_BLOCKED_FEED", 0).forEach((el) => fs.appendChild(el));
        fs.appendChild(createSingleCB(keyWords, options, "MP_BLOCKED_ENABLED"));
        fs.appendChild(createSingleCB(keyWords, options, "MP_BLOCKED_RE"));
        l = document.createElement("strong");
        l.textContent = "Prices: ";
        fs.appendChild(l);
        s = document.createElement("small");
        s.appendChild(document.createTextNode(keyWords.DLG_BLOCK_NEW_LINE));
        fs.appendChild(s);
        ta = document.createElement("textarea");
        ta.name = "MP_BLOCKED_TEXT";
        ta.textContent = options.MP_BLOCKED_TEXT.split(state.SEP).join("\n");
        fs.appendChild(ta);
        l = document.createElement("strong");
        l.textContent = "Description: ";
        fs.appendChild(l);
        s = document.createElement("small");
        s.appendChild(document.createTextNode(keyWords.DLG_BLOCK_NEW_LINE));
        fs.appendChild(s);
        ta = document.createElement("textarea");
        ta.name = "MP_BLOCKED_TEXT_DESCRIPTION";
        ta.textContent = options.MP_BLOCKED_TEXT_DESCRIPTION.split(state.SEP).join("\n");
        fs.appendChild(ta);
        wrapFieldsetBody(fs);
        sections.push(fs);
        fs = document.createElement("fieldset");
        l = createLegend(
          state,
          getKeyword(keyWords, translations, "DLG_VF"),
          getKeyword(keyWords, translations, "DLG_VF_DESC"),
          iconFor("DLG_VF")
        );
        fs.appendChild(l);
        fs.appendChild(createSingleCB(keyWords, options, "VF_SPONSORED", false));
        Object.keys(keyWords).forEach((key) => {
          if (key.startsWith("VF_") && !key.startsWith("VF_BLOCK")) {
            fs.appendChild(createSingleCB(keyWords, options, key));
          }
        });
        l = document.createElement("strong");
        l.textContent = `${keyWords.DLG_BLOCK_TEXT_FILTER_TITLE}:`;
        fs.appendChild(l);
        createMultipleCBs(keyWords, options, "VF_BLOCKED_FEED", 2).forEach((el) => fs.appendChild(el));
        fs.appendChild(createSingleCB(keyWords, options, "VF_BLOCKED_ENABLED"));
        fs.appendChild(createSingleCB(keyWords, options, "VF_BLOCKED_RE"));
        s = document.createElement("small");
        s.appendChild(document.createTextNode(keyWords.DLG_BLOCK_NEW_LINE));
        fs.appendChild(s);
        ta = document.createElement("textarea");
        ta.name = "VF_BLOCKED_TEXT";
        ta.textContent = options.VF_BLOCKED_TEXT.split(state.SEP).join("\n");
        fs.appendChild(ta);
        wrapFieldsetBody(fs);
        sections.push(fs);
        fs = document.createElement("fieldset");
        l = createLegend(
          state,
          getKeyword(keyWords, translations, "DLG_PP"),
          getKeyword(keyWords, translations, "DLG_PP_DESC"),
          iconFor("DLG_PP")
        );
        fs.appendChild(l);
        Object.keys(keyWords).forEach((key) => {
          if (key.startsWith("PP_") && !key.startsWith("PP_BLOCK")) {
            fs.appendChild(createSingleCB(keyWords, options, key));
          }
        });
        l = document.createElement("strong");
        l.textContent = `${keyWords.DLG_BLOCK_TEXT_FILTER_TITLE}:`;
        fs.appendChild(l);
        createMultipleCBs(keyWords, options, "PP_BLOCKED_FEED", 0).forEach((el) => fs.appendChild(el));
        fs.appendChild(createSingleCB(keyWords, options, "PP_BLOCKED_ENABLED"));
        fs.appendChild(createSingleCB(keyWords, options, "PP_BLOCKED_RE"));
        s = document.createElement("small");
        s.appendChild(document.createTextNode(keyWords.DLG_BLOCK_NEW_LINE));
        fs.appendChild(s);
        ta = document.createElement("textarea");
        ta.name = "PP_BLOCKED_TEXT";
        ta.textContent = options.PP_BLOCKED_TEXT.split(state.SEP).join("\n");
        fs.appendChild(ta);
        wrapFieldsetBody(fs);
        sections.push(fs);
        fs = document.createElement("fieldset");
        l = createLegend(
          state,
          getKeyword(keyWords, translations, "DLG_OTHER"),
          getKeyword(keyWords, translations, "DLG_OTHER_DESC"),
          iconFor("DLG_OTHER")
        );
        fs.appendChild(l);
        Object.keys(keyWords).forEach((key) => {
          if (key.startsWith("OTHER_INFO")) {
            fs.appendChild(createSingleCB(keyWords, options, key));
          }
        });
        wrapFieldsetBody(fs);
        sections.push(fs);
        fs = document.createElement("fieldset");
        l = createLegend(
          state,
          getKeyword(keyWords, translations, "REELS_TITLE"),
          getKeyword(keyWords, translations, "DLG_REELS_DESC"),
          iconFor("REELS_TITLE")
        );
        fs.appendChild(l);
        fs.appendChild(createSingleCB(keyWords, options, "REELS_CONTROLS"), false);
        fs.appendChild(createSingleCB(keyWords, options, "REELS_DISABLE_LOOPING"), false);
        wrapFieldsetBody(fs);
        sections.push(fs);
        fs = document.createElement("fieldset");
        l = createLegend(
          state,
          getKeyword(keyWords, translations, "DLG_PREFERENCES"),
          getKeyword(keyWords, translations, "DLG_PREFERENCES_DESC"),
          iconFor("DLG_PREFERENCES")
        );
        fs.appendChild(l);
        fs.appendChild(createSelectLanguage(state, keyWords, translations));
        s = document.createElement("span");
        s.appendChild(document.createTextNode(`${keyWords.CMF_BTN_LOCATION}:`));
        fs.appendChild(s);
        let len = keyWords.CMF_BTN_OPTION.length;
        for (let i = 0; i < len; i += 1) {
          fs.appendChild(createRB(options, "CMF_BTN_OPTION", i.toString(), keyWords.CMF_BTN_OPTION[i]));
        }
        s = document.createElement("span");
        s.appendChild(document.createTextNode(`${keyWords.CMF_DIALOG_LOCATION}:`));
        fs.appendChild(s);
        fs.appendChild(createRB(options, "CMF_DIALOG_OPTION", "0", keyWords.CMF_DIALOG_OPTION[0]));
        fs.appendChild(createRB(options, "CMF_DIALOG_OPTION", "1", keyWords.CMF_DIALOG_OPTION[1]));
        fs.appendChild(createInput(options, "CMF_BORDER_COLOUR", `${keyWords.CMF_BORDER_COLOUR}:`));
        s = document.createElement("span");
        s.className = "cmf-tips-content";
        s.appendChild(document.createTextNode(`${keyWords.DLG_VERBOSITY_CAPTION}:`));
        fs.appendChild(s);
        fs.appendChild(createRB(options, "VERBOSITY_LEVEL", "0", `${keyWords.VERBOSITY_MESSAGE[0]}`));
        fs.appendChild(
          createRB(options, "VERBOSITY_LEVEL", "1", `${keyWords.VERBOSITY_MESSAGE[1]}______`)
        );
        fs.appendChild(createRB(options, "VERBOSITY_LEVEL", "2", `${keyWords.VERBOSITY_MESSAGE[3]}`));
        fs.appendChild(
          createInput(options, "VERBOSITY_MESSAGE_COLOUR", `${keyWords.VERBOSITY_MESSAGE_COLOUR}:`)
        );
        fs.appendChild(
          createInput(options, "VERBOSITY_MESSAGE_BG_COLOUR", `${keyWords.VERBOSITY_MESSAGE_BG_COLOUR}:`)
        );
        fs.appendChild(createSingleCB(keyWords, options, "VERBOSITY_DEBUG"));
        wrapFieldsetBody(fs);
        sections.push(fs);
        fs = document.createElement("fieldset");
        l = createLegend(
          state,
          getKeyword(keyWords, translations, "DLG_REPORT_BUG"),
          getKeyword(keyWords, translations, "DLG_REPORT_BUG_DESC"),
          iconFor("DLG_REPORT_BUG")
        );
        fs.appendChild(l);
        s = document.createElement("span");
        s.className = "cmf-report-notice";
        s.appendChild(
          document.createTextNode(getKeyword(keyWords, translations, "DLG_REPORT_BUG_NOTICE"))
        );
        fs.appendChild(s);
        const reportActions = document.createElement("div");
        reportActions.className = "cmf-report-actions";
        const btnGenerate = document.createElement("button");
        btnGenerate.type = "button";
        btnGenerate.id = "BTNReportGenerate";
        btnGenerate.textContent = getKeyword(keyWords, translations, "DLG_REPORT_BUG_GENERATE");
        reportActions.appendChild(btnGenerate);
        const btnCopy = document.createElement("button");
        btnCopy.type = "button";
        btnCopy.id = "BTNReportCopy";
        btnCopy.textContent = getKeyword(keyWords, translations, "DLG_REPORT_BUG_COPY");
        reportActions.appendChild(btnCopy);
        const btnOpen = document.createElement("button");
        btnOpen.type = "button";
        btnOpen.id = "BTNReportOpenIssues";
        btnOpen.textContent = getKeyword(keyWords, translations, "DLG_REPORT_BUG_OPEN_ISSUES");
        reportActions.appendChild(btnOpen);
        fs.appendChild(reportActions);
        const reportStatus = document.createElement("div");
        reportStatus.className = "cmf-report-status";
        fs.appendChild(reportStatus);
        const reportOutput = document.createElement("textarea");
        reportOutput.className = "cmf-report-output";
        reportOutput.readOnly = true;
        reportOutput.rows = 6;
        fs.appendChild(reportOutput);
        wrapFieldsetBody(fs);
        sections.push(fs);
        fs = document.createElement("fieldset");
        l = createLegend(
          state,
          getKeyword(keyWords, translations, "DLG_TIPS"),
          getKeyword(keyWords, translations, "DLG_TIPS_DESC"),
          iconFor("DLG_TIPS")
        );
        fs.appendChild(l);
        fs.appendChild(createTipsContent(keyWords, translations));
        wrapFieldsetBody(fs);
        sections.push(fs);
        return sections;
      }
      module.exports = {
        buildDialogSections
      };
    }
  });

  // src/ui/dialog/dialog.js
  var require_dialog = __commonJS({
    "src/ui/dialog/dialog.js"(exports, module) {
      var { hydrateOptions } = require_hydrate();
      var {
        mainColumnAtt,
        postAtt,
        postAttCPID,
        postAttChildFlag,
        postAttTab
      } = require_attributes();
      var { toggleHiddenElements } = require_hide();
      var { addCSS, addExtraCSS } = require_styles();
      var { deleteOptions, setOptions } = require_idb();
      var { createToggleButton } = require_toggle_button();
      var { buildDictionaries } = require_dictionaries();
      var { defaults, translations } = require_translations();
      var { buildBugReport, getSupportUrl } = require_bug_report();
      var { buildDialogSections } = require_sections();
      function replaceObjectContents(target, source) {
        if (!target || !source) {
          return;
        }
        Object.keys(target).forEach((key) => {
          delete target[key];
        });
        Object.assign(target, source);
      }
      function isPlainObject(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
      }
      function deepEqual(a, b) {
        if (a === b) {
          return true;
        }
        if (Array.isArray(a) && Array.isArray(b)) {
          if (a.length !== b.length) {
            return false;
          }
          for (let i = 0; i < a.length; i += 1) {
            if (!deepEqual(a[i], b[i])) {
              return false;
            }
          }
          return true;
        }
        if (isPlainObject(a) && isPlainObject(b)) {
          const keysA = Object.keys(a);
          const keysB = Object.keys(b);
          if (keysA.length !== keysB.length) {
            return false;
          }
          for (const key of keysA) {
            if (!Object.prototype.hasOwnProperty.call(b, key)) {
              return false;
            }
            if (!deepEqual(a[key], b[key])) {
              return false;
            }
          }
          return true;
        }
        return false;
      }
      function getFooterButton(buttonId) {
        if (!buttonId) {
          return null;
        }
        const dialog = document.getElementById("fbcmf");
        if (!dialog) {
          return null;
        }
        const footer = dialog.querySelector("footer");
        if (!footer) {
          return null;
        }
        return footer.querySelector(`#${buttonId}`);
      }
      function setActionButtonIcon(state, button, iconHtml) {
        if (!state || !button || !iconHtml) {
          return;
        }
        const iconWrap = button.querySelector(".cmf-action-icon");
        if (!iconWrap) {
          return;
        }
        iconWrap.innerHTML = iconHtml;
      }
      function collectDialogOptions(state) {
        if (!state) {
          return null;
        }
        const md = document.getElementById("fbcmf");
        if (!md) {
          return null;
        }
        const options = JSON.parse(JSON.stringify(state.options));
        let cbs = Array.from(md.querySelectorAll('input[type="checkbox"][cbtype="T"]'));
        cbs.forEach((cb) => {
          options[cb.name] = cb.checked;
        });
        const blockedFeeds = [
          "NF_BLOCKED_FEED",
          "GF_BLOCKED_FEED",
          "VF_BLOCKED_FEED",
          "MP_BLOCKED_FEED",
          "PP_BLOCKED_FEED"
        ];
        blockedFeeds.forEach((cbName) => {
          if (!Array.isArray(options[cbName])) {
            options[cbName] = [];
          }
          cbs = Array.from(md.querySelectorAll(`input[type="checkbox"][name="${cbName}"]`));
          cbs.forEach((cb) => {
            options[cbName][parseInt(cb.value, 10)] = cb.checked ? "1" : "0";
          });
        });
        const rbs = md.querySelectorAll('input[type="radio"]:checked');
        rbs.forEach((rb) => {
          options[rb.name] = rb.value;
        });
        const inputs = Array.from(md.querySelectorAll('input[type="text"]'));
        inputs.forEach((inp) => {
          options[inp.name] = inp.value;
        });
        const tas = md.querySelectorAll("textarea");
        tas.forEach((ta) => {
          const txtn = ta.value.split("\n");
          const txts = [];
          txtn.forEach((txt) => {
            if (txt.trim().length > 0) {
              txts.push(txt);
            }
          });
          options[ta.name] = txts.join(state.SEP);
        });
        const selects = Array.from(md.querySelectorAll("select"));
        selects.forEach((select) => {
          options[select.name] = select.value;
        });
        const validInputs = Array.from(md.querySelectorAll('input:not([type="file"]), textarea, select'));
        const validNames = [];
        validInputs.forEach((inp) => {
          if (!validNames.includes(inp.name)) {
            validNames.push(inp.name);
          }
        });
        Object.keys(options).forEach((key) => {
          if (!validNames.includes(key)) {
            delete options[key];
          }
        });
        return options;
      }
      function syncSaveButtonState(state) {
        const pendingOptions = collectDialogOptions(state);
        if (!pendingOptions) {
          return;
        }
        const button = getFooterButton("BTNSave");
        if (!button) {
          return;
        }
        const isDirty = !deepEqual(pendingOptions, state.options);
        if (isDirty) {
          button.classList.add("cmf-action--dirty");
          button.classList.remove("cmf-action--confirm-blue");
          button.classList.remove("cmf-action--confirm-green");
          if (state.saveFeedbackTimeoutId) {
            clearTimeout(state.saveFeedbackTimeoutId);
            state.saveFeedbackTimeoutId = null;
          }
          setActionButtonIcon(state, button, state.iconFooterSaveHTML || state.iconDialogFooterHTML);
          return;
        }
        button.classList.remove("cmf-action--dirty");
        if (!button.classList.contains("cmf-action--confirm-blue")) {
          setActionButtonIcon(state, button, state.iconFooterSaveHTML || state.iconDialogFooterHTML);
        }
      }
      function triggerActionFeedback(state, buttonId, className) {
        const button = getFooterButton(buttonId);
        if (!button) {
          return;
        }
        if (state.saveFeedbackTimeoutId) {
          clearTimeout(state.saveFeedbackTimeoutId);
        }
        button.classList.add(className);
        button.classList.remove("cmf-action--dirty");
        setActionButtonIcon(
          state,
          button,
          state.iconFooterCheckHTML || state.iconFooterSaveHTML || state.iconDialogFooterHTML
        );
        state.saveFeedbackTimeoutId = setTimeout(() => {
          const currentButton = getFooterButton(buttonId);
          if (!currentButton) {
            return;
          }
          currentButton.classList.remove(className);
          const footerIcons = state.dialogFooterIcons || {};
          const defaultIcon = buttonId === "BTNSave" ? state.iconFooterSaveHTML || footerIcons.BTNSave || state.iconDialogFooterHTML : footerIcons[buttonId] || state.iconDialogFooterHTML;
          setActionButtonIcon(state, currentButton, defaultIcon);
          state.saveFeedbackTimeoutId = null;
        }, 600);
      }
      function closeDialogIfOpen(state) {
        const elDialog = document.getElementById("fbcmf");
        if (!elDialog || !state) {
          return;
        }
        if (elDialog.hasAttribute(state.showAtt)) {
          elDialog.removeAttribute(state.showAtt);
          if (state.btnToggleEl) {
            state.btnToggleEl.removeAttribute("data-cmf-open");
          }
        }
      }
      function shouldShowHeaderClose(state) {
        const btnLocation = state && state.options && state.options.CMF_BTN_OPTION ? state.options.CMF_BTN_OPTION.toString() : "0";
        return btnLocation !== "1";
      }
      function updateHeaderCloseVisibility(dialog, state) {
        if (!dialog || !state) {
          return;
        }
        const closeWrap = dialog.querySelector(".fb-cmf-close");
        if (!closeWrap) {
          return;
        }
        if (shouldShowHeaderClose(state)) {
          closeWrap.removeAttribute("hidden");
        } else {
          closeWrap.setAttribute("hidden", "");
        }
      }
      function getTopbarMenuButtons() {
        const banner = document.querySelector('[role="banner"]');
        if (!banner) {
          return [];
        }
        const candidates = Array.from(banner.querySelectorAll("[aria-label]"));
        return candidates.filter((button) => {
          const label = button.getAttribute("aria-label");
          if (!label) {
            return false;
          }
          const normalized = label.trim().toLowerCase();
          const isTopbarMenu = normalized === "menu" || normalized === "messenger" || normalized === "messages" || normalized.startsWith("notifications") || normalized === "your profile" || normalized === "account";
          if (!isTopbarMenu) {
            return false;
          }
          const role = button.getAttribute("role");
          const hasExpanded = button.getAttribute("aria-expanded") !== null;
          return hasExpanded || role === "button" || button.tagName === "BUTTON";
        });
      }
      function isTopbarMenuButton(element) {
        if (!element || typeof element.getAttribute !== "function") {
          return false;
        }
        const label = element.getAttribute("aria-label");
        if (!label) {
          return false;
        }
        const normalized = label.trim().toLowerCase();
        const isTopbarMenu = normalized === "menu" || normalized === "messenger" || normalized === "messages" || normalized.startsWith("notifications") || normalized === "your profile" || normalized === "account";
        if (!isTopbarMenu) {
          return false;
        }
        const role = element.getAttribute("role");
        const hasExpanded = element.getAttribute("aria-expanded") !== null;
        const hasTabIndex = element.getAttribute("tabindex") !== null;
        return hasExpanded || hasTabIndex || role === "button" || element.tagName === "BUTTON";
      }
      function closeFacebookMenus(exceptButton) {
        const buttons = getTopbarMenuButtons();
        buttons.forEach((button) => {
          if (button === exceptButton) {
            return;
          }
          if (button.getAttribute("aria-expanded") === "true") {
            button.click();
          }
        });
      }
      function setupOutsideClickClose(state) {
        if (!state || state.cmfOutsideClickInit) {
          return;
        }
        state.cmfOutsideClickInit = true;
        const isEventInside = (event, element) => {
          if (!element) {
            return false;
          }
          const path = typeof event.composedPath === "function" ? event.composedPath() : [];
          if (path.includes(element)) {
            return true;
          }
          const target = event.target instanceof Element ? event.target : null;
          return target ? element.contains(target) : false;
        };
        const onOutsideActivate = (event) => {
          const dialog = document.getElementById("fbcmf");
          if (!dialog || !dialog.hasAttribute(state.showAtt)) {
            return;
          }
          if (isEventInside(event, dialog)) {
            return;
          }
          if (isEventInside(event, state.btnToggleEl)) {
            return;
          }
          closeDialogIfOpen(state);
        };
        document.addEventListener("pointerdown", onOutsideActivate, true);
      }
      function setupTopbarMenuSync(state) {
        if (!state || state.cmfTopbarSyncInit) {
          return;
        }
        const bindButtons = () => {
          const buttons = getTopbarMenuButtons();
          buttons.forEach((button) => {
            if (button.dataset.cmfMenuSync === "1") {
              return;
            }
            button.dataset.cmfMenuSync = "1";
            button.addEventListener(
              "click",
              () => {
                closeDialogIfOpen(state);
              },
              false
            );
            if (typeof MutationObserver !== "undefined") {
              const observer = new MutationObserver(() => {
                if (button.getAttribute("aria-expanded") === "true") {
                  closeDialogIfOpen(state);
                }
              });
              observer.observe(button, { attributes: true, attributeFilter: ["aria-expanded"] });
            }
          });
        };
        const banner = document.querySelector('[role="banner"]');
        if (!banner) {
          setTimeout(() => setupTopbarMenuSync(state), 200);
          return;
        }
        state.cmfTopbarSyncInit = true;
        bindButtons();
        if (typeof MutationObserver !== "undefined") {
          const observer = new MutationObserver((mutations) => {
            bindButtons();
            mutations.forEach((mutation) => {
              const target = mutation.target instanceof Element ? mutation.target : null;
              if (target && mutation.type === "attributes" && mutation.attributeName === "aria-expanded" && isTopbarMenuButton(target) && target.getAttribute("aria-expanded") === "true") {
                closeDialogIfOpen(state);
              }
            });
          });
          observer.observe(banner, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["aria-expanded", "aria-label", "role", "tabindex"]
          });
        }
        if (typeof MutationObserver !== "undefined") {
          const panelObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type !== "childList") {
                return;
              }
              mutation.addedNodes.forEach((node) => {
                if (!(node instanceof Element)) {
                  return;
                }
                const dialog = node.matches('[role="dialog"][aria-label]') ? node : node.querySelector ? node.querySelector('[role="dialog"][aria-label]') : null;
                if (dialog && isTopbarMenuButton(dialog)) {
                  closeDialogIfOpen(state);
                }
              });
            });
          });
          if (document.body) {
            panelObserver.observe(document.body, { childList: true, subtree: true });
          }
        }
        const getMenuButtonFromEvent = (event) => {
          const path = typeof event.composedPath === "function" ? event.composedPath() : [];
          for (const entry of path) {
            if (entry instanceof Element && isTopbarMenuButton(entry)) {
              return entry;
            }
          }
          const target = event.target instanceof Element ? event.target : null;
          if (!target) {
            return null;
          }
          const closest = target.closest("[aria-label]");
          return closest && isTopbarMenuButton(closest) ? closest : null;
        };
        const onTopbarActivate = (event) => {
          const topbarButton = getMenuButtonFromEvent(event);
          if (!topbarButton) {
            return;
          }
          closeDialogIfOpen(state);
        };
        document.addEventListener("pointerdown", onTopbarActivate, true);
        document.addEventListener("click", onTopbarActivate, true);
        document.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") {
            return;
          }
          onTopbarActivate(event);
        });
      }
      function toggleDialog(state) {
        const elDialog = document.getElementById("fbcmf");
        if (!elDialog || !state) {
          return;
        }
        if (elDialog.hasAttribute(state.showAtt)) {
          elDialog.removeAttribute(state.showAtt);
          if (state.btnToggleEl) {
            state.btnToggleEl.removeAttribute("data-cmf-open");
          }
        } else {
          setupTopbarMenuSync(state);
          closeFacebookMenus();
          elDialog.setAttribute(state.showAtt, "");
          if (state.btnToggleEl) {
            state.btnToggleEl.setAttribute("data-cmf-open", "true");
          }
        }
      }
      function syncToggleButtonOpenState(state) {
        const elDialog = document.getElementById("fbcmf");
        const toggleButton = state && state.btnToggleEl ? state.btnToggleEl : null;
        if (!elDialog || !toggleButton || !state) {
          return;
        }
        if (elDialog.hasAttribute(state.showAtt)) {
          toggleButton.setAttribute("data-cmf-open", "true");
        } else {
          toggleButton.removeAttribute("data-cmf-open");
        }
      }
      function addLegendEvents() {
        const elFBCMF = document.getElementById("fbcmf");
        if (elFBCMF) {
          const fieldsets = elFBCMF.querySelectorAll("fieldset");
          fieldsets.forEach((fieldset) => {
            updateFieldsetState(fieldset, false, { animateHeight: false });
          });
          if (elFBCMF.dataset.cmfLegendInit === "1") {
            return;
          }
          elFBCMF.dataset.cmfLegendInit = "1";
          elFBCMF.addEventListener("click", (event) => {
            const target = event.target instanceof Element ? event.target : null;
            const legend = target ? target.closest("legend") : null;
            if (!legend || !elFBCMF.contains(legend)) {
              return;
            }
            const fieldset = legend.parentElement;
            if (!fieldset) {
              return;
            }
            const isHidden = fieldset.classList.contains("cmf-hidden");
            updateFieldsetState(fieldset, isHidden, { animateRock: isHidden });
          });
        }
      }
      function updateFieldsetState(fieldset, expanded, options = {}) {
        if (!fieldset) {
          return;
        }
        const { animateRock = false, animateHeight = true } = options;
        fieldset.classList.toggle("cmf-hidden", !expanded);
        fieldset.classList.toggle("cmf-visible", expanded);
        fieldset.classList.toggle("cmf-expanded", expanded);
        const body = fieldset.querySelector(".cmf-section-body");
        if (!body) {
          return;
        }
        if (expanded) {
          const height = body.scrollHeight;
          fieldset.style.setProperty("--cmf-section-height", `${height}px`);
        } else if (animateHeight) {
          const height = body.scrollHeight;
          fieldset.style.setProperty("--cmf-section-height", `${height}px`);
          requestAnimationFrame(() => {
            fieldset.style.setProperty("--cmf-section-height", "0px");
          });
        } else {
          fieldset.style.setProperty("--cmf-section-height", "0px");
        }
        const icon = fieldset.querySelector("legend .cmf-legend-icon");
        if (!icon) {
          return;
        }
        if (!expanded) {
          icon.classList.remove("cmf-legend-rock");
          return;
        }
        if (animateRock) {
          icon.classList.remove("cmf-legend-rock");
          void icon.offsetWidth;
          icon.classList.add("cmf-legend-rock");
          icon.addEventListener(
            "animationend",
            () => {
              icon.classList.remove("cmf-legend-rock");
            },
            { once: true }
          );
        }
      }
      function applySearchFilter(dialog, query) {
        if (!dialog) {
          return;
        }
        const normalized = query.trim().toLowerCase();
        if (normalized.length > 0) {
          dialog.classList.add("cmf-searching");
        } else {
          dialog.classList.remove("cmf-searching");
        }
        const fieldsets = Array.from(dialog.querySelectorAll("fieldset"));
        fieldsets.forEach((fieldset) => {
          const legend = fieldset.querySelector("legend");
          const legendText = legend ? (legend.dataset.cmfTitle || legend.textContent).trim().toLowerCase() : "";
          const labels = Array.from(fieldset.querySelectorAll("label"));
          let anyMatch = false;
          labels.forEach((label) => {
            const labelText = label.textContent.trim().toLowerCase();
            const matches = normalized.length === 0 || labelText.includes(normalized);
            label.style.display = matches ? "" : "none";
            if (matches) {
              anyMatch = true;
            }
          });
          const legendMatches = normalized.length === 0 || legendText.includes(normalized);
          const showFieldset = normalized.length === 0 ? true : legendMatches || anyMatch;
          if (normalized.length > 0) {
            if (!fieldset.dataset.cmfPrevState) {
              fieldset.dataset.cmfPrevState = fieldset.classList.contains("cmf-hidden") ? "hidden" : "visible";
            }
            if (showFieldset) {
              updateFieldsetState(fieldset, true, { animateHeight: false });
            }
            fieldset.style.display = showFieldset ? "" : "none";
            if (!showFieldset) {
              updateFieldsetState(fieldset, false, { animateHeight: false });
            }
          } else {
            fieldset.style.display = "";
            if (fieldset.dataset.cmfPrevState) {
              const prev = fieldset.dataset.cmfPrevState;
              updateFieldsetState(fieldset, prev !== "hidden", { animateHeight: false });
              delete fieldset.dataset.cmfPrevState;
            }
          }
        });
      }
      function addSearchEvents(state) {
        const dialog = document.getElementById("fbcmf");
        if (!dialog || dialog.dataset.cmfSearchInit === "1") {
          return;
        }
        const searchInput = dialog.querySelector(".fb-cmf-search input");
        if (!searchInput) {
          return;
        }
        dialog.dataset.cmfSearchInit = "1";
        searchInput.addEventListener("input", () => {
          applySearchFilter(dialog, searchInput.value || "");
        });
        const toggleButton = state && state.btnToggleEl ? state.btnToggleEl : null;
        if (toggleButton) {
          toggleButton.addEventListener("click", () => {
            if (searchInput.value) {
              applySearchFilter(dialog, searchInput.value);
            }
          });
        }
      }
      function initReportBug(context) {
        const dialog = document.getElementById("fbcmf");
        if (!dialog || dialog.dataset.cmfReportInit === "1") {
          return;
        }
        const btnGenerate = dialog.querySelector("#BTNReportGenerate");
        const btnCopy = dialog.querySelector("#BTNReportCopy");
        const btnOpenIssues = dialog.querySelector("#BTNReportOpenIssues");
        const statusEl = dialog.querySelector(".cmf-report-status");
        const outputEl = dialog.querySelector(".cmf-report-output");
        if (!btnGenerate || !btnCopy || !btnOpenIssues || !statusEl || !outputEl) {
          return;
        }
        const { state, keyWords } = context;
        dialog.dataset.cmfReportInit = "1";
        const setStatus = (key) => {
          if (!keyWords || !keyWords[key]) {
            statusEl.textContent = "";
            return;
          }
          statusEl.textContent = keyWords[key];
        };
        const ensureReport = () => {
          if (state && typeof state.cmfReportText === "string" && state.cmfReportText.length > 0) {
            return state.cmfReportText;
          }
          const { text } = buildBugReport(context);
          if (state) {
            state.cmfReportText = text;
          }
          outputEl.value = text;
          outputEl.classList.add("cmf-report-output--visible");
          setStatus("DLG_REPORT_BUG_STATUS_READY");
          const fieldset = outputEl.closest("fieldset");
          if (fieldset && fieldset.classList.contains("cmf-visible")) {
            updateFieldsetState(fieldset, true, { animateHeight: false });
          }
          return text;
        };
        btnGenerate.addEventListener("click", () => {
          if (state) {
            state.cmfReportText = "";
          }
          ensureReport();
        });
        btnCopy.addEventListener("click", async () => {
          const reportText = ensureReport();
          if (!reportText) {
            setStatus("DLG_REPORT_BUG_STATUS_FAILED");
            return;
          }
          try {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
              await navigator.clipboard.writeText(reportText);
            } else {
              outputEl.focus();
              outputEl.select();
              document.execCommand("copy");
            }
            setStatus("DLG_REPORT_BUG_STATUS_COPIED");
          } catch (error) {
            setStatus("DLG_REPORT_BUG_STATUS_FAILED");
          }
        });
        btnOpenIssues.addEventListener("click", () => {
          const url = getSupportUrl();
          if (url) {
            window.open(url, "_blank");
          }
        });
      }
      function updateLegendWidths(dialog) {
        if (!dialog) {
          return;
        }
        const legends = Array.from(dialog.querySelectorAll("fieldset legend"));
        if (legends.length === 0) {
          return;
        }
        const usesMenuLegend = legends.some((legend) => legend.classList.contains("cmf-legend"));
        if (usesMenuLegend) {
          legends.forEach((legend) => {
            legend.style.width = "";
          });
          return;
        }
        const previousWidths = legends.map((legend) => legend.style.width);
        legends.forEach((legend) => {
          legend.style.width = "auto";
        });
        let maxWidth = 0;
        legends.forEach((legend) => {
          const rect = legend.getBoundingClientRect();
          if (rect.width > maxWidth) {
            maxWidth = rect.width;
          }
        });
        legends.forEach((legend, index) => {
          legend.style.width = maxWidth > 0 ? `${Math.ceil(maxWidth)}px` : previousWidths[index];
        });
      }
      function updateDialog(state) {
        const dialog = document.getElementById("fbcmf");
        const content = dialog ? dialog.querySelector(".content") : null;
        if (!content || !state) {
          return;
        }
        let cbs = Array.from(content.querySelectorAll('input[type="checkbox"][cbtype="T"]'));
        cbs.forEach((cb) => {
          if (Object.prototype.hasOwnProperty.call(state.options, cb.name)) {
            cb.checked = state.options[cb.name];
          }
        });
        cbs = Array.from(content.querySelectorAll('input[type="checkbox"][cbtype="M"]'));
        cbs.forEach((cb) => {
          if (Object.prototype.hasOwnProperty.call(state.options, cb.name)) {
            cb.checked = state.options[cb.name][parseInt(cb.value, 10)] === "1";
          }
        });
        const rbs = content.querySelectorAll('input[type="radio"]');
        rbs.forEach((rb) => {
          if (Object.prototype.hasOwnProperty.call(state.options, rb.name) && rb.value === state.options[rb.name]) {
            rb.checked = true;
          }
        });
        const tas = Array.from(content.querySelectorAll("textarea"));
        tas.forEach((ta) => {
          if (Object.prototype.hasOwnProperty.call(state.options, ta.name)) {
            ta.value = state.options[ta.name].replaceAll(state.SEP, "\n");
          }
        });
        const inputs = Array.from(content.querySelectorAll('input[type="text"]'));
        inputs.forEach((inp) => {
          if (Object.prototype.hasOwnProperty.call(state.options, inp.name)) {
            inp.value = state.options[inp.name];
          }
        });
        const selects = Array.from(content.querySelectorAll("select"));
        selects.forEach((select) => {
          if (Object.prototype.hasOwnProperty.call(state.options, select.name)) {
            for (let i = 0; i < select.options.length; i += 1) {
              const option = select.options[i];
              option.selected = option.value === state.options[select.name];
            }
          }
        });
        updateHeaderCloseVisibility(dialog, state);
        syncSaveButtonState(state);
      }
      function buildDialog({ state, keyWords }, handlers, languageChanged = false) {
        if (!state || !keyWords || !document.body) {
          return null;
        }
        const langEntry = translations[state.language];
        const searchLabel = langEntry && langEntry.DLG_SEARCH_SETTINGS || translations.en.DLG_SEARCH_SETTINGS || "Search Clean My Feeds";
        const direction = langEntry ? langEntry.LANGUAGE_DIRECTION : "ltr";
        let dlg;
        let cnt;
        if (!languageChanged) {
          dlg = document.createElement("div");
          dlg.id = "fbcmf";
          dlg.className = "fb-cmf";
          const hdr = document.createElement("header");
          const hdr1 = document.createElement("div");
          hdr1.className = "fb-cmf-icon";
          hdr1.innerHTML = state.iconDialogHeaderHTML;
          const hdr22 = document.createElement("div");
          hdr22.className = "fb-cmf-title";
          const hdr3 = document.createElement("div");
          hdr3.className = "fb-cmf-close";
          const btn = document.createElement("button");
          btn.type = "button";
          btn.innerHTML = state.iconClose;
          const closeLabel = Array.isArray(keyWords.DLG_BUTTONS) ? keyWords.DLG_BUTTONS[1] : "Close";
          btn.setAttribute("aria-label", closeLabel);
          btn.title = closeLabel;
          btn.addEventListener("click", () => toggleDialog(state), false);
          hdr3.appendChild(btn);
          hdr.appendChild(hdr1);
          hdr.appendChild(hdr22);
          hdr.appendChild(hdr3);
          dlg.appendChild(hdr);
          updateHeaderCloseVisibility(dlg, state);
          cnt = document.createElement("div");
          cnt.classList.add("content");
        } else {
          dlg = document.getElementById("fbcmf");
          const hdr = dlg.querySelector("header");
          const hdr22 = hdr.querySelector(".fb-cmf-title");
          while (hdr22.firstChild) {
            hdr22.removeChild(hdr22.firstChild);
          }
          hdr22.classList.remove("fb-cmf-lang-1");
          hdr22.classList.remove("fb-cmf-lang-2");
          cnt = dlg.querySelector(".content");
          while (cnt.firstChild) {
            cnt.removeChild(cnt.firstChild);
          }
          updateHeaderCloseVisibility(dlg, state);
        }
        dlg.setAttribute("dir", direction);
        const hdr2 = dlg.querySelector(".fb-cmf-title");
        const htxt = document.createElement("div");
        const gm = typeof globalThis !== "undefined" ? globalThis.GM : void 0;
        const scriptVersion = gm && gm.info && gm.info.script && gm.info.script.version ? gm.info.script.version : "";
        htxt.textContent = `${translations.en.DLG_TITLE}${scriptVersion ? ` version ${scriptVersion}` : ""}`;
        hdr2.appendChild(htxt);
        if (state.language !== "en") {
          const stxt = document.createElement("small");
          stxt.textContent = `(${keyWords.DLG_TITLE})`;
          hdr2.appendChild(stxt);
          hdr2.classList.add("fb-cmf-lang-2");
        } else {
          hdr2.classList.add("fb-cmf-lang-1");
        }
        const sections = buildDialogSections({
          state,
          options: state.options,
          keyWords,
          translations
        });
        const searchRow = document.createElement("div");
        searchRow.className = "fb-cmf-search";
        const searchIcon = document.createElement("div");
        searchIcon.className = "fb-cmf-search-icon";
        searchIcon.innerHTML = state.iconDialogSearchHTML;
        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.setAttribute("aria-label", searchLabel);
        searchInput.setAttribute("placeholder", searchLabel);
        searchRow.appendChild(searchIcon);
        searchRow.appendChild(searchInput);
        cnt.appendChild(searchRow);
        sections.forEach((section) => cnt.appendChild(section));
        if (!languageChanged) {
          const body = document.createElement("div");
          body.className = "fb-cmf-body";
          const mainColumn = document.createElement("div");
          mainColumn.className = "fb-cmf-main";
          mainColumn.appendChild(cnt);
          const footer = document.createElement("footer");
          const dialogFooterIcons = state.dialogFooterIcons || {};
          const baseTooltips = Array.isArray(keyWords.DLG_BUTTON_TOOLTIPS) ? keyWords.DLG_BUTTON_TOOLTIPS : translations.en.DLG_BUTTON_TOOLTIPS;
          const tooltips = Array.isArray(baseTooltips) && baseTooltips.length >= 4 ? baseTooltips : translations.en.DLG_BUTTON_TOOLTIPS;
          const buttonDefinitions = [
            {
              id: "BTNSave",
              text: keyWords.DLG_BUTTONS[0],
              handler: handlers.saveUserOptions,
              tooltipIndex: 0
            },
            {
              id: "BTNExport",
              text: keyWords.DLG_BUTTONS[2],
              handler: handlers.exportUserOptions,
              tooltipIndex: 1
            },
            { id: "BTNImport", text: keyWords.DLG_BUTTONS[3], handler: null, tooltipIndex: 2 },
            {
              id: "BTNReset",
              text: keyWords.DLG_BUTTONS[4],
              handler: handlers.resetUserOptions,
              tooltipIndex: 3
            }
          ];
          buttonDefinitions.forEach((def) => {
            const buttonEl = document.createElement("button");
            buttonEl.type = "button";
            buttonEl.setAttribute("id", def.id);
            buttonEl.classList.add("cmf-action");
            const iconWrap = document.createElement("span");
            iconWrap.className = "cmf-action-icon";
            iconWrap.innerHTML = dialogFooterIcons[def.id] || state.iconDialogFooterHTML;
            const textWrap = document.createElement("span");
            textWrap.className = "cmf-action-text";
            textWrap.textContent = def.text;
            buttonEl.appendChild(iconWrap);
            buttonEl.appendChild(textWrap);
            if (tooltips[def.tooltipIndex]) {
              buttonEl.title = tooltips[def.tooltipIndex];
            }
            if (typeof def.handler === "function") {
              buttonEl.addEventListener("click", def.handler, false);
            }
            footer.appendChild(buttonEl);
          });
          const fileImport = document.createElement("input");
          fileImport.setAttribute("type", "file");
          fileImport.setAttribute("id", `FI${postAtt}`);
          fileImport.classList.add("fileInput");
          footer.appendChild(fileImport);
          const sideColumn = document.createElement("div");
          sideColumn.className = "fb-cmf-side";
          sideColumn.appendChild(footer);
          body.appendChild(mainColumn);
          body.appendChild(sideColumn);
          dlg.appendChild(body);
          document.body.appendChild(dlg);
          const fileInput = document.getElementById(`FI${postAtt}`);
          fileInput.addEventListener("change", handlers.importUserOptions, false);
          const btnImport = document.getElementById("BTNImport");
          btnImport.addEventListener(
            "click",
            () => {
              fileInput.click();
            },
            false
          );
        } else {
          const footer = dlg.querySelector("footer");
          const baseTooltips = Array.isArray(keyWords.DLG_BUTTON_TOOLTIPS) ? keyWords.DLG_BUTTON_TOOLTIPS : translations.en.DLG_BUTTON_TOOLTIPS;
          const tooltips = Array.isArray(baseTooltips) && baseTooltips.length >= 4 ? baseTooltips : translations.en.DLG_BUTTON_TOOLTIPS;
          let btn = footer.querySelector("#BTNSave");
          let textEl = btn ? btn.querySelector(".cmf-action-text") : null;
          if (textEl) {
            textEl.textContent = keyWords.DLG_BUTTONS[0];
          } else if (btn) {
            btn.textContent = keyWords.DLG_BUTTONS[0];
          }
          if (btn && tooltips[0]) {
            btn.title = tooltips[0];
          }
          btn = footer.querySelector("#BTNExport");
          textEl = btn ? btn.querySelector(".cmf-action-text") : null;
          if (textEl) {
            textEl.textContent = keyWords.DLG_BUTTONS[2];
          } else if (btn) {
            btn.textContent = keyWords.DLG_BUTTONS[2];
          }
          if (btn && tooltips[1]) {
            btn.title = tooltips[1];
          }
          btn = footer.querySelector("#BTNImport");
          textEl = btn ? btn.querySelector(".cmf-action-text") : null;
          if (textEl) {
            textEl.textContent = keyWords.DLG_BUTTONS[3];
          } else if (btn) {
            btn.textContent = keyWords.DLG_BUTTONS[3];
          }
          if (btn && tooltips[2]) {
            btn.title = tooltips[2];
          }
          btn = footer.querySelector("#BTNReset");
          textEl = btn ? btn.querySelector(".cmf-action-text") : null;
          if (textEl) {
            textEl.textContent = keyWords.DLG_BUTTONS[4];
          } else if (btn) {
            btn.textContent = keyWords.DLG_BUTTONS[4];
          }
          if (btn && tooltips[3]) {
            btn.title = tooltips[3];
          }
          addLegendEvents();
        }
        addLegendEvents();
        updateLegendWidths(dlg);
        addSearchEvents(state);
        const content = dlg.querySelector(".content");
        if (content && !content.dataset.cmfDirtyWatch) {
          content.dataset.cmfDirtyWatch = "1";
          content.addEventListener("input", () => syncSaveButtonState(state), true);
          content.addEventListener("change", () => syncSaveButtonState(state), true);
        }
        syncSaveButtonState(state);
        return dlg;
      }
      function initDialog(context, helpers) {
        if (!context || !helpers) {
          return null;
        }
        const { state } = context;
        const { setFeedSettings, rerunFeeds } = helpers;
        const handlers = {
          saveUserOptions: async (event, source = "dialog") => {
            let languageChanged = false;
            let hadUnsavedChanges = false;
            if (source === "dialog") {
              const md2 = document.getElementById("fbcmf");
              if (!md2) {
                return;
              }
              const elLikesMaximum = md2.querySelector('input[name="NF_LIKES_MAXIMUM"]');
              if (elLikesMaximum.checked) {
                const elLikesMaximumCount = md2.querySelector('input[name="NF_LIKES_MAXIMUM_COUNT"]');
                if (elLikesMaximumCount.value.length === 0) {
                  alert(`${context.keyWords.NF_LIKES_MAXIMUM}?`);
                  elLikesMaximumCount.focus();
                  return;
                }
              }
              const pendingOptions = collectDialogOptions(state);
              if (!pendingOptions) {
                return;
              }
              hadUnsavedChanges = !deepEqual(pendingOptions, state.options);
              replaceObjectContents(state.options, pendingOptions);
              languageChanged = state.language !== state.options.CMF_DIALOG_LANGUAGE;
            } else if (source === "reset") {
              languageChanged = true;
            }
            const md = document.getElementById("fbcmf");
            if (md) {
              const inputs = Array.from(
                md.querySelectorAll('input:not([type="file"]), textarea, select')
              );
              const validNames = [];
              inputs.forEach((inp) => {
                if (!validNames.includes(inp.name)) {
                  validNames.push(inp.name);
                }
              });
              Object.keys(state.options).forEach((key) => {
                if (!validNames.includes(key)) {
                  delete state.options[key];
                }
              });
            }
            await setOptions(JSON.stringify(state.options));
            const siteLanguage = document.documentElement ? document.documentElement.lang : "en";
            const hydrated = hydrateOptions(state.options, siteLanguage);
            replaceObjectContents(state.options, hydrated.options);
            replaceObjectContents(state.filters, hydrated.filters);
            state.language = hydrated.language;
            state.hideAnInfoBox = hydrated.hideAnInfoBox;
            replaceObjectContents(context.options, hydrated.options);
            replaceObjectContents(context.filters, hydrated.filters);
            replaceObjectContents(context.keyWords, hydrated.keyWords);
            const dictionaries = buildDictionaries();
            state.dictionarySponsored = dictionaries.dictionarySponsored;
            state.dictionaryFollow = dictionaries.dictionaryFollow;
            state.dictionaryReelsAndShortVideos = dictionaries.dictionaryReelsAndShortVideos;
            if (languageChanged) {
              buildDialog(context, handlers, true);
              initReportBug(context);
            }
            setFeedSettings(true);
            addCSS(state, context.options, defaults);
            addExtraCSS(state, context.options, defaults);
            updateHeaderCloseVisibility(document.getElementById("fbcmf"), state);
            const elements = document.querySelectorAll(`[${mainColumnAtt}]`);
            for (const element of elements) {
              element.removeAttribute(mainColumnAtt);
            }
            toggleHiddenElements(state, context.options);
            if (source === "dialog") {
              syncSaveButtonState(state);
              if (hadUnsavedChanges) {
                triggerActionFeedback(state, "BTNSave", "cmf-action--confirm-blue");
              }
            }
            if (state.isAF) {
              state.scanCountStart += 100;
              state.scanCountMaxLoop += 100;
              const details = document.querySelectorAll(`details[${postAtt}]`);
              for (const element of details) {
                const elParent = element.parentElement;
                const elContent = element.lastElementChild;
                if (elContent && elContent.tagName === "DIV") {
                  elParent.appendChild(elContent);
                }
                elParent.removeChild(element);
              }
              const miniCaptions = document.querySelectorAll(`h6[${postAttTab}]`);
              for (const miniCaption of miniCaptions) {
                const elParent = miniCaption.parentElement;
                elParent.removeChild(miniCaption);
              }
              let resetElements = document.querySelectorAll(`[${postAtt}]`);
              for (const element of resetElements) {
                element.removeAttribute(postAtt);
                element.removeAttribute(state.hideAtt);
                element.removeAttribute(state.cssHideEl);
                element.removeAttribute(state.cssHideNumberOfShares);
                element.removeAttribute(state.showAtt);
              }
              resetElements = document.querySelectorAll(`[${postAttCPID}], [${postAttChildFlag}]`);
              for (const element of resetElements) {
                if (element.hasAttribute(postAttCPID)) {
                  element.removeAttribute(postAttCPID);
                }
                if (element.hasAttribute(postAttChildFlag)) {
                  element.removeAttribute(postAttChildFlag);
                }
              }
              resetElements = document.querySelectorAll(
                `[${state.hideAtt}], [${state.cssHideEl}], [${state.cssHideNumberOfShares}]`
              );
              for (const element of resetElements) {
                element.removeAttribute(state.hideAtt);
                element.removeAttribute(state.cssHideEl);
                element.removeAttribute(state.cssHideNumberOfShares);
                element.removeAttribute(state.showAtt);
              }
              rerunFeeds("saveUserOptions");
            }
          },
          exportUserOptions: () => {
            const exportOptions = document.createElement("a");
            exportOptions.href = window.URL.createObjectURL(
              new Blob([JSON.stringify(state.options)], { type: "text/plain" })
            );
            exportOptions.download = "fb - clean my feeds - settings.json";
            exportOptions.click();
            exportOptions.remove();
            triggerActionFeedback(state, "BTNExport", "cmf-action--confirm-green");
          },
          importUserOptions: (event) => {
            const file = event && event.target ? event.target.files[0] : null;
            if (!file) {
              return;
            }
            const reader = new FileReader();
            reader.onload = (fileEvent) => {
              try {
                const fileContent = JSON.parse(fileEvent.target.result);
                const isValid = Object.prototype.hasOwnProperty.call(fileContent, "NF_SPONSORED") && Object.prototype.hasOwnProperty.call(fileContent, "GF_SPONSORED") && Object.prototype.hasOwnProperty.call(fileContent, "VF_SPONSORED") && Object.prototype.hasOwnProperty.call(fileContent, "MP_SPONSORED");
                if (!isValid) {
                  return;
                }
                state.options = fileContent;
                handlers.saveUserOptions(null, "file").then(() => {
                  updateDialog(state);
                  triggerActionFeedback(state, "BTNImport", "cmf-action--confirm-green");
                });
              } catch (error) {
                void error;
              }
            };
            reader.readAsText(file);
          },
          resetUserOptions: () => {
            deleteOptions().then(() => {
              state.options.CMF_DIALOG_LANGUAGE = "";
              handlers.saveUserOptions(null, "reset").then(() => {
                updateDialog(state);
              });
            }).catch(() => null);
          }
        };
        const runInit = () => {
          if (document.body) {
            createToggleButton(state, context.keyWords, () => toggleDialog(state));
            buildDialog(context, handlers, false);
            initReportBug(context);
            addLegendEvents();
            const dialog = document.getElementById("fbcmf");
            if (dialog && !dialog.dataset.cmfToggleSync) {
              dialog.dataset.cmfToggleSync = "1";
              syncToggleButtonOpenState(state);
              if (typeof MutationObserver !== "undefined") {
                const observer = new MutationObserver(() => syncToggleButtonOpenState(state));
                observer.observe(dialog, { attributes: true, attributeFilter: [state.showAtt] });
              }
            }
            setupTopbarMenuSync(state);
            setupOutsideClickClose(state);
          } else {
            setTimeout(runInit, 50);
          }
        };
        runInit();
        return handlers;
      }
      module.exports = {
        initDialog,
        toggleDialog,
        updateDialog
      };
    }
  });

  // src/res/about.png
  var require_about = __commonJS({
    "src/res/about.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAHlBMVEVMaXH////Nzs+tr7D39/fd3t7y8/Pr6+vt7u7k5OT4xq3QAAAACnRSTlMA/kcd9nLhrsqNVyXpXwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAoFJREFUeNrtVsu24jAMk+08mP//2SmO5VmU0pbeHsrdzAZv6AmJIsfyA/ja/zf5adESvApgPyy1JJpK/pKBFp9xhPEbgJqxfl6AeAGwct+hDX4EYJqvV/Y7LwOYyux9hW9W6z2uAJhqLBulfuCHPn5sPC9qBGBrfL3oewBZLzGHA6Wse7y9Bwj2hTAJVuz8nup7JeaoFQmrQQAqFMKqxbIr30uZQyDwBABJIG8BPs6xjyu5kJm5fImlN3/em6eZcfbAEmibYEb7IBvnKwt30T+lcMbgz4vTpxROGBhfLzyjcMJAD/o/o6CXiYV94ILO8bQq2RYuNL5l8MygHnNWufbxlLHYOwYV0ioTgBKoyRIxUJd4SOabinSbAJg5NVFltL/zYj7YOd8xKAEgo6dYMh+JUOLxGC69jgsAsNFGsUiba0SJJhmBrhHyQ1JuASxgTUuZClREo2QPIECrFoMAjSqzqeYRQInC8FLu4KgE2wTkzcHgskMeNMXK3Lt2DAgSNSmRlhYZAFSeouwMqEgCyGSwjRcdzGUwQwtQ4PNfyaVjyl+pXcYq8lwP7aTFoR1B6FoYq3gOa2MXhe4HIQ2gqpcWlgEL4CaUbIKklcHYxaDNXLZCUtV0K/c2ASZh5U6rHtAefujBS7exTWejJNsICIFskYHumTeNQ2sye9Yr2XS24rcJQA2kUQcAFMqxM1bbtEsDAG0Z0Tj7DaWSNTQ7JY8doQvvuU+mfgfMXBJA8TbMAYiZt3idMI4pJYBtWEpPr9OsKtkPG0AVPzokL1PNMPE1Nbaji0wSZ/XA1BaB2XGTqejPh3cDRpoKue3KBoWAIYjLMxKwf98rc97Xvva1rz3sH/oMVQSYrFHFAAAAAElFTkSuQmCC";
    }
  });

  // src/res/bug.png
  var require_bug = __commonJS({
    "src/res/bug.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAHlBMVEVMaXF+f4Dc3Nz19fakpKbv8PDLy8zm5ufAwcL///+F1WMiAAAACXRSTlMAIaT8RuJ7y2QGvN9ZAAAACXBIWXMAAAsTAAALEwEAmpwYAAACIElEQVR42u1Wy3asMAyTbCdM//9nS/DjLpieW4YBOl32jFc8EmFZsgnwjnf87TB+u+HmbhN68Pym+X/PjU3iRYAgO2q97uKOfJ2EfMhK5qPxZNXxq8zJaKSi6qRWJykUSlpzScevMrgVxOYERE4o6OGbLg73igSb5OsAloVlrUVki3oZoFn8py7tUMajGtDTAdJIonhsg4fykHfJrM3F5h0YIpUt56/KfJ7K2HT+YqvZIQ5IGuJeDpj6eQ0S3RwAYcIMRBSZToUkADZWnNagFIsB5OQ1oDSymJKzVQdIyXHhxE+ZQPqUTlHIADoMGoUQsO/2762cVQbNQf3GTtwbAZ/3XbHvhU9YgZy2tsSS05w/9IH0wrTTu5z8GQALT7xvE3v7GYBa4sm3RsKv5wGnhGOR/gS3hhrwOBzsYRRToc+nTFIMgOZWiQ2FXjZH3F0/nrCICJ/MjjJgIHLg9qXcPpYCxeajDKpxAHD4owhjXSkA6sFMm2ZaN5ZJxf15FG3ouqraKoNfTmVP2saFa3721dMXAOyC2htpkOQTg8mT/Ynad11BXKZ+DaCSI2U3bEcltFC8BEhUBbjk46ybcvY0vQKgjgU+G8cGIWYiCrWfzro7F9ABSIsIW2UEBpausQAMrYsMBgpAjZxYtSo+5lxM5gHAzaaLDNTj/j+bIEtpKAK8+d0+dD//sXwnE+ZeAKx6hv/mnHX348kJ6x3veMdfin8XxwaPqxEB2QAAAABJRU5ErkJggg==";
    }
  });

  // src/res/check.png
  var require_check = __commonJS({
    "src/res/check.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAElBMVEVMaXH7/fzk5eWBgoLR09K7vbsB1S3IAAAABnRSTlMA/OUpqWuQ+snYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxElEQVR42u2WQRaDIAwF/wdz/wOXhi7UPn0mmOKymYUrZwQFFUiSJEl26q/nV3DRB9crJCnTI6i9A8B6XCkT/oky4x+HzRm/TQVsPx5w/HDA86MB1w8GfD8WGPihwMiPBIZ+IDD2rUAt0HfUNwK1d7C+gr6xndkBqGjMv+7Grdgk5l9H0LdJqWjEN6awv/FUGPCtpyDteDdufHMdyFkY+vZCOhXGvrMSD4Ub31vK38Kd7yIkSS7z3yB56ANSiuS/Q5L8Ex9MmVJ1TTZLlQAAAABJRU5ErkJggg==";
    }
  });

  // src/res/export.png
  var require_export = __commonJS({
    "src/res/export.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAHlBMVEVMaXH///+cnZ1wcXLi4+Pz8/PX19jLzMy7u7zs7OywcrgNAAAACnRSTlMA/jsZ0fu/lG/lbP0X7wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAXVJREFUeNrtVcuyrCAM7CSAzP//7KiE3MXI6OALrTqbW/YKle68Ki3w4MGD/wR06bYAek9ADMGgPpnpdQFx6hPS56F7XxeI/Xx2mldVncICpNBCthsCiXKYSq9bAG7qoZLtBWwTEBr3PnEbXwHAbTWd2/kigBtuCEx8b2OEW2XgWvmhBxSql5dFHBGRjwDAHd/kv/juNn7yF9vPnBv43vSmWXzy764ainijUUt8J9P+RqMhN4UNU1QJy/bJi4jipklVCGMUlwzoBiD2JajlTpRgpwmwL3HYU/jVD+SkoW/hq8XVdXmtO1qP0alL5ZxzNT41ZG4tYBtnRSwL2L6wKuJ3G33vuOSYq//CNAuw6P4YReeyu8U95iKnwK8v134QC82G+P6qyyglsfHEUHLxrJj61/ftW2woXWp1pHekNJeWd7egFrBF1GViaBMgyNzjTRPwfeWrVBtIHI/XP4X+yA/YWToUcJz02FDkeGHprrs9ePDgr/EPW1p3azN8pKUAAAAASUVORK5CYII=";
    }
  });

  // src/res/groups.png
  var require_groups3 = __commonJS({
    "src/res/groups.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAIVBMVEVMaXH////4+PijpKVpa2vv7+/Ozs/Cw8Pq6urj4+PZ2tpk7XwrAAAAC3RSTlMA/vw0GehuU8aokBrAERkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAKFSURBVHja7VbLkuIwDOy2FBvm/791ILFk7SEJkOcMtbs3VBxcjt20Wi8DH/vYPzA+lxpvXLN5JY+9jPZ7gKS+ZpDre9RzP0E9+fMtz7liIBEAyoQX/YkejPEfRxn09ZOaAQoDrvcNoQAYYGCJrctTGmgQOIHL8HqS+QYExtuMIwD7unUB1mxAXX6qLw7ETh5IBKAReVBYV8tt33nGqQZAh3LHpWUAfKSIx0OFABALF9LivgysETVZAJeYTdc5G0ciemvfktC+oa8a+DIKjMMohOQ5DwCzjQgx/U6iYIeJswI60GDXzot0yeBqvykEvR0B0Ph2Q1mKWN/vSOlvW9pSg3LswlGBLzWIYxHFnuVwmAcxcC+AnNeMeNb0fj9Y8uTFEfIkH2+KWJILpVGX5c/lMNiRhYTcA2rdHQAug9pIJgwbH7YMSlPSqEj5DgC4F0JppEb5KYwAWLsbgKupzYOmNrLcAJTKWFeXrJlcOACAi3LOy9blGDe7zp7U274LE3y8pkTY3NT85ygEH849hg+VS4+5dSGKT7suDUAxizz932OtLc2nUPrVdA4ZfWoFDJbaWa7jlnq2XHOjpjGuAFBqW5PRNIG1XuBSWn8dcnNJQ76V1LuAUebktmbbB8aEIykAIA0BhgLGAHMDAHqzkxfKOPYn9akuyT0AijSXefsyrCBkdX9yrTSB+aSKN2QvBgKwYmcMdHr7aFsPx2KzgN1wkgcywSdZD9de50klZ4k0iVx8W/l94sg4zgA4E9hpbWMOxXk19kUa3Hc7o0MAodfzMAJQ2NdtW2EkYb/oB9g7FUcfjnqic0uy+E9v5UU8S/OXUFC09XgHAICGTtRpL4/rj33sv9gfg5w2a3AP/scAAAAASUVORK5CYII=";
    }
  });

  // src/res/import.png
  var require_import = __commonJS({
    "src/res/import.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAHlBMVEVMaXHKy8uen59ra2zn5+fT1NTx8vLd3t6ztLT+//688J39AAAACXRSTlMAijsf6bX70mpB6+u5AAAACXBIWXMAAAsTAAALEwEAmpwYAAABfklEQVR42u1WyXbEIAyTbZjh/792GrDdQ1bSQJKe+l6j28BIGHkhwIMHD/4l5NJSmx4g8N1iuM5nCgAX3a1e5ieOwI8ArgskiwBA+ssrEAkAZMM9AR5PFB7/l93uZSERyLd8xb0INIjraH+Df2IiAwrm2Ob3ryAu0Nd0vpkeutsVkFXfiraCbMPP+X2B1+hkj98X+AIUkB6/LxBmk9X4RoeviARAGZBAwf1iBEyUJnFdjxAWJCI+r0R6A3mkbtUzglmC8ufkChzZh6llGAJAlZQGILtreRXybiFJ4JJXNUF5D5sRUG8fCVA6rvhFMoh/OiZyROjxYRlF2h5IlDKcTGaL9VCp5WI27ws4KITSSKMQlkz/GJ4yKZOjiB4L+Gv9qbtQaNPZXJqFpHNSNNZuJ1I79r0WsCWHOr0D84YsJSh1PbeGKhfabuXs7Y49nsda3ZQcVwQ0bsrQmj2eqSFgDovl5I0LJuqtXphfoD5KNd93zcR+/sza86X24MGfxDcH75WTwcJufQAAAABJRU5ErkJggg==";
    }
  });

  // src/res/info.png
  var require_info = __commonJS({
    "src/res/info.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAG1BMVEVMaXH////9/f38/f39/f39/v78/Pz+/v78/PyV5uXfAAAACXRSTlMA/sCHP99pG6et6a3UAAAACXBIWXMAAAsTAAALEwEAmpwYAAABXUlEQVR42u2WwXKkMAxEn2WB9/+/dsxI1h5mkgVCFnsmpxR9weVCTbcsCcOFCxd+BOljoTEQlVPdEZT73AYIXNKy3ZF5THiZdKNA2+r75Sy6ArPcntYfj/kGoOKROfUy4cmFDQGUEDdHwTosBMvOQmqANq1QIjo4UtsoiACS3B3NFf7U7nTqaikVsjfgJvECQapA0gYgvqqxp+szAk0A2dUBk1DZlE6yUwUVKM0fyZmr9VmQXY3EaDOtFJR16hf+WbDWRWDTI1dZDNSxzyTm/xHkh5EAZHJUQmJv4zA+xRcLNoFBg5JeKiQahQolmr2URFTdJs/LCyNNfXwWtq+90FsDLY4tWOodqfZNDnoV2HftfEJw3E4DFuL0GIcbaU9wsmv9r+YjM02tl0DjfvQ3sJ6BMo63CbSbtuXuHJge7S7bU55vm/uBDNfAh56n2CkNxn+eydtXnAsXLvwa/AXWWXlMYMNAnAAAAABJRU5ErkJggg==";
    }
  });

  // src/res/marketplace.png
  var require_marketplace3 = __commonJS({
    "src/res/marketplace.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAJFBMVEVMaXH8/Pzq6uo1NTWoqanIyMnf39+NjY7x8fGBgoPQ0ND///9ckvW8AAAAC3RSTlMA/OENaYbBS/YlqZU3bvwAAAAJcEhZcwAACxMAAAsTAQCanBgAAAMnSURBVHja7ZbLmtwqDIR/kIFB7/+som0MnIUvbbszOck232jjdmMVupQK4Md+7J8wd3uTv3Ftny6T9L8ACHF9RBDi30VfUoHpEn/D0OsXhtr2S7FPAB3cAOIAbe1SH+UANNXtAabY9sJ6BwDAv7bKtG3N9IjgeGz+psfK9BmZMFXSLE1M3fxomqipYoruoP7DPw+RnHscGcDdLewJGexV+Yygj+oEXyNAfq7OepRgj+ATYA7A2v26pnObW2v0VoVPgBhGd4FRtEF5U2OEvbOAmn5bg7yWSmtGeDWI4zQPBmpnVPachTzEtCSgb8hr/EX8R/imUJfPFHJbzlzWeK2B7nTai3jU8g6gIPnucqvetrVe/72mMMdHx/5vmupyAEjcM7/ZCPXb8fbB9FID/0pPbWEOrq2/UZjbLLhjbNG9VShhXfKfSlr65doq4SEQl67otQZTh8mNFWR08K6Bd21yI9ijzyIXStRlY6L0PDIt5JxHzCP7kXPufoThioa7Ds4cg6jvaUzOoHtMm7wyrKFk0zkTaig5fhbP9JQlPKQOWsQDCxFlMAG9NcIIBaOUUjDDzBTbXfU8CZI3wtQCNeAmIFSkhtC72FeTWavgJhcDIQQIBAhYgN62mQGoYDB8wwwZYHQPFhCGpFQXe2Zy1sA1pSSKUlIJotRGVUoqQynO41oPeYnznYmcRJrzMlJf00IqVN/HaNBdKsnPzsWZ6qZWx42ok2vyZmLJ64xbNglcGpJhGSAvmdY5m8LydSd6bYkrlSUWUkljo2acI2FuQi4jbZPvlnRtvo54aeNBXJ1FNqINEdEVQAwDxUsBVUVVFW3+dSXSlej6JuqV/jp/nfpiSu/ZgPEE+FSQdorvks7DxLR7FEqqV4C+TAsQ1tvslPPq0N7wJYwCX6lcI4jL2JXtKk3+KH6L8/tbmcU9j7YxdmaM27HOedr3XN35ksubEd+m/xTBkt8hXEg5AcK6/sJjtOaRY9eSF7Yk3ZBxkzRJr9/tfGBPE2MGQqzXa8wEsX+vnaZjPe8WW+SONZVbBLmtv4lA6vHDb1h59fNDleUP7pM/9mP/uv0HkViAM5aIJMsAAAAASUVORK5CYII=";
    }
  });

  // src/res/mop.png
  var require_mop = __commonJS({
    "src/res/mop.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAIVBMVEVMaXH7/PzGyMivsLH19fXU1dbd3uDl5ubv8PDr6+v///8zVrECAAAACnRSTlMA/UMo8WaEotq+aCzdfQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAw9JREFUeNqdl9uS4yoMRZckIGH+/1/lGITOQ3r6TGbciRPyEMpVkhdo62LjrXVpsh6f2Hv2JsajB33H3gL/+1l5x0Ex73vyMYEFoPE5gZV/Ad4hMP1N8SGB6gHAWwRHAG+s+kt+yb/vO09QgOv63IFuwO3Y77kTmPdcfExgOzD5nKCY9zX4mMACCD4nsPIDwFkCBRafE9RDFb9BoAd5/LXkjHmJvIyMT49gUlbZCT49QmnebNmTFHklAcPpyacEWbz3YxmfINCq+6a5/aCil1FoZZeCYyX3TxxcbJciOesYTwvdz+/3quqSRtH1HoGp3mploSwRpqi/EYV6ua6alvhNHdkgNTkbBTNVYKyq+0W9u+GdUbkc3+PfBE3KDU9dVV0nOO1iO20R5aqvL7HWiCtyKxQvpXhP3bXqsgwT1fn8CGZhrCWxWmGJiIPFNVigjCWtjqcOiuVsMGCftkrxzsy2NRZsuuJ6FDN93FeaAqyRuvC5Z6CsyCJclHyuA1Wd2nYb6/f9hOmwXIDWaKztlZBUsil+kUhCAguMNJGoSzT3eKUDtdtQQykws0CB6ABT9+O6/ODAWtBiyBSZdzsA3GzNLkOOPDw4SCDLajFANkOAJGTN1iFFXktZEaKV4lZkkYBSMm/qtsp6mQtCsgyH/iDSrQ9NK0dBeHQQ62b3UP+RvD39Iot2q/I6G7PPWfrd/v7Xfe5dNlJPFRRblllstDtEhzWQELQ5PW4vszFb1ZHBRMa1Vi9zr02SvHqfdcXrdA5BL6MpA8kgVGrcanTvzBrrVE2sFYAx1MrWc6eJ0wG2daoqr5BpkNb2LCPKrE4Hr/tRMh50psZkK+yaktk2695fDcB/j0OjaUaravMi1WcHr06Vca43JihWAen3UHrvdP+hhfzrIGb/1mEHvIN3/2nIkoOBpP1x6u+t97mf60xR7slw//XvHXm2N3Y5JhhnB804JOh+esxTbV/S+5/A6YfV4Li912z+HYR7aeis/fyoOzQfbIHd5nprwNCvNge4FZnrx6+1JzOSJQaBPP3U+w836Imm1xDP2QAAAABJRU5ErkJggg==";
    }
  });

  // src/res/news.png
  var require_news3 = __commonJS({
    "src/res/news.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGFBMVEVMaXH////g4ODw8PCrq6339/fo6Og9QEAgsGlPAAAACHRSTlMA/orYM/bAHX4j87kAAAAJcEhZcwAACxMAAAsTAQCanBgAAAEDSURBVHja7VbRDsIgDCyl+v/fK6X1SV2HtLBFYwx9WpfldhzXA4BVq/6ikm0x+Bx5/yab7loDgIwCzi+xRIQZXQZpYM2666ld5uNBhkRsAC63J7khBEf2fIyBYWM5JJ4FUIkpuQDstmPWO6cBbYyhfAAgSWwyB6BCoUCAPTBq6ESsIYOu/+jsLjB8ZxuxP9OiQwD9UKISjVzyU0AAIIWBQhIHqQsgzZsyKWIb3HMMeNxZ0z6gswA8hErVjDPq++l2dmHDCcVkO8rQOAfHQP34MG2diPxqkQ84UQESdQ7VPoBVqtDMDeUbImbXiUjzbrQBRhowqhLc0vyTCnhda1et+t26AyL9Rley/u65AAAAAElFTkSuQmCC";
    }
  });

  // src/res/pref.png
  var require_pref = __commonJS({
    "src/res/pref.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAHlBMVEVMaXH////BwsPy8vNkZWaio6Tp6ura29vh4uLO0NBg0qXhAAAACnRSTlMA/lb0EzDWmrh9+5zeCgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAqVJREFUeNrtltuS4zoIRRcIpM7//+zYkmAe7O44idOeqXk5daqpysWy2EKwucCP/Mj/QuSvNbywxj+caFWk+OH53T6AcfIi5uNzOdfXIiLi8mKrlQBfLy2wDkA9NUCPsPr+AqdS7+hnVzAsAPeRG3yWAJyyH6oDlHgH4DqR9Dp77gYjTULJuiu1+eiBRx64dFDv8eTPDnh2wCNQ7W8AXPp3/MkObYW6POIf/n6nTzfw8RSCR3/3R3ckcryMju1jy1si5ccXyZrkOucotPvSgkU+heApCsIePHoEQORQ3dZ8Bq0/h+A5jLu+Huietq0GacSrAUcA29ii+ZAuIZsNPpknBhyjEJsXLQBMW1MDCNs32msIjhY4dW4bY+PknJgGIJJAyKkBnwBW5255XQHTXkWtFwmIOsHxeeKB+03kUxrAbftpcvt8qS4izZxvfHBYyI1VfYtAUVQVdJZ5DfCuwo396xIgAFaqgdU914pGCXSWeFt7SsSRTKpLC2zx/SaWAyzWE9vKJ12a7kS0gNCywvQcANqEqBp+P+ZUbocwYHq7bUTaOsGH+mVnstzwn2v5nk5qc1y0trbuCg8IDpr9DPklG3cvpEoeF6d3qJnOFcDuRZKaX3VckIF4vDa1FwAn72QQdzPiFuESLUaYZ1wBHH2UkWVKXbLqqtYhBnkBkPq1Q81CU+egxkjPCZpyCSCfCC0ZjTGTOnUqBK5xDnBso6Ea+DBGGflrq27asZ4g70aZh2SKbB8REbEG4CJkx2fdmkb78xmprTQZKWUB1ZmgKr0uasgzHU/rQYdcVMcCrghg91Jtdj3ipPrMGSpWZxCg6d1HZhYhSsm8HvNMgBxeFtCSXVGG7f332KAv5kQLoHS8dPBB0FhKjr8eNK0I/zZf/siP/MflN2o9O82izMxiAAAAAElFTkSuQmCC";
    }
  });

  // src/res/profile.png
  var require_profile3 = __commonJS({
    "src/res/profile.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAG1BMVEVMaXH////Q0dPm5+fz8/Ty8/Pr7e3x8vL3+PifvYELAAAACXRSTlMA/SNgzqmQdu5EKR+rAAAACXBIWXMAAAsTAAALEwEAmpwYAAABZklEQVR42u2WzZKkMAyDPzt/7/+4IbGzh252mpnugcBhq7bQhZMVRbId4MaNGwDy/OpsoW8Iis0fHSoAESDLGNPSJbWVQHXxeQUjuwEBSH7iBgwRf5o3rqSgV2OMr2SiA0SbnyJQSV18SLDcxkvQO9IfBJp8WG6GMioj1QIdAUToW5uEiDNi7XFtpNwAyuKEVEkLmush9W1j4nA0VWgBbyc8KAtIBQiGRSNuAzLbITB/nS81tL+dut9ixFJ/SEFg+Sy71A8EWHY5MBf1nYIBqAxIzcEhfV061QMmmnqR6gCpaeiMDfeBTgy+Gh0sVOizw9SzP9jiEneKy/tpbMFEs6qFtm/iX44ABF/3ZNAh+JFhNED9Z4wX9kGY2ktfwcYPLTWvwOxf78Sw731afiOIdii6zwT14hXCbKF9IxCZPbluCToXnjbhws+JAq2cqi99NW+MfKINy+MJlee7eOL/wLlx48Z/hT+4rocxsUkNawAAAABJRU5ErkJggg==";
    }
  });

  // src/res/reels.png
  var require_reels2 = __commonJS({
    "src/res/reels.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAG1BMVEVMaXH///+OjpDg4OHv8PDDw8Xp6enS09T09PS3xe4uAAAACXRSTlMA/h2c4EzEcPV4cNdMAAAACXBIWXMAAAsTAAALEwEAmpwYAAABr0lEQVR42u2WUbOjMAiFPyBp/v/PtQmwD/b2arXa7sPOPnhmMjoTIJyDEOHChQv/B+QTIwVDR+mx3SuHfoYOjKBMbYik+ScZzH6zG22gHbAgVKL0swxUpDDRBBd39E40ABsQ3LbH2Yu/VteRyHCRBPNU5udsEDv6rBndfTJqB3GoHarPDOZ89TiAVgtqJ0EFyMeqHVDVHc13qhDUO7+rA4g9RJWTAMPQOiWKA5ihA+gzeX9yeVvGkhrRgmBV8TZQhxL4SYBb33F6BDOUkScBTBSnPDMw0AEWlGk+YToOoHtOKwM/DtCE6biv/KSM07ftXF6/gQWq5KZ3zL9oZ5lQkbVHaBz2greXjDxKbUcHvlZhKdLPu8riVDnOIPaohL7v/0177thqswOhNnu5pJegN8ZSx+KfVwGg5v2lX0/KWBb2fgvpX35IaxXve5z9WMRT+JmIzd94NkXzMWMPAkjmer9YoBTJDCx+5/s7CpFAU61YEaXFyAYShbhlxyLOKJQAksybi6S3EU5mOhRK2YzEnbuxyWImNAb6nHHx2fWuYqH4zziNv/lrUC5cuHDh3+MPAm65j2POSWwAAAAASUVORK5CYII=";
    }
  });

  // src/res/reset.png
  var require_reset = __commonJS({
    "src/res/reset.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAHlBMVEVMaXGqrK3l5ubs7Oze39/Fx8fR0tPz9PS8vb7////eO3AlAAAACXRSTlMANMvlsm6R+lFFYOawAAAACXBIWXMAAAsTAAALEwEAmpwYAAABsElEQVR42u2VzXKkMAyEu/Vj5v2fdgZb0h4m2cqA2ZCa1J7oE2XkDyRbLeDSpUuXfkl6/IouIKkmCQCOZUyi7Gi7h8vnczKKYg+cB5BmyEEAZdKglQJOI+efF8GqvZ4hFstz+V4na9CMmSP+ZlAcmgSQ51JoijVrEyZIqXM18N3+pkCKYAaQ/VIiX/ebAhAkjGcAraFqQ/wIleXMKWhbYxu0BBMJifoe4IZYf3CVZU/MjncAiVFvAQrH+2+nTuFYjfoeYJwsIg8NYvY52S+0A8KtzQC7rJxgHLjXo9PrO8AoHfMEljUpnt/6gYlWzqpV4Sa5JewBmabMSZP3Zn0EN4SZIwmhuzJUiCMKuSFsAVRNwdY8SFCXoKiPpH+1ti3AGiK9q35Jlk3DG6OPLGOKZh63syz3AsgFyEEBkOkxzJ8uR7HRXtp9PheqRjZpH//4SPH+LEqp2OhnJlNHjaQBGFU3xvi0xzXL9X5itOEOcAVQQFg69FF8/snLTd0WUXUyPSqaCAVu0aES8Y8UCGky62RmuvSxK/uu88yPDWE7r6Y1GJx2AgBY/sgtL1269H/1B00RtgDyRwbRAAAAAElFTkSuQmCC";
    }
  });

  // src/res/save.png
  var require_save = __commonJS({
    "src/res/save.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAG1BMVEVMaXG9vb7x8fFiYmTc3N3Dw8Pz8/Pm5+f+/v4fHaD+AAAACHRSTlMARfIVjG/avXuNz6UAAAAJcEhZcwAACxMAAAsTAQCanBgAAAEbSURBVHja7ZbJloQgDEUzSf3/54oZamF195FB4Zxe1IK3C+I1eUAQYGlpaekUlgNM0ZlqMQLAjTJAgnwdTpATqDYAXIQCmdAZNQh/5WQUTgxeA+QaEu1hn4x/mMgYAAYmAnUOdA0jUzXF0c8vq4o8ZXAvhTqHKQAoCB63JTwSwngWYLHH36ycfKQEE7br7ujtrg4govDbjzmAgV8eKE1mAAZHEc8BsDVINgpgaQLy1jKitYzYfB+S4SCAO+UmGQRMaQH+AdBrKFX71DR3FlSqA4oTAFcsdxPl11eYWB8zmrQ7jXlAUrWQcxVqbwqAvc6Lg6tl3PDjZdFXyppEwrFXVzjhHvfNi9FT7tmQwI947H58e8usX7Klpa/VGzFoXF8i3esxAAAAAElFTkSuQmCC";
    }
  });

  // src/res/search.png
  var require_search3 = __commonJS({
    "src/res/search.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAJFBMVEVMaXH+/v74+fmqq63t7e7X2Nng4eLm6Ojx8vL09PXP0dL///9a6oKVAAAAC3RSTlMA+/AQn0Jcdr/ULGLQhs0AAAAJcEhZcwAACxMAAAsTAQCanBgAAAGeSURBVHja7VTbltwgDJNtCBPz/7/q7AYwfdjp6XZCeph0H6OnXEBRhCzgxo0bPwI6fSPMLVCv4NYuEEjgD31eb0zlXYKlrt9vTfqZijD8PMViurE4QB4ZSE4274uETJmT/L6Na6bMOk8QMuWHvDKuMrt/ed0PIGXKYdJEWRi+v3oWkiGUKRMDG8LB874p2oiAB5pUjitbhO06Q6A7bBQO2bCOsnCwlhIq+nFhSQnFJxQ4sAxTV8ep4/HSefD/jjPPzgfCWBoPHuwyHLCB4yOCvtkw9cwGn5HriYf/1aHuMwqaw2Q5TlgyeJsysbqivoZWK9TrG+PM8e/9nIniW4Xyp5AASZwpLxqnSzUkg7qLAZDUmA1aWsdgSodHC+emtvDHI4QQPhOZ1g5f4x58ttZj+O7uxl2iAbodNZw0pfdeS4kArLIvn513LSh61ED/aHcmQu/P049tPdEwXdZEdDzgd5DyF8NymSFkIvpxhrcaqTeFwtZ6WYOsTw2XnVT+YghXS9Vk0+kgncShKLA97PJJYGF+XA8TAIjgxo0bB/wCBbCD/cjGe68AAAAASUVORK5CYII=";
    }
  });

  // src/res/videos.png
  var require_videos3 = __commonJS({
    "src/res/videos.png"(exports, module) {
      module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAG1BMVEX///9MaXHW1tbv7+/j4+SIiYmvsLHIyMjp6em6bGZ1AAAACXRSTlP+AITtuRg9bdAJmuH8AAAACXBIWXMAAAsTAAALEwEAmpwYAAABeElEQVR42u1WwZaDIAyckED7/1+rAskeWpUqKnQP+/Y9OSnIMDOJCUT43XC4AW6AGwAABAC89m1SicszEUDaT9wKCV/sh4YCIHwjnVYJohkA+3km5hYAdqkwEWAe56WQ+6MAYDEFVtK55iRVgbmutxkg8cdr7gZA7vdg43E7VhVAsqz68xcAxktQeGpjkImK3CwOTa0erB8O/7KgAHA+Nv/KB1HwjftjnYGOf+2B1OpaGNoB9MwCccdWtHgglNxhKKTFp6R7gY+pw0R3Es1iTS7YPHmr7EGLBOGcXAya2PwuX17/No9iZbH0WYfnOAO4iQBEPNK77Xnbl8gELiA01+RFUCAionodSuYcV/NAySkQaOA3dStqOZdstkfKPK9QHus1VKxIKRq2AEsTSNdpm3X1lhMQAQdsVR2NQKoFwSk4NoAJKkR22olNAVg2++h3CtbXDQWQ0/YXuaJuTmVpke945+0zF3ek6+G3J3hNXQD3VfcGuAEuxw8UJH6EUAYVPwAAAABJRU5ErkJggg==";
    }
  });

  // src/core/assets.js
  var require_assets = __commonJS({
    "src/core/assets.js"(exports, module) {
      var aboutIcon = require_about();
      var bugIcon = require_bug();
      var checkIcon = require_check();
      var exportIcon = require_export();
      var groupsIcon = require_groups3();
      var importIcon = require_import();
      var infoIcon = require_info();
      var marketplaceIcon = require_marketplace3();
      var mopIcon = require_mop();
      var newsIcon = require_news3();
      var prefIcon = require_pref();
      var profileIcon = require_profile3();
      var reelsIcon = require_reels2();
      var resetIcon = require_reset();
      var saveIcon = require_save();
      var searchIcon = require_search3();
      var videosIcon = require_videos3();
      module.exports = {
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
        videosIcon
      };
    }
  });

  // src/entry/userscript.js
  var require_userscript = __commonJS({
    "src/entry/userscript.js"() {
      var { hydrateOptions } = require_hydrate();
      var { createState } = require_vars();
      var { addCSS, addExtraCSS } = require_styles();
      var { initializeRuntimeAttributes } = require_attributes();
      var { watchDarkMode } = require_theme();
      var { mopGroupsFeed } = require_groups();
      var { mopMarketplaceFeed } = require_marketplace();
      var { mopNewsFeed } = require_news2();
      var { mopProfileFeed } = require_profile2();
      var { mopReelsFeed } = require_reels();
      var { mopSearchFeed } = require_search2();
      var { mopVideosFeed } = require_videos();
      var { defaults, pathInfo } = require_translations();
      var { buildDictionaries } = require_dictionaries();
      var { buildIconHTML } = require_icon_html();
      var { initDialog, toggleDialog } = require_dialog();
      var { getOptions } = require_idb();
      var {
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
        videosIcon
      } = require_assets();
      var ICON_CLOSE = '<svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M15.543 3.043a1 1 0 1 1 1.414 1.414L11.414 10l5.543 5.542a1 1 0 0 1-1.414 1.415L10 11.414l-5.543 5.543a1 1 0 0 1-1.414-1.415L8.586 10 3.043 4.457a1 1 0 1 1 1.414-1.414L10 8.586z"/></svg>';
      var ICON_NEW_WINDOW = '<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><title>Open post in a new window</title><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
      var ICON_TOGGLE_HTML = buildIconHTML(mopIcon, "cmf-icon--toggle");
      var ICON_DIALOG_HEADER_HTML = buildIconHTML(mopIcon, "cmf-icon--dialog-header");
      var ICON_DIALOG_SEARCH_HTML = buildIconHTML(searchIcon, "cmf-icon--dialog-search");
      var ICON_DIALOG_FOOTER_HTML = buildIconHTML(mopIcon, "cmf-icon--dialog-footer");
      var ICON_LEGEND_HTML = buildIconHTML(mopIcon, "cmf-icon--legend");
      var ICON_FOOTER_SAVE_HTML = buildIconHTML(saveIcon, "cmf-icon--footer-save");
      var ICON_FOOTER_CHECK_HTML = buildIconHTML(checkIcon, "cmf-icon--footer-check");
      var ICON_FOOTER_EXPORT_HTML = buildIconHTML(exportIcon, "cmf-icon--footer-export");
      var ICON_FOOTER_IMPORT_HTML = buildIconHTML(importIcon, "cmf-icon--footer-import");
      var ICON_FOOTER_RESET_HTML = buildIconHTML(resetIcon, "cmf-icon--footer-reset");
      var ICON_LEGEND_NEWS_HTML = buildIconHTML(newsIcon, "cmf-icon--legend-news");
      var ICON_LEGEND_GROUPS_HTML = buildIconHTML(groupsIcon, "cmf-icon--legend-groups");
      var ICON_LEGEND_MARKETPLACE_HTML = buildIconHTML(marketplaceIcon, "cmf-icon--legend-marketplace");
      var ICON_LEGEND_VIDEOS_HTML = buildIconHTML(videosIcon, "cmf-icon--legend-videos");
      var ICON_LEGEND_PROFILE_HTML = buildIconHTML(profileIcon, "cmf-icon--legend-profile");
      var ICON_LEGEND_OTHER_HTML = buildIconHTML(infoIcon, "cmf-icon--legend-other");
      var ICON_LEGEND_REELS_HTML = buildIconHTML(reelsIcon, "cmf-icon--legend-reels");
      var ICON_LEGEND_PREFERENCES_HTML = buildIconHTML(prefIcon, "cmf-icon--legend-preferences");
      var ICON_LEGEND_REPORT_BUG_HTML = buildIconHTML(bugIcon, "cmf-icon--legend-report-bug");
      var ICON_LEGEND_TIPS_HTML = buildIconHTML(aboutIcon, "cmf-icon--legend-tips");
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
          } else if (["/search/top/", "/search/top", "/search/posts/", "/search/posts", "/search/pages/"].includes(
            state.prevPathname
          )) {
            state.isSF = true;
          } else if (state.prevPathname.includes("/reel/")) {
            state.isRF = options.REELS_CONTROLS === true || options.REELS_DISABLE_LOOPING === true;
          } else if (state.prevPathname.includes("/profile.php")) {
            state.isPP = true;
          } else if (state.prevPathname.substring(1).length > 1 && state.prevPathname.substring(1).indexOf("/") < 0) {
            state.isPP = true;
          }
          state.isAF = state.isNF || state.isGF || state.isVF || state.isMF || state.isSF || state.isRF || state.isPP;
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
          const currentTime = (/* @__PURE__ */ new Date()).getTime();
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
              sleepDuration = 1e3;
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
          DLG_TIPS: ICON_LEGEND_TIPS_HTML
        };
        state.dialogFooterIcons = {
          BTNSave: ICON_FOOTER_SAVE_HTML,
          BTNExport: ICON_FOOTER_EXPORT_HTML,
          BTNImport: ICON_FOOTER_IMPORT_HTML,
          BTNReset: ICON_FOOTER_RESET_HTML
        };
        state.iconNewWindow = ICON_NEW_WINDOW;
        const unsafeWindowRef = typeof globalThis !== "undefined" ? globalThis.unsafeWindow : void 0;
        state.isChromium = !!(unsafeWindowRef && unsafeWindowRef.chrome) && /Chrome|CriOS/.test(navigator.userAgent);
        initializeRuntimeAttributes(state);
        const { options, filters, keyWords } = await loadOptions(state);
        const context = { state, options, filters, keyWords, pathInfo };
        addCSS(state, options, defaults);
        setTimeout(() => addExtraCSS(state, options, defaults), 150);
        watchDarkMode(state, () => {
          const styleTag = addCSS(state, options, defaults);
          if (styleTag) {
            setTimeout(() => addExtraCSS(state, options, defaults), 150);
          }
          if (typeof state.syncToggleButtonTheme === "function") {
            state.syncToggleButtonTheme();
          }
        });
        setFeedSettings(state, options, true);
        initDialog(context, {
          setFeedSettings: (forceUpdate) => setFeedSettings(state, context.options, forceUpdate),
          rerunFeeds: (reason) => processPage(state, context.options, context.filters, context.keyWords, context, reason)
        });
        const gm = typeof globalThis !== "undefined" ? globalThis.GM : void 0;
        if (gm && typeof gm.registerMenuCommand === "function") {
          gm.registerMenuCommand(context.keyWords.GM_MENU_SETTINGS, () => toggleDialog(state));
        }
        startLoop(state, options, filters, keyWords, context);
      }
      startUserscript();
    }
  });
  require_userscript();
})();
