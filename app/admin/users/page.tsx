import { Users, UserCheck } from "lucide-react";

export default function AdminUsersPage() {
    return (
        <div className="p-6 max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage registered student accounts and platform administrators.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-brand-400">
                    <Users className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">User Management Console</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Users will appear here once authenticated through Supabase Auth or Google Login.
                </p>
            </div>
        </div>
    );
}
