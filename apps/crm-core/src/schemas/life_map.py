from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field


class LifeGoal(BaseModel):
    """
    Meta de vida (objetivo) informada pelo cliente.
    Contrato estável para o Frontend (Alvaro) e para decisões do PipelineGovernor.
    """

    id: str = Field(..., min_length=1, description="Identificador estável do objetivo.")
    title: str = Field(..., min_length=2, description='Ex: "Faculdade do Filho", "Aposentadoria".')
    target_value: float = Field(..., ge=0, description="Valor-alvo monetário (>= 0).")
    deadline_years: int = Field(..., ge=0, le=80, description="Prazo em anos (0..80).")


class LifeMapIn(BaseModel):
    """
    O que o cliente preenche na Jornada de Descoberta.
    Isso é contrato de entrada do Frontend para o Backend.
    """

    age: int = Field(..., ge=0, le=120, description="Idade do cliente (0..120).")
    monthly_income: float = Field(..., ge=0, description="Renda mensal (>=0).")
    monthly_capacity: float = Field(..., ge=0, description="Capacidade mensal sem ansiedade (>=0).")
    dependents: int = Field(..., ge=0, le=20, description="Número de dependentes (0..20).")
    goals: List[LifeGoal] = Field(default_factory=list, description="Lista de metas de vida.")


class FinancialComparison(BaseModel):
    """
    Resultado da lógica matemática determinística (Respiração).
    Importante: não é narrativa; é número.
    """

    total_bank_cost: float = Field(..., ge=0, description="Custo total estimado no banco (>=0).")
    total_aurora_cost: float = Field(..., ge=0, description="Custo total Rodobens/consórcio (>=0).")
    net_savings: float = Field(..., description="Economia (bank - aurora); pode ser negativa.")
    efficiency_gain_pct: float = Field(
        ...,
        description="Ganho percentual ((bank/aurora)-1)*100; pode ser negativo.",
    )

