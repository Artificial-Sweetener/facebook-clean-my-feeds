// SPDX-License-Identifier: GPL-3.0-only

/** Compress automatically redacted evidence into copyable text while retaining a readable compatibility fallback. */
export async function encodeReport(data: unknown): Promise<string> {
  const text = JSON.stringify(data);
  if (typeof CompressionStream === "undefined") return JSON.stringify(data, null, 2);
  try {
    const compressed = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
    const bytes = new Uint8Array(await new Response(compressed).arrayBuffer());
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 8192)
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    return JSON.stringify({
      format: "cmf-report",
      version: 2,
      encoding: "gzip-base64",
      data: btoa(binary),
    });
  } catch {
    return JSON.stringify(data, null, 2);
  }
}
