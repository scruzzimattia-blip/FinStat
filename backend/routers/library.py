"""Router fuer Bibliotheks-Statistiken und kuerzlich hinzugefuegte Medien."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from config import Settings, get_settings
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


def _get_service(settings: Annotated[Settings, Depends(get_settings)]) -> JellyfinService:
    return JellyfinService(settings)


@router.get("/counts", response_model=LibraryCountsResponse)
async def get_library_counts(
    service: Annotated[JellyfinService, Depends(_get_service)],
) -> LibraryCountsResponse:
    """Gibt die Gesamtanzahl von Filmen, Serien, Episoden und Musik zurueck."""
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

    return LibraryCountsResponse(
        movie_count=movie,
        series_count=series,
        episode_count=episode,
        music_count=music,
        total_count=movie + series + episode + music,
    )


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
) -> list[RecentItem]:
    """Liefert die letzten 20 hinzugefuegten Medienelemente."""
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
    return [_parse_recent_item(i) for i in items]
