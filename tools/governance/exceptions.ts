// SPDX-License-Identifier: GPL-3.0-only

import type { Policy, ReviewedException, Violation } from "./types";

/**
 * Verify that a reviewed exception is specific, short-lived, owned, and shrinking for oversized modules.
 * @param exception - One manually reviewed registry entry; blank wildcard approvals are invalid.
 * @param currentFingerprint - SHA-256 of the full current source file.
 * @param policy - Governing limits, including the maximum review lifetime.
 * @param now - Evaluation time, injectable for deterministic expiry tests.
 * @returns Reasons this approval must not suppress a violation.
 */
export function exceptionProblems(
  exception: ReviewedException,
  currentFingerprint: string,
  policy: Policy,
  now = new Date()
): string[] {
  const problems: string[] = [];
  if (!exception.file || /[*?]/.test(exception.file)) problems.push("Path must identify one file");
  if (
    !/^[a-f0-9]{64}$/.test(exception.fingerprint) ||
    exception.fingerprint !== currentFingerprint
  ) {
    problems.push("Fingerprint no longer matches reviewed content");
  }
  if (!exception.owner.trim()) problems.push("Named review owner is required");
  if (exception.reason.trim().length < 20) problems.push("Explain why the exception is necessary");
  if (exception.extraction.trim().length < 30)
    problems.push("Describe the concrete extraction/removal plan");
  const reviewed = Date.parse(exception.reviewedAt);
  const expires = Date.parse(exception.expires);
  if (!Number.isFinite(reviewed) || !Number.isFinite(expires) || expires <= reviewed) {
    problems.push("Valid review and expiry dates are required");
  } else {
    if (expires <= now.getTime()) problems.push("Review has expired");
    if (reviewed > now.getTime()) problems.push("Review cannot be dated in the future");
    if (expires - reviewed > policy.maximumExceptionDays * 86_400_000) {
      problems.push(`Review exceeds ${policy.maximumExceptionDays} days`);
    }
  }
  if (exception.rule === "size") {
    if (
      !Number.isInteger(exception.cap) ||
      !Number.isInteger(exception.previousCap) ||
      exception.cap === undefined ||
      exception.previousCap === undefined ||
      exception.cap <= policy.maximumLines ||
      exception.cap >= exception.previousCap
    ) {
      problems.push("Size approval needs an explicit cap smaller than the prior reviewed cap");
    }
  }
  return problems;
}

/** Only suppress the exact rule/file pair, and never allow a size exception to grow past its reviewed cap. */
export function coversViolation(exception: ReviewedException, violation: Violation): boolean {
  return (
    exception.rule === violation.rule &&
    exception.file === violation.file &&
    (violation.rule !== "size" ||
      (violation.lines !== undefined &&
        exception.cap !== undefined &&
        violation.lines <= exception.cap))
  );
}
