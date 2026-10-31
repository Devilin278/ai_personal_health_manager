import React, { useState } from 'react';
import {
  CalendarDays,
  Pill,
  Droplets,
  Heart,
  Activity,
  CheckCircle2,
  Clock,
  Volume2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Plus,
  Printer,
  ShieldAlert,
  Pencil,
  Phone,
  User,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { PrintableSummaryModal } from '../components/PrintableSummaryModal';
import { AddMedicationModal } from '../components/AddMedicationModal';
import { AddAppointmentModal } from '../components/AddAppointmentModal';
import { EditEmergencyContactModal } from '../components/EditEmergencyContactModal';

export const DashboardView: React.FC = () => {
  const {
    profile,
    medications,
    doseLogs,
    markDose,
    appointments,
    todayWellness,
    incrementWater,
    decrementWater,
    setActiveTab,
    openAiChat,
    speakText,
    triggerSampleReminder,
  } = useHealth();

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isAddAptOpen, setIsAddAptOpen] = useState(false);
  const [isEditEmergencyOpen, setIsEditEmergencyOpen] = useState(false);

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Stats calculation
  const totalDosesToday = doseLogs.length;
  const takenDosesToday = doseLogs.filter((d) => d.status === 'taken').length;
  const adherenceRate =
    totalDosesToday > 0 ? Math.round((takenDosesToday / totalDosesToday) * 100) : 100;

  // Upcoming appointment
  const nextAppointment = appointments.find((a) => a.status === 'upcoming') || appointments[0];

  const handleReadDashboard = () => {
    const text = `Hello ${profile.preferredName}. Today, you have taken ${takenDosesToday} of ${totalDosesToday} scheduled doses. ${
      nextAppointment ? `Your next upcoming visit is with ${nextAppointment.providerName} on ${nextAppointment.date} at ${nextAppointment.time}.` : ''
    } You have drunk ${todayWellness.waterGlasses} glasses of water today.`;
    speakText(text);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-teal-200 text-sm font-bold uppercase tracking-wider">
                Personal Health Overview
              </span>
              <button
                onClick={handleReadDashboard}
                className="bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Listen to daily summary"
                aria-label="Listen to daily summary"
              >
                <Volume2 className="w-3.5 h-3.5 text-teal-200" />
                <span>Listen</span>
              </button>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {greeting}, {profile.preferredName}!
            </h2>
            <p className="text-teal-100 text-sm sm:text-base max-w-2xl font-medium">
              You are doing wonderfully. Here is your daily medication schedule, health notes, and upcoming appointments.
            </p>

            {/* Quick Profile Pill Strip */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="bg-teal-900/60 border border-teal-500/30 px-3 py-1 rounded-full font-semibold">
                Blood Type: {profile.bloodType}
              </span>
              <span className="bg-teal-900/60 border border-teal-500/30 px-3 py-1 rounded-full font-semibold">
                Doctor: {profile.primaryDoctor.name}
              </span>
              <button
                onClick={() => setIsEditEmergencyOpen(true)}
                className="bg-red-950/70 hover:bg-red-900/90 border border-red-400/40 text-red-100 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 transition-all text-xs sm:text-sm active:scale-95 cursor-pointer shadow-xs"
                title="Click to update emergency contact"
              >
                <Phone className="w-3.5 h-3.5 text-red-300" />
                <span>Emergency: {profile.emergencyContact.name} ({profile.emergencyContact.relationship})</span>
                <Pencil className="w-3 h-3 text-red-300" />
              </button>
              <span className="bg-rose-950/60 border border-rose-400/30 text-rose-200 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-300" /> Allergies: {profile.allergies.map(a => a.allergen).join(', ')}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-5 py-3 bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-sm sm:text-base"
            >
              <Printer className="w-5 h-5 text-teal-700" />
              <span>Doctor Visit Sheet</span>
            </button>
            <button
              onClick={() => triggerSampleReminder('Lisinopril 10 mg', '8:00 AM')}
              className="px-4 py-2.5 bg-teal-600/80 hover:bg-teal-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 border border-teal-400/30 text-xs sm:text-sm transition-colors"
            >
              <Clock className="w-4 h-4 text-teal-200" />
              <span>Test Audio Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Meds (Left 7 cols) & Appointments / Wellness (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Medication Action Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Pill className="w-6 h-6 text-teal-600" />
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Today's Medication Checklist
                  </h3>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  {takenDosesToday} of {totalDosesToday} completed today ({adherenceRate}% adherence)
                </p>
              </div>

              <button
                onClick={() => setIsAddMedOpen(true)}
                className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors border border-teal-200"
              >
                <Plus className="w-4 h-4" /> Add Med
              </button>
            </div>

            {/* Adherence Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${adherenceRate}%` }}
              ></div>
            </div>

            {/* Dose Cards List */}
            <div className="space-y-3">
              {doseLogs.map((log) => {
                const med = medications.find((m) => m.id === log.medicationId);
                const isTaken = log.status === 'taken';
                const isSkipped = log.status === 'skipped';

                return (
                  <div
                    key={log.id}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isTaken
                        ? 'bg-emerald-50/60 border-emerald-300 text-slate-800'
                        : isSkipped
                        ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                        : 'bg-white border-slate-200 hover:border-teal-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Pill Shape / Color Badge */}
                      <div
                        className="w-10 h-10 rounded-xl border-2 border-slate-300 shrink-0 flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: med?.pillColor || '#ffffff' }}
                        title={med?.form}
                      >
                        <Pill className="w-5 h-5 text-slate-700" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-base font-bold break-words ${isTaken ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {log.medicationName}
                          </h4>
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                            {log.scheduledTime}
                          </span>
                        </div>
                        {med && (
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            {med.instructions} • {med.takeWithFood === 'food' ? 'Take with food' : 'With water'}
                          </p>
                        )}
                        {log.takenAt && (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Taken at {log.takenAt}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isTaken ? (
                        <button
                          onClick={() => markDose(log.id, 'pending')}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                        >
                          Undo
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => markDose(log.id, 'skipped')}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                          >
                            Skip
                          </button>
                          <button
                            onClick={() => markDose(log.id, 'taken')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark Taken</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setActiveTab('medications')}
                className="text-teal-700 hover:text-teal-800 text-sm font-bold inline-flex items-center gap-1.5"
              >
                <span>View Full Medication & Supplement Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Doctor Preparation Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-blue-800 tracking-wider">
                Appointment Preparation
              </span>
              <h4 className="font-bold text-slate-900 text-base">
                Preparing questions for your doctor or pharmacist?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Generate tailored questions based on your current medications and health trends.
              </p>
            </div>
            <button
              onClick={() => openAiChat('Prepare questions for my doctor')}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm shrink-0 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Scott (AI Assistant)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Upcoming Doctor Visit & Daily Wellness */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Contact Quick Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-extrabold text-slate-900">
                  Emergency Contact
                </h3>
              </div>
              <button
                onClick={() => setIsEditEmergencyOpen(true)}
                className="text-xs font-bold text-red-700 hover:text-red-900 hover:underline flex items-center gap-1"
                aria-label="Update emergency contact"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Update</span>
              </button>
            </div>

            <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-base">
                    {profile.emergencyContact.name}
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                    {profile.emergencyContact.relationship}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-red-600" />
                  <span>{profile.emergencyContact.phone}</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Called first by emergency responders & clinic staff
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${profile.emergencyContact.phone.replace(/[^0-9]/g, '')}`}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <button
                  onClick={() => setIsEditEmergencyOpen(true)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Appointment Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-extrabold text-slate-900">
                  Upcoming Doctor Visit
                </h3>
              </div>
              <button
                onClick={() => setIsAddAptOpen(true)}
                className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                title="Add appointment"
                aria-label="Add appointment"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {nextAppointment ? (
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
                      {nextAppointment.specialty}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900">
                      {nextAppointment.providerName}
                    </h4>
                    <p className="text-xs text-slate-600">{nextAppointment.clinicName}</p>
                  </div>
                  <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                    {nextAppointment.visitType}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1 text-sm font-semibold text-slate-800">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-blue-600" />
                    <span>{nextAppointment.date} at {nextAppointment.time}</span>
                  </p>
                  {nextAppointment.transitNotes && (
                    <p className="text-xs text-slate-500 font-normal mt-1">
                      🚗 {nextAppointment.transitNotes}
                    </p>
                  )}
                </div>

                {/* Checklist Preview */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Preparation Checklist:</span>
                    <span>
                      {nextAppointment.checklist.filter(c => c.completed).length} / {nextAppointment.checklist.length} ready
                    </span>
                  </div>
                  <div className="space-y-1">
                    {nextAppointment.checklist.slice(0, 2).map((item) => (
                      <div key={item.id} className="text-xs text-slate-700 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.completed ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                        <span className="truncate">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('appointments')}
                  className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Open Visit Preparation & Checklist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">
                No upcoming visits scheduled.
              </p>
            )}
          </div>

          {/* Daily Wellness Quick Counters */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-teal-600" />
                <h3 className="text-xl font-extrabold text-slate-900">
                  Daily Wellness Check
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('wellness')}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                View History
              </button>
            </div>

            {/* Hydration Tracker */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Water Intake</h4>
                  <p className="text-xs text-slate-600">
                    {todayWellness.waterGlasses} of 8 glasses today
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={decrementWater}
                  className="w-9 h-9 rounded-xl bg-white border border-sky-300 text-sky-800 font-bold hover:bg-sky-100 flex items-center justify-center text-lg transition-colors"
                  aria-label="Decrease water glasses"
                >
                  -
                </button>
                <span className="w-8 text-center font-extrabold text-lg text-slate-800">
                  {todayWellness.waterGlasses}
                </span>
                <button
                  onClick={incrementWater}
                  className="w-9 h-9 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 flex items-center justify-center text-lg shadow-sm transition-all active:scale-95"
                  aria-label="Add water glass"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick Metrics: Sleep & Activity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Gentle Movement
                </span>
                <p className="text-2xl font-extrabold text-slate-900">
                  {todayWellness.activityMinutes} <span className="text-sm font-semibold text-slate-500">mins</span>
                </p>
                <p className="text-xs text-teal-700 font-semibold mt-0.5 truncate">
                  {todayWellness.activityType}
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Last Night Sleep
                </span>
                <p className="text-2xl font-extrabold text-slate-900">
                  {todayWellness.sleepHours} <span className="text-sm font-semibold text-slate-500">hrs</span>
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5 capitalize">
                  Quality: {todayWellness.sleepQuality}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PrintableSummaryModal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} />
      <AddMedicationModal isOpen={isAddMedOpen} onClose={() => setIsAddMedOpen(false)} />
      <AddAppointmentModal isOpen={isAddAptOpen} onClose={() => setIsAddAptOpen(false)} />
      <EditEmergencyContactModal isOpen={isEditEmergencyOpen} onClose={() => setIsEditEmergencyOpen(false)} />
    </div>
  );
};

