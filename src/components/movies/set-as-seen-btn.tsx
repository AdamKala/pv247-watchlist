'use client';

import { useTransition } from "react";
import { setMovieWatchedAt } from "@/db/movieVisits";

type Props = {
    userEmail: string;
    movieId: number;
    callbackAction?: () => void;
};

export function SetAsSeenButton({
                                    userEmail,
                                    movieId,
                                    callbackAction,
                                }: Props) {
    const [isPending, startTransition] = useTransition();

    const onClick = () => {
        startTransition(async () => {
            await setMovieWatchedAt(userEmail, movieId, Date.now());
            callbackAction?.();
        });
    };

    return (
        <button onClick={onClick} disabled={isPending} className="rounded-2xl bg-gray-700 px-5 py-2 cursor-pointer">
            {isPending ? "Saving…" : "Set as seen"}
        </button>
    );
}
