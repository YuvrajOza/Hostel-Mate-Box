import { NextRequest, NextResponse } from 'next/server';
import { parseSearchParams } from '@/lib/hostels/filters';
import { getHostels } from '@/lib/hostels/service';
import { isAdmin } from '@/lib/admin/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const raw: Record<string, string> = {};
        req.nextUrl.searchParams.forEach((v, k) => {
            raw[k] = v;
        });

        const params = parseSearchParams(raw);
        const result = await getHostels(params);

        return NextResponse.json(result, {
            headers: { 'Cache-Control': 'no-store' },
        });
    } catch (err) {
        console.error('[GET /api/hostels]', err);
        return NextResponse.json(
            { error: 'Unable to load hostels.' },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
        return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
    }

    try {
        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
            .from('hostels')
            .insert(body as Record<string, unknown>)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ data }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/hostels]', err);
        return NextResponse.json(
            { error: 'Unable to create hostel.' },
            { status: 500 },
        );
    }
}