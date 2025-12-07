import {
	sqliteTable,
	text,
	integer,
	real,
	primaryKey,
	uniqueIndex,
	index
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	image: text('image'),
	description: text('description')
});

export const movies = sqliteTable('movies', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	year: integer('year'),
	image: text('image'),
	description: text('description'),
	origins: text('origins'),
    genres: text('genres'),
    duration: text('duration'),
	type: text('type').notNull(),
	localRating: real('local_rating'),
	csfdId: integer('csf_id').notNull().unique(),
	csfdRating: real('csrf_rating'),
	csfdLastFetched: text('csrd_last_fetched'),
	tmdbId: integer('imdb_id'),
	tmdbRating: real('imdb_rating'),
	tmdbLastFetched: text('imdb_last_fetched')
});

export const watchlists = sqliteTable('watchlists', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	description: text('description'),
	default: integer('default').default(0),
	favourite: integer('favourite').default(0)
});

export const watchlistItems = sqliteTable('watchlist_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	watchlistId: integer('watchlist_id')
		.notNull()
		.references(() => watchlists.id),
	movieId: integer('movie_id')
		.notNull()
		.references(() => movies.id)
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

	movieId: integer('movie_id')
		.notNull()
		.references(() => movies.id),

	rating: integer('rating').notNull(),
	text: text('text').notNull(),

	createdAt: integer('created_at').notNull()
});

export const movieVisits = sqliteTable(
	'movie_visits',
	{
		userEmail: text('user_email')
			.notNull()
			.references(() => users.email, { onDelete: 'cascade' }),

		movieId: integer('movie_id')
			.notNull()
			.references(() => movies.id, { onDelete: 'cascade' }),

		visitedAt: integer('visited_at').notNull(),
        movieSeenAt: integer('movie_seen_at'),
	},
	t => ({
		pk: primaryKey({ columns: [t.userEmail, t.movieId] }),
		byUserVisited: index('idx_movie_visits_user_visited').on(
			t.userEmail,
			t.visitedAt,
		)
	})
);
