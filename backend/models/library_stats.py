"""Bibliotheks-Statistiken – periodische Snapshots der Medienanzahl."""

from datetime import datetime

from sqlalchemy import Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class LibraryStats(Base):
    """Speichert periodische Snapshots der Bibliotheks-Zaehler."""

    __tablename__ = "library_stats"

    id: Mapped[int] = mapped_column(primary_key=True)
    movie_count: Mapped[int] = mapped_column(Integer, default=0)
    series_count: Mapped[int] = mapped_column(Integer, default=0)
    episode_count: Mapped[int] = mapped_column(Integer, default=0)
    music_count: Mapped[int] = mapped_column(Integer, default=0)
    total_count: Mapped[int] = mapped_column(Integer, default=0)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
