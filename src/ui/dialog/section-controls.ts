// SPDX-License-Identifier: GPL-3.0-only

import type { Options } from "../../core/options/types";
import type { Keywords, TranslationRegistry } from "../../i18n";
import type { SectionState } from "./types";
import { readValue } from "./value-helpers";

/**
 * Render a boolean preference with translated text and optional enforced read-only selection.
 * @param keyWords Resolved localized labels, including English fallbacks.
 * @param options Stored preferences or operation settings; existing values retain their meaning.
 * @param cbName Persisted checkbox option name and matching catalog key.
 * @param cbReadOnly Force checked/disabled presentation for an enforced preference.
 * @returns One labeled checkbox row with the established persisted option name.
 */
export function createSingleCB(
  keyWords: Keywords,
  options: Options,
  cbName: string,
  cbReadOnly = false
) {
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.setAttribute("cbType", "T");
  cb.name = cbName;
  cb.value = cbName;
  cb.checked = Boolean(readValue(options, cbName));

  const label = document.createElement("label");
  if (cbReadOnly) {
    cb.checked = true;
    cb.disabled = true;
    label.setAttribute("disabled", "disabled");
  }
  label.appendChild(cb);

  const labelValue = readValue(keyWords, cbName);
  if (labelValue) {
    label.appendChild(
      document.createTextNode(Array.isArray(labelValue) ? labelValue.join(", ") : labelValue)
    );
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

/**
 * Render positional feed-scope flags using persisted "1"/"0" strings and a mandatory disabled scope.
 * @param keyWords Resolved localized labels, including English fallbacks.
 * @param options Stored preferences or operation settings; existing values retain their meaning.
 * @param cbName Persisted checkbox option name and matching catalog key.
 * @param cbReadOnlyIdx Positional feed scope that remains enabled and disabled in the UI.
 * @returns Ordered checkbox rows matching the localized feed-scope label positions.
 */
export function createMultipleCBs(
  keyWords: Keywords,
  options: Options,
  cbName:
    | "NF_BLOCKED_FEED"
    | "GF_BLOCKED_FEED"
    | "VF_BLOCKED_FEED"
    | "MP_BLOCKED_FEED"
    | "PP_BLOCKED_FEED",
  cbReadOnlyIdx = -1
) {
  const arrElements = [];
  for (let i = 0; i < keyWords[cbName].length; i += 1) {
    const div = document.createElement("div");
    div.classList.add("cmf-row");
    const cbKeyWord = keyWords[cbName][i] || "";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.setAttribute("cbType", "M");
    cb.name = cbName;
    cb.value = String(i);
    cb.checked = options[cbName]?.[i] === "1";
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

/**
 * Render one enumerated preference choice while preserving its persisted string representation.
 * @param options Stored preferences or operation settings; existing values retain their meaning.
 * @param rbName Persisted enumerated preference name.
 * @param rbValue Exact string representation stored for this choice.
 * @param rbLabelText Localized choice label.
 * @returns One labeled radio row with its saved string value.
 */
export function createRB(options: Options, rbName: string, rbValue: string, rbLabelText: string) {
  const div = document.createElement("div");
  div.classList.add("cmf-row");
  const rb = document.createElement("input");
  rb.type = "radio";
  rb.name = rbName;
  rb.value = rbValue;
  rb.checked = readValue(options, rbName) === rbValue;
  const label = document.createElement("label");
  label.appendChild(rb);
  label.appendChild(document.createTextNode(rbLabelText));
  div.appendChild(label);
  return div;
}

/**
 * Render a free-text preference and its label without interpreting or rewriting stored text.
 * @param options Stored preferences or operation settings; existing values retain their meaning.
 * @param inputName Persisted text preference name.
 * @param inputLabel Localized label for the text control.
 * @returns One labeled text-input row populated from a string preference.
 */
export function createInput(options: Options, inputName: string, inputLabel: string) {
  const div = document.createElement("div");
  div.classList.add("cmf-row");
  const input = document.createElement("input");
  input.type = "text";
  input.name = inputName;
  const inputValue = readValue(options, inputName);
  input.value = typeof inputValue === "string" ? inputValue : "";
  const label = document.createElement("label");
  label.appendChild(document.createTextNode(inputLabel));
  label.appendChild(document.createElement("br"));
  label.appendChild(input);
  div.appendChild(label);
  return div;
}

/**
 * Normalize the likes-limit input to decimal digits without accepting negative or fractional counts.
 * @param event Native activation/input event, when provided by the caller.
 */
export function checkInputNumber(event: Event) {
  const el = event.target;
  if (!(el instanceof HTMLInputElement)) return;
  if (!(el instanceof HTMLInputElement)) return;
  if (el.value === "") {
    return;
  }
  const digitsValues = el.value.replace(/\D/g, "");
  el.value = digitsValues.length > 0 ? String(parseInt(digitsValues, 10)) : "";
}

/**
 * Pair the likes-limit toggle and numeric text input while leaving final required-value validation to save.
 * @param keyWords Resolved localized labels, including English fallbacks.
 * @param options Stored preferences or operation settings; existing values retain their meaning.
 * @param cbName Persisted checkbox option name and matching catalog key.
 * @param inputName Persisted text preference name.
 * @returns One labeled toggle/input pair for the likes threshold.
 */
export function createCheckboxAndInput(
  keyWords: Keywords,
  options: Options,
  cbName: string,
  inputName: string
) {
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.setAttribute("cbType", "T");
  cb.name = cbName;
  cb.value = cbName;
  cb.checked = Boolean(readValue(options, cbName));

  const input = document.createElement("input");
  input.type = "text";
  input.name = inputName;
  const inputValue = readValue(options, inputName);
  input.value = typeof inputValue === "string" ? inputValue : "";
  input.placeholder = "1000";
  input.size = 6;
  input.addEventListener("input", checkInputNumber, false);

  const label = document.createElement("label");
  label.appendChild(cb);
  label.appendChild(document.createTextNode(`${readValue(keyWords, cbName)}: `));
  label.appendChild(input);

  const div = document.createElement("div");
  div.classList.add("cmf-row");
  div.appendChild(label);
  return div;
}

/**
 * Render supported native-language choices and mark the current resolved locale without changing persistence.
 * @param state Shared presentation state retained by mounted listeners.
 * @param keyWords Resolved localized labels, including English fallbacks.
 * @param translations Complete supported locale registry used for fallback and language choices.
 * @returns One language-select row with the resolved locale selected.
 */
export function createSelectLanguage(
  state: SectionState,
  keyWords: Keywords,
  translations: TranslationRegistry
) {
  const div = document.createElement("div");
  div.classList.add("cmf-row");
  const select = document.createElement("select");
  select.name = "CMF_DIALOG_LANGUAGE";

  Object.entries(translations).forEach(([languageCode, catalog]) => {
    const elOption = document.createElement("option");
    elOption.value = languageCode;
    elOption.textContent = catalog.CMF_DIALOG_LANGUAGE;
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
