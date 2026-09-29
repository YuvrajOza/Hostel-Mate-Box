'use client';

import { X } from 'lucide-react';

export function CompareRemoveButton({ onRemove }: { onRemove: () => void }) {
    return (
        <button
            type="button"
            onClick={onRemove}
            aria-label="Remove from comparison"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
        >
            <X className="h-4 w-4" />
        </button>
    );
}