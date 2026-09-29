import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { FavouritesEmpty } from '@/components/favourites/favourites-empty';
import { FavouritesList } from '@/components/favourites/favourites-list';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getUserFavouriteHostels } from '@/lib/favourites/service';

export const metadata: Metadata = {
    title: 'Your Favourites — HostelMate',
    description: 'Hostels you have saved.',
};

export const dynamic = 'force-dynamic';

export default async function FavouritesPage() {
    const supabase = getSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/favourites');
    }

    const { hostels, unavailableCount } = await getUserFavouriteHostels();

    return (
        <>
            <Navbar />
            <main className="container-page py-10">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Your Favourites
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                        {hostels.length === 0
                            ? 'Save hostels you like and compare them later.'
                            : `${hostels.length} ${hostels.length === 1 ? 'hostel' : 'hostels'
                            } saved.`}
                    </p>
                </header>

                {hostels.length === 0 && unavailableCount === 0 ? (
                    <FavouritesEmpty />
                ) : (
                    <>
                        {unavailableCount > 0 && (
                            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                                {unavailableCount}{' '}
                                {unavailableCount === 1 ? 'hostel is' : 'hostels are'} currently
                                unavailable.
                            </div>
                        )}

                        <FavouritesList hostels={hostels} />
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}