'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface AddSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
  currentCount: number;
}

const QUICK_NAMES = [
  'Year 1 · Semester 1',
  'Year 1 · Semester 2',
  'Year 2 · Semester 1',
  'Year 2 · Semester 2',
  'Year 3 · Semester 1',
  'Year 3 · Semester 2',
  'Year 4 · Semester 1',
  'Year 4 · Semester 2',
];

export function AddSemesterModal({ isOpen, onClose, onAdd, currentCount }: AddSemesterModalProps) {
  const defaultName = QUICK_NAMES[currentCount] ?? `Semester ${currentCount + 1}`;
  const [name, setName] = useState(defaultName);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    const nextDefault = QUICK_NAMES[currentCount + 1] ?? `Semester ${currentCount + 2}`;
    setName(nextDefault);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Semester">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Name your semester to keep things organized.
        </p>

        <div>
          <label className="form-label" htmlFor="semester-name">Semester Name</label>
          <input
            id="semester-name"
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="e.g. Year 1 · Semester 1"
            autoFocus
          />
        </div>

        {/* Quick select chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {QUICK_NAMES.map((n) => (
            <button
              key={n}
              className={`quick-chip ${name === n ? 'quick-chip-active' : ''}`}
              onClick={() => setName(n)}
              type="button"
            >
              {n}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd} disabled={!name.trim()} style={{ flex: 1 }}>
            Add Semester
          </Button>
        </div>
      </div>

      <style jsx>{`
        .quick-chip {
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 500;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .quick-chip:hover {
          border-color: var(--border-focus);
          color: var(--accent-light);
        }
        .quick-chip-active {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.4);
          color: var(--accent-light);
        }
      `}</style>
    </Modal>
  );
}
