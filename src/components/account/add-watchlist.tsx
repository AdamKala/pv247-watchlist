'use client';

import { useRouter } from 'next/navigation';

const AddWatchlist = () => {
	const router = useRouter();

	return (
		<div className="flex w-full flex-col gap-2 rounded-md bg-gray-700 p-4 sm:flex-row sm:items-center sm:justify-between">
			<p className="truncate text-xl font-bold text-white sm:text-2xl">
				Your Watchlists
			</p>
			<button
				className="mt-1 w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 sm:mt-0 sm:w-auto"
				onClick={() => router.push('/watchlists/create')}
			>
				Create New Watchlist
			</button>
		</div>
	);
};

export default AddWatchlist;
