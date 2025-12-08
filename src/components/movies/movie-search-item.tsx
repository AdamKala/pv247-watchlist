'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import ModalMovie from '@/components/ui/modal-movie';
import WatchlistSelect from '@/components/watchlist/watchlist-select';
import type { MovieSearchItemProps } from '@/lib/movies';
import { useWatchlistContext } from '@/context/watchlist-context';
import { addToWatchlistAction } from '@/actions/watchlist/add-to-watchlist';

const MovieSearchItem = (movieData: MovieSearchItemProps) => {
	const [open, setOpen] = useState(false);
	const [selectedWatchlist, setSelectedWatchlist] = useState<string>('');
	const { watchlists } = useWatchlistContext();

	const handleAddToWatchlist = async (watchlistId: string) => {
		if (!watchlistId) return;

		await addToWatchlistAction(parseInt(watchlistId, 10), movieData);

		setOpen(false);
	};

	return (
		<>
			<div className="flex w-full items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 shadow-sm">
				<Image
					width={80}
					height={96}
					className="h-24 w-20 rounded-md border border-gray-700 object-cover"
					src={movieData.posterUrl}
					alt={`poster-${movieData.title}`}
				/>

				<div className="flex flex-1 flex-col">
					<h2 className="text-xl font-semibold text-white">
						{movieData.title}
					</h2>
					<div className="text-sm text-gray-300">{movieData.year}</div>

					<div className="mt-1 flex flex-wrap gap-1 text-sm text-gray-400">
						{movieData.origins.map(origin => (
							<span
								key={origin}
								className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-gray-300"
							>
								{origin}
							</span>
						))}
					</div>
				</div>

				{watchlists && (
					<div className="flex flex-wrap gap-2">
						<button
							className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
							onClick={() => setOpen(true)}
						>
							Add
						</button>
						<Link
							href={`/movie?csfdId=${movieData.csfdId}&type=${movieData.type}`}
							className="rounded-lg bg-blue-800 px-4 py-2 font-semibold text-white hover:bg-blue-800"
						>
							Show detail
						</Link>
					</div>
				)}
			</div>

			<ModalMovie
				open={open}
				onClose={() => setOpen(false)}
				onSubmit={() => handleAddToWatchlist(selectedWatchlist)}
				title="Add to watchlist"
				movie={{ title: movieData.title, posterUrl: movieData.posterUrl }}
			>
				<WatchlistSelect
					watchlists={watchlists!}
					onSelect={setSelectedWatchlist}
				/>
			</ModalMovie>
		</>
	);
};

export default MovieSearchItem;
