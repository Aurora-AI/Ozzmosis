from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ProposalPolicy:
    """
    Policy determinística: constantes e heurísticas explícitas.
    """

    bank_rate_year_default: float = 0.18
    consorcio_fee_rate_total_default: float = 0.15

    essential_budget_ratio: float = 0.60
    wealth_budget_ratio: float = 0.85
    legacy_budget_ratio: float = 1.00

    min_insurance_monthly: float = 50.0
    insurance_term_ratio_of_capacity: float = 0.08
    insurance_prestamista_ratio_of_capacity: float = 0.05
    insurance_critical_illness_ratio_of_capacity: float = 0.06

    reserve_services_value_min: float = 20000.0
    reserve_services_value_max: float = 50000.0

    patrimony_growth_factor_10y: float = 1.10

