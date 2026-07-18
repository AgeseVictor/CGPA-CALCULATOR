'use client';
import { useCGPA } from '@/hooks/useCGPA';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GRADE_SCALES } from '@/lib/gradeScales';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { gradeScale, setGradeScale, clearAll, rawSemesters } = useCGPA();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    clearAll();
    setConfirmClear(false);
  };

  return (
    <>
      <Navbar semesters={rawSemesters} gradeScale={gradeScale} pageTitle="Settings" />

      <div className="page-inner">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', marginBottom: 'var(--space-2)' }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)' }}>Configure your grade scale and manage your data.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '640px' }}>

          {/* Grade Scale */}
          <Card>
            <CardBody>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>
                Grade Scale
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-5)' }}>
                Choose the grading scale used by your institution. Changing this will recompute all GPAs.
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                {(['4.0', '5.0'] as const).map((scale) => (
                  <button
                    key={scale}
                    className={`scale-card ${gradeScale === scale ? 'active' : ''}`}
                    onClick={() => setGradeScale(scale)}
                    aria-pressed={gradeScale === scale}
                    id={`setting-scale-${scale.replace('.', '-')}`}
                  >
                    <span className="scale-number">{scale}</span>
                    <span className="scale-label">Scale</span>
                    {gradeScale === scale && (
                      <span className="scale-active-badge">Active</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Grade Points Table */}
              <div style={{ marginTop: 'var(--space-6)' }}>
                <p className="form-label" style={{ marginBottom: 'var(--space-3)' }}>
                  Grade Point Mapping ({gradeScale} Scale)
                </p>
                <div className="grade-grid">
                  {GRADE_SCALES[gradeScale].map((g) => (
                    <div key={g.label} className="grade-cell">
                      <span className="grade-label-chip">{g.label}</span>
                      <span className="grade-points">{g.points.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Data Management */}
          <Card>
            <CardBody>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>
                Data Management
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-5)' }}>
                All data is stored locally in your browser. You can clear it at any time.
              </p>

              {!confirmClear ? (
                <Button
                  variant="danger"
                  onClick={() => setConfirmClear(true)}
                  id="clear-data-btn"
                >
                  <Trash2 size={16} />
                  Clear All Data
                </Button>
              ) : (
                <div className="confirm-box">
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        Are you sure?
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        This will permanently delete all {rawSemesters.length} semester(s) and cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                    <Button variant="secondary" onClick={() => setConfirmClear(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleClear} id="confirm-clear-btn">
                      Yes, Delete Everything
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* App Info */}
          <Card>
            <CardBody>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', marginBottom: 'var(--space-4)' }}>
                About
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  ['App', 'CGPA Calculator'],
                  ['Version', '1.0.0'],
                  ['Tech', 'Next.js 14 + TypeScript'],
                  ['Storage', 'Browser localStorage'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .scale-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-5) var(--space-8);
          border-radius: var(--radius-lg);
          background: var(--bg-surface-2);
          border: 2px solid var(--border-subtle);
          cursor: pointer;
          transition: all var(--transition-fast);
          min-width: 120px;
        }
        .scale-card:hover {
          border-color: var(--border-default);
          background: var(--bg-surface-3);
        }
        .scale-card.active {
          background: rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .scale-number {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }
        .scale-card.active .scale-number { color: var(--accent-light); }
        .scale-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .scale-active-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--accent);
          color: white;
          font-size: 0.6rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .grade-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: var(--space-2);
        }
        .grade-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: var(--space-3);
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }
        .grade-label-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .grade-points {
          font-size: 0.75rem;
          color: var(--accent-light);
          font-weight: 600;
        }
        .confirm-box {
          background: var(--danger-bg);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: var(--radius-md);
          padding: var(--space-5);
        }
      `}</style>
    </>
  );
}
