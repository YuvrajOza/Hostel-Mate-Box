import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';
import { publicEnv } from '@/lib/env';

/**
 * Cookie-aware server client. Reads the auth session from Next.js cookies,
 * so server components and route handlers see the currently signed-in user.
 *
 * For anonymous read-only queries this still works exactly as before.
 */
export function getSupabaseServerClient(): SupabaseClient {
    if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
        throw new Error(
            'Supabase env vars are missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.',
        );
    }

    const cookieStore = cookies();

    return createServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                try {
                    cookieStore.set({ name, value, ...options });
                } catch {
                    // Called from a Server Component — safe to ignore; the middleware
                    // refreshes the session on the next request.
                }
            },
            remove(name: string, options: CookieOptions) {
                try {
                    cookieStore.set({ name, value: '', ...options });
                } catch {
                    // Same as above.
                }
            },
        },
    });
}