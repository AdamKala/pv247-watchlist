'use client';

import { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useRouter } from 'next/navigation';

import type { Watchlist } from '@/lib/movies';

type UserWatchlistsProps = {
	watchlists: Watchlist[];
	favouriteWatchlist: (watchlistId: number, isFavourite: boolean) => void;
	onDelete?: (watchlistId: number) => Promise<void>;
};

const UserWatchlists = ({
	watchlists,
	favouriteWatchlist,
	onDelete
}: UserWatchlistsProps) => {
	const [watchlistsState, setWatchlistsState] =
		useState<Watchlist[]>(watchlists);
	const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
		null
	);

	const sortedWatchlists = [...watchlistsState].sort((a, b) =>
		a.favourite && !b.favourite ? -1 : !a.favourite && b.favourite ? 1 : 0
	);

	const router = useRouter();

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{sortedWatchlists.map(watchlist => {
				const isFavourite = watchlist.favourite === 1;

				return (
					<div
						key={watchlist.id}
						className="relative flex flex-col justify-between rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-md transition hover:border-blue-600 hover:shadow-lg"
					>
						<div className="absolute top-2 right-2 cursor-pointer text-xl text-yellow-400">
							{isFavourite ? (
								<AiFillStar
									onClick={() => {
										favouriteWatchlist(watchlist.id, false);
										setWatchlistsState(watchlistsState =>
											watchlistsState.map(w =>
												w.id === watchlist.id ? { ...w, favourite: 0 } : w
											)
										);
									}}
								/>
							) : (
								<AiOutlineStar
									onClick={() => {
										favouriteWatchlist(watchlist.id, true);
										setWatchlistsState(watchlistsState =>
											watchlistsState.map(w =>
												w.id === watchlist.id ? { ...w, favourite: 1 } : w
											)
										);
									}}
								/>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<h3 className="text-lg font-bold text-white">{watchlist.name}</h3>
							<p className="text-sm text-gray-400">
								{watchlist.description ?? 'No description'}
							</p>
							<p className="text-sm text-gray-400">
								{watchlist.movies ?? 0} movies
							</p>
						</div>

						<div className="mt-4 flex gap-2">
							<button
								onClick={() => router.push(`/movielists/edit/${watchlist.id}`)}
								className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
							>
								Edit
							</button>
							{onDelete && (
								<button
									onClick={() => {
										if (deleteConfirmation !== watchlist.id) {
											setDeleteConfirmation(watchlist.id);
											setTimeout(() => setDeleteConfirmation(null), 5000);
											return;
										}
										setWatchlistsState(watchlistsState =>
											watchlistsState.filter(w => w.id !== watchlist.id)
										);
										onDelete(watchlist.id);
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
