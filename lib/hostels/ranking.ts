import type { Hostel, HostelRow } from '@/lib/types';

/**
 * HostelMate Ranking — transparent, non-Google score.
 *
 *   ratingScore        = (rating / 5) * 60                             max 60
 *   reviewScore        = min(1, log10(reviewCount + 1) / 3) * 25       max 25
 *   verificationScore  = Verified 10 / Partially 5 / Not 0
 *   informationScore   = (presentFields / totalFields) * 5             max 5
 *
 * Total range 0..100.
 *
 * This is NOT a Google score. It is HostelMate's own transparent ranking.
 */

const KEY_FIELDS: (keyof Hostel)[] = [
    'name',
    'city',
    'area',
    'address',
    'googleRating',
    'googleReviewCount',
    'phone',
    'website',
    'googleMapsUrl',
    'monthlyRent',
    'gender',
    'roomType',
];

function round(n: number): number {
    return Math.round(n * 100) / 100;
}

function isPresent(v: unknown): boolean {
    if (v == null) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return true;
}

/** Convert either shape into the domain `Hostel` shape. */
export function normalizeHostel(input: Hostel | HostelRow): Hostel {
    if ('createdAt' in input) return input as Hostel;
    const r = input as HostelRow;
    return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        city: r.city,
        area: r.area ?? '',
        address: r.address ?? '',
        latitude: r.latitude ?? undefined,
        longitude: r.longitude ?? undefined,
        googleRating: r.google_rating ?? undefined,
        googleReviewCount: r.google_review_count ?? undefined,
        googleMapsUrl: r.google_maps_url ?? undefined,
        phone: r.phone ?? undefined,
        website: r.website ?? undefined,
        hostelType: r.hostel_type ?? undefined,
        gender: r.gender,
        monthlyRent: r.monthly_rent ?? undefined,
        securityDeposit: r.security_deposit ?? undefined,
        roomType: r.room_type ?? undefined,
        food: r.food,
        wifi: r.wifi,
        laundry: r.laundry,
        ac: r.ac,
        parking: r.parking,
        cctv: r.cctv,
        security24x7: r.security_24x7,
        studyRoom: r.study_room,
        availability: r.availability,
        description: r.description ?? undefined,
        images: r.images ?? [],
        verificationStatus: r.verification_status,
        lastVerified: r.last_verified ?? undefined,
        source: r.source ?? undefined,
        sourceUrl: r.source_url ?? undefined,
        rankingScore: r.ranking_score ?? undefined,
        isPublished: r.is_published,
        lastRefreshedAt: r.last_refreshed_at ?? undefined,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
    };
}

export function computeRankingScore(input: Hostel | HostelRow): number {
    const h = normalizeHostel(input);

    const ratingScore = h.googleRating != null ? (h.googleRating / 5) * 60 : 0;

    const reviews = h.googleReviewCount ?? 0;
    const reviewScore = Math.min(1, Math.log10(reviews + 1) / 3) * 25;

    const verificationScore =
        h.verificationStatus === 'Verified'
            ? 10
            : h.verificationStatus === 'Partially Verified'
                ? 5
                : 0;

    const presentCount = KEY_FIELDS.filter((f) => isPresent(h[f])).length;
    const informationScore = (presentCount / KEY_FIELDS.length) * 5;

    const total = ratingScore + reviewScore + verificationScore + informationScore;
    return round(total);
}

export interface RankingBreakdown {
    ratingScore: number;
    reviewScore: number;
    verificationScore: number;
    informationScore: number;
    total: number;
}

export function computeRankingBreakdown(input: Hostel | HostelRow): RankingBreakdown {
    const h = normalizeHostel(input);

    const ratingScore = h.googleRating != null ? (h.googleRating / 5) * 60 : 0;

    const reviews = h.googleReviewCount ?? 0;
    const reviewScore = Math.min(1, Math.log10(reviews + 1) / 3) * 25;

    const verificationScore =
        h.verificationStatus === 'Verified'
            ? 10
            : h.verificationStatus === 'Partially Verified'
                ? 5
                : 0;

    const presentCount = KEY_FIELDS.filter((f) => isPresent(h[f])).length;
    const informationScore = (presentCount / KEY_FIELDS.length) * 5;

    const total = ratingScore + reviewScore + verificationScore + informationScore;

    return {
        ratingScore: round(ratingScore),
        reviewScore: round(reviewScore),
        verificationScore: round(verificationScore),
        informationScore: round(informationScore),
        total: round(total),
    };
}