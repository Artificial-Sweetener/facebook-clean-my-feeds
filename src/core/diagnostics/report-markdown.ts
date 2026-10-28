// SPDX-License-Identifier: GPL-3.0-only

/**
 * Prepare a localized collapsible issue comment without allowing captured copy to escape its code fence.
 * @param payload Existing JSON or compressed JSON envelope; bytes are preserved inside the fenced block.
 * @param summary Localized report title and nonprivate version information.
 * @returns GitHub Markdown that starts collapsed and remains ordinary copyable text outside GitHub.
 */
export function formatReportMarkdown(payload: string, summary: string): string {
  const safeSummary = summary
    .replace(/\s+/g, " ")
    .slice(0, 256)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  let length = 3;
  const runs = /`+/g;
  let match: RegExpExecArray | null;
  while ((match = runs.exec(payload))) length = Math.max(length, match[0].length + 1);
  const fence = "`".repeat(length);
  return `<details>\n<summary>${safeSummary}</summary>\n\n${fence}json\n${payload}\n${fence}\n\n</details>`;
}

/** Accept the complete generated wrapper, optionally blockquoted by GitHub, while leaving legacy JSON unchanged. */
export function unwrapReportMarkdown(text: string): string {
  let value = text.trim();
  const lines = value.split(/\r?\n/);
  if (lines.every((line) => !line.trim() || /^> ?/.test(line)))
    value = lines
      .map((line) => line.replace(/^> ?/, ""))
      .join("\n")
      .trim();
  const match = value.match(
    /^<details>\s*<summary>[^\r\n]*<\/summary>\s*\n(`{3,})json\r?\n([\s\S]*?)\r?\n\1\s*<\/details>$/
  );
  return match?.[2] ?? value;
}
