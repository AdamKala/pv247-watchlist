import { getServerSession } from 'next-auth';

import { authOptions } from '@/auth';
import EditWatchlistPage from '@/components/watchlist/edit-watchlist-page';
import { getWatchlistItemsAction } from '@/actions/watchlist/get-watchlist-items';
import { getWatchlistByIdAction } from '@/actions/watchlist/get-watchlist-by-id';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const session = await getServerSession(authOptions);
	const watchlistId = (await params).id;

	if (!session?.user?.email) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-lg text-red-500">Not authorized</p>
			</div>
		);
	}

	const watchlist = await getWatchlistByIdAction(watchlistId);
	const watchlistItems = await getWatchlistItemsAction(watchlistId);

	return watchlist ? (
		<EditWatchlistPage
			userEmail={session.user.email}
			watchlist={watchlist}
			initialItems={watchlistItems}
		/>
	) : (
		<div className="flex h-screen items-center justify-center">
			<p className="text-lg text-red-500">Watchlist not found</p>
		</div>
	);
};

export default Page;
