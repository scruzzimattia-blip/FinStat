"""Nutzer-Modell – synchronisiert mit Jellyfin-Nutzern."""

from datetime import datetime

from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class User(Base):
    """Repraesentiert einen Jellyfin-Nutzer in der lokalen Datenbank."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    jellyfin_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
