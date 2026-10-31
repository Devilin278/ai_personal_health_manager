import React, { useState } from 'react';
import { X, Activity, Check } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface AddWalkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddWalkModal: React.FC<AddWalkModalProps> = ({ isOpen, onClose }) => {
  const { addWalkLog } = useHealth();

  const [walkHours, setWalkHours] = useState<number>(0);
  const [walkMinutes, setWalkMinutes] = useState<number>(20); // increments of 5 mins
  const [walkType, setWalkType] = useState<string>('Neighborhood Stroll');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (walkHours === 0 && walkMinutes === 0) {
      alert('Please enter at least 5 minutes of walking.');
      return;
    }

    addWalkLog(walkHours, walkMinutes, walkType, notes.trim() || undefined);
    onClose();
  };

  const fiveMinuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const quickTypes = [
    'Neighborhood Stroll',
    'Garden Walk',
    'Hallway Pacing',
    'Park Walk',
    'Shopping / Mall Walk',
    'Treadmill Walk',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="walk-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900 border border-slate-200">
        {/* Header */}
        <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 id="walk-modal-title" className="text-xl font-bold">
                Log Walk & Movement
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Gentle movement in 5-minute increments
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
          {/* Quick Walk Type */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Type of Walk
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickTypes.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setWalkType(t)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border-2 text-center transition-all ${
                    walkType === t
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Duration: Hours & Minutes in 5 min increments */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">
              Walk Duration <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Hours */}
              <div className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 sm:col-span-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Hours
                </span>
                <select
                  value={walkHours}
                  onChange={(e) => setWalkHours(Number(e.target.value))}
                  className="w-full py-2 px-3 text-lg font-extrabold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {[0, 1, 2, 3, 4, 5].map((h) => (
                    <option key={h} value={h}>
                      {h} {h === 1 ? 'hr' : 'hrs'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minutes in 5-minute increments */}
              <div className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 sm:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Minutes (5-Min Increments)
                  </span>
                  <span className="text-xs font-extrabold text-emerald-800">
                    Selected: {walkMinutes}m
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1 pt-1">
                  {fiveMinuteOptions.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWalkMinutes(m)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        walkMinutes === m
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
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
              <span className="text-sm font-extrabold text-emerald-950 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full inline-block">
                Total Walk Time: {walkHours > 0 ? `${walkHours} hr ` : ''}{walkMinutes} mins
              </span>
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Notes or Route (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mild knee stiffness at start, felt looser after 10 mins"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-emerald-600 focus:outline-none text-sm text-slate-900 font-medium"
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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Save Walk Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
