import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Phone, User, HeartHandshake, Check } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface EditEmergencyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditEmergencyContactModal: React.FC<EditEmergencyContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, updateProfile } = useHealth();

  const [name, setName] = useState(profile.emergencyContact.name);
  const [relationship, setRelationship] = useState(profile.emergencyContact.relationship);
  const [phone, setPhone] = useState(profile.emergencyContact.phone);

  useEffect(() => {
    if (isOpen) {
      setName(profile.emergencyContact.name);
      setRelationship(profile.emergencyContact.relationship);
      setPhone(profile.emergencyContact.phone);
    }
  }, [isOpen, profile.emergencyContact]);

  if (!isOpen) return null;

  const handleCopyFromCaregiver = () => {
    if (profile.caregiver) {
      setName(profile.caregiver.name);
      setRelationship(profile.caregiver.relationship);
      setPhone(profile.caregiver.phone);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a contact name.');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter a phone number.');
      return;
    }

    updateProfile({
      emergencyContact: {
        name: name.trim(),
        relationship: relationship.trim() || 'Emergency Contact',
        phone: phone.trim(),
      },
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-contact-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900 border border-slate-200">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="emergency-contact-modal-title" className="text-xl font-bold">
                Update Emergency Contact
              </h2>
              <p className="text-red-100 text-xs sm:text-sm">
                First point of contact for paramedics & medical personnel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Caregiver prefill suggestion if available */}
          {profile.caregiver && (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm text-teal-900">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  Caregiver recorded: <strong>{profile.caregiver.name}</strong> ({profile.caregiver.relationship})
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyFromCaregiver}
                className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-xs shrink-0 transition-colors"
              >
                Use Caregiver
              </button>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Contact Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none text-base text-slate-900 font-semibold"
              />
            </div>
          </div>

          {/* Relationship */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Relationship to You <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {['Daughter', 'Son', 'Spouse', 'Sibling', 'Neighbor', 'Caregiver', 'Friend'].map((rel) => (
                <button
                  type="button"
                  key={rel}
                  onClick={() => setRelationship(rel)}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    relationship === rel
                      ? 'bg-red-50 border-red-400 text-red-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
            <input
              type="text"
              required
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. Daughter, Spouse, Neighbor..."
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none text-base text-slate-900 font-semibold"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700">
              Emergency Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. (555) 234-5678"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-red-500 focus:outline-none text-base text-slate-900 font-semibold"
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Include area code. First responders and hospital staff will dial this number in an urgent medical event.
            </p>
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
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Save Contact Info</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
