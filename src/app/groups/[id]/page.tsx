import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
	addCommentToFavorite,
	addFavoriteToGroup,
	deleteFavoriteFromGroup,
	getGroupDetail,
	joinPublicGroup,
	requestJoinPrivateGroup,
	resolveJoinRequest,
	inviteUserByEmailToPrivateGroup,
	kickGroupMember,
	deleteGroupCascade
} from '@/db/groups';

type Props = {
	params: Promise<{ id: string }>;
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

	const itemSymbol = String(formData.get('itemSymbol') ?? '').trim();
	const title = String(formData.get('title') ?? '').trim();
	const comment = String(formData.get('comment') ?? '').trim();
	if (!itemSymbol) return;

	await addFavoriteToGroup(session.user.email, groupId, {
		itemSymbol,
		title,
		comment
	});
	revalidatePath(`/groups/${groupId}`);
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

const GroupDetailPage = async ({ params }: Props) => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-lg text-red-500">Not authorized</p>
			</div>
		);
	}

	const resolvedParams = await params;
	const groupId = Number(resolvedParams.id);

	if (Number.isNaN(groupId)) {
		return (
			<div className="p-8 text-white">
				<p className="text-red-400">Invalid group id.</p>
			</div>
		);
	}

	const data = await getGroupDetail(session.user.email, groupId);

	if (!data) {
		return (
			<div className="p-8 text-white">
				<p className="text-red-400">Group not found.</p>
			</div>
		);
	}

	const { group, me, canSeeContent, favorites, pendingRequests, members } =
		data;

	return (
		<div className="space-y-6 p-8 text-white">
			<div className="rounded-xl bg-black p-6 shadow-lg">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h1 className="text-3xl font-bold">{group.name}</h1>
						<p className="mt-2 text-gray-300">
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
									<button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700">
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
				<div className="space-y-6 rounded-xl bg-gray-900 p-6 shadow-md">
					<h2 className="text-xl font-semibold">Owner tools</h2>

					{group.visibility === 'private' && (
						<div className="rounded-xl bg-black p-4">
							<h3 className="font-semibold">Invite user by email</h3>
							<p className="mt-1 text-sm text-gray-400">
								Note: the invited user must have signed in at least once.
							</p>

							<form
								action={inviteByEmailAction.bind(null, groupId)}
								className="mt-3 flex flex-col gap-2 md:flex-row"
							>
								<input
									name="email"
									type="email"
									placeholder="user@example.com"
									className="flex-1 rounded-md border border-gray-700 bg-gray-900 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
									required
								/>
								<button className="rounded-md bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700">
									Add to group
								</button>
							</form>
						</div>
					)}

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
										className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4"
									>
										<div>
											<p className="font-semibold">
												{r.userName ?? 'Unknown user'}
											</p>
											<p className="text-sm text-gray-400">{r.userEmail}</p>
										</div>
										<div className="flex gap-2">
											<form action={approveReqAction.bind(null, groupId, r.id)}>
												<button className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold hover:bg-green-700">
													Approve
												</button>
											</form>
											<form action={rejectReqAction.bind(null, groupId, r.id)}>
												<button className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-700">
													Reject
												</button>
											</form>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="rounded-xl bg-black p-4">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold">Members</h3>
							<span className="text-sm text-gray-400">{members.length}</span>
						</div>

						{members.length === 0 ? (
							<p className="mt-3 text-gray-300">No members found.</p>
						) : (
							<div className="mt-4 space-y-3">
								{members.map((m: any) => (
									<div
										key={m.userId}
										className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4"
									>
										<div>
											<p className="font-semibold">
												{m.userName ?? 'Unknown'}{' '}
												<span className="ml-2 rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-200">
													{m.role}
												</span>
											</p>
											<p className="text-sm text-gray-400">{m.userEmail}</p>
										</div>

										{m.role !== 'owner' && (
											<form
												action={kickMemberAction.bind(
													null,
													groupId,
													Number(m.userId)
												)}
											>
												<button className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-700">
													Kick
												</button>
											</form>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}

			{canSeeContent ? (
				<>
					<div className="rounded-xl bg-gray-900 p-6 shadow-md">
						<h2 className="text-xl font-semibold">Add your favorite</h2>

						<form
							action={addFavoriteAction.bind(null, groupId)}
							className="mt-4 grid gap-3 md:grid-cols-2"
						>
							<input
								name="itemSymbol"
								placeholder="Movie/Show ID"
								className="rounded-md border border-gray-700 bg-black px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
								required
							/>
							<input
								name="title"
								placeholder="Title (optional)"
								className="rounded-md border border-gray-700 bg-black px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
							/>
							<textarea
								name="comment"
								placeholder="Comment (optional)"
								className="resize-none rounded-md border border-gray-700 bg-black px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600 md:col-span-2"
								rows={3}
							/>
							<div className="md:col-span-2">
								<button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700">
									Add
								</button>
							</div>
						</form>
					</div>

					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Favorites</h2>

						{favorites.length === 0 ? (
							<p className="text-gray-300">No favorites yet.</p>
						) : (
							favorites.map((f: any) => (
								<div
									key={f.id}
									className="rounded-xl border border-gray-700 bg-black p-5 shadow-md"
								>
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div>
											<p className="text-lg font-bold">
												{f.title ?? f.itemSymbol}{' '}
												<span className="text-sm font-normal text-gray-400">
													({f.itemSymbol})
												</span>
											</p>
											<p className="text-sm text-gray-400">
												Added by {f.userName ?? 'Unknown'}
											</p>
											{f.comment ? (
												<p className="mt-2 text-gray-200">{f.comment}</p>
											) : null}
										</div>

										<form
											action={deleteFavoriteAction.bind(null, groupId, f.id)}
										>
											<button className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-700">
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
												{f.comments.map((c: any) => (
													<div
														key={c.id}
														className="rounded-lg bg-gray-900 p-3"
													>
														<p className="text-sm text-gray-300">
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
											className="flex gap-2"
										>
											<input
												name="comment"
												placeholder="Write a comment…"
												className="flex-1 rounded-md border border-gray-700 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
											/>
											<button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-700">
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
