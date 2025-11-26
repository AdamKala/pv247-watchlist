const Home = () => {
	return (
		<main className="px-6 py-10 max-w-7xl mx-auto">
			<h1 className="text-start text-3xl font-bold mb-10 text-white">Movie Tracker</h1>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

				<div className="flex flex-col gap-6 lg:col-span-1">
					<div className="bg-gray-700/50 p-4 rounded-md h-44">
						<h2 className="font-semibold mb-2">Latest reviews</h2>
						<p className="text-gray-300">Review #1 - placeholder</p>
						<p className="text-gray-300">Review #2 - placeholder</p>
					</div>

					<div className="bg-gray-700/50 p-4 rounded-md h-44">
						<h2 className="font-semibold mb-2">Last visited</h2>
						<p className="text-gray-300">Visit #1</p>
						<p className="text-gray-300">Visit #2</p>
					</div>
				</div>

				<div className="lg:col-span-2">
					<div className="bg-gray-700/50 p-6 rounded-md">
						<h2 className="font-semibold mb-4">Top movies</h2>

						<div className="flex flex-col gap-4">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="bg-gray-600/40 rounded-md h-32 flex items-center justify-center text-gray-300"
								>
									Movie #{i} - placeholder
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="lg:col-span-1">
					<div className="bg-gray-700/50 p-4 rounded-md h-[400px]">
						<h2 className="font-semibold mb-2">Continue watching</h2>
						<p className="text-gray-300 mt-4">Movie A - placeholder</p>
						<p className="text-gray-300">Movie B - placeholder</p>
					</div>
				</div>

			</div>
		</main>
	);
};

export default Home;
