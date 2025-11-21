import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { Navigation } from '@/components/navigation';

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

				<main className="container my-8">{children}</main>
			</Providers>
		</body>
	</html>
);

export default RootLayout;
