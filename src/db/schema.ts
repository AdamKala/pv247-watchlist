import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
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
