'use client';

import { useRouter } from 'next/navigation';

import { createWatchlistAction } from '@/actions/watchlist/create-watchlist';
import WatchlistForm from '@/components/watchlist/watchlist-form';

const CreateWatchlistPage = ({ userEmail }: { userEmail: string }) => {
	const router = useRouter();

	return (
		<WatchlistForm
			onSubmit={async (data, movies) => {
				await createWatchlistAction(
					userEmail,
					data.name,
					data.description ?? '',
					movies
				);
				router.push('/watchlists');
			}}
		/>
	);
};

export default CreateWatchlistPage;
