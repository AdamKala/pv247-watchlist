'use client';

import { signOut } from 'next-auth/react';
import { type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react';

import { cn } from '@/lib/cn';

type ButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const LogoutButton = ({ className, ...buttonProps }: ButtonProps) => (
	<button
		onClick={() => signOut({ callbackUrl: '/login' })}
		className={cn(className)}
		{...buttonProps}
	>
		Logout
	</button>
);

export default LogoutButton;
