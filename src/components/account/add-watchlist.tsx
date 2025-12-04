'use client';

import { useRouter } from 'next/navigation';

const AddWatchlist = () => {
	const router = useRouter();

	return (
		<div className="flex h-5 w-full items-center justify-between bg-gray-700">
			<p className="text-2xl font-bold text-white">Your Watchlists</p>
			<button
				className="mt-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
				onClick={() => router.push('/movielists/create')}
			>
				Create New Watchlist
			</button>
		</div>
	);
};

export default AddWatchlist;
