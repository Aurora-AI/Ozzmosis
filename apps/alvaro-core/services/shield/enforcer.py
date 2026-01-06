from __future__ import annotations

import os
import urllib.request


def _env_truthy(name: str) -> bool:
    value = os.getenv(name, "").strip().lower()
    return value in {"1", "true", "yes", "on"}


def enforce_shield() -> None:
    """
    Enforce Shield health when SHIELD_ENFORCE is enabled.
    Uses stdlib only to keep the dependency surface minimal.
    """
    if not _env_truthy("SHIELD_ENFORCE"):
        return

    base_url = os.getenv("SHIELD_URL", "").strip().rstrip("/")
    if not base_url:
        raise RuntimeError("shield_url_missing")

    token = os.getenv("SHIELD_TOKEN", "").strip()
    url = f"{base_url}/health"
    req = urllib.request.Request(url, method="GET")
    if token:
        req.add_header("Authorization", f"Bearer {token}")

    try:
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status != 200:
                raise RuntimeError(f"shield_unhealthy_status_{resp.status}")
    except Exception as exc:
        raise RuntimeError(f"shield_unreachable:{exc}") from exc
