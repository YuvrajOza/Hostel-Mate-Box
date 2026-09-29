'use client';

import Link from 'next/link';
import {
    BedDouble,
    Building2,
    Check,
    ExternalLink,
    MapPin,
    Phone,
    ShieldCheck,
    Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FavouriteButton } from '@/components/favourites/favourite-button';
import { CompareRemoveButton } from './compare-remove-button';
import type { Hostel } from '@/lib/types';

interface Props {
    hostels: Hostel[];
    onRemove: (id: string) => void;
    favouriteIds: Set<string>;
}

const NA = 'Not available';

export function CompareTable({ hostels, onRemove, favouriteIds }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-0">
                <thead>
                    <tr>
                        <th className="w-40 bg-transparent p-0 align-bottom" />
                        {hostels.map((h) => (
                            <th
                                key={h.id}
                                className="w-[280px] border-b border-slate-200 p-4 text-left align-top dark:border-slate-800"
                            >
                                <div className="relative">
                                    <div className="absolute right-0 top-0">
                                        <CompareRemoveButton onRemove={() => onRemove(h.id)} />
                                    </div>
                                    <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                                        {h.images[0] ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={h.images[0]}
                                                alt={h.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                <Building2 className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="mt-3 truncate text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                                        {h.name}
                                    </h3>
                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span className="truncate">
                                            {h.area ? `${h.area}, ` : ''}
                                            {h.city}
                                        </span>
                                    </p>
                                </div>
                            </th>
                        ))}
                        {Array.from({ length: 3 - hostels.length }).map((_, i) => (
                            <th
                                key={`empty-${i}`}
                                className="w-[280px] border-b border-slate-200 p-4 align-top dark:border-slate-800"
                            >
                                <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-500">
                                    Add a hostel to compare
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    <Row
                        label="Google Rating"
                        hostels={hostels}
                        value={(h) => h.googleRating ?? null}
                    >
                        {(h) =>
                            h.googleRating != null ? (
                                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-sm font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    {h.googleRating.toFixed(1)}
                                </span>
                            ) : (
                                <span className="text-slate-400">{NA}</span>
                            )
                        }
                    </Row>

                    <Row
                        label="Reviews"
                        hostels={hostels}
                        value={(h) => h.googleReviewCount ?? null}
                    >
                        {(h) =>
                            h.googleReviewCount != null ? (
                                <span>{h.googleReviewCount} reviews</span>
                            ) : (
                                <span className="text-slate-400">{NA}</span>
                            )
                        }
                    </Row>

                    <Row
                        label="Monthly Rent"
                        hostels={hostels}
                        value={(h) => h.monthlyRent ?? null}
                    >
                        {(h) =>
                            h.monthlyRent != null ? (
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    ₹{h.monthlyRent.toLocaleString('en-IN')}
                                </span>
                            ) : (
                                <span className="text-slate-400">Price unavailable</span>
                            )
                        }
                    </Row>

                    <Row
                        label="Security Deposit"
                        hostels={hostels}
                        value={(h) => h.securityDeposit ?? null}
                    >
                        {(h) =>
                            h.securityDeposit != null ? (
                                <span>₹{h.securityDeposit.toLocaleString('en-IN')}</span>
                            ) : (
                                <span className="text-slate-400">{NA}</span>
                            )
                        }
                    </Row>

                    <Row label="Gender" hostels={hostels} value={(h) => h.gender}>
                        {(h) => <span>{h.gender}</span>}
                    </Row>

                    <Row
                        label="Hostel Type"
                        hostels={hostels}
                        value={(h) => h.hostelType ?? ''}
                    >
                        {(h) => <span>{h.hostelType ?? NA}</span>}
                    </Row>

                    <Row
                        label="Room Type"
                        hostels={hostels}
                        value={(h) => h.roomType ?? ''}
                    >
                        {(h) =>
                            h.roomType ? (
                                <span className="inline-flex items-center gap-1">
                                    <BedDouble className="h-3.5 w-3.5" /> {h.roomType}
                                </span>
                            ) : (
                                <span className="text-slate-400">{NA}</span>
                            )
                        }
                    </Row>

                    <Row
                        label="Availability"
                        hostels={hostels}
                        value={(h) => h.availability}
                    >
                        {(h) => (
                            <span
                                className={cn(
                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                                    h.availability === 'Available' &&
                                    'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
                                    h.availability === 'Limited' &&
                                    'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
                                    (h.availability === 'Not Available' ||
                                        h.availability === 'Unknown') &&
                                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                                )}
                            >
                                {h.availability}
                            </span>
                        )}
                    </Row>

                    <Row
                        label="Verification"
                        hostels={hostels}
                        value={(h) => h.verificationStatus}
                    >
                        {(h) =>
                            h.verificationStatus === 'Verified' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                                </span>
                            ) : (
                                <span className="text-slate-500 dark:text-slate-400">
                                    {h.verificationStatus}
                                </span>
                            )
                        }
                    </Row>

                    <FacilityRow label="Wi-Fi" hostels={hostels} facilityKey="wifi" />
                    <FacilityRow label="Food" hostels={hostels} facilityKey="food" />
                    <FacilityRow label="AC" hostels={hostels} facilityKey="ac" />
                    <FacilityRow label="Laundry" hostels={hostels} facilityKey="laundry" />
                    <FacilityRow label="Parking" hostels={hostels} facilityKey="parking" />
                    <FacilityRow label="CCTV" hostels={hostels} facilityKey="cctv" />
                    <FacilityRow
                        label="24/7 Security"
                        hostels={hostels}
                        facilityKey="security24x7"
                    />
                    <FacilityRow
                        label="Study Room"
                        hostels={hostels}
                        facilityKey="studyRoom"
                    />

                    <Row label="Address" hostels={hostels} value={(h) => h.address}>
                        {(h) => (
                            <span className="text-slate-600 dark:text-slate-300">
                                {h.address || NA}
                            </span>
                        )}
                    </Row>

                    <Row label="Phone" hostels={hostels} value={(h) => h.phone ?? ''}>
                        {(h) =>
                            h.phone ? (
                                <a
                                    href={`tel:${h.phone}`}
                                    className="inline-flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400"
                                >
                                    <Phone className="h-3.5 w-3.5" /> Call
                                </a>
                            ) : (
                                <span className="text-slate-400">Phone unavailable</span>
                            )
                        }
                    </Row>

                    <Row label="Website" hostels={hostels} value={(h) => h.website ?? ''}>
                        {(h) =>
                            h.website ? (
                                <a
                                    href={h.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" /> Visit
                                </a>
                            ) : (
                                <span className="text-slate-400">Website unavailable</span>
                            )
                        }
                    </Row>

                    <Row
                        label="Google Maps"
                        hostels={hostels}
                        value={(h) => h.googleMapsUrl ?? ''}
                    >
                        {(h) =>
                            h.googleMapsUrl ? (
                                <a
                                    href={h.googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400"
                                >
                                    <MapPin className="h-3.5 w-3.5" /> Open
                                </a>
                            ) : (
                                <span className="text-slate-400">Map unavailable</span>
                            )
                        }
                    </Row>

                    <tr>
                        <td className="border-t border-slate-200 pt-4 align-top dark:border-slate-800" />
                        {hostels.map((h) => (
                            <td
                                key={`actions-${h.id}`}
                                className="border-t border-slate-200 p-4 align-top dark:border-slate-800"
                            >
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href={`/hostels/${h.id}`}
                                        className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
                                    >
                                        View Details
                                    </Link>
                                    <FavouriteButton
                                        hostelId={h.id}
                                        initialSaved={favouriteIds.has(h.id)}
                                        variant="button"
                                        className="w-full justify-center"
                                    />
                                </div>
                            </td>
                        ))}
                        {Array.from({ length: 3 - hostels.length }).map((_, i) => (
                            <td
                                key={`actions-empty-${i}`}
                                className="border-t border-slate-200 p-4 align-top dark:border-slate-800"
                            />
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function Row({
    label,
    hostels,
    value,
    children,
}: {
    label: string;
    hostels: Hostel[];
    value: (h: Hostel) => string | number | boolean | null | undefined;
    children: (h: Hostel) => React.ReactNode;
}) {
    const values = hostels.map((h) => String(value(h) ?? ''));
    const differs = new Set(values).size > 1;

    return (
        <tr>
            <th
                scope="row"
                className={cn(
                    'border-t border-slate-200 py-3 pr-4 text-left align-top text-xs font-semibold uppercase tracking-wide dark:border-slate-800',
                    differs
                        ? 'text-slate-700 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-500',
                )}
            >
                {label}
            </th>
            {hostels.map((h) => (
                <td
                    key={h.id}
                    className={cn(
                        'border-t border-slate-200 py-3 pr-4 text-sm align-top dark:border-slate-800',
                        differs
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-500 dark:text-slate-400',
                    )}
                >
                    {children(h)}
                </td>
            ))}
            {Array.from({ length: 3 - hostels.length }).map((_, i) => (
                <td
                    key={`empty-${i}`}
                    className="border-t border-slate-200 py-3 dark:border-slate-800"
                />
            ))}
        </tr>
    );
}

function FacilityRow({
    label,
    hostels,
    facilityKey,
}: {
    label: string;
    hostels: Hostel[];
    facilityKey:
    | 'wifi'
    | 'food'
    | 'ac'
    | 'laundry'
    | 'parking'
    | 'cctv'
    | 'security24x7'
    | 'studyRoom';
}) {
    return (
        <Row
            label={label}
            hostels={hostels}
            value={(h) => h[facilityKey]}
        >
            {(h) =>
                h[facilityKey] ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                    <span className="text-slate-300 dark:text-slate-600">—</span>
                )
            }
        </Row>
    );
}