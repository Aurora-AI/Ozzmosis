export type GenesisDecideRequest = {
  force_block?: boolean;
};

export type GenesisDecideResponse = {
  contract_version: string;
  endpoint: string;
  request_sha256: string;
  verdict: 'ALLOW' | 'BLOCK';
  reasons: string[];
  policy_version?: string;
  policy_mode?: string;
  policy_rule_ids_triggered?: string[];
  artifacts?: Record<string, string>;
};

function baseUrl(): string {
  const env = process.env.NEXT_PUBLIC_ALVARO_CORE_BASE_URL;
  if (env && env.trim().length > 0) return env.trim();
  // same-origin (preferred) — Next rewrites will proxy /genesis/*
  return '';
}

export async function genesisDecide(payload: GenesisDecideRequest = {}): Promise<GenesisDecideResponse> {
  const res = await fetch(`${baseUrl()}/genesis/decide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`genesisDecide failed: ${res.status} ${res.statusText} ${text}`);
  }
  return (await res.json()) as GenesisDecideResponse;
}

export async function genesisDecidePdf(payload: GenesisDecideRequest = {}): Promise<Blob> {
  const res = await fetch(`${baseUrl()}/genesis/decide.pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`genesisDecidePdf failed: ${res.status} ${res.statusText} ${text}`);
  }
  return await res.blob();
}
