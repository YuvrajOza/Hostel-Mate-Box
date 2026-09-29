import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { Hostel } from '@/lib/types';
import { rowToHostel } from '@/lib/hostels/repository';
import type { HostelRow } from '@/lib/types';

export async function getUserFavouriteIds(): Promise<string[]> {
    const supabase = getSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('favourites')
        .select('hostel_id')
        .eq('user_id', user.id);

    if (error) {
        console.error('[getUserFavouriteIds]', error);
        return [];
    }
    return (data ?? []).map((r: { hostel_id: string }) => r.hostel_id);
}

export async function getFavouriteCount(): Promise<number> {
    const supabase = getSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
        .from('favourites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    if (error) return 0;
    return count ?? 0;
}

export async function isFavourited(hostelId: string): Promise<boolean> {
    const supabase = getSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
        .from('favourites')
        .select('id')
        .eq('user_id', user.id)
        .eq('hostel_id', hostelId)
        .maybeSingle();

    if (error) return false;
    return Boolean(data);
}

/**
 * Fetches the actual hostel rows the user has favourited.
 * Unpublished hostels are silently excluded from the returned list,
 * but returned as `unavailable` so the page can show a placeholder.
 */
export async function getUserFavouriteHostels(): Promise<{
    hostels: Hostel[];
    unavailableCount: number;
}> {
    const supabase = getSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { hostels: [], unavailableCount: 0 };

    const { data: favRows, error: favError } = await supabase
        .from('favourites')
        .select('hostel_id')
        .eq('user_id', user.id);

    if (favError || !favRows || favRows.length === 0) {
        return { hostels: [], unavailableCount: 0 };
    }

    const ids = favRows.map((r: { hostel_id: string }) => r.hostel_id);

    const { data: hostelRows, error: hostelError } = await supabase
        .from('hostels')
        .select('*')
        .in('id', ids)
        .eq('is_published', true);

    if (hostelError) {
        console.error('[getUserFavouriteHostels]', hostelError);
        return { hostels: [], unavailableCount: 0 };
    }

    const rows = (hostelRows ?? []) as HostelRow[];
    const hostels = rows.map(rowToHostel);
    const unavailableCount = ids.length - hostels.length;

    return { hostels, unavailableCount };
}