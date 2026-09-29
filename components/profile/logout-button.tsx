'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';

export function LogoutButton() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    async function onLogout() {
        if (submitting) return;
        setSubmitting(true);
        await fetch('/auth/signout', { method: 'POST' });
        router.replace('/');
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={onLogout}
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-500/30 dark:bg-[#111A2E] dark:text-rose-400 dark:hover:bg-rose-500/10"
        >
            {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <LogOut className="h-4 w-4" />
            )}
            {submitting ? 'Logging out…' : 'Logout'}
        </button>
    );
}