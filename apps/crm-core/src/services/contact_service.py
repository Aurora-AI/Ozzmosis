from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.contact import Contact


class ContactService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_contact(self, contact_id: str) -> Contact | None:
        stmt = select(Contact).where(Contact.id == contact_id)
        res = await self.db.execute(stmt)
        return res.scalars().first()

    async def get_contact_by_channel(
        self, *, whatsapp_id: str | None = None, email: str | None = None
    ) -> Contact | None:
        if not whatsapp_id and not email:
            return None

        stmt = select(Contact)
        if whatsapp_id:
            stmt = stmt.where(Contact.whatsapp_id == whatsapp_id)
        if email:
            stmt = stmt.where(Contact.email == email)

        res = await self.db.execute(stmt)
        return res.scalars().first()

