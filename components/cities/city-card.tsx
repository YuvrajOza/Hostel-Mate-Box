import Link from 'next/link';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import type { City } from '@/lib/cities/service';

interface Props {
    city: City;
    description: string;
    count: number;
}

export function CityCard({ city, description, count }: Props) {
    const hasHostels = count > 0;

    return (
        <article className="card-surface flex flex-col overflow-hidden">
            {/* Decorative header with the city initial */}
            <div className="relative flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-brand-950/40 dark:via-[#0B1220] dark:to-brand-950/40">
                <span className="grid h-20 w-20 place-items-center rounded-2xl bg-white text-3xl font-bold tracking-tight text-brand-600 shadow-soft dark:bg-[#111A2E] dark:text-brand-300">
                    {city.slice(0, 1)}
                </span>
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur-sm dark:bg-[#0B1220]/80 dark:text-slate-200">
                    <MapPin className="h-3 w-3" /> Gujarat
                </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {city}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <Building2 className="h-3.5 w-3.5" />
                        {hasHostels
                            ? `${count} ${count === 1 ? 'hostel' : 'hostels'}`
                            : '0 hostels'}
                    </span>
                </div>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {description}
                </p>

                {!hasHostels && (
                    <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                        No hostels listed yet.
                    </p>
                )}

                <Link
                    href={`/hostels?city=${encodeURIComponent(city)}`}
                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-ring"
                >
                    Explore Hostels
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </article>
    );
}