"""Async-Datenbankverbindung fuer FinStat mit SQLAlchemy."""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_size=5,
    max_overflow=10,
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    """Basisklasse fuer alle Datenbankmodelle."""

    pass


async def get_db() -> AsyncSession:
    """Liefert eine Datenbank-Session als Dependency."""
    async with async_session() as session:
        yield session


async def init_db() -> None:
    """Erstellt alle Tabellen (fuer Entwicklung; in Produktion nutze Alembic)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
