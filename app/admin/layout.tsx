import type { Metadata } from 'next';
import { requireAdminPage } from '@/lib/admin/require-admin';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminMobileHeader } from '@/components/admin/admin-mobile-header';

export const metadata: Metadata = {
    title: 'Admin — HostelMate',
    description: 'HostelMate admin dashboard.',
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Throws a redirect if the caller is not a signed-in admin.
    await requireAdminPage();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1220]">
            <div className="mx-auto flex w-full max-w-[1400px] gap-0 lg:gap-6 lg:px-6 lg:py-6">
                <AdminSidebar />
                <div className="min-w-0 flex-1">
                    <AdminMobileHeader />
                    <div className="px-4 py-6 sm:px-6 lg:px-0">{children}</div>
                </div>
            </div>
        </div>
    );
}