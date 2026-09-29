export type City = "Ahmedabad" | "Anand" | "Vadodara" | (string & {});
export type Gender = "Boys" | "Girls" | "Co-ed";
export type HostelType = "Hostel" | "PG" | "Co-living";
export type RoomType = "Single" | "Double" | "Triple" | "Dormitory";
export type VerificationStatus = "Verified" | "verified" | "pending" | "unverified" | "Partially Verified" | "Not Verified";
export type Availability = "Available" | "Limited" | "Not Available" | "Unknown" | "available" | "few-beds" | "full";

export type SortOption =
    | "recommended"
    | "highest-rated"
    | "most-reviewed"
    | "lowest-rent"
    | "highest-rent"
    | "nearest";

/** Database row schema (Supabase table) */
export interface HostelRow {
    id: string;
    name: string;
    slug?: string;
    city: string;
    area?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    google_rating?: number | null;
    google_review_count?: number | null;
    google_maps_url?: string | null;
    phone?: string | null;
    website?: string | null;
    hostel_type?: HostelType | null;
    gender: Gender;
    monthly_rent?: number | null;
    security_deposit?: number | null;
    room_type?: RoomType | null;
    food: boolean;
    wifi: boolean;
    laundry: boolean;
    ac: boolean;
    parking: boolean;
    cctv: boolean;
    security_24x7: boolean;
    study_room: boolean;
    availability: Availability;
    description?: string | null;
    images?: string[] | null;
    verification_status: VerificationStatus;
    last_verified?: string | null;
    source?: string | null;
    source_url?: string | null;
    ranking_score?: number | null;
    is_published: boolean;
    last_refreshed_at?: string | null;
    created_at: string;
    updated_at: string;
}

/** Domain object representation used across UI components & services */
export interface Hostel {
    id: string;
    name: string;
    slug?: string;
    city: City;
    area: string;
    address: string;
    latitude?: number;
    longitude?: number;
    googleRating?: number;
    googleReviewCount?: number;
    googleMapsUrl?: string;
    phone?: string;
    website?: string;
    hostelType?: HostelType;
    gender: Gender;
    monthlyRent?: number;
    securityDeposit?: number;
    roomType?: RoomType;
    food: boolean;
    wifi: boolean;
    laundry: boolean;
    ac: boolean;
    parking: boolean;
    cctv: boolean;
    security24x7: boolean;
    studyRoom: boolean;
    availability: Availability;
    description?: string;
    images: string[];
    verificationStatus: VerificationStatus;
    lastVerified?: string;
    source?: string;
    sourceUrl?: string;
    rankingScore?: number;
    isPublished?: boolean;
    lastRefreshedAt?: string;
    createdAt?: string;
    updatedAt?: string;

    // Optional snake_case fields for admin-data backward compatibility
    google_rating?: number | null;
    google_review_count?: number | null;
    google_maps_url?: string | null;
    monthly_rent?: number;
    security_deposit?: number;
    room_type?: RoomType;
    hostel_type?: HostelType;
    security_24x7?: boolean;
    study_room?: boolean;
    verification_status?: VerificationStatus;
    last_verified?: string;
    created_at?: string;
    updated_at?: string;
    isDemo?: boolean;
}

export interface HostelSearchParams {
    q?: string;
    city?: string;
    minRent?: number;
    maxRent?: number;
    gender?: Gender;
    rating?: number;
    distance?: number;
    facilities?: string[];
    availability?: Availability;
    sort?: SortOption;
    page?: number;
    limit?: number;
}

export interface HostelSearchResult {
    items: Hostel[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export type HostelDetails = Hostel & {
    reviews: Review[];
    reviewCount: number;
    reviewAverage?: number;
    similar?: Hostel[];
};

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    college?: string;
    city?: City;
    budget?: number;
    gender_preference?: Gender | "";
    created_at: string;
}

export interface Favourite {
    id: string;
    user_id: string;
    hostel_id: string;
    created_at: string;
}

export interface ReviewRow {
    id: string;
    user_id: string;
    hostel_id: string;
    rating: number;
    comment: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;
}

export interface Review {
    id: string;
    user_id: string;
    hostel_id: string;
    rating: number;
    comment?: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;

    // camelCase aliases:
    userId?: string;
    hostelId?: string;
    createdAt?: string;
}

export interface EnquiryInput {
    hostelId: string;
    userId?: string | null;
    name: string;
    email: string;
    phone: string;
    message: string;
}

export interface EnquiryRow {
    id: string;
    user_id: string | null;
    hostel_id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: "new" | "contacted" | "closed";
    created_at: string;
}

export interface Enquiry {
    id: string;
    user_id: string | null;
    hostel_id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: "new" | "contacted" | "closed";
    created_at: string;
}