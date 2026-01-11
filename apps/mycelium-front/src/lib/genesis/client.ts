export const BASE = process.env.NEXT_PUBLIC_ALVARO_CORE_BASE_URL ?? '';

export async function genesisDecide(opts: { force_block?: boolean } = {}) {
  const res = await fetch(`${BASE}/genesis/decide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  });

  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    // non-json response
    if (!res.ok) throw new Error('GENESIS_DECIDE_FAILED');
    return null;
  }

  if (!res.ok) throw new Error(data?.message ?? 'GENESIS_DECIDE_FAILED');
  return data;
}

export async function genesisDecidePdf(opts: { force_block?: boolean } = {}) {
  const res = await fetch(`${BASE}/genesis/decide/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  });
  if (!res.ok) {
    let txt = 'GENESIS_DECIDE_PDF_FAILED';
    try { txt = await res.text(); } catch {}
    throw new Error(txt);
  }
  const blob = await res.blob();
  return blob;
}
