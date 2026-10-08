// SPDX-License-Identifier: GPL-3.0-only

/** Known options remain optional until hydration, matching the initial empty runtime state. */
export interface Options {
  SPONSORED?: boolean;
  NF_TABLIST_STORIES_REELS_ROOMS?: boolean;
  NF_STORIES?: boolean;
  NF_SURVEY?: boolean;
  NF_PEOPLE_YOU_MAY_KNOW?: boolean;
  NF_PAID_PARTNERSHIP?: boolean;
  NF_SPONSORED_PAID?: boolean;
  NF_SUGGESTIONS?: boolean;
  NF_FOLLOW?: boolean;
  NF_PARTICIPATE?: boolean;
  NF_REELS_SHORT_VIDEOS?: boolean;
  NF_SHORT_REEL_VIDEO?: boolean;
  NF_META_AI?: boolean;
  NF_META_AI_PROMPTS?: boolean;
  NF_AI_INFO_POSTS?: boolean;
  NF_EVENTS_YOU_MAY_LIKE?: boolean;
  NF_ANIMATED_GIFS_POSTS?: boolean;
  NF_ANIMATED_GIFS_PAUSE?: boolean;
  NF_SHARES?: boolean;
  NF_LIKES_MAXIMUM?: boolean;
  NF_TOP_CARDS_PAGES?: boolean;
  NF_HIDE_VERIFIED_BADGE?: boolean;
  NF_FILTER_VERIFIED_BADGE?: boolean;
  NF_AI_SIDE_PANELS?: boolean;
  GF_PAID_PARTNERSHIP?: boolean;
  GF_SUGGESTIONS?: boolean;
  GF_SHORT_REEL_VIDEO?: boolean;
  GF_ANIMATED_GIFS_POSTS?: boolean;
  GF_ANIMATED_GIFS_PAUSE?: boolean;
  GF_SHARES?: boolean;
  VF_LIVE?: boolean;
  VF_INSTAGRAM?: boolean;
  VF_DUPLICATE_VIDEOS?: boolean;
  VF_ANIMATED_GIFS_PAUSE?: boolean;
  PP_ANIMATED_GIFS_POSTS?: boolean;
  PP_ANIMATED_GIFS_PAUSE?: boolean;
  NF_BLOCKED_FEED?: string[];
  GF_BLOCKED_FEED?: string[];
  VF_BLOCKED_FEED?: string[];
  MP_BLOCKED_FEED?: string[];
  PP_BLOCKED_FEED?: string[];
  OTHER_INFO_BOX_CORONAVIRUS?: boolean;
  OTHER_INFO_BOX_CLIMATE_SCIENCE?: boolean;
  OTHER_INFO_BOX_SUBSCRIBE?: boolean;
  REELS_CONTROLS?: boolean;
  REELS_DISABLE_LOOPING?: boolean;
  NF_BLOCKED_ENABLED?: boolean;
  GF_BLOCKED_ENABLED?: boolean;
  VF_BLOCKED_ENABLED?: boolean;
  MP_BLOCKED_ENABLED?: boolean;
  PP_BLOCKED_ENABLED?: boolean;
  NF_BLOCKED_RE?: boolean;
  GF_BLOCKED_RE?: boolean;
  VF_BLOCKED_RE?: boolean;
  MP_BLOCKED_RE?: boolean;
  PP_BLOCKED_RE?: boolean;
  DLG_VERBOSITY?: string;
  VERBOSITY_DEBUG?: boolean;
  VERBOSITY_MESSAGE_BG_COLOUR?: string;
  CMF_BTN_OPTION?: string;
  CMF_DIALOG_OPTION?: string;
  CMF_BORDER_COLOUR?: string;
  NF_SPONSORED?: boolean;
  GF_SPONSORED?: boolean;
  VF_SPONSORED?: boolean;
  MP_SPONSORED?: boolean;
  VERBOSITY_LEVEL?: string;
  VERBOSITY_MESSAGE_COLOUR?: string;
  CMF_DIALOG_LANGUAGE?: string;
  NF_LIKES_MAXIMUM_COUNT?: string;
  NF_BLOCKED_TEXT?: string;
  GF_BLOCKED_TEXT?: string;
  VF_BLOCKED_TEXT?: string;
  MP_BLOCKED_TEXT?: string;
  MP_BLOCKED_TEXT_DESCRIPTION?: string;
  PP_BLOCKED_TEXT?: string;
}

/** Primitive legacy radio/language values are normalized before entering the resolved options model. */
export type StoredScalar = string | number | boolean | null | undefined;

