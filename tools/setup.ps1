$ErrorActionPreference = "Stop"

# Bootstrap with the same supported Node range and immutable lockfile used by CI.
& node -e 'const [major, minor] = process.versions.node.split(".").map(Number); if (major !== 22 || minor < 14) { console.error("Node >=22.14.0 <23 is required"); process.exit(1); }'
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& npm ci
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& npm run verify
exit $LASTEXITCODE
