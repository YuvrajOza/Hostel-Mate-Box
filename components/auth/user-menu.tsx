'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ChevronDown,
    Heart,
    LayoutDashboard,
    LogOut,
    User as UserIcon,
} from 'lucide-react';
import { useUser } from './use-user';
import { cn } from '@/lib/utils';

export function UserMenu() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    // Fetch our own role (server verifies on every write anyway).
    useEffect(() => {
        if (!user) {
            setRole(null);
            return;
        }
        let cancelled = false;
        fetch('/api/me')
            .then((r) => (r.ok ? r.json() : null))
            .then((data: { user?: { role?: string } } | null) => {
                if (cancelled) return;
                setRole(data?.user?.role ?? 'user');
            })
            .catch(() => { });
        return () => {
            cancelled = true;
        };
    }, [user]);

    async function onLogout() {
        setOpen(false);
        await fetch('/auth/signout', { method: 'POST' });
        router.replace('/');
        router.refresh();
    }

    if (loading || !user) return null;

    const displayName =
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        user.email ||
        'Account';

    const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
    const initials = getInitials(displayName);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white pl-1.5 pr-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-ring dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200 dark:hover:bg-slate-800"
            >
                {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="" className="h-7 w-7 rounded-lg object-cover" />
                ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-xs font-semibold text-white">
                        {initials}
                    </span>
                )}
                <span className="hidden max-w-[120px] truncate sm:inline">
                    {displayName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+6px)] z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-[#111A2E]"
                >
                    <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {displayName}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {user.email}
                        </p>
                    </div>

                    <div className="p-1.5">
                        <MenuLink href="/profile" icon={<UserIcon className="h-4 w-4" />}>
                            Profile
                        </MenuLink>
                        <MenuLink href="/favourites" icon={<Heart className="h-4 w-4" />}>
                            Favourites
                        </MenuLink>
                        {role === 'admin' && (
                            <MenuLink
                                href="/admin"
                                icon={<LayoutDashboard className="h-4 w-4" />}
                            >
                                Admin Dashboard
                            </MenuLink>
                        )}
                    </div>

                    <div className="border-t border-slate-100 p-1.5 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onLogout}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function MenuLink({
    href,
    icon,
    children,
}: {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
            )}
            role="menuitem"
        >
            {icon}
            {children}
        </Link>
    );
}

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}