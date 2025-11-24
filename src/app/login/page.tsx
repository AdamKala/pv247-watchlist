'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const LoginPage = () => {
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session) {
			router.push('/dashboard');
		}
	}, [session, router]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
				<h1 className="mb-6 text-center text-2xl font-bold">Sign In</h1>

				<button
					onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
					className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-2 font-semibold text-white transition hover:bg-gray-600"
				>
					<Image
						src="/icons/google.svg"
						alt="Google logo"
						width={20}
						height={20}
					/>
					Login with Google
				</button>

				<button
					onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
					className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-2 font-semibold text-white transition hover:bg-gray-600"
				>
					<Image
						src="/icons/github.svg"
						alt="GitHub logo"
						width={20}
						height={20}
					/>
					Login with GitHub
				</button>
			</div>
		</div>
	);
};

export default LoginPage;
