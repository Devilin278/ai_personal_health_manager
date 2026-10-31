import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  History,
  AlertCircle,
  Volume2,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Medication, MedicationType } from '../types/health';
import { useHealth } from '../context/HealthContext';
import { AddMedicationModal } from '../components/AddMedicationModal';

export const MedicationsView: React.FC = () => {
  const {
    medications,
    deleteMedication,
    doseLogs,
    markDose,
    recordDosageChange,
    speakText,
  } = useHealth();

  const [activeFilter, setActiveFilter] = useState<'all' | 'prescription' | 'supplement' | 'otc'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  // Dosage Change Modal state
  const [dosageChangeMed, setDosageChangeMed] = useState<Medication | null>(null);
  const [newDoseInput, setNewDoseInput] = useState('');
  const [doctorNameInput, setDoctorNameInput] = useState('Dr. Robert Vance');
  const [changeReasonInput, setChangeReasonInput] = useState('');

  // Expandable history drawer state
  const [expandedMedId, setExpandedMedId] = useState<string | null>(null);

  // Filtered meds
  const filteredMeds = medications.filter((med) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'supplement'
        ? med.type === 'supplement' || med.type === 'vitamin'
        : med.type === activeFilter;

    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.genericName && med.genericName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      med.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleOpenDosageChange = (med: Medication) => {
    setDosageChangeMed(med);
    setNewDoseInput(med.strength);
    setChangeReasonInput('');
  };

  const handleSaveDosageChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dosageChangeMed || !newDoseInput.trim()) return;

    recordDosageChange(
      dosageChangeMed.id,
      newDoseInput.trim(),
      doctorNameInput.trim() || 'Attending Physician',
      changeReasonInput.trim() || 'Routine dosage optimization'
    );
    setDosageChangeMed(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Medications & Supplements
            </h2>
            <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-1 rounded-full font-bold">
              {medications.length} total
            </span>
          </div>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Prescriptions, over-the-counter medicines, vitamins, and healthcare recommendations.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingMed(null);
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-teal-700/20 transition-all active:scale-95 text-base"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Medication / Supplement</span>
        </button>
      </div>

      {/* Safety & Clinician Instructions Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-amber-950">
        <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <p className="font-bold text-amber-900 text-base">
            Safe Medication Notice
          </p>
          <p className="mt-0.5 text-amber-800 font-medium">
            Always take medications exactly according to your prescription bottle or clinician’s written instructions. Never stop, start, or alter a dosage without consulting your doctor or pharmacist.
          </p>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, generic name, or health purpose..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-teal-600 focus:outline-hidden text-base bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'prescription', label: 'Prescriptions' },
            { id: 'supplement', label: 'Supplements & Vitamins' },
            { id: 'otc', label: 'Over-The-Counter' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as typeof activeFilter)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                activeFilter === f.id
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medication Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMeds.map((med) => {
          // Check today's dose logs for this med
          const todayDoses = doseLogs.filter((d) => d.medicationId === med.id);
          const isExpanded = expandedMedId === med.id;

          return (
            <div
              key={med.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs uppercase font-extrabold px-2.5 py-1 rounded-full ${
                        med.type === 'prescription'
                          ? 'bg-blue-100 text-blue-800'
                          : med.type === 'supplement'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {med.type === 'prescription' ? 'Prescription' : med.type === 'supplement' ? 'Supplement' : 'OTC'}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                      {med.frequency}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        speakText(
                          `${med.name}, ${med.strength}. ${med.instructions}. Purpose: ${med.purpose}. ${
                            med.takeWithFood === 'food' ? 'Take with food.' : ''
                          }`
                        )
                      }
                      className="p-1.5 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-teal-50 transition-colors"
                      title="Listen to instructions"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingMed(med);
                        setIsAddModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-teal-50 transition-colors"
                      title="Edit medication details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove ${med.name} from your list?`)) {
                          deleteMedication(med.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove medication"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Name, Pill Visual and Strength */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-12 h-12 rounded-2xl border-2 border-slate-300 shrink-0 flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: med.pillColor }}
                    title={`Pill visual: ${med.pillShape}`}
                  >
                    <Pill className="w-6 h-6 text-slate-800" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight break-words">
                      {med.name} <span className="text-teal-700 font-bold">{med.strength}</span>
                    </h3>
                    {med.genericName && (
                      <p className="text-xs text-slate-500 font-medium">
                        Generic: {med.genericName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Purpose Pill */}
                <div className="mt-3">
                  <span className="inline-block bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-lg font-semibold">
                    Purpose: <strong className="text-slate-900">{med.purpose}</strong>
                  </span>
                </div>

                {/* Instructions */}
                <div className="mt-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {med.instructions}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                    <span className="text-teal-800">
                      ⏰ {med.timesOfDay.join(', ')}
                    </span>
                    <span>•</span>
                    <span className="text-amber-800">
                      🍽️ {med.takeWithFood === 'food' ? 'Take with food' : med.takeWithFood === 'empty' ? 'On empty stomach' : 'With or without food'}
                    </span>
                  </div>
                </div>

                {/* Clinician & Pharmacy info */}
                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  {med.prescribingClinician && (
                    <p>
                      <strong>Prescribed / Recommended by:</strong> {med.prescribingClinician}
                    </p>
                  )}
                  {med.refillReminder && (
                    <p className="text-teal-800 font-medium">
                      📦 Remaining: <strong>{med.refillReminder.pillsRemaining} doses</strong>{' '}
                      {med.refillReminder.refillDate && `(Next refill: ~${med.refillReminder.refillDate})`}
                    </p>
                  )}
                </div>

                {/* Dosage Change History Trigger */}
                {med.dosageChangeHistory && med.dosageChangeHistory.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setExpandedMedId(isExpanded ? null : med.id)}
                      className="text-xs text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>
                        Dosage History ({med.dosageChangeHistory.length} change logged)
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-2 bg-teal-50/50 p-3 rounded-xl border border-teal-100 text-xs">
                        {med.dosageChangeHistory.map((hist, idx) => (
                          <div key={idx} className="border-b border-teal-100 last:border-b-0 pb-1.5 last:pb-0">
                            <span className="font-bold text-teal-950 block">{hist.date}: Changed from {hist.previousDose} to {hist.newDose}</span>
                            <span className="text-slate-600">By {hist.changedBy} — {hist.reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions: Dosage Change & Today's Dose Status */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <button
                  onClick={() => handleOpenDosageChange(med)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
                  title="Update dosage instructions given by doctor"
                >
                  <History className="w-3.5 h-3.5 text-teal-700" />
                  <span>Update Dose from Doctor</span>
                </button>

                {/* Quick Dose Logging for today */}
                <div className="flex items-center gap-1.5">
                  {todayDoses.map((dose) => (
                    <button
                      key={dose.id}
                      onClick={() => markDose(dose.id, dose.status === 'taken' ? 'pending' : 'taken')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        dose.status === 'taken'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-teal-50 border border-teal-300 text-teal-900 hover:bg-teal-100'
                      }`}
                      title={dose.status === 'taken' ? `Taken at ${dose.takenAt}` : 'Mark as taken'}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{dose.status === 'taken' ? 'Taken' : dose.scheduledTime}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMeds.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Pill className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No items match your search</h3>
          <p className="text-sm text-slate-500">
            Try choosing "All Items" or searching with a different term.
          </p>
        </div>
      )}

      {/* Add / Edit Medication Modal */}
      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMed(null);
        }}
        editMedication={editingMed}
      />

      {/* Clinician Dosage Update Modal */}
      {dosageChangeMed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-slate-900 border border-slate-200 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              Update Dosage for {dosageChangeMed.name}
            </h3>
            <p className="text-sm text-slate-600">
              Record a dosage instruction update made by your physician or pharmacist.
            </p>

            <form onSubmit={handleSaveDosageChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Previous Dose
                </label>
                <input
                  type="text"
                  disabled
                  value={dosageChangeMed.strength}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  New Dose Prescribed *
                </label>
                <input
                  type="text"
                  required
                  value={newDoseInput}
                  onChange={(e) => setNewDoseInput(e.target.value)}
                  placeholder="e.g. 15 mg daily"
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Clinician Who Instructed Change
                </label>
                <input
                  type="text"
                  value={doctorNameInput}
                  onChange={(e) => setDoctorNameInput(e.target.value)}
                  placeholder="e.g., Dr. Robert Vance"
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Clinical Reason / Note
                </label>
                <textarea
                  rows={2}
                  value={changeReasonInput}
                  onChange={(e) => setChangeReasonInput(e.target.value)}
                  placeholder="e.g., Adjusted to keep resting blood pressure comfortably below 130 mmHg"
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDosageChangeMed(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-sm shadow-md"
                >
                  Save Dosage Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

