from fastapi.testclient import TestClient

from src.main import app


def test_life_map_compare_returns_financial_comparison():
    payload = {
        "age": 35,
        "monthly_income": 20000,
        "monthly_capacity": 2500,
        "dependents": 2,
        "goals": [{"id": "g1", "title": "Casa", "target_value": 500000, "deadline_years": 5}],
    }

    client = TestClient(app)
    resp = client.post("/v1/life-map/compare", json=payload)

    assert resp.status_code == 200
    body = resp.json()
    assert "total_bank_cost" in body
    assert "total_aurora_cost" in body
    assert "net_savings" in body
    assert "efficiency_gain_pct" in body


def test_life_map_compare_without_goals_returns_zeros():
    payload = {
        "age": 35,
        "monthly_income": 20000,
        "monthly_capacity": 2500,
        "dependents": 2,
        "goals": [],
    }

    client = TestClient(app)
    resp = client.post("/v1/life-map/compare", json=payload)
    assert resp.status_code == 200
    assert resp.json() == {
        "total_bank_cost": 0.0,
        "total_aurora_cost": 0.0,
        "net_savings": 0.0,
        "efficiency_gain_pct": 0.0,
    }

