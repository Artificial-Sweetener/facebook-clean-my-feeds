// SPDX-License-Identifier: GPL-3.0-only

/** Parse Facebook's browser media URL into a format token without exposing its identity or trusting foreign hosts. */
export function facebookImageRendition(source: string): "gif" | "emg0" | null {
  try {
    const url = new URL(source);
    if (
      url.protocol !== "https:" ||
      !url.hostname.endsWith(".fbcdn.net") ||
      url.username ||
      url.password
    )
      return null;
    const format = /(?:^|_)dst-(gif|emg0)(?:_|$)/.exec(url.searchParams.get("stp") || "")?.[1];
    return format === "gif" || format === "emg0" ? format : null;
  } catch {
    return null;
  }
}
