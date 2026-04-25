"""Router fuer den Wiedergabe-Verlauf (zuletzt gesehene Elemente)."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from config import Settings, get_settings
from services.jellyfin import JellyfinService

router = APIRouter(prefix="/api/history", tags=["Verlauf"])


class HistoryEntry(BaseModel):
    """Einzelner Eintrag im Wiedergabe-Verlauf."""

    id: str
    user_name: str
    item_name: str
    item_type: str
    date_played: str | None = None
    play_duration: str | None = None


def _get_service(settings: Annotated[Settings, Depends(get_settings)]) -> JellyfinService:
    return JellyfinService(settings)


@router.get("/", response_model=list[HistoryEntry])
async def get_watch_history(
    service: Annotated[JellyfinService, Depends(_get_service)],
    limit: Annotated[int, Query(ge=1, le=100)] = 30,
) -> list[HistoryEntry]:
    """Liefert die zuletzt abgespielten Elemente aller Nutzer."""
    try:
        users = await service.get_users()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Jellyfin-Server nicht erreichbar: {exc}",
        ) from exc

    entries: list[dict[str, Any]] = []

    for user in users:
        user_id: str = user.get("Id", "")
        user_name: str = user.get("Name", "")
        if not user_id:
            continue

        try:
            data = await service.get_user_items(
                user_id,
                params={
                    "SortBy": "DatePlayed",
                    "SortOrder": "Descending",
                    "Limit": limit,
                    "Recursive": True,
                    "IncludeItemTypes": "Movie,Episode",
                    "Fields": "DateLastMediaAdded",
                    "Filters": "IsPlayed",
                },
            )
        except Exception:
            continue

        for item in data.get("Items", []):
            user_data = item.get("UserData", {})
            ticks = item.get("RunTimeTicks") or 0
            total_min = ticks // 600_000_000
            hours, minutes = divmod(total_min, 60)
            duration = f"{hours}h {minutes}min" if hours else f"{minutes} min"

            entries.append({
                "id": item.get("Id", ""),
                "user_name": user_name,
                "item_name": item.get("Name", ""),
                "item_type": item.get("Type", ""),
                "date_played": user_data.get("LastPlayedDate"),
                "play_duration": duration,
            })

    entries.sort(key=lambda e: e.get("date_played") or "", reverse=True)

    return [HistoryEntry(**e) for e in entries[:limit]]
