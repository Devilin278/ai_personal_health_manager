import React, { useState } from 'react';
import { X, FileUp, Check, FileText, Sparkles } from 'lucide-react';
import { HealthRecord } from '../types/health';
import { useHealth } from '../context/HealthContext';

interface UploadRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadRecordModal: React.FC<UploadRecordModalProps> = ({ isOpen, onClose }) => {
  const { addRecord } = useHealth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HealthRecord['category']>('lab_results');
  const [provider, setProvider] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState('');
  const [keyFindingsStr, setKeyFindingsStr] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handlePreloadSample = (type: 'labs' | 'discharge') => {
    if (type === 'labs') {
      setTitle('CBC & Complete Lipid Panel');
      setCategory('lab_results');
      setProvider('Oakridge Regional Health Diagnostics');
      setDate('2026-10-24');
      setSummary('Blood cell counts and metabolic markers are within safe ranges. Triglycerides and fasting glucose showed noticeable improvement.');
      setKeyFindingsStr('White Blood Cells: 6.8 K/uL (Normal)\nTotal Cholesterol: 162 mg/dL (Optimal)\nTriglycerides: 130 mg/dL (Normal)\nHemoglobin: 13.8 g/dL (Good oxygen capacity)');
      setFileName('Lab_CBC_Lipids_Oct2026.pdf');
    } else {
      setTitle('Physical Therapy Post-Visit Instruction Sheet');
      setCategory('care_plan');
      setProvider('Oakridge Sports & Joint Clinic');
      setDate('2026-10-22');
      setSummary('Guidelines for safe indoor walking and quadriceps strengthening to alleviate morning stiffness.');
      setKeyFindingsStr('Perform 10 seated leg raises each morning\nKeep hallways well-lit and clear of throw rugs\nStay hydrated with 6-8 glasses of water daily');
      setFileName('PT_Care_Plan_Oct2026.pdf');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !provider.trim()) {
      alert('Please enter document title and healthcare provider.');
      return;
    }

    const keyFindings = keyFindingsStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addRecord({
      title,
      category,
      provider,
      date,
      summary: summary || 'Document organized in CareCompanion records.',
      keyFindings: keyFindings.length > 0 ? keyFindings : ['Document filed securely for doctor appointment reference.'],
      fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
      fileSize: '320 KB',
    });

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
            <FileUp className="w-7 h-7" />
            <div>
              <h2 className="text-xl font-bold">Add or Upload Health Document</h2>
              <p className="text-teal-100 text-xs sm:text-sm">
                Store lab results, clinic summaries, care plans, and vaccination cards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-teal-800 text-white transition-colors"
            aria-label="Close upload modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Sample Selector */}
        <div className="bg-teal-50 px-6 py-3 border-b border-teal-100 flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm">
          <span className="text-teal-900 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" /> Quick test sample document:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePreloadSample('labs')}
              className="px-2.5 py-1 bg-white hover:bg-teal-100 text-teal-800 border border-teal-300 rounded-lg font-bold transition-colors"
            >
              + Preload Lab Test
            </button>
            <button
              type="button"
              onClick={() => handlePreloadSample('discharge')}
              className="px-2.5 py-1 bg-white hover:bg-teal-100 text-teal-800 border border-teal-300 rounded-lg font-bold transition-colors"
            >
              + Preload Care Plan
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* File Picker Drag & Drop Area */}
          <div className="border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-2xl p-6 text-center bg-teal-50/40 transition-colors cursor-pointer">
            <FileText className="w-10 h-10 text-teal-600 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-base">
              {fileName ? `Selected File: ${fileName}` : 'Choose a file or take a photo of your paper record'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF, PNG, JPG, or Scanned Documents (Stored safely in your browser)
            </p>
            <input
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              id="file-upload"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFileName(e.target.files[0].name);
                  if (!title) {
                    setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
                  }
                }
              }}
            />
            <label
              htmlFor="file-upload"
              className="mt-3 inline-block px-4 py-1.5 bg-white border border-teal-400 hover:bg-teal-50 text-teal-800 font-bold rounded-lg text-sm cursor-pointer shadow-xs"
            >
              Browse Files
            </label>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Document Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Bloodwork Lab Report, Eye Exam"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HealthRecord['category'])}
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base bg-white font-medium"
              >
                <option value="lab_results">Lab Bloodwork / Test Results</option>
                <option value="discharge_summary">Clinic / Discharge Instructions</option>
                <option value="care_plan">Personal Care Plan</option>
                <option value="eye_exam">Eye & Vision Examination</option>
                <option value="vaccination">Vaccination Record</option>
                <option value="imaging">Imaging (X-Ray / MRI / Ultrasound)</option>
              </select>
            </div>
          </div>

          {/* Healthcare Provider & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Healthcare Provider / Clinic *
              </label>
              <input
                type="text"
                required
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g., Memorial Diagnostics, Dr. Vance"
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Document Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base bg-white"
              />
            </div>
          </div>

          {/* Plain Language Summary */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Plain-Language Summary (What does this report say?)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g., Kidney and liver tests normal. Cholesterol improved. Continue current routine."
              className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base"
            />
          </div>

          {/* Key Findings */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Key Numbers or Findings (One per line)
            </label>
            <textarea
              rows={3}
              value={keyFindingsStr}
              onChange={(e) => setKeyFindingsStr(e.target.value)}
              placeholder="HbA1c: 6.2%&#10;Total Cholesterol: 168 mg/dL&#10;Blood Pressure reading: 124/78"
              className="w-full px-3.5 py-2.5 border-2 border-slate-300 rounded-xl focus:border-teal-600 focus:outline-hidden text-base font-mono text-sm"
            />
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
              <Check className="w-5 h-5" /> Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

