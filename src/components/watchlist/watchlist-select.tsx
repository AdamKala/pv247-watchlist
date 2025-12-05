'use client';

import type { WatchList } from '@/lib/movies';

type WatchlistSelectProps = {
	watchlists: WatchList[];
	onSelect: (watchlistId: string) => void;
};

const WatchlistSelect = ({ watchlists, onSelect }: WatchlistSelectProps) => (
	<div className="flex flex-col gap-4 text-white">
		<label htmlFor="watchlist" className="text-sm text-gray-300">
			Choose watchlist
		</label>

		<select
			id="watchlist"
			className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-600"
			onChange={e => onSelect(e.target.value)}
		>
			<option value="">Select watchlist…</option>
			{watchlists.map(wl => (
				<option key={wl.id} value={wl.id}>
					{wl.name}
				</option>
			))}
		</select>
	</div>
);

export default WatchlistSelect;
