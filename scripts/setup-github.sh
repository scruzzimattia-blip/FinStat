#!/usr/bin/env bash
# Konfiguriert die GitHub-Repository-Settings fuer FinStat.
# Voraussetzung: gh auth login (GitHub CLI authentifiziert)
set -euo pipefail

REPO="scruzzimattia-blip/FinStat"

echo "==> Repo-Einstellungen konfigurieren..."
gh repo edit "$REPO" \
  --description "Ein moderner Jellyfin Monitoring-Tracker – Dashboard fuer aktive Streams, Server-Auslastung und Wiedergabe-Statistiken." \
  --add-topic jellyfin \
  --add-topic monitoring \
  --add-topic dashboard \
  --add-topic finstat \
  --add-topic typescript \
  --add-topic fastapi \
  --add-topic nextjs \
  --enable-issues \
  --enable-discussions \
  --enable-wiki=false \
  --delete-branch-on-merge \
  --enable-squash-merge \
  --enable-merge-commit=false \
  --enable-rebase-merge=false

echo "==> Branch-Protection fuer main aktivieren..."
gh api repos/"$REPO"/branches/main/protection \
  --method PUT \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Backend (Python)", "Frontend (Next.js)"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1
  },
  "restrictions": null
}
JSON

echo "==> Fertig! Repository-Settings wurden konfiguriert."
echo ""
echo "Zusammenfassung:"
echo "  - Description + Topics gesetzt"
echo "  - Issues + Discussions aktiviert"
echo "  - Wiki deaktiviert"
echo "  - Nur Squash-Merge erlaubt"
echo "  - Branch nach Merge automatisch loeschen"
echo "  - main-Branch geschuetzt (PR + CI erforderlich)"
