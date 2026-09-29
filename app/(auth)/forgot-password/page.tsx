'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;
        setError(null);

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setSubmitting(true);
        try {
            const supabase = getSupabaseBrowserClient();
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(
                email.trim(),
                {
                    redirectTo:
                        typeof window !== 'undefined'
                            ? `${window.location.origin}/auth/callback?next=/reset-password`
                            : undefined,
                },
            );

            if (resetError) {
                setError(resetError.message);
                setSubmitting(false);
                return;
            }
            // Do not reveal whether the email exists.
            setSent(true);
        } catch {
            setError('Unable to send reset email. Please try again.');
            setSubmitting(false);
        }
    }

    if (sent) {
        return (
            <div className="card-surface p-6 sm:p-8 text-center">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Check your email
                </h1>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    Password reset instructions have been sent to your email.
                </p>
                <Link
                    href="/login"
                    className="mt-6 inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <div className="card-surface p-6 sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Forgot password?
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                    <label
                        htmlFor="fp-email"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                        Email
                    </label>
                    <input
                        id="fp-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white"
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
                    disabled={submitting}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitting ? 'Sending…' : 'Send reset link'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                Remembered it?{' '}
                <Link
                    href="/login"
                    className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                    Back to login
                </Link>
            </p>
        </div>
    );
}