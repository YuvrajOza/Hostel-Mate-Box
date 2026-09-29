import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export interface AdminUser {
    id: string;
    email: string | null;
}

export async function requireAdminPage(): Promise<AdminUser> {
    const supabase = getSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/admin');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle<{ role: string }>();

    if (!profile || profile.role !== 'admin') {
        redirect('/forbidden');
    }

    return { id: user.id, email: user.email ?? null };
}

export async function getAdminOrNull(): Promise<AdminUser | null> {
    const supabase = getSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle<{ role: string }>();

    if (!profile || profile.role !== 'admin') return null;

    return { id: user.id, email: user.email ?? null };
}