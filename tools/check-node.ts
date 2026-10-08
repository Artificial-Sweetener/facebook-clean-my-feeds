// SPDX-License-Identifier: GPL-3.0-only

/** Reject unsupported runtime versions before contributors see misleading build or release failures. */
export function assertSupportedNode(version = process.versions.node): void {
  const [major, minor] = version.split(".").map(Number);
  if (major !== 22 || minor === undefined || minor < 14) {
    throw new Error(
      `Node >=22.14.0 <23 is required; found ${version}. Use nvm use or Node 22.14.0.`
    );
  }
}

if (require.main === module) {
  assertSupportedNode();
}
