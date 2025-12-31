#!/usr/bin/env bash
set -euo pipefail

echo "== Gates: npm ci =="
npm ci

echo "== Gates: repo:check =="
npm run repo:check

echo "Gates PASS"

