'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';

import { schema } from '@/lib/profile-schema';
import type { Account } from '@/lib/account';

type ProfileInfoProps = {
	user: Account;
	updateProfile: (formData: FormData) => Promise<void>;
};

const ProfileInfo = ({ user, updateProfile }: ProfileInfoProps) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [previewImage, setPreviewImage] = useState(user.image ?? null);

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			name: user.name ?? '',
			image: user.image ?? null,
			description: user.description ?? ''
		}
	});

	const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = reader.result as string;
			setPreviewImage(base64);
			form.setValue('image', base64);
		};
		reader.readAsDataURL(file);
	};

	const onSubmit = async (data: z.infer<typeof schema>) => {
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('image', data.image ?? '/icons/default-user.svg');
		formData.append('description', data.description ?? '');
		await updateProfile(formData);

		setIsEditing(false);
		router.refresh();
	};

	return (
		<div className="flex w-full flex-col gap-6 rounded-xl bg-black p-6 text-white shadow-lg">
			<div className="flex w-full flex-col items-start gap-6 md:flex-row md:items-center">
				<div className="group relative shrink-0">
					<Image
						src={previewImage ?? '/icons/default-user.svg'}
						alt="Avatar"
						width={90}
						height={90}
						className={`h-[90px] w-[90px] ${isEditing ? 'border-2 border-blue-600' : 'border-2 border-gray-600'} rounded-full object-cover`}
						priority
					/>

					{isEditing && (
						<div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 opacity-0 transition group-hover:opacity-100">
							<label className="mb-1 cursor-pointer">
								<span className="text-sm text-blue-400">Change</span>
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleAvatarUpload}
								/>
							</label>

							<button
								type="button"
								className="text-sm text-red-500 underline"
								onClick={() => {
									setPreviewImage('/icons/default-user.svg');
									form.setValue('image', null);
								}}
							>
								Remove
							</button>
						</div>
					)}
				</div>

				<div className="flex w-full flex-1 flex-col gap-2">
					<input
						{...form.register('name')}
						disabled={!isEditing}
						className={`w-full rounded-lg bg-gray-900 px-3 py-2 text-lg font-bold text-white outline-none ${isEditing ? 'ring-1 ring-blue-600 focus:ring-2' : ''}`}
					/>
					<textarea
						{...form.register('description')}
						rows={3}
						disabled={!isEditing}
						placeholder="Empty..."
						className={`w-full resize-none rounded-lg bg-gray-900 px-3 py-2 text-white outline-none ${isEditing ? 'ring-1 ring-blue-600 focus:ring-2' : ''}`}
					/>
					<p className="text-sm text-blue-400">{user.email}</p>
				</div>

				<div className="ml-auto flex gap-4 self-start md:self-auto">
					{isEditing ? (
						<>
							<button
								onClick={() => {
									setIsEditing(false);
									setPreviewImage(user.image ?? '/icons/default-user.svg');
									form.reset();
								}}
								className="rounded-lg bg-gray-700 px-4 py-2 font-semibold hover:bg-gray-600"
							>
								Discard
							</button>

							<button
								onClick={form.handleSubmit(onSubmit)}
								className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700"
							>
								Save Changes
							</button>
						</>
					) : (
						<button
							className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700"
							onClick={() => setIsEditing(true)}
						>
							Edit Profile
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProfileInfo;
