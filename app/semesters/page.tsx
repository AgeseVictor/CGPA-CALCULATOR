'use client';
import { useCGPA } from '@/hooks/useCGPA';
import { Navbar } from '@/components/layout/Navbar';
import { SemesterList } from '@/components/semester/SemesterList';

export default function SemestersPage() {
  const {
    semesters,
    rawSemesters,
    gradeScale,
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
        pageTitle="Semesters"
      />
      <div className="page-inner">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', marginBottom: 'var(--space-2)' }}>
            Semester Manager
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Add semesters, enter your courses, credit hours, and grades. Your CGPA updates automatically.
          </p>
        </div>

        <SemesterList
          semesters={semesters}
          gradeScale={gradeScale}
          onAddSemester={addSemester}
          onRemoveSemester={removeSemester}
          onRenameSemester={updateSemesterName}
          onAddCourse={addCourse}
          onRemoveCourse={removeCourse}
          onUpdateCourse={updateCourse}
        />
      </div>
    </>
  );
}
