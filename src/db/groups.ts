import { and, asc, desc, eq, inArray } from 'drizzle-orm';

import { db } from '@/db';
import {
	groupFavoriteComments,
	groupFavorites,
	groupJoinRequests,
	groupMembers,
	groups,
	movies,
	users
} from '@/db/schema';

const now = () => Date.now();

const getUserIdByEmail = async (email: string) => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.get();
	return user?.id ?? null;
};

export type GroupVisibility = 'public' | 'private';
export type JoinRequestStatus = 'pending' | 'approved' | 'rejected';

export type GroupListItem = {
	id: number;
	name: string;
	description: string | null;
	visibility: GroupVisibility;
	ownerName: string | null;
	isMember: boolean;
	isOwner: boolean;
	joinRequestStatus: JoinRequestStatus | null;
};

export type MovieOption = {
	id: number;
	title: string;
	year: number | null;
};

export type JoinRequestSummary = {
	id: number;
	userId: number;
	userName: string | null;
	userEmail: string | null;
	createdAt: number;
};

export type GroupMemberSummary = {
	userId: number;
	userName: string | null;
	userEmail: string | null;
	userImage: string | null;
	role: 'owner' | 'member';
	joinedAt: number;
};

export type GroupFavoriteCommentSummary = {
	id: number;
	favoriteId: number;
	comment: string;
	createdAt: number;
	userId: number;
	userName: string | null;
	userImage: string | null;
};

export type GroupFavoriteSummary = {
	id: number;
	title: string | null;
	comment: string | null;
	createdAt: number;
	userId: number;
	userName: string | null;
	userImage: string | null;
	comments: GroupFavoriteCommentSummary[];
};

export type GroupDetailResult = {
	group: {
		id: number;
		name: string;
		description: string | null;
		visibility: GroupVisibility;
		ownerId: number;
		ownerName: string | null;
	};
	me: {
		userId: number;
		isMember: boolean;
		isOwner: boolean;
		joinRequestStatus: JoinRequestStatus | null;
	};
	canSeeContent: boolean;
	movieOptions: MovieOption[];
	favorites: GroupFavoriteSummary[];
	pendingRequests: JoinRequestSummary[];
	members: GroupMemberSummary[];
};

export const getGroupsOverview = async (userEmail: string) => {
	const userId = await getUserIdByEmail(userEmail);
	if (!userId) {
		return {
			myGroups: [] as GroupListItem[],
			allGroups: [] as GroupListItem[]
		};
	}

	const all = await db
		.select({
			id: groups.id,
			name: groups.name,
			description: groups.description,
			visibility: groups.visibility,
			ownerId: groups.ownerId,
			ownerName: users.name
		})
		.from(groups)
		.leftJoin(users, eq(groups.ownerId, users.id))
		.orderBy(desc(groups.createdAt));

	const memberships = await db
		.select({ groupId: groupMembers.groupId, role: groupMembers.role })
		.from(groupMembers)
		.where(eq(groupMembers.userId, userId));

	const memberRoleByGroup = new Map<number, 'owner' | 'member'>();
	for (const m of memberships) memberRoleByGroup.set(m.groupId, m.role);

	const requests = await db
		.select({
			groupId: groupJoinRequests.groupId,
			status: groupJoinRequests.status
		})
		.from(groupJoinRequests)
		.where(eq(groupJoinRequests.userId, userId));

	const requestStatusByGroup = new Map<number, JoinRequestStatus>();
	for (const r of requests) requestStatusByGroup.set(r.groupId, r.status);

	const allGroups: GroupListItem[] = all.map(g => {
		const role = memberRoleByGroup.get(g.id);
		const isMember = !!role;
		return {
			id: g.id,
			name: g.name,
			description: g.description ?? null,
			visibility: g.visibility as GroupVisibility,
			ownerName: g.ownerName ?? null,
			isMember,
			isOwner: role === 'owner' || g.ownerId === userId,
			joinRequestStatus: requestStatusByGroup.get(g.id) ?? null
		};
	});

	const myGroups = allGroups.filter(g => g.isMember);

	return { myGroups, allGroups };
};

