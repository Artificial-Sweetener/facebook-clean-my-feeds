// SPDX-License-Identifier: GPL-3.0-only

import { facebookUrl, getPostEvidence } from "../../dom/post-evidence";
import { isOwnedNewsMetadata } from "../news-identity";

/** Recognize the rendered business-help disclosure in owned feed metadata, excluding authored and nested links. */
export function hasPaidPartnershipDisclosure(post: Element): boolean {
  const evidence = getPostEvidence(post);
  return evidence
    .select("span[dir] > span[id] a[href]")
    .some(
      (link) =>
        facebookUrl(link)?.pathname.startsWith("/business/help/") && isOwnedNewsMetadata(link, post)
    );
}
