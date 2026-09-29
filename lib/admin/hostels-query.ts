import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { HostelRow } from '@/lib/types';

export interface AdminHostelListParams {
    q?: string;
    city?: string;
    published?: 'all' | 'published' | 'unpublished';
    verification?: string;
    availability?: string;
    page: number;
    limit: number;
}

export interface AdminHostelListResult {
    rows: HostelRow[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export async function queryAdminHostels(
    params: AdminHostelListParams,
): Promise<AdminHostelListResult> {
    const supabase = getSupabaseServerClient();
    let q = supabase.from('hostels').select('*', { count: 'exact' });

    if (params.city) q = q.eq('city', params.city);
    if (params.published === 'published') q = q.eq('is_published', true);
    if (params.published === 'unpublished') q = q.eq('is_published', false);
    if (params.verification) q = q.eq('verification_status', params.verification);
    if (params.availability) q = q.eq('availability', params.availability);

    if (params.q) {
        const like = `%${params.q.replace(/[%_]/g, '')}%`;
        q = q.or(
            `name.ilike.${like},city.ilike.${like},area.ilike.${like}`,
        );
    }

    q = q.order('updated_at', { ascending: false });

    const offset = (params.page - 1) * params.limit;
    q = q.range(offset, offset + params.limit - 1);

    const { data, count, error } = await q;

    if (error) {
        console.error('[queryAdminHostels]', error);
        throw new Error(error.message);
    }

    const total = count ?? 0;
    const totalPages = total === 0 ? 0 : Math.ceil(total / params.limit);

    return {
        rows: (data ?? []) as HostelRow[],
        total,
        page: params.page,
        limit: params.limit,
        totalPages,
    };
}