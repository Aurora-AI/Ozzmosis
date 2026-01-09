from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import os
import yaml


@dataclass(frozen=True)
class TrustwareWarning:
    id: str
    correction: str
    risk: str


@dataclass(frozen=True)
class TrustwareResult:
    is_safe: bool
    warnings: List[TrustwareWarning]
    required_acks: List[str]
    template_version: str


class TrustwareEngine:
    """
    Trustware Engine (Template vs Instancia)
    - Carrega regras estaticas (YAML) uma unica vez no boot.
    - Valida intencao do usuario contra triggers.
    """

    def __init__(self, rules_path: Optional[str] = None) -> None:
        base_dir = Path(__file__).resolve().parent

        default_rules = base_dir / "templates" / "wealth_rules_v1.yaml"
        env_rules = os.getenv("TRUSTWARE_RULES_PATH")

        self.rules_path = (
            Path(rules_path)
            if rules_path
            else Path(env_rules)
            if env_rules
            else default_rules
        )

        if not self.rules_path.exists():
            raise FileNotFoundError(f"Trustware rules not found at: {self.rules_path}")

        self._raw: Dict[str, Any] = self._load_yaml(self.rules_path)
        self.template_version: str = str(
            self._raw.get("version") or self._raw.get("template_version") or "unknown"
        )

        # Estrutura esperada:
        # products:
        #   consortium_real_estate:
        #     rules:
        #       - id: RULE-001
        #         correction: ...
        #         risk: HIGH
        #         triggers: ["urgente", "data certa"]
        #         required_ack: true
        self.products: Dict[str, Any] = self._raw.get("products", {})

    @staticmethod
    def _load_yaml(path: Path) -> Dict[str, Any]:
        with path.open("r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
        if not isinstance(data, dict):
            raise ValueError("Invalid YAML structure (expected dict at root).")
        return data

    @staticmethod
    def _normalize(text: str) -> str:
        return (text or "").strip().lower()

    def validate_fit(self, product_key: str, user_intent: str) -> Dict[str, Any]:
        product_key_n = self._normalize(product_key)
        intent_n = self._normalize(user_intent)

        product = self.products.get(product_key_n)
        if not product:
            # Produto desconhecido: fail-closed (nao assumimos seguro).
            return {
                "is_safe": False,
                "warnings": [
                    {
                        "id": "UNKNOWN_PRODUCT",
                        "correction": f"Produto nao reconhecido pelo template SSOT: {product_key_n}",
                        "risk": "HIGH",
                    }
                ],
                "required_acks": [],
                "template_version": self.template_version,
                "product_key": product_key_n,
                "note": "product_key_not_found",
            }

        rules: List[Dict[str, Any]] = product.get("rules", [])
        warnings: List[TrustwareWarning] = []
        required_acks: List[str] = []

        for rule in rules:
            rule_id = str(rule.get("id", "")).strip()
            correction = str(
                rule.get("correction") or rule.get("truth") or rule.get("claim") or ""
            ).strip()
            risk = str(rule.get("risk") or rule.get("risk_level") or "LOW").strip().upper()
            triggers = rule.get("triggers", []) or []
            required_ack = bool(rule.get("required_ack", False))

            matched = any(
                self._normalize(t) in intent_n
                for t in triggers
                if isinstance(t, str) and t.strip()
            )
            if matched:
                warnings.append(TrustwareWarning(id=rule_id, correction=correction, risk=risk))
                if required_ack and rule_id:
                    required_acks.append(rule_id)

        is_safe = not any(w.risk == "HIGH" for w in warnings)

        return {
            "is_safe": is_safe,
            "warnings": [
                {"id": w.id, "correction": w.correction, "risk": w.risk} for w in warnings
            ],
            "required_acks": required_acks,
            "template_version": self.template_version,
            "product_key": product_key_n,
        }

    def health_snapshot(self) -> Dict[str, Any]:
        """
        Snapshot seguro para /health. Sem dados sensiveis.
        """
        mtime = None
        try:
            mtime = datetime.fromtimestamp(
                self.rules_path.stat().st_mtime, tz=timezone.utc
            ).isoformat()
        except Exception:
            mtime = None

        return {
            "enabled": True,
            "template_version": self.template_version,
            "rules_path": str(self.rules_path),
            "rules_mtime_utc": mtime,
            "products_count": len(self.products or {}),
        }
