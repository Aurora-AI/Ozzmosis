from pathlib import Path

from alvaro.genesis.engine import decide


def test_policy_blocks_force_block_true(tmp_path: Path):
    repo_root = tmp_path

    policy_path = repo_root / "apps" / "alvaro-core" / "src" / "alvaro" / "genesis" / "policies"
    policy_path.mkdir(parents=True, exist_ok=True)
    (policy_path / "genesis.v0.yaml").write_text(
        "\n".join(
            [
                'version: "0"',
                'mode: "error"',
                "rules:",
                '  - id: "TW_FORCE_BLOCK_TRUE"',
                '    description: "If force_block is true, block deterministically."',
                "    when:",
                '      field: "force_block"',
                '      op: "equals"',
                "      value: true",
                '    verdict: "BLOCK"',
                '    reason_code: "TW_FORCE_BLOCK_TRUE"',
                "",
            ]
        ),
        encoding="utf-8",
    )

    decision, pdf_bytes, artifacts = decide(repo_root=repo_root, request_model={"force_block": True})

    assert decision["verdict"] == "BLOCK"
    assert "TW_FORCE_BLOCK_TRUE" in decision["reasons"]
    assert "TW_FORCE_BLOCK_TRUE" in decision["policy_rule_ids_triggered"]
    assert decision["policy_mode"] == "error"
    assert pdf_bytes
    assert Path(artifacts["decision_json_path"]).exists()
    assert Path(artifacts["decision_pdf_path"]).exists()
