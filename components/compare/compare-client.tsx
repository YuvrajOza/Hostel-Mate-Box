'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { CompareTable } from './compare-table';
import { CompareEmpty } from './compare-empty';
import { useCompare } from '@/lib/compare-store';
import { useUser } from '@/components/auth/use-user';
import type { Hostel } from '@/lib/types';

export function CompareClient() {
    const { ids, remove, clear } = useCompare();
    const { user } = useUser();

    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
    const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
        'idle',
    );

    // Fetch hostel details whenever the compare set changes.
    useEffect(() => {
        if (ids.length === 0) {
            setHostels([]);
            setStatus('ready');
            return;
        }
        let cancelled = false;
        setStatus('loading');

        fetch(`/api/hostels/batch?ids=${ids.join(',')}`)
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((data: { data: Hostel[] }) => {
                if (cancelled) return;
                setHostels(data.data ?? []);
                setStatus('ready');
            })
            .catch(() => {
                if (cancelled) return;
                setStatus('error');
            });

        return () => {
            cancelled = true;
        };
    }, [ids]);

    // Fetch the user's favourite IDs so the ♡/♥ button shows correct state.
    useEffect(() => {
        if (!user) {
            setFavouriteIds(new Set());
            return;
        }
        let cancelled = false;
        fetch('/api/favourites')
            .then((r) => (r.ok ? r.json() : { hostelIds: [] }))
            .then((data: { hostelIds?: string[] }) => {
                if (cancelled) return;
                setFavouriteIds(new Set(data.hostelIds ?? []));
            })
            .catch(() => { });
        return () => {
            cancelled = true;
        };
    }, [user]);

    return (
        <div className="container-page py-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <Link
                        href="/hostels"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to hostels
                    </Link>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Compare Hostels
                    </h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Up to 3 hostels side by side.
                    </p>
                </div>

                {ids.length > 0 && (
                    <button
                        type="button"
                        onClick={clear}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <Trash2 className="h-4 w-4" /> Clear all
                    </button>
                )}
            </div>

            {ids.length === 0 && <CompareEmpty />}

            {ids.length > 0 && status === 'loading' && (
                <div className="card-surface flex items-center justify-center gap-2 p-12 text-sm text-slate-500 dark:text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading hostels…
                </div>
            )}

            {ids.length > 0 && status === 'error' && (
                <div className="card-surface p-12 text-center">
                    <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                        Unable to load hostels.
                    </p>
                </div>
            )}

            {ids.length > 0 && status === 'ready' && hostels.length > 0 && (
                <div className="card-surface overflow-hidden p-2 sm:p-4">
                    <CompareTable
                        hostels={hostels}
                        onRemove={remove}
                        favouriteIds={favouriteIds}
                    />
                </div>
            )}
        </div>
    );
}