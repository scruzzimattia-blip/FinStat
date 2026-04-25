# Beitragen zu FinStat

Vielen Dank fuer dein Interesse, an FinStat mitzuarbeiten! Hier findest du alle wichtigen Regeln und Ablaeufe.

---

## Schreibstil-Konvention

> **Wichtig:** In diesem Projekt wird durchgaengig **ss** statt **ß** verwendet.
> Das gilt fuer Code-Kommentare, Docstrings, UI-Texte, Commit-Messages und Dokumentation.
>
> Beispiele: _"grosse"_ statt _"große"_, _"muss"_ statt _"muß"_, _"schliessen"_ statt _"schließen"_.

Umlaute (ä, ö, ü) bleiben erhalten. Nur das Eszett wird ersetzt.

Die CI-Pipeline prueft dies automatisch. Wenn ein ß im Code, in Kommentaren oder Texten gefunden wird, schlaegt der Build fehl. Der Job heisst **"Eszett-Check (ss statt ß)"** und durchsucht alle `.py`, `.ts`, `.tsx`, `.js`, `.md`, `.yml`, `.json` und `.css`-Dateien.

---

## Branch-Strategie

Dieses Projekt nutzt zwei Haupt-Branches:

| Branch    | Zweck                                                        |
|-----------|--------------------------------------------------------------|
| `develop` | Aktive Entwicklung – **alle PRs gehen hierhin**              |
| `main`    | Stabile Releases – nur ueber PRs von `develop` aktualisiert |

> **Wichtig:** Erstelle deine PRs immer gegen den `develop`-Branch, nicht gegen `main`.
> PRs von `develop` → `main` werden nur von Maintainern fuer Releases erstellt.

Beim Merge eines PRs von `develop` → `main` wird automatisch:
- Die naechste SemVer-Version berechnet
- Ein Git-Tag und GitHub Release erstellt
- Release-Notes mit allen Aenderungen und Mitwirkenden generiert

---

## Voraussetzungen

- **Git** installiert
- **Python** 3.12+
- **Node.js** 20+
- Ein Fork oder Schreibzugriff auf das Repository

---

## Workflow

### 1. Fork & Clone

```bash
# Fork erstellen (ueber GitHub UI oder gh CLI)
gh repo fork scruzzimattia-blip/FinStat --clone
cd FinStat
```

### 2. Branch erstellen

Erstelle immer einen neuen Branch basierend auf `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/dein-feature-name
```

**Branch-Namenskonvention:**

| Prefix       | Verwendung               |
|--------------|--------------------------|
| `feature/`   | Neue Funktionalitaet     |
| `fix/`       | Fehlerbehebung           |
| `docs/`      | Nur Dokumentation        |
| `refactor/`  | Codestruktur-Aenderungen |
| `chore/`     | Build, CI, Abhaengigkeiten |

### 3. Aenderungen vornehmen

- Schreibe sauberes, typisiertes TypeScript (Frontend) bzw. Python mit Type Hints (Backend).
- Halte dich an die bestehende Projektstruktur.
- Teste deine Aenderungen lokal (`npm run build`, `uvicorn main:app`).

### 4. Code-Formatierung

| Bereich  | Tool         | Konfiguration     |
|----------|--------------|--------------------|
| Frontend | ESLint       | `eslint.config.mjs` |
| Frontend | Prettier     | Standard-Einstellungen |
| Backend  | Ruff / Black | PEP 8 konform      |

Vor dem Commit:

```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && ruff check .
```

### 5. Commit-Messages

Verwende kurze, aussagekraeftige englische Commit-Messages:

```
Add session card component with transcoding badges
Fix API client error handling for 502 responses
Update README with Docker instructions
```

### 6. Pull Request erstellen

```bash
git push origin feature/dein-feature-name
```

Erstelle dann einen Pull Request **gegen den `develop`-Branch** (nicht `main`!). Das PR-Template erinnert dich daran und enthaelt eine Checkliste.

Beschreibe in der PR:

- **Was** du geaendert hast
- **Warum** die Aenderung noetig ist
- **Wie** man es testen kann

PRs werden per **Squash Merge** zusammengefuehrt, um die Historie sauber zu halten.

### CI-Checks

Bevor ein PR gemergt werden kann, muessen folgende Checks bestehen:

| Check                    | Prueft                                         |
|--------------------------|------------------------------------------------|
| Eszett-Check (ss statt ß)| Kein ß in Code, Kommentaren oder Dokumentation |
| Backend (Python)         | Ruff Linting + Formatierung                    |
| Frontend (Next.js)       | ESLint + Produktions-Build                     |

---

## Code-Richtlinien

### Frontend (TypeScript / React)

- Verwende funktionale Komponenten mit Hooks
- Typisiere alle Props mit Interfaces
- Nutze `shadcn/ui`-Komponenten wo moeglich
- CSS ueber Tailwind-Klassen, kein eigenes CSS

### Backend (Python / FastAPI)

- Type Hints fuer alle Funktionsparameter und Rueckgabewerte
- Pydantic-Modelle fuer alle API-Antworten
- Dependency Injection ueber FastAPI `Depends()`
- Fehlerbehandlung mit `HTTPException`

---

## Issues

- Bevor du eine grosse Aenderung anfaengst, erstelle erst ein Issue zur Diskussion.
- Nutze die vorhandenen Issue-Templates (Bug Report / Feature Request).
- Referenziere das Issue in deinem PR mit `Closes #123`.

---

## Fragen?

Oeffne ein Issue mit dem Label `question` oder starte eine Diskussion im Discussions-Tab.
