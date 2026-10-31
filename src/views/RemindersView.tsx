import React, { useState } from 'react';
import {
  Clock,
  Bell,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Calendar,
  Send,
  Shield,
  Smartphone,
  Pill,
  Sparkles,
  HeartHandshake,
  UserPlus,
  Settings,
  Trash2,
  Phone,
  Mail,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { CaregiverModal } from '../components/CaregiverModal';

export const RemindersView: React.FC = () => {
  const {
    medications,
    doseLogs,
    markDose,
    profile,
    updateProfile,
    playReminderChime,
    triggerSampleReminder,
    speakText,
  } = useHealth();

  const [activeTab, setActiveTab] = useState<'all' | 'medication' | 'supplement'>('all');
  const [snoozeInterval, setSnoozeInterval] = useState<'15' | '30' | '60'>('15');
  const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState(false);

  // Group doses into time slots:
  // Morning (before 11am), Midday (11am-3pm), Evening (3pm-8pm), Bedtime (8pm onwards)
  const timeSlots = [
    { id: 'morning', title: 'Morning Routine (7:00 AM - 10:00 AM)', icon: '🌅' },
    { id: 'midday', title: 'Midday & Lunch (11:00 AM - 2:00 PM)', icon: '☀️' },
    { id: 'evening', title: 'Evening & Dinner (5:00 PM - 7:30 PM)', icon: '🌇' },
    { id: 'bedtime', title: 'Night & Bedtime (8:30 PM - 10:30 PM)', icon: '🌙' },
  ];

  // Helper to categorize log into slot
  const categorizeSlot = (scheduledTime: string) => {
    const timeLower = scheduledTime.toLowerCase();
    if (timeLower.includes('morning') || timeLower.includes('8:00') || timeLower.includes('8:30')) return 'morning';
    if (timeLower.includes('lunch') || timeLower.includes('12:') || timeLower.includes('1:')) return 'midday';
    if (timeLower.includes('evening') || timeLower.includes('dinner') || timeLower.includes('6:') || timeLower.includes('7:')) return 'evening';
    return 'bedtime';
  };

  const filteredLogs = doseLogs.filter((log) => {
    const med = medications.find((m) => m.id === log.medicationId);
    if (!med) return true;
    if (activeTab === 'medication') return med.type === 'prescription';
    if (activeTab === 'supplement') return med.type === 'supplement' || med.type === 'vitamin' || med.type === 'otc';
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Daily Reminders & Dose Schedule
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Personalized alarms and repeat notifications that keep you safely on track.
          </p>
        </div>

        {/* Chime Test Button */}
        <button
          onClick={() => triggerSampleReminder('Lisinopril 10 mg', '8:00 AM')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 text-sm sm:text-base"
        >
          <Bell className="w-5 h-5 animate-bounce" />
          <span>Test Reminder Alarm</span>
        </button>
      </div>

      {/* Safety Guardrail Note */}
      <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-4 flex items-start gap-3 text-teal-950">
        <Shield className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <p className="font-bold text-teal-900 text-base">
            Caregiver and Schedule Protocol
          </p>
          <p className="mt-0.5 text-teal-800 font-medium">
            Reminders reflect the timetable you have entered with your physician or pharmacist. CareCompanion does not independently recommend starting, stopping, combining, or changing a dose.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Repeat Reminder Settings */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs: All vs Prescriptions vs Supplements */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Reminders' },
              { id: 'medication', label: 'Prescription Meds Only' },
              { id: 'supplement', label: 'Supplements & OTC Only' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Repeat Reminder Setting */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
            <Clock className="w-4 h-4 text-teal-700" />
            <span>If dose not marked taken, repeat alarm in:</span>
            <select
              value={snoozeInterval}
              onChange={(e) => setSnoozeInterval(e.target.value as typeof snoozeInterval)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-bold text-slate-800"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Time Slots Timeline */}
      <div className="space-y-6">
        {timeSlots.map((slot) => {
          const slotLogs = filteredLogs.filter((log) => categorizeSlot(log.scheduledTime) === slot.id);

          return (
            <div key={slot.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{slot.icon}</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {slot.title}
                  </h3>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  {slotLogs.filter((l) => l.status === 'taken').length} of {slotLogs.length} taken
                </span>
              </div>

              {slotLogs.length === 0 ? (
                <p className="text-sm text-slate-400 py-2 italic">
                  No medications or supplements scheduled for this time window.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slotLogs.map((log) => {
                    const med = medications.find((m) => m.id === log.medicationId);
                    const isTaken = log.status === 'taken';

                    return (
                      <div
                        key={log.id}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                          isTaken
                            ? 'bg-emerald-50/50 border-emerald-300 text-slate-800'
                            : 'bg-white border-slate-200 hover:border-teal-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div
                              className="w-10 h-10 rounded-xl border-2 border-slate-300 shrink-0 flex items-center justify-center shadow-xs"
                              style={{ backgroundColor: med?.pillColor || '#ffffff' }}
                            >
                              <Pill className="w-5 h-5 text-slate-700" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`text-base font-bold break-words ${isTaken ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                  {log.medicationName}
                                </h4>
                                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                                  {log.scheduledTime}
                                </span>
                              </div>
                              {med && (
                                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                                  {med.instructions} • {med.takeWithFood === 'food' ? 'Take with food' : 'Take with water'}
                                </p>
                              )}
                              {log.takenAt && (
                                <span className="text-xs text-emerald-700 font-bold block mt-1">
                                  ✓ Taken at {log.takenAt}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              speakText(`Reminder: ${log.medicationName}. Instructions: ${med?.instructions || 'Take as directed.'}`)
                            }
                            className="p-1.5 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-slate-100"
                            title="Listen"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                          {isTaken ? (
                            <button
                              onClick={() => markDose(log.id, 'pending')}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                            >
                              Undo Mark
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  markDose(log.id, 'snoozed');
                                  alert(`Alarm snoozed for ${snoozeInterval} minutes.`);
                                }}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                              >
                                Snooze ({snoozeInterval}m)
                              </button>
                              <button
                                onClick={() => markDose(log.id, 'taken')}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
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
              )}
            </div>
          );
        })}
      </div>

      {/* Optional Caregiver Notification Setting */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Caregiver Peace of Mind Notifications
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Automated check-ins for loved ones if an essential medication or appointment is missed.
              </p>
            </div>
          </div>

          {profile.caregiver ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCaregiverModalOpen(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span>Edit Caregiver</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Remove caregiver and disable caregiver notifications?')) {
                    updateProfile({
                      caregiver: null,
                      caregiverNotificationsEnabled: false,
                      caregiverContact: undefined,
                    });
                  }
                }}
                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                title="Remove Caregiver"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCaregiverModalOpen(true)}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Caregiver Contact</span>
            </button>
          )}
        </div>

        {profile.caregiver ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="text-lg font-extrabold text-slate-900">
                    {profile.caregiver.name}
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                    {profile.caregiver.relationship}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-600">
                  {profile.caregiver.phone && (
                    <a
                      href={`tel:${profile.caregiver.phone}`}
                      className="flex items-center gap-1.5 font-semibold text-teal-800 hover:underline"
                    >
                      <Phone className="w-4 h-4 text-teal-600" />
                      <span>{profile.caregiver.phone}</span>
                    </a>
                  )}
                  {profile.caregiver.email && (
                    <a
                      href={`mailto:${profile.caregiver.email}`}
                      className="flex items-center gap-1.5 font-semibold text-teal-800 hover:underline"
                    >
                      <Mail className="w-4 h-4 text-teal-600" />
                      <span>{profile.caregiver.email}</span>
                    </a>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-3 font-medium">
                  ⏰ Alerts are scheduled <strong>{profile.caregiver.alertDelayHours || 2} hours</strong> after an unconfirmed dose.
                  {profile.caregiver.notifyOnMissedMedication && ' • Missed doses'}
                  {profile.caregiver.notifyOnMissedAppointment && ' • Doctor visits'}
                </p>
              </div>

              {/* Status and Toggle */}
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-500">
                  Notification Status:
                </span>
                <button
                  onClick={() => {
                    const next = !profile.caregiverNotificationsEnabled;
                    updateProfile({ caregiverNotificationsEnabled: next });
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs flex items-center gap-2 ${
                    profile.caregiverNotificationsEnabled
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{profile.caregiverNotificationsEnabled ? '✓ Alerts Active' : 'Alerts Paused'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3">
            <HeartHandshake className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <p className="font-bold text-slate-800 text-base">
                No Caregiver Contact Configured
              </p>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                You can add a child, spouse, or professional caregiver who will receive a gentle notification only if an essential medication or doctor visit is marked overdue.
              </p>
            </div>
            <button
              onClick={() => setIsCaregiverModalOpen(true)}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-sm inline-flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Caregiver Contact</span>
            </button>
          </div>
        )}
      </div>

      {/* Caregiver Add / Edit Modal */}
      <CaregiverModal
        isOpen={isCaregiverModalOpen}
        onClose={() => setIsCaregiverModalOpen(false)}
      />
    </div>
  );
};

