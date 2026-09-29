'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Building2,
    Home as HomeIcon,
    LayoutDashboard,
    Loader2,
    LogOut,
    Menu,
    Plus,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/hostels', label: 'Hostels', icon: Building2, exact: false },
    { href: '/admin/hostels/new', label: 'Add Hostel', icon: Plus, exact: true },
];

export function AdminMobileHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    async function onLogout() {
        if (loggingOut) return;
        setLoggingOut(true);
        await fetch('/auth/signout', { method: 'POST' });
        router.replace('/');
        router.refresh();
    }

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-[#0B1220]">
            <div className="flex h-14 items-center justify-between px-4">
                <Link href="/admin" className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
                        <HomeIcon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        Admin
                    </span>
                </Link>

                <button
                    type="button"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                    {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
            </div>

            {open && (
                <nav className="border-t border-slate-200 px-3 py-2 dark:border-slate-800">
                    {NAV.map(({ href, label, icon: Icon, exact }) => {
                        const active = exact ? pathname === href : pathname?.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
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

                    <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="mt-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to HostelMate
                    </Link>

                    <button
                        type="button"
                        onClick={onLogout}
                        disabled={loggingOut}
                        className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                        {loggingOut ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <LogOut className="h-4 w-4" />
                        )}
                        {loggingOut ? 'Logging out…' : 'Logout'}
                    </button>
                </nav>
            )}
        </header>
    );
}