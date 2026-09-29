"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAllHostels } from "@/lib/admin-data";
import { HostelCard } from "@/components/hostel-card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Building2 } from "lucide-react";

function OtherCityContent() {
    const params = useSearchParams();
    const name = params.get("name") ?? "";
    const hostels = useAllHostels().filter(
        (h) => h.city.toLowerCase() === name.toLowerCase()
    );
    const [compareSet, setCompareSet] = useState<Set<string>>(new Set());

    const toggleCompare = (id: string) => {
        setCompareSet((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else if (next.size < 3) next.add(id);
            return next;
        });
    };

    if (!name) {
        return (
            <main className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">No city specified</h1>
                <Link
                    href="/cities"
                    className="inline-block mt-6 text-brand-600 dark:text-brand-400 font-medium hover:underline"
                >
                    ← Back to Cities
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
                {hostels.length} hostel{hostels.length === 1 ? "" : "s"} in {name}
            </p>

            {hostels.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-brand-400">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No hostels here yet</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        An admin can add hostels for this city from the admin panel.
                    </p>
                    <Link
                        href="/cities"
                        className="inline-block mt-6 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                    >
                        ← Explore Other Cities
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                    {hostels.map((h) => (
                        <HostelCard
                            key={h.id}
                            hostel={h}
                            selectedForCompare={compareSet.has(h.id)}
                            onToggleCompare={toggleCompare}
                            compareDisabled={compareSet.size >= 3}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}

export default function OtherCityPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={
                <main className="max-w-6xl mx-auto px-4 py-10 text-center text-slate-500">
                    Loading city...
                </main>
            }>
                <OtherCityContent />
            </Suspense>
            <Footer />
        </>
    );
}