'use client';

import { useRouter, usePathname } from 'next/navigation';
import { toast } from '@/components/ui/toast';
import { useUser } from './use-user';

export function useRequireLogin() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useUser();

    function requireLogin(message = 'Please log in to save hostels.') {
        if (loading) return false;
        if (user) return true;
        toast(message);
        const redirect =
            typeof window !== 'undefined'
                ? window.location.pathname + window.location.search
                : pathname;
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        return false;
    }

    return { requireLogin, user, loading };
}