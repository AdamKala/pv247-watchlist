'use client';

import { useTransition } from 'react';
import { resetMovieWatchedAt } from '@/db/movieVisits';

type Props = {
    userEmail: string;
    movieId: number;
    callbackAction?: () => void;
};

export function ResetWatchedAtButton({ userEmail, movieId, callbackAction }: Props) {
    const [isPending, startTransition] = useTransition();

    const onClick = () => {
        startTransition(async () => {
            await resetMovieWatchedAt(userEmail, movieId);
            callbackAction?.();
        });
    };

    return (
        <button onClick={onClick} disabled={isPending} className="rounded-2xl bg-gray-700 px-5 py-2 cursor-pointer">
            {isPending ? 'Resetting…' : 'Reset watched'}
        </button>
    );
}
