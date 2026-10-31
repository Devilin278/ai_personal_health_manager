import React from 'react';
import {
  LayoutDashboard,
  Pill,
  Clock,
  CalendarDays,
  Activity,
  FileText,
  BotMessageSquare,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface TabItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, doseLogs, appointments } = useHealth();

  // Calculate pending meds today
  const pendingDoses = doseLogs.filter((d) => d.status === 'pending').length;

  const tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Health Dashboard',
      shortLabel: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'medications',
      label: 'Medications & Supplements',
      shortLabel: 'Medicine List',
      icon: Pill,
      badge: pendingDoses > 0 ? `${pendingDoses} due` : undefined,
    },
    {
      id: 'reminders',
      label: 'Daily Reminders',
      shortLabel: 'Reminders',
      icon: Clock,
    },
    {
      id: 'appointments',
      label: 'Doctor Appointments',
      shortLabel: 'Doctor Visits',
      icon: CalendarDays,
      badge: appointments.length > 0 ? appointments.length : undefined,
    },
    {
      id: 'wellness',
      label: 'Wellness & Mobility',
      shortLabel: 'Wellness',
      icon: Activity,
    },
    {
      id: 'records',
      label: 'Health Records & Summary',
      shortLabel: 'Records',
      icon: FileText,
    },
    {
      id: 'assistant',
      label: 'AI Health Companion',
      shortLabel: 'AI Assistant',
      icon: BotMessageSquare,
    },
  ];

  return (
    <nav className="w-full bg-white border-b border-slate-200 shadow-xs overflow-x-auto no-scrollbar">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 sm:space-x-3 py-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all select-none min-h-[46px] ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.shortLabel}</span>
                {tab.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold leading-tight ${
                      isActive
                        ? 'bg-teal-900 text-white'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

