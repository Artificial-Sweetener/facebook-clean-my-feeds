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
  const fallback = translations && translations.en && typeof translations.en[key] === "string"
    ? translations.en[key]
    : "";
  return fallback;
}

function createLegend(state, title, subtitle) {
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
  iconWrap.innerHTML = state.logoHTML;

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

function buildDialogSections({ state, options, keyWords, translations }) {
  const sections = [];

  let fs = document.createElement("fieldset");
  let l = createLegend(
    state,
    getKeyword(keyWords, translations, "DLG_NF"),
    getKeyword(keyWords, translations, "DLG_NF_DESC")
  );
  fs.appendChild(l);
  fs.appendChild(createSingleCB(keyWords, options, "NF_SPONSORED", false));
  Object.keys(keyWords).forEach((key) => {
    if (key.startsWith("NF_") && !key.startsWith("NF_BLOCK")) {
      if (key.startsWith("NF_LIKES")) {
        if (key === "NF_LIKES_MAXIMUM") {
          fs.appendChild(createCheckboxAndInput(keyWords, options, key, "NF_LIKES_MAXIMUM_COUNT"));
        }
      } else {
        fs.appendChild(createSingleCB(keyWords, options, key));
      }
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
  sections.push(fs);

  fs = document.createElement("fieldset");
  l = createLegend(
    state,
    getKeyword(keyWords, translations, "DLG_GF"),
    getKeyword(keyWords, translations, "DLG_GF_DESC")
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
  sections.push(fs);

  fs = document.createElement("fieldset");
  l = createLegend(
    state,
    getKeyword(keyWords, translations, "DLG_MP"),
    getKeyword(keyWords, translations, "DLG_MP_DESC")
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
  sections.push(fs);

  fs = document.createElement("fieldset");
  l = createLegend(
    state,
    getKeyword(keyWords, translations, "DLG_VF"),
    getKeyword(keyWords, translations, "DLG_VF_DESC")
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
  sections.push(fs);

  fs = document.createElement("fieldset");
  l = createLegend(
    state,
    getKeyword(keyWords, translations, "DLG_PP"),
    getKeyword(keyWords, translations, "DLG_PP_DESC")
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
  sections.push(fs);

  fs = document.createElement("fieldset");
  l = createLegend(
    state,
    getKeyword(keyWords, translations, "DLG_OTHER"),
    getKeyword(keyWords, translations, "DLG_OTHER_DESC")
  );
  fs.appendChild(l);
  Object.keys(keyWords).forEach((key) => {
    if (key.startsWith("OTHER_INFO")) {
      fs.appendChild(createSingleCB(keyWords, options, key));
    }
  });
  sections.push(fs);

  fs = document.createElement("fieldset");
  l = createLegend(
    state,
    getKeyword(keyWords, translations, "REELS_TITLE"),
    getKeyword(keyWords, translations, "DLG_REELS_DESC")
  );
  fs.appendChild(l);
  fs.appendChild(createSingleCB(keyWords, options, "REELS_CONTROLS"), false);
  fs.appendChild(createSingleCB(keyWords, options, "REELS_DISABLE_LOOPING"), false);
  sections.push(fs);

  fs = document.createElement("fieldset");
  l = createLegend(
    state,
    getKeyword(keyWords, translations, "DLG_PREFERENCES"),
    getKeyword(keyWords, translations, "DLG_PREFERENCES_DESC")
  );
  fs.appendChild(l);
  s = document.createElement("span");
  s.appendChild(document.createTextNode(`${keyWords.DLG_VERBOSITY_CAPTION}:`));
  fs.appendChild(s);
  fs.appendChild(createRB(options, "VERBOSITY_LEVEL", "0", `${keyWords.VERBOSITY_MESSAGE[0]}`));
  fs.appendChild(createRB(options, "VERBOSITY_LEVEL", "1", `${keyWords.VERBOSITY_MESSAGE[1]}______`));
  fs.appendChild(createRB(options, "VERBOSITY_LEVEL", "2", `${keyWords.VERBOSITY_MESSAGE[3]}`));
  fs.appendChild(createInput(options, "VERBOSITY_MESSAGE_COLOUR", `${keyWords.VERBOSITY_MESSAGE_COLOUR}:`));
  fs.appendChild(
    createInput(options, "VERBOSITY_MESSAGE_BG_COLOUR", `${keyWords.VERBOSITY_MESSAGE_BG_COLOUR}:`)
  );
  fs.appendChild(createSingleCB(keyWords, options, "VERBOSITY_DEBUG"));
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
  fs.appendChild(createSelectLanguage(state, keyWords, translations));
  sections.push(fs);

  fs = document.createElement("fieldset");
  l = createLegend(
    state,
    getKeyword(keyWords, translations, "DLG_TIPS"),
    getKeyword(keyWords, translations, "DLG_TIPS_DESC")
  );
  fs.appendChild(l);
  s = document.createElement("span");
  s.appendChild(document.createTextNode(keyWords.DLG_TIPS_CONTENT));
  fs.appendChild(s);
  sections.push(fs);

  return sections;
}

module.exports = {
  buildDialogSections,
};
