'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    ArrowLeft,
    Building2,
    Home as HomeIcon,
    LayoutDashboard,
    Loader2,
    LogOut,
    Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/hostels', label: 'Hostels', icon: Building2, exact: false },
    { href: '/admin/hostels/new', label: 'Add Hostel', icon: Plus, exact: true },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    async function onLogout() {
        if (loggingOut) return;
        setLoggingOut(true);
        await fetch('/auth/signout', { method: 'POST' });
        router.replace('/');
        router.refresh();
    }

    return (
        <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-6 card-surface flex flex-col p-4">
                <Link
                    href="/admin"
                    className="mb-4 flex items-center gap-2.5 rounded-xl px-2 py-1.5 focus-ring"
                >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
                        <HomeIcon className="h-5 w-5" />
                    </span>
                    <span className="flex flex-col leading-none">
                        <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                            HostelMate
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                            Admin
                        </span>
                    </span>
                </Link>

                <nav className="flex flex-col gap-1">
                    {NAV.map(({ href, label, icon: Icon, exact }) => {
                        const active = exact ? pathname === href : pathname?.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                                    active
                                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to HostelMate
                    </Link>

                    <button
                        type="button"
                        onClick={onLogout}
                        disabled={loggingOut}
                        className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                        {loggingOut ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <LogOut className="h-4 w-4" />
                        )}
                        {loggingOut ? 'Logging out…' : 'Logout'}
                    </button>
                </div>
            </div>
        </aside>
    );
}