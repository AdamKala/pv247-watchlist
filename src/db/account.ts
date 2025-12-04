import { getServerSession } from 'next-auth/next';
import { eq } from 'drizzle-orm';

import { authOptions } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';

const updateProfile = async (formData: FormData) => {
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	const name = formData.get('name') as string;
	const image = formData.get('image') as string;
	const description = formData.get('description') as string;

	await db
		.update(users)
		.set({
			name,
			image,
			description
		})
		.where(eq(users.email, session.user.email));
};

const getDescription = async (email: string) => {
	const user = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.get();

	return user?.description ?? null;
};

export { updateProfile, getDescription };
