"""Einstiegspunkt der FinStat-API – FastAPI-Anwendung mit CORS und Routern."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers import history, library, sessions, stats, system


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialisiert die Datenbank beim Start der Anwendung."""
    await init_db()
    yield


app = FastAPI(
    title="FinStat API",
    description="Monitoring-Dashboard API fuer Jellyfin",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://finstat-frontend:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system.router)
app.include_router(sessions.router)
app.include_router(library.router)
app.include_router(stats.router)
app.include_router(history.router)


@app.get("/api/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    """Einfacher Health-Check-Endpunkt."""
    return {"status": "ok"}
