"""Caching-Service – speichert und liest API-Antworten aus der Datenbank."""

import json
from datetime import datetime, timezone, timedelta
from typing import Any

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from models.api_cache import ApiCache


class CacheService:
    """Verwaltet den Datenbank-basierten API-Cache."""

    def __init__(self, db: AsyncSession, ttl_seconds: int = 30) -> None:
        self._db = db
        self._ttl = timedelta(seconds=ttl_seconds)

    async def get(self, key: str) -> Any | None:
        """Liest einen Cache-Eintrag, falls noch gueltig."""
        now = datetime.now(timezone.utc)
        stmt = select(ApiCache).where(
            ApiCache.cache_key == key,
            ApiCache.expires_at > now,
        )
        result = await self._db.execute(stmt)
        entry = result.scalar_one_or_none()

        if entry is None:
            return None

        return json.loads(entry.data)

    async def set(self, key: str, data: Any) -> None:
        """Schreibt einen Cache-Eintrag mit TTL."""
        now = datetime.now(timezone.utc)
        expires = now + self._ttl
        serialized = json.dumps(data, default=str)

        stmt = select(ApiCache).where(ApiCache.cache_key == key)
        result = await self._db.execute(stmt)
        entry = result.scalar_one_or_none()

        if entry:
            entry.data = serialized
            entry.expires_at = expires
        else:
            self._db.add(
                ApiCache(
                    cache_key=key,
                    data=serialized,
                    expires_at=expires,
                )
            )

        await self._db.commit()

    async def invalidate(self, key: str) -> None:
        """Loescht einen bestimmten Cache-Eintrag."""
        stmt = delete(ApiCache).where(ApiCache.cache_key == key)
        await self._db.execute(stmt)
        await self._db.commit()

    async def cleanup_expired(self) -> int:
        """Entfernt alle abgelaufenen Cache-Eintraege. Gibt die Anzahl zurueck."""
        now = datetime.now(timezone.utc)
        stmt = delete(ApiCache).where(ApiCache.expires_at <= now)
        result = await self._db.execute(stmt)
        await self._db.commit()
        return result.rowcount
