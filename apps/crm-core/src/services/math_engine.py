from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from src.schemas.life_map import FinancialComparison


@dataclass(frozen=True)
class BankModelConfig:
    """
    Configuração explícita para o modelo de comparação bancária.

    Nota de governança:
    - Este engine é determinístico e auditável.
    - Por design, NÃO implementa SAC/PRICE nesta fase.
    - Implementa uma estimativa simplificada de custo total por capitalização composta.
      Isso deve ser comunicado claramente no produto (evita interpretação como "simulação oficial").
    """

    bank_rate_year: float
    months: int


@dataclass(frozen=True)
class ConsorcioModelConfig:
    """
    Configuração explícita para o modelo de consórcio.
    fee_rate_total: taxa administrativa total no período (ex: 0.15 = 15%).
    """

    fee_rate_total: float = 0.15


class WealthMathEngine:
    """
    Motor matemático purista (Respiração).
    Sem IA, sem heurística: apenas fórmula explícita + arredondamento controlado.
    """

    @staticmethod
    def _monthly_rate_from_yearly(bank_rate_year: float) -> float:
        if bank_rate_year < 0:
            raise ValueError("bank_rate_year must be >= 0")
        return (1.0 + bank_rate_year) ** (1.0 / 12.0) - 1.0

    @staticmethod
    def compare_bank_vs_consorcio(
        amount: float,
        config_bank: BankModelConfig,
        config_consorcio: Optional[ConsorcioModelConfig] = None,
        *,
        rounding: int = 2,
    ) -> FinancialComparison:
        """
        Compara custo total estimado de:
        - Banco (capitalização composta, estimativa determinística)
        - Consórcio (taxa administrativa total fixa)

        Retorna FinancialComparison (contrato para o Frontend).

        IMPORTANTE:
        - O custo do banco aqui é uma ESTIMATIVA (não SAC/PRICE).
        - Esta decisão é intencional nesta fase para manter auditabilidade e simplicidade.
        """

        if amount < 0:
            raise ValueError("amount must be >= 0")
        if config_bank.months <= 0:
            raise ValueError("months must be > 0")
        if config_consorcio is None:
            config_consorcio = ConsorcioModelConfig()
        if config_consorcio.fee_rate_total < 0:
            raise ValueError("fee_rate_total must be >= 0")

        monthly_rate = WealthMathEngine._monthly_rate_from_yearly(config_bank.bank_rate_year)

        bank_total_estimate = amount * (1.0 + monthly_rate) ** config_bank.months

        aurora_total = amount * (1.0 + config_consorcio.fee_rate_total)

        net_savings = bank_total_estimate - aurora_total

        if aurora_total == 0:
            efficiency_gain_pct = 0.0
        else:
            efficiency_gain_pct = ((bank_total_estimate / aurora_total) - 1.0) * 100.0

        return FinancialComparison(
            total_bank_cost=round(bank_total_estimate, rounding),
            total_aurora_cost=round(aurora_total, rounding),
            net_savings=round(net_savings, rounding),
            efficiency_gain_pct=round(efficiency_gain_pct, rounding),
        )

