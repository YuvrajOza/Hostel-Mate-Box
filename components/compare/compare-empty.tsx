import Link from 'next/link';
import { Scale } from 'lucide-react';

export function CompareEmpty() {
    return (
        <div className="card-surface flex flex-col items-center px-6 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <Scale className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                No hostels to compare yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
                Add up to 3 hostels from the search results and compare them side by side.
            </p>
            <Link
                href="/hostels"
                className="mt-5 inline-flex h-10 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
            >
                Find Hostels
            </Link>
        </div>
    );
}