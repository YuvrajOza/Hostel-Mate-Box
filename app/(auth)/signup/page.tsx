import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
    title: 'Create Account — HostelMate',
    description: 'Create your HostelMate account to save and compare hostels.',
};

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="card-surface h-96 animate-pulse" />}>
            <SignupForm />
        </Suspense>
    );
}