const { generateRandomString } = require("../utils/random");

const { postAtt, postAttTab } = require("./attributes");

function ensureStyleTag(id, doc = document) {
  if (!doc || typeof doc.getElementById !== "function") {
    return null;
  }

  let styleTag = doc.getElementById(id);
  if (!styleTag) {
    styleTag = doc.createElement("style");
    styleTag.setAttribute("type", "text/css");
    styleTag.setAttribute("id", id);
    if (doc.head) {
      doc.head.appendChild(styleTag);
    }
  }

  return styleTag;
}

function addToSS(state, classes, styles) {
  const listOfClasses = classes
    .split(",")
    .filter((entry) => entry.trim())
    .map((entry) => entry.trim());
  let styleLines = styles.split(";").filter((entry) => entry.trim());
  styleLines = styleLines.map((entry) => {
    const temp = entry.split(":");
    return `    ${temp[0].trim()}:${temp[1].trim()}`;
  });

  let temp = `${listOfClasses.join(",\n")} {\n`;
  temp += `${styleLines.join(";\n")};\n`;
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
    "display:block !important; height: auto !important; min-height: auto !important; max-height: 10000px; overflow: auto; margin-bottom:1rem !important; opacity: 1 !important; pointer-events: auto !important;" +
      `border:3px dotted ${options.CMF_BORDER_COLOUR} !important; border-radius:8px; padding:0.2rem 0.1rem 0.1rem 0.1rem;`
  );

  addToSS(
    state,
    `details[${postAtt}] > summary`,
    "cursor: pointer; list-style: none; position: relative; margin:1.5rem auto; padding:0.5rem 1rem; border-radius:0.55rem; width:85%; font-style:italic;" +
      (options.VERBOSITY_MESSAGE_COLOUR === "" ? "" : ` color: ${options.VERBOSITY_MESSAGE_COLOUR}; `) +
      `background-color:${
        options.VERBOSITY_MESSAGE_BG_COLOUR === ""
          ? defaults.VERBOSITY_MESSAGE_BG_COLOUR
          : options.VERBOSITY_MESSAGE_BG_COLOUR
      };`
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
    "border-radius: 0.55rem 0.55rem 0 0; width:75%; margin:0 auto; padding: 0.45rem 0.25rem; font-style:italic; text-align:center; font-weight:normal;" +
      (options.VERBOSITY_MESSAGE_COLOUR === "" ? "" : `  color: ${options.VERBOSITY_MESSAGE_COLOUR}; `) +
      `background-color:${
        options.VERBOSITY_MESSAGE_BG_COLOUR === ""
          ? defaults.VERBOSITY_MESSAGE_BG_COLOUR
          : options.VERBOSITY_MESSAGE_BG_COLOUR
      }; `
  );

  addToSS(state, `[${state.cssHideNumberOfShares}]`, "display:none !important;");

  const userBorderColour = options.CMF_BORDER_COLOUR || "";
  const defaultBorderColour = defaults.CMF_BORDER_COLOUR || "";
  const dialogBorderColour =
    userBorderColour && userBorderColour !== defaultBorderColour ? userBorderColour : "var(--divider)";
  const tColour = "var(--primary-text)";
  addToSS(
    state,
    ".fb-cmf ",
    "position:fixed; top:0.15rem; bottom:0.15rem; display:flex; flex-direction:column; width: 100%; max-width:30rem; padding:0 1rem; z-index:5;" +
      "box-shadow: 0 12px 28px 0 var(--shadow-2), 0 2px 4px 0 var(--shadow-1), inset 0 0 0 1px var(--shadow-inset);" +
      `border:1px solid ${dialogBorderColour}; border-radius:0.5rem; opacity:0; visibility:hidden; color:${tColour};`
  );
  addToSS(state, ".fb-cmf", "background-color: var(--card-background);");

  addToSS(state, ".fb-cmf header", "display:flex; justify-content:space-between; direction:ltr;");
  addToSS(
    state,
    ".fb-cmf header .fb-cmf-icon",
    "flex-grow:0; align-self:auto; width:75px; text-align:left; order:1;"
  );
  addToSS(state, ".fb-cmf header .fb-cmf-icon svg", "width:64px; height:64px; margin:2px 0;");
  addToSS(state, ".fb-cmf header .fb-cmf-title", "flex-grow:2; align-self:auto; order:2;");
  addToSS(
    state,
    ".fb-cmf header .fb-cmf-title .script-version",
    "font-size: 0.75rem; font-weight: normal;"
  );
  addToSS(state, ".fb-cmf header .fb-cmf-lang-1", "padding-top:1.25rem;");
  addToSS(state, ".fb-cmf header .fb-cmf-lang-2", "padding-top:0.75rem;");
  addToSS(
    state,
    ".fb-cmf header .fb-cmf-title > div",
    "font-size:1.35rem; font-weight: 700; text-align:center;"
  );
  addToSS(
    state,
    ".fb-cmf header .fb-cmf-title > small",
    "display:block; font-size:0.8rem; text-align:center;"
  );
  addToSS(
    state,
    ".fb-cmf header .fb-cmf-close",
    "flex-grow:0; align-self:auto; width:75px; text-align:right; padding: 1.5rem 0 0 0; order:3;"
  );
  addToSS(
    state,
    ".fb-cmf header .fb-cmf-close button",
    "width: 2.25rem; height: 2.25rem; transition-property: color, fill, stroke; transition-timing-function: var(--fds-soft); transition-duration: var(--fds-fast); cursor: pointer; background-color: transparent; border-radius: 50%; border: none; color: var(--secondary-icon);"
  );
  addToSS(state, ".fb-cmf header .fb-cmf-close button:hover", "background-color: var(--hover-overlay);");

  addToSS(
    state,
    ".fb-cmf div.content",
    `flex:1; overflow: hidden auto; border:1px solid ${dialogBorderColour}; border-radius:0.5rem; color: var(--primary-text);`
  );
  addToSS(state, ".fb-cmf fieldset", "margin:0.5rem; padding:0.5rem; border-style: solid;");
  addToSS(state, ".fb-cmf fieldset *", "font-size: 0.8125rem;");
  addToSS(
    state,
    ".fb-cmf fieldset legend",
    "font-size: 0.95rem; width: 95%;  padding: 0 0.5rem 0.125rem 0.5rem; line-height: 2.5; border-width: 2px; border-style: solid; border-radius: 0.5rem 0.5rem 0 0 ;"
  );
  addToSS(
    state,
    ".fb-cmf fieldset legend:hover,.fb-cmf fieldset label:hover",
    "background-color: var(--hover-overlay); cursor: pointer;"
  );
  addToSS(
    state,
    ".fb-cmf fieldset.cmf-visible,.fb-cmf fieldset.cmf-visible legend ",
    `border-color: ${dialogBorderColour};`
  );
  addToSS(
    state,
    ".fb-cmf fieldset.cmf-hidden,.fb-cmf fieldset.cmf-hidden legend ",
    "border-color: LightGrey;"
  );
  addToSS(state, ".fb-cmf fieldset.cmf-hidden *:not(legend) ", "display: none;");
  addToSS(state, ".fb-cmf fieldset.cmf-visible legend::after", 'content: "\\2212"; float:right;');
  addToSS(state, ".fb-cmf fieldset.cmf-hidden legend::after", 'content: "\\002B"; float:right;');
  addToSS(
    state,
    ".fb-cmf fieldset label",
    "display:inline-block; padding:0.125rem 0; color: var(--primary-text); font-weight: normal; width:100%;"
  );
  addToSS(
    state,
    ".fb-cmf fieldset label input",
    "margin: 0 0.5rem 0 0.5rem; vertical-align:baseline;"
  );
  addToSS(state, ".fb-cmf fieldset label[disabled]", "color:darkgrey;");
  addToSS(state, ".fb-cmf fieldset textarea", "width:100%; height:12rem;");
  addToSS(
    state,
    ".fb-cmf fieldset select",
    "border: 2px inset lightgray; margin: 0 0.5rem 0 0.5rem; vertical-align:baseline;"
  );
  addToSS(
    state,
    ".__fb-dark-mode .fb-cmf fieldset textarea,.__fb-dark-mode .fb-cmf fieldset input[type=\"input\"].__fb-dark-mode .fb-cmf fieldset select",
    "background-color:var(--comment-background); color:var(--primary-text);"
  );
  addToSS(
    state,
    ".fb-cmf footer",
    "display: grid; justify-content: space-evenly; padding:1rem 0.25rem; text-align:center;"
  );
  addToSS(state, ".fb-cmf .buttons button", "margin-left: 0.25rem; margin-right: 0.25rem;");
  addToSS(state, ".fb-cmf .fileInput", "display:none;");
  addToSS(
    state,
    ".fb-cmf .fileResults",
    "grid-column-start: 1; grid-column-end: 6; font-style:italic; margin-top: 1rem;"
  );
  addToSS(
    state,
    `.fb-cmf[${state.showAtt}]`,
    "opacity:1; transform:scale(1); visibility:visible;"
  );
  addToSS(state, `.${state.iconNewWindowClass}`, "width: 1rem; height: 1rem;");
  addToSS(state, `.${state.iconNewWindowClass} a`, "width: 1rem; position: relative; display: inline-block;");
  addToSS(
    state,
    `.${state.iconNewWindowClass} svg`,
    "position: absolute; top: -13.5px; stroke: rgb(101, 103, 107);"
  );

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
    styles = "position: fixed; bottom: 1rem; left: 1rem; display:none; z-index: 999;";
    styles +=
      "background: var(--secondary-button-background-floating); padding: 0.5rem; width: 3rem; height: 3rem; border: 0; border-radius: 1.5rem;";
    styles += "box-shadow: 0 2px 4px var(--shadow-1), 0 12px 28px var(--shadow-2);";
  }
  if (styles.length > 0) {
    addToSS(state, ".fb-cmf-toggle", styles);
    addToSS(state, ".fb-cmf-toggle svg", "height: 95%; aspect-ratio : 1 / 1;");
    addToSS(state, ".fb-cmf-toggle:hover", "cursor:pointer;");
    addToSS(state, `.fb-cmf-toggle[${state.showAtt}]`, "display:flex; align-items:center; justify-content:center;");
    addToSS(
      state,
      ".fb-cmf-toggle.fb-cmf-toggle-topbar",
      "border:none; outline:none; position: relative; overflow: hidden;" +
        "color: var(--cmf-icon-color, var(--secondary-icon));" +
        "background-color: var(--cmf-btn-bg, var(--secondary-button-background-floating));" +
        "transition: none;"
    );
    addToSS(
      state,
      ".fb-cmf-toggle.fb-cmf-toggle-topbar::after",
      "content: \"\"; position: absolute; inset: 0; border-radius: inherit;" +
        "background-color: var(--cmf-btn-hover, var(--hover-overlay)); opacity: 0; pointer-events: none;" +
        "transition: none;"
    );
    addToSS(state, ".fb-cmf-toggle.fb-cmf-toggle-topbar:hover::after", "opacity: 1;");
    addToSS(
      state,
      ".fb-cmf-toggle.fb-cmf-toggle-topbar:active::after",
      "background-color: var(--cmf-btn-press, var(--press-overlay)); opacity: 1;"
    );
    addToSS(
      state,
      ".fb-cmf-toggle.fb-cmf-toggle-topbar:active",
      "color: var(--accent);"
    );
    addToSS(
      state,
      ".fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-open=\"true\"]",
      "color: var(--cmf-active-icon, var(--accent)); background-color: var(--cmf-active-bg, var(--primary-button-background));"
    );
  }

  if (cmfDlgLocation === "1") {
    styles = "right:0.35rem; margin-left:1rem; transform:scale(0);transform-origin:top right;";
  } else {
    styles = "left:4.25rem; margin-right:1rem; transform:scale(0);transform-origin:center center;";
  }
  addToSS(
    state,
    ".fb-cmf",
    styles + "transition:transform .45s ease, opacity .25s ease, visibility 1s ease;"
  );
  addToSS(
    state,
    "div#fbcmf footer > button",
    "font-family: inherit; cursor: pointer;" +
      "height: var(--button-height-medium); padding: 0 var(--button-padding-horizontal-medium);" +
      "border: none; border-radius: var(--button-corner-radius);" +
      "background-color: var(--secondary-button-background);" +
      "-webkit-transition: background-color 0.2s linear; transition: background-color 0.2s linear;" +
      "font-size: .9375rem; font-weight: 600;" +
      "color: var(--secondary-button-text);"
  );
  addToSS(
    state,
    "#fbcmf footer > button:hover",
    "font-family: inherit;" +
      "background-color: var(--primary-button-background);" +
      "color: var(--primary-button-text);"
  );

  if (state.tempStyleSheetCode.length > 0) {
    styleTag.appendChild(document.createTextNode(state.tempStyleSheetCode));
    state.tempStyleSheetCode = "";
  }

  return styleTag;
}

module.exports = {
  addCSS,
  addExtraCSS,
  addToSS,
  ensureStyleTag,
};
