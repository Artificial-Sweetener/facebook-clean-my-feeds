const { hydrateOptions } = require("../../core/options/hydrate");
const {
  mainColumnAtt,
  postAtt,
  postAttCPID,
  postAttChildFlag,
  postAttTab,
} = require("../../dom/attributes");
const { toggleHiddenElements } = require("../../dom/hide");
const { addCSS, addExtraCSS } = require("../../dom/styles");
const { deleteOptions, setOptions } = require("../../storage/idb");
const { createToggleButton } = require("../controls/toggle-button");
const { buildDictionaries } = require("../i18n/dictionaries");
const { defaults, translations } = require("../i18n/translations");
const { buildBugReport, getSupportUrl } = require("../reporting/bug-report");

const { buildDialogSections } = require("./sections");

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
    "PP_BLOCKED_FEED",
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
    const defaultIcon =
      buttonId === "BTNSave"
        ? state.iconFooterSaveHTML || footerIcons.BTNSave || state.iconDialogFooterHTML
        : footerIcons[buttonId] || state.iconDialogFooterHTML;
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
  const btnLocation =
    state && state.options && state.options.CMF_BTN_OPTION
      ? state.options.CMF_BTN_OPTION.toString()
      : "0";
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
    const isTopbarMenu =
      normalized === "menu" ||
      normalized === "messenger" ||
      normalized === "messages" ||
      normalized.startsWith("notifications") ||
      normalized === "your profile" ||
      normalized === "account";
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
  const isTopbarMenu =
    normalized === "menu" ||
    normalized === "messenger" ||
    normalized === "messages" ||
    normalized.startsWith("notifications") ||
    normalized === "your profile" ||
    normalized === "account";
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
        if (
          target &&
          mutation.type === "attributes" &&
          mutation.attributeName === "aria-expanded" &&
          isTopbarMenuButton(target) &&
          target.getAttribute("aria-expanded") === "true"
        ) {
          closeDialogIfOpen(state);
        }
      });
    });
    observer.observe(banner, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-expanded", "aria-label", "role", "tabindex"],
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
          const dialog = node.matches('[role="dialog"][aria-label]')
            ? node
            : node.querySelector
              ? node.querySelector('[role="dialog"][aria-label]')
              : null;
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
      fieldset.classList.add("cmf-hidden");
      fieldset.classList.remove("cmf-visible");
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
      fieldset.classList.toggle("cmf-hidden");
      fieldset.classList.toggle("cmf-visible");
    });
  }
}

