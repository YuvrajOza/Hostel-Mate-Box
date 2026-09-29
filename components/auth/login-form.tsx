'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleButton } from './google-button';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from '@/components/ui/toast';

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextParam = searchParams.get('redirect') ?? searchParams.get('next');
    const initialError = searchParams.get('error');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(initialError);

    useEffect(() => {
        if (initialError) toast(initialError);
    }, [initialError]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;

        setError(null);

        if (!email.trim()) {
            setError('Please enter your email.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!password) {
            setError('Please enter your password.');
            return;
        }

        setSubmitting(true);
        try {
            const supabase = getSupabaseBrowserClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (signInError) {
                setError(
                    signInError.message.toLowerCase().includes('invalid')
                        ? 'Invalid email or password.'
                        : signInError.message,
                );
                setSubmitting(false);
                return;
            }

            toast('Welcome back!');
            router.replace(nextParam || '/hostels');
            router.refresh();
        } catch {
            setError('Unable to sign in. Please try again.');
            setSubmitting(false);
        }
    }

    return (
        <div className="card-surface p-6 sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                Sign in to save hostels and compare them later.
            </p>

            <div className="mt-6">
                <GoogleButton next={nextParam ?? undefined} />
            </div>

            <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    or
                </span>
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <div>
                    <label
                        htmlFor="login-email"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                        Email
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white dark:placeholder:text-slate-500"
                    />
                </div>

                <div>
                    <div className="mb-1 flex items-center justify-between">
                        <label
                            htmlFor="login-password"
                            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                        >
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white dark:placeholder:text-slate-500"
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
                    {submitting ? 'Signing in…' : 'Login'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                Don&apos;t have an account?{' '}
                <Link
                    href={
                        nextParam
                            ? `/signup?redirect=${encodeURIComponent(nextParam)}`
                            : '/signup'
                    }
                    className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                    Create Account
                </Link>
            </p>
        </div>
    );
}