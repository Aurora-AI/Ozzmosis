from src.services.math_engine import BankModelConfig, WealthMathEngine


def test_compare_bank_vs_consorcio_returns_valid_numbers():
    cfg = BankModelConfig(bank_rate_year=0.18, months=60)
    res = WealthMathEngine.compare_bank_vs_consorcio(amount=100000.0, config_bank=cfg)
    assert res.total_bank_cost >= 0
    assert res.total_aurora_cost >= 0
    assert res.efficiency_gain_pct == res.efficiency_gain_pct

