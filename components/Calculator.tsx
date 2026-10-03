import React, { useState, useEffect } from 'react';
import { Plus, RotateCcw, Save, Trash2, Check, Scale } from 'lucide-react';
import { Semester, GradingScale, Course } from '@/types';
import { calculateCGPA, calculateTargetGPA } from '@/lib/calculations';
import StatsDashboard from './StatsDashboard';
import SemesterCard from './SemesterCard';

const STORAGE_KEY = 'cgpa_store_semesters';
const SCALE_KEY = 'cgpa_store_scale';

interface SavedResult {
  _id?: string;
  id?: string;
  semesterName?: string;
  scale?: GradingScale;
  semesters?: Semester[];
  createdAt?: string;
  updatedAt?: string;
}

export default function Calculator() {
  const [scale, setScale] = useState<GradingScale>('5.0');
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [targetCGPA, setTargetCGPA] = useState<string>('');
  const [remainingUnits, setRemainingUnits] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load initial state
  useEffect(() => {
    const savedSemesters = localStorage.getItem(STORAGE_KEY);
    const savedScale = localStorage.getItem(SCALE_KEY);
    const storedUser = localStorage.getItem('cgpa_user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    if (savedScale) {
      setScale(savedScale as GradingScale);
    }

    if (savedSemesters) {
      try {
        setSemesters(JSON.parse(savedSemesters));
      } catch {
        initializeDefault();
      }
    } else {
      initializeDefault();
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    loadSavedResults();
  }, [user]);

  const loadSavedResults = async () => {
    const token = localStorage.getItem('cgpa_auth_token');
    if (!token) return;

    try {
      const res = await fetch('/api/user/results', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      setSavedResults(Array.isArray(data.savedResults) ? data.savedResults : []);
    } catch {
      setSavedResults([]);
    }
  };

  const initializeDefault = () => {
    setSemesters([
      {
        id: Math.random().toString(36).substr(2, 9),
        name: 'Year 1 · 1st Semester',
        courses: [],
      },
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

  const handleSave = async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters));
    localStorage.setItem(SCALE_KEY, scale);

    const token = localStorage.getItem('cgpa_auth_token');

    if (token && user) {
      setSaveState('saving');
      try {
        const response = await fetch('/api/user/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            semesters,
            scale,
            semesterName: `Academic result ${savedResults.length + 1}`,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to save result');

        setSavedResults((prev) => [data.result, ...prev]);
        setSaveState('saved');
      } catch {
        setSaveState('idle');
      }
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    setTimeout(() => setSaveState('idle'), 1500);
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
            {isSaved ? (saveState === 'saved' ? 'Saved to account' : 'Saved!') : 'Save Scores'}
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

      {/* Saved Results Section */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Saved records</p>
            <h3 className="text-xl font-black text-gray-900">Your CGPA history</h3>
          </div>
          {!user && (
            <p className="text-sm text-gray-500">
              Log in to save and grow your academic history.
            </p>
          )}
        </div>

        {!user ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-600">
            Create an account to keep your results and add new ones as you progress.
          </div>
        ) : savedResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-600">
            No saved results yet. Save your current result to start building your history.
          </div>
        ) : (
          <div className="space-y-3">
            {savedResults.map((result, index) => (
              <div key={result.id || `${result.semesterName}-${index}`} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{result.semesterName || `Saved result ${index + 1}`}</p>
                    <p className="text-xs text-gray-500">
                      {result.scale || scale} scale • {result.semesters?.length || 0} semesters
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (result.semesters) {
                        setSemesters(result.semesters);
                        setScale((result.scale as GradingScale) || scale);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.semesters));
                        localStorage.setItem(SCALE_KEY, (result.scale as GradingScale) || scale);
                      }
                    }}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Load
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
