'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';

import AuthProvider from '@/components/auth-provider';
import { WatchlistProvider } from '@/context/watchlist-context';

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => (
	<AuthProvider>
		<WatchlistProvider>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WatchlistProvider>
	</AuthProvider>
);
