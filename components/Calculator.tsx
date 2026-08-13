import React, { useState, useEffect } from 'react';
import { Plus, RotateCcw, Save, Trash2, Check, Scale } from 'lucide-react';
import { Semester, GradingScale, Course } from '@/types';
import { calculateCGPA, calculateTargetGPA } from '@/lib/calculations';
import StatsDashboard from './StatsDashboard';
import SemesterCard from './SemesterCard';

const STORAGE_KEY = 'cgpa_store_semesters';
const SCALE_KEY = 'cgpa_store_scale';

export default function Calculator() {
  const [scale, setScale] = useState<GradingScale>('5.0');
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [targetCGPA, setTargetCGPA] = useState<string>('');
  const [remainingUnits, setRemainingUnits] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  // Load initial state
  useEffect(() => {
    const savedSemesters = localStorage.getItem(STORAGE_KEY);
    const savedScale = localStorage.getItem(SCALE_KEY);

    if (savedScale) {
      setScale(savedScale as GradingScale);
    }

    if (savedSemesters) {
      try {
        setSemesters(JSON.parse(savedSemesters));
      } catch (e) {
        initializeDefault();
      }
    } else {
      initializeDefault();
    }
  }, []);

  const initializeDefault = () => {
    const defaultCourses: Course[] = [
      { id: '1', code: 'MTH 101', units: 3, grade: 'A' },
      { id: '2', code: 'CHM 101', units: 3, grade: 'B' },
      { id: '3', code: 'PHY 101', units: 3, grade: 'C' },
    ];
    setSemesters([
      { id: 'sem_1', name: 'Year 1 · 1st Semester', courses: defaultCourses },
    ]);
  };

  const handleUpdateSemester = (semesterId: string, updatedSemester: Semester) => {
    setSemesters((prev) =>
      prev.map((sem) => (sem.id === semesterId ? updatedSemester : sem))
    );
  };

  const handleDeleteSemester = (semesterId: string) => {
    setSemesters((prev) => prev.filter((sem) => sem.id !== semesterId));
  };

  const handleAddSemester = () => {
    const semNum = semesters.length + 1;
    const year = Math.ceil(semNum / 2);
    const semIndex = semNum % 2 === 1 ? '1st' : '2nd';
    const newSemester: Semester = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Year ${year} · ${semIndex} Semester`,
      courses: [
        { id: Math.random().toString(36).substr(2, 9), code: '', units: 3, grade: 'A' },
      ],
    };
    setSemesters((prev) => [...prev, newSemester]);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters));
    localStorage.setItem(SCALE_KEY, scale);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all semesters and courses? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      initializeDefault();
      setTargetCGPA('');
      setRemainingUnits('');
    }
  };

  // Switch Scale
  const handleScaleChange = (newScale: GradingScale) => {
    setScale(newScale);
    localStorage.setItem(SCALE_KEY, newScale);
  };

  // Stats calculation
  const { cgpa: currentCGPA, totalUnits } = calculateCGPA(semesters, scale);

  const reqTarget = parseFloat(targetCGPA) || 0;
  const reqRemaining = parseFloat(remainingUnits) || 0;
  const requiredGPA = calculateTargetGPA(currentCGPA, totalUnits, reqTarget, reqRemaining);

  return (
    <div id="calculator" className="scroll-mt-20">
      {/* Configuration Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-3">
          <Scale className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Select Grading Scale:</span>
          <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => handleScaleChange('5.0')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scale === '5.0' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'
              }`}
            >
              5.0 Scale
            </button>
            <button
              onClick={() => handleScaleChange('4.0')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scale === '4.0' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'
              }`}
            >
              4.0 Scale
            </button>
          </div>
        </div>

        {/* Global Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-colors shadow-sm"
          >
            {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {isSaved ? 'Saved!' : 'Save Scores'}
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Live Stats Dashboard */}
      <StatsDashboard
        currentCGPA={currentCGPA}
        totalUnits={totalUnits}
        scale={scale}
        targetCGPA={targetCGPA}
        setTargetCGPA={setTargetCGPA}
        remainingUnits={remainingUnits}
        setRemainingUnits={setRemainingUnits}
        requiredGPA={requiredGPA}
      />

      {/* Semester List */}
      <div>
        {semesters.map((sem) => (
          <SemesterCard
            key={sem.id}
            semester={sem}
            scale={scale}
            onUpdateSemester={handleUpdateSemester}
            onDeleteSemester={handleDeleteSemester}
          />
        ))}
      </div>

      {/* Add Semester Button */}
      <button
        onClick={handleAddSemester}
        className="mt-2 flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:text-gray-900 hover:border-gray-400 font-semibold transition-all"
      >
        <Plus className="h-5 w-5" />
        Add New Semester
      </button>
    </div>
  );
}
