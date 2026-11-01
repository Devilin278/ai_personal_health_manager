import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, HeartHandshake, Trash2, Check, AlertCircle, Phone, Mail, User } from 'lucide-react';
import { CaregiverInfo } from '../types/health';
import { useHealth } from '../context/HealthContext';

interface CaregiverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaregiverModal: React.FC<CaregiverModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useHealth();

  const currentCaregiver = profile.caregiver;

  const [name, setName] = useState(currentCaregiver?.name || '');
  const [relationship, setRelationship] = useState(currentCaregiver?.relationship || 'Daughter');
  const [phone, setPhone] = useState(currentCaregiver?.phone || '');
  const [email, setEmail] = useState(currentCaregiver?.email || '');
  const [alertDelayHours, setAlertDelayHours] = useState<number>(currentCaregiver?.alertDelayHours || 2);
  const [notifyOnMissedMedication, setNotifyOnMissedMedication] = useState(
    currentCaregiver?.notifyOnMissedMedication ?? true
  );
  const [notifyOnMissedAppointment, setNotifyOnMissedAppointment] = useState(
    currentCaregiver?.notifyOnMissedAppointment ?? true
  );

  useEffect(() => {
    if (isOpen) {
      setName(profile.caregiver?.name || '');
      setRelationship(profile.caregiver?.relationship || 'Daughter');
      setPhone(profile.caregiver?.phone || '');
      setEmail(profile.caregiver?.email || '');
      setAlertDelayHours(profile.caregiver?.alertDelayHours || 2);
      setNotifyOnMissedMedication(profile.caregiver?.notifyOnMissedMedication ?? true);
      setNotifyOnMissedAppointment(profile.caregiver?.notifyOnMissedAppointment ?? true);
    }
  }, [isOpen, profile.caregiver]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!phone.trim() && !email.trim())) {
      alert('Please enter caregiver name and at least a phone number or email.');
      return;
    }

    const updatedCaregiver: CaregiverInfo = {
      name: name.trim(),
      relationship: relationship.trim() || 'Caregiver',
      phone: phone.trim(),
      email: email.trim(),
      alertDelayHours: Number(alertDelayHours) || 2,
      notifyOnMissedMedication,
      notifyOnMissedAppointment,
    };

    updateProfile({
      caregiver: updatedCaregiver,
      caregiverNotificationsEnabled: true,
      caregiverContact: `${updatedCaregiver.name} (${updatedCaregiver.email || updatedCaregiver.phone})`,
    });

    onClose();
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this caregiver and turn off automated caregiver alerts?')) {
      updateProfile({
        caregiver: null,
        caregiverNotificationsEnabled: false,
        caregiverContact: undefined,
      });
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 border border-slate-200 m-auto my-auto">
        {/* Header */}
        <div className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {currentCaregiver ? 'Manage Caregiver Contact' : 'Add Caregiver Contact'}
              </h2>
              <p className="text-teal-100 text-xs sm:text-sm">
                Automated peace-of-mind alerts for your loved one
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-teal-800 text-white transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* Information Notice */}
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-teal-900">
            <AlertCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>
              If you haven't marked a scheduled dose as taken after your chosen delay time, CareCompanion can send a gentle reminder to your caregiver.
            </span>
          </div>

          {/* Full Name & Relationship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Caregiver Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full pl-9 pr-3 py-2 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden bg-white font-semibold"
              >
                <option value="Daughter">Daughter</option>
                <option value="Son">Son</option>
                <option value="Spouse">Spouse / Partner</option>
                <option value="Sibling">Sister / Brother</option>
                <option value="Grandchild">Grandchild</option>
                <option value="Professional Caregiver">Professional Caregiver / Nurse</option>
                <option value="Friend">Trusted Friend / Neighbor</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Phone Number (SMS Alerts)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. (555) 234-8910"
                  className="w-full pl-9 pr-3 py-2 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah.jenkins@example.com"
                  className="w-full pl-9 pr-3 py-2 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Alert Delay Setting */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Send Alert If Dose Is Not Confirmed After:
            </label>
            <select
              value={alertDelayHours}
              onChange={(e) => setAlertDelayHours(Number(e.target.value))}
              className="w-full px-3 py-2 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden bg-white font-semibold"
            >
              <option value={1}>1 hour after scheduled dose time</option>
              <option value={2}>2 hours after scheduled dose time (Recommended)</option>
              <option value={3}>3 hours after scheduled dose time</option>
              <option value={4}>4 hours after scheduled dose time</option>
            </select>
          </div>

          {/* Checkbox Preferences */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnMissedMedication}
                onChange={(e) => setNotifyOnMissedMedication(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span className="font-semibold text-slate-800">
                Send alert if critical daily medication is missed
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnMissedAppointment}
                onChange={(e) => setNotifyOnMissedAppointment(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span className="font-semibold text-slate-800">
                Send reminder before upcoming doctor appointments
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
            {currentCaregiver ? (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3.5 py-2 text-red-600 hover:bg-red-50 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove Caregiver
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Caregiver</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

