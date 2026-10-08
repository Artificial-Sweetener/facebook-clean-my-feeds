// SPDX-License-Identifier: GPL-3.0-only

/** Complete English-baseline catalog; tuple slots preserve the UI's label ordering. */
export interface Keywords {
  LANGUAGE_DIRECTION: "ltr" | "rtl";
  SPONSORED: string;
  NF_TABLIST_STORIES_REELS_ROOMS: string;
  NF_STORIES: string;
  NF_TOP_CARDS_PAGES: string;
  NF_HIDE_VERIFIED_BADGE: string;
  NF_FILTER_VERIFIED_BADGE: string;
  NF_AI_SIDE_PANELS: string;
  NF_SURVEY: string;
  NF_PEOPLE_YOU_MAY_KNOW: string;
  NF_PAID_PARTNERSHIP: string;
  NF_SPONSORED_PAID: string;
  NF_SUGGESTIONS: string;
  NF_FOLLOW: string;
  NF_PARTICIPATE: string;
  NF_REELS_SHORT_VIDEOS: string;
  NF_SHORT_REEL_VIDEO: string;
  NF_META_AI: string;
  NF_META_AI_PROMPTS: string;
  NF_AI_INFO_POSTS: string;
  NF_EVENTS_YOU_MAY_LIKE: string;
  NF_ANIMATED_GIFS_POSTS: string;
  NF_ANIMATED_GIFS_PAUSE: string;
  NF_SHARES: string;
  NF_LIKES_MAXIMUM: string;
  GF_PAID_PARTNERSHIP: string;
  GF_SUGGESTIONS: string;
  GF_SHORT_REEL_VIDEO: string;
  GF_ANIMATED_GIFS_POSTS: string;
  GF_ANIMATED_GIFS_PAUSE: string;
  GF_SHARES: string;
  VF_LIVE: string;
  VF_INSTAGRAM: string;
  VF_DUPLICATE_VIDEOS: string;
  VF_ANIMATED_GIFS_PAUSE: string;
  PP_ANIMATED_GIFS_POSTS: string;
  PP_ANIMATED_GIFS_PAUSE: string;
  NF_BLOCKED_FEED: [string, string, string];
  GF_BLOCKED_FEED: [string, string, string];
  VF_BLOCKED_FEED: [string, string, string];
  MP_BLOCKED_FEED: [string];
  PP_BLOCKED_FEED: [string] | "";
  OTHER_INFO_BOX_CORONAVIRUS: string;
  OTHER_INFO_BOX_CLIMATE_SCIENCE: string;
  OTHER_INFO_BOX_SUBSCRIBE: string;
  REELS_TITLE: string;
  DLG_REELS_DESC: string;
  REELS_CONTROLS: string;
  REELS_DISABLE_LOOPING: string;
  DLG_TITLE: string;
  DLG_NF: string;
  DLG_NF_DESC: string;
  DLG_GF: string;
  DLG_GF_DESC: string;
  DLG_VF: string;
  DLG_VF_DESC: string;
  DLG_MP: string;
  DLG_MP_DESC: string;
  DLG_PP: string;
  DLG_PP_DESC: string;
  DLG_OTHER: string;
  DLG_OTHER_DESC: string;
  DLG_BLOCK_TEXT_FILTER_TITLE: string;
  DLG_BLOCK_NEW_LINE: string;
  DLG_REGEX_ERROR: string;
  DLG_REGEX_IMPORT_ERROR: string;
  DLG_REGEX_SAVED_ERROR: string;
  NF_BLOCKED_ENABLED: string;
  GF_BLOCKED_ENABLED: string;
  VF_BLOCKED_ENABLED: string;
  MP_BLOCKED_ENABLED: string;
  PP_BLOCKED_ENABLED: string;
  NF_BLOCKED_RE: string;
  GF_BLOCKED_RE: string;
  VF_BLOCKED_RE: string;
  MP_BLOCKED_RE: string;
  PP_BLOCKED_RE: string;
  DLG_VERBOSITY: string;
  DLG_PREFERENCES: string;
  DLG_PREFERENCES_DESC: string;
  DLG_REPORT_BUG: string;
  DLG_REPORT_BUG_DESC: string;
  DLG_REPORT_BUG_NOTICE: string;
  DLG_REPORT_BUG_GENERATE: string;
  DLG_REPORT_BUG_COPY: string;
  DLG_REPORT_BUG_OPEN_ISSUES: string;
  DLG_REPORT_BUG_STATUS_READY: string;
  DLG_REPORT_BUG_STATUS_COPIED: string;
  DLG_REPORT_BUG_STATUS_FAILED: string;
  DLG_VERBOSITY_CAPTION: string;
  VERBOSITY_MESSAGE: [string, string, string, string];
  VERBOSITY_MESSAGE_COLOUR: string;
  VERBOSITY_MESSAGE_BG_COLOUR: string;
  VERBOSITY_DEBUG: string;
  CMF_CUSTOMISATIONS: string;
  CMF_BTN_LOCATION: string;
  CMF_BTN_OPTION: [string, string, string];
  CMF_DIALOG_LANGUAGE_LABEL: string;
  CMF_DIALOG_LANGUAGE: string;
  CMF_DIALOG_LANGUAGE_DEFAULT: string;
  GM_MENU_SETTINGS: string;
  CMF_DIALOG_LOCATION: string;
  CMF_DIALOG_OPTION: [string, string];
  CMF_BORDER_COLOUR: string;
  DLG_TIPS: string;
  DLG_TIPS_DESC: string;
  DLG_TIPS_CONTENT: string;
  DLG_TIPS_STAR: string;
  DLG_TIPS_THREADS: string;
  DLG_TIPS_FACEBOOK: string;
  DLG_TIPS_SITE: string;
  DLG_TIPS_CREDITS: string;
  DLG_TIPS_MAINTAINER: string;
  DLG_TIPS_LINK_REPO: string;
  DLG_TIPS_LINK_FACEBOOK: string;
  DLG_TIPS_LINK_SITE: string;
  DLG_TIPS_LINK_THREADS: string;
  DLG_TIPS_THANKS: string;
  DLG_BUTTONS: [string, string, string, string, string];
  DLG_BUTTON_TOOLTIPS: [string, string, string, string];
  DLG_FB_COLOUR_HINT: string;
  /** Additional German sponsored label retained from the original catalog. */
  SPONSORED_EXTRA?: string;
  /** Legacy localized prefix, intentionally absent from some catalogs. */
  DLG_TIPS_MAINTAINER_PREFIX?: string;
}

/** Catalog keys include the two historical locale-only entries. */
export type TranslationKey = keyof Keywords;
/** Codes Facebook may choose from the shipped catalog registry. */
export type LocaleCode =
  | "en"
  | "ar"
  | "bg"
  | "cs"
  | "de"
  | "el"
  | "es"
  | "fi"
  | "fr"
  | "he"
  | "id"
  | "it"
  | "ja"
  | "lv"
  | "nl"
  | "pl"
  | "pt"
  | "ru"
  | "tr"
  | "uk"
  | "vi"
  | "zh-Hans"
  | "zh-Hant";
/** A complete registry is required so supported languages cannot disappear silently. */
export type TranslationRegistry = Record<LocaleCode, Keywords>;
