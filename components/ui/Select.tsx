import React from 'react';

interface SelectOption { label: string; value: string | number; }

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export function Select({ label, options, error, className = '', id, ...props }: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className={`form-field ${className}`}>
      {label && <label className="form-label" htmlFor={selectId}>{label}</label>}
      <select id={selectId} className="form-input form-select" {...props}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className="form-error" role="alert">{error}</span>}
    </div>
  );
}
