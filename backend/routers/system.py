"""Router fuer Systeminformationen (Host + Jellyfin-Server)."""

from typing import Annotated

import psutil
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from config import Settings, get_settings
from services.jellyfin import JellyfinService

router = APIRouter(prefix="/api/system", tags=["System"])


class SystemInfoResponse(BaseModel):
    """Antwortmodell fuer den System-Endpunkt."""

    cpu_percent: float
    memory_percent: float
    memory_total: int
    memory_used: int
    server_name: str
    version: str
    os: str


def _get_service(settings: Annotated[Settings, Depends(get_settings)]) -> JellyfinService:
    return JellyfinService(settings)


@router.get("/", response_model=SystemInfoResponse)
async def get_system_info(
    service: Annotated[JellyfinService, Depends(_get_service)],
) -> SystemInfoResponse:
    """Liefert CPU-/RAM-Auslastung des Hosts sowie Jellyfin-Serverdetails."""
    mem = psutil.virtual_memory()

    try:
        jf_info = await service.get_system_info()
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Jellyfin-Server nicht erreichbar: {exc}",
        ) from exc

    return SystemInfoResponse(
        cpu_percent=psutil.cpu_percent(interval=0.5),
        memory_percent=mem.percent,
        memory_total=mem.total,
        memory_used=mem.used,
        server_name=jf_info.get("ServerName", ""),
        version=jf_info.get("Version", ""),
        os=jf_info.get("OperatingSystem", ""),
    )
