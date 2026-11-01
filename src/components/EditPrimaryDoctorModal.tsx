import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Stethoscope, Phone, Building2, Check, User } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface EditPrimaryDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditPrimaryDoctorModal: React.FC<EditPrimaryDoctorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, updateProfile } = useHealth();

  const [name, setName] = useState(profile.primaryDoctor.name);
  const [clinic, setClinic] = useState(profile.primaryDoctor.clinic);
  const [phone, setPhone] = useState(profile.primaryDoctor.phone);

  useEffect(() => {
    if (isOpen) {
      setName(profile.primaryDoctor.name);
      setClinic(profile.primaryDoctor.clinic);
      setPhone(profile.primaryDoctor.phone);
    }
  }, [isOpen, profile.primaryDoctor]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter doctor name.');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter a clinic or doctor phone number.');
      return;
    }

    updateProfile({
      primaryDoctor: {
        name: name.trim(),
        clinic: clinic.trim() || 'Primary Medical Clinic',
        phone: phone.trim(),
      },
    });

    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 border border-slate-200 m-auto my-auto">
        {/* Header */}
        <div className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Edit Primary Care Doctor</h2>
              <p className="text-blue-100 text-xs sm:text-sm">
                Your main physician & medical clinic contact
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
          {/* Doctor Name */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Doctor's Full Name & Title
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Robert Vance, MD"
                required
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white bg-slate-50"
              />
            </div>
          </div>

          {/* Clinic / Practice Name */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Clinic or Hospital Practice Name
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                placeholder="e.g. Oakridge Family Medical Clinic"
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white bg-slate-50"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Clinic / Office Phone Number
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. (555) 345-6789"
                required
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white bg-slate-50"
              />
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3 text-xs text-blue-900 leading-relaxed">
            ℹ️ This updates your primary care physician across your medical summaries, printable visit sheets, and emergency contacts.
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Doctor Info</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

