'use client';

import { useRouter } from 'next/navigation';
import type { Session } from 'next-auth';

type ProfileInfoProps = {
	session: Session;
};

const ProfileInfo = ({ session }: ProfileInfoProps) => {
	const router = useRouter();

	if (!session.user) {
		return null;
	}

	return (
		<div className="flex flex-col items-center gap-4 rounded-xl bg-black p-6 text-white shadow-lg md:flex-row md:justify-between">
			<div className="flex items-center gap-4">
				{session.user.image && (
					<img
						src={session.user.image}
						alt={session.user.name || 'User'}
						className="h-20 w-20 rounded-full border-2 border-blue-600 object-cover"
					/>
				)}
				<div className="flex flex-col">
					<h2 className="text-2xl font-bold">{session.user.name}</h2>
					<p className="text-sm text-blue-400">{session.user.email}</p>
				</div>
			</div>
			<div>
				<button
					className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
					onClick={() => router.push('/account/edit')}
				>
					Edit Profile
				</button>
			</div>
		</div>
	);
};

export default ProfileInfo;
