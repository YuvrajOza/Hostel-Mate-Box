'use client';

import { HostelCard } from '@/components/hostel-card';
import { useCompare } from '@/lib/compare-store';
import type { Hostel } from '@/lib/types';

export function FavouritesList({ hostels }: { hostels: Hostel[] }) {
    const { ids: compareIds, toggle: toggleCompare } = useCompare();
    const compareSet = new Set(compareIds);

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {hostels.map((h) => (
                <HostelCard
                    key={h.id}
                    hostel={h}
                    selectedForCompare={compareSet.has(h.id)}
                    onToggleCompare={toggleCompare}
                    compareDisabled={compareIds.length >= 3}
                    initialSaved
                />
            ))}
        </div>
    );
}