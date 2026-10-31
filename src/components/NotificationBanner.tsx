import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, X, Volume2 } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export const NotificationBanner: React.FC = () => {
  const { activeNotification, dismissNotification, speakText } = useHealth();

  if (!activeNotification) return null;

  const { title, message, type } = activeNotification;

  const bgStyles = {
    reminder: 'bg-amber-500 text-white border-amber-600',
    success: 'bg-emerald-600 text-white border-emerald-700',
    warning: 'bg-orange-600 text-white border-orange-700',
    info: 'bg-teal-700 text-white border-teal-800',
  }[type];

  const Icon = {
    reminder: Bell,
    success: CheckCircle2,
    warning: AlertTriangle,
    info: Info,
  }[type];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-4 animate-slide-down">
      <div
        className={`${bgStyles} rounded-2xl p-4 shadow-lg border flex items-center justify-between gap-4`}
        role="alert"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl shrink-0">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-lg leading-snug">{title}</h4>
            <p className="text-white/90 text-sm sm:text-base">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => speakText(`${title}. ${message}`)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors flex items-center gap-1 text-sm font-semibold"
            title="Read announcement aloud"
            aria-label="Read announcement aloud"
          >
            <Volume2 className="w-5 h-5" />
            <span className="hidden sm:inline">Listen</span>
          </button>
          <button
            onClick={dismissNotification}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors"
            title="Dismiss notification"
            aria-label="Dismiss notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

