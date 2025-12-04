import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ClientNavigation from '@/components/navigation';

export const Navigation = async () => {
	const session = await getServerSession(authOptions);

	return <ClientNavigation session={session} />;
};
