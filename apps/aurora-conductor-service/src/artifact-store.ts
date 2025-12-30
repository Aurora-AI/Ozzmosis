import fs from 'fs';
import path from 'path';

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function writeJson(dir: string, id: string, payload: unknown) {
  ensureDir(dir);
  const safeId = id.replace(/[^a-zA-Z0-9._-]/g, '_');
  const file = path.join(dir, `${safeId}.json`);
  fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf8');
  return file;
}

export function readJson(dir: string, id: string) {
  const safeId = id.replace(/[^a-zA-Z0-9._-]/g, '_');
  const file = path.join(dir, `${safeId}.json`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}
