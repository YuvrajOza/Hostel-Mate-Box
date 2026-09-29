import { getSupabaseServerClient } from '@/lib/supabase/server';

export const CITIES = ['Ahmedabad', 'Anand', 'Vadodara'] as const;
export type City = (typeof CITIES)[number];

export interface CitySummary {
    city: City;
    count: number;
}

export const CITY_DESCRIPTIONS: Record<City, string> = {
    Ahmedabad:
        'Explore hostels near colleges, universities and major student areas.',
    Anand:
        'Discover student accommodation around Anand and Vallabh Vidyanagar.',
    Vadodara:
        "Explore hostels and PGs near Vadodara's major educational areas.",
};

/**
 * Returns the number of PUBLISHED hostels for each of the three cities.
 * Cities with zero published hostels are still returned with count 0,
 * so the UI can show a consistent card with "No hostels listed yet".
 */
export async function getCityCounts(): Promise<CitySummary[]> {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
        .from('hostels')
        .select('city')
        .eq('is_published', true)
        .in('city', CITIES as unknown as string[]);

    if (error) {
        console.error('[getCityCounts]', error);
        return CITIES.map((city) => ({ city, count: 0 }));
    }

    const counts = new Map<string, number>();
    for (const row of (data ?? []) as { city: string }[]) {
        counts.set(row.city, (counts.get(row.city) ?? 0) + 1);
    }

    return CITIES.map((city) => ({ city, count: counts.get(city) ?? 0 }));
}