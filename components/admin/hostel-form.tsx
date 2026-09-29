'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/toast';
import {
    AVAILABILITIES,
    CITIES,
    EMPTY_FORM,
    GENDERS,
    VERIFICATIONS,
    formValuesToPayload,
    validateHostelForm,
    type HostelFormValues,
} from '@/lib/admin/hostel-schema';

interface Props {
    mode: 'create' | 'edit';
    hostelId?: string;
    initialValues?: HostelFormValues;
}

export function HostelForm({ mode, hostelId, initialValues }: Props) {
    const router = useRouter();
    const [v, setV] = useState<HostelFormValues>(initialValues ?? EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const set = <K extends keyof HostelFormValues>(k: K, val: HostelFormValues[K]) =>
        setV((prev) => ({ ...prev, [k]: val }));

    function updateImage(index: number, value: string) {
        const next = [...v.images];
        next[index] = value;
        set('images', next);
    }
    function addImage() {
        set('images', [...v.images, '']);
    }
    function removeImage(index: number) {
        set('images', v.images.filter((_, i) => i !== index));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;

        const validation = validateHostelForm(v);
        if (!validation.ok) {
            setErrors(validation.errors as Record<string, string>);
            toast('Please fix the highlighted fields.');
            return;
        }
        setErrors({});
        setSubmitting(true);

        try {
            const payload = formValuesToPayload(v);
            const url =
                mode === 'create'
                    ? '/api/admin/hostels'
                    : `/api/admin/hostels/${hostelId}`;
            const method = mode === 'create' ? 'POST' : 'PATCH';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                if (body?.fieldErrors) {
                    setErrors(body.fieldErrors as Record<string, string>);
                }
                toast(
                    body?.error ??
                    (mode === 'create'
                        ? 'Unable to create hostel.'
                        : 'Unable to update hostel.'),
                );
                return;
            }

            toast(
                mode === 'create'
                    ? 'Hostel added successfully.'
                    : 'Hostel updated successfully.',
            );
            router.push('/admin/hostels');
            router.refresh();
        } catch {
            toast(
                mode === 'create'
                    ? 'Unable to create hostel.'
                    : 'Unable to update hostel.',
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <Section title="Basic information">
                <Field label="Hostel Name *" error={errors.name}>
                    <input
                        type="text"
                        value={v.name}
                        onChange={(e) => set('name', e.target.value)}
                        className={inputCls}
                    />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="City *" error={errors.city}>
                        <select
                            value={v.city}
                            onChange={(e) => set('city', e.target.value)}
                            className={inputCls}
                        >
                            <option value="">Select city</option>
                            {CITIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Area">
                        <input
                            type="text"
                            value={v.area}
                            onChange={(e) => set('area', e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                </div>

                <Field label="Full Address">
                    <input
                        type="text"
                        value={v.address}
                        onChange={(e) => set('address', e.target.value)}
                        className={inputCls}
                    />
                </Field>
            </Section>

            <Section title="Location">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Latitude" error={errors.latitude}>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={v.latitude}
                            onChange={(e) => set('latitude', e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Longitude" error={errors.longitude}>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={v.longitude}
                            onChange={(e) => set('longitude', e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                </div>

                <Field label="Google Maps URL" error={errors.google_maps_url}>
                    <input
                        type="url"
                        value={v.google_maps_url}
                        onChange={(e) => set('google_maps_url', e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className={inputCls}
                    />
                </Field>
            </Section>

            <Section title="Google information">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Google Rating (0–5)" error={errors.google_rating}>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={v.google_rating}
                            onChange={(e) => set('google_rating', e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Google Review Count" error={errors.google_review_count}>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={v.google_review_count}
                            onChange={(e) => set('google_review_count', e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                </div>
            </Section>

            <Section title="Contact">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Phone" error={errors.phone}>
                        <input
                            type="tel"
                            value={v.phone}
                            onChange={(e) => set('phone', e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Website" error={errors.website}>
                        <input
                            type="url"
                            value={v.website}
                            onChange={(e) => set('website', e.target.value)}
                            placeholder="https://..."
                            className={inputCls}
                        />
                    </Field>
                </div>
            </Section>

            <Section title="Hostel information">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Hostel Type">
                        <input
                            type="text"
                            value={v.hostel_type}
                            onChange={(e) => set('hostel_type', e.target.value)}
                            placeholder="Boys Hostel / Girls PG / Co-living"
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Gender" error={errors.gender}>
                        <select
                            value={v.gender}
                            onChange={(e) => set('gender', e.target.value)}
                            className={inputCls}
                        >
                            {GENDERS.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Monthly Rent (₹)" error={errors.monthly_rent}>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={v.monthly_rent}
                            onChange={(e) => set('monthly_rent', e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Security Deposit (₹)" error={errors.security_deposit}>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={v.security_deposit}
                            onChange={(e) => set('security_deposit', e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Room Type">
                        <input
                            type="text"
                            value={v.room_type}
                            onChange={(e) => set('room_type', e.target.value)}
                            placeholder="Single / Double / Triple Sharing"
                            className={inputCls}
                        />
                    </Field>
                </div>
            </Section>

            <Section title="Facilities">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Checkbox label="Food" checked={v.food} onChange={(x) => set('food', x)} />
                    <Checkbox label="Wi-Fi" checked={v.wifi} onChange={(x) => set('wifi', x)} />
                    <Checkbox
                        label="Laundry"
                        checked={v.laundry}
                        onChange={(x) => set('laundry', x)}
                    />
                    <Checkbox label="AC" checked={v.ac} onChange={(x) => set('ac', x)} />
                    <Checkbox
                        label="Parking"
                        checked={v.parking}
                        onChange={(x) => set('parking', x)}
                    />
                    <Checkbox label="CCTV" checked={v.cctv} onChange={(x) => set('cctv', x)} />
                    <Checkbox
                        label="24x7 Security"
                        checked={v.security_24x7}
                        onChange={(x) => set('security_24x7', x)}
                    />
                    <Checkbox
                        label="Study Room"
                        checked={v.study_room}
                        onChange={(x) => set('study_room', x)}
                    />
                </div>
            </Section>

            <Section title="Availability & verification">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Availability" error={errors.availability}>
                        <select
                            value={v.availability}
                            onChange={(e) => set('availability', e.target.value)}
                            className={inputCls}
                        >
                            {AVAILABILITIES.map((a) => (
                                <option key={a} value={a}>
                                    {a}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field
                        label="Verification status"
                        error={errors.verification_status}
                    >
                        <select
                            value={v.verification_status}
                            onChange={(e) => set('verification_status', e.target.value)}
                            className={inputCls}
                        >
                            {VERIFICATIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>
            </Section>

            <Section title="Description">
                <Field label="Description">
                    <textarea
                        rows={4}
                        value={v.description}
                        onChange={(e) => set('description', e.target.value)}
                        className={inputCls}
                    />
                </Field>
            </Section>

            <Section title="Images">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Paste direct image URLs (https://…). Leave blank if unknown.
                </p>
                <div className="space-y-2">
                    {v.images.map((url, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => updateImage(i, e.target.value)}
                                placeholder="https://..."
                                className={inputCls}
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-rose-500/10"
                                aria-label="Remove image"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addImage}
                        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200"
                    >
                        <Plus className="h-4 w-4" /> Add image URL
                    </button>
                </div>
            </Section>

            <Section title="Source & provenance">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Source">
                        <input
                            type="text"
                            value={v.source}
                            onChange={(e) => set('source', e.target.value)}
                            placeholder="Google Places / Manual / Official Website"
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Source URL" error={errors.source_url}>
                        <input
                            type="url"
                            value={v.source_url}
                            onChange={(e) => set('source_url', e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Last verified" error={errors.last_verified}>
                        <input
                            type="date"
                            value={v.last_verified}
                            onChange={(e) => set('last_verified', e.target.value)}
                            className={inputCls}
                        />
                    </Field>
                </div>
            </Section>

            <Section title="Publication">
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200">
                    <input
                        type="checkbox"
                        checked={v.is_published}
                        onChange={(e) => set('is_published', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
                    />
                    Publish on the public website
                </label>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    New hostels default to <strong>unpublished</strong> until you check this box.
                </p>
            </Section>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {mode === 'create' ? 'Create Hostel' : 'Save Changes'}
                </button>
                <Link
                    href="/admin/hostels"
                    className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111A2E] dark:text-slate-200"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}

const inputCls =
    'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-[#0B1220] dark:text-white dark:placeholder:text-slate-500';

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="card-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {title}
            </h2>
            <div className="mt-4 space-y-4">{children}</div>
        </div>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                    {error}
                </p>
            )}
        </div>
    );
}

function Checkbox({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
            />
            {label}
        </label>
    );
}