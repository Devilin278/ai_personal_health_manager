import React from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { NotificationBanner } from './components/NotificationBanner';
import { DashboardView } from './views/DashboardView';
import { MedicationsView } from './views/MedicationsView';
import { RemindersView } from './views/RemindersView';
import { AppointmentsView } from './views/AppointmentsView';
import { WellnessView } from './views/WellnessView';
import { RecordsView } from './views/RecordsView';
import { AssistantView } from './views/AssistantView';
import { SimpleDashboardView } from './views/SimpleDashboardView';
import { Heart, ShieldAlert, Phone, HelpCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, fontSize, highContrast, simpleMode, profile } = useHealth();

  const fontSizeClass = {
    normal: 'font-scale-normal',
    large: 'font-scale-large',
    xl: 'font-scale-xl',
  }[fontSize];

  return (
    <div
      className={`min-h-screen flex flex-col ${fontSizeClass} ${
        highContrast ? 'high-contrast-mode bg-black text-white' : 'bg-[#F8F9FA] text-[#1E293B]'
      }`}
    >
      {/* Sticky Combined Header & Navigation (Smooth across all screen resize widths) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs">
        <Header />
        {!simpleMode && <Navigation />}
      </div>

      {/* Persistent Notification & Reminder Alert Banner */}
      <NotificationBanner />

      {/* Main Content Area — Fluidly Adapting to Page Width */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {simpleMode ? (
          <SimpleDashboardView />
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'medications' && <MedicationsView />}
            {activeTab === 'reminders' && <RemindersView />}
            {activeTab === 'appointments' && <AppointmentsView />}
            {activeTab === 'wellness' && <WellnessView />}
            {activeTab === 'records' && <RecordsView />}
            {activeTab === 'assistant' && <AssistantView />}
          </>
        )}
      </main>

      {/* Accessible Footer with Safety Disclaimer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs sm:text-sm text-slate-500 transition-colors">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-700">
            <Heart className="w-4 h-4 text-teal-600 fill-teal-600" />
            <span>CareCompanion — Senior-Accessible Personal Health & Medication Management</span>
          </div>
          <p className="max-w-3xl mx-auto leading-relaxed text-slate-500">
            <strong>Important Medical Disclaimer:</strong> CareCompanion is a personal organizational and educational tool created to empower patients and caregivers. It does not provide medical diagnosis, prescribe drugs, or replace consultation with licensed physicians, pharmacists, or emergency medical services. In any life-threatening situation or emergency, immediately call <strong>911</strong> or go to your nearest emergency facility.
          </p>
          <p className="text-slate-400">
            Patient Data Privacy: Information is stored locally on this device in full compliance with user data control principles.
          </p>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HealthProvider>
      <AppContent />
    </HealthProvider>
  );
};

export default App;

