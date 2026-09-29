'use client';

import {
    createContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

interface AuthContextValue {
    user: User | null;
    session: Session | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
    user: null,
    session: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = getSupabaseBrowserClient();

        supabase.auth
            .getSession()
            .then((res: { data: { session: Session | null } }) => {
                setSession(res.data.session);
                setUser(res.data.session?.user ?? null);
                setLoading(false);
            });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, newSession: Session | null) => {
                setSession(newSession);
                setUser(newSession?.user ?? null);
                setLoading(false);
            },
        );

        return () => subscription.unsubscribe();
    }, []);

    const value = useMemo(
        () => ({ user, session, loading }),
        [user, session, loading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}