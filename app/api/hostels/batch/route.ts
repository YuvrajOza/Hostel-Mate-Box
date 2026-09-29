import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { rowToHostel } from '@/lib/hostels/repository';
import { computeRankingScore } from '@/lib/hostels/ranking';
import type { HostelRow } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const raw = req.nextUrl.searchParams.get('ids') ?? '';
    const ids = raw
        .split(',')
        .map((s) => s.trim())
        .filter((s) => /^[A-Za-z0-9_-]{1,64}$/.test(s))
        .slice(0, 3);

    if (ids.length === 0) {
        return NextResponse.json({ data: [] });
    }

    try {
        const supabase = getSupabaseServerClient();
        const { data, error } = await supabase
            .from('hostels')
            .select('*')
            .in('id', ids)
            .eq('is_published', true);

        if (error) {
            console.error('[GET /api/hostels/batch]', error);
            return NextResponse.json(
                { error: 'Unable to load hostels.' },
                { status: 500 },
            );
        }

        const rows = (data ?? []) as HostelRow[];
        const hostels = rows.map((r) => {
            const h = rowToHostel(r);
            return { ...h, rankingScore: computeRankingScore(h) };
        });

        // Preserve caller order; silently drop IDs that no longer exist.
        const byId = new Map(hostels.map((h) => [h.id, h]));
        const ordered = ids
            .map((id) => byId.get(id))
            .filter((h): h is NonNullable<typeof h> => Boolean(h));

        return NextResponse.json(
            { data: ordered },
            { headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (err) {
        console.error('[GET /api/hostels/batch]', err);
        return NextResponse.json(
            { error: 'Unable to load hostels.' },
            { status: 500 },
        );
    }
}