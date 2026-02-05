import type { GenesisDecideRequest, GenesisDecideResponse } from './contracts';

function baseUrl(): string {
  const env = process.env.NEXT_PUBLIC_ALVARO_CORE_BASE_URL;
  if (env && env.trim().length > 0) return env.trim();
  // same-origin (preferred) — Next rewrites will proxy /genesis/*
  return '';
}

function resolveUrl(pathOrUrl: string): string {
  const b = baseUrl();
  if (!pathOrUrl) return pathOrUrl;
  if (!b) return pathOrUrl;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith('/')) return `${b}${pathOrUrl}`;
  return `${b}/${pathOrUrl}`;
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

export function resolveGenesisArtifactUrl(pathOrUrl: string): string {
  return resolveUrl(pathOrUrl);
}
