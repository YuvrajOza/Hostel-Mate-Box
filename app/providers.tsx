'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { ToastHost } from '@/components/ui/toast';
import { AuthProvider } from '@/components/auth/auth-provider';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                {children}
                <ToastHost />
            </AuthProvider>
        </ThemeProvider>
    );
}