'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Session } from 'next-auth';
import { useEffect, useMemo, useState } from 'react';

import LogoutButton from '@/components/log-out-button';

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

const ClientNavigation = ({ session }: { session: Session | null }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links: NavLink[] = useMemo(
    () => [
      { href: '/', label: 'Home' },
      { href: '/watchlists', label: 'My lists' },
      { href: '/groups', label: 'Groups' },
      { href: '/reviews', label: 'My Reviews' },
      { href: 'https://www.csfd.cz/', label: 'ČSFD', external: true },
      { href: '/search', label: 'Search' }
    ],
    []
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (!href.startsWith('http') ? pathname === href : false);

  const baseItemClass =
    'rounded-lg px-4 py-2 text-lg font-semibold transition text-white hover:bg-blue-700 hover:text-white';

  const activeClass = 'bg-blue-700 text-white';

  const mobileItemClass = (href: string) =>
    `block w-full rounded-lg px-4 py-3 text-left text-base font-semibold transition ${
      isActive(href) ? activeClass : 'text-white hover:bg-blue-700'
    }`;

  const renderLink = (link: NavLink, variant: 'desktop' | 'mobile') => {
    const classes =
      variant === 'desktop'
        ? `${baseItemClass} ${isActive(link.href) ? activeClass : ''}`
        : mobileItemClass(link.href);

    if (link.external) {
      return (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className={classes}>
          {link.label}
        </a>
      );
    }

    return (
      <Link href={link.href} className={classes}>
        {link.label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-black shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Desktop nav (visible like now) */}
          <ul className="hidden flex-wrap items-center gap-3 sm:flex sm:gap-6">
            {links.map(link => (
              <li key={link.label}>{renderLink(link, 'desktop')}</li>
            ))}
          </ul>

          <ul className="hidden items-center gap-3 sm:flex sm:gap-6">
            {session && (
              <li>
                <Link
                  href="/account"
                  className={`${baseItemClass} ${pathname === '/account' ? activeClass : ''}`}
                >
                  My profile
                </Link>
              </li>
            )}

            <li>
              {session ? (
                <LogoutButton className={baseItemClass} />
              ) : (
                <Link
                  href="/login"
                  className={`${baseItemClass} ${pathname === '/login' ? activeClass : ''}`}
                >
                  Login
                </Link>
              )}
            </li>
          </ul>

          {/* Mobile header + dropdown toggle */}
          <div className="flex w-full items-center justify-between sm:hidden">
            <span className="text-lg font-semibold text-white">Menu</span>

            <button
              type="button"
              onClick={() => setOpen(prev => !prev)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="inline-flex items-center justify-center rounded-lg p-2 text-white transition hover:bg-white/10"
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>

              {open ? (
                // X icon
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                // hamburger icon
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6H20M4 12H20M4 18H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div id="mobile-nav" className="sm:hidden">
            <div className="mb-4 rounded-2xl border border-white/10 bg-black/95 p-2 shadow-lg backdrop-blur">
              <ul className="flex flex-col gap-1">
                {links.map(link => (
                  <li key={link.label}>{renderLink(link, 'mobile')}</li>
                ))}

                <div className="my-2 h-px w-full bg-white/10" />

                {session && (
                  <li>
                    <Link href="/account" className={mobileItemClass('/account')}>
                      My profile
                    </Link>
                  </li>
                )}

                <li>
                  {session ? (
                    <LogoutButton className={mobileItemClass('#logout')} />
                  ) : (
                    <Link href="/login" className={mobileItemClass('/login')}>
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ClientNavigation;
