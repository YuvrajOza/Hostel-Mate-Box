'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';

interface Defaults {
    q?: string;
    city?: string;
    published?: string;
    verification?: string;
    availability?: string;
}

export function HostelFilters({ defaults }: { defaults: Defaults }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [q, setQ] = useState(defaults.q ?? '');
    const [city, setCity] = useState(defaults.city ?? '');
    const [published, setPublished] = useState(defaults.published ?? '');
    const [verification, setVerification] = useState(defaults.verification ?? '');
    const [availability, setAvailability] = useState(defaults.availability ?? '');

    function apply() {
        const sp = new URLSearchParams();
        if (q.trim()) sp.set('q', q.trim());
        if (city) sp.set('city', city);
        if (published && published !== 'all') sp.set('published', published);
        if (verification) sp.set('verification', verification);
        if (availability) sp.set('availability', availability);
        const qs = sp.toString();
        router.push(qs ? `/admin/hostels?${qs}` : '/admin/hostels');
    }

    function clear() {
        setQ('');
        setCity('');
        setPublished('');
        setVerification('');
        setAvailability('');
        router.push('/admin/hostels');
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                apply();
            }}
            className="card-surface p-4"
        >
            <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Filters
                </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div className="relative lg:col-span-2">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search by name, city, area"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white"
                    />
                </div>

                <Select
                    value={city}
                    onChange={setCity}
                    options={[
                        { value: '', label: 'All Cities' },
                        { value: 'Ahmedabad', label: 'Ahmedabad' },
                        { value: 'Anand', label: 'Anand' },
                        { value: 'Vadodara', label: 'Vadodara' },
                    ]}
                />

                <Select
                    value={published}
                    onChange={setPublished}
                    options={[
                        { value: '', label: 'All' },
                        { value: 'published', label: 'Published' },
                        { value: 'unpublished', label: 'Unpublished' },
                    ]}
                />

                <Select
                    value={verification}
                    onChange={setVerification}
                    options={[
                        { value: '', label: 'All verification' },
                        { value: 'Verified', label: 'Verified' },
                        { value: 'Partially Verified', label: 'Partially Verified' },
                        { value: 'Not Verified', label: 'Not Verified' },
                    ]}
                />
            </div>

            <div className="mt-3 flex items-center gap-2">
                <button
                    type="submit"
                    className="inline-flex h-10 items-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
                >
                    Apply Filters
                </button>
                <button
                    type="button"
                    onClick={clear}
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200"
                >
                    <X className="h-4 w-4" /> Clear
                </button>
            </div>
        </form>
    );
}

function Select({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white"
        >
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    );
}