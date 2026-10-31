import React, { useState } from 'react';
import { X, Heart, Check, Activity } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface AddBpmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBpmModal: React.FC<AddBpmModalProps> = ({ isOpen, onClose }) => {
  const { addBpmLog, todayWellness } = useHealth();

  const [bpm, setBpm] = useState<number>(todayWellness.bloodPressure?.pulse || 70);
  const [systolic, setSystolic] = useState<number>(todayWellness.bloodPressure?.systolic || 124);
  const [diastolic, setDiastolic] = useState<number>(todayWellness.bloodPressure?.diastolic || 78);
  const [includeBP, setIncludeBP] = useState<boolean>(true);
  const [contextTag, setContextTag] = useState<string>('Resting Morning');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bpm || bpm <= 30 || bpm >= 240) {
      alert('Please enter a valid pulse / heart rate between 30 and 240 BPM.');
      return;
    }

    const noteText = [contextTag, notes.trim()].filter(Boolean).join(' - ');
    addBpmLog(
      Number(bpm),
      includeBP && systolic ? Number(systolic) : undefined,
      includeBP && diastolic ? Number(diastolic) : undefined,
      noteText
    );
    onClose();
  };

  const quickContextTags = [
    'Resting Morning',
    'Post-Medication',
    'After Walk / Exercise',
    'Afternoon Check',
    'Evening Bedtime',
    'Feeling Lightheaded',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bpm-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900 border border-slate-200">
        {/* Header */}
        <div className="bg-rose-600 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 id="bpm-modal-title" className="text-xl font-bold">
                Log Heart Rate (BPM) & Vitals
              </h2>
              <p className="text-rose-100 text-xs sm:text-sm">
                Track pulse readings throughout your day
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
          {/* Quick Context Chips */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Measurement Context
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickContextTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setContextTag(tag)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border-2 text-center transition-all ${
                    contextTag === tag
                      ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Heart Rate / Pulse BPM */}
          <div className="bg-rose-50/70 p-4 rounded-2xl border-2 border-rose-200 space-y-2">
            <label className="block text-sm font-extrabold text-rose-950">
              Heart Rate / Pulse <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="35"
                max="220"
                required
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                placeholder="e.g. 70"
                className="w-32 px-4 py-2.5 text-2xl font-extrabold bg-white border-2 border-rose-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <span className="text-base font-extrabold text-slate-700">
                Beats Per Minute (BPM)
              </span>
            </div>
            <p className="text-xs text-rose-800 font-medium">
              Target for older adults resting pulse is generally 60 to 100 BPM.
            </p>
          </div>

          {/* Optional Blood Pressure */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">
                Include Blood Pressure Reading?
              </label>
              <input
                type="checkbox"
                id="includeBP"
                checked={includeBP}
                onChange={(e) => setIncludeBP(e.target.checked)}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>

            {includeBP && (
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Systolic (Top)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="70"
                      max="240"
                      value={systolic}
                      onChange={(e) => setSystolic(Number(e.target.value))}
                      placeholder="120"
                      className="w-full px-3 py-2 text-lg font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <span className="text-xs text-slate-500 font-bold">mmHg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Diastolic (Bottom)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="40"
                      max="140"
                      value={diastolic}
                      onChange={(e) => setDiastolic(Number(e.target.value))}
                      placeholder="80"
                      className="w-full px-3 py-2 text-lg font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <span className="text-xs text-slate-500 font-bold">mmHg</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Measured while seated after sitting quietly for 5 minutes"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-rose-500 focus:outline-none text-sm text-slate-900 font-medium"
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
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Save Heart Rate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
