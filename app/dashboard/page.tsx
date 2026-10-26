'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Building,
  Calculator,
  Check,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Pencil,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { calculateCGPA } from '@/lib/calculations';
import { GradingScale, Semester, StudentProfile } from '@/types';
import DashboardCalculator from '@/components/DashboardCalculator';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  studentProfile?: StudentProfile;
};

type SavedResult = {
  _id?: string;
  id?: string;
  semesterName?: string;
  scale?: GradingScale;
  semesters?: Array<{
    id: string;
    name: string;
    courses?: Array<{
      id: string;
      code: string;
      units: number;
      grade: string;
    }>;
  }>;
  createdAt?: string;
};

const defaultStudentProfile: StudentProfile = {
  faculty: 'Not set',
  department: 'Not set',
  level: '',
  matricNumber: '',
  graduationYear: '',
  targetClass: '',
  carryoverCourses: 0,
  probationStatus: 'On Track',
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(defaultStudentProfile);
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator'>('overview');

  // Edit Academic Profile Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<StudentProfile>(defaultStudentProfile);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('cgpa_user');
    const token = localStorage.getItem('cgpa_auth_token');

    if (!storedUser || !token) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.studentProfile) {
        setStudentProfile({ ...defaultStudentProfile, ...parsedUser.studentProfile });
      }
    } catch {
      router.push('/login');
      return;
    }

    const storedProfile = localStorage.getItem('cgpa_student_profile');
    if (storedProfile) {
      try {
        setStudentProfile((prev) => ({ ...prev, ...JSON.parse(storedProfile) }));
      } catch {
        // Fallback to default
      }
    }

    const fetchDashboardData = async () => {
      try {
        const [resultsRes, profileRes] = await Promise.all([
          fetch('/api/user/results', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (resultsRes.ok) {
          const resultsData = await resultsRes.json();
          setSavedResults(Array.isArray(resultsData.savedResults) ? resultsData.savedResults : []);
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.profile) {
            setStudentProfile({ ...defaultStudentProfile, ...profileData.profile });
            localStorage.setItem('cgpa_student_profile', JSON.stringify(profileData.profile));
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Close modal with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditModalOpen) {
        setIsEditModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditModalOpen]);

  const handleLogout = () => {
    localStorage.removeItem('cgpa_auth_token');
    localStorage.removeItem('cgpa_user');
    localStorage.removeItem('cgpa_student_profile');
    router.push('/login');
  };

  const handleDeleteResult = async (resultId: string) => {
    if (!confirm('Delete this saved result? This action cannot be undone.')) return;

    setDeletingId(resultId);
    try {
      const token = localStorage.getItem('cgpa_auth_token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`/api/user/results?id=${encodeURIComponent(resultId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete result');
      }

      setSavedResults((prev) => prev.filter((r) => {
        const id = (r as any)._id || r.id;
        return id !== resultId;
      }));
      setSuccessToast('Result deleted successfully!');
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err: any) {
      setSuccessToast('');
      alert(err.message || 'Failed to delete result');
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = () => {
    setEditForm({
      faculty: studentProfile.faculty === 'Not set' ? '' : studentProfile.faculty,
      department: studentProfile.department === 'Not set' ? '' : studentProfile.department,
      level: studentProfile.level || '',
      matricNumber: studentProfile.matricNumber || '',
      graduationYear: studentProfile.graduationYear || '',
      targetClass: studentProfile.targetClass || '',
      carryoverCourses: studentProfile.carryoverCourses || 0,
      probationStatus: studentProfile.probationStatus || 'On Track',
    });
    setSaveError('');
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'carryoverCourses' ? Math.max(0, parseInt(value, 10) || 0) : value,
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveError('');

    try {
      const token = localStorage.getItem('cgpa_auth_token');
      if (!token) {
        throw new Error('You must be logged in to save your profile');
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save academic profile');
      }

      const updated = data.profile || editForm;
      setStudentProfile(updated);
      localStorage.setItem('cgpa_student_profile', JSON.stringify(updated));

      const storedUser = localStorage.getItem('cgpa_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          parsed.studentProfile = updated;
          localStorage.setItem('cgpa_user', JSON.stringify(parsed));
        } catch {
          // ignore
        }
      }

      setIsEditModalOpen(false);
      setSuccessToast('Academic profile updated successfully!');
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Something went wrong while saving profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const isProfileConfigured = useMemo(() => {
    return Boolean(
      studentProfile.faculty &&
      studentProfile.faculty !== 'Not set' &&
      studentProfile.department &&
      studentProfile.department !== 'Not set' &&
      studentProfile.level &&
      studentProfile.targetClass
    );
  }, [studentProfile]);

  const stats = useMemo(() => {
    const semesterCount = savedResults.reduce((sum, result) => {
      const semesters = (Array.isArray(result.semesters) ? result.semesters : []) as Semester[];
      return sum + semesters.length;
    }, 0);

    const courseCount = savedResults.reduce((sum, result) => {
      const semesters = (Array.isArray(result.semesters) ? result.semesters : []) as Semester[];
      const resultCourses = semesters.reduce((count, semester) => {
        return count + (Array.isArray(semester.courses) ? semester.courses.length : 0);
      }, 0);
      return sum + resultCourses;
    }, 0);

    const bestCGPA = savedResults.reduce((best, result) => {
      const semesters = (Array.isArray(result.semesters) ? result.semesters : []) as Semester[];
      if (semesters.length === 0) return best;
      const scale = (result.scale as GradingScale) || '5.0';
      const { cgpa } = calculateCGPA(semesters, scale);
      return cgpa > best ? cgpa : best;
    }, 0);

    const latestResult = savedResults[0];
    const latestSemesters = (latestResult && Array.isArray(latestResult.semesters) ? latestResult.semesters : []) as Semester[];
    const latestCGPA = latestSemesters.length
      ? calculateCGPA(latestSemesters, (latestResult?.scale as GradingScale) || '5.0').cgpa
      : 0;

    return {
      semesterCount,
      courseCount,
      bestCGPA,
      latestCGPA,
    };
  }, [savedResults]);

  const degreeStatus = useMemo(() => {
    const cgpa = stats.latestCGPA || 0;
    const target = studentProfile.targetClass || '';

    if (!target) {
      return {
        required: 0,
        gap: 0,
        status: 'Set target',
      };
    }

    const targetMap: Record<string, number> = {
      'First Class': 4.5,
      'Second Class Upper': 3.5,
      'Second Class Lower': 2.4,
      'Third Class': 1.5,
      Pass: 1.0,
    };

    const required = targetMap[target] ?? 3.5;
    const gap = Math.max(required - cgpa, 0);

    return {
      required,
      gap,
      status: cgpa >= required ? 'On target' : 'Needs attention',
    };
  }, [stats.latestCGPA, studentProfile.targetClass]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-sm flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          Loading your dashboard...
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const latestResult = savedResults[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Toast notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition-all">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-lg font-black text-white">
              c
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              cgpa<span className="font-normal text-slate-400">.store</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Calculator className="h-4 w-4" />
              Calculator
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8 flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === 'calculator'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calculator className="h-4 w-4" />
            Calculator
          </button>
        </div>

        {/* ── Calculator Tab ── */}
        {activeTab === 'calculator' && (
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 border-b border-slate-100 pb-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">CGPA Calculator</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">Calculate your CGPA</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your courses, grades, and credit units. Save the result directly to your profile.
              </p>
            </div>
            <DashboardCalculator
              userId={user?.id}
              onResultSaved={(result) => {
                setSavedResults((prev) => [result as SavedResult, ...prev]);
              }}
            />
          </section>
        )}

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <>
        {/* Profile Completion Callout if not configured */}
        {!isProfileConfigured && (
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-200 text-amber-900 shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-950">Set up your academic profile</h3>
                <p className="text-xs sm:text-sm text-amber-800/90 mt-0.5">
                  Add your faculty, department, level, and degree targets to unlock target gap forecasting and carryover tracking.
                </p>
              </div>
            </div>
            <button
              onClick={openEditModal}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-amber-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-amber-900 shadow-sm"
            >
              <Pencil className="h-3.5 w-3.5" />
              Add academic details
            </button>
          </div>
        )}

        {/* Welcome Card */}
        <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm shrink-0">
                <UserRound className="h-8 w-8" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Student profile</p>
                  {studentProfile.level && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {studentProfile.level}
                    </span>
                  )}
                  {studentProfile.department && studentProfile.department !== 'Not set' && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {studentProfile.department}
                    </span>
                  )}
                </div>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Welcome back, {user.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                  {studentProfile.matricNumber && (
                    <span className="inline-flex items-center gap-2 text-slate-500 font-mono text-xs">
                      • Matric: {studentProfile.matricNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={openEditModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 shadow-sm"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm"
              >
                Open calculator
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Latest CGPA</span>
              <Award className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.latestCGPA ? stats.latestCGPA.toFixed(2) : '0.00'}</div>
            <p className="mt-2 text-sm text-slate-500">Current academic standing</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Target gap</span>
              <GraduationCap className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{degreeStatus.gap.toFixed(2)}</div>
            <p className="mt-2 text-sm text-slate-500">
              {studentProfile.targetClass ? `Needed for ${studentProfile.targetClass}` : 'Target class not set'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Semesters</span>
              <BookOpen className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.semesterCount}</div>
            <p className="mt-2 text-sm text-slate-500">Saved academic terms</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Carryover</span>
              <BookOpen className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{studentProfile.carryoverCourses}</div>
            <p className="mt-2 text-sm text-slate-500">Courses requiring attention</p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          {/* Left Column: Saved Results History */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Academic history</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">Saved results</h2>
              </div>
            </div>

            {savedResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                You have not saved any results yet. Head to the calculator and save your first CGPA snapshot.
              </div>
            ) : (
              <div className="space-y-3">
                {savedResults.map((result, index) => {
                  const semesters = (Array.isArray(result.semesters) ? result.semesters : []) as Semester[];
                  const totalSemesters = semesters.length;
                  const totalCoursesInResult = semesters.reduce(
                    (count, semester) => count + (Array.isArray(semester.courses) ? semester.courses.length : 0),
                    0
                  );
                  const resultCGPA = semesters.length
                    ? calculateCGPA(semesters, (result.scale as GradingScale) || '5.0').cgpa
                    : 0;

                  const currentId = (result as any)._id || result.id;

                  return (
                    <div key={currentId || `${result.semesterName}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-black text-slate-900">{result.semesterName || `Saved result ${index + 1}`}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {result.scale || '5.0'} scale • {totalSemesters} semesters • {totalCoursesInResult} courses
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-white px-3 py-2 text-right shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">CGPA</p>
                            <p className="text-lg font-black text-slate-900">{resultCGPA.toFixed(2)}</p>
                          </div>
                          {currentId && (
                            <button
                              onClick={() => handleDeleteResult(currentId)}
                              disabled={deletingId === currentId}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                              title="Delete this result"
                            >
                              {deletingId === currentId ? (
                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Right Column: Academic Profile & Forecasting Cards */}
          <aside className="space-y-6">
            {/* UNIPORT-Specific Academic Profile Panel */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Academic Profile</p>
                  <h3 className="mt-1 text-lg font-black text-slate-900">Institutional Details</h3>
                </div>
                <button
                  onClick={openEditModal}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {studentProfile.faculty === 'Not set' ? 'Add details' : 'Edit details'}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Faculty</p>
                  <p className="mt-1 text-sm font-black text-slate-900 truncate">
                    {studentProfile.faculty && studentProfile.faculty !== 'Not set' ? studentProfile.faculty : (
                      <span className="text-slate-400 font-normal italic">Not set</span>
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Department</p>
                  <p className="mt-1 text-sm font-black text-slate-900 truncate">
                    {studentProfile.department && studentProfile.department !== 'Not set' ? studentProfile.department : (
                      <span className="text-slate-400 font-normal italic">Not set</span>
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Level</p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {studentProfile.level || <span className="text-slate-400 font-normal italic">Not set</span>}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Matric Number</p>
                  <p className="mt-1 text-sm font-black text-slate-900 font-mono">
                    {studentProfile.matricNumber || <span className="text-slate-400 font-normal italic">Not set</span>}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Graduation Year</p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {studentProfile.graduationYear || <span className="text-slate-400 font-normal italic">Not set</span>}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Target Class</p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {studentProfile.targetClass || <span className="text-slate-400 font-normal italic">Not set</span>}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Carryover Courses</p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {studentProfile.carryoverCourses}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Probation Status</p>
                  <p className={`mt-1 text-sm font-black ${
                    studentProfile.probationStatus === 'On Probation'
                      ? 'text-red-600'
                      : studentProfile.probationStatus === 'Academic Warning'
                      ? 'text-amber-600'
                      : 'text-emerald-700'
                  }`}>
                    {studentProfile.probationStatus || 'On Track'}
                  </p>
                </div>
              </div>
            </div>

            {/* Degree Target Planning Card */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Degree forecast</p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Target Class</p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {studentProfile.targetClass || 'Not set'}
                </p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {!studentProfile.targetClass ? (
                    'Set your target degree class (e.g. First Class or Second Class Upper) to monitor your CGPA requirements.'
                  ) : degreeStatus.status === 'On target' ? (
                    `Great work! Your latest CGPA is above the minimum required (${degreeStatus.required.toFixed(2)}) for ${studentProfile.targetClass}.`
                  ) : (
                    `You need about ${degreeStatus.required.toFixed(2)} to reach ${studentProfile.targetClass}. Focus on the upcoming semester and clear any carryovers.`
                  )}
                </p>
              </div>
            </div>

            {/* Risk Summary Card */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Academic Standing & Risk</p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${
                    studentProfile.probationStatus === 'On Probation'
                      ? 'bg-red-500'
                      : studentProfile.probationStatus === 'Academic Warning'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`} />
                  <span className="text-sm font-bold text-slate-800">
                    {studentProfile.probationStatus || 'On Track'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {studentProfile.probationStatus === 'On Probation'
                    ? 'You are currently on academic probation. Please schedule a meeting with your academic advisor or head of department.'
                    : studentProfile.probationStatus === 'Academic Warning'
                    ? 'You have received an academic warning. Strive to maintain a high GPA next semester to remain in good standing.'
                    : 'You are currently in good academic standing. Keep up the consistency and focus on your graduation goals.'}
                </p>
              </div>
            </div>
          </aside>
        </div>
          </>
        )}
      </div>

      {/* Standard Edit Academic Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-xs font-black text-white">c</span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Academic Profile</span>
                </div>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Edit Academic Profile</h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                  Update your institutional profile, degree target, and academic standing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Banner */}
            {saveError && (
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Faculty */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Faculty
                  </label>
                  <input
                    type="text"
                    name="faculty"
                    value={editForm.faculty}
                    onChange={handleFormChange}
                    placeholder="e.g. Science"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={editForm.department}
                    onChange={handleFormChange}
                    placeholder="e.g. Computer Science"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                {/* Level */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Current Level
                  </label>
                  <select
                    name="level"
                    value={editForm.level}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                  >
                    <option value="">Select level</option>
                    <option value="100 Level">100 Level</option>
                    <option value="200 Level">200 Level</option>
                    <option value="300 Level">300 Level</option>
                    <option value="400 Level">400 Level</option>
                    <option value="500 Level">500 Level</option>
                    <option value="600 Level">600 Level</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>

                {/* Matric Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Matric / Reg Number
                  </label>
                  <input
                    type="text"
                    name="matricNumber"
                    value={editForm.matricNumber}
                    onChange={handleFormChange}
                    placeholder="e.g. U2021/5570001"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                {/* Expected Graduation Year */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    name="graduationYear"
                    value={editForm.graduationYear}
                    onChange={handleFormChange}
                    placeholder="e.g. 2026"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                {/* Target Degree Class */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Target Degree Class
                  </label>
                  <select
                    name="targetClass"
                    value={editForm.targetClass}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                  >
                    <option value="">Select target class</option>
                    <option value="First Class">First Class (4.50 - 5.00)</option>
                    <option value="Second Class Upper">Second Class Upper (3.50 - 4.49)</option>
                    <option value="Second Class Lower">Second Class Lower (2.40 - 3.49)</option>
                    <option value="Third Class">Third Class (1.50 - 2.39)</option>
                    <option value="Pass">Pass (1.00 - 1.49)</option>
                  </select>
                </div>

                {/* Carryover Courses */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Carryover Courses Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    name="carryoverCourses"
                    value={editForm.carryoverCourses}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:bg-white"
                  />
                </div>

                {/* Academic Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Academic Standing
                  </label>
                  <select
                    name="probationStatus"
                    value={editForm.probationStatus}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                  >
                    <option value="On Track">On Track (Good Standing)</option>
                    <option value="Academic Warning">Academic Warning</option>
                    <option value="On Probation">On Probation</option>
                  </select>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-sm"
                >
                  {savingProfile ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
