import { getServerSession } from 'next-auth';

import { authOptions } from '@/auth';
import CreateWatchlistPage from '@/components/watchlist/create-watchlist-page';

const Page = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-lg text-red-500">Not authorized</p>
			</div>
		);
	}

	return <CreateWatchlistPage userEmail={session.user.email} />;
};

export default Page;
