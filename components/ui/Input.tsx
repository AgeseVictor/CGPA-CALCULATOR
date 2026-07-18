import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className={`form-field ${className}`}>
      {label && <label className="form-label" htmlFor={inputId}>{label}</label>}
      <input id={inputId} className={`form-input ${error ? 'input-error' : ''}`} {...props} />
      {error && <span className="form-error" role="alert">{error}</span>}
    </div>
  );
}