export const createGroup = async (
	userEmail: string,
	data: { name: string; description?: string; visibility: GroupVisibility }
) => {
	const userId = await getUserIdByEmail(userEmail);
	if (!userId) throw new Error('Not authorized');

	const createdAt = now();

	const inserted = await db
		.insert(groups)
		.values({
			ownerId: userId,
			name: data.name.trim(),
			description: (data.description ?? '').trim() || null,
			visibility: data.visibility,
			createdAt
		})
		.returning({ id: groups.id });

	const groupId = inserted[0]?.id;
	if (!groupId) throw new Error('Failed to create group');

	await db.insert(groupMembers).values({
		groupId,
		userId,
		role: 'owner',
		joinedAt: createdAt
	});

	return groupId;
};

export const getGroupDetail = async (
	userEmail: string,
	groupId: number
): Promise<GroupDetailResult | null> => {
	const userId = await getUserIdByEmail(userEmail);
	if (!userId) throw new Error('Not authorized');

	const group = await db
		.select({
			id: groups.id,
			name: groups.name,
			description: groups.description,
			visibility: groups.visibility,
			ownerId: groups.ownerId,
			ownerName: users.name
		})
		.from(groups)
		.leftJoin(users, eq(groups.ownerId, users.id))
		.where(eq(groups.id, groupId))
		.get();

	if (!group) return null;

	const member = await db
		.select({ role: groupMembers.role })
		.from(groupMembers)
		.where(
			and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId))
		)
		.get();

	const joinReq = await db
		.select({ status: groupJoinRequests.status })
		.from(groupJoinRequests)
		.where(
			and(
				eq(groupJoinRequests.groupId, groupId),
				eq(groupJoinRequests.userId, userId)
			)
		)
		.get();

	const isMember = !!member;
	const isOwner = member?.role === 'owner' || group.ownerId === userId;

	const canSeeContent = isMember;

	let favorites: GroupFavoriteSummary[] = [];
	let pendingRequests: JoinRequestSummary[] = [];
	let members: GroupMemberSummary[] = [];
	let movieOptions: MovieOption[] = [];

	if (canSeeContent) {
		movieOptions = await db
			.select({ id: movies.id, title: movies.title, year: movies.year })
			.from(movies)
			.orderBy(asc(movies.title))
			.limit(500);

		const favs = await db
			.select({
				id: groupFavorites.id,
				title: groupFavorites.title,
				comment: groupFavorites.comment,
				createdAt: groupFavorites.createdAt,
				userId: groupFavorites.userId,
				userName: users.name,
				userImage: users.image
			})
			.from(groupFavorites)
			.leftJoin(users, eq(groupFavorites.userId, users.id))
			.where(eq(groupFavorites.groupId, groupId))
			.orderBy(desc(groupFavorites.createdAt));

		const favIds = favs.map(f => f.id);

		const comments: GroupFavoriteCommentSummary[] =
			favIds.length === 0
				? []
				: await db
						.select({
							id: groupFavoriteComments.id,
							favoriteId: groupFavoriteComments.favoriteId,
							comment: groupFavoriteComments.comment,
							createdAt: groupFavoriteComments.createdAt,
							userId: groupFavoriteComments.userId,
							userName: users.name,
							userImage: users.image
						})
						.from(groupFavoriteComments)
						.leftJoin(users, eq(groupFavoriteComments.userId, users.id))
						.where(inArray(groupFavoriteComments.favoriteId, favIds))
						.orderBy(desc(groupFavoriteComments.createdAt));

		const commentsByFav = new Map<number, GroupFavoriteCommentSummary[]>();
		for (const c of comments) {
			commentsByFav.set(c.favoriteId, [
				...(commentsByFav.get(c.favoriteId) ?? []),
				c
			]);
		}

		favorites = favs.map(f => ({
			...f,
			comments: commentsByFav.get(f.id) ?? []
		}));
	}

	if (isOwner) {
		pendingRequests = await db
			.select({
				id: groupJoinRequests.id,
				userId: groupJoinRequests.userId,
				userName: users.name,
				userEmail: users.email,
				createdAt: groupJoinRequests.createdAt
			})
			.from(groupJoinRequests)
			.leftJoin(users, eq(groupJoinRequests.userId, users.id))
			.where(
				and(
					eq(groupJoinRequests.groupId, groupId),
					eq(groupJoinRequests.status, 'pending')
				)
			)
			.orderBy(desc(groupJoinRequests.createdAt));

		members = await db
			.select({
				userId: groupMembers.userId,
				userName: users.name,
				userEmail: users.email,
				userImage: users.image,
				role: groupMembers.role,
				joinedAt: groupMembers.joinedAt
			})
			.from(groupMembers)
			.leftJoin(users, eq(groupMembers.userId, users.id))
			.where(eq(groupMembers.groupId, groupId))
			.orderBy(desc(groupMembers.joinedAt));
	}

	return {
		group: { ...group, visibility: group.visibility as GroupVisibility },
		me: {
			userId,
			isMember,
			isOwner,
			joinRequestStatus: (joinReq?.status as JoinRequestStatus) ?? null
		},
		canSeeContent,
		movieOptions,
		favorites,
		pendingRequests,
		members
	};
};

