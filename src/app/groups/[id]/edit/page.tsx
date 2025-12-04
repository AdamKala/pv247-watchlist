import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/auth';
import { getGroupDetail, updateGroup } from '@/db/groups';

const updateGroupAction = async (groupId: number, formData: FormData) => {
	'use server';

	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	const name = String(formData.get('name') ?? '').trim();
	const description = String(formData.get('description') ?? '').trim();
	const visibility = String(formData.get('visibility') ?? 'public') as
		| 'public'
		| 'private';

	if (!name || name.length < 2) return;

	await updateGroup(session.user.email, groupId, {
		name,
		description,
		visibility
	});
	redirect(`/groups/${groupId}`);
};

type Props = {
	params: Promise<{ id: string }>;
};

const GroupEditPage = async ({ params }: Props) => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-lg text-red-500">Not authorized</p>
			</div>
		);
	}

	const { id } = await params;
	const groupId = Number(id);

	const data = await getGroupDetail(session.user.email, groupId);

	if (!data) {
		return (
			<div className="p-8 text-white">
				<p className="text-red-400">Group not found.</p>
			</div>
		);
	}

	if (!data.me.isOwner) {
		return (
			<div className="p-8 text-white">
				<p className="text-red-400">Forbidden (only owner can edit).</p>
			</div>
		);
	}

	const g = data.group;

	return (
		<div className="p-8 text-white">
			<h1 className="mb-6 text-3xl font-bold">Edit Group</h1>

			<form
				action={updateGroupAction.bind(null, groupId)}
				className="space-y-4 rounded-xl bg-black p-6 shadow-lg"
			>
				<div>
					<label className="mb-2 block" htmlFor="name">
						Group name
					</label>
					<input
						id="name"
						name="name"
						defaultValue={g.name}
						required
						minLength={2}
						className="w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
					/>
				</div>

				<div>
					<label className="mb-2 block" htmlFor="description">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						defaultValue={g.description ?? ''}
						rows={3}
						className="w-full resize-none rounded-md border border-gray-700 bg-gray-900 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
					/>
				</div>

				<div>
					<label className="mb-2 block" htmlFor="visibility">
						Visibility
					</label>
					<select
						id="visibility"
						name="visibility"
						defaultValue={g.visibility}
						className="w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
					>
						<option value="public">Public</option>
						<option value="private">Private</option>
					</select>
				</div>

				<div className="flex gap-3">
					<button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700">
						Save changes
					</button>

					<a
						href={`/groups/${groupId}`}
						className="rounded-lg bg-gray-700 px-4 py-2 font-semibold hover:bg-gray-600"
					>
						Cancel
					</a>
				</div>
			</form>
		</div>
	);
};

export default GroupEditPage;