function applySearchFilter(dialog, query) {
  if (!dialog) {
    return;
  }
  const normalized = query.trim().toLowerCase();
  const fieldsets = Array.from(dialog.querySelectorAll("fieldset"));
  fieldsets.forEach((fieldset) => {
    const legend = fieldset.querySelector("legend");
    const legendText = legend
      ? (legend.dataset.cmfTitle || legend.textContent).trim().toLowerCase()
      : "";
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
        fieldset.dataset.cmfPrevState = fieldset.classList.contains("cmf-hidden")
          ? "hidden"
          : "visible";
      }
      if (showFieldset) {
        fieldset.classList.remove("cmf-hidden");
        fieldset.classList.add("cmf-visible");
      }
      fieldset.style.display = showFieldset ? "" : "none";
    } else {
      fieldset.style.display = "";
      if (fieldset.dataset.cmfPrevState) {
        const prev = fieldset.dataset.cmfPrevState;
        fieldset.classList.remove("cmf-hidden", "cmf-visible");
        fieldset.classList.add(prev === "hidden" ? "cmf-hidden" : "cmf-visible");
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
    if (
      Object.prototype.hasOwnProperty.call(state.options, rb.name) &&
      rb.value === state.options[rb.name]
    ) {
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

    const hdr2 = document.createElement("div");
    hdr2.className = "fb-cmf-title";

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
    hdr.appendChild(hdr2);
    hdr.appendChild(hdr3);
    dlg.appendChild(hdr);
    updateHeaderCloseVisibility(dlg, state);

    cnt = document.createElement("div");
    cnt.classList.add("content");
  } else {
    dlg = document.getElementById("fbcmf");
    const hdr = dlg.querySelector("header");
    const hdr2 = hdr.querySelector(".fb-cmf-title");
    while (hdr2.firstChild) {
      hdr2.removeChild(hdr2.firstChild);
    }
    hdr2.classList.remove("fb-cmf-lang-1");
    hdr2.classList.remove("fb-cmf-lang-2");

    cnt = dlg.querySelector(".content");
    while (cnt.firstChild) {
      cnt.removeChild(cnt.firstChild);
    }
    updateHeaderCloseVisibility(dlg, state);
  }

  dlg.setAttribute("dir", direction);

  const hdr2 = dlg.querySelector(".fb-cmf-title");
  const htxt = document.createElement("div");
  const gm = typeof globalThis !== "undefined" ? globalThis.GM : undefined;
  const scriptVersion =
    gm && gm.info && gm.info.script && gm.info.script.version ? gm.info.script.version : "";
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
    translations,
  });
  const searchRow = document.createElement("div");
  searchRow.className = "fb-cmf-search";
  const searchIcon = document.createElement("div");
  searchIcon.className = "fb-cmf-search-icon";
  searchIcon.innerHTML = state.iconDialogSearchHTML;
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.setAttribute("aria-label", "Search settings");
  searchInput.setAttribute("placeholder", "Search settings");
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
    const baseTooltips = Array.isArray(keyWords.DLG_BUTTON_TOOLTIPS)
      ? keyWords.DLG_BUTTON_TOOLTIPS
      : translations.en.DLG_BUTTON_TOOLTIPS;
    const tooltips =
      Array.isArray(baseTooltips) && baseTooltips.length >= 4
        ? baseTooltips
        : translations.en.DLG_BUTTON_TOOLTIPS;
    const buttonDefinitions = [
      {
        id: "BTNSave",
        text: keyWords.DLG_BUTTONS[0],
        handler: handlers.saveUserOptions,
        tooltipIndex: 0,
      },
      {
        id: "BTNExport",
        text: keyWords.DLG_BUTTONS[2],
        handler: handlers.exportUserOptions,
        tooltipIndex: 1,
      },
      { id: "BTNImport", text: keyWords.DLG_BUTTONS[3], handler: null, tooltipIndex: 2 },
      {
        id: "BTNReset",
        text: keyWords.DLG_BUTTONS[4],
        handler: handlers.resetUserOptions,
        tooltipIndex: 3,
      },
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
    const baseTooltips = Array.isArray(keyWords.DLG_BUTTON_TOOLTIPS)
      ? keyWords.DLG_BUTTON_TOOLTIPS
      : translations.en.DLG_BUTTON_TOOLTIPS;
    const tooltips =
      Array.isArray(baseTooltips) && baseTooltips.length >= 4
        ? baseTooltips
        : translations.en.DLG_BUTTON_TOOLTIPS;
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
        const md = document.getElementById("fbcmf");
        if (!md) {
          return;
        }
        const elLikesMaximum = md.querySelector('input[name="NF_LIKES_MAXIMUM"]');
        if (elLikesMaximum.checked) {
          const elLikesMaximumCount = md.querySelector('input[name="NF_LIKES_MAXIMUM_COUNT"]');
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
        const inputs = Array.from(md.querySelectorAll('input:not([type="file"]), textarea, select'));
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
          const isValid =
            Object.prototype.hasOwnProperty.call(fileContent, "NF_SPONSORED") &&
            Object.prototype.hasOwnProperty.call(fileContent, "GF_SPONSORED") &&
            Object.prototype.hasOwnProperty.call(fileContent, "VF_SPONSORED") &&
            Object.prototype.hasOwnProperty.call(fileContent, "MP_SPONSORED");
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
      deleteOptions()
        .then(() => {
          state.options.CMF_DIALOG_LANGUAGE = "";
          handlers.saveUserOptions(null, "reset").then(() => {
            updateDialog(state);
          });
        })
        .catch(() => null);
    },
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
  updateDialog,
};
