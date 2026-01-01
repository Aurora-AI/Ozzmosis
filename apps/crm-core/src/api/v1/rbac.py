from fastapi import APIRouter, Depends

from src.security.dependencies import require_permission
from src.security.policy import PERM_RBAC_ADMIN

router = APIRouter(prefix="/rbac", tags=["rbac"])


@router.get("/_probe")
def probe(subject: str = Depends(require_permission(PERM_RBAC_ADMIN))) -> dict:
    return {"ok": True, "subject": subject}
