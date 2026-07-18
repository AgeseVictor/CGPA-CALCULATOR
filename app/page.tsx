'use client';
import { useCGPA } from '@/hooks/useCGPA';
import { Navbar } from '@/components/layout/Navbar';
import { GPAHero } from '@/components/dashboard/GPAHero';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { GPATrendChart } from '@/components/dashboard/GPATrendChart';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, TrendingUp, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const {
    semesters,
    rawSemesters,
    gradeScale,
    setGradeScale,
    cgpa,
    totalCredits,
    trendData,
    isLoaded,
    addSemester,
    removeSemester,
    updateSemesterName,
    addCourse,
    removeCourse,
    updateCourse,
  } = useCGPA();

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar
        semesters={rawSemesters}
        gradeScale={gradeScale}
        pageTitle="Dashboard"
        onImport={(sems, scale) => {
          // Re-hydrate from import — update all semesters
          sems.forEach((s) => addSemester(s.name));
        }}
      />

      <div className="page-inner">
        <div className="dashboard-layout">

          {/* GPA Hero */}
          <GPAHero
            cgpa={cgpa}
            gradeScale={gradeScale}
            totalCredits={totalCredits}
            semesterCount={semesters.length}
          />

          {/* Stats Grid */}
          <StatsGrid
            semesters={semesters}
            gradeScale={gradeScale}
            cgpa={cgpa}
          />

          {/* Chart + Quick Actions */}
          <div className="dashboard-row">
            {/* Trend Chart */}
            <Card className="chart-card" style={{ flex: 2, minWidth: 0 }}>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <TrendingUp size={18} style={{ color: 'var(--accent-light)' }} />
                  <h2 style={{ fontSize: '1rem', fontFamily: 'Outfit, sans-serif' }}>GPA Trend</h2>
                </div>
              </CardHeader>
              <CardBody>
                <GPATrendChart data={trendData} gradeScale={gradeScale} />
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card className="actions-card" style={{ flex: 1, minWidth: '240px' }}>
              <CardBody>
                <h3 style={{ marginBottom: 'var(--space-4)', fontFamily: 'Outfit, sans-serif', fontSize: '1rem' }}>
                  Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <Link href="/semesters" style={{ textDecoration: 'none' }}>
                    <Button variant="primary" className="w-full" id="go-to-semesters">
                      <BookOpen size={16} />
                      Manage Semesters
                      <ArrowRight size={14} style={{ marginLeft: 'auto' }} />
                    </Button>
                  </Link>
                  <Link href="/transcript" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" className="w-full" id="go-to-transcript">
                      View Transcript
                      <ArrowRight size={14} style={{ marginLeft: 'auto' }} />
                    </Button>
                  </Link>
                  <Link href="/settings" style={{ textDecoration: 'none' }}>
                    <Button variant="ghost" className="w-full" id="go-to-settings">
                      Grade Scale Settings
                      <ArrowRight size={14} style={{ marginLeft: 'auto' }} />
                    </Button>
                  </Link>
                </div>

                {/* Scale selector */}
                <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                  <p className="form-label">Grade Scale</p>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {(['4.0', '5.0'] as const).map((s) => (
                      <button
                        key={s}
                        className={`scale-btn ${gradeScale === s ? 'active' : ''}`}
                        onClick={() => setGradeScale(s)}
                        aria-pressed={gradeScale === s}
                        id={`scale-${s.replace('.', '-')}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .dashboard-row {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .scale-btn {
          flex: 1;
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 600;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          transition: all var(--transition-fast);
          cursor: pointer;
        }
        .scale-btn:hover {
          border-color: var(--border-muted);
          color: var(--text-primary);
        }
        .scale-btn.active {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.4);
          color: var(--accent-light);
        }
      `}</style>
    </>
  );
}
