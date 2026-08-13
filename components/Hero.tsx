import React from 'react';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      {/* Background Gradients for depth */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-40 mix-blend-multiply blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Release Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-800 border border-gray-100 shadow-sm mb-6">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span>v2.0 is live: Now with automatic course templates!</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl max-w-3xl mx-auto leading-[1.15]">
          Track every semester, hit your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600">
            target CGPA
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          The ultimate grade planning toolkit. Calculate your GPA/CGPA, reverse-math your targets, and organize your class timetable all in one place.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#calculator"
            className="group flex items-center gap-2 rounded-xl bg-black px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-gray-900 transition-all hover:scale-[1.02]"
          >
            Calculate my CGPA
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <button
            className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-6 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-100 transition-all hover:scale-[1.02]"
          >
            <Calendar className="h-4 w-4 text-gray-500" />
            Build a timetable
          </button>
        </div>
      </div>
    </section>
  );
}
