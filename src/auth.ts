import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { users, watchlists } from '@/db/schema';

export const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!
		})
	],
	session: { strategy: 'jwt' },
	callbacks: {
		signIn: async ({ user }) => {
			if (!user.email) return false;

			const existingUser = await db
				.select()
				.from(users)
				.where(eq(users.email, user.email))
				.get();

			if (!existingUser) {
				await db.insert(users).values({
					name: user.name ?? user.email,
					email: user.email,
					image: user.image ?? null
				});

				const newUser = await db
					.select()
					.from(users)
					.where(eq(users.email, user.email))
					.get();

				await db.insert(watchlists).values({
					userId: newUser!.id,
					name: 'Favourites',
					description: 'Favourite movies and shows',
					default: 1
				});
			}

			return true;
		},
		session: async ({ session }) => {
			if (!session.user?.email) return session;

			const dbUser = await db
				.select()
				.from(users)
				.where(eq(users.email, session.user.email))
				.get();

			if (dbUser) {
				session.user.name = dbUser.name;
				session.user.image = dbUser.image;
			}

			return session;
		}
	},
	secret: process.env.NEXTAUTH_SECRET
};
