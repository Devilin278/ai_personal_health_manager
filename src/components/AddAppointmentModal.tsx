import React, { useState } from 'react';
import { X, CalendarDays, Check, Plus, Trash2 } from 'lucide-react';
import { Appointment } from '../types/health';
import { useHealth } from '../context/HealthContext';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editAppointment?: Appointment | null;
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  editAppointment,
}) => {
  const { addAppointment, updateAppointment } = useHealth();

  const [providerName, setProviderName] = useState(editAppointment?.providerName || '');
  const [specialty, setSpecialty] = useState(editAppointment?.specialty || '');
  const [clinicName, setClinicName] = useState(editAppointment?.clinicName || '');
  const [location, setLocation] = useState(editAppointment?.location || '');
  const [phone, setPhone] = useState(editAppointment?.phone || '');
  const [date, setDate] = useState(editAppointment?.date || '');
  const [time, setTime] = useState(editAppointment?.time || '10:00 AM');
  const [visitType, setVisitType] = useState<Appointment['visitType']>(editAppointment?.visitType || 'in-person');
  const [transitNotes, setTransitNotes] = useState(editAppointment?.transitNotes || '');
  const [checklist, setChecklist] = useState<Appointment['checklist']>(
    editAppointment?.checklist || [
      { id: 'c-init-1', text: 'Ask about current test results and progress', completed: false, category: 'question' },
      { id: 'c-init-2', text: 'Bring current medication and supplement bottles', completed: false, category: 'document' },
    ]
  );
  const [newCheckItem, setNewCheckItem] = useState('');
  const [newCheckCategory, setNewCheckCategory] = useState<'question' | 'symptom' | 'document'>('question');

  if (!isOpen) return null;

  const handleAddCheckItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklist((prev) => [
      ...prev,
      {
        id: `c-item-${Date.now()}`,
        text: newCheckItem.trim(),
        completed: false,
        category: newCheckCategory,
      },
    ]);
    setNewCheckItem('');
  };

  const handleRemoveCheckItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName.trim() || !date.trim()) {
      alert('Please provide doctor name and date.');
      return;
    }

    const data = {
      providerName,
      specialty: specialty.trim() || 'General Medicine',
      clinicName: clinicName.trim() || 'Medical Office',
      location: location.trim() || 'Main Clinic',
      phone: phone.trim() || '(555) 000-0000',
      date,
      time,
      visitType,
      reminderLeadHours: [48, 24, 2],
      status: 'upcoming' as const,
      transitNotes: transitNotes.trim() || undefined,
      checklist,
    };

    if (editAppointment) {
      updateAppointment(editAppointment.id, data);
    } else {
      addAppointment(data);
    }

    onClose();
  };

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
            <CalendarDays className="w-7 h-7" />
            <div>
              <h2 className="text-xl font-bold">
                {editAppointment ? 'Edit Doctor Visit' : 'Schedule Doctor Appointment'}
              </h2>
              <p className="text-teal-100 text-xs sm:text-sm">
                Keep track of visits, transit notes, and questions to ask
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Provider & Specialty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Doctor or Clinician Name *
              </label>
              <input
                type="text"
                required
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g., Dr. Robert Vance, MD"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Specialty / Department
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g., Cardiology, Primary Care, Eye Care"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base"
              />
            </div>
          </div>

          {/* Date, Time & Visit Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 10:30 AM"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Visit Format
              </label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as Appointment['visitType'])}
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base bg-white"
              >
                <option value="in-person">In-Person Clinic</option>
                <option value="telehealth">Video / Telehealth</option>
                <option value="home-visit">Home Visit</option>
              </select>
            </div>
          </div>

          {/* Clinic & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Clinic / Hospital Name
              </label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="e.g., Oakridge Family Medical Clinic"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., (555) 345-6789"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base font-semibold"
              />
            </div>
          </div>

          {/* Location & Transit Notes */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Address & Parking / Ride Notes
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., 1045 Medical Plaza Way, Suite 300"
              className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base mb-2"
            />
            <input
              type="text"
              value={transitNotes}
              onChange={(e) => setTransitNotes(e.target.value)}
              placeholder="e.g., Sarah driving, handicap parking right by East entrance"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-sm text-slate-600"
            />
          </div>

          {/* Preparation Checklist */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-2">
              Appointment Preparation Checklist
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Add questions to ask, symptoms you have noticed, or documents to remember to bring.
            </p>

            <div className="space-y-2 mb-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-slate-200 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        item.category === 'question'
                          ? 'bg-blue-100 text-blue-800'
                          : item.category === 'symptom'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.category === 'question' ? 'Question' : item.category === 'symptom' ? 'Symptom' : 'Bring'}
                    </span>
                    <span className="font-medium text-slate-800">{item.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCheckItem(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={newCheckCategory}
                onChange={(e) => setNewCheckCategory(e.target.value as 'question' | 'symptom' | 'document')}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium"
              >
                <option value="question">Question</option>
                <option value="symptom">Symptom</option>
                <option value="document">Document to Bring</option>
              </select>
              <input
                type="text"
                value={newCheckItem}
                onChange={(e) => setNewCheckItem(e.target.value)}
                placeholder="e.g., Ask about my recent knee stiffness"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCheckItem();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCheckItem}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
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
              <span>{editAppointment ? 'Save Visit Details' : 'Save Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

