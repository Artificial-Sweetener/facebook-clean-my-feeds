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
    const buttonDefinitions = [
      { id: "BTNSave", text: keyWords.DLG_BUTTONS[0], handler: handlers.saveUserOptions },
      { id: "BTNExport", text: keyWords.DLG_BUTTONS[2], handler: handlers.exportUserOptions },
      { id: "BTNImport", text: keyWords.DLG_BUTTONS[3], handler: null },
      { id: "BTNReset", text: keyWords.DLG_BUTTONS[4], handler: handlers.resetUserOptions },
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
    const fileResults = document.createElement("div");
    fileResults.classList.add("fileResults");
    fileResults.innerHTML = "&nbsp;";
    footer.appendChild(fileResults);
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
    let btn = footer.querySelector("#BTNSave");
    btn.textContent = keyWords.DLG_BUTTONS[0];
    btn = footer.querySelector("#BTNExport");
    btn.textContent = keyWords.DLG_BUTTONS[2];
    btn = footer.querySelector("#BTNImport");
    btn.textContent = keyWords.DLG_BUTTONS[3];
    btn = footer.querySelector("#BTNReset");
    btn.textContent = keyWords.DLG_BUTTONS[4];
    addLegendEvents();
  }

  addLegendEvents();
  updateLegendWidths(dlg);
  addSearchEvents(state);
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
      if (source === "dialog") {
        const md = document.getElementById("fbcmf");
        const elLikesMaximum = md.querySelector('input[name="NF_LIKES_MAXIMUM"]');
        if (elLikesMaximum.checked) {
          const elLikesMaximumCount = md.querySelector('input[name="NF_LIKES_MAXIMUM_COUNT"]');
          if (elLikesMaximumCount.value.length === 0) {
            alert(`${context.keyWords.NF_LIKES_MAXIMUM}?`);
            elLikesMaximumCount.focus();
            return;
          }
        }

        let cbs = Array.from(md.querySelectorAll('input[type="checkbox"][cbtype="T"]'));
        cbs.forEach((cb) => {
          state.options[cb.name] = cb.checked;
        });

        let cbName = "NF_BLOCKED_FEED";
        cbs = Array.from(md.querySelectorAll(`input[type="checkbox"][name="${cbName}"]`));
        cbs.forEach((cb) => {
          state.options[cbName][parseInt(cb.value, 10)] = cb.checked ? "1" : "0";
        });
        cbName = "GF_BLOCKED_FEED";
        cbs = Array.from(md.querySelectorAll(`input[type="checkbox"][name="${cbName}"]`));
        cbs.forEach((cb) => {
          state.options[cbName][parseInt(cb.value, 10)] = cb.checked ? "1" : "0";
        });
        cbName = "VF_BLOCKED_FEED";
        cbs = Array.from(md.querySelectorAll(`input[type="checkbox"][name="${cbName}"]`));
        cbs.forEach((cb) => {
          state.options[cbName][parseInt(cb.value, 10)] = cb.checked ? "1" : "0";
        });
        cbName = "MP_BLOCKED_FEED";
        cbs = Array.from(md.querySelectorAll(`input[type="checkbox"][name="${cbName}"]`));
        cbs.forEach((cb) => {
          state.options[cbName][parseInt(cb.value, 10)] = cb.checked ? "1" : "0";
        });
        cbName = "PP_BLOCKED_FEED";
        cbs = Array.from(md.querySelectorAll(`input[type="checkbox"][name="${cbName}"]`));
        cbs.forEach((cb) => {
          state.options[cbName][parseInt(cb.value, 10)] = cb.checked ? "1" : "0";
        });

        const rbs = md.querySelectorAll('input[type="radio"]:checked');
        rbs.forEach((rb) => {
          state.options[rb.name] = rb.value;
        });
        const inputs = Array.from(md.querySelectorAll('input[type="text"]'));
        inputs.forEach((inp) => {
          state.options[inp.name] = inp.value;
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
          state.options[ta.name] = txts.join(state.SEP);
        });
        const selects = Array.from(md.querySelectorAll("select"));
        selects.forEach((select) => {
          state.options[select.name] = select.value;
        });

        languageChanged = state.language !== state.options.CMF_DIALOG_LANGUAGE;
      } else if (source === "reset") {
        languageChanged = true;
      }

      const md = document.getElementById("fbcmf");
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

      const elements = document.querySelectorAll(`[${mainColumnAtt}]`);
      for (const element of elements) {
        element.removeAttribute(mainColumnAtt);
      }
      toggleHiddenElements(state, context.options);

      const fileResults = document.querySelector("#fbcmf .fileResults");
      if (fileResults) {
        fileResults.textContent = `Last Saved @ ${new Date().toTimeString().slice(0, 8)}`;
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
      const fileResults = document.querySelector("#fbcmf .fileResults");
      if (fileResults) {
        fileResults.textContent = "Exported: fb - clean my feeds - settings.json";
      }
    },
    importUserOptions: (event) => {
      const fileResults = document.querySelector("#fbcmf .fileResults");
      const file = event.target.files[0];
      const fileName = event.target.files[0] ? event.target.files[0].name : "";
      const reader = new FileReader();
      reader.onload = (fileEvent) => {
        try {
          const fileContent = JSON.parse(fileEvent.target.result);
          if (
            Object.prototype.hasOwnProperty.call(fileContent, "NF_SPONSORED") &&
            Object.prototype.hasOwnProperty.call(fileContent, "GF_SPONSORED") &&
            Object.prototype.hasOwnProperty.call(fileContent, "VF_SPONSORED") &&
            Object.prototype.hasOwnProperty.call(fileContent, "MP_SPONSORED")
          ) {
            state.options = fileContent;
            handlers.saveUserOptions(null, "file").then(() => {
              updateDialog(state);
              if (fileResults) {
                fileResults.textContent = `File imported: ${fileName}`;
              }
            });
          } else if (fileResults) {
            fileResults.textContent = `File NOT imported: ${fileName}`;
          }
        } catch (error) {
          if (fileResults) {
            fileResults.textContent = `File NOT imported: ${fileName}`;
          }
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
