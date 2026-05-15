#!/bin/bash
# Crea un tag diari del main i el puja al remote.
# Idempotent: si ja existeix el tag d'avui, no fa res.
#
# Execució manual: ./scripts/daily-backup.sh
# Programable amb launchd a macOS (vegeu scripts/install-daily-backup.sh)

set -euo pipefail

cd "$(dirname "$0")/.."

TAG="daily-$(date -u +%Y-%m-%d)"

# Verifica que som al main
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "main" ]]; then
  echo "⚠️  No estic al branch main (estic a '$BRANCH'). Sortint."
  exit 0
fi

# Sync remote primer (no destructiu — només fetch)
git fetch origin --quiet

# Si el tag ja existeix localment, sortir
if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "✓ Tag $TAG ja existeix. Res a fer."
  exit 0
fi

# Crear i pujar
git tag -a "$TAG" -m "Backup automàtic del main · $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push origin "$TAG"

echo "✓ Tag creat: $TAG → $(git rev-parse --short HEAD)"
