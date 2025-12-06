'use client';

import Select from '@/components/ui/Select';

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
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			<Select
				label="Movie"
				value={searchParams.movieId ?? ''}
				onChange={v => updateParam('movieId', v || undefined)}
			>
				<option value="">All movies</option>
				{movieList.map(m => (
					<option key={m} value={String(m)}>
						Movie #{m}
					</option>
				))}
			</Select>

			<Select
				label="Sort by"
				value={searchParams.sortBy ?? 'createdAt'}
				onChange={v => updateParam('sortBy', v)}
			>
				<option value="createdAt">Newest first</option>
				<option value="rating">Rating</option>
			</Select>

			<Select
				label="Order"
				value={searchParams.sortOrder ?? 'desc'}
				onChange={v => updateParam('sortOrder', v)}
			>
				<option value="desc">Desc</option>
				<option value="asc">Asc</option>
			</Select>
		</div>
	);
};

export default Filters;
