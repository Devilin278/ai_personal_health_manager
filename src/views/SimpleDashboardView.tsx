import React, { useState } from 'react';
import {
  Pill,
  CalendarDays,
  Droplets,
  CheckCircle2,
  Phone,
  ShieldAlert,
  ArrowRight,
  Volume2,
  Sparkles,
  Pencil,
  User,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { EditEmergencyContactModal } from '../components/EditEmergencyContactModal';

export const SimpleDashboardView: React.FC = () => {
  const {
    profile,
    medications,
    doseLogs,
    markDose,
    appointments,
    todayWellness,
    incrementWater,
    decrementWater,
    toggleSimpleMode,
    speakText,
  } = useHealth();

  const [isEditEmergencyOpen, setIsEditEmergencyOpen] = useState(false);

  // Next pending dose
  const nextPendingDose = doseLogs.find((d) => d.status === 'pending');
  const nextPendingMed = nextPendingDose
    ? medications.find((m) => m.id === nextPendingDose.medicationId)
    : null;

  // Next upcoming visit
  const nextApt = appointments.find((a) => a.status === 'upcoming') || appointments[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Friendly Senior Greeting Banner */}
      <div className="bg-teal-800 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-teal-200 text-sm font-bold uppercase tracking-wider block">
            Simple View Active
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-1">
            Hello, {profile.preferredName}
          </h2>
          <p className="text-teal-100 text-base sm:text-lg mt-1 font-medium">
            Here are the 3 most important things for you today.
          </p>
        </div>

        <button
          onClick={toggleSimpleMode}
          className="px-5 py-2.5 bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-2xl text-sm sm:text-base shadow-sm transition-colors self-start sm:self-center"
        >
          Switch to Standard View
        </button>
      </div>

      {/* 1. Next Medicine Due (Massive Action Card) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-teal-500 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Pill className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase text-teal-800 tracking-wider">
                Step 1: Your Medicine
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {nextPendingDose ? 'Time for Your Next Dose' : 'All Doses Taken for Today!'}
              </h3>
            </div>
          </div>

          {nextPendingDose && (
            <button
              onClick={() =>
                speakText(
                  `It is time to take your dose of ${nextPendingDose.medicationName}. Scheduled time: ${nextPendingDose.scheduledTime}.`
                )
              }
              className="p-3 bg-teal-50 text-teal-800 rounded-2xl font-bold flex items-center gap-1.5 hover:bg-teal-100"
              title="Listen to medicine instructions"
            >
              <Volume2 className="w-6 h-6" />
              <span className="text-sm">Listen</span>
            </button>
          )}
        </div>

        {nextPendingDose && nextPendingMed ? (
          <div className="space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
              <div className="flex justify-between items-center">
                <h4 className="text-2xl font-extrabold text-slate-900">
                  {nextPendingMed.name} <span className="text-teal-700 font-bold">({nextPendingMed.strength})</span>
                </h4>
                <span className="text-sm bg-teal-700 text-white px-3 py-1 rounded-full font-bold">
                  {nextPendingDose.scheduledTime}
                </span>
              </div>
              <p className="text-lg font-medium text-slate-700 mt-2">
                {nextPendingMed.instructions}
              </p>
              <p className="text-sm font-bold text-amber-800 mt-2">
                🍽️ {nextPendingMed.takeWithFood === 'food' ? 'Please take with your meal' : 'Take with a glass of water'}
              </p>
            </div>

            <button
              onClick={() => markDose(nextPendingDose.id, 'taken')}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xl sm:text-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all active:scale-98"
            >
              <CheckCircle2 className="w-8 h-8" />
              <span>I Have Taken This Dose</span>
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-xl font-bold text-emerald-950">
              Wonderful job! You have taken all your scheduled doses for today.
            </h4>
            <p className="text-emerald-800 text-base">
              Rest comfortably. We will remind you when tomorrow's schedule begins.
            </p>
          </div>
        )}
      </div>

      {/* 2. Hydration Glass Counter (Large & Easy) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
            <Droplets className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase text-sky-800 tracking-wider">
              Step 2: Stay Hydrated
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Water for Today: {todayWellness.waterGlasses} of 8 Glasses
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={decrementWater}
            className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200 font-extrabold text-3xl flex items-center justify-center transition-colors"
            aria-label="Subtract water glass"
          >
            -
          </button>
          <button
            onClick={incrementWater}
            className="flex-1 py-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-2xl text-xl sm:text-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Droplets className="w-7 h-7" />
            <span>I Drank Another Glass (+1)</span>
          </button>
        </div>
      </div>

      {/* 3. Next Doctor Visit */}
      {nextApt && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <CalendarDays className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase text-blue-800 tracking-wider">
                Step 3: Upcoming Doctor Visit
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {nextApt.providerName}
              </h3>
            </div>
          </div>

          <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 space-y-2">
            <p className="text-xl font-bold text-blue-950">
              📅 {nextApt.date} at {nextApt.time}
            </p>
            <p className="text-base font-semibold text-slate-700">
              {nextApt.clinicName} • {nextApt.location}
            </p>
            {nextApt.transitNotes && (
              <p className="text-sm text-slate-600 font-medium">
                🚗 {nextApt.transitNotes}
              </p>
            )}
          </div>

          <a
            href={`tel:${nextApt.phone.replace(/[^0-9]/g, '')}`}
            className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl text-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Phone className="w-6 h-6" />
            <span>Call Clinic ({nextApt.phone})</span>
          </a>
        </div>
      )}

      {/* 4. Family & Emergency Contact Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase text-red-700 tracking-wider">
                Emergency Contact
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {profile.emergencyContact.name}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsEditEmergencyOpen(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm flex items-center gap-1.5 transition-colors"
          >
            <Pencil className="w-4 h-4 text-slate-600" />
            <span>Change</span>
          </button>
        </div>

        <div className="bg-red-50/70 p-5 rounded-2xl border border-red-200 space-y-1">
          <p className="text-base font-bold text-red-950">
            Relationship: {profile.emergencyContact.relationship}
          </p>
          <p className="text-sm font-semibold text-slate-700">
            Phone: {profile.emergencyContact.phone}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${profile.emergencyContact.phone.replace(/[^0-9]/g, '')}`}
            className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Phone className="w-6 h-6" />
            <span>Call {profile.emergencyContact.relationship} ({profile.emergencyContact.phone})</span>
          </a>
          <button
            onClick={() => setIsEditEmergencyOpen(true)}
            className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-base transition-colors"
          >
            Edit Contact Info
          </button>
        </div>
      </div>

      {/* Edit Emergency Contact Modal */}
      <EditEmergencyContactModal
        isOpen={isEditEmergencyOpen}
        onClose={() => setIsEditEmergencyOpen(false)}
      />
    </div>
  );
};

