import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldAlert } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
    title: 'Access Denied — HostelMate',
    description: 'You do not have permission to access this page.',
};

export default function ForbiddenPage() {
    return (
        <>
            <Navbar />
            <main className="container-page py-20">
                <div className="card-surface mx-auto max-w-lg p-8 text-center">
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                        <ShieldAlert className="h-6 w-6" />
                    </span>
                    <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        You do not have permission to access this page.
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        This area is restricted to HostelMate administrators.
                    </p>
                    <Link
                        href="/"
                        className="mt-6 inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
                    >
                        Back to HostelMate
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    );
}