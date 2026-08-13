import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Book } from 'lucide-react';
import { Semester, Course, GradingScale } from '@/types';
import { calculateGPA, scoreToGrade } from '@/lib/calculations';

interface SemesterCardProps {
  semester: Semester;
  scale: GradingScale;
  onUpdateSemester: (semesterId: string, updatedSemester: Semester) => void;
  onDeleteSemester: (semesterId: string) => void;
}

export default function SemesterCard({
  semester,
  scale,
  onUpdateSemester,
  onDeleteSemester,
}: SemesterCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { gpa, totalUnits } = calculateGPA(semester.courses, scale);

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      code: '',
      units: 3,
      grade: 'A',
    };
    const updatedCourses = [...semester.courses, newCourse];
    onUpdateSemester(semester.id, { ...semester, courses: updatedCourses });
  };

  const handleUpdateCourse = (courseId: string, field: keyof Course, value: any) => {
    const updatedCourses = semester.courses.map((course) => {
      if (course.id === courseId) {
        const updated = { ...course, [field]: value };
        
        // If updating score, automatically map to grade
        if (field === 'score') {
          const numScore = parseFloat(value);
          if (!isNaN(numScore)) {
            updated.grade = scoreToGrade(numScore, scale);
          }
        }
        return updated;
      }
      return course;
    });
    onUpdateSemester(semester.id, { ...semester, courses: updatedCourses });
  };

  const handleDeleteCourse = (courseId: string) => {
    const updatedCourses = semester.courses.filter((course) => course.id !== courseId);
    onUpdateSemester(semester.id, { ...semester, courses: updatedCourses });
  };

  const handleRenameSemester = (newName: string) => {
    onUpdateSemester(semester.id, { ...semester, name: newName });
  };

  // Grade Options based on Scale
  const gradeOptions = scale === '5.0' ? ['A', 'B', 'C', 'D', 'E', 'F'] : ['A', 'B', 'C', 'D', 'F'];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
          <Book className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={semester.name}
            onChange={(e) => handleRenameSemester(e.target.value)}
            className="font-bold text-gray-900 bg-transparent hover:bg-gray-100/80 focus:bg-white px-2 py-1 rounded-lg border border-transparent focus:border-gray-200 focus:outline-none transition-all truncate text-sm sm:text-base max-w-xs md:max-w-md"
            placeholder="Semester Name"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-gray-400 block font-medium uppercase tracking-wider">GPA</span>
            <span className="text-sm font-bold text-gray-900">{gpa.toFixed(2)}</span>
            <span className="text-xs text-gray-400 font-normal"> ({totalUnits} CU)</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <button
            onClick={() => onDeleteSemester(semester.id)}
            className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
            title="Delete Semester"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Collapse Container */}
      {isOpen && (
        <div className="p-6">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2 w-1/3">Course Code / Name</th>
                  <th className="pb-3 w-1/4">Credit Units (CU)</th>
                  <th className="pb-3 w-1/4">Grade / Score (0-100)</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {semester.courses.map((course) => (
                  <tr key={course.id} className="group hover:bg-gray-50/30 transition-colors">
                    {/* Course Code */}
                    <td className="py-3 pl-2">
                      <input
                        type="text"
                        placeholder="e.g. MTH101"
                        value={course.code}
                        onChange={(e) => handleUpdateCourse(course.id, 'code', e.target.value)}
                        className="w-full max-w-[200px] px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium text-gray-900 uppercase"
                      />
                    </td>
                    {/* Credit Units */}
                    <td className="py-3">
                      <select
                        value={course.units}
                        onChange={(e) => handleUpdateCourse(course.id, 'units', parseInt(e.target.value))}
                        className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium text-gray-900"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} unit{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* Grade / Score */}
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <select
                          value={course.grade}
                          onChange={(e) => handleUpdateCourse(course.id, 'grade', e.target.value)}
                          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium text-gray-900"
                        >
                          {gradeOptions.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Score"
                          min="0"
                          max="100"
                          value={course.score || ''}
                          onChange={(e) => handleUpdateCourse(course.id, 'score', e.target.value)}
                          className="w-20 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium text-gray-900"
                        />
                      </div>
                    </td>
                    {/* Delete */}
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                        title="Delete Course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Cards */}
          <div className="block sm:hidden space-y-4">
            {semester.courses.map((course) => (
              <div key={course.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 relative">
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Course Code</label>
                    <input
                      type="text"
                      placeholder="e.g. CSC201"
                      value={course.code}
                      onChange={(e) => handleUpdateCourse(course.id, 'code', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none font-semibold text-gray-900 uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Units</label>
                      <select
                        value={course.units}
                        onChange={(e) => handleUpdateCourse(course.id, 'units', parseInt(e.target.value))}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium text-gray-900"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} unit{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Grade</label>
                      <select
                        value={course.grade}
                        onChange={(e) => handleUpdateCourse(course.id, 'grade', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none font-semibold text-gray-900"
                      >
                        {gradeOptions.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Course Button */}
          <button
            onClick={handleAddCourse}
            className="mt-4 flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </button>
        </div>
      )}
    </div>
  );
}
