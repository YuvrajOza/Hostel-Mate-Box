"use client";
import { Hostel } from "@/lib/types";
import { readLS, writeLS, uid } from "@/lib/store";
import { HOSTELS } from "@/lib/data/hostels";
import { useEffect, useState, useCallback } from "react";

const ADMIN_CITIES_KEY = "hm.admin.cities";
const ADMIN_HOSTELS_KEY = "hm.admin.hostels";

export interface AdminCity {
    id: string;
    name: string;
    state: string;
    created_at: string;
}

/* ---------------- Cities ---------------- */

function readAdminCities(): AdminCity[] {
    return readLS<AdminCity[]>(ADMIN_CITIES_KEY, []);
}

export function useAdminCities() {
    const [cities, setCities] = useState<AdminCity[]>([]);
    const reload = useCallback(() => setCities(readAdminCities()), []);
    useEffect(() => {
        reload();
    }, [reload]);

    const add = (name: string, state = "Gujarat") => {
        const trimmed = name.trim();
        if (!trimmed) return { ok: false, error: "City name is required." };
        if (trimmed.length < 2)
            return { ok: false, error: "City name is too short." };

        const existing = readAdminCities();
        const seeds = ["Ahmedabad", "Anand", "Vadodara"];
        if (
            seeds.some((s) => s.toLowerCase() === trimmed.toLowerCase()) ||
            existing.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())
        ) {
            return { ok: false, error: "That city already exists." };
        }

        const next = [
            ...existing,
            {
                id: uid(),
                name: trimmed,
                state: state.trim() || "Gujarat",
                created_at: new Date().toISOString(),
            },
        ];
        writeLS(ADMIN_CITIES_KEY, next);
        setCities(next);
        return { ok: true };
    };

    const remove = (id: string) => {
        const next = readAdminCities().filter((c) => c.id !== id);
        writeLS(ADMIN_CITIES_KEY, next);
        setCities(next);
    };

    return { cities, add, remove, reload };
}

export function useAllCities() {
    const { cities } = useAdminCities();
    const seeds = ["Ahmedabad", "Anand", "Vadodara"];
    const admin = cities.map((c) => c.name);
    return [...seeds, ...admin];
}

/* ---------------- Hostels ---------------- */

function readAdminHostels(): Hostel[] {
    return readLS<Hostel[]>(ADMIN_HOSTELS_KEY, []);
}

export function useAdminHostels() {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const reload = useCallback(() => setHostels(readAdminHostels()), []);
    useEffect(() => {
        reload();
    }, [reload]);

    const add = (input: {
        name: string;
        city: string;
        area: string;
        address: string;
        hostel_type: Hostel["hostel_type"];
        gender: Hostel["gender"];
        monthly_rent: number;
        security_deposit: number;
        room_type: Hostel["room_type"];
        food: boolean;
        wifi: boolean;
        laundry: boolean;
        ac: boolean;
        parking: boolean;
        cctv: boolean;
        security_24x7: boolean;
        study_room: boolean;
        availability: Hostel["availability"];
        description: string;
    }) => {
        if (!input.name.trim())
            return { ok: false, error: "Hostel name is required." };
        if (!input.city.trim()) return { ok: false, error: "City is required." };
        if (!input.monthly_rent || input.monthly_rent <= 0)
            return { ok: false, error: "Monthly rent must be greater than 0." };

        const now = new Date().toISOString();
        const hostel: Hostel = {
            id: uid(),
            name: input.name.trim(),
            city: input.city.trim(),
            area: input.area.trim(),
            address:
                input.address.trim() ||
                `DEMO ADDRESS, ${input.area}, ${input.city}`,
            latitude: 0,
            longitude: 0,
            google_rating: null,
            google_review_count: null,
            phone: undefined,
            website: undefined,
            google_maps_url: undefined,
            hostel_type: input.hostel_type,
            gender: input.gender,
            monthly_rent: input.monthly_rent,
            security_deposit: input.security_deposit,
            room_type: input.room_type,
            food: input.food,
            wifi: input.wifi,
            laundry: input.laundry,
            ac: input.ac,
            parking: input.parking,
            cctv: input.cctv,
            security_24x7: input.security_24x7,
            security24x7: input.security_24x7,
            study_room: input.study_room,
            studyRoom: input.study_room,
            availability: input.availability,
            description: input.description || "Admin-added listing.",
            images: [],
            verification_status: "pending",
            verificationStatus: "pending",
            last_verified: now,
            created_at: now,
            updated_at: now,
            isDemo: true,
        };

        const next = [...readAdminHostels(), hostel];
        writeLS(ADMIN_HOSTELS_KEY, next);
        setHostels(next);
        return { ok: true, hostel };
    };

    const remove = (id: string) => {
        const next = readAdminHostels().filter((h) => h.id !== id);
        writeLS(ADMIN_HOSTELS_KEY, next);
        setHostels(next);
    };

    return { hostels, add, remove, reload };
}

export function useAllHostels() {
    const { hostels } = useAdminHostels();
    return [...HOSTELS, ...hostels];
}