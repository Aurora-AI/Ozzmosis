from __future__ import annotations

import pytest

from services.trustware.engine import TrustwareEngine


@pytest.mark.survival
def test_survival_trustware_snapshot() -> None:
    engine = TrustwareEngine()
    snapshot = engine.health_snapshot()
    assert snapshot.get("enabled") is True
    assert snapshot.get("template_version")
