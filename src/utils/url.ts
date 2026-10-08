// SPDX-License-Identifier: GPL-3.0-only

/** Ignore non-string persisted or page-provided values rather than coercing them into routes. */
export function getPathSegments(pathname: unknown): string[] {
  return typeof pathname === "string" ? pathname.split("/").filter(Boolean) : [];
}

/** Require a whole nonempty path component so partial names cannot activate a route. */
export function hasPathSegment(pathname: unknown, segment: unknown): boolean {
  return (
    typeof segment === "string" && segment.length > 0 && getPathSegments(pathname).includes(segment)
  );
}
