// ──────────────────────────────────────────────
// Grade Scales — 4.0 and 5.0 systems
// ──────────────────────────────────────────────
import type { GradeOption, GradeScale } from './types';

export const GRADE_SCALES: Record<GradeScale, GradeOption[]> = {
  '4.0': [
    { label: 'A',  points: 4.0 },
    { label: 'A-', points: 3.7 },
    { label: 'B+', points: 3.3 },
    { label: 'B',  points: 3.0 },
    { label: 'B-', points: 2.7 },
    { label: 'C+', points: 2.3 },
    { label: 'C',  points: 2.0 },
    { label: 'C-', points: 1.7 },
    { label: 'D+', points: 1.3 },
    { label: 'D',  points: 1.0 },
    { label: 'F',  points: 0.0 },
  ],
  '5.0': [
    { label: 'A',  points: 5.0 },
    { label: 'B',  points: 4.0 },
    { label: 'C',  points: 3.0 },
    { label: 'D',  points: 2.0 },
    { label: 'E',  points: 1.0 },
    { label: 'F',  points: 0.0 },
  ],
};

export const getGradePoints = (grade: string, scale: GradeScale): number => {
  const option = GRADE_SCALES[scale].find((g) => g.label === grade);
  return option ? option.points : 0;
};

export const getGPAClass = (gpa: number, scale: GradeScale): string => {
  const max = parseFloat(scale);
  const ratio = gpa / max;
  if (ratio >= 0.9) return 'First Class';
  if (ratio >= 0.7) return 'Second Class Upper';
  if (ratio >= 0.5) return 'Second Class Lower';
  if (ratio >= 0.4) return 'Third Class';
  return 'Fail';
};

export const getGPAColor = (gpa: number, scale: GradeScale): string => {
  const max = parseFloat(scale);
  const ratio = gpa / max;
  if (ratio >= 0.9) return 'var(--color-success)';
  if (ratio >= 0.7) return 'var(--color-accent)';
  if (ratio >= 0.5) return 'var(--color-warning)';
  return 'var(--color-danger)';
};
