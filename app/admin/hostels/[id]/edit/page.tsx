import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { HostelForm } from '@/components/admin/hostel-form';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { rowToFormValues } from '@/lib/admin/hostel-schema';

export const dynamic = 'force-dynamic';

export default async function EditHostelPage({
    params,
}: {
    params: { id: string };
}) {
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(params.id)) notFound();

    const supabase = getSupabaseServerClient();
    const { data: row } = await supabase
        .from('hostels')
        .select('*')
        .eq('id', params.id)
        .maybeSingle();

    if (!row) notFound();

    const initialValues = rowToFormValues(row as Record<string, unknown>);

    return (
        <div>
            <header className="mb-6">
                <Link
                    href="/admin/hostels"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to hostels
                </Link>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                    Edit Hostel
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {initialValues.name || 'Untitled hostel'}
                </p>
            </header>

            <HostelForm
                mode="edit"
                hostelId={params.id}
                initialValues={initialValues}
            />
        </div>
    );
}