import type { ConductorEnv } from './config.js';

export function requireBearerAuth(env: ConductorEnv, authHeader?: string | null) {
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
  if (!token || token !== env.CONDUCTOR_TOKEN) {
    return { ok: false as const, code: 'auth_invalid', message: 'Invalid or missing bearer token' };
  }
  return { ok: true as const };
}
