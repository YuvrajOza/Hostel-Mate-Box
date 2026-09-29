import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { publicEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/hostels';
    const errorDescription = searchParams.get('error_description');

    if (errorDescription) {
        const url = new URL('/login', origin);
        url.searchParams.set('error', errorDescription);
        return NextResponse.redirect(url);
    }

    if (!code) {
        const url = new URL('/login', origin);
        url.searchParams.set('error', 'Missing authentication code.');
        return NextResponse.redirect(url);
    }

    // Build a mutable response so cookie writes stick.
    let response = NextResponse.redirect(new URL(next, origin));

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

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        const url = new URL('/login', origin);
        url.searchParams.set('error', error.message);
        response = NextResponse.redirect(url);
    }

    return response;
}