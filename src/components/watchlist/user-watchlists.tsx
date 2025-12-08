'use client';

import { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import type { WatchlistCard } from '@/lib/movies';

type UserWatchlistsPageProps = {
	watchlistsArray: WatchlistCard[];
	favouriteWatchlist: (
		watchlistId: number,
		isFavourite: boolean
	) => Promise<void>;
	deleteWatchlist: (watchlistId: number) => Promise<void>;
};

const UserWatchlistsPage = ({
	watchlistsArray,
	favouriteWatchlist,
	deleteWatchlist
}: UserWatchlistsPageProps) => {
	const router = useRouter();
	const [watchlistsState, setWatchlistsState] =
		useState<WatchlistCard[]>(watchlistsArray);
	const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
		null
	);

	const sortedWatchlists = [...watchlistsState].sort((a, b) =>
		a.favourite && !b.favourite ? -1 : !a.favourite && b.favourite ? 1 : 0
	);

	return (
		<main className="container mx-auto px-4 py-8 text-white sm:px-6">
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-2xl font-bold sm:text-3xl">Your Watchlists</h1>
				<button
					onClick={() => router.push('/watchlists/create')}
					className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
				>
					Create Watchlist
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{sortedWatchlists.map(watchlist => {
					if (watchlist.id === -1) {
						return (
							<div
								key={`empty-${Math.random()}`}
								className="flex flex-col justify-center rounded-xl border border-gray-700 bg-gray-800/50 p-4 text-gray-400 shadow-md"
							>
								<p className="text-center">Empty Slot</p>
							</div>
						);
					}

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
								<p className="line-clamp-2 text-sm text-gray-400">
									{watchlist.description ?? 'No description'}
								</p>

								{/* Movies list */}
								<div className="mt-2 flex max-h-36 flex-col gap-1 overflow-y-auto">
									{watchlist.movies?.slice(0, 5).map(movie => (
										<div
											key={movie.id}
											className="flex h-7 items-center gap-2 rounded bg-gray-800/70 px-2 py-1"
										>
											<Image
												src={movie.image ?? '/icons/default-movie.svg'}
												alt={movie.title}
												width={24}
												height={24}
												className="h-6 w-6 shrink-0 rounded object-cover"
											/>
											<span className="truncate text-sm font-semibold text-white">
												{movie.title}
											</span>
										</div>
									))}
									{watchlist.movies && watchlist.movies.length > 5 && (
										<span className="mt-1 truncate text-xs text-gray-400">
											+{watchlist.movies.length - 5} more
										</span>
									)}
								</div>

								<p className="mt-1 text-sm text-gray-400">
									{watchlist.movies.length !== 1
										? `${watchlist.movies.length} movies`
										: `${watchlist.movies.length} movie`}
								</p>
							</div>

							{/* Action buttons */}
							<div className="mt-4 flex flex-col gap-2 sm:flex-row">
								<button
									onClick={() =>
										router.push(`/watchlists/edit/${watchlist.id}`)
									}
									className="w-full cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:flex-1"
								>
									Edit
								</button>

								{watchlist.default !== 1 && (
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
											void deleteWatchlist(watchlist.id);
										}}
										className="w-full cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 sm:flex-1"
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
		</main>
	);
};

export default UserWatchlistsPage;
