'use client';

import { Check, ExternalLink, MapPin, Phone, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { useCompare } from '@/lib/compare-store';
import { FavouriteButton } from '@/components/favourites/favourite-button';
import type { HostelDetails } from '@/lib/types';

export function ActionButtons({
    hostel,
    initiallySaved,
}: {
    hostel: HostelDetails;
    initiallySaved?: boolean;
}) {
    const { ids, toggle, max } = useCompare();
    const selected = ids.includes(hostel.id);
    const disabled = !selected && ids.length >= max;

    const onCompare = () => {
        if (disabled) {
            toast(`You can compare up to ${max} hostels`);
            return;
        }
        toggle(hostel.id);
    };

    return (
        <div className="mt-5 flex flex-wrap gap-2">
            <FavouriteButton
                hostelId={hostel.id}
                initialSaved={initiallySaved}
                variant="button"
            />

            <button
                type="button"
                onClick={onCompare}
                aria-pressed={selected}
                className={cn(
                    'inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition',
                    selected
                        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900/30 dark:text-brand-300'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200 dark:hover:bg-slate-800',
                )}
            >
                {selected ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
                {selected ? 'Added to Compare' : 'Compare'}
            </button>

            {hostel.phone ? (
                <a
                    href={`tel:${hostel.phone}`}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <Phone className="h-4 w-4" /> Call
                </a>
            ) : (
                <button
                    type="button"
                    disabled
                    className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white px-4 text-sm font-semibold text-slate-400 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-500"
                >
                    <Phone className="h-4 w-4" /> Phone unavailable
                </button>
            )}

            {hostel.website ? (
                <a
                    href={hostel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <ExternalLink className="h-4 w-4" /> Website
                </a>
            ) : (
                <button
                    type="button"
                    disabled
                    className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white px-4 text-sm font-semibold text-slate-400 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-500"
                >
                    <ExternalLink className="h-4 w-4" /> Website unavailable
                </button>
            )}

            {hostel.googleMapsUrl ? (
                <a
                    href={hostel.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <MapPin className="h-4 w-4" /> Google Maps
                </a>
            ) : (
                <button
                    type="button"
                    disabled
                    className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white px-4 text-sm font-semibold text-slate-400 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-500"
                >
                    <MapPin className="h-4 w-4" /> Map location unavailable
                </button>
            )}
        </div>
    );
}