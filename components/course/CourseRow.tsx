'use client';
import { Trash2 } from 'lucide-react';
import type { Course, GradeScale } from '@/lib/types';
import { GRADE_SCALES } from '@/lib/gradeScales';

interface CourseRowProps {
  course: Course;
  gradeScale: GradeScale;
  onChange: (updates: Partial<Course>) => void;
  onRemove: () => void;
  index: number;
}

export function CourseRow({ course, gradeScale, onChange, onRemove, index }: CourseRowProps) {
  const gradeOptions = GRADE_SCALES[gradeScale];

  return (
    <tr className="course-row" style={{ animationDelay: `${index * 40}ms` }}>
      {/* Course Name */}
      <td>
        <input
          className="form-input course-input"
          type="text"
          placeholder="e.g. Calculus I"
          value={course.name}
          onChange={(e) => onChange({ name: e.target.value })}
          aria-label={`Course name for row ${index + 1}`}
        />
      </td>

      {/* Credit Hours */}
      <td>
        <input
          className="form-input course-input credit-input"
          type="number"
          min={1}
          max={12}
          value={course.creditHours}
          onChange={(e) => onChange({ creditHours: Math.max(1, parseInt(e.target.value) || 1) })}
          aria-label={`Credit hours for row ${index + 1}`}
        />
      </td>

      {/* Grade */}
      <td>
        <select
          className="form-input form-select course-input grade-select"
          value={course.grade}
          onChange={(e) => onChange({ grade: e.target.value })}
          aria-label={`Grade for row ${index + 1}`}
        >
          <option value="">Grade</option>
          {gradeOptions.map((g) => (
            <option key={g.label} value={g.label}>
              {g.label} ({g.points.toFixed(1)})
            </option>
          ))}
        </select>
      </td>

      {/* Quality Points */}
      <td className="qp-cell">
        {course.grade && course.creditHours > 0 ? (
          <span className="qp-value">
            {(
              (gradeOptions.find((g) => g.label === course.grade)?.points ?? 0) *
              course.creditHours
            ).toFixed(2)}
          </span>
        ) : (
          <span className="qp-empty">—</span>
        )}
      </td>

      {/* Remove */}
      <td className="action-cell">
        <button
          className="btn btn-danger btn-icon"
          onClick={onRemove}
          aria-label={`Remove course row ${index + 1}`}
          title="Remove course"
        >
          <Trash2 size={14} />
        </button>
      </td>

      <style jsx>{`
        .course-row {
          animation: fadeIn 0.25s both;
        }
        .course-input {
          padding: var(--space-2) var(--space-3);
          font-size: 0.875rem;
          background: transparent;
          border-color: transparent;
        }
        .course-input:hover, .course-input:focus {
          background: var(--bg-surface-2);
          border-color: var(--border-focus);
        }
        .credit-input { width: 72px; text-align: center; }
        .grade-select { width: 110px; padding-right: 32px; }
        .qp-cell { text-align: right; }
        .qp-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          color: var(--accent-light);
          font-weight: 500;
        }
        .qp-empty { color: var(--text-faint); font-size: 0.875rem; }
        .action-cell { text-align: center; width: 48px; }
      `}</style>
    </tr>
  );
}
