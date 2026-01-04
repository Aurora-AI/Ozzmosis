# Schema de Mocks (MVP Ademicon)

Objetivo:
Definir o schema mínimo de dados sintéticos para demonstrar:
- estados da jornada
- overlay de risco
- decisões recomendadas
- dashboards acionáveis

## Entidades mínimas

### A) consultants.csv
Colunas:
- consultant_id: UUID
- name: string
- time_in_company_days: int (referência temporal)
- state_id: enum (E1..E5)
- risk_flag: boolean
- hot_lead_ratio: float (0.0..1.0)
- cold_meetings_last_30d: int
- scheduled_vs_presented_ratio: float (0.0..1.0)
- vgv_offered_last_30d: float
- vgv_offered_last_90d: float
- referrals_ratio_last_90d: float (0.0..1.0)
- portfolio_size_estimated: float (proxy)
- whatsapp_latency_hours: float (proxy COEX)
- last_activity_days: int

### B) sales_history.csv
Colunas:
- consultant_id: UUID
- date: YYYY-MM-DD
- vgv_offered: float
- proposals_count: int
- meetings_count: int
- referrals_count: int

### C) chat_logs.json (opcional para narrativa)
Estrutura mínima:
[
  {
    "consultant_id": "uuid",
    "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
    "channel": "whatsapp",
    "event": "followup|proposal|meeting|silence",
    "meta": { "latency_hours": 12.5 }
  }
]

Notas:
- Os mocks são sintéticos e não contêm dados pessoais reais (LGPD-safe).
- Esses schemas suportam o overlay de risco e a leitura executiva do dashboard.
