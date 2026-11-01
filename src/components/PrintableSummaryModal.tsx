import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Printer, Download, X, Heart, ShieldCheck, Pencil } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { getTodayDateString } from '../data/mockData';
import { EditEmergencyContactModal } from './EditEmergencyContactModal';

interface PrintableSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableSummaryModal: React.FC<PrintableSummaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, medications, appointments, wellnessData } = useHealth();
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [isEditEmergencyOpen, setIsEditEmergencyOpen] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = getTodayDateString();
  const latestWellness = wellnessData[0];

  return (
    <>
      {createPortal(
        <div
          className="fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 border border-slate-300 m-auto my-auto">
        {/* Top Action Bar */}
        <div className="bg-teal-800 text-white px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-teal-300" />
            <h2 className="text-xl font-bold">Printable Doctor Visit Health Summary</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-xl flex items-center gap-2 shadow transition-colors"
            >
              <Printer className="w-5 h-5" /> Print Summary Sheet
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-teal-700 text-white transition-colors"
              aria-label="Close summary modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div
          ref={printAreaRef}
          className="p-8 overflow-y-auto space-y-6 text-slate-800 print:p-0 print:m-0 text-sm leading-relaxed"
          id="printable-health-summary"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-base text-slate-600 font-medium mt-1">
                Personal Health & Medication Summary — For Healthcare Providers
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-bold text-slate-700">Generated: {todayStr}</p>
              <p>DOB: <strong className="text-slate-800">{profile.dateOfBirth}</strong></p>
              <p>Blood Type: <strong className="text-slate-800">{profile.bloodType}</strong></p>
            </div>
          </div>

          {/* Critical Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300 print:border-slate-400">
            {/* Allergies */}
            <div className="border-l-4 border-red-500 pl-3">
              <span className="text-xs font-bold uppercase text-red-700 tracking-wider">
                Drug Allergies
              </span>
              <ul className="mt-1 space-y-0.5 text-xs sm:text-sm">
                {profile.allergies.map((a, i) => (
                  <li key={i} className="font-bold text-red-900">
                    • {a.allergen} ({a.reaction})
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Contacts */}
            <div className="border-l-4 border-blue-500 pl-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-blue-800 tracking-wider">
                  Emergency Contact
                </span>
                <button
                  onClick={() => setIsEditEmergencyOpen(true)}
                  className="print:hidden text-[11px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 hover:underline"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              </div>
              <p className="font-bold text-slate-900 mt-1">
                {profile.emergencyContact.name} ({profile.emergencyContact.relationship})
              </p>
              <p className="text-xs text-slate-700 font-semibold">{profile.emergencyContact.phone}</p>
            </div>

            {/* Primary Care Physician */}
            <div className="border-l-4 border-teal-600 pl-3">
              <span className="text-xs font-bold uppercase text-teal-800 tracking-wider">
                Primary Doctor & Pharmacy
              </span>
              <p className="font-bold text-slate-900 mt-1">{profile.primaryDoctor.name}</p>
              <p className="text-xs text-slate-700">{profile.primaryDoctor.clinic} • {profile.primaryDoctor.phone}</p>
              <p className="text-xs text-slate-500 mt-1">Pharmacy: {profile.preferredPharmacy.name} ({profile.preferredPharmacy.phone})</p>
            </div>
          </div>

          {/* Active Diagnoses */}
          <div>
            <h3 className="font-bold text-base text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              Active Diagnoses & Conditions
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.chronicConditions.map((cond, i) => (
                <span
                  key={i}
                  className="bg-slate-200 text-slate-800 px-3 py-1 rounded-md text-xs sm:text-sm font-semibold"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>

          {/* Complete Medication & Supplement Table */}
          <div>
            <h3 className="font-bold text-base text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              Current Medications & Supplements ({medications.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-300 text-xs sm:text-sm min-w-[550px] print:min-w-full">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 p-2 font-bold">Medication / Supplement</th>
                  <th className="border border-slate-300 p-2 font-bold">Strength & Form</th>
                  <th className="border border-slate-300 p-2 font-bold">Instructions & Timing</th>
                  <th className="border border-slate-300 p-2 font-bold">Purpose</th>
                  <th className="border border-slate-300 p-2 font-bold">Prescriber / Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 p-2 font-bold text-slate-900">
                      {med.name}
                      <span className="block text-[11px] font-normal text-slate-500">
                        {med.type === 'prescription' ? 'Prescription' : med.type === 'supplement' ? 'Supplement' : 'OTC'}
                      </span>
                    </td>
                    <td className="border border-slate-300 p-2">
                      {med.strength} ({med.form})
                    </td>
                    <td className="border border-slate-300 p-2">
                      <p className="font-medium text-slate-800">{med.instructions}</p>
                      <span className="text-[11px] text-teal-800 font-semibold block mt-0.5">
                        Schedule: {med.timesOfDay.join(', ')}
                      </span>
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-700">{med.purpose}</td>
                    <td className="border border-slate-300 p-2 text-slate-600">
                      {med.prescribingClinician || 'Self / OTC'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Recent Vitals & Trends */}
          {latestWellness && latestWellness.bloodPressure && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-teal-50 border border-teal-200 p-3 rounded-xl text-center">
              <div>
                <span className="text-xs text-teal-800 font-semibold">Latest Blood Pressure</span>
                <p className="text-lg font-extrabold text-teal-950">
                  {latestWellness.bloodPressure.systolic}/{latestWellness.bloodPressure.diastolic} mmHg
                </p>
                <span className="text-[10px] text-teal-700">Pulse: {latestWellness.bloodPressure.pulse} bpm</span>
              </div>
              <div>
                <span className="text-xs text-teal-800 font-semibold">Current Weight</span>
                <p className="text-lg font-extrabold text-teal-950">
                  {latestWellness.weightLbs ? `${latestWellness.weightLbs} lbs` : '148 lbs'}
                </p>
              </div>
              <div>
                <span className="text-xs text-teal-800 font-semibold">Daily Hydration</span>
                <p className="text-lg font-extrabold text-teal-950">
                  {latestWellness.waterGlasses} glasses / day
                </p>
              </div>
              <div>
                <span className="text-xs text-teal-800 font-semibold">Average Sleep</span>
                <p className="text-lg font-extrabold text-teal-950">
                  {latestWellness.sleepHours} hrs ({latestWellness.sleepQuality})
                </p>
              </div>
            </div>
          )}

          {/* Upcoming Appointments */}
          <div>
            <h3 className="font-bold text-base text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              Upcoming Scheduled Visits
            </h3>
            <div className="space-y-2">
              {appointments.slice(0, 2).map((apt) => (
                <div key={apt.id} className="border border-slate-300 rounded-lg p-2.5 flex justify-between items-center text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-900">{apt.providerName}</span> — {apt.specialty}
                    <p className="text-slate-600">{apt.clinicName}</p>
                  </div>
                  <div className="text-right font-semibold text-slate-800">
                    <p>{apt.date} at {apt.time}</p>
                    <span className="text-xs text-teal-700 uppercase font-bold">{apt.visitType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinician Notes Blank Space */}
          <div className="border border-dashed border-slate-400 p-4 rounded-xl mt-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-6">
              Doctor / Clinician Visit Notes & Adjustments:
            </h4>
            <div className="border-b border-slate-300 my-4"></div>
            <div className="border-b border-slate-300 my-4"></div>
            <div className="border-b border-slate-300 my-4"></div>
            <div className="flex justify-between text-xs text-slate-500 pt-2">
              <span>Clinician Signature: _______________________</span>
              <span>Date: ____________</span>
            </div>
          </div>

          {/* Safety Disclaimer */}
          <div className="text-[11px] text-slate-500 text-center pt-2">
            This document is prepared by the patient using CareCompanion personal health records. It is intended to facilitate patient-clinician communication and does not replace official medical hospital records.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end gap-3 shrink-0 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center gap-2 shadow transition-colors"
          >
            <Printer className="w-5 h-5" /> Print Now
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}

  {/* Edit Emergency Contact Modal */}
  <EditEmergencyContactModal
    isOpen={isEditEmergencyOpen}
    onClose={() => setIsEditEmergencyOpen(false)}
  />
</>
  );
};

