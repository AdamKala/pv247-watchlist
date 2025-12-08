import { getServerSession } from 'next-auth/next';
import { notFound, redirect } from 'next/navigation';

import { getUserReviewById } from '@/db/reviews';

import EditReviewPageClient from './EditReviewPageClient';

type PageProps = {
	params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
	const { id } = await params;
	const reviewId = Number(id);

	if (!Number.isInteger(reviewId) || reviewId <= 0) notFound();

	const session = await getServerSession();
	if (!session?.user?.email) redirect('/reviews');

	const review = await getUserReviewById(session.user.email, reviewId);
	if (!review) notFound();

	return <EditReviewPageClient review={review} />;
};

export default Page;
