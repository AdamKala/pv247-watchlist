'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useWatchlistContext } from '@/context/watchlist-context';
import { getWatchlistsAction } from '@/actions/watchlist/get-watchlists';

const LoginPage = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const [signGit, setSignGit] = useState(false);
	const [signGoogle, setSignGoogle] = useState(false);
	const { setWatchlists } = useWatchlistContext();

	useEffect(() => {
		if (session) {
			(async () => {
				setWatchlists((await getWatchlistsAction()) ?? null);
				router.push('/account');
			})();
		}
	}, [session, router, setWatchlists]);

	return (
		<div className="justify-top flex min-h-screen flex-col items-center p-4">
			<div className="w-full max-w-sm rounded-xl bg-black p-8 shadow-lg">
				<h1 className="mb-6 text-center text-2xl font-bold text-white">
					Sign In
				</h1>

				<button
					onClick={() => {
						setSignGoogle(true);
						signIn('google', { callbackUrl: '/account' });
					}}
					className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
				>
					<Image
						src="/icons/google.svg"
						alt="Google logo"
						width={20}
						height={20}
					/>
					{signGoogle ? 'Signing in...' : 'Login with Google'}
				</button>

				<button
					onClick={() => {
						setSignGit(true);
						signIn('github', { callbackUrl: '/account' });
					}}
					className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
				>
					<Image
						src="/icons/github.svg"
						alt="GitHub logo"
						width={20}
						height={20}
					/>
					{signGit ? 'Signing in...' : 'Login with GitHub'}
				</button>
			</div>
		</div>
	);
};

export default LoginPage;
