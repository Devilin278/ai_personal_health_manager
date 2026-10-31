import React, { useState } from 'react';
import {
  FileText,
  FileUp,
  Download,
  Printer,
  Trash2,
  Calendar,
  Building2,
  Filter,
  CheckCircle2,
  Volume2,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { HealthRecord } from '../types/health';
import { useHealth } from '../context/HealthContext';
import { UploadRecordModal } from '../components/UploadRecordModal';
import { PrintableSummaryModal } from '../components/PrintableSummaryModal';

export const RecordsView: React.FC = () => {
  const { healthRecords, deleteRecord, speakText, exportAllData } = useHealth();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(
    healthRecords[0] || null
  );

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'lab_results', label: 'Lab Bloodwork' },
    { id: 'discharge_summary', label: 'Discharge & Clinic' },
    { id: 'care_plan', label: 'Care & Physical Plans' },
    { id: 'eye_exam', label: 'Eye Exams' },
    { id: 'vaccination', label: 'Vaccinations' },
  ];

  const filteredRecords = healthRecords.filter((rec) => {
    const matchesCategory =
      activeCategory === 'all' ? true : rec.category === activeCategory;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Health Records Organizer
            </h2>
            <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-1 rounded-full font-bold">
              {healthRecords.length} records
            </span>
          </div>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Store and organize personal test results, discharge summaries, and vaccine history in plain language.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base transition-colors shadow-xs"
          >
            <Printer className="w-5 h-5 text-teal-700" />
            <span>Generate Doctor Visit Sheet</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base shadow-md shadow-teal-700/20 transition-all active:scale-95"
          >
            <FileUp className="w-5 h-5" />
            <span>Upload or Add Document</span>
          </button>
        </div>
      </div>

      {/* Privacy and Control Guarantee Banner */}
      <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-teal-700 shrink-0" />
          <div className="text-xs sm:text-sm text-teal-950">
            <strong>Your Data is 100% Yours:</strong> Records are saved securely on your local device. You can download, review, print, or remove them at any moment.
          </div>
        </div>
        <button
          onClick={exportAllData}
          className="text-xs font-bold text-teal-900 bg-white hover:bg-teal-100 border border-teal-300 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export All Data (JSON)</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by test name, clinic, doctor, or keyword..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-teal-600 focus:outline-hidden text-base bg-white"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Split View: Document List on Left (5 cols) & Selected Document Reader on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Documents List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredRecords.map((rec) => {
            const isSelected = selectedRecord?.id === rec.id;

            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-teal-50/80 border-teal-600 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
                        {rec.category.replace('_', ' ')}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">{rec.provider}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-400 shrink-0">
                    {rec.date}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mt-3 font-medium">
                  {rec.summary}
                </p>
              </div>
            );
          })}

          {filteredRecords.length === 0 && (
            <div className="p-8 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              No documents found matching criteria.
            </div>
          )}
        </div>

        {/* Right Column: Active Document Detail Inspector */}
        {selectedRecord && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-200 pb-5">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full">
                    {selectedRecord.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                    {selectedRecord.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 mt-0.5">
                    {selectedRecord.provider} • Date: {selectedRecord.date}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      speakText(
                        `Document: ${selectedRecord.title}. Summary: ${selectedRecord.summary}. Key findings: ${selectedRecord.keyFindings.join(
                          '. '
                        )}`
                      )
                    }
                    className="p-2 text-slate-500 hover:text-teal-700 rounded-xl hover:bg-slate-100 transition-colors"
                    title="Read document aloud"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete record "${selectedRecord.title}"?`)) {
                        deleteRecord(selectedRecord.id);
                        setSelectedRecord(null);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {selectedRecord.fileName && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                  <FileText className="w-3.5 h-3.5" />
                  <span>File: {selectedRecord.fileName} ({selectedRecord.fileSize || '300 KB'})</span>
                </div>
              )}
            </div>

            {/* Plain-Language Summary Box */}
            <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-teal-950 text-base">
                Plain-Language Overview
              </h4>
              <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
                {selectedRecord.summary}
              </p>
            </div>

            {/* Key Findings List */}
            {selectedRecord.keyFindings && selectedRecord.keyFindings.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-base">
                  Key Numbers & Clinical Findings
                </h4>
                <div className="space-y-2">
                  {selectedRecord.keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Normal / Target Values Grid */}
            {selectedRecord.normalValues && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-base">
                  Test Markers & Targets
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedRecord.normalValues.map((v, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center text-xs sm:text-sm"
                    >
                      <span className="font-semibold text-slate-700">{v.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900">{v.value}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            v.status === 'optimal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {v.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doctor Comments */}
            {selectedRecord.doctorComments && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 font-medium">
                <strong>Doctor's Personal Note:</strong> "{selectedRecord.doctorComments}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <UploadRecordModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <PrintableSummaryModal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} />
    </div>
  );
};

