// SPDX-License-Identifier: GPL-3.0-only
import { buildIconHTML } from "./icon-html";
import {
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
} from "../assets";

export const ICON_CLOSE =
  '<svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M15.543 3.043a1 1 0 1 1 1.414 1.414L11.414 10l5.543 5.542a1 1 0 0 1-1.414 1.415L10 11.414l-5.543 5.543a1 1 0 0 1-1.414-1.415L8.586 10 3.043 4.457a1 1 0 1 1 1.414-1.414L10 8.586z"/></svg>';
export const ICON_NEW_WINDOW =
  '<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><title>Open post in a new window</title><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
export const ICON_TOGGLE_HTML = buildIconHTML(mopIcon, "cmf-icon--toggle");
export const ICON_DIALOG_HEADER_HTML = buildIconHTML(mopIcon, "cmf-icon--dialog-header");
export const ICON_DIALOG_SEARCH_HTML = buildIconHTML(searchIcon, "cmf-icon--dialog-search");
export const ICON_DIALOG_FOOTER_HTML = buildIconHTML(mopIcon, "cmf-icon--dialog-footer");
export const ICON_LEGEND_HTML = buildIconHTML(mopIcon, "cmf-icon--legend");
export const ICON_FOOTER_SAVE_HTML = buildIconHTML(saveIcon, "cmf-icon--footer-save");
export const ICON_FOOTER_CHECK_HTML = buildIconHTML(checkIcon, "cmf-icon--footer-check");
export const ICON_FOOTER_EXPORT_HTML = buildIconHTML(exportIcon, "cmf-icon--footer-export");
export const ICON_FOOTER_IMPORT_HTML = buildIconHTML(importIcon, "cmf-icon--footer-import");
export const ICON_FOOTER_RESET_HTML = buildIconHTML(resetIcon, "cmf-icon--footer-reset");
export const ICON_LEGEND_NEWS_HTML = buildIconHTML(newsIcon, "cmf-icon--legend-news");
export const ICON_LEGEND_GROUPS_HTML = buildIconHTML(groupsIcon, "cmf-icon--legend-groups");
export const ICON_LEGEND_MARKETPLACE_HTML = buildIconHTML(
  marketplaceIcon,
  "cmf-icon--legend-marketplace"
);
export const ICON_LEGEND_VIDEOS_HTML = buildIconHTML(videosIcon, "cmf-icon--legend-videos");
export const ICON_LEGEND_PROFILE_HTML = buildIconHTML(profileIcon, "cmf-icon--legend-profile");
export const ICON_LEGEND_OTHER_HTML = buildIconHTML(infoIcon, "cmf-icon--legend-other");
export const ICON_LEGEND_REELS_HTML = buildIconHTML(reelsIcon, "cmf-icon--legend-reels");
export const ICON_LEGEND_PREFERENCES_HTML = buildIconHTML(prefIcon, "cmf-icon--legend-preferences");
export const ICON_LEGEND_REPORT_BUG_HTML = buildIconHTML(bugIcon, "cmf-icon--legend-report-bug");
export const ICON_LEGEND_TIPS_HTML = buildIconHTML(aboutIcon, "cmf-icon--legend-tips");
