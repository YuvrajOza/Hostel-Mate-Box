import { NextRequest } from 'next/server';

export function isAdmin(req: NextRequest): boolean {
    const token = process.env.ADMIN_IMPORT_TOKEN;
    if (!token) return false;
    const provided =
        req.headers.get('x-admin-token') ??
        req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    return provided === token;
}