"""Session-Log – speichert Snapshots aktiver Wiedergaben."""

from datetime import datetime

from sqlalchemy import String, Integer, Boolean, Float, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class SessionLog(Base):
    """Protokolliert aktive Wiedergabe-Sessions fuer Statistiken."""

    __tablename__ = "session_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    jellyfin_session_id: Mapped[str] = mapped_column(String(64), index=True)
    user_name: Mapped[str] = mapped_column(String(255))
    client: Mapped[str] = mapped_column(String(255))
    device_name: Mapped[str] = mapped_column(String(255))
    item_name: Mapped[str | None] = mapped_column(String(500))
    item_type: Mapped[str | None] = mapped_column(String(50))
    is_transcoding: Mapped[bool] = mapped_column(default=False)
    video_codec: Mapped[str | None] = mapped_column(String(50))
    audio_codec: Mapped[str | None] = mapped_column(String(50))
    resolution: Mapped[str | None] = mapped_column(String(20))
    bitrate: Mapped[int | None] = mapped_column(Integer)
    progress_percent: Mapped[float | None] = mapped_column(Float)
    is_paused: Mapped[bool] = mapped_column(default=False)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
