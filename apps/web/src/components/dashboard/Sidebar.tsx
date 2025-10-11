'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Search, Heart, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1A1A2E] text-white md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 flex h-screen w-20 flex-col items-center bg-[#1A1A2E] py-6 transition-transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
      {/* Logo */}
      <div className="mb-8">
        <Logo className="h-10 text-white" />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-1 flex-col gap-6">
        <Link
          href="/dashboard/search"
          className={`group relative flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
            isActive('/dashboard/search')
              ? 'bg-primary-500 text-white'
              : 'text-gray-400 hover:bg-[#2D2D44] hover:text-white'
          }`}
          title="Search"
        >
          <Search className="h-6 w-6" />
          {isActive('/dashboard/search') && (
            <span className="absolute left-0 h-8 w-1 rounded-r-full bg-white" />
          )}
        </Link>

        <Link
          href="/dashboard/favorites"
          className={`group relative flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
            isActive('/dashboard/favorites')
              ? 'bg-primary-500 text-white'
              : 'text-gray-400 hover:bg-[#2D2D44] hover:text-white'
          }`}
          title="Favorites"
        >
          <Heart className="h-6 w-6" />
          {isActive('/dashboard/favorites') && (
            <span className="absolute left-0 h-8 w-1 rounded-r-full bg-white" />
          )}
        </Link>
      </nav>

      {/* User Section */}
      <button
        onClick={handleLogout}
        className="flex h-12 w-12 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-[#2D2D44] hover:text-white"
        title="Logout"
      >
        <LogOut className="h-6 w-6" />
      </button>
    </div>
    </>
  );
}