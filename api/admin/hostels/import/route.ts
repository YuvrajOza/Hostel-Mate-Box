import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const ALLOWED_CITIES = new Set(['Ahmedabad', 'Anand', 'Vadodara']);
const ALLOWED_GENDERS = new Set(['Boys', 'Girls', 'Co-ed', 'Not Specified']);
const ALLOWED_AVAILABILITY = new Set([
    'Available',
    'Limited',
    'Not Available',
    'Unknown',
]);
const ALLOWED_VERIFICATION = new Set([
    'Verified',
    'Partially Verified',
    'Not Verified',
]);

interface ImportRecord {
    id?: string;
    name: string;
    city: string;
    area?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    google_rating?: number | null;
    google_review_count?: number | null;
    phone?: string | null;
    website?: string | null;
    google_maps_url?: string | null;
    hostel_type?: string | null;
    gender?: string | null;
    monthly_rent?: number | null;
    security_deposit?: number | null;
    room_type?: string | null;
    food?: boolean;
    wifi?: boolean;
    laundry?: boolean;
    ac?: boolean;
    parking?: boolean;
    cctv?: boolean;
    security_24x7?: boolean;
    study_room?: boolean;
    availability?: string | null;
    description?: string | null;
    images?: string[];
    verification_status?: string;
    source?: string | null;
    source_url?: string | null;
    last_verified?: string | null;
    is_published?: boolean;
}

function slugify(s: string): string {
    return s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

function validate(r: ImportRecord): string[] {
    const errs: string[] = [];
    if (!r.name?.trim()) errs.push('name is required');
    if (!r.city || !ALLOWED_CITIES.has(r.city)) errs.push('invalid city');
    if (r.gender && !ALLOWED_GENDERS.has(r.gender)) errs.push('invalid gender');
    if (r.availability && !ALLOWED_AVAILABILITY.has(r.availability)) {
        errs.push('invalid availability');
    }
    if (r.verification_status && !ALLOWED_VERIFICATION.has(r.verification_status)) {
        errs.push('invalid verification_status');
    }
    if (r.google_rating != null && (r.google_rating < 0 || r.google_rating > 5)) {
        errs.push('google_rating out of range');
    }
    if (r.google_review_count != null && r.google_review_count < 0) {
        errs.push('google_review_count negative');
    }
    if (r.monthly_rent != null && r.monthly_rent < 0) {
        errs.push('monthly_rent negative');
    }
    return errs;
}

export async function POST(req: NextRequest) {
    if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    const records: ImportRecord[] = Array.isArray(body)
        ? (body as ImportRecord[])
        : Array.isArray((body as { hostels?: unknown }).hostels)
            ? ((body as { hostels: ImportRecord[] }).hostels)
            : [];

    if (records.length === 0) {
        return NextResponse.json({ error: 'No records supplied.' }, { status: 400 });
    }

    const accepted: ImportRecord[] = [];
    const rejected: { index: number; reasons: string[] }[] = [];

    records.forEach((r, i) => {
        const errs = validate(r);
        if (errs.length) rejected.push({ index: i, reasons: errs });
        else accepted.push(r);
    });

    if (accepted.length === 0) {
        return NextResponse.json(
            { inserted: 0, updated: 0, rejected },
            { status: 400 },
        );
    }

    const supabase = getSupabaseAdminClient();
    let inserted = 0;
    let updated = 0;

    for (const r of accepted) {
        const slug = slugify(r.name);
        const payload: Record<string, unknown> = {
            name: r.name.trim(),
            slug,
            city: r.city,
            area: r.area ?? '',
            address: r.address ?? '',
            latitude: r.latitude ?? null,
            longitude: r.longitude ?? null,
            google_rating: r.google_rating ?? null,
            google_review_count: r.google_review_count ?? null,
            google_maps_url: r.google_maps_url ?? null,
            phone: r.phone ?? null,
            website: r.website ?? null,
            hostel_type: r.hostel_type ?? null,
            gender: r.gender ?? 'Not Specified',
            monthly_rent: r.monthly_rent ?? null,
            security_deposit: r.security_deposit ?? null,
            room_type: r.room_type ?? null,
            food: Boolean(r.food),
            wifi: Boolean(r.wifi),
            laundry: Boolean(r.laundry),
            ac: Boolean(r.ac),
            parking: Boolean(r.parking),
            cctv: Boolean(r.cctv),
            security_24x7: Boolean(r.security_24x7),
            study_room: Boolean(r.study_room),
            availability: r.availability ?? 'Unknown',
            description: r.description ?? null,
            images: r.images ?? [],
            verification_status: r.verification_status ?? 'Not Verified',
            source: r.source ?? null,
            source_url: r.source_url ?? null,
            last_verified: r.last_verified ?? null,
            is_published: r.is_published ?? true,
        };

        let existingId: string | null = null;
        if (r.id) {
            const { data } = await supabase
                .from('hostels')
                .select('id')
                .eq('id', r.id)
                .maybeSingle();
            existingId = data?.id ?? null;
        }
        if (!existingId) {
            const { data } = await supabase
                .from('hostels')
                .select('id')
                .eq('slug', slug)
                .maybeSingle();
            existingId = data?.id ?? null;
        }

        if (existingId) {
            const { data: current } = await supabase
                .from('hostels')
                .select('*')
                .eq('id', existingId)
                .maybeSingle();
            const patch: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(payload)) {
                const curr = (current as Record<string, unknown> | null)?.[k];
                if (v == null && curr != null) continue;
                patch[k] = v;
            }
            const { error } = await supabase
                .from('hostels')
                .update(patch)
                .eq('id', existingId);
            if (!error) updated++;
        } else {
            const { error } = await supabase.from('hostels').insert(payload);
            if (!error) inserted++;
        }
    }

    return NextResponse.json({ inserted, updated, rejected });
}