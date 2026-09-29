import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
    title: 'Login — HostelMate',
    description: 'Sign in to HostelMate to save hostels and compare them later.',
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="card-surface h-96 animate-pulse" />}>
            <LoginForm />
        </Suspense>
    );
}