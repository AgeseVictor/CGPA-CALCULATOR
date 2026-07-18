'use client';
import { BookOpen, BarChart2, TrendingUp, Star } from 'lucide-react';
import type { Semester, GradeScale } from '@/lib/types';
import { computeSemesterStats, formatGPA } from '@/lib/cgpa';
import { getGPAColor } from '@/lib/gradeScales';

interface StatsGridProps {
  semesters: Semester[];
  gradeScale: GradeScale;
  cgpa: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  delay?: number;
}

function StatCard({ icon, label, value, sub, color, delay = 0 }: StatCardProps) {
  return (
    <div
      className="stat-card glass-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-icon" style={{ color, background: color ? `${color}18` : undefined }}>
        {icon}
      </div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <p className="stat-value" style={{ color }}>
          {value}
        </p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>

      <style jsx>{`
        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-5) var(--space-6);
          animation: fadeInUp 0.4s forwards;
          opacity: 0;
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--accent-light);
          background: rgba(99,102,241,0.12);
        }
        .stat-label {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: var(--space-1);
        }
        .stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }
        .stat-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}

export function StatsGrid({ semesters, gradeScale, cgpa }: StatsGridProps) {
  const totalCourses = semesters.reduce((sum, s) => sum + s.courses.length, 0);
  const totalCredits = semesters.reduce((sum, s) => sum + (s.totalCredits ?? 0), 0);

  // Best semester
  let bestGPA = 0;
  let bestSemName = '—';
  for (const sem of semesters) {
    const stats = computeSemesterStats(sem, gradeScale);
    if (stats.gpa > bestGPA) { bestGPA = stats.gpa; bestSemName = sem.name; }
  }

  const gpaColor = getGPAColor(cgpa, gradeScale);

  return (
    <div className="stats-grid">
      <StatCard
        icon={<BookOpen size={22} />}
        label="Semesters"
        value={semesters.length}
        sub={`${totalCourses} total courses`}
        delay={50}
      />
      <StatCard
        icon={<BarChart2 size={22} />}
        label="Credit Hours"
        value={totalCredits}
        sub="Earned credits"
        color="var(--success)"
        delay={100}
      />
      <StatCard
        icon={<TrendingUp size={22} />}
        label="Current CGPA"
        value={formatGPA(cgpa)}
        sub={`Scale: ${gradeScale}`}
        color={gpaColor}
        delay={150}
      />
      <StatCard
        icon={<Star size={22} />}
        label="Best Semester"
        value={formatGPA(bestGPA)}
        sub={bestSemName}
        color="var(--warning)"
        delay={200}
      />

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--space-4);
        }
      `}</style>
    </div>
  );
}
