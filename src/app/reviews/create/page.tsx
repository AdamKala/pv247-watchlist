import { getAllMovies } from '@/db/movies';

import CreateReviewPageClient from './CreateReviewPageClient';

const Page = async () => {
	const movies = await getAllMovies();
	return <CreateReviewPageClient movies={movies} />;
};

export default Page;
