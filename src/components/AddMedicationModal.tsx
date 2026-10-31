import React, { useState } from 'react';
import { X, Pill, AlertCircle, Check } from 'lucide-react';
import { Medication, MedicationType } from '../types/health';
import { useHealth } from '../context/HealthContext';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMedication?: Medication | null;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  editMedication,
}) => {
  const { addMedication, updateMedication } = useHealth();

  const [name, setName] = useState(editMedication?.name || '');
  const [genericName, setGenericName] = useState(editMedication?.genericName || '');
  const [strength, setStrength] = useState(editMedication?.strength || '');
  const [form, setForm] = useState<Medication['form']>(editMedication?.form || 'tablet');
  const [pillColor, setPillColor] = useState(editMedication?.pillColor || '#ffffff');
  const [pillShape, setPillShape] = useState<Medication['pillShape']>(editMedication?.pillShape || 'round');
  const [type, setType] = useState<MedicationType>(editMedication?.type || 'prescription');
  const [instructions, setInstructions] = useState(editMedication?.instructions || '');
  const [frequency, setFrequency] = useState(editMedication?.frequency || 'Once daily');
  const [takeWithFood, setTakeWithFood] = useState<Medication['takeWithFood']>(editMedication?.takeWithFood || 'either');
  const [prescribingClinician, setPrescribingClinician] = useState(editMedication?.prescribingClinician || '');
  const [clinicName, setClinicName] = useState(editMedication?.clinicName || '');
  const [purpose, setPurpose] = useState(editMedication?.purpose || '');
  const [notes, setNotes] = useState(editMedication?.notes || '');
  const [pillsRemaining, setPillsRemaining] = useState<number>(editMedication?.refillReminder?.pillsRemaining || 30);

  // Scheduled times selection
  const [timeMorning, setTimeMorning] = useState(true);
  const [timeAfternoon, setTimeAfternoon] = useState(false);
  const [timeEvening, setTimeEvening] = useState(false);
  const [timeBedtime, setTimeBedtime] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !strength.trim()) {
      alert('Please enter medication name and strength.');
      return;
    }

    const timesOfDay: string[] = [];
    const scheduledHours: string[] = [];

    if (timeMorning) {
      timesOfDay.push('Morning (8:00 AM)');
      scheduledHours.push('08:00');
    }
    if (timeAfternoon) {
      timesOfDay.push('Afternoon (1:00 PM)');
      scheduledHours.push('13:00');
    }
    if (timeEvening) {
      timesOfDay.push('Evening (6:30 PM)');
      scheduledHours.push('18:30');
    }
    if (timeBedtime) {
      timesOfDay.push('Bedtime (9:30 PM)');
      scheduledHours.push('21:30');
    }

    if (timesOfDay.length === 0) {
      timesOfDay.push('Morning (8:00 AM)');
      scheduledHours.push('08:00');
    }

    const medData = {
      name,
      genericName: genericName.trim() || undefined,
      strength,
      form,
      pillColor,
      pillShape,
      type,
      instructions: instructions || `Take 1 ${form} ${frequency.toLowerCase()}`,
      frequency,
      timesOfDay,
      scheduledHours,
      prescribingClinician: prescribingClinician.trim() || undefined,
      clinicName: clinicName.trim() || undefined,
      startDate: editMedication?.startDate || new Date().toISOString().split('T')[0],
      takeWithFood,
      purpose: purpose || 'Health maintenance',
      notes: notes.trim() || undefined,
      refillReminder: {
        pillsRemaining: Number(pillsRemaining) || 30,
        pharmacyPhone: '(555) 789-0123',
      },
    };

    if (editMedication) {
      updateMedication(editMedication.id, medData);
    } else {
      addMedication(medData);
    }

    onClose();
  };

  const pillColors = [
    { label: 'White', color: '#ffffff', border: 'border-slate-300' },
    { label: 'Yellow', color: '#fef08a', border: 'border-yellow-400' },
    { label: 'Blue', color: '#93c5fd', border: 'border-blue-400' },
    { label: 'Pink/Coral', color: '#fca5a5', border: 'border-rose-400' },
    { label: 'Amber/Orange', color: '#fed7aa', border: 'border-amber-400' },
    { label: 'Green', color: '#bbf7d0', border: 'border-emerald-400' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 border border-slate-200">
        {/* Header */}
        <div className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Pill className="w-7 h-7" />
            <div>
              <h2 className="text-xl font-bold">
                {editMedication ? 'Edit Medication or Supplement' : 'Add Medication or Supplement'}
              </h2>
              <p className="text-teal-100 text-xs sm:text-sm">
                Enter details exactly as printed on your prescription label
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-teal-800 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Safety Banner */}
        <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200 flex items-center gap-2 text-amber-900 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Safety Note:</strong> Reminders must follow your doctor or pharmacist's label. Never alter dosage without consulting them.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Item Type Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Type of Item
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'prescription', label: 'Prescription' },
                  { id: 'supplement', label: 'Supplement / Vitamin' },
                  { id: 'otc', label: 'Over-The-Counter' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                    type === t.id
                      ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Strength */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Name of Medication / Product *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Lisinopril, Calcium D3"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Strength / Dose *
              </label>
              <input
                type="text"
                required
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="e.g., 10 mg, 500 mg, 2 drops"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base font-semibold"
              />
            </div>
          </div>

          {/* Form & Pill Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Form
              </label>
              <select
                value={form}
                onChange={(e) => setForm(e.target.value as Medication['form'])}
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base font-semibold bg-white"
              >
                <option value="tablet">Tablet (Pill)</option>
                <option value="capsule">Capsule</option>
                <option value="liquid">Liquid / Drops</option>
                <option value="inhaler">Inhaler</option>
                <option value="topical">Topical Cream / Ointment</option>
                <option value="injection">Injection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Pill Visual Color
              </label>
              <div className="flex items-center gap-2 pt-1">
                {pillColors.map((pc) => (
                  <button
                    key={pc.color}
                    type="button"
                    onClick={() => setPillColor(pc.color)}
                    style={{ backgroundColor: pc.color }}
                    className={`w-8 h-8 rounded-full border-2 ${pc.border} flex items-center justify-center transition-transform ${
                      pillColor === pc.color ? 'scale-125 ring-2 ring-teal-600 ring-offset-1' : ''
                    }`}
                    title={pc.label}
                  >
                    {pillColor === pc.color && <Check className="w-4 h-4 text-slate-800" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Instructions (From Prescription Label)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., Take 1 tablet daily in the morning with a full glass of water"
              className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base"
            />
          </div>

          {/* Times to Take */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Times of Day to Take
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer font-semibold text-sm ${
                  timeMorning ? 'bg-teal-50 border-teal-600 text-teal-900' : 'border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={timeMorning}
                  onChange={(e) => setTimeMorning(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span>Morning (8am)</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer font-semibold text-sm ${
                  timeAfternoon ? 'bg-teal-50 border-teal-600 text-teal-900' : 'border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={timeAfternoon}
                  onChange={(e) => setTimeAfternoon(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span>Lunch (1pm)</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer font-semibold text-sm ${
                  timeEvening ? 'bg-teal-50 border-teal-600 text-teal-900' : 'border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={timeEvening}
                  onChange={(e) => setTimeEvening(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span>Dinner (6:30pm)</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer font-semibold text-sm ${
                  timeBedtime ? 'bg-teal-50 border-teal-600 text-teal-900' : 'border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={timeBedtime}
                  onChange={(e) => setTimeBedtime(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span>Bedtime (9:30pm)</span>
              </label>
            </div>
          </div>

          {/* Food Instructions & Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Take with Food?
              </label>
              <select
                value={takeWithFood}
                onChange={(e) => setTakeWithFood(e.target.value as Medication['takeWithFood'])}
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base bg-white"
              >
                <option value="either">With or without food (Either)</option>
                <option value="food">Take with meal or snack</option>
                <option value="empty">Take on empty stomach (1h before/2h after meal)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Health Purpose
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Blood pressure, Bone strength"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base"
              />
            </div>
          </div>

          {/* Prescribing Clinician & Pill Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Prescribing Doctor or Clinician
              </label>
              <input
                type="text"
                value={prescribingClinician}
                onChange={(e) => setPrescribingClinician(e.target.value)}
                placeholder="e.g., Dr. Robert Vance"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Pills / Doses in Bottle Remaining
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={pillsRemaining}
                onChange={(e) => setPillsRemaining(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base font-semibold"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Important Notes / Doctor Tips
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Avoid grapefruit, drink plenty of water"
              className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-base flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>{editMedication ? 'Save Changes' : 'Add Medication'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

