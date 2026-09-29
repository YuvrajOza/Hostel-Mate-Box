import { NextRequest, NextResponse } from 'next/server';
import { getAdminOrNull } from '@/lib/admin/require-admin';
import { setPublishStatus } from '@/lib/admin/hostel-write';

export const dynamic = 'force-dynamic';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const admin = await getAdminOrNull();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let body: { is_published?: unknown };
    try {
        body = (await req.json()) as { is_published?: unknown };
    } catch {
        return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    if (typeof body.is_published !== 'boolean') {
        return NextResponse.json(
            { error: 'is_published must be boolean.' },
            { status: 400 },
        );
    }

    const result = await setPublishStatus(params.id, body.is_published);
    if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ data: result.data });
}