import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/** GET — list the current user's favourite IDs */
export async function GET() {
    const supabase = getSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('favourites')
        .select('hostel_id')
        .eq('user_id', user.id);

    if (error) {
        console.error('[GET /api/favourites]', error);
        return NextResponse.json(
            { error: 'Unable to load favourites.' },
            { status: 500 },
        );
    }

    return NextResponse.json({
        hostelIds: (data ?? []).map((r: { hostel_id: string }) => r.hostel_id),
    });
}

/** POST — add a favourite */
export async function POST(req: NextRequest) {
    const supabase = getSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let body: { hostelId?: unknown };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    const hostelId = typeof body.hostelId === 'string' ? body.hostelId.trim() : '';
    if (!hostelId || !/^[A-Za-z0-9_-]{1,64}$/.test(hostelId)) {
        return NextResponse.json(
            { error: 'Invalid hostel id.' },
            { status: 400 },
        );
    }

    // Confirm the hostel exists and is published before favouriting it.
    const { data: hostel } = await supabase
        .from('hostels')
        .select('id')
        .eq('id', hostelId)
        .eq('is_published', true)
        .maybeSingle();

    if (!hostel) {
        return NextResponse.json({ error: 'Hostel not found.' }, { status: 404 });
    }

    const { error } = await supabase.from('favourites').insert({
        user_id: user.id,
        hostel_id: hostelId,
    });

    // Duplicate is treated as success (unique constraint prevents dupes).
    if (error && !error.message.toLowerCase().includes('duplicate')) {
        console.error('[POST /api/favourites]', error);
        return NextResponse.json(
            { error: 'Unable to save favourite.' },
            { status: 500 },
        );
    }

    return NextResponse.json({ ok: true });
}

/** DELETE — remove a favourite */
export async function DELETE(req: NextRequest) {
    const supabase = getSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let body: { hostelId?: unknown };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    const hostelId = typeof body.hostelId === 'string' ? body.hostelId.trim() : '';
    if (!hostelId) {
        return NextResponse.json(
            { error: 'Invalid hostel id.' },
            { status: 400 },
        );
    }

    const { error } = await supabase
        .from('favourites')
        .delete()
        .eq('user_id', user.id)
        .eq('hostel_id', hostelId);

    if (error) {
        console.error('[DELETE /api/favourites]', error);
        return NextResponse.json(
            { error: 'Unable to remove favourite.' },
            { status: 500 },
        );
    }

    return NextResponse.json({ ok: true });
}