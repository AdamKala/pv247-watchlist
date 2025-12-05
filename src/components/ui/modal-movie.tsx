'use client';

import Image from 'next/image';

type ModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: () => void;
	children: React.ReactNode;
	title?: string;
	movie?: {
		title: string;
		posterUrl: string;
	};
};

const ModalMovie = ({
	open,
	onClose,
	onSubmit,
	children,
	title,
	movie
}: ModalProps) => {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
				{title && (
					<h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
				)}

				{movie && (
					<div className="mb-4 flex items-center gap-4">
						<Image
							src={movie.posterUrl}
							alt={movie.title}
							width={56}
							height={80}
							className="rounded-md border border-gray-700 object-cover"
						/>
						<h3 className="text-lg font-bold text-white">{movie.title}</h3>
					</div>
				)}

				{children}

				{/* Buttons */}
				<div className="mt-4 flex justify-end gap-4">
					<button
						onClick={onClose}
						className="rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white transition hover:bg-gray-600"
					>
						Cancel
					</button>
					<button
						onClick={onSubmit}
						className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Add
					</button>
				</div>
			</div>
		</div>
	);
};

export default ModalMovie;
