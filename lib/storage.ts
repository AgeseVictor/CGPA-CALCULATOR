// ──────────────────────────────────────────────
// localStorage helpers for CGPA Calculator
// ──────────────────────────────────────────────
import type { Semester, GradeScale } from './types';

const STORAGE_KEY = 'cgpa_calculator_data';

export interface PersistedData {
  semesters: Semester[];
  gradeScale: GradeScale;
  lastUpdated: string;
}

export const saveData = (semesters: Semester[], gradeScale: GradeScale): void => {
  if (typeof window === 'undefined') return;
  const data: PersistedData = {
    semesters,
    gradeScale,
    lastUpdated: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save data to localStorage', e);
  }
};

export const loadData = (): PersistedData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedData;
  } catch {
    return null;
  }
};

export const clearData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

export const exportJSON = (semesters: Semester[], gradeScale: GradeScale): void => {
  const data: PersistedData = {
    semesters,
    gradeScale,
    lastUpdated: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cgpa-data-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importJSON = (file: File): Promise<PersistedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as PersistedData;
        resolve(data);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
