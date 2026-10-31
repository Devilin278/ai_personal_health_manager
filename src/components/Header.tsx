import React, { useState } from 'react';
import {
  Heart,
  Volume2,
  VolumeX,
  ShieldAlert,
  Type,
  SunMoon,
  Sparkles,
  Download,
  RotateCcw,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { EmergencyModal } from './EmergencyModal';

export const Header: React.FC = () => {
  const {
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
    simpleMode,
    toggleSimpleMode,
    isSpeaking,
    stopSpeaking,
    resetToSampleData,
    exportAllData,
  } = useHealth();

  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors duration-200">
      {/* Top Health & Safety Notice Banner — Fluid Width */}
      <div className="w-full bg-teal-900 text-teal-100 px-4 sm:px-6 lg:px-8 py-1.5 text-xs sm:text-sm font-medium">
        <div className="w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="truncate">CareCompanion provides personal tracking support. For medical emergencies, call 911 immediately.</span>
          </div>
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-0.5 rounded text-xs flex items-center gap-1 shadow transition-colors shrink-0"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> SOS Emergency
          </button>
        </div>
      </div>

      {/* Main Bar — Fluid to Width of Page with Flexible Wrapping */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 truncate">
                CareCompanion
              </h1>
              <span className="hidden sm:inline-block bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full font-semibold shrink-0">
                Senior Accessible
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">
              Daily Health, Medication & Appointment Guide
            </p>
          </div>
        </div>

        {/* Accessibility & Action Bar — Fluid & Wrapping to any Screen Width */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Read Aloud Stop Indicator */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-3 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-sm font-bold flex items-center gap-1.5 animate-pulse"
              title="Stop speaking"
            >
              <VolumeX className="w-4 h-4 text-amber-700" /> Stop Reading
            </button>
          )}

          {/* Text Size Switcher (Noticeable 4px Tiers: 16px, 20px, 24px) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <span className="px-1.5 text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" /> Text:
            </span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                fontSize === 'normal'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Standard text size (16px)"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1 text-sm font-bold rounded-lg transition-all ${
                fontSize === 'large'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Large text size (20px / +4px difference)"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`px-2.5 py-1 text-base font-extrabold rounded-lg transition-all ${
                fontSize === 'xl'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Extra large text size (24px / +8px difference)"
            >
              A++
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-1.5 transition-colors shrink-0 ${
              highContrast
                ? 'bg-black text-yellow-300 border-black font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle high contrast mode"
          >
            <SunMoon className="w-4 h-4" />
            <span className="hidden sm:inline">High Contrast</span>
            <span className="sm:hidden">Contrast</span>
          </button>

          {/* Simple Mode Toggle */}
          <button
            onClick={toggleSimpleMode}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-1.5 transition-colors shrink-0 ${
              simpleMode
                ? 'bg-teal-700 text-white border-teal-800 shadow-inner'
                : 'bg-white text-teal-800 border-teal-200 hover:bg-teal-50'
            }`}
            title="Toggle simplified distraction-free view"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{simpleMode ? 'Standard View' : 'Simple View'}</span>
          </button>

          {/* Export & Reset Actions */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-200 shrink-0">
            <button
              onClick={exportAllData}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Export all health data (JSON)"
              aria-label="Export all health data"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset back to default sample health data?')) {
                  resetToSampleData();
                }
              }}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset to sample data"
              aria-label="Reset to sample data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
    </header>
  );
};
