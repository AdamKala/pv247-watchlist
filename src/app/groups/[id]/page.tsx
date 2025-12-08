import { getServerSession } from 'next-auth/next';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import {
	addCommentToFavorite,
	addFavoriteToGroup,
	deleteFavoriteFromGroup,
	deleteGroupCascade,
	getGroupDetail,
	inviteUserByEmailToPrivateGroup,
	joinPublicGroup,
	kickGroupMember,
	requestJoinPrivateGroup,
	resolveJoinRequest
} from '@/db/groups';

type Props = {
	params: Promise<{ id: string }>;
	searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const joinPublicAction = async (groupId: number) => {
	'use server';
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	await joinPublicGroup(session.user.email, groupId);
	revalidatePath(`/groups/${groupId}`);
	revalidatePath('/groups');
};

const requestJoinAction = async (groupId: number) => {
	'use server';
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	await requestJoinPrivateGroup(session.user.email, groupId);
	revalidatePath(`/groups/${groupId}`);
	revalidatePath('/groups');
};

const addFavoriteAction = async (groupId: number, formData: FormData) => {
	'use server';
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	const movieId = Number(formData.get('movieId'));
	const comment = String(formData.get('comment') ?? '').trim();

	if (!movieId || Number.isNaN(movieId)) {
		redirect(`/groups/${groupId}?fav=invalid`);
	}

	const result = await addFavoriteToGroup(session.user.email, groupId, {
		movieId,
		comment
	});

	revalidatePath(`/groups/${groupId}`);
	redirect(`/groups/${groupId}?fav=${result}`);
};

const deleteFavoriteAction = async (groupId: number, favoriteId: number) => {
	'use server';
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	await deleteFavoriteFromGroup(session.user.email, favoriteId);
	revalidatePath(`/groups/${groupId}`);
};

const addCommentAction = async (
	groupId: number,
	favoriteId: number,
	formData: FormData
) => {
	'use server';
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	const comment = String(formData.get('comment') ?? '').trim();
	if (!comment) return;

	await addCommentToFavorite(session.user.email, favoriteId, comment);
	revalidatePath(`/groups/${groupId}`);
};

const approveReqAction = async (groupId: number, requestId: number) => {
	'use server';
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	await resolveJoinRequest(session.user.email, requestId, true);
	revalidatePath(`/groups/${groupId}`);
	revalidatePath('/groups');
};

const rejectReqAction = async (groupId: number, requestId: number) => {
	'use server';
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	await resolveJoinRequest(session.user.email, requestId, false);
	revalidatePath(`/groups/${groupId}`);
};

const inviteByEmailAction = async (groupId: number, formData: FormData) => {
	'use server';
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	const email = String(formData.get('email') ?? '')
		.trim()
		.toLowerCase();
	if (!email) return;

	await inviteUserByEmailToPrivateGroup(session.user.email, groupId, email);

	revalidatePath(`/groups/${groupId}`);
	revalidatePath('/groups');
};

const kickMemberAction = async (groupId: number, memberUserId: number) => {
	'use server';
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	await kickGroupMember(session.user.email, groupId, memberUserId);

	revalidatePath(`/groups/${groupId}`);
	revalidatePath('/groups');
};

const deleteGroupAction = async (groupId: number) => {
	'use server';
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	await deleteGroupCascade(session.user.email, groupId);

	revalidatePath('/groups');
	redirect('/groups');
};

const GroupDetailPage = async ({ params, searchParams }: Props) => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-lg text-red-500">Not authorized</p>
			</div>
		);
	}

	const { id } = await params;
	const groupId = Number(id);

	if (Number.isNaN(groupId)) {
		return (
			<div className="p-8 text-white">
				<p className="text-red-400">Invalid group id.</p>
			</div>
		);
	}

	const sp = (await searchParams) ?? {};
	const favParam = Array.isArray(sp.fav) ? sp.fav[0] : sp.fav;

	const data = await getGroupDetail(session.user.email, groupId);

	if (!data) {
		return (
			<div className="p-8 text-white">
				<p className="text-red-400">Group not found.</p>
			</div>
		);
	}

	const {
		group,
		me,
		canSeeContent,
		favorites,
		pendingRequests,
		members,
		movieOptions
	} = data;

	return (
		<div className="space-y-6 p-4 text-white sm:p-8">
			{favParam && (
				<div
					className={`rounded-xl border p-4 ${
						favParam === 'added'
							? 'border-green-700 bg-green-900/30 text-green-200'
							: favParam === 'duplicate'
								? 'border-yellow-700 bg-yellow-900/30 text-yellow-200'
								: 'border-red-700 bg-red-900/30 text-red-200'
					}`}
				>
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<p className="break-words">
							{favParam === 'added'
								? 'Favorite added.'
								: favParam === 'duplicate'
									? 'You already added this movie as a favorite in this group.'
									: 'Please select a movie first.'}
						</p>
						<Link
							href={`/groups/${groupId}`}
							className="rounded-lg bg-gray-800 px-3 py-1 text-sm hover:bg-gray-700"
						>
							Dismiss
						</Link>
					</div>
				</div>
			)}

			<div className="rounded-xl bg-black p-5 shadow-lg sm:p-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0">
						<h1 className="text-2xl font-bold sm:text-3xl">{group.name}</h1>
						<p className="mt-2 break-words text-gray-300">
							{group.description ?? 'No description'}
						</p>
						<p className="mt-3 text-sm text-gray-400">
							Owner: {group.ownerName ?? 'Unknown'}
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<span className="rounded-full bg-gray-800 px-3 py-1 text-sm">
							{group.visibility}
						</span>

						{me.isOwner && (
							<>
								<Link
									href={`/groups/${groupId}/edit`}
									className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold hover:bg-gray-600"
								>
									Edit group
								</Link>

								<form action={deleteGroupAction.bind(null, groupId)}>
									<button className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700">
										Delete group
									</button>
								</form>
							</>
						)}
					</div>
				</div>

				<div className="mt-4">
					{me.isMember ? (
						<p className="text-green-400">You are a member.</p>
					) : group.visibility === 'public' ? (
						<form action={joinPublicAction.bind(null, groupId)}>
							<button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700">
								Join group
							</button>
						</form>
					) : me.joinRequestStatus === 'pending' ? (
						<p className="text-yellow-400">Join request pending.</p>
					) : (
						<form action={requestJoinAction.bind(null, groupId)}>
							<button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700">
								Request to join
							</button>
						</form>
					)}
				</div>
			</div>

			{me.isOwner && (
				<div className="space-y-6 rounded-xl bg-gray-900 p-5 shadow-md sm:p-6">
					<h2 className="text-xl font-semibold">Owner tools</h2>

					{group.visibility === 'private' && (
						<div className="rounded-xl bg-black p-4">
							<h3 className="font-semibold">Invite user by email</h3>
							<p className="mt-1 text-sm text-gray-400">
								Note: the invited user must have signed in at least once.
							</p>

							<form
								action={inviteByEmailAction.bind(null, groupId)}
								className="mt-3 flex flex-col gap-2 sm:flex-row"
							>
								<input
									name="email"
									type="email"
									placeholder="user@example.com"
									className="w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600 sm:flex-1"
									required
								/>
								<button className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700 sm:w-auto">
									Add to group
								</button>
							</form>
						</div>
					)}

					{group.visibility === 'private' && (
						<div className="rounded-xl bg-black p-4">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold">Join requests</h3>
								<span className="text-sm text-gray-400">
									{pendingRequests.length} pending
								</span>
							</div>

							{pendingRequests.length === 0 ? (
								<p className="mt-3 text-gray-300">No pending requests.</p>
							) : (
								<div className="mt-4 space-y-3">
									{pendingRequests.map(r => (
										<div
											key={r.id}
											className="rounded-lg border border-gray-700 bg-gray-900 p-4"
										>
											<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
												<div className="min-w-0">
													<p className="font-semibold">
														{r.userName ?? 'Unknown user'}
													</p>
													<p className="text-sm break-words text-gray-400">
														{r.userEmail}
													</p>
												</div>

												<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
													<form
														action={approveReqAction.bind(null, groupId, r.id)}
														className="w-full sm:w-auto"
													>
														<button className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold hover:bg-green-700 sm:w-auto">
															Approve
														</button>
													</form>
													<form
														action={rejectReqAction.bind(null, groupId, r.id)}
														className="w-full sm:w-auto"
													>
														<button className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-700 sm:w-auto">
															Reject
														</button>
													</form>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					<div className="rounded-xl bg-black p-4">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold">Members</h3>
							<span className="text-sm text-gray-400">{members.length}</span>
						</div>

						{members.length === 0 ? (
							<p className="mt-3 text-gray-300">No members found.</p>
						) : (
							<div className="mt-4 space-y-3">
								{members.map(m => (
									<div
										key={m.userId}
										className="rounded-lg border border-gray-700 bg-gray-900 p-4"
									>
										<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
											<div className="min-w-0">
												<p className="font-semibold">
													{m.userName ?? 'Unknown'}{' '}
													<span className="ml-2 rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-200">
														{m.role}
													</span>
												</p>
												<p className="text-sm break-words text-gray-400">
													{m.userEmail}
												</p>
											</div>

											{m.role !== 'owner' && (
												<form
													action={kickMemberAction.bind(
														null,
														groupId,
														m.userId
													)}
													className="w-full sm:w-auto"
												>
													<button className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-700 sm:w-auto">
														Kick
													</button>
												</form>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}

			{canSeeContent ? (
				<>
					<div className="rounded-xl bg-gray-900 p-5 shadow-md sm:p-6">
						<h2 className="text-xl font-semibold">Add your favorite</h2>

						<form
							action={addFavoriteAction.bind(null, groupId)}
							className="mt-4 space-y-3"
						>
							<div>
								<select
									id="movieId"
									name="movieId"
									className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
									required
									defaultValue=""
								>
									<option value="" disabled>
										Select a movie…
									</option>
									{movieOptions.map(m => (
										<option key={m.id} value={m.id}>
											{m.title}
											{m.year ? ` (${m.year})` : ''}
										</option>
									))}
								</select>
							</div>

							<div>
								<textarea
									id="comment"
									name="comment"
									placeholder="Comment (optional)"
									className="w-full resize-none rounded-md border border-gray-700 bg-black px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
									rows={3}
								/>
							</div>

							<button className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700">
								Add
							</button>
						</form>
					</div>

					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Favorites</h2>

						{favorites.length === 0 ? (
							<p className="text-gray-300">No favorites yet.</p>
						) : (
							favorites.map(f => (
								<div
									key={f.id}
									className="rounded-xl border border-gray-700 bg-black p-5 shadow-md"
								>
									<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
										<div className="min-w-0">
											<p className="text-lg font-bold">
												{f.title ?? 'Unknown movie'}
											</p>
											<p className="text-sm text-gray-400">
												Added by {f.userName ?? 'Unknown'}
											</p>
											{f.comment ? (
												<p className="mt-2 break-words text-gray-200">
													{f.comment}
												</p>
											) : null}
										</div>

										<form
											action={deleteFavoriteAction.bind(null, groupId, f.id)}
											className="w-full sm:w-auto"
										>
											<button className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-700 sm:w-auto">
												Delete
											</button>
										</form>
									</div>

									<div className="mt-4 space-y-3">
										<h3 className="text-sm font-semibold text-gray-200">
											Comments
										</h3>

										{f.comments.length === 0 ? (
											<p className="text-sm text-gray-400">No comments yet.</p>
										) : (
											<div className="space-y-2">
												{f.comments.map(c => (
													<div
														key={c.id}
														className="rounded-lg bg-gray-900 p-3"
													>
														<p className="text-sm break-words text-gray-300">
															<span className="font-semibold text-white">
																{c.userName ?? 'Unknown'}:
															</span>{' '}
															{c.comment}
														</p>
													</div>
												))}
											</div>
										)}

										<form
											action={addCommentAction.bind(null, groupId, f.id)}
											className="flex flex-col gap-2 sm:flex-row"
										>
											<input
												name="comment"
												required
												placeholder="Write a comment…"
												className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 sm:flex-1"
											/>
											<button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-700 sm:w-auto">
												Send
											</button>
										</form>
									</div>
								</div>
							))
						)}
					</div>
				</>
			) : (
				<div className="rounded-xl bg-black p-6 text-gray-200">
					<p>This content is only visible to group members.</p>
				</div>
			)}
		</div>
	);
};

export default GroupDetailPage;
