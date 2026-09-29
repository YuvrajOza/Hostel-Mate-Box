import { NextRequest, NextResponse } from 'next/server';
import { getHostelById } from '@/lib/hostels/service';
import { isAdmin } from '@/lib/admin/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } },
) {
    const { id } = params;
    if (!id || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) {
        return NextResponse.json({ error: 'Invalid hostel id.' }, { status: 400 });
    }

    try {
        const hostel = await getHostelById(id);
        if (!hostel) {
            return NextResponse.json({ error: 'Hostel not found.' }, { status: 404 });
        }
        return NextResponse.json(hostel, {
            headers: { 'Cache-Control': 'no-store' },
        });
    } catch (err) {
        console.error(`[GET /api/hostels/${id}]`, err);
        return NextResponse.json(
            { error: 'Unable to load hostel information.' },
            { status: 500 },
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
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
            .update(body as Record<string, unknown>)
            .eq('id', params.id)
            .select()
            .maybeSingle();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        if (!data) {
            return NextResponse.json({ error: 'Hostel not found.' }, { status: 404 });
        }
        return NextResponse.json({ data });
    } catch (err) {
        console.error(`[PATCH /api/hostels/${params.id}]`, err);
        return NextResponse.json(
            { error: 'Unable to update hostel.' },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    try {
        const supabase = getSupabaseAdminClient();
        const { error } = await supabase
            .from('hostels')
            .delete()
            .eq('id', params.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(`[DELETE /api/hostels/${params.id}]`, err);
        return NextResponse.json(
            { error: 'Unable to delete hostel.' },
            { status: 500 },
        );
    }
}