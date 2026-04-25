"""API-Cache – speichert Jellyfin-API-Antworten mit TTL."""

from datetime import datetime

from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class ApiCache(Base):
    """Zwischenspeicher fuer Jellyfin-API-Antworten zur Entlastung des Servers."""

    __tablename__ = "api_cache"

    id: Mapped[int] = mapped_column(primary_key=True)
    cache_key: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    data: Mapped[str] = mapped_column(Text)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
