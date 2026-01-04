from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.schemas.read_models import ContactOut
from src.services.contact_service import ContactService

router = APIRouter(prefix="/contacts", tags=["contacts"])


@router.get("/by-channel/lookup", response_model=ContactOut)
async def get_contact_by_channel(
    whatsapp_id: str | None = None,
    email: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> ContactOut:
    svc = ContactService(db)
    contact = await svc.get_contact_by_channel(whatsapp_id=whatsapp_id, email=email)
    if not contact:
        raise HTTPException(status_code=404, detail="contact_not_found")
    return ContactOut.model_validate(contact)


@router.get("/{contact_id}", response_model=ContactOut)
async def get_contact(contact_id: str, db: AsyncSession = Depends(get_db)) -> ContactOut:
    svc = ContactService(db)
    contact = await svc.get_contact(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="contact_not_found")
    return ContactOut.model_validate(contact)

