import React, { useState } from 'react';
import { X, Moon, Check, Sparkles } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface AddRestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddRestModal: React.FC<AddRestModalProps> = ({ isOpen, onClose }) => {
  const { addSleepLog } = useHealth();

  const [hours, setHours] = useState<number>(7);
  const [minutes, setMinutes] = useState<number>(30); // 0, 15, 30, 45
  const [quality, setQuality] = useState<'great' | 'good' | 'fair' | 'poor'>('good');
  const [restType, setRestType] = useState<string>('Night Sleep');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hours === 0 && minutes === 0) {
      alert('Please select at least 15 minutes of rest or sleep.');
      return;
    }

    const fullNote = [restType, notes.trim()].filter(Boolean).join(' - ');
    addSleepLog(hours, minutes, quality, fullNote);
    onClose();
  };

  const minuteOptions = [0, 15, 30, 45];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rest-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900 border border-slate-200">
        {/* Header */}
        <div className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h2 id="rest-modal-title" className="text-xl font-bold">
                Log Rest & Sleep
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm">
                Record night sleep or an afternoon restorative nap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Quick Type Selection */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Rest Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Night Sleep', 'Afternoon Nap', 'Morning Rest'].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setRestType(t)}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                    restType === t
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Duration: Hours & Minutes */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">
              Sleep Duration <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hours Selector */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Hours
                </span>
                <select
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full py-2 px-3 text-xl font-extrabold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {Array.from({ length: 15 }, (_, i) => (
                    <option key={i} value={i}>
                      {i} {i === 1 ? 'hour' : 'hours'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minutes Selector (0, 15, 30, 45) */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Minutes (Quarter Hours)
                </span>
                <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                  {minuteOptions.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMinutes(m)}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        minutes === m
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Duration Preview Pill */}
            <div className="text-center py-1">
              <span className="text-sm font-extrabold text-indigo-900 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full inline-block">
                Total Rest: {hours} {hours === 1 ? 'hour' : 'hours'}{minutes > 0 ? ` ${minutes} mins` : ''}
              </span>
            </div>
          </div>

          {/* Quality */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              How did you feel upon waking?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'great', label: 'Great', emoji: '🌟' },
                { id: 'good', label: 'Good', emoji: '😊' },
                { id: 'fair', label: 'Fair', emoji: '😐' },
                { id: 'poor', label: 'Restless', emoji: '🥱' },
              ].map((q) => (
                <button
                  type="button"
                  key={q.id}
                  onClick={() => setQuality(q.id as typeof quality)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border-2 flex flex-col items-center gap-1 transition-all ${
                    quality === q.id
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{q.emoji}</span>
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Woke up once for water, felt relaxed"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:outline-none text-sm text-slate-900 font-medium"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Save Rest Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

