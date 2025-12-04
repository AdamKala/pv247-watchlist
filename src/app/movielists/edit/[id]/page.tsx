type Props = {
	params: Promise<{ id: string }>;
};

const EditMovieListPage = async ({ params }: Props) => {
	const { id } = await params;
	return <div>Edit Movie List Page {id}</div>;
};

export default EditMovieListPage;
