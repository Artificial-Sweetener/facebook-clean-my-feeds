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
  const fallback =
    translations && translations.en && typeof translations.en[key] === "string"
      ? translations.en[key]
      : "";
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
    site: getKeyword(keyWords, translations, "DLG_TIPS_LINK_SITE"),
  };
  const linkMap = [
    {
      token: "{github}",
      label: linkLabels.github || "GitHub",
      href: "https://github.com/Artificial-Sweetener/facebook-clean-my-feeds",
    },
    {
      token: "{facebook}",
      label: linkLabels.facebook || "Facebook",
      href: "https://www.facebook.com/artificialsweetenerai",
    },
    {
      token: "{site}",
      label: linkLabels.site || "website",
      href: "https://artificialsweetener.ai",
    },
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
        href: "https://github.com/zbluebugz",
      },
      {
        token: "{trinhquocviet}",
        label: "trinhquocviet",
        href: "https://github.com/trinhquocviet",
      },
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
  buildDialogSections,
};
