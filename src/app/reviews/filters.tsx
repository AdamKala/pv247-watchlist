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
	const updateParam = (
		key: string,
		value?: string,
		extra?: Record<string, string | undefined>
	) => {
		const params = new URLSearchParams(window.location.search);

		if (!value) params.delete(key);
		else params.set(key, value);

		if (extra) {
			for (const [k, v] of Object.entries(extra)) {
				if (!v) params.delete(k);
				else params.set(k, v);
			}
		}

		const qs = params.toString();
		window.location.search = qs;
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
				onChange={v =>
					updateParam('sortBy', v, {
						sortOrder: 'desc'
					})
				}
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
