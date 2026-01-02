from typing import Any, Dict, Optional

from security.authorize import authorize, explain


def build_authz_router():
    """Build an APIRouter exposing a minimal authz check endpoint.

    Import-safe: raises a clear error if FastAPI is unavailable.
    """

    try:
        from fastapi import APIRouter
        from pydantic import BaseModel
    except Exception as exc:  # pragma: no cover
        raise RuntimeError("FastAPI integration requires fastapi+pydantic installed") from exc

    router = APIRouter(prefix="/authz", tags=["authz"])

    class AuthzCheckRequest(BaseModel):
        principal_id: str
        action: str
        resource: str
        scope: Optional[str] = None
        correlation_id: Optional[str] = None

    @router.post("/check")
    def check(req: AuthzCheckRequest) -> Dict[str, Any]:
        return explain(
            authorize(
                principal_id=req.principal_id,
                action=req.action,
                resource=req.resource,
                scope=req.scope,
                correlation_id=req.correlation_id,
            )
        )

    return router


class RBACMiddleware:
    """Starlette middleware that enforces RBAC when headers are present.

    Enforcement is opt-in per request:
    - x-rbac-resource: resource string
    - x-rbac-action: action string
    - x-principal-id: principal identifier
    - x-scope: optional tenant/scope
    - x-correlation-id: optional correlation id
    """

    def __init__(self, app):
        self.app = app

        try:
            from starlette.middleware.base import BaseHTTPMiddleware
        except Exception as exc:  # pragma: no cover
            raise RuntimeError("RBACMiddleware requires starlette installed") from exc

        # Dynamically create a BaseHTTPMiddleware subclass to keep this file import-safe
        class _Impl(BaseHTTPMiddleware):
            async def dispatch(self, request, call_next):
                from starlette.responses import JSONResponse

                resource = request.headers.get("x-rbac-resource")
                action = request.headers.get("x-rbac-action")
                if not resource or not action:
                    return await call_next(request)

                principal_id = request.headers.get("x-principal-id")
                scope = request.headers.get("x-scope")
                correlation_id = request.headers.get("x-correlation-id")

                if not principal_id:
                    return JSONResponse({"detail": "missing x-principal-id"}, status_code=401)

                result = authorize(
                    principal_id=principal_id,
                    action=action,
                    resource=resource,
                    scope=scope,
                    correlation_id=correlation_id,
                )

                if result["decision"].value == "DENY":
                    return JSONResponse(explain(result), status_code=403)

                return await call_next(request)

        self._impl = _Impl(app)

    async def __call__(self, scope, receive, send):
        return await self._impl(scope, receive, send)
