'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Edit2, Check, X } from 'lucide-react';
import type { Course, Semester, GradeScale } from '@/lib/types';
import { CourseTable } from '@/components/course/CourseTable';
import { Badge } from '@/components/ui/Badge';
import { formatGPA } from '@/lib/cgpa';
import { getGPAClass, getGPAColor } from '@/lib/gradeScales';

interface SemesterCardProps {
  semester: Semester;
  gradeScale: GradeScale;
  index: number;
  onRemove: () => void;
  onRename: (name: string) => void;
  onAddCourse: () => void;
  onRemoveCourse: (courseId: string) => void;
  onUpdateCourse: (courseId: string, updates: Partial<Course>) => void;
}

export function SemesterCard({
  semester,
  gradeScale,
  index,
  onRemove,
  onRename,
  onAddCourse,
  onRemoveCourse,
  onUpdateCourse,
}: SemesterCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(semester.name);

  const gpa = semester.gpa ?? 0;
  const gpaColor = getGPAColor(gpa, gradeScale);
  const gpaClass = getGPAClass(gpa, gradeScale);
  const badgeVariant = gpaClass === 'First Class' ? 'success' : gpaClass === 'Second Class Upper' ? 'accent' : gpaClass === 'Second Class Lower' ? 'warning' : 'danger';

  const handleSaveName = () => {
    if (draftName.trim()) onRename(draftName.trim());
    setEditing(false);
  };

  return (
    <div
      className="semester-card glass-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card Header */}
      <div className="sem-header">
        <div className="sem-header-left">
          <div className="sem-number">{index + 1}</div>

          {editing ? (
            <div className="sem-rename-row">
              <input
                className="form-input sem-rename-input"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditing(false); }}
                autoFocus
                aria-label="Rename semester"
              />
              <button className="btn btn-primary btn-icon" onClick={handleSaveName} aria-label="Save name">
                <Check size={14} />
              </button>
              <button className="btn btn-ghost btn-icon" onClick={() => setEditing(false)} aria-label="Cancel rename">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="sem-title-group">
              <h3 className="sem-title">{semester.name}</h3>
              <button
                className="btn btn-ghost btn-icon btn-sm edit-btn"
                onClick={() => { setDraftName(semester.name); setEditing(true); }}
                aria-label="Rename semester"
                title="Rename"
              >
                <Edit2 size={13} />
              </button>
            </div>
          )}
        </div>

        <div className="sem-header-right">
          {gpa > 0 && (
            <>
              <div className="sem-gpa-pill" style={{ color: gpaColor, borderColor: `${gpaColor}30`, background: `${gpaColor}10` }}>
                <span className="sem-gpa-num">{formatGPA(gpa)}</span>
                <span className="sem-gpa-tag">GPA</span>
              </div>
              <Badge variant={badgeVariant}>{gpaClass.replace('Class ', '')}</Badge>
            </>
          )}
          <span className="sem-credit-chip">
            {semester.totalCredits ?? 0} cr
          </span>
          <button
            className="btn btn-danger btn-icon btn-sm"
            onClick={onRemove}
            aria-label={`Delete ${semester.name}`}
            title="Delete semester"
          >
            <Trash2 size={14} />
          </button>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand semester' : 'Collapse semester'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {/* Course Table */}
      {!collapsed && (
        <div className="sem-body">
          <div className="divider" style={{ margin: 0 }} />
          <CourseTable
            semester={semester}
            gradeScale={gradeScale}
            onAddCourse={onAddCourse}
            onRemoveCourse={onRemoveCourse}
            onUpdateCourse={onUpdateCourse}
          />
        </div>
      )}

      <style jsx>{`
        .semester-card {
          animation: fadeInUp 0.4s forwards;
          opacity: 0;
          overflow: hidden;
        }
        .sem-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          padding: var(--space-4) var(--space-5);
          flex-wrap: wrap;
        }
        .sem-header-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          min-width: 0;
        }
        .sem-number {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: var(--grad-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        .sem-title-group {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .sem-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 260px;
        }
        .edit-btn { opacity: 0; transition: opacity var(--transition-fast); }
        .sem-title-group:hover .edit-btn { opacity: 1; }
        .sem-rename-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .sem-rename-input {
          max-width: 240px;
          padding: var(--space-2) var(--space-3);
          font-size: 0.9rem;
        }
        .sem-header-right {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
        }
        .sem-gpa-pill {
          display: flex;
          align-items: baseline;
          gap: 4px;
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
          border: 1px solid;
          font-weight: 700;
        }
        .sem-gpa-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1rem;
        }
        .sem-gpa-tag {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .sem-credit-chip {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: 2px 10px;
        }
        .sem-body {
          animation: fadeIn 0.2s forwards;
        }
      `}</style>
    </div>
  );
}
