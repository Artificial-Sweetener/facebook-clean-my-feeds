// SPDX-License-Identifier: GPL-3.0-only
import type { StyleContext } from "./builder";
import { addToSS } from "./builder";
import { appendAccessoryStyles } from "./accessories";

/**
 * Generate dialog layout, controls and accessibility motion rules in one deterministic pass.
 * @param state Per-page visibility and external-link markers plus the shared CSS buffer.
 */
export function appendDialogStyles(state: StyleContext): void {
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
  appendAccessoryStyles(state);

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
    ".fb-cmf fieldset legend .cmf-legend-icon > svg",
    "width:20px; height:20px; fill: currentColor;"
  );
  addToSS(state, ".fb-cmf fieldset legend .cmf-legend-icon .cmf-icon", "width:26px; height:26px;");
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
  addToSS(
    state,
    ".fb-cmf .fb-cmf-search-icon > svg",
    "width:16px; height:16px; fill: currentColor;"
  );
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
}
