'use client';

import { createBrowserClient } from '@supabase/ssr';
import { publicEnv } from '@/lib/env';

let cached: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
    if (cached) return cached;
    if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
        throw new Error(
            'Supabase env vars are missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
        );
    }
    cached = createBrowserClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey);
    return cached;
}