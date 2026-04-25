"""Router fuer aktive Jellyfin-Sessions und Wiedergabe-Informationen."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from config import Settings, get_settings
from database import get_db
from services.cache import CacheService
from services.jellyfin import JellyfinService

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])


class PlayState(BaseModel):
    """Wiedergabestatus einer Session."""

    position_ticks: int = 0
    runtime_ticks: int = 0
    is_paused: bool = False
    is_muted: bool = False


class TranscodeInfo(BaseModel):
    """Transcodierungs-Details, falls aktiv."""

    is_transcoding: bool = False
    video_codec: str | None = None
    audio_codec: str | None = None
    completion_percentage: float | None = None


class MediaInfo(BaseModel):
    """Metadaten des gerade abgespielten Mediums."""

    bitrate: int | None = None
    container: str | None = None
    resolution: str | None = None


class SessionResponse(BaseModel):
    """Gesamtdarstellung einer einzelnen Session."""

    id: str
    user_name: str
    client: str
    device_name: str
    now_playing_name: str | None = None
    now_playing_type: str | None = None
    now_playing_year: int | None = None
    play_state: PlayState
    transcode_info: TranscodeInfo
    media_info: MediaInfo


def _get_service(settings: Annotated[Settings, Depends(get_settings)]) -> JellyfinService:
    return JellyfinService(settings)


def _parse_session(raw: dict[str, Any]) -> SessionResponse:
    """Wandelt eine rohe Jellyfin-Session in das Antwortmodell um."""
    now_playing: dict[str, Any] = raw.get("NowPlayingItem") or {}
    play_state_raw: dict[str, Any] = raw.get("PlayState") or {}
    transcode_raw: dict[str, Any] = raw.get("TranscodingInfo") or {}

    media_streams: list[dict[str, Any]] = now_playing.get("MediaStreams") or []
    video_stream = next((s for s in media_streams if s.get("Type") == "Video"), {})

    resolution = None
    if video_stream.get("Width") and video_stream.get("Height"):
        resolution = f"{video_stream['Width']}x{video_stream['Height']}"

    return SessionResponse(
        id=raw.get("Id", ""),
        user_name=raw.get("UserName", ""),
        client=raw.get("Client", ""),
        device_name=raw.get("DeviceName", ""),
        now_playing_name=now_playing.get("Name"),
        now_playing_type=now_playing.get("Type"),
        now_playing_year=now_playing.get("ProductionYear"),
        play_state=PlayState(
            position_ticks=play_state_raw.get("PositionTicks", 0),
            runtime_ticks=now_playing.get("RunTimeTicks", 0),
            is_paused=play_state_raw.get("IsPaused", False),
            is_muted=play_state_raw.get("IsMuted", False),
        ),
        transcode_info=TranscodeInfo(
            is_transcoding=bool(transcode_raw),
            video_codec=transcode_raw.get("VideoCodec"),
            audio_codec=transcode_raw.get("AudioCodec"),
            completion_percentage=transcode_raw.get("CompletionPercentage"),
        ),
        media_info=MediaInfo(
            bitrate=now_playing.get("Bitrate") or video_stream.get("BitRate"),
            container=now_playing.get("Container"),
            resolution=resolution,
        ),
    )


@router.get("/", response_model=list[SessionResponse])
async def get_sessions(
    service: Annotated[JellyfinService, Depends(_get_service)],
    settings: Annotated[Settings, Depends(get_settings)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[SessionResponse]:
    """Liefert alle aktiven Sessions mit Wiedergabe-Metadaten."""
    cache = CacheService(db, settings.CACHE_TTL_SECONDS)
    cached = await cache.get("sessions")

    if cached is not None:
        return [SessionResponse(**s) for s in cached]

    try:
        sessions = await service.get_sessions()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Jellyfin-Server nicht erreichbar: {exc}",
        ) from exc

    result = [_parse_session(s) for s in sessions]
    await cache.set("sessions", [r.model_dump() for r in result])
    return result
