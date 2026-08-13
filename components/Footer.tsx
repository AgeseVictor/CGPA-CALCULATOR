import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-black text-white font-bold text-sm">
            c
          </div>
          <span className="text-sm font-bold tracking-tight text-black">
            cgpa<span className="text-gray-400 font-normal">.store</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-black transition-colors">Timetable</a>
          <a href="#" className="hover:text-black transition-colors">Leaderboard</a>
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
        </div>

        {/* Credits */}
        <p className="text-sm text-gray-400">
          Designed & built by <span className="font-semibold text-gray-600">Kingdavid Christian</span> 👨🏽‍💻
        </p>
      </div>
    </footer>
  );
}
