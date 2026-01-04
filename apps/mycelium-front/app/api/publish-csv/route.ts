import { NextResponse } from 'next/server';
import { parseCalceleveCsv } from '@/lib/analytics/csv/parseCalceleveCsv';
import { normalizeProposals } from '@/lib/analytics/normalize/normalizeProposals';
import { computeSnapshot } from '@/lib/analytics/compute/computeSnapshot';
import { publishSnapshot } from '@/lib/publisher';
import { verifyAdminCookie } from '@/lib/admin/auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('x-admin-token') || '';
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
    const headerOk = !!ADMIN_TOKEN && token === ADMIN_TOKEN;
    let cookieOk = false;
    if (!headerOk) {
      try {
        const cookieStore = await cookies();
        const cookie = cookieStore.get('mycelium_admin')?.value;
        cookieOk = cookie ? await verifyAdminCookie(cookie) : false;
      } catch {
        cookieOk = false;
      }
    }
    if (!headerOk && !cookieOk) return unauthorized();

    const form = await req.formData();
    const file = form.get('file') as unknown;
    const fileText = (file as any)?.text;

    if (typeof fileText !== 'function') {
      return NextResponse.json({ error: 'MISSING_FILE' }, { status: 400 });
    }

    const text = await fileText.call(file);
    const rows = parseCalceleveCsv(text);
    const proposals = normalizeProposals(rows);
    const snapshot = computeSnapshot(proposals);

    await publishSnapshot(snapshot);

    return NextResponse.json({ ok: true, proposals: proposals.length }, { status: 200 });
  } catch (error) {
    console.error("PUBLISH_CSV_FAILED", error);
    return NextResponse.json({ error: 'PUBLISH_CSV_FAILED' }, { status: 500 });
  }
}
