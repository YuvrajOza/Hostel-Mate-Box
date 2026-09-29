import type {
    Hostel,
    HostelDetails,
    HostelSearchParams,
    HostelSearchResult,
    Review,
} from '@/lib/types';
import {
    queryHostelRowById,
    queryHostelRows,
    queryReviewsByHostelId,
    querySimilarHostelRows,
    queryTopHostelRows,
    rowToHostel,
} from './repository';
import { computeRankingScore } from './ranking';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function applyFacilities(hostel: Hostel, required?: string[]): boolean {
    if (!required?.length) return true;
    return required.every((f) => {
        switch (f) {
            case 'wifi':
                return hostel.wifi;
            case 'food':
                return hostel.food;
            case 'ac':
                return hostel.ac;
            case 'laundry':
                return hostel.laundry;
            case 'parking':
                return hostel.parking;
            case 'cctv':
                return hostel.cctv;
            case 'security24x7':
                return hostel.security24x7;
            case 'studyRoom':
                return hostel.studyRoom;
            default:
                return true;
        }
    });
}

function matchesQuery(hostel: Hostel, q?: string): boolean {
    if (!q) return true;
    const needle = q.toLowerCase();
    return [hostel.name, hostel.city, hostel.area, hostel.address]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(needle));
}

function compare(a: Hostel, b: Hostel, sort: HostelSearchParams['sort']): number {
    switch (sort) {
        case 'highest-rated':
            return (b.googleRating ?? 0) - (a.googleRating ?? 0);
        case 'most-reviewed':
            return (b.googleReviewCount ?? 0) - (a.googleReviewCount ?? 0);
        case 'lowest-rent':
            return (a.monthlyRent ?? Number.POSITIVE_INFINITY) -
                (b.monthlyRent ?? Number.POSITIVE_INFINITY);
        case 'highest-rent':
            return (b.monthlyRent ?? 0) - (a.monthlyRent ?? 0);
        case 'nearest':
            return 0;
        case 'recommended':
        default:
            return (b.rankingScore ?? 0) - (a.rankingScore ?? 0);
    }
}

function isValidId(id: string | undefined | null): id is string {
    return typeof id === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(id);
}

function withRanking(h: Hostel): Hostel {
    return { ...h, rankingScore: computeRankingScore(h) };
}

/* ------------------------------------------------------------------ */
/*  Search / list                                                      */
/* ------------------------------------------------------------------ */

export async function getHostels(
    params: HostelSearchParams,
): Promise<HostelSearchResult> {
    const { rows, total: dbTotal } = await queryHostelRows(params);

    let hostels = rows.map(rowToHostel).map(withRanking);
    hostels = hostels.filter((h) => matchesQuery(h, params.q));
    hostels = hostels.filter((h) => applyFacilities(h, params.facilities));

    const filtered = hostels.length === rows.length ? dbTotal : hostels.length;

    hostels = [...hostels].sort((a, b) => compare(a, b, params.sort));

    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const total = filtered;
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const data = hostels.slice(start, start + limit);

    return {
        items: data,
        total,
        page: safePage,
        limit,
        totalPages,
    };
}

export async function searchHostels(
    params: HostelSearchParams,
): Promise<HostelSearchResult> {
    return getHostels(params);
}

export async function getHostelCount(
    params: HostelSearchParams,
): Promise<number> {
    const { total } = await getHostels({ ...params, page: 1 });
    return total;
}

/* ------------------------------------------------------------------ */
/*  Details                                                            */
/* ------------------------------------------------------------------ */

export async function getHostelById(
    id: string,
): Promise<HostelDetails | null> {
    if (!isValidId(id)) return null;

    const row = await queryHostelRowById(id);
    if (!row) return null;

    const hostel = withRanking(rowToHostel(row));
    const reviewRows = await queryReviewsByHostelId(id);

    const reviews: Review[] = reviewRows.map((r) => ({
        id: r.id,
        user_id: r.user_id ?? '',
        hostel_id: r.hostel_id,
        rating: r.rating,
        comment: r.comment ?? '',
        status: r.status ?? 'approved',
        created_at: r.created_at,
        hostelId: r.hostel_id,
        userId: r.user_id ?? '',
        createdAt: r.created_at,
    }));

    const reviewCount = reviews.length;
    const reviewAverage =
        reviewCount === 0
            ? undefined
            : reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    return {
        ...hostel,
        reviews,
        reviewCount,
        reviewAverage,
    };
}

export async function getSimilarHostels(
    city: string,
    excludeId: string,
    limit = 4,
): Promise<Hostel[]> {
    if (!city || !isValidId(excludeId)) return [];
    const rows = await querySimilarHostelRows(city, excludeId, limit);
    return rows.map((r) => withRanking(rowToHostel(r)));
}

/* ------------------------------------------------------------------ */
/*  Top N                                                              */
/* ------------------------------------------------------------------ */

export async function getTopHostels(
    city: string,
    limit = 10,
): Promise<Hostel[]> {
    const safeLimit = Math.max(1, Math.min(10, Math.floor(limit)));
    if (!city) return [];
    const rows = await queryTopHostelRows(city, safeLimit);
    return rows.map((r) => withRanking(rowToHostel(r)));
}