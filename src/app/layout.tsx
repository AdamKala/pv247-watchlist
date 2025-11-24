import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { Navigation } from '@/components/navigation-server';

import { Providers } from './providers';

const poppins = Poppins({ subsets: ['latin'], weight: ['400'] });

export const metadata: Metadata = {
	title: 'Task 08'
};

const RootLayout = ({
	children
}: Readonly<{
	children: React.ReactNode;
}>) => (
	<html lang="en">
		<body className={poppins.className}>
			<Providers>
				<Navigation />

				<main className="container mx-auto my-8 max-h-[calc(100vh-120px)] overflow-auto">
					{children}
				</main>
			</Providers>
		</body>
	</html>
);

export default RootLayout;
