from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine


def _normalize_async_url(url: str) -> str:
    value = (url or "").strip()
    if value.startswith("postgresql://"):
        return value.replace("postgresql://", "postgresql+asyncpg://", 1)
    if value.startswith("sqlite:///"):
        return value.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
    return value


DATABASE_URL = _normalize_async_url(os.getenv("DATABASE_URL") or "sqlite:///./crm_core.db")

engine = create_async_engine(DATABASE_URL, future=True, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


@asynccontextmanager
async def get_db_session() -> AsyncIterator[AsyncSession]:
    async with SessionLocal() as session:
        yield session


async def get_db() -> AsyncIterator[AsyncSession]:
    async with get_db_session() as session:
        yield session


async def close_engine() -> None:
    await engine.dispose()
