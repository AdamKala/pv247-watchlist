import {
	sqliteTable,
	text,
	integer,
	primaryKey,
	uniqueIndex
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	image: text('image'),
	description: text('description')
});

export const watchlists = sqliteTable('watchlists', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	description: text('description'),
	favourite: integer('favourite').default(0)
});

export const watchlistItems = sqliteTable('watchlist_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	watchlistId: integer('watchlist_id')
		.notNull()
		.references(() => watchlists.id),
	itemSymbol: text('item_symbol').notNull()
});

export const groups = sqliteTable('groups', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	ownerId: integer('owner_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	description: text('description'),
	visibility: text('visibility', { enum: ['public', 'private'] })
		.notNull()
		.default('public'),
	createdAt: integer('created_at').notNull()
});

export const groupMembers = sqliteTable(
	'group_members',
	{
		groupId: integer('group_id')
			.notNull()
			.references(() => groups.id),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id),
		role: text('role', { enum: ['owner', 'member'] })
			.notNull()
			.default('member'),
		joinedAt: integer('joined_at').notNull()
	},
	t => ({
		pk: primaryKey({ columns: [t.groupId, t.userId] })
	})
);

export const groupJoinRequests = sqliteTable(
	'group_join_requests',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		groupId: integer('group_id')
			.notNull()
			.references(() => groups.id),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id),
		status: text('status', { enum: ['pending', 'approved', 'rejected'] })
			.notNull()
			.default('pending'),
		createdAt: integer('created_at').notNull(),
		resolvedAt: integer('resolved_at'),
		resolvedById: integer('resolved_by_id').references(() => users.id)
	},
	t => ({
		uniq: uniqueIndex('uniq_group_join_req').on(t.groupId, t.userId)
	})
);

export const groupFavorites = sqliteTable(
	'group_favorites',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		groupId: integer('group_id')
			.notNull()
			.references(() => groups.id),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id),
		itemSymbol: text('item_symbol').notNull(),
		title: text('title'),
		comment: text('comment'),
		createdAt: integer('created_at').notNull(),
		updatedAt: integer('updated_at').notNull()
	},
	t => ({
		uniq: uniqueIndex('uniq_group_fav').on(t.groupId, t.userId, t.itemSymbol)
	})
);

export const groupFavoriteComments = sqliteTable('group_favorite_comments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	favoriteId: integer('favorite_id')
		.notNull()
		.references(() => groupFavorites.id),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	comment: text('comment').notNull(),
	createdAt: integer('created_at').notNull()
});

export const reviews = sqliteTable('reviews', {
	id: integer('id').primaryKey({ autoIncrement: true }),

	userId: integer('user_id')
		.notNull()
		.references(() => users.id),

	// TODO: Add after movies are done
	//   movieId: text('movie_id')
	//     .notNull()
	//     .references(() => movies.id),

	movieId: integer('movie_id').notNull(),

	rating: integer('rating').notNull(),
	text: text('text').notNull(),

	createdAt: text('created_at').notNull()
});
