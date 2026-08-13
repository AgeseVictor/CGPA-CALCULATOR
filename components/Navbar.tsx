import React from 'react';
import { BookOpen, Calendar, Clock, Trophy, LogIn } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white font-bold text-lg">
            c
          </div>
          <span className="text-xl font-bold tracking-tight text-black">
            cgpa<span className="text-gray-400 font-normal">.store</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#calculator"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Calculator
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Timetable
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            <Clock className="h-4 w-4" />
            Deadlines
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            <Trophy className="h-4 w-4" />
            Leaderboard
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <LogIn className="h-4 w-4" />
            Log in
          </button>
          <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors shadow-sm">
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}
