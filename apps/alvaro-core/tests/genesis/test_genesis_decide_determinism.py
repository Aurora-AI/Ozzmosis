from pathlib import Path

from alvaro.genesis.engine import decide


def test_genesis_decide_is_deterministic(tmp_path: Path):
    repo_root = tmp_path
    req = {"force_block": False}

    d1, pdf1, a1 = decide(repo_root=repo_root, request_model=req)
    d2, pdf2, a2 = decide(repo_root=repo_root, request_model=req)

    assert d1["request_sha256"] == d2["request_sha256"]
    assert d1["verdict"] == d2["verdict"]
    assert pdf1 == pdf2

    p_json = Path(a1["decision_json_path"])
    p_pdf = Path(a1["decision_pdf_path"])
    assert p_json.exists()
    assert p_pdf.exists()
