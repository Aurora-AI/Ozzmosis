'use client';
import React, { useState } from 'react';
import { genesisDecide, resolveGenesisArtifactUrl } from '@/lib/genesis/client';
import type { GenesisDecideResponse } from '@/lib/genesis/contracts';

export default function GenesisPanel() {
  const [forceBlock, setForceBlock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenesisDecideResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecide = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await genesisDecide({ force_block: forceBlock });
      setResult(data);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPdf = async () => {
    setError(null);
    try {
      const url = resolveGenesisArtifactUrl(result?.ui?.artifacts?.decision_pdf ?? '');
      if (!url) throw new Error('GENESIS_DECISION_PDF_URL_MISSING');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e: any) {
      setError(String(e?.message ?? e));
    }
  };

  return (
    <section style={{ border: '1px solid #eee', padding: 12, margin: 12 }}>
      <h3>Genesis Decide</h3>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="checkbox" checked={forceBlock} onChange={(e) => setForceBlock(e.target.checked)} />
        force_block
      </label>

      <div style={{ marginTop: 8 }}>
        <button onClick={handleDecide} disabled={loading}>{loading ? '...' : 'Decidir'}</button>
        <button onClick={handleOpenPdf} style={{ marginLeft: 8 }} disabled={!result?.ui?.artifacts?.decision_pdf}>
          Abrir PDF
        </button>
      </div>

      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 12 }}>
          <div>
            <strong>verdict:</strong>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result.verdict, null, 2)}</pre>
          </div>
          <div><strong>decision_id:</strong> {result.decision_id ?? '—'}</div>
          <div><strong>request_sha256:</strong> {result.request_sha256 ?? '—'}</div>
          <div><strong>ui.status:</strong> {result.ui?.status ?? '—'}</div>
          <div><strong>ui.user_message:</strong> {result.ui?.user_message ?? '—'}</div>
          <div>
            <strong>reasons (policy):</strong>
            <ul>
              {(result.reasons ?? []).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {result.ui?.steps?.length ? (
            <div>
              <strong>ui.steps:</strong>
              <ul>
                {result.ui.steps.map((s) => (
                  <li key={s.id}>
                    {s.status} — {s.title}: {s.summary}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.ui?.next_actions?.length ? (
            <div>
              <strong>ui.next_actions:</strong>
              <ul>
                {result.ui.next_actions.map((a) => (
                  <li key={a.id}>
                    {a.type} — {a.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.ui?.artifacts ? (
            <div>
              <strong>ui.artifacts:</strong>
              <div><code>{result.ui.artifacts.decision_json}</code></div>
              <div><code>{result.ui.artifacts.decision_pdf}</code></div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
