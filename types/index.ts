export interface Course {
  id: string;
  code: string;
  units: number;
  grade: string; // "A", "B", "C", etc.
  score?: string; // numeric score optional
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

export type GradingScale = "4.0" | "5.0";

export interface GradePointMap {
  [grade: string]: number;
}

export interface StudentProfile {
  faculty: string;
  department: string;
  level: string;
  matricNumber: string;
  graduationYear: string;
  targetClass: string;
  carryoverCourses: number;
  probationStatus: string;
}

