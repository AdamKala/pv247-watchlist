import { type movies, type watchlistItems, type watchlists } from '@/db/schema';

export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;
export type MovieSearchItemProps = {
	title: string;
	posterUrl: string;
	id: number;
	origins: string[];
	type: string;
	year: string;
};

export type WatchlistItem = typeof watchlistItems.$inferSelect; // řádek z DB
export type NewWatchlistItem = typeof watchlistItems.$inferInsert; // pro insert

export type WatchList = typeof watchlists.$inferSelect;
export type newWatchList = typeof watchlists.$inferInsert;
