import { NextRequest, NextResponse } from 'next/server';
import { getAdminOrNull } from '@/lib/admin/require-admin';
import { updateHostel, deleteHostel } from '@/lib/admin/hostel-write';

export const dynamic = 'force-dynamic';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const admin = await getAdminOrNull();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = (await req.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    const result = await updateHostel(params.id, body);
    if (!result.ok) {
        return NextResponse.json(
            { error: result.error, fieldErrors: result.fieldErrors },
            { status: result.status },
        );
    }
    return NextResponse.json({ data: result.data });
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } },
) {
    const admin = await getAdminOrNull();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const result = await deleteHostel(params.id);
    if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true });
}