export const joinPublicGroup = async (userEmail: string, groupId: number) => {
	const userId = await getUserIdByEmail(userEmail);
	if (!userId) throw new Error('Not authorized');

	const group = await db
		.select()
		.from(groups)
		.where(eq(groups.id, groupId))
		.get();
	if (!group) throw new Error('Group not found');
	if (group.visibility !== 'public') throw new Error('Not a public group');

	await db
		.insert(groupMembers)
		.values({ groupId, userId, role: 'member', joinedAt: now() })
		.onConflictDoNothing();

	await db
		.update(groupJoinRequests)
		.set({ status: 'approved', resolvedAt: now(), resolvedById: group.ownerId })
		.where(
			and(
				eq(groupJoinRequests.groupId, groupId),
				eq(groupJoinRequests.userId, userId)
			)
		);
};

export const requestJoinPrivateGroup = async (
	userEmail: string,
	groupId: number
) => {
	const userId = await getUserIdByEmail(userEmail);
	if (!userId) throw new Error('Not authorized');

	const group = await db
		.select()
		.from(groups)
		.where(eq(groups.id, groupId))
		.get();
	if (!group) throw new Error('Group not found');
	if (group.visibility !== 'private') throw new Error('Not a private group');

	const alreadyMember = await db
		.select()
		.from(groupMembers)
		.where(
			and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId))
		)
		.get();
	if (alreadyMember) return;

	const existing = await db
		.select()
		.from(groupJoinRequests)
		.where(
			and(
				eq(groupJoinRequests.groupId, groupId),
				eq(groupJoinRequests.userId, userId)
			)
		)
		.get();

	if (!existing) {
		await db.insert(groupJoinRequests).values({
			groupId,
			userId,
			status: 'pending',
			createdAt: now()
		});
		return;
	}

	if (existing.status !== 'pending') {
		await db
			.update(groupJoinRequests)
			.set({
				status: 'pending',
				createdAt: now(),
				resolvedAt: null,
				resolvedById: null
			})
			.where(eq(groupJoinRequests.id, existing.id));
	}
};

export const resolveJoinRequest = async (
	ownerEmail: string,
	requestId: number,
	approve: boolean
) => {
	const ownerId = await getUserIdByEmail(ownerEmail);
	if (!ownerId) throw new Error('Not authorized');

	const req = await db
		.select()
		.from(groupJoinRequests)
		.where(eq(groupJoinRequests.id, requestId))
		.get();
	if (!req) throw new Error('Request not found');

	const group = await db
		.select()
		.from(groups)
		.where(eq(groups.id, req.groupId))
		.get();
	if (!group) throw new Error('Group not found');
	if (group.ownerId !== ownerId) throw new Error('Forbidden');

	const resolvedAt = now();

	await db
		.update(groupJoinRequests)
		.set({
			status: approve ? 'approved' : 'rejected',
			resolvedAt,
			resolvedById: ownerId
		})
		.where(eq(groupJoinRequests.id, requestId));

	if (approve) {
		await db
			.insert(groupMembers)
			.values({
				groupId: req.groupId,
				userId: req.userId,
				role: 'member',
				joinedAt: resolvedAt
			})
			.onConflictDoNothing();
	}
};

