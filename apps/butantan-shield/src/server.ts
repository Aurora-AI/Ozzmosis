import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';

const port = Number(process.env.SHIELD_PORT ?? '4001');

const app = new Elysia({ adapter: node() })
  .get('/health', () => ({ ok: true }))
  .listen(port);

console.log(`[butantan-shield] listening on :${port}`);
