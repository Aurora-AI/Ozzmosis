import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';

const port = Number(process.env.SHIELD_PORT ?? '4001');
const shieldToken = process.env.SHIELD_TOKEN;

function requireBearer(authHeader: string | null) {
  if (!shieldToken) return { ok: true as const };
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
  if (token !== shieldToken) {
    return { ok: false as const, code: 'auth_invalid', message: 'Invalid or missing bearer token' };
  }
  return { ok: true as const };
}

function isoWithOffsetNow() {
  const d = new Date();
  const tz = -d.getTimezoneOffset();
  const sign = tz >= 0 ? '+' : '-';
  const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  const hh = pad(tz / 60);
  const mm = pad(tz % 60);
  const base = d.toISOString().replace('Z', '');
  return `${base}${sign}${hh}:${mm}`;
}

const app = new Elysia({ adapter: node() })
  .get('/health', () => ({ ok: true }))
  .get('/proxy/tasks', ({ request, set }) => {
    const auth = requireBearer(request.headers.get('authorization'));
    if (!auth.ok) {
      set.status = 403;
      return auth;
    }

    set.status = 200;
    return [
      {
        id: '6d3b4a80-7c7a-4b88-8f2e-4b18e2d2a9a1',
        projectId: '4c3b9b7f-2f0a-4b55-9f64-7fcb84a1f0f1',
        title: 'Genesis: Chronos Plug-and-Play',
        effort: 13,
        dependencies: [],
        assignee: 'owner@aurora.local'
      },
      {
        id: '9f1acb6d-3b71-45b3-ae49-0b6f7b8d5a33',
        projectId: '4c3b9b7f-2f0a-4b55-9f64-7fcb84a1f0f1',
        title: 'Elysian Lex: validar ciclo de deploy Vercel',
        effort: 8,
        dependencies: ['6d3b4a80-7c7a-4b88-8f2e-4b18e2d2a9a1'],
        assignee: 'owner@aurora.local'
      }
    ];
  })
  .get('/proxy/projects', ({ request, set }) => {
    const auth = requireBearer(request.headers.get('authorization'));
    if (!auth.ok) {
      set.status = 403;
      return auth;
    }

    set.status = 200;
    return [
      {
        id: '4c3b9b7f-2f0a-4b55-9f64-7fcb84a1f0f1',
        codeName: 'Elysian Legal Lex',
        biologicalStatus: 'VIVO',
        techStack: ['Next.js', 'Trustware', 'Elysian'],
        repositoryUrl: 'https://github.com/Aurora-AI/Elysian',
        owner: 'owner@aurora.local',
        lastVitalSign: isoWithOffsetNow()
      }
    ];
  })
  .listen(port);

console.log(`[butantan-shield] listening on :${port}`);
