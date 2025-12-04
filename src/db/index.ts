import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
	url: process.env.TURSO_DB_URL!,
	authToken: process.env.TURSO_DB_AUTH_TOKEN!
});

export const db = drizzle(client);
