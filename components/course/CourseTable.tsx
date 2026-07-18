'use client';
import { Plus } from 'lucide-react';
import type { Course, Semester, GradeScale } from '@/lib/types';
import { CourseRow } from './CourseRow';
import { computeSemesterStats, formatGPA } from '@/lib/cgpa';

interface CourseTableProps {
  semester: Semester;
  gradeScale: GradeScale;
  onAddCourse: () => void;
  onRemoveCourse: (courseId: string) => void;
  onUpdateCourse: (courseId: string, updates: Partial<Course>) => void;
}

export function CourseTable({
  semester,
  gradeScale,
  onAddCourse,
  onRemoveCourse,
  onUpdateCourse,
}: CourseTableProps) {
  const stats = computeSemesterStats(semester, gradeScale);

  return (
    <div className="course-table-wrapper">
      <div className="table-scroll">
        <table className="data-table" aria-label={`Courses for ${semester.name}`}>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Course Name</th>
              <th style={{ width: '12%' }}>Credits</th>
              <th style={{ width: '18%' }}>Grade</th>
              <th style={{ width: '18%', textAlign: 'right' }}>Quality Pts</th>
              <th style={{ width: '12%', textAlign: 'center' }}>Del</th>
            </tr>
          </thead>
          <tbody>
            {semester.courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-row">
                  No courses yet. Click &quot;Add Course&quot; to get started.
                </td>
              </tr>
            ) : (
              semester.courses.map((course, i) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  gradeScale={gradeScale}
                  index={i}
                  onChange={(updates) => onUpdateCourse(course.id, updates)}
                  onRemove={() => onRemoveCourse(course.id)}
                />
              ))
            )}
          </tbody>
          {semester.courses.length > 0 && (
            <tfoot>
              <tr className="table-footer-row">
                <td className="footer-label">Semester Total</td>
                <td className="footer-value">{stats.totalCredits} cr</td>
                <td />
                <td className="footer-value" style={{ textAlign: 'right' }}>
                  {stats.qualityPoints.toFixed(2)}
                </td>
                <td />
              </tr>
              <tr className="table-gpa-row">
                <td colSpan={5}>
                  <div className="sem-gpa-display">
                    <span className="sem-gpa-label">Semester GPA</span>
                    <span className="sem-gpa-value">{formatGPA(stats.gpa)}</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Add Course row */}
      <div className="add-course-row">
        <button
          className="btn btn-ghost btn-sm"
          onClick={onAddCourse}
          aria-label={`Add course to ${semester.name}`}
          id={`add-course-${semester.id}`}
        >
          <Plus size={16} />
          Add Course
        </button>
      </div>

      <style jsx>{`
        .course-table-wrapper {
          overflow: hidden;
        }
        .table-scroll { overflow-x: auto; }
        .empty-row {
          text-align: center;
          padding: var(--space-8) !important;
          color: var(--text-muted) !important;
          font-size: 0.875rem;
        }
        .table-footer-row td {
          border-top: 1px solid var(--border-subtle) !important;
          border-bottom: none !important;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary) !important;
          padding: var(--space-2) var(--space-4);
        }
        .footer-label { color: var(--text-muted) !important; }
        .footer-value { font-family: 'JetBrains Mono', monospace; }
        .table-gpa-row td { border-bottom: none !important; padding: 0 var(--space-4) var(--space-3); }
        .sem-gpa-display {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--space-3);
        }
        .sem-gpa-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }
        .sem-gpa-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--accent-light);
        }
        .add-course-row {
          padding: var(--space-3) var(--space-4);
          border-top: 1px dashed var(--border-subtle);
        }
      `}</style>
    </div>
  );
}