export type AddFavoriteResult = 'added' | 'duplicate';

export const addFavoriteToGroup = async (
	userEmail: string,
	groupId: number,
	payload: { movieId: number; comment?: string }
): Promise<AddFavoriteResult> => {
	const userId = await getUserIdByEmail(userEmail);
	if (!userId) throw new Error('Not authorized');

	const member = await db
		.select()
		.from(groupMembers)
		.where(
			and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId))
		)
		.get();
	if (!member) throw new Error('Must be a member');

	const movie = await db
		.select({ title: movies.title })
		.from(movies)
		.where(eq(movies.id, payload.movieId))
		.get();
	if (!movie) throw new Error('Movie not found');

	const t = now();

	const inserted = await db
		.insert(groupFavorites)
		.values({
			groupId,
			userId,
			itemSymbol: String(payload.movieId),
			title: movie.title,
			comment: (payload.comment ?? '').trim() || null,
			createdAt: t,
			updatedAt: t
		})
		.onConflictDoNothing()
		.returning({ id: groupFavorites.id });

	return inserted.length > 0 ? 'added' : 'duplicate';
};

export const deleteFavoriteFromGroup = async (
	userEmail: string,
	favoriteId: number
) => {
	const userId = await getUserIdByEmail(userEmail);
	if (!userId) throw new Error('Not authorized');

	const fav = await db
		.select()
		.from(groupFavorites)
		.where(eq(groupFavorites.id, favoriteId))
		.get();
	if (!fav) return;

	if (fav.userId !== userId) throw new Error('Forbidden');

	await db
		.delete(groupFavoriteComments)
		.where(eq(groupFavoriteComments.favoriteId, favoriteId));

	await db.delete(groupFavorites).where(eq(groupFavorites.id, favoriteId));
};

export type LeaveGroupResult = 'left' | 'deleted';

export const leaveGroup = async (
	userEmail: string,
	groupId: number
): Promise<LeaveGroupResult> => {
	const userId = await getUserIdByEmail(userEmail);
	if (!userId) throw new Error('Not authorized');

	const group = await db
		.select()
		.from(groups)
		.where(eq(groups.id, groupId))
		.get();
	if (!group) throw new Error('Group not found');

	const member = await db
		.select({ role: groupMembers.role })
		.from(groupMembers)
		.where(
			and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId))
		)
		.get();

	if (!member) throw new Error('Not a member');

	if (group.ownerId === userId || member.role === 'owner') {
		await deleteGroupCascade(userEmail, groupId);
		return 'deleted';
	}

	const favIds = await db
		.select({ id: groupFavorites.id })
		.from(groupFavorites)
		.where(
			and(
				eq(groupFavorites.groupId, groupId),
				eq(groupFavorites.userId, userId)
			)
		);

	const ids = favIds.map(x => x.id);
	if (ids.length > 0) {
		await db
			.delete(groupFavoriteComments)
			.where(inArray(groupFavoriteComments.favoriteId, ids));

		await db
			.delete(groupFavorites)
			.where(
				and(
					eq(groupFavorites.groupId, groupId),
					eq(groupFavorites.userId, userId)
				)
			);
	}

	await db
		.delete(groupMembers)
		.where(
			and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId))
		);

	await db
		.delete(groupJoinRequests)
		.where(
			and(
				eq(groupJoinRequests.groupId, groupId),
				eq(groupJoinRequests.userId, userId)
			)
		);

	return 'left';
};

export const addCommentToFavorite = async (
	userEmail: string,
	favoriteId: number,
	comment: string
) => {
	const userId = await getUserIdByEmail(userEmail);
	if (!userId) throw new Error('Not authorized');

	const fav = await db
		.select()
		.from(groupFavorites)
		.where(eq(groupFavorites.id, favoriteId))
		.get();
	if (!fav) throw new Error('Favorite not found');

	const member = await db
		.select()
		.from(groupMembers)
		.where(
			and(
				eq(groupMembers.groupId, fav.groupId),
				eq(groupMembers.userId, userId)
			)
		)
		.get();
	if (!member) throw new Error('Must be a member');

	await db.insert(groupFavoriteComments).values({
		favoriteId,
		userId,
		comment: comment.trim(),
		createdAt: now()
	});
};

