import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Video,
  Plus,
  Printer,
  CheckCircle2,
  Circle,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { Appointment } from '../types/health';
import { useHealth } from '../context/HealthContext';
import { AddAppointmentModal } from '../components/AddAppointmentModal';
import { PrintableSummaryModal } from '../components/PrintableSummaryModal';

export const AppointmentsView: React.FC = () => {
  const {
    appointments,
    toggleChecklistItem,
    addChecklistItem,
    savePostVisitNotes,
    deleteAppointment,
    speakText,
    setActiveTab,
    openAiChat,
  } = useHealth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Selected appointment for detail inspection & post-visit notes
  const [selectedAptId, setSelectedAptId] = useState<string>(
    appointments[0]?.id || ''
  );

  const selectedApt = appointments.find((a) => a.id === selectedAptId) || appointments[0];

  // Post visit notes local form state
  const [postSummaryInput, setPostSummaryInput] = useState(
    selectedApt?.postVisitNotes?.summary || ''
  );
  const [newTaskInput, setNewTaskInput] = useState('');
  const [tasksList, setTasksList] = useState<string[]>(
    selectedApt?.postVisitNotes?.followUpTasks || []
  );

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState<'question' | 'symptom' | 'document'>('question');

  // Sync when selected appointment changes
  React.useEffect(() => {
    if (selectedApt) {
      setPostSummaryInput(selectedApt.postVisitNotes?.summary || '');
      setTasksList(selectedApt.postVisitNotes?.followUpTasks || []);
    }
  }, [selectedAptId]);

  const handleSavePostVisit = () => {
    if (!selectedApt) return;
    savePostVisitNotes(selectedApt.id, postSummaryInput, tasksList);
  };

  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    setTasksList([...tasksList, newTaskInput.trim()]);
    setNewTaskInput('');
  };

  const handleRemoveTask = (idx: number) => {
    setTasksList(tasksList.filter((_, i) => i !== idx));
  };

  const handleAddCustomQuestion = () => {
    if (!newQuestionText.trim() || !selectedApt) return;
    addChecklistItem(selectedApt.id, newQuestionText.trim(), newQuestionCategory);
    setNewQuestionText('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Doctor Appointments & Visits
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">
              {appointments.length} total
            </span>
          </div>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Keep track of clinic visits, questions to ask your doctor, and post-visit follow-up instructions.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Visit Sheet</span>
          </button>
          <button
            onClick={() => {
              setEditingApt(null);
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base shadow-md shadow-teal-700/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Agenda List on Left (5 cols) & Selected Appointment Prep Workspace on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Appointments Agenda List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
            Scheduled Visits
          </h3>

          {appointments.map((apt) => {
            const isSelected = apt.id === selectedAptId;
            const completedChecks = apt.checklist.filter((c) => c.completed).length;

            return (
              <div
                key={apt.id}
                onClick={() => setSelectedAptId(apt.id)}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${isSelected
                    ? 'bg-blue-50/80 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
                      {apt.specialty}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                      {apt.providerName}
                    </h4>
                    <p className="text-xs text-slate-600">{apt.clinicName}</p>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${apt.visitType === 'in-person'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                      }`}
                  >
                    {apt.visitType}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5 text-teal-800">
                    <CalendarDays className="w-4 h-4" />
                    <span>{apt.date} at {apt.time}</span>
                  </div>
                  <span className="text-slate-500 font-medium">
                    {completedChecks}/{apt.checklist.length} checklist items ready
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Appointment Interactive Prep Workspace */}
        {selectedApt && (
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            {/* Header info */}
            <div className="border-b border-slate-200 pb-5">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                    {selectedApt.specialty}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                    {selectedApt.providerName}
                  </h3>
                  <p className="text-sm font-medium text-slate-600">{selectedApt.clinicName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      speakText(
                        `Appointment with ${selectedApt.providerName} on ${selectedApt.date} at ${selectedApt.time}. Location: ${selectedApt.location}.`
                      )
                    }
                    className="p-2 text-slate-500 hover:text-teal-700 rounded-xl hover:bg-slate-100 transition-colors"
                    title="Listen to appointment details"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingApt(selectedApt);
                      setIsAddModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Timing, Address & Phone Bar */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <CalendarDays className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-bold text-slate-900">{selectedApt.date} at {selectedApt.time}</span>
                </div>

                <a
                  href={`tel:${selectedApt.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-teal-50 p-2.5 rounded-xl border border-slate-200 text-teal-900 font-bold transition-colors"
                >
                  <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Call Clinic: {selectedApt.phone}</span>
                </a>
              </div>

              {selectedApt.location && (
                <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{selectedApt.location}</span>
                </div>
              )}

              {selectedApt.transitNotes && (
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 font-medium">
                  <strong>🚗 Transportation Note:</strong> {selectedApt.transitNotes}
                </div>
              )}
            </div>

            {/* Preparation Checklist: Questions, Symptoms & Documents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Pre-Visit Preparation Checklist
                  </h4>
                  <p className="text-xs text-slate-500">
                    Tap to check off questions discussed with your doctor or documents prepared.
                  </p>
                </div>
                <button
                  onClick={() => openAiChat(`Prepare questions for my upcoming appointment with ${selectedApt.providerName}`)}
                  className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Ask Scott to Prep Questions
                </button>
              </div>

              <div className="space-y-2">
                {selectedApt.checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(selectedApt.id, item.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${item.completed
                        ? 'bg-emerald-50/60 border-emerald-300 text-slate-500'
                        : 'bg-white border-slate-200 hover:border-blue-400'
                      }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span
                        className={`text-[11px] uppercase font-extrabold px-1.5 py-0.5 rounded mr-2 ${item.category === 'question'
                            ? 'bg-blue-100 text-blue-800'
                            : item.category === 'symptom'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                      >
                        {item.category === 'question' ? 'Question' : item.category === 'symptom' ? 'Symptom' : 'Bring'}
                      </span>
                      <span className={`text-sm font-semibold ${item.completed ? 'line-through' : 'text-slate-800'}`}>
                        {item.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Question / Symptom Input */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <select
                  value={newQuestionCategory}
                  onChange={(e) => setNewQuestionCategory(e.target.value as 'question' | 'symptom' | 'document')}
                  className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold bg-white"
                >
                  <option value="question">Question</option>
                  <option value="symptom">Symptom</option>
                  <option value="document">Bring Document</option>
                </select>
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Type a question or symptom to mention..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomQuestion();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomQuestion}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs sm:text-sm shrink-0"
                >
                  Add to Checklist
                </button>
              </div>
            </div>

            {/* Post-Visit Notes & Follow-up Action Items */}
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <h4 className="text-lg font-bold text-slate-900">
                Post-Visit Summary & Next Follow-Up Tasks
              </h4>
              <p className="text-xs text-slate-500">
                Record what your doctor advised and tasks to complete after your appointment.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Doctor's Instructions & Notes
                </label>
                <textarea
                  rows={2}
                  value={postSummaryInput}
                  onChange={(e) => setPostSummaryInput(e.target.value)}
                  placeholder="e.g., Doctor was pleased with blood pressure readings. Keep current dose of Lisinopril."
                  className="w-full px-3.5 py-2.5 border-2 border-slate-200 focus:border-teal-600 rounded-2xl text-sm font-medium"
                />
              </div>

              {/* Follow-up tasks list */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Follow-Up Action Items
                </label>
                <div className="space-y-1.5 mb-2">
                  {tasksList.map((task, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                    >
                      <span>• {task}</span>
                      <button
                        onClick={() => handleRemoveTask(idx)}
                        className="text-slate-400 hover:text-red-500 text-xs px-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="e.g., Schedule routine blood test in 6 weeks"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTask();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddTask}
                    className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs"
                  >
                    + Add Task
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSavePostVisit}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-sm shadow-sm transition-colors"
                >
                  Save Post-Visit Notes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingApt(null);
        }}
        editAppointment={editingApt}
      />
      <PrintableSummaryModal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} />
    </div>
  );
};

