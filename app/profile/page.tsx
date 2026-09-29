import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProfileForm } from '@/components/profile/profile-form';
import { LogoutButton } from '@/components/profile/logout-button';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: 'Your Profile — HostelMate',
    description: 'Manage your HostelMate profile.',
};

export const dynamic = 'force-dynamic';

interface ProfileRow {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    role: string;
    created_at: string;
}

export default async function ProfilePage() {
    const supabase = getSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/profile');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle<ProfileRow>();

    const fullName =
        profile?.full_name ??
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        '';
    const avatarUrl =
        profile?.avatar_url ??
        (user.user_metadata?.avatar_url as string | undefined) ??
        '';
    const createdAt = profile?.created_at ?? user.created_at;

    return (
        <>
            <Navbar />
            <main className="container-page py-10">
                <div className="mx-auto max-w-2xl">
                    <header className="mb-6">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            Your Profile
                        </h1>
                        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                            Manage your account information.
                        </p>
                    </header>

                    <ProfileForm
                        userId={user.id}
                        email={user.email ?? ''}
                        initialFullName={fullName}
                        initialAvatarUrl={avatarUrl}
                        createdAt={createdAt}
                    />

                    <div className="mt-6">
                        <LogoutButton />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}