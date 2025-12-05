'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import type { WatchList } from '@/lib/movies';

type WatchlistContextType = {
	watchlists: WatchList[] | null;
	setWatchlists: (watchlists: WatchList[] | null) => void;
};

const WatchlistContext = createContext<WatchlistContextType | undefined>(
	undefined
);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
	const [watchlists, setWatchlists] = useState<WatchList[] | null>(null);
	return (
		<WatchlistContext.Provider value={{ watchlists, setWatchlists }}>
			{children}
		</WatchlistContext.Provider>
	);
};

export const useWatchlistContext = () => {
	const context = useContext(WatchlistContext);

	if (!context) {
		throw new Error(
			'useWatchlistContext must be used within a WatchlistProvider'
		);
	}

	return context;
};
