'use client';
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Semester, Course, GradeScale } from '@/lib/types';
import { computeCGPA, enrichSemesters, computeRunningCGPA } from '@/lib/cgpa';

// Simple uuid fallback without external dep
function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

const DEFAULT_SEMESTERS: Semester[] = [];
const DEFAULT_SCALE: GradeScale = '4.0';

export function useCGPA() {
  const [semesters, setSemesters, isLoaded] = useLocalStorage<Semester[]>(
    'cgpa_semesters',
    DEFAULT_SEMESTERS
  );
  const [gradeScale, setGradeScale] = useLocalStorage<GradeScale>(
    'cgpa_scale',
    DEFAULT_SCALE
  );

  const enriched = enrichSemesters(semesters, gradeScale);
  const { cgpa, totalCredits, totalQualityPoints } = computeCGPA(semesters, gradeScale);
  const trendData = computeRunningCGPA(semesters, gradeScale);

  // ── Semester actions ─────────────────────────────────────────────────
  const addSemester = useCallback(
    (name: string) => {
      const newSem: Semester = { id: generateId(), name, courses: [] };
      setSemesters((prev) => [...prev, newSem]);
    },
    [setSemesters]
  );

  const removeSemester = useCallback(
    (semId: string) => {
      setSemesters((prev) => prev.filter((s) => s.id !== semId));
    },
    [setSemesters]
  );

  const updateSemesterName = useCallback(
    (semId: string, name: string) => {
      setSemesters((prev) =>
        prev.map((s) => (s.id === semId ? { ...s, name } : s))
      );
    },
    [setSemesters]
  );

  // ── Course actions ────────────────────────────────────────────────────
  const addCourse = useCallback(
    (semId: string) => {
      const newCourse: Course = {
        id: generateId(),
        name: '',
        creditHours: 3,
        grade: '',
      };
      setSemesters((prev) =>
        prev.map((s) =>
          s.id === semId ? { ...s, courses: [...s.courses, newCourse] } : s
        )
      );
    },
    [setSemesters]
  );

  const removeCourse = useCallback(
    (semId: string, courseId: string) => {
      setSemesters((prev) =>
        prev.map((s) =>
          s.id === semId
            ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) }
            : s
        )
      );
    },
    [setSemesters]
  );

  const updateCourse = useCallback(
    (semId: string, courseId: string, updates: Partial<Course>) => {
      setSemesters((prev) =>
        prev.map((s) =>
          s.id === semId
            ? {
                ...s,
                courses: s.courses.map((c) =>
                  c.id === courseId ? { ...c, ...updates } : c
                ),
              }
            : s
        )
      );
    },
    [setSemesters]
  );

  const clearAll = useCallback(() => {
    setSemesters([]);
  }, [setSemesters]);

  return {
    semesters: enriched,
    rawSemesters: semesters,
    gradeScale,
    setGradeScale,
    cgpa,
    totalCredits,
    totalQualityPoints,
    trendData,
    isLoaded,
    addSemester,
    removeSemester,
    updateSemesterName,
    addCourse,
    removeCourse,
    updateCourse,
    clearAll,
  };
}
