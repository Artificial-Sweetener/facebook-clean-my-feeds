// SPDX-License-Identifier: GPL-3.0-only

/** A referenced label can appear later or be replaced without changing its owning post. */
interface Reference {
  target: Element | null;
  posts: Set<Element>;
}

/** One document subscription supplies versions for all registered post scopes and shared labels. */
interface VersionScope {
  observer: MutationObserver;
  onLoad: (event: Event) => void;
  versions: Map<Element, number>;
  references: Map<string, Reference>;
}

const scopes = new Map<Document, VersionScope>();
const ignoredAttributes = new Set([
  "cmfr",
  "cmfcpid",
  "cmfcf",
  "cmftsb",
  "cmfsmp",
  "cmfrv",
  "cmfmc",
]);
let nextVersion = 0;

/** Visibility markers belong to CMF presentation and cannot change Facebook content identity. */
export function ignoreContentAttributes(attributes: readonly string[]): void {
  for (const attribute of attributes) if (attribute) ignoredAttributes.add(attribute);
}

/**
 * Coalesce mutation records into one invalidation per affected post, including external ARIA dependencies.
 * @param scope Document subscription containing registered post versions and label references.
 * @param document Owner document used to resolve replaced or newly inserted shared labels.
 * @param records Pending changes delivered by the observer callback or synchronous record flush.
 */
function invalidate(scope: VersionScope, document: Document, records: MutationRecord[]): void {
  if (!records.length) return;
  const changed = new Set<Element>();
  for (const record of records) {
    const presentationOnly =
      record.type === "attributes" && ignoredAttributes.has(record.attributeName || "");
    let node: Node | null = record.target;
    while (node) {
      if (
        node instanceof Element &&
        scope.versions.has(node) &&
        !(presentationOnly && node === record.target)
      )
        changed.add(node);
      node = node.parentNode;
    }
    if (record.type === "attributes" && !presentationOnly) {
      for (const post of scope.versions.keys()) {
        if (record.target !== post && record.target.contains(post)) changed.add(post);
      }
    }
    if (record.type === "childList") {
      const moved = [...record.addedNodes, ...record.removedNodes];
      for (const post of scope.versions.keys()) {
        if (moved.some((node) => node.contains(post))) changed.add(post);
      }
    }
  }
  for (const [id, reference] of scope.references) {
    const target = document.getElementById(id);
    if (
      target !== reference.target ||
      records.some(
        (record) => !!target && (target.contains(record.target) || record.target.contains(target))
      )
    ) {
      for (const post of reference.posts) changed.add(post);
    }
    reference.target = target;
  }
  for (const post of changed) scope.versions.set(post, ++nextVersion);
}

/**
 * Return a synchronous mutation version; disconnected scopes and hosts without observers use uncached reads.
 * @param post Connected post scope whose content, ancestors and referenced labels define cached facts.
 * @returns Monotonic content identity, or null when safe persistent caching is unavailable.
 */
export function getContentVersion(post: Element): number | null {
  if (!post.isConnected || typeof MutationObserver === "undefined") return null;
  const document = post.ownerDocument;
  let scope = scopes.get(document);
  if (!scope) {
    const versions = new Map<Element, number>();
    const references = new Map<string, Reference>();
    const observer = new MutationObserver((records) => {
      const current = scopes.get(document);
      if (current) invalidate(current, document, records);
    });
    /** Invalidate media-dependent facts when image readiness changes without a mutation record. */
    const onLoad = (event: Event): void => {
      let node = event.target instanceof Node ? event.target : null;
      while (node) {
        if (node instanceof Element && versions.has(node)) versions.set(node, ++nextVersion);
        node = node.parentNode;
      }
    };
    scope = { observer, onLoad, versions, references };
    document.addEventListener("load", onLoad, true);
    observer.observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
    scopes.set(document, scope);
  }
  invalidate(scope, document, scope.observer.takeRecords());
  if (!scope.versions.has(post)) scope.versions.set(post, ++nextVersion);
  return scope.versions.get(post) ?? null;
}

/** Register even unresolved IDs so late labels invalidate an earlier negative classification. */
export function trackLabelReference(post: Element, id: string): void {
  const scope = scopes.get(post.ownerDocument);
  if (!scope || !post.isConnected) return;
  let reference = scope.references.get(id);
  if (!reference) {
    reference = { target: post.ownerDocument.getElementById(id), posts: new Set() };
    scope.references.set(id, reference);
  }
  reference.posts.add(post);
}

/** Remove obsolete dependencies before rebuilding evidence for a recycled post. */
export function forgetLabelReferences(post: Element): void {
  const scope = scopes.get(post.ownerDocument);
  if (!scope) return;
  for (const [id, reference] of scope.references) {
    reference.posts.delete(post);
    if (!reference.posts.size) scope.references.delete(id);
  }
}

/** Release detached post scopes and their shared references during ordinary SPA processing. */
export function pruneContentVersions(): void {
  for (const [document, scope] of scopes) {
    for (const post of scope.versions.keys()) {
      if (post.isConnected) continue;
      scope.versions.delete(post);
      forgetLabelReferences(post);
    }
    if (!scope.versions.size) {
      scope.observer.disconnect();
      document.removeEventListener("load", scope.onLoad, true);
      scopes.delete(document);
    }
  }
}

/** Disconnect document subscriptions when the page-processing lifecycle ends. */
export function clearContentVersions(): void {
  for (const [document, scope] of scopes) {
    scope.observer.disconnect();
    document.removeEventListener("load", scope.onLoad, true);
  }
  scopes.clear();
}

/** Use exact HTML only when mutation observation cannot supply a trustworthy version. */
export function contentStamp(post: Element): number | string {
  return getContentVersion(post) ?? `${post.getAttribute("aria-posinset") || ""}|${post.innerHTML}`;
}
