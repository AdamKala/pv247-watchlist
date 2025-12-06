import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

import ListItem from './ListItem';
import ScoreBadge from './ScoreBadge';
import { clamp, formatCsDateTime } from './utils';

type HomePageProps = {
	isLoggedIn: boolean;
	topMovies: Array<{
		id: string | number;
		title: string;
		year?: number | null;
		score: number | string;
	}>;
	latestReviews: Array<{
		id: string | number;
		movieId: string | number;
		movieTitle?: string | null;
		movieYear?: number | null;
		rating: number;
		text: string;
	}>;
	lastVisited: Array<{
		id: string | number;
		title: string;
		year?: number | null;
		visitedAt: number;
	}>;
};

const HomePage = ({
	isLoggedIn,
	topMovies,
	latestReviews,
	lastVisited
}: HomePageProps) => (
	<main className="relative min-h-screen bg-transparent text-white">
		<div className="mx-auto max-w-7xl px-6 py-10">
			<header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div>
					<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
						<span className="h-2 w-2 rounded-full bg-emerald-400/80" />
						{isLoggedIn ? 'Signed in' : 'Guest mode'}
					</div>

					<h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
						Movie Tracker
					</h1>

					<p className="mt-2 max-w-2xl text-xs text-white/60">
						Your quick overview: best rated movies, what you recently visited,
						and your latest reviews—all in one place.
					</p>
				</div>

				<div className="flex gap-2">
					<div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
						Top rated:{' '}
						<span className="font-semibold text-white">{topMovies.length}</span>
					</div>
					{isLoggedIn ? (
						<div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
							Activity: <span className="font-semibold text-white">live</span>
						</div>
					) : null}
				</div>
			</header>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{isLoggedIn ? (
					<div className="lg:col-span-4">
						<div className="flex flex-col gap-6">
							<Card
								title="Latest Reviews"
								subtitle="Your most recent ratings & notes"
							>
								{latestReviews.length === 0 ? (
									<EmptyState
										title="No reviews yet"
										hint="Rate a movie to see it show up here."
									/>
								) : (
									<div className="space-y-3">
										{latestReviews.map(review => (
											<ListItem
												key={review.id}
												title={
													<>
														{review.movieTitle ?? `Movie #${review.movieId}`}
														{review.movieYear ? (
															<span className="text-white/55">
																{' '}
																({review.movieYear})
															</span>
														) : null}
													</>
												}
												meta="Latest review"
												right={<ScoreBadge value={review.rating} />}
											>
												<span className="text-white/70">
													{clamp(review.text, 90)}
												</span>
											</ListItem>
										))}
									</div>
								)}
							</Card>

							<Card title="Last Visited" subtitle="Recently opened movie pages">
								{lastVisited.length === 0 ? (
									<EmptyState
										title="No visits yet"
										hint="Open a movie detail page and it’ll appear here."
									/>
								) : (
									<div className="space-y-3">
										{lastVisited.map(v => (
											<ListItem
												key={`${v.id}-${v.visitedAt}`}
												title={
													<>
														{v.title}
														{v.year ? (
															<span className="text-white/55"> ({v.year})</span>
														) : null}
													</>
												}
												meta={formatCsDateTime(v.visitedAt)}
												right={
													<span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/70 ring-1 ring-white/10">
														viewed
													</span>
												}
											/>
										))}
									</div>
								)}
							</Card>
						</div>
					</div>
				) : null}

				<div className={isLoggedIn ? 'lg:col-span-5' : 'lg:col-span-12'}>
					<Card
						title="Top Movies"
						subtitle="Best scored movies (overall)"
						className="h-full"
					>
						{topMovies.length === 0 ? (
							<EmptyState
								title="No rated movies yet"
								hint="Once you rate a few movies, the best ones will appear here."
							/>
						) : (
							<div className="space-y-3">
								{topMovies.map((m, idx) => (
									<div
										key={m.id}
										className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.05]"
									>
										<div className="flex min-w-0 items-center gap-3">
											<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-semibold text-white/80 ring-1 ring-white/10">
												{idx + 1}
											</div>

											<div className="min-w-0">
												<div className="truncate text-sm font-semibold">
													{m.title}
													{m.year ? (
														<span className="text-white/55"> ({m.year})</span>
													) : null}
												</div>
												<div className="mt-1 text-xs text-white/60">
													Top rated
												</div>
											</div>
										</div>

										<div className="flex items-center gap-2">
											<span className="text-xs text-white/55">score</span>
											<ScoreBadge value={Number(m.score)} />
										</div>
									</div>
								))}
							</div>
						)}
					</Card>
				</div>

				{isLoggedIn ? (
					<div className="lg:col-span-3">
						<Card
							title="Continue Watching"
							subtitle="Next picks based on your activity"
							className="h-full"
						>
							<div className="space-y-3">
								{['Movie A — placeholder', 'Movie B — placeholder'].map(x => (
									<div
										key={x}
										className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/75 ring-1 ring-white/5 transition hover:border-white/15 hover:bg-white/[0.05]"
									>
										{x}
										<div className="mt-1 text-xs text-white/55">
											We’ll replace this with real data later.
										</div>
									</div>
								))}
							</div>
						</Card>
					</div>
				) : null}
			</div>

			<footer className="mt-10 text-xs text-white/45">
				Tip: You’re behind <span className="text-white/65">0</span> spoilers
				today.
			</footer>
		</div>
	</main>
);

export default HomePage;
