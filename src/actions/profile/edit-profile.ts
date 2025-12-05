'use server';

import { updateProfile } from '@/db/account';

export const editProfileAction = async (formData: FormData) =>
	await updateProfile(formData);
