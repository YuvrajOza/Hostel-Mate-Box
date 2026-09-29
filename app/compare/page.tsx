import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CompareClient } from '@/components/compare/compare-client';

export const metadata: Metadata = {
    title: 'Compare Hostels — HostelMate',
    description: 'Compare up to 3 hostels side by side.',
};

export default function ComparePage() {
    return (
        <>
            <Navbar />
            <main>
                <CompareClient />
            </main>
            <Footer />
        </>
    );
}