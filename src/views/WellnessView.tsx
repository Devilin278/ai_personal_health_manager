import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Moon,
  Heart,
  Smile,
  Shield,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Volume2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export const WellnessView: React.FC = () => {
  const {
    todayWellness,
    updateTodayWellness,
    incrementWater,
    decrementWater,
    wellnessData,
    mobilityRoutines,
    toggleRoutine,
    speakText,
  } = useHealth();

  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);

  // Quick blood pressure input
  const [systolic, setSystolic] = useState<number>(todayWellness.bloodPressure?.systolic || 124);
  const [diastolic, setDiastolic] = useState<number>(todayWellness.bloodPressure?.diastolic || 78);
  const [pulse, setPulse] = useState<number>(todayWellness.bloodPressure?.pulse || 68);
  const [isEditingBP, setIsEditingBP] = useState(false);

  const handleSaveBP = (e: React.FormEvent) => {
    e.preventDefault();
    updateTodayWellness({
      bloodPressure: {
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        pulse: Number(pulse),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    });
    setIsEditingBP(false);
  };

  const completedRoutinesCount = mobilityRoutines.filter((r) => r.completedToday).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Daily Wellness & Senior Mobility
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Gentle tracking of hydration, restful sleep, daily steps, and physical therapist mobility routines.
          </p>
        </div>

        <button
          onClick={() =>
            speakText(
              `Today you have drunk ${todayWellness.waterGlasses} glasses of water. You slept ${todayWellness.sleepHours} hours. You completed ${completedRoutinesCount} of ${mobilityRoutines.length} mobility routines.`
            )
          }
          className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base transition-colors shrink-0"
        >
          <Volume2 className="w-5 h-5 text-teal-700" />
          <span>Listen to Wellness Summary</span>
        </button>
      </div>

      {/* Daily Vital Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Hydration Water Counter */}
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
              Hydration supports kidney health and medication absorption.
            </p>
          </div>

          {/* Interactive buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={decrementWater}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-lg transition-colors"
              aria-label="Decrease water"
            >
              -
            </button>
            <button
              onClick={incrementWater}
              className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-lg shadow-sm transition-all active:scale-95"
              aria-label="Add water"
            >
              + Add Glass
            </button>
          </div>
        </div>

        {/* 2. Sleep Hours & Quality */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Moon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full capitalize">
              {todayWellness.sleepQuality}
            </span>
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {todayWellness.sleepHours} <span className="text-base font-semibold text-slate-500">hours</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Quality sleep restores cognitive clarity and immune function.
            </p>
          </div>

          {/* Quick Adjustment */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => updateTodayWellness({ sleepHours: Math.max(4, todayWellness.sleepHours - 0.5) })}
              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm"
            >
              -30m
            </button>
            <button
              onClick={() => updateTodayWellness({ sleepHours: Math.min(12, todayWellness.sleepHours + 0.5) })}
              className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-xl text-sm"
            >
              +30m
            </button>
          </div>
        </div>

        {/* 3. Gentle Movement / Activity */}
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
              {todayWellness.activityMinutes} <span className="text-base font-semibold text-slate-500">mins</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1 truncate">
              {todayWellness.activityType}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => updateTodayWellness({ activityMinutes: todayWellness.activityMinutes + 10 })}
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all"
            >
              + 10 Mins Walk
            </button>
          </div>
        </div>

        {/* 4. Blood Pressure Reading */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full">
              Optimal &lt; 130/80
            </span>
          </div>

          <div>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {todayWellness.bloodPressure?.systolic || 124}/{todayWellness.bloodPressure?.diastolic || 78}
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Pulse: {todayWellness.bloodPressure?.pulse || 68} bpm • Measured at {todayWellness.bloodPressure?.time || 'Morning'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsEditingBP(!isEditingBP)}
              className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-colors"
            >
              {isEditingBP ? 'Close' : 'Update Reading'}
            </button>
          </div>
        </div>
      </div>

      {/* Blood Pressure Input Drawer */}
      {isEditingBP && (
        <form onSubmit={handleSaveBP} className="bg-rose-50/70 border-2 border-rose-200 rounded-3xl p-6 space-y-4 animate-fade-in">
          <h4 className="font-bold text-slate-900 text-base">Record Blood Pressure Measurement</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Systolic (Top number)</label>
              <input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-bold text-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Diastolic (Bottom number)</label>
              <input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-bold text-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pulse (Heart rate)</label>
              <input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-bold text-lg bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingBP(false)}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-sm"
            >
              Save Blood Pressure
            </button>
          </div>
        </form>
      )}

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
    </div>
  );
};

