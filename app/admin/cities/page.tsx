import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Building2, GraduationCap, MapPin, Search } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CityCard } from '@/components/cities/city-card';
import { CITIES, CITY_DESCRIPTIONS, getCityCounts } from '@/lib/cities/service';

export const metadata: Metadata = {
    title: 'Cities — HostelMate',
    description:
        "Explore student hostels across Gujarat's major college cities: Ahmedabad, Anand, and Vadodara.",
};

export const dynamic = 'force-dynamic';

export default async function CitiesPage() {
    const summaries = await getCityCounts();

    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <section className="border-b border-slate-200/70 bg-white/60 dark:border-slate-800 dark:bg-[#0B1220]/60">
                    <div className="container-page py-14 sm:py-20">
                        <div className="mx-auto max-w-2xl text-center">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
                                <MapPin className="h-3 w-3" />
                                Gujarat
                            </span>
                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                Find Hostels by City
                            </h1>
                            <p className="mt-3 text-slate-600 dark:text-slate-300">
                                Explore student hostels across Gujarat&apos;s major college cities.
                            </p>
                        </div>
                    </div>
                </section>

                {/* City cards */}
                <section className="container-page py-14 sm:py-16">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {summaries.map((s) => (
                            <CityCard
                                key={s.city}
                                city={s.city}
                                description={CITY_DESCRIPTIONS[s.city]}
                                count={s.count}
                            />
                        ))}
                    </div>
                </section>

                {/* Why search by city */}
                <section className="border-t border-slate-200/70 bg-white/60 dark:border-slate-800 dark:bg-[#0B1220]/60">
                    <div className="container-page py-14 sm:py-16">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                                Why search by city?
                            </h2>
                            <p className="mt-3 text-slate-600 dark:text-slate-300">
                                Students often choose a hostel based on where their college or
                                university is located. Searching by city narrows down hostels to
                                the area you actually need — near your classes, transport, and
                                daily essentials.
                            </p>
                        </div>

                        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
                            <Feature
                                icon={<MapPin className="h-5 w-5" />}
                                title="Near your college"
                                description="Filter hostels by the city where your institution is located."
                            />
                            <Feature
                                icon={<Building2 className="h-5 w-5" />}
                                title="Compare within a city"
                                description="See side-by-side pricing, facilities, and ratings."
                            />
                            <Feature
                                icon={<GraduationCap className="h-5 w-5" />}
                                title="Built for students"
                                description="Focused on budget, safety, and student needs."
                            />
                        </ul>

                        <div className="mt-10 flex justify-center">
                            <Link
                                href="/hostels"
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700 focus-ring"
                            >
                                <Search className="h-4 w-4" />
                                Browse All Hostels
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

function Feature({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <li className="card-surface p-5 text-left">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                {icon}
            </span>
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                {title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {description}
            </p>
        </li>
    );
}