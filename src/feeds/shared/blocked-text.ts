// SPDX-License-Identifier: GPL-3.0-only

import type { HydratedOptions } from "../../core/options/types";
import type { Filters } from "../../core/filters/types";
import { findBlockedText } from "../../core/filters/classifiers/blocked-text";
import { extractTextContent } from "../../dom/walker";

import { getGroupsBlocksQuery, getNewsBlocksQuery } from "./blocks";

/**
 * Inspect text and image-alt content from up to three news blocks in configured term order.
 * Literal matching folds case; regex matching preserves source escapes and uses the core case-insensitive flag.
 * @throws SyntaxError when NF_BLOCKED_RE is enabled and a configured expression is invalid.
 */
function findNewsBlockedText(
  post: Element,
  options: Pick<HydratedOptions, "NF_BLOCKED_RE">,
  filters: Pick<Filters, "NF_BLOCKED_TEXT" | "NF_BLOCKED_TEXT_LC">
) {
  if (!post || !options || !filters) {
    return "";
  }

  const postTexts = extractTextContent(post, getNewsBlocksQuery(post), 3).join(" ");
  const useRegExp = options.NF_BLOCKED_RE;
  return findBlockedText(
    useRegExp ? postTexts : postTexts.toLowerCase(),
    useRegExp ? filters.NF_BLOCKED_TEXT : filters.NF_BLOCKED_TEXT_LC,
    useRegExp
  );
}

/**
 * Match GF terms against the first three group-layout blocks after text/alt extraction.
 * Fold case only for literal matching so uppercase regex escapes retain their original meaning.
 * @throws SyntaxError when GF_BLOCKED_RE is enabled and a configured expression is invalid.
 */
function findGroupsBlockedText(
  post: Element,
  options: Pick<HydratedOptions, "GF_BLOCKED_RE">,
  filters: Pick<Filters, "GF_BLOCKED_TEXT" | "GF_BLOCKED_TEXT_LC">
) {
  if (!post || !options || !filters) {
    return "";
  }

  const postTexts = extractTextContent(post, getGroupsBlocksQuery(post), 3).join(" ");
  const useRegExp = options.GF_BLOCKED_RE;
  return findBlockedText(
    useRegExp ? postTexts : postTexts.toLowerCase(),
    useRegExp ? filters.GF_BLOCKED_TEXT : filters.GF_BLOCKED_TEXT_LC,
    useRegExp
  );
}

/**
 * Restrict VF matching to the first route-selected block, excluding later video controls.
 * Preserve regex source text and use lowercase materialized terms only in literal mode.
 * @throws SyntaxError when VF_BLOCKED_RE is enabled and a configured expression is invalid.
 */
function findVideosBlockedText(
  post: Element,
  options: Pick<HydratedOptions, "VF_BLOCKED_RE">,
  filters: Pick<Filters, "VF_BLOCKED_TEXT" | "VF_BLOCKED_TEXT_LC">,
  queryBlocks: string
) {
  if (!post || !options || !filters || !queryBlocks) {
    return "";
  }

  const postTexts = extractTextContent(post, queryBlocks, 1).join(" ");
  const useRegExp = options.VF_BLOCKED_RE;
  return findBlockedText(
    useRegExp ? postTexts : postTexts.toLowerCase(),
    useRegExp ? filters.VF_BLOCKED_TEXT : filters.VF_BLOCKED_TEXT_LC,
    useRegExp
  );
}

/**
 * Reuse news-layout extraction for up to three profile blocks with only PP terms and mode.
 * Regex source escapes remain intact; literal terms retain their historical lowercase matching.
 * @throws SyntaxError when PP_BLOCKED_RE is enabled and a configured expression is invalid.
 */
function findProfileBlockedText(
  post: Element,
  options: Pick<HydratedOptions, "PP_BLOCKED_RE">,
  filters: Pick<Filters, "PP_BLOCKED_TEXT" | "PP_BLOCKED_TEXT_LC">
) {
  if (!post || !options || !filters) {
    return "";
  }

  const postTexts = extractTextContent(post, getNewsBlocksQuery(post), 3).join(" ");
  const useRegExp = options.PP_BLOCKED_RE;
  return findBlockedText(
    useRegExp ? postTexts : postTexts.toLowerCase(),
    useRegExp ? filters.PP_BLOCKED_TEXT : filters.PP_BLOCKED_TEXT_LC,
    useRegExp
  );
}

export {
  findGroupsBlockedText,
  findNewsBlockedText,
  findProfileBlockedText,
  findVideosBlockedText,
};
