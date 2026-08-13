import React from 'react';
import { Award } from 'lucide-react';

export default function ClassificationTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-12">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 bg-black text-white rounded-lg">
          <Award className="h-4 w-4" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">CGPA Classification Reference</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 5.0 Scale Table */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">5.0 Grading Scale (Standard)</h4>
          <div className="overflow-hidden border border-gray-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                  <th className="p-3">Class of Degree</th>
                  <th className="p-3">CGPA Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-600">
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-900">First Class</td>
                  <td className="p-3">4.50 – 5.00</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-900">Second Class (Upper Division)</td>
                  <td className="p-3">3.50 – 4.49</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-900">Second Class (Lower Division)</td>
                  <td className="p-3">2.40 – 3.49</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-900">Third Class</td>
                  <td className="p-3">1.50 – 2.39</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-900">Pass</td>
                  <td className="p-3">1.00 – 1.49</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4.0 Scale Table */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">4.0 Grading Scale (US / Int'l)</h4>
          <div className="overflow-hidden border border-gray-100 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                  <th className="p-3">Class / Honors</th>
                  <th className="p-3">CGPA Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-600">
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-900">Summa Cum Laude (Highest)</td>
                  <td className="p-3">3.80 – 4.00</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-900">Magna Cum Laude (High)</td>
                  <td className="p-3">3.50 – 3.79</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-900">Cum Laude (Honors)</td>
                  <td className="p-3">3.20 – 3.49</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-900">Good / Satisfactory</td>
                  <td className="p-3">2.00 – 3.19</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-gray-900">Pass</td>
                  <td className="p-3">1.00 – 1.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
