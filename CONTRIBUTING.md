# Beitragen zu FinStat

Vielen Dank fuer dein Interesse, an FinStat mitzuarbeiten! Hier findest du alle wichtigen Regeln und Ablaeufe.

---

## Schreibstil-Konvention

> **Wichtig:** In diesem Projekt wird durchgaengig **ss** statt **ß** verwendet.
> Das gilt fuer Code-Kommentare, Docstrings, UI-Texte, Commit-Messages und Dokumentation.
>
> Beispiele: _"grosse"_ statt _"große"_, _"muss"_ statt _"muß"_, _"schliessen"_ statt _"schließen"_.

Umlaute (ä, ö, ü) bleiben erhalten. Nur das Eszett wird ersetzt.

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

Erstelle dann einen Pull Request gegen den `develop`-Branch. Beschreibe in der PR:

- **Was** du geaendert hast
- **Warum** die Aenderung noetig ist
- **Wie** man es testen kann

PRs werden per **Squash Merge** zusammengefuehrt, um die Historie sauber zu halten.

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
