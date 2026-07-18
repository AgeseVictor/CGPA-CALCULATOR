'use client';
import { useEffect, useRef, useState } from 'react';
import { formatGPA } from '@/lib/cgpa';
import { getGPAClass, getGPAColor } from '@/lib/gradeScales';
import type { GradeScale } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Award, TrendingUp } from 'lucide-react';

interface GPAHeroProps {
  cgpa: number;
  gradeScale: GradeScale;
  totalCredits: number;
  semesterCount: number;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((ease * target).toFixed(2)));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

export function GPAHero({ cgpa, gradeScale, totalCredits, semesterCount }: GPAHeroProps) {
  const animatedGPA = useCountUp(cgpa);
  const gpaClass = getGPAClass(cgpa, gradeScale);
  const gpaColor = getGPAColor(cgpa, gradeScale);
  const maxScale = parseFloat(gradeScale);

  const badgeVariant =
    gpaClass === 'First Class' ? 'success' :
    gpaClass === 'Second Class Upper' ? 'accent' :
    gpaClass === 'Second Class Lower' ? 'warning' : 'danger';

  return (
    <div className="gpa-hero">
      {/* Decorative orbs */}
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-icon-wrapper" aria-hidden="true">
          <Award size={28} />
        </div>

        <p className="hero-label">Cumulative GPA</p>

        <div className="hero-gpa-display" style={{ color: gpaColor }}>
          <span className="gpa-value" aria-label={`CGPA: ${formatGPA(cgpa)} out of ${gradeScale}`}>
            {formatGPA(animatedGPA)}
          </span>
          <span className="gpa-scale">/ {gradeScale}</span>
        </div>

        {/* GPA progress bar */}
        <div className="gpa-progress-track" aria-hidden="true">
          <div
            className="gpa-progress-fill"
            style={{
              width: `${(cgpa / maxScale) * 100}%`,
              background: gpaColor,
            }}
          />
        </div>

        <Badge variant={badgeVariant} className="hero-badge">{gpaClass}</Badge>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">{totalCredits}</span>
            <span className="hero-stat-label">Total Credits</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">{semesterCount}</span>
            <span className="hero-stat-label">Semesters</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">{gradeScale}</span>
            <span className="hero-stat-label">Scale</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gpa-hero {
          position: relative;
          background: var(--grad-hero);
          border-radius: var(--radius-xl);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: var(--space-12) var(--space-8);
          text-align: center;
          overflow: hidden;
          box-shadow: var(--shadow-xl), var(--shadow-glow);
          animation: fadeInUp 0.5s forwards;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .hero-orb-1 {
          width: 300px; height: 300px;
          background: rgba(99, 102, 241, 0.2);
          top: -100px; left: -80px;
        }
        .hero-orb-2 {
          width: 250px; height: 250px;
          background: rgba(139, 92, 246, 0.15);
          bottom: -80px; right: -60px;
        }
        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
        }
        .hero-icon-wrapper {
          width: 56px; height: 56px;
          border-radius: var(--radius-lg);
          background: rgba(99,102,241,0.2);
          border: 1px solid rgba(99,102,241,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-light);
        }
        .hero-label {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent-light);
          opacity: 0.8;
        }
        .hero-gpa-display {
          display: flex;
          align-items: baseline;
          gap: var(--space-2);
          line-height: 1;
        }
        .gpa-value {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(4rem, 10vw, 7rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          filter: drop-shadow(0 0 30px currentColor);
        }
        .gpa-scale {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.2rem, 3vw, 2rem);
          font-weight: 500;
          color: var(--text-muted);
        }
        .gpa-progress-track {
          width: 100%;
          max-width: 400px;
          height: 6px;
          background: rgba(255,255,255,0.08);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .gpa-progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 12px currentColor;
        }
        .hero-badge {
          font-size: 0.8rem;
          padding: var(--space-2) var(--space-4);
        }
        .hero-stats {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          margin-top: var(--space-2);
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .hero-stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .hero-stat-label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .hero-stat-divider {
          width: 1px;
          height: 32px;
          background: var(--border-subtle);
        }
      `}</style>
    </div>
  );
}
