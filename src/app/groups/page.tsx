import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getGroupsOverview } from '@/db/groups';

const GroupsPage = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-lg text-red-500">Not authorized</p>
			</div>
		);
	}

	const { myGroups, allGroups } = await getGroupsOverview(session.user.email);

	return (
		<div className="space-y-8 p-8 text-white">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Groups</h1>
				<Link
					href="/groups/create"
					className="rounded-lg bg-blue-600 px-4 py-2 font-semibold transition hover:bg-blue-700"
				>
					Create new group
				</Link>
			</div>

			<section className="space-y-3">
				<h2 className="text-xl font-semibold">My groups</h2>
				{myGroups.length === 0 ? (
					<p className="text-gray-300">You haven’t joined any groups yet.</p>
				) : (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{myGroups.map(g => (
							<Link
								key={g.id}
								href={`/groups/${g.id}`}
								className="rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-md transition hover:border-blue-600"
							>
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-bold">{g.name}</h3>
									<span className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-200">
										{g.visibility}
									</span>
								</div>
								<p className="mt-2 text-sm text-gray-400">
									{g.description ?? 'No description'}
								</p>
							</Link>
						))}
					</div>
				)}
			</section>

			<section className="space-y-3">
				<h2 className="text-xl font-semibold">All groups</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{allGroups.map(g => (
						<Link
							key={g.id}
							href={`/groups/${g.id}`}
							className="rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-md transition hover:border-blue-600"
						>
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-bold">{g.name}</h3>
								<span className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-200">
									{g.visibility}
								</span>
							</div>
							<p className="mt-2 text-sm text-gray-400">
								{g.description ?? 'No description'}
							</p>
							<p className="mt-3 text-xs text-gray-500">
								Owner: {g.ownerName ?? 'Unknown'}
							</p>

							{g.isMember ? (
								<p className="mt-2 text-sm text-green-400">You’re a member</p>
							) : g.visibility === 'private' &&
							  g.joinRequestStatus === 'pending' ? (
								<p className="mt-2 text-sm text-yellow-400">Request pending</p>
							) : null}
						</Link>
					))}
				</div>
			</section>
		</div>
	);
};

export default GroupsPage;
