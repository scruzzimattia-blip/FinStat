"""Router fuer Bibliotheks-Statistiken und kuerzlich hinzugefuegte Medien."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from config import Settings, get_settings
from database import get_db
from services.cache import CacheService
from services.jellyfin import JellyfinService

router = APIRouter(prefix="/api/library", tags=["Bibliothek"])


class LibraryCountsResponse(BaseModel):
    """Anzahl der Medienelemente nach Typ."""

    movie_count: int
    series_count: int
    episode_count: int
    music_count: int
    total_count: int


class RecentItem(BaseModel):
    """Kuerzlich hinzugefuegtes Medienelement."""

    id: str
    name: str
    type: str
    year: int | None = None
    date_added: str | None = None
    series_name: str | None = None


def _get_service(
    settings: Annotated[Settings, Depends(get_settings)],
) -> JellyfinService:
    return JellyfinService(settings)


@router.get("/counts", response_model=LibraryCountsResponse)
async def get_library_counts(
    service: Annotated[JellyfinService, Depends(_get_service)],
    settings: Annotated[Settings, Depends(get_settings)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> LibraryCountsResponse:
    """Gibt die Gesamtanzahl von Filmen, Serien, Episoden und Musik zurueck."""
    cache = CacheService(db, settings.CACHE_TTL_SECONDS)
    cached = await cache.get("library_counts")

    if cached is not None:
        return LibraryCountsResponse(**cached)

    try:
        counts = await service.get_library_counts()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Jellyfin-Server nicht erreichbar: {exc}",
        ) from exc

    movie = counts.get("MovieCount", 0)
    series = counts.get("SeriesCount", 0)
    episode = counts.get("EpisodeCount", 0)
    music = counts.get("SongCount", 0)

    result = LibraryCountsResponse(
        movie_count=movie,
        series_count=series,
        episode_count=episode,
        music_count=music,
        total_count=movie + series + episode + music,
    )
    await cache.set("library_counts", result.model_dump())
    return result


def _parse_recent_item(raw: dict[str, Any]) -> RecentItem:
    """Wandelt ein rohes Jellyfin-Item in das Antwortmodell um."""
    return RecentItem(
        id=raw.get("Id", ""),
        name=raw.get("Name", ""),
        type=raw.get("Type", ""),
        year=raw.get("ProductionYear"),
        date_added=raw.get("DateCreated"),
        series_name=raw.get("SeriesName"),
    )


@router.get("/recent", response_model=list[RecentItem])
async def get_recent_items(
    service: Annotated[JellyfinService, Depends(_get_service)],
    settings: Annotated[Settings, Depends(get_settings)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[RecentItem]:
    """Liefert die letzten 20 hinzugefuegten Medienelemente."""
    cache = CacheService(db, settings.CACHE_TTL_SECONDS)
    cached = await cache.get("library_recent")

    if cached is not None:
        return [RecentItem(**item) for item in cached]

    try:
        data = await service.get_items(
            params={
                "SortBy": "DateCreated",
                "SortOrder": "Descending",
                "Limit": 20,
                "Recursive": True,
                "IncludeItemTypes": "Movie,Series,Episode",
                "Fields": "DateCreated,ProductionYear,SeriesName",
            },
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Jellyfin-Server nicht erreichbar: {exc}",
        ) from exc

    items: list[dict[str, Any]] = data.get("Items", [])
    result = [_parse_recent_item(i) for i in items]
    await cache.set("library_recent", [r.model_dump() for r in result])
    return result
