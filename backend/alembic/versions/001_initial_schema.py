"""Initiales Datenbankschema fuer FinStat.

Revision ID: 001_initial
Revises:
Create Date: 2026-04-25

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Erstellt alle Tabellen."""
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "jellyfin_id", sa.String(64), unique=True, index=True, nullable=False
        ),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean(), default=True, nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
    )

    op.create_table(
        "session_logs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("jellyfin_session_id", sa.String(64), index=True, nullable=False),
        sa.Column("user_name", sa.String(255), nullable=False),
        sa.Column("client", sa.String(255), nullable=False),
        sa.Column("device_name", sa.String(255), nullable=False),
        sa.Column("item_name", sa.String(500)),
        sa.Column("item_type", sa.String(50)),
        sa.Column("is_transcoding", sa.Boolean(), default=False, nullable=False),
        sa.Column("video_codec", sa.String(50)),
        sa.Column("audio_codec", sa.String(50)),
        sa.Column("resolution", sa.String(20)),
        sa.Column("bitrate", sa.Integer()),
        sa.Column("progress_percent", sa.Float()),
        sa.Column("is_paused", sa.Boolean(), default=False, nullable=False),
        sa.Column(
            "recorded_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            index=True,
        ),
    )

    op.create_table(
        "library_stats",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("movie_count", sa.Integer(), default=0, nullable=False),
        sa.Column("series_count", sa.Integer(), default=0, nullable=False),
        sa.Column("episode_count", sa.Integer(), default=0, nullable=False),
        sa.Column("music_count", sa.Integer(), default=0, nullable=False),
        sa.Column("total_count", sa.Integer(), default=0, nullable=False),
        sa.Column(
            "recorded_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            index=True,
        ),
    )

    op.create_table(
        "watch_history",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("jellyfin_item_id", sa.String(64), index=True, nullable=False),
        sa.Column("user_name", sa.String(255), nullable=False),
        sa.Column("item_name", sa.String(500), nullable=False),
        sa.Column("item_type", sa.String(50), nullable=False),
        sa.Column("date_played", sa.DateTime(timezone=True)),
        sa.Column("runtime_ticks", sa.Integer()),
        sa.Column(
            "synced_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
    )

    op.create_table(
        "api_cache",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("cache_key", sa.String(255), unique=True, index=True, nullable=False),
        sa.Column("data", sa.Text(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), index=True, nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now()
        ),
    )


def downgrade() -> None:
    """Loescht alle Tabellen."""
    op.drop_table("api_cache")
    op.drop_table("watch_history")
    op.drop_table("library_stats")
    op.drop_table("session_logs")
    op.drop_table("users")
