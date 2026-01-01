from fastapi.testclient import TestClient

from src.main import app


def test_probe_no_subject_401(monkeypatch):
    monkeypatch.delenv("AURORA_RBAC_BOOTSTRAP_SUBJECTS", raising=False)

    client = TestClient(app)
    response = client.get("/api/v1/rbac/_probe")

    assert response.status_code == 401


def test_probe_subject_without_permission_403(monkeypatch):
    monkeypatch.setenv("AURORA_RBAC_BOOTSTRAP_SUBJECTS", "rodri")

    client = TestClient(app)
    response = client.get("/api/v1/rbac/_probe", headers={"X-Subject": "someone"})

    assert response.status_code == 403


def test_probe_bootstrap_subject_200(monkeypatch):
    monkeypatch.setenv("AURORA_RBAC_BOOTSTRAP_SUBJECTS", "rodri")

    client = TestClient(app)
    response = client.get("/api/v1/rbac/_probe", headers={"X-Subject": "rodri"})

    assert response.status_code == 200
    body = response.json()
    assert body["ok"] is True
    assert body["subject"] == "rodri"
