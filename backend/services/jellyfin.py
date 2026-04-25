"""Service-Klasse fuer die Kommunikation mit der Jellyfin-API."""

from typing import Any

import httpx

from config import Settings


class JellyfinService:
    """Kapselt alle HTTP-Aufrufe an den Jellyfin-Server."""

    def __init__(self, settings: Settings) -> None:
        self._base_url = settings.JELLYFIN_URL.rstrip("/")
        self._headers = {"X-Emby-Token": settings.JELLYFIN_API_KEY}

    def _client(self) -> httpx.AsyncClient:
        """Erzeugt einen neuen AsyncClient mit Basis-URL und Auth-Header."""
        return httpx.AsyncClient(
            base_url=self._base_url,
            headers=self._headers,
            timeout=15.0,
        )

    async def get_sessions(self) -> list[dict[str, Any]]:
        """Liefert alle aktiven Sessions vom Jellyfin-Server."""
        async with self._client() as client:
            response = await client.get("/Sessions")
            response.raise_for_status()
            return response.json()

    async def get_system_info(self) -> dict[str, Any]:
        """Ruft allgemeine Systeminformationen des Servers ab."""
        async with self._client() as client:
            response = await client.get("/System/Info")
            response.raise_for_status()
            return response.json()

    async def get_library_counts(self) -> dict[str, Any]:
        """Gibt die Anzahl der Medienelemente in der Bibliothek zurueck."""
        async with self._client() as client:
            response = await client.get("/Items/Counts")
            response.raise_for_status()
            return response.json()

    async def get_items(self, params: dict[str, Any] | None = None) -> dict[str, Any]:
        """Fragt Medienelemente mit optionalen Query-Parametern ab."""
        async with self._client() as client:
            response = await client.get("/Items", params=params or {})
            response.raise_for_status()
            return response.json()

    async def get_playback_info(self) -> list[dict[str, Any]]:
        """Gibt nur Sessions mit aktiver Wiedergabe zurueck."""
        sessions = await self.get_sessions()
        return [s for s in sessions if s.get("NowPlayingItem")]

    async def get_user_items(
        self,
        user_id: str,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Fragt Medienelemente eines bestimmten Nutzers ab."""
        async with self._client() as client:
            response = await client.get(
                f"/Users/{user_id}/Items",
                params=params or {},
            )
            response.raise_for_status()
            return response.json()

    async def get_users(self) -> list[dict[str, Any]]:
        """Liefert die Liste aller Nutzer auf dem Server."""
        async with self._client() as client:
            response = await client.get("/Users")
            response.raise_for_status()
            return response.json()
