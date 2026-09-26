"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Bookmark, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === '/welcome' || pathname === '/' || pathname === '/traitors') return null;

  const navItems = [
    { icon: Home, href: '/', label: 'Feed' },
    { icon: Compass, href: '/search', label: 'Discover' },
    { icon: Bookmark, href: '/my-stays', label: 'Saved' },
    { icon: User, href: '/profile', label: 'Profile' },
  ];

  const isHome = pathname === '/';

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 transition-all pb-safe md:pb-0 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-auto ${
      isHome 
        ? 'bg-gradient-to-t from-black via-black/80 to-transparent md:bg-black/80 md:backdrop-blur-2xl md:border md:border-neutral-800 md:rounded-full md:px-4 md:shadow-2xl' 
        : 'bg-black/95 backdrop-blur-xl border-t border-neutral-800 md:border md:rounded-full md:px-4 md:shadow-2xl'
    }`}>
      <div className="flex justify-around md:justify-center items-center h-16 max-w-md md:max-w-none mx-auto px-4 md:px-2 md:gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/search' && pathname.startsWith('/admin'));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col md:flex-row items-center justify-center w-16 md:w-auto md:px-4 h-full md:h-10 md:rounded-full relative transition-all ${
                isActive 
                  ? 'text-white md:bg-neutral-800' 
                  : 'text-neutral-400 hover:text-white md:hover:bg-neutral-900'
              }`}
            >
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.2 : 1.8} 
                fill={isActive ? "currentColor" : "none"} 
                className={isActive ? 'drop-shadow-sm' : ''}
              />
              <span className="hidden md:inline text-xs font-semibold ml-2">{item.label}</span>
              {isActive && (
                <span className="md:hidden absolute bottom-2.5 w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
