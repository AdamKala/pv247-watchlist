'use client';

import { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type WatchlistCard = {
	id: number;
	name: string;
	description: string | null;
	favourite: number | null;
	default: number | null;
	movies: number;
};

type UserWatchlistsProps = {
	watchlists: WatchlistCard[];
	favouriteWatchlist: (
		watchlistId: number,
		isFavourite: boolean
	) => Promise<void>;
	onDelete?: (watchlistId: number) => Promise<void>;
};

const UserWatchlists = ({
	watchlists,
	favouriteWatchlist,
	onDelete
}: UserWatchlistsProps) => {
	const [watchlistsState, setWatchlistsState] =
		useState<WatchlistCard[]>(watchlists);

	const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
		null
	);

	const sortedWatchlists = [...watchlistsState].sort((a, b) =>
		a.favourite && !b.favourite ? -1 : !a.favourite && b.favourite ? 1 : 0
	);

	const router = useRouter();

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{sortedWatchlists.map(watchlist => {
				const isFavourite = watchlist.favourite === 1;

				return (
					<div
						key={watchlist.id}
						className="relative flex flex-col justify-between rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-md transition hover:border-blue-600 hover:shadow-lg"
					>
						{/* Favourite star */}
						<div className="absolute top-2 right-2 text-xl text-yellow-400 sm:top-3 sm:right-3">
							{isFavourite ? (
								<AiFillStar
									onClick={() => {
										favouriteWatchlist(watchlist.id, false);
										setWatchlistsState(prev =>
											prev.map(w =>
												w.id === watchlist.id ? { ...w, favourite: 0 } : w
											)
										);
									}}
								/>
							) : (
								<AiOutlineStar
									onClick={() => {
										favouriteWatchlist(watchlist.id, true);
										setWatchlistsState(prev =>
											prev.map(w =>
												w.id === watchlist.id ? { ...w, favourite: 1 } : w
											)
										);
									}}
								/>
							)}
						</div>

						{/* Card content */}
						<div className="flex flex-col gap-2">
							<Link
								href={`/watchlists/${watchlist.id}`}
								className="truncate text-lg font-bold text-white hover:underline"
							>
								{watchlist.name}
							</Link>
							<p className="line-clamp-3 text-sm text-gray-400">
								{watchlist.description ?? 'No description'}
							</p>
							<p className="text-sm text-gray-400">{watchlist.movies} movies</p>
						</div>

						{/* Buttons */}
						<div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-2">
							<button
								onClick={() => router.push(`/watchlists/edit/${watchlist.id}`)}
								className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
							>
								Edit
							</button>

							{onDelete && watchlist.default !== 1 && (
								<button
									onClick={() => {
										if (deleteConfirmation !== watchlist.id) {
											setDeleteConfirmation(watchlist.id);
											setTimeout(() => setDeleteConfirmation(null), 5000);
											return;
										}

										setWatchlistsState(prev =>
											prev.filter(w => w.id !== watchlist.id)
										);
										void onDelete(watchlist.id);
									}}
									className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
								>
									{deleteConfirmation === watchlist.id
										? 'Are you sure?'
										: 'Delete'}
								</button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default UserWatchlists;
