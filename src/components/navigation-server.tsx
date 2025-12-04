import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/auth';
import ClientNavigation from '@/components/navigation';

export const Navigation = async () => {
	const session = await getServerSession(authOptions);

	return <ClientNavigation session={session} />;
};
