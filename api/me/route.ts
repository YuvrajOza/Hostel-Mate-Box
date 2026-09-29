import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = getSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ user: null });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle<{
            role: string;
            full_name: string | null;
            avatar_url: string | null;
        }>();

    return NextResponse.json({
        user: {
            id: user.id,
            email: user.email ?? null,
            role: profile?.role ?? 'user',
            fullName: profile?.full_name ?? null,
            avatarUrl: profile?.avatar_url ?? null,
        },
    });
}