import Link from 'next/link';

export const Navigation = () => (
	<nav className="bg-[#E7ECF3] shadow-sm">
		<ul className="container mx-auto flex items-center gap-6 px-6 py-3 text-[15px] font-medium text-gray-700">
			<li>
				<Link href="/" className="text-2xl text-black">
					Home
				</Link>
			</li>
			<li>
				<Link href="/" className="text-2xl text-black">
					My movies
				</Link>
			</li>
			<li>
				<Link href="https://www.imdb.com/" className="text-2xl text-black">
					IMDb
				</Link>
			</li>
			<li>
				<Link href="https://www.csfd.cz/" className="text-2xl text-black">
					ČSFD
				</Link>
			</li>
			<li>
				<Link href="/" className="text-2xl text-black">
					Search
				</Link>
			</li>
		</ul>
	</nav>
);
