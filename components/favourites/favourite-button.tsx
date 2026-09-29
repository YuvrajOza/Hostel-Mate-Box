'use client';

import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { useRequireLogin } from '@/components/auth/require-login';
import { useUser } from '@/components/auth/use-user';

interface Props {
    hostelId: string;
    /** Initial state from the server, so the first paint is correct. */
    initialSaved?: boolean;
    variant?: 'icon' | 'button';
    className?: string;
}

export function FavouriteButton({
    hostelId,
    initialSaved = false,
    variant = 'icon',
    className,
}: Props) {
    const { user } = useUser();
    const { requireLogin } = useRequireLogin();
    const [saved, setSaved] = useState(initialSaved);
    const [pending, setPending] = useState(false);

    // If auth state changes (login/logout), refresh the saved state.
    useEffect(() => {
        if (!user) {
            setSaved(false);
            return;
        }
        let cancelled = false;
        fetch('/api/favourites')
            .then((r) => (r.ok ? r.json() : { hostelIds: [] }))
            .then((data: { hostelIds?: string[] }) => {
                if (cancelled) return;
                setSaved((data.hostelIds ?? []).includes(hostelId));
            })
            .catch(() => { });
        return () => {
            cancelled = true;
        };
    }, [user, hostelId]);

    async function onClick() {
        if (pending) return;

        if (!requireLogin()) return;

        setPending(true);
        const next = !saved;
        setSaved(next); // optimistic

        try {
            const res = await fetch('/api/favourites', {
                method: next ? 'POST' : 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hostelId }),
            });

            if (!res.ok) {
                setSaved(!next); // rollback
                const body = await res.json().catch(() => ({}));
                toast(body?.error ?? 'Unable to update favourite.');
                return;
            }

            toast(next ? 'Saved to favourites' : 'Removed from favourites');
        } catch {
            setSaved(!next);
            toast('Unable to update favourite.');
        } finally {
            setPending(false);
        }
    }

    if (variant === 'icon') {
        return (
            <button
                type="button"
                onClick={onClick}
                disabled={pending}
                aria-pressed={saved}
                aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
                className={cn(
                    'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition disabled:opacity-60',
                    saved
                        ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-rose-500 dark:border-slate-700 dark:bg-[#0B1220] dark:text-slate-400 dark:hover:bg-slate-800',
                    className,
                )}
            >
                {pending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
                )}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={pending}
            aria-pressed={saved}
            className={cn(
                'inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition disabled:opacity-60',
                saved
                    ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200 dark:hover:bg-slate-800',
                className,
            )}
        >
            {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
            )}
            {saved ? 'Saved' : 'Save'}
        </button>
    );
}