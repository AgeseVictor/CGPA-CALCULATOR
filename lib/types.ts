// ──────────────────────────────────────────────
// Shared TypeScript Types for CGPA Calculator
// ──────────────────────────────────────────────

export type GradeScale = '4.0' | '5.0';

export interface GradeOption {
  label: string;   // e.g. "A", "B+", "F"
  points: number;  // grade point on the selected scale
}

export interface Course {
  id: string;
  name: string;
  creditHours: number;
  grade: string;   // key like "A", "B+", etc.
}

export interface Semester {
  id: string;
  name: string;         // e.g. "Year 1, Semester 1"
  courses: Course[];
  gpa?: number;         // computed
  totalCredits?: number; // computed
}

export interface CGPAState {
  semesters: Semester[];
  gradeScale: GradeScale;
  cgpa: number;
  totalCredits: number;
  totalQualityPoints: number;
}

export interface SemesterStats {
  gpa: number;
  totalCredits: number;
  qualityPoints: number;
}
