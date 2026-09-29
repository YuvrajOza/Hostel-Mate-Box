'use client';

import Link from 'next/link';
import { useUser } from './use-user';
import { UserMenu } from './user-menu';

export function AuthButtons() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="hidden h-10 w-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800 sm:block" />
        );
    }

    if (user) return <UserMenu />;

    return (
        <>
            <Link
                href="/login"
                className="hidden h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-ring dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200 dark:hover:bg-slate-800 sm:inline-flex"
            >
                Login
            </Link>
            <Link
                href="/signup"
                className="hidden h-10 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-ring sm:inline-flex"
            >
                Sign Up
            </Link>
        </>
    );
}