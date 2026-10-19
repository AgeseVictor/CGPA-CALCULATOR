'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  LogIn,
  Plus,
  RotateCcw,
  Save,
  Scale,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import { calculateCGPA, calculateGPA, calculateTargetGPA, scoreToGrade } from '@/lib/calculations';
import { Course, GradingScale, Semester } from '@/types';

// ─── Types ──────────────────────────────────────────────────────────────────

interface DashboardCalculatorProps {
  userId?: string;
  onResultSaved?: (result: SavedResult) => void;
}

interface SavedResult {
  id?: string;
  semesterName?: string;
  scale?: GradingScale;
  semesters?: Semester[];
  createdAt?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CALC_STORAGE_KEY = 'cgpa_dash_calc_semesters';
const CALC_SCALE_KEY = 'cgpa_dash_calc_scale';

function uid() {
  return Math.random().toString(36).substr(2, 9);
}

function makeDefaultSemesters(): Semester[] {
  return [
    {
      id: uid(),
      name: 'Year 1 · 1st Semester',
      courses: [{ id: uid(), code: '', units: 3, grade: 'A' }],
    },
  ];
}

function getClassOfDegree(cgpa: number, scale: GradingScale) {
  if (scale === '5.0') {
    if (cgpa >= 4.5) return { name: 'First Class', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (cgpa >= 3.5) return { name: '2nd Class Upper', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (cgpa >= 2.4) return { name: '2nd Class Lower', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (cgpa >= 1.5) return { name: 'Third Class', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { name: 'Pass / Fail', color: 'text-red-700 bg-red-50 border-red-200' };
  } else {
    if (cgpa >= 3.5) return { name: 'First Class', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (cgpa >= 3.0) return { name: '2nd Class Upper', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (cgpa >= 2.0) return { name: '2nd Class Lower', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (cgpa >= 1.0) return { name: 'Third Class', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { name: 'Pass / Fail', color: 'text-red-700 bg-red-50 border-red-200' };
  }
}

// ─── Mini Semester Card ───────────────────────────────────────────────────────

function MiniSemesterCard({
  semester,
  scale,
  onUpdate,
  onDelete,
}: {
  semester: Semester;
  scale: GradingScale;
  onUpdate: (s: Semester) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const { gpa, totalUnits } = calculateGPA(semester.courses, scale);
  const gradeOptions = scale === '5.0' ? ['A', 'B', 'C', 'D', 'E', 'F'] : ['A', 'B', 'C', 'D', 'F'];

  const addCourse = () => {
    onUpdate({ ...semester, courses: [...semester.courses, { id: uid(), code: '', units: 3, grade: 'A' }] });
  };

  const updateCourse = (courseId: string, field: keyof Course, value: any) => {
    const courses = semester.courses.map((c) => {
      if (c.id !== courseId) return c;
      const updated = { ...c, [field]: value };
      if (field === 'score') {
        const n = parseFloat(value);
        if (!isNaN(n)) updated.grade = scoreToGrade(n, scale);
      }
      return updated;
    });
    onUpdate({ ...semester, courses });
  };

  const deleteCourse = (courseId: string) =>
    onUpdate({ ...semester, courses: semester.courses.filter((c) => c.id !== courseId) });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
          <BookOpen className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={semester.name}
            onChange={(e) => onUpdate({ ...semester, name: e.target.value })}
            className="text-sm font-bold text-slate-900 bg-transparent hover:bg-slate-100 focus:bg-white px-2 py-0.5 rounded-lg border border-transparent focus:border-slate-200 focus:outline-none transition-all truncate w-full"
            placeholder="Semester Name"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GPA</span>
            <span className="text-sm font-black text-slate-900">
              {gpa.toFixed(2)}{' '}
              <span className="text-slate-400 font-normal text-xs">({totalUnits} CU)</span>
            </span>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
          >
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onDelete(semester.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-3">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="pb-2 pl-1">Course Code</th>
                  <th className="pb-2">Credit Units</th>
                  <th className="pb-2">Grade / Score</th>
                  <th className="pb-2 text-right pr-1" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {semester.courses.map((course) => (
                  <tr key={course.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 pl-1">
                      <input
                        type="text"
                        placeholder="e.g. MTH101"
                        value={course.code}
                        onChange={(e) => updateCourse(course.id, 'code', e.target.value)}
                        className="w-full max-w-[160px] px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 uppercase transition"
                      />
                    </td>
                    <td className="py-2">
                      <select
                        value={course.units}
                        onChange={(e) => updateCourse(course.id, 'units', parseInt(e.target.value))}
                        className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-900 focus:border-slate-400 transition"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} unit{n > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-900 focus:border-slate-400 transition"
                        >
                          {gradeOptions.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Score"
                          min="0"
                          max="100"
                          value={course.score || ''}
                          onChange={(e) => updateCourse(course.id, 'score', e.target.value)}
                          className="w-20 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 transition"
                        />
                      </div>
                    </td>
                    <td className="py-2 text-right pr-1">
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="block sm:hidden space-y-3">
            {semester.courses.map((course) => (
              <div key={course.id} className="relative rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Course Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CSC201"
                      value={course.code}
                      onChange={(e) => updateCourse(course.id, 'code', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none font-semibold text-slate-900 placeholder:text-slate-400 focus:border-slate-400 uppercase transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Units</label>
                      <select
                        value={course.units}
                        onChange={(e) => updateCourse(course.id, 'units', parseInt(e.target.value))}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-900 focus:border-slate-400 transition"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n} unit{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Grade</label>
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none font-semibold text-slate-900 focus:border-slate-400 transition"
                      >
                        {gradeOptions.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addCourse}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Course
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardCalculator({ userId, onResultSaved }: DashboardCalculatorProps) {
  const [scale, setScale] = useState<GradingScale>('5.0');
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [targetCGPA, setTargetCGPA] = useState('');
  const [remainingUnits, setRemainingUnits] = useState('');
  const [resultName, setResultName] = useState('');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');
  const [showGuestModal, setShowGuestModal] = useState(false);

  // Initialise from localStorage
  useEffect(() => {
    const storedScale = localStorage.getItem(CALC_SCALE_KEY) as GradingScale | null;
    const storedSemesters = localStorage.getItem(CALC_STORAGE_KEY);
    if (storedScale) setScale(storedScale);
    if (storedSemesters) {
      try {
        const parsed = JSON.parse(storedSemesters);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSemesters(parsed);
          return;
        }
      } catch { /* fall through */ }
    }
    setSemesters(makeDefaultSemesters());
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (semesters.length > 0) localStorage.setItem(CALC_STORAGE_KEY, JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    localStorage.setItem(CALC_SCALE_KEY, scale);
  }, [scale]);

  // Handlers
  const handleUpdateSemester = useCallback(
    (updated: Semester) => setSemesters((prev) => prev.map((s) => (s.id === updated.id ? updated : s))),
    []
  );

  const handleDeleteSemester = useCallback(
    (id: string) => setSemesters((prev) => prev.filter((s) => s.id !== id)),
    []
  );

  const handleAddSemester = () => {
    const n = semesters.length + 1;
    const year = Math.ceil(n / 2);
    const half = n % 2 === 1 ? '1st' : '2nd';
    setSemesters((prev) => [
      ...prev,
      { id: uid(), name: `Year ${year} · ${half} Semester`, courses: [{ id: uid(), code: '', units: 3, grade: 'A' }] },
    ]);
  };

  const handleClearAll = () => {
    if (!confirm('Clear all semesters and courses? This cannot be undone.')) return;
    const fresh = makeDefaultSemesters();
    setSemesters(fresh);
    setTargetCGPA('');
    setRemainingUnits('');
    localStorage.setItem(CALC_STORAGE_KEY, JSON.stringify(fresh));
    setSaveState('idle');
  };

  const handleSave = async () => {
    if (!userId) {
      setShowGuestModal(true);
      return;
    }
    setSaveState('saving');
    setSaveError('');
    try {
      const token = localStorage.getItem('cgpa_auth_token');
      if (!token) throw new Error('Not authenticated');

      const name =
        resultName.trim() ||
        `CGPA Snapshot – ${new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}`;

      const res = await fetch('/api/user/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ semesters, scale, semesterName: name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save result');

      setSaveState('saved');
      setResultName('');
      onResultSaved?.(data.result);
      setTimeout(() => setSaveState('idle'), 2500);
    } catch (err: any) {
      setSaveError(err.message || 'Something went wrong');
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  // Computed
  const { cgpa, totalUnits } = useMemo(() => calculateCGPA(semesters, scale), [semesters, scale]);
  const degreeClass = useMemo(() => getClassOfDegree(cgpa, scale), [cgpa, scale]);
  const reqTarget = parseFloat(targetCGPA) || 0;
  const reqRemaining = parseFloat(remainingUnits) || 0;
  const requiredGPA = useMemo(
    () => calculateTargetGPA(cgpa, totalUnits, reqTarget, reqRemaining),
    [cgpa, totalUnits, reqTarget, reqRemaining]
  );
  const isTargetActive = reqTarget > 0 && reqRemaining > 0;
  const isTargetAchievable = requiredGPA <= parseFloat(scale);

  return (
    <>
      {/* ── Guest Modal ──────────────────────────────────────────────────── */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowGuestModal(false)}
              className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Save your results</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Your CGPA is calculated — great! Create a free account to save results, track progress over time, and
              unlock your academic profile.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <LogIn className="h-4 w-4" />I already have an account
              </Link>
            </div>
            <p className="mt-4 text-center text-xs text-slate-400">
              Your current calculation is saved in your browser and will not be lost.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* ── Live Stats ──────────────────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* CGPA */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Current CGPA</span>
              <div className="p-1.5 bg-slate-900 text-white rounded-lg">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {cgpa.toFixed(2)}
              <span className="text-base font-normal text-slate-400"> / {parseFloat(scale).toFixed(1)}</span>
            </div>
            <div className="mt-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${degreeClass.color}`}>
                {degreeClass.name}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <Award className="h-3 w-3" />
              Based on {totalUnits} credit units
            </p>
          </div>

          {/* Total Units */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Total Units</span>
              <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                <Award className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {totalUnits}
              <span className="text-base font-normal text-slate-400"> CU</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">Accumulated credit units from all active semesters.</p>
          </div>

          {/* Target Planner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Target Planner</span>
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Target className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Target CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={scale}
                  value={targetCGPA}
                  onChange={(e) => setTargetCGPA(e.target.value)}
                  placeholder={scale === '5.0' ? '4.50' : '3.50'}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 transition font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Remaining CU</label>
                <input
                  type="number"
                  min="0"
                  value={remainingUnits}
                  onChange={(e) => setRemainingUnits(e.target.value)}
                  placeholder="e.g. 40"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 transition font-medium"
                />
              </div>
            </div>
            {isTargetActive ? (
              <div className="border-t border-slate-100 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Required GPA</span>
                  <span className={`text-base font-black ${isTargetAchievable ? 'text-indigo-600' : 'text-red-500'}`}>
                    {requiredGPA.toFixed(2)}
                  </span>
                </div>
                <p className={`text-[11px] mt-1 ${isTargetAchievable ? 'text-slate-400' : 'text-red-400 font-medium'}`}>
                  {isTargetAchievable
                    ? `You need ${requiredGPA.toFixed(2)} avg in remaining semesters.`
                    : `Target is impossible — exceeds the ${scale} scale limit.`}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Enter a target CGPA and remaining units.</p>
            )}
          </div>
        </div>

        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-slate-500 shrink-0" />
            <span className="text-sm font-semibold text-slate-700">Scale:</span>
            <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5">
              {(['5.0', '4.0'] as GradingScale[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    scale === s ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {userId && (
              <input
                type="text"
                value={resultName}
                onChange={(e) => setResultName(e.target.value)}
                placeholder="Result name (optional)"
                className="hidden sm:block rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 transition w-52"
              />
            )}

            <button
              onClick={handleSave}
              disabled={saveState === 'saving'}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                saveState === 'saved'
                  ? 'bg-emerald-600 text-white'
                  : saveState === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-black text-white hover:bg-slate-800'
              }`}
            >
              {saveState === 'saving' ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving…
                </>
              ) : saveState === 'saved' ? (
                <><Check className="h-3.5 w-3.5" />Saved!</>
              ) : saveState === 'error' ? (
                <><AlertCircle className="h-3.5 w-3.5" />Failed</>
              ) : (
                <><Save className="h-3.5 w-3.5" />Save Result</>
              )}
            </button>

            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Error banner */}
        {saveState === 'error' && saveError && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            {saveError}
          </div>
        )}

        {/* Guest nudge */}
        {!userId && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Calculating for free.</span>{' '}
              Create an account to save results and track your progress over time.
            </p>
            <Link
              href="/signup"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Sign up free
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* ── Semester Cards ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          {semesters.map((sem) => (
            <MiniSemesterCard
              key={sem.id}
              semester={sem}
              scale={scale}
              onUpdate={handleUpdateSemester}
              onDelete={handleDeleteSemester}
            />
          ))}
        </div>

        {/* Add Semester */}
        <button
          onClick={handleAddSemester}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-4 text-sm font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-800 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Semester
        </button>
      </div>
    </>
  );
}
