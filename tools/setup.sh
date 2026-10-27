#!/usr/bin/env bash
set -euo pipefail

# Bootstrap with the same supported Node range and immutable lockfile used by CI.
if ! command -v node >/dev/null 2>&1; then
  echo "Install Node 22.14.0 (or a newer Node 22 release) and retry."
  exit 1
fi
node -e 'const [major, minor] = process.versions.node.split(".").map(Number); if (major !== 22 || minor < 14) { console.error("Node >=22.14.0 <23 is required"); process.exit(1); }'
npm ci
npm run verify
