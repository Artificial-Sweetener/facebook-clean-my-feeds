// SPDX-License-Identifier: GPL-3.0-only

import type { PostHistory } from "../core/diagnostics/post-history";
import { snapshotRegionHtml } from "./dom-fixture";

/**
 * Export chronological pre-decision states alongside observed outcomes for permanent regression fixtures.
 * Missing frames and capture gaps remain explicit; expected outcomes are intentionally left for a maintainer to annotate.
 * @param history Validated, automatically redacted history from a pasted report.
 * @returns Fixed-name inert HTML assets and a replay manifest with stable per-post identities.
 */
export function buildHistoryFixture(history: PostHistory) {
  const files = history.frames.flatMap((frame, index) =>
    frame.snapshot.regions.map((region, regionIndex) => ({
      frame: frame.id,
      post: frame.post,
      file: `history-frame-${index + 1}-${regionIndex + 1}.html`,
      html: snapshotRegionHtml(frame.snapshot, region),
      coverage: frame.snapshot.coverage,
    }))
  );
  return {
    files,
    manifest: {
      version: 1,
      scope: history.scope,
      limits: history.limits,
      dropped: history.dropped,
      limitations: [
        "States precede decisions; outcomes record observed behavior, not expected correctness.",
        "Preserve the same post element between steps; replace its captured content and external references.",
        "Keep the filter's live caption and markers between steps; restore each frame's public Facebook attributes.",
        "Frames have independent ID/class aliases; install each state's reference targets together.",
        "Rendering geometry is unknown in history frames; redacted content and coverage gaps limit replay.",
        "Only news-post decisions and owned caption toggles are recorded; Facebook JavaScript is not replayed.",
      ],
      steps: history.events.map((event) => ({
        ...event,
        fixtures: files.filter((file) => file.frame === event.frame).map((file) => file.file),
        expected: null,
      })),
      frames: files.map(({ html: _html, ...file }) => file),
    },
  };
}
