'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from '@/components/ui/toast';

interface Props {
    userId: string;
    email: string;
    initialFullName: string;
    initialAvatarUrl: string;
    createdAt: string;
}

export function ProfileForm({
    userId,
    email,
    initialFullName,
    initialAvatarUrl,
    createdAt,
}: Props) {
    const router = useRouter();
    const [fullName, setFullName] = useState(initialFullName);
    const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;
        setError(null);

        if (!fullName.trim() || fullName.trim().length < 2) {
            setError('Please enter your full name.');
            return;
        }
        if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
            setError('Avatar URL must start with http:// or https://');
            return;
        }

        setSubmitting(true);
        try {
            const supabase = getSupabaseBrowserClient();

            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName.trim(),
                    avatar_url: avatarUrl.trim() || null,
                })
                .eq('id', userId);

            if (profileError) {
                setError(profileError.message);
                setSubmitting(false);
                return;
            }

            await supabase.auth.updateUser({
                data: {
                    full_name: fullName.trim(),
                    avatar_url: avatarUrl.trim() || null,
                },
            });

            toast('Profile updated');
            router.refresh();
            setSubmitting(false);
        } catch {
            setError('Unable to save changes. Please try again.');
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="card-surface p-6" noValidate>
            {/* Avatar preview */}
            <div className="mb-6 flex items-center gap-4">
                {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={avatarUrl}
                        alt=""
                        className="h-16 w-16 rounded-2xl object-cover"
                    />
                ) : (
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-600 text-lg font-semibold text-white">
                        {getInitials(fullName || email)}
                    </span>
                )}
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {fullName || 'Your name'}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {email}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="profile-name"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                        Full Name
                    </label>
                    <input
                        id="profile-name"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white"
                    />
                </div>

                <div>
                    <label
                        htmlFor="profile-email"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                        Email
                    </label>
                    <input
                        id="profile-email"
                        type="email"
                        value={email}
                        readOnly
                        className="h-11 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400"
                    />
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        Email can&apos;t be changed here.
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="profile-avatar"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                        Avatar URL (optional)
                    </label>
                    <input
                        id="profile-avatar"
                        type="url"
                        placeholder="https://..."
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white dark:placeholder:text-slate-500"
                    />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                    <p>
                        <span className="font-medium">Account created:</span>{' '}
                        {new Date(createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
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
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitting ? 'Saving…' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}

function getInitials(input: string): string {
    const parts = input.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}