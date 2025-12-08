'use client';

import { useEffect, useState } from 'react';
import { SetAsSeenButton } from '@/components/movies/set-as-seen-btn';
import { ResetWatchedAtButton } from '@/components/movies/reset-watched-at-btn';

type Props = {
    userEmail: string;
    movieId: number;
    initialWatchedAt: number | null;
};

export function SeenStatusClient({ userEmail, movieId, initialWatchedAt }: Props) {
    const [watchedAt, setWatchedAt] = useState<string>('Not yet');

    useEffect(() => {
        if (initialWatchedAt !== null) {
            setWatchedAt(new Date(initialWatchedAt).toLocaleDateString());
        } else {
            setWatchedAt('Not yet');
        }
    }, [initialWatchedAt]);

    const handleSet = () => {
        setWatchedAt(new Date().toLocaleDateString());
    };

    const handleReset = () => {
        setWatchedAt('Not yet');
    };

    return (
        <div className="flex align-bottom justify-between items-end">
            <span className="align-bottom flex">Watched At: {watchedAt}</span>
            <div className="flex gap-2">
                { watchedAt === 'Not yet' ? (
                    <SetAsSeenButton
                        userEmail={userEmail}
                        movieId={movieId}
                        callbackAction={handleSet}
                    />
                ) : (<ResetWatchedAtButton
                    userEmail={userEmail}
                    movieId={movieId}
                    callbackAction={handleReset}
                />)}
            </div>
        </div>
    );
}
