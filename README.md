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

| Bereich    | Technologie                          |
|------------|--------------------------------------|
| Backend    | Python 3.12+, FastAPI, httpx, psutil |
| Frontend   | Next.js 16, React 19, TypeScript 5   |
| UI         | Tailwind CSS v4, shadcn/ui           |
| Diagramme  | Recharts                             |
| API        | Jellyfin REST API                    |

## Projektstruktur

```
FinStat/
├── backend/
│   ├── main.py              # FastAPI App-Einstiegspunkt
│   ├── config.py             # Pydantic Settings (.env)
│   ├── requirements.txt
│   ├── .env.example
│   ├── services/
│   │   └── jellyfin.py       # Jellyfin API Client
│   └── routers/
│       ├── system.py         # CPU/RAM + Serverinfo
│       ├── sessions.py       # Aktive Sessions
│       ├── library.py        # Bibliotheks-Zaehler + Neuheiten
│       ├── stats.py          # Meistgesehen-Statistiken
│       └── history.py        # Wiedergabe-Verlauf
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router Seiten
│   │   ├── components/       # React-Komponenten
│   │   │   ├── ui/           # shadcn/ui Basiskomponenten
│   │   │   ├── layout/       # Sidebar
│   │   │   ├── dashboard/    # Stat-Cards, Stream-Preview
│   │   │   ├── sessions/     # Session-Karten
│   │   │   └── stats/        # Chart-Komponente
│   │   ├── lib/              # API-Client, Hooks, Utilities
│   │   └── types/            # TypeScript-Interfaces
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Voraussetzungen

- **Python** 3.12 oder hoeher
- **Node.js** 20 oder hoeher
- **Jellyfin-Server** mit aktiviertem API-Zugang
- Ein **API-Schluessel** aus dem Jellyfin-Dashboard (Einstellungen → API-Schluessel)

---

## Setup

### 1. Repository klonen

```bash
git clone https://github.com/<dein-user>/FinStat.git
cd FinStat
```

### 2. Backend einrichten

```bash
cd backend

# Virtuelle Umgebung erstellen und aktivieren
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# .venv\Scripts\activate    # Windows

# Abhaengigkeiten installieren
pip install -r requirements.txt

# Konfiguration anlegen
cp .env.example .env
```

Bearbeite `backend/.env` und trage deine Jellyfin-Daten ein:

```env
JELLYFIN_URL=http://dein-jellyfin-server:8096
JELLYFIN_API_KEY=dein-api-schluessel
```

### 3. Backend starten

```bash
cd backend
uvicorn main:app --reload --port 8000
```

Die API ist dann unter `http://localhost:8000` erreichbar.
Die interaktive API-Dokumentation findest du unter `http://localhost:8000/docs`.

### 4. Frontend einrichten

```bash
cd frontend

# Abhaengigkeiten installieren
npm install

# Konfiguration anlegen (optional, Standard ist localhost:8000)
cp .env.example .env.local
```

### 5. Frontend starten

```bash
cd frontend
npm run dev
```

Das Dashboard ist dann unter `http://localhost:3000` erreichbar.

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

### Produktions-Build (Frontend)

```bash
cd frontend && npm run build && npm start
```

---

## Lizenz

Siehe [LICENSE](./LICENSE).
