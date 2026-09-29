"use client";

export function readLS<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

export function writeLS<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { }
}

export const KEYS = {
    theme: "hm.theme",
    user: "hm.user",
    users: "hm.users",
    favourites: "hm.favourites",
    compare: "hm.compare",
    reviews: "hm.reviews",
    enquiries: "hm.enquiries",
    cities: "hm.cities",
} as const;

export const uid = () =>
    Math.random().toString(36).slice(2, 10) + Date.now().toString(36);