/** Persisted values can carry unknown legacy keys; known fields keep their precise contracts. */
export type StoredOptions = Omit<
  Options,
  | "VERBOSITY_LEVEL"
  | "CMF_BTN_OPTION"
  | "CMF_DIALOG_OPTION"
  | "VERBOSITY_DEBUG"
  | "VERBOSITY_MESSAGE_BG_COLOUR"
  | "CMF_DIALOG_LANGUAGE"
> & {
  /** Historical empty-string sentinel is normalized to the debug default during hydration. */
  VERBOSITY_DEBUG?: boolean | "" | undefined;
  VERBOSITY_MESSAGE_BG_COLOUR?: string | undefined;
  VERBOSITY_LEVEL?: StoredScalar;
  CMF_BTN_OPTION?: StoredScalar;
  CMF_DIALOG_OPTION?: StoredScalar;
  CMF_DIALOG_LANGUAGE?: StoredScalar;
  [key: string]: unknown;
};

/** Keys actually populated by the historical hydration routine, excluding unused defaults. */
export type HydratedOptionKey =
  | "NF_TABLIST_STORIES_REELS_ROOMS"
  | "NF_STORIES"
  | "NF_SURVEY"
  | "NF_PEOPLE_YOU_MAY_KNOW"
  | "NF_PAID_PARTNERSHIP"
  | "NF_SPONSORED_PAID"
  | "NF_SUGGESTIONS"
  | "NF_FOLLOW"
  | "NF_PARTICIPATE"
  | "NF_REELS_SHORT_VIDEOS"
  | "NF_SHORT_REEL_VIDEO"
  | "NF_META_AI"
  | "NF_META_AI_PROMPTS"
  | "NF_AI_INFO_POSTS"
  | "NF_EVENTS_YOU_MAY_LIKE"
  | "NF_ANIMATED_GIFS_POSTS"
  | "NF_ANIMATED_GIFS_PAUSE"
  | "NF_SHARES"
  | "NF_LIKES_MAXIMUM"
  | "NF_TOP_CARDS_PAGES"
  | "NF_HIDE_VERIFIED_BADGE"
  | "NF_FILTER_VERIFIED_BADGE"
  | "NF_AI_SIDE_PANELS"
  | "GF_PAID_PARTNERSHIP"
  | "GF_SUGGESTIONS"
  | "GF_SHORT_REEL_VIDEO"
  | "GF_ANIMATED_GIFS_POSTS"
  | "GF_ANIMATED_GIFS_PAUSE"
  | "GF_SHARES"
  | "VF_LIVE"
  | "VF_INSTAGRAM"
  | "VF_DUPLICATE_VIDEOS"
  | "VF_ANIMATED_GIFS_PAUSE"
  | "PP_ANIMATED_GIFS_POSTS"
  | "PP_ANIMATED_GIFS_PAUSE"
  | "NF_BLOCKED_FEED"
  | "GF_BLOCKED_FEED"
  | "VF_BLOCKED_FEED"
  | "MP_BLOCKED_FEED"
  | "PP_BLOCKED_FEED"
  | "OTHER_INFO_BOX_CORONAVIRUS"
  | "OTHER_INFO_BOX_CLIMATE_SCIENCE"
  | "OTHER_INFO_BOX_SUBSCRIBE"
  | "NF_BLOCKED_ENABLED"
  | "GF_BLOCKED_ENABLED"
  | "VF_BLOCKED_ENABLED"
  | "MP_BLOCKED_ENABLED"
  | "PP_BLOCKED_ENABLED"
  | "VERBOSITY_DEBUG"
  | "VERBOSITY_MESSAGE_BG_COLOUR"
  | "CMF_BTN_OPTION"
  | "CMF_DIALOG_OPTION"
  | "CMF_BORDER_COLOUR"
  | "NF_SPONSORED"
  | "GF_SPONSORED"
  | "VF_SPONSORED"
  | "MP_SPONSORED"
  | "VERBOSITY_LEVEL"
  | "VERBOSITY_MESSAGE_COLOUR"
  | "CMF_DIALOG_LANGUAGE"
  | "NF_LIKES_MAXIMUM_COUNT"
  | "NF_BLOCKED_TEXT"
  | "GF_BLOCKED_TEXT"
  | "VF_BLOCKED_TEXT"
  | "MP_BLOCKED_TEXT"
  | "MP_BLOCKED_TEXT_DESCRIPTION"
  | "PP_BLOCKED_TEXT";

/** Guaranteed fields after defaults; optional flags deliberately retain their old absence semantics. */
export type HydratedOptions = Options & Required<Pick<Options, HydratedOptionKey>>;

/** Mutable known-key names accepted by settings controls. */
export type OptionKey = keyof Options;
