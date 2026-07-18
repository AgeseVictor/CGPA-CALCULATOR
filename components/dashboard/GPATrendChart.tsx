'use client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { GradeScale } from '@/lib/types';

interface TrendPoint {
  name: string;
  gpa: number;
  cgpa: number;
}

interface GPATrendChartProps {
  data: TrendPoint[];
  gradeScale: GradeScale;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="tooltip-row">
          <span className="tooltip-dot" style={{ background: entry.color }} />
          <span className="tooltip-name">{entry.name === 'gpa' ? 'Sem GPA' : 'Cum GPA'}</span>
          <span className="tooltip-value" style={{ color: entry.color }}>
            {entry.value.toFixed(2)}
          </span>
        </div>
      ))}
      <style jsx>{`
        .chart-tooltip {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-muted);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          box-shadow: var(--shadow-lg);
          font-size: 0.82rem;
          min-width: 160px;
        }
        .tooltip-label {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
          font-size: 0.8rem;
        }
        .tooltip-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: 2px 0;
        }
        .tooltip-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .tooltip-name { color: var(--text-muted); flex: 1; }
        .tooltip-value { font-weight: 700; font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
};

export function GPATrendChart({ data, gradeScale }: GPATrendChartProps) {
  const maxScale = parseFloat(gradeScale);

  if (data.length < 2) {
    return (
      <div className="chart-empty">
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
          Add at least 2 semesters to see your GPA trend chart.
        </p>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="gradCGPA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradGPA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--border-subtle)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, maxScale]}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickCount={maxScale === 4 ? 5 : 6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)', paddingTop: '12px' }}
            formatter={(value) => value === 'gpa' ? 'Semester GPA' : 'Cumulative GPA'}
          />
          <Area
            type="monotone"
            dataKey="gpa"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#gradGPA)"
            dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: '#8b5cf6' }}
          />
          <Area
            type="monotone"
            dataKey="cgpa"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#gradCGPA)"
            dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 7, fill: '#6366f1' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
