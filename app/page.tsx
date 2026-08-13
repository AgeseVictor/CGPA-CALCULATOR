'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Calculator from '@/components/Calculator';
import ClassificationTable from '@/components/ClassificationTable';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Homepage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Workspace Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Core CGPA Calculator Workspace */}
            <div className="mb-16">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                Your Academic Dashboard
              </h2>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                Calculate and strategize your goals in real-time
              </p>
              <Calculator />
            </div>

            {/* Reference Table */}
            <ClassificationTable />

            {/* Frequently Asked Questions */}
            <FAQ />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
