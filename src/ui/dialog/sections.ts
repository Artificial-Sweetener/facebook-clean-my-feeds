// SPDX-License-Identifier: GPL-3.0-only

import type { SectionContext } from "./types";
import {
  createSingleCB,
  createMultipleCBs,
  createRB,
  createInput,
  createCheckboxAndInput,
  createSelectLanguage,
} from "./section-controls";
import { createLegend, getKeyword, wrapFieldsetBody, createTipsContent } from "./section-content";

/**
 * Build all settings sections in their established order, retaining persisted names, feed scopes, and locale copy.
 * @param context Resolved state, preferences, and catalogs used for every settings section.
 * @returns The ordered settings fieldsets, ready to append to the dialog content.
 */
export function buildDialogSections({
  state,
  options,
  keyWords,
  translations,
}: SectionContext): HTMLFieldSetElement[] {
  const sections = [];
  const dialogSectionIcons = state.dialogSectionIcons || {};
  /**
   * Resolve a section-specific icon with the common legend glyph as a fallback.
   * @param key Catalog key requested for a string-valued label.
   * @param context Resolved state, preferences, and catalogs used for every settings section.
   * @returns The ordered settings fieldsets, ready to append to the dialog content.
   */
  const iconFor = (key: string) => dialogSectionIcons[key] || state.iconLegendHTML;

  let fs = document.createElement("fieldset");
  let l: HTMLElement = createLegend(
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
    "NF_META_AI_PROMPTS",
    "NF_AI_INFO_POSTS",
    "NF_AI_SIDE_PANELS",
    "NF_HIDE_VERIFIED_BADGE",
    "NF_FILTER_VERIFIED_BADGE",
    "NF_ANIMATED_GIFS_POSTS",
    "NF_ANIMATED_GIFS_PAUSE",
    "NF_SHARES",
    "NF_LIKES_MAXIMUM",
  ];
  const newsFeedKeys = Object.keys(keyWords).filter(
    (key) => key.startsWith("NF_") && !key.startsWith("NF_BLOCK")
  );
  const orderedNewsFeedKeys = [
    ...newsFeedOrder.filter((key) => newsFeedKeys.includes(key)),
    ...newsFeedKeys.filter((key) => !newsFeedOrder.includes(key) && key !== "NF_SPONSORED"),
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
  let s: HTMLElement = document.createElement("small");
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
  ta.textContent = (options.GF_BLOCKED_TEXT || "").split(state.SEP).join("\n");
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
  ta.textContent = (options.VF_BLOCKED_TEXT || "").split(state.SEP).join("\n");
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
  ta.textContent = (options.PP_BLOCKED_TEXT || "").split(state.SEP).join("\n");
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
  fs.appendChild(createSingleCB(keyWords, options, "REELS_CONTROLS", false));
  fs.appendChild(createSingleCB(keyWords, options, "REELS_DISABLE_LOOPING", false));
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
