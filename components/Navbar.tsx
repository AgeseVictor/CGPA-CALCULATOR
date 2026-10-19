'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, Trophy, LogIn, UserRound, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('cgpa_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cgpa_auth_token');
    localStorage.removeItem('cgpa_user');
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white font-bold text-lg">
            c
          </div>
          <span className="text-xl font-bold tracking-tight text-black">
            cgpa<span className="text-gray-400 font-normal">.store</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#calculator" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            <BookOpen className="h-4 w-4" />
            Calculator
          </a>
          <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            <Calendar className="h-4 w-4" />
            Timetable
          </a>
          <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            <Clock className="h-4 w-4" />
            Deadlines
          </a>
          <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <UserRound className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
                <span className="max-w-[90px] sm:max-w-none truncate">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
              <Link href="/signup" className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors shadow-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
