type Props = {
	params: Promise<{ id: string }>;
};

const EditMovieListPage = async ({ params }: Props) => {
	const resolvedParams = await params;
	return <div>Edit Movie List Page {resolvedParams.id}</div>;
};

export default EditMovieListPage;
