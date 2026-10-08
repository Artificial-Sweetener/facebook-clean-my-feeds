// ==UserScript==
// @name         FB - Clean my feeds (6.3.2)
// @description  Hide Sponsored and Suggested posts in FB's News Feed, Groups Feed, Watch Videos Feed and Marketplace Feed
// @namespace    https://greasyfork.org/en/users/1357440
// @supportURL   https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/issues
// @version      6.3.2
// @author       Artificial Sweetener - Current Maintainer (https://github.com/Artificial-Sweetener/)
// @author       zbluebugz - Founder (https://github.com/zbluebugz/)
// @author       Quoc Viet Rtinh - Filter maintenance in 2025 (https://github.com/trinhquocviet/)
// @match        https://www.facebook.com/*
// @match        https://web.facebook.com/*
// @match        https://facebook.com/*
// @noframes
// @grant        GM.registerMenuCommand
// @grant        GM.info
// @grant        unsafeWindow
// @license      GPL-3.0-only; https://www.gnu.org/licenses/gpl-3.0.html
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgY29sb3I9IiMxZjIzMjgiPgogIDxzdHlsZT46cm9vdHtjb2xvcjojMWYyMzI4fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXs6cm9vdHtjb2xvcjojZjBmNmZjfX08L3N0eWxlPgogIDxnIGZpbGw9ImN1cnJlbnRDb2xvciI+CiAgICA8cGF0aCBkPSJNNDYuMyAxLjFhMS42IDEuNiAwIDAgMSAyLjkgMS4zbC05LjYgMTktMi44LTEuM1oiLz4KICAgIDxwYXRoIGQ9Im0zNS43IDIxIDQuMyAxLjktMS4xIDMuMS00LjctMS45WiIvPgogICAgPHBhdGggZD0iTTMzLjEgMjUuNmMtMi42IDEuMi00LjMgNC02LjggNi4zLTIuMiAyLjEtNC4zIDMuMS02LjIgMy40IDQuOC42IDguNy01LjEgMTIuNi04LjEtMyA0LjUtNS43IDgtMTAuMyA5LjIgMi4yLjQgMy41LjYgNS4yLjIgMy0xLjkgNS4xLTUuNyA2LjctOS40LTEgNC4yLTMuMSA3LjctNS4yIDEwLjEgMS43LjMgMy43LjQgNS4xLS4xIDEuMS0yLjkgMS44LTYuMiAyLjEtOS4yLjUgMy42LS4yIDYuNy0uNyA5LjdsMi4yLS4yYy41LTIuOC0uMS02LS4zLTguNyAxIDMuMSAxLjEgNi4zIDEgOC44bDIuMS0uMmMtLjctMy41LTEuNy02LjYtMi4xLTkuOVoiLz4KICAgIDxwYXRoIGQ9Ik0xNy43IDUzLjRjMS44LjUgMy44LjcgNS43LjIgNy4zLTEuNCAxMy44LTUuNSAxOC44LTEwLjJsLTEuNyAxNS4yYy0uMyAzLjEtNC42IDQuNC0xMS4xIDQuNC02LjMgMC0xMC42LTEuNS0xMS00LjFaIi8+CiAgICA8cGF0aCBkPSJNMTUuNyA0MC4zYzcuNSAyLjkgMTYuNyAzLjIgMjMuNi43LTMuNiA0LjQtOCA3LjEtMTMuMyA4LjUtMS44LS45LTMuMy0yLjItNS4zLTIuNmwtMy42LS43WiIvPgogICAgPHBhdGggZD0iTTE2LjQgNDcuOGMxLjktLjIgNC41LjMgNi4xIDEuNmwxLjEgMS40Yy0yLjkuOC01LjQuNi03LjItLjVaIi8+CiAgPC9nPgogIDxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgPHBhdGggc3Ryb2tlLXdpZHRoPSIxLjI1IiBkPSJNMjMuOCAzMC40Yy02LjUgMS4yLTkuNSAzLjItOC44IDUuMy44IDIuNSA3LjYgNC40IDE0LjcgNC41IDcuNyAwIDEzLjYtMi4zIDEzLjYtNC44IDAtMS4yLTEuMS0yLjMtMi43LTMuMiIvPgogICAgPHBhdGggc3Ryb2tlLXdpZHRoPSIxLjMiIGQ9Ik0xMi41IDM1LjFjLTEuMyAzLjQgNi42IDYuNyAxNi4yIDYuOSA4LjYuMSAxNS45LTIuMyAxNS45LTYgMC0xLjEtLjctMi4xLTItMi45Ii8+CiAgICA8cGF0aCBzdHJva2Utd2lkdGg9IjEuMzUiIGQ9Ik0xMy4yIDM4LjFjLS45IDMuNC0uNiA3IDEgOS4zTTE1LjkgNTAuOWM2LjMgMy4zIDE1LjYtLjEgMjQtNy45IDEuNy0xLjYgMy4xLTMuMSAzLjctNC42Ii8+CiAgICA8cGF0aCBzdHJva2Utd2lkdGg9IjEuMSIgZD0iTTE1LjEgMzkuMmMtLjQgMy4xLS4xIDUuNyAxIDcuM00yNC42IDUwLjhjNy40LTIuMyAxMi45LTYuNSAxNS43LTExLjUiLz4KICA8L2c+Cjwvc3ZnPg==
// @icon64       data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgY29sb3I9IiMxZjIzMjgiPgogIDxzdHlsZT46cm9vdHtjb2xvcjojMWYyMzI4fUBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXs6cm9vdHtjb2xvcjojZjBmNmZjfX08L3N0eWxlPgogIDxnIGZpbGw9ImN1cnJlbnRDb2xvciI+CiAgICA8cGF0aCBkPSJNNDYuMyAxLjFhMS42IDEuNiAwIDAgMSAyLjkgMS4zbC05LjYgMTktMi44LTEuM1oiLz4KICAgIDxwYXRoIGQ9Im0zNS43IDIxIDQuMyAxLjktMS4xIDMuMS00LjctMS45WiIvPgogICAgPHBhdGggZD0iTTMzLjEgMjUuNmMtMi42IDEuMi00LjMgNC02LjggNi4zLTIuMiAyLjEtNC4zIDMuMS02LjIgMy40IDQuOC42IDguNy01LjEgMTIuNi04LjEtMyA0LjUtNS43IDgtMTAuMyA5LjIgMi4yLjQgMy41LjYgNS4yLjIgMy0xLjkgNS4xLTUuNyA2LjctOS40LTEgNC4yLTMuMSA3LjctNS4yIDEwLjEgMS43LjMgMy43LjQgNS4xLS4xIDEuMS0yLjkgMS44LTYuMiAyLjEtOS4yLjUgMy42LS4yIDYuNy0uNyA5LjdsMi4yLS4yYy41LTIuOC0uMS02LS4zLTguNyAxIDMuMSAxLjEgNi4zIDEgOC44bDIuMS0uMmMtLjctMy41LTEuNy02LjYtMi4xLTkuOVoiLz4KICAgIDxwYXRoIGQ9Ik0xNy43IDUzLjRjMS44LjUgMy44LjcgNS43LjIgNy4zLTEuNCAxMy44LTUuNSAxOC44LTEwLjJsLTEuNyAxNS4yYy0uMyAzLjEtNC42IDQuNC0xMS4xIDQuNC02LjMgMC0xMC42LTEuNS0xMS00LjFaIi8+CiAgICA8cGF0aCBkPSJNMTUuNyA0MC4zYzcuNSAyLjkgMTYuNyAzLjIgMjMuNi43LTMuNiA0LjQtOCA3LjEtMTMuMyA4LjUtMS44LS45LTMuMy0yLjItNS4zLTIuNmwtMy42LS43WiIvPgogICAgPHBhdGggZD0iTTE2LjQgNDcuOGMxLjktLjIgNC41LjMgNi4xIDEuNmwxLjEgMS40Yy0yLjkuOC01LjQuNi03LjItLjVaIi8+CiAgPC9nPgogIDxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgPHBhdGggc3Ryb2tlLXdpZHRoPSIxLjI1IiBkPSJNMjMuOCAzMC40Yy02LjUgMS4yLTkuNSAzLjItOC44IDUuMy44IDIuNSA3LjYgNC40IDE0LjcgNC41IDcuNyAwIDEzLjYtMi4zIDEzLjYtNC44IDAtMS4yLTEuMS0yLjMtMi43LTMuMiIvPgogICAgPHBhdGggc3Ryb2tlLXdpZHRoPSIxLjMiIGQ9Ik0xMi41IDM1LjFjLTEuMyAzLjQgNi42IDYuNyAxNi4yIDYuOSA4LjYuMSAxNS45LTIuMyAxNS45LTYgMC0xLjEtLjctMi4xLTItMi45Ii8+CiAgICA8cGF0aCBzdHJva2Utd2lkdGg9IjEuMzUiIGQ9Ik0xMy4yIDM4LjFjLS45IDMuNC0uNiA3IDEgOS4zTTE1LjkgNTAuOWM2LjMgMy4zIDE1LjYtLjEgMjQtNy45IDEuNy0xLjYgMy4xLTMuMSAzLjctNC42Ii8+CiAgICA8cGF0aCBzdHJva2Utd2lkdGg9IjEuMSIgZD0iTTE1LjEgMzkuMmMtLjQgMy4xLS4xIDUuNyAxIDcuM00yNC42IDUwLjhjNy40LTIuMyAxMi45LTYuNSAxNS43LTExLjUiLz4KICA8L2c+Cjwvc3ZnPg==
// @run-at       document-start
// ==/UserScript==

"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/i18n/locales/en.ts
  var catalog;
  var init_en = __esm({
    "src/i18n/locales/en.ts"() {
      "use strict";
      catalog = {
        DLG_REGEX_ERROR: "{field}, line {line}: invalid regular expression for {feed}. Correct it or turn off regex matching for that feed.",
        DLG_REGEX_IMPORT_ERROR: "Import rejected. Your current settings were kept.",
        DLG_REGEX_SAVED_ERROR: "An invalid saved regular expression was ignored. Other filters remain active.",
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
        NF_SPONSORED_PAID: "Sponsored · Paid for by ______",
        NF_SUGGESTIONS: "Suggestions / Recommendations",
        NF_FOLLOW: "Follow",
        NF_PARTICIPATE: "Participate / Join",
        NF_REELS_SHORT_VIDEOS: "Reels and short videos",
        NF_SHORT_REEL_VIDEO: "Reel/short video",
        NF_META_AI: "Try Meta AI",
        NF_META_AI_PROMPTS: "Meta AI prompt suggestions",
        NF_AI_INFO_POSTS: 'Posts labeled "AI info"',
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
        DLG_OTHER_DESC: "Hide extra boxes you don’t want.",
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
        DLG_TIPS_THREADS: "If you use Threads on desktop too, I maintain a filter for that as well: {threads}.",
        DLG_TIPS_FACEBOOK: "Come say hi on {facebook} page - I share my art and poetry there.",
        DLG_TIPS_SITE: "If you want to see what I'm up to around the web, {site} is the best place to start.",
        DLG_TIPS_CREDITS: "Special thanks to {zbluebugz} for the original project, and to {trinhquocviet} for helping maintain filters in 2025.",
        DLG_TIPS_MAINTAINER: "I hope this script helps you reclaim your feed. I promise to be your ally in the fight against stuff you don't want to see online.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "my Facebook",
        DLG_TIPS_LINK_SITE: "my website",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Save", "Close", "Export", "Import", "Reset"],
        DLG_BUTTON_TOOLTIPS: [
          "Save changes to this browser. Clearing site data/private mode removes them.",
          "Export a backup file to keep settings safe and move between devices.",
          "Import a settings file to restore or move your setup.",
          "Reset all settings to defaults."
        ],
        DLG_FB_COLOUR_HINT: "Leave blank to use FB's colour scheme"
      };
    }
  });

  // src/i18n/locales/ar.ts
  var catalog2;
  var init_ar = __esm({
    "src/i18n/locales/ar.ts"() {
      "use strict";
      catalog2 = {
        DLG_REGEX_ERROR: "{field}، السطر {line}: تعبير نمطي غير صالح لـ {feed}. صحّحه أو عطّل المطابقة بالتعابير النمطية لهذه الخلاصة.",
        DLG_REGEX_IMPORT_ERROR: "تم رفض الاستيراد. احتُفظ بإعداداتك الحالية.",
        DLG_REGEX_SAVED_ERROR: "تم تجاهل تعبير نمطي محفوظ غير صالح. تظل عوامل التصفية الأخرى نشطة.",
        LANGUAGE_DIRECTION: "rtl",
        SPONSORED: "مُموَّل",
        NF_TABLIST_STORIES_REELS_ROOMS: '"القصص | ريلز | الغرف" مربع قائمة علامات تبويب',
        NF_STORIES: "القصص",
        NF_TOP_CARDS_PAGES: "بطاقات في الأعلى (للصفحات)",
        NF_META_AI: "جرّب Meta AI",
        NF_META_AI_PROMPTS: "اقتراحات مطالبات Meta AI",
        NF_AI_INFO_POSTS: 'منشورات تحمل تسمية "AI info"',
        NF_HIDE_VERIFIED_BADGE: "إخفاء الشارات الموثقة",
        NF_FILTER_VERIFIED_BADGE: "تصفية الحسابات الموثقة",
        NF_AI_SIDE_PANELS: "الذكاء الاصطناعي في اللوحات الجانبية",
        NF_SURVEY: "استبيان",
        NF_PEOPLE_YOU_MAY_KNOW: "أشخاص قد تعرفهم",
        NF_PAID_PARTNERSHIP: "شراكة مدفوعة",
        NF_SPONSORED_PAID: "برعاية · مدفوعة بواسطة ______",
        NF_SUGGESTIONS: "الاقتراحات / التوصيات",
        NF_FOLLOW: "تابع",
        NF_PARTICIPATE: "المشاركة",
        NF_REELS_SHORT_VIDEOS: "ريلز ومقاطع الفيديو القصيرة",
        NF_SHORT_REEL_VIDEO: "بكرة / فيديو قصير",
        NF_EVENTS_YOU_MAY_LIKE: "أحداث قد تعجبك",
        NF_ANIMATED_GIFS_POSTS: "صور GIF المتحركة",
        NF_ANIMATED_GIFS_PAUSE: "وقفة ملفات GIF المتحركة",
        NF_SHARES: "# مشاركات",
        NF_LIKES_MAXIMUM: "الحد الأقصى لعدد الإعجابات",
        GF_PAID_PARTNERSHIP: "شراكة مدفوعة",
        GF_SUGGESTIONS: "الاقتراحات / التوصيات",
        GF_SHORT_REEL_VIDEO: "بكرة / فيديو قصير",
        GF_ANIMATED_GIFS_POSTS: "صور GIF المتحركة",
        GF_ANIMATED_GIFS_PAUSE: "وقفة ملفات GIF المتحركة",
        GF_SHARES: "# مشاركات",
        VF_LIVE: "مباشر",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "فيديو مكرر",
        VF_ANIMATED_GIFS_PAUSE: "وقفة ملفات GIF المتحركة",
        PP_ANIMATED_GIFS_POSTS: "صور GIF المتحركة",
        PP_ANIMATED_GIFS_PAUSE: "وقفة ملفات GIF المتحركة",
        NF_BLOCKED_FEED: ["موجز الأخبار", "تغذية المجموعات", "تغذية الفيديو"],
        GF_BLOCKED_FEED: ["موجز الأخبار", "تغذية المجموعات", "تغذية الفيديو"],
        VF_BLOCKED_FEED: ["موجز الأخبار", "تغذية المجموعات", "تغذية الفيديو"],
        MP_BLOCKED_FEED: ["السوق تغذية"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "فيروس كورونا (صندوق المعلومات)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "علوم المناخ (صندوق المعلومات)",
        OTHER_INFO_BOX_SUBSCRIBE: "(صندوق المعلومات) الاشتراك",
        REELS_TITLE: "ريلز",
        DLG_REELS_DESC: "عناصر التحكم في التشغيل والتكرار.",
        REELS_CONTROLS: "عرض أدوات التحكم في الفيديو",
        REELS_DISABLE_LOOPING: "تعطيل التكرار",
        DLG_TITLE: "تنظيف خلاصاتي",
        DLG_NF: "الأخبار تغذية",
        DLG_NF_DESC: "تنظيف الاقتراحات وتحديد مدى صرامة الخلاصة.",
        DLG_GF: "مجموعات تغذية",
        DLG_GF_DESC: "تنظيف خلاصات المجموعات بإزالة الزوائد والضجيج.",
        DLG_VF: "الفيديو تغذية",
        DLG_VF_DESC: "اجعل خلاصة الفيديو أكثر تركيزًا بتقليل التكرار والازدحام.",
        DLG_MP: "السوق تغذية",
        DLG_MP_DESC: "تصفية القوائم حسب السعر والكلمات التي تهمك.",
        DLG_PP: "الملف الشخصي / الصفحة",
        DLG_PP_DESC: "اضبط ما يظهر في الملفات الشخصية والصفحات.",
        DLG_OTHER: "ملاحظات إضافية",
        DLG_OTHER_DESC: "إخفاء الصناديق الإضافية التي لا تريدها.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "مرشح النص",
        DLG_BLOCK_NEW_LINE: "(افصل الكلمات أو العبارات بفاصل سطر، يتم دعم التعبيرات العادية)",
        NF_BLOCKED_ENABLED: "تمكين",
        GF_BLOCKED_ENABLED: "تمكين",
        VF_BLOCKED_ENABLED: "تمكين",
        MP_BLOCKED_ENABLED: "تمكين",
        PP_BLOCKED_ENABLED: "تمكين",
        NF_BLOCKED_RE: "التعبيرات العادية (RegExp)",
        GF_BLOCKED_RE: "التعبيرات العادية (RegExp)",
        VF_BLOCKED_RE: "التعبيرات العادية (RegExp)",
        MP_BLOCKED_RE: "التعبيرات العادية (RegExp)",
        PP_BLOCKED_RE: "التعبيرات العادية (RegExp)",
        DLG_VERBOSITY: "خيارات المشاركات المخفية",
        DLG_PREFERENCES: "التفضيلات",
        DLG_PREFERENCES_DESC: "التسميات، الموضع، الألوان، واللغة.",
        DLG_REPORT_BUG: "الإبلاغ عن خطأ",
        DLG_REPORT_BUG_DESC: "أنشئ تقريرًا تشخيصيًا للمشكلات.",
        DLG_REPORT_BUG_NOTICE: "ساعدنا في الإصلاح:\n1. مرر الشاشة حتى يظهر المنشور الذي به مشكلة.\n2. انقر على 'إنشاء التقرير' ثم 'نسخ التقرير'.\n3. انقر على 'فتح البلاغات' والصق التقرير في مشكلة جديدة.\n4. أضف وصفًا موجزًا للمشكلة.\n(نقوم بحجب الأسماء/النصوص، لكن يرجى المراجعة قبل المشاركة!)",
        DLG_REPORT_BUG_GENERATE: "إنشاء التقرير",
        DLG_REPORT_BUG_COPY: "نسخ التقرير",
        DLG_REPORT_BUG_OPEN_ISSUES: "فتح البلاغات",
        DLG_REPORT_BUG_STATUS_READY: "التقرير جاهز.",
        DLG_REPORT_BUG_STATUS_COPIED: "تم نسخ التقرير.",
        DLG_REPORT_BUG_STATUS_FAILED: "فشل النسخ. انسخ يدويًا.",
        DLG_VERBOSITY_CAPTION: "إظهار إشعار بعرض المقالات المخفية",
        VERBOSITY_MESSAGE: [
          "لا تسمية",
          "مشاركة واحدة مخفية. حكم: ",
          " المشاركات المخفية",
          "7 مشاركات مخفية ~ (فقط في تغذية المجموعات)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "لون النص",
        VERBOSITY_MESSAGE_BG_COLOUR: "لون الخلفية",
        VERBOSITY_DEBUG: 'تسليط الضوء على المشاركات "المخفية"',
        CMF_CUSTOMISATIONS: "التخصيصات",
        CMF_BTN_LOCATION: "موقع زر CMF:",
        CMF_BTN_OPTION: [
          "أسفل اليسار",
          "أعلى اليمين",
          'معطل (استخدم "الإعدادات" في قائمة أوامر البرنامج النصي للمستخدم)'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "لغة Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "العربية",
        CMF_DIALOG_LANGUAGE_DEFAULT: "استخدم لغة الموقع",
        GM_MENU_SETTINGS: "الإعدادات",
        CMF_DIALOG_LOCATION: "موقع هذه القائمة:",
        CMF_DIALOG_OPTION: ["الجهه اليسرى", "الجانب الصحيح"],
        CMF_BORDER_COLOUR: "لون الحدود",
        DLG_TIPS: "حول",
        DLG_TIPS_DESC: "روابط المشروع ومعلومات المشرف.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "إذا كان هذا مفيدًا، فإن نجمة على {github} تعني الكثير.",
        DLG_TIPS_THREADS: "إذا كنت تستخدم Threads على سطح المكتب أيضًا، فأنا أُدير أداة تصفية له أيضًا: {threads}.",
        DLG_TIPS_FACEBOOK: "قل مرحبًا على {facebook} - أشارك هناك أعمالي الفنية وشعري.",
        DLG_TIPS_SITE: "إذا أردت معرفة ما أفعله على الويب، فـ{site} هو أفضل مكان للبدء.",
        DLG_TIPS_CREDITS: "شكر خاص لـ {zbluebugz} على المشروع الأصلي، ولـ {trinhquocviet} على المساعدة في صيانة الفلاتر في عام 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "من المُشرف:",
        DLG_TIPS_MAINTAINER: "آمل أن يساعدك هذا السكربت على استعادة تغذيتك. أعدك أن أكون حليفك في مواجهة الأشياء التي لا تريد رؤيتها على الإنترنت.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "صفحتي على فيسبوك",
        DLG_TIPS_LINK_SITE: "موقعي",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["حفظ", "قريب", "يصدّر", "يستورد", "إعادة تعيين"],
        DLG_BUTTON_TOOLTIPS: [
          "احفظ التغييرات في هذا المتصفح. مسح بيانات الموقع/التصفح الخاص يزيلها.",
          "صدّر ملفًا احتياطيًا لحفظ الإعدادات ونقلها بين الأجهزة.",
          "استورد ملف إعدادات لاستعادة أو نقل إعداداتك.",
          "أعد ضبط جميع الإعدادات إلى الافتراضي."
        ],
        DLG_FB_COLOUR_HINT: "اتركه فارغًا لاستخدام نظام ألوان FB"
      };
    }
  });

  // src/i18n/locales/bg.ts
  var catalog3;
  var init_bg = __esm({
    "src/i18n/locales/bg.ts"() {
      "use strict";
      catalog3 = {
        DLG_REGEX_ERROR: "{field}, ред {line}: невалиден регулярен израз за {feed}. Поправете го или изключете съпоставянето с регулярни изрази за тази емисия.",
        DLG_REGEX_IMPORT_ERROR: "Импортирането е отказано. Текущите ви настройки са запазени.",
        DLG_REGEX_SAVED_ERROR: "Невалиден запазен регулярен израз беше пренебрегнат. Останалите филтри остават активни.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Спонсорирано",
        NF_TABLIST_STORIES_REELS_ROOMS: "Списъчно поле на раздела „Истории | Макари | Стаи“",
        NF_STORIES: "Истории",
        NF_TOP_CARDS_PAGES: "Горни карти (за страници)",
        NF_META_AI: "Опитай Meta AI",
        NF_META_AI_PROMPTS: "Подсказки на Meta AI",
        NF_AI_INFO_POSTS: "Публикации с етикет „AI info“",
        NF_HIDE_VERIFIED_BADGE: "Скриване на потвърдени значки",
        NF_FILTER_VERIFIED_BADGE: "Филтриране на потвърдени акаунти",
        NF_AI_SIDE_PANELS: "AI в страничните панели",
        NF_SURVEY: "Анкета",
        NF_PEOPLE_YOU_MAY_KNOW: "Хора, които може би познавате",
        NF_PAID_PARTNERSHIP: "Платено партньорство",
        NF_SPONSORED_PAID: "Спонсорирано · Платено от ______",
        NF_SUGGESTIONS: "Предложения / Препоръки",
        NF_FOLLOW: "Следвай",
        NF_PARTICIPATE: "Участвай",
        NF_REELS_SHORT_VIDEOS: "Ленти и кратки видеоклипове",
        NF_SHORT_REEL_VIDEO: "Рил/късо видео",
        NF_EVENTS_YOU_MAY_LIKE: "Събития, които може да ви харесат",
        NF_ANIMATED_GIFS_POSTS: "Анимирани GIF файлове",
        NF_ANIMATED_GIFS_PAUSE: "Пауза на анимирани GIF файлове",
        NF_SHARES: "# споделяния",
        NF_LIKES_MAXIMUM: "Максимален брой Харесвания",
        GF_PAID_PARTNERSHIP: "Платено партньорство",
        GF_SUGGESTIONS: "Предложения / Препоръки",
        GF_SHORT_REEL_VIDEO: "Рил/късо видео",
        GF_ANIMATED_GIFS_POSTS: "Анимирани GIF файлове",
        GF_ANIMATED_GIFS_PAUSE: "Пауза на анимирани GIF файлове",
        GF_SHARES: "# споделяния",
        VF_LIVE: "НА ЖИВО",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Дублирано видео",
        VF_ANIMATED_GIFS_PAUSE: "Пауза на анимирани GIF файлове",
        PP_ANIMATED_GIFS_POSTS: "Анимирани GIF файлове",
        PP_ANIMATED_GIFS_PAUSE: "Пауза на анимирани GIF файлове",
        NF_BLOCKED_FEED: ["Новинарски поток", "Поток с групи", "Поток с видеа"],
        GF_BLOCKED_FEED: ["Новинарски поток", "Поток с групи", "Поток с видеа"],
        VF_BLOCKED_FEED: ["Новинарски поток", "Поток с групи", "Поток с видеа"],
        MP_BLOCKED_FEED: ["Поток с Marketplace"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Коронавирус (информационна кутия)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Наука за климата (информационна кутия)",
        OTHER_INFO_BOX_SUBSCRIBE: "Абонирай се (информационна кутия)",
        REELS_TITLE: "Ленти",
        DLG_REELS_DESC: "Контроли за възпроизвеждане и цикличност.",
        REELS_CONTROLS: "Покажи контроли на видеото",
        REELS_DISABLE_LOOPING: "Изключване на повторението",
        DLG_TITLE: "Почисти моите емисии",
        DLG_NF: "Новинарски поток",
        DLG_NF_DESC: "Почистете предложенията и задайте колко стриктен да е потокът.",
        DLG_GF: "Поток с групи",
        DLG_GF_DESC: "Подредете потоците в групите, като махнете излишното и шума.",
        DLG_VF: "Поток с видеа",
        DLG_VF_DESC: "Фокусирайте видеопотока, като намалите повторенията и шума.",
        DLG_MP: "Поток с Marketplace",
        DLG_MP_DESC: "Филтрирайте обяви по цена и ключови думи.",
        DLG_PP: "Профил / Страница",
        DLG_PP_DESC: "Настройте какво се показва в профили и страници.",
        DLG_OTHER: "Допълнителни бележки",
        DLG_OTHER_DESC: "Скрийте допълнителните полета, които не искате.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Текстов филтър",
        DLG_BLOCK_NEW_LINE: "(Разделете думите или фразите с нов ред, регулярните изрази са поддържани)",
        NF_BLOCKED_ENABLED: "Активирано",
        GF_BLOCKED_ENABLED: "Активирано",
        VF_BLOCKED_ENABLED: "Активирано",
        MP_BLOCKED_ENABLED: "Активирано",
        PP_BLOCKED_ENABLED: "Активирано",
        NF_BLOCKED_RE: "Регулярни изрази (RegExp)",
        GF_BLOCKED_RE: "Регулярни изрази (RegExp)",
        VF_BLOCKED_RE: "Регулярни изрази (RegExp)",
        MP_BLOCKED_RE: "Регулярни изрази (RegExp)",
        PP_BLOCKED_RE: "Регулярни изрази (RegExp)",
        DLG_VERBOSITY: "Опции за скрити публикации",
        DLG_PREFERENCES: "Предпочитания",
        DLG_PREFERENCES_DESC: "Етикети, позиция, цветове и език.",
        DLG_REPORT_BUG: "Съобщи за бъг",
        DLG_REPORT_BUG_DESC: "Създай диагностичен отчет за проблеми.",
        DLG_REPORT_BUG_NOTICE: "Помогнете ни да го поправим:\n1. Превъртете, така че проблемният пост да е видим.\n2. Кликнете 'Създай отчет', след това 'Копирай отчета'.\n3. Кликнете 'Отвори проблемите' и поставете отчета в нов проблем.\n4. Добавете кратко описание на проблема.\n(Ние скриваме имената/текста, но моля прегледайте преди споделяне!)",
        DLG_REPORT_BUG_GENERATE: "Създай отчет",
        DLG_REPORT_BUG_COPY: "Копирай отчета",
        DLG_REPORT_BUG_OPEN_ISSUES: "Отвори проблемите",
        DLG_REPORT_BUG_STATUS_READY: "Отчетът е готов.",
        DLG_REPORT_BUG_STATUS_COPIED: "Отчетът е копиран.",
        DLG_REPORT_BUG_STATUS_FAILED: "Копирането не успя. Копирай ръчно.",
        DLG_VERBOSITY_CAPTION: "Показване на етикет, ако публикацията е скрита",
        VERBOSITY_MESSAGE: [
          "няма етикет",
          "Скрита публикация. Правило: ",
          " скрити публикации",
          "7 скрити публикации ~ (само за Груповия поток)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Цвят на текста",
        VERBOSITY_MESSAGE_BG_COLOUR: "Цвят на фона",
        VERBOSITY_DEBUG: "Открояване на скритите публикации",
        CMF_CUSTOMISATIONS: "Настройки",
        CMF_BTN_LOCATION: "Местоположение на бутона CMF:",
        CMF_BTN_OPTION: [
          "долу вляво",
          "горе вдясно",
          'деактивирано (използвайте "Настройки" в менюто с команди за потребителски сценарии)'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Език на Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "Български",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Използване на езика на сайта",
        GM_MENU_SETTINGS: "Настройки",
        CMF_DIALOG_LOCATION: "Местоположение на това меню:",
        CMF_DIALOG_OPTION: ["лява страна", "дясна страна"],
        CMF_BORDER_COLOUR: "Цвят на рамката",
        DLG_TIPS: "За проекта",
        DLG_TIPS_DESC: "Линкове към проекта и информация за поддръжника.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Ако това помага, една звезда в {github} значи много.",
        DLG_TIPS_THREADS: "Ако ползваш Threads и на настолен компютър, поддържам филтър и за него: {threads}.",
        DLG_TIPS_FACEBOOK: "Кажи здрасти на {facebook} - там споделям изкуство и поезия.",
        DLG_TIPS_SITE: "Ако искаш да видиш какво правя из мрежата, {site} е най-доброто място да започнеш.",
        DLG_TIPS_CREDITS: "Специални благодарности на {zbluebugz} за оригиналния проект и на {trinhquocviet} за помощта с поддръжката на филтрите през 2025 г.",
        DLG_TIPS_MAINTAINER_PREFIX: "От поддръжника:",
        DLG_TIPS_MAINTAINER: "Надявам се този скрипт да ти помогне да си върнеш емисията. Обещавам да бъда твой съюзник в битката срещу нещата, които не искаш да виждаш онлайн.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "моя Facebook страница",
        DLG_TIPS_LINK_SITE: "моят сайт",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Запази", "Затвори", "Експорт", "Импорт", "Нулиране"],
        DLG_BUTTON_TOOLTIPS: [
          "Запазва промените в този браузър. Изчистване на данни/инкогнито ги премахва.",
          "Експортира резервен файл за запазване и прехвърляне между устройства.",
          "Импортира файл с настройки за възстановяване или прехвърляне.",
          "Нулира всички настройки до подразбиране."
        ],
        DLG_FB_COLOUR_HINT: "Оставете празно, за да използвате цветовата схема на FB"
      };
    }
  });

  // src/i18n/locales/cs.ts
  var catalog4;
  var init_cs = __esm({
    "src/i18n/locales/cs.ts"() {
      "use strict";
      catalog4 = {
        DLG_REGEX_ERROR: "{field}, řádek {line}: neplatný regulární výraz pro {feed}. Opravte jej nebo pro tento kanál vypněte porovnávání pomocí regulárních výrazů.",
        DLG_REGEX_IMPORT_ERROR: "Import byl odmítnut. Vaše současná nastavení zůstala zachována.",
        DLG_REGEX_SAVED_ERROR: "Neplatný uložený regulární výraz byl vynechán. Ostatní filtry zůstávají aktivní.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Sponzorováno",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Seznam karet "Stories | Reels | Místnosti"',
        NF_STORIES: "Stories",
        NF_TOP_CARDS_PAGES: "Horní karty (pro stránky)",
        NF_META_AI: "Vyzkoušejte Meta AI",
        NF_META_AI_PROMPTS: "Návrhy promptů Meta AI",
        NF_AI_INFO_POSTS: "Příspěvky označené „AI info“",
        NF_HIDE_VERIFIED_BADGE: "Skrýt ověřené odznaky",
        NF_FILTER_VERIFIED_BADGE: "Filtrovat ověřené účty",
        NF_AI_SIDE_PANELS: "AI v postranních panelech",
        NF_SURVEY: "Průzkum",
        NF_PEOPLE_YOU_MAY_KNOW: "Koho možná znáte",
        NF_PAID_PARTNERSHIP: "Placené partnerství",
        NF_SPONSORED_PAID: "Sponzorováno · Platí za to ______",
        NF_SUGGESTIONS: "Návrhy / Doporučení",
        NF_FOLLOW: "Sledovat",
        NF_PARTICIPATE: "Participovat",
        NF_REELS_SHORT_VIDEOS: "Sekvence a krátká videa",
        NF_SHORT_REEL_VIDEO: "Naviják/krátké video",
        NF_EVENTS_YOU_MAY_LIKE: "Události, které se vám mohou líbit",
        NF_ANIMATED_GIFS_POSTS: "Animované GIFy",
        NF_ANIMATED_GIFS_PAUSE: "Pozastavit animované GIFy",
        NF_SHARES: "# sdílení",
        NF_LIKES_MAXIMUM: "Maximální počet hodnocení Líbí se mi",
        GF_PAID_PARTNERSHIP: "Placené partnerství",
        GF_SUGGESTIONS: "Návrhy / Doporučení",
        GF_SHORT_REEL_VIDEO: "Naviják/krátké video",
        GF_ANIMATED_GIFS_POSTS: "Animované GIFy",
        GF_ANIMATED_GIFS_PAUSE: "Pozastavit animované GIFy",
        GF_SHARES: "# sdílení",
        VF_LIVE: "ŽIVĚ",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Duplikované video",
        VF_ANIMATED_GIFS_PAUSE: "Pozastavit animované GIFy",
        PP_ANIMATED_GIFS_POSTS: "Animované GIFy",
        PP_ANIMATED_GIFS_PAUSE: "Pozastavit animované GIFy",
        NF_BLOCKED_FEED: ["Informační kanál", "Skupinový kanál", "Video kanál"],
        GF_BLOCKED_FEED: ["Informační kanál", "Skupinový kanál", "Video kanál"],
        VF_BLOCKED_FEED: ["Informační kanál", "Skupinový kanál", "Video kanál"],
        MP_BLOCKED_FEED: ["Marketplace kanál"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Coronavirus (informační box)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Klimatická věda (informační box)",
        OTHER_INFO_BOX_SUBSCRIBE: "Odebírat (informační box)",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "Ovládání přehrávání a opakování.",
        REELS_CONTROLS: "Zobrazit ovládání videa",
        REELS_DISABLE_LOOPING: "Vypnout smyčení",
        DLG_TITLE: "Vyčistěte mé kanály",
        DLG_NF: "Informační kanál",
        DLG_NF_DESC: "Vyčistěte návrhy a nastavte, jak přísný má být feed.",
        DLG_GF: "Skupinový kanál",
        DLG_GF_DESC: "Upravte skupinové feedy odstraněním balastu a šumu.",
        DLG_VF: "Video kanál",
        DLG_VF_DESC: "Udržte video feed přehledný omezením opakování a nepořádku.",
        DLG_MP: "Marketplace kanál",
        DLG_MP_DESC: "Filtrujte nabídky podle ceny a klíčových slov.",
        DLG_PP: "Profil / Stránka",
        DLG_PP_DESC: "Upravte, co se zobrazuje na profilech a stránkách.",
        DLG_OTHER: "Doplňkové poznámky",
        DLG_OTHER_DESC: "Skryjte extra boxy, které nechcete.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Textový filtr",
        DLG_BLOCK_NEW_LINE: "(Oddělte slova nebo fráze pomocí nového řádku, regulární výrazy jsou podporovány)",
        NF_BLOCKED_ENABLED: "Zapnuto",
        GF_BLOCKED_ENABLED: "Zapnuto",
        VF_BLOCKED_ENABLED: "Zapnuto",
        MP_BLOCKED_ENABLED: "Zapnuto",
        PP_BLOCKED_ENABLED: "Zapnuto",
        NF_BLOCKED_RE: "Reguläre Ausdrücke (RegExp)",
        GF_BLOCKED_RE: "Reguläre Ausdrücke (RegExp)",
        VF_BLOCKED_RE: "Reguläre Ausdrücke (RegExp)",
        MP_BLOCKED_RE: "Reguläre Ausdrücke (RegExp)",
        PP_BLOCKED_RE: "Reguläre Ausdrücke (RegExp)",
        DLG_VERBOSITY: "Možnosti skrytých příspěvků",
        DLG_PREFERENCES: "Předvolby",
        DLG_PREFERENCES_DESC: "Štítky, umístění, barvy a jazyk.",
        DLG_REPORT_BUG: "Nahlásit chybu",
        DLG_REPORT_BUG_DESC: "Vytvoř diagnostickou zprávu k problému.",
        DLG_REPORT_BUG_NOTICE: "Pomozte nám to opravit:\n1. Posuňte zobrazení tak, aby byl problémový příspěvek viditelný.\n2. Klikněte na 'Vytvořit zprávu' a poté na 'Kopírovat zprávu'.\n3. Klikněte na 'Otevřít hlášení' a vložte zprávu do nového hlášení.\n4. Přidejte stručný popis problému.\n(Jména/text redigujeme, ale před sdílením zkontrolujte!)",
        DLG_REPORT_BUG_GENERATE: "Vytvořit zprávu",
        DLG_REPORT_BUG_COPY: "Kopírovat zprávu",
        DLG_REPORT_BUG_OPEN_ISSUES: "Otevřít hlášení",
        DLG_REPORT_BUG_STATUS_READY: "Zpráva je připravena.",
        DLG_REPORT_BUG_STATUS_COPIED: "Zpráva zkopírována.",
        DLG_REPORT_BUG_STATUS_FAILED: "Kopírování se nezdařilo. Zkopíruj ručně.",
        DLG_VERBOSITY_CAPTION: "Zobrazit popisek, pokud je příspěvek skrytý",
        VERBOSITY_MESSAGE: [
          "žádný popisek",
          "Příspěvek byl skryt. Pravidlo: ",
          " příspěvků skrytých",
          "7 příspěvků skrytých ~ (pouze ve skupinovém zpravodaji)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Barva textu",
        VERBOSITY_MESSAGE_BG_COLOUR: "Barva pozadí",
        VERBOSITY_DEBUG: "Zvýrazněte „skryté“ příspěvky",
        CMF_CUSTOMISATIONS: "Přizpůsobení",
        CMF_BTN_LOCATION: "Umístění tlačítka CMF:",
        CMF_BTN_OPTION: [
          "vlevo dole",
          "vpravo nahoře",
          'zakázáno (použijte "Nastavení" v nabídce Příkazy uživatelského skriptu)'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Jazyk Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "Čeština",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Použít jazyk webu",
        GM_MENU_SETTINGS: "Nastavení",
        CMF_DIALOG_LOCATION: "Umístění tohoto menu:",
        CMF_DIALOG_OPTION: ["levá strana", "pravá strana"],
        CMF_BORDER_COLOUR: "Barva ohraničení",
        DLG_TIPS: "O projektu",
        DLG_TIPS_DESC: "Odkazy na projekt a informace o správci.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Pokud to pomáhá, hvězda na {github} pro mě hodně znamená.",
        DLG_TIPS_THREADS: "Pokud používáš Threads i na počítači, spravuji pro něj také filtr: {threads}.",
        DLG_TIPS_FACEBOOK: "Pozdrav na {facebook} - sdílím tam své umění a poezii.",
        DLG_TIPS_SITE: "Chceš-li vidět, co dělám na webu, {site} je nejlepší start.",
        DLG_TIPS_CREDITS: "Speciální poděkování {zbluebugz} za původní projekt a {trinhquocviet} za pomoc s údržbou filtrů v roce 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "Od správce:",
        DLG_TIPS_MAINTAINER: "Doufám, že vám tento skript pomůže získat zpět váš feed. Slibuji, že budu vaším spojencem v boji proti věcem, které nechcete vidět online.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "můj Facebook",
        DLG_TIPS_LINK_SITE: "můj web",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Uložit", "Zavřít", "Export", "Import", "Resetovat"],
        DLG_BUTTON_TOOLTIPS: [
          "Uloží změny v tomto prohlížeči. Smazání dat/inkognito je odstraní.",
          "Exportuje záložní soubor pro uchování a přenos mezi zařízeními.",
          "Importuje soubor s nastavením pro obnovení nebo přenos.",
          "Obnoví všechna nastavení na výchozí."
        ],
        DLG_FB_COLOUR_HINT: "Chcete-li použít barevné schéma FB, nechte prázdné"
      };
    }
  });

  // src/i18n/locales/de.ts
  var catalog5;
  var init_de = __esm({
    "src/i18n/locales/de.ts"() {
      "use strict";
      catalog5 = {
        DLG_REGEX_ERROR: "{field}, Zeile {line}: ungültiger regulärer Ausdruck für {feed}. Korrigiere ihn oder deaktiviere reguläre Ausdrücke für diesen Feed.",
        DLG_REGEX_IMPORT_ERROR: "Import abgelehnt. Deine bisherigen Einstellungen bleiben erhalten.",
        DLG_REGEX_SAVED_ERROR: "Ein ungültiger gespeicherter regulärer Ausdruck wurde übersprungen. Andere Filter bleiben aktiv.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Gesponsert",
        SPONSORED_EXTRA: "Anzeige",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Listenfeld der Registerkarte "Stories | Reels | Rooms"',
        NF_STORIES: "Stories",
        NF_TOP_CARDS_PAGES: "Top-Karten (für Seiten)",
        NF_META_AI: "Meta AI ausprobieren",
        NF_META_AI_PROMPTS: "Meta AI Prompt-Vorschläge",
        NF_AI_INFO_POSTS: "Beiträge mit „AI info“-Kennzeichnung",
        NF_HIDE_VERIFIED_BADGE: "Verifizierte Abzeichen ausblenden",
        NF_FILTER_VERIFIED_BADGE: "Verifizierte Konten filtern",
        NF_AI_SIDE_PANELS: "KI in Seitenleisten",
        NF_SURVEY: "Umfrage",
        NF_PEOPLE_YOU_MAY_KNOW: "Personen, die du kennen könntest",
        NF_PAID_PARTNERSHIP: "Bezahlte Werbepartnerschaft",
        NF_SPONSORED_PAID: "Gesponsert · Finanziert von ______",
        NF_SUGGESTIONS: "Vorschläge / Empfehlungen",
        NF_FOLLOW: "Folgen",
        NF_PARTICIPATE: "Teilnehmen",
        NF_REELS_SHORT_VIDEOS: "Reels und Kurzvideos",
        NF_SHORT_REEL_VIDEO: "Reel/kurzes Video",
        NF_EVENTS_YOU_MAY_LIKE: "Veranstaltungen, die Ihnen gefallen könnten",
        NF_ANIMATED_GIFS_POSTS: "Animierte GIFs",
        NF_ANIMATED_GIFS_PAUSE: "Animierte GIFs pausieren",
        NF_SHARES: "# Mal geteilt",
        NF_LIKES_MAXIMUM: "Maximale Anzahl an Likes",
        GF_PAID_PARTNERSHIP: "Bezahlte Werbepartnerschaft",
        GF_SUGGESTIONS: "Vorschläge / Empfehlungen",
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
        DLG_NF_DESC: "Vorschläge aufräumen und festlegen, wie streng der Feed ist.",
        DLG_GF: "Gruppen-Feed",
        DLG_GF_DESC: "Gruppenfeeds aufräumen, Extras und Lärm reduzieren.",
        DLG_VF: "Video-Feed",
        DLG_VF_DESC: "Video-Feed fokussieren, Wiederholungen und Unordnung reduzieren.",
        DLG_MP: "Marktplatz-Feed",
        DLG_MP_DESC: "Angebote nach Preis und Schlüsselwörtern filtern.",
        DLG_PP: "Profil / Seite",
        DLG_PP_DESC: "Anpassen, was in Profilen und Seiten erscheint.",
        DLG_OTHER: "Zusätzliche Hinweise",
        DLG_OTHER_DESC: "Blenden Sie zusätzliche Kästen aus, die Sie nicht möchten.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Textfilter",
        DLG_BLOCK_NEW_LINE: "(Trennen Sie Wörter oder Phrasen mit einem Zeilenumbruch, reguläre Ausdrücke werden unterstützt)",
        NF_BLOCKED_ENABLED: "Ermöglichte",
        GF_BLOCKED_ENABLED: "Ermöglichte",
        VF_BLOCKED_ENABLED: "Ermöglichte",
        MP_BLOCKED_ENABLED: "Ermöglichte",
        PP_BLOCKED_ENABLED: "Ermöglichte",
        NF_BLOCKED_RE: "Reguläre Ausdrücke (RegExp)",
        GF_BLOCKED_RE: "Reguläre Ausdrücke (RegExp)",
        VF_BLOCKED_RE: "Reguläre Ausdrücke (RegExp)",
        MP_BLOCKED_RE: "Reguläre Ausdrücke (RegExp)",
        PP_BLOCKED_RE: "Reguläre Ausdrücke (RegExp)",
        DLG_VERBOSITY: "Optionen für ausgeblendete Beiträge",
        DLG_PREFERENCES: "Einstellungen",
        DLG_PREFERENCES_DESC: "Labels, Position, Farben und Sprache.",
        DLG_REPORT_BUG: "Fehler melden",
        DLG_REPORT_BUG_DESC: "Erstelle einen Diagnosebericht für Probleme.",
        DLG_REPORT_BUG_NOTICE: "Hilf uns, es zu beheben:\n1. Scrolle so, dass der problematische Beitrag sichtbar ist.\n2. Klicke auf 'Bericht erstellen' und dann auf 'Bericht kopieren'.\n3. Klicke auf 'Issues öffnen' und füge den Bericht in ein neues Issue ein.\n4. Füge eine kurze Beschreibung des Problems hinzu.\n(Wir schwärzen Namen/Texte, aber bitte vor dem Teilen überprüfen!)",
        DLG_REPORT_BUG_GENERATE: "Bericht erstellen",
        DLG_REPORT_BUG_COPY: "Bericht kopieren",
        DLG_REPORT_BUG_OPEN_ISSUES: "Issues öffnen",
        DLG_REPORT_BUG_STATUS_READY: "Bericht bereit.",
        DLG_REPORT_BUG_STATUS_COPIED: "Bericht in die Zwischenablage kopiert.",
        DLG_REPORT_BUG_STATUS_FAILED: "Kopieren fehlgeschlagen. Bitte manuell kopieren.",
        DLG_VERBOSITY_CAPTION: "Ein Label anzeigen, wenn ein Beitrag ausgeblendet ist",
        VERBOSITY_MESSAGE: [
          "kein Label",
          "Beitrag ausgeblendet. Regel: ",
          " Beiträge versteckt",
          "7 Beiträge versteckt ~ (nur Gruppen-Feed)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Textfarbe",
        VERBOSITY_MESSAGE_BG_COLOUR: "Hintergrundfarbe",
        VERBOSITY_DEBUG: 'Markieren Sie "versteckte" Beiträge',
        CMF_CUSTOMISATIONS: "Anpassungen",
        CMF_BTN_LOCATION: "Position der CMF-Schaltfläche:",
        CMF_BTN_OPTION: [
          "unten links",
          "oben rechts",
          'deaktiviert (verwenden Sie "Einstellungen" im Menü "Benutzerskriptbefehle")'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Sprache von Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "Deutsch",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Website-Sprache verwenden",
        GM_MENU_SETTINGS: "Einstellungen",
        CMF_DIALOG_LOCATION: "Position dieses Menüs:",
        CMF_DIALOG_OPTION: ["linke Seite", "rechte Seite"],
        CMF_BORDER_COLOUR: "Farbe der Umrandung",
        DLG_TIPS: "Info",
        DLG_TIPS_DESC: "Projektlinks und Infos zum Maintainer.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Wenn das hilft, bedeutet mir ein Stern auf {github} viel.",
        DLG_TIPS_THREADS: "Wenn du Threads auch am Desktop nutzt, pflege ich dafür ebenfalls einen Filter: {threads}.",
        DLG_TIPS_FACEBOOK: "Sag gern Hallo auf {facebook} - dort teile ich Kunst und Poesie.",
        DLG_TIPS_SITE: "Wenn du sehen willst, was ich im Netz mache, ist meine {site} der beste Start.",
        DLG_TIPS_CREDITS: "Besonderer Dank an {zbluebugz} für das ursprüngliche Projekt und an {trinhquocviet} für die Hilfe bei der Filterpflege im Jahr 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "Vom Maintainer:",
        DLG_TIPS_MAINTAINER: "Ich hoffe, dieses Skript hilft dir, deinen Feed zurückzuholen. Ich verspreche, dein Verbündeter im Kampf gegen Dinge zu sein, die du online nicht sehen willst.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "meine Facebook-Seite",
        DLG_TIPS_LINK_SITE: "meine Website",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Speichern", "Schließen", "Exportieren", "Importieren", "Zurücksetzen"],
        DLG_BUTTON_TOOLTIPS: [
          "Speichert Änderungen in diesem Browser. Löschen von Daten/Inkognito entfernt sie.",
          "Exportiert eine Sicherungsdatei zum Behalten und Übertragen.",
          "Importiert eine Einstellungsdatei zum Wiederherstellen oder Übertragen.",
          "Setzt alle Einstellungen auf Standard zurück."
        ],
        DLG_FB_COLOUR_HINT: "Leer lassen, um das Farbschema von FB zu verwenden"
      };
    }
  });

  // src/i18n/locales/el.ts
  var catalog6;
  var init_el = __esm({
    "src/i18n/locales/el.ts"() {
      "use strict";
      catalog6 = {
        DLG_REGEX_ERROR: "{field}, γραμμή {line}: μη έγκυρη κανονική έκφραση για {feed}. Διορθώστε την ή απενεργοποιήστε την αντιστοίχιση κανονικών εκφράσεων για αυτή τη ροή.",
        DLG_REGEX_IMPORT_ERROR: "Η εισαγωγή απορρίφθηκε. Οι τρέχουσες ρυθμίσεις σας διατηρήθηκαν.",
        DLG_REGEX_SAVED_ERROR: "Μια μη έγκυρη αποθηκευμένη κανονική έκφραση παραλείφθηκε. Τα υπόλοιπα φίλτρα παραμένουν ενεργά.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Χορηγούμενη",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Λίστα καρτελών "Ιστορίες | Reels | Δωμάτια"',
        NF_STORIES: "Ιστορίες",
        NF_TOP_CARDS_PAGES: "Κορυφαίες κάρτες (για Σελίδες)",
        NF_META_AI: "Δοκιμάστε το Meta AI",
        NF_META_AI_PROMPTS: "Προτάσεις prompt του Meta AI",
        NF_AI_INFO_POSTS: 'Δημοσιεύσεις με ετικέτα "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Απόκρυψη επαληθευμένων σημάτων",
        NF_FILTER_VERIFIED_BADGE: "Φιλτράρισμα επαληθευμένων λογαριασμών",
        NF_AI_SIDE_PANELS: "AI στα πλευρικά πάνελ",
        NF_SURVEY: "Τοπογράφηση",
        NF_PEOPLE_YOU_MAY_KNOW: "Άτομα που ίσως γνωρίζετε",
        NF_PAID_PARTNERSHIP: "Πληρωμένη συνεργασία",
        NF_SPONSORED_PAID: "Χορηγούμενο · Πληρωμένο από ______",
        NF_SUGGESTIONS: "Προτάσεις / Συστάσεις",
        NF_FOLLOW: "Ακολούθησε",
        NF_PARTICIPATE: "Συμμετέχω",
        NF_REELS_SHORT_VIDEOS: "Reel και σύντομα βίντεο",
        NF_SHORT_REEL_VIDEO: "Ριλς/μικρό βίντεο",
        NF_EVENTS_YOU_MAY_LIKE: "Εκδηλώσεις που μπορεί να σας αρέσουν",
        NF_ANIMATED_GIFS_POSTS: "Κινούμενες εικόνες GIF",
        NF_ANIMATED_GIFS_PAUSE: "Παύση κινούμενων GIF",
        NF_SHARES: "# μερίδια",
        NF_LIKES_MAXIMUM: 'Μέγιστα "Μου αρέσει"',
        GF_PAID_PARTNERSHIP: "Πληρωμένη συνεργασία",
        GF_SUGGESTIONS: "Προτάσεις / Συστάσεις",
        GF_SHORT_REEL_VIDEO: "Ριλς/μικρό βίντεο",
        GF_ANIMATED_GIFS_POSTS: "Κινούμενες εικόνες GIF",
        GF_ANIMATED_GIFS_PAUSE: "Παύση κινούμενων GIF",
        GF_SHARES: "# μερίδια",
        VF_LIVE: "ΖΩΝΤΑΝΑ",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Διπλότυπο βίντεο",
        VF_ANIMATED_GIFS_PAUSE: "Παύση κινούμενων GIF",
        PP_ANIMATED_GIFS_POSTS: "Κινούμενες εικόνες GIF",
        PP_ANIMATED_GIFS_PAUSE: "Παύση κινούμενων GIF",
        NF_BLOCKED_FEED: ["Ροή ειδήσεων", "Ροή ομάδων", "Ροή βίντεο"],
        GF_BLOCKED_FEED: ["Ροή ειδήσεων", "Ροή ομάδων", "Ροή βίντεο"],
        VF_BLOCKED_FEED: ["Ροή ειδήσεων", "Ροή ομάδων", "Ροή βίντεο"],
        MP_BLOCKED_FEED: ["Ροή Marketplace"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Κορονοϊός (πλαίσιο πληροφοριών)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Επιστήμη του κλίματος (πλαίσιο πληροφοριών)",
        OTHER_INFO_BOX_SUBSCRIBE: "Εγγραφή (πλαίσιο πληροφοριών)",
        REELS_TITLE: "Reel",
        DLG_REELS_DESC: "Έλεγχοι αναπαραγωγής και επανάληψης.",
        REELS_CONTROLS: "Εμφάνιση χειριστηρίων βίντεο",
        REELS_DISABLE_LOOPING: "Απενεργοποίηση επανάληψης",
        DLG_TITLE: "Καθαρισμός των ροών μου",
        DLG_NF: "Ροή ειδήσεων",
        DLG_NF_DESC: "Καθαρίστε τις προτάσεις και ορίστε πόσο αυστηρή θα είναι η ροή.",
        DLG_GF: "Ροή ομάδων",
        DLG_GF_DESC: "Τακτοποιήστε τις ροές ομάδων μειώνοντας τα περιττά και το θόρυβο.",
        DLG_VF: "Ροή βίντεο",
        DLG_VF_DESC: "Κρατήστε τη ροή βίντεο καθαρή μειώνοντας επαναλήψεις και ακαταστασία.",
        DLG_MP: "Ροή Marketplace",
        DLG_MP_DESC: "Φιλτράρετε αγγελίες με βάση τιμή και λέξεις.",
        DLG_PP: "Προφίλ / Σελίδα",
        DLG_PP_DESC: "Ρυθμίστε τι εμφανίζεται σε προφίλ και σελίδες.",
        DLG_OTHER: "Συμπληρωματικές σημειώσεις",
        DLG_OTHER_DESC: "Κρύψτε επιπλέον πλαίσια που δεν θέλετε.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Φίλτρο κειμένου",
        DLG_BLOCK_NEW_LINE: "(Διαχωρίστε λέξεις ή φράσεις με αλλαγή γραμμής, υποστηρίζονται κανονικές εκφράσεις)",
        NF_BLOCKED_ENABLED: "Ενεργοποιημένο",
        GF_BLOCKED_ENABLED: "Ενεργοποιημένο",
        VF_BLOCKED_ENABLED: "Ενεργοποιημένο",
        MP_BLOCKED_ENABLED: "Ενεργοποιημένο",
        PP_BLOCKED_ENABLED: "Ενεργοποιημένο",
        NF_BLOCKED_RE: "Κανονικές Εκφράσεις (RegExp)",
        GF_BLOCKED_RE: "Κανονικές Εκφράσεις (RegExp)",
        VF_BLOCKED_RE: "Κανονικές Εκφράσεις (RegExp)",
        MP_BLOCKED_RE: "Κανονικές Εκφράσεις (RegExp)",
        PP_BLOCKED_RE: "Κανονικές Εκφράσεις (RegExp)",
        DLG_VERBOSITY: "Επιλογές για κρυφές αναρτήσεις",
        DLG_PREFERENCES: "Προτιμήσεις",
        DLG_PREFERENCES_DESC: "Ετικέτες, θέση, χρώματα και γλώσσα.",
        DLG_REPORT_BUG: "Αναφορά σφάλματος",
        DLG_REPORT_BUG_DESC: "Δημιούργησε διαγνωστική αναφορά για προβλήματα.",
        DLG_REPORT_BUG_NOTICE: "Βοηθήστε μας να το διορθώσουμε:\n1. Κάντε κύλιση ώστε να είναι ορατή η προβληματική δημοσίευση.\n2. Κάντε κλικ στο 'Δημιουργία αναφοράς' και μετά στο 'Αντιγραφή αναφοράς'.\n3. Κάντε κλικ στο 'Άνοιγμα θεμάτων' και επικολλήστε την αναφορά σε ένα νέο θέμα.\n4. Προσθέστε μια σύντομη περιγραφή του προβλήματος.\n(Αποκρύπτουμε ονόματα/κείμενο, αλλά παρακαλούμε ελέγξτε πριν την κοινοποίηση!)",
        DLG_REPORT_BUG_GENERATE: "Δημιουργία αναφοράς",
        DLG_REPORT_BUG_COPY: "Αντιγραφή αναφοράς",
        DLG_REPORT_BUG_OPEN_ISSUES: "Άνοιγμα θεμάτων",
        DLG_REPORT_BUG_STATUS_READY: "Η αναφορά είναι έτοιμη.",
        DLG_REPORT_BUG_STATUS_COPIED: "Η αναφορά αντιγράφηκε.",
        DLG_REPORT_BUG_STATUS_FAILED: "Αποτυχία αντιγραφής. Αντέγραψε χειροκίνητα.",
        DLG_VERBOSITY_CAPTION: "Εμφάνιση ετικέτας αν μια δημοσίευση είναι κρυμμένη",
        VERBOSITY_MESSAGE: [
          "χωρίς ετικέτα",
          "Δημοσίευση κρυμμένη. Κανόνας: ",
          " δημοσιεύσεις κρυμμένες",
          "7 δημοσιεύσεις κρυμμένες ~ (μόνο στην τροφοδοσία των ομάδων)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Χρώμα κειμένου",
        VERBOSITY_MESSAGE_BG_COLOUR: "Χρώμα φόντου",
        VERBOSITY_DEBUG: 'Επισήμανση "κρυφών αναρτήσεων"',
        CMF_CUSTOMISATIONS: "Προσαρμογές",
        CMF_BTN_LOCATION: "Τοποθεσία του κουμπιού CMF:",
        CMF_BTN_OPTION: [
          "κάτω αριστερά",
          "πάνω δεξιά",
          'απενεργοποιημένο (χρησιμοποιήστε "Ρυθμίσεις" στο μενού "Εντολές σεναρίου χρήστη")'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Γλώσσα του Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "Ελληνικά",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Χρήση γλώσσας ιστότοπου",
        GM_MENU_SETTINGS: "Ρυθμίσεις",
        CMF_DIALOG_LOCATION: "Τοποθεσία αυτού του μενού:",
        CMF_DIALOG_OPTION: ["αριστερή πλευρά", "δεξιά πλευρά"],
        CMF_BORDER_COLOUR: "Χρώμα περιγράμματος",
        DLG_TIPS: "Σχετικά",
        DLG_TIPS_DESC: "Σύνδεσμοι έργου και πληροφορίες συντηρητή.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Αν βοηθάει, ένα αστέρι στο {github} σημαίνει πολλά.",
        DLG_TIPS_THREADS: "Αν χρησιμοποιείς και το Threads σε υπολογιστή, διατηρώ και γι’ αυτό ένα φίλτρο: {threads}.",
        DLG_TIPS_FACEBOOK: "Πες γεια στη {facebook} - εκεί μοιράζομαι τέχνη και ποίηση.",
        DLG_TIPS_SITE: "Αν θέλεις να δεις τι κάνω γενικά στο διαδίκτυο, το {site} είναι το καλύτερο σημείο.",
        DLG_TIPS_CREDITS: "Ιδιαίτερες ευχαριστίες στον {zbluebugz} για το αρχικό project και στον {trinhquocviet} για τη βοήθεια στη συντήρηση των φίλτρων το 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "Από τον συντηρητή:",
        DLG_TIPS_MAINTAINER: "Ελπίζω αυτό το σκριπτ να σε βοηθήσει να πάρεις πίσω το feed σου. Υπόσχομαι να είμαι σύμμαχός σου στη μάχη ενάντια σε όσα δεν θέλεις να βλέπεις online.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "σελίδα μου στο Facebook",
        DLG_TIPS_LINK_SITE: "ιστότοπό μου",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Αποθήκευση", "Κλείσιμο", "Εξαγωγή", "Εισαγωγή", "Επαναφορά"],
        DLG_BUTTON_TOOLTIPS: [
          "Αποθηκεύει τις αλλαγές σε αυτόν τον browser. Εκκαθάριση/ιδιωτική περιήγηση τις χάνει.",
          "Εξάγει αρχείο backup για ασφάλεια και μεταφορά σε συσκευές.",
          "Εισάγει αρχείο ρυθμίσεων για επαναφορά ή μεταφορά.",
          "Επαναφέρει όλες τις ρυθμίσεις στα προεπιλεγμένα."
        ],
        DLG_FB_COLOUR_HINT: "Αφήστε κενό για να χρησιμοποιήσετε το χρωματικό σχήμα του FB"
      };
    }
  });

  // src/i18n/locales/es.ts
  var catalog7;
  var init_es = __esm({
    "src/i18n/locales/es.ts"() {
      "use strict";
      catalog7 = {
        DLG_REGEX_ERROR: "{field}, línea {line}: expresión regular no válida para {feed}. Corrígela o desactiva las expresiones regulares para ese feed.",
        DLG_REGEX_IMPORT_ERROR: "Se rechazó la importación. Se conservaron tus ajustes actuales.",
        DLG_REGEX_SAVED_ERROR: "Se omitió una expresión regular guardada que no era válida. Los demás filtros siguen activos.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Publicidad",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Cuadro de lista de la pestaña "Historias | Reels | Salas"',
        NF_STORIES: "Historias",
        NF_TOP_CARDS_PAGES: "Tarjetas principales (para páginas)",
        NF_META_AI: "Probar Meta AI",
        NF_META_AI_PROMPTS: "Sugerencias de prompts de Meta AI",
        NF_AI_INFO_POSTS: 'Publicaciones etiquetadas como "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Ocultar insignias verificadas",
        NF_FILTER_VERIFIED_BADGE: "Filtrar cuentas verificadas",
        NF_AI_SIDE_PANELS: "IA en paneles laterales",
        NF_SURVEY: "Encuesta",
        NF_PEOPLE_YOU_MAY_KNOW: "Personas que quizá conozcas",
        NF_PAID_PARTNERSHIP: "Colaboración pagada",
        NF_SPONSORED_PAID: "Publicidad · Pagado por ______",
        NF_SUGGESTIONS: "Sugerencias / Recomendaciones",
        NF_FOLLOW: "Seguir",
        NF_PARTICIPATE: "Participar",
        NF_REELS_SHORT_VIDEOS: "Reels y vídeos cortos",
        NF_SHORT_REEL_VIDEO: "Reel/video corto",
        NF_EVENTS_YOU_MAY_LIKE: "Eventos que te pueden gustar",
        NF_ANIMATED_GIFS_POSTS: "GIF animados",
        NF_ANIMATED_GIFS_PAUSE: "Pausar GIF animados",
        NF_SHARES: "# veces compartida",
        NF_LIKES_MAXIMUM: "Número máximo de Me gusta",
        GF_PAID_PARTNERSHIP: "Colaboración pagada",
        GF_SUGGESTIONS: "Sugerencias / Recomendaciones",
        GF_SHORT_REEL_VIDEO: "Reel/video corto",
        GF_ANIMATED_GIFS_POSTS: "GIF animados",
        GF_ANIMATED_GIFS_PAUSE: "Pausar GIF animados",
        GF_SHARES: "# veces compartida",
        VF_LIVE: "EN DIRECTO",
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
        OTHER_INFO_BOX_CORONAVIRUS: "Coronavirus (cuadro de información)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Ciencia del clima (cuadro de información)",
        OTHER_INFO_BOX_SUBSCRIBE: "Suscribir (cuadro de información)",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "Controles de reproducción y bucle.",
        REELS_CONTROLS: "Mostrar controles de video",
        REELS_DISABLE_LOOPING: "Desactivar bucle",
        DLG_TITLE: "Limpia mis feeds",
        DLG_NF: "Feed de noticias",
        DLG_NF_DESC: "Limpia sugerencias y define lo estricto del feed.",
        DLG_GF: "Feed de grupos",
        DLG_GF_DESC: "Ordena los feeds de grupos recortando extras y ruido.",
        DLG_VF: "Feed de vídeos",
        DLG_VF_DESC: "Mantén el feed de videos enfocado reduciendo repeticiones y desorden.",
        DLG_MP: "Feed de Marketplace",
        DLG_MP_DESC: "Filtra anuncios por precio y palabras clave.",
        DLG_PP: "Perfil / Página",
        DLG_PP_DESC: "Ajusta lo que se muestra en perfiles y páginas.",
        DLG_OTHER: "Notas complementarias",
        DLG_OTHER_DESC: "Oculta cuadros extra que no quieras.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Filtro de texto",
        DLG_BLOCK_NEW_LINE: "(Separe palabras o frases con un salto de línea, se admiten expresiones regulares)",
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
        DLG_PREFERENCES_DESC: "Etiquetas, ubicación, colores e idioma.",
        DLG_REPORT_BUG: "Reportar un error",
        DLG_REPORT_BUG_DESC: "Genera un informe de diagnóstico para problemas.",
        DLG_REPORT_BUG_NOTICE: "Ayúdanos a arreglarlo:\n1. Desplázate para que la publicación problemática sea visible.\n2. Haz clic en 'Generar informe' y luego en 'Copiar informe'.\n3. Haz clic en 'Abrir incidencias' y pega el informe en una nueva incidencia.\n4. Añade una breve descripción del problema.\n(Ocultamos nombres/texto, ¡pero por favor revisa antes de compartir!)",
        DLG_REPORT_BUG_GENERATE: "Generar informe",
        DLG_REPORT_BUG_COPY: "Copiar informe",
        DLG_REPORT_BUG_OPEN_ISSUES: "Abrir incidencias",
        DLG_REPORT_BUG_STATUS_READY: "Informe listo.",
        DLG_REPORT_BUG_STATUS_COPIED: "Informe copiado al portapapeles.",
        DLG_REPORT_BUG_STATUS_FAILED: "Error al copiar. Copia manualmente.",
        DLG_VERBOSITY_CAPTION: "Mostrar una etiqueta si una publicación está oculta",
        VERBOSITY_MESSAGE: [
          "sin etiqueta",
          "Publicación oculta. Regla: ",
          " publicaciones ocultas",
          "7 publicaciones ocultas ~ (solo en el Feed de Grupos)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Color del texto",
        VERBOSITY_MESSAGE_BG_COLOUR: "Color de fondo",
        VERBOSITY_DEBUG: 'Destacar publicaciones "ocultas"',
        CMF_CUSTOMISATIONS: "Personalizaciones",
        CMF_BTN_LOCATION: "Ubicación del botón CMF:",
        CMF_BTN_OPTION: [
          "abajo a la izquierda",
          "arriba a la derecha",
          'deshabilitado (use "Configuración" en el menú Comandos de script de usuario)'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Idioma de Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "Español",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Usar idioma del sitio",
        GM_MENU_SETTINGS: "Configuración",
        CMF_DIALOG_LOCATION: "Ubicación de este menú:",
        CMF_DIALOG_OPTION: ["lado izquierdo", "lado derecho"],
        CMF_BORDER_COLOUR: "Color de borde",
        DLG_TIPS: "Acerca de",
        DLG_TIPS_DESC: "Enlaces del proyecto e info del mantenedor.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Si te ayuda, una estrella en {github} significa mucho.",
        DLG_TIPS_THREADS: "Si también usas Threads en el escritorio, mantengo un filtro para eso: {threads}.",
        DLG_TIPS_FACEBOOK: "Pásate por {facebook} - allí comparto mi arte y poesía.",
        DLG_TIPS_SITE: "Si quieres ver qué hago por la web, {site} es el mejor lugar para empezar.",
        DLG_TIPS_CREDITS: "Un agradecimiento especial a {zbluebugz} por el proyecto original y a {trinhquocviet} por ayudar con el mantenimiento de filtros en 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "Del mantenedor:",
        DLG_TIPS_MAINTAINER: "Espero que este script te ayude a recuperar tu feed. Prometo ser tu aliado en la lucha contra lo que no quieres ver en línea.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "mi Facebook",
        DLG_TIPS_LINK_SITE: "mi sitio web",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Guardar", "Cerrar", "Exportar", "Importar", "Reajustar"],
        DLG_BUTTON_TOOLTIPS: [
          "Guarda cambios en este navegador. Borrar datos/modo privado los elimina.",
          "Exporta un archivo de respaldo para conservar y mover entre dispositivos.",
          "Importa un archivo de ajustes para restaurar o trasladar.",
          "Restablece todos los ajustes a valores predeterminados."
        ],
        DLG_FB_COLOUR_HINT: "Dejar en blanco para usar el esquema de color de FB"
      };
    }
  });

  // src/i18n/locales/fi.ts
  var catalog8;
  var init_fi = __esm({
    "src/i18n/locales/fi.ts"() {
      "use strict";
      catalog8 = {
        DLG_REGEX_ERROR: "{field}, rivi {line}: virheellinen säännöllinen lauseke syötteelle {feed}. Korjaa se tai poista säännöllisten lausekkeiden käyttö tästä syötteestä.",
        DLG_REGEX_IMPORT_ERROR: "Tuonti hylättiin. Nykyiset asetuksesi säilytettiin.",
        DLG_REGEX_SAVED_ERROR: "Virheellinen tallennettu säännöllinen lauseke ohitettiin. Muut suodattimet ovat edelleen käytössä.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Sponsoroitu",
        NF_TABLIST_STORIES_REELS_ROOMS: '"Tarinat | Reels | Rooms" -välilehtien luetteloruutu',
        NF_STORIES: "Tarinat",
        NF_TOP_CARDS_PAGES: "Yläkortit (sivuja varten)",
        NF_META_AI: "Kokeile Meta AI:ta",
        NF_META_AI_PROMPTS: "Meta AI -kehote-ehdotukset",
        NF_AI_INFO_POSTS: 'Julkaisut, joissa on "AI info" -merkintä',
        NF_HIDE_VERIFIED_BADGE: "Piilota varmennusmerkit",
        NF_FILTER_VERIFIED_BADGE: "Suodata varmennetut tilit",
        NF_AI_SIDE_PANELS: "Tekoäly sivupaneeleissa",
        NF_SURVEY: "Kysely",
        NF_PEOPLE_YOU_MAY_KNOW: "Ihmiset, jotka saatat tuntea",
        NF_PAID_PARTNERSHIP: "Maksettu kumppanuus",
        NF_SPONSORED_PAID: "Sponsoroitu · Maksaja ______",
        NF_SUGGESTIONS: "Ehdotuksia / Suosituksia",
        NF_FOLLOW: "Seuraa",
        NF_PARTICIPATE: "Osallistua",
        NF_REELS_SHORT_VIDEOS: "Keloja ja lyhyitä videoita",
        NF_SHORT_REEL_VIDEO: "Kela/lyhyt video",
        NF_EVENTS_YOU_MAY_LIKE: "Tapahtumat, joista saatat pitää",
        NF_ANIMATED_GIFS_POSTS: "Animoidut GIF-kuvat",
        NF_ANIMATED_GIFS_PAUSE: "Pysäytä animoidut GIF-kuvat",
        NF_SHARES: "# jakoa",
        NF_LIKES_MAXIMUM: "Maksimimäärä tykkäyksiä",
        GF_PAID_PARTNERSHIP: "Maksettu kumppanuus",
        GF_SUGGESTIONS: "Ehdotuksia / Suosituksia",
        GF_SHORT_REEL_VIDEO: "Keloja ja lyhyitä videoita",
        GF_ANIMATED_GIFS_POSTS: "Animoidut GIF-kuvat",
        GF_ANIMATED_GIFS_PAUSE: "Pysäytä animoidut GIF-kuvat",
        GF_SHARES: "# jakoa",
        VF_LIVE: "LIVE",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Kaksoisvideo",
        VF_ANIMATED_GIFS_PAUSE: "Pysäytä animoidut GIF-kuvat",
        PP_ANIMATED_GIFS_POSTS: "Animoidut GIF-kuvat",
        PP_ANIMATED_GIFS_PAUSE: "Pysäytä animoidut GIF-kuvat",
        NF_BLOCKED_FEED: ["Uutissyöte", "Ryhmäsyöte", "Videosyöte"],
        GF_BLOCKED_FEED: ["Uutissyöte", "Ryhmäsyöte", "Videosyöte"],
        VF_BLOCKED_FEED: ["Uutissyöte", "Ryhmäsyöte", "Videosyöte"],
        MP_BLOCKED_FEED: ["Marketplace-syöte"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Koronavirus (tietolaatikko)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Ilmastotiede (tietolaatikko)",
        OTHER_INFO_BOX_SUBSCRIBE: "Rekisteröidy (tietolaatikko)",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "Toiston ja silmukoinnin ohjaimet.",
        REELS_CONTROLS: "Näytä videon hallintaelementit",
        REELS_DISABLE_LOOPING: "Poista toisto",
        DLG_TITLE: "Puhdista syötteeni",
        DLG_NF: "Uutisvirta",
        DLG_NF_DESC: "Siivoa ehdotukset ja määritä, kuinka tiukka syöte on.",
        DLG_GF: "Ryhmäsyöte",
        DLG_GF_DESC: "Siisti ryhmäsyötteet karsimalla turhaa ja melua.",
        DLG_VF: "Videosyöte",
        DLG_VF_DESC: "Pidä videosyöte selkeänä vähentämällä toistoa ja hälyä.",
        DLG_MP: "Marketplace-syöte",
        DLG_MP_DESC: "Suodata ilmoituksia hinnan ja avainsanojen mukaan.",
        DLG_PP: "Profiili / Sivu",
        DLG_PP_DESC: "Säädä mitä profiileissa ja sivuilla näytetään.",
        DLG_OTHER: "Lisähuomiot",
        DLG_OTHER_DESC: "Piilota ylimääräiset laatikot, joita et halua.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Tekstisuodatin",
        DLG_BLOCK_NEW_LINE: "(Erota sanat tai lauseet rivinvaihdolla, säännölliset lausekkeet ovat tuettuja)",
        NF_BLOCKED_ENABLED: "Ota vaihtoehto käyttöön",
        GF_BLOCKED_ENABLED: "Ota vaihtoehto käyttöön",
        VF_BLOCKED_ENABLED: "Ota vaihtoehto käyttöön",
        MP_BLOCKED_ENABLED: "Ota vaihtoehto käyttöön",
        PP_BLOCKED_ENABLED: "Ota vaihtoehto käyttöön",
        NF_BLOCKED_RE: "Säännölliset lausekkeet (RegExp)",
        GF_BLOCKED_RE: "Säännölliset lausekkeet (RegExp)",
        VF_BLOCKED_RE: "Säännölliset lausekkeet (RegExp)",
        MP_BLOCKED_RE: "Säännölliset lausekkeet (RegExp)",
        PP_BLOCKED_RE: "Säännölliset lausekkeet (RegExp)",
        DLG_VERBOSITY: "Vaihtoehdot piilotetuille viesteille",
        DLG_PREFERENCES: "Asetukset",
        DLG_PREFERENCES_DESC: "Tunnisteet, sijainti, värit ja kieli.",
        DLG_REPORT_BUG: "Ilmoita virhe",
        DLG_REPORT_BUG_DESC: "Luo diagnoosiraportti ongelmista.",
        DLG_REPORT_BUG_NOTICE: "Auta meitä korjaamaan se:\n1. Vieritä niin, että ongelmallinen julkaisu on näkyvissä.\n2. Napsauta 'Luo raportti' ja sitten 'Kopioi raportti'.\n3. Napsauta 'Avaa tiketit' ja liitä raportti uuteen tikettiin.\n4. Lisää lyhyt kuvaus ongelmasta.\n(Muokkaamme nimet/tekstin pois, mutta tarkista ennen jakamista!)",
        DLG_REPORT_BUG_GENERATE: "Luo raportti",
        DLG_REPORT_BUG_COPY: "Kopioi raportti",
        DLG_REPORT_BUG_OPEN_ISSUES: "Avaa tiketit",
        DLG_REPORT_BUG_STATUS_READY: "Raportti valmis.",
        DLG_REPORT_BUG_STATUS_COPIED: "Raportti kopioitu leikepöydälle.",
        DLG_REPORT_BUG_STATUS_FAILED: "Kopiointi epäonnistui. Kopioi käsin.",
        DLG_VERBOSITY_CAPTION: "Näytä merkki, jos artikkeli on piilotettu",
        VERBOSITY_MESSAGE: [
          "ei tunnistetta",
          "Viesti piilotettu. Sääntö: ",
          " viestiä piilotettu",
          "7 viestiä piilotettu ~ (vain Ryhmien syötteessä)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Tekstin väri",
        VERBOSITY_MESSAGE_BG_COLOUR: "Taustaväri",
        VERBOSITY_DEBUG: 'Korosta "piilotetut" postaus',
        CMF_CUSTOMISATIONS: "Räätälöinnit",
        CMF_BTN_LOCATION: "CMF-painikkeen sijainti:",
        CMF_BTN_OPTION: [
          "alhaalla vasemmalla",
          "ylhäällä oikealle",
          'pois käytöstä (käytä "Asetukset" User Script Commands -valikossa)'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds -kieli:",
        CMF_DIALOG_LANGUAGE: "Suomi",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Käytä sivuston kieltä",
        GM_MENU_SETTINGS: "Asetukset",
        CMF_DIALOG_LOCATION: "Tämän valikon sijainti:",
        CMF_DIALOG_OPTION: ["vasen puoli", "oikea puoli"],
        CMF_BORDER_COLOUR: "Reunuksen väri",
        DLG_TIPS: "Tietoa",
        DLG_TIPS_DESC: "Projektin linkit ja ylläpitäjän tiedot.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Jos tästä on apua, {github}-tähti merkitsee paljon.",
        DLG_TIPS_THREADS: "Jos käytät myös Threadsia työpöydällä, ylläpidän siihenkin suodatinta: {threads}.",
        DLG_TIPS_FACEBOOK: "Tule moikkaamaan {facebook} - jaan siellä taidetta ja runoutta.",
        DLG_TIPS_SITE: "Jos haluat nähdä mitä puuhailen verkossa, {site} on paras paikka aloittaa.",
        DLG_TIPS_CREDITS: "Erityiskiitos {zbluebugz}:lle alkuperäisestä projektista ja {trinhquocviet}:lle avusta suodattimien ylläpidossa vuonna 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "Ylläpitäjältä:",
        DLG_TIPS_MAINTAINER: "Toivon, että tämä skripti auttaa sinua saamaan feedisi takaisin. Lupaan olla liittolaisesi taistelussa sitä vastaan, mitä et halua nähdä verkossa.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "Facebook-sivuni",
        DLG_TIPS_LINK_SITE: "sivuni",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Tallentaa", "Sulkea", "Vienti", "Tuonti", "Nollaa"],
        DLG_BUTTON_TOOLTIPS: [
          "Tallentaa muutokset tähän selaimeen. Tietojen tyhjennys/yksityinen tila poistaa ne.",
          "Vie varmuuskopiotiedoston asetusten säilyttämiseen ja siirtoon.",
          "Tuo asetustiedoston palautusta tai siirtoa varten.",
          "Palauttaa kaikki asetukset oletuksiin."
        ],
        DLG_FB_COLOUR_HINT: "Jätä tyhjäksi käyttääksesi FB:n värimaailmaa"
      };
    }
  });

  // src/i18n/locales/fr.ts
  var catalog9;
  var init_fr = __esm({
    "src/i18n/locales/fr.ts"() {
      "use strict";
      catalog9 = {
        DLG_REGEX_ERROR: "{field}, ligne {line} : expression régulière non valide pour {feed}. Corrigez-la ou désactivez les expressions régulières pour ce fil.",
        DLG_REGEX_IMPORT_ERROR: "Importation refusée. Vos réglages actuels ont été conservés.",
        DLG_REGEX_SAVED_ERROR: "Une expression régulière enregistrée non valide a été ignorée. Les autres filtres restent actifs.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Sponsorisé",
        NF_TABLIST_STORIES_REELS_ROOMS: `Zone de liste de l'onglet "Stories | Reels | Salons"`,
        NF_STORIES: "Stories",
        NF_TOP_CARDS_PAGES: "Cartes principales (pour les Pages)",
        NF_META_AI: "Essayer Meta AI",
        NF_META_AI_PROMPTS: "Suggestions de prompts Meta AI",
        NF_AI_INFO_POSTS: 'Publications portant le libellé "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Masquer les badges vérifiés",
        NF_FILTER_VERIFIED_BADGE: "Filtrer les comptes vérifiés",
        NF_AI_SIDE_PANELS: "IA dans les panneaux latéraux",
        NF_SURVEY: "Enquête",
        NF_PEOPLE_YOU_MAY_KNOW: "Connaissez-vous...",
        NF_PAID_PARTNERSHIP: "Partenariat rémunéré",
        NF_SPONSORED_PAID: "Sponsorisé · Financé par ______",
        NF_SUGGESTIONS: "Suggestions / Recommandations",
        NF_FOLLOW: "Suivre",
        NF_PARTICIPATE: "Participer",
        NF_REELS_SHORT_VIDEOS: "Reels et vidéos courtes",
        NF_SHORT_REEL_VIDEO: "Bobine/courte vidéo",
        NF_EVENTS_YOU_MAY_LIKE: "Évènements qui pourraient vous intéresser",
        NF_ANIMATED_GIFS_POSTS: "GIF animés",
        NF_ANIMATED_GIFS_PAUSE: "Mettre en pause les GIF animés",
        NF_SHARES: "# partages",
        NF_LIKES_MAXIMUM: "Nombre maximum de J'aime",
        GF_PAID_PARTNERSHIP: "Partenariat rémunéré",
        GF_SUGGESTIONS: "Suggestions / Recommandations",
        GF_SHORT_REEL_VIDEO: "Bobine/courte vidéo",
        GF_ANIMATED_GIFS_POSTS: "GIF animés",
        GF_ANIMATED_GIFS_PAUSE: "Mettre en pause les GIF animés",
        GF_SHARES: "# partages",
        VF_LIVE: "EN DIRECT",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Vidéo en double",
        VF_ANIMATED_GIFS_PAUSE: "Mettre en pause les GIF animés",
        PP_ANIMATED_GIFS_POSTS: "GIF animés",
        PP_ANIMATED_GIFS_PAUSE: "Mettre en pause les GIF animés",
        NF_BLOCKED_FEED: ["Fil de nouvelles", "Flux de groupes", "Flux de vidéos"],
        GF_BLOCKED_FEED: ["Fil de nouvelles", "Flux de groupes", "Flux de vidéos"],
        VF_BLOCKED_FEED: ["Fil de nouvelles", "Flux de groupes", "Flux de vidéos"],
        MP_BLOCKED_FEED: ["Flux de la place de marché"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Coronavirus (encadré d'information)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Science du climat (encadré d'information)",
        OTHER_INFO_BOX_SUBSCRIBE: "S’abonner (encadré d'information)",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "Contrôles de lecture et de boucle.",
        REELS_CONTROLS: "Afficher les contrôles vidéo",
        REELS_DISABLE_LOOPING: "Désactiver la boucle",
        DLG_TITLE: "Nettoyer mes flux",
        DLG_NF: "Fil de nouvelles",
        DLG_NF_DESC: "Nettoyez les suggestions et définissez le niveau de sévérité du fil.",
        DLG_GF: "Flux de groupes",
        DLG_GF_DESC: "Allégez les fils de groupes en retirant le superflu et le bruit.",
        DLG_VF: "Flux de vidéos",
        DLG_VF_DESC: "Gardez le fil vidéo clair en réduisant répétitions et encombrement.",
        DLG_MP: "Flux de la place de marché",
        DLG_MP_DESC: "Filtrez les annonces par prix et mots-clés.",
        DLG_PP: "Profil / Page",
        DLG_PP_DESC: "Réglez ce qui s’affiche sur les profils et les pages.",
        DLG_OTHER: "Notes complémentaires",
        DLG_OTHER_DESC: "Masquez les encarts supplémentaires que vous ne voulez pas.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Filtre de texte",
        DLG_BLOCK_NEW_LINE: "(Séparez les mots ou les phrases par un saut de ligne, les expressions régulières sont prises en charge)",
        NF_BLOCKED_ENABLED: "Activé",
        GF_BLOCKED_ENABLED: "Activé",
        VF_BLOCKED_ENABLED: "Activé",
        MP_BLOCKED_ENABLED: "Activé",
        PP_BLOCKED_ENABLED: "Activé",
        NF_BLOCKED_RE: "Expressions régulières (RegExp)",
        GF_BLOCKED_RE: "Expressions régulières (RegExp)",
        VF_BLOCKED_RE: "Expressions régulières (RegExp)",
        MP_BLOCKED_RE: "Expressions régulières (RegExp)",
        PP_BLOCKED_RE: "Expressions régulières (RegExp)",
        DLG_VERBOSITY: "Options pour les publications cachées",
        DLG_PREFERENCES: "Préférences",
        DLG_PREFERENCES_DESC: "Libellés, emplacement, couleurs et langue.",
        DLG_REPORT_BUG: "Signaler un bug",
        DLG_REPORT_BUG_DESC: "Générer un rapport de diagnostic.",
        DLG_REPORT_BUG_NOTICE: "Aidez-nous à corriger le problème :\n1. Faites défiler pour que la publication problématique soit visible.\n2. Cliquez sur 'Générer le rapport' puis sur 'Copier le rapport'.\n3. Cliquez sur 'Ouvrir les issues' et collez le rapport dans une nouvelle issue.\n4. Ajoutez une brève description du problème.\n(Nous masquons les noms/textes, mais veuillez vérifier avant de partager !)",
        DLG_REPORT_BUG_GENERATE: "Générer le rapport",
        DLG_REPORT_BUG_COPY: "Copier le rapport",
        DLG_REPORT_BUG_OPEN_ISSUES: "Ouvrir les issues",
        DLG_REPORT_BUG_STATUS_READY: "Rapport prêt.",
        DLG_REPORT_BUG_STATUS_COPIED: "Rapport copié dans le presse-papiers.",
        DLG_REPORT_BUG_STATUS_FAILED: "Échec de la copie. Copiez manuellement.",
        DLG_VERBOSITY_CAPTION: "Afficher un libellé si une publication est masquée",
        VERBOSITY_MESSAGE: [
          "pas de libellé",
          "Poste caché. Règle: ",
          " posts cachés",
          "7 posts cachés ~ (uniquement dans le flux de groupes)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Couleur du texte",
        VERBOSITY_MESSAGE_BG_COLOUR: "Couleur de fond",
        VERBOSITY_DEBUG: "Mettez en surbrillance les messages « cachés »",
        CMF_CUSTOMISATIONS: "Personnalisations",
        CMF_BTN_LOCATION: "Emplacement du bouton CMF :",
        CMF_BTN_OPTION: [
          "en bas à gauche",
          "en haut à droite",
          'désactivé (utilisez "Paramètres" dans le menu Commandes de script utilisateur)'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Langue de Clean My Feeds :",
        CMF_DIALOG_LANGUAGE: "Français",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Utiliser la langue du site",
        GM_MENU_SETTINGS: "Paramètres",
        CMF_DIALOG_LOCATION: "Emplacement de ce menu :",
        CMF_DIALOG_OPTION: ["côté gauche", "côté droit"],
        CMF_BORDER_COLOUR: "Couleur de bordure",
        DLG_TIPS: "À propos",
        DLG_TIPS_DESC: "Liens du projet et infos du mainteneur.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Si cela vous aide, une étoile sur {github} compte beaucoup.",
        DLG_TIPS_THREADS: "Si vous utilisez aussi Threads sur ordinateur, j’entretiens aussi un filtre pour ça : {threads}.",
        DLG_TIPS_FACEBOOK: "Passez dire bonjour sur {facebook} - j'y partage mon art et ma poésie.",
        DLG_TIPS_SITE: "Si vous voulez voir ce que je fais sur le web, {site} est le meilleur point de départ.",
        DLG_TIPS_CREDITS: "Remerciements particuliers à {zbluebugz} pour le projet original, et à {trinhquocviet} pour son aide dans la maintenance des filtres en 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "De la part du mainteneur :",
        DLG_TIPS_MAINTAINER: "J’espère que ce script vous aidera à reprendre votre fil. Je promets d’être votre allié dans la lutte contre ce que vous ne voulez pas voir en ligne.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "ma page Facebook",
        DLG_TIPS_LINK_SITE: "mon site",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Sauvegarder", "Fermer", "Exporter", "Importer", "Réinitialiser"],
        DLG_BUTTON_TOOLTIPS: [
          "Enregistre les changements dans ce navigateur. Effacer les données/privé les supprime.",
          "Exporte un fichier de sauvegarde pour conserver et déplacer entre appareils.",
          "Importe un fichier de réglages pour restaurer ou transférer.",
          "Réinitialise tous les réglages par défaut."
        ],
        DLG_FB_COLOUR_HINT: "Laissez vide pour utiliser le jeu de couleurs de FB"
      };
    }
  });

  // src/i18n/locales/he.ts
  var catalog10;
  var init_he = __esm({
    "src/i18n/locales/he.ts"() {
      "use strict";
      catalog10 = {
        DLG_REGEX_ERROR: "{field}, שורה {line}: ביטוי רגולרי לא תקין עבור {feed}. יש לתקן אותו או לכבות התאמה באמצעות ביטויים רגולריים בפיד הזה.",
        DLG_REGEX_IMPORT_ERROR: "הייבוא נדחה. ההגדרות הנוכחיות נשמרו.",
        DLG_REGEX_SAVED_ERROR: "ביטוי רגולרי שמור ולא תקין דולג. המסננים האחרים נשארים פעילים.",
        LANGUAGE_DIRECTION: "rtl",
        SPONSORED: "ממומן",
        NF_TABLIST_STORIES_REELS_ROOMS: 'תיבת רשימה של כרטיסיות "סטוריז | Reels | חדרים"',
        NF_STORIES: "סטוריז ",
        NF_TOP_CARDS_PAGES: "כרטיסים מובילים (לדפים)",
        NF_META_AI: "נסה את Meta AI",
        NF_META_AI_PROMPTS: "הצעות פרומפטים של Meta AI",
        NF_AI_INFO_POSTS: 'פוסטים המסומנים ב-"AI info"',
        NF_HIDE_VERIFIED_BADGE: "הסתר תגי אימות",
        NF_FILTER_VERIFIED_BADGE: "סנן חשבונות מאומתים",
        NF_AI_SIDE_PANELS: "בינה מלאכותית בלוחות הצד",
        NF_SURVEY: "סקר",
        NF_PEOPLE_YOU_MAY_KNOW: "אנשים שאולי אתה מכיר",
        NF_PAID_PARTNERSHIP: "שותפות בתשלום",
        NF_SPONSORED_PAID: "ממומן · שולם על ידי ______",
        NF_SUGGESTIONS: "הצעות / המלצות",
        NF_FOLLOW: "עקוב",
        NF_PARTICIPATE: "השתתף",
        NF_REELS_SHORT_VIDEOS: "סרטוני Reels וקטעי וידאו קצרים",
        NF_SHORT_REEL_VIDEO: "סליל/סרטון קצר",
        NF_EVENTS_YOU_MAY_LIKE: "אירועים שאולי תאהבו",
        NF_ANIMATED_GIFS_POSTS: "קובצי GIF מונפשים",
        NF_ANIMATED_GIFS_PAUSE: "השהה קובצי GIF מונפ",
        NF_SHARES: "# שיתופים",
        NF_LIKES_MAXIMUM: "מספר לייקים מקסימלי",
        GF_PAID_PARTNERSHIP: "שותפות בתשלום",
        GF_SUGGESTIONS: "הצעות / המלצות",
        GF_SHORT_REEL_VIDEO: "סליל/סרטון קצר",
        GF_ANIMATED_GIFS_POSTS: "קובצי GIF מונפשים",
        GF_ANIMATED_GIFS_PAUSE: "השהה קובצי GIF מונפ",
        GF_SHARES: "# שיתופים",
        VF_LIVE: "שידור חי",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "וידאו כפול",
        VF_ANIMATED_GIFS_PAUSE: "השהה קובצי GIF מונפ",
        PP_ANIMATED_GIFS_POSTS: "קובצי GIF מונפשים",
        PP_ANIMATED_GIFS_PAUSE: "השהה קובצי GIF מונפ",
        NF_BLOCKED_FEED: ["ניוז פיד", "פיד קבוצות", "צפה בפיד סרטונים"],
        GF_BLOCKED_FEED: ["ניוז פיד", "פיד קבוצות", "צפה בפיד סרטונים"],
        VF_BLOCKED_FEED: ["ניוז פיד", "פיד קבוצות", "צפה בפיד סרטונים"],
        MP_BLOCKED_FEED: ["זירת מסחר"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "וירוס קורונה (תיבת מידע)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "מדע האקלים (תיבת מידע)",
        OTHER_INFO_BOX_SUBSCRIBE: "הירשם (תיבת מידע)",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "בקרות הפעלה ולולאה.",
        REELS_CONTROLS: "הצג אפשרויות בקרת וידאו",
        REELS_DISABLE_LOOPING: "השבת לולאה",
        DLG_TITLE: "תנקה את הזנות שלי",
        DLG_NF: "ניוז פיד",
        DLG_NF_DESC: "נקה הצעות וקבע כמה קפדני יהיה הפיד.",
        DLG_GF: "פיד קבוצות",
        DLG_GF_DESC: "סדר פידים של קבוצות על-ידי צמצום תוספות ורעש.",
        DLG_VF: "צפה בפיד הסרטונים",
        DLG_VF_DESC: "שמור על פיד הווידאו ממוקד עם פחות חזרות ועומס.",
        DLG_MP: "זירת מסחר",
        DLG_MP_DESC: "סנן מודעות לפי מחיר ומילות מפתח.",
        DLG_PP: "פרופיל / דף",
        DLG_PP_DESC: "התאם מה מוצג בפרופילים ובדפים.",
        DLG_OTHER: "הערות נוספות",
        DLG_OTHER_DESC: "הסתר תיבות נוספות שאינך רוצה.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "מסנן טקסט",
        DLG_BLOCK_NEW_LINE: "(הפרד מילים או ביטויים עם ירידת שורה, ביטויים רגולריים נתמכים)",
        NF_BLOCKED_ENABLED: "מופעל",
        GF_BLOCKED_ENABLED: "מופעל",
        VF_BLOCKED_ENABLED: "מופעל",
        MP_BLOCKED_ENABLED: "מופעל",
        PP_BLOCKED_ENABLED: "מופעל",
        NF_BLOCKED_RE: "ביטויים רגולריים (RegExp)",
        GF_BLOCKED_RE: "ביטויים רגולריים (RegExp)",
        VF_BLOCKED_RE: "ביטויים רגולריים (RegExp)",
        MP_BLOCKED_RE: "ביטויים רגולריים (RegExp)",
        PP_BLOCKED_RE: "ביטויים רגולריים (RegExp)",
        DLG_VERBOSITY: "אפשרויות לפוסטים מוסתרים",
        DLG_PREFERENCES: "העדפות",
        DLG_PREFERENCES_DESC: "תוויות, מיקום, צבעים ושפה.",
        DLG_REPORT_BUG: "דווח על באג",
        DLG_REPORT_BUG_DESC: "צור דוח אבחון לבעיות.",
        DLG_REPORT_BUG_NOTICE: "עזרו לנו לתקן את זה:\n1. גלול כך שהפוסט הבעייתי יהיה גלוי.\n2. לחץ על 'צור דוח' ואז 'העתק דוח'.\n3. לחץ על 'פתח תקלות' והדבק את הדוח לתקלה חדשה.\n4. הוסף תיאור קצר של הבעיה.\n(אנו מסתירים שמות/טקסט, אך אנא בדוק לפני השיתוף!)",
        DLG_REPORT_BUG_GENERATE: "צור דוח",
        DLG_REPORT_BUG_COPY: "העתק דוח",
        DLG_REPORT_BUG_OPEN_ISSUES: "פתח תקלות",
        DLG_REPORT_BUG_STATUS_READY: "הדוח מוכן.",
        DLG_REPORT_BUG_STATUS_COPIED: "הדוח הועתק ללוח.",
        DLG_REPORT_BUG_STATUS_FAILED: "ההעתקה נכשלה. העתק ידנית.",
        DLG_VERBOSITY_CAPTION: "הצג תוית אם מאמר מוסתר",
        VERBOSITY_MESSAGE: [
          "אין תווית",
          "פוסט אחד מוסתר. כלל: ",
          " פוסטים מוסתרים",
          "7 פוסטים מוסתרים ~ (רק בסדר חברים)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "צבע טקסט",
        VERBOSITY_MESSAGE_BG_COLOUR: "צבע הרקע",
        VERBOSITY_DEBUG: 'הדגש פוסטים "מוסתרים"',
        CMF_CUSTOMISATIONS: "התאמות אישיות",
        CMF_BTN_LOCATION: "מיקום כפתור CMF:",
        CMF_BTN_OPTION: [
          "שמאל למטה",
          "ימינה למעלה",
          'מושבת (השתמש ב"הגדרות" בתפריט פקודות סקריפט משתמש)'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "שפת Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "עִבְרִית",
        CMF_DIALOG_LANGUAGE_DEFAULT: "השתמש בשפת האתר",
        GM_MENU_SETTINGS: "ההגדרות",
        CMF_DIALOG_LOCATION: "מיקום התפריט הזה:",
        CMF_DIALOG_OPTION: ["צד שמאל", "צד ימין"],
        CMF_BORDER_COLOUR: "צבע גבול",
        DLG_TIPS: "אודות",
        DLG_TIPS_DESC: "קישורי הפרויקט ומידע על המתחזק.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "אם זה עוזר, כוכב ב-{github} שווה הרבה.",
        DLG_TIPS_THREADS: "אם גם אתם משתמשים ב-Threads במחשב, אני מתחזק גם מסנן בשביל זה: {threads}.",
        DLG_TIPS_FACEBOOK: "בואו להגיד שלום ב-{facebook} - שם אני משתף אמנות ושירה.",
        DLG_TIPS_SITE: "אם רוצים לראות מה אני עושה ברחבי הרשת, {site} הוא המקום הכי טוב להתחיל.",
        DLG_TIPS_CREDITS: "תודה מיוחדת ל-{zbluebugz} על הפרויקט המקורי, ול-{trinhquocviet} על העזרה בתחזוקת הפילטרים בשנת 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "מהמתחזק:",
        DLG_TIPS_MAINTAINER: "אני מקווה שהסקריפט הזה יעזור לך להחזיר לעצמך את הפיד. אני מבטיח להיות בן ברית במאבק נגד דברים שלא תרצה לראות ברשת.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "עמוד הפייסבוק שלי",
        DLG_TIPS_LINK_SITE: "האתר שלי",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["שמור", "סגור", "ייצא", "ייבא", "איפוס"],
        DLG_BUTTON_TOOLTIPS: [
          "שומר שינויים בדפדפן הזה. ניקוי נתונים/גלישה פרטית מסירים אותם.",
          "מייצא קובץ גיבוי לשמירה והעברה בין מכשירים.",
          "מייבא קובץ הגדרות לשחזור או להעברה.",
          "מאפס את כל ההגדרות לברירת מחדל."
        ],
        DLG_FB_COLOUR_HINT: "השאר ריק כדי להשתמש בערכת הצבעים של FB"
      };
    }
  });

  // src/i18n/locales/id.ts
  var catalog11;
  var init_id = __esm({
    "src/i18n/locales/id.ts"() {
      "use strict";
      catalog11 = {
        DLG_REGEX_ERROR: "{field}, baris {line}: ekspresi reguler tidak valid untuk {feed}. Perbaiki atau nonaktifkan pencocokan ekspresi reguler untuk feed tersebut.",
        DLG_REGEX_IMPORT_ERROR: "Impor ditolak. Pengaturan Anda saat ini tetap tersimpan.",
        DLG_REGEX_SAVED_ERROR: "Ekspresi reguler tersimpan yang tidak valid diabaikan. Filter lain tetap aktif.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Bersponsor",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Kotak daftar tab "Cerita | Reels | Forum"',
        NF_STORIES: "Cerita",
        NF_TOP_CARDS_PAGES: "Kartu teratas (untuk Halaman)",
        NF_META_AI: "Coba Meta AI",
        NF_META_AI_PROMPTS: "Saran prompt Meta AI",
        NF_AI_INFO_POSTS: 'Postingan berlabel "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Sembunyikan lencana terverifikasi",
        NF_FILTER_VERIFIED_BADGE: "Filter akun terverifikasi",
        NF_AI_SIDE_PANELS: "AI di panel samping",
        NF_SURVEY: "Survei",
        NF_PEOPLE_YOU_MAY_KNOW: "Orang yang Mungkin Anda Kenal",
        NF_PAID_PARTNERSHIP: "Kemitraan berbayar",
        NF_SPONSORED_PAID: "Disponsori · Dibayar oleh ______",
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
        DLG_TIPS_THREADS: "Kalau Anda juga memakai Threads di desktop, saya juga mengelola filter untuk itu: {threads}.",
        DLG_TIPS_FACEBOOK: "Sapa di {facebook} - saya berbagi karya seni dan puisi di sana.",
        DLG_TIPS_SITE: "Jika ingin melihat apa yang saya lakukan di web, {site} adalah tempat terbaik untuk mulai.",
        DLG_TIPS_CREDITS: "Terima kasih khusus kepada {zbluebugz} untuk proyek asli, dan kepada {trinhquocviet} karena membantu merawat filter pada tahun 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "Dari pengelola:",
        DLG_TIPS_MAINTAINER: "Saya harap skrip ini membantu Anda merebut kembali feed Anda. Saya berjanji menjadi sekutu Anda melawan hal-hal yang tidak ingin Anda lihat online.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "Facebook saya",
        DLG_TIPS_LINK_SITE: "situs saya",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Simpan", "Tutup", "Ekspor", "Impor", "Reset"],
        DLG_BUTTON_TOOLTIPS: [
          "Menyimpan perubahan di browser ini. Hapus data/privat menghapusnya.",
          "Ekspor file cadangan untuk menyimpan dan memindahkan antar perangkat.",
          "Impor file pengaturan untuk memulihkan atau memindahkan.",
          "Atur ulang semua pengaturan ke default."
        ],
        DLG_FB_COLOUR_HINT: "Biarkan kosong untuk menggunakan skema warna FB"
      };
    }
  });

  // src/i18n/locales/it.ts
  var catalog12;
  var init_it = __esm({
    "src/i18n/locales/it.ts"() {
      "use strict";
      catalog12 = {
        DLG_REGEX_ERROR: "{field}, riga {line}: espressione regolare non valida per {feed}. Correggila o disattiva le espressioni regolari per quel feed.",
        DLG_REGEX_IMPORT_ERROR: "Importazione rifiutata. Le impostazioni attuali sono state mantenute.",
        DLG_REGEX_SAVED_ERROR: "Un’espressione regolare salvata non valida è stata ignorata. Gli altri filtri restano attivi.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Sponsorizzato",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Casella di riepilogo della scheda "Storie | Reels | Stanze"',
        NF_STORIES: "Storie",
        NF_TOP_CARDS_PAGES: "Schede principali (per Pagine)",
        NF_META_AI: "Prova Meta AI",
        NF_META_AI_PROMPTS: "Suggerimenti di prompt di Meta AI",
        NF_AI_INFO_POSTS: 'Post contrassegnati con "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Nascondi badge verificati",
        NF_FILTER_VERIFIED_BADGE: "Filtra account verificati",
        NF_AI_SIDE_PANELS: "IA nei pannelli laterali",
        NF_SURVEY: "Sondaggio",
        NF_PEOPLE_YOU_MAY_KNOW: "Persone che potresti conoscere",
        NF_PAID_PARTNERSHIP: "Partnership pubblicizzata",
        NF_SPONSORED_PAID: "Sponsorizzato · Finanziato da ______",
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
        DLG_NF_DESC: "Ripulisci i suggerimenti e imposta quanto è severo il feed.",
        DLG_GF: "Feed di gruppo",
        DLG_GF_DESC: "Riordina i feed dei gruppi riducendo extra e rumore.",
        DLG_VF: "Feed di video",
        DLG_VF_DESC: "Rendi il feed video più pulito riducendo ripetizioni e disordine.",
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
        DLG_VERBOSITY_CAPTION: "Mostrare un'etichetta se un post è nascosto",
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
        DLG_TIPS_STAR: "Se ti è utile, una stella su {github} significa molto.",
        DLG_TIPS_THREADS: "Se usi Threads anche da desktop, mantengo anche un filtro per quello: {threads}.",
        DLG_TIPS_FACEBOOK: "Passa a salutarmi su {facebook} - lì condivido la mia arte e poesia.",
        DLG_TIPS_SITE: "Se vuoi vedere cosa faccio in giro per il web, {site} è il posto migliore da cui partire.",
        DLG_TIPS_CREDITS: "Un grazie speciale a {zbluebugz} per il progetto originale e a {trinhquocviet} per l'aiuto con la manutenzione dei filtri nel 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "Dal maintainer:",
        DLG_TIPS_MAINTAINER: "Spero che questo script ti aiuti a riprenderti il tuo feed. Prometto di essere il tuo alleato nella lotta contro ciò che non vuoi vedere online.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "la mia pagina Facebook",
        DLG_TIPS_LINK_SITE: "il mio sito",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Salva", "Chiudi", "Esportare", "Importare", "Ripristina"],
        DLG_BUTTON_TOOLTIPS: [
          "Salva le modifiche in questo browser. Cancellare dati/privato le rimuove.",
          "Esporta un file di backup per conservarle e spostarle tra dispositivi.",
          "Importa un file di impostazioni per ripristinare o trasferire.",
          "Reimposta tutte le impostazioni ai valori predefiniti."
        ],
        DLG_FB_COLOUR_HINT: "Lascia vuoto per usare la combinazione di colori di FB"
      };
    }
  });

  // src/i18n/locales/ja.ts
  var catalog13;
  var init_ja = __esm({
    "src/i18n/locales/ja.ts"() {
      "use strict";
      catalog13 = {
        DLG_REGEX_ERROR: "{field}の{line}行目：{feed}で使用する正規表現が無効です。修正するか、そのフィードの正規表現による照合をオフにしてください。",
        DLG_REGEX_IMPORT_ERROR: "インポートを拒否しました。現在の設定は保持されています。",
        DLG_REGEX_SAVED_ERROR: "保存済みの無効な正規表現をスキップしました。他のフィルターは引き続き有効です。",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "広告",
        NF_TABLIST_STORIES_REELS_ROOMS: "「Stories | Reels | Rooms」タブのリストボックス",
        NF_STORIES: "Stories",
        NF_TOP_CARDS_PAGES: "トップカード（ページ向け）",
        NF_META_AI: "Meta AI を試す",
        NF_META_AI_PROMPTS: "Meta AI のプロンプト候補",
        NF_AI_INFO_POSTS: "「AI info」ラベル付きの投稿",
        NF_HIDE_VERIFIED_BADGE: "認証バッジを非表示",
        NF_FILTER_VERIFIED_BADGE: "認証済みアカウントをフィルター",
        NF_AI_SIDE_PANELS: "サイドパネルのAI",
        NF_SURVEY: "アンケート",
        NF_PEOPLE_YOU_MAY_KNOW: "あなたが知っているかもしれない人々",
        NF_PAID_PARTNERSHIP: "有償パートナーシップ",
        NF_SPONSORED_PAID: "後援 · ______ による支払い",
        NF_SUGGESTIONS: "提案/推奨事項",
        NF_FOLLOW: "フォロー",
        NF_PARTICIPATE: "参加する",
        NF_REELS_SHORT_VIDEOS: "リールとショート動画",
        NF_SHORT_REEL_VIDEO: "リール/ショートビデオ",
        NF_EVENTS_YOU_MAY_LIKE: "おすすめのイベント",
        NF_ANIMATED_GIFS_POSTS: "アニメーション GIF",
        NF_ANIMATED_GIFS_PAUSE: "アニメーション GIF を一時停止する",
        NF_SHARES: "シェア#件",
        NF_LIKES_MAXIMUM: "「いいね！」の最大数",
        GF_PAID_PARTNERSHIP: "有償パートナーシップ",
        GF_SUGGESTIONS: "提案/推奨事項",
        GF_SHORT_REEL_VIDEO: "リールとショートビデオ",
        GF_ANIMATED_GIFS_POSTS: "アニメーション GIF",
        GF_ANIMATED_GIFS_PAUSE: "アニメーション GIF を一時停止する",
        GF_SHARES: "シェア#件",
        VF_LIVE: "ライブ",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "重複する動画",
        VF_ANIMATED_GIFS_PAUSE: "アニメーション GIF を一時停止する",
        PP_ANIMATED_GIFS_POSTS: "アニメーション GIF",
        PP_ANIMATED_GIFS_PAUSE: "アニメーション GIF を一時停止する",
        NF_BLOCKED_FEED: ["ニュースフィード", "グループ フィード", "動画フィード"],
        GF_BLOCKED_FEED: ["ニュースフィード", "グループ フィード", "動画フィード"],
        VF_BLOCKED_FEED: ["ニュースフィード", "グループ フィード", "動画フィード"],
        MP_BLOCKED_FEED: ["マーケットプレイス フィード"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "コロナウイルス（インフォメーションボックス）",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "気候科学（情報ボックス）",
        OTHER_INFO_BOX_SUBSCRIBE: "購読する（情報ボックス）",
        REELS_TITLE: "リール動画",
        DLG_REELS_DESC: "再生とループのコントロール。",
        REELS_CONTROLS: "ビデオコントロールを表示",
        REELS_DISABLE_LOOPING: "ループの無効化",
        DLG_TITLE: "フィードをクリーンアップ",
        DLG_NF: "ニュースフィード",
        DLG_NF_DESC: "おすすめを整理し、フィードの厳しさを調整します。",
        DLG_GF: "グループ フィード",
        DLG_GF_DESC: "グループのフィードを整理して余計なものやノイズを減らします。",
        DLG_VF: "動画フィード",
        DLG_VF_DESC: "動画フィードの重複やノイズを減らして見やすくします。",
        DLG_MP: "マーケットプレイス フィード",
        DLG_MP_DESC: "価格やキーワードで出品を絞り込みます。",
        DLG_PP: "プロフィール / ページ",
        DLG_PP_DESC: "プロフィールやページに表示される内容を調整します。",
        DLG_OTHER: "補足メモ",
        DLG_OTHER_DESC: "不要な追加ボックスを非表示にします。",
        DLG_BLOCK_TEXT_FILTER_TITLE: "テキストフィルター",
        DLG_BLOCK_NEW_LINE: "(単語やフレーズを改行で区切ってください。正規表現がサポートされています)",
        NF_BLOCKED_ENABLED: "有効化",
        GF_BLOCKED_ENABLED: "有効化",
        VF_BLOCKED_ENABLED: "有効化",
        MP_BLOCKED_ENABLED: "有効化",
        PP_BLOCKED_ENABLED: "有効化",
        NF_BLOCKED_RE: "正規表現 (RegExp)",
        GF_BLOCKED_RE: "正規表現 (RegExp)",
        VF_BLOCKED_RE: "正規表現 (RegExp)",
        MP_BLOCKED_RE: "正規表現 (RegExp)",
        PP_BLOCKED_RE: "正規表現 (RegExp)",
        DLG_VERBOSITY: "非表示投稿のオプション",
        DLG_PREFERENCES: "設定",
        DLG_PREFERENCES_DESC: "ラベル、配置、色、言語。",
        DLG_REPORT_BUG: "バグを報告",
        DLG_REPORT_BUG_DESC: "問題の診断レポートを作成します。",
        DLG_REPORT_BUG_NOTICE: "修正にご協力ください：\n1. 問題のある投稿が表示されるようにスクロールします。\n2. 'レポート作成'をクリックし、次に'レポートをコピー'をクリックします。\n3. 'Issue を開く'をクリックし、新しいIssueにレポートを貼り付けます。\n4. 問題の短い説明を追加してください。\n(名前やテキストは伏せ字にしますが、共有前に確認してください！)",
        DLG_REPORT_BUG_GENERATE: "レポート作成",
        DLG_REPORT_BUG_COPY: "レポートをコピー",
        DLG_REPORT_BUG_OPEN_ISSUES: "Issue を開く",
        DLG_REPORT_BUG_STATUS_READY: "レポートが用意できました。",
        DLG_REPORT_BUG_STATUS_COPIED: "レポートをコピーしました。",
        DLG_REPORT_BUG_STATUS_FAILED: "コピーに失敗しました。手動でコピーしてください。",
        DLG_VERBOSITY_CAPTION: "投稿が非表示の場合にラベルを表示する",
        VERBOSITY_MESSAGE: [
          "ラベルなし",
          "投稿を非表示にしました。 ルール： ",
          " 件の投稿が非表示",
          "7件の投稿が非表示 ~ (グループフィードのみ)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "テキストの色",
        VERBOSITY_MESSAGE_BG_COLOUR: "背景色",
        VERBOSITY_DEBUG: "「非表示」の投稿を強調表示する",
        CMF_CUSTOMISATIONS: "カスタマイズ",
        CMF_BTN_LOCATION: "CMFボタンの位置:",
        CMF_BTN_OPTION: [
          "下左",
          "上右",
          "無効 ([ユーザー スクリプト コマンド] メニューの [設定] を使用)"
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feedsの言語:",
        CMF_DIALOG_LANGUAGE: "日本語",
        CMF_DIALOG_LANGUAGE_DEFAULT: "サイトの言語を使用",
        GM_MENU_SETTINGS: "設定",
        CMF_DIALOG_LOCATION: "このメニューの位置:",
        CMF_DIALOG_OPTION: ["左側", "右側"],
        CMF_BORDER_COLOUR: "ボーダーカラー",
        DLG_TIPS: "概要",
        DLG_TIPS_DESC: "プロジェクトリンクとメンテナ情報。",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "役に立ったら {github} のスターが励みになります。",
        DLG_TIPS_THREADS: "Threads をデスクトップでも使っているなら、そちら向けのフィルターもメンテナンスしています: {threads}。",
        DLG_TIPS_FACEBOOK: "{facebook}で声をかけてください - そこでアートと詩を共有しています。",
        DLG_TIPS_SITE: "活動をまとめて見たいなら、{site}がいちばんの入口です。",
        DLG_TIPS_CREDITS: "元のプロジェクトの {zbluebugz} と、2025年にフィルター保守を手伝ってくれた {trinhquocviet} に特別な感謝を。",
        DLG_TIPS_MAINTAINER_PREFIX: "メンテナより：",
        DLG_TIPS_MAINTAINER: "このスクリプトがあなたのフィードを取り戻す助けになれば嬉しいです。オンラインで見たくないものと戦うあなたの味方でいると約束します。",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "私のFacebook",
        DLG_TIPS_LINK_SITE: "私のサイト",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["セーブ", "クローズ", "輸出する", "輸入", "リセット"],
        DLG_BUTTON_TOOLTIPS: [
          "このブラウザに保存します。データ削除/プライベートで消えます。",
          "バックアップ用ファイルを書き出し、端末間で移行できます。",
          "設定ファイルを読み込み、復元または移行します。",
          "すべての設定を初期化します。"
        ],
        DLG_FB_COLOUR_HINT: "空白のままにすると、FB の配色が使用されます"
      };
    }
  });

  // src/i18n/locales/lv.ts
  var catalog14;
  var init_lv = __esm({
    "src/i18n/locales/lv.ts"() {
      "use strict";
      catalog14 = {
        DLG_REGEX_ERROR: "{field}, {line}. rinda: nederīga regulārā izteiksme plūsmai {feed}. Izlabojiet to vai izslēdziet regulāro izteiksmju izmantošanu šai plūsmai.",
        DLG_REGEX_IMPORT_ERROR: "Importēšana noraidīta. Pašreizējie iestatījumi tika saglabāti.",
        DLG_REGEX_SAVED_ERROR: "Nederīga saglabāta regulārā izteiksme tika izlaista. Pārējie filtri paliek aktīvi.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Apmaksāta reklāma",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Cilnes "Stāsti | Video rullīši | Rooms" sarakstlodziņš',
        NF_STORIES: "Stāsti",
        NF_TOP_CARDS_PAGES: "Augšējās kartītes (lapām)",
        NF_META_AI: "Izmēģiniet Meta AI",
        NF_META_AI_PROMPTS: "Meta AI uzvedņu ieteikumi",
        NF_AI_INFO_POSTS: 'Ziņas ar atzīmi "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Slēpt verificētās nozīmītes",
        NF_FILTER_VERIFIED_BADGE: "Filtrēt verificētos kontus",
        NF_AI_SIDE_PANELS: "AI sānu paneļos",
        NF_SURVEY: "Aptauja",
        NF_PEOPLE_YOU_MAY_KNOW: "Cilvēki, kurus tu varētu pazīt",
        NF_PAID_PARTNERSHIP: "Apmaksāta sadarbība",
        NF_SPONSORED_PAID: "Apmaksāta reklāma · Apmaksā ______",
        NF_SUGGESTIONS: "Ieteikumi",
        NF_FOLLOW: "Sekot",
        NF_PARTICIPATE: "Piedalīties",
        NF_REELS_SHORT_VIDEOS: "Reels un īsi videoklipi",
        NF_SHORT_REEL_VIDEO: "Ruļļa/īss video",
        NF_EVENTS_YOU_MAY_LIKE: "Notikumi, kas jums varētu patikt",
        NF_ANIMATED_GIFS_POSTS: "Animētos GIF",
        NF_ANIMATED_GIFS_PAUSE: "Apturiet animētos GIF",
        NF_SHARES: "# dalījās",
        NF_LIKES_MAXIMUM: "Maksimālais atzīmju Patīk skaits",
        GF_PAID_PARTNERSHIP: "Apmaksāta sadarbība",
        GF_SUGGESTIONS: "Ieteikumi",
        GF_SHORT_REEL_VIDEO: "Ruļļa/īss video",
        GF_ANIMATED_GIFS_POSTS: "Animētos GIF",
        GF_ANIMATED_GIFS_PAUSE: "Apturiet animētos GIF",
        GF_SHARES: "# dalījās",
        VF_LIVE: "TIEŠRAIDE",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Dublētais video",
        VF_ANIMATED_GIFS_PAUSE: "Apturiet animētos GIF",
        PP_ANIMATED_GIFS_POSTS: "Animētos GIF",
        PP_ANIMATED_GIFS_PAUSE: "Apturiet animētos GIF",
        NF_BLOCKED_FEED: ["Ziņu plūsma", "Grupu plūsma", "Video plūsma"],
        GF_BLOCKED_FEED: ["Ziņu plūsma", "Grupu plūsma", "Video plūsma"],
        VF_BLOCKED_FEED: ["Ziņu plūsma", "Grupu plūsma", "Video plūsma"],
        MP_BLOCKED_FEED: ["Marketplace"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Koronavīruss (informācijas lodziņš)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Klimata zinātne (informācijas lodziņš)",
        OTHER_INFO_BOX_SUBSCRIBE: "Abonēt (informācijas lodziņš)",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "Atskaņošanas un cikla kontrole.",
        REELS_CONTROLS: "Rādīt video vadīklus",
        REELS_DISABLE_LOOPING: "Atspējot cilpotošanu",
        DLG_TITLE: "Tīrīt manas plūsmas",
        DLG_NF: "Ziņu plūsma",
        DLG_NF_DESC: "Sakārto ieteikumus un nosaki, cik stingrai jābūt plūsmai.",
        DLG_GF: "Grupu plūsma",
        DLG_GF_DESC: "Sakārto grupu plūsmas, mazinot lieko un troksni.",
        DLG_VF: "Video plūsma",
        DLG_VF_DESC: "Uzturi video plūsmu fokusētu, samazinot atkārtojumus un jucekli.",
        DLG_MP: "Marketplace",
        DLG_MP_DESC: "Filtrē sludinājumus pēc cenas un atslēgvārdiem.",
        DLG_PP: "Profils / Lapa",
        DLG_PP_DESC: "Pielāgo, kas redzams profilos un lapās.",
        DLG_OTHER: "Papildu piezīmes",
        DLG_OTHER_DESC: "Paslēp papildu lodziņus, kurus nevēlaties.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Teksta filtrs",
        DLG_BLOCK_NEW_LINE: "(Atdaliet vārdus vai frāzes ar rindkopu pārtraukumu, regulārie izteicieni tiek atbalstīti)",
        NF_BLOCKED_ENABLED: "Iespējots",
        GF_BLOCKED_ENABLED: "Iespējots",
        VF_BLOCKED_ENABLED: "Iespējots",
        MP_BLOCKED_ENABLED: "Iespējots",
        PP_BLOCKED_ENABLED: "Iespējots",
        NF_BLOCKED_RE: "Regulārās izteiksmes (RegExp)",
        GF_BLOCKED_RE: "Regulārās izteiksmes (RegExp)",
        VF_BLOCKED_RE: "Regulārās izteiksmes (RegExp)",
        MP_BLOCKED_RE: "Regulārās izteiksmes (RegExp)",
        PP_BLOCKED_RE: "Regulārās izteiksmes (RegExp)",
        DLG_VERBOSITY: "Slēpto ierakstu iespējas",
        DLG_PREFERENCES: "Iestatījumi",
        DLG_PREFERENCES_DESC: "Etiķetes, novietojums, krāsas un valoda.",
        DLG_REPORT_BUG: "Ziņot par kļūdu",
        DLG_REPORT_BUG_DESC: "Izveido diagnostikas atskaiti problēmām.",
        DLG_REPORT_BUG_NOTICE: "Palīdzi mums to salabot:\n1. Ritiniet, lai problemātiskais ieraksts būtu redzams.\n2. Noklikšķiniet uz 'Izveidot atskaiti', tad 'Kopēt atskaiti'.\n3. Noklikšķiniet uz 'Atvērt pieteikumus' un ielīmējiet atskaiti jaunā pieteikumā.\n4. Pievienojiet īsu problēmas aprakstu.\n(Mēs rediģējam vārdus/tekstu, bet lūdzu pārskatiet pirms kopīgošanas!)",
        DLG_REPORT_BUG_GENERATE: "Izveidot atskaiti",
        DLG_REPORT_BUG_COPY: "Kopēt atskaiti",
        DLG_REPORT_BUG_OPEN_ISSUES: "Atvērt pieteikumus",
        DLG_REPORT_BUG_STATUS_READY: "Atskaite ir gatava.",
        DLG_REPORT_BUG_STATUS_COPIED: "Atskaite nokopēta starpliktuvē.",
        DLG_REPORT_BUG_STATUS_FAILED: "Kopēšana neizdevās. Kopē manuāli.",
        DLG_VERBOSITY_CAPTION: "Rādīt etiķeti, ja raksts ir paslēpts",
        VERBOSITY_MESSAGE: [
          "nav nekāda ziņojuma",
          "Ziņa ir paslēpta. Noteikums: ",
          " ziņas ir paslēptas",
          "7 ziņas paslēptas ~ (tikai Grupu plūsmē)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Teksta krāsa",
        VERBOSITY_MESSAGE_BG_COLOUR: "Fona krāsa",
        VERBOSITY_DEBUG: 'Izceliet "slēptos" rakstus',
        CMF_CUSTOMISATIONS: "Personalizēšana",
        CMF_BTN_LOCATION: "CMF pogas atrašanās vieta:",
        CMF_BTN_OPTION: [
          "apakšējā kreisajā stūrī",
          "augšējā labajā stūrī",
          "atspējota (lietotāja skripta komandu izvēlnē izmantojiet sadaļu Iestatījumi)"
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds valoda:",
        CMF_DIALOG_LANGUAGE: "Latviešu",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Izmantot vietnes valodu",
        GM_MENU_SETTINGS: "Iestatījumi",
        CMF_DIALOG_LOCATION: "Šīs izvēlnes atrašanās vieta:",
        CMF_DIALOG_OPTION: ["kreisā puse", "labā puse"],
        CMF_BORDER_COLOUR: "Apmales krāsa",
        DLG_TIPS: "Par",
        DLG_TIPS_DESC: "Projekta saites un uzturētāja info.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Ja tas palīdz, {github} zvaigzne man nozīmē daudz.",
        DLG_TIPS_THREADS: "Ja lieto Threads arī datorā, es uzturu filtru arī tam: {threads}.",
        DLG_TIPS_FACEBOOK: "Ienāc uz {facebook} - tur dalos ar mākslu un dzeju.",
        DLG_TIPS_SITE: "Ja gribi redzēt, ar ko nodarbojos tīmeklī, {site} ir labākā vieta, kur sākt.",
        DLG_TIPS_CREDITS: "Īpašs paldies {zbluebugz} par oriģinālo projektu un {trinhquocviet} par palīdzību filtru uzturēšanā 2025. gadā.",
        DLG_TIPS_MAINTAINER_PREFIX: "No uzturētāja:",
        DLG_TIPS_MAINTAINER: "Ceru, ka šis skripts palīdzēs atgūt savu plūsmu. Es apsolu būt tavs sabiedrotais cīņā pret to, ko nevēlies redzēt tiešsaistē.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "mana Facebook lapa",
        DLG_TIPS_LINK_SITE: "mana vietne",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Saglabājiet", "Aizveriet", "Eksportēt", "Importēt", "Atiestatīt"],
        DLG_BUTTON_TOOLTIPS: [
          "Saglabā izmaiņas šajā pārlūkā. Datu tīrīšana/privātais režīms tās dzēš.",
          "Eksportē rezerves failu saglabāšanai un pārnesei starp ierīcēm.",
          "Importē iestatījumu failu atjaunošanai vai pārnesei.",
          "Atiestata visus iestatījumus uz noklusējumu."
        ],
        DLG_FB_COLOUR_HINT: "Atstājiet tukšu, lai izmantotu FB krāsu shēmu"
      };
    }
  });

  // src/i18n/locales/nl.ts
  var catalog15;
  var init_nl = __esm({
    "src/i18n/locales/nl.ts"() {
      "use strict";
      catalog15 = {
        DLG_REGEX_ERROR: "{field}, regel {line}: ongeldige reguliere expressie voor {feed}. Corrigeer deze of schakel reguliere expressies voor die feed uit.",
        DLG_REGEX_IMPORT_ERROR: "Import geweigerd. Je huidige instellingen zijn behouden.",
        DLG_REGEX_SAVED_ERROR: "Een ongeldige opgeslagen reguliere expressie is overgeslagen. Andere filters blijven actief.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Gesponsord",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Keuzelijst tabblad "Verhalen | Reels | Ruimtes"',
        NF_STORIES: "Verhalen",
        NF_TOP_CARDS_PAGES: "Topkaarten (voor Pagina's)",
        NF_META_AI: "Probeer Meta AI",
        NF_META_AI_PROMPTS: "Meta AI-promptsuggesties",
        NF_AI_INFO_POSTS: 'Berichten met het label "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Geverifieerde badges verbergen",
        NF_FILTER_VERIFIED_BADGE: "Geverifieerde accounts filteren",
        NF_AI_SIDE_PANELS: "AI in zijpanelen",
        NF_SURVEY: "Vragenlijst",
        NF_PEOPLE_YOU_MAY_KNOW: "Mensen die je misschien kent",
        NF_PAID_PARTNERSHIP: "Betaald partnerschap",
        NF_SPONSORED_PAID: "Gesponsord · Betaald door ______",
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
        DLG_GF_DESC: "Maak groepsfeeds rustiger door extra’s en ruis te verminderen.",
        DLG_VF: "Videofeed",
        DLG_VF_DESC: "Houd de videofeed overzichtelijk door herhaling en rommel te beperken.",
        DLG_MP: "Marktplaatsfeed",
        DLG_MP_DESC: "Filter aanbiedingen op prijs en trefwoorden.",
        DLG_PP: "Profiel / Pagina",
        DLG_PP_DESC: "Stel in wat er op profielen en pagina’s verschijnt.",
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
        DLG_REPORT_BUG_NOTICE: "Help ons het te repareren:\n1. Scroll zodat het problematische bericht zichtbaar is.\n2. Klik op 'Rapport maken' en vervolgens op 'Rapport kopiëren'.\n3. Klik op 'Issues openen' en plak het rapport in een nieuwe issue.\n4. Voeg een korte beschrijving van het probleem toe.\n(We redigeren namen/tekst, maar controleer dit voordat je het deelt!)",
        DLG_REPORT_BUG_GENERATE: "Rapport maken",
        DLG_REPORT_BUG_COPY: "Rapport kopiëren",
        DLG_REPORT_BUG_OPEN_ISSUES: "Issues openen",
        DLG_REPORT_BUG_STATUS_READY: "Rapport klaar.",
        DLG_REPORT_BUG_STATUS_COPIED: "Rapport gekopieerd naar klembord.",
        DLG_REPORT_BUG_STATUS_FAILED: "Kopiëren mislukt. Kopieer handmatig.",
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
        DLG_TIPS_THREADS: "Als je Threads ook op desktop gebruikt, onderhoud ik daar ook een filter voor: {threads}.",
        DLG_TIPS_FACEBOOK: "Zeg hallo op {facebook} - daar deel ik mijn kunst en poëzie.",
        DLG_TIPS_SITE: "Als je wilt zien wat ik online doe, is {site} de beste plek om te beginnen.",
        DLG_TIPS_CREDITS: "Speciale dank aan {zbluebugz} voor het originele project, en aan {trinhquocviet} voor de hulp bij het onderhouden van filters in 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "Van de maintainer:",
        DLG_TIPS_MAINTAINER: "Ik hoop dat dit script je helpt je feed terug te krijgen. Ik beloof je bondgenoot te zijn in de strijd tegen dingen die je online niet wilt zien.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "mijn Facebook-pagina",
        DLG_TIPS_LINK_SITE: "mijn website",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Opslaan", "Sluiten", "Exporteren", "Importeren", "Reset"],
        DLG_BUTTON_TOOLTIPS: [
          "Slaat wijzigingen op in deze browser. Gegevens wissen/privé verwijdert ze.",
          "Exporteert een back-upbestand om te bewaren en te verplaatsen.",
          "Importeert een instellingenbestand om te herstellen of over te zetten.",
          "Herstelt alle instellingen naar standaard."
        ],
        DLG_FB_COLOUR_HINT: "Laat leeg om het kleurenschema van FB te gebruiken"
      };
    }
  });

  // src/i18n/locales/pl.ts
  var catalog16;
  var init_pl = __esm({
    "src/i18n/locales/pl.ts"() {
      "use strict";
      catalog16 = {
        DLG_REGEX_ERROR: "{field}, wiersz {line}: nieprawidłowe wyrażenie regularne dla {feed}. Popraw je lub wyłącz dopasowywanie wyrażeń regularnych dla tego kanału.",
        DLG_REGEX_IMPORT_ERROR: "Import został odrzucony. Zachowano bieżące ustawienia.",
        DLG_REGEX_SAVED_ERROR: "Pominięto nieprawidłowe zapisane wyrażenie regularne. Pozostałe filtry nadal działają.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Sponsorowane",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Pole listy zakładki "Relacje | Reels | Pokoje"',
        NF_STORIES: "Relacje",
        NF_TOP_CARDS_PAGES: "Górne karty (dla stron)",
        NF_META_AI: "Wypróbuj Meta AI",
        NF_META_AI_PROMPTS: "Sugestie promptów Meta AI",
        NF_AI_INFO_POSTS: 'Posty oznaczone "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Ukryj zweryfikowane odznaki",
        NF_FILTER_VERIFIED_BADGE: "Filtruj zweryfikowane konta",
        NF_AI_SIDE_PANELS: "AI w panelach bocznych",
        NF_SURVEY: "Badanie",
        NF_PEOPLE_YOU_MAY_KNOW: "Osoby, które możesz znać",
        NF_PAID_PARTNERSHIP: "Post sponsorowany",
        NF_SPONSORED_PAID: "Sponsorowane · Opłacona przez ______",
        NF_SUGGESTIONS: "Sugestie / Zalecenia",
        NF_FOLLOW: "Obserwuj",
        NF_PARTICIPATE: "Uczestniczyć",
        NF_REELS_SHORT_VIDEOS: "Rolki i krótkie filmy",
        NF_SHORT_REEL_VIDEO: "Reel/krótki film",
        NF_EVENTS_YOU_MAY_LIKE: "Wydarzenia, które mogą Ci się spodobać",
        NF_ANIMATED_GIFS_POSTS: "Animowane GIF-y",
        NF_ANIMATED_GIFS_PAUSE: "Wstrzymaj animowane GIF-y",
        NF_SHARES: "# udostępnienia",
        NF_LIKES_MAXIMUM: 'Maksymalna ilość "Lubię to!"',
        GF_PAID_PARTNERSHIP: "Post sponsorowany",
        GF_SUGGESTIONS: "Sugestie / Zalecenia",
        GF_SHORT_REEL_VIDEO: "Reel/krótki film",
        GF_ANIMATED_GIFS_POSTS: "Animowane GIF-y",
        GF_ANIMATED_GIFS_PAUSE: "Wstrzymaj animowane GIF-y",
        GF_SHARES: "# udostępnienia",
        VF_LIVE: "NA ŻYWO",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Duplikat wideo",
        VF_ANIMATED_GIFS_PAUSE: "Wstrzymaj animowane GIF-y",
        PP_ANIMATED_GIFS_POSTS: "Animowane GIF-y",
        PP_ANIMATED_GIFS_PAUSE: "Wstrzymaj animowane GIF-y",
        NF_BLOCKED_FEED: ["Kanał aktualności", "Kanał grup", "Kanał wideo"],
        GF_BLOCKED_FEED: ["Kanał aktualności", "Kanał grup", "Kanał wideo"],
        VF_BLOCKED_FEED: ["Kanał aktualności", "Kanał grup", "Kanał wideo"],
        MP_BLOCKED_FEED: ["Kanał Marketplace"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Koronawirus (skrzynka informacyjna)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Nauka o klimacie (skrzynka informacyjna)",
        OTHER_INFO_BOX_SUBSCRIBE: "Subskrybuj (pole informacyjne)",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "Sterowanie odtwarzaniem i pętlą.",
        REELS_CONTROLS: "Pokaż sterowanie wideo",
        REELS_DISABLE_LOOPING: "Wyłącz pętlę",
        DLG_TITLE: "Wyczyść moje kanały",
        DLG_NF: "Kanał aktualności",
        DLG_NF_DESC: "Uporządkuj sugestie i ustaw, jak restrykcyjny ma być kanał.",
        DLG_GF: "Kanał grup",
        DLG_GF_DESC: "Uporządkuj kanały grup, ograniczając dodatki i szum.",
        DLG_VF: "Kanał wideo",
        DLG_VF_DESC: "Utrzymaj przejrzysty kanał wideo, ograniczając powtórki i bałagan.",
        DLG_MP: "Kanał Marketplace",
        DLG_MP_DESC: "Filtruj oferty według ceny i słów kluczowych.",
        DLG_PP: "Profil / Strona",
        DLG_PP_DESC: "Dostosuj, co pojawia się na profilach i stronach.",
        DLG_OTHER: "Dodatkowe notatki",
        DLG_OTHER_DESC: "Ukryj dodatkowe pola, których nie chcesz.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Filtr tekstu",
        DLG_BLOCK_NEW_LINE: "(Oddziel słowa lub frazy za pomocą znaku nowej linii, wyrażenia regularne są obsługiwane)",
        NF_BLOCKED_ENABLED: "Włączone",
        GF_BLOCKED_ENABLED: "Włączone",
        VF_BLOCKED_ENABLED: "Włączone",
        MP_BLOCKED_ENABLED: "Włączone",
        PP_BLOCKED_ENABLED: "Włączone",
        NF_BLOCKED_RE: "Wyrażenia regularne (RegExp)",
        GF_BLOCKED_RE: "Wyrażenia regularne (RegExp)",
        VF_BLOCKED_RE: "Wyrażenia regularne (RegExp)",
        MP_BLOCKED_RE: "Wyrażenia regularne (RegExp)",
        PP_BLOCKED_RE: "Wyrażenia regularne (RegExp)",
        DLG_VERBOSITY: "Opcje dla ukrytych postów",
        DLG_PREFERENCES: "Preferencje",
        DLG_PREFERENCES_DESC: "Etykiety, położenie, kolory i język.",
        DLG_REPORT_BUG: "Zgłoś błąd",
        DLG_REPORT_BUG_DESC: "Utwórz raport diagnostyczny.",
        DLG_REPORT_BUG_NOTICE: "Pomóż nam to naprawić:\n1. Przewiń, aby dany post był widoczny.\n2. Kliknij „Generuj raport”, a następnie „Kopiuj raport”.\n3. Kliknij „Otwórz zgłoszenia” i wklej raport do nowego zgłoszenia.\n4. Dodaj krótki opis problemu.\n(Ukrywamy nazwiska/tekst, ale sprawdź przed udostępnieniem!)",
        DLG_REPORT_BUG_GENERATE: "Utwórz raport",
        DLG_REPORT_BUG_COPY: "Kopiuj raport",
        DLG_REPORT_BUG_OPEN_ISSUES: "Otwórz zgłoszenia",
        DLG_REPORT_BUG_STATUS_READY: "Raport gotowy.",
        DLG_REPORT_BUG_STATUS_COPIED: "Raport skopiowany do schowka.",
        DLG_REPORT_BUG_STATUS_FAILED: "Nie udało się skopiować. Skopiuj ręcznie.",
        DLG_VERBOSITY_CAPTION: "Pokaż etykietę, jeśli artykuł jest ukryty",
        VERBOSITY_MESSAGE: [
          "brak etykiety",
          "Ukryto 1 post. Reguła: ",
          " posty ukryte",
          "7 posty ukryte ~ (tylko w Kanałach Grup)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Kolor tekstu",
        VERBOSITY_MESSAGE_BG_COLOUR: "Kolor tła",
        VERBOSITY_DEBUG: "Wyróżnij „ukryte” posty",
        CMF_CUSTOMISATIONS: "Personalizacja",
        CMF_BTN_LOCATION: "Lokalizacja przycisku CMF:",
        CMF_BTN_OPTION: [
          "lewy dolny róg",
          "prawy górny róg",
          'wyłączone (użyj "Ustawienia" w menu Polecenia skryptu użytkownika)'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Język Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "Polski",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Użyj języka witryny",
        GM_MENU_SETTINGS: "Ustawienia",
        CMF_DIALOG_LOCATION: "Lokalizacja tego menu:",
        CMF_DIALOG_OPTION: ["lewa strona", "prawa strona"],
        CMF_BORDER_COLOUR: "Kolor obramowania",
        DLG_TIPS: "O projekcie",
        DLG_TIPS_DESC: "Linki do projektu i informacje o opiekunie.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Jeśli to pomaga, gwiazdka na {github} wiele dla mnie znaczy.",
        DLG_TIPS_THREADS: "Jeśli korzystasz z Threads także na komputerze, utrzymuję też filtr do tego: {threads}.",
        DLG_TIPS_FACEBOOK: "Wpadnij na {facebook} - dzielę się tam sztuką i poezją.",
        DLG_TIPS_SITE: "Jeśli chcesz zobaczyć, co robię w sieci, {site} to najlepszy start.",
        DLG_TIPS_CREDITS: "Specjalne podziękowania dla {zbluebugz} za oryginalny projekt oraz dla {trinhquocviet} za pomoc w utrzymaniu filtrów w 2025 roku.",
        DLG_TIPS_MAINTAINER_PREFIX: "Od opiekuna:",
        DLG_TIPS_MAINTAINER: "Mam nadzieję, że ten skrypt pomoże ci odzyskać feed. Obiecuję być twoim sojusznikiem w walce z tym, czego nie chcesz widzieć online.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "moja strona na Facebooku",
        DLG_TIPS_LINK_SITE: "moja strona",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Zapisz", "Zamknij", "Eksport", "Import", "Przeskładać"],
        DLG_BUTTON_TOOLTIPS: [
          "Zapisuje zmiany w tej przeglądarce. Czyszczenie danych/tryb prywatny usuwa je.",
          "Eksportuje plik kopii zapasowej do zachowania i przenoszenia.",
          "Importuje plik ustawień do przywrócenia lub przeniesienia.",
          "Resetuje wszystkie ustawienia do domyślnych."
        ],
        DLG_FB_COLOUR_HINT: "Pozostaw puste, aby użyć schematu kolorów FB"
      };
    }
  });

  // src/i18n/locales/pt.ts
  var catalog17;
  var init_pt = __esm({
    "src/i18n/locales/pt.ts"() {
      "use strict";
      catalog17 = {
        DLG_REGEX_ERROR: "{field}, linha {line}: expressão regular inválida para {feed}. Corrija-a ou desative a correspondência por expressões regulares nesse feed.",
        DLG_REGEX_IMPORT_ERROR: "Importação rejeitada. As configurações atuais foram mantidas.",
        DLG_REGEX_SAVED_ERROR: "Uma expressão regular salva inválida foi ignorada. Os outros filtros continuam ativos.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Patrocinado",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Caixa de listagem da guia "Stories | Vídeos do Reels | Salas"',
        NF_STORIES: "Stories",
        NF_TOP_CARDS_PAGES: "Cartões principais (para Páginas)",
        NF_META_AI: "Experimente o Meta AI",
        NF_META_AI_PROMPTS: "Sugestões de prompts do Meta AI",
        NF_AI_INFO_POSTS: 'Publicações marcadas como "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Ocultar selos verificados",
        NF_FILTER_VERIFIED_BADGE: "Filtrar contas verificadas",
        NF_AI_SIDE_PANELS: "IA nos painéis laterais",
        NF_SURVEY: "Enquete",
        NF_PEOPLE_YOU_MAY_KNOW: "Pessoas que talvez conheças",
        NF_PAID_PARTNERSHIP: "Parceria paga",
        NF_SPONSORED_PAID: "Patrocinado · Financiado por ______",
        NF_SUGGESTIONS: "Sugestões / Recomendações",
        NF_FOLLOW: "Seguir",
        NF_PARTICIPATE: "Participar",
        NF_REELS_SHORT_VIDEOS: "Vídeos do Reels e vídeos de curta duração",
        NF_SHORT_REEL_VIDEO: "Rolo/vídeo curto",
        NF_EVENTS_YOU_MAY_LIKE: "Eventos que você pode gostar",
        NF_ANIMATED_GIFS_POSTS: "GIFs animados",
        NF_ANIMATED_GIFS_PAUSE: "Pausar GIFs animados",
        NF_SHARES: "# partilhas",
        NF_LIKES_MAXIMUM: "Número máximo de curtidas",
        GF_PAID_PARTNERSHIP: "Parceria paga",
        GF_SUGGESTIONS: "Sugestões / Recomendações",
        GF_SHORT_REEL_VIDEO: "Rolo/vídeo curto",
        GF_ANIMATED_GIFS_POSTS: "GIFs animados",
        GF_ANIMATED_GIFS_PAUSE: "Pausar GIFs animados",
        GF_SHARES: "# partilhas",
        VF_LIVE: "DIRETO",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Vídeo duplicado",
        VF_ANIMATED_GIFS_PAUSE: "Pausar GIFs animados",
        PP_ANIMATED_GIFS_POSTS: "GIFs animados",
        PP_ANIMATED_GIFS_PAUSE: "Pausar GIFs animados",
        NF_BLOCKED_FEED: ["Feed de notícias", "Feed de grupos", "Feed de vídeos"],
        GF_BLOCKED_FEED: ["Feed de notícias", "Feed de grupos", "Feed de vídeos"],
        VF_BLOCKED_FEED: ["Feed de notícias", "Feed de grupos", "Feed de vídeos"],
        MP_BLOCKED_FEED: ["Feed de mercado"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Coronavírus (caixa de informações)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Ciência do Clima (caixa de informações)",
        OTHER_INFO_BOX_SUBSCRIBE: "Assine (caixa de informações)",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "Controles de reprodução e loop.",
        REELS_CONTROLS: "Mostrar controles do vídeo",
        REELS_DISABLE_LOOPING: "Desativar repetição",
        DLG_TITLE: "Limpe meus feeds",
        DLG_NF: "Feed de notícias",
        DLG_NF_DESC: "Limpe sugestões e defina o quão rígido é o feed.",
        DLG_GF: "Feed de grupos",
        DLG_GF_DESC: "Organize os feeds de grupos reduzindo extras e ruído.",
        DLG_VF: "Feed de vídeos",
        DLG_VF_DESC: "Mantenha o feed de vídeos focado reduzindo repetições e bagunça.",
        DLG_MP: "Feed de mercado",
        DLG_MP_DESC: "Filtre anúncios por preço e palavras-chave.",
        DLG_PP: "Perfil / Página",
        DLG_PP_DESC: "Ajuste o que aparece em perfis e páginas.",
        DLG_OTHER: "Notas suplementares",
        DLG_OTHER_DESC: "Oculte caixas extras que você não quer.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Filtro de texto",
        DLG_BLOCK_NEW_LINE: "(Separe palavras ou frases com uma quebra de linha, expressões regulares são suportadas)",
        NF_BLOCKED_ENABLED: "Habilidoso",
        GF_BLOCKED_ENABLED: "Habilidoso",
        VF_BLOCKED_ENABLED: "Habilidoso",
        MP_BLOCKED_ENABLED: "Habilidoso",
        PP_BLOCKED_ENABLED: "Habilidoso",
        NF_BLOCKED_RE: "Expressões regulares (RegExp)",
        GF_BLOCKED_RE: "Expressões regulares (RegExp)",
        VF_BLOCKED_RE: "Expressões regulares (RegExp)",
        MP_BLOCKED_RE: "Expressões regulares (RegExp)",
        PP_BLOCKED_RE: "Expressões regulares (RegExp)",
        DLG_VERBOSITY: "Opções para postagens ocultas",
        DLG_PREFERENCES: "Preferências",
        DLG_PREFERENCES_DESC: "Rótulos, posição, cores e idioma.",
        DLG_REPORT_BUG: "Reportar bug",
        DLG_REPORT_BUG_DESC: "Gere um relatório de diagnóstico.",
        DLG_REPORT_BUG_NOTICE: "Ajude-nos a corrigir:\n1. Role para que a postagem problemática fique visível.\n2. Clique em 'Gerar relatório' e depois em 'Copiar relatório'.\n3. Clique em 'Abrir issues' e cole o relatório em uma nova issue.\n4. Adicione uma breve descrição do problema.\n(Ocultamos nomes/texto, mas revise antes de compartilhar!)",
        DLG_REPORT_BUG_GENERATE: "Gerar relatório",
        DLG_REPORT_BUG_COPY: "Copiar relatório",
        DLG_REPORT_BUG_OPEN_ISSUES: "Abrir issues",
        DLG_REPORT_BUG_STATUS_READY: "Relatório pronto.",
        DLG_REPORT_BUG_STATUS_COPIED: "Relatório copiado para a área de transferência.",
        DLG_REPORT_BUG_STATUS_FAILED: "Falha ao copiar. Copie manualmente.",
        DLG_VERBOSITY_CAPTION: "Mostrar um rótulo se uma postagem estiver oculta",
        VERBOSITY_MESSAGE: [
          "sem rótulo",
          "Postagem oculta. Regra: ",
          " postagens ocultas",
          "7 postagens ocultas ~ (apenas no Feed de Grupos)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Cor do texto",
        VERBOSITY_MESSAGE_BG_COLOUR: "Cor de fundo",
        VERBOSITY_DEBUG: 'Destacar postagens "ocultas"',
        CMF_CUSTOMISATIONS: "Personalizações",
        CMF_BTN_LOCATION: "Localização do botão CMF:",
        CMF_BTN_OPTION: [
          "inferior esquerdo",
          "superior direito",
          'desativado (use "Configurações" no menu Comandos de script do usuário)'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Idioma do Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "Português",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Usar idioma do site",
        GM_MENU_SETTINGS: "Configurações",
        CMF_DIALOG_LOCATION: "Localização deste menu:",
        CMF_DIALOG_OPTION: ["lado esquerdo", "lado direito"],
        CMF_BORDER_COLOUR: "Cor da borda",
        DLG_TIPS: "Sobre",
        DLG_TIPS_DESC: "Links do projeto e info do mantenedor.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Se isso ajudar, uma estrela no {github} significa muito.",
        DLG_TIPS_THREADS: "Se você também usa o Threads no desktop, eu também mantenho um filtro para isso: {threads}.",
        DLG_TIPS_FACEBOOK: "Diga oi na {facebook} - lá compartilho minha arte e poesia.",
        DLG_TIPS_SITE: "Se quiser ver o que ando fazendo pela web, {site} é o melhor lugar para começar.",
        DLG_TIPS_CREDITS: "Agradecimento especial a {zbluebugz} pelo projeto original e a {trinhquocviet} pela ajuda na manutenção dos filtros em 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "Do mantenedor:",
        DLG_TIPS_MAINTAINER: "Espero que este script ajude você a recuperar o seu feed. Prometo ser seu aliado na luta contra o que você não quer ver online.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "minha página do Facebook",
        DLG_TIPS_LINK_SITE: "meu site",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Salvar", "Fechar", "Exportar", "Importar", "Redefinir"],
        DLG_BUTTON_TOOLTIPS: [
          "Salva mudanças neste navegador. Limpar dados/modo privado remove.",
          "Exporta um arquivo de backup para manter e mover entre dispositivos.",
          "Importa um arquivo de configurações para restaurar ou transferir.",
          "Redefine todas as configurações para o padrão."
        ],
        DLG_FB_COLOUR_HINT: "Deixe em branco para usar o esquema de cores do FB"
      };
    }
  });

  // src/i18n/locales/ru.ts
  var catalog18;
  var init_ru = __esm({
    "src/i18n/locales/ru.ts"() {
      "use strict";
      catalog18 = {
        DLG_REGEX_ERROR: "{field}, строка {line}: недопустимое регулярное выражение для {feed}. Исправьте его или отключите регулярные выражения для этой ленты.",
        DLG_REGEX_IMPORT_ERROR: "Импорт отклонён. Текущие настройки сохранены.",
        DLG_REGEX_SAVED_ERROR: "Недопустимое сохранённое регулярное выражение пропущено. Остальные фильтры продолжают работать.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Реклама",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Список вкладок "Истории | Reels | Комнаты"',
        NF_STORIES: "Истории",
        NF_TOP_CARDS_PAGES: "Верхние карточки (для Страниц)",
        NF_META_AI: "Попробуйте Meta AI",
        NF_META_AI_PROMPTS: "Подсказки запросов Meta AI",
        NF_AI_INFO_POSTS: 'Публикации с меткой "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Скрыть значки подтверждения",
        NF_FILTER_VERIFIED_BADGE: "Фильтровать подтвержденные аккаунты",
        NF_AI_SIDE_PANELS: "ИИ в боковых панелях",
        NF_SURVEY: "Опрос",
        NF_PEOPLE_YOU_MAY_KNOW: "Люди, которых вы можете знать",
        NF_PAID_PARTNERSHIP: "Платное партнерство",
        NF_SPONSORED_PAID: "Реклама · Оплачено ______",
        NF_SUGGESTIONS: "Предложения / Рекомендации",
        NF_FOLLOW: "Подписаться",
        NF_PARTICIPATE: "Участвовать",
        NF_REELS_SHORT_VIDEOS: "Reels и короткие видео",
        NF_SHORT_REEL_VIDEO: "Reels/короткое видео",
        NF_EVENTS_YOU_MAY_LIKE: "Мероприятия, которые вам могут понравиться",
        NF_ANIMATED_GIFS_POSTS: "Анимированные GIF-файлы",
        NF_ANIMATED_GIFS_PAUSE: "Приостановить анимированные GIF",
        NF_SHARES: "# поделились",
        NF_LIKES_MAXIMUM: "Максимальное количество «Нравится»",
        GF_PAID_PARTNERSHIP: "Платное партнерство",
        GF_SUGGESTIONS: "Предложения / Рекомендации",
        GF_SHORT_REEL_VIDEO: "Reel/короткое видео",
        GF_ANIMATED_GIFS_POSTS: "Анимированные GIF-файлы",
        GF_ANIMATED_GIFS_PAUSE: "Приостановить анимированные GIF",
        GF_SHARES: "# поделились",
        VF_LIVE: "В ЭФИРЕ",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Дубликат видео",
        VF_ANIMATED_GIFS_PAUSE: "Приостановить анимированные GIF",
        PP_ANIMATED_GIFS_POSTS: "Анимированные GIF-файлы",
        PP_ANIMATED_GIFS_PAUSE: "Приостановить анимированные GIF",
        NF_BLOCKED_FEED: ["Лента новостей", "Лента групп", "Лента видео"],
        GF_BLOCKED_FEED: ["Лента новостей", "Лента групп", "Лента видео"],
        VF_BLOCKED_FEED: ["Лента новостей", "Лента групп", "Лента видео"],
        MP_BLOCKED_FEED: ["Лента Marketplace"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Коронавирус (информационное окно)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Наука о климате (информационное окно)",
        OTHER_INFO_BOX_SUBSCRIBE: "Подписаться (информационное окно)",
        REELS_TITLE: "Видео Reels",
        DLG_REELS_DESC: "Управление воспроизведением и циклом.",
        REELS_CONTROLS: "Показать элементы управления видео",
        REELS_DISABLE_LOOPING: "Отключить повторение",
        DLG_TITLE: "Очистить мои новостные ленты",
        DLG_NF: "Лента новостей",
        DLG_NF_DESC: "Уберите лишние рекомендации и задайте строгость ленты.",
        DLG_GF: "Лента групп",
        DLG_GF_DESC: "Приведите ленты групп в порядок, убрав лишнее и шум.",
        DLG_VF: "Лента видео",
        DLG_VF_DESC: "Сделайте ленту видео чище, уменьшая повторы и шум.",
        DLG_MP: "Лента Marketplace",
        DLG_MP_DESC: "Фильтруйте объявления по цене и ключевым словам.",
        DLG_PP: "Профиль / Страница",
        DLG_PP_DESC: "Настройте, что показывается в профилях и страницах.",
        DLG_OTHER: "Дополнительные заметки",
        DLG_OTHER_DESC: "Скройте дополнительные блоки, которые вам не нужны.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Текстовый фильтр",
        DLG_BLOCK_NEW_LINE: "(Разделяйте слова или фразы с помощью разрыва строки, поддерживаются регулярные выражения)",
        NF_BLOCKED_ENABLED: "Включено",
        GF_BLOCKED_ENABLED: "Включено",
        VF_BLOCKED_ENABLED: "Включено",
        MP_BLOCKED_ENABLED: "Включено",
        PP_BLOCKED_ENABLED: "Включено",
        NF_BLOCKED_RE: "Регулярные выражения (RegExp)",
        GF_BLOCKED_RE: "Регулярные выражения (RegExp)",
        VF_BLOCKED_RE: "Регулярные выражения (RegExp)",
        MP_BLOCKED_RE: "Регулярные выражения (RegExp)",
        PP_BLOCKED_RE: "Регулярные выражения (RegExp)",
        DLG_VERBOSITY: "Настройки скрытых публикаций",
        DLG_PREFERENCES: "Настройки",
        DLG_PREFERENCES_DESC: "Метки, расположение, цвета и язык.",
        DLG_REPORT_BUG: "Сообщить об ошибке",
        DLG_REPORT_BUG_DESC: "Создайте диагностический отчёт.",
        DLG_REPORT_BUG_NOTICE: "Помогите нам исправить это:\n1. Прокрутите так, чтобы проблемный пост был виден.\n2. Нажмите «Создать отчёт», затем «Копировать отчёт».\n3. Нажмите «Открыть задачи» и вставьте отчёт в новую задачу.\n4. Добавьте краткое описание проблемы.\n(Мы скрываем имена/текст, но пожалуйста, проверьте перед отправкой!)",
        DLG_REPORT_BUG_GENERATE: "Создать отчёт",
        DLG_REPORT_BUG_COPY: "Копировать отчёт",
        DLG_REPORT_BUG_OPEN_ISSUES: "Открыть задачи",
        DLG_REPORT_BUG_STATUS_READY: "Отчёт готов.",
        DLG_REPORT_BUG_STATUS_COPIED: "Отчёт скопирован в буфер.",
        DLG_REPORT_BUG_STATUS_FAILED: "Не удалось скопировать. Скопируйте вручную.",
        DLG_VERBOSITY_CAPTION: "Показать ярлык, если запись скрыта",
        VERBOSITY_MESSAGE: [
          "нет ярлыка",
          "Пост скрыт. Правило: ",
          " постов скрыто",
          "7 постов скрыто ~ (только в Ленте Групп)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Цвет текста",
        VERBOSITY_MESSAGE_BG_COLOUR: "Цвет фона",
        VERBOSITY_DEBUG: "Выделить «скрытые» посты",
        CMF_CUSTOMISATIONS: "Настройки",
        CMF_BTN_LOCATION: "Расположение кнопки CMF:",
        CMF_BTN_OPTION: [
          "внизу слева",
          "вверху справа",
          "отключено (используйте «Настройки» в меню «Пользовательские команды скрипта»)"
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Язык Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "Русский",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Использовать язык сайта",
        GM_MENU_SETTINGS: "Настройки",
        CMF_DIALOG_LOCATION: "Расположение этого меню:",
        CMF_DIALOG_OPTION: ["левая сторона", "правая сторона"],
        CMF_BORDER_COLOUR: "Цвет границы",
        DLG_TIPS: "О проекте",
        DLG_TIPS_DESC: "Ссылки проекта и информация о сопровождающем.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Если это помогает, звезда на {github} очень многое для меня значит.",
        DLG_TIPS_THREADS: "Если вы тоже пользуетесь Threads на компьютере, я поддерживаю и для него фильтр: {threads}.",
        DLG_TIPS_FACEBOOK: "Загляните на {facebook} - там я делюсь искусством и поэзией.",
        DLG_TIPS_SITE: "Если хотите увидеть, чем я занимаюсь в сети, {site} — лучшее место начать.",
        DLG_TIPS_CREDITS: "Особая благодарность {zbluebugz} за оригинальный проект и {trinhquocviet} за помощь с поддержкой фильтров в 2025 году.",
        DLG_TIPS_MAINTAINER_PREFIX: "От сопровождающего:",
        DLG_TIPS_MAINTAINER: "Надеюсь, этот скрипт поможет вам вернуть свою ленту. Я обещаю быть вашим союзником в борьбе с тем, что вы не хотите видеть в сети.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "мою страницу на Facebook",
        DLG_TIPS_LINK_SITE: "мой сайт",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Сохранить", "Закрыть", "Экспорт", "Импорт", "Сброс"],
        DLG_BUTTON_TOOLTIPS: [
          "Сохраняет изменения в этом браузере. Очистка данных/инкогнито удалит их.",
          "Экспортирует файл-резерв для сохранения и переноса между устройствами.",
          "Импортирует файл настроек для восстановления или переноса.",
          "Сбрасывает все настройки к значениям по умолчанию."
        ],
        DLG_FB_COLOUR_HINT: "Оставьте пустым, чтобы использовать цветовую схему FB"
      };
    }
  });

  // src/i18n/locales/tr.ts
  var catalog19;
  var init_tr = __esm({
    "src/i18n/locales/tr.ts"() {
      "use strict";
      catalog19 = {
        DLG_REGEX_ERROR: "{field}, satır {line}: {feed} için geçersiz düzenli ifade. İfadeyi düzeltin veya bu akış için düzenli ifade eşleştirmesini kapatın.",
        DLG_REGEX_IMPORT_ERROR: "İçe aktarma reddedildi. Mevcut ayarlarınız korundu.",
        DLG_REGEX_SAVED_ERROR: "Kaydedilmiş geçersiz bir düzenli ifade atlandı. Diğer filtreler etkin kalır.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Sponsorlu",
        NF_TABLIST_STORIES_REELS_ROOMS: '"Hikayeler | Makaralar | Odalar" sekmeleri liste kutusu',
        NF_STORIES: "Hikayeler",
        NF_TOP_CARDS_PAGES: "Üst kartlar (Sayfalar için)",
        NF_META_AI: "Meta AI'yi dene",
        NF_META_AI_PROMPTS: "Meta AI istem önerileri",
        NF_AI_INFO_POSTS: '"AI info" etiketi taşıyan gönderiler',
        NF_HIDE_VERIFIED_BADGE: "Doğrulanmış rozetleri gizle",
        NF_FILTER_VERIFIED_BADGE: "Doğrulanmış hesapları filtrele",
        NF_AI_SIDE_PANELS: "Yan panellerde Yapay Zeka",
        NF_SURVEY: "Anket",
        NF_PEOPLE_YOU_MAY_KNOW: "Tanıyor olabileceğin kişiler",
        NF_PAID_PARTNERSHIP: "ücretli ortaklık",
        NF_SPONSORED_PAID: "Sponsorlu · ______ tarafından ödendi",
        NF_SUGGESTIONS: "Öneriler",
        NF_FOLLOW: "Takip Et",
        NF_PARTICIPATE: "Katılmak",
        NF_REELS_SHORT_VIDEOS: "Makaralar ve kısa videolar",
        NF_SHORT_REEL_VIDEO: "makara/kısa video",
        NF_EVENTS_YOU_MAY_LIKE: "İlgini çekebilecek etkinlikler",
        NF_ANIMATED_GIFS_POSTS: "Animasyonlu GIF'ler",
        NF_ANIMATED_GIFS_PAUSE: "Hareketli GIF'leri duraklat",
        NF_SHARES: "# Paylaşım",
        NF_LIKES_MAXIMUM: "Maksimum Beğeni sayısı",
        GF_PAID_PARTNERSHIP: "ücretli ortaklık",
        GF_SUGGESTIONS: "Öneriler",
        GF_SHORT_REEL_VIDEO: "makara/kısa video",
        GF_ANIMATED_GIFS_POSTS: "Animasyonlu GIF'ler",
        GF_ANIMATED_GIFS_PAUSE: "Hareketli GIF'leri duraklat",
        GF_SHARES: "# Paylaşım",
        VF_LIVE: "CANLI",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Çift video",
        VF_ANIMATED_GIFS_PAUSE: "Hareketli GIF'leri duraklat",
        PP_ANIMATED_GIFS_POSTS: "Animasyonlu GIF'ler",
        PP_ANIMATED_GIFS_PAUSE: "Hareketli GIF'leri duraklat",
        NF_BLOCKED_FEED: ["Haber akışı", "Gruplar Feed'i", "Video Beslemelerini İzle"],
        GF_BLOCKED_FEED: ["Haber akışı", "Gruplar Feed'i", "Video Beslemelerini İzle"],
        VF_BLOCKED_FEED: ["Haber akışı", "Gruplar Feed'i", "Video Beslemelerini İzle"],
        MP_BLOCKED_FEED: ["Pazar Yeri Feed'i"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Koronavirüs (bilgi kutusu)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "İklim Bilimi (bilgi kutusu)",
        OTHER_INFO_BOX_SUBSCRIBE: "Abone ol (bilgi kutusu)",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "Oynatma ve döngü kontrolleri.",
        REELS_CONTROLS: "Video kontrollerini göster",
        REELS_DISABLE_LOOPING: "Döngüyü devre dışı bırak",
        DLG_TITLE: "Feed'lerimi temizle",
        DLG_NF: "Haber akışı",
        DLG_NF_DESC: "Önerileri temizleyin ve akışın ne kadar sıkı olacağını ayarlayın.",
        DLG_GF: "Gruplar Feed'i",
        DLG_GF_DESC: "Grup akışlarını düzenleyerek fazlalıkları ve gürültüyü azaltın.",
        DLG_VF: "Video Beslemelerini İzle",
        DLG_VF_DESC: "Video akışını tekrar ve karmaşayı azaltarak odaklı tutun.",
        DLG_MP: "Pazar Yeri Feed'i",
        DLG_MP_DESC: "İlanları fiyat ve anahtar kelimelere göre filtreleyin.",
        DLG_PP: "Profil / Sayfa",
        DLG_PP_DESC: "Profil ve sayfalarda görünenleri ayarlayın.",
        DLG_OTHER: "Ek Notlar",
        DLG_OTHER_DESC: "İstemediğiniz ek kutuları gizleyin.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Metin filtresi",
        DLG_BLOCK_NEW_LINE: "(Kelimeleri veya ifadeleri satır sonu ile ayırın, Düzenli İfadeler desteklenir)",
        NF_BLOCKED_ENABLED: "Etkinleştirildi",
        GF_BLOCKED_ENABLED: "Etkinleştirildi",
        VF_BLOCKED_ENABLED: "Etkinleştirildi",
        MP_BLOCKED_ENABLED: "Etkinleştirildi",
        PP_BLOCKED_ENABLED: "Etkinleştirildi",
        NF_BLOCKED_RE: "Düzenli İfadeler (RegExp)",
        GF_BLOCKED_RE: "Düzenli İfadeler (RegExp)",
        VF_BLOCKED_RE: "Düzenli İfadeler (RegExp)",
        MP_BLOCKED_RE: "Düzenli İfadeler (RegExp)",
        PP_BLOCKED_RE: "Düzenli İfadeler (RegExp)",
        DLG_VERBOSITY: "Gizli Gönderi Seçenekleri",
        DLG_PREFERENCES: "Tercihler",
        DLG_PREFERENCES_DESC: "Etiketler, konum, renkler ve dil.",
        DLG_REPORT_BUG: "Hata bildir",
        DLG_REPORT_BUG_DESC: "Sorunlar için tanılama raporu oluştur.",
        DLG_REPORT_BUG_NOTICE: "Düzeltmemize yardım edin:\n1. Sorunlu gönderi görünür olacak şekilde kaydırın.\n2. 'Rapor oluştur'a ve ardından 'Raporu kopyala'ya tıklayın.\n3. 'Sorunları aç'a tıklayın ve raporu yeni bir soruna yapıştırın.\n4. Sorunun kısa bir açıklamasını ekleyin.\n(İsimleri/metinleri gizliyoruz, ancak paylaşmadan önce lütfen kontrol edin!)",
        DLG_REPORT_BUG_GENERATE: "Rapor oluştur",
        DLG_REPORT_BUG_COPY: "Raporu kopyala",
        DLG_REPORT_BUG_OPEN_ISSUES: "Sorunları aç",
        DLG_REPORT_BUG_STATUS_READY: "Rapor hazır.",
        DLG_REPORT_BUG_STATUS_COPIED: "Rapor panoya kopyalandı.",
        DLG_REPORT_BUG_STATUS_FAILED: "Kopyalama başarısız. Elle kopyalayın.",
        DLG_VERBOSITY_CAPTION: "Bir gönderi gizlenmişse bir etiket göster",
        VERBOSITY_MESSAGE: [
          "etiket yok",
          "Gönderi gizlendi. Kural: ",
          " gönderi gizlendi",
          "7 gönderi gizlendi ~ (yalnızca Grup Beslemesi)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Metin rengi",
        VERBOSITY_MESSAGE_BG_COLOUR: "Arka plan rengi",
        VERBOSITY_DEBUG: '"Gizli" gönderileri vurgulayın',
        CMF_CUSTOMISATIONS: "özelleştirmeler",
        CMF_BTN_LOCATION: "CMF düğmesinin konumu:",
        CMF_BTN_OPTION: [
          "sol alt",
          "sağ üst",
          'devre dışı (Kullanıcı Komut Dosyası Komutları menüsünde "Ayarlar"ı kullanın)'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds dili:",
        CMF_DIALOG_LANGUAGE: "Türkçe",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Site dilini kullan",
        GM_MENU_SETTINGS: "Ayarlar",
        CMF_DIALOG_LOCATION: "Bu menünün konumu:",
        CMF_DIALOG_OPTION: ["sol yan", "sağ yan"],
        CMF_BORDER_COLOUR: "Kenarlık rengi",
        DLG_TIPS: "Hakkında",
        DLG_TIPS_DESC: "Proje bağlantıları ve bakım sorumlusu bilgisi.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Bu işe yararsa, {github} üzerinde bir yıldız çok şey ifade eder.",
        DLG_TIPS_THREADS: "Threads'i masaüstünde de kullanıyorsanız, onun için de bakımını yaptığım bir filtre var: {threads}.",
        DLG_TIPS_FACEBOOK: "{facebook} uğrayıp selam verin - orada sanatımı ve şiirimi paylaşıyorum.",
        DLG_TIPS_SITE: "Webde neler yaptığımı görmek isterseniz, {site} en iyi başlangıç.",
        DLG_TIPS_CREDITS: "Orijinal proje için {zbluebugz}'a ve 2025 yılında filtre bakımına yardımcı olduğu için {trinhquocviet}'e özel teşekkürler.",
        DLG_TIPS_MAINTAINER_PREFIX: "Geliştiriciden:",
        DLG_TIPS_MAINTAINER: "Bu betiğin feed’inizi geri almanıza yardımcı olmasını umuyorum. İnternette görmek istemediğiniz şeylere karşı müttefikiniz olacağıma söz veriyorum.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "Facebook sayfam",
        DLG_TIPS_LINK_SITE: "web sitem",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Kaydetmek", "Kapat", "İhracat", "İçe aktarmak", "Sıfırla"],
        DLG_BUTTON_TOOLTIPS: [
          "Değişiklikleri bu tarayıcıya kaydeder. Veri temizleme/gizli mod siler.",
          "Ayarları korumak ve taşımak için yedek dosyası dışa aktarır.",
          "Ayar dosyasını içe aktarır; geri yükleme veya taşıma için.",
          "Tüm ayarları varsayılana döndürür."
        ],
        DLG_FB_COLOUR_HINT: "FB'un renk düzenini kullanmak için boş bırakın"
      };
    }
  });

  // src/i18n/locales/uk.ts
  var catalog20;
  var init_uk = __esm({
    "src/i18n/locales/uk.ts"() {
      "use strict";
      catalog20 = {
        DLG_REGEX_ERROR: "{field}, рядок {line}: некоректний регулярний вираз для {feed}. Виправте його або вимкніть регулярні вирази для цієї стрічки.",
        DLG_REGEX_IMPORT_ERROR: "Імпорт відхилено. Поточні налаштування збережено.",
        DLG_REGEX_SAVED_ERROR: "Некоректний збережений регулярний вираз пропущено. Інші фільтри залишаються активними.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Спонсорована",
        NF_TABLIST_STORIES_REELS_ROOMS: "Поле списку вкладок «Історії | Reels | Кімнати»",
        NF_STORIES: "Історії",
        NF_TOP_CARDS_PAGES: "Верхні картки (для Сторінок)",
        NF_META_AI: "Спробувати Meta AI",
        NF_META_AI_PROMPTS: "Підказки запитів Meta AI",
        NF_AI_INFO_POSTS: 'Дописи з міткою "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Приховати значки підтвердження",
        NF_FILTER_VERIFIED_BADGE: "Фільтрувати підтверджені облікові записи",
        NF_AI_SIDE_PANELS: "ШІ в бічних панелях",
        NF_SURVEY: "Опитування",
        NF_PEOPLE_YOU_MAY_KNOW: "Люди, яких Ви можете знати",
        NF_PAID_PARTNERSHIP: "Оплачуване партнерство",
        NF_SPONSORED_PAID: "Спонсоровано · Оплачено ______",
        NF_SUGGESTIONS: "Пропозиції / Рекомендації",
        NF_FOLLOW: "Слідуйте",
        NF_PARTICIPATE: "Беріть участь",
        NF_REELS_SHORT_VIDEOS: "Відео Reels і короткі відео",
        NF_SHORT_REEL_VIDEO: "Reel/коротке відео",
        NF_EVENTS_YOU_MAY_LIKE: "Події, які можуть вам сподобатися",
        NF_ANIMATED_GIFS_POSTS: "Анімовані GIF-файли",
        NF_ANIMATED_GIFS_PAUSE: "Призупинити анімовані GIF-файли",
        NF_SHARES: "# Поширити",
        NF_LIKES_MAXIMUM: "Максимальна кількість «Подобається».",
        GF_PAID_PARTNERSHIP: "Оплачуване партнерство",
        GF_SUGGESTIONS: "Пропозиції / Рекомендації",
        GF_SHORT_REEL_VIDEO: "Reel/коротке відео",
        GF_ANIMATED_GIFS_POSTS: "Анімовані GIF-файли",
        GF_ANIMATED_GIFS_PAUSE: "Призупинити анімовані GIF-файли",
        GF_SHARES: "# Поширити",
        VF_LIVE: "ЕФІР",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Дубльоване відео",
        VF_ANIMATED_GIFS_PAUSE: "Призупинити анімовані GIF-файли",
        PP_ANIMATED_GIFS_POSTS: "Анімовані GIF-файли",
        PP_ANIMATED_GIFS_PAUSE: "Призупинити анімовані GIF-файли",
        NF_BLOCKED_FEED: ["Стрічка новин", "Стрічка Групи", "Стрічка відео"],
        GF_BLOCKED_FEED: ["Стрічка новин", "Стрічка Групи", "Стрічка відео"],
        VF_BLOCKED_FEED: ["Стрічка новин", "Стрічка Групи", "Стрічка відео"],
        MP_BLOCKED_FEED: ["Стрічка Marketplace"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Коронавірус (інформаційне вікно)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Наука про клімат (інформаційне вікно)",
        OTHER_INFO_BOX_SUBSCRIBE: "Підписатися (інформаційне вікно)",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "Керування відтворенням і циклом.",
        REELS_CONTROLS: "Відображення елементів керування відео",
        REELS_DISABLE_LOOPING: "Вимкнути повторення",
        DLG_TITLE: "Очистити мої стрічки",
        DLG_NF: "Стрічка новин",
        DLG_NF_DESC: "Приберіть рекомендації та задайте суворість стрічки.",
        DLG_GF: "Стрічка Групи",
        DLG_GF_DESC: "Упорядкуйте стрічки груп, прибравши зайве й шум.",
        DLG_VF: "Стрічка відео",
        DLG_VF_DESC: "Зробіть відеострічку чистішою, зменшивши повтори й безлад.",
        DLG_MP: "Стрічка Marketplace",
        DLG_MP_DESC: "Фільтруйте оголошення за ціною та ключовими словами.",
        DLG_PP: "Профіль / Сторінка",
        DLG_PP_DESC: "Налаштуйте, що показується в профілях і сторінках.",
        DLG_OTHER: "Додаткові нотатки",
        DLG_OTHER_DESC: "Сховайте зайві блоки, які не хочете.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Текстовий фільтр",
        DLG_BLOCK_NEW_LINE: "(Розділяйте слова або фрази розривом рядка, регулярні вирази підтримуються)",
        NF_BLOCKED_ENABLED: "Увімкнено",
        GF_BLOCKED_ENABLED: "Увімкнено",
        VF_BLOCKED_ENABLED: "Увімкнено",
        MP_BLOCKED_ENABLED: "Увімкнено",
        PP_BLOCKED_ENABLED: "Увімкнено",
        NF_BLOCKED_RE: "Регулярні вирази (RegExp)",
        GF_BLOCKED_RE: "Регулярні вирази (RegExp)",
        VF_BLOCKED_RE: "Регулярні вирази (RegExp)",
        MP_BLOCKED_RE: "Регулярні вирази (RegExp)",
        PP_BLOCKED_RE: "Регулярні вирази (RegExp)",
        DLG_VERBOSITY: "Параметри прихованих дописів",
        DLG_PREFERENCES: "Налаштування",
        DLG_PREFERENCES_DESC: "Мітки, розташування, кольори та мова.",
        DLG_REPORT_BUG: "Повідомити про помилку",
        DLG_REPORT_BUG_DESC: "Створіть діагностичний звіт.",
        DLG_REPORT_BUG_NOTICE: "Допоможіть нам це виправити:\n1. Прокрутіть так, щоб проблемний допис було видно.\n2. Натисніть «Створити звіт», а потім «Копіювати звіт».\n3. Натисніть «Відкрити звернення» та вставте звіт у нове звернення.\n4. Додайте короткий опис проблеми.\n(Ми приховуємо імена/текст, але, будь ласка, перевірте перед надсиланням!)",
        DLG_REPORT_BUG_GENERATE: "Створити звіт",
        DLG_REPORT_BUG_COPY: "Копіювати звіт",
        DLG_REPORT_BUG_OPEN_ISSUES: "Відкрити звернення",
        DLG_REPORT_BUG_STATUS_READY: "Звіт готовий.",
        DLG_REPORT_BUG_STATUS_COPIED: "Звіт скопійовано до буфера.",
        DLG_REPORT_BUG_STATUS_FAILED: "Не вдалося скопіювати. Скопіюйте вручну.",
        DLG_VERBOSITY_CAPTION: "Відображати мітку, якщо публікація прихована",
        VERBOSITY_MESSAGE: [
          "жодної мітки",
          "Допис прихований. Правило: ",
          " дописи приховано",
          "7 дописи приховано ~ (лише в стрічці Груп)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Колір тексту",
        VERBOSITY_MESSAGE_BG_COLOUR: "Колір фону",
        VERBOSITY_DEBUG: "«Виділяти «приховані» дописи»",
        CMF_CUSTOMISATIONS: "Налаштування",
        CMF_BTN_LOCATION: "Розташування кнопки CMF:",
        CMF_BTN_OPTION: [
          "внизу ліворуч",
          "вгорі праворуч",
          "вимкнено (використовуйте «Параметри» в меню команд сценарію користувача»)"
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Мова Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "Українська",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Використовувати мову сайту",
        GM_MENU_SETTINGS: "Параметри",
        CMF_DIALOG_LOCATION: "Розташування цього меню:",
        CMF_DIALOG_OPTION: ["ліва сторона", "права сторона"],
        CMF_BORDER_COLOUR: "Колір кордону",
        DLG_TIPS: "Про проєкт",
        DLG_TIPS_DESC: "Посилання проєкту та інформація про супровідника.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Якщо це допомагає, зірка на {github} дуже багато для мене означає.",
        DLG_TIPS_THREADS: "Якщо ви теж користуєтеся Threads на комп’ютері, я підтримую фільтр і для нього: {threads}.",
        DLG_TIPS_FACEBOOK: "Завітайте на {facebook} - там я ділюся мистецтвом і поезією.",
        DLG_TIPS_SITE: "Якщо хочете побачити, чим я займаюся в мережі, {site} — найкраще місце почати.",
        DLG_TIPS_CREDITS: "Окрема подяка {zbluebugz} за оригінальний проєкт і {trinhquocviet} за допомогу з підтримкою фільтрів у 2025 році.",
        DLG_TIPS_MAINTAINER_PREFIX: "Від супровідника:",
        DLG_TIPS_MAINTAINER: "Сподіваюся, цей скрипт допоможе вам повернути свою стрічку. Обіцяю бути вашим союзником у боротьбі з тим, що ви не хочете бачити онлайн.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "мою сторінку у Facebook",
        DLG_TIPS_LINK_SITE: "мій сайт",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Зберегти", "Закрити", "Експорт", "Імпорт", "Скинути"],
        DLG_BUTTON_TOOLTIPS: [
          "Зберігає зміни в цьому браузері. Очищення даних/інкогніто їх видалить.",
          "Експортує файл-резерв для збереження і перенесення між пристроями.",
          "Імпортує файл налаштувань для відновлення або перенесення.",
          "Скидає всі налаштування до типових."
        ],
        DLG_FB_COLOUR_HINT: "Залиште порожнім, щоб використовувати колірну схему FB"
      };
    }
  });

  // src/i18n/locales/vi.ts
  var catalog21;
  var init_vi = __esm({
    "src/i18n/locales/vi.ts"() {
      "use strict";
      catalog21 = {
        DLG_REGEX_ERROR: "{field}, dòng {line}: biểu thức chính quy không hợp lệ cho {feed}. Hãy sửa hoặc tắt chế độ khớp bằng biểu thức chính quy cho bảng tin đó.",
        DLG_REGEX_IMPORT_ERROR: "Đã từ chối nhập. Các cài đặt hiện tại của bạn được giữ nguyên.",
        DLG_REGEX_SAVED_ERROR: "Đã bỏ qua một biểu thức chính quy đã lưu không hợp lệ. Các bộ lọc khác vẫn hoạt động.",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "Được tài trợ",
        NF_TABLIST_STORIES_REELS_ROOMS: 'Hộp danh sách tab "Tin | Reels | Phòng họp mặt"',
        NF_STORIES: "Tin",
        NF_TOP_CARDS_PAGES: "Thẻ trên cùng (cho Trang)",
        NF_META_AI: "Thử Meta AI",
        NF_META_AI_PROMPTS: "Gợi ý prompt của Meta AI",
        NF_AI_INFO_POSTS: 'Bài viết có nhãn "AI info"',
        NF_HIDE_VERIFIED_BADGE: "Ẩn huy hiệu đã xác minh",
        NF_FILTER_VERIFIED_BADGE: "Lọc tài khoản đã xác minh",
        NF_AI_SIDE_PANELS: "AI ở bảng bên",
        NF_SURVEY: "Khảo sát",
        NF_PEOPLE_YOU_MAY_KNOW: "Những người bạn có thể biết",
        NF_PAID_PARTNERSHIP: "Mối quan hệ tài trợ",
        NF_SPONSORED_PAID: "Được tài trợ · Tài trợ bởi ______",
        NF_SUGGESTIONS: "Đề xuất / Khuyến nghị",
        NF_FOLLOW: "Theo dõi",
        NF_PARTICIPATE: "Tham gia",
        NF_REELS_SHORT_VIDEOS: "Reels và video ngắn",
        NF_SHORT_REEL_VIDEO: "Reel / video ngắn",
        NF_EVENTS_YOU_MAY_LIKE: "Sự kiện bạn có thể thích",
        NF_ANIMATED_GIFS_POSTS: "GIF động",
        NF_ANIMATED_GIFS_PAUSE: "Tạm dừng các ảnh GIF động",
        NF_SHARES: "# lượt chia sẻ",
        NF_LIKES_MAXIMUM: "Số lượt thích tối đa",
        GF_PAID_PARTNERSHIP: "Mối quan hệ tài trợ",
        GF_SUGGESTIONS: "Đề xuất / Khuyến nghị",
        GF_SHORT_REEL_VIDEO: "Reel / video ngắn",
        GF_ANIMATED_GIFS_POSTS: "GIF động",
        GF_ANIMATED_GIFS_PAUSE: "Tạm dừng các ảnh GIF động",
        GF_SHARES: "# lượt chia sẻ",
        VF_LIVE: "TRỰC TIẾP",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "Video trùng lặp",
        VF_ANIMATED_GIFS_PAUSE: "Tạm dừng các ảnh GIF động",
        PP_ANIMATED_GIFS_POSTS: "GIF động",
        PP_ANIMATED_GIFS_PAUSE: "Tạm dừng các ảnh GIF động",
        NF_BLOCKED_FEED: ["Nguồn cấp tin tức", "Nguồn cấp dữ liệu Nhóm", "Nguồn cấp dữ liệu video"],
        GF_BLOCKED_FEED: ["Nguồn cấp tin tức", "Nguồn cấp dữ liệu Nhóm", "Nguồn cấp dữ liệu video"],
        VF_BLOCKED_FEED: ["Nguồn cấp tin tức", "Nguồn cấp dữ liệu Nhóm", "Nguồn cấp dữ liệu video"],
        MP_BLOCKED_FEED: ["Nguồn cấp dữ liệu Marketplace"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "Virus corona (hộp thông tin)",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "Khoa học khí hậu (hộp thông tin)",
        OTHER_INFO_BOX_SUBSCRIBE: "Đăng kí (hộp thông tin)",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "Điều khiển phát và lặp.",
        REELS_CONTROLS: "Hiển thị điều khiển video",
        REELS_DISABLE_LOOPING: "Tắt lặp lại",
        DLG_TITLE: "Làm sạch nguồn cấp dữ liệu của tôi",
        DLG_NF: "Nguồn cấp tin tức",
        DLG_NF_DESC: "Dọn gợi ý và đặt mức độ nghiêm khắc của bảng tin.",
        DLG_GF: "Nguồn cấp dữ liệu Nhóm",
        DLG_GF_DESC: "Dọn gọn bảng tin nhóm bằng cách giảm phần thừa và nhiễu.",
        DLG_VF: "Nguồn cấp dữ liệu video",
        DLG_VF_DESC: "Giữ bảng tin video gọn bằng cách giảm lặp lại và lộn xộn.",
        DLG_MP: "Nguồn cấp dữ liệu Marketplace",
        DLG_MP_DESC: "Lọc danh sách theo giá và từ khóa.",
        DLG_PP: "Hồ sơ / Trang",
        DLG_PP_DESC: "Chỉnh những gì hiển thị trên hồ sơ và trang.",
        DLG_OTHER: "Ghi chú bổ sung",
        DLG_OTHER_DESC: "Ẩn các hộp bổ sung mà bạn không muốn.",
        DLG_BLOCK_TEXT_FILTER_TITLE: "Bộ lọc văn bản",
        DLG_BLOCK_NEW_LINE: "(Ngăn cách từ hoặc cụm từ bằng dấu xuống dòng, Biểu thức chính quy được hỗ trợ)",
        NF_BLOCKED_ENABLED: "Đã kích hoạt",
        GF_BLOCKED_ENABLED: "Đã kích hoạt",
        VF_BLOCKED_ENABLED: "Đã kích hoạt",
        MP_BLOCKED_ENABLED: "Đã kích hoạt",
        PP_BLOCKED_ENABLED: "Đã kích hoạt",
        NF_BLOCKED_RE: "Biểu thức chính quy (RegExp)",
        GF_BLOCKED_RE: "Biểu thức chính quy (RegExp)",
        VF_BLOCKED_RE: "Biểu thức chính quy (RegExp)",
        MP_BLOCKED_RE: "Biểu thức chính quy (RegExp)",
        PP_BLOCKED_RE: "Biểu thức chính quy (RegExp)",
        DLG_VERBOSITY: "Tùy chọn cho bài đăng ẩn",
        DLG_PREFERENCES: "Tùy chọn",
        DLG_PREFERENCES_DESC: "Nhãn, vị trí, màu sắc và ngôn ngữ.",
        DLG_REPORT_BUG: "Báo lỗi",
        DLG_REPORT_BUG_DESC: "Tạo báo cáo chẩn đoán cho sự cố.",
        DLG_REPORT_BUG_NOTICE: "Hãy giúp chúng tôi sửa lỗi:\n1. Cuộn để bài viết bị lỗi hiển thị.\n2. Nhấp vào 'Tạo báo cáo' rồi 'Sao chép báo cáo'.\n3. Nhấp vào 'Mở issues' và dán báo cáo vào issue mới.\n4. Thêm mô tả ngắn về vấn đề.\n(Chúng tôi ẩn tên/văn bản, nhưng vui lòng kiểm tra trước khi chia sẻ!)",
        DLG_REPORT_BUG_GENERATE: "Tạo báo cáo",
        DLG_REPORT_BUG_COPY: "Sao chép báo cáo",
        DLG_REPORT_BUG_OPEN_ISSUES: "Mở issues",
        DLG_REPORT_BUG_STATUS_READY: "Báo cáo đã sẵn sàng.",
        DLG_REPORT_BUG_STATUS_COPIED: "Đã sao chép báo cáo.",
        DLG_REPORT_BUG_STATUS_FAILED: "Không thể sao chép. Vui lòng sao chép thủ công.",
        DLG_VERBOSITY_CAPTION: "Hiển thị một nhãn nếu một bài đăng bị ẩn",
        VERBOSITY_MESSAGE: [
          "không có nhãn",
          "Bài bị ẩn. Quy tắc: ",
          " bài viết ẩn",
          "7 bài viết ẩn ~ (chỉ áp dụng cho Bảng tin Nhóm)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "Màu văn bản",
        VERBOSITY_MESSAGE_BG_COLOUR: "Màu nền",
        VERBOSITY_DEBUG: 'Đánh dấu các bài đăng "ẩn"',
        CMF_CUSTOMISATIONS: "Các tùy chỉnh",
        CMF_BTN_LOCATION: "Vị trí nút CMF:",
        CMF_BTN_OPTION: [
          "dưới cùng bên trái",
          "trên cùng bên phải",
          'bị vô hiệu hóa (sử dụng "Cài đặt" trong menu Lệnh của Tập lệnh Người dùng)'
        ],
        CMF_DIALOG_LANGUAGE_LABEL: "Ngôn ngữ Clean My Feeds:",
        CMF_DIALOG_LANGUAGE: "Tiếng Việt",
        CMF_DIALOG_LANGUAGE_DEFAULT: "Sử dụng ngôn ngữ trang web",
        GM_MENU_SETTINGS: "Cài đặt",
        CMF_DIALOG_LOCATION: "Vị trí menu này:",
        CMF_DIALOG_OPTION: ["bên trái", "bên phải"],
        CMF_BORDER_COLOUR: "Màu viền",
        DLG_TIPS: "Giới thiệu",
        DLG_TIPS_DESC: "Liên kết dự án và thông tin người bảo trì.",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "Nếu thấy hữu ích, một ngôi sao trên {github} có ý nghĩa rất lớn.",
        DLG_TIPS_THREADS: "Nếu bạn cũng dùng Threads trên máy tính, mình cũng duy trì một bộ lọc cho nó: {threads}.",
        DLG_TIPS_FACEBOOK: "Ghé {facebook} - mình chia sẻ nghệ thuật và thơ ở đó.",
        DLG_TIPS_SITE: "Nếu muốn xem mình làm gì trên web, {site} là nơi bắt đầu tốt nhất.",
        DLG_TIPS_CREDITS: "Xin cảm ơn đặc biệt tới {zbluebugz} cho dự án gốc và {trinhquocviet} vì đã giúp duy trì bộ lọc trong năm 2025.",
        DLG_TIPS_MAINTAINER_PREFIX: "Từ người bảo trì:",
        DLG_TIPS_MAINTAINER: "Mình hy vọng script này giúp bạn giành lại bảng tin. Mình hứa sẽ là đồng minh của bạn trong cuộc chiến với những thứ bạn không muốn thấy trên mạng.",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "trang Facebook của mình",
        DLG_TIPS_LINK_SITE: "trang web của mình",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["Lưu", "Đóng", "Xuất", "Nhập", "Đặt lại"],
        DLG_BUTTON_TOOLTIPS: [
          "Lưu thay đổi trong trình duyệt này. Xóa dữ liệu/chế độ riêng tư sẽ mất.",
          "Xuất tệp sao lưu để giữ và chuyển giữa thiết bị/trình duyệt.",
          "Nhập tệp cài đặt để khôi phục hoặc chuyển.",
          "Đặt lại tất cả cài đặt về mặc định."
        ],
        DLG_FB_COLOUR_HINT: "Để trống để sử dụng bảng màu của FB"
      };
    }
  });

  // src/i18n/locales/zh-Hans.ts
  var catalog22;
  var init_zh_Hans = __esm({
    "src/i18n/locales/zh-Hans.ts"() {
      "use strict";
      catalog22 = {
        DLG_REGEX_ERROR: "{field}，第 {line} 行：用于{feed}的正则表达式无效。请修正，或关闭该动态流的正则表达式匹配。",
        DLG_REGEX_IMPORT_ERROR: "导入已被拒绝。已保留当前设置。",
        DLG_REGEX_SAVED_ERROR: "已忽略一条无效的已保存正则表达式。其他过滤规则仍然有效。",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "赞助内容",
        NF_TABLIST_STORIES_REELS_ROOMS: "“快拍|Reels|畅聊室”选项卡列表框",
        NF_STORIES: "故事",
        NF_TOP_CARDS_PAGES: "顶部卡片（用于页面）",
        NF_META_AI: "试用 Meta AI",
        NF_META_AI_PROMPTS: "Meta AI 提示建议",
        NF_AI_INFO_POSTS: "带有“AI info”标签的帖子",
        NF_HIDE_VERIFIED_BADGE: "隐藏已验证徽章",
        NF_FILTER_VERIFIED_BADGE: "过滤已验证帐户",
        NF_AI_SIDE_PANELS: "侧边栏中的 AI",
        NF_SURVEY: "调查",
        NF_PEOPLE_YOU_MAY_KNOW: "你可能认识的人",
        NF_PAID_PARTNERSHIP: "付费合伙",
        NF_SPONSORED_PAID: "赞助 · 由 ______ 付费",
        NF_SUGGESTIONS: "建议",
        NF_FOLLOW: "关注",
        NF_PARTICIPATE: "参与",
        NF_REELS_SHORT_VIDEOS: "卷轴和短视频",
        NF_SHORT_REEL_VIDEO: "卷轴/短视频",
        NF_EVENTS_YOU_MAY_LIKE: "您可能喜欢的活动",
        NF_ANIMATED_GIFS_POSTS: "动图 GIF",
        NF_ANIMATED_GIFS_PAUSE: "暂停动画 GIF",
        NF_SHARES: "#次分享",
        NF_LIKES_MAXIMUM: "最大点赞数",
        GF_PAID_PARTNERSHIP: "有偿合作",
        GF_SUGGESTIONS: "建议/建议",
        GF_SHORT_REEL_VIDEO: "卷轴和短视频",
        GF_ANIMATED_GIFS_POSTS: "动图 GIF",
        GF_ANIMATED_GIFS_PAUSE: "暂停动画 GIF",
        GF_SHARES: "#次分享",
        VF_LIVE: "现场直播",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "重复视频",
        VF_ANIMATED_GIFS_PAUSE: "暂停动画 GIF",
        PP_ANIMATED_GIFS_POSTS: "动图 GIF",
        PP_ANIMATED_GIFS_PAUSE: "暂停动画 GIF",
        NF_BLOCKED_FEED: ["新闻提要", "组提要", "视频提要"],
        GF_BLOCKED_FEED: ["新闻提要", "组提要", "视频提要"],
        VF_BLOCKED_FEED: ["新闻提要", "组提要", "视频提要"],
        MP_BLOCKED_FEED: ["市场提要"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "冠状病毒（信息框）",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "气候科学（信息框）",
        OTHER_INFO_BOX_SUBSCRIBE: "订阅（信息框）",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "播放控制和循环播放。",
        REELS_CONTROLS: "显示视频控制",
        REELS_DISABLE_LOOPING: "禁用循环",
        DLG_TITLE: "清理我的提要",
        DLG_NF: "新闻提要",
        DLG_NF_DESC: "清理建议并设置动态消息的严格程度。",
        DLG_GF: "群组提要",
        DLG_GF_DESC: "通过减少多余内容和噪音来整理群组动态。",
        DLG_VF: "视频提要",
        DLG_VF_DESC: "通过减少重复和杂乱内容，保持视频动态的专注。",
        DLG_MP: "市场提要",
        DLG_MP_DESC: "按价格和您关心的关键词过滤列表。",
        DLG_PP: "个人资料 / 页面",
        DLG_PP_DESC: "调整个人资料和页面上显示的内容。",
        DLG_OTHER: "其他说明",
        DLG_OTHER_DESC: "隐藏您不需要的额外框。",
        DLG_BLOCK_TEXT_FILTER_TITLE: "文本过滤器",
        DLG_BLOCK_NEW_LINE: "(使用换行符分隔单词或短语，支持正则表达式)",
        NF_BLOCKED_ENABLED: "启用",
        GF_BLOCKED_ENABLED: "启用",
        VF_BLOCKED_ENABLED: "启用",
        MP_BLOCKED_ENABLED: "启用",
        PP_BLOCKED_ENABLED: "启用",
        NF_BLOCKED_RE: "正则表达式 (RegExp)",
        GF_BLOCKED_RE: "正则表达式 (RegExp)",
        VF_BLOCKED_RE: "正则表达式 (RegExp)",
        MP_BLOCKED_RE: "正则表达式 (RegExp)",
        PP_BLOCKED_RE: "正则表达式 (RegExp)",
        DLG_VERBOSITY: "隐藏帖子选项",
        DLG_PREFERENCES: "偏好设置",
        DLG_PREFERENCES_DESC: "标签、位置、颜色和语言。",
        DLG_VERBOSITY_CAPTION: "如果文章被隐藏，则显示标签",
        DLG_REPORT_BUG: "报告错误",
        DLG_REPORT_BUG_DESC: "生成问题诊断报告。",
        DLG_REPORT_BUG_NOTICE: "帮助我们修复它：\n1. 滚动页面以使有问题的帖子可见。\n2. 点击“生成报告”，然后点击“复制报告”。\n3. 点击“打开 Issue”并将报告粘贴到新的 Issue 中。\n4. 添加简短的问题描述。\n(我们会隐藏姓名/文本，但在分享前请务必检查！)",
        DLG_REPORT_BUG_GENERATE: "生成报告",
        DLG_REPORT_BUG_COPY: "复制报告",
        DLG_REPORT_BUG_OPEN_ISSUES: "打开 Issue",
        DLG_REPORT_BUG_STATUS_READY: "报告就绪。",
        DLG_REPORT_BUG_STATUS_COPIED: "报告已复制到剪贴板。",
        DLG_REPORT_BUG_STATUS_FAILED: "复制失败。请手动复制。",
        VERBOSITY_MESSAGE: [
          "没有标签",
          "帖子已隐藏。规则：",
          " 个帖子已隐藏",
          "7个帖子已隐藏 ~ (仅适用于群组动态)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "文字颜色",
        VERBOSITY_MESSAGE_BG_COLOUR: "背景颜色",
        VERBOSITY_DEBUG: "突出显示“隐藏”的帖子",
        CMF_CUSTOMISATIONS: "定制化",
        CMF_BTN_LOCATION: "CMF 按钮位置：",
        CMF_BTN_OPTION: ["左下方", "右上", "禁用（使用用户脚本命令菜单中的“设置”）"],
        CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds 语言：",
        CMF_DIALOG_LANGUAGE: "中文（简体）",
        CMF_DIALOG_LANGUAGE_DEFAULT: "使用网站语言",
        GM_MENU_SETTINGS: "设置",
        CMF_DIALOG_LOCATION: "此菜单的位置：",
        CMF_DIALOG_OPTION: ["左边", "右边"],
        CMF_BORDER_COLOUR: "边框颜色",
        DLG_TIPS: "关于",
        DLG_TIPS_DESC: "项目链接和维护者信息。",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "如果有帮助，在 {github} 点个星对我意义很大。",
        DLG_TIPS_THREADS: "如果你也在桌面端使用 Threads，我也在维护一个适用于它的过滤器：{threads}。",
        DLG_TIPS_FACEBOOK: "欢迎到{facebook}打个招呼 - 我在那里分享艺术和诗歌。",
        DLG_TIPS_SITE: "想看看我在网上都在做什么，{site}是最好的起点。",
        DLG_TIPS_CREDITS: "特别感谢 {zbluebugz} 的原始项目，也感谢 {trinhquocviet} 在 2025 年帮助维护过滤器。",
        DLG_TIPS_MAINTAINER: "希望这个脚本能帮你找回清爽的动态消息。我承诺将是你对抗不想看到的网络内容的盟友。",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "我的 Facebook",
        DLG_TIPS_LINK_SITE: "我的网站",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["节省", "关", "出口", "进口", "重置"],
        DLG_BUTTON_TOOLTIPS: [
          "保存到此浏览器。清除站点数据/隐私模式会丢失。",
          "导出备份文件，用于保留设置并在设备间迁移。",
          "导入设置文件以恢复或迁移。",
          "将所有设置重置为默认值。"
        ],
        DLG_FB_COLOUR_HINT: "留空以使用 FB 的配色方案"
      };
    }
  });

  // src/i18n/locales/zh-Hant.ts
  var catalog23;
  var init_zh_Hant = __esm({
    "src/i18n/locales/zh-Hant.ts"() {
      "use strict";
      catalog23 = {
        DLG_REGEX_ERROR: "{field}，第 {line} 行：用於{feed}的正規表示式無效。請修正，或關閉該動態消息的正規表示式比對。",
        DLG_REGEX_IMPORT_ERROR: "已拒絕匯入。目前的設定已保留。",
        DLG_REGEX_SAVED_ERROR: "已略過一條無效的已儲存正規表示式。其他篩選規則仍然有效。",
        LANGUAGE_DIRECTION: "ltr",
        SPONSORED: "贊助",
        NF_TABLIST_STORIES_REELS_ROOMS: '"限時動態 | Reels | 包廂" 分頁列表框',
        NF_STORIES: "故事",
        NF_TOP_CARDS_PAGES: "頂部卡片（用於頁面）",
        NF_HIDE_VERIFIED_BADGE: "隱藏已驗證徽章",
        NF_FILTER_VERIFIED_BADGE: "過濾已驗證帳戶",
        NF_AI_SIDE_PANELS: "側邊欄中的 AI",
        NF_META_AI: "試用 Meta AI",
        NF_META_AI_PROMPTS: "Meta AI 提示建議",
        NF_AI_INFO_POSTS: "帶有「AI info」標籤的貼文",
        NF_SURVEY: "調查",
        NF_PEOPLE_YOU_MAY_KNOW: "你可能認識的人",
        NF_PAID_PARTNERSHIP: "付費合作",
        NF_SPONSORED_PAID: "贊助 · 出資者：______",
        NF_SUGGESTIONS: "建議/推薦",
        NF_FOLLOW: "追蹤",
        NF_PARTICIPATE: "參與",
        NF_REELS_SHORT_VIDEOS: "Reels 和短影片",
        NF_SHORT_REEL_VIDEO: "Reel/短影片",
        NF_EVENTS_YOU_MAY_LIKE: "你可能感興趣的活動",
        NF_ANIMATED_GIFS_POSTS: "動態 GIF",
        NF_ANIMATED_GIFS_PAUSE: "暫停 GIF 動畫",
        NF_SHARES: "#次分享",
        NF_LIKES_MAXIMUM: "最大按讚數",
        GF_PAID_PARTNERSHIP: "付費合作",
        GF_SUGGESTIONS: "建議/推薦",
        GF_SHORT_REEL_VIDEO: "Reel/短影片",
        GF_ANIMATED_GIFS_POSTS: "動態 GIF",
        GF_ANIMATED_GIFS_PAUSE: "暫停 GIF 動畫",
        GF_SHARES: "#次分享",
        VF_LIVE: "現場直播",
        VF_INSTAGRAM: "Instagram",
        VF_DUPLICATE_VIDEOS: "重複視頻",
        VF_ANIMATED_GIFS_PAUSE: "暫停 GIF 動畫",
        PP_ANIMATED_GIFS_POSTS: "動態 GIF",
        PP_ANIMATED_GIFS_PAUSE: "暫停 GIF 動畫",
        NF_BLOCKED_FEED: ["新聞動態消息", "群組動態消息", "影片動態消息"],
        GF_BLOCKED_FEED: ["新聞動態消息", "群組動態消息", "影片動態消息"],
        VF_BLOCKED_FEED: ["新聞動態消息", "群組動態消息", "影片動態消息"],
        MP_BLOCKED_FEED: ["Marketplace 動態消息"],
        PP_BLOCKED_FEED: "",
        OTHER_INFO_BOX_CORONAVIRUS: "武漢肺炎病毒（資訊框）",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "氣候科學（資訊框）",
        OTHER_INFO_BOX_SUBSCRIBE: "訂閱（資訊框）",
        REELS_TITLE: "Reels",
        DLG_REELS_DESC: "播放控制和循環播放。",
        REELS_CONTROLS: "顯示影片控制",
        REELS_DISABLE_LOOPING: "停用循環",
        DLG_TITLE: "清理我的動態消息",
        DLG_NF: "新聞動態消息",
        DLG_NF_DESC: "清理建議並設定動態消息的嚴格程度。",
        DLG_GF: "群組動態消息",
        DLG_GF_DESC: "透過減少多餘內容和噪音來整理群組動態。",
        DLG_VF: "影片動態消息",
        DLG_VF_DESC: "透過減少重複和雜亂內容，保持影片動態的專注。",
        DLG_MP: "Marketplace 動態消息",
        DLG_MP_DESC: "按價格和您關心的關鍵字過濾列表。",
        DLG_PP: "個人檔案 / 頁面",
        DLG_PP_DESC: "調整個人檔案和頁面上顯示的內容。",
        DLG_OTHER: "其他說明",
        DLG_OTHER_DESC: "隱藏您不需要的額外框。",
        DLG_BLOCK_TEXT_FILTER_TITLE: "文字過濾器",
        DLG_BLOCK_NEW_LINE: "(使用換行符分隔單詞或短語，支持正則表達式)",
        NF_BLOCKED_ENABLED: "啟用",
        GF_BLOCKED_ENABLED: "啟用",
        VF_BLOCKED_ENABLED: "啟用",
        MP_BLOCKED_ENABLED: "啟用",
        PP_BLOCKED_ENABLED: "啟用",
        NF_BLOCKED_RE: "正則表達式 (RegExp)",
        GF_BLOCKED_RE: "正則表達式 (RegExp)",
        VF_BLOCKED_RE: "正則表達式 (RegExp)",
        MP_BLOCKED_RE: "正則表達式 (RegExp)",
        PP_BLOCKED_RE: "正則表達式 (RegExp)",
        DLG_VERBOSITY: "隱藏帖子選項",
        DLG_PREFERENCES: "偏好設定",
        DLG_PREFERENCES_DESC: "標籤、位置、顏色和語言。",
        DLG_VERBOSITY_CAPTION: "如果文章被隱藏，則顯示標籤",
        DLG_REPORT_BUG: "回報錯誤",
        DLG_REPORT_BUG_DESC: "產生問題診斷報告。",
        DLG_REPORT_BUG_NOTICE: "協助我們修復它：\n1. 捲動頁面以使有問題的貼文可見。\n2. 點擊「生成報告」，然後點擊「複製報告」。\n3. 點擊「開啟 Issue」並將報告貼上到新的 Issue 中。\n4. 新增簡短的問題描述。\n(我們會隱藏姓名/文字，但在分享前請務必檢查！)",
        DLG_REPORT_BUG_GENERATE: "生成報告",
        DLG_REPORT_BUG_COPY: "複製報告",
        DLG_REPORT_BUG_OPEN_ISSUES: "開啟 Issue",
        DLG_REPORT_BUG_STATUS_READY: "報告就緒。",
        DLG_REPORT_BUG_STATUS_COPIED: "報告已複製到剪貼簿。",
        DLG_REPORT_BUG_STATUS_FAILED: "複製失敗。請手動複製。",
        VERBOSITY_MESSAGE: [
          "沒有標籤",
          "帖子已隱藏。規則：",
          " 個帖子已隱藏",
          "7個帖子已隱藏 ~ (僅適用於群組動態)"
        ],
        VERBOSITY_MESSAGE_COLOUR: "文字顏色",
        VERBOSITY_MESSAGE_BG_COLOUR: "背景顏色",
        VERBOSITY_DEBUG: "強調顯示「隱藏」的貼文",
        CMF_CUSTOMISATIONS: "客製化",
        CMF_BTN_LOCATION: "CMF 按鈕位置：",
        CMF_BTN_OPTION: ["左下方", "右上方", "禁用（在用户脚本命令菜单中使用“设置”）"],
        CMF_DIALOG_LANGUAGE_LABEL: "Clean My Feeds 語言：",
        CMF_DIALOG_LANGUAGE: "中文（繁體）",
        CMF_DIALOG_LANGUAGE_DEFAULT: "使用網站語言",
        GM_MENU_SETTINGS: "設置",
        CMF_DIALOG_LOCATION: "此選單的位置：",
        CMF_DIALOG_OPTION: ["左邊", "右邊"],
        CMF_BORDER_COLOUR: "邊框顏色",
        DLG_TIPS: "關於",
        DLG_TIPS_DESC: "專案連結和維護者資訊。",
        DLG_TIPS_CONTENT: "",
        DLG_TIPS_STAR: "如果有幫助，在 {github} 點個星對我意義很大。",
        DLG_TIPS_THREADS: "如果你也在桌面版使用 Threads，我也有在維護一個適用於它的過濾器：{threads}。",
        DLG_TIPS_FACEBOOK: "歡迎到{facebook}打個招呼 - 我在那裡分享藝術和詩。",
        DLG_TIPS_SITE: "想看看我在網路上都在做什麼，{site}是最好的起點。",
        DLG_TIPS_CREDITS: "特別感謝 {zbluebugz} 的原始專案，也感謝 {trinhquocviet} 在 2025 年協助維護過濾器。",
        DLG_TIPS_MAINTAINER: "希望這個腳本能幫你找回清爽的動態消息。我承諾將是你對抗不想看到的網路內容的盟友。",
        DLG_TIPS_LINK_REPO: "GitHub",
        DLG_TIPS_LINK_FACEBOOK: "我的 Facebook",
        DLG_TIPS_LINK_SITE: "我的網站",
        DLG_TIPS_LINK_THREADS: "Bobbin Threads Filter",
        DLG_TIPS_THANKS: "",
        DLG_BUTTONS: ["儲存", "關閉", "匯出", "匯入", "重設"],
        DLG_BUTTON_TOOLTIPS: [
          "儲存在此瀏覽器。清除網站資料/私密模式會遺失。",
          "匯出備份檔以保留設定並在裝置間移轉。",
          "匯入設定檔以還原或移轉。",
          "將所有設定重設為預設值。"
        ],
        DLG_FB_COLOUR_HINT: "留空以使用 FB 的配色方案"
      };
    }
  });

  // src/i18n/index.ts
  function isLocaleCode(language) {
    return Object.prototype.hasOwnProperty.call(translations, language);
  }
  function getTranslation(language) {
    return isLocaleCode(language) ? translations[language] : void 0;
  }
  var translations;
  var init_i18n = __esm({
    "src/i18n/index.ts"() {
      "use strict";
      init_en();
      init_ar();
      init_bg();
      init_cs();
      init_de();
      init_el();
      init_es();
      init_fi();
      init_fr();
      init_he();
      init_id();
      init_it();
      init_ja();
      init_lv();
      init_nl();
      init_pl();
      init_pt();
      init_ru();
      init_tr();
      init_uk();
      init_vi();
      init_zh_Hans();
      init_zh_Hant();
      translations = {
        en: catalog,
        ar: catalog2,
        bg: catalog3,
        cs: catalog4,
        de: catalog5,
        el: catalog6,
        es: catalog7,
        fi: catalog8,
        fr: catalog9,
        he: catalog10,
        id: catalog11,
        it: catalog12,
        ja: catalog13,
        lv: catalog14,
        nl: catalog15,
        pl: catalog16,
        pt: catalog17,
        ru: catalog18,
        tr: catalog19,
        uk: catalog20,
        vi: catalog21,
        "zh-Hans": catalog22,
        "zh-Hant": catalog23
      };
    }
  });

  // src/core/options/defaults.ts
  var defaults;
  var init_defaults = __esm({
    "src/core/options/defaults.ts"() {
      "use strict";
      defaults = {
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
        NF_META_AI_PROMPTS: true,
        NF_AI_INFO_POSTS: false,
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
      };
    }
  });

  // src/core/options/schema.ts
  function isDefaultKey(key) {
    return Object.prototype.hasOwnProperty.call(defaults, key);
  }
  var optionKeys;
  var init_schema = __esm({
    "src/core/options/schema.ts"() {
      "use strict";
      init_defaults();
      optionKeys = Object.keys(defaults);
    }
  });

  // src/core/options/apply-defaults.ts
  function applyOptionDefaults(options, keyWords) {
    var _a, _b;
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
          options[key] = isDefaultKey(key) ? defaults[key] : void 0;
        }
      } else if (key.startsWith("GF_") && !key.startsWith("GF_BLOCKED")) {
        if (!Object.prototype.hasOwnProperty.call(options, key)) {
          options[key] = isDefaultKey(key) ? defaults[key] : void 0;
        }
      } else if (key.startsWith("VF_") && !key.startsWith("VF_BLOCKED")) {
        if (!Object.prototype.hasOwnProperty.call(options, key)) {
          options[key] = isDefaultKey(key) ? defaults[key] : void 0;
        }
      } else if (key.startsWith("MP_") && !key.startsWith("MP_BLOCKED")) {
        if (!Object.prototype.hasOwnProperty.call(options, key)) {
          options[key] = isDefaultKey(key) ? defaults[key] : void 0;
        }
      } else if (key.startsWith("PP_") && !key.startsWith("PP_BLOCKED")) {
        if (!Object.prototype.hasOwnProperty.call(options, key)) {
          options[key] = isDefaultKey(key) ? defaults[key] : void 0;
        }
      } else if (key.startsWith("OTHER_INFO")) {
        if (!Object.prototype.hasOwnProperty.call(options, key)) {
          options[key] = isDefaultKey(key) ? defaults[key] : void 0;
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
    normalizeEnumOption(options, "VERBOSITY_LEVEL", ["0", "1", "2"], defaults.DLG_VERBOSITY);
    normalizeEnumOption(options, "CMF_BTN_OPTION", ["0", "1", "2"], defaults.CMF_BTN_OPTION);
    normalizeEnumOption(options, "CMF_DIALOG_OPTION", ["0", "1"], defaults.CMF_DIALOG_OPTION);
    if (!Object.prototype.hasOwnProperty.call(options, "CMF_BORDER_COLOUR") || ((_a = options.CMF_BORDER_COLOUR) == null ? void 0 : _a.toString()) === void 0 || ((_b = options.CMF_BORDER_COLOUR) == null ? void 0 : _b.toString()) === "") {
      options.CMF_BORDER_COLOUR = defaults.CMF_BORDER_COLOUR;
    }
    if (!Object.prototype.hasOwnProperty.call(options, "NF_LIKES_MAXIMUM_COUNT")) {
      options.NF_LIKES_MAXIMUM_COUNT = "";
    }
    return hideAnInfoBox;
  }
  function normalizeEnumOption(options, key, validValues, defaultValue) {
    if (!Object.prototype.hasOwnProperty.call(options, key)) {
      options[key] = defaultValue;
      return;
    }
    const value = options[key];
    if (value === void 0 || value === null) {
      options[key] = defaultValue;
      return;
    }
    const normalized = value.toString();
    options[key] = validValues.includes(normalized) ? normalized : defaultValue;
  }
  var init_apply_defaults = __esm({
    "src/core/options/apply-defaults.ts"() {
      "use strict";
      init_defaults();
      init_schema();
    }
  });

  // src/core/options/constants.ts
  var SEPARATOR;
  var init_constants = __esm({
    "src/core/options/constants.ts"() {
      "use strict";
      SEPARATOR = "İİ";
    }
  });

  // src/core/options/build-filters.ts
  function enabledText(enabled, value) {
    return enabled === true ? value != null ? value : "" : "";
  }
  function appendText(current, extra, separator) {
    return extra.length > 0 ? current + (current.length > 0 ? separator : "") + extra : current;
  }
  function splitText(enabled, value, separator) {
    return enabled ? value.split(separator) : [];
  }
  function buildFilters(options, separator = SEPARATOR) {
    var _a, _b, _c, _d, _e, _f;
    const nfText = enabledText(options.NF_BLOCKED_ENABLED, options.NF_BLOCKED_TEXT);
    const gfText = enabledText(options.GF_BLOCKED_ENABLED, options.GF_BLOCKED_TEXT);
    const vfText = enabledText(options.VF_BLOCKED_ENABLED, options.VF_BLOCKED_TEXT);
    const mpText = enabledText(options.MP_BLOCKED_ENABLED, options.MP_BLOCKED_TEXT);
    const mpDescription = enabledText(
      options.MP_BLOCKED_ENABLED,
      options.MP_BLOCKED_TEXT_DESCRIPTION
    );
    const ppText = enabledText(options.PP_BLOCKED_ENABLED, options.PP_BLOCKED_TEXT);
    let nfList = options.NF_BLOCKED_ENABLED ? nfText : "";
    let gfList = options.GF_BLOCKED_ENABLED ? gfText : "";
    let vfList = options.VF_BLOCKED_ENABLED ? vfText : "";
    if (options.NF_BLOCKED_ENABLED) {
      if (options.GF_BLOCKED_ENABLED && ((_a = options.GF_BLOCKED_FEED) == null ? void 0 : _a[0]) === "1")
        nfList = appendText(nfList, gfText, separator);
      if (options.VF_BLOCKED_ENABLED && ((_b = options.VF_BLOCKED_FEED) == null ? void 0 : _b[0]) === "1")
        nfList = appendText(nfList, vfText, separator);
    }
    if (options.GF_BLOCKED_ENABLED) {
      if (options.NF_BLOCKED_ENABLED && ((_c = options.NF_BLOCKED_FEED) == null ? void 0 : _c[1]) === "1")
        gfList = appendText(gfList, nfText, separator);
      if (options.VF_BLOCKED_ENABLED && ((_d = options.VF_BLOCKED_FEED) == null ? void 0 : _d[1]) === "1")
        gfList = appendText(gfList, vfText, separator);
    }
    if (options.VF_BLOCKED_ENABLED) {
      if (options.NF_BLOCKED_ENABLED && ((_e = options.NF_BLOCKED_FEED) == null ? void 0 : _e[2]) === "1")
        vfList = appendText(vfList, nfText, separator);
      if (options.GF_BLOCKED_ENABLED && ((_f = options.GF_BLOCKED_FEED) == null ? void 0 : _f[2]) === "1")
        vfList = appendText(vfList, gfText, separator);
    }
    const nfEnabled = Boolean(options.NF_BLOCKED_ENABLED && nfList.length > 0);
    const gfEnabled = Boolean(options.GF_BLOCKED_ENABLED && gfList.length > 0);
    const vfEnabled = Boolean(options.VF_BLOCKED_ENABLED && vfList.length > 0);
    const mpEnabled = Boolean(
      options.MP_BLOCKED_ENABLED && (mpText.length > 0 || mpDescription.length > 0)
    );
    const ppEnabled = Boolean(options.PP_BLOCKED_ENABLED && ppText.length > 0);
    const nf = splitText(nfEnabled, nfList, separator);
    const gf = splitText(gfEnabled, gfList, separator);
    const vf = splitText(vfEnabled, vfList, separator);
    const mp = splitText(mpEnabled, mpText, separator);
    const mpDesc = splitText(mpEnabled, mpDescription, separator);
    const pp = splitText(ppEnabled, ppText, separator);
    return {
      NF_BLOCKED_ENABLED: nfEnabled,
      NF_BLOCKED_TEXT: nf,
      NF_BLOCKED_TEXT_LC: nf.map((text) => text.toLowerCase()),
      GF_BLOCKED_ENABLED: gfEnabled,
      GF_BLOCKED_TEXT: gf,
      GF_BLOCKED_TEXT_LC: gf.map((text) => text.toLowerCase()),
      VF_BLOCKED_ENABLED: vfEnabled,
      VF_BLOCKED_TEXT: vf,
      VF_BLOCKED_TEXT_LC: vf.map((text) => text.toLowerCase()),
      MP_BLOCKED_ENABLED: mpEnabled,
      MP_BLOCKED_TEXT: mp,
      MP_BLOCKED_TEXT_LC: mp.map((text) => text.toLowerCase()),
      MP_BLOCKED_TEXT_DESCRIPTION: mpDesc,
      MP_BLOCKED_TEXT_DESCRIPTION_LC: mpDesc.map((text) => text.toLowerCase()),
      PP_BLOCKED_ENABLED: ppEnabled,
      PP_BLOCKED_TEXT: pp,
      PP_BLOCKED_TEXT_LC: pp.map((text) => text.toLowerCase())
    };
  }
  var init_build_filters = __esm({
    "src/core/options/build-filters.ts"() {
      "use strict";
      init_constants();
    }
  });

  // src/core/options/validate.ts
  function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  function isStoredOptions(value) {
    if (!isRecord(value)) return false;
    for (const key of booleanKeys) {
      if (key === "VERBOSITY_DEBUG" && (value[key] === void 0 || value[key] === "")) continue;
      if (key in value && typeof value[key] !== "boolean") return false;
    }
    for (const key of stringKeys) {
      if (key === "CMF_DIALOG_LANGUAGE") continue;
      if (key === "VERBOSITY_MESSAGE_BG_COLOUR" && value[key] === void 0) continue;
      if (key in value && typeof value[key] !== "string") return false;
    }
    for (const key of arrayKeys) {
      const entry = value[key];
      if (key in value && (!Array.isArray(entry) || !entry.every((item) => typeof item === "string")))
        return false;
    }
    for (const key of [...radioKeys, "CMF_DIALOG_LANGUAGE"]) {
      const entry = value[key];
      if (entry !== void 0 && entry !== null && typeof entry !== "string" && typeof entry !== "number" && typeof entry !== "boolean")
        return false;
    }
    return true;
  }
  function decodeStoredOptions(value) {
    return isStoredOptions(value) ? value : void 0;
  }
  function isHydratedOptions(value) {
    if (!isStoredOptions(value)) return false;
    return hydratedKeys.every(
      (key) => Object.prototype.hasOwnProperty.call(value, key) && value[key] !== void 0
    ) && radioKeys.every((key) => typeof value[key] === "string") && typeof value.CMF_DIALOG_LANGUAGE === "string" && typeof value.VERBOSITY_DEBUG === "boolean";
  }
  var booleanKeys, arrayKeys, stringKeys, radioKeys, hydratedKeys;
  var init_validate = __esm({
    "src/core/options/validate.ts"() {
      "use strict";
      booleanKeys = [
        "SPONSORED",
        "NF_TABLIST_STORIES_REELS_ROOMS",
        "NF_STORIES",
        "NF_SURVEY",
        "NF_PEOPLE_YOU_MAY_KNOW",
        "NF_PAID_PARTNERSHIP",
        "NF_SPONSORED_PAID",
        "NF_SUGGESTIONS",
        "NF_FOLLOW",
        "NF_PARTICIPATE",
        "NF_REELS_SHORT_VIDEOS",
        "NF_SHORT_REEL_VIDEO",
        "NF_META_AI",
        "NF_META_AI_PROMPTS",
        "NF_AI_INFO_POSTS",
        "NF_EVENTS_YOU_MAY_LIKE",
        "NF_ANIMATED_GIFS_POSTS",
        "NF_ANIMATED_GIFS_PAUSE",
        "NF_SHARES",
        "NF_LIKES_MAXIMUM",
        "NF_TOP_CARDS_PAGES",
        "NF_HIDE_VERIFIED_BADGE",
        "NF_FILTER_VERIFIED_BADGE",
        "NF_AI_SIDE_PANELS",
        "GF_PAID_PARTNERSHIP",
        "GF_SUGGESTIONS",
        "GF_SHORT_REEL_VIDEO",
        "GF_ANIMATED_GIFS_POSTS",
        "GF_ANIMATED_GIFS_PAUSE",
        "GF_SHARES",
        "VF_LIVE",
        "VF_INSTAGRAM",
        "VF_DUPLICATE_VIDEOS",
        "VF_ANIMATED_GIFS_PAUSE",
        "PP_ANIMATED_GIFS_POSTS",
        "PP_ANIMATED_GIFS_PAUSE",
        "OTHER_INFO_BOX_CORONAVIRUS",
        "OTHER_INFO_BOX_CLIMATE_SCIENCE",
        "OTHER_INFO_BOX_SUBSCRIBE",
        "REELS_CONTROLS",
        "REELS_DISABLE_LOOPING",
        "NF_BLOCKED_ENABLED",
        "GF_BLOCKED_ENABLED",
        "VF_BLOCKED_ENABLED",
        "MP_BLOCKED_ENABLED",
        "PP_BLOCKED_ENABLED",
        "NF_BLOCKED_RE",
        "GF_BLOCKED_RE",
        "VF_BLOCKED_RE",
        "MP_BLOCKED_RE",
        "PP_BLOCKED_RE",
        "VERBOSITY_DEBUG",
        "NF_SPONSORED",
        "GF_SPONSORED",
        "VF_SPONSORED",
        "MP_SPONSORED"
      ];
      arrayKeys = [
        "NF_BLOCKED_FEED",
        "GF_BLOCKED_FEED",
        "VF_BLOCKED_FEED",
        "MP_BLOCKED_FEED",
        "PP_BLOCKED_FEED"
      ];
      stringKeys = [
        "DLG_VERBOSITY",
        "VERBOSITY_MESSAGE_BG_COLOUR",
        "CMF_BORDER_COLOUR",
        "VERBOSITY_MESSAGE_COLOUR",
        "CMF_DIALOG_LANGUAGE",
        "NF_LIKES_MAXIMUM_COUNT",
        "NF_BLOCKED_TEXT",
        "GF_BLOCKED_TEXT",
        "VF_BLOCKED_TEXT",
        "MP_BLOCKED_TEXT",
        "MP_BLOCKED_TEXT_DESCRIPTION",
        "PP_BLOCKED_TEXT"
      ];
      radioKeys = ["VERBOSITY_LEVEL", "CMF_BTN_OPTION", "CMF_DIALOG_OPTION"];
      hydratedKeys = [
        "NF_TABLIST_STORIES_REELS_ROOMS",
        "NF_STORIES",
        "NF_SURVEY",
        "NF_PEOPLE_YOU_MAY_KNOW",
        "NF_PAID_PARTNERSHIP",
        "NF_SPONSORED_PAID",
        "NF_SUGGESTIONS",
        "NF_FOLLOW",
        "NF_PARTICIPATE",
        "NF_REELS_SHORT_VIDEOS",
        "NF_SHORT_REEL_VIDEO",
        "NF_META_AI",
        "NF_META_AI_PROMPTS",
        "NF_AI_INFO_POSTS",
        "NF_EVENTS_YOU_MAY_LIKE",
        "NF_ANIMATED_GIFS_POSTS",
        "NF_ANIMATED_GIFS_PAUSE",
        "NF_SHARES",
        "NF_LIKES_MAXIMUM",
        "NF_TOP_CARDS_PAGES",
        "NF_HIDE_VERIFIED_BADGE",
        "NF_FILTER_VERIFIED_BADGE",
        "NF_AI_SIDE_PANELS",
        "GF_PAID_PARTNERSHIP",
        "GF_SUGGESTIONS",
        "GF_SHORT_REEL_VIDEO",
        "GF_ANIMATED_GIFS_POSTS",
        "GF_ANIMATED_GIFS_PAUSE",
        "GF_SHARES",
        "VF_LIVE",
        "VF_INSTAGRAM",
        "VF_DUPLICATE_VIDEOS",
        "VF_ANIMATED_GIFS_PAUSE",
        "PP_ANIMATED_GIFS_POSTS",
        "PP_ANIMATED_GIFS_PAUSE",
        "OTHER_INFO_BOX_CORONAVIRUS",
        "OTHER_INFO_BOX_CLIMATE_SCIENCE",
        "OTHER_INFO_BOX_SUBSCRIBE",
        "NF_BLOCKED_ENABLED",
        "GF_BLOCKED_ENABLED",
        "VF_BLOCKED_ENABLED",
        "MP_BLOCKED_ENABLED",
        "PP_BLOCKED_ENABLED",
        "VERBOSITY_DEBUG",
        "NF_SPONSORED",
        "GF_SPONSORED",
        "VF_SPONSORED",
        "MP_SPONSORED",
        "NF_BLOCKED_FEED",
        "GF_BLOCKED_FEED",
        "VF_BLOCKED_FEED",
        "MP_BLOCKED_FEED",
        "PP_BLOCKED_FEED",
        "VERBOSITY_LEVEL",
        "CMF_BTN_OPTION",
        "CMF_DIALOG_OPTION",
        "VERBOSITY_MESSAGE_BG_COLOUR",
        "CMF_BORDER_COLOUR",
        "VERBOSITY_MESSAGE_COLOUR",
        "CMF_DIALOG_LANGUAGE",
        "NF_LIKES_MAXIMUM_COUNT",
        "NF_BLOCKED_TEXT",
        "GF_BLOCKED_TEXT",
        "VF_BLOCKED_TEXT",
        "MP_BLOCKED_TEXT",
        "MP_BLOCKED_TEXT_DESCRIPTION",
        "PP_BLOCKED_TEXT"
      ];
    }
  });

  // src/core/options/hydrate.ts
  function cloneKeywords(language) {
    return { ...translations.en, ...language ? getTranslation(language) : void 0 };
  }
  function resolveLanguage(options, siteLanguage) {
    const language = siteLanguage || "en";
    if (!Object.prototype.hasOwnProperty.call(options, "CMF_DIALOG_LANGUAGE")) {
      return isLocaleCode(language) ? language : "en";
    }
    const configured = options.CMF_DIALOG_LANGUAGE || "en";
    return typeof configured === "string" && isLocaleCode(configured) ? configured : language;
  }
  function hydrateOptions(storedOptions = {}, siteLanguage = "en") {
    const options = { ...storedOptions };
    const language = resolveLanguage(options, siteLanguage);
    options.CMF_DIALOG_LANGUAGE = language;
    const keyWords = cloneKeywords(language);
    const hideAnInfoBox = applyOptionDefaults(options, keyWords);
    const hydratedOptions = options;
    if (!isHydratedOptions(hydratedOptions)) {
      throw new TypeError("Settings contain malformed option values");
    }
    return {
      options: hydratedOptions,
      filters: buildFilters(hydratedOptions),
      language,
      hideAnInfoBox,
      keyWords
    };
  }
  var init_hydrate = __esm({
    "src/core/options/hydrate.ts"() {
      "use strict";
      init_i18n();
      init_apply_defaults();
      init_build_filters();
      init_validate();
      init_apply_defaults();
      init_build_filters();
      init_validate();
    }
  });

  // src/core/options/regex-validation.ts
  function sourceRules(options, source) {
    var _a;
    if (options[`${source}_BLOCKED_ENABLED`] !== true) return [];
    const field = `${source}_BLOCKED_TEXT`;
    const text = (_a = options[field]) != null ? _a : "";
    return text.length ? text.split(SEPARATOR).map((pattern, index) => ({ field, line: index + 1, pattern })) : [];
  }
  function effectiveRules(options, destination) {
    var _a;
    if (options[`${destination}_BLOCKED_ENABLED`] !== true) return [];
    const own = sourceRules(options, destination);
    if (destination === "PP") return own;
    const destinationIndex = sharedFeeds.indexOf(destination);
    for (const source of sharedFeeds) {
      if (source !== destination && ((_a = options[`${source}_BLOCKED_FEED`]) == null ? void 0 : _a[destinationIndex]) === "1") {
        own.push(...sourceRules(options, source));
      }
    }
    return own;
  }
  function isValidExpression(pattern) {
    try {
      new RegExp(pattern, "i");
      return true;
    } catch (error) {
      if (error instanceof SyntaxError) return false;
      throw error;
    }
  }
  function resolveRegexFilters(options) {
    const filters = buildFilters(options);
    const issues = [];
    for (const destination of regexFeeds) {
      if (options[`${destination}_BLOCKED_RE`] !== true) continue;
      const validPatterns = [];
      for (const rule of effectiveRules(options, destination)) {
        if (isValidExpression(rule.pattern)) validPatterns.push(rule.pattern);
        else issues.push({ field: rule.field, line: rule.line, destination });
      }
      filters[`${destination}_BLOCKED_TEXT`] = validPatterns;
      filters[`${destination}_BLOCKED_TEXT_LC`] = validPatterns.map(
        (pattern) => pattern.toLowerCase()
      );
      filters[`${destination}_BLOCKED_ENABLED`] = validPatterns.length > 0;
    }
    return { filters, issues };
  }
  function getRegexValidationIssues(options) {
    return resolveRegexFilters(options).issues;
  }
  var InvalidRegexOptionsError, regexFeeds, sharedFeeds;
  var init_regex_validation = __esm({
    "src/core/options/regex-validation.ts"() {
      "use strict";
      init_build_filters();
      init_constants();
      InvalidRegexOptionsError = class extends Error {
        /** Keep user-facing translation at the UI boundary while exposing safe field/line diagnostics. */
        constructor(issues) {
          super("Settings contain invalid regular expressions");
          this.issues = issues;
          this.name = "InvalidRegexOptionsError";
        }
      };
      regexFeeds = ["NF", "GF", "VF", "PP"];
      sharedFeeds = ["NF", "GF", "VF"];
    }
  });

  // src/vendor/idb-keyval.ts
  function promisifyRequest(request) {
    return new Promise((resolve, reject) => {
      if ("result" in request) {
        request.onsuccess = () => resolve(request.result);
      } else {
        request.oncomplete = () => resolve(void 0);
        request.onabort = () => reject(request.error);
      }
      request.onerror = () => reject(request.error);
    });
  }
  function waitForSafariIndexedDB() {
    const safari = typeof indexedDB !== "undefined" && !("userAgentData" in navigator && navigator.userAgentData) && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && typeof indexedDB.databases === "function";
    if (!safari) return Promise.resolve();
    let interval;
    return new Promise((resolve) => {
      const probe = () => {
        void indexedDB.databases().then(
          () => resolve(),
          () => resolve()
        );
      };
      interval = setInterval(probe, 100);
      probe();
    }).finally(() => {
      if (interval !== void 0) clearInterval(interval);
    });
  }
  function createStore(databaseName, storeName) {
    const database = waitForSafariIndexedDB().then(() => {
      const request = indexedDB.open(databaseName);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(storeName);
      };
      return promisifyRequest(request);
    });
    return (mode, callback) => database.then((db) => callback(db.transaction(storeName, mode).objectStore(storeName)));
  }
  function getDefaultStore() {
    defaultStore != null ? defaultStore : defaultStore = createStore("keyval-store", "keyval");
    return defaultStore;
  }
  function get(key, customStore = getDefaultStore()) {
    return customStore("readonly", (store) => promisifyRequest(store.get(key)));
  }
  function set(key, value, customStore = getDefaultStore()) {
    return customStore("readwrite", (store) => {
      store.put(value, key);
      return promisifyRequest(store.transaction);
    });
  }
  function del(key, customStore = getDefaultStore()) {
    return customStore("readwrite", (store) => {
      store.delete(key);
      return promisifyRequest(store.transaction);
    });
  }
  var defaultStore;
  var init_idb_keyval = __esm({
    "src/vendor/idb-keyval.ts"() {
      "use strict";
      /*!
       * Owned TypeScript adaptation of idb-keyval, preserving the bundled adapter's API.
       * Original: https://github.com/jakearchibald/idb-keyval
       * Copyright 2016, Jake Archibald
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       * http://www.apache.org/licenses/LICENSE-2.0
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       *
       * CMF adaptation: explicit unknown storage values and transaction/request handlers;
       * retains the original eager-open and Safari indexedDB.databases workaround.
       */
    }
  });

  // src/storage/idb.ts
  function getOptions() {
    return get(DB_KEY, optionsStore);
  }
  function setOptions(options) {
    return set(DB_KEY, options, optionsStore);
  }
  function deleteOptions() {
    return del(DB_KEY, optionsStore);
  }
  var DB_NAME, DB_STORE, DB_KEY, optionsStore;
  var init_idb = __esm({
    "src/storage/idb.ts"() {
      "use strict";
      init_idb_keyval();
      DB_NAME = "dbCMF";
      DB_STORE = "Mopping";
      DB_KEY = "Options";
      optionsStore = createStore(DB_NAME, DB_STORE);
    }
  });

  // src/application/options-service.ts
  function replaceContents(target, source) {
    Object.keys(target).forEach((key) => Reflect.deleteProperty(target, key));
    Object.assign(target, source);
  }
  function validateCandidate(incoming) {
    var _a;
    const decoded = decodeStoredOptions(incoming);
    if (!decoded) throw new TypeError("Settings contain malformed option values");
    const hydrated = hydrateOptions(decoded, ((_a = document.documentElement) == null ? void 0 : _a.lang) || "en");
    const resolved = resolveRegexFilters(hydrated.options);
    if (resolved.issues.length > 0) throw new InvalidRegexOptionsError(resolved.issues);
    hydrated.filters = resolved.filters;
    return hydrated;
  }
  function createOptionsService(context, effects) {
    const { state } = context;
    return {
      /**
       * Persist settings, synchronize shared models, and report required UI rebuilds.
       * @param pending Draft settings or null to save the currently installed model.
       * @param source Origin controls language rebuilding while preserving existing save semantics.
       * @returns Whether localization or toggle placement must be rebuilt after the save.
       * @throws TypeError for malformed settings or InvalidRegexOptionsError before any mutation.
       * Storage failures propagate unchanged after retaining the historical model-update ordering.
       */
      async saveOptions(pending, source) {
        var _a, _b;
        const previousLocation = ((_a = state.options.CMF_BTN_OPTION) == null ? void 0 : _a.toString()) || defaults.CMF_BTN_OPTION;
        const incoming = pending || state.options;
        const languageChanged = source === "reset" || source === "dialog" && state.language !== incoming.CMF_DIALOG_LANGUAGE;
        const hydrated = validateCandidate(incoming);
        replaceContents(state.options, hydrated.options);
        replaceContents(state.filters, hydrated.filters);
        state.language = hydrated.language;
        state.hideAnInfoBox = hydrated.hideAnInfoBox;
        replaceContents(context.options, hydrated.options);
        replaceContents(context.filters, hydrated.filters);
        replaceContents(context.keyWords, hydrated.keyWords);
        await setOptions(JSON.stringify(state.options));
        effects.applyOptions();
        return {
          languageChanged,
          buttonLocationChanged: previousLocation !== (((_b = hydrated.options.CMF_BTN_OPTION) == null ? void 0 : _b.toString()) || defaults.CMF_BTN_OPTION)
        };
      },
      /**
       * Validate the retained settings before clearing storage, then let the later save resolve language.
       * Invalid legacy expressions must not erase persisted settings or mutate the current language.
       */
      async resetOptions() {
        validateCandidate({ ...state.options, CMF_DIALOG_LANGUAGE: "" });
        await deleteOptions();
        state.options.CMF_DIALOG_LANGUAGE = "";
      }
    };
  }
  var init_options_service = __esm({
    "src/application/options-service.ts"() {
      "use strict";
      init_hydrate();
      init_regex_validation();
      init_defaults();
      init_idb();
    }
  });

  // src/core/rules/feed-rules.ts
  var pathInfo;
  var init_feed_rules = __esm({
    "src/core/rules/feed-rules.ts"() {
      "use strict";
      pathInfo = {
        OTHER_INFO_BOX_CORONAVIRUS: "/coronavirus_info/",
        OTHER_INFO_BOX_CLIMATE_SCIENCE: "/climatescienceinfo/",
        OTHER_INFO_BOX_SUBSCRIBE: "/support/"
      };
    }
  });

  // src/selectors/news.ts
  var newsSelectors;
  var init_news = __esm({
    "src/selectors/news.ts"() {
      "use strict";
      newsSelectors = {
        mainColumn: 'div[role="navigation"] ~ div[role="main"]',
        dialog: 'div[role="dialog"]',
        surveyButton: 'a[href*="/survey/?session="] > div[role="none"]',
        standardPost: 'div[role="article"], div[aria-posinset]',
        sponsoredLink: 'a[href*="/ads/about/"]',
        virtualizedContainer: "div[data-virtualized]",
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
    }
  });

  // src/diagnostics/location.ts
  function sanitizePathname(pathname) {
    var _a, _b, _c;
    const segments = pathname.split("/").filter(Boolean);
    const root = segments[0];
    if (!root) return "/";
    const rule = routeRules.get(root);
    const knownRoot = Boolean(rule) || staticRoots.has(root);
    const safeSegments = [knownRoot ? root : "[profile]"];
    for (const [offset, segment] of segments.slice(1).entries()) {
      const index = offset + 1;
      const previous = (_a = segments[index - 1]) != null ? _a : "";
      if (index > 1 && identifierLabels.has(previous)) {
        safeSegments.push((_b = identifierLabels.get(previous)) != null ? _b : "[segment]");
        continue;
      }
      const staticSegments = index === 1 ? rule == null ? void 0 : rule.firstSegments : rule == null ? void 0 : rule.laterSegments;
      const allowed = staticSegments != null ? staticSegments : knownRoot ? /* @__PURE__ */ new Set() : contentSections;
      if (allowed.has(segment)) safeSegments.push(segment);
      else safeSegments.push(index === 1 ? (_c = rule == null ? void 0 : rule.identifier) != null ? _c : "[segment]" : "[segment]");
    }
    return `/${safeSegments.join("/")}${pathname.endsWith("/") ? "/" : ""}`;
  }
  var contentSections, staticRoots, identifierLabels, routeRules;
  var init_location = __esm({
    "src/diagnostics/location.ts"() {
      "use strict";
      contentSections = /* @__PURE__ */ new Set([
        "posts",
        "permalink",
        "photos",
        "videos",
        "reels",
        "about",
        "friends",
        "followers",
        "following",
        "members",
        "events",
        "media"
      ]);
      staticRoots = /* @__PURE__ */ new Set([
        "home.php",
        "profile.php",
        "feed",
        "saved",
        "memories",
        "notifications",
        "settings"
      ]);
      identifierLabels = /* @__PURE__ */ new Map([
        ["posts", "[post]"],
        ["permalink", "[post]"],
        ["photos", "[photo]"],
        ["videos", "[video]"],
        ["reel", "[reel]"],
        ["reels", "[reel]"],
        ["item", "[item]"],
        ["listing", "[item]"],
        ["category", "[category]"]
      ]);
      routeRules = /* @__PURE__ */ new Map([
        [
          "groups",
          {
            identifier: "[group]",
            firstSegments: /* @__PURE__ */ new Set(["feed", "search", "discover", "joins", "create"]),
            laterSegments: contentSections
          }
        ],
        ["reel", { identifier: "[reel]", firstSegments: /* @__PURE__ */ new Set(), laterSegments: /* @__PURE__ */ new Set() }],
        ["reels", { identifier: "[reel]", firstSegments: /* @__PURE__ */ new Set(), laterSegments: /* @__PURE__ */ new Set() }],
        [
          "watch",
          {
            identifier: "[video]",
            firstSegments: /* @__PURE__ */ new Set(["search", "live", "shows", "saved"]),
            laterSegments: /* @__PURE__ */ new Set()
          }
        ],
        [
          "search",
          {
            identifier: "[segment]",
            firstSegments: /* @__PURE__ */ new Set([
              "top",
              "posts",
              "pages",
              "people",
              "photos",
              "videos",
              "groups",
              "events",
              "marketplace"
            ]),
            laterSegments: /* @__PURE__ */ new Set()
          }
        ],
        [
          "marketplace",
          {
            identifier: "[location]",
            firstSegments: /* @__PURE__ */ new Set(["item", "np", "search", "category", "you", "create", "saved"]),
            laterSegments: /* @__PURE__ */ new Set(["item", "category", "search", "selling", "buying"])
          }
        ],
        [
          "commerce",
          { identifier: "[segment]", firstSegments: /* @__PURE__ */ new Set(["listing"]), laterSegments: /* @__PURE__ */ new Set() }
        ]
      ]);
    }
  });

  // src/diagnostics/serialization.ts
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
      buildSource: getBuildSource(script),
      supportURL: script && script.supportURL ? script.supportURL : getSupportUrl(),
      handler: gm && gm.info && gm.info.scriptHandler ? gm.info.scriptHandler : "unknown"
    };
  }
  function getBuildSource(script) {
    if (!script) {
      return "unknown";
    }
    const sourceUrl = script.downloadURL || script.updateURL || "";
    if (!sourceUrl) {
      return "unknown";
    }
    try {
      const url = new URL(sourceUrl);
      const repositoryPath = "/Artificial-Sweetener/facebook-clean-my-feeds/";
      if (url.hostname === "raw.githubusercontent.com" && url.pathname.startsWith(repositoryPath)) {
        const sourcePath = url.pathname.slice(repositoryPath.length);
        const fileSuffix = "/fb-clean-my-feeds.user.js";
        const refPath = sourcePath.endsWith(fileSuffix) ? sourcePath.slice(0, -fileSuffix.length) : sourcePath;
        return `github:${decodeURIComponent(refPath)}`;
      }
      if (url.hostname === "greasyfork.org" || url.hostname.endsWith(".greasyfork.org")) {
        return "greasyfork";
      }
      return "custom";
    } catch (e) {
      return "custom";
    }
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
          if (url.protocol === "http:" || url.protocol === "https:") {
            samples.push(`${url.origin}${url.pathname}`);
          } else if (url.protocol === "data:") {
            samples.push("data-script");
          } else if (url.protocol === "blob:") {
            samples.push("blob-script");
          } else if (url.protocol === "javascript:") {
            samples.push("javascript-script");
          } else if (["moz-extension:", "chrome-extension:"].includes(url.protocol)) {
            samples.push("extension-script");
          } else {
            samples.push("other-script");
          }
        } catch (e) {
          samples.push("unparseable-script");
        }
        continue;
      }
      samples.push("inline-script");
    }
    return samples;
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
    const pathname = sanitizePathname(location.pathname || "");
    const url = `${origin}${pathname}`;
    return { url, pathname, search: "" };
  }
  var SUPPORT_URL_FALLBACK;
  var init_serialization = __esm({
    "src/diagnostics/serialization.ts"() {
      "use strict";
      init_location();
      SUPPORT_URL_FALLBACK = "https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/issues";
    }
  });

  // src/diagnostics/redaction.ts
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
  function getSanitizedReason(reason, safeReasons) {
    if (!reason || reason.trim() === "") {
      return "unlabeled";
    }
    return safeReasons.has(reason) ? reason : `hash:${hashText(reason)}`;
  }
  var BLOCKED_TEXT_OPTION_KEYS, BLOCKED_TEXT_FILTER_KEYS;
  var init_redaction = __esm({
    "src/diagnostics/redaction.ts"() {
      "use strict";
      BLOCKED_TEXT_OPTION_KEYS = [
        "NF_BLOCKED_TEXT",
        "GF_BLOCKED_TEXT",
        "VF_BLOCKED_TEXT",
        "MP_BLOCKED_TEXT",
        "MP_BLOCKED_TEXT_DESCRIPTION",
        "PP_BLOCKED_TEXT"
      ];
      BLOCKED_TEXT_FILTER_KEYS = [
        ...BLOCKED_TEXT_OPTION_KEYS,
        "NF_BLOCKED_TEXT_LC",
        "GF_BLOCKED_TEXT_LC",
        "VF_BLOCKED_TEXT_LC",
        "MP_BLOCKED_TEXT_LC",
        "MP_BLOCKED_TEXT_DESCRIPTION_LC",
        "PP_BLOCKED_TEXT_LC"
      ];
    }
  });

  // src/utils/random.ts
  function generateRandomString(length = 13) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const strArray = [chars.charAt(Math.floor(Math.random() * 52))];
    for (let i = 1; i < length; i += 1) {
      strArray.push(chars.charAt(Math.floor(Math.random() * chars.length)));
    }
    return strArray.join("");
  }
  var init_random = __esm({
    "src/utils/random.ts"() {
      "use strict";
    }
  });

  // src/dom/attributes.ts
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
  var postAtt, postAttCPID, postPropDS, postAttChildFlag, postAttTab, postAttMPSkip, rvAtt, mainColumnAtt;
  var init_attributes = __esm({
    "src/dom/attributes.ts"() {
      "use strict";
      init_random();
      postAtt = "cmfr";
      postAttCPID = "cmfcpid";
      postPropDS = "cmfDusted";
      postAttChildFlag = "cmfcf";
      postAttTab = "cmftsb";
      postAttMPSkip = "cmfsmp";
      rvAtt = "cmfrv";
      mainColumnAtt = "cmfmc";
    }
  });

  // src/selectors/groups.ts
  var groupsSelectors;
  var init_groups = __esm({
    "src/selectors/groups.ts"() {
      "use strict";
      groupsSelectors = {
        mainColumn: 'div[role="navigation"] ~ div[role="main"]',
        groupPageMainColumn: 'div[role="main"] div[role="feed"]',
        dialog: 'div[role="dialog"]',
        feedQueryRecent: 'h2[dir="auto"] + div > div',
        feedQueryMultiple: 'div[role="feed"] > div',
        feedQuerySingle: 'div[role="feed"] > div'
      };
    }
  });

  // src/selectors/videos.ts
  var videosSelectors;
  var init_videos = __esm({
    "src/selectors/videos.ts"() {
      "use strict";
      videosSelectors = {
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
    }
  });

  // src/selectors/marketplace.ts
  var marketplaceSelectors, marketplaceListingQueries, marketplaceSponsoredHeadingQuery, marketplaceSponsoredTileQuery;
  var init_marketplace = __esm({
    "src/selectors/marketplace.ts"() {
      "use strict";
      marketplaceSelectors = {
        mainColumn: 'div[role="navigation"] ~ div[role="main"]',
        dialogItem: 'div[hidden] ~ div[class*="__"] div[role="dialog"]'
      };
      marketplaceListingQueries = [
        'div[style] > div > div > span > div > div > div > div > a[href*="/marketplace/item/"]',
        'div[style] > div > div > span > div > div > div > div > a[href*="/marketplace/np/item/"]',
        'div[style] > div > span > div > div > a[href*="/marketplace/item/"]',
        'div[style] > div > span > div > div > a[href*="/marketplace/np/item/"]',
        'div[style] > div > div > span > div > div > a[href*="/marketplace/item/"]',
        'div[style] > div > div > span > div > div > a[href*="/marketplace/np/item/"]'
      ];
      marketplaceSponsoredHeadingQuery = 'div > a[href="/ads/about/?entry_product=ad_preferences"], div > object > a[href="/ads/about/?entry_product=ad_preferences"]';
      marketplaceSponsoredTileQuery = ':scope > span > div:first-of-type > a:not([href*="marketplace"]), :scope > span > div:first-of-type > div > a:not([href*="marketplace"])';
    }
  });

  // src/selectors/profile.ts
  var profileSelectors;
  var init_profile = __esm({
    "src/selectors/profile.ts"() {
      "use strict";
      profileSelectors = {
        mainColumn: 'div[role="main"]',
        dialog: 'div[role="dialog"]',
        postsQuery: 'div[role="main"] > div > div > div > div:nth-of-type(2) > div:not([class]) > div > div[class]'
      };
    }
  });

  // src/selectors/search.ts
  var searchSelectors;
  var init_search = __esm({
    "src/selectors/search.ts"() {
      "use strict";
      searchSelectors = {
        mainColumn: 'div[role="region"] ~ div[role="main"]',
        postsQuery: 'div[role="feed"] > div > div'
      };
    }
  });

  // src/utils/dom.ts
  function climbUpTheTree(element, numberOfBranches = 1) {
    let current = element;
    let remaining = numberOfBranches;
    while (current && remaining > 0) {
      current = current.parentNode;
      remaining -= 1;
    }
    return current;
  }
  function querySelectorAllNoChildren(container = document, queries = [], minText = 0, executeAllQueries = false) {
    var _a, _b;
    const queryList = typeof queries === "string" ? [queries] : queries;
    if (queryList.length === 0) return [];
    if (executeAllQueries) {
      return Array.from(container.querySelectorAll(queryList.join(","))).filter(
        (element) => {
          var _a2, _b2;
          return element.children.length === 0 && ((_b2 = (_a2 = element.textContent) == null ? void 0 : _a2.length) != null ? _b2 : 0) >= minText;
        }
      );
    }
    for (const query of queryList) {
      for (const element of container.querySelectorAll(query)) {
        if (element.children.length === 0 && ((_b = (_a = element.textContent) == null ? void 0 : _a.length) != null ? _b : 0) >= minText) {
          return [element];
        }
      }
    }
    return [];
  }
  var init_dom = __esm({
    "src/utils/dom.ts"() {
      "use strict";
    }
  });

  // src/dom/animated-gifs.ts
  function getMosquitosQuery() {
    return `div[role="button"][aria-label*="GIF"]:not([${postAtt}]) > i:not([data-visualcompletion])`;
  }
  function swatTheMosquitos(post) {
    if (!post || typeof post.querySelectorAll !== "function") {
      return;
    }
    const animatedGIFs = post.querySelectorAll(getMosquitosQuery());
    for (const gif of animatedGIFs) {
      const control = gif.parentElement;
      if (!control || control.hasAttribute(postAtt)) continue;
      let parent = climbUpTheTree(gif, 2);
      let sibling = parent instanceof Element ? parent.querySelector(":scope > a") : null;
      if (!sibling) {
        parent = climbUpTheTree(gif, 3);
        sibling = parent instanceof Element ? parent.querySelector(":scope > a") : null;
      }
      if (sibling) {
        const siblingCS = window.getComputedStyle(sibling);
        control.setAttribute(postAtt, "1");
        if (siblingCS.opacity === "0") {
          control.click();
        }
      }
    }
  }
  var init_animated_gifs = __esm({
    "src/dom/animated-gifs.ts"() {
      "use strict";
      init_dom();
      init_attributes();
    }
  });

  // src/dom/dusting.ts
  function doLightDusting(post, state) {
    if (!post || !state) {
      return;
    }
    let scanCount = state.scanCountStart;
    if (post[postPropDS] !== void 0) {
      scanCount = parseInt(String(post[postPropDS]), 10);
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
  function getDustingCount(post) {
    return post.cmfDusted;
  }
  var init_dusting = __esm({
    "src/dom/dusting.ts"() {
      "use strict";
      init_attributes();
    }
  });

  // src/dom/captions.ts
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
    elDetails.setAttribute(attributes.postAtt, marker === false ? "" : String(marker));
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
  var init_captions = __esm({
    "src/dom/captions.ts"() {
      "use strict";
    }
  });

  // src/dom/hide.ts
  function hideBlock(block, link, reason, state, options, attributes) {
    if (!(block instanceof Element) || !link || !state || !options || !attributes) {
      return;
    }
    block.setAttribute(state.cssHideEl, "");
    link.setAttribute(attributes.postAtt, sanitizeReason(reason));
    if (options.VERBOSITY_DEBUG) {
      block.setAttribute(state.showAtt, "");
    }
  }
  function syncDebugVisibility(element, state, options) {
    if (!element || !state || !options) {
      return;
    }
    if (options.VERBOSITY_DEBUG) {
      element.setAttribute(state.showAtt, "");
    } else {
      element.removeAttribute(state.showAtt);
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
  function hideFeatureNoCaption(feature, reason, context) {
    if (!feature || !context) {
      return;
    }
    const { options, state } = context;
    if (!options || !state) {
      return;
    }
    feature.setAttribute(postAtt, sanitizeReason(reason));
    feature.setAttribute(state.hideWithNoCaptionAtt, "");
    syncDebugVisibility(feature, state, options);
  }
  function toggleHiddenElements(state, options) {
    if (!state || !options) {
      return;
    }
    const containers = Array.from(document.querySelectorAll(`[${state.hideAtt}]`));
    const noCaptionRows = Array.from(document.querySelectorAll(`[${state.hideWithNoCaptionAtt}]`));
    const blocks = Array.from(document.querySelectorAll(`[${state.cssHideEl}]`));
    const shares = Array.from(document.querySelectorAll(`[${state.cssHideNumberOfShares}]`));
    const elements = [...containers, ...noCaptionRows, ...blocks, ...shares];
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
    if (!(elSummary instanceof Element)) return;
    const elDetails = elSummary.parentElement;
    const elPostContent = elDetails == null ? void 0 : elDetails.querySelector("div");
    if (!elDetails || !elPostContent) return;
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
  var init_hide = __esm({
    "src/dom/hide.ts"() {
      "use strict";
      init_random();
      init_attributes();
      init_captions();
      init_captions();
    }
  });

  // src/dom/info-boxes.ts
  function getMatch(value) {
    return typeof value === "object" ? value.pathMatch : void 0;
  }
  function scrubInfoBoxes(post, options, keyWords, pathInfo2, state) {
    if (!post || !options || !keyWords || !pathInfo2 || !state) {
      return;
    }
    let hiding = false;
    if (options.OTHER_INFO_BOX_CLIMATE_SCIENCE && pathInfo2.OTHER_INFO_BOX_CLIMATE_SCIENCE && getMatch(pathInfo2.OTHER_INFO_BOX_CLIMATE_SCIENCE)) {
      const elLink = post.querySelector(
        `a[href*="${getMatch(pathInfo2.OTHER_INFO_BOX_CLIMATE_SCIENCE)}"]:not([${postAtt}])`
      );
      if (elLink) {
        const block = climbUpTheTree(elLink, 5);
        hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_CLIMATE_SCIENCE, state, options, {
          postAtt
        });
        hiding = true;
      }
    }
    if (!hiding && options.OTHER_INFO_BOX_CORONAVIRUS && pathInfo2.OTHER_INFO_BOX_CORONAVIRUS && getMatch(pathInfo2.OTHER_INFO_BOX_CORONAVIRUS)) {
      const elLink = post.querySelector(
        `a[href*="${getMatch(pathInfo2.OTHER_INFO_BOX_CORONAVIRUS)}"]:not([${postAtt}])`
      );
      if (elLink) {
        const block = climbUpTheTree(elLink, 5);
        hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_CORONAVIRUS, state, options, {
          postAtt
        });
        hiding = true;
      }
    }
    if (!hiding && options.OTHER_INFO_BOX_SUBSCRIBE && pathInfo2.OTHER_INFO_BOX_SUBSCRIBE && getMatch(pathInfo2.OTHER_INFO_BOX_SUBSCRIBE)) {
      const elLink = post.querySelector(
        `a[href*="${getMatch(pathInfo2.OTHER_INFO_BOX_SUBSCRIBE)}"]:not([${postAtt}])`
      );
      if (elLink) {
        const block = climbUpTheTree(elLink, 5);
        hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_SUBSCRIBE, state, options, {
          postAtt
        });
      }
    }
  }
  var init_info_boxes = __esm({
    "src/dom/info-boxes.ts"() {
      "use strict";
      init_dom();
      init_attributes();
      init_hide();
    }
  });

  // src/core/filters/matching.ts
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
  var init_matching = __esm({
    "src/core/filters/matching.ts"() {
      "use strict";
    }
  });

  // src/core/filters/classifiers/blocked-text.ts
  function findBlockedText(postText, patterns, useRegExp) {
    if (!Array.isArray(patterns) || patterns.length === 0) {
      return "";
    }
    if (useRegExp) {
      return findFirstMatchRegExp(postText, patterns);
    }
    return findFirstMatch(postText, patterns);
  }
  var init_blocked_text = __esm({
    "src/core/filters/classifiers/blocked-text.ts"() {
      "use strict";
      init_matching();
    }
  });

  // src/core/filters/text-normalize.ts
  function cleanText(text) {
    return text.normalize("NFKC");
  }
  var init_text_normalize = __esm({
    "src/core/filters/text-normalize.ts"() {
      "use strict";
    }
  });

  // src/dom/walker.ts
  function countDescendants(element) {
    return element.querySelectorAll("div, span").length;
  }
  function isNestedMarkedNode(node, root) {
    if (!node || !root || typeof node.closest !== "function") {
      return false;
    }
    const markedAncestor = node.closest(`[${postAtt}]`);
    return !!markedAncestor && markedAncestor !== root;
  }
  function scanTreeForText(node) {
    var _a;
    const arrayTextValues = [];
    const elements = node.querySelectorAll(":scope > div, :scope > blockquote, :scope > span");
    for (const element of elements) {
      if (isNestedMarkedNode(element, node)) {
        continue;
      }
      if (element.hasAttribute("aria-hidden") && element.getAttribute("aria-hidden") === "false") {
        continue;
      }
      const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
      let currentNode;
      while (currentNode = walk.nextNode()) {
        const elParent = currentNode.parentElement;
        if (!elParent) continue;
        const elParentTN = elParent.tagName.toLowerCase();
        const val = cleanText((_a = currentNode.textContent) != null ? _a : "").trim();
        if (isNestedMarkedNode(elParent, node)) {
          continue;
        }
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
    var _a;
    const arrayTextValues = [];
    let currentNode;
    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    while (currentNode = walk.nextNode()) {
      const val = cleanText((_a = currentNode.textContent) != null ? _a : "").trim();
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
      if (isNestedMarkedNode(img, node)) {
        continue;
      }
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
      if (!block) continue;
      if (isNestedMarkedNode(block, post)) {
        continue;
      }
      if (countDescendants(block) > 0) {
        arrayTextValues.push(...scanTreeForText(block));
        arrayTextValues.push(...scanImagesForAltText(block));
      }
    }
    return arrayTextValues.filter((item) => item !== "");
  }
  var init_walker = __esm({
    "src/dom/walker.ts"() {
      "use strict";
      init_text_normalize();
      init_attributes();
    }
  });

  // src/feeds/shared/blocks.ts
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
  var init_blocks = __esm({
    "src/feeds/shared/blocks.ts"() {
      "use strict";
    }
  });

  // src/feeds/shared/blocked-text.ts
  function findNewsBlockedText(post, options, filters) {
    if (!post || !options || !filters) {
      return "";
    }
    const postTexts = extractTextContent(post, getNewsBlocksQuery(post), 3).join(" ");
    const useRegExp = options.NF_BLOCKED_RE;
    return findBlockedText(
      useRegExp ? postTexts : postTexts.toLowerCase(),
      useRegExp ? filters.NF_BLOCKED_TEXT : filters.NF_BLOCKED_TEXT_LC,
      useRegExp
    );
  }
  function findGroupsBlockedText(post, options, filters) {
    if (!post || !options || !filters) {
      return "";
    }
    const postTexts = extractTextContent(post, getGroupsBlocksQuery(post), 3).join(" ");
    const useRegExp = options.GF_BLOCKED_RE;
    return findBlockedText(
      useRegExp ? postTexts : postTexts.toLowerCase(),
      useRegExp ? filters.GF_BLOCKED_TEXT : filters.GF_BLOCKED_TEXT_LC,
      useRegExp
    );
  }
  function findVideosBlockedText(post, options, filters, queryBlocks) {
    if (!post || !options || !filters || !queryBlocks) {
      return "";
    }
    const postTexts = extractTextContent(post, queryBlocks, 1).join(" ");
    const useRegExp = options.VF_BLOCKED_RE;
    return findBlockedText(
      useRegExp ? postTexts : postTexts.toLowerCase(),
      useRegExp ? filters.VF_BLOCKED_TEXT : filters.VF_BLOCKED_TEXT_LC,
      useRegExp
    );
  }
  function findProfileBlockedText(post, options, filters) {
    if (!post || !options || !filters) {
      return "";
    }
    const postTexts = extractTextContent(post, getNewsBlocksQuery(post), 3).join(" ");
    const useRegExp = options.PP_BLOCKED_RE;
    return findBlockedText(
      useRegExp ? postTexts : postTexts.toLowerCase(),
      useRegExp ? filters.PP_BLOCKED_TEXT : filters.PP_BLOCKED_TEXT_LC,
      useRegExp
    );
  }
  var init_blocked_text2 = __esm({
    "src/feeds/shared/blocked-text.ts"() {
      "use strict";
      init_blocked_text();
      init_walker();
      init_blocks();
    }
  });

  // src/feeds/shared/animated-gifs.ts
  function hasNewsAnimatedGifContent(post, keyWords) {
    if (!post || !keyWords) {
      return "";
    }
    const postBlocks = post.querySelectorAll(getNewsBlocksQuery(post));
    if (postBlocks.length >= 2) {
      const contentBlock = postBlocks[1];
      if (!contentBlock) return "";
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
      if (!contentBlock) return "";
      const animatedGIFs = contentBlock.querySelectorAll(getMosquitosQuery());
      return animatedGIFs.length > 0 ? keyWords.GF_ANIMATED_GIFS_POSTS : "";
    }
    return "";
  }
  var init_animated_gifs2 = __esm({
    "src/feeds/shared/animated-gifs.ts"() {
      "use strict";
      init_animated_gifs();
      init_blocks();
    }
  });

  // src/feeds/shared/sponsored.ts
  function normalizeLabel(label) {
    return label.normalize("NFKC").replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  }
  function facebookUrl(link) {
    const href = link.getAttribute("href");
    if (!href) return null;
    try {
      const url = new URL(href, "https://www.facebook.com/");
      return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password && (url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com")) ? url : null;
    } catch (e) {
      return null;
    }
  }
  function isOwnedControl(control, post, bodies) {
    var _a;
    if (isNestedMarkedNode(control, post)) return false;
    const authoredRegion = control.closest(authoredRegionSelector);
    if (authoredRegion && post.contains(authoredRegion)) return false;
    if (bodies.some((body) => body.contains(control))) return false;
    const owner = control.closest(postOwnerSelector);
    if (!owner || owner === post || !post.contains(owner)) return true;
    if (post.matches(`${postOwnerSelector}, div[aria-describedby], div[data-virtualized]`))
      return false;
    const parentOwner = (_a = owner.parentElement) == null ? void 0 : _a.closest(postOwnerSelector);
    return !parentOwner || !post.contains(parentOwner);
  }
  function authoredBlocks(post, state) {
    if (state.isNF || state.isGF || state.isSF) {
      return Array.from(post.querySelectorAll(getNewsBlocksQuery(post))).slice(1);
    }
    if (state.isVF) {
      return Array.from(
        post.querySelectorAll(
          `${videosSelectors.blockQueries.videos}, ${videosSelectors.blockQueries.search}`
        )
      );
    }
    return [];
  }
  function visibleControlText(control) {
    var _a;
    const walker = control.ownerDocument.createTreeWalker(control, NodeFilter.SHOW_TEXT);
    let text = "";
    let node;
    while (node = walker.nextNode()) {
      let element = node.parentElement;
      let visible = true;
      while (element && control.contains(element)) {
        const style = (_a = element.ownerDocument.defaultView) == null ? void 0 : _a.getComputedStyle(element);
        if (element.matches('script, style, [hidden], [aria-hidden="true"]') || (style == null ? void 0 : style.display) === "none" || (style == null ? void 0 : style.visibility) === "hidden") {
          visible = false;
          break;
        }
        if (element === control) break;
        element = element.parentElement;
      }
      if (visible) text += node.textContent || "";
    }
    return text;
  }
  function hasSponsoredName(control, post, bodies) {
    const ariaLabel = control.getAttribute("aria-label");
    if (ariaLabel) return sponsoredLabels.has(normalizeLabel(ariaLabel));
    const labelIds = control.getAttribute("aria-labelledby");
    if (labelIds) {
      const labels = labelIds.trim().split(/\s+/).map(
        (id) => Array.from(post.querySelectorAll("[id]")).find(
          (element) => element.id === id && !element.contains(control) && isOwnedControl(element, post, bodies)
        )
      );
      if (labels.every((label) => label !== void 0)) {
        return sponsoredLabels.has(
          normalizeLabel(labels.map((label) => (label == null ? void 0 : label.textContent) || "").join(" "))
        );
      }
      return false;
    }
    return [visibleControlText(control), control.getAttribute("title") || ""].some(
      (label) => sponsoredLabels.has(normalizeLabel(label))
    );
  }
  function hasSponsoredCorroboration(link, post, bodies) {
    if (hasSponsoredName(link, post, bodies)) return true;
    const header = link.closest("h4, h5");
    return !!header && post.contains(header) && Array.from(header.querySelectorAll('a, button, [role="button"], [role="link"]')).some(
      (control) => isOwnedControl(control, post, bodies) && hasSponsoredName(control, post, bodies)
    );
  }
  function isSponsored(post, state) {
    return inspectSponsored(post, state).isSponsored;
  }
  function isSponsoredDisclosure(control, post) {
    if (!control.matches("a[href]")) return false;
    const url = facebookUrl(control);
    const owner = control.closest(postOwnerSelector);
    return (url == null ? void 0 : url.pathname) === "/ads/about/" && (!owner || owner === post || !post.contains(owner)) && isOwnedControl(control, post, []) && Array.from(control.querySelectorAll("*")).every((child) => isOwnedControl(child, post, [])) && hasSponsoredName(control, post, []);
  }
  function getSponsoredDiagnostics(post, state) {
    return inspectSponsored(post, state).diagnostics;
  }
  function inspectSponsored(post, state) {
    const diagnostics = createSponsoredDiagnostics(post, state);
    if (!post || !state) return { isSponsored: false, diagnostics };
    const bodies = authoredBlocks(post, state);
    diagnostics.adsAboutLinkCount = Array.from(post.querySelectorAll("a[href]")).filter((link) => {
      const url = facebookUrl(link);
      return (url == null ? void 0 : url.pathname) === "/ads/about/" && isOwnedControl(link, post, bodies) && hasSponsoredName(link, post, bodies);
    }).length;
    if (diagnostics.adsAboutLinkCount > 0) {
      diagnostics.matchedBy = "ads-about";
      return { isSponsored: true, diagnostics };
    }
    const candidates = collectCftLinkCandidates(post, state, bodies);
    diagnostics.cftLinks.selectedSource = candidates.selectedSource;
    diagnostics.cftLinks.selectedCount = candidates.links.length;
    diagnostics.cftLinks.rejectedForVolume = candidates.links.length >= maximumCandidateLinks;
    if (diagnostics.cftLinks.rejectedForVolume) return { isSponsored: false, diagnostics };
    const inspectedLinks = candidates.links.slice(0, maximumInspectedLinks);
    diagnostics.cftLinks.inspectedCount = inspectedLinks.length;
    inspectedLinks.forEach((link) => {
      var _a;
      const value = (_a = facebookUrl(link)) == null ? void 0 : _a.searchParams.get("__cft__[0]");
      const signatureLength = value === null || value === void 0 ? 0 : cftParam.length + value.length;
      if (signatureLength >= diagnostics.cftLinks.minimumSignatureLength) {
        diagnostics.cftLinks.meetsMinimumCount += 1;
      } else {
        diagnostics.cftLinks.belowMinimumCount += 1;
      }
    });
    const isSponsoredPost = diagnostics.cftLinks.meetsMinimumCount > 0;
    if (isSponsoredPost) diagnostics.matchedBy = "cft-link-signature";
    return { isSponsored: isSponsoredPost, diagnostics };
  }
  function collectCftLinkCandidates(post, state, bodies) {
    const queries = [];
    let selectedSource = "none";
    if (state.isNF || state.isGF) {
      const link = `span > a[href*="${cftParam}"]:not([href^="/groups/"]):not([href*="section_header_type"])`;
      queries.push(`div[aria-posinset] ${link}`, `div[aria-describedby] ${link}`);
      selectedSource = "nested-wrapper";
    } else if (state.isVF) {
      queries.push(`div > div > div > div > span > span > div > a[href*="${cftParam}"]`);
      selectedSource = "video-wrapper";
    } else if (state.isSF) {
      queries.push(`div[role="article"] span > a[href*="${cftParam}"]`);
      selectedSource = "nested-article";
    }
    for (const query of queries) {
      const links = Array.from(post.querySelectorAll(query)).filter((link) => {
        const url = facebookUrl(link);
        return url !== null && !url.pathname.startsWith("/groups/") && !url.searchParams.has("section_header_type") && url.searchParams.has("__cft__[0]") && isOwnedControl(link, post, bodies) && hasSponsoredCorroboration(link, post, bodies);
      });
      if (links.length > 0) return { links, selectedSource };
    }
    return { links: [], selectedSource: "none" };
  }
  function createSponsoredDiagnostics(post, state) {
    const canMatchRoot = !!(post && typeof post.matches === "function");
    return {
      matchedBy: "none",
      adsAboutLinkCount: 0,
      rootContainer: canMatchRoot && post.matches('div[role="article"], div[aria-posinset], div[aria-describedby]'),
      rootRoleArticle: canMatchRoot && post.matches('div[role="article"]'),
      rootAriaPosinset: canMatchRoot && post.matches("div[aria-posinset]"),
      rootAriaDescribedby: canMatchRoot && post.matches("div[aria-describedby]"),
      cftLinks: {
        minimumSignatureLength: state ? state.isSF ? 250 : state.isVF ? 299 : 311 : 0,
        selectedSource: "none",
        selectedCount: 0,
        inspectedCount: 0,
        belowMinimumCount: 0,
        meetsMinimumCount: 0,
        rejectedForVolume: false
      }
    };
  }
  var cftParam, maximumCandidateLinks, maximumInspectedLinks, postOwnerSelector, authoredRegionSelector, sponsoredLabels;
  var init_sponsored = __esm({
    "src/feeds/shared/sponsored.ts"() {
      "use strict";
      init_walker();
      init_i18n();
      init_videos();
      init_blocks();
      cftParam = "__cft__[0]=";
      maximumCandidateLinks = 10;
      maximumInspectedLinks = 2;
      postOwnerSelector = 'div[role="article"], div[aria-posinset]';
      authoredRegionSelector = 'p, blockquote, [data-ad-preview="message"], [data-ad-comet-preview="message"], [data-ad-rendering-role="story_message"], [data-ad-rendering-role="creative_body"], [contenteditable="true"], [data-commentid], [data-testid^="UFI2Comment/"], [role="comment"]';
      sponsoredLabels = new Set(
        Object.values(translations).flatMap(
          (catalog24) => [catalog24.SPONSORED, catalog24.SPONSORED_EXTRA].filter((label) => typeof label === "string").map(normalizeLabel)
        )
      );
    }
  });

  // src/feeds/shared/shares.ts
  function hideNumberOfShares(post, state, options) {
    if (!post || !state || !options) {
      return;
    }
    const query = `div[data-visualcompletion="ignore-dynamic"] > div:not([class]) > div:not([class]) > div:not([class]) > div[class] > div:nth-of-type(1) > div > div > span > div:not([id]) > span[dir]:not([${postAtt}])`;
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
    const query = `div[data-visualcompletion="ignore-dynamic"] > div:not([class]) > div:not([class]) > div:not([class]) > div[class] > div:nth-of-type(1) > div > div > span > div:not([id]) > span[dir]:not([${postAtt}])`;
    return post.querySelectorAll(query).length;
  }
  var init_shares = __esm({
    "src/feeds/shared/shares.ts"() {
      "use strict";
      init_attributes();
    }
  });

  // src/dom/dirty-check.ts
  function hasSizeChanged(oldValue, newValue, tolerance = 16) {
    if (oldValue === null || oldValue === void 0) {
      return true;
    }
    const oldNumber = parseInt(String(oldValue), 10);
    const newNumber = parseInt(String(newValue), 10);
    if (Number.isNaN(oldNumber) || Number.isNaN(newNumber)) {
      return true;
    }
    return Math.abs(newNumber - oldNumber) > tolerance;
  }
  function getDirtyEntry(target) {
    var _a;
    if (!target) {
      return null;
    }
    if (!dirtyTokens.has(target)) {
      dirtyTokens.set(target, { dirtyToken: 0, lastProcessedToken: -1 });
    }
    return (_a = dirtyTokens.get(target)) != null ? _a : null;
  }
  function getDirtyToken(target) {
    const entry = getDirtyEntry(target);
    return entry ? entry.dirtyToken : 0;
  }
  function buildPostSignature(post) {
    return post ? `${post.getAttribute("aria-posinset") || ""}|${post.innerHTML}` : "";
  }
  function hasPostChanged(post) {
    if (!post) {
      return false;
    }
    const signature = buildPostSignature(post);
    const previous = postSignatures.get(post);
    postSignatures.set(post, signature);
    if (previous === void 0) {
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
  function revalidateTrackedPosts(root, state) {
    if (!root) return;
    for (const post of root.querySelectorAll(`[${postAtt}]`)) {
      const previous = postSignatures.get(post);
      if (previous === void 0 || previous === buildPostSignature(post)) continue;
      resetPostState(post, state);
      postSignatures.delete(post);
    }
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
      var _a;
      const parent = details.parentNode;
      if (!parent) {
        return;
      }
      (_a = details.querySelector(":scope > summary")) == null ? void 0 : _a.remove();
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
    for (const caption of post.querySelectorAll(`h6[${postAttTab}]`)) caption.remove();
    for (const child of post.querySelectorAll(`[${postAttCPID}], [${state.hideAtt}]`)) {
      child.removeAttribute(postAttCPID);
      child.removeAttribute(state.hideAtt);
      child.removeAttribute(state.showAtt);
    }
  }
  function markElementDirty(target) {
    const entry = getDirtyEntry(target);
    if (!entry) {
      return;
    }
    entry.dirtyToken += 1;
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
      characterData: true
    });
    observers.set(target, observer);
    activeObservers.set(target, observer);
    markElementDirty(target);
    return observer;
  }
  function clearDirtyTracking() {
    for (const observer of activeObservers.values()) observer.disconnect();
    activeObservers.clear();
    observers = /* @__PURE__ */ new WeakMap();
    dirtyTokens = /* @__PURE__ */ new WeakMap();
    postSignatures = /* @__PURE__ */ new WeakMap();
  }
  function pruneDirtyObservers() {
    for (const [target, observer] of activeObservers) {
      if (target.isConnected) continue;
      observer.disconnect();
      observers.delete(target);
      activeObservers.delete(target);
    }
  }
  var dirtyTokens, postSignatures, observers, activeObservers;
  var init_dirty_check = __esm({
    "src/dom/dirty-check.ts"() {
      "use strict";
      init_attributes();
      dirtyTokens = /* @__PURE__ */ new WeakMap();
      postSignatures = /* @__PURE__ */ new WeakMap();
      observers = /* @__PURE__ */ new WeakMap();
      activeObservers = /* @__PURE__ */ new Map();
    }
  });

  // src/feeds/news-revalidation.ts
  function rememberHiddenNewsContent(post) {
    if (post.hasAttribute(postAtt)) hiddenNewsContent.set(post, post.innerHTML);
    else hiddenNewsContent.delete(post);
  }
  function resetChangedNewsPosts(root, state) {
    if (!root) return;
    for (const post of root.querySelectorAll(`[${postAtt}]`)) {
      const previous = hiddenNewsContent.get(post);
      if (previous === void 0 || previous === post.innerHTML) continue;
      hiddenNewsContent.delete(post);
      for (const caption of post.querySelectorAll(`:scope > h6[${postAttTab}]`)) caption.remove();
      post.removeAttribute(postAtt);
      post.removeAttribute(state.hideAtt);
      post.removeAttribute(state.showAtt);
      const wrapper = post.parentElement;
      if (wrapper == null ? void 0 : wrapper.matches(`details[${postAtt}]`)) wrapper.replaceWith(post);
    }
  }
  var hiddenNewsContent;
  var init_news_revalidation = __esm({
    "src/feeds/news-revalidation.ts"() {
      "use strict";
      init_attributes();
      hiddenNewsContent = /* @__PURE__ */ new WeakMap();
    }
  });

  // src/feeds/news-discovery.ts
  function isNewsDirty(state) {
    const arrReturn = [null, null];
    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    if (mainColumn) {
      if (state && state.forceProcess) {
        arrReturn[0] = mainColumn;
      } else if (!mainColumn.hasAttribute(mainColumnAtt)) {
        arrReturn[0] = mainColumn;
      } else if (hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)) {
        arrReturn[0] = mainColumn;
      }
    }
    const elDialog = document.querySelector(newsSelectors.dialog);
    if (elDialog) {
      if (state && state.forceProcess) {
        arrReturn[1] = elDialog;
      } else if (!elDialog.hasAttribute(mainColumnAtt)) {
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
  function getNewsPostDiscovery() {
    const concreteQuery = 'div[role="main"] div[aria-posinset], div[role="main"] div[role="article"]';
    const concretePosts = Array.from(document.querySelectorAll(concreteQuery)).filter((post) => {
      var _a;
      const parentPost = (_a = post.parentElement) == null ? void 0 : _a.closest(newsSelectors.standardPost);
      return !parentPost || !parentPost.closest('div[role="main"]');
    });
    if (concretePosts.length > 0) {
      const query = concretePosts.every((post) => post.hasAttribute("aria-posinset")) ? 'div[role="main"] div[aria-posinset]' : concretePosts.every((post) => post.getAttribute("role") === "article") ? 'div[role="main"] div[role="article"]' : concreteQuery;
      return { query, posts: concretePosts };
    }
    for (const query of prioritizedNewsPostQueries) {
      const nodeList = document.querySelectorAll(query);
      if (nodeList.length > 0) {
        return { query, posts: Array.from(nodeList) };
      }
    }
    return { query: "", posts: [] };
  }
  function getCollectionOfNewsPosts() {
    return getNewsPostDiscovery().posts;
  }
  function getOrphanSponsoredNewsPosts(mainColumn) {
    if (!mainColumn || typeof mainColumn.querySelectorAll !== "function") {
      return [];
    }
    const posts = /* @__PURE__ */ new Set();
    const sponsoredLinks = mainColumn.querySelectorAll(newsSelectors.sponsoredLink);
    sponsoredLinks.forEach((link) => {
      if (link.closest(newsSelectors.standardPost)) {
        return;
      }
      const virtualizedPost = link.closest(newsSelectors.virtualizedContainer);
      if (virtualizedPost && virtualizedPost !== mainColumn && mainColumn.contains(virtualizedPost)) {
        posts.add(virtualizedPost);
      }
    });
    return Array.from(posts);
  }
  function scrubOrphanSponsoredNewsPosts(context, mainColumn) {
    if (!context) {
      return;
    }
    const { state, options, keyWords } = context;
    if (!state || !options || !keyWords) {
      return;
    }
    const posts = getOrphanSponsoredNewsPosts(mainColumn);
    posts.forEach((post) => {
      if (post.hasAttribute(postAtt) || !isSponsored(post, { isNF: true })) {
        return;
      }
      hideNewsPost(post, keyWords.SPONSORED, true, {
        options,
        keyWords,
        attributes: {
          postAtt,
          postAttTab
        },
        state
      });
      rememberHiddenNewsContent(post);
    });
  }
  function shouldSweepNewsPosts(state, mainColumn, isMainColumnDirty) {
    if (!mainColumn) {
      return false;
    }
    if (isMainColumnDirty) {
      return true;
    }
    if (!state || typeof state.lastNewsPostSweepAt !== "number") {
      return true;
    }
    return Date.now() - state.lastNewsPostSweepAt >= newsPostSweepIntervalMs;
  }
  var newsPostSweepIntervalMs, prioritizedNewsPostQueries;
  var init_news_discovery = __esm({
    "src/feeds/news-discovery.ts"() {
      "use strict";
      init_attributes();
      init_dirty_check();
      init_hide();
      init_news();
      init_sponsored();
      init_news_revalidation();
      newsPostSweepIntervalMs = 750;
      prioritizedNewsPostQueries = Array.from(
        /* @__PURE__ */ new Set([
          'div[role="main"] div[aria-posinset]',
          'div[role="main"] div[role="article"]',
          ...newsSelectors.postQueries
        ])
      );
    }
  });

  // src/core/filters/classifiers/shares-likes.ts
  function getGroupedInteger(value) {
    const match = /^[1-9]\d{0,2}([,.\u00a0\u202f])\d{3}(?:\1\d{3})*$/.exec(value);
    return match && match[0] === value ? Number(value.replace(/[,.\u00a0\u202f]/g, "")) : void 0;
  }
  function getFullNumber(value) {
    var _a, _b;
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
        numericValue = parseInt((_a = bits[0]) != null ? _a : "", 10) * multiplier;
        if (bits[1] !== void 0) {
          numericValue += parseInt(bits[1], 10) * Math.pow(10, powY - bits[1].length);
        }
      } else {
        numericValue = (_b = getGroupedInteger(upperValue)) != null ? _b : parseInt(upperValue, 10);
      }
    }
    return numericValue;
  }
  var init_shares_likes = __esm({
    "src/core/filters/classifiers/shares-likes.ts"() {
      "use strict";
    }
  });

  // src/i18n/news-labels.ts
  var newsLabels;
  var init_news_labels = __esm({
    "src/i18n/news-labels.ts"() {
      "use strict";
      newsLabels = {
        en: [
          "Follow",
          "Join|Join group",
          "Verified|Verified account",
          "Suggested for you|Recommended for you|Suggested Pages|Pages you may like",
          "Groups you might like|Suggested groups",
          "People you may know",
          "Reels|Reels and short videos",
          "Events you may like",
          "Paid for by ______"
        ],
        ar: [
          "متابعة|تابع",
          "انضمام|انضمام إلى المجموعة",
          "تم التحقق|حساب تم التحقق منه|حساب موثّق",
          "مقترح لك|مقترحات لك|صفحات قد تعجبك",
          "مجموعات قد تعجبك|مجموعات مقترحة",
          "أشخاص قد تعرفهم",
          "ريلز|مقاطع ريلز",
          "أحداث قد تعجبك",
          "مدفوعة بواسطة ______"
        ],
        bg: [
          "Следване|Следвай",
          "Присъединяване|Присъединяване към групата",
          "Потвърден|Потвърден акаунт",
          "Предложения за вас|Страници, които може да харесате",
          "Групи, които може да харесате|Предложени групи",
          "Хора, които може би познавате",
          "Ленти|Reels",
          "Събития, които може да ви харесат",
          "Платено от ______"
        ],
        cs: [
          "Sledovat",
          "Přidat se|Přidat se ke skupině",
          "Ověřeno|Ověřený účet",
          "Navrhované pro vás|Stránky, které by se vám mohly líbit",
          "Skupiny, které by se vám mohly líbit|Navrhované skupiny",
          "Lidé, které možná znáte|Koho možná znáte",
          "Reely|Reels",
          "Události, které se vám mohou líbit",
          "Platí za to ______"
        ],
        de: [
          "Folgen",
          "Beitreten|Gruppe beitreten",
          "Verifiziert|Verifiziertes Konto",
          "Vorschläge für dich|Für dich empfohlen|Seiten, die dir gefallen könnten",
          "Gruppen, die dir gefallen könnten|Vorgeschlagene Gruppen",
          "Personen, die du kennen könntest",
          "Reels",
          "Veranstaltungen, die dir gefallen könnten|Veranstaltungen, die Ihnen gefallen könnten",
          "Finanziert von ______"
        ],
        el: [
          "Ακολούθηση|Ακολούθησε",
          "Συμμετοχή|Γίνετε μέλος",
          "Επαληθευμένος|Επαληθευμένος λογαριασμός",
          "Προτεινόμενα για εσάς|Σελίδες που μπορεί να σας αρέσουν",
          "Ομάδες που μπορεί να σας αρέσουν|Προτεινόμενες ομάδες",
          "Άτομα που ίσως γνωρίζετε",
          "Reels",
          "Εκδηλώσεις που μπορεί να σας αρέσουν",
          "Πληρωμένο από ______"
        ],
        es: [
          "Seguir",
          "Unirte|Unirse|Unirte al grupo",
          "Verificado|Cuenta verificada",
          "Sugerencias para ti|Sugerido para ti|Páginas que te pueden gustar",
          "Grupos que te pueden gustar|Grupos sugeridos",
          "Personas que quizá conozcas|Personas que quizás conozcas",
          "Reels|Reels y vídeos cortos",
          "Eventos que te pueden gustar",
          "Pagado por ______"
        ],
        fi: [
          "Seuraa",
          "Liity|Liity ryhmään",
          "Vahvistettu|Vahvistettu tili",
          "Ehdotuksia sinulle|Sivut, joista saatat pitää",
          "Ryhmät, joista saatat pitää|Ehdotetut ryhmät",
          "Ihmisiä, jotka saatat tuntea|Ihmiset, jotka saatat tuntea",
          "Kelat|Reels",
          "Tapahtumat, joista saatat pitää",
          "Maksaja ______"
        ],
        fr: [
          "Suivre|S’abonner|S'abonner",
          "Rejoindre|Rejoindre le groupe",
          "Vérifié|Compte vérifié",
          "Suggestion pour vous|Suggestions pour vous|Pages qui pourraient vous plaire",
          "Groupes qui pourraient vous plaire|Groupes suggérés",
          "Vous connaissez peut-être|Connaissez-vous...",
          "Reels|Reels et vidéos courtes",
          "Évènements qui pourraient vous intéresser",
          "Financé par ______"
        ],
        he: [
          "עקוב|מעקב",
          "הצטרף|הצטרפות לקבוצה",
          "מאומת|חשבון מאומת",
          "הצעות עבורך|דפים שאולי תאהב",
          "קבוצות שאולי תאהב|קבוצות מוצעות",
          "אנשים שאולי אתה מכיר",
          "רילס|Reels",
          "אירועים שאולי תאהבו",
          "שולם על ידי ______"
        ],
        id: [
          "Ikuti",
          "Gabung|Gabung grup",
          "Terverifikasi|Akun terverifikasi",
          "Disarankan untuk Anda|Halaman yang mungkin Anda sukai",
          "Grup yang mungkin Anda sukai|Grup yang disarankan",
          "Orang yang Mungkin Anda Kenal",
          "Reel|Reels",
          "Acara yang mungkin Anda sukai",
          "Dibayar oleh ______"
        ],
        it: [
          "Segui",
          "Iscriviti|Iscriviti al gruppo",
          "Verificato|Account verificato",
          "Contenuti suggeriti per te|Suggerimenti per te|Pagine che potrebbero piacerti",
          "Gruppi che potrebbero piacerti|Gruppi suggeriti",
          "Persone che potresti conoscere",
          "Reel|Reels",
          "Eventi che potrebbero piacerti",
          "Finanziato da ______"
        ],
        ja: [
          "フォロー|フォローする",
          "参加|グループに参加",
          "認証済み|認証済みアカウント",
          "おすすめ|おすすめのページ",
          "おすすめのグループ",
          "知り合いかも|あなたが知っているかもしれない人々",
          "リール|リール動画",
          "おすすめのイベント",
          "______ による支払い|______による支払い"
        ],
        lv: [
          "Sekot",
          "Pievienoties|Pievienoties grupai",
          "Verificēts|Verificēts konts",
          "Ieteikumi jums|Lapas, kas tev varētu patikt",
          "Grupas, kas tev varētu patikt|Ieteiktās grupas",
          "Cilvēki, kurus tu varētu pazīt",
          "Reels|Rullīši",
          "Notikumi, kas jums varētu patikt",
          "Apmaksā ______"
        ],
        nl: [
          "Volgen",
          "Lid worden|Lid worden van groep",
          "Geverifieerd|Geverifieerd account",
          "Voorgesteld voor jou|Pagina’s die je misschien leuk vindt|Pagina's die je misschien leuk vindt",
          "Groepen die je misschien leuk vindt|Voorgestelde groepen",
          "Mensen die je misschien kent",
          "Reels",
          "Evenementen die je misschien leuk vindt",
          "Betaald door ______"
        ],
        pl: [
          "Obserwuj",
          "Dołącz|Dołącz do grupy",
          "Zweryfikowano|Zweryfikowane konto",
          "Proponowane dla Ciebie|Strony, które możesz polubić",
          "Grupy, które mogą Ci się spodobać|Proponowane grupy",
          "Osoby, które możesz znać",
          "Rolki",
          "Wydarzenia, które mogą Ci się spodobać",
          "Opłacona przez ______"
        ],
        pt: [
          "Seguir",
          "Participar|Aderir|Entrar no grupo",
          "Verificado|Conta verificada",
          "Sugestões para ti|Sugestões para você|Páginas de que poderás gostar|Páginas que você pode curtir",
          "Grupos de que poderás gostar|Grupos que você pode gostar|Grupos sugeridos",
          "Pessoas que talvez conheças|Pessoas que você talvez conheça",
          "Reels|Reels e vídeos curtos",
          "Eventos que você pode gostar",
          "Financiado por ______"
        ],
        ru: [
          "Подписаться",
          "Вступить|Вступить в группу",
          "Подтверждено|Подтвержденный аккаунт",
          "Рекомендуем вам|Предлагаемое для вас|Страницы, которые могут вам понравиться",
          "Группы, которые могут вам понравиться|Рекомендуемые группы",
          "Люди, которых вы можете знать",
          "Reels|Короткие видео",
          "Мероприятия, которые вам могут понравиться",
          "Оплачено ______"
        ],
        tr: [
          "Takip Et",
          "Katıl|Gruba Katıl",
          "Doğrulanmış|Doğrulanmış Hesap",
          "Senin için önerilenler|Beğenebileceğin Sayfalar",
          "Beğenebileceğin Gruplar|Önerilen Gruplar",
          "Tanıyor olabileceğin kişiler",
          "Reels|Reels videoları",
          "İlgini çekebilecek etkinlikler",
          "______ tarafından ödendi"
        ],
        uk: [
          "Стежити|Підписатися",
          "Приєднатися|Приєднатися до групи",
          "Підтверджено|Підтверджений обліковий запис",
          "Рекомендовано для вас|Сторінки, які можуть вам сподобатися",
          "Групи, які можуть вам сподобатися|Рекомендовані групи",
          "Люди, яких ви можете знати",
          "Reels|Короткі відео",
          "Події, які можуть вам сподобатися",
          "Оплачено ______"
        ],
        vi: [
          "Theo dõi",
          "Tham gia|Tham gia nhóm",
          "Đã xác minh|Tài khoản đã xác minh",
          "Gợi ý cho bạn|Đề xuất cho bạn|Trang bạn có thể thích",
          "Nhóm bạn có thể thích|Nhóm được gợi ý",
          "Những người bạn có thể biết",
          "Reels|Thước phim",
          "Sự kiện bạn có thể thích",
          "Tài trợ bởi ______"
        ],
        "zh-Hans": [
          "关注",
          "加入|加入小组",
          "已验证|已认证|已验证账户",
          "为你推荐|推荐给你|你可能喜欢的公共主页",
          "你可能喜欢的小组|推荐小组",
          "你可能认识的人",
          "Reels|短视频",
          "您可能喜欢的活动",
          "由 ______ 付费|由______付费"
        ],
        "zh-Hant": [
          "追蹤",
          "加入|加入社團",
          "已驗證|已驗證帳號",
          "為你推薦|推薦給你|你可能會喜歡的粉絲專頁",
          "你可能會喜歡的社團|推薦社團",
          "你可能認識的人",
          "Reels|連續短片",
          "你可能感興趣的活動",
          "出資者：______"
        ]
      };
    }
  });

  // src/feeds/news-identity.ts
  function normalizeLabel2(text) {
    return cleanText(text).replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  }
  function matchesNewsLabel(text, kind) {
    var _a;
    const normalized = normalizeLabel2(text);
    return normalized !== "" && ((_a = labelsByKind.get(kind)) == null ? void 0 : _a.has(normalized)) === true;
  }
  function isOwnedNewsElement(element, post) {
    if (isNestedMarkedNode(element, post)) return false;
    const body = element.closest(
      'p, blockquote, [data-ad-preview="message"], [data-ad-comet-preview="message"], [data-ad-rendering-role="story_message"], [data-ad-rendering-role="creative_body"], [contenteditable="true"], [data-commentid], [data-testid^="UFI2Comment/"], [role="comment"]'
    );
    if (body && post.contains(body)) return false;
    const owner = element.closest(newsSelectors.standardPost);
    return !owner || owner === post || !post.contains(owner);
  }
  function isOwnedNewsMetadata(element, post) {
    return isOwnedNewsElement(element, post) && !Array.from(post.querySelectorAll(getNewsBlocksQuery(post))).slice(1).some((body) => body.contains(element));
  }
  function facebookPath(link) {
    const href = link.getAttribute("href");
    if (!href) return null;
    try {
      const url = new URL(href, "https://www.facebook.com/");
      return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password && (url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com")) ? url.pathname : null;
    } catch (e) {
      return null;
    }
  }
  function ownNewsHeaders(post) {
    return Array.from(post.querySelectorAll("h4, h5")).filter(
      (header) => isOwnedNewsMetadata(header, post)
    );
  }
  function explicitNewsNames(element) {
    var _a;
    const labelledBy = element.getAttribute("aria-labelledby");
    if (labelledBy) {
      const text = labelledBy.trim().split(/\s+/).map((id) => {
        var _a2;
        return ((_a2 = element.ownerDocument.getElementById(id)) == null ? void 0 : _a2.textContent) || "";
      }).join(" ").trim();
      if (text !== "") return [text];
    }
    const label = element.getAttribute("aria-label");
    if (label == null ? void 0 : label.trim()) return [label];
    const svgTitle = (_a = Array.from(element.children).find(
      (child) => child.localName === "title"
    )) == null ? void 0 : _a.textContent;
    if (svgTitle == null ? void 0 : svgTitle.trim()) return [svgTitle];
    const title = element.getAttribute("title");
    return (title == null ? void 0 : title.trim()) ? [title] : [];
  }
  function hasNewsCardHeading(post, kind) {
    return Array.from(post.querySelectorAll('h2, h3, [role="heading"]')).some(
      (heading) => isOwnedNewsMetadata(heading, post) && matchesNewsLabel(heading.textContent || "", kind)
    );
  }
  function hasNewsActionName(element, kind) {
    const names = explicitNewsNames(element);
    return (names.length > 0 ? names : [element.textContent || ""]).some(
      (name) => matchesNewsLabel(name, kind)
    );
  }
  function ownVerifiedBadges(post) {
    return ownNewsHeaders(post).flatMap(
      (header) => Array.from(header.querySelectorAll("svg")).filter((icon) => {
        if (!isOwnedNewsElement(icon, post)) return false;
        const iconNames = explicitNewsNames(icon);
        if (iconNames.length > 0) return iconNames.some((name) => matchesNewsLabel(name, "verified"));
        let wrapper = icon.parentElement;
        while (wrapper && wrapper !== header && wrapper.tagName === "SPAN") {
          if (!isBadgeOnlyWrapper(wrapper, icon)) return false;
          if (explicitNewsNames(wrapper).some((name) => matchesNewsLabel(name, "verified")))
            return true;
          wrapper = wrapper.parentElement;
        }
        return false;
      })
    );
  }
  function isBadgeOnlyWrapper(wrapper, icon) {
    var _a;
    if (wrapper.matches('a, button, [role="button"]') || wrapper.querySelector('a, button, [role="button"], img, video'))
      return false;
    if (wrapper.querySelectorAll("svg").length !== 1 || !wrapper.contains(icon)) return false;
    const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      if (((_a = node.textContent) == null ? void 0 : _a.trim()) && !icon.contains(node)) return false;
    }
    return true;
  }
  function ownPostReelLinks(post) {
    return Array.from(post.querySelectorAll("a[href]")).filter((link) => {
      const path = facebookPath(link);
      return path !== null && /^\/reel\/[^/]+\/?$/.test(path) && isOwnedNewsElement(link, post) && link.querySelector('video, img, [role="img"]') !== null;
    });
  }
  function matchesNewsPaidBy(text) {
    const label = normalizeLabel2(text);
    return Object.values(newsLabels).some(
      (labels) => labels[8].split("|").some((template) => {
        const [prefix = "", suffix = ""] = normalizeLabel2(template).split("______");
        return (prefix !== "" || suffix !== "") && label.startsWith(prefix) && label.endsWith(suffix) && label.slice(prefix.length, label.length - suffix.length).trim() !== "";
      })
    );
  }
  var labelKinds, labelsByKind;
  var init_news_identity = __esm({
    "src/feeds/news-identity.ts"() {
      "use strict";
      init_text_normalize();
      init_walker();
      init_news_labels();
      init_news();
      init_blocks();
      labelKinds = [
        "follow",
        "join",
        "verified",
        "suggested",
        "groups",
        "people",
        "reels",
        "events"
      ];
      labelsByKind = new Map(
        labelKinds.map((kind, index) => [
          kind,
          new Set(
            Object.values(newsLabels).flatMap(
              (labels) => (labels[index] || "").split("|").map(normalizeLabel2)
            )
          )
        ])
      );
    }
  });

  // src/feeds/news-detectors.ts
  function isNewsSuggested(post, state, keyWords) {
    const queries = [
      "div[aria-posinset] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)",
      "div[aria-describedby] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)"
    ];
    const elSuggestion = querySelectorAllNoChildren(post, queries, 1);
    if (elSuggestion.length > 0) {
      if (isNewsReelsAndShortVideos(post, keyWords).length > 0) {
        return "";
      }
      const label = elSuggestion[0];
      return label && isOwnedNewsElement(label, post) && matchesNewsLabel(label.textContent || "", "suggested") ? keyWords.NF_SUGGESTIONS : "";
    }
    if (isGroupsYouMightLike(post)) {
      return keyWords.NF_SUGGESTIONS;
    }
    return "";
  }
  function isGroupsYouMightLike(post) {
    return hasNewsCardHeading(post, "groups") && Array.from(post.querySelectorAll("a[href]")).some(
      (link) => /^\/groups\/discover\/?$/.test(facebookPath(link) || "") && isOwnedNewsMetadata(link, post)
    );
  }
  function isNewsPeopleYouMayKnow(post, keyWords) {
    const matches = hasNewsCardHeading(post, "people") && Array.from(post.querySelectorAll('a[href][role="link"]')).some(
      (link) => /^\/friends(?:\/|$)/.test(facebookPath(link) || "") && isOwnedNewsMetadata(link, post)
    );
    return matches ? keyWords.NF_PEOPLE_YOU_MAY_KNOW : "";
  }
  function isNewsPaidPartnership(post, keyWords) {
    const queryPP = 'span[dir] > span[id] a[href^="/business/help/"]';
    const elPaidPartnership = post.querySelector(queryPP);
    return elPaidPartnership === null ? "" : keyWords.NF_PAID_PARTNERSHIP;
  }
  function isNewsSponsoredPaidBy(post, keyWords) {
    const querySPB = "div:nth-child(2) > div > div:nth-child(2) > span[class] > span[id] > div:nth-child(2)";
    const sponsoredPaidBy = querySelectorAllNoChildren(post, querySPB, 1);
    return sponsoredPaidBy.some(
      (label) => isOwnedNewsMetadata(label, post) && matchesNewsPaidBy(label.textContent || "")
    ) ? keyWords.NF_SPONSORED_PAID : "";
  }
  function isNewsReelsAndShortVideos(post, keyWords) {
    const shelf = hasNewsCardHeading(post, "reels") && Array.from(post.querySelectorAll("a[href]")).some((link) => {
      if (facebookPath(link) !== "/reel/" || !isOwnedNewsMetadata(link, post)) return false;
      return new URL(link.getAttribute("href") || "", "https://www.facebook.com/").searchParams.get(
        "s"
      ) === "ifu_see_more";
    });
    return shelf || ownPostReelLinks(post).length > 4 ? keyWords.NF_REELS_SHORT_VIDEOS : "";
  }
  function isNewsShortReelVideo(post, keyWords) {
    return ownPostReelLinks(post).length === 1 ? keyWords.NF_SHORT_REEL_VIDEO : "";
  }
  function isNewsEventsYouMayLike(post, keyWords) {
    const query = ":scope div > div:nth-of-type(2) > div > div >  h3 > span";
    const events = querySelectorAllNoChildren(post, query, 0);
    return events.some(
      (heading) => isOwnedNewsMetadata(heading, post) && matchesNewsLabel(heading.textContent || "", "events")
    ) ? keyWords.NF_EVENTS_YOU_MAY_LIKE : "";
  }
  function hasHeaderAction(post, kind) {
    return ownNewsHeaders(post).some((header) => {
      const paths = Array.from(header.querySelectorAll("a[href]")).map(facebookPath).filter((path) => path !== null);
      const hasGroup = paths.some((path) => /^\/groups\/[^/]+/.test(path));
      const hasAuthor = paths.some((path) => path !== "/" && !/^\/groups(?:\/|$)/.test(path));
      if (kind === "join" ? !hasGroup : !hasAuthor || hasGroup) return false;
      return Array.from(header.querySelectorAll('button, [role="button"]')).some(
        (control) => isOwnedNewsElement(control, post) && hasNewsActionName(control, kind)
      );
    });
  }
  function isNewsFollow(post, keyWords) {
    const queries = [
      ":scope h4[id] > span > div > span",
      ":scope h4[id] > span > span > div > span",
      ":scope h4[id] > div > span > span[class] > div[class] > span[class]"
    ];
    const leaves = querySelectorAllNoChildren(post, queries, 0, false);
    const fallback = leaves.length === 1 && leaves.some((leaf) => isOwnedNewsMetadata(leaf, post) && hasNewsActionName(leaf, "follow"));
    return hasHeaderAction(post, "follow") || fallback ? keyWords.NF_FOLLOW : "";
  }
  function isNewsParticipate(post, keyWords) {
    const leaves = querySelectorAllNoChildren(post, ":scope h4 > span > span[class] > span", 0);
    const fallback = leaves.length === 1 && leaves.some((leaf) => isOwnedNewsMetadata(leaf, post) && hasNewsActionName(leaf, "join"));
    return hasHeaderAction(post, "join") || fallback ? keyWords.NF_PARTICIPATE : "";
  }
  function isMetaAiLink(link) {
    const href = link.getAttribute("href");
    if (!href) return false;
    try {
      let url = new URL(href, document.baseURI);
      if (url.hostname === "l.facebook.com" && url.pathname === "/l.php") {
        const destination = url.searchParams.get("u");
        if (!destination) return false;
        url = new URL(destination);
      }
      return (url.protocol === "https:" || url.protocol === "http:") && (url.hostname === "meta.ai" || url.hostname.endsWith(".meta.ai"));
    } catch (e) {
      return false;
    }
  }
  function isNewsMetaAICard(post, keyWords) {
    const branding = post.querySelector(
      'a[aria-label="Visit Meta AI"], a[aria-label="Meta AI branding"]'
    );
    if (branding || Array.from(post.querySelectorAll("a[href]")).some(isMetaAiLink)) {
      return keyWords.NF_META_AI;
    }
    const postTexts = extractTextContent(post, getNewsBlocksQuery(post), 3).join(" ").toLowerCase();
    if (postTexts.includes("try meta ai") || postTexts.includes("free ai creation tools")) {
      return keyWords.NF_META_AI;
    }
    return "";
  }
  function isNewsAiInfoPost(post, keyWords) {
    if (!post || !keyWords || typeof post.querySelectorAll !== "function") {
      return "";
    }
    const controls = Array.from(post.querySelectorAll('button, [role="button"]'));
    const hasAiInfoLabel = controls.some((control) => {
      if (isNestedMarkedNode(control, post)) return false;
      const text = cleanText(control.textContent || "").replace(/\s+/g, " ").trim().toLocaleLowerCase();
      return text === "ai info";
    });
    return hasAiInfoLabel && typeof keyWords.NF_AI_INFO_POSTS === "string" ? keyWords.NF_AI_INFO_POSTS : "";
  }
  function isNewsStoriesPost(post, keyWords) {
    const queryForStory = '[href^="/stories/"][href*="source=from_feed"]';
    const elStory = post.querySelector(queryForStory);
    return elStory ? keyWords.NF_STORIES : "";
  }
  function isNewsVerifiedBadge(post, keyWords) {
    return ownVerifiedBadges(post).length > 0 ? keyWords.NF_FILTER_VERIFIED_BADGE : "";
  }
  function postExceedsLikeCount(post, options, keyWords) {
    var _a, _b;
    const queryLikes = 'span[role="toolbar"] ~ div div[role="button"] > span[class][aria-hidden] > span:not([class]) > span[class]';
    const elLikes = post.querySelectorAll(queryLikes);
    if (elLikes.length > 0) {
      const maxLikes = parseInt(options.NF_LIKES_MAXIMUM_COUNT, 10);
      const postLikesCount = getFullNumber(((_b = (_a = elLikes[0]) == null ? void 0 : _a.textContent) != null ? _b : "").trim());
      return postLikesCount >= maxLikes ? keyWords.NF_LIKES_MAXIMUM : "";
    }
    return false;
  }
  var init_news_detectors = __esm({
    "src/feeds/news-detectors.ts"() {
      "use strict";
      init_text_normalize();
      init_shares_likes();
      init_walker();
      init_dom();
      init_blocks();
      init_news_identity();
    }
  });

  // src/feeds/news-right-rail.ts
  function getNormalizedElementText(element) {
    if (!element) {
      return "";
    }
    return cleanText(element.textContent || "").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
  }
  function isRightRailHeadingText(element, text) {
    const normalizedText = getNormalizedElementText(element);
    const normalizedTarget = cleanText(text || "").replace(/\s+/g, " ").trim();
    return normalizedText.length > 0 && normalizedTarget.length > 0 && normalizedText.toLocaleLowerCase() === normalizedTarget.toLocaleLowerCase();
  }
  function isAfterElement(source, target) {
    if (!source || !target || typeof source.compareDocumentPosition !== "function") {
      return false;
    }
    return !!(source.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING);
  }
  function isPlausibleRightRailAdLink(link) {
    if (!link) {
      return false;
    }
    const href = link.href || link.getAttribute("href") || "";
    if (href.startsWith("https://l.facebook.com/l.php")) {
      return true;
    }
    return /(?:utm_[a-z0-9_]+|fbclid|ad_id|adset_id|campaign_id)(?:=|%3D)/i.test(href);
  }
  function hasPlausibleRightRailAdLink(section, heading) {
    if (!section || !heading) {
      return false;
    }
    return Array.from(section.querySelectorAll("a")).some(
      (link) => isAfterElement(heading, link) && isPlausibleRightRailAdLink(link)
    );
  }
  function hasOtherRightRailHeading(section, sponsoredHeading, sponsoredLabel) {
    if (!section || !sponsoredHeading) {
      return false;
    }
    const headingQuery = 'h1, h2, h3, h4, [role="heading"]';
    return Array.from(section.querySelectorAll(headingQuery)).some(
      (heading) => heading !== sponsoredHeading && getNormalizedElementText(heading).length > 0 && !isRightRailHeadingText(heading, sponsoredLabel)
    );
  }
  function findRightRailSponsoredSection(rightRail, sponsoredHeading, sponsoredLabel) {
    if (!rightRail || !sponsoredHeading || !sponsoredLabel) {
      return null;
    }
    let current = sponsoredHeading.parentElement;
    while (current && current !== rightRail) {
      if (current.hasAttribute(postAtt)) {
        return null;
      }
      if (hasPlausibleRightRailAdLink(current, sponsoredHeading) && !hasOtherRightRailHeading(current, sponsoredHeading, sponsoredLabel)) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }
  function scrubRightRailSponsored(context) {
    if (!context) return false;
    const { keyWords, state, options } = context;
    if (!keyWords || !state || !options || !keyWords.SPONSORED) {
      return false;
    }
    const rightRail = document.querySelector('div[role="complementary"]');
    if (!rightRail) {
      return false;
    }
    const headings = Array.from(
      rightRail.querySelectorAll('h1, h2, h3, h4, [role="heading"]')
    ).filter((heading) => isRightRailHeadingText(heading, keyWords.SPONSORED));
    let hidden = false;
    for (const heading of headings) {
      const section = findRightRailSponsoredSection(rightRail, heading, keyWords.SPONSORED);
      if (section) {
        hideFeature(section, keyWords.SPONSORED, false, context);
        hidden = true;
      }
    }
    return hidden;
  }
  function scrubRightRailSuggestions(context) {
    if (!context) return false;
    const { keyWords, state, options } = context;
    const query = 'div[role="complementary"] > div > div > div > div > div:not([data-visualcompletion])';
    for (const container of document.querySelectorAll(query)) {
      for (const item of container.querySelectorAll(`:scope > div:not([${postAtt}])`)) {
        const kinds = ["suggested", "groups", "people"];
        if (!kinds.some((kind) => hasNewsCardHeading(item, kind))) continue;
        const otherHeading = Array.from(
          item.querySelectorAll('h1, h2, h3, h4, [role="heading"]')
        ).some((heading) => {
          const label = heading.textContent || "";
          return label.trim() !== "" && !kinds.some((kind) => matchesNewsLabel(label, kind));
        });
        if (otherHeading || item.querySelector('a[href="/events/birthdays/"]')) continue;
        hideNewsPost(item, keyWords.NF_SUGGESTIONS, false, {
          options,
          keyWords,
          attributes: { postAtt, postAttTab },
          state
        });
      }
    }
  }
  var init_news_right_rail = __esm({
    "src/feeds/news-right-rail.ts"() {
      "use strict";
      init_news_identity();
      init_text_normalize();
      init_attributes();
      init_hide();
    }
  });

  // src/feeds/news-presentation.ts
  function inlinePriority(style, name) {
    var _a;
    const shorthand = (_a = /^(margin|padding)-/.exec(name)) == null ? void 0 : _a[1];
    return style.getPropertyPriority(name) || (shorthand ? style.getPropertyPriority(shorthand) : "");
  }
  function restoreSpacing(element, change, prefix) {
    const declarations = ["top", "right", "bottom", "left"].map((side) => {
      const name = `${prefix}-${side}`;
      const owned = change.styles.get(name);
      const value = element.style.getPropertyValue(name);
      const priority = inlinePriority(element.style, name);
      const unchanged = owned && value === owned.applied && priority === "";
      return {
        name,
        value: unchanged ? owned.original : value,
        priority: unchanged ? owned.priority : priority
      };
    });
    element.style.removeProperty(prefix);
    for (const { name } of declarations) element.style.removeProperty(name);
    for (const { name, value, priority } of declarations)
      if (value !== "") element.style.setProperty(name, value, priority);
  }
  function restoreElement(element, change) {
    if (change.unchangedBaseline && element.style.cssText === change.appliedCssText) {
      if (change.originalStyle === null) element.removeAttribute("style");
      else element.setAttribute("style", change.originalStyle);
    } else {
      for (const [name, style] of change.styles) {
        if (/^(margin|padding)-/.test(name)) continue;
        if (element.style.getPropertyValue(name) !== style.applied || element.style.getPropertyPriority(name) !== "")
          continue;
        if (style.original === "") element.style.removeProperty(name);
        else element.style.setProperty(name, style.original, style.priority);
      }
      restoreSpacing(element, change, "margin");
      restoreSpacing(element, change, "padding");
    }
    if (element.getAttribute(change.marker) !== "") return;
    if (change.originalMarker === null) element.removeAttribute(change.marker);
    else element.setAttribute(change.marker, change.originalMarker);
  }
  function restoreNewsPresentation(feature) {
    const features = feature ? [feature] : ["badge", "sidebar"];
    for (const name of features) {
      for (const [element, change] of presentations[name]) restoreElement(element, change);
      presentations[name].clear();
    }
  }
  function reconcileNewsPresentation(feature, targets, marker) {
    const owned = presentations[feature];
    for (const [element, change] of owned) {
      if (targets.has(element) && change.marker === marker) continue;
      restoreElement(element, change);
      owned.delete(element);
    }
    for (const [element, properties] of targets) {
      if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) continue;
      let change = owned.get(element);
      if (!change) {
        change = {
          styles: /* @__PURE__ */ new Map(),
          marker,
          originalMarker: element.getAttribute(marker),
          originalStyle: element.getAttribute("style"),
          appliedCssText: "",
          unchangedBaseline: true
        };
        owned.set(element, change);
      } else if (element.style.cssText !== change.appliedCssText) {
        change.unchangedBaseline = false;
      }
      if (element.getAttribute(marker) !== "") change.originalMarker = element.getAttribute(marker);
      const currentDeclarations = properties.map((name) => ({
        name,
        current: element.style.getPropertyValue(name),
        priority: inlinePriority(element.style, name)
      }));
      for (const { name, current, priority } of currentDeclarations) {
        const previous = change.styles.get(name);
        const value = name === "display" ? "none" : "0px";
        if (!previous || current !== previous.applied || priority !== "")
          change.styles.set(name, { original: current, priority, applied: value });
        if (current !== value || priority !== "") element.style.setProperty(name, value);
      }
      change.appliedCssText = element.style.cssText;
      if (element.getAttribute(marker) !== "") element.setAttribute(marker, "");
    }
  }
  var presentations, newsCollapsedSpacing;
  var init_news_presentation = __esm({
    "src/feeds/news-presentation.ts"() {
      "use strict";
      presentations = {
        badge: /* @__PURE__ */ new Map(),
        sidebar: /* @__PURE__ */ new Map()
      };
      newsCollapsedSpacing = [
        "display",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left"
      ];
    }
  });

  // src/feeds/news-features.ts
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
  function scrubTabbies(context) {
    if (!context) return;
    const { keyWords, state } = context;
    if (!keyWords || !state) {
      return;
    }
    const tabLabel = keyWords.NF_TABLIST_STORIES_REELS_ROOMS;
    const queryTabList = 'div[role="main"] > div > div > div > div > div > div > div > div[role="tablist"]';
    const elTabList = document.querySelector(queryTabList);
    if (elTabList) {
      if (elTabList.hasAttribute(postAttChildFlag)) {
        return;
      }
      const elParent = climbUpTheTree(elTabList, 4);
      if (elParent instanceof Element) {
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
        if (elParent instanceof Element) {
          hideFeature(elParent, keyWords.NF_TABLIST_STORIES_REELS_ROOMS, false, context);
          elCreateStory.setAttribute(postAttChildFlag, "1");
        }
      }
    }
  }
  function getStoriesParent(element) {
    var _a;
    const elAFewBranchesUp = climbUpTheTree(element, 4);
    const moreStories = elAFewBranchesUp instanceof Element ? elAFewBranchesUp.querySelectorAll('a[href*="/stories/"]') : [];
    let elParent = null;
    if (moreStories.length > 1) {
      elParent = climbUpTheTree((_a = element == null ? void 0 : element.closest('div[aria-label][role="region"]')) != null ? _a : null, 4);
    } else {
      elParent = climbUpTheTree(element, 7);
    }
    return elParent;
  }
  function scrubSurvey(context) {
    if (!context) return;
    const { keyWords } = context;
    const btnSurvey = Array.from(
      document.querySelectorAll(
        `${newsSelectors.surveyButton}:not([${postAtt}]):not([${postAttChildFlag}])`
      )
    ).find((button) => !button.closest(`[${postAtt}]`));
    if (btnSurvey) {
      const elContainer = climbUpTheTree(btnSurvey.closest('[style*="border-radius"]'), 3);
      if (elContainer instanceof Element) {
        hideFeature(elContainer, "Survey", false, context);
        btnSurvey.setAttribute(postAttChildFlag, keyWords.NF_SURVEY);
      }
    }
  }
  function scrubTopCardsForPages(context) {
    if (!context) return;
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
    if (!context) return;
    const targets = /* @__PURE__ */ new Map();
    for (const root of [
      document.querySelector(newsSelectors.mainColumn),
      document.querySelector(newsSelectors.dialog)
    ]) {
      if (!root) continue;
      for (const post of root.querySelectorAll(newsSelectors.standardPost)) {
        for (const badge of ownVerifiedBadges(post)) {
          targets.set(badge, [...newsCollapsedSpacing, "width", "height"]);
          let wrapper = badge.parentElement;
          while (wrapper && wrapper.tagName === "SPAN" && isBadgeOnlyWrapper(wrapper, badge)) {
            targets.set(wrapper, newsCollapsedSpacing);
            wrapper = wrapper.parentElement;
          }
        }
      }
    }
    reconcileNewsPresentation("badge", targets, context.state.cssHideVerifiedBadge);
  }
  function getSidePanelAiTargets() {
    const targets = /* @__PURE__ */ new Set();
    const navs = Array.from(document.querySelectorAll('div[role="navigation"]'));
    navs.forEach((nav) => {
      const metaLinks = Array.from(nav.querySelectorAll("a[href]")).filter(isMetaAiLink);
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
      const metaThreads = rightPanel.querySelectorAll('a[href*="/messages/t/36327,2227039302/"]');
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
    if (!context) return;
    const targets = new Map(getSidePanelAiTargets().map((target) => [target, newsCollapsedSpacing]));
    reconcileNewsPresentation("sidebar", targets, context.state.hideAtt);
  }
  var init_news_features = __esm({
    "src/feeds/news-features.ts"() {
      "use strict";
      init_attributes();
      init_hide();
      init_dom();
      init_news();
      init_news_detectors();
      init_news_identity();
      init_news_presentation();
    }
  });

  // src/feeds/news-meta-ai.ts
  function isReactFiber(value) {
    return typeof value === "object" && value !== null;
  }
  function getReactFiberFromElement(element) {
    let current = element;
    let depth = 0;
    while (current && depth < 4) {
      const reactFiberKey = Object.getOwnPropertyNames(current).find(
        (key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")
      );
      if (reactFiberKey) {
        const candidate = Reflect.get(current, reactFiberKey);
        if (isReactFiber(candidate)) return candidate;
      }
      current = current.parentElement;
      depth += 1;
    }
    return null;
  }
  function findAncestorFiber(fiber, predicate) {
    let current = fiber;
    let safetyCounter = 0;
    while (current && safetyCounter < 50) {
      if (predicate(current)) {
        return current;
      }
      current = isReactFiber(current.return) ? current.return : null;
      safetyCounter += 1;
    }
    return null;
  }
  function isMetaAiSuggestionFiber(fiber) {
    if (!fiber || typeof fiber.key !== "string" || !fiber.key.startsWith("suggestion-")) {
      return false;
    }
    const props = fiber.memoizedProps || fiber.pendingProps;
    if (!isReactFiber(props)) {
      return false;
    }
    return Object.prototype.hasOwnProperty.call(props, "promptId") && Object.prototype.hasOwnProperty.call(props, "genAISessionID");
  }
  function getMetaAiSuggestionChipSignal(button) {
    const fiber = getReactFiberFromElement(button);
    if (!fiber) {
      return null;
    }
    const suggestionFiber = findAncestorFiber(fiber, isMetaAiSuggestionFiber);
    const props = suggestionFiber ? suggestionFiber.memoizedProps || suggestionFiber.pendingProps : null;
    if (!suggestionFiber || !isReactFiber(props)) {
      return null;
    }
    const { promptId, genAISessionID } = props;
    if (!promptId || !genAISessionID) {
      return null;
    }
    return {
      promptId,
      genAISessionID,
      suggestionKey: suggestionFiber.key
    };
  }
  function isButtonLike(element) {
    if (!element || typeof element.getAttribute !== "function") {
      return false;
    }
    return element.tagName === "BUTTON" || element.getAttribute("role") === "button";
  }
  function getMetaAiPromptChipButtons(row) {
    if (!row || typeof row.querySelectorAll !== "function") {
      return [];
    }
    return Array.from(
      row.querySelectorAll(
        '[data-type="hscroll-child"] button, [data-type="hscroll-child"] [role="button"]'
      )
    );
  }
  function getMetaAiPromptButtonText(button) {
    if (!button || typeof button.textContent !== "string") {
      return "";
    }
    return cleanText(button.textContent).trim();
  }
  function hasMetaAiPromptButtonIcon(button) {
    if (!button || typeof button.querySelector !== "function") {
      return false;
    }
    return button.querySelector("i, img, svg") !== null;
  }
  function hasMetaAiPromptButtonLabel(button) {
    if (!button || typeof button.getAttribute !== "function") {
      return false;
    }
    return ["aria-label", "title"].some((attributeName) => {
      const attributeValue = button.getAttribute(attributeName);
      return typeof attributeValue === "string" && attributeValue.trim() !== "";
    });
  }
  function hasMetaAiPromptDomSignature(row) {
    const chipButtons = getMetaAiPromptChipButtons(row);
    if (chipButtons.length !== 3) {
      return false;
    }
    const buttonTexts = chipButtons.map((button) => getMetaAiPromptButtonText(button));
    if (buttonTexts[0] === "" || buttonTexts[1] === "" || buttonTexts[2] !== "") {
      return false;
    }
    const firstButtonHasIcon = hasMetaAiPromptButtonIcon(chipButtons[0]);
    const lastButtonHasIcon = hasMetaAiPromptButtonIcon(chipButtons[2]);
    const lastButtonHasLabel = hasMetaAiPromptButtonLabel(chipButtons[2]);
    return firstButtonHasIcon && (lastButtonHasIcon || lastButtonHasLabel);
  }
  function isMetaAiPromptCandidateRow(row, root) {
    if (!row || !root || row === root || typeof row.querySelectorAll !== "function") {
      return false;
    }
    const hscrollChildren = row.querySelectorAll('[data-type="hscroll-child"]');
    if (hscrollChildren.length < 2) {
      return false;
    }
    const chipButtons = getMetaAiPromptChipButtons(row);
    if (chipButtons.length < 2) {
      return false;
    }
    const contentLinks = Array.from(row.querySelectorAll("a[href]")).filter((link) => {
      if (isButtonLike(link)) {
        return false;
      }
      const buttonAncestor = link.closest('[role="button"], button');
      return !buttonAncestor;
    });
    return contentLinks.length === 0;
  }
  function containsOnlyPromptContent(row) {
    var _a, _b;
    const textWalker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
    let node;
    while (node = textWalker.nextNode()) {
      if (((_a = node.textContent) == null ? void 0 : _a.trim()) && !((_b = node.parentElement) == null ? void 0 : _b.closest('[data-type="hscroll-child"]')))
        return false;
    }
    return Array.from(row.querySelectorAll('button, [role="button"], img, svg, video, input')).every(
      (element) => element.closest('[data-type="hscroll-child"]') !== null
    );
  }
  function findMetaAiPromptCandidateRows(root) {
    if (!root || typeof root.querySelectorAll !== "function") {
      return [];
    }
    const candidateRows = /* @__PURE__ */ new Set();
    const chips = root.querySelectorAll('[data-type="hscroll-child"]');
    chips.forEach((chip) => {
      let current = chip.parentElement;
      while (current && current !== root) {
        if (current.matches(newsSelectors.standardPost)) break;
        if (isMetaAiPromptCandidateRow(current, root) && containsOnlyPromptContent(current)) {
          candidateRows.add(current);
        }
        current = current.parentElement;
      }
    });
    const rows = Array.from(candidateRows);
    return rows.filter((row) => !rows.some((other) => other !== row && other.contains(row)));
  }
  function isMetaAiPromptSuggestionRow(row) {
    const sessionMatches = /* @__PURE__ */ new Map();
    const signals = getMetaAiPromptChipButtons(row).map((button) => getMetaAiSuggestionChipSignal(button)).filter((signal) => signal !== null);
    signals.forEach((signal) => {
      var _a;
      if (!sessionMatches.has(signal.genAISessionID)) {
        sessionMatches.set(signal.genAISessionID, /* @__PURE__ */ new Set());
      }
      (_a = sessionMatches.get(signal.genAISessionID)) == null ? void 0 : _a.add(`${signal.suggestionKey}:${signal.promptId}`);
    });
    if (Array.from(sessionMatches.values()).some((signalSet) => signalSet.size >= 2)) {
      return true;
    }
    return hasMetaAiPromptDomSignature(row);
  }
  function inspectMetaAiPromptRows(root) {
    const candidateRows = findMetaAiPromptCandidateRows(root);
    if (candidateRows.length === 0) {
      return {
        candidateRows: [],
        confirmedRows: [],
        hasUnresolvedCandidates: false
      };
    }
    const confirmedRows = candidateRows.filter((row) => isMetaAiPromptSuggestionRow(row));
    const confirmedSet = new Set(confirmedRows);
    return {
      candidateRows,
      confirmedRows,
      hasUnresolvedCandidates: candidateRows.some((row) => !confirmedSet.has(row))
    };
  }
  function findMetaAiPromptSuggestionRows(root) {
    return inspectMetaAiPromptRows(root).confirmedRows;
  }
  function hideMetaAiPromptSuggestionRows(rows, context) {
    if (!Array.isArray(rows) || !context || rows.length === 0) {
      return false;
    }
    const { keyWords } = context;
    if (!keyWords) {
      return false;
    }
    rows.forEach((row) => hideFeatureNoCaption(row, keyWords.NF_META_AI_PROMPTS, context));
    return true;
  }
  function hasMetaAiPromptSuggestionRow(root) {
    return findMetaAiPromptSuggestionRows(root).length > 0;
  }
  function scrubMetaAiPromptSuggestions(context, root = null) {
    if (!context) {
      return false;
    }
    const { options } = context;
    if (!options || options.NF_META_AI_PROMPTS !== true) {
      return false;
    }
    const scanRoot = root || document.querySelector(newsSelectors.mainColumn);
    if (!scanRoot) {
      return false;
    }
    const promptInspection = inspectMetaAiPromptRows(scanRoot);
    return hideMetaAiPromptSuggestionRows(promptInspection.confirmedRows, context);
  }
  var init_news_meta_ai = __esm({
    "src/feeds/news-meta-ai.ts"() {
      "use strict";
      init_text_normalize();
      init_hide();
      init_news();
    }
  });

  // src/feeds/news.ts
  function mopNewsFeed(context) {
    if (!context) {
      return null;
    }
    const { state, options, filters, keyWords, pathInfo: pathInfo2 } = context;
    if (!state || !options || !filters || !keyWords || !pathInfo2) {
      return null;
    }
    if (!options.NF_HIDE_VERIFIED_BADGE) restoreNewsPresentation("badge");
    if (!options.NF_AI_SIDE_PANELS) restoreNewsPresentation("sidebar");
    const [dirtyMainColumn, dirtyDialog] = isNewsDirty(state);
    const mainColumn = dirtyMainColumn || document.querySelector(newsSelectors.mainColumn);
    const elDialog = dirtyDialog || document.querySelector(newsSelectors.dialog);
    const shouldSweepPosts = shouldSweepNewsPosts(state, mainColumn, !!dirtyMainColumn);
    if (!dirtyMainColumn && !dirtyDialog && !shouldSweepPosts) {
      return null;
    }
    if (shouldSweepPosts) resetChangedNewsPosts(mainColumn, state);
    if (dirtyMainColumn) {
      if (options.NF_TABLIST_STORIES_REELS_ROOMS) {
        scrubTabbies(context);
      }
      if (options.NF_SURVEY) {
        scrubSurvey(context);
      }
      if (options.NF_TOP_CARDS_PAGES) {
        scrubTopCardsForPages(context);
      }
      if (options.NF_SUGGESTIONS) {
        scrubRightRailSuggestions(context);
      }
    }
    if (options.NF_HIDE_VERIFIED_BADGE && (dirtyMainColumn || dirtyDialog)) {
      scrubVerifiedBadges(context);
    }
    if (options.NF_AI_SIDE_PANELS && shouldSweepPosts) {
      scrubSidePanelAi(context);
    }
    if (options.NF_SPONSORED && shouldSweepPosts) {
      scrubRightRailSponsored(context);
      scrubOrphanSponsoredNewsPosts(context, mainColumn);
    }
    if (mainColumn && options.NF_META_AI_PROMPTS && shouldSweepPosts) {
      scrubMetaAiPromptSuggestions(context, mainColumn);
    }
    if (mainColumn && shouldSweepPosts) {
      const posts = getCollectionOfNewsPosts();
      for (const post of posts) {
        if (post.innerHTML.length === 0) {
          continue;
        }
        let hideReason = "";
        let isSponsoredPost = false;
        const alreadyProcessed = post.hasAttribute(postAtt);
        if (!alreadyProcessed) {
          doLightDusting(post, state);
          if (hideReason === "" && options.NF_REELS_SHORT_VIDEOS) {
            hideReason = isNewsReelsAndShortVideos(post, keyWords);
          }
          if (hideReason === "" && options.NF_SHORT_REEL_VIDEO) {
            hideReason = isNewsShortReelVideo(post, keyWords);
          }
          if (hideReason === "" && options.NF_META_AI) {
            hideReason = isNewsMetaAICard(post, keyWords);
          }
          if (hideReason === "" && options.NF_AI_INFO_POSTS) {
            hideReason = isNewsAiInfoPost(post, keyWords);
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
            hideReason = isNewsFollow(post, keyWords);
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
          if (hideReason === "" && options.NF_LIKES_MAXIMUM) {
            hideReason = postExceedsLikeCount(post, options, keyWords) || "";
          }
        }
        if (hideReason.length > 0) {
          hideNewsPost(post, hideReason, isSponsoredPost, {
            options,
            keyWords,
            attributes: {
              postAtt,
              postAttTab
            },
            state
          });
        } else if (!alreadyProcessed) {
          if (options.NF_ANIMATED_GIFS_PAUSE) {
            swatTheMosquitos(post);
          }
          if (state.hideAnInfoBox) {
            scrubInfoBoxes(post, options, keyWords, pathInfo2, state);
          }
          if (options.NF_SHARES) {
            hideNumberOfShares(post, state, options);
          }
        }
        rememberHiddenNewsContent(post);
      }
      state.lastNewsPostSweepAt = Date.now();
    }
    if (dirtyMainColumn && mainColumn) {
      mainColumn.setAttribute(mainColumnAtt, mainColumn.innerHTML.length.toString());
      state.noChangeCounter = 0;
    }
    if (dirtyDialog && elDialog) {
      if (options.NF_ANIMATED_GIFS_PAUSE) {
        swatTheMosquitos(elDialog);
      }
      elDialog.setAttribute(mainColumnAtt, elDialog.innerHTML.length.toString());
      state.noChangeCounter = 0;
    }
    return { mainColumn, elDialog };
  }
  var init_news2 = __esm({
    "src/feeds/news.ts"() {
      "use strict";
      init_attributes();
      init_animated_gifs();
      init_dusting();
      init_hide();
      init_info_boxes();
      init_news();
      init_blocked_text2();
      init_animated_gifs2();
      init_sponsored();
      init_shares();
      init_news_discovery();
      init_news_discovery();
      init_news_detectors();
      init_news_detectors();
      init_news_right_rail();
      init_news_right_rail();
      init_news_features();
      init_news_features();
      init_news_meta_ai();
      init_news_revalidation();
      init_news_presentation();
      init_news_meta_ai();
    }
  });

  // src/diagnostics/collection.ts
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
  function normalizeVirtualizedValue(container) {
    const value = container.getAttribute("data-virtualized");
    if (value === "true" || value === "false" || value === "") {
      return value;
    }
    return value === null ? "missing" : "other";
  }
  function buildNewsDiscoveryDiagnostics(state, maxSamples = 5) {
    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const runtimeDiscovery = getNewsPostDiscovery();
    const runtime = {
      selectedQuery: runtimeDiscovery.query,
      selectedCount: runtimeDiscovery.posts.length
    };
    const emptyVirtualized = {
      containerCount: 0,
      containersWithAdsAboutLink: 0,
      containersWithAdRenderingRole: 0,
      containersWithAdRenderingRoleOnly: 0,
      adsAboutLinkCount: 0,
      orphanAdsAboutLinkCount: 0,
      orphanWithoutVirtualizedContainerCount: 0,
      orphanContainerCount: 0,
      orphanSamples: []
    };
    if (!mainColumn) {
      return { runtime, virtualized: emptyVirtualized };
    }
    const virtualizedContainers = Array.from(
      mainColumn.querySelectorAll(newsSelectors.virtualizedContainer)
    );
    const adsAboutLinks = Array.from(mainColumn.querySelectorAll(newsSelectors.sponsoredLink));
    const orphanAdsAboutLinks = adsAboutLinks.filter(
      (link) => !link.closest(newsSelectors.standardPost)
    );
    const orphanContainers = getOrphanSponsoredNewsPosts(mainColumn);
    const containersWithAdsAboutLink = virtualizedContainers.filter(
      (container) => container.querySelector(newsSelectors.sponsoredLink)
    );
    const containersWithAdRenderingRole = virtualizedContainers.filter(
      (container) => container.querySelector("[data-ad-rendering-role]")
    );
    const containersWithAdRenderingRoleOnly = containersWithAdRenderingRole.filter(
      (container) => !container.querySelector(newsSelectors.sponsoredLink)
    );
    const orphanWithoutVirtualizedContainerCount = orphanAdsAboutLinks.filter((link) => {
      const container = link.closest(newsSelectors.virtualizedContainer);
      return !container || !mainColumn.contains(container);
    }).length;
    const orphanSamples = samplePosts(orphanContainers, maxSamples).map((container) => ({
      signature: buildDomSignature(container),
      dataVirtualized: normalizeVirtualizedValue(container),
      adsAboutLinkCount: container.querySelectorAll(newsSelectors.sponsoredLink).length,
      adRenderingRoleCount: container.querySelectorAll("[data-ad-rendering-role]").length,
      roleArticleDescendantCount: container.querySelectorAll('div[role="article"]').length,
      ariaPosinsetDescendantCount: container.querySelectorAll("div[aria-posinset]").length,
      inViewport: isInViewport(container),
      hasPostMarker: container.hasAttribute(postAtt),
      hasHideMarker: !!(state && state.hideAtt && container.hasAttribute(state.hideAtt))
    }));
    return {
      runtime,
      virtualized: {
        containerCount: virtualizedContainers.length,
        containersWithAdsAboutLink: containersWithAdsAboutLink.length,
        containersWithAdRenderingRole: containersWithAdRenderingRole.length,
        containersWithAdRenderingRoleOnly: containersWithAdRenderingRoleOnly.length,
        adsAboutLinkCount: adsAboutLinks.length,
        orphanAdsAboutLinkCount: orphanAdsAboutLinks.length,
        orphanWithoutVirtualizedContainerCount,
        orphanContainerCount: orphanContainers.length,
        orphanSamples
      }
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
  var init_collection = __esm({
    "src/diagnostics/collection.ts"() {
      "use strict";
      init_attributes();
      init_news();
      init_groups();
      init_videos();
      init_profile();
      init_search();
      init_news2();
      init_redaction();
    }
  });

  // src/diagnostics/snapshots.ts
  function collectSignalCounts(root = document) {
    var _a, _b;
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
    if (!root || typeof root.querySelectorAll !== "function") {
      return counts;
    }
    const spans = Array.from(root.querySelectorAll("span[dir], span, div")).filter(
      (el) => typeof el.textContent === "string" && el.textContent.trim() !== ""
    );
    for (const el of spans) {
      const text = (_a = el.textContent) != null ? _a : "";
      for (const signal of signals) {
        if (text.includes(signal)) {
          counts[signal] = ((_b = counts[signal]) != null ? _b : 0) + 1;
        }
      }
    }
    return counts;
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
  function buildSelectorDiagnostics(state) {
    return {
      news: {
        mainColumn: document.querySelectorAll(newsSelectors.mainColumn).length,
        dialog: document.querySelectorAll(newsSelectors.dialog).length,
        postQueries: countSelectorMatches(newsSelectors.postQueries)
      },
      groups: {
        mainColumn: document.querySelectorAll(groupsSelectors.mainColumn).length,
        dialog: document.querySelectorAll(groupsSelectors.dialog).length,
        groupPageMainColumn: document.querySelectorAll(groupsSelectors.groupPageMainColumn).length,
        feedQueries: countSelectorMatches([
          groupsSelectors.feedQueryRecent,
          groupsSelectors.feedQueryMultiple,
          groupsSelectors.feedQuerySingle
        ])
      },
      videos: {
        mainColumn: document.querySelectorAll(videosSelectors.mainColumn).length,
        dialog: document.querySelectorAll(videosSelectors.dialog).length,
        feedQueries: countSelectorMatches(Object.values(videosSelectors.feedQueries)),
        vfType: state.vfType || ""
      },
      marketplace: {
        mainColumn: document.querySelectorAll(marketplaceSelectors.mainColumn).length,
        dialogItem: document.querySelectorAll(marketplaceSelectors.dialogItem).length
      },
      search: {
        mainColumn: document.querySelectorAll(searchSelectors.mainColumn).length,
        postsQuery: document.querySelectorAll(searchSelectors.postsQuery).length
      },
      profile: {
        mainColumn: document.querySelectorAll(profileSelectors.mainColumn).length,
        postsQuery: document.querySelectorAll(profileSelectors.postsQuery).length
      }
    };
  }
  function buildHiddenCounts(state) {
    if (!state) {
      return {};
    }
    return {
      hiddenContainers: document.querySelectorAll(`[${state.hideAtt}]`).length,
      hiddenNoCaptionRows: document.querySelectorAll(`[${state.hideWithNoCaptionAtt}]`).length,
      hiddenBlocks: document.querySelectorAll(`[${state.cssHideEl}]`).length,
      hiddenShares: document.querySelectorAll(`[${state.cssHideNumberOfShares}]`).length
    };
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
  var init_snapshots = __esm({
    "src/diagnostics/snapshots.ts"() {
      "use strict";
      init_attributes();
      init_news();
      init_groups();
      init_videos();
      init_marketplace();
      init_profile();
      init_search();
      init_redaction();
      init_collection();
    }
  });

  // src/feeds/groups-features.ts
  function cleanGroupsSuggestions(context) {
    if (!context) return;
    const { keyWords, state, options } = context;
    if (!keyWords || !state || !options) {
      return;
    }
    for (const rail of document.querySelectorAll('div[role="complementary"]')) {
      revalidateTrackedPosts(rail, state);
    }
    const query = 'div[role="complementary"] > div > div > div > div > div:not([data-visualcompletion])';
    const asideBoxes = document.querySelectorAll(query);
    if (asideBoxes.length === 0) {
      return;
    }
    for (const asideBox of asideBoxes) {
      if (hasPostChanged(asideBox)) resetPostState(asideBox, state);
      const rail = asideBox.closest('[role="complementary"]');
      if (!rail || !rail.contains(asideBox) || asideBox.querySelector('[role="main"], [role="feed"], [role="navigation"]')) {
        continue;
      }
      const labels = asideBox.querySelectorAll(
        ':scope > span, :scope > h2, :scope > h3, :scope > [role="heading"]'
      );
      const hasSuggestionLabel = Array.from(labels).some(
        (label) => isOwnedNewsElement(label, asideBox) && !label.closest('[hidden], [aria-hidden="true"]') && !label.querySelector('[hidden], [aria-hidden="true"]') && Array.from(label.querySelectorAll("*")).every(
          (child) => isOwnedNewsElement(child, asideBox)
        ) && (matchesNewsLabel(label.textContent || "", "groups") || matchesNewsLabel(label.textContent || "", "suggested"))
      );
      if (hasSuggestionLabel && !asideBox.hasAttribute(postAtt)) {
        hideFeature(asideBox, keyWords.GF_SUGGESTIONS, true, { options, keyWords, state });
      }
      trackPostSignature(asideBox);
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
        if (!(postLink instanceof HTMLAnchorElement)) return;
        const elHeader = climbUpTheTree(postLink, 4);
        if (!(elHeader instanceof Element)) {
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
        spanSpacer.innerHTML = '<span><span style="position:absolute;width:1px;height:1px;">&nbsp;</span><span aria-hidden="true"> ú </span></span>';
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
    } catch (e) {
      return;
    }
  }
  var init_groups_features = __esm({
    "src/feeds/groups-features.ts"() {
      "use strict";
      init_attributes();
      init_hide();
      init_dom();
      init_news_identity();
      init_dirty_check();
    }
  });

  // src/feeds/groups.ts
  function isGroupsColumnDirty(state) {
    const arrReturn = [null, null];
    const mainColumnQuery = 'div[role="navigation"] ~ div[role="main"]';
    const mainColumn = document.querySelector(mainColumnQuery);
    if (mainColumn) {
      ensureDirtyObserver(mainColumn);
      if (!mainColumn.hasAttribute(mainColumnAtt)) {
        mainColumn.setAttribute(mainColumnAtt, "1");
        markElementDirty(mainColumn);
      }
      if (state && state.forceProcess) {
        markElementDirty(mainColumn);
      }
      if (state && state.forceProcess) {
        arrReturn[0] = mainColumn;
      } else if (isElementDirty(mainColumn)) {
        arrReturn[0] = mainColumn;
      }
    } else {
      const mainColumnQueryGP = 'div[role="main"] div[role="feed"]';
      const mainColumnGP = document.querySelector(mainColumnQueryGP);
      if (mainColumnGP) {
        ensureDirtyObserver(mainColumnGP);
        if (!mainColumnGP.hasAttribute(mainColumnAtt)) {
          mainColumnGP.setAttribute(mainColumnAtt, "1");
          markElementDirty(mainColumnGP);
        }
        if (state && state.forceProcess) {
          markElementDirty(mainColumnGP);
        }
        if (state && state.forceProcess) {
          arrReturn[0] = mainColumnGP;
        } else if (isElementDirty(mainColumnGP)) {
          arrReturn[0] = mainColumnGP;
        }
      }
    }
    const elDialog = document.querySelector('div[role="dialog"]');
    if (elDialog) {
      ensureDirtyObserver(elDialog);
      if (!elDialog.hasAttribute(mainColumnAtt)) {
        elDialog.setAttribute(mainColumnAtt, "1");
        markElementDirty(elDialog);
      }
      if (state && state.forceProcess) {
        markElementDirty(elDialog);
      }
      if (state && state.forceProcess) {
        arrReturn[1] = elDialog;
      } else if (isElementDirty(elDialog)) {
        arrReturn[1] = elDialog;
      }
    }
    if (state) {
      state.noChangeCounter += 1;
    }
    return arrReturn;
  }
  function hasGroupsSuggestionLabel(element, post) {
    if (!isOwnedNewsElement(element, post) || element.closest('[hidden], [aria-hidden="true"]') || element.querySelector('[hidden], [aria-hidden="true"]') || Array.from(element.querySelectorAll("*")).some((child) => !isOwnedNewsElement(child, post))) {
      return false;
    }
    const label = element.getAttribute("aria-label") || element.getAttribute("title") || element.textContent || "";
    return matchesNewsLabel(label, "suggested") || matchesNewsLabel(label, "groups");
  }
  function isGroupsSuggested(post, keyWords) {
    var _a, _b;
    const blocks = post.querySelectorAll(getGroupsBlocksQuery(post));
    if (blocks.length <= 1) return "";
    const icons = ((_a = blocks[0]) == null ? void 0 : _a.querySelectorAll('i[data-visualcompletion="css-img"][style]')) || [];
    const hasSuggestionIcon = Array.from(icons).some(
      (icon) => isOwnedNewsElement(icon, post) && (hasGroupsSuggestionLabel(icon, post) || icon.parentElement !== null && hasGroupsSuggestionLabel(icon.parentElement, post))
    );
    const headings = ((_b = blocks[1]) == null ? void 0 : _b.querySelectorAll("h3 > div > span ~ span > span > div > div")) || [];
    const hasSuggestionHeading = Array.from(headings).some(
      (heading) => hasGroupsSuggestionLabel(heading, post)
    );
    return hasSuggestionIcon || hasSuggestionHeading ? keyWords.GF_SUGGESTIONS : "";
  }
  function isGroupsShortReelVideo(post, keyWords) {
    return ownPostReelLinks(post).length === 1 ? keyWords.GF_SHORT_REEL_VIDEO : "";
  }
  function mopGroupsFeed(context) {
    if (!context) {
      return null;
    }
    const { state, options, filters, keyWords, pathInfo: pathInfo2 } = context;
    if (!state || !options || !filters || !keyWords || !pathInfo2) {
      return null;
    }
    const [mainColumn, elDialog] = isGroupsColumnDirty(state);
    if (!mainColumn && !elDialog) {
      return null;
    }
    const mainColumnToken = mainColumn ? getDirtyToken(mainColumn) : null;
    const dialogToken = elDialog ? getDirtyToken(elDialog) : null;
    if (mainColumn) {
      revalidateTrackedPosts(mainColumn, state);
      if (state.gfType === "groups" || state.gfType === "groups-recent" || state.gfType === "search") {
        if (options.GF_SUGGESTIONS) {
          cleanGroupsSuggestions(context);
        }
        const query = state.gfType === "groups-recent" ? 'h2[dir="auto"] + div > div' : 'div[role="feed"] > div';
        const posts = Array.from(document.querySelectorAll(query));
        if (posts.length > 0) {
          const count = posts.length;
          const start = count < 25 ? 0 : count - 25;
          for (let i = start; i < count; i += 1) {
            const post = posts[i];
            if (!post) continue;
            if (post.innerHTML.length === 0) {
              continue;
            }
            let hideReason = "";
            let alreadyHidden = false;
            const postChanged = hasPostChanged(post);
            if (postChanged) {
              resetPostState(post, state);
            }
            if (state.gfType === "groups" && getDustingCount(post) === void 0) {
              setPostLinkToOpenInNewTab(post, state);
            }
            if (post.hasAttribute(postAtt)) {
              alreadyHidden = true;
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
            if (alreadyHidden || hideReason.length > 0) {
              state.echoCount += 1;
              if (!alreadyHidden) {
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
                scrubInfoBoxes(post, options, keyWords, pathInfo2, state);
              }
              if (options.GF_SHARES) {
                hideNumberOfShares(post, state, options);
              }
            }
            trackPostSignature(post);
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
            let alreadyHidden = false;
            const postChanged = hasPostChanged(post);
            if (postChanged) {
              resetPostState(post, state);
            }
            if (post.hasAttribute(postAtt)) {
              alreadyHidden = true;
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
            if (alreadyHidden || hideReason.length > 0) {
              state.echoCount += 1;
              if (!alreadyHidden) {
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
                scrubInfoBoxes(post, options, keyWords, pathInfo2, state);
              }
              if (options.GF_SHARES) {
                hideNumberOfShares(post, state, options);
              }
            }
            trackPostSignature(post);
          }
        }
      }
      if (!mainColumn.hasAttribute(mainColumnAtt)) {
        mainColumn.setAttribute(mainColumnAtt, "1");
      }
      if (mainColumnToken !== null) {
        markElementCleanIfUnchanged(mainColumn, mainColumnToken);
      }
      state.noChangeCounter = 0;
    }
    if (elDialog) {
      if (options.GF_ANIMATED_GIFS_PAUSE) {
        swatTheMosquitos(elDialog);
      }
      if (!elDialog.hasAttribute(mainColumnAtt)) {
        elDialog.setAttribute(mainColumnAtt, "1");
      }
      if (dialogToken !== null) {
        markElementCleanIfUnchanged(elDialog, dialogToken);
      }
      state.noChangeCounter = 0;
    }
    return { mainColumn, elDialog };
  }
  var init_groups2 = __esm({
    "src/feeds/groups.ts"() {
      "use strict";
      init_groups_features();
      init_attributes();
      init_animated_gifs();
      init_dirty_check();
      init_dusting();
      init_hide();
      init_info_boxes();
      init_news_identity();
      init_blocked_text2();
      init_animated_gifs2();
      init_blocks();
      init_sponsored();
      init_shares();
    }
  });

  // src/feeds/video-links.ts
  function findDuplicateVideos(urlQuery, postQuery, keyWords, context) {
    var _a;
    const watchVideos = document.querySelectorAll(urlQuery);
    if (watchVideos.length < 2) {
      return;
    }
    for (let i = 1; i < watchVideos.length; i += 1) {
      const videoPost = (_a = watchVideos[i]) == null ? void 0 : _a.closest(postQuery);
      if (videoPost) {
        hideVideoPost(videoPost, keyWords.VF_DUPLICATE_VIDEOS, "", context);
      }
    }
  }
  function hideDuplicateVideos(post, postQuery, keyWords, context) {
    var _a;
    const elWatchVideo = post.querySelector('div > span > a[href*="/watch/?v="]');
    if (elWatchVideo instanceof HTMLAnchorElement) {
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
      if (elUserVideo instanceof HTMLAnchorElement) {
        const watchVideoVID = (_a = elUserVideo.href.split("/videos/")[1]) == null ? void 0 : _a.split("/")[0];
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
  function setPostLinkToOpenInNewTab2(post, state) {
    try {
      if (post.querySelector(`.${state.iconNewWindowClass}`)) {
        return;
      }
      const postLinks = post.querySelectorAll('div > span > a[href*="/watch/?v="][role="link"]');
      if (postLinks.length > 0) {
        const postLink = postLinks[0];
        if (!(postLink instanceof HTMLAnchorElement)) return;
        const elHeader = climbUpTheTree(postLink, 3);
        if (!(elHeader instanceof Element)) {
          return;
        }
        const blockOfIcons = elHeader.querySelector(":scope > div:nth-of-type(2) > span");
        let newLink = "";
        if (blockOfIcons) {
          const videoId = new URL(postLink.href).searchParams.get("v");
          if (videoId !== null) {
            const watchLink = post.querySelector('a[href*="/watch/"]');
            if (!(watchLink instanceof HTMLAnchorElement)) {
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
        spanSpacer.innerHTML = '<span><span style="position:absolute;width:1px;height:1px;">&nbsp;</span><span aria-hidden="true"> ú </span></span>';
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
    } catch (e) {
      return;
    }
  }
  var init_video_links = __esm({
    "src/feeds/video-links.ts"() {
      "use strict";
      init_hide();
      init_dom();
    }
  });

  // src/feeds/videos.ts
  function isVideosDirty(state) {
    const arrReturn = [null, null];
    const mainColumnQuery = 'div[role="navigation"] ~ div[role="main"] div[role="main"] > div > div > div > div > div';
    const mainColumns = document.querySelectorAll(mainColumnQuery);
    let mainColumn = null;
    if (mainColumns.length > 0) {
      mainColumn = mainColumns.item(mainColumns.length - 1);
    }
    if (mainColumn) {
      ensureDirtyObserver(mainColumn);
      if (!mainColumn.hasAttribute(mainColumnAtt)) {
        mainColumn.setAttribute(mainColumnAtt, "1");
        markElementDirty(mainColumn);
      }
      if (state && state.forceProcess) {
        markElementDirty(mainColumn);
      }
      if (state && state.forceProcess) {
        arrReturn[0] = mainColumn;
      } else if (isElementDirty(mainColumn)) {
        arrReturn[0] = mainColumn;
      }
    }
    const elDialog = document.querySelector('div[role="dialog"] div[role="main"]');
    if (elDialog) {
      ensureDirtyObserver(elDialog);
      if (!elDialog.hasAttribute(mainColumnAtt)) {
        elDialog.setAttribute(mainColumnAtt, "1");
        markElementDirty(elDialog);
      }
      if (state && state.forceProcess) {
        markElementDirty(elDialog);
      }
      if (state && state.forceProcess) {
        arrReturn[1] = elDialog;
      } else if (isElementDirty(elDialog)) {
        arrReturn[1] = elDialog;
      }
    }
    if (state) {
      state.noChangeCounter += 1;
    }
    return arrReturn;
  }
  function normalizeVideoLabel(label) {
    return cleanText(label).replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  }
  function isOwnedVideoSignal(signal, post) {
    if (!isOwnedNewsElement(signal, post) || signal.closest('[hidden], [aria-hidden="true"]') || signal.querySelector('[hidden], [aria-hidden="true"]') || Array.from(signal.querySelectorAll("*")).some((child) => !isOwnedNewsElement(child, post)))
      return false;
    const references = signal.getAttribute("aria-labelledby");
    return !references || references.trim().split(/\s+/).every((id) => {
      const label = signal.ownerDocument.getElementById(id);
      return !!label && post.contains(label) && !label.contains(signal) && isOwnedNewsElement(label, post);
    });
  }
  function isVideoLive(post, keyWords) {
    const liveRule = 'div[role="presentation"] ~ div > div:nth-of-type(1) > span';
    return Array.from(post.querySelectorAll(liveRule)).some(
      (status) => isOwnedVideoSignal(status, post) && liveStatusLabels.has(normalizeVideoLabel(status.textContent || ""))
    ) ? keyWords.VF_LIVE : "";
  }
  function isInstagram(post, keyWords) {
    const instagramRule = 'div > div > div > div > div > a[href="#"] > div > svg';
    return Array.from(post.querySelectorAll(instagramRule)).some(
      (icon) => isOwnedVideoSignal(icon, post) && explicitNewsNames(icon).some((name) => normalizeVideoLabel(name) === "instagram")
    ) ? keyWords.VF_INSTAGRAM : "";
  }
  function hideSponsoredBlock(post, queryBlocks, context) {
    const { state, options, keyWords } = context;
    if (!options.VF_SPONSORED) return;
    const videoBlocks = post.querySelectorAll(queryBlocks);
    if (videoBlocks.length < 3) {
      return;
    }
    const thirdBlock = videoBlocks[2];
    if (!thirdBlock) return;
    if (thirdBlock.hasAttribute("class")) {
      return;
    }
    if (thirdBlock.hasAttribute(state.hideAtt)) {
      return;
    }
    if (!isOwnedNewsElement(thirdBlock, post) || !Array.from(thirdBlock.querySelectorAll("a[href]")).some(
      (link) => isSponsoredDisclosure(link, post)
    ))
      return;
    thirdBlock.setAttribute(postAtt, keyWords.SPONSORED);
    thirdBlock.setAttribute(state.hideAtt, keyWords.SPONSORED);
    if (options.VERBOSITY_DEBUG) thirdBlock.setAttribute(state.showAtt, "");
  }
  function scrubSponsoredBlock(post, context) {
    const { state, options, keyWords } = context;
    if (!options.VF_SPONSORED) return;
    const queryForContainer = ":scope > div > div > div > div > div > div:nth-of-type(2)";
    const blocksContainer = post.querySelector(queryForContainer);
    if (blocksContainer && blocksContainer.childElementCount > 0) {
      for (const adBlock of blocksContainer.querySelectorAll(":scope > a")) {
        if (adBlock.hasAttribute(postAtt) || !isSponsoredDisclosure(adBlock, post)) continue;
        adBlock.setAttribute(state.cssHideEl, "");
        adBlock.setAttribute(postAtt, keyWords.SPONSORED);
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
    const { state, options, filters, keyWords, pathInfo: pathInfo2 } = context;
    if (!state || !options || !filters || !keyWords || !pathInfo2) {
      return null;
    }
    const [mainColumn, elDialog] = isVideosDirty(state);
    if (!mainColumn && !elDialog) {
      return null;
    }
    const container = elDialog || mainColumn;
    const containerToken = container ? getDirtyToken(container) : null;
    if (container) {
      revalidateTrackedPosts(container, state);
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
          let alreadyHidden = false;
          const postChanged = hasPostChanged(post);
          if (postChanged) {
            resetPostState(post, state);
          }
          if (state.vfType === "videos" && getDustingCount(post) === void 0) {
            setPostLinkToOpenInNewTab2(post, state);
          }
          if (post.hasAttribute(postAtt)) {
            alreadyHidden = true;
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
                alreadyHidden = true;
              }
            }
            if (!alreadyHidden && hideReason === "" && options.VF_BLOCKED_ENABLED) {
              hideReason = findVideosBlockedText(post, options, filters, queryBlocks);
            }
          }
          if (alreadyHidden || hideReason.length > 0) {
            if (!alreadyHidden) {
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
              scrubInfoBoxes(post, options, keyWords, pathInfo2, state);
            }
            scrubSponsoredBlock(post, context);
          }
          hideSponsoredBlock(post, queryBlocks, context);
          trackPostSignature(post);
        }
      } else {
        const posts = document.querySelectorAll(query);
        for (const post of posts) {
          let hideReason = "";
          let alreadyHidden = false;
          const postChanged = hasPostChanged(post);
          if (postChanged) {
            resetPostState(post, state);
          }
          if (post.hasAttribute(postAtt)) {
            alreadyHidden = true;
          } else if (options.VF_BLOCKED_ENABLED) {
            hideReason = findVideosBlockedText(post, options, filters, queryBlocks);
          }
          if (alreadyHidden || hideReason.length > 0) {
            if (!alreadyHidden) {
              hideVideoPost(post, hideReason, "", {
                options,
                keyWords,
                attributes: { postAtt, postAttTab },
                state
              });
            }
          }
          trackPostSignature(post);
        }
      }
      if (!container.hasAttribute(mainColumnAtt)) {
        container.setAttribute(mainColumnAtt, "1");
      }
      if (containerToken !== null) {
        markElementCleanIfUnchanged(container, containerToken);
      }
      state.noChangeCounter = 0;
    }
    if (elDialog) {
      if (options.NF_ANIMATED_GIFS_PAUSE) {
        swatTheMosquitos(elDialog);
      }
    }
    return { mainColumn, elDialog };
  }
  var liveStatusLabels;
  var init_videos2 = __esm({
    "src/feeds/videos.ts"() {
      "use strict";
      init_video_links();
      init_i18n();
      init_text_normalize();
      init_attributes();
      init_animated_gifs();
      init_dirty_check();
      init_dusting();
      init_hide();
      init_info_boxes();
      init_walker();
      init_news_identity();
      init_blocked_text2();
      init_sponsored();
      liveStatusLabels = new Set(
        [...Object.values(translations).map((catalog24) => catalog24.VF_LIVE), "EN VIVO", "AO VIVO"].map(
          normalizeVideoLabel
        )
      );
    }
  });

  // src/feeds/marketplace-discovery.ts
  function collectMarketplaceListings(root) {
    const boxes = /* @__PURE__ */ new Map();
    for (const query of marketplaceListingQueries) {
      for (const item of root.querySelectorAll(query)) {
        const box = item.closest("div[style]");
        if (box && box !== root && root.contains(box) && !boxes.has(box)) boxes.set(box, item);
      }
    }
    return Array.from(boxes, ([box, item]) => ({ box, item }));
  }
  function revalidateMarketplaceListings(root, state) {
    var _a, _b;
    const listings = collectMarketplaceListings(root);
    const currentBoxes = new Set(listings.map(({ box }) => box));
    const markedQuery = [
      postAtt,
      postAttMPSkip,
      state.hideAtt,
      state.hideWithNoCaptionAtt,
      state.showAtt
    ].map((attribute) => `[${attribute}]`).join(", ");
    for (const box of root.querySelectorAll(markedQuery)) {
      if (!listingSignatures.has(box) || currentBoxes.has(box)) continue;
      resetPostState(box, state);
      box.removeAttribute(postAttMPSkip);
      listingSignatures.delete(box);
    }
    for (const { box, item } of listings) {
      const signature = `${(_a = item.getAttribute("href")) != null ? _a : ""}\0${(_b = item.textContent) != null ? _b : ""}`;
      const previous = listingSignatures.get(box);
      if (previous !== void 0 && previous !== signature) {
        resetPostState(box, state);
        box.removeAttribute(postAttMPSkip);
      }
      listingSignatures.set(box, signature);
    }
  }
  function collectMarketplaceSponsoredBoxes(root) {
    const boxes = /* @__PURE__ */ new Set();
    for (const link of root.querySelectorAll(marketplaceSponsoredHeadingQuery)) {
      const parent = link.parentElement;
      const heading = (parent == null ? void 0 : parent.tagName) === "OBJECT" ? parent.parentElement : parent;
      if (!heading || heading === root || !root.contains(heading)) continue;
      let tile = heading.nextElementSibling;
      while (tile == null ? void 0 : tile.matches("div[style]")) {
        if (!tile.querySelector(marketplaceSponsoredTileQuery)) break;
        boxes.add(heading);
        boxes.add(tile);
        tile = tile.nextElementSibling;
      }
    }
    return Array.from(boxes);
  }
  function clearMarketplaceListingTracking() {
    listingSignatures = /* @__PURE__ */ new WeakMap();
  }
  var listingSignatures;
  var init_marketplace_discovery = __esm({
    "src/feeds/marketplace-discovery.ts"() {
      "use strict";
      init_attributes();
      init_dirty_check();
      init_marketplace();
      listingSignatures = /* @__PURE__ */ new WeakMap();
    }
  });

  // src/feeds/marketplace.ts
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
    var _a;
    const collectionOfLinks = document.querySelectorAll('a[href*="/?ref="]');
    for (const trackingLink of collectionOfLinks) {
      trackingLink.href = (_a = trackingLink.href.split("/?ref")[0]) != null ? _a : trackingLink.href;
    }
  }
  function mpHideSponsoredItems(root, keyWords, state, options) {
    const query = ":scope > div > div > div > div > div > div[style] > span";
    const items = root.querySelectorAll(query);
    for (const item of items) {
      const box = item.parentElement;
      if (!box) continue;
      if (box.hasAttribute(postAttMPSkip)) {
        if (String(box.innerHTML.length) === box.getAttribute(postAttMPSkip)) {
          continue;
        }
      }
      mpHideBox(box, keyWords.SPONSORED, state, options);
    }
  }
  function mpGetBlockedPrices(elBlockOfText, filters) {
    if (filters.MP_BLOCKED_TEXT.length > 0) {
      const itemPrices = elBlockOfText ? mpScanTreeForText(elBlockOfText) : [];
      return findFirstMatch(itemPrices, filters.MP_BLOCKED_TEXT_LC);
    }
    return "";
  }
  function mpGetBlockedTextDescription(collectionBlocksOfText, filters, skipFirstBlock = true) {
    if (filters.MP_BLOCKED_TEXT_DESCRIPTION.length > 0) {
      const startIndex = skipFirstBlock ? 1 : 0;
      for (let i = startIndex; i < collectionBlocksOfText.length; i += 1) {
        const block = collectionBlocksOfText[i];
        if (!block) continue;
        const descriptionTextList = mpScanTreeForText(block);
        const descriptionText = descriptionTextList.join(" ").toLowerCase();
        const blockedText = findFirstMatch(descriptionText, filters.MP_BLOCKED_TEXT_DESCRIPTION_LC);
        if (blockedText.length > 0) {
          return blockedText;
        }
      }
    }
    return "";
  }
  function mpDoBlockingByBlockedText(root, filters, keyWords, state, options) {
    for (const { box, item } of collectMarketplaceListings(root)) {
      if (box.hasAttribute(postAtt)) continue;
      if (box.hasAttribute(postAttMPSkip)) {
        if (String(box.innerHTML.length) === box.getAttribute(postAttMPSkip)) {
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
  function findMarketplaceSurface(query) {
    for (const root of document.querySelectorAll(query)) {
      if (!root.closest('[hidden], [inert], [aria-hidden="true"]')) return root;
    }
    return null;
  }
  function isMarketplaceDirty(state) {
    var _a;
    const mainColumn = state.mpType === "item" ? (_a = findMarketplaceSurface(marketplaceSelectors.dialogItem)) != null ? _a : findMarketplaceSurface(marketplaceSelectors.mainColumn) : findMarketplaceSurface(marketplaceSelectors.mainColumn);
    if (mainColumn) {
      ensureDirtyObserver(mainColumn);
      if (!mainColumn.hasAttribute(mainColumnAtt)) {
        mainColumn.setAttribute(mainColumnAtt, "1");
        markElementDirty(mainColumn);
      }
      if (state.forceProcess) markElementDirty(mainColumn);
      if (isElementDirty(mainColumn)) return mainColumn;
    }
    state.noChangeCounter += 1;
    return null;
  }
  function mopMarketplaceFeed(context) {
    var _a, _b;
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
    const mainColumnToken = getDirtyToken(mainColumn);
    mpStopTrackingDirtIntoMyHouse();
    revalidateMarketplaceListings(mainColumn, state);
    if (state.mpType === "marketplace" || state.mpType === "item") {
      if (options.MP_SPONSORED) {
        mpHideSponsoredItems(mainColumn, keyWords, state, options);
        for (const box of collectMarketplaceSponsoredBoxes(mainColumn)) {
          mpHideBox(box, keyWords.SPONSORED, state, options);
        }
      }
      if (options.MP_BLOCKED_ENABLED) {
        mpDoBlockingByBlockedText(mainColumn, filters, keyWords, state, options);
      }
    }
    if (state.mpType === "item") {
      if (options.MP_SPONSORED) {
        const query = `span h2 [href*="/ads/about/"]:not([${postAtt}])`;
        const elLink = mainColumn.querySelector(query);
        if (elLink) {
          const box = (_b = (_a = elLink.closest("h2")) == null ? void 0 : _a.closest("span")) != null ? _b : null;
          mpHideBox(box, keyWords.SPONSORED, state, options);
          elLink.setAttribute(postAtt, keyWords.SPONSORED);
        }
      }
    } else if (state.mpType === "category" || state.mpType === "search") {
      if (options.MP_SPONSORED) {
        mpHideSponsoredItems(mainColumn, keyWords, state, options);
      }
      if (options.MP_BLOCKED_ENABLED) {
        mpDoBlockingByBlockedText(mainColumn, filters, keyWords, state, options);
      }
    }
    if (!mainColumn.hasAttribute(mainColumnAtt)) {
      mainColumn.setAttribute(mainColumnAtt, "1");
    }
    markElementCleanIfUnchanged(mainColumn, mainColumnToken);
    state.noChangeCounter = 0;
    return mainColumn;
  }
  var init_marketplace2 = __esm({
    "src/feeds/marketplace.ts"() {
      "use strict";
      init_matching();
      init_attributes();
      init_dirty_check();
      init_walker();
      init_hide();
      init_marketplace();
      init_marketplace_discovery();
    }
  });

  // src/diagnostics/matching.ts
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
      options.NF_REELS_SHORT_VIDEOS && isNewsReelsAndShortVideos(post, keyWords)
    );
    addMatch(
      matches,
      "NF_SHORT_REEL_VIDEO",
      options.NF_SHORT_REEL_VIDEO && isNewsShortReelVideo(post, keyWords)
    );
    addMatch(matches, "NF_META_AI", options.NF_META_AI && isNewsMetaAICard(post, keyWords));
    addMatch(
      matches,
      "NF_AI_INFO_POSTS",
      options.NF_AI_INFO_POSTS && isNewsAiInfoPost(post, keyWords)
    );
    addMatch(
      matches,
      "NF_META_AI_PROMPTS",
      options.NF_META_AI_PROMPTS && hasMetaAiPromptSuggestionRow(post)
    );
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
    addMatch(matches, "NF_FOLLOW", options.NF_FOLLOW && isNewsFollow(post, keyWords));
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
    if (options.NF_LIKES_MAXIMUM) {
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
    const priceBlock = blocksOfText[0];
    if (priceBlock) {
      const blockedPrices = mpGetBlockedPrices(priceBlock, filters);
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
  var init_matching2 = __esm({
    "src/diagnostics/matching.ts"() {
      "use strict";
      init_blocked_text2();
      init_animated_gifs2();
      init_shares();
      init_news2();
      init_groups2();
      init_videos2();
      init_marketplace2();
      init_sponsored();
      init_redaction();
    }
  });

  // src/diagnostics/samples.ts
  function buildSamples(context, maxSamples = 20) {
    const { state, filters } = context;
    if (state.isNF) {
      const { query, queries, posts } = getNewsPostCollection();
      const samples = samplePosts(posts, maxSamples).map((post) => ({
        signature: buildDomSignature(post),
        matches: buildNewsMatches(post, context),
        sponsoredDiagnostics: getSponsoredDiagnostics(post, state)
      }));
      return { feed: "news", query, queries, samples };
    }
    if (state.isGF) {
      const { query, posts } = getGroupsPostCollection(state);
      const samples = samplePosts(posts, maxSamples).map((post) => ({
        signature: buildDomSignature(post),
        matches: buildGroupsMatches(post, context),
        sponsoredDiagnostics: getSponsoredDiagnostics(post, state)
      }));
      return { feed: "groups", query, samples };
    }
    if (state.isVF) {
      const { query, queryBlocks, posts } = getVideosPostCollection(state);
      const samples = samplePosts(posts, maxSamples).map((post) => ({
        signature: buildDomSignature(post),
        matches: buildVideosMatches(post, queryBlocks, context),
        sponsoredDiagnostics: getSponsoredDiagnostics(post, state)
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
        matches: buildNewsMatches(post, context),
        sponsoredDiagnostics: getSponsoredDiagnostics(post, state)
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
  var init_samples = __esm({
    "src/diagnostics/samples.ts"() {
      "use strict";
      init_sponsored();
      init_collection();
      init_matching2();
    }
  });

  // src/diagnostics/bug-report.ts
  function buildBugReport(context) {
    if (!context) {
      return { data: { error: "No context available." }, text: "" };
    }
    const data = collectBugReportData(context);
    return { data, text: JSON.stringify(data, null, 2) };
  }
  function collectBugReportData(context) {
    const { state, options, filters, keyWords, pathInfo: pathInfo2 } = context;
    const now = /* @__PURE__ */ new Date();
    const scriptInfo = getScriptInfo();
    const safeLocation = buildSafeLocation();
    const newsMainColumn = document.querySelector(newsSelectors.mainColumn);
    const samples = buildSamples(context);
    return {
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
      regexValidationIssues: getRegexValidationIssues(options || {}),
      pathInfo: pathInfo2 || {},
      selectors: buildSelectorDiagnostics(state),
      discovery: {
        news: buildNewsDiscoveryDiagnostics(state)
      },
      hidden: {
        reasonCounts: collectReasonCounts(keyWords),
        hiddenElements: buildHiddenCounts(state),
        sample: collectHiddenSample(keyWords)
      },
      signals: {
        page: collectSignalCounts(document),
        newsMain: collectSignalCounts(newsMainColumn)
      },
      samples: { ...samples, summary: buildMatchSummary(samples.samples) },
      notes: {
        redaction: "Post text, names, and IDs are not included. Blocked keywords are hashed."
      }
    };
  }
  var init_bug_report = __esm({
    "src/diagnostics/bug-report.ts"() {
      "use strict";
      init_regex_validation();
      init_news();
      init_serialization();
      init_redaction();
      init_snapshots();
      init_collection();
      init_samples();
      init_matching2();
      init_serialization();
    }
  });

  // src/dom/styles/builder.ts
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
      var _a, _b, _c, _d;
      const temp2 = entry.split(":");
      return `    ${(_b = (_a = temp2[0]) == null ? void 0 : _a.trim()) != null ? _b : ""}:${(_d = (_c = temp2[1]) == null ? void 0 : _c.trim()) != null ? _d : ""}`;
    });
    let temp = `${listOfClasses.join(",\n")} {
`;
    temp += `${styleLines.join(";\n")};
`;
    temp += "}\n";
    state.tempStyleSheetCode += temp;
  }
  var init_builder = __esm({
    "src/dom/styles/builder.ts"() {
      "use strict";
    }
  });

  // src/dom/styles/feed-rules.ts
  function appendFeedStyles(state, options, defaults2) {
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
      "cursor: pointer; list-style: none; position: relative; margin:1.5rem auto; padding:0.5rem 1rem; border-radius:0.55rem; width:85%; font-style:italic;" + (options.VERBOSITY_MESSAGE_COLOUR === "" ? "" : ` color: ${options.VERBOSITY_MESSAGE_COLOUR}; `) + `background-color:${options.VERBOSITY_MESSAGE_BG_COLOUR === "" ? defaults2.VERBOSITY_MESSAGE_BG_COLOUR : options.VERBOSITY_MESSAGE_BG_COLOUR};`
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
      "border-radius: 0.55rem 0.55rem 0 0; width:75%; margin:0 auto; padding: 0.45rem 0.25rem; font-style:italic; text-align:center; font-weight:normal;" + (options.VERBOSITY_MESSAGE_COLOUR === "" ? "" : `  color: ${options.VERBOSITY_MESSAGE_COLOUR}; `) + `background-color:${options.VERBOSITY_MESSAGE_BG_COLOUR === "" ? defaults2.VERBOSITY_MESSAGE_BG_COLOUR : options.VERBOSITY_MESSAGE_BG_COLOUR}; `
    );
    addToSS(state, `[${state.cssHideNumberOfShares}]`, "display:none !important;");
    addToSS(state, `[${state.cssHideVerifiedBadge}]`, "display:none !important;");
    addToSS(
      state,
      `h4 [${state.cssHideVerifiedBadge}]`,
      "margin:0 !important; padding:0 !important; width:0 !important; height:0 !important;"
    );
  }
  var init_feed_rules2 = __esm({
    "src/dom/styles/feed-rules.ts"() {
      "use strict";
      init_builder();
      init_attributes();
    }
  });

  // src/dom/styles/accessories.ts
  function appendAccessoryStyles(state) {
    addToSS(
      state,
      ".cmf-icon",
      "display:inline-flex; width:20px; height:20px; flex-shrink:0; align-items:center; justify-content:center;color:inherit;"
    );
    addToSS(
      state,
      ".cmf-icon > svg",
      "display:block; width:100%; height:100%; color:inherit; overflow:visible; pointer-events:none;"
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
  }
  var init_accessories = __esm({
    "src/dom/styles/accessories.ts"() {
      "use strict";
      init_builder();
    }
  });

  // src/dom/styles/dialog-rules.ts
  function appendDialogStyles(state) {
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
    appendAccessoryStyles(state);
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
      ".fb-cmf fieldset legend .cmf-legend-icon > svg",
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
    addToSS(
      state,
      ".fb-cmf .fb-cmf-search-icon > svg",
      "width:16px; height:16px; fill: currentColor;"
    );
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
  }
  var init_dialog_rules = __esm({
    "src/dom/styles/dialog-rules.ts"() {
      "use strict";
      init_builder();
      init_accessories();
    }
  });

  // src/dom/styles/extra.ts
  function addExtraCSS(state, options, defaults2) {
    var _a, _b, _c, _d;
    if (!state || !options || !defaults2) {
      return null;
    }
    let cmfBtnLocation = defaults2.CMF_BTN_OPTION;
    let cmfDlgLocation = defaults2.CMF_DIALOG_OPTION;
    if (Object.prototype.hasOwnProperty.call(options, "CMF_BTN_OPTION")) {
      if (((_a = options.CMF_BTN_OPTION) == null ? void 0 : _a.toString()) !== "") {
        cmfBtnLocation = (_b = options.CMF_BTN_OPTION) != null ? _b : cmfBtnLocation;
      }
    }
    if (Object.prototype.hasOwnProperty.call(options, "CMF_DIALOG_OPTION")) {
      if (((_c = options.CMF_DIALOG_OPTION) == null ? void 0 : _c.toString()) !== "") {
        cmfDlgLocation = (_d = options.CMF_DIALOG_OPTION) != null ? _d : cmfDlgLocation;
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
      addToSS(state, ".fb-cmf-toggle > svg", "height: 95%; aspect-ratio : 1 / 1;");
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
      addToSS(
        state,
        ".fb-cmf-toggle:focus-visible",
        "outline:2px solid var(--focus-ring-blue, #0866ff); outline-offset:2px;"
      );
      addToSS(
        state,
        '.fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-open="true"]',
        "color: var(--cmf-active-icon, var(--primary-deemphasized-button-text, var(--accent))); background-color: var(--cmf-active-bg, var(--primary-deemphasized-button-background, rgba(8, 102, 255, 0.1)));"
      );
      addToSS(state, '.fb-cmf-toggle[data-cmf-page-dimmed="true"]', "pointer-events:none;");
      addToSS(
        state,
        '.fb-cmf-toggle[data-cmf-page-dimmed="true"]::after, .fb-cmf-toggle[data-cmf-page-dimmed="true"]:hover::after, .fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-page-dimmed="true"]::after, .fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-page-dimmed="true"]:hover::after',
        "background-color:rgba(11,11,11,0.66); opacity:1;"
      );
      addToSS(
        state,
        '.__fb-light-mode .fb-cmf-toggle[data-cmf-page-dimmed="true"]::after, .__fb-light-mode .fb-cmf-toggle[data-cmf-page-dimmed="true"]:hover::after, .__fb-light-mode .fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-page-dimmed="true"]::after, .__fb-light-mode .fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-page-dimmed="true"]:hover::after',
        "background-color:rgba(244,244,244,0.8); opacity:1;"
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
      ".fb-cmf footer .cmf-action-icon > svg",
      "width:20px; height:20px; fill: currentColor;"
    );
    addToSS(state, ".fb-cmf footer .cmf-action-icon .cmf-icon", "width:32px; height:32px;");
    if (state.tempStyleSheetCode.length > 0) {
      state.tempStyleSheetCode += "@keyframes cmf-pulse-blue {0% { color: #1877f2; }50% { color: #66a3ff; }100% { color: #1877f2; }}\n@keyframes cmf-pulse-green {0% { color: #2e7d32; }50% { color: #66bb6a; }100% { color: #2e7d32; }}\n@media (prefers-reduced-motion: reduce) {.fb-cmf-toggle.fb-cmf-toggle-topbar, #fbcmf footer > button, #fbcmf footer > button::after { transition:none; }#fbcmf footer > button.cmf-action--confirm-blue, #fbcmf footer > button.cmf-action--confirm-green { animation:none; }}\n";
      styleTag.appendChild(document.createTextNode(state.tempStyleSheetCode));
      state.tempStyleSheetCode = "";
    }
    return styleTag;
  }
  var init_extra = __esm({
    "src/dom/styles/extra.ts"() {
      "use strict";
      init_builder();
    }
  });

  // src/dom/styles.ts
  function addCSS(state, options, defaults2) {
    if (!state || !options || !defaults2) {
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
    appendFeedStyles(state, options, defaults2);
    appendDialogStyles(state);
    if (state.tempStyleSheetCode.length > 0) {
      styleTag.appendChild(document.createTextNode(state.tempStyleSheetCode));
      state.tempStyleSheetCode = "";
    }
    return styleTag;
  }
  var init_styles = __esm({
    "src/dom/styles.ts"() {
      "use strict";
      init_random();
      init_builder();
      init_feed_rules2();
      init_dialog_rules();
      init_builder();
      init_extra();
    }
  });

  // src/dom/theme.ts
  function detectDarkMode() {
    if (typeof document === "undefined" || !document.documentElement) {
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
      if (rgb && rgb[0] && rgb[1] && rgb[2]) {
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
    if (!state || typeof MutationObserver === "undefined") return null;
    let active = null;
    let bootstrap = null;
    let stopped = false;
    function syncMode() {
      if (stopped) return;
      const mode = detectDarkMode();
      if (state && state.isDarkMode !== mode) {
        state.isDarkMode = mode;
        onChange == null ? void 0 : onChange(mode);
      }
    }
    function startObserving() {
      if (stopped || !document.documentElement || active) return;
      bootstrap == null ? void 0 : bootstrap.disconnect();
      bootstrap = null;
      active = new MutationObserver((mutations) => {
        if (mutations.some(
          (mutation) => mutation.type === "attributes" && mutation.attributeName === "class"
        ))
          syncMode();
      });
      active.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      syncMode();
    }
    syncMode();
    startObserving();
    if (!active) {
      bootstrap = new MutationObserver(startObserving);
      bootstrap.observe(document, { childList: true });
    }
    return {
      /** Stop late bootstrap callbacks as well as the currently attached root observer. */
      disconnect: () => {
        if (stopped) return;
        stopped = true;
        bootstrap == null ? void 0 : bootstrap.disconnect();
        active == null ? void 0 : active.disconnect();
      }
    };
  }
  var init_theme = __esm({
    "src/dom/theme.ts"() {
      "use strict";
    }
  });

  // src/feeds/reels-presentation.ts
  function restoreAttribute(change) {
    if (change.element.getAttribute(change.name) !== change.applied) return;
    if (change.original === null) change.element.removeAttribute(change.name);
    else change.element.setAttribute(change.name, change.original);
  }
  function restoreChanges(changes) {
    for (const change of changes.values()) restoreAttribute(change);
    changes.clear();
  }
  function applyAttribute(changes, key, element, name, value) {
    let change = changes.get(key);
    if (change && change.element !== element) {
      restoreAttribute(change);
      changes.delete(key);
      change = void 0;
    }
    const current = element.getAttribute(name);
    if (!change) {
      change = { element, name, original: current, applied: value };
      changes.set(key, change);
    } else {
      if (current !== change.applied) change.original = current;
      change.applied = value;
    }
    if (current === value) return;
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }
  function retainChanges(changes, keys) {
    for (const [key, change] of changes) {
      if (keys.has(key)) continue;
      restoreAttribute(change);
      changes.delete(key);
    }
  }
  function restoreStyle(change) {
    const style = change.element.style;
    if (style.getPropertyValue(change.name) !== change.applied || style.getPropertyPriority(change.name) !== "")
      return;
    if (change.original === "") style.removeProperty(change.name);
    else style.setProperty(change.name, change.original, change.originalPriority);
    if (style.cssText !== change.originalCssText) return;
    if (change.originalAttribute === null) change.element.removeAttribute("style");
    else change.element.setAttribute("style", change.originalAttribute);
  }
  function restoreStyles(styles) {
    for (const change of styles.values()) restoreStyle(change);
    styles.clear();
  }
  function applyStyle(styles, key, element, name, value) {
    if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) return;
    let change = styles.get(key);
    if (change && change.element !== element) {
      restoreStyle(change);
      styles.delete(key);
      change = void 0;
    }
    const current = element.style.getPropertyValue(name);
    const priority = element.style.getPropertyPriority(name);
    if (!change) {
      change = {
        element,
        name,
        original: current,
        originalPriority: priority,
        applied: value,
        originalAttribute: element.getAttribute("style"),
        originalCssText: element.style.cssText
      };
      styles.set(key, change);
    } else {
      if (current !== change.applied || priority !== "") {
        change.original = current;
        change.originalPriority = priority;
        change.originalAttribute = element.getAttribute("style");
        change.originalCssText = element.style.cssText;
      }
      change.applied = value;
    }
    if (current === value && priority === "") return;
    element.style.setProperty(name, value);
    if (element.style.length === 1) element.setAttribute("style", `${name}:${value};`);
  }
  function retainStyles(styles, keys) {
    for (const [key, change] of styles) {
      if (keys.has(key)) continue;
      restoreStyle(change);
      styles.delete(key);
    }
  }
  function reconcileControls(video, presentation, enabled, isChromium) {
    var _a, _b;
    const descriptionOverlay = (_b = (_a = video.closest("[data-video-id]")) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.nextElementSibling;
    const active = /* @__PURE__ */ new Set();
    if (enabled && descriptionOverlay) {
      active.add("controls");
      applyAttribute(presentation.controls, "controls", video, "controls", "true");
      const description = descriptionOverlay.children[0];
      if (description) {
        active.add("description");
        applyStyle(
          presentation.styles,
          "description",
          description,
          "margin-bottom",
          `${isChromium ? "4.5" : "2.25"}rem`
        );
      }
      const overlay = video.nextElementSibling;
      if (overlay) {
        active.add("overlay");
        applyStyle(presentation.styles, "overlay", overlay, "display", "none");
      }
    }
    retainChanges(presentation.controls, active);
    retainStyles(presentation.styles, active);
  }
  function reconcileReelPresentation(video, options, isChromium) {
    let presentation = presentations2.get(video);
    if (!presentation) {
      presentation = {
        controls: /* @__PURE__ */ new Map(),
        styles: /* @__PURE__ */ new Map(),
        looping: /* @__PURE__ */ new Map(),
        marker: /* @__PURE__ */ new Map(),
        ended: null
      };
      presentations2.set(video, presentation);
    }
    reconcileControls(video, presentation, options.REELS_CONTROLS === true, isChromium);
    if (options.REELS_DISABLE_LOOPING === true) {
      applyAttribute(presentation.looping, "loop", video, "loop", null);
      if (!presentation.ended) {
        presentation.ended = () => video.pause();
        video.addEventListener("ended", presentation.ended);
      }
    } else {
      if (presentation.ended) video.removeEventListener("ended", presentation.ended);
      presentation.ended = null;
      restoreChanges(presentation.looping);
    }
    applyAttribute(presentation.marker, "marker", video, rvAtt, "1");
  }
  function restoreVideo(video, presentation) {
    if (presentation.ended) video.removeEventListener("ended", presentation.ended);
    restoreChanges(presentation.controls);
    restoreStyles(presentation.styles);
    restoreChanges(presentation.looping);
    restoreChanges(presentation.marker);
    presentations2.delete(video);
  }
  function pruneReelPresentations(active) {
    for (const [video, presentation] of presentations2) {
      if (!active.has(video)) restoreVideo(video, presentation);
    }
  }
  function restoreReelsPresentation() {
    for (const [video, presentation] of presentations2) restoreVideo(video, presentation);
  }
  var presentations2;
  var init_reels_presentation = __esm({
    "src/feeds/reels-presentation.ts"() {
      "use strict";
      init_attributes();
      presentations2 = /* @__PURE__ */ new Map();
    }
  });

  // src/feeds/reset.ts
  function resetFeedProcessing(state) {
    for (const element of document.querySelectorAll(`[${mainColumnAtt}]`)) {
      element.removeAttribute(mainColumnAtt);
    }
    toggleHiddenElements(state, state.options);
    if (!state.isAF) {
      restoreNewsPresentation();
      restoreReelsPresentation();
      clearMarketplaceListingTracking();
      return false;
    }
    state.scanCountStart += 100;
    state.scanCountMaxLoop += 100;
    restoreFeedPresentation(state);
    return true;
  }
  function restoreFeedPresentation(state) {
    restoreNewsPresentation();
    restoreReelsPresentation();
    clearMarketplaceListingTracking();
    for (const element of document.querySelectorAll(`[${mainColumnAtt}]`)) {
      element.removeAttribute(mainColumnAtt);
    }
    for (const element of document.querySelectorAll(`[${postAttMPSkip}]`)) {
      element.removeAttribute(postAttMPSkip);
    }
    for (const element of document.querySelectorAll(`details[${postAtt}]`)) {
      const parent = element.parentElement;
      if (!parent) continue;
      const content = element.lastElementChild;
      if ((content == null ? void 0 : content.tagName) === "DIV") parent.appendChild(content);
      parent.removeChild(element);
    }
    for (const caption of document.querySelectorAll(`h6[${postAttTab}]`)) {
      caption.remove();
    }
    const visibilityAttributes = [
      state.hideAtt,
      state.hideWithNoCaptionAtt,
      state.cssHideEl,
      state.cssHideNumberOfShares,
      state.showAtt
    ];
    for (const element of document.querySelectorAll(`[${postAtt}]`)) {
      element.removeAttribute(postAtt);
      for (const attribute of visibilityAttributes) element.removeAttribute(attribute);
    }
    for (const element of document.querySelectorAll(`[${postAttCPID}], [${postAttChildFlag}]`)) {
      element.removeAttribute(postAttCPID);
      element.removeAttribute(postAttChildFlag);
    }
    const hiddenQuery = [
      state.hideAtt,
      state.hideWithNoCaptionAtt,
      state.cssHideEl,
      state.cssHideNumberOfShares
    ].map((attribute) => `[${attribute}]`).join(", ");
    for (const element of document.querySelectorAll(hiddenQuery)) {
      for (const attribute of visibilityAttributes) element.removeAttribute(attribute);
    }
  }
  var init_reset = __esm({
    "src/feeds/reset.ts"() {
      "use strict";
      init_attributes();
      init_hide();
      init_news_presentation();
      init_reels_presentation();
      init_marketplace_discovery();
    }
  });

  // src/runtime/load-options.ts
  async function readStoredOptions() {
    var _a;
    try {
      const rawOptions = await getOptions();
      const candidate = typeof rawOptions === "string" ? JSON.parse(rawOptions) : rawOptions;
      return (_a = decodeStoredOptions(candidate)) != null ? _a : {};
    } catch (e) {
      return {};
    }
  }
  async function loadOptions(state) {
    var _a, _b;
    const storedOptions = await readStoredOptions();
    const siteLanguage = (_b = (_a = document.documentElement) == null ? void 0 : _a.lang) != null ? _b : "en";
    const hydrated = hydrateOptions(storedOptions, siteLanguage);
    hydrated.filters = resolveRegexFilters(hydrated.options).filters;
    state.options = hydrated.options;
    state.filters = hydrated.filters;
    state.language = hydrated.language;
    state.hideAnInfoBox = hydrated.hideAnInfoBox;
    state.optionsReady = true;
    return hydrated;
  }
  var init_load_options = __esm({
    "src/runtime/load-options.ts"() {
      "use strict";
      init_hydrate();
      init_regex_validation();
      init_idb();
    }
  });

  // src/runtime/loop.ts
  function cleaningDelay(noChangeCounter) {
    if (noChangeCounter < 16) return 50;
    if (noChangeCounter < 31) return 75;
    if (noChangeCounter < 46) return 100;
    if (noChangeCounter < 61) return 150;
    return 1e3;
  }
  function startLoop(state, hooks, environment = {
    window,
    document,
    /** Use monotonic wall-clock milliseconds for adaptive throttling within this lifecycle. */
    now: () => Date.now(),
    createObserver: typeof MutationObserver === "undefined" ? void 0 : (callback) => new MutationObserver(callback)
  }) {
    var _a;
    const { window: browser, document: page, now, createObserver } = environment;
    let previousScroll = browser.scrollY;
    let lastCleaningTime = 0;
    let sleepDuration = 50;
    let timer;
    let mutationTimer;
    let stopped = false;
    function schedule() {
      if (timer !== void 0) browser.clearTimeout(timer);
      timer = browser.setTimeout(() => run("timing"), sleepDuration);
    }
    function run(reason) {
      if (stopped) return;
      const currentTime = now();
      const force = state.forceProcess;
      if (reason === "url-changed") hooks.updateRoute();
      else if (reason === "scrolling") {
        if (sleepDuration < 151 && !force) return;
      } else if (currentTime - lastCleaningTime < sleepDuration && !force) return;
      hooks.process(reason);
      if (state.isAF) sleepDuration = cleaningDelay(state.noChangeCounter);
      lastCleaningTime = currentTime;
      schedule();
    }
    function onScroll() {
      const distance = Math.abs(browser.scrollY - previousScroll);
      previousScroll = browser.scrollY;
      if (distance > 20) {
        state.forceProcess = true;
        run("scrolling");
      }
    }
    function onNavigation() {
      run("url-changed");
    }
    browser.addEventListener("scroll", onScroll);
    browser.addEventListener("popstate", onNavigation);
    const routePoll = browser.setInterval(() => {
      if (state.prevURL !== browser.location.href) run("url-changed");
    }, 500);
    const observer = createObserver == null ? void 0 : createObserver(() => {
      if (!state.isAF || mutationTimer !== void 0 || stopped) return;
      mutationTimer = browser.setTimeout(() => {
        mutationTimer = void 0;
        state.forceProcess = true;
        run("mutations");
      }, 75);
    });
    observer == null ? void 0 : observer.observe((_a = page.body) != null ? _a : page, { childList: true, subtree: true });
    run("url-changed");
    return () => {
      if (stopped) return;
      stopped = true;
      if (timer !== void 0) browser.clearTimeout(timer);
      if (mutationTimer !== void 0) browser.clearTimeout(mutationTimer);
      browser.clearInterval(routePoll);
      observer == null ? void 0 : observer.disconnect();
      browser.removeEventListener("scroll", onScroll);
      browser.removeEventListener("popstate", onNavigation);
    };
  }
  var init_loop = __esm({
    "src/runtime/loop.ts"() {
      "use strict";
    }
  });

  // src/feeds/profile.ts
  function isProfileColumnDirty(state) {
    const arrReturn = [null, null];
    const mainColumn = document.querySelector(profileSelectors.mainColumn);
    if (mainColumn) {
      ensureDirtyObserver(mainColumn);
      if (!mainColumn.hasAttribute(mainColumnAtt)) {
        mainColumn.setAttribute(mainColumnAtt, "1");
        markElementDirty(mainColumn);
      }
      if (state && state.forceProcess) {
        markElementDirty(mainColumn);
      }
      if (state && state.forceProcess) {
        arrReturn[0] = mainColumn;
      } else if (isElementDirty(mainColumn)) {
        arrReturn[0] = mainColumn;
      }
    }
    const elDialog = document.querySelector(profileSelectors.dialog);
    if (elDialog) {
      ensureDirtyObserver(elDialog);
      if (!elDialog.hasAttribute(mainColumnAtt)) {
        elDialog.setAttribute(mainColumnAtt, "1");
        markElementDirty(elDialog);
      }
      if (state && state.forceProcess) {
        markElementDirty(elDialog);
      }
      if (state && state.forceProcess) {
        arrReturn[1] = elDialog;
      } else if (isElementDirty(elDialog)) {
        arrReturn[1] = elDialog;
      }
    }
    if (state) {
      state.noChangeCounter += 1;
    }
    return arrReturn;
  }
  function profilePermalinkIdentity(link) {
    var _a;
    const href = (_a = link.getAttribute("href")) != null ? _a : "";
    try {
      const url = new URL(href, document.baseURI);
      if (url.pathname.endsWith("story.php") || url.pathname.endsWith("permalink.php")) {
        const story = url.searchParams.get("story_fbid");
        return story ? `${url.origin}${url.pathname}?story_fbid=${story}` : `${url.origin}${url.pathname}${url.search}`;
      }
      return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
    } catch (e) {
      return href;
    }
  }
  function getProfilePostsFromPermalinks(mainColumn) {
    var _a, _b;
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
      const explicitPost = link.closest('div[aria-posinset], div[role="article"]');
      if (explicitPost && explicitPost !== mainColumn && mainColumn.contains(explicitPost)) {
        let ownedPost = explicitPost;
        let enclosing = (_a = explicitPost.parentElement) == null ? void 0 : _a.closest(
          'div[aria-posinset], div[role="article"]'
        );
        while (enclosing && enclosing !== mainColumn && mainColumn.contains(enclosing)) {
          ownedPost = enclosing;
          enclosing = (_b = enclosing.parentElement) == null ? void 0 : _b.closest('div[aria-posinset], div[role="article"]');
        }
        containers.add(ownedPost);
        continue;
      }
      while (node && node !== mainColumn) {
        const identities = new Set(
          Array.from(node.querySelectorAll(selector), profilePermalinkIdentity)
        );
        if (identities.size === 1) {
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
    const { state, options, filters, keyWords, pathInfo: pathInfo2 } = context;
    if (!state || !options || !filters || !keyWords || !pathInfo2) {
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
    const mainColumnToken = mainColumn ? getDirtyToken(mainColumn) : null;
    const dialogToken = elDialog ? getDirtyToken(elDialog) : null;
    revalidateTrackedPosts(mainColumn, state);
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
        let alreadyHidden = false;
        const isSponsoredPost = false;
        const postChanged = hasPostChanged(post);
        if (postChanged) {
          resetPostState(post, state);
        }
        if (post.hasAttribute(postAtt)) {
          alreadyHidden = true;
        } else {
          if (hideReason === "" && options.PP_ANIMATED_GIFS_POSTS) {
            hideReason = hasNewsAnimatedGifContent(post, keyWords);
          }
          if (hideReason === "" && options.PP_BLOCKED_ENABLED) {
            hideReason = findProfileBlockedText(post, options, filters);
          }
        }
        if (alreadyHidden || hideReason.length > 0) {
          if (!alreadyHidden) {
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
            scrubInfoBoxes(post, options, keyWords, pathInfo2, state);
          }
        }
        trackPostSignature(post);
      }
      if (!mainColumn.hasAttribute(mainColumnAtt)) {
        mainColumn.setAttribute(mainColumnAtt, "1");
      }
      if (mainColumnToken !== null) {
        markElementCleanIfUnchanged(mainColumn, mainColumnToken);
      }
      state.noChangeCounter = 0;
    }
    if (elDialog) {
      if (options.PP_ANIMATED_GIFS_PAUSE) {
        swatTheMosquitos(elDialog);
      }
      if (!elDialog.hasAttribute(mainColumnAtt)) {
        elDialog.setAttribute(mainColumnAtt, "1");
      }
      if (dialogToken !== null) {
        markElementCleanIfUnchanged(elDialog, dialogToken);
      }
      state.noChangeCounter = 0;
    }
    return { mainColumn, elDialog };
  }
  var profilePermalinkSelectors;
  var init_profile2 = __esm({
    "src/feeds/profile.ts"() {
      "use strict";
      init_attributes();
      init_animated_gifs();
      init_dirty_check();
      init_hide();
      init_info_boxes();
      init_profile();
      init_blocked_text2();
      init_animated_gifs2();
      profilePermalinkSelectors = [
        'a[href*="/posts/"]',
        'a[href*="/story.php"]',
        'a[href*="/permalink/"]',
        'a[href*="permalink.php"]'
      ];
    }
  });

  // src/feeds/reels.ts
  function mopReelsFeed(context, caller = "self") {
    if (!context) {
      return null;
    }
    const { state, options } = context;
    if (!state || !options) {
      return null;
    }
    if (!state.isRF) {
      stopReelsProcessing(state);
      return null;
    }
    if (caller !== "self" && state.isRF_InTimeoutMode === true) {
      return null;
    }
    const videos = document.querySelectorAll("[data-video-id] video");
    const active = /* @__PURE__ */ new Set();
    for (const video of videos) {
      if (!(video instanceof HTMLVideoElement)) continue;
      active.add(video);
      reconcileReelPresentation(video, options, state.isChromium);
    }
    pruneReelPresentations(active);
    state.isRF_InTimeoutMode = true;
    if (state.reelsTimer !== null) clearTimeout(state.reelsTimer);
    state.reelsTimer = setTimeout(() => {
      state.reelsTimer = null;
      mopReelsFeed(context, "self");
    }, 1e3);
    return videos;
  }
  function stopReelsProcessing(state) {
    if (state.reelsTimer !== null) clearTimeout(state.reelsTimer);
    restoreReelsPresentation();
    state.reelsTimer = null;
    state.isRF = false;
    state.isRF_InTimeoutMode = false;
  }
  var init_reels = __esm({
    "src/feeds/reels.ts"() {
      "use strict";
      init_reels_presentation();
    }
  });

  // src/feeds/search.ts
  function isSearchColumnDirty(state) {
    const mainColumn = document.querySelector(searchSelectors.mainColumn);
    if (mainColumn) {
      ensureDirtyObserver(mainColumn);
      if (!mainColumn.hasAttribute(mainColumnAtt)) {
        mainColumn.setAttribute(mainColumnAtt, "1");
        markElementDirty(mainColumn);
      }
      if (state && state.forceProcess) {
        markElementDirty(mainColumn);
      }
      if (state && state.forceProcess) {
        return mainColumn;
      }
      if (isElementDirty(mainColumn)) {
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
    const { state, options, filters, keyWords, pathInfo: pathInfo2 } = context;
    if (!state || !options || !filters || !keyWords || !pathInfo2) {
      return null;
    }
    const mainColumn = isSearchColumnDirty(state);
    if (!mainColumn) {
      return null;
    }
    const mainColumnToken = getDirtyToken(mainColumn);
    revalidateTrackedPosts(mainColumn, state);
    if (options.NF_BLOCKED_ENABLED) {
      const posts = Array.from(document.querySelectorAll(searchSelectors.postsQuery));
      for (const post of posts) {
        if (post.innerHTML.length === 0) {
          continue;
        }
        let hideReason = "";
        let alreadyHidden = false;
        let isSponsoredPost = false;
        const postChanged = hasPostChanged(post);
        if (postChanged) {
          resetPostState(post, state);
        }
        if (post.hasAttribute(postAtt)) {
          alreadyHidden = true;
        } else {
          if (options.NF_SPONSORED && isSponsored(post, state)) {
            hideReason = keyWords.SPONSORED;
            isSponsoredPost = true;
          }
          if (hideReason === "" && options.NF_BLOCKED_ENABLED) {
            hideReason = findNewsBlockedText(post, options, filters);
          }
        }
        if (alreadyHidden || hideReason.length > 0) {
          state.echoCount += 1;
          if (!alreadyHidden) {
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
            scrubInfoBoxes(post, options, keyWords, pathInfo2, state);
          }
        }
        trackPostSignature(post);
      }
    }
    if (!mainColumn.hasAttribute(mainColumnAtt)) {
      mainColumn.setAttribute(mainColumnAtt, "1");
    }
    markElementCleanIfUnchanged(mainColumn, mainColumnToken);
    state.noChangeCounter = 0;
    return mainColumn;
  }
  var init_search2 = __esm({
    "src/feeds/search.ts"() {
      "use strict";
      init_attributes();
      init_animated_gifs();
      init_dirty_check();
      init_hide();
      init_info_boxes();
      init_search();
      init_blocked_text2();
      init_sponsored();
    }
  });

  // src/runtime/process-page.ts
  function processPage(context, eventType = "timing") {
    pruneDirtyObservers();
    const { state } = context;
    if (!state.isAF) return;
    if (state.isNF) mopNewsFeed(context);
    else if (state.isGF) mopGroupsFeed(context);
    else if (state.isVF) mopVideosFeed(context);
    else if (state.isMF) mopMarketplaceFeed(context);
    else if (state.isSF) mopSearchFeed(context);
    else if (state.isRF) mopReelsFeed(context, eventType === "timing" ? "sleeping" : eventType);
    else if (state.isPP) mopProfileFeed(context);
    state.forceProcess = false;
  }
  var init_process_page = __esm({
    "src/runtime/process-page.ts"() {
      "use strict";
      init_dirty_check();
      init_groups2();
      init_marketplace2();
      init_news2();
      init_profile2();
      init_reels();
      init_search2();
      init_videos2();
    }
  });

  // src/core/routing/routes.ts
  function classifyRoute(pathname, search, options) {
    const route = {
      isNF: false,
      isGF: false,
      isVF: false,
      isMF: false,
      isSF: false,
      isRF: false,
      isPP: false,
      isAF: false,
      gfType: "",
      vfType: "",
      mpType: ""
    };
    if (pathname === "/" || pathname === "/home.php") {
      if (search.indexOf("?filter=groups") < 0) {
        route.isNF = true;
      } else {
        route.isGF = true;
        route.gfType = "groups-recent";
      }
    } else if (pathname.includes("/groups/")) {
      route.isGF = true;
      if (pathname.includes("/groups/feed")) {
        route.gfType = "groups";
      } else if (pathname.includes("/groups/search")) {
        route.gfType = "search";
      } else if (pathname.includes("?filter=groups&sk=h_chr")) {
        route.gfType = "groups-recent";
      } else {
        route.gfType = "group";
      }
    } else if (pathname.includes("/watch")) {
      route.isVF = true;
      if (pathname.includes("/watch/search")) {
        route.vfType = "search";
      } else if (search.includes("?ref=seach")) {
        route.vfType = "item";
      } else if (search.includes("?v=")) {
        route.vfType = "item";
      } else {
        route.vfType = "videos";
      }
    } else if (pathname.includes("/marketplace")) {
      route.isMF = true;
      if (route.isMF && pathname.includes("/item/")) {
        route.mpType = "item";
      } else if (pathname.includes("/search")) {
        route.mpType = "search";
      } else if (pathname.includes("/category/")) {
        route.mpType = "category";
      } else {
        const urlBits = pathname.split("/");
        if (urlBits.length > 3) {
          route.mpType = "category";
        } else {
          route.mpType = "marketplace";
        }
      }
    } else if (pathname.includes("/commerce/listing/")) {
      route.isMF = true;
      route.mpType = "item";
    } else if (["/search/top/", "/search/top", "/search/posts/", "/search/posts", "/search/pages/"].includes(
      pathname
    )) {
      route.isSF = true;
    } else if (pathname.includes("/reel/")) {
      route.isRF = options.REELS_CONTROLS === true || options.REELS_DISABLE_LOOPING === true;
    } else if (pathname.includes("/profile.php")) {
      route.isPP = true;
    } else if (pathname.substring(1).length > 1 && pathname.substring(1).indexOf("/") < 0) {
      route.isPP = true;
    }
    route.isAF = route.isNF || route.isGF || route.isVF || route.isMF || route.isSF || route.isRF || route.isPP;
    return route;
  }
  var init_routes = __esm({
    "src/core/routing/routes.ts"() {
      "use strict";
    }
  });

  // src/runtime/routes.ts
  function setFeedSettings(state, options, forceUpdate = false, location = window.location) {
    var _a, _b;
    if (state.prevURL === location.href && !forceUpdate) return false;
    state.prevURL = location.href;
    state.prevPathname = location.pathname;
    state.prevQuery = location.search;
    const route = classifyRoute(location.pathname, location.search, options);
    if (state.isNF && !route.isNF) restoreNewsPresentation();
    Object.assign(state, route);
    state.forceProcess = true;
    state.lastNewsPostSweepAt = 0;
    state.echoCount = 0;
    state.noChangeCounter = 0;
    if (state.isAF) (_a = state.btnToggleEl) == null ? void 0 : _a.setAttribute(state.showAtt, "");
    else (_b = state.btnToggleEl) == null ? void 0 : _b.removeAttribute(state.showAtt);
    return true;
  }
  var init_routes2 = __esm({
    "src/runtime/routes.ts"() {
      "use strict";
      init_news_presentation();
      init_routes();
    }
  });

  // src/dom/types.ts
  function createDomState() {
    return {
      hideAtt: "",
      showAtt: "",
      hideWithNoCaptionAtt: "",
      cssHideEl: "",
      cssHideNumberOfShares: "",
      cssHideVerifiedBadge: "",
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
      cssEcho: ""
    };
  }
  var init_types = __esm({
    "src/dom/types.ts"() {
      "use strict";
    }
  });

  // src/feeds/state.ts
  function createFeedState() {
    return {
      scanCountStart: 0,
      scanCountMaxLoop: 15,
      noChangeCounter: 0,
      isNF: false,
      isGF: false,
      isVF: false,
      isMF: false,
      isAF: false,
      isSF: false,
      isRF: false,
      isPP: false,
      isRF_InTimeoutMode: false,
      reelsTimer: null,
      gfType: "",
      vfType: "",
      mpType: "",
      forceProcess: false,
      lastNewsPostSweepAt: 0
    };
  }
  var init_state = __esm({
    "src/feeds/state.ts"() {
      "use strict";
    }
  });

  // src/ui/state.ts
  function createUIState() {
    return {
      dialogLifecycle: null,
      dialogContentLifecycle: null,
      destroyDialog: null,
      btnToggleEl: null,
      destroyToggleButton: null,
      syncToggleButtonTheme: null,
      syncDialogSearch: null,
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
      saveFeedbackTimeoutId: null
    };
  }
  var init_state2 = __esm({
    "src/ui/state.ts"() {
      "use strict";
    }
  });

  // src/runtime/state.ts
  function createState() {
    return {
      ...createDomState(),
      ...createFeedState(),
      ...createUIState(),
      SEP: SEPARATOR,
      options: {},
      optionsReady: false,
      language: "",
      filters: {},
      hideAnInfoBox: false,
      prevURL: "",
      prevPathname: "",
      prevQuery: "",
      isChromium: false
    };
  }
  var init_state3 = __esm({
    "src/runtime/state.ts"() {
      "use strict";
      init_constants();
      init_types();
      init_state();
      init_state2();
    }
  });

  // src/runtime/userscript-api.ts
  function getUserscriptManager() {
    return globalThis.GM;
  }
  var init_userscript_api = __esm({
    "src/runtime/userscript-api.ts"() {
      "use strict";
    }
  });

  // src/ui/dialog/search.ts
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
      const legendText = legend ? (legend.dataset.cmfTitle || legend.textContent || "").trim().toLowerCase() : "";
      const labels = Array.from(fieldset.querySelectorAll("label"));
      let anyMatch = false;
      labels.forEach((label) => {
        const labelText = (label.textContent || "").trim().toLowerCase();
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
    if (!dialog) {
      return;
    }
    const searchInput = dialog.querySelector(".fb-cmf-search input");
    if (!searchInput) {
      return;
    }
    if (searchInput.dataset.cmfSearchInit === "1") return;
    searchInput.dataset.cmfSearchInit = "1";
    const lifecycle = state.dialogContentLifecycle || state.dialogLifecycle;
    applySearchFilter(dialog, searchInput.value || "");
    lifecycle == null ? void 0 : lifecycle.listen(searchInput, "input", () => {
      applySearchFilter(dialog, searchInput.value || "");
    });
    state.syncDialogSearch = () => {
      if (lifecycle && !lifecycle.active) return;
      if (searchInput.value) {
        applySearchFilter(dialog, searchInput.value);
      }
    };
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
      legend.style.width = maxWidth > 0 ? `${Math.ceil(maxWidth)}px` : previousWidths[index] || "";
    });
  }
  var init_search3 = __esm({
    "src/ui/dialog/search.ts"() {
      "use strict";
    }
  });

  // src/ui/dialog/regex-errors.ts
  function feedLabel(keyWords, feed) {
    return keyWords[`DLG_${feed}`];
  }
  function clearRegexErrors(dialog) {
    if (!dialog) return;
    dialog.querySelectorAll(".cmf-regex-error").forEach((error) => error.remove());
    dialog.querySelectorAll("textarea[data-cmf-regex-invalid]").forEach((input) => {
      input.setCustomValidity("");
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
      delete input.dataset.cmfRegexInvalid;
    });
  }
  function visibleLine(input, normalizedLine, separator) {
    let token = 0;
    const lines = input.value.split("\n");
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (!(line == null ? void 0 : line.trim())) continue;
      token += line.split(separator).length;
      if (token >= normalizedLine) return index + 1;
    }
    return normalizedLine;
  }
  function showRegexErrors(context, issues, source) {
    var _a;
    const dialog = document.getElementById("fbcmf");
    if (!dialog) return;
    clearRegexErrors(dialog);
    const grouped = /* @__PURE__ */ new Map();
    for (const issue of issues) {
      const input = dialog.querySelector(`textarea[name="${issue.field}"]`);
      if (!input) continue;
      const origin = issue.field === "NF_BLOCKED_TEXT" ? "NF" : issue.field === "GF_BLOCKED_TEXT" ? "GF" : issue.field === "VF_BLOCKED_TEXT" ? "VF" : "PP";
      const line = source === "draft" ? visibleLine(input, issue.line, context.state.SEP) : issue.line;
      const message = context.keyWords.DLG_REGEX_ERROR.replace(
        "{field}",
        `${feedLabel(context.keyWords, origin)}: ${context.keyWords.DLG_BLOCK_TEXT_FILTER_TITLE}`
      ).replace("{line}", String(line)).replace("{feed}", feedLabel(context.keyWords, issue.destination));
      const messages = (_a = grouped.get(issue.field)) != null ? _a : [];
      messages.push(message);
      grouped.set(issue.field, messages);
    }
    if (grouped.size > 0) {
      const searchInput = dialog.querySelector(".fb-cmf-search input");
      if (searchInput) searchInput.value = "";
      applySearchFilter(dialog, "");
    }
    let first;
    for (const [field, messages] of grouped) {
      const input = dialog.querySelector(`textarea[name="${field}"]`);
      if (!input) continue;
      const prefix = source === "import" ? context.keyWords.DLG_REGEX_IMPORT_ERROR : source === "stored" || source === "reset" ? context.keyWords.DLG_REGEX_SAVED_ERROR : "";
      const message = [prefix, ...messages].filter(Boolean).join("\n");
      const error = document.createElement("div");
      error.id = `cmf-regex-error-${field}`;
      error.className = "cmf-regex-error";
      error.setAttribute("role", "alert");
      error.style.whiteSpace = "pre-line";
      error.style.color = "var(--negative, #b00020)";
      error.textContent = message;
      input.before(error);
      input.dataset.cmfRegexInvalid = "1";
      input.setAttribute("aria-describedby", error.id);
      const savedValue = context.state.options[field];
      const matchesStored = typeof savedValue === "string" && input.value === savedValue.replaceAll(context.state.SEP, "\n");
      if (source === "draft" || source !== "import" && matchesStored) {
        input.setCustomValidity(message);
        input.setAttribute("aria-invalid", "true");
      }
      updateFieldsetState(input.closest("fieldset"), true, { animateHeight: false });
      first != null ? first : first = input;
    }
    if (source !== "stored") first == null ? void 0 : first.focus();
  }
  var init_regex_errors = __esm({
    "src/ui/dialog/regex-errors.ts"() {
      "use strict";
      init_search3();
    }
  });

  // src/ui/lifecycle.ts
  var UiLifecycle;
  var init_lifecycle = __esm({
    "src/ui/lifecycle.ts"() {
      "use strict";
      UiLifecycle = class {
        constructor() {
          this.active = true;
          this.cleanups = /* @__PURE__ */ new Set();
        }
        /** Register a teardown, or run it immediately when its generation already ended. */
        add(cleanup) {
          if (!cleanup) return;
          if (this.active) this.cleanups.add(cleanup);
          else cleanup();
        }
        /** Remove an event listener at teardown and ignore already-queued stale dispatches. */
        listen(target, type, listener, options) {
          const guarded = (event) => {
            if (this.active) listener(event);
          };
          target.addEventListener(type, guarded, options);
          this.add(() => target.removeEventListener(type, guarded, options));
        }
        /** Observe a node only while mounted; pending mutation records cannot reach a later generation. */
        observe(target, options, callback) {
          if (!this.active || typeof MutationObserver === "undefined") return;
          const observer = new MutationObserver((records, instance) => {
            if (this.active) callback(records, instance);
          });
          observer.observe(target, options);
          this.add(() => observer.disconnect());
        }
        /** Schedule an owned timeout in milliseconds and release its cleanup record once it fires. */
        defer(callback, delay) {
          if (!this.active) return;
          const id = setTimeout(() => {
            this.cleanups.delete(cancel);
            if (this.active) callback();
          }, delay);
          const cancel = () => clearTimeout(id);
          this.add(cancel);
        }
        /** Coalesce caller-owned work into a cancellable frame, with a timeout fallback for limited hosts. */
        frame(callback) {
          if (!this.active) return;
          if (typeof window.requestAnimationFrame !== "function") {
            this.defer(callback, 0);
            return;
          }
          let id = null;
          const cancel = () => {
            if (id !== null) window.cancelAnimationFrame(id);
          };
          this.add(cancel);
          id = window.requestAnimationFrame(() => {
            this.cleanups.delete(cancel);
            if (this.active) callback();
          });
        }
        /** Tear down all owned resources once; one faulty host cleanup cannot retain the others. */
        dispose() {
          if (!this.active) return;
          this.active = false;
          for (const cleanup of this.cleanups) {
            try {
              cleanup();
            } catch (e) {
            }
          }
          this.cleanups.clear();
        }
      };
    }
  });

  // src/dom/topbar-controls.ts
  function getRect(element) {
    if (!element || typeof element.getBoundingClientRect !== "function") {
      return null;
    }
    const rect = element.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) {
      return null;
    }
    return rect;
  }
  function isInteractiveControl(element) {
    if (!element || !element.tagName) {
      return false;
    }
    const tagName = element.tagName.toUpperCase();
    if (tagName === "BUTTON") {
      return true;
    }
    if (element.getAttribute("role") === "button") {
      return true;
    }
    if (element.getAttribute("aria-expanded") !== null) {
      return true;
    }
    if (tagName === "A" && element.getAttribute("aria-label")) {
      return true;
    }
    const tabIndex = element.getAttribute("tabindex");
    return tabIndex !== null && tabIndex !== "-1";
  }
  function isSameRect(first, second) {
    return Math.abs(first.left - second.left) <= RECT_MATCH_TOLERANCE && Math.abs(first.top - second.top) <= RECT_MATCH_TOLERANCE && Math.abs(first.width - second.width) <= RECT_MATCH_TOLERANCE && Math.abs(first.height - second.height) <= RECT_MATCH_TOLERANCE;
  }
  function dedupeOverlappingControls(controls) {
    return controls.filter(
      (control, index) => !controls.slice(0, index).some((existingControl) => isSameRect(existingControl.rect, control.rect))
    );
  }
  function isTopbarControlCandidate(element, bannerRect) {
    if (!isInteractiveControl(element)) {
      return false;
    }
    const rect = getRect(element);
    if (!rect) {
      return false;
    }
    if (rect.width < MIN_CONTROL_SIZE || rect.height < MIN_CONTROL_SIZE || rect.width > MAX_CONTROL_SIZE || rect.height > MAX_CONTROL_SIZE) {
      return false;
    }
    const aspectRatio = rect.width / rect.height;
    if (aspectRatio < MIN_ASPECT_RATIO || aspectRatio > MAX_ASPECT_RATIO) {
      return false;
    }
    if (!bannerRect) {
      return true;
    }
    return rect.bottom > bannerRect.top && rect.top < bannerRect.bottom;
  }
  function buildControlClusters(controls) {
    const clusters = [];
    controls.forEach((control) => {
      const currentCluster = clusters[clusters.length - 1];
      if (!currentCluster) {
        clusters.push({
          controls: [control],
          rightEdge: control.rect.right
        });
        return;
      }
      const previous = currentCluster.controls[currentCluster.controls.length - 1];
      if (!previous) return;
      const gap = control.rect.left - previous.rect.right;
      const sameRow = Math.abs(control.rect.top - previous.rect.top) <= MAX_ROW_OFFSET;
      const similarHeight = Math.abs(control.rect.height - previous.rect.height) <= MAX_ROW_OFFSET;
      if (sameRow && similarHeight && gap >= -1 && gap <= MAX_CLUSTER_GAP) {
        currentCluster.controls.push(control);
        currentCluster.rightEdge = control.rect.right;
        return;
      }
      clusters.push({
        controls: [control],
        rightEdge: control.rect.right
      });
    });
    return clusters;
  }
  function getTopbarControlButtons(root = document) {
    var _a, _b;
    if (!root || typeof root.querySelector !== "function") {
      return [];
    }
    const banner = root.querySelector('[role="banner"]');
    if (!banner) {
      return [];
    }
    const bannerRect = getRect(banner);
    const controls = dedupeOverlappingControls(
      Array.from(new Set(Array.from(banner.querySelectorAll(topbarControlSelector)))).filter((control) => isTopbarControlCandidate(control, bannerRect)).map((control) => ({
        element: control,
        rect: getRect(control)
      })).filter((control) => control.rect !== null).sort((a, b) => a.rect.left - b.rect.left)
    );
    if (controls.length === 0) {
      return [];
    }
    const clusters = buildControlClusters(controls);
    const candidateClusters = clusters.some((cluster) => cluster.controls.length > 1) ? clusters.filter((cluster) => cluster.controls.length > 1) : clusters;
    candidateClusters.sort(
      (a, b) => b.rightEdge - a.rightEdge || b.controls.length - a.controls.length
    );
    return (_b = (_a = candidateClusters[0]) == null ? void 0 : _a.controls.map((control) => control.element)) != null ? _b : [];
  }
  function getTopbarMenuButton(root = document) {
    var _a;
    const controls = getTopbarControlButtons(root);
    return (_a = controls[0]) != null ? _a : null;
  }
  function isTopbarControlButton(element, root = document) {
    return getTopbarControlButtons(root).some((control) => control === element);
  }
  var MIN_CONTROL_SIZE, MAX_CONTROL_SIZE, MIN_ASPECT_RATIO, MAX_ASPECT_RATIO, MAX_CLUSTER_GAP, MAX_ROW_OFFSET, RECT_MATCH_TOLERANCE, topbarControlSelector;
  var init_topbar_controls = __esm({
    "src/dom/topbar-controls.ts"() {
      "use strict";
      MIN_CONTROL_SIZE = 28;
      MAX_CONTROL_SIZE = 72;
      MIN_ASPECT_RATIO = 0.75;
      MAX_ASPECT_RATIO = 1.35;
      MAX_CLUSTER_GAP = 24;
      MAX_ROW_OFFSET = 12;
      RECT_MATCH_TOLERANCE = 1;
      topbarControlSelector = 'button, [role="button"], a[aria-label]';
    }
  });

  // src/dom/tooltip.ts
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
  var init_tooltip = __esm({
    "src/dom/tooltip.ts"() {
      "use strict";
      init_random();
    }
  });

  // src/ui/controls/toggle-position.ts
  function createTopbarPositioning(btn) {
    let cachedIconColor = "";
    let cachedBtnBg = "";
    let cachedHover = "";
    let cachedPress = "";
    let lastMenuRect = null;
    let themeDirty = false;
    const updateTopRightPosition = () => {
      var _a;
      const menuButton = getTopbarMenuButton();
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
      const activeBackground = menuStyle.getPropertyValue("--primary-deemphasized-button-background");
      const activeIcon = menuStyle.getPropertyValue("--primary-deemphasized-button-text");
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
      btn.style.setProperty(
        "--cmf-active-bg",
        activeBackground.trim() || "var(--primary-deemphasized-button-background, rgba(8, 102, 255, 0.1))"
      );
      btn.style.setProperty(
        "--cmf-active-icon",
        activeIcon.trim() || "var(--primary-deemphasized-button-text, var(--accent, #0866ff))"
      );
      const icon = (_a = btn.querySelector(".cmf-icon")) != null ? _a : btn.querySelector("svg");
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
    const needsMenuSync = () => {
      const menuButton = getTopbarMenuButton();
      if (!menuButton) {
        return lastMenuRect !== null;
      }
      const rect = menuButton.getBoundingClientRect();
      if (!lastMenuRect) {
        return true;
      }
      return Math.abs(rect.left - lastMenuRect.left) > 1 || Math.abs(rect.top - lastMenuRect.top) > 1 || Math.abs(rect.width - lastMenuRect.width) > 1 || Math.abs(rect.height - lastMenuRect.height) > 1;
    };
    const invalidateTheme = (themeChanged = false) => {
      cachedIconColor = "";
      cachedBtnBg = "";
      cachedHover = "";
      cachedPress = "";
      if (themeChanged) themeDirty = true;
    };
    return { updatePosition: updateTopRightPosition, needsMenuSync, invalidateTheme };
  }
  var isUsableColor;
  var init_toggle_position = __esm({
    "src/ui/controls/toggle-position.ts"() {
      "use strict";
      init_topbar_controls();
      isUsableColor = (value) => {
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
    }
  });

  // src/ui/controls/modal-scrim.ts
  function getVisibleRect(element) {
    if (!element || typeof element.getBoundingClientRect !== "function") {
      return null;
    }
    const rect = element.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) {
      return null;
    }
    return rect;
  }
  function parseRgbColor(color) {
    if (typeof color !== "string") {
      return null;
    }
    const match = color.trim().match(
      /^rgba?\(\s*([0-9.]+)(?:,|\s)\s*([0-9.]+)(?:,|\s)\s*([0-9.]+)(?:\s*[,/]\s*([0-9.]+%?))?\s*\)$/i
    );
    if (!match) {
      return null;
    }
    const alphaValue = match[4] || "1";
    const alpha = alphaValue.endsWith("%") ? parseFloat(alphaValue.slice(0, -1)) / 100 : parseFloat(alphaValue);
    return {
      r: parseFloat(match[1] || "0"),
      g: parseFloat(match[2] || "0"),
      b: parseFloat(match[3] || "0"),
      a: Number.isNaN(alpha) ? 1 : alpha
    };
  }
  function isModalScrimColor(color) {
    const parsed = parseRgbColor(color);
    if (!parsed) {
      return false;
    }
    const maxChannel = Math.max(parsed.r, parsed.g, parsed.b);
    const minChannel = Math.min(parsed.r, parsed.g, parsed.b);
    return parsed.a >= 0.2 && (maxChannel <= 120 || minChannel >= 180);
  }
  function isVisibleElement(element) {
    const rect = getVisibleRect(element);
    if (!rect) {
      return false;
    }
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
  }
  function hasVisibleDialog() {
    return Array.from(document.querySelectorAll('[role="dialog"], [aria-modal="true"]')).some(
      isVisibleElement
    );
  }
  function isFullViewportDimmer(element) {
    if (!element || element.id === "fbcmf" || element.id === "fbcmfToggle") {
      return false;
    }
    if (element.closest && element.closest("#fbcmf, .fb-cmf-toggle")) {
      return false;
    }
    const rect = getVisibleRect(element);
    if (!rect || rect.bottom <= 0 || rect.right <= 0) {
      return false;
    }
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    if (viewportWidth === 0 || viewportHeight === 0) {
      return false;
    }
    if (rect.width < viewportWidth * 0.8 || rect.height < viewportHeight * 0.8) {
      return false;
    }
    const style = window.getComputedStyle(element);
    return style.position === "fixed" && isModalScrimColor(style.backgroundColor);
  }
  function isFacebookPageDimmed() {
    if (!document.body || !hasVisibleDialog()) {
      return false;
    }
    return Array.from(document.body.querySelectorAll("*")).some(isFullViewportDimmer);
  }
  var init_modal_scrim = __esm({
    "src/ui/controls/modal-scrim.ts"() {
      "use strict";
    }
  });

  // src/ui/controls/toggle-button.ts
  function destroyToggleButton(state) {
    if (!state) {
      return;
    }
    if (typeof state.destroyToggleButton === "function") {
      const teardown = state.destroyToggleButton;
      state.destroyToggleButton = null;
      teardown();
      return;
    }
    if (state.btnToggleEl && state.btnToggleEl.parentNode) {
      state.btnToggleEl.parentNode.removeChild(state.btnToggleEl);
    }
    state.btnToggleEl = null;
    state.syncToggleButtonTheme = null;
  }
  function createToggleButton(state, keyWords, onToggle) {
    if (!state || !keyWords || typeof onToggle !== "function") {
      return null;
    }
    if (!document.body) {
      return null;
    }
    destroyToggleButton(state);
    const btnLocation = state.options && state.options.CMF_BTN_OPTION ? state.options.CMF_BTN_OPTION.toString() : "0";
    const useTopRight = btnLocation === "1";
    const btn = document.createElement(useTopRight ? "div" : "button");
    const lifecycle = new UiLifecycle();
    const addCleanup = (cleanup) => {
      lifecycle.add(cleanup);
    };
    btn.innerHTML = state.iconToggleHTML;
    btn.id = "fbcmfToggle";
    btn.removeAttribute("title");
    btn.className = "fb-cmf-toggle fb-cmf-icon";
    btn.setAttribute("aria-label", keyWords.DLG_TITLE);
    if (useTopRight) {
      btn.classList.add("fb-cmf-toggle-topbar");
    }
    const toggleHandler = (event) => {
      if (btn.getAttribute(pageDimmedAtt) === "true") {
        if (event && typeof event.preventDefault === "function") {
          event.preventDefault();
        }
        if (event && typeof event.stopPropagation === "function") {
          event.stopPropagation();
        }
        return;
      }
      onToggle();
    };
    if (useTopRight) {
      btn.setAttribute("role", "button");
      btn.setAttribute("tabindex", "0");
      const onKeyDown = (event) => {
        if (!(event instanceof KeyboardEvent)) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleHandler();
        }
      };
      btn.addEventListener("keydown", onKeyDown);
      addCleanup(() => btn.removeEventListener("keydown", onKeyDown));
    }
    btn.addEventListener("click", toggleHandler, false);
    addCleanup(() => btn.removeEventListener("click", toggleHandler, false));
    const tooltipPlacement = btnLocation === "0" ? "right" : "auto";
    addCleanup(attachTooltip(btn, keyWords.DLG_TITLE, { placement: tooltipPlacement }));
    const positioning = createTopbarPositioning(btn);
    let observedMenuButton = null;
    let updateScheduled = false;
    let pageDimmedUpdateScheduled = false;
    let resizeObserver = null;
    const scheduleUpdate = () => {
      if (!lifecycle.active || updateScheduled) {
        return;
      }
      updateScheduled = true;
      const runUpdate = () => {
        updateScheduled = false;
        positioning.updatePosition();
      };
      lifecycle.frame(runUpdate);
    };
    const getMenuButton = () => getTopbarMenuButton();
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
      positioning.invalidateTheme();
      scheduleUpdate();
    };
    const syncPageDimmedState = () => {
      if (isFacebookPageDimmed()) {
        btn.setAttribute(pageDimmedAtt, "true");
      } else {
        btn.removeAttribute(pageDimmedAtt);
      }
    };
    const schedulePageDimmedStateSync = () => {
      if (!lifecycle.active || pageDimmedUpdateScheduled) {
        return;
      }
      pageDimmedUpdateScheduled = true;
      const runUpdate = () => {
        pageDimmedUpdateScheduled = false;
        if (btn.isConnected) {
          syncPageDimmedState();
        }
      };
      lifecycle.frame(runUpdate);
    };
    if (useTopRight) {
      if (!btn.isConnected) {
        document.body.appendChild(btn);
      }
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          scheduleUpdate();
        });
        addCleanup(() => resizeObserver == null ? void 0 : resizeObserver.disconnect());
      }
      observeMenuButton();
      const banner = document.querySelector('[role="banner"]');
      if (banner && typeof MutationObserver !== "undefined") {
        lifecycle.observe(banner, { childList: true, subtree: true }, () => {
          observeMenuButton();
          scheduleUpdate();
        });
      }
      if (typeof window !== "undefined") {
        window.addEventListener("resize", scheduleUpdate);
        addCleanup(() => window.removeEventListener("resize", scheduleUpdate));
        const intervalId = setInterval(() => {
          if (positioning.needsMenuSync()) {
            scheduleUpdate();
          }
        }, 2e3);
        addCleanup(() => clearInterval(intervalId));
      }
      if (typeof MutationObserver !== "undefined") {
        lifecycle.observe(btn, { attributes: true, attributeFilter: ["data-cmf-open"] }, () => {
          if (btn.getAttribute("data-cmf-open") === "true") {
            btn.style.color = "";
          }
          scheduleUpdate();
        });
      }
    } else {
      document.body.appendChild(btn);
    }
    if (typeof MutationObserver !== "undefined") {
      lifecycle.observe(
        document.body,
        {
          attributes: true,
          attributeFilter: ["aria-hidden", "aria-modal", "class", "hidden", "role", "style"],
          childList: true,
          subtree: true
        },
        () => schedulePageDimmedStateSync()
      );
    }
    syncPageDimmedState();
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
    const syncToggleButtonTheme = () => {
      if (!lifecycle.active) return;
      positioning.invalidateTheme(true);
      scheduleUpdate();
      lifecycle.defer(scheduleUpdate, 250);
    };
    state.destroyToggleButton = () => {
      lifecycle.dispose();
      if (btn.parentNode) {
        btn.parentNode.removeChild(btn);
      }
      if (state.btnToggleEl === btn) {
        state.btnToggleEl = null;
      }
      if (state.syncToggleButtonTheme === syncToggleButtonTheme) {
        state.syncToggleButtonTheme = null;
      }
    };
    state.syncToggleButtonTheme = syncToggleButtonTheme;
    return btn;
  }
  var pageDimmedAtt;
  var init_toggle_button = __esm({
    "src/ui/controls/toggle-button.ts"() {
      "use strict";
      init_lifecycle();
      init_topbar_controls();
      init_tooltip();
      init_toggle_position();
      init_modal_scrim();
      init_modal_scrim();
      pageDimmedAtt = "data-cmf-page-dimmed";
    }
  });

  // src/ui/dialog/value-helpers.ts
  function hasOwnKey(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }
  function readValue(object, key) {
    return hasOwnKey(object, key) ? object[key] : void 0;
  }
  var init_value_helpers = __esm({
    "src/ui/dialog/value-helpers.ts"() {
      "use strict";
    }
  });

  // src/ui/dialog/form-state.ts
  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  function deepEqual(a, b) {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((value, index) => deepEqual(value, b[index]));
    }
    if (isPlainObject(a) && isPlainObject(b)) {
      const keys = Object.keys(a);
      return keys.length === Object.keys(b).length && keys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]));
    }
    return false;
  }
  function collectDialogOptions(state) {
    const dialog = document.getElementById("fbcmf");
    if (!state || !dialog) return null;
    const options = { ...state.options };
    dialog.querySelectorAll('input[type="checkbox"][cbtype="T"]').forEach((input) => {
      if (input.name) options[input.name] = input.checked;
    });
    const blockedFeeds = [
      "NF_BLOCKED_FEED",
      "GF_BLOCKED_FEED",
      "VF_BLOCKED_FEED",
      "MP_BLOCKED_FEED",
      "PP_BLOCKED_FEED"
    ];
    blockedFeeds.forEach((name) => {
      const existing = options[name];
      const values = Array.isArray(existing) ? [...existing] : [];
      dialog.querySelectorAll(`input[type="checkbox"][name="${name}"]`).forEach((input) => {
        values[parseInt(input.value, 10)] = input.checked ? "1" : "0";
      });
      options[name] = values;
    });
    dialog.querySelectorAll('input[type="radio"]:checked, input[type="text"]').forEach((input) => {
      if (input.name) options[input.name] = input.value;
    });
    dialog.querySelectorAll("textarea").forEach((input) => {
      if (!input.name) return;
      options[input.name] = input.value.split("\n").filter((line) => line.trim().length > 0).join(state.SEP);
    });
    dialog.querySelectorAll("select").forEach((select) => {
      if (select.name) options[select.name] = select.value;
    });
    return pruneDialogOptions(options, dialog);
  }
  function pruneDialogOptions(options, dialog) {
    if (!dialog) return options;
    const names = new Set(
      Array.from(
        dialog.querySelectorAll(
          'input:not([type="file"]), textarea, select'
        )
      ).map((input) => input.name).filter((name) => name.length > 0)
    );
    return Object.fromEntries(Object.entries(options).filter(([key]) => names.has(key)));
  }
  var init_form_state = __esm({
    "src/ui/dialog/form-state.ts"() {
      "use strict";
    }
  });

  // src/ui/dialog/action-feedback.ts
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
  var init_action_feedback = __esm({
    "src/ui/dialog/action-feedback.ts"() {
      "use strict";
      init_form_state();
    }
  });

  // src/ui/dialog/topbar.ts
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
    return getTopbarControlButtons().filter(
      (button) => button instanceof HTMLElement
    );
  }
  function isTopbarMenuButton(element) {
    if (!element || typeof element.closest !== "function") {
      return false;
    }
    const control = element.closest('button, [role="button"]');
    return control ? isTopbarControlButton(control) : false;
  }
  function mountToggleButton(state, keyWords) {
    if (!state || !keyWords) {
      return null;
    }
    const button = createToggleButton(state, keyWords, () => toggleDialog(state));
    syncToggleButtonOpenState(state);
    return button;
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
    const lifecycle = state.dialogLifecycle;
    if (!(lifecycle == null ? void 0 : lifecycle.active)) return;
    state.cmfOutsideClickInit = true;
    lifecycle.add(() => {
      delete state.cmfOutsideClickInit;
    });
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
    lifecycle.listen(document, "pointerdown", onOutsideActivate, true);
  }
  function setupTopbarMenuSync(state) {
    if (!state || state.cmfTopbarSyncInit || state.cmfTopbarSyncPending) {
      return;
    }
    const lifecycle = state.dialogLifecycle;
    if (!(lifecycle == null ? void 0 : lifecycle.active)) return;
    const bindButtons = () => {
      const buttons = getTopbarMenuButtons();
      buttons.forEach((button) => {
        if (button.dataset.cmfMenuSync === "1") {
          return;
        }
        button.dataset.cmfMenuSync = "1";
        lifecycle.add(() => {
          delete button.dataset.cmfMenuSync;
        });
        lifecycle.listen(button, "click", () => closeDialogIfOpen(state));
        if (typeof MutationObserver !== "undefined") {
          lifecycle.observe(button, { attributes: true, attributeFilter: ["aria-expanded"] }, () => {
            if (button.getAttribute("aria-expanded") === "true") closeDialogIfOpen(state);
          });
        }
      });
    };
    const banner = document.querySelector('[role="banner"]');
    if (!banner) {
      state.cmfTopbarSyncPending = true;
      lifecycle.defer(() => {
        delete state.cmfTopbarSyncPending;
        setupTopbarMenuSync(state);
      }, 200);
      return;
    }
    state.cmfTopbarSyncInit = true;
    lifecycle.add(() => {
      delete state.cmfTopbarSyncInit;
      delete state.cmfTopbarSyncPending;
    });
    bindButtons();
    if (typeof MutationObserver !== "undefined") {
      lifecycle.observe(
        banner,
        {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["aria-expanded", "aria-label", "role", "tabindex"]
        },
        (mutations) => {
          bindButtons();
          mutations.forEach((mutation) => {
            const target = mutation.target instanceof Element ? mutation.target : null;
            if (target && mutation.type === "attributes" && mutation.attributeName === "aria-expanded" && isTopbarMenuButton(target) && target.getAttribute("aria-expanded") === "true") {
              closeDialogIfOpen(state);
            }
          });
        }
      );
    }
    if (typeof MutationObserver !== "undefined" && document.body) {
      lifecycle.observe(document.body, { childList: true, subtree: true }, (mutations) => {
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
      const closest = target.closest('button, [role="button"]');
      return closest && isTopbarMenuButton(closest) ? closest : null;
    };
    const onTopbarActivate = (event) => {
      const topbarButton = getMenuButtonFromEvent(event);
      if (!topbarButton) {
        return;
      }
      closeDialogIfOpen(state);
    };
    lifecycle.listen(document, "pointerdown", onTopbarActivate, true);
    lifecycle.listen(document, "click", onTopbarActivate, true);
    lifecycle.listen(document, "keydown", (event) => {
      if (!(event instanceof KeyboardEvent) || event.key !== "Enter" && event.key !== " ") {
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
      if (typeof state.syncDialogSearch === "function") {
        state.syncDialogSearch();
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
  var init_topbar = __esm({
    "src/ui/dialog/topbar.ts"() {
      "use strict";
      init_topbar_controls();
      init_toggle_button();
    }
  });

  // src/ui/dialog/update-controls.ts
  function updateDialog(state, values = ((_a) => (_a = state == null ? void 0 : state.options) != null ? _a : {})()) {
    const dialog = document.getElementById("fbcmf");
    const content = dialog == null ? void 0 : dialog.querySelector(".content");
    if (!content || !state) return;
    content.querySelectorAll('input[type="checkbox"][cbtype="T"]').forEach((input) => {
      const value = readValue(values, input.name);
      if (value !== void 0) input.checked = Boolean(value);
    });
    content.querySelectorAll('input[type="checkbox"][cbtype="M"]').forEach((input) => {
      const value = readValue(values, input.name);
      if (Array.isArray(value)) input.checked = value[parseInt(input.value, 10)] === "1";
    });
    content.querySelectorAll('input[type="radio"]').forEach((input) => {
      if (input.value === readValue(values, input.name)) input.checked = true;
    });
    content.querySelectorAll("textarea").forEach((input) => {
      const value = readValue(values, input.name);
      if (typeof value === "string") input.value = value.replaceAll(state.SEP, "\n");
    });
    content.querySelectorAll('input[type="text"]').forEach((input) => {
      const value = readValue(values, input.name);
      if (typeof value === "string") input.value = value;
    });
    content.querySelectorAll("select").forEach((select) => {
      const value = readValue(values, select.name);
      if (value !== void 0)
        Array.from(select.options).forEach((option) => {
          option.selected = option.value === value;
        });
    });
    updateHeaderCloseVisibility(dialog, state);
    syncSaveButtonState(state);
  }
  var init_update_controls = __esm({
    "src/ui/dialog/update-controls.ts"() {
      "use strict";
      init_value_helpers();
      init_action_feedback();
      init_topbar();
    }
  });

  // src/ui/dialog/section-controls.ts
  function createSingleCB(keyWords, options, cbName, cbReadOnly = false) {
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.setAttribute("cbType", "T");
    cb.name = cbName;
    cb.value = cbName;
    cb.checked = Boolean(readValue(options, cbName));
    const label = document.createElement("label");
    if (cbReadOnly) {
      cb.checked = true;
      cb.disabled = true;
      label.setAttribute("disabled", "disabled");
    }
    label.appendChild(cb);
    const labelValue = readValue(keyWords, cbName);
    if (labelValue) {
      label.appendChild(
        document.createTextNode(Array.isArray(labelValue) ? labelValue.join(", ") : labelValue)
      );
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
    var _a;
    const arrElements = [];
    for (let i = 0; i < keyWords[cbName].length; i += 1) {
      const div = document.createElement("div");
      div.classList.add("cmf-row");
      const cbKeyWord = keyWords[cbName][i] || "";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.setAttribute("cbType", "M");
      cb.name = cbName;
      cb.value = String(i);
      cb.checked = ((_a = options[cbName]) == null ? void 0 : _a[i]) === "1";
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
    rb.checked = readValue(options, rbName) === rbValue;
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
    const inputValue = readValue(options, inputName);
    input.value = typeof inputValue === "string" ? inputValue : "";
    const label = document.createElement("label");
    label.appendChild(document.createTextNode(inputLabel));
    label.appendChild(document.createElement("br"));
    label.appendChild(input);
    div.appendChild(label);
    return div;
  }
  function checkInputNumber(event) {
    const el = event.target;
    if (!(el instanceof HTMLInputElement)) return;
    if (!(el instanceof HTMLInputElement)) return;
    if (el.value === "") {
      return;
    }
    const digitsValues = el.value.replace(/\D/g, "");
    el.value = digitsValues.length > 0 ? String(parseInt(digitsValues, 10)) : "";
  }
  function createCheckboxAndInput(keyWords, options, cbName, inputName) {
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.setAttribute("cbType", "T");
    cb.name = cbName;
    cb.value = cbName;
    cb.checked = Boolean(readValue(options, cbName));
    const input = document.createElement("input");
    input.type = "text";
    input.name = inputName;
    const inputValue = readValue(options, inputName);
    input.value = typeof inputValue === "string" ? inputValue : "";
    input.placeholder = "1000";
    input.size = 6;
    input.addEventListener("input", checkInputNumber, false);
    const label = document.createElement("label");
    label.appendChild(cb);
    label.appendChild(document.createTextNode(`${readValue(keyWords, cbName)}: `));
    label.appendChild(input);
    const div = document.createElement("div");
    div.classList.add("cmf-row");
    div.appendChild(label);
    return div;
  }
  function createSelectLanguage(state, keyWords, translations2) {
    const div = document.createElement("div");
    div.classList.add("cmf-row");
    const select = document.createElement("select");
    select.name = "CMF_DIALOG_LANGUAGE";
    Object.entries(translations2).forEach(([languageCode, catalog24]) => {
      const elOption = document.createElement("option");
      elOption.value = languageCode;
      elOption.textContent = catalog24.CMF_DIALOG_LANGUAGE;
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
  var init_section_controls = __esm({
    "src/ui/dialog/section-controls.ts"() {
      "use strict";
      init_value_helpers();
    }
  });

  // src/ui/dialog/section-content.ts
  function getKeyword(keyWords, translations2, key) {
    const value = readValue(keyWords, key);
    if (typeof value === "string" && value.trim() !== "") return value;
    const fallback = readValue(translations2.en, key);
    return typeof fallback === "string" ? fallback : "";
  }
  function appendTextWithLinks(container, template, links) {
    if (!container || !template) {
      return;
    }
    let remaining = template;
    while (remaining.length > 0) {
      let nextToken = null;
      let nextIndex = -1;
      for (const link of links) {
        const idx = remaining.indexOf(link.token);
        if (idx !== -1 && (nextIndex === -1 || idx < nextIndex)) {
          nextIndex = idx;
          nextToken = link;
        }
      }
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
  function createTipsContent(keyWords, translations2) {
    const wrap = document.createElement("div");
    wrap.className = "cmf-tips-content";
    const maintainerText = getKeyword(keyWords, translations2, "DLG_TIPS_MAINTAINER");
    if (maintainerText) {
      const p = document.createElement("p");
      p.textContent = maintainerText;
      wrap.appendChild(p);
    }
    const linkLabels = {
      github: getKeyword(keyWords, translations2, "DLG_TIPS_LINK_REPO"),
      facebook: getKeyword(keyWords, translations2, "DLG_TIPS_LINK_FACEBOOK"),
      site: getKeyword(keyWords, translations2, "DLG_TIPS_LINK_SITE"),
      threads: getKeyword(keyWords, translations2, "DLG_TIPS_LINK_THREADS")
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
      },
      {
        token: "{threads}",
        label: linkLabels.threads || "Bobbin Threads Filter",
        href: "https://github.com/Artificial-Sweetener/bobbin-threads-filter"
      }
    ];
    const starText = getKeyword(keyWords, translations2, "DLG_TIPS_STAR");
    if (starText) {
      const p = document.createElement("p");
      appendTextWithLinks(p, starText, linkMap);
      wrap.appendChild(p);
    }
    const threadsText = getKeyword(keyWords, translations2, "DLG_TIPS_THREADS");
    if (threadsText) {
      const p = document.createElement("p");
      appendTextWithLinks(p, threadsText, linkMap);
      wrap.appendChild(p);
    }
    const facebookText = getKeyword(keyWords, translations2, "DLG_TIPS_FACEBOOK");
    if (facebookText) {
      const p = document.createElement("p");
      appendTextWithLinks(p, facebookText, linkMap);
      wrap.appendChild(p);
    }
    const siteText = getKeyword(keyWords, translations2, "DLG_TIPS_SITE");
    if (siteText) {
      const p = document.createElement("p");
      appendTextWithLinks(p, siteText, linkMap);
      wrap.appendChild(p);
    }
    const creditsText = getKeyword(keyWords, translations2, "DLG_TIPS_CREDITS");
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
    const thanksText = getKeyword(keyWords, translations2, "DLG_TIPS_THANKS");
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
  var init_section_content = __esm({
    "src/ui/dialog/section-content.ts"() {
      "use strict";
      init_value_helpers();
    }
  });

  // src/ui/dialog/sections.ts
  function buildDialogSections({
    state,
    options,
    keyWords,
    translations: translations2
  }) {
    const sections = [];
    const dialogSectionIcons = state.dialogSectionIcons || {};
    const iconFor = (key) => dialogSectionIcons[key] || state.iconLegendHTML;
    let fs = document.createElement("fieldset");
    let l = createLegend(
      state,
      getKeyword(keyWords, translations2, "DLG_NF"),
      getKeyword(keyWords, translations2, "DLG_NF_DESC"),
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
      "NF_META_AI_PROMPTS",
      "NF_AI_INFO_POSTS",
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
    ta.textContent = (options.NF_BLOCKED_TEXT || "").split(state.SEP).join("\n");
    fs.appendChild(ta);
    wrapFieldsetBody(fs);
    sections.push(fs);
    fs = document.createElement("fieldset");
    l = createLegend(
      state,
      getKeyword(keyWords, translations2, "DLG_GF"),
      getKeyword(keyWords, translations2, "DLG_GF_DESC"),
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
    ta.textContent = (options.GF_BLOCKED_TEXT || "").split(state.SEP).join("\n");
    fs.appendChild(ta);
    wrapFieldsetBody(fs);
    sections.push(fs);
    fs = document.createElement("fieldset");
    l = createLegend(
      state,
      getKeyword(keyWords, translations2, "DLG_MP"),
      getKeyword(keyWords, translations2, "DLG_MP_DESC"),
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
    ta.textContent = (options.MP_BLOCKED_TEXT || "").split(state.SEP).join("\n");
    fs.appendChild(ta);
    l = document.createElement("strong");
    l.textContent = "Description: ";
    fs.appendChild(l);
    s = document.createElement("small");
    s.appendChild(document.createTextNode(keyWords.DLG_BLOCK_NEW_LINE));
    fs.appendChild(s);
    ta = document.createElement("textarea");
    ta.name = "MP_BLOCKED_TEXT_DESCRIPTION";
    ta.textContent = (options.MP_BLOCKED_TEXT_DESCRIPTION || "").split(state.SEP).join("\n");
    fs.appendChild(ta);
    wrapFieldsetBody(fs);
    sections.push(fs);
    fs = document.createElement("fieldset");
    l = createLegend(
      state,
      getKeyword(keyWords, translations2, "DLG_VF"),
      getKeyword(keyWords, translations2, "DLG_VF_DESC"),
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
    ta.textContent = (options.VF_BLOCKED_TEXT || "").split(state.SEP).join("\n");
    fs.appendChild(ta);
    wrapFieldsetBody(fs);
    sections.push(fs);
    fs = document.createElement("fieldset");
    l = createLegend(
      state,
      getKeyword(keyWords, translations2, "DLG_PP"),
      getKeyword(keyWords, translations2, "DLG_PP_DESC"),
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
    ta.textContent = (options.PP_BLOCKED_TEXT || "").split(state.SEP).join("\n");
    fs.appendChild(ta);
    wrapFieldsetBody(fs);
    sections.push(fs);
    fs = document.createElement("fieldset");
    l = createLegend(
      state,
      getKeyword(keyWords, translations2, "DLG_OTHER"),
      getKeyword(keyWords, translations2, "DLG_OTHER_DESC"),
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
      getKeyword(keyWords, translations2, "REELS_TITLE"),
      getKeyword(keyWords, translations2, "DLG_REELS_DESC"),
      iconFor("REELS_TITLE")
    );
    fs.appendChild(l);
    fs.appendChild(createSingleCB(keyWords, options, "REELS_CONTROLS", false));
    fs.appendChild(createSingleCB(keyWords, options, "REELS_DISABLE_LOOPING", false));
    wrapFieldsetBody(fs);
    sections.push(fs);
    fs = document.createElement("fieldset");
    l = createLegend(
      state,
      getKeyword(keyWords, translations2, "DLG_PREFERENCES"),
      getKeyword(keyWords, translations2, "DLG_PREFERENCES_DESC"),
      iconFor("DLG_PREFERENCES")
    );
    fs.appendChild(l);
    fs.appendChild(createSelectLanguage(state, keyWords, translations2));
    s = document.createElement("span");
    s.appendChild(document.createTextNode(`${keyWords.CMF_BTN_LOCATION}:`));
    fs.appendChild(s);
    const len = keyWords.CMF_BTN_OPTION.length;
    for (let i = 0; i < len; i += 1) {
      fs.appendChild(
        createRB(options, "CMF_BTN_OPTION", i.toString(), keyWords.CMF_BTN_OPTION[i] || "")
      );
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
      getKeyword(keyWords, translations2, "DLG_REPORT_BUG"),
      getKeyword(keyWords, translations2, "DLG_REPORT_BUG_DESC"),
      iconFor("DLG_REPORT_BUG")
    );
    fs.appendChild(l);
    s = document.createElement("span");
    s.className = "cmf-report-notice";
    s.appendChild(
      document.createTextNode(getKeyword(keyWords, translations2, "DLG_REPORT_BUG_NOTICE"))
    );
    fs.appendChild(s);
    const reportActions = document.createElement("div");
    reportActions.className = "cmf-report-actions";
    const btnGenerate = document.createElement("button");
    btnGenerate.type = "button";
    btnGenerate.id = "BTNReportGenerate";
    btnGenerate.textContent = getKeyword(keyWords, translations2, "DLG_REPORT_BUG_GENERATE");
    reportActions.appendChild(btnGenerate);
    const btnCopy = document.createElement("button");
    btnCopy.type = "button";
    btnCopy.id = "BTNReportCopy";
    btnCopy.textContent = getKeyword(keyWords, translations2, "DLG_REPORT_BUG_COPY");
    reportActions.appendChild(btnCopy);
    const btnOpen = document.createElement("button");
    btnOpen.type = "button";
    btnOpen.id = "BTNReportOpenIssues";
    btnOpen.textContent = getKeyword(keyWords, translations2, "DLG_REPORT_BUG_OPEN_ISSUES");
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
      getKeyword(keyWords, translations2, "DLG_TIPS"),
      getKeyword(keyWords, translations2, "DLG_TIPS_DESC"),
      iconFor("DLG_TIPS")
    );
    fs.appendChild(l);
    fs.appendChild(createTipsContent(keyWords, translations2));
    wrapFieldsetBody(fs);
    sections.push(fs);
    return sections;
  }
  var init_sections = __esm({
    "src/ui/dialog/sections.ts"() {
      "use strict";
      init_section_controls();
      init_section_content();
    }
  });

  // src/ui/dialog/render.ts
  function buildDialog({ state, keyWords }, handlers, languageChanged = false) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!state || !keyWords || !document.body) {
      return null;
    }
    (_a = state.dialogContentLifecycle) == null ? void 0 : _a.dispose();
    const contentLifecycle = new UiLifecycle();
    state.dialogContentLifecycle = contentLifecycle;
    (_b = state.dialogLifecycle) == null ? void 0 : _b.add(() => contentLifecycle.dispose());
    const langEntry = getTranslation(state.language);
    const localizedSearch = langEntry ? readValue(langEntry, "DLG_SEARCH_SETTINGS") : void 0;
    const searchLabel = typeof localizedSearch === "string" && localizedSearch ? localizedSearch : "Search Clean My Feeds";
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
      (_c = state.dialogLifecycle) == null ? void 0 : _c.listen(btn, "click", () => toggleDialog(state), false);
      hdr3.appendChild(btn);
      hdr.appendChild(hdr1);
      hdr.appendChild(hdr22);
      hdr.appendChild(hdr3);
      dlg.appendChild(hdr);
      updateHeaderCloseVisibility(dlg, state);
      cnt = document.createElement("div");
      cnt.classList.add("content");
    } else {
      const existingDialog = document.getElementById("fbcmf");
      if (!existingDialog) return null;
      dlg = existingDialog;
      const hdr22 = dlg.querySelector("header .fb-cmf-title");
      if (!hdr22) return null;
      while (hdr22.firstChild) {
        hdr22.removeChild(hdr22.firstChild);
      }
      hdr22.classList.remove("fb-cmf-lang-1");
      hdr22.classList.remove("fb-cmf-lang-2");
      const existingContent = dlg.querySelector(".content");
      if (!existingContent) return null;
      cnt = existingContent;
      while (cnt.firstChild) {
        cnt.removeChild(cnt.firstChild);
      }
      updateHeaderCloseVisibility(dlg, state);
    }
    dlg.setAttribute("dir", direction);
    const closeButton = dlg.querySelector(".fb-cmf-close button");
    if (closeButton) {
      const closeLabel = keyWords.DLG_BUTTONS[1] || "Close";
      closeButton.setAttribute("aria-label", closeLabel);
      closeButton.title = closeLabel;
    }
    const hdr2 = dlg.querySelector(".fb-cmf-title");
    if (!hdr2) return null;
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
        var _a2;
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
          buttonEl.title = tooltips[def.tooltipIndex] || "";
        }
        if (typeof def.handler === "function") {
          (_a2 = state.dialogLifecycle) == null ? void 0 : _a2.listen(
            buttonEl,
            "click",
            (event) => {
              var _a3;
              const pending = (_a3 = def.handler) == null ? void 0 : _a3.call(def, event);
              if (pending)
                void pending.catch(() => {
                });
            },
            false
          );
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
      const fileInput = fileImport;
      (_d = state.dialogLifecycle) == null ? void 0 : _d.listen(fileInput, "change", handlers.importUserOptions, false);
      const btnImport = document.getElementById("BTNImport");
      if (btnImport)
        (_e = state.dialogLifecycle) == null ? void 0 : _e.listen(
          btnImport,
          "click",
          () => {
            fileInput.click();
          },
          false
        );
    } else {
      const footer = dlg.querySelector("footer");
      if (!footer) return null;
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
      (_f = state.dialogLifecycle) == null ? void 0 : _f.listen(content, "input", () => syncSaveButtonState(state), true);
      (_g = state.dialogLifecycle) == null ? void 0 : _g.listen(content, "change", () => syncSaveButtonState(state), true);
    }
    syncSaveButtonState(state);
    return dlg;
  }
  var init_render = __esm({
    "src/ui/dialog/render.ts"() {
      "use strict";
      init_lifecycle();
      init_i18n();
      init_value_helpers();
      init_attributes();
      init_sections();
      init_topbar();
      init_search3();
      init_action_feedback();
    }
  });

  // src/ui/reporting/report-controls.ts
  function initReportBug(context, capabilities) {
    const dialog = document.getElementById("fbcmf");
    if (!dialog) {
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
    if (btnGenerate.dataset.cmfReportInit === "1") return;
    btnGenerate.dataset.cmfReportInit = "1";
    const lifecycle = state.dialogContentLifecycle || state.dialogLifecycle;
    const setStatus = (key) => {
      if (!keyWords || !keyWords[key]) {
        statusEl.textContent = "";
        return;
      }
      const value = keyWords[key];
      statusEl.textContent = typeof value === "string" ? value : "";
    };
    const ensureReport = () => {
      if (state && typeof state.cmfReportText === "string" && state.cmfReportText.length > 0) {
        return state.cmfReportText;
      }
      const { text } = capabilities.buildReport();
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
    lifecycle == null ? void 0 : lifecycle.listen(btnGenerate, "click", () => {
      if (state) {
        state.cmfReportText = "";
      }
      ensureReport();
    });
    lifecycle == null ? void 0 : lifecycle.listen(btnCopy, "click", async () => {
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
      } catch (e) {
        setStatus("DLG_REPORT_BUG_STATUS_FAILED");
      }
    });
    lifecycle == null ? void 0 : lifecycle.listen(btnOpenIssues, "click", () => {
      const url = capabilities.getSupportUrl();
      if (url) {
        window.open(url, "_blank");
      }
    });
  }
  var init_report_controls = __esm({
    "src/ui/reporting/report-controls.ts"() {
      "use strict";
      init_search3();
    }
  });

  // src/ui/dialog/import-export.ts
  function exportUserOptions(state) {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(
      new Blob([JSON.stringify(state.options)], { type: "text/plain" })
    );
    link.download = "fb - clean my feeds - settings.json";
    link.click();
    link.remove();
    triggerActionFeedback(state, "BTNExport", "cmf-action--confirm-green");
  }
  function importUserOptions(event, save, state, lifecycle) {
    var _a;
    const target = event.target;
    const file = target instanceof HTMLInputElement ? (_a = target.files) == null ? void 0 : _a[0] : void 0;
    if (!file) return;
    const reader = new FileReader();
    lifecycle == null ? void 0 : lifecycle.add(() => {
      reader.onload = null;
      if (reader.readyState === FileReader.LOADING) reader.abort();
    });
    reader.onload = () => {
      if (lifecycle && !lifecycle.active) return;
      try {
        if (typeof reader.result !== "string") return;
        const parsed = JSON.parse(reader.result);
        if (!isPlainObject(parsed)) return;
        const required = ["NF_SPONSORED", "GF_SPONSORED", "VF_SPONSORED", "MP_SPONSORED"];
        if (!required.every((key) => Object.prototype.hasOwnProperty.call(parsed, key))) return;
        void save(parsed).then(() => {
          if (lifecycle && !lifecycle.active) return;
          updateDialog(state);
          triggerActionFeedback(state, "BTNImport", "cmf-action--confirm-green");
        }).catch(() => {
        });
      } catch (e) {
      }
    };
    reader.readAsText(file);
  }
  var init_import_export = __esm({
    "src/ui/dialog/import-export.ts"() {
      "use strict";
      init_update_controls();
      init_action_feedback();
      init_form_state();
    }
  });

  // src/ui/dialog/dialog.ts
  function initDialog(context, capabilities) {
    var _a;
    if (!context || !capabilities) return null;
    const { state } = context;
    (_a = state.destroyDialog) == null ? void 0 : _a.call(state);
    const lifecycle = new UiLifecycle();
    state.dialogLifecycle = lifecycle;
    let ownedDialog = null;
    const destroyDialog = () => {
      if (!lifecycle.active) return;
      lifecycle.dispose();
      ownedDialog == null ? void 0 : ownedDialog.remove();
      if (state.dialogLifecycle === lifecycle) {
        destroyToggleButton(state);
        if (state.saveFeedbackTimeoutId !== null) clearTimeout(state.saveFeedbackTimeoutId);
        state.saveFeedbackTimeoutId = null;
        state.syncDialogSearch = null;
        state.cmfReportText = "";
        delete state.cmfOutsideClickInit;
        delete state.cmfTopbarSyncInit;
        delete state.cmfTopbarSyncPending;
        state.dialogLifecycle = null;
        state.dialogContentLifecycle = null;
        state.destroyDialog = null;
      }
    };
    state.destroyDialog = destroyDialog;
    const save = async (pending, source, hadChanges = false) => {
      if (!lifecycle.active) return;
      const clean = pruneDialogOptions(
        pending != null ? pending : { ...state.options },
        document.getElementById("fbcmf")
      );
      clearRegexErrors(document.getElementById("fbcmf"));
      let result;
      try {
        result = await capabilities.saveOptions(clean, source);
      } catch (error) {
        if (error instanceof InvalidRegexOptionsError) {
          if (lifecycle.active) {
            const newerDraft = source === "dialog" && !deepEqual(collectDialogOptions(state), clean);
            if (!newerDraft)
              showRegexErrors(
                context,
                error.issues,
                source === "file" ? "import" : source === "reset" ? "reset" : "draft"
              );
          }
          if (source === "dialog") return;
        }
        throw error;
      }
      if (!lifecycle.active) return;
      const latestDraft = source === "dialog" ? collectDialogOptions(state) : null;
      const hasNewerEdits = latestDraft !== null && !deepEqual(latestDraft, clean);
      if (result.languageChanged) {
        buildDialog(context, handlers, true);
        initReportBug(context, capabilities);
        if (hasNewerEdits && latestDraft) updateDialog(state, latestDraft);
      }
      if (result.buttonLocationChanged) mountToggleButton(state, context.keyWords);
      updateHeaderCloseVisibility(document.getElementById("fbcmf"), state);
      if (source === "dialog") {
        syncSaveButtonState(state);
        if (hadChanges && !hasNewerEdits)
          triggerActionFeedback(state, "BTNSave", "cmf-action--confirm-blue");
      }
    };
    const handlers = {
      destroyDialog,
      /** Validate dependent controls before passing draft options to the application service. */
      async saveUserOptions(_event, source = "dialog") {
        if (!lifecycle.active) return;
        if (source !== "dialog") return save(null, source);
        const dialog = document.getElementById("fbcmf");
        if (!dialog) return;
        const limit = dialog.querySelector('input[name="NF_LIKES_MAXIMUM"]');
        const count = dialog.querySelector('input[name="NF_LIKES_MAXIMUM_COUNT"]');
        if ((limit == null ? void 0 : limit.checked) && count && count.value.length === 0) {
          alert(`${context.keyWords.NF_LIKES_MAXIMUM}?`);
          count.focus();
          return;
        }
        const pending = collectDialogOptions(state);
        if (pending) await save(pending, source, !deepEqual(pending, state.options));
      },
      /** Download the current live options without persisting an unsubmitted draft. */
      exportUserOptions: () => {
        if (lifecycle.active) exportUserOptions(state);
      },
      /** Route validated imported data through the same save workflow as dialog edits. */
      importUserOptions: (event) => {
        if (lifecycle.active)
          importUserOptions(event, (pending) => save(pending, "file"), state, lifecycle);
      },
      /** Clear stored settings and rehydrate existing supported values with a reset language preference. */
      resetUserOptions: () => {
        if (!lifecycle.active) return;
        void capabilities.resetOptions().then(() => save(null, "reset")).then(() => {
          if (lifecycle.active) updateDialog(state);
        }).catch((error) => {
          if (error instanceof InvalidRegexOptionsError && lifecycle.active)
            showRegexErrors(context, error.issues, "reset");
        });
      }
    };
    const runInit = () => {
      if (!lifecycle.active) return;
      if (!document.body) {
        lifecycle.defer(runInit, 50);
        return;
      }
      mountToggleButton(state, context.keyWords);
      ownedDialog = buildDialog(context, handlers);
      initReportBug(context, capabilities);
      addLegendEvents();
      const dialog = document.getElementById("fbcmf");
      if (dialog && !dialog.dataset.cmfToggleSync) {
        dialog.dataset.cmfToggleSync = "1";
        syncToggleButtonOpenState(state);
        if (typeof MutationObserver !== "undefined") {
          lifecycle.observe(
            dialog,
            { attributes: true, attributeFilter: [state.showAtt] },
            () => syncToggleButtonOpenState(state)
          );
        }
      }
      setupTopbarMenuSync(state);
      setupOutsideClickClose(state);
      if (dialog) {
        lifecycle.listen(dialog, "input", () => clearRegexErrors(dialog));
        lifecycle.listen(dialog, "change", () => clearRegexErrors(dialog));
      }
      showRegexErrors(context, getRegexValidationIssues(state.options), "stored");
    };
    runInit();
    return handlers;
  }
  var init_dialog = __esm({
    "src/ui/dialog/dialog.ts"() {
      "use strict";
      init_regex_validation();
      init_regex_errors();
      init_lifecycle();
      init_toggle_button();
      init_update_controls();
      init_form_state();
      init_action_feedback();
      init_render();
      init_search3();
      init_topbar();
      init_report_controls();
      init_import_export();
      init_topbar();
      init_update_controls();
    }
  });

  // src/ui/icon-html.ts
  function buildIconHTML(markup, extraClassName = "") {
    const classes = ["cmf-icon"];
    if (/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(extraClassName)) classes.push(extraClassName);
    const decorativeSvg = markup.replace("<svg", '<svg aria-hidden="true" focusable="false"');
    return `<span class="${classes.join(" ")}" aria-hidden="true">${decorativeSvg}</span>`;
  }
  var init_icon_html = __esm({
    "src/ui/icon-html.ts"() {
      "use strict";
    }
  });

  // src/res/about.svg
  var about_default;
  var init_about = __esm({
    "src/res/about.svg"() {
      about_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <g fill="currentColor">\n    <path d="M7.8 14.5c4.7-2.1 8.5-5.3 12.8-8 .6-.5 1.1-.5 1.8-.1l9.2 5.2c2.3 1.3 3.5 2.9 4.8 5.2l6.5 12.9c-2.8 1.4-5.6 2.5-9.1 3.2l-.1-4.9c-.1-1.6-1.2-2.4-2.8-2-2.1.4-4.6 2.5-6.8 3.6l-3.9.9 2.2-7.8 2.2-2.6 3.4-2.7-2.1.7-1.7 1.3-.2-4-1 .1-.4 3-1.1-1.3-1.1-4.4-.7-.5c-.8 1.1-.9 2.7-2 4-1.2 1.6-3.2 2.2-5.1 1.8-2.2-.3-4.7-1.1-5.4-2.3-.3-.5-.2-.9.6-1.3Z"/>\n    <path d="M34 34.3c3.6-.7 6.5-1.9 9.8-3.4l1.6 3.5c-3.4 1.5-7.1 2.7-11.5 3.9Z"/>\n    <path d="M10.8 40.1C6.7 41.3 1.8 43.2 2.3 44.6c3.7 3.8 19.3 4.5 34.3 1.2 11.8-2.6 22.9-8.6 22.8-11.2-.3-1.5-4.8-1.8-12.5-1.5l.5 1.6c-5.7 2.3-13.1 4.4-16 4.6l-1.7 1.8-2.4 1.6-1.7 1.5-2.1-1.4-2.4-2.9-1.6 2.5-2.7 2.8-2.3-.1-1.2-1.4-3.4-.7-1.6-.1Z"/>\n    <path d="M11.9 28.4c1.5-.3 5.4 1.2 7.2 2.4l-.7 2-1 .2-3-.1.5 1.1 2.9.6.2 2.1c-2.1 1.4-4.4 2.3-6.2 2.3-.4-2.3-.5-7.5.1-10.6Z"/>\n    <path d="m24.1 31.4 5.7-3.7c1.7-1 2.9-.4 2.9 1.2v8.8c-1.5-.1-4-1.3-6.6-2.8l1.2-1.7 1.9-1.1-.5-.7-2.8 1.2Z"/>\n    <path d="M18.9 38.1c.1 1.3-.7 2.9-2.9 5.8l-1.4-1.4-2.2-.4 2.5-3.2 3.7-1.6Zm5.3-1.4c1.5.5 3.3 1.5 4.6 3.2l-2.1.8-1.2 1.8c-2-1.1-2.6-3.4-2.6-4.8Z"/>\n  </g>\n  <path fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" d="M21.2 33.2c-1-1.7-2.4-1.4-2.5 0-.2 1.7 1.4 3.3 2.5 4 1.3-.7 2.8-2.4 2.6-4-.2-1.5-1.6-1.7-2.6 0Z"/>\n</svg>';
    }
  });

  // src/res/bug.svg
  var bug_default;
  var init_bug = __esm({
    "src/res/bug.svg"() {
      bug_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <g fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">\n    <path d="M28.8 17.1 28 14.8 24.3 11.8M34 17.1l1.2-2.6 3.3-2.7M24.4 25v-3.1c0-2.8 3.3-5.2 7.1-5.2s7.1 2.4 7.1 5.2V25"/>\n    <path d="m22.5 25.8-3 1.6-2.8-2-1.3-2.2m3.7 10.5h-4.3l-2.2 1.9m7.4 3.6-1.8.6-2.7 6.1m25.1-20.1 3 1.6 2.8-2 1.3-2.2m-3.7 10.5h4.3l2.2 1.9m-7.4 3.6 1.8.6 2.7 6.1"/>\n    <path d="M27.7 47.1c-5.3-2.9-8.5-7.1-8.5-12.8 0-6.3 5.6-11.5 12.4-11.5S44 28 44 34.3c0 5.7-3.2 9.9-8.5 12.8"/>\n  </g>\n  <path fill="currentColor" d="M30.7 25.1c-5.4.7-9.1 4.6-9.1 10 0 5.8 3.8 10.2 9.1 11.2Zm2 0v21.2c5.3-1 9.1-5.4 9.1-11.2 0-5.4-3.7-9.3-9.1-10Z"/>\n</svg>';
    }
  });

  // src/res/check.svg
  var check_default;
  var init_check = __esm({
    "src/res/check.svg"() {
      check_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <path fill="currentColor" d="M17.9 36.9c1.2-1.7 2.1-2.1 3.4-.8l6.1 6.1 20.3-21c1.2-1.2 2.7-1.3 4-.1l.7.7c1.1 1.1 1 2.6-.1 3.7L28.9 48.2c-1.3 1.1-2.5 1.1-3.7-.1l-7.1-7.2c-1.1-1.1-1.2-2.6-.2-4Z"/>\n</svg>';
    }
  });

  // src/res/export.svg
  var export_default;
  var init_export = __esm({
    "src/res/export.svg"() {
      export_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <path fill="currentColor" d="m35.5 18.3 12.2-2-1.5 11.2-3.1-4L28.8 35.4c-.6.5-1 .5-1.6-.1l-.4-.4c-.5-.5-.4-1 .2-1.6l13.1-13-4.6-1.6c-.5-.1-.5-.3 0-.4Z"/>\n  <g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">\n    <path d="M21.7 33.5h-2.1L14 40.8v5.7c0 1.4.7 2 2 2h30.9c1.4 0 2.1-.6 2.1-2v-5.7l-4.9-7.3h-2.3"/>\n    <path d="M14 41.9h10.5l1.9 2.3h10.5l2-2.3H49"/>\n  </g>\n</svg>';
    }
  });

  // src/res/groups.svg
  var groups_default;
  var init_groups3 = __esm({
    "src/res/groups.svg"() {
      groups_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <path fill="currentColor" fill-rule="evenodd" d="M11.2 9.6h42.7a3.2 3.2 0 0 1 3.2 3.2v25.6a3.2 3.2 0 0 1-3.2 3.2h-9.1a5 5 0 0 0 1.6-4.1 4.5 4.5 0 0 0-8.7-1.5 6 6 0 0 0-11.7 0 4.5 4.5 0 0 0-8.7 1.5 5 5 0 0 0 1.6 4.1h-7.7A3.2 3.2 0 0 1 8 38.4V12.8a3.2 3.2 0 0 1 3.2-3.2Zm2 4.1v7.4h8.8v-7.4Zm12 1.7v1.4h14.6v-1.4Zm0 3.7v1.3h9.9v-1.3Zm-12 5.3v1.3h37.5v-1.3Zm0 4.3v1.3H39v-1.3Z"/>\n  <path fill="currentColor" d="M18.7 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3.6 1.1a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm5.2 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm-4.3 2.4v-1.1c0-.7.6-1 1.1-1h1.2c.6 0 1.1.3 1.1 1v1.1Zm-2-1.1c0-.6.4-.9 1.1-.9h.5v1.8H14Zm5.8-.9h.5c.7 0 1.1.3 1.1.9v.9h-1.6Z"/>\n  <ellipse cx="21.4" cy="37.9" rx="3.5" ry="3.9" fill="currentColor"/>\n  <ellipse cx="42.3" cy="37.9" rx="3.5" ry="3.9" fill="currentColor"/>\n  <ellipse cx="31.8" cy="37.3" rx="4.9" ry="5.2" fill="currentColor"/>\n  <path fill="currentColor" d="M17.9 43.1h7.2v1.4c-3.1 1.1-4.8 3.1-5.2 5.2-2.6.1-4.8-.2-6.2-.8v-2.3a3.5 3.5 0 0 1 4.2-3.5Zm20.6 0h7.2a3.5 3.5 0 0 1 4.2 3.5v2.3c-1.4.6-3.6.9-6.2.8-.4-2.1-2.1-4.1-5.2-5.2Zm-9.8.8H35c4.3 0 7.1 2.8 7.1 7.1v1.5c-5.1 2.3-15.4 2.3-20.5 0V51c0-4.3 2.8-7.1 7.1-7.1Z"/>\n</svg>';
    }
  });

  // src/res/import.svg
  var import_default;
  var init_import = __esm({
    "src/res/import.svg"() {
      import_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <path fill="currentColor" d="M29.4 22.6c.1-.8.4-.8.8-.2l3.2 4 10.9-9.5c1.1-1 2.1-1 3.1.1l.1.1c1 1.1.8 2.1-.2 3.1L36.8 30.1l4.4 2.3c.6.3.6.6-.2.8l-12.5 1.7Z"/>\n  <g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">\n    <path d="M20.1 33.5h-2.2l-5.2 7.3v5.6c0 1.5.7 2.2 2.2 2.2h33.9c1.5 0 2.2-.7 2.2-2.2v-5.6l-5.2-7.3h-2.2"/>\n    <path d="M12.7 41.9h10.8l2.1 2.5h12.5l2.1-2.5H51"/>\n  </g>\n</svg>';
    }
  });

  // src/res/info.svg
  var info_default;
  var init_info = __esm({
    "src/res/info.svg"() {
      info_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <path fill="none" stroke="currentColor" stroke-width="1" d="M5.8 19v-2.8a2.8 2.8 0 0 1 2.8-2.8h44.8a2.8 2.8 0 0 1 2.8 2.8V19"/>\n  <path fill="currentColor" fill-rule="evenodd" d="M5.6 18.4h50.8V46a2.5 2.5 0 0 1-2.5 2.5H8.1A2.5 2.5 0 0 1 5.6 46Zm10.8.3a6.7 6.7 0 1 0 0 13.4 6.7 6.7 0 0 0 0-13.4Zm9.4 4v1.2h13.8v-1.2Zm0 3.8v1.1h9.3v-1.1Zm-14.7 6.7v1.2h40v-1.2Zm0 3v1.2h30.7v-1.2Zm10 3.8a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm.2 1.1h19.6v2.8H21.3Z"/>\n  <path fill="currentColor" d="M15 24.4h2.3v4.2c0 .7.3.9 1.1 1v.6h-4.5v-.6c.9-.1 1.1-.3 1.1-1v-2.3c0-.7-.2-.9-.9-.9v-.6Z"/>\n  <circle cx="16.1" cy="22.2" r="1" fill="currentColor"/>\n</svg>';
    }
  });

  // src/res/marketplace.svg
  var marketplace_default;
  var init_marketplace3 = __esm({
    "src/res/marketplace.svg"() {
      marketplace_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <path fill="currentColor" fill-rule="evenodd" d="M14.1 12.1h43.4a2.7 2.7 0 0 1 2.7 2.7v26.5a2.7 2.7 0 0 1-2.7 2.7h-2.6l1-6.8H41.6l-.6-1.2c-.3-.7-.8-1-1.6-1h-2.5c-.9 0-1.5.7-1.5 1.5s.6 1.5 1.5 1.5h1.4l1.2 6h-9.1v-5.1c2.4.2 3.9-1.1 3.7-2.7l-3.6-5.9h-1.7v-3.2H11.4V14.8a2.7 2.7 0 0 1 2.7-2.7Zm1.2 3.2v8.5h12.1v-8.5Zm15.3 2v1.4h16.1v-1.4Zm0 3.8v1.3h10.7v-1.3Zm-.9 6.5v1.3H55v-1.3Zm1.5 3.8v1.3h15.2v-1.3Z"/>\n  <path fill="currentColor" d="M23.1 18a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Zm-4.5 1.3a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm6.7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM20 22v-1.1c0-.9.6-1.3 1.3-1.3h1.3c.8 0 1.4.4 1.4 1.3V22Zm-2.9-1.3c0-.7.5-1.1 1.4-1.1h.7v2.2h-2.1Zm7.7-1.1h.7c.9 0 1.4.4 1.4 1.1v1.1h-2.1Z"/>\n  <path fill="currentColor" d="M5.4 28.1h21.3v1.7H5.4Zm-.5 3h3.5l-1.9 5.4c-.5 1.6-4.3 1.7-4.1-.1Zm4.8 0H14l-.8 5.3c-.2 1.9-5.1 1.8-4.8-.1Zm5.6 0h4.3l.6 5.3c.2 1.9-5.4 1.9-5.3 0Zm5.7 0h4.1l2.3 5.2c.8 1.9-4.9 2.1-5.2.3Zm5.6 0h2.6l3.7 5.3c.7 1.3-3.5 1.9-4.2.4Z"/>\n  <path fill="currentColor" fill-rule="evenodd" d="M4 39.1h3v6.6h12.4v-6.6H26v10H4Zm5.1 0h8.2v4.7H9.1Z"/>\n  <path fill="currentColor" d="M27.8 39.1h1.5v10h-1.5Zm-25 11.4h30v1.4h-30Z"/>\n  <g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">\n    <path d="M36.7 36.5h2.9L42.5 48h9.8"/>\n    <path d="M40.2 37.9h14.4l-1.7 7.6H42.1"/>\n  </g>\n  <circle cx="43.3" cy="50.4" r="1" fill="currentColor"/>\n  <circle cx="50.5" cy="50.4" r="1" fill="currentColor"/>\n</svg>';
    }
  });

  // src/res/mop.svg
  var mop_default;
  var init_mop = __esm({
    "src/res/mop.svg"() {
      mop_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <g fill="currentColor">\n    <path d="M46.3 1.1a1.6 1.6 0 0 1 2.9 1.3l-9.6 19-2.8-1.3Z"/>\n    <path d="m35.7 21 4.3 1.9-1.1 3.1-4.7-1.9Z"/>\n    <path d="M33.1 25.6c-2.6 1.2-4.3 4-6.8 6.3-2.2 2.1-4.3 3.1-6.2 3.4 4.8.6 8.7-5.1 12.6-8.1-3 4.5-5.7 8-10.3 9.2 2.2.4 3.5.6 5.2.2 3-1.9 5.1-5.7 6.7-9.4-1 4.2-3.1 7.7-5.2 10.1 1.7.3 3.7.4 5.1-.1 1.1-2.9 1.8-6.2 2.1-9.2.5 3.6-.2 6.7-.7 9.7l2.2-.2c.5-2.8-.1-6-.3-8.7 1 3.1 1.1 6.3 1 8.8l2.1-.2c-.7-3.5-1.7-6.6-2.1-9.9Z"/>\n    <path d="M17.7 53.4c1.8.5 3.8.7 5.7.2 7.3-1.4 13.8-5.5 18.8-10.2l-1.7 15.2c-.3 3.1-4.6 4.4-11.1 4.4-6.3 0-10.6-1.5-11-4.1Z"/>\n    <path d="M15.7 40.3c7.5 2.9 16.7 3.2 23.6.7-3.6 4.4-8 7.1-13.3 8.5-1.8-.9-3.3-2.2-5.3-2.6l-3.6-.7Z"/>\n    <path d="M16.4 47.8c1.9-.2 4.5.3 6.1 1.6l1.1 1.4c-2.9.8-5.4.6-7.2-.5Z"/>\n  </g>\n  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">\n    <path stroke-width="1.25" d="M23.8 30.4c-6.5 1.2-9.5 3.2-8.8 5.3.8 2.5 7.6 4.4 14.7 4.5 7.7 0 13.6-2.3 13.6-4.8 0-1.2-1.1-2.3-2.7-3.2"/>\n    <path stroke-width="1.3" d="M12.5 35.1c-1.3 3.4 6.6 6.7 16.2 6.9 8.6.1 15.9-2.3 15.9-6 0-1.1-.7-2.1-2-2.9"/>\n    <path stroke-width="1.35" d="M13.2 38.1c-.9 3.4-.6 7 1 9.3M15.9 50.9c6.3 3.3 15.6-.1 24-7.9 1.7-1.6 3.1-3.1 3.7-4.6"/>\n    <path stroke-width="1.1" d="M15.1 39.2c-.4 3.1-.1 5.7 1 7.3M24.6 50.8c7.4-2.3 12.9-6.5 15.7-11.5"/>\n  </g>\n</svg>';
    }
  });

  // src/res/news.svg
  var news_default;
  var init_news3 = __esm({
    "src/res/news.svg"() {
      news_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <path fill="currentColor" fill-rule="evenodd" d="M15 11.5h30a2.5 2.5 0 0 1 2.5 2.5v33a2.5 2.5 0 0 1-2.5 2.5H15a2.5 2.5 0 0 1-2.5-2.5V14a2.5 2.5 0 0 1 2.5-2.5Zm2 4v9.5h9v-9.5Zm11.5 2.7v1.3H43v-1.3Zm0 4.5V24H40v-1.3ZM17 29v1.4h26.5V29Zm0 4v1.3h17.4V33Zm0 5.2v1.3h11.2v-1.3Zm14 0v1.3h12.4v-1.3ZM17 42.5v1.3h11.2v-1.3Zm14 0v1.3h9v-1.3Z"/>\n</svg>';
    }
  });

  // src/res/pref.svg
  var pref_default;
  var init_pref = __esm({
    "src/res/pref.svg"() {
      pref_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <path fill="currentColor" fill-rule="evenodd" d="M22.2 14.1h6.7l.8 3.7c1.4.3 2.7.8 3.8 1.5l3.1-2 4.9 4.9-2 3c.6.8 1.1 1.6 1.4 2.4l-3.8 7.6-3.3.4.6 2.1c-2.6 3-5.6 5.2-9.4 6.1-2.6.7-4.4 1.8-5.4 2.8l-1.1-.5-3.1 2-4.8-4.9 2-3c-.7-1.1-1.2-2.4-1.5-3.7l-3.9-.8v-6.8l3.9-.8c.3-1.3.8-2.5 1.5-3.7l-2.1-3.1 4.9-4.9 3 2c1.1-.7 2.4-1.2 3.7-1.5L22.2 14.1ZM25.7 23.1a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4Z"/>\n  <circle cx="25.8" cy="32.3" r="4.3" fill="none" stroke="currentColor" stroke-width="1.1"/>\n  <path fill="currentColor" d="M49.6 11.8a1.6 1.6 0 0 1 2.9 1.4L41.5 36l-2.9-1.4Zm-14 23.9 8.1 3.2-.8 2.3-8.2-3.2Z"/>\n  <path fill="currentColor" d="M33.8 39.1c-2.2 3-5.9 4.8-9.7 6-2.7.8-4.1 2-3.6 3.5 1.1 2.8 6.6 1.7 10.5-1.1 2.5-1.8 4.3-4.5 5.6-7.2-1.2 3.9-4.3 7.8-9.1 9.9 2.3.7 5 .6 7.6-.3 2.2-2.8 3.1-6 3.5-8.6.1 4.2-.9 7.4-2.1 10 1.6.1 2.4-.1 3.7-.4 1.3-2.3 1.2-5.4 1.2-8.7 1.1 3 .9 5.7.7 8.2l1.2.1c.1-2.9-.1-5.4-.7-7.9l-.3-.3Z"/>\n  <path fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" d="M33.6 41.2c-2.8 3.5-6.2 5.2-10.4 6.4M39.2 52.2h3.9M46.2 50.4h5.9M46.4 48.5h1.4"/>\n</svg>';
    }
  });

  // src/res/profile.svg
  var profile_default;
  var init_profile3 = __esm({
    "src/res/profile.svg"() {
      profile_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <path fill="none" stroke="currentColor" stroke-width="1" d="M3.8 22.5v-6.4a3.1 3.1 0 0 1 3.1-3.1h48.4a3.1 3.1 0 0 1 3.1 3.1v6.4"/>\n  <path fill="currentColor" fill-rule="evenodd" d="M3.4 21.9h6.3a7.6 7.6 0 0 1 11.4 0h37.8v23.2a3.2 3.2 0 0 1-3.2 3.2H6.6a3.2 3.2 0 0 1-3.2-3.2Zm12.1-1.8a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm10 4.4v1.3h14.6v-1.3Zm0 4v1.2h10.2v-1.2ZM8.7 35.3v1.3h45.2v-1.3Zm0 4v1.2h34.5v-1.2Zm-1 3.5v.9h47.8v-.9Z"/>\n  <path fill="currentColor" d="M18.3 24.7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM11.1 31.4c0-1.7 1.2-2.5 2.6-2.5H17c1.4 0 2.6.8 2.6 2.5a5.8 5.8 0 0 1-8.5 0Z"/>\n</svg>';
    }
  });

  // src/res/reels.svg
  var reels_default;
  var init_reels2 = __esm({
    "src/res/reels.svg"() {
      reels_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <g fill="currentColor" transform="rotate(-6 31 32)">\n    <path fill-rule="evenodd" d="M18.6 16.4h25.2a3.3 3.3 0 0 1 3.3 3.3v5H14.4v-4.1a4.2 4.2 0 0 1 4.2-4.2Zm.1 1.1a3.1 3.1 0 0 0-3.1 3.1v2.8h3.1l2.8-5.9Zm5.1 0L21 23.4h3.6l2.8-5.9Zm9.1 0-2.8 5.9H34l2.8-5.9Zm9.4 0-2.8 5.9h6.4v-3.6a2.3 2.3 0 0 0-2.3-2.3Z"/>\n    <path fill-rule="evenodd" d="M14.4 26.2h32.7v15.5a4 4 0 0 1-4 4H18.4a4 4 0 0 1-4-4Zm13.3 4.1v7.6c0 .7.5 1 1.1.7l7.3-3.8c.7-.4.7-.9 0-1.3l-7.3-3.8c-.6-.3-1.1 0-1.1.6Zm-9.5 12.4v1.2h2.4v-1.2Zm5.2 0v1.2h2.4v-1.2Zm5.2 0v1.2H31v-1.2Zm5.2 0v1.2h2.4v-1.2Zm5.2 0v1.2h2.4v-1.2Z"/>\n  </g>\n</svg>';
    }
  });

  // src/res/reset.svg
  var reset_default;
  var init_reset2 = __esm({
    "src/res/reset.svg"() {
      reset_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">\n    <path d="M40 21.6a13.4 13.4 0 1 0 4.4 9.9M16.2 41v5.8c0 1.2.6 1.7 1.8 1.7h25.6"/>\n  </g>\n  <path fill="currentColor" d="m35.8 25.8 8.5.6-.9-8.6c-.1-.7-.5-.8-.9-.2l-7 7.3c-.5.5-.5.8.3.9Z"/>\n  <g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">\n    <path d="m37.8 43.7 8.1-7.2c.6-.5 1.1-.5 1.6 0l3.6 3.4c.7.6.7 1.2.1 1.9l-6.7 6.3c-.3.3-.6.4-1 .4h-3.8l-1.8-1.7c-.8-.8-.9-2-.1-3.1Z"/>\n    <path d="m44.4 38 4.9 5.7m-11.8 1.6 6.7 2"/>\n  </g>\n</svg>';
    }
  });

  // src/res/save.svg
  var save_default;
  var init_save = __esm({
    "src/res/save.svg"() {
      save_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <g fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round">\n    <path d="M18.2 17h22.6a3 3 0 0 1 2.1.9l5.1 5.2a3 3 0 0 1 .9 2.1v21.2a2.2 2.2 0 0 1-2.2 2.2H17.5a2.8 2.8 0 0 1-2.8-2.8V20.5a3.5 3.5 0 0 1 3.5-3.5Z"/>\n    <path d="M22 17v9a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-9"/>\n    <path d="M46.7 44v1.2" stroke-linecap="round"/>\n  </g>\n  <path fill="currentColor" d="M34.5 19.2h2v5h-2Z"/>\n  <path fill="currentColor" fill-rule="evenodd" d="M22.1 29.5h18.8a3.1 3.1 0 0 1 3.1 3.1V49H19V32.6a3.1 3.1 0 0 1 3.1-3.1Zm.7 10.5a1.3 1.3 0 0 0-1.3 1.3v3.4a1.3 1.3 0 0 0 1.3 1.3h16.6a1.3 1.3 0 0 0 1.3-1.3v-3.4a1.3 1.3 0 0 0-1.3-1.3Zm.2 1.2h16.2v3.6H23Z"/>\n</svg>';
    }
  });

  // src/res/search.svg
  var search_default;
  var init_search4 = __esm({
    "src/res/search.svg"() {
      search_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <ellipse cx="30.5" cy="26.7" rx="12.7" ry="12.2" fill="none" stroke="currentColor" stroke-width="2.8"/>\n  <path fill="currentColor" d="m42.1 36.8 11.3 10.3c1.2 1.1 1.3 2.4.1 3.5s-2.6 1.1-3.7-.1l-9.2-10.2c-.7-.8-1-1.5-.3-2.2l.8-.9c.4-.5.6-.7 1-.4Z"/>\n</svg>';
    }
  });

  // src/res/videos.svg
  var videos_default;
  var init_videos3 = __esm({
    "src/res/videos.svg"() {
      videos_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" color="#1f2328">\n  \n  <path fill="currentColor" fill-rule="evenodd" d="M5.6 13.7h46a3.6 3.6 0 0 1 3.6 3.6v17.9H38.4a3 3 0 0 0-3 3V40H15.3v3.8h20.1v4H5.6A3.6 3.6 0 0 1 2 44.2V17.3a3.6 3.6 0 0 1 3.6-3.6Zm1.6 4.2v8h10.1v-8Zm13.6 1.6v1.3h14.4v-1.3Zm0 4.6v1.2h11.5v-1.2ZM7.2 30.1v1.4h42.1v-1.4Zm0 4.4v1.2h20.7v-1.2Zm-.1 6v2.9h1.2v-2.9Zm3-1.1v4.8c0 .4.3.6.7.4l3.3-2.2c.4-.2.4-.6 0-.8l-3.3-2.5c-.4-.2-.7-.1-.7.3Z"/>\n  <path fill="currentColor" d="M17.2 41.2h6.1v1.5h-6.1Z"/>\n  <path fill="currentColor" fill-rule="evenodd" d="M39 36.7h15.3a1.6 1.6 0 0 1 1.6 1.6v10.1a1.6 1.6 0 0 1-1.6 1.6H39a1.6 1.6 0 0 1-1.6-1.6V38.3a1.6 1.6 0 0 1 1.6-1.6Zm3.1 3.3v6.7c0 .5.3.7.8.4l6.2-3.3c.5-.2.5-.6 0-.9l-6.2-3.3c-.5-.3-.8-.1-.8.4Z"/>\n  <path fill="currentColor" d="m57.3 40.5 3.2-1.3c.5-.2 1 .1 1 .7v6.6c0 .6-.5.9-1 .7l-3.2-1.3Z"/>\n</svg>';
    }
  });

  // src/assets.ts
  var init_assets = __esm({
    "src/assets.ts"() {
      "use strict";
      init_about();
      init_bug();
      init_check();
      init_export();
      init_groups3();
      init_import();
      init_info();
      init_marketplace3();
      init_mop();
      init_news3();
      init_pref();
      init_profile3();
      init_reels2();
      init_reset2();
      init_save();
      init_search4();
      init_videos3();
    }
  });

  // src/ui/icons.ts
  var ICON_CLOSE, ICON_NEW_WINDOW, ICON_TOGGLE_HTML, ICON_DIALOG_HEADER_HTML, ICON_DIALOG_SEARCH_HTML, ICON_DIALOG_FOOTER_HTML, ICON_LEGEND_HTML, ICON_FOOTER_SAVE_HTML, ICON_FOOTER_CHECK_HTML, ICON_FOOTER_EXPORT_HTML, ICON_FOOTER_IMPORT_HTML, ICON_FOOTER_RESET_HTML, ICON_LEGEND_NEWS_HTML, ICON_LEGEND_GROUPS_HTML, ICON_LEGEND_MARKETPLACE_HTML, ICON_LEGEND_VIDEOS_HTML, ICON_LEGEND_PROFILE_HTML, ICON_LEGEND_OTHER_HTML, ICON_LEGEND_REELS_HTML, ICON_LEGEND_PREFERENCES_HTML, ICON_LEGEND_REPORT_BUG_HTML, ICON_LEGEND_TIPS_HTML;
  var init_icons = __esm({
    "src/ui/icons.ts"() {
      "use strict";
      init_icon_html();
      init_assets();
      ICON_CLOSE = '<svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M15.543 3.043a1 1 0 1 1 1.414 1.414L11.414 10l5.543 5.542a1 1 0 0 1-1.414 1.415L10 11.414l-5.543 5.543a1 1 0 0 1-1.414-1.415L8.586 10 3.043 4.457a1 1 0 1 1 1.414-1.414L10 8.586z"/></svg>';
      ICON_NEW_WINDOW = '<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><title>Open post in a new window</title><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
      ICON_TOGGLE_HTML = buildIconHTML(mop_default, "cmf-icon--toggle");
      ICON_DIALOG_HEADER_HTML = buildIconHTML(mop_default, "cmf-icon--dialog-header");
      ICON_DIALOG_SEARCH_HTML = buildIconHTML(search_default, "cmf-icon--dialog-search");
      ICON_DIALOG_FOOTER_HTML = buildIconHTML(mop_default, "cmf-icon--dialog-footer");
      ICON_LEGEND_HTML = buildIconHTML(mop_default, "cmf-icon--legend");
      ICON_FOOTER_SAVE_HTML = buildIconHTML(save_default, "cmf-icon--footer-save");
      ICON_FOOTER_CHECK_HTML = buildIconHTML(check_default, "cmf-icon--footer-check");
      ICON_FOOTER_EXPORT_HTML = buildIconHTML(export_default, "cmf-icon--footer-export");
      ICON_FOOTER_IMPORT_HTML = buildIconHTML(import_default, "cmf-icon--footer-import");
      ICON_FOOTER_RESET_HTML = buildIconHTML(reset_default, "cmf-icon--footer-reset");
      ICON_LEGEND_NEWS_HTML = buildIconHTML(news_default, "cmf-icon--legend-news");
      ICON_LEGEND_GROUPS_HTML = buildIconHTML(groups_default, "cmf-icon--legend-groups");
      ICON_LEGEND_MARKETPLACE_HTML = buildIconHTML(
        marketplace_default,
        "cmf-icon--legend-marketplace"
      );
      ICON_LEGEND_VIDEOS_HTML = buildIconHTML(videos_default, "cmf-icon--legend-videos");
      ICON_LEGEND_PROFILE_HTML = buildIconHTML(profile_default, "cmf-icon--legend-profile");
      ICON_LEGEND_OTHER_HTML = buildIconHTML(info_default, "cmf-icon--legend-other");
      ICON_LEGEND_REELS_HTML = buildIconHTML(reels_default, "cmf-icon--legend-reels");
      ICON_LEGEND_PREFERENCES_HTML = buildIconHTML(pref_default, "cmf-icon--legend-preferences");
      ICON_LEGEND_REPORT_BUG_HTML = buildIconHTML(bug_default, "cmf-icon--legend-report-bug");
      ICON_LEGEND_TIPS_HTML = buildIconHTML(about_default, "cmf-icon--legend-tips");
    }
  });

  // src/entry/startup.ts
  async function startSession() {
    var _a;
    let stopped = false;
    const state = createState();
    Object.assign(state, {
      iconClose: ICON_CLOSE,
      iconToggleHTML: ICON_TOGGLE_HTML,
      iconDialogHeaderHTML: ICON_DIALOG_HEADER_HTML,
      iconDialogSearchHTML: ICON_DIALOG_SEARCH_HTML,
      iconDialogFooterHTML: ICON_DIALOG_FOOTER_HTML,
      iconFooterSaveHTML: ICON_FOOTER_SAVE_HTML,
      iconFooterCheckHTML: ICON_FOOTER_CHECK_HTML,
      iconLegendHTML: ICON_LEGEND_HTML,
      iconNewWindow: ICON_NEW_WINDOW,
      dialogSectionIcons: {
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
      },
      dialogFooterIcons: {
        BTNSave: ICON_FOOTER_SAVE_HTML,
        BTNExport: ICON_FOOTER_EXPORT_HTML,
        BTNImport: ICON_FOOTER_IMPORT_HTML,
        BTNReset: ICON_FOOTER_RESET_HTML
      }
    });
    state.isChromium = !!((_a = globalThis.unsafeWindow) == null ? void 0 : _a.chrome) && /Chrome|CriOS/.test(navigator.userAgent);
    initializeRuntimeAttributes(state);
    const { options, filters, keyWords } = await loadOptions(state);
    const context = { state, options, filters, keyWords, pathInfo };
    addCSS(state, options, defaults);
    const extraStylesTimer = window.setTimeout(() => addExtraCSS(state, options, defaults), 150);
    const themeObserver = watchDarkMode(state, () => {
      var _a2;
      if (addCSS(state, options, defaults)) addExtraCSS(state, options, defaults);
      (_a2 = state.syncToggleButtonTheme) == null ? void 0 : _a2.call(state);
    });
    setFeedSettings(state, options, true);
    const optionsService = createOptionsService(context, {
      /** Refresh filtered content only after the application service persists its new settings. */
      applyOptions: () => {
        if (stopped) return;
        setFeedSettings(state, context.options, true);
        addCSS(state, context.options, defaults);
        addExtraCSS(state, context.options, defaults);
        if (resetFeedProcessing(state)) processPage(context, "settings-changed");
      }
    });
    const dialog = initDialog(context, {
      ...optionsService,
      /** Collect a fresh privacy-safe report only when the user requests its preview. */
      buildReport: () => buildBugReport(context),
      getSupportUrl
    });
    openCurrentSettings = () => toggleDialog(state);
    registerSettingsMenu(context.keyWords.GM_MENU_SETTINGS);
    const stopLoop = startLoop(state, {
      /** Reclassify the latest URL using the current in-place options model. */
      updateRoute: () => {
        setFeedSettings(state, context.options);
      },
      /** Route scheduler events through the current feed context rather than captured old settings. */
      process: (reason) => processPage(context, reason)
    });
    return () => {
      var _a2;
      if (stopped) return;
      stopped = true;
      stopLoop();
      restoreFeedPresentation(state);
      clearDirtyTracking();
      stopReelsProcessing(state);
      themeObserver == null ? void 0 : themeObserver.disconnect();
      window.clearTimeout(extraStylesTimer);
      dialog.destroyDialog();
      openCurrentSettings = null;
      (_a2 = document.getElementById(state.cssID)) == null ? void 0 : _a2.remove();
      running = null;
    };
  }
  function startUserscript() {
    if (running === null) {
      running = startSession().catch((error) => {
        running = null;
        throw error;
      });
    }
    return running;
  }
  function registerSettingsMenu(caption) {
    const manager = getUserscriptManager();
    if (!(manager == null ? void 0 : manager.registerMenuCommand) || registeredManager === manager) return;
    try {
      manager.registerMenuCommand(caption, () => openCurrentSettings == null ? void 0 : openCurrentSettings());
      registeredManager = manager;
    } catch (e) {
    }
  }
  var running, registeredManager, openCurrentSettings;
  var init_startup = __esm({
    "src/entry/startup.ts"() {
      "use strict";
      init_options_service();
      init_defaults();
      init_feed_rules();
      init_bug_report();
      init_dirty_check();
      init_attributes();
      init_styles();
      init_theme();
      init_reset();
      init_load_options();
      init_loop();
      init_process_page();
      init_routes2();
      init_state3();
      init_userscript_api();
      init_dialog();
      init_icons();
      init_reels();
      running = null;
      openCurrentSettings = null;
    }
  });

  // src/utils/log.ts
  var LOG_PREFIX;
  var init_log = __esm({
    "src/utils/log.ts"() {
      "use strict";
      LOG_PREFIX = "-- fbcmf :: ";
    }
  });

  // src/entry/userscript.ts
  var require_userscript = __commonJS({
    "src/entry/userscript.ts"() {
      init_startup();
      init_log();
      void startUserscript().catch(() => console.warn(`${LOG_PREFIX}Startup could not complete.`));
    }
  });
  require_userscript();
})();
/*! Third-party license: idb-keyval, Copyright 2016, Jake Archibald
Apache License

Version 2.0, January 2004

http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.

"License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.

"Licensor" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.

"Legal Entity" shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, "control" means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity.

"You" (or "Your") shall mean an individual or Legal Entity exercising permissions granted by this License.

"Source" form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files.

"Object" form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types.

"Work" shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below).

"Derivative Works" shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof.

"Contribution" shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, "submitted" means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as "Not a Contribution."

"Contributor" shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work.

2. Grant of Copyright License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

3. Grant of Patent License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed.

4. Redistribution. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:

You must give any other recipients of the Work or Derivative Works a copy of this License; and

You must cause any modified files to carry prominent notices stating that You changed the files; and

You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and

If the Work includes a "NOTICE" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License. You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License.

5. Submission of Contributions. Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions.

6. Trademarks. This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file.

7. Disclaimer of Warranty. Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

8. Limitation of Liability. In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages.

9. Accepting Warranty or Additional Liability. While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability.

END OF TERMS AND CONDITIONS
*/
