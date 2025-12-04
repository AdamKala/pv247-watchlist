'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';

import AuthProvider from '@/components/auth-provider';

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => (
	<AuthProvider>
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	</AuthProvider>
);
