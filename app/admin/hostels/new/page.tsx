import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { HostelForm } from '@/components/admin/hostel-form';

export const dynamic = 'force-dynamic';

export default function AddHostelPage() {
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
                    Add Hostel
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    New hostels are saved as <strong>unpublished</strong> unless you check the
                    publish box.
                </p>
            </header>

            <HostelForm mode="create" />
        </div>
    );
}