'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    CheckCircle2,
    EyeOff,
    Loader2,
    Pencil,
    Star,
    Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import type { HostelRow } from '@/lib/types';

interface Props {
    rows: HostelRow[];
}

export function HostelTable({ rows }: Props) {
    const router = useRouter();
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<HostelRow | null>(null);

    async function togglePublish(row: HostelRow) {
        if (pendingId) return;
        setPendingId(row.id);
        try {
            const res = await fetch(`/api/admin/hostels/${row.id}/publish`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_published: !row.is_published }),
            });
            if (!res.ok) {
                toast('Unable to update publication status.');
                return;
            }
            toast(row.is_published ? 'Hostel unpublished successfully.' : 'Hostel published successfully.');
            router.refresh();
        } catch {
            toast('Unable to update publication status.');
        } finally {
            setPendingId(null);
        }
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        const id = deleteTarget.id;
        setPendingId(id);
        try {
            const res = await fetch(`/api/admin/hostels/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                toast('Unable to delete hostel.');
                return;
            }
            toast('Hostel deleted successfully.');
            setDeleteTarget(null);
            router.refresh();
        } catch {
            toast('Unable to delete hostel.');
        } finally {
            setPendingId(null);
        }
    }

    if (rows.length === 0) {
        return (
            <div className="card-surface p-12 text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    No hostels found for the current filters.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="card-surface overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">City</th>
                                <th className="px-4 py-3">Rating</th>
                                <th className="px-4 py-3">Rent</th>
                                <th className="px-4 py-3">Verification</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 dark:border-slate-800/70 dark:hover:bg-slate-800/30"
                                >
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {row.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {row.area || '—'}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                        {row.city}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.google_rating != null ? (
                                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                <Star className="h-3.5 w-3.5 fill-current" />
                                                {Number(row.google_rating).toFixed(1)}
                                                {row.google_review_count != null && (
                                                    <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                                                        ({row.google_review_count})
                                                    </span>
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                        {row.monthly_rent != null
                                            ? `₹${row.monthly_rent.toLocaleString('en-IN')}`
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-xs">
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            {row.verification_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.is_published ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                                <CheckCircle2 className="h-3 w-3" /> Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                                                <EyeOff className="h-3 w-3" /> Unpublished
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => togglePublish(row)}
                                                disabled={pendingId === row.id}
                                                className={cn(
                                                    'inline-flex h-8 items-center rounded-lg px-2.5 text-xs font-medium transition disabled:opacity-50',
                                                    row.is_published
                                                        ? 'text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-500/10'
                                                        : 'text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10',
                                                )}
                                            >
                                                {pendingId === row.id ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : row.is_published ? (
                                                    'Unpublish'
                                                ) : (
                                                    'Publish'
                                                )}
                                            </button>

                                            <Link
                                                href={`/admin/hostels/${row.id}/edit`}
                                                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                            >
                                                <Pencil className="h-3.5 w-3.5" /> Edit
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget(row)}
                                                disabled={pendingId === row.id}
                                                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {deleteTarget && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="w-full max-w-md card-surface p-6">
                        <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                            Delete this hostel?
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            This will permanently remove <strong>{deleteTarget.name}</strong> and
                            any favourites linked to it. This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                disabled={pendingId === deleteTarget.id}
                                className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={pendingId === deleteTarget.id}
                                className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                                {pendingId === deleteTarget.id && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                Delete Hostel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}