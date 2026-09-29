import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { publicEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const { origin } = new URL(request.url);
    let response = NextResponse.redirect(new URL('/', origin), { status: 303 });

    const supabase = createServerClient(
        publicEnv.supabaseUrl,
        publicEnv.supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        },
    );

    await supabase.auth.signOut();
    return response;
}