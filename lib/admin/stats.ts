import { getSupabaseServerClient } from '@/lib/supabase/server';

export interface AdminStats {
    total: number;
    published: number;
    unpublished: number;
    byCity: { Ahmedabad: number; Anand: number; Vadodara: number };
}

export async function getAdminStats(): Promise<AdminStats> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
        .from('hostels')
        .select('city, is_published');

    if (error) {
        console.error('[getAdminStats]', error);
        return {
            total: 0,
            published: 0,
            unpublished: 0,
            byCity: { Ahmedabad: 0, Anand: 0, Vadodara: 0 },
        };
    }

    const rows = (data ?? []) as { city: string; is_published: boolean }[];
    const total = rows.length;
    const published = rows.filter((r) => r.is_published).length;
    const unpublished = total - published;

    const byCity = {
        Ahmedabad: rows.filter((r) => r.city === 'Ahmedabad').length,
        Anand: rows.filter((r) => r.city === 'Anand').length,
        Vadodara: rows.filter((r) => r.city === 'Vadodara').length,
    };

    return { total, published, unpublished, byCity };
}