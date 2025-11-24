'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';

import LogoutButton from '@/components/log-out-button';

const ClientNavigation = ({ session }: { session: Session | null }) => {
	const pathname = usePathname();

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/movielists', label: 'My Movies' },
		{ href: 'https://www.imdb.com/', label: 'IMDb', external: true },
		{ href: 'https://www.csfd.cz/', label: 'ČSFD', external: true },
		{ href: '/search', label: 'Search' } //TODO include input field
	];

	return (
		<nav className="sticky top-0 z-50 bg-black shadow-md">
			<div className="container mx-auto px-4">
				<ul className="flex flex-wrap items-center justify-between gap-4 py-4">
					{/* Left Links */}
					<div className="flex flex-wrap items-center gap-3 md:gap-6">
						{links.map(link => (
							<li key={link.label}>
								{link.external ? (
									<a
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className="rounded-lg px-4 py-2 text-lg font-semibold text-white transition hover:bg-blue-700 hover:text-white"
									>
										{link.label}
									</a>
								) : (
									<Link
										href={link.href}
										className={`rounded-lg px-4 py-2 text-lg font-semibold transition ${pathname === link.href ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-700 hover:text-white'} `}
									>
										{link.label}
									</Link>
								)}
							</li>
						))}
					</div>

					{/* Right Links */}
					<div className="flex flex-wrap items-center gap-3 md:gap-6">
						{session && (
							<li>
								<Link
									href="/account"
									className={`rounded-lg px-4 py-2 text-lg font-semibold transition ${pathname === '/account' ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-700 hover:text-white'} `}
								>
									My account
								</Link>
							</li>
						)}
						<li>
							{session ? (
								<LogoutButton className="rounded-lg px-4 py-2 text-lg font-semibold text-white transition hover:bg-blue-700 hover:text-white" />
							) : (
								<Link
									href="/login"
									className={`rounded-lg px-4 py-2 text-lg font-semibold transition ${pathname === '/login' ? 'bg-blue-700 text-white' : 'text-white hover:bg-blue-700 hover:text-white'} `}
								>
									Login
								</Link>
							)}
						</li>
					</div>
				</ul>
			</div>
		</nav>
	);
};

export default ClientNavigation;
