import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';
import fs from 'fs';
import { loadEnv } from './config.js';
import { requireBearerAuth } from './auth.js';
import { ComposeRequestSchema } from './types.js';
import { runCompose } from './conductor-adapter.js';
import { writeJson, readJson } from './artifact-store.js';

const env = loadEnv();

async function checkArtifactDirReady(dir: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  try {
    const stat = await fs.promises.stat(dir);
    if (!stat.isDirectory()) return { ok: false, reason: 'artifact_dir_not_directory' };
  } catch {
    return { ok: false, reason: 'artifact_dir_missing' };
  }

  try {
    await fs.promises.access(dir, fs.constants.W_OK);
    return { ok: true };
  } catch {
    return { ok: false, reason: 'artifact_dir_not_writable' };
  }
}

const app = new Elysia({ adapter: node() })
  .onError(({ error }) => {
    // Log hygiene: nunca logar payload, headers, env
    const name =
      typeof (error as { name?: unknown }).name === 'string' ? (error as { name: string }).name : 'unknown';
    const message =
      typeof (error as { message?: unknown }).message === 'string'
        ? (error as { message: string }).message
        : typeof error === 'string'
          ? error
          : 'unknown';
    console.error('[conductor-service] error', { name, message });
    return new Response(
      JSON.stringify({ ok: false, code: 'internal_error', message: 'Internal error' }),
      { status: 503, headers: { 'content-type': 'application/json' } }
    );
  })
  .get('/health', () => ({ ok: true, service: 'aurora-conductor-service', status: 'healthy' }))
  .get('/readiness', async ({ set }) => {
    const dir = env.CONDUCTOR_ARTIFACT_DIR;
    const ready = await checkArtifactDirReady(dir);
    if (!ready.ok) {
      set.status = 503;
      return { status: 'not_ready', reason: ready.reason };
    }
    set.status = 200;
    return { status: 'ready' };
  })
  .post('/compose', async ({ request, set }) => {
    const auth = requireBearerAuth(env, request.headers.get('authorization'));
    if (!auth.ok) {
      set.status = 403;
      return auth;
    }

    const body = await request.json().catch(() => null);
    const parsed = ComposeRequestSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { ok: false, code: 'invalid_request', message: 'Invalid request payload', details: parsed.error.format() };
    }

    const result = await runCompose(parsed.data);
    const artifactId = parsed.data.id;

    // Sempre gera um artifact JSON mínimo (mesmo em falha), para auditoria determinística
    const artifactPayload = {
      meta: {
        id: artifactId,
        createdAt: new Date().toISOString(),
        policyMode: parsed.data.policy.mode
      },
      result
    };

    const artifactPath = writeJson(env.CONDUCTOR_ARTIFACT_DIR, artifactId, artifactPayload);

    if (!result.ok) {
      set.status = 422;
      return { ok: false, code: result.code ?? 'compose_failed', message: result.message ?? 'Compose failed', artifactId, artifactPath };
    }

    set.status = 200;
    return { ok: true, artifactId, artifactPath };
  })
  .get('/artifacts/:id', ({ params, set, request }) => {
    const auth = requireBearerAuth(env, request.headers.get('authorization'));
    if (!auth.ok) {
      set.status = 403;
      return auth;
    }

    const content = readJson(env.CONDUCTOR_ARTIFACT_DIR, params.id);
    if (!content) {
      set.status = 404;
      return { ok: false, code: 'not_found', message: 'Artifact not found' };
    }

    set.status = 200;
    return new Response(content, { headers: { 'content-type': 'application/json' } });
  });

app.listen(env.CONDUCTOR_PORT);

console.log('[conductor-service] listening', { port: env.CONDUCTOR_PORT });
