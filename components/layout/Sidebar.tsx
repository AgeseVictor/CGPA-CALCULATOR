'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Settings,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',            label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/semesters',   label: 'Semesters',   icon: BookOpen },
  { href: '/transcript',  label: 'Transcript',  icon: FileText },
  { href: '/settings',    label: 'Settings',    icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar no-print" aria-label="Main navigation">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={22} />
        </div>
        <div>
          <p className="brand-name">CGPA Calc</p>
          <p className="brand-sub">Academic Tracker</p>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item ${active ? 'nav-item-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active && <ChevronRight size={14} className="nav-chevron" />}
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: var(--sidebar-width);
          background: var(--bg-surface);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          padding: var(--space-6) var(--space-4);
          z-index: 50;
          gap: var(--space-2);
        }
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-2);
          margin-bottom: var(--space-2);
        }
        .brand-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--grad-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          box-shadow: var(--shadow-accent);
        }
        .brand-name {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-primary);
          line-height: 1;
        }
        .brand-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .sidebar-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: var(--space-2) 0;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 500;
          transition: all var(--transition-fast);
          text-decoration: none;
          position: relative;
        }
        .nav-item:hover {
          background: var(--bg-surface-2);
          color: var(--text-primary);
        }
        .nav-item-active {
          background: rgba(99, 102, 241, 0.12);
          color: var(--accent-light);
          font-weight: 600;
        }
        .nav-item-active:hover {
          background: rgba(99, 102, 241, 0.18);
          color: var(--accent-light);
        }
        .nav-chevron {
          margin-left: auto;
          opacity: 0.5;
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
        }
      `}</style>
    </aside>
  );
}
