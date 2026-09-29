'use client';

import { useContext } from 'react';
import { AuthContext } from './auth-provider';

export function useUser() {
    return useContext(AuthContext);
}