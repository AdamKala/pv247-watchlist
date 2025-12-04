const CreateMovieListPage = () => (
	<div className="p-8">
		<h1 className="mb-6 text-3xl font-bold text-white">Create New Watchlist</h1>
		<form className="space-y-4">
			<div>
				<label className="mb-2 block text-white" htmlFor="name">
					Watchlist Name
				</label>
				<input
					type="text"
					id="name"
					className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					placeholder="Enter watchlist name"
				/>
			</div>
			<div>
				<label className="mb-2 block text-white" htmlFor="description">
					Description
				</label>
				<textarea
					id="description"
					className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					placeholder="Enter watchlist description"
				/>
			</div>
			<button
				type="submit"
				className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
			>
				Create Watchlist
			</button>
		</form>
	</div>
);

export default CreateMovieListPage;
