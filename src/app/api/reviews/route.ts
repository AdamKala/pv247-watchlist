import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { createReview } from '@/db/reviews';

export const POST = async (req: Request) => {
	const session = await getServerSession();

	if (!session?.user?.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { movieId, rating, text } = await req.json();

	await createReview(session.user.email, movieId, rating, text);

	return NextResponse.json({ success: true });
};
