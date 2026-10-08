// SPDX-License-Identifier: GPL-3.0-only

import type {
  RegexFeed,
  RegexSourceField,
  RegexValidationIssue,
} from "../../core/options/regex-validation";
import type { Keywords } from "../../i18n";
import type { DialogContext } from "./types";
import { applySearchFilter, updateFieldsetState } from "./search";

/** Identify provenance without copying private patterns into error text or exported diagnostics. */
function feedLabel(keyWords: Keywords, feed: RegexFeed): string {
  return keyWords[`DLG_${feed}`];
}

/** Remove only CMF's own validity annotations when an edit or a new attempt makes them stale. */
export function clearRegexErrors(dialog: HTMLElement | null): void {
  if (!dialog) return;
  dialog.querySelectorAll(".cmf-regex-error").forEach((error) => error.remove());
  dialog
    .querySelectorAll<HTMLTextAreaElement>("textarea[data-cmf-regex-invalid]")
    .forEach((input) => {
      input.setCustomValidity("");
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
      delete input.dataset.cmfRegexInvalid;
    });
}

/** Map encoded draft tokens to visible lines, including delimiters typed within one textarea row. */
function visibleLine(
  input: HTMLTextAreaElement,
  normalizedLine: number,
  separator: string
): number {
  let token = 0;
  const lines = input.value.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line?.trim()) continue;
    token += line.split(separator).length;
    if (token >= normalizedLine) return index + 1;
  }
  return normalizedLine;
}

/**
 * Show translated field errors without replacing the saved configuration or the visible draft.
 * Import coordinates describe the rejected file, so they never mark current valid input as invalid.
 * Stored coordinates describe persisted lines; draft coordinates map through blank-line normalization.
 * @param context Current dialog/catalog; all labels use the already selected language.
 * @param issues Safe source-field, line and destination provenance from the application boundary.
 * @param source Origin of the rejected coordinates; explicit reset attempts focus their source field.
 */
export function showRegexErrors(
  context: DialogContext,
  issues: readonly RegexValidationIssue[],
  source: "draft" | "import" | "stored" | "reset"
): void {
  const dialog = document.getElementById("fbcmf");
  if (!dialog) return;
  clearRegexErrors(dialog);
  const grouped = new Map<RegexSourceField, string[]>();
  for (const issue of issues) {
    const input = dialog.querySelector<HTMLTextAreaElement>(`textarea[name="${issue.field}"]`);
    if (!input) continue;
    const origin: RegexFeed =
      issue.field === "NF_BLOCKED_TEXT"
        ? "NF"
        : issue.field === "GF_BLOCKED_TEXT"
          ? "GF"
          : issue.field === "VF_BLOCKED_TEXT"
            ? "VF"
            : "PP";
    const line =
      source === "draft" ? visibleLine(input, issue.line, context.state.SEP) : issue.line;
    const message = context.keyWords.DLG_REGEX_ERROR.replace(
      "{field}",
      `${feedLabel(context.keyWords, origin)}: ${context.keyWords.DLG_BLOCK_TEXT_FILTER_TITLE}`
    )
      .replace("{line}", String(line))
      .replace("{feed}", feedLabel(context.keyWords, issue.destination));
    const messages = grouped.get(issue.field) ?? [];
    messages.push(message);
    grouped.set(issue.field, messages);
  }
  if (grouped.size > 0) {
    const searchInput = dialog.querySelector<HTMLInputElement>(".fb-cmf-search input");
    if (searchInput) searchInput.value = "";
    applySearchFilter(dialog, "");
  }
  let first: HTMLTextAreaElement | undefined;
  for (const [field, messages] of grouped) {
    const input = dialog.querySelector<HTMLTextAreaElement>(`textarea[name="${field}"]`);
    if (!input) continue;
    const prefix =
      source === "import"
        ? context.keyWords.DLG_REGEX_IMPORT_ERROR
        : source === "stored" || source === "reset"
          ? context.keyWords.DLG_REGEX_SAVED_ERROR
          : "";
    const message = [prefix, ...messages].filter(Boolean).join("\n");
    const error = document.createElement("div");
    error.id = `cmf-regex-error-${field}`;
    error.className = "cmf-regex-error";
    error.setAttribute("role", "alert");
    error.style.whiteSpace = "pre-line";
    error.style.color = "var(--negative, #b00020)";
    error.textContent = message;
    input.before(error);
    input.dataset.cmfRegexInvalid = "1";
    input.setAttribute("aria-describedby", error.id);
    const savedValue = context.state.options[field];
    const matchesStored =
      typeof savedValue === "string" &&
      input.value === savedValue.replaceAll(context.state.SEP, "\n");
    if (source === "draft" || (source !== "import" && matchesStored)) {
      input.setCustomValidity(message);
      input.setAttribute("aria-invalid", "true");
    }
    updateFieldsetState(input.closest("fieldset"), true, { animateHeight: false });
    first ??= input;
  }
  if (source !== "stored") first?.focus();
}
