'use client';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import type { Semester, GradeScale } from '@/lib/types';
import { exportJSON, importJSON } from '@/lib/storage';

interface NavbarProps {
  semesters: Semester[];
  gradeScale: GradeScale;
  pageTitle: string;
  onImport?: (sems: Semester[], scale: GradeScale) => void;
}

export function Navbar({ semesters, gradeScale, pageTitle, onImport }: NavbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImport) return;
    try {
      const data = await importJSON(file);
      onImport(data.semesters, data.gradeScale);
    } catch {
      alert('Invalid file. Please upload a valid CGPA JSON export.');
    }
    e.target.value = '';
  };

  return (
    <header className="navbar no-print" role="banner">
      <div className="navbar-inner">
        <h1 className="navbar-title">{pageTitle}</h1>
        <div className="navbar-actions">
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
            aria-label="Import CGPA data"
          />
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => fileRef.current?.click()}
            aria-label="Import data"
            title="Import JSON"
          >
            <Upload size={16} />
            <span className="btn-label">Import</span>
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => exportJSON(semesters, gradeScale)}
            aria-label="Export data"
            title="Export JSON"
          >
            <Download size={16} />
            <span className="btn-label">Export</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: var(--sidebar-width);
          right: 0;
          height: var(--navbar-height);
          background: rgba(14, 16, 24, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-subtle);
          z-index: 40;
        }
        .navbar-inner {
          height: 100%;
          max-width: var(--content-max-w);
          margin: 0 auto;
          padding: 0 var(--space-6);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .btn-label {
          display: none;
        }
        @media (min-width: 640px) {
          .btn-label { display: inline; }
        }
        @media (max-width: 768px) {
          .navbar { left: 0; }
        }
      `}</style>
    </header>
  );
}
