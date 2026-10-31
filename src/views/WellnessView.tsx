import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Moon,
  Heart,
  Shield,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Volume2,
  Sparkles,
  TrendingUp,
  Plus,
  Trash2,
  Clock,
  Filter,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { AddRestModal } from '../components/AddRestModal';
import { AddWalkModal } from '../components/AddWalkModal';
import { AddBpmModal } from '../components/AddBpmModal';
import { WellnessLogType } from '../types/health';

export const WellnessView: React.FC = () => {
  const {
    todayWellness,
    wellnessData,
    wellnessLogs,
    addWaterGlass,
    deleteWellnessLog,
    mobilityRoutines,
    toggleRoutine,
    speakText,
  } = useHealth();

  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [isWalkModalOpen, setIsWalkModalOpen] = useState(false);
  const [isBpmModalOpen, setIsBpmModalOpen] = useState(false);
  const [logFilter, setLogFilter] = useState<'all' | WellnessLogType>('all');
  const [lastWaterFeedback, setLastWaterFeedback] = useState<string | null>(null);

  // Handle water glass logging
  const handleAddWater = () => {
    addWaterGlass();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastWaterFeedback(`+1 Glass recorded at ${timeStr}`);
    setTimeout(() => {
      setLastWaterFeedback(null);
    }, 4000);
  };

  const completedRoutinesCount = mobilityRoutines.filter((r) => r.completedToday).length;

  // Filter wellness logs
  const filteredLogs = wellnessLogs.filter((log) => {
    if (logFilter === 'all') return true;
    return log.type === logFilter;
  });

  // Calculate counts for filters
  const waterCount = wellnessLogs.filter((l) => l.type === 'water').length;
  const sleepCount = wellnessLogs.filter((l) => l.type === 'sleep').length;
  const walkCount = wellnessLogs.filter((l) => l.type === 'walk').length;
  const bpmCount = wellnessLogs.filter((l) => l.type === 'bpm').length;

  // Latest BPM entry
  const latestBpmEntry = wellnessLogs.find((l) => l.type === 'bpm');

  // Format sleep duration display (hours and minutes)
  const formatSleepDisplay = () => {
    const totalHours = todayWellness.sleepHours || 0;
    const wholeHours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - wholeHours) * 60);
    if (minutes === 0) return `${wholeHours} hrs`;
    return `${wholeHours} hrs ${minutes} mins`;
  };

  // Format walk duration display
  const formatWalkDisplay = () => {
    const totalMins = todayWellness.activityMinutes || 0;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hours === 0) return `${mins} mins`;
    if (mins === 0) return `${hours} hrs`;
    return `${hours} hr ${mins} mins`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Title & Speech Readout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Daily Wellness & Senior Mobility
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Personalized tracking of water glasses, restful sleep, daily walks, and heart rate logs.
          </p>
        </div>

        <button
          onClick={() =>
            speakText(
              `Today you have logged ${todayWellness.waterGlasses} glasses of water. You logged ${formatSleepDisplay()} of rest. You completed ${formatWalkDisplay()} of walking. You have ${completedRoutinesCount} of ${mobilityRoutines.length} mobility routines completed.`
            )
          }
          className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base transition-colors shrink-0"
        >
          <Volume2 className="w-5 h-5 text-teal-700" />
          <span>Listen to Summary</span>
        </button>
      </div>

      {/* Daily Vital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Hydration Water Card (No counter - click adds to log every time!) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full">
              Goal: 8 glasses
            </span>
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {todayWellness.waterGlasses} <span className="text-base font-semibold text-slate-500">glasses</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              {lastWaterFeedback ? (
                <span className="text-emerald-700 font-bold animate-pulse">
                  ✓ {lastWaterFeedback}
                </span>
              ) : (
                'Every glass is tracked with its exact timestamp.'
              )}
            </p>
          </div>

          {/* "+ Add Glass" button (no '-' or '+' counters!) */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleAddWater}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-bold rounded-xl text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2"
              aria-label="Add glass of water to log"
            >
              <Plus className="w-5 h-5" />
              <span>+ Add Glass</span>
            </button>
          </div>
        </div>

        {/* 2. Sleep / Rest Card (Click "+ Rest" to input hours & 0/15/30/45 minutes) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Moon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full capitalize">
              {todayWellness.sleepQuality || 'Good'}
            </span>
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {formatSleepDisplay()}
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Restful sleep restores energy and mental clarity.
            </p>
          </div>

          {/* "+ Rest" Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsRestModalOpen(true)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold rounded-xl text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2"
              aria-label="Add rest or sleep to log"
            >
              <Plus className="w-5 h-5" />
              <span>+ Rest</span>
            </button>
          </div>
        </div>

        {/* 3. Walk Card (Click "+ Add Walk" to input hours & 5-min increments) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              Goal: 30 mins
            </span>
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {formatWalkDisplay()}
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1 truncate">
              {todayWellness.activityType || 'Gentle walking'}
            </p>
          </div>

          {/* "+ Add Walk" Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsWalkModalOpen(true)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2"
              aria-label="Add walk to log"
            >
              <Plus className="w-5 h-5" />
              <span>+ Add Walk</span>
            </button>
          </div>
        </div>

        {/* 4. Heart Rate / BPM Card (Click "+ Add Heart Rate" for multiple entries) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full">
              {latestBpmEntry ? `${bpmCount} logged` : 'Optimal < 100'}
            </span>
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {latestBpmEntry?.bpm || todayWellness.bloodPressure?.pulse || 68} <span className="text-base font-semibold text-slate-500">BPM</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              BP: {latestBpmEntry?.systolic || todayWellness.bloodPressure?.systolic || 124}/{latestBpmEntry?.diastolic || todayWellness.bloodPressure?.diastolic || 78} mmHg
            </p>
          </div>

          {/* "+ Add Heart Rate" Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsBpmModalOpen(true)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold rounded-xl text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2"
              aria-label="Add heart rate reading"
            >
              <Plus className="w-5 h-5" />
              <span>+ Add Heart Rate</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. SEPARATE ACTIVITY & VITAL TIMELOG (All clicks logged separately with timestamp) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-teal-600" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Activity & Vital Timestamp Log
              </h3>
            </div>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Every glass of water, sleep session, walk, and heart rate check is individually recorded with its time.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl">
            {[
              { id: 'all', label: `All (${wellnessLogs.length})` },
              { id: 'water', label: `💧 Water (${waterCount})` },
              { id: 'sleep', label: `🌙 Sleep (${sleepCount})` },
              { id: 'walk', label: `🚶 Walk (${walkCount})` },
              { id: 'bpm', label: `💓 BPM (${bpmCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLogFilter(tab.id as typeof logFilter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  logFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Entries List */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
            <p className="font-semibold text-base">No logged entries in this category yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Click "+ Add Glass", "+ Rest", "+ Add Walk", or "+ Add Heart Rate" above to create an entry.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((entry) => {
              const isWater = entry.type === 'water';
              const isSleep = entry.type === 'sleep';
              const isWalk = entry.type === 'walk';
              const isBpm = entry.type === 'bpm';

              return (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-teal-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    {/* Category Icon Badge */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold shadow-xs ${
                        isWater
                          ? 'bg-sky-500'
                          : isSleep
                          ? 'bg-indigo-600'
                          : isWalk
                          ? 'bg-emerald-600'
                          : 'bg-rose-500'
                      }`}
                    >
                      {isWater && <Droplets className="w-5 h-5" />}
                      {isSleep && <Moon className="w-5 h-5" />}
                      {isWalk && <Activity className="w-5 h-5" />}
                      {isBpm && <Heart className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Title / Value */}
                        <h4 className="text-base font-extrabold text-slate-900">
                          {isWater && '1 Glass of Fresh Water (8 oz)'}
                          {isSleep &&
                            `${entry.hours}h ${entry.minutes}m Rest (${
                              entry.quality || 'Good'
                            })`}
                          {isWalk &&
                            `${entry.walkHours && entry.walkHours > 0 ? `${entry.walkHours}h ` : ''}${
                              entry.walkMinutes
                            } mins Walk - ${entry.walkType || 'Walk'}`}
                          {isBpm &&
                            `${entry.bpm} BPM Heart Rate${
                              entry.systolic && entry.diastolic
                                ? ` • BP ${entry.systolic}/${entry.diastolic} mmHg`
                                : ''
                            }`}
                        </h4>

                        {/* Tag */}
                        <span
                          className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isWater
                              ? 'bg-sky-100 text-sky-800'
                              : isSleep
                              ? 'bg-indigo-100 text-indigo-800'
                              : isWalk
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {entry.type}
                        </span>
                      </div>

                      {/* Notes / Context */}
                      {entry.notes && (
                        <p className="text-xs text-slate-600 font-medium mt-0.5 truncate">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Time and Delete Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800 block">
                        {entry.displayTime}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-medium">
                        {entry.date}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm('Delete this entry from your log?')) {
                          deleteWellnessLog(entry.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete log entry"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Senior Physical Therapy & Safe Mobility Routines */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-teal-600" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Prescribed Mobility & Balance Routines
              </h3>
            </div>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Gentle routines recommended by your physical therapist to maintain independence, confidence, and safe balance.
            </p>
          </div>

          <div className="bg-teal-50 text-teal-900 px-4 py-2 rounded-2xl border border-teal-200 text-xs sm:text-sm font-bold shrink-0">
            {completedRoutinesCount} of {mobilityRoutines.length} completed today
          </div>
        </div>

        {/* Mobility Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mobilityRoutines.map((routine) => {
            const isCompleted = routine.completedToday;
            const isExpanded = expandedRoutineId === routine.id;

            return (
              <div
                key={routine.id}
                className={`rounded-3xl border-2 transition-all p-5 flex flex-col justify-between space-y-4 ${
                  isCompleted
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-teal-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                        {routine.recommendedBy}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                        {routine.title}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        Target: {routine.targetArea} • {routine.durationMinutes} mins
                      </p>
                    </div>

                    <button
                      onClick={() => toggleRoutine(routine.id)}
                      className={`p-2 rounded-xl transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-emerald-50 text-slate-400 hover:text-emerald-700'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Safety Tip */}
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>Safety Tip:</strong> {routine.safetyTip}</span>
                  </div>

                  {/* Expand / Collapse Step Instructions */}
                  <div className="mt-3">
                    <button
                      onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                      className="text-xs text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Step Instructions' : 'View Step-by-Step Instructions'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <ol className="mt-2 space-y-1.5 list-decimal list-inside text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        {routine.instructions.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">
                    {isCompleted ? '✓ Completed today!' : 'Pending today'}
                  </span>
                  <button
                    onClick={() => toggleRoutine(routine.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                    }`}
                  >
                    {isCompleted ? 'Mark Not Done' : 'Complete Routine'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simple Past 5-Day Trend Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-teal-600" />
          <h3 className="text-xl font-bold text-slate-900">
            Recent 5-Day Health & Vitality Log
          </h3>
        </div>
        <p className="text-sm text-slate-500">
          Clean overview of your consistency over the past several days.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Water</th>
                <th className="py-3 px-3">Sleep</th>
                <th className="py-3 px-3">Activity</th>
                <th className="py-3 px-3">Blood Pressure</th>
                <th className="py-3 px-3">Mood</th>
              </tr>
            </thead>
            <tbody>
              {wellnessData.map((w, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 font-medium">
                  <td className="py-3 px-3 font-bold text-slate-900">{w.date}</td>
                  <td className="py-3 px-3 text-sky-700 font-semibold">{w.waterGlasses} / 8 glasses</td>
                  <td className="py-3 px-3">{w.sleepHours} hrs ({w.sleepQuality})</td>
                  <td className="py-3 px-3">{w.activityMinutes} mins ({w.activityType})</td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {w.bloodPressure ? `${w.bloodPressure.systolic}/${w.bloodPressure.diastolic} mmHg` : '—'}
                  </td>
                  <td className="py-3 px-3 capitalize">{w.mood}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddRestModal isOpen={isRestModalOpen} onClose={() => setIsRestModalOpen(false)} />
      <AddWalkModal isOpen={isWalkModalOpen} onClose={() => setIsWalkModalOpen(false)} />
      <AddBpmModal isOpen={isBpmModalOpen} onClose={() => setIsBpmModalOpen(false)} />
    </div>
  );
};
