import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	image: text('image')
});

export const watchlists = sqliteTable('watchlists', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull()
});

export const watchlistItems = sqliteTable('watchlist_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	watchlistId: integer('watchlist_id')
		.notNull()
		.references(() => watchlists.id),
	itemSymbol: text('item_symbol').notNull()
});
