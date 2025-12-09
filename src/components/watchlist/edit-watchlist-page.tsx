'use client';

import { useRouter } from 'next/navigation';

import WatchlistForm from '@/components/watchlist/watchlist-form';
import type { Movie, WatchList } from '@/lib/movies';
import { editWatchlistAction } from '@/actions/watchlist/edit-watchlist';

type Props = {
	userEmail: string;
	watchlist: WatchList;
	initialItems: Movie[];
};

const EditWatchlistPage = (props: Props) => {
	const router = useRouter();

	return (
		<WatchlistForm
			initialData={{
				name: props.watchlist.name,
				description: props.watchlist.description ?? '',
				movies: props.initialItems.map(item => ({
					id: item.id,
					csfdId: item.csfdId,
					title: item.title,
					posterUrl: item.image ?? '/icons/default-movie.svg',
					origins: item.origins ? item.origins.split(',') : [],
					type: item.type ?? 'movie',
					year: item.year ? String(item.year) : ''
				}))
			}}
			onSubmit={async (data, movies) => {
				await editWatchlistAction(
					props.userEmail,
					data.name,
					data.description ?? '',
					movies,
					props.watchlist.id
				);
				router.push('/watchlists');
			}}
		/>
	);
};

export default EditWatchlistPage;
