// ──────────────────────────────────────────────
// CGPA Calculation Logic
// ──────────────────────────────────────────────
import type { Semester, SemesterStats, GradeScale } from './types';
import { getGradePoints } from './gradeScales';

export const computeSemesterStats = (
  semester: Semester,
  scale: GradeScale
): SemesterStats => {
  let totalCredits = 0;
  let qualityPoints = 0;

  for (const course of semester.courses) {
    if (!course.grade || course.creditHours <= 0) continue;
    const points = getGradePoints(course.grade, scale);
    totalCredits += course.creditHours;
    qualityPoints += points * course.creditHours;
  }

  const gpa = totalCredits > 0 ? qualityPoints / totalCredits : 0;
  return { gpa, totalCredits, qualityPoints };
};

export const computeCGPA = (
  semesters: Semester[],
  scale: GradeScale
): { cgpa: number; totalCredits: number; totalQualityPoints: number } => {
  let totalCredits = 0;
  let totalQualityPoints = 0;

  for (const semester of semesters) {
    const stats = computeSemesterStats(semester, scale);
    totalCredits += stats.totalCredits;
    totalQualityPoints += stats.qualityPoints;
  }

  const cgpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
  return { cgpa, totalCredits, totalQualityPoints };
};

export const enrichSemesters = (
  semesters: Semester[],
  scale: GradeScale
): Semester[] => {
  return semesters.map((sem) => {
    const stats = computeSemesterStats(sem, scale);
    return {
      ...sem,
      gpa: parseFloat(stats.gpa.toFixed(2)),
      totalCredits: stats.totalCredits,
    };
  });
};

export const formatGPA = (gpa: number): string => {
  return gpa.toFixed(2);
};

/** Compute running cumulative GPA per semester for the trend chart */
export const computeRunningCGPA = (
  semesters: Semester[],
  scale: GradeScale
): { name: string; gpa: number; cgpa: number }[] => {
  let cumulativeCredits = 0;
  let cumulativeQP = 0;

  return semesters.map((sem) => {
    const stats = computeSemesterStats(sem, scale);
    cumulativeCredits += stats.totalCredits;
    cumulativeQP += stats.qualityPoints;
    const runningCGPA = cumulativeCredits > 0 ? cumulativeQP / cumulativeCredits : 0;
    return {
      name: sem.name,
      gpa: parseFloat(stats.gpa.toFixed(2)),
      cgpa: parseFloat(runningCGPA.toFixed(2)),
    };
  });
};
