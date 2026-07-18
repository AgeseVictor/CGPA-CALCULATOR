'use client';
import { useCGPA } from '@/hooks/useCGPA';
import { Navbar } from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { computeSemesterStats, formatGPA } from '@/lib/cgpa';
import { getGPAClass, getGPAColor, getGradePoints } from '@/lib/gradeScales';
import { Printer, GraduationCap } from 'lucide-react';

export default function TranscriptPage() {
  const { semesters, rawSemesters, gradeScale, cgpa, totalCredits, isLoaded } = useCGPA();

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  let runningCredits = 0;
  let runningQP = 0;

  const gpaClass = getGPAClass(cgpa, gradeScale);
  const gpaColor = getGPAColor(cgpa, gradeScale);
  const badgeVariant = gpaClass === 'First Class' ? 'success' : gpaClass === 'Second Class Upper' ? 'accent' : gpaClass === 'Second Class Lower' ? 'warning' : 'danger';

  return (
    <>
      <Navbar semesters={rawSemesters} gradeScale={gradeScale} pageTitle="Transcript" />

      <div className="page-inner">
        {/* Print Header (visible only in print) */}
        <div className="print-header" style={{ display: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
            <GraduationCap size={32} />
            <div>
              <h1 style={{ fontSize: '1.5rem' }}>Academic Transcript</h1>
              <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Generated {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="transcript-actions no-print">
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', marginBottom: 'var(--space-2)' }}>
              Academic Transcript
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Full record of all your semesters and cumulative CGPA.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => window.print()}
            id="print-transcript"
            className="print-btn"
          >
            <Printer size={16} />
            Print / Save PDF
          </Button>
        </div>

        {/* Summary Banner */}
        <div className="transcript-summary glass-card">
          <div className="summary-item">
            <span className="summary-label">CGPA</span>
            <span className="summary-value gpa-display" style={{ color: gpaColor }}>
              {formatGPA(cgpa)}
            </span>
            <span className="summary-sub">/ {gradeScale}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-item">
            <span className="summary-label">Total Credits</span>
            <span className="summary-value">{totalCredits}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-item">
            <span className="summary-label">Semesters</span>
            <span className="summary-value">{semesters.length}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-item">
            <span className="summary-label">Classification</span>
            <Badge variant={badgeVariant}>{gpaClass}</Badge>
          </div>
        </div>

        {/* Per-semester breakdowns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {semesters.map((sem, i) => {
            const stats = computeSemesterStats(sem, gradeScale);
            runningCredits += stats.totalCredits;
            runningQP += stats.qualityPoints;
            const runningCGPA = runningCredits > 0 ? runningQP / runningCredits : 0;
            const semGPAColor = getGPAColor(stats.gpa, gradeScale);

            return (
              <div key={sem.id} className="semester-card glass-card">
                {/* Semester Header */}
                <div className="sem-transcript-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div className="sem-index">{i + 1}</div>
                    <h2 style={{ fontSize: '1.05rem', fontFamily: 'Outfit, sans-serif' }}>{sem.name}</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div className="sem-stat">
                      <span className="sem-stat-label">Sem GPA</span>
                      <span className="sem-stat-value" style={{ color: semGPAColor }}>{formatGPA(stats.gpa)}</span>
                    </div>
                    <div className="sem-stat">
                      <span className="sem-stat-label">Cum GPA</span>
                      <span className="sem-stat-value" style={{ color: 'var(--accent-light)' }}>{formatGPA(runningCGPA)}</span>
                    </div>
                    <div className="sem-stat">
                      <span className="sem-stat-label">Credits</span>
                      <span className="sem-stat-value">{stats.totalCredits}</span>
                    </div>
                  </div>
                </div>

                {/* Course List */}
                <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th style={{ width: '90px' }}>Credits</th>
                        <th style={{ width: '80px' }}>Grade</th>
                        <th style={{ width: '100px', textAlign: 'right' }}>Quality Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sem.courses.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-6)' }}>No courses</td></tr>
                      ) : sem.courses.map((course) => (
                        <tr key={course.id}>
                          <td>{course.name || <em style={{ color: 'var(--text-faint)' }}>Unnamed</em>}</td>
                          <td>{course.creditHours}</td>
                          <td><Badge variant="accent">{course.grade || '—'}</Badge></td>
                          <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>
                            {course.grade
                              ? (getGradePoints(course.grade, gradeScale) * course.creditHours).toFixed(2)
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {semesters.length === 0 && (
            <div className="glass-card" style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--text-muted)' }}>
              No semesters to display. Add semesters on the Semesters page.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .transcript-actions {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }
        .transcript-summary {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: var(--space-6);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
          gap: var(--space-4);
        }
        .summary-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          text-align: center;
        }
        .summary-label {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }
        .summary-value {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }
        .summary-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .summary-divider {
          width: 1px;
          height: 48px;
          background: var(--border-subtle);
          align-self: center;
        }
        .sem-transcript-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-5);
          flex-wrap: wrap;
          gap: var(--space-4);
        }
        .sem-index {
          width: 28px; height: 28px;
          border-radius: var(--radius-sm);
          background: var(--grad-accent);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700; color: white;
          font-family: 'JetBrains Mono', monospace;
          flex-shrink: 0;
        }
        .sem-stat { text-align: center; }
        .sem-stat-label {
          display: block; font-size: 0.65rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--text-muted); margin-bottom: 2px;
        }
        .sem-stat-value {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 1rem; font-weight: 700;
          color: var(--text-primary);
        }
        @media print {
          .print-header { display: flex !important; }
        }
      `}</style>
    </>
  );
}
