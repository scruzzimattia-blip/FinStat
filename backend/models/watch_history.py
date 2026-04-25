"""Wiedergabe-Verlauf – speichert abgeschlossene Wiedergaben."""

from datetime import datetime

from sqlalchemy import String, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class WatchHistory(Base):
    """Einzelner Eintrag im Wiedergabe-Verlauf."""

    __tablename__ = "watch_history"

    id: Mapped[int] = mapped_column(primary_key=True)
    jellyfin_item_id: Mapped[str] = mapped_column(String(64), index=True)
    user_name: Mapped[str] = mapped_column(String(255))
    item_name: Mapped[str] = mapped_column(String(500))
    item_type: Mapped[str] = mapped_column(String(50))
    date_played: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    runtime_ticks: Mapped[int | None] = mapped_column(Integer)
    synced_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
