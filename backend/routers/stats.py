"""Router fuer Wiedergabe-Statistiken (meistgeschaut etc.)."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from config import Settings, get_settings
from services.jellyfin import JellyfinService

router = APIRouter(prefix="/api/stats", tags=["Statistiken"])


class MostWatchedItem(BaseModel):
    """Element mit Wiedergabezaehler."""

    id: str
    name: str
    item_type: str
    play_count: int
    year: int | None = None


def _get_service(settings: Annotated[Settings, Depends(get_settings)]) -> JellyfinService:
    return JellyfinService(settings)


@router.get("/most-watched", response_model=list[MostWatchedItem])
async def get_most_watched(
    service: Annotated[JellyfinService, Depends(_get_service)],
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> list[MostWatchedItem]:
    """Liefert die meistgeschauten Elemente sortiert nach Wiedergabeanzahl.

    Aggregiert ueber alle Nutzer: Fuer jeden Nutzer werden die Elemente
    nach PlayCount sortiert abgefragt und zusammengefuehrt.
    """
    try:
        users = await service.get_users()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Jellyfin-Server nicht erreichbar: {exc}",
        ) from exc

    aggregated: dict[str, dict[str, Any]] = {}

    for user in users:
        user_id: str = user.get("Id", "")
        if not user_id:
            continue

        try:
            data = await service.get_user_items(
                user_id,
                params={
                    "SortBy": "PlayCount",
                    "SortOrder": "Descending",
                    "Limit": limit,
                    "Recursive": True,
                    "IncludeItemTypes": "Movie,Episode",
                    "Fields": "ProductionYear",
                    "Filters": "IsPlayed",
                },
            )
        except Exception:
            continue

        for item in data.get("Items", []):
            item_id: str = item.get("Id", "")
            play_count: int = item.get("UserData", {}).get("PlayCount", 0)

            if item_id in aggregated:
                aggregated[item_id]["play_count"] += play_count
            else:
                aggregated[item_id] = {
                    "id": item_id,
                    "name": item.get("Name", ""),
                    "item_type": item.get("Type", ""),
                    "play_count": play_count,
                    "year": item.get("ProductionYear"),
                }

    sorted_items = sorted(
        aggregated.values(),
        key=lambda x: x["play_count"],
        reverse=True,
    )[:limit]

    return [MostWatchedItem(**entry) for entry in sorted_items]
