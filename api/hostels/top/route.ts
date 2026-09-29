import { NextRequest, NextResponse } from 'next/server';
import { getTopHostels } from '@/lib/hostels/service';

export const dynamic = 'force-dynamic';

const CITIES = new Set(['Ahmedabad', 'Anand', 'Vadodara']);

export async function GET(req: NextRequest) {
    const city = req.nextUrl.searchParams.get('city') ?? '';
    const limitRaw = req.nextUrl.searchParams.get('limit');
    const limit = Math.max(1, Math.min(10, Number(limitRaw) || 10));

    if (!CITIES.has(city)) {
        return NextResponse.json({ error: 'Invalid city.' }, { status: 400 });
    }

    try {
        const data = await getTopHostels(city, limit);
        return NextResponse.json({ data, city, limit });
    } catch (err) {
        console.error('[GET /api/hostels/top]', err);
        return NextResponse.json(
            { error: 'Unable to load hostel information.' },
            { status: 500 },
        );
    }
}