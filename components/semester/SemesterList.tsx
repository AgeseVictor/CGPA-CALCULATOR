'use client';
import { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import type { Course, Semester, GradeScale } from '@/lib/types';
import { SemesterCard } from './SemesterCard';
import { AddSemesterModal } from './AddSemesterModal';
import { Button } from '@/components/ui/Button';

interface SemesterListProps {
  semesters: Semester[];
  gradeScale: GradeScale;
  onAddSemester: (name: string) => void;
  onRemoveSemester: (semId: string) => void;
  onRenameSemester: (semId: string, name: string) => void;
  onAddCourse: (semId: string) => void;
  onRemoveCourse: (semId: string, courseId: string) => void;
  onUpdateCourse: (semId: string, courseId: string, updates: Partial<Course>) => void;
}

export function SemesterList({
  semesters,
  gradeScale,
  onAddSemester,
  onRemoveSemester,
  onRenameSemester,
  onAddCourse,
  onRemoveCourse,
  onUpdateCourse,
}: SemesterListProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="semester-list">
      {semesters.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-icon">
            <BookOpen size={40} />
          </div>
          <h3>No Semesters Yet</h3>
          <p>Add your first semester to begin tracking your CGPA.</p>
          <Button variant="primary" size="lg" onClick={() => setModalOpen(true)} id="add-first-semester">
            <Plus size={18} />
            Add First Semester
          </Button>
        </div>
      ) : (
        <>
          <div className="semester-items stagger">
            {semesters.map((sem, i) => (
              <SemesterCard
                key={sem.id}
                semester={sem}
                gradeScale={gradeScale}
                index={i}
                onRemove={() => onRemoveSemester(sem.id)}
                onRename={(name) => onRenameSemester(sem.id, name)}
                onAddCourse={() => onAddCourse(sem.id)}
                onRemoveCourse={(cId) => onRemoveCourse(sem.id, cId)}
                onUpdateCourse={(cId, u) => onUpdateCourse(sem.id, cId, u)}
              />
            ))}
          </div>

          <Button
            variant="secondary"
            className="add-sem-btn"
            onClick={() => setModalOpen(true)}
            id="add-semester-btn"
          >
            <Plus size={16} />
            Add Semester
          </Button>
        </>
      )}

      <AddSemesterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={onAddSemester}
        currentCount={semesters.length}
      />

      <style jsx>{`
        .semester-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .semester-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .empty-state {
          padding: var(--space-16);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
        }
        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-lg);
          background: rgba(99,102,241,0.1);
          border: 1px dashed rgba(99,102,241,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-light);
        }
        .empty-state h3 {
          font-size: 1.3rem;
          color: var(--text-primary);
        }
        .empty-state p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .add-sem-btn {
          align-self: flex-start;
        }
      `}</style>
    </div>
  );
}
