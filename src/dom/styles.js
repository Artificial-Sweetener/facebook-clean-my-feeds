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
      (options.VERBOSITY_MESSAGE_COLOUR === ""
        ? ""
        : ` color: ${options.VERBOSITY_MESSAGE_COLOUR}; `) +
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
      (options.VERBOSITY_MESSAGE_COLOUR === ""
        ? ""
        : `  color: ${options.VERBOSITY_MESSAGE_COLOUR}; `) +
      `background-color:${
        options.VERBOSITY_MESSAGE_BG_COLOUR === ""
          ? defaults.VERBOSITY_MESSAGE_BG_COLOUR
          : options.VERBOSITY_MESSAGE_BG_COLOUR
      }; `
  );

  addToSS(state, `[${state.cssHideNumberOfShares}]`, "display:none !important;");

  const tColour = "var(--primary-text)";
  addToSS(
    state,
    ".fb-cmf ",
    "position:fixed; top:56px; bottom:16px; left:16px; display:flex; flex-direction:column; width: 608px; max-width:608px; padding:0.75rem; z-index:5;" +
      "box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1); overflow:hidden;" +
      "border:none; border-radius:12px; opacity:0; visibility:hidden; color:" +
      tColour +
      ";"
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
    "display:inline-block; width:20px; height:20px; background-color: currentColor;" +
      "mask-image: var(--cmf-icon-url); mask-repeat:no-repeat; mask-position:center; mask-size:contain;" +
      "-webkit-mask-image: var(--cmf-icon-url); -webkit-mask-repeat:no-repeat; -webkit-mask-position:center; -webkit-mask-size:contain;"
  );
  addToSS(
    state,
    ".fb-cmf-tooltip",
    "position:fixed; z-index:9999; pointer-events:none;" +
      "background-color: var(--tooltip-background, rgba(255, 255, 255, 0.8));" +
      "color: var(--primary-text, rgb(28, 30, 33));" +
      "border-radius:12px; padding:12px; font-size:12px; font-weight:400; line-height:16.08px;" +
      "box-shadow: rgba(0, 0, 0, 0.5) 0 2px 4px; max-width:334px; white-space:normal;"
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
    "font-size:24px; font-weight:700; line-height:28px; text-align:left;" +
      'font-family:"Segoe UI Historic","Segoe UI",Helvetica,Arial,sans-serif;'
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
    "padding: 0.5rem 0.75rem; border: none;" +
      "border-radius: 8px; color: var(--primary-text); position: relative; overflow: hidden;" +
      "margin: 0; display:flex; align-items:center; gap:0.75rem; width:100%; box-sizing:border-box;"
  );
  addToSS(state, ".fb-cmf fieldset legend.cmf-legend", "cursor:pointer;");
  addToSS(
    state,
    ".fb-cmf fieldset legend .cmf-legend-icon",
    "width:36px; height:36px; border-radius:50%; background-color: var(--secondary-button-background);" +
      "display:flex; align-items:center; justify-content:center; color: var(--primary-icon); flex-shrink:0;"
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
    "position:relative; overflow:hidden; border:none; border-radius:8px;" +
      "background-color: var(--secondary-button-background); color: var(--primary-text);" +
      "height:36px; padding:0 0.75rem; font-weight:600; cursor:pointer;"
  );
  addToSS(
    state,
    ".fb-cmf .cmf-report-actions button::after",
    'content:""; position:absolute; inset:0; border-radius:inherit; background-color: var(--hover-overlay);' +
      "opacity:0; pointer-events:none; transition: opacity 0.1s cubic-bezier(0, 0, 1, 1);"
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
    "display:none; width:100%; max-width:100%; box-sizing:border-box; min-height:6rem; margin-top:0.5rem; padding:0.5rem;" +
      "border-radius:8px; border:1px solid var(--divider);" +
      "background-color: var(--comment-background); color: var(--primary-text);" +
      'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;' +
      "font-size:0.75rem; line-height:1.3; resize:vertical;"
  );
  addToSS(state, ".fb-cmf .cmf-report-output.cmf-report-output--visible", "display:block;");
  addToSS(
    state,
    ".fb-cmf fieldset legend::after",
    'content:""; position:absolute; inset:0; border-radius:inherit; background-color: var(--hover-overlay);' +
      "opacity:0; pointer-events:none; transition: opacity 0.1s cubic-bezier(0, 0, 1, 1);"
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
    "max-height: var(--cmf-section-height, 0px); overflow:hidden; opacity:0; transform: translateY(-4px);" +
      "transition: max-height 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 140ms ease-out, transform 160ms ease-out;" +
      "will-change: max-height, opacity, transform;"
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
    "display:flex; align-items:center; gap:0.4rem; min-height:32px; padding:0.15rem 0.5rem; margin:0;" +
      "color: var(--primary-text); font-weight: normal; width:100%; max-width:100%; box-sizing:border-box;" +
      "border-radius:8px; position:relative; overflow:hidden;"
  );
  addToSS(state, ".fb-cmf fieldset label *", "color: inherit;");
  addToSS(state, ".fb-cmf fieldset label input", "margin: 0; vertical-align:middle;");
  addToSS(
    state,
    '.fb-cmf fieldset input[type="text"]',
    "border: 1px solid var(--divider); border-radius: 8px; padding: 0.35rem 0.5rem;" +
      "background-color: var(--comment-background); color: var(--primary-text);"
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
    "display:flex; align-items:center; gap:0.5rem; padding:0.35rem 0.5rem; margin:0 0 0.5rem 0;" +
      "border-radius:999px; background-color: var(--comment-background);"
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
    "border: 1px solid var(--divider); margin: 0 0.5rem 0 0.5rem; vertical-align:baseline;" +
      "border-radius: 8px; padding: 0.35rem 0.5rem;" +
      "background-color: var(--comment-background); color: var(--primary-text);"
  );
  addToSS(
    state,
    '.__fb-dark-mode .fb-cmf fieldset textarea,.__fb-dark-mode .fb-cmf fieldset input[type="text"],.__fb-dark-mode .fb-cmf fieldset select',
    "background-color:var(--comment-background); color:var(--primary-text);"
  );
  addToSS(
    state,
    ".fb-cmf footer",
    "display:flex; flex-direction:column; gap:0.5rem; padding:0.75rem; text-align:center; background-color: var(--card-background);" +
      "border-radius:12px;"
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

  state.tempStyleSheetCode +=
    "@keyframes cmf-legend-rock {" +
    "0% { transform: rotate(0deg); }" +
    "35% { transform: rotate(-8deg); }" +
    "70% { transform: rotate(6deg); }" +
    "100% { transform: rotate(0deg); }" +
    "}\n" +
    "@media (prefers-reduced-motion: reduce) {" +
    ".fb-cmf .cmf-section-body { transition: none; transform: none; }" +
    ".fb-cmf fieldset legend .cmf-legend-icon.cmf-legend-rock { animation: none; }" +
    "}\n";

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
    styles +=
      "background: var(--secondary-button-background-floating); padding: 0.5rem; width: 3rem; height: 3rem; border: 0; border-radius: 1.5rem;";
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
      'content: ""; position: absolute; inset: 0; border-radius: inherit;' +
        "background-color: rgba(255, 255, 255, 0.1); opacity: 0; pointer-events: none;"
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
      "border:none; outline:none; position: relative; overflow: hidden;" +
        "color: var(--cmf-icon-color, var(--secondary-icon));" +
        "background-color: var(--cmf-btn-bg, var(--secondary-button-background-floating));" +
        "transition: background-color 100ms cubic-bezier(0, 0, 1, 1), color 100ms cubic-bezier(0, 0, 1, 1);"
    );
    addToSS(
      state,
      ".fb-cmf-toggle.fb-cmf-toggle-topbar::after",
      'content: ""; position: absolute; inset: 0; border-radius: inherit;' +
        "background-color: var(--cmf-btn-hover, var(--hover-overlay)); opacity: 0; pointer-events: none;" +
        "transition: none;"
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
    "font-family: inherit; cursor: pointer;" +
      "height: 48px; padding: 0 0.5rem;" +
      "border: none; border-radius: 8px;" +
      "background-color: transparent;" +
      "display:flex; align-items:center; gap:0.5rem; justify-content:flex-start;" +
      "font-size: .9375rem; font-weight: 600;" +
      "color: var(--primary-text); position:relative; overflow:hidden;"
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
    'content:""; position:absolute; inset:0; border-radius:inherit;' +
      "background-color: var(--hover-overlay); opacity:0; pointer-events:none;" +
      "transition: opacity 0.1s cubic-bezier(0, 0, 1, 1);"
  );
  addToSS(state, "#fbcmf footer > button:hover::after", "opacity:1;");
  addToSS(
    state,
    ".fb-cmf footer .cmf-action-icon",
    "width:36px; height:36px; border-radius:50%; background-color: var(--secondary-button-background);" +
      "display:flex; align-items:center; justify-content:center; color: var(--primary-icon); flex-shrink:0;"
  );
  addToSS(
    state,
    ".fb-cmf footer .cmf-action-icon svg",
    "width:20px; height:20px; fill: currentColor;"
  );
  addToSS(state, ".fb-cmf footer .cmf-action-icon .cmf-icon", "width:32px; height:32px;");

  if (state.tempStyleSheetCode.length > 0) {
    state.tempStyleSheetCode +=
      "@keyframes cmf-pulse-blue {" +
      "0% { color: #1877f2; }" +
      "50% { color: #66a3ff; }" +
      "100% { color: #1877f2; }" +
      "}\n" +
      "@keyframes cmf-pulse-green {" +
      "0% { color: #2e7d32; }" +
      "50% { color: #66bb6a; }" +
      "100% { color: #2e7d32; }" +
      "}\n";
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
