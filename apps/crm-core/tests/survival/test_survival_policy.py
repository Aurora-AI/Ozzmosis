from __future__ import annotations

import pytest

from src.security.policy import ALL_PERMISSIONS, normalize_permission


@pytest.mark.survival
def test_survival_permissions() -> None:
    assert normalize_permission("Inbox:Read") == "inbox:read"
    assert "pipeline:write" in ALL_PERMISSIONS
