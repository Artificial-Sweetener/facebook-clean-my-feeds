#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not available. Install Node 22.x and retry."
  exit 1
fi

node_version="$(node --version)"
node_major="${node_version#v}"
node_major="${node_major%%.*}"

if [[ "$node_major" != "22" ]]; then
  echo "Warning: Node.js 22.x is recommended. Detected ${node_major}.x."
fi

echo "Installing dependencies..."
npm install

echo "Running checks..."
npm run lint
npm run format:check

echo "Setup complete."
