# FinStat – Jellyfin Monitoring Dashboard

Ein modernes, dunkles Monitoring-Dashboard fuer deinen Jellyfin-Server. Gebaut mit **FastAPI** (Backend) und **Next.js** + **shadcn/ui** (Frontend).

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Python](https://img.shields.io/badge/Python-3.12+-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688)

---

## Features

- **Dashboard-Uebersicht** – Aktive Streams, CPU/RAM-Auslastung, Bibliotheks-Statistiken auf einen Blick
- **Aktive Sessions** – Echtzeit-Uebersicht aller Wiedergaben mit Fortschritt, Transcoding-Status, Aufloesung und Codec-Details
- **Statistiken** – Meistgesehene Inhalte der letzten 30 Tage als interaktives Balkendiagramm (Recharts)
- **Wiedergabe-Verlauf** – Tabellarische Uebersicht aller bisherigen Wiedergaben mit Benutzer, Titel, Typ und Dauer
- **Einstellungen** – Jellyfin-URL und API-Key konfigurieren mit Verbindungstest

## Tech-Stack

| Bereich    | Technologie                                       |
|------------|---------------------------------------------------|
| Backend    | Python 3.12+, FastAPI, SQLAlchemy, httpx, psutil  |
| Datenbank  | PostgreSQL 17, Alembic (Migrationen)              |
| Frontend   | Next.js 16, React 19, TypeScript 5                |
| UI         | Tailwind CSS v4, shadcn/ui                        |
| Diagramme  | Recharts                                          |
| Caching    | DB-basierter API-Cache (konfigurierbare TTL)      |
| Deployment | Docker, Docker Compose, Multi-Stage Builds        |
| API        | Jellyfin REST API                                 |

## Projektstruktur

```
FinStat/
├── docker-compose.yml        # Alle Services starten
├── .env.example              # Umgebungsvariablen (Docker)
├── backend/
│   ├── main.py               # FastAPI App-Einstiegspunkt
│   ├── config.py             # Pydantic Settings (.env)
│   ├── database.py           # SQLAlchemy Async-Engine
│   ├── Dockerfile            # Multi-Stage Build
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/               # Datenbankmodelle
│   │   ├── user.py           # Jellyfin-Nutzer
│   │   ├── session_log.py    # Session-Snapshots
│   │   ├── library_stats.py  # Bibliotheks-Zaehler
│   │   ├── watch_history.py  # Wiedergabe-Verlauf
│   │   └── api_cache.py      # API-Response-Cache
│   ├── services/
│   │   ├── jellyfin.py       # Jellyfin API Client
│   │   └── cache.py          # DB-basierter Cache-Service
│   ├── routers/              # API-Endpunkte
│   └── alembic/              # Datenbankmigrationen
├── frontend/
│   ├── Dockerfile            # Multi-Stage Build (Standalone)
│   ├── src/
│   │   ├── app/              # Next.js App Router Seiten
│   │   ├── components/       # React-Komponenten
│   │   ├── lib/              # API-Client, Hooks, Utilities
│   │   └── types/            # TypeScript-Interfaces
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Voraussetzungen

- **Docker** und **Docker Compose** (empfohlen)
- Oder: Python 3.12+, Node.js 20+, PostgreSQL 17+
- **Jellyfin-Server** mit aktiviertem API-Zugang
- Ein **API-Schluessel** aus dem Jellyfin-Dashboard (Einstellungen → API-Schluessel)

---

## Installation mit Docker (empfohlen)

Mit Docker startest du das gesamte Projekt mit einem einzigen Befehl:

```bash
# 1. Repository klonen
git clone https://github.com/<dein-user>/FinStat.git
cd FinStat

# 2. Umgebungsvariablen konfigurieren
cp .env.example .env
```

Bearbeite `.env` und trage deine Jellyfin-Daten ein:

```env
JELLYFIN_URL=http://dein-jellyfin-server:8096
JELLYFIN_API_KEY=dein-api-schluessel
```

```bash
# 3. Alles starten
docker compose up -d
```

Das wars! Die drei Container starten automatisch in der richtigen Reihenfolge:

1. **finstat-db** – PostgreSQL-Datenbank (wartet auf Healthcheck)
2. **finstat-backend** – FastAPI-API (wartet auf DB-Healthcheck)
3. **finstat-frontend** – Next.js-Dashboard (wartet auf Backend-Healthcheck)

| Service   | URL                          |
|-----------|------------------------------|
| Dashboard | http://localhost:3000         |
| API       | http://localhost:8000         |
| API-Docs  | http://localhost:8000/docs    |

### Docker-Befehle

```bash
# Status pruefen
docker compose ps

# Logs anzeigen
docker compose logs -f

# Stoppen
docker compose down

# Stoppen und Datenbank loeschen
docker compose down -v

# Neu bauen (nach Code-Aenderungen)
docker compose up -d --build
```

---

## Manuelles Setup (ohne Docker)

### 1. PostgreSQL einrichten

Stelle sicher, dass eine PostgreSQL-Instanz laeuft:

```bash
# Mit Docker (nur die Datenbank)
docker run -d --name finstat-db \
  -e POSTGRES_USER=finstat \
  -e POSTGRES_PASSWORD=finstat \
  -e POSTGRES_DB=finstat \
  -p 5432:5432 \
  postgres:17-alpine
```

### 2. Backend einrichten

```bash
cd backend

# Virtuelle Umgebung erstellen und aktivieren
python -m venv .venv
source .venv/bin/activate   # Linux/macOS

# Abhaengigkeiten installieren
pip install -r requirements.txt

# Konfiguration anlegen
cp .env.example .env
```

Bearbeite `backend/.env`:

```env
JELLYFIN_URL=http://dein-jellyfin-server:8096
JELLYFIN_API_KEY=dein-api-schluessel
DATABASE_URL=postgresql+asyncpg://finstat:finstat@localhost:5432/finstat
CACHE_TTL_SECONDS=30
```

```bash
# Datenbank-Migrationen ausfuehren
alembic upgrade head

# Backend starten
uvicorn main:app --reload --port 8000
```

Die API ist unter `http://localhost:8000` erreichbar, Docs unter `http://localhost:8000/docs`.

### 3. Frontend einrichten

```bash
cd frontend

# Abhaengigkeiten installieren
npm install

# Konfiguration anlegen (optional, Standard ist localhost:8000)
cp .env.example .env.local

# Frontend starten
npm run dev
```

Das Dashboard ist unter `http://localhost:3000` erreichbar.

---

## API-Endpunkte

| Methode | Pfad                   | Beschreibung                        |
|---------|------------------------|-------------------------------------|
| GET     | `/api/health`          | Health-Check                        |
| GET     | `/api/system`          | CPU, RAM, Serverinfo                |
| GET     | `/api/sessions`        | Alle aktiven Sessions               |
| GET     | `/api/library/counts`  | Anzahl Filme, Serien, Episoden etc. |
| GET     | `/api/library/recent`  | Zuletzt hinzugefuegte Medien        |
| GET     | `/api/stats/most-watched` | Meistgesehene Inhalte            |
| GET     | `/api/history`         | Wiedergabe-Verlauf                  |

---

## Entwicklung

### Backend (mit Auto-Reload)

```bash
cd backend && uvicorn main:app --reload
```

### Frontend (mit HMR)

```bash
cd frontend && npm run dev
```

### Datenbank-Migrationen

```bash
cd backend

# Neue Migration erstellen (nach Model-Aenderungen)
alembic revision --autogenerate -m "Beschreibung der Aenderung"

# Migrationen ausfuehren
alembic upgrade head

# Eine Migration zurueckrollen
alembic downgrade -1
```

### Produktions-Build (Frontend)

```bash
cd frontend && npm run build && npm start
```

---

## Branch-Strategie & Releases

Dieses Projekt verwendet zwei Haupt-Branches:

| Branch    | Zweck                                                  |
|-----------|--------------------------------------------------------|
| `develop` | Aktive Entwicklung – alle PRs von Mitwirkenden gehen hierhin |
| `main`    | Stabile Releases – nur ueber PRs von `develop` aktualisiert |

### Ablauf

```
feature/mein-feature  →  PR gegen develop  →  Review + Merge
                                                    ↓
                              develop  →  PR gegen main  →  Automatisches Release
```

1. **Mitwirkende** erstellen Feature-Branches und oeffnen PRs gegen `develop`.
2. **CI** prueft automatisch: Linting, Build und die **ss-Regel** (der Build schlaegt fehl, wenn U+00DF, das scharfe S, vorkommt).
3. Nach Review wird per **Squash Merge** in `develop` gemergt.
4. **Releases**: Ein Maintainer erstellt einen PR von `develop` → `main`. Beim Merge wird automatisch:
   - Die naechste SemVer-Version berechnet (basierend auf Commit-Praefixen)
   - Ein Git-Tag erstellt
   - Ein GitHub Release mit automatisch generierten Release-Notes veroeffentlicht

### Schreibstil: Doppel-s (ss) statt Eszett

> In diesem Projekt wird durchgaengig **ss** statt des historischen s-Zeichens (Eszett) verwendet.
> Die CI-Pipeline prueft dies automatisch – U+00DF im Code, in Kommentaren oder Texten fuehrt zum Build-Fehler.

Siehe [CONTRIBUTING.md](./CONTRIBUTING.md) fuer alle Details.

---

## Beitragen

Beitraege sind willkommen! Lies die [CONTRIBUTING.md](./CONTRIBUTING.md) fuer den vollstaendigen Workflow, Code-Richtlinien und die ss-Schreibkonvention.

## Lizenz

MIT – siehe [LICENSE](./LICENSE).
