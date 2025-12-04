import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/auth';
import { createGroup } from '@/db/groups';

const createGroupAction = async (formData: FormData) => {
	'use server';

	const session = await getServerSession(authOptions);
	if (!session?.user?.email) return;

	const name = String(formData.get('name') ?? '').trim();
	const description = String(formData.get('description') ?? '').trim();
	const visibility = String(formData.get('visibility') ?? 'public') as
		| 'public'
		| 'private';

	if (!name || name.length < 2) return;

	await createGroup(session.user.email, { name, description, visibility });
	redirect('/groups');
};

const CreateGroupPage = () => (
	<div className="p-8 text-white">
		<h1 className="mb-6 text-3xl font-bold">Create New Group</h1>

		<form
			action={createGroupAction}
			className="space-y-4 rounded-xl bg-black p-6 shadow-lg"
		>
			<div>
				<label className="mb-2 block" htmlFor="name">
					Group name
				</label>
				<input
					id="name"
					name="name"
					required
					minLength={2}
					className="w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
					placeholder="e.g. My first group"
				/>
			</div>

			<div>
				<label className="mb-2 block" htmlFor="description">
					Description
				</label>
				<textarea
					id="description"
					name="description"
					rows={3}
					className="w-full resize-none rounded-md border border-gray-700 bg-gray-900 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
					placeholder="What is this group for?"
				/>
			</div>

			<div>
				<label className="mb-2 block" htmlFor="visibility">
					Visibility
				</label>
				<select
					id="visibility"
					name="visibility"
					className="w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
					defaultValue="public"
				>
					<option value="public">Public (anyone can join)</option>
					<option value="private">Private (requires approval)</option>
				</select>
			</div>

			<button className="rounded-md bg-blue-600 px-4 py-2 font-semibold transition hover:bg-blue-700">
				Create group
			</button>
		</form>
	</div>
);

export default CreateGroupPage;
