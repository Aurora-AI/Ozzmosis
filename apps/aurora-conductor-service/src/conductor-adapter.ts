// Adapter único para acoplar com @aurora/aurora-conductor sem espalhar dependência.
// Ajuste APENAS aqui caso os nomes de funções/exports do conductor sejam diferentes.

import type { ComposeRequest } from './types.js';

export type ConductorResult = {
  ok: boolean;
  code?: string;
  message?: string;
  artifact: unknown;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getConductorModule(): any {
  // Em ESM, import dinâmico evita falha de build se o pacote mover exports.
  return import('@aurora/aurora-conductor');
}

export async function runCompose(req: ComposeRequest): Promise<ConductorResult> {
  const mod = await getConductorModule();

  if (typeof mod.compose === 'function') {
    const spec = req.input.kind === 'inline' ? (req.input.inline ?? '') : (req.input.chronosRef ?? '');

    try {
      const artifact = await mod.compose(spec, {
        repoRoot: process.cwd(),
        dryRun: true,
        writeArtifacts: false
      });

      const policyPass =
        typeof (artifact as { policy?: { pass?: unknown } }).policy?.pass === 'boolean'
          ? (artifact as { policy: { pass: boolean } }).policy.pass
          : true;

      if (!policyPass && req.policy.mode === 'error') {
        return {
          ok: false,
          code: 'policy_failed',
          message: 'Policy failed (mode=ERROR)',
          artifact
        };
      }

      return { ok: true, artifact };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Compose failed';
      return { ok: false, code: 'compose_error', message, artifact: { error: 'compose_error' } };
    }
  }

  // Fallback: não “inventar” lógica.
  return {
    ok: false,
    code: 'conductor_missing_api',
    message: 'aurora-conductor does not export compose(); update conductor-adapter.ts to match current API',
    artifact: { error: 'missing compose()' }
  };
}
