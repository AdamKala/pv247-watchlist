import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';

import { authOptions } from '@/auth';
import { getWatchlistByIdAction } from '@/actions/watchlist/get-watchlist-by-id';
import { getWatchlistItemsAction } from '@/actions/watchlist/get-watchlist-items';

const WatchlistDetailPage = async ({
	params
}: {
	params: Promise<{ id: string }>;
}) => {
	const watchlistId = (await params).id;

	if (!watchlistId) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-lg text-red-500">Invalid watchlist ID</p>
			</div>
		);
	}

	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-lg text-red-500">
					You need to log in to view this watchlist.
				</p>
			</div>
		);
	}

	const [watchlist, watchlistItems] = await Promise.all([
		getWatchlistByIdAction(watchlistId),
		getWatchlistItemsAction(watchlistId)
	]);

	if (!watchlist) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-lg text-red-500">Watchlist not found</p>
			</div>
		);
	}

	return (
		<main className="container mx-auto px-6 py-10 text-white">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-3xl font-bold">{watchlist.name}</h1>
				<Link
					href={`/watchlists/edit/${watchlist.id}`}
					className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
				>
					Edit Watchlist
				</Link>
			</div>
			{watchlist.description && (
				<p className="mb-6 text-gray-400">{watchlist.description}</p>
			)}

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{watchlistItems.map(movie => (
					<Link
                        href={`/movie?id=${movie.id}`}
						key={movie.id}
						className="cursor-pointer flex flex-col rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-md transition hover:border-blue-600 hover:shadow-lg"
					>
						<div className="flex gap-4">
							<div className="w-24 shrink-0">
								<Image
									src={movie.image ?? '/icons/default-movie.svg'}
									alt={movie.title}
									width={96}
									height={144}
									className="rounded object-cover"
								/>
							</div>

							<div className="flex w-full flex-col justify-between gap-1">
								{/* Left Column (Title + Info) */}
								<div>
									<h2 className="text-lg font-bold text-white">
										{movie.title}
									</h2>

									<p className="text-sm text-gray-400">
										{movie.year ? `Year: ${movie.year}` : 'Year: N/A'}
									</p>

									<p className="text-sm text-gray-400">
										{movie.type ? `Type: ${movie.type}` : 'Type: N/A'}
									</p>

									{movie.origins && (
										<p className="text-sm text-gray-400">
											Origins:{' '}
											{Array.isArray(movie.origins)
												? movie.origins.join(', ')
												: movie.origins}
										</p>
									)}
								</div>

								<div className="ml-auto flex w-full max-w-[180px] flex-col gap-1">
									<div className="flex w-full items-center">
										<span className="text-sm text-gray-300">Local Rating:</span>
										<span className="ml-auto text-sm whitespace-nowrap text-gray-300">
											{movie.localRating !== null
												? `${movie.localRating}/10`
												: 'N/A'}
										</span>
									</div>

									<div className="flex w-full items-center">
										<span className="text-sm text-gray-400">CSFD Rating:</span>
										<span className="ml-auto text-sm whitespace-nowrap text-gray-400">
											{movie.csfdRating !== null
												? `${movie.csfdRating}/10`
												: 'N/A'}
										</span>
									</div>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</main>
	);
};

export default WatchlistDetailPage;
