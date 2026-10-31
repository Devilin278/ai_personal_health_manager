import React from 'react';
import { Phone, AlertCircle, X, ShieldAlert, HeartPulse, User } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { profile, speakText } = useHealth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border-4 border-red-500 overflow-hidden text-slate-900 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-red-600 text-white px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-white shrink-0 animate-pulse" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Emergency Assistance</h2>
              <p className="text-red-100 text-xs sm:text-sm">Immediate help, primary doctor, and critical medical ID</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close emergency modal"
            className="p-2 rounded-full hover:bg-red-700 text-white transition-colors shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
          {/* Immediate 911 Call Banner */}
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-red-900">
              <AlertCircle className="w-8 h-8 text-red-600 shrink-0" />
              <div>
                <p className="font-bold text-lg">Are you experiencing an emergency?</p>
                <p className="text-sm text-red-700">Chest pain, severe breathlessness, sudden numbness, or fall</p>
              </div>
            </div>
            <a
              href="tel:911"
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-lg shadow-md transition-all active:scale-95"
            >
              <Phone className="w-6 h-6" /> Call 911 Now
            </a>
          </div>

          {/* Quick Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Doctor */}
            <div className="border-2 border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-800 font-bold mb-1">
                  <HeartPulse className="w-5 h-5" />
                  <span>Primary Doctor</span>
                </div>
                <p className="font-bold text-lg text-slate-800">{profile.primaryDoctor.name}</p>
                <p className="text-sm text-slate-600">{profile.primaryDoctor.clinic}</p>
              </div>
              <a
                href={`tel:${profile.primaryDoctor.phone.replace(/[^0-9]/g, '')}`}
                className="mt-4 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 text-base transition-colors"
              >
                <Phone className="w-4 h-4" /> Call Doctor ({profile.primaryDoctor.phone})
              </a>
            </div>

            {/* Emergency Contact */}
            <div className="border-2 border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-800 font-bold mb-1">
                  <User className="w-5 h-5" />
                  <span>Family Contact</span>
                </div>
                <p className="font-bold text-lg text-slate-800">{profile.emergencyContact.name}</p>
                <p className="text-sm text-slate-600">Relationship: {profile.emergencyContact.relationship}</p>
              </div>
              <a
                href={`tel:${profile.emergencyContact.phone.replace(/[^0-9]/g, '')}`}
                className="mt-4 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 text-base transition-colors"
              >
                <Phone className="w-4 h-4" /> Call {profile.emergencyContact.relationship} ({profile.emergencyContact.phone})
              </a>
            </div>
          </div>

          {/* Critical Medical ID Strip for Paramedics / Doctors */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-900 text-base uppercase tracking-wider">
                Paramedic & First Responder Info
              </h3>
              <button
                onClick={() =>
                  speakText(
                    `Patient is ${profile.name}, born ${profile.dateOfBirth}. Blood type ${profile.bloodType}. Known allergies: ${profile.allergies
                      .map((a) => a.allergen)
                      .join(', ')}.`
                  )
                }
                className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 px-2 py-1 rounded font-medium flex items-center gap-1"
              >
                🔊 Read aloud
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500 block">Patient Name:</span>
                <span className="font-semibold text-slate-900 text-base">{profile.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date of Birth:</span>
                <span className="font-semibold text-slate-900 text-base">{profile.dateOfBirth}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Blood Type:</span>
                <span className="font-semibold text-slate-900 text-base">{profile.bloodType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Allergies:</span>
                <span className="font-semibold text-red-600 text-base">
                  {profile.allergies.map((a) => a.allergen).join(', ')}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-base transition-colors"
            >
              Close Emergency Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

