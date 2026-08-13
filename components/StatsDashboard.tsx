import React from 'react';
import { Target, TrendingUp, Award, HelpCircle } from 'lucide-react';
import { GradingScale } from '@/types';

interface StatsDashboardProps {
  currentCGPA: number;
  totalUnits: number;
  scale: GradingScale;
  targetCGPA: string;
  setTargetCGPA: (val: string) => void;
  remainingUnits: string;
  setRemainingUnits: (val: string) => void;
  requiredGPA: number;
}

export default function StatsDashboard({
  currentCGPA,
  totalUnits,
  scale,
  targetCGPA,
  setTargetCGPA,
  remainingUnits,
  setRemainingUnits,
  requiredGPA,
}: StatsDashboardProps) {
  const maxScaleValue = parseFloat(scale);
  const isTargetAchievable = requiredGPA <= maxScaleValue;
  const isTargetActive = parseFloat(targetCGPA) > 0 && parseFloat(remainingUnits) > 0;

  // Determine Class of Degree
  const getClassOfDegree = (cgpa: number, scale: GradingScale) => {
    if (scale === '5.0') {
      if (cgpa >= 4.5) return { name: 'First Class', color: 'text-success bg-green-50 border-green-100' };
      if (cgpa >= 3.5) return { name: 'Second Class Upper', color: 'text-blue-600 bg-blue-50 border-blue-100' };
      if (cgpa >= 2.4) return { name: 'Second Class Lower', color: 'text-yellow-600 bg-yellow-50 border-yellow-100' };
      if (cgpa >= 1.5) return { name: 'Third Class', color: 'text-orange-600 bg-orange-50 border-orange-100' };
      return { name: 'Pass/Fail', color: 'text-red-600 bg-red-50 border-red-100' };
    } else {
      if (cgpa >= 3.5) return { name: 'First Class / Summa Cum Laude', color: 'text-success bg-green-50 border-green-100' };
      if (cgpa >= 3.0) return { name: 'Second Class Upper / Magna Cum Laude', color: 'text-blue-600 bg-blue-50 border-blue-100' };
      if (cgpa >= 2.0) return { name: 'Second Class Lower / Cum Laude', color: 'text-yellow-600 bg-yellow-50 border-yellow-100' };
      if (cgpa >= 1.0) return { name: 'Third Class', color: 'text-orange-600 bg-orange-50 border-orange-100' };
      return { name: 'Pass/Fail', color: 'text-red-600 bg-red-50 border-red-100' };
    }
  };

  const degreeClass = getClassOfDegree(currentCGPA, scale);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* CGPA STAT CARD */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Current CGPA</span>
          <div className="p-2 bg-black text-white rounded-lg">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            {currentCGPA.toFixed(2)}
            <span className="text-lg font-normal text-gray-400"> / {maxScaleValue.toFixed(1)}</span>
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${degreeClass.color}`}>
              {degreeClass.name}
            </span>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-400 flex items-center gap-1">
          <Award className="h-3.5 w-3.5" />
          Based on {totalUnits} total credit units
        </div>
      </div>

      {/* TOTAL UNITS STAT CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Units</span>
          <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
            <Award className="h-4 w-4" />
          </div>
        </div>
        <div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            {totalUnits}
            <span className="text-lg font-normal text-gray-400"> CU</span>
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Total credit units accumulated from your active semesters.
          </p>
        </div>
        <div className="mt-4 text-xs text-gray-400">
          Make sure to match correct official weightings
        </div>
      </div>

      {/* TARGET PLANNER STAT CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            Target CGPA Planner
            <span className="group relative cursor-pointer text-gray-400 hover:text-gray-600">
              <HelpCircle className="h-3.5 w-3.5" />
              <span className="absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded bg-black p-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md font-normal leading-relaxed">
                "Reverse math": Tells you what GPA you need in future semesters to hit your goal.
              </span>
            </span>
          </span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Target className="h-4 w-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Target CGPA</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={scale}
              value={targetCGPA}
              onChange={(e) => setTargetCGPA(e.target.value)}
              placeholder={`e.g. ${scale === '5.0' ? '4.50' : '3.50'}`}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium text-gray-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Remaining CU</label>
            <input
              type="number"
              min="0"
              value={remainingUnits}
              onChange={(e) => setRemainingUnits(e.target.value)}
              placeholder="e.g. 40"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium text-gray-900"
            />
          </div>
        </div>

        {isTargetActive ? (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Required GPA:</span>
              <span className={`text-lg font-bold ${isTargetAchievable ? 'text-indigo-600' : 'text-red-500'}`}>
                {requiredGPA.toFixed(2)}
              </span>
            </div>
            <p className={`text-[11px] mt-1 ${isTargetAchievable ? 'text-gray-500' : 'text-red-400 font-medium'}`}>
              {isTargetAchievable
                ? `You need an average of ${requiredGPA.toFixed(2)} GPA in remaining courses.`
                : `Target is math-impossible. Requires exceeding scale limit (${scale}).`}
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">
            Enter a target CGPA and remaining units to calculate your required path.
          </p>
        )}
      </div>
    </div>
  );
}
