'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleButton } from './google-button';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from '@/components/ui/toast';

export function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextParam = searchParams.get('redirect') ?? searchParams.get('next');

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmationSent, setConfirmationSent] = useState(false);

    function validate(): string | null {
        if (!fullName.trim() || fullName.trim().length < 2) {
            return 'Please enter your full name.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'Please enter a valid email address.';
        }
        if (password.length < 8) {
            return 'Password must be at least 8 characters.';
        }
        if (password !== confirm) {
            return 'Passwords do not match.';
        }
        return null;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;

        const v = validate();
        if (v) {
            setError(v);
            return;
        }
        setError(null);
        setSubmitting(true);

        try {
            const supabase = getSupabaseBrowserClient();
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: { full_name: fullName.trim() },
                    emailRedirectTo:
                        typeof window !== 'undefined'
                            ? `${window.location.origin}/auth/callback${nextParam ? `?next=${encodeURIComponent(nextParam)}` : ''
                            }`
                            : undefined,
                },
            });

            if (signUpError) {
                setError(
                    signUpError.message.toLowerCase().includes('already')
                        ? 'An account with this email already exists.'
                        : signUpError.message,
                );
                setSubmitting(false);
                return;
            }

            // If email confirmation is required, Supabase returns a user with
            // no session — that means the user must confirm before signing in.
            if (data.session) {
                toast('Account created!');
                router.replace(nextParam || '/hostels');
                router.refresh();
            } else {
                setConfirmationSent(true);
                setSubmitting(false);
            }
        } catch {
            setError('Unable to create your account. Please try again.');
            setSubmitting(false);
        }
    }

    if (confirmationSent) {
        return (
            <div className="card-surface p-6 sm:p-8 text-center">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Confirm your email
                </h1>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click
                    the link to activate your account, then come back to sign in.
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
                Create your account
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                Save hostels, compare them, and get personalised recommendations.
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
                <Field
                    id="signup-name"
                    label="Full Name"
                    autoComplete="name"
                    value={fullName}
                    onChange={setFullName}
                />
                <Field
                    id="signup-email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={setEmail}
                />

                <div>
                    <label
                        htmlFor="signup-password"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white"
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
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        Minimum 8 characters.
                    </p>
                </div>

                <Field
                    id="signup-confirm"
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={setConfirm}
                />

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
                    {submitting ? 'Creating account…' : 'Create Account'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                Already have an account?{' '}
                <Link
                    href={
                        nextParam
                            ? `/login?redirect=${encodeURIComponent(nextParam)}`
                            : '/login'
                    }
                    className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
                >
                    Login
                </Link>
            </p>
        </div>
    );
}

function Field({
    id,
    label,
    value,
    onChange,
    type = 'text',
    autoComplete,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    autoComplete?: string;
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                autoComplete={autoComplete}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white"
            />
        </div>
    );
}