import Link from 'next/link';
import { Plus } from 'lucide-react';
import { HostelTable } from '@/components/admin/hostel-table';
import { HostelFilters } from '@/components/admin/hostel-filters';
import { queryAdminHostels } from '@/lib/admin/hostels-query';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

interface SearchParams {
    q?: string;
    city?: string;
    published?: string;
    verification?: string;
    availability?: string;
    page?: string;
}

export default async function AdminHostelsPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const page = Math.max(1, Number(searchParams.page) || 1);

    const result = await queryAdminHostels({
        q: searchParams.q,
        city: searchParams.city,
        published:
            searchParams.published === 'published' ||
                searchParams.published === 'unpublished'
                ? searchParams.published
                : 'all',
        verification: searchParams.verification,
        availability: searchParams.availability,
        page,
        limit: PAGE_SIZE,
    });

    return (
        <div>
            <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Hostels
                    </h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {result.total} {result.total === 1 ? 'hostel' : 'hostels'} in the
                        database.
                    </p>
                </div>

                <Link
                    href="/admin/hostels/new"
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                    <Plus className="h-4 w-4" /> Add Hostel
                </Link>
            </header>

            <HostelFilters
                defaults={{
                    q: searchParams.q,
                    city: searchParams.city,
                    published: searchParams.published,
                    verification: searchParams.verification,
                    availability: searchParams.availability,
                }}
            />

            <div className="mt-5">
                <HostelTable rows={result.rows} />
            </div>

            {result.totalPages > 1 && (
                <Pagination
                    page={result.page}
                    totalPages={result.totalPages}
                    searchParams={searchParams}
                />
            )}
        </div>
    );
}

function Pagination({
    page,
    totalPages,
    searchParams,
}: {
    page: number;
    totalPages: number;
    searchParams: SearchParams;
}) {
    function hrefFor(p: number) {
        const sp = new URLSearchParams();
        for (const [k, v] of Object.entries(searchParams)) {
            if (v && k !== 'page') sp.set(k, String(v));
        }
        if (p > 1) sp.set('page', String(p));
        const qs = sp.toString();
        return qs ? `/admin/hostels?${qs}` : '/admin/hostels';
    }

    return (
        <nav className="mt-6 flex items-center justify-center gap-1" aria-label="Pagination">
            {page > 1 && (
                <Link
                    href={hrefFor(page - 1)}
                    className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200"
                >
                    Previous
                </Link>
            )}
            <span className="px-3 text-sm text-slate-600 dark:text-slate-300">
                Page {page} of {totalPages}
            </span>
            {page < totalPages && (
                <Link
                    href={hrefFor(page + 1)}
                    className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200"
                >
                    Next
                </Link>
            )}
        </nav>
    );
}