export const updateGroup = async (
	ownerEmail: string,
	groupId: number,
	data: { name: string; description?: string; visibility: GroupVisibility }
) => {
	const ownerId = await getUserIdByEmail(ownerEmail);
	if (!ownerId) throw new Error('Not authorized');

	const group = await db
		.select()
		.from(groups)
		.where(eq(groups.id, groupId))
		.get();
	if (!group) throw new Error('Group not found');
	if (group.ownerId !== ownerId) throw new Error('Forbidden');

	await db
		.update(groups)
		.set({
			name: data.name.trim(),
			description: (data.description ?? '').trim() || null,
			visibility: data.visibility
		})
		.where(eq(groups.id, groupId));
};

export const inviteUserByEmailToPrivateGroup = async (
	ownerEmail: string,
	groupId: number,
	inviteEmail: string
) => {
	const ownerId = await getUserIdByEmail(ownerEmail);
	if (!ownerId) throw new Error('Not authorized');

	const group = await db
		.select()
		.from(groups)
		.where(eq(groups.id, groupId))
		.get();
	if (!group) throw new Error('Group not found');
	if (group.ownerId !== ownerId) throw new Error('Forbidden');
	if (group.visibility !== 'private')
		throw new Error('Invites are only for private groups');

	const invitee = await db
		.select()
		.from(users)
		.where(eq(users.email, inviteEmail.trim().toLowerCase()))
		.get();

	if (!invitee) throw new Error('User with this email does not exist yet');

	await db
		.insert(groupMembers)
		.values({ groupId, userId: invitee.id, role: 'member', joinedAt: now() })
		.onConflictDoNothing();

	await db
		.update(groupJoinRequests)
		.set({ status: 'approved', resolvedAt: now(), resolvedById: ownerId })
		.where(
			and(
				eq(groupJoinRequests.groupId, groupId),
				eq(groupJoinRequests.userId, invitee.id)
			)
		);
};

export const kickGroupMember = async (
	ownerEmail: string,
	groupId: number,
	memberUserId: number
) => {
	const ownerId = await getUserIdByEmail(ownerEmail);
	if (!ownerId) throw new Error('Not authorized');

	const group = await db
		.select()
		.from(groups)
		.where(eq(groups.id, groupId))
		.get();
	if (!group) throw new Error('Group not found');
	if (group.ownerId !== ownerId) throw new Error('Forbidden');
	if (memberUserId === group.ownerId) throw new Error('Cannot kick the owner');

	await db
		.delete(groupMembers)
		.where(
			and(
				eq(groupMembers.groupId, groupId),
				eq(groupMembers.userId, memberUserId)
			)
		);

	await db
		.delete(groupJoinRequests)
		.where(
			and(
				eq(groupJoinRequests.groupId, groupId),
				eq(groupJoinRequests.userId, memberUserId)
			)
		);
};

export const deleteGroupCascade = async (
	ownerEmail: string,
	groupId: number
) => {
	const ownerId = await getUserIdByEmail(ownerEmail);
	if (!ownerId) throw new Error('Not authorized');

	const group = await db
		.select()
		.from(groups)
		.where(eq(groups.id, groupId))
		.get();
	if (!group) throw new Error('Group not found');
	if (group.ownerId !== ownerId) throw new Error('Forbidden');

	const favIds = await db
		.select({ id: groupFavorites.id })
		.from(groupFavorites)
		.where(eq(groupFavorites.groupId, groupId));

	const ids = favIds.map(x => x.id);
	if (ids.length > 0) {
		await db
			.delete(groupFavoriteComments)
			.where(inArray(groupFavoriteComments.favoriteId, ids));
	}

	await db.delete(groupFavorites).where(eq(groupFavorites.groupId, groupId));
	await db
		.delete(groupJoinRequests)
		.where(eq(groupJoinRequests.groupId, groupId));
	await db.delete(groupMembers).where(eq(groupMembers.groupId, groupId));
	await db.delete(groups).where(eq(groups.id, groupId));
};
