'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  LogOut,
  Mail,
  UserRound,
} from 'lucide-react';
import { calculateCGPA } from '@/lib/calculations';
import { GradingScale, Semester } from '@/types';

type UserProfile = {
  id: string;
  name: string;
  email: string;
};

type SavedResult = {
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

type StudentProfile = {
  faculty: string;
  department: string;
  level: string;
  matricNumber: string;
  graduationYear: string;
  targetClass: string;
  carryoverCourses: number;
  probationStatus: string;
};

const defaultStudentProfile: StudentProfile = {
  faculty: 'Engineering',
  department: 'Computer Engineering',
  level: '200',
  matricNumber: 'UPH/2023/0001',
  graduationYear: String(new Date().getFullYear() + 2),
  targetClass: 'First Class',
  carryoverCourses: 1,
  probationStatus: 'On Track',
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(defaultStudentProfile);

  useEffect(() => {
    const storedUser = localStorage.getItem('cgpa_user');
    const token = localStorage.getItem('cgpa_auth_token');

    if (!storedUser || !token) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      router.push('/login');
      return;
    }

    const storedProfile = localStorage.getItem('cgpa_student_profile');
    if (storedProfile) {
      try {
        setStudentProfile({ ...defaultStudentProfile, ...JSON.parse(storedProfile) });
      } catch {
        setStudentProfile(defaultStudentProfile);
      }
    }

    const fetchSavedResults = async () => {
      try {
        const response = await fetch('/api/user/results', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to load results');

        const data = await response.json();
        setSavedResults(Array.isArray(data.savedResults) ? data.savedResults : []);
      } catch {
        setSavedResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedResults();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cgpa_auth_token');
    localStorage.removeItem('cgpa_user');
    router.push('/login');
  };

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
    const target = studentProfile.targetClass;

    const targetMap: Record<string, number> = {
      'First Class': 4.5,
      'Second Class Upper': 3.5,
      'Second Class Lower': 2.4,
      'Third Class': 1.5,
    };

    const required = targetMap[target] ?? 3.0;
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
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-sm">
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
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md">
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
            <Link
              href="/"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Calculator
            </Link>
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
        <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <UserRound className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Student profile</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Welcome back, {user.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

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
            <p className="mt-2 text-sm text-slate-500">Needed to hit {studentProfile.targetClass}</p>
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

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
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

                  return (
                    <div key={result.id || `${result.semesterName}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Profile summary</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Name</p>
                  <p className="mt-2 text-lg font-black text-slate-900">{user.name}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Email</p>
                  <p className="mt-2 break-all text-lg font-black text-slate-900">{user.email}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Latest snapshot</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {latestResult && Array.isArray(latestResult.semesters)
                      ? `${calculateCGPA((latestResult.semesters as Semester[]), (latestResult.scale as GradingScale) || '5.0').cgpa.toFixed(2)}`
                      : '0.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* UNIPORT-specific profile panel */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">UNIPORT Academic Profile</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Faculty</p>
                  <p className="mt-2 text-lg font-black text-slate-900">{studentProfile.faculty}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Department</p>
                  <p className="mt-2 text-lg font-black text-slate-900">{studentProfile.department}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Level</p>
                  <p className="mt-2 text-lg font-black text-slate-900">{studentProfile.level}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Matric Number</p>
                  <p className="mt-2 text-lg font-black text-slate-900">{studentProfile.matricNumber}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Graduation Year</p>
                  <p className="mt-2 text-lg font-black text-slate-900">{studentProfile.graduationYear}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Target Class</p>
                  <p className="mt-2 text-lg font-black text-slate-900">{studentProfile.targetClass}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Carryover Courses</p>
                  <p className="mt-2 text-lg font-black text-slate-900">{studentProfile.carryoverCourses}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Probation Status</p>
                  <p className="mt-2 text-lg font-black text-slate-900">{studentProfile.probationStatus}</p>
                </div>
              </div>
            </div>

            {/* Degree target planning card */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Degree forecast</p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Target</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{studentProfile.targetClass}</p>
                <p className="mt-3 text-sm text-slate-600">
                  {degreeStatus.status === 'On target'
                    ? `Great work. Your current CGPA is already above the required ${degreeStatus.required.toFixed(2)} for your chosen class.`
                    : `You need about ${degreeStatus.required.toFixed(2)} to reach your target. Focus on the next semester and avoid carryovers.`}
                </p>
              </div>
            </div>

            {/* Risk summary card */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Risk Summary</p>
              <div className="mt-4">
                <p className="text-lg font-black text-slate-900">
                  {studentProfile.probationStatus === 'On Track'
                    ? 'You are currently not on probation. Keep up the good work!'
                    : 'You are on probation. Please see an academic advisor.'}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
