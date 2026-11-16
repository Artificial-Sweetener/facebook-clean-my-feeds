// SPDX-License-Identifier: GPL-3.0-only

/** Explicit server facts keyed by the owning video ID or story click token; missing fields are unknown. */
export interface PageMediaFacts {
  live?: boolean;
  ai?: boolean;
  renderers?: readonly string[];
}

/** Accept JSON records only; arrays and primitive values cannot provide named ownership fields. */
function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

/** Retain bounded public renderer type names, never renderer props, private IDs or localized captions. */
function rendererTypes(values: unknown[]): string[] {
  const types = new Set<string>();
  for (const value of values.slice(0, 64)) {
    const name = record(value)?.__typename;
    if (typeof name === "string" && /^(?:Comet|XFBFBShorts)[A-Za-z0-9_]{1,100}$/.test(name))
      types.add(name);
  }
  return [...types];
}

/** Preserve only direct story and owned context rendering strategies for future non-text diagnosis. */
function storyRenderers(value: Record<string, unknown>): string[] {
  const sections = record(value.comet_sections);
  if (!sections) return [];
  const context = record(record(sections.context_layout)?.story);
  const own =
    typeof value.id === "string" && context?.id === value.id
      ? record(context.comet_sections)
      : undefined;
  const values = [...Object.values(sections), ...Object.values(own || {})].flatMap(
    (section: unknown) => (Array.isArray(section) ? section.slice(0, 64) : [section])
  );
  return rendererTypes(values);
}

/** Read the metadata belonging directly to this story, excluding attached stories and their disclosures. */
function storyAi(value: Record<string, unknown>): boolean | undefined {
  const sections = record(value.comet_sections);
  const context = record(sections?.context_layout);
  const story = record(context?.story);
  if (typeof value.id !== "string" || story?.id !== value.id) return undefined;
  const metadata = record(story?.comet_sections)?.metadata;
  if (!Array.isArray(metadata)) return undefined;
  return metadata.some((item: unknown) => {
    const disclosure = record(item);
    return (
      disclosure?.__typename === "CometFeedStoryGenAIContentTransparencyStrategy" &&
      disclosure.is_prod_eligible === true
    );
  });
}

/** Accept the feedback token only when its owning story ID exactly agrees with the outer story. */
function storyKeys(value: Record<string, unknown>): string[] {
  const feedback = record(record(value.comet_sections)?.feedback);
  const container = record(record(feedback?.story)?.story_ufi_container);
  const story = record(container?.story);
  const tokens = [value.encrypted_click_tracking];
  if (typeof value.id === "string" && story?.id === value.id)
    tokens.push(story.encrypted_click_tracking);
  return tokens
    .filter(
      (token): token is string =>
        typeof token === "string" && token.length > 0 && token.length <= 2048
    )
    .map((token) => `story:${token}`);
}

/**
 * Extract bounded, explicit machine facts without retaining captions, actors, URLs or the original payload.
 * Only typed Video/Story objects supply identities. Nested objects are examined independently, never
 * inherited by a parent story. Contradictory facts within one payload resolve to false.
 * @param input Parsed native Facebook JSON; this function never executes server instructions.
 * @returns Compact facts, or an empty map if the traversal exceeds its safety bound.
 */
export function extractPageMediaFacts(input: unknown): Map<string, PageMediaFacts> {
  const result = new Map<string, PageMediaFacts>();
  const pending: unknown[] = [input];
  let visited = 0;
  while (pending.length) {
    if (++visited > 100000) return new Map();
    const value: unknown = pending.pop();
    if (Array.isArray(value)) {
      if (pending.length + value.length > 100000) return new Map();
      for (const child of value) pending.push(child);
      continue;
    }
    const object = record(value);
    if (!object) continue;
    let keys: string[] = [];
    const facts: PageMediaFacts = {};
    if (
      object.__typename === "Video" &&
      typeof object.id === "string" &&
      /^\d{1,30}$/.test(object.id)
    ) {
      keys = [`video:${object.id}`];
      if (object.is_live_streaming === false) facts.live = false;
      else if (
        object.is_live_streaming === true &&
        (typeof object.broadcast_status === "string" || object.broadcast_status === null)
      )
        facts.live = object.broadcast_status === "LIVE";
      if (Array.isArray(object.augments)) {
        facts.ai = object.augments.some(
          (augment: unknown) =>
            record(augment)?.__typename === "XFBFBShortsGenAITransparencyAttribution"
        );
        facts.renderers = rendererTypes(object.augments);
      }
    } else if (object.__typename === "Story") {
      keys = storyKeys(object);
      const ai = storyAi(object);
      if (ai !== undefined) facts.ai = ai;
      const renderers = storyRenderers(object);
      if (renderers.length) facts.renderers = renderers;
    }
    for (const key of Object.keys(facts).length ? keys : []) {
      const previous = result.get(key) || {};
      for (const kind of ["ai", "live"] as const) {
        const next = facts[kind];
        if (next !== undefined && previous[kind] !== false) previous[kind] = next;
      }
      if (facts.renderers)
        previous.renderers = [
          ...new Set([...(previous.renderers || []), ...facts.renderers]),
        ].slice(0, 64);
      result.set(key, previous);
    }
    const children = Object.values(object).filter(
      (child) => child !== null && typeof child === "object"
    );
    if (pending.length + children.length > 100000) return new Map();
    for (const child of children) pending.push(child);
  }
  return result;
}
