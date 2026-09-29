'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // The /auth/callback route already set the session cookie after
        // exchanging the recovery code, so getUser() should succeed here.
        const supabase = getSupabaseBrowserClient();
        supabase.auth
            .getUser()
            .then((res: { data: { user: { id: string } | null } }) => {
                if (res.data.user) setReady(true);
                else setError('Your reset link has expired. Please request a new one.');
            });
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;
        setError(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        try {
            const supabase = getSupabaseBrowserClient();
            const { error: updateError } = await supabase.auth.updateUser({
                password,
            });
            if (updateError) {
                setError(updateError.message);
                setSubmitting(false);
                return;
            }
            router.replace('/login');
        } catch {
            setError('Unable to reset password. Please try again.');
            setSubmitting(false);
        }
    }

    return (
        <div className="card-surface p-6 sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Set a new password
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                Choose a new password for your HostelMate account.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                    <label
                        htmlFor="rp-password"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            id="rp-password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={!ready}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="rp-confirm"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                        Confirm New Password
                    </label>
                    <input
                        id="rp-confirm"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        disabled={!ready}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white"
                    />
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                    >
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={submitting || !ready}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitting ? 'Updating…' : 'Update password'}
                </button>
            </form>
        </div>
    );
}