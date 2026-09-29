import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { computeRankingScore } from '@/lib/hostels/ranking';
import { rowToHostel } from '@/lib/hostels/repository';
import type { HostelRow } from '@/lib/types';
import { validateHostelForm, type HostelFormValues } from './hostel-schema';

function slugify(s: string): string {
    return s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

export interface WriteResult {
    ok: boolean;
    status: number;
    error?: string;
    fieldErrors?: Record<string, string>;
    data?: HostelRow;
}

/**
 * Create a new hostel. Server-side admin check is done by the caller.
 * Automatically computes ranking_score and slug.
 */
export async function createHostel(
    payload: Record<string, unknown>,
    adminUserId: string,
): Promise<WriteResult> {
    const form = payloadToFormValues(payload);
    const validation = validateHostelForm(form);
    if (!validation.ok) {
        return {
            ok: false,
            status: 400,
            error: 'Validation failed.',
            fieldErrors: validation.errors as Record<string, string>,
        };
    }

    const supabase = getSupabaseAdminClient();

    // Ensure a unique slug.
    const baseSlug = slugify(form.name);
    let slug = baseSlug;
    let suffix = 1;
    while (true) {
        const { data: existing } = await supabase
            .from('hostels')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();
        if (!existing) break;
        slug = `${baseSlug}-${++suffix}`;
    }

    const row = normalizePayloadForWrite(payload);
    const hostelStub = {
        id: 'tmp',
        name: String(row.name),
        slug,
        city: String(row.city),
        area: row.area as string | null,
        address: row.address as string | null,
        latitude: row.latitude as number | null,
        longitude: row.longitude as number | null,
        google_rating: row.google_rating as number | null,
        google_review_count: row.google_review_count as number | null,
        google_maps_url: row.google_maps_url as string | null,
        phone: row.phone as string | null,
        website: row.website as string | null,
        hostel_type: row.hostel_type as string | null,
        gender: row.gender as never,
        monthly_rent: row.monthly_rent as number | null,
        security_deposit: row.security_deposit as number | null,
        room_type: row.room_type as string | null,
        food: Boolean(row.food),
        wifi: Boolean(row.wifi),
        laundry: Boolean(row.laundry),
        ac: Boolean(row.ac),
        parking: Boolean(row.parking),
        cctv: Boolean(row.cctv),
        security_24x7: Boolean(row.security_24x7),
        study_room: Boolean(row.study_room),
        availability: row.availability as never,
        description: row.description as string | null,
        images: Array.isArray(row.images) ? (row.images as string[]) : [],
        verification_status: row.verification_status as never,
        last_verified: row.last_verified as string | null,
        source: row.source as string | null,
        source_url: row.source_url as string | null,
        ranking_score: null,
        is_published: Boolean(row.is_published),
        last_refreshed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    } as HostelRow;

    const ranking = computeRankingScore(hostelStub);

    const { data, error } = await supabase
        .from('hostels')
        .insert({
            ...row,
            slug,
            ranking_score: ranking,
            created_by: adminUserId,
        })
        .select()
        .single();

    if (error) {
        console.error('[createHostel]', error);
        return { ok: false, status: 400, error: error.message };
    }

    return { ok: true, status: 201, data: data as HostelRow };
}

export async function updateHostel(
    id: string,
    payload: Record<string, unknown>,
): Promise<WriteResult> {
    const form = payloadToFormValues(payload);
    const validation = validateHostelForm(form);
    if (!validation.ok) {
        return {
            ok: false,
            status: 400,
            error: 'Validation failed.',
            fieldErrors: validation.errors as Record<string, string>,
        };
    }

    const supabase = getSupabaseAdminClient();

    const { data: existing, error: fetchError } = await supabase
        .from('hostels')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (fetchError || !existing) {
        return { ok: false, status: 404, error: 'Hostel not found.' };
    }

    const row = normalizePayloadForWrite(payload);
    const merged = { ...(existing as HostelRow), ...row, id } as HostelRow;
    const ranking = computeRankingScore(merged);

    const { data, error } = await supabase
        .from('hostels')
        .update({ ...row, ranking_score: ranking })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('[updateHostel]', error);
        return { ok: false, status: 400, error: error.message };
    }

    return { ok: true, status: 200, data: data as HostelRow };
}

export async function setPublishStatus(
    id: string,
    isPublished: boolean,
): Promise<WriteResult> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
        .from('hostels')
        .update({ is_published: isPublished })
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) {
        console.error('[setPublishStatus]', error);
        return { ok: false, status: 400, error: error.message };
    }
    if (!data) {
        return { ok: false, status: 404, error: 'Hostel not found.' };
    }
    return { ok: true, status: 200, data: data as HostelRow };
}

export async function deleteHostel(id: string): Promise<WriteResult> {
    const supabase = getSupabaseAdminClient();

    const { data: existing } = await supabase
        .from('hostels')
        .select('id')
        .eq('id', id)
        .maybeSingle();

    if (!existing) {
        return { ok: false, status: 404, error: 'Hostel not found.' };
    }

    const { error } = await supabase.from('hostels').delete().eq('id', id);

    if (error) {
        console.error('[deleteHostel]', error);
        return { ok: false, status: 400, error: error.message };
    }
    return { ok: true, status: 200 };
}

/* ---------- internal helpers ---------- */

function payloadToFormValues(payload: Record<string, unknown>): HostelFormValues {
    const s = (v: unknown) => (v == null ? '' : String(v));
    const b = (v: unknown) => Boolean(v);

    return {
        name: s(payload.name),
        city: s(payload.city),
        area: s(payload.area),
        address: s(payload.address),
        latitude: s(payload.latitude),
        longitude: s(payload.longitude),
        google_maps_url: s(payload.google_maps_url),
        google_rating: s(payload.google_rating),
        google_review_count: s(payload.google_review_count),
        phone: s(payload.phone),
        website: s(payload.website),
        hostel_type: s(payload.hostel_type),
        gender: s(payload.gender) || 'Not Specified',
        monthly_rent: s(payload.monthly_rent),
        security_deposit: s(payload.security_deposit),
        room_type: s(payload.room_type),
        food: b(payload.food),
        wifi: b(payload.wifi),
        laundry: b(payload.laundry),
        ac: b(payload.ac),
        parking: b(payload.parking),
        cctv: b(payload.cctv),
        security_24x7: b(payload.security_24x7),
        study_room: b(payload.study_room),
        availability: s(payload.availability) || 'Unknown',
        description: s(payload.description),
        images: Array.isArray(payload.images) ? (payload.images as string[]) : [],
        verification_status: s(payload.verification_status) || 'Not Verified',
        source: s(payload.source),
        source_url: s(payload.source_url),
        last_verified: s(payload.last_verified),
        is_published: b(payload.is_published),
    };
}

function normalizePayloadForWrite(
    payload: Record<string, unknown>,
): Record<string, unknown> {
    const allow = [
        'name',
        'city',
        'area',
        'address',
        'latitude',
        'longitude',
        'google_maps_url',
        'google_rating',
        'google_review_count',
        'phone',
        'website',
        'hostel_type',
        'gender',
        'monthly_rent',
        'security_deposit',
        'room_type',
        'food',
        'wifi',
        'laundry',
        'ac',
        'parking',
        'cctv',
        'security_24x7',
        'study_room',
        'availability',
        'description',
        'images',
        'verification_status',
        'source',
        'source_url',
        'last_verified',
        'is_published',
    ];
    const out: Record<string, unknown> = {};
    for (const k of allow) {
        if (k in payload) out[k] = payload[k];
    }
    return out;
}