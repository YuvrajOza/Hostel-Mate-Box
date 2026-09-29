export const CITIES = ['Ahmedabad', 'Anand', 'Vadodara'] as const;
export const GENDERS = ['Boys', 'Girls', 'Co-ed', 'Not Specified'] as const;
export const AVAILABILITIES = [
    'Available',
    'Limited',
    'Not Available',
    'Unknown',
] as const;
export const VERIFICATIONS = [
    'Verified',
    'Partially Verified',
    'Not Verified',
] as const;

export interface HostelFormValues {
    name: string;
    city: string;
    area: string;
    address: string;
    latitude: string;
    longitude: string;
    google_maps_url: string;
    google_rating: string;
    google_review_count: string;
    phone: string;
    website: string;
    hostel_type: string;
    gender: string;
    monthly_rent: string;
    security_deposit: string;
    room_type: string;
    food: boolean;
    wifi: boolean;
    laundry: boolean;
    ac: boolean;
    parking: boolean;
    cctv: boolean;
    security_24x7: boolean;
    study_room: boolean;
    availability: string;
    description: string;
    images: string[];
    verification_status: string;
    source: string;
    source_url: string;
    last_verified: string;
    is_published: boolean;
}

export const EMPTY_FORM: HostelFormValues = {
    name: '',
    city: '',
    area: '',
    address: '',
    latitude: '',
    longitude: '',
    google_maps_url: '',
    google_rating: '',
    google_review_count: '',
    phone: '',
    website: '',
    hostel_type: '',
    gender: 'Not Specified',
    monthly_rent: '',
    security_deposit: '',
    room_type: '',
    food: false,
    wifi: false,
    laundry: false,
    ac: false,
    parking: false,
    cctv: false,
    security_24x7: false,
    study_room: false,
    availability: 'Unknown',
    description: '',
    images: [],
    verification_status: 'Not Verified',
    source: '',
    source_url: '',
    last_verified: '',
    is_published: false,
};

export interface ValidationResult {
    ok: boolean;
    errors: Partial<Record<keyof HostelFormValues | 'form', string>>;
}

const URL_RE = /^https?:\/\/.+/i;
const PHONE_RE = /^[+0-9][0-9\s\-()]{6,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateHostelForm(v: HostelFormValues): ValidationResult {
    const errors: ValidationResult['errors'] = {};

    if (!v.name.trim() || v.name.trim().length < 2) {
        errors.name = 'Hostel name is required.';
    }
    if (!v.city) {
        errors.city = 'City is required.';
    } else if (!CITIES.includes(v.city as (typeof CITIES)[number])) {
        errors.city = 'City must be Ahmedabad, Anand, or Vadodara.';
    }

    if (v.gender && !GENDERS.includes(v.gender as (typeof GENDERS)[number])) {
        errors.gender = 'Invalid gender.';
    }
    if (
        v.availability &&
        !AVAILABILITIES.includes(v.availability as (typeof AVAILABILITIES)[number])
    ) {
        errors.availability = 'Invalid availability.';
    }
    if (
        v.verification_status &&
        !VERIFICATIONS.includes(
            v.verification_status as (typeof VERIFICATIONS)[number],
        )
    ) {
        errors.verification_status = 'Invalid verification status.';
    }

    const num = (s: string) => (s === '' ? null : Number(s));

    const rating = num(v.google_rating);
    if (rating != null && (Number.isNaN(rating) || rating < 0 || rating > 5)) {
        errors.google_rating = 'Rating must be between 0 and 5.';
    }

    const reviews = num(v.google_review_count);
    if (reviews != null && (Number.isNaN(reviews) || reviews < 0)) {
        errors.google_review_count = 'Review count cannot be negative.';
    }

    const rent = num(v.monthly_rent);
    if (rent != null && (Number.isNaN(rent) || rent < 0)) {
        errors.monthly_rent = 'Monthly rent cannot be negative.';
    }

    const deposit = num(v.security_deposit);
    if (deposit != null && (Number.isNaN(deposit) || deposit < 0)) {
        errors.security_deposit = 'Security deposit cannot be negative.';
    }

    const lat = num(v.latitude);
    if (lat != null && (Number.isNaN(lat) || lat < -90 || lat > 90)) {
        errors.latitude = 'Latitude must be between -90 and 90.';
    }

    const lng = num(v.longitude);
    if (lng != null && (Number.isNaN(lng) || lng < -180 || lng > 180)) {
        errors.longitude = 'Longitude must be between -180 and 180.';
    }

    if (v.website && !URL_RE.test(v.website.trim())) {
        errors.website = 'Website must be a valid http(s) URL.';
    }
    if (v.google_maps_url && !URL_RE.test(v.google_maps_url.trim())) {
        errors.google_maps_url = 'Google Maps URL must be a valid http(s) URL.';
    }
    if (v.source_url && !URL_RE.test(v.source_url.trim())) {
        errors.source_url = 'Source URL must be a valid http(s) URL.';
    }
    if (v.phone && !PHONE_RE.test(v.phone.trim())) {
        errors.phone = 'Phone number format looks invalid.';
    }
    if (v.last_verified && !DATE_RE.test(v.last_verified.trim())) {
        errors.last_verified = 'Use a valid date (YYYY-MM-DD).';
    }

    return { ok: Object.keys(errors).length === 0, errors };
}

/** Convert form values into the exact payload the API expects. */
export function formValuesToPayload(
    v: HostelFormValues,
): Record<string, unknown> {
    const num = (s: string) => (s === '' ? null : Number(s));
    const str = (s: string) => (s.trim() === '' ? null : s.trim());

    return {
        name: v.name.trim(),
        city: v.city,
        area: str(v.area),
        address: str(v.address),
        latitude: num(v.latitude),
        longitude: num(v.longitude),
        google_maps_url: str(v.google_maps_url),
        google_rating: num(v.google_rating),
        google_review_count: num(v.google_review_count),
        phone: str(v.phone),
        website: str(v.website),
        hostel_type: str(v.hostel_type),
        gender: v.gender || 'Not Specified',
        monthly_rent: num(v.monthly_rent),
        security_deposit: num(v.security_deposit),
        room_type: str(v.room_type),
        food: v.food,
        wifi: v.wifi,
        laundry: v.laundry,
        ac: v.ac,
        parking: v.parking,
        cctv: v.cctv,
        security_24x7: v.security_24x7,
        study_room: v.study_room,
        availability: v.availability || 'Unknown',
        description: str(v.description),
        images: v.images.filter((u) => u.trim() !== ''),
        verification_status: v.verification_status || 'Not Verified',
        source: str(v.source),
        source_url: str(v.source_url),
        last_verified: str(v.last_verified),
        is_published: v.is_published,
    };
}

/** Map a DB row back into form values (used by the edit page). */
export function rowToFormValues(row: Record<string, unknown>): HostelFormValues {
    const s = (v: unknown) => (v == null ? '' : String(v));
    const b = (v: unknown) => Boolean(v);

    return {
        name: s(row.name),
        city: s(row.city),
        area: s(row.area),
        address: s(row.address),
        latitude: s(row.latitude),
        longitude: s(row.longitude),
        google_maps_url: s(row.google_maps_url),
        google_rating: s(row.google_rating),
        google_review_count: s(row.google_review_count),
        phone: s(row.phone),
        website: s(row.website),
        hostel_type: s(row.hostel_type),
        gender: s(row.gender) || 'Not Specified',
        monthly_rent: s(row.monthly_rent),
        security_deposit: s(row.security_deposit),
        room_type: s(row.room_type),
        food: b(row.food),
        wifi: b(row.wifi),
        laundry: b(row.laundry),
        ac: b(row.ac),
        parking: b(row.parking),
        cctv: b(row.cctv),
        security_24x7: b(row.security_24x7),
        study_room: b(row.study_room),
        availability: s(row.availability) || 'Unknown',
        description: s(row.description),
        images: Array.isArray(row.images) ? (row.images as string[]) : [],
        verification_status: s(row.verification_status) || 'Not Verified',
        source: s(row.source),
        source_url: s(row.source_url),
        last_verified: s(row.last_verified).slice(0, 10),
        is_published: b(row.is_published),
    };
}