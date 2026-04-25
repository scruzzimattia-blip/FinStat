"""Konfiguration fuer die FinStat-API – laedt Werte aus der .env-Datei."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Zentrale Einstellungen, die per Umgebungsvariablen gesetzt werden."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    JELLYFIN_URL: str = "http://localhost:8096"
    JELLYFIN_API_KEY: str = ""


@lru_cache
def get_settings() -> Settings:
    """Gibt eine gecachte Settings-Instanz zurueck."""
    return Settings()
