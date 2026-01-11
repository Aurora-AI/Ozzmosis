'use client';
import React, { useState } from 'react';
import { genesisDecide, genesisDecidePdf } from '@/lib/genesis/client';

export default function GenesisPanel() {
  const [forceBlock, setForceBlock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
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

  const handlePdf = async () => {
    setError(null);
    try {
      const blob = await genesisDecidePdf({ force_block: forceBlock });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'genesis-decision.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
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
        <button onClick={handlePdf} style={{ marginLeft: 8 }}>Baixar PDF stub</button>
      </div>

      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 12 }}>
          <div>
            <strong>verdict:</strong>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result.verdict ?? result.verdict, null, 2)}</pre>
          </div>
          <div><strong>request_sha256:</strong> {result.request_sha256 ?? result.integrity_hash ?? '—'}</div>
          <div>
            <strong>reasons:</strong>
            <ul>
              {(result.reasons ?? result.steps ?? []).map((r: any, i: number) => (
                <li key={i}>{typeof r === 'string' ? r : JSON.stringify(r)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
