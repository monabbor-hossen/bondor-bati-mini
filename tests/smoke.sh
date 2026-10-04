#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-http://localhost:8080}"

health="$(curl --fail --silent --show-error "$base_url/api/index.php/health")"
menu="$(curl --fail --silent --show-error "$base_url/api/index.php/menu")"

case "$health" in
  *'"status":"ok"'*) ;;
  *) echo "Health endpoint did not report ok" >&2; exit 1 ;;
esac

case "$menu" in
  *'"day_index":0'*'"day_index":5'*) ;;
  *) echo "Weekly menu response is incomplete" >&2; exit 1 ;;
esac

echo "Bondor Bati API smoke checks passed."
