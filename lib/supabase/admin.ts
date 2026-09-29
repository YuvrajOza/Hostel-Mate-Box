import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { publicEnv, getServerEnv } from '@/lib/env';

let cached: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
    if (cached) return cached;
    const { supabaseServiceRoleKey } = getServerEnv();
    if (!publicEnv.supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Supabase admin env vars are not configured.');
    }
    cached = createClient(publicEnv.supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    return cached;
}