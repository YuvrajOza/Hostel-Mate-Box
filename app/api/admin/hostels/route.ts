import { NextRequest, NextResponse } from 'next/server';
import { getAdminOrNull } from '@/lib/admin/require-admin';
import { createHostel } from '@/lib/admin/hostel-write';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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

    const result = await createHostel(body, admin.id);
    if (!result.ok) {
        return NextResponse.json(
            { error: result.error, fieldErrors: result.fieldErrors },
            { status: result.status },
        );
    }
    return NextResponse.json({ data: result.data }, { status: 201 });
}