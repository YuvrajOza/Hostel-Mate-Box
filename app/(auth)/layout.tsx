import Link from 'next/link';
import { Home as HomeIcon } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-[#F8FAFC] dark:bg-[#0B1220]">
            <header className="container-page flex h-16 items-center">
                <Link href="/" className="flex items-center gap-2.5 focus-ring rounded-xl">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
                        <HomeIcon className="h-5 w-5" />
                    </span>
                    <span className="flex flex-col leading-none">
                        <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                            HostelMate
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                            Find • Compare • Choose
                        </span>
                    </span>
                </Link>
            </header>

            <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:items-center sm:pt-0">
                <div className="w-full max-w-md">{children}</div>
            </main>
        </div>
    );
}