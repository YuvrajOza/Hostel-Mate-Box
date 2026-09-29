import Link from 'next/link';
import {
    Building2,
    CheckCircle2,
    EyeOff,
    MapPin,
    Plus,
} from 'lucide-react';
import { getAdminStats } from '@/lib/admin/stats';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const stats = await getAdminStats();

    return (
        <div>
            <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Overview of hostels in the HostelMate database.
                    </p>
                </div>

                <Link
                    href="/admin/hostels/new"
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                    <Plus className="h-4 w-4" /> Add Hostel
                </Link>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    label="Total Hostels"
                    value={stats.total}
                    icon={<Building2 className="h-5 w-5" />}
                />
                <StatCard
                    label="Published"
                    value={stats.published}
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    tone="emerald"
                />
                <StatCard
                    label="Unpublished"
                    value={stats.unpublished}
                    icon={<EyeOff className="h-5 w-5" />}
                    tone="amber"
                />
            </div>

            <h2 className="mt-10 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                Hostels by city
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                    label="Ahmedabad"
                    value={stats.byCity.Ahmedabad}
                    icon={<MapPin className="h-5 w-5" />}
                />
                <StatCard
                    label="Anand"
                    value={stats.byCity.Anand}
                    icon={<MapPin className="h-5 w-5" />}
                />
                <StatCard
                    label="Vadodara"
                    value={stats.byCity.Vadodara}
                    icon={<MapPin className="h-5 w-5" />}
                />
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
                <Link
                    href="/admin/hostels"
                    className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    Manage Hostels
                </Link>
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
    tone = 'brand',
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    tone?: 'brand' | 'emerald' | 'amber';
}) {
    const toneClass =
        tone === 'emerald'
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
            : tone === 'amber'
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300'
                : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300';

    return (
        <div className="card-surface p-5">
            <div className="flex items-center justify-between">
                <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}
                >
                    {icon}
                </span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {value}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
    );
}