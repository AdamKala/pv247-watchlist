'use client';

type FiltersProps = {
	searchParams: {
		movieId?: string;
		sortBy?: string;
		sortOrder?: string;
	};
	movieList: number[];
};

const Filters = ({ searchParams, movieList }: FiltersProps) => {
	const updateParam = (key: string, value?: string) => {
		const params = new URLSearchParams();

		for (const [k, v] of Object.entries(searchParams)) {
			if (typeof v === 'string' && v.length > 0) {
				params.set(k, v);
			}
		}

		if (!value) params.delete(key);
		else params.set(key, value);

		window.location.search = params.toString();
	};

	return (
		<div className="mb-8 flex gap-4">
			<select
				className="rounded bg-gray-800 px-3 py-2 text-white"
				onChange={e => updateParam('movieId', e.target.value || undefined)}
				value={searchParams.movieId ?? ''}
			>
				<option value="">All movies</option>
				{movieList.map(m => (
					<option key={m} value={String(m)}>
						{m}
					</option>
				))}
			</select>

			<select
				className="rounded bg-gray-800 px-3 py-2 text-white"
				onChange={e => updateParam('sortBy', e.target.value)}
				value={searchParams.sortBy ?? 'createdAt'}
			>
				<option value="createdAt">Newest first</option>
				<option value="rating">Rating</option>
			</select>

			<select
				className="rounded bg-gray-800 px-3 py-2 text-white"
				onChange={e => updateParam('sortOrder', e.target.value)}
				value={searchParams.sortOrder ?? 'desc'}
			>
				<option value="desc">Desc</option>
				<option value="asc">Asc</option>
			</select>
		</div>
	);
};

export default Filters;
