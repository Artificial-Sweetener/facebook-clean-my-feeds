// SPDX-License-Identifier: GPL-3.0-only

/** A sensitive substring is replaced at its first character, leaving unrelated label fragments intact. */
interface RedactionRange {
  start: number;
  end: number;
  replacement: string;
}

/** Bound retained private dictionaries and fragment scans to one report-generation lifetime. */
export class SensitiveText {
  private identities = new Set<string>();
  private identityPattern: RegExp | null = null;
  private identityVersion = 0;
  private compiledVersion = -1;
  private fragments = new WeakMap<
    Element,
    { text: string; version: number; nodes: Map<Node, string> }
  >();
  limitReached = false;
  identityLimitReached = false;

  /** Learn complete identities only, never arbitrary substrings or parts of unrelated interface words. */
  remember(value: string): void {
    const name = value.replace(/\s+/g, " ").trim();
    if (!name || this.identities.has(name)) return;
    if (name.length > 180 || this.identities.size >= 500) {
      this.identityLimitReached = true;
      return;
    }
    this.identities.add(name);
    this.identityVersion++;
  }

  /** Construct Unicode word-bounded patterns so names such as Ann cannot erase words such as announcement. */
  private names(): RegExp | null {
    if (this.compiledVersion !== this.identityVersion) {
      const names = Array.from(this.identities)
        .sort((a, b) => b.length - a.length)
        .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"));
      this.identityPattern = names.length
        ? new RegExp(`(?<![\\p{L}\\p{N}_])(?:${names.join("|")})(?![\\p{L}\\p{N}_])`, "giu")
        : null;
      this.compiledVersion = this.identityVersion;
    }
    return this.identityPattern;
  }

  /**
   * Find contacts, destinations, opaque identifiers and complete observed names without discarding surrounding copy.
   * @param value Complete label or attribute value; offsets use JavaScript UTF-16 string indices.
   * @returns Ordered non-overlapping replacement intervals, merging overlapping sensitive signals.
   */
  private ranges(value: string): RedactionRange[] {
    const patterns: Array<[RegExp | null, string]> = [
      [/(?:https?:\/\/|www\.)[^\s<>]+/giu, "[destination]"],
      [/[\w.+-]+@[\w.-]+\.[\p{L}]{2,}/gu, "[email]"],
      [/(?<!\d)(?:\+\d[\d\s().-]{6,}\d|\d{2,4}[ ().-]\d{3,4}[ .-]\d{3,4})(?!\d)/g, "[number]"],
      [
        /\b(?:\d{12,}|(?=[A-Za-z0-9_-]*[A-Za-z])(?=[A-Za-z0-9_-]*\d)[A-Za-z0-9_-]{28,})\b/g,
        "[identifier]",
      ],
      [this.names(), "[identity]"],
    ];
    const ranges: RedactionRange[] = [];
    for (const [pattern, replacement] of patterns) {
      if (!pattern) continue;
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(value)))
        ranges.push({ start: match.index, end: match.index + match[0].length, replacement });
    }
    ranges.sort((a, b) => a.start - b.start || b.end - a.end);
    const selected: RedactionRange[] = [];
    for (const range of ranges) {
      const previous = selected[selected.length - 1];
      if (previous && range.start < previous.end) previous.end = Math.max(previous.end, range.end);
      else selected.push({ ...range });
    }
    return selected;
  }

  /** Apply whole-label ranges to a fragment without leaking a split sensitive substring or suppressing adjacent useful words. */
  private slice(
    value: string,
    start: number,
    end: number,
    ranges: readonly RedactionRange[]
  ): string {
    let cursor = start;
    let result = "";
    for (const range of ranges) {
      if (range.end <= start || range.start >= end) continue;
      result += value.slice(cursor, Math.max(cursor, range.start));
      if (range.start >= start) result += range.replacement;
      cursor = Math.min(end, range.end);
    }
    return Array.from(result + value.slice(cursor, end))
      .filter((character) => character.charCodeAt(0) >= 32 || "\t\n\r".includes(character))
      .join("");
  }

  /** Sanitize a standalone value while preserving punctuation, whitespace and unfamiliar diagnostic wording. */
  redact(value: string): string {
    return this.slice(value, 0, value.length, this.ranges(value));
  }

  /**
   * Sanitize a text node using its complete label so character-split identities and contacts cannot evade redaction.
   * Cache by exact current text and dictionary version; live edits invalidate it. Exhausted fragment scans
   * fall back to per-node best effort and expose that limitation to the report.
   * @param node Text fragment whose retained copy must align with its siblings' redactions.
   * @param root Closest control, heading or SVG text container establishing one complete label.
   * @returns This fragment's sanitized text, retaining all non-sensitive surrounding characters.
   */
  fragment(node: Node, root: Element): string {
    const text = root.textContent || "";
    const previous = this.fragments.get(root);
    if (previous?.text === text && previous.version === this.identityVersion)
      return previous.nodes.get(node) ?? this.redact(node.textContent || "");
    const nodes: Node[] = [];
    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let current: Node | null;
    while ((current = walker.nextNode()) && nodes.length < 1024 && text.length <= 16384)
      nodes.push(current);
    if (current) {
      this.limitReached = true;
      return this.redact(node.textContent || "");
    }
    const ranges = this.ranges(text);
    const mapped = new Map<Node, string>();
    let offset = 0;
    for (const child of nodes) {
      const end = offset + (child.textContent?.length || 0);
      mapped.set(child, this.slice(text, offset, end, ranges));
      offset = end;
    }
    this.fragments.set(root, { text, version: this.identityVersion, nodes: mapped });
    return mapped.get(node) ?? this.redact(node.textContent || "");
  }
}
