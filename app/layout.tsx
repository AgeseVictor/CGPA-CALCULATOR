import type { Metadata } from 'next';
import './globals.css';
import '../styles/print.css';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: {
    default: 'CGPA Calculator — Academic Grade Tracker',
    template: '%s | CGPA Calculator',
  },
  description:
    'A premium CGPA Calculator to track your semester grades, compute your cumulative GPA, and visualize your academic progress.',
  keywords: ['CGPA', 'GPA calculator', 'grade tracker', 'academic', 'semester GPA'],
  authors: [{ name: 'CGPA Calculator' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#07080d',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div className="page-shell">
          <Sidebar />
          <main className="main-content" id="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
