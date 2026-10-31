import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Medication,
  Appointment,
  HealthRecord,
  WellnessData,
  MobilityRoutine,
  DoseLog,
  DoseStatus,
} from '../types/health';
import { generateHealthReportDocx } from '../utils/docxExport';
import {
  initialProfile,
  initialMedications,
  initialDoseLogs,
  initialAppointments,
  initialHealthRecords,
  initialWellnessData,
  initialMobilityRoutines,
  getTodayDateString,
} from '../data/mockData';

interface HealthContextType {
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  
  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, med: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  recordDosageChange: (medId: string, newDose: string, changedBy: string, reason: string) => void;
  
  doseLogs: DoseLog[];
  markDose: (id: string, status: DoseStatus) => void;
  
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, apt: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  toggleChecklistItem: (aptId: string, itemId: string) => void;
  addChecklistItem: (aptId: string, text: string, category: 'question' | 'symptom' | 'document') => void;
  savePostVisitNotes: (aptId: string, summary: string, tasks: string[]) => void;
  
  healthRecords: HealthRecord[];
  addRecord: (rec: Omit<HealthRecord, 'id'>) => void;
  deleteRecord: (id: string) => void;
  
  wellnessData: WellnessData[];
  todayWellness: WellnessData;
  updateTodayWellness: (updates: Partial<WellnessData>) => void;
  incrementWater: () => void;
  decrementWater: () => void;
  
  mobilityRoutines: MobilityRoutine[];
  toggleRoutine: (id: string) => void;
  
  // Accessibility
  fontSize: 'normal' | 'large' | 'xl';
  setFontSize: (size: 'normal' | 'large' | 'xl') => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  simpleMode: boolean;
  toggleSimpleMode: () => void;
  speakText: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  playReminderChime: () => void;
  
  // Navigation & Alerts
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeNotification: { title: string; message: string; type: 'reminder' | 'success' | 'info' | 'warning' } | null;
  dismissNotification: () => void;
  triggerSampleReminder: (medName: string, time: string) => void;
  
  // Data backup & export
  resetToSampleData: () => void;
  exportAllData: () => void;
  exportDocxReport: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'carecompanion_profile',
  MEDS: 'carecompanion_medications',
  DOSES: 'carecompanion_doses',
  APPOINTMENTS: 'carecompanion_appointments',
  RECORDS: 'carecompanion_records',
  WELLNESS: 'carecompanion_wellness',
  ROUTINES: 'carecompanion_routines',
  FONT_SIZE: 'carecompanion_font_size',
  HIGH_CONTRAST: 'carecompanion_high_contrast',
  SIMPLE_MODE: 'carecompanion_simple_mode',
};

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Profiles
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : initialProfile;
  });

  // Medications
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEDS);
    return saved ? JSON.parse(saved) : initialMedications;
  });

  // Dose Logs
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOSES);
    return saved ? JSON.parse(saved) : initialDoseLogs;
  });

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  // Health Records
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return saved ? JSON.parse(saved) : initialHealthRecords;
  });

  // Wellness Data
  const [wellnessData, setWellnessData] = useState<WellnessData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WELLNESS);
    return saved ? JSON.parse(saved) : initialWellnessData;
  });

  // Mobility Routines
  const [mobilityRoutines, setMobilityRoutines] = useState<MobilityRoutine[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    return saved ? JSON.parse(saved) : initialMobilityRoutines;
  });

  // Accessibility
  const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'xl'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    return (saved as 'normal' | 'large' | 'xl') || 'large';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST);
    return saved === 'true';
  });

  const [simpleMode, setSimpleMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SIMPLE_MODE);
    return saved === 'true';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeNotification, setActiveNotification] = useState<{
    title: string;
    message: string;
    type: 'reminder' | 'success' | 'info' | 'warning';
  } | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDS, JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(doseLogs));
  }, [doseLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(healthRecords));
  }, [healthRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WELLNESS, JSON.stringify(wellnessData));
  }, [wellnessData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(mobilityRoutines));
  }, [mobilityRoutines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSize);
    const sizeMap: Record<'normal' | 'large' | 'xl', string> = {
      normal: '16px',
      large: '20px', // +4px
      xl: '24px',    // +8px
    };
    document.documentElement.style.fontSize = sizeMap[fontSize] || '20px';
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIMPLE_MODE, String(simpleMode));
  }, [simpleMode]);

  // Handle Speech Synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // gently slower for clear comprehension
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Pleasant Web Audio chime tone for medication/appointment reminder
  const playReminderChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
      osc1.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.45); // C6

      osc2.frequency.setValueAtTime(261.63, ctx.currentTime); // C4

      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } catch {
      // AudioContext may be blocked before interaction
    }
  };

  const setFontSize = (size: 'normal' | 'large' | 'xl') => {
    setFontSizeState(size);
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  const toggleSimpleMode = () => {
    setSimpleMode((prev) => !prev);
  };

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  const triggerSampleReminder = (medName: string, time: string) => {
    playReminderChime();
    setActiveNotification({
      title: `Medication Reminder: ${medName}`,
      message: `It is ${time}. Please remember to take your scheduled dose with water as directed by your clinician.`,
      type: 'reminder',
    });
    speakText(`Reminder: It is time to take your scheduled dose of ${medName}.`);
  };

  // Profile actions
  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Medication actions
  const addMedication = (medData: Omit<Medication, 'id'>) => {
    const newMed: Medication = {
      ...medData,
      id: `med-${Date.now()}`,
    };
    setMedications((prev) => [...prev, newMed]);
    
    // Automatically add dose logs for today
    const today = getTodayDateString();
    const newLogs: DoseLog[] = (medData.timesOfDay || ['Morning (8:00 AM)']).map((time, idx) => ({
      id: `log-${Date.now()}-${idx}`,
      medicationId: newMed.id,
      medicationName: `${newMed.name} ${newMed.strength}`,
      scheduledTime: time,
      date: today,
      status: 'pending',
    }));
    setDoseLogs((prev) => [...prev, ...newLogs]);

    setActiveNotification({
      title: 'Medication Added Successfully',
      message: `${newMed.name} (${newMed.strength}) has been added to your care schedule.`,
      type: 'success',
    });
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updates } : med))
    );
  };

  const deleteMedication = (id: string) => {
    const medToDelete = medications.find((m) => m.id === id);
    setMedications((prev) => prev.filter((med) => med.id !== id));
    setDoseLogs((prev) => prev.filter((log) => log.medicationId !== id));
    setActiveNotification({
      title: 'Medication Removed',
      message: medToDelete ? `${medToDelete.name} has been removed from your list.` : 'Item removed.',
      type: 'info',
    });
  };

  const recordDosageChange = (
    medId: string,
    newDose: string,
    changedBy: string,
    reason: string
  ) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id !== medId) return med;
        const history = med.dosageChangeHistory || [];
        const updatedHistory = [
          {
            date: getTodayDateString(),
            previousDose: med.strength,
            newDose,
            changedBy,
            reason,
          },
          ...history,
        ];
        return {
          ...med,
          strength: newDose,
          dosageChangeHistory: updatedHistory,
        };
      })
    );
    setActiveNotification({
      title: 'Dosage Updated & Logged',
      message: `Dosage updated to ${newDose} as instructed by ${changedBy}.`,
      type: 'success',
    });
  };

  // Dose logging
  const markDose = (id: string, status: DoseStatus) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDoseLogs((prev) =>
      prev.map((log) =>
        log.id === id
          ? {
              ...log,
              status,
              takenAt: status === 'taken' ? nowTime : undefined,
            }
          : log
      )
    );

    if (status === 'taken') {
      playReminderChime();
    }
  };

  // Appointments
  const addAppointment = (aptData: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
    };
    setAppointments((prev) => [newApt, ...prev]);
    setActiveNotification({
      title: 'Appointment Scheduled',
      message: `Your visit with ${newApt.providerName} has been saved for ${newApt.date} at ${newApt.time}.`,
      type: 'success',
    });
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt))
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
  };

  const toggleChecklistItem = (aptId: string, itemId: string) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== aptId) return apt;
        return {
          ...apt,
          checklist: apt.checklist.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      })
    );
  };

  const addChecklistItem = (
    aptId: string,
    text: string,
    category: 'question' | 'symptom' | 'document'
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== aptId) return apt;
        return {
          ...apt,
          checklist: [
            ...apt.checklist,
            { id: `c-${Date.now()}`, text, completed: false, category },
          ],
        };
      })
    );
  };

  const savePostVisitNotes = (
    aptId: string,
    summary: string,
    tasks: string[]
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id !== aptId) return apt;
        return {
          ...apt,
          postVisitNotes: {
            summary,
            followUpTasks: tasks,
          },
        };
      })
    );
    setActiveNotification({
      title: 'Post-Visit Notes Saved',
      message: 'Follow-up instructions and notes have been recorded.',
      type: 'success',
    });
  };

  // Health Records
  const addRecord = (recData: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...recData,
      id: `rec-${Date.now()}`,
    };
    setHealthRecords((prev) => [newRecord, ...prev]);
    setActiveNotification({
      title: 'Document Saved',
      message: `"${newRecord.title}" is now organized in your records.`,
      type: 'success',
    });
  };

  const deleteRecord = (id: string) => {
    setHealthRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Wellness
  const todayStr = getTodayDateString();
  const todayWellness =
    wellnessData.find((w) => w.date === todayStr) || {
      date: todayStr,
      waterGlasses: 0,
      sleepHours: 7.0,
      sleepQuality: 'good' as const,
      activityMinutes: 0,
      activityType: 'Gentle walking',
      mood: 'good' as const,
    };

  const updateTodayWellness = (updates: Partial<WellnessData>) => {
    setWellnessData((prev) => {
      const existingIdx = prev.findIndex((w) => w.date === todayStr);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], ...updates };
        return next;
      } else {
        return [{ ...todayWellness, ...updates }, ...prev];
      }
    });
  };

  const incrementWater = () => {
    const current = todayWellness.waterGlasses;
    if (current < 16) {
      updateTodayWellness({ waterGlasses: current + 1 });
    }
  };

  const decrementWater = () => {
    const current = todayWellness.waterGlasses;
    if (current > 0) {
      updateTodayWellness({ waterGlasses: current - 1 });
    }
  };

  // Mobility
  const toggleRoutine = (id: string) => {
    setMobilityRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completedToday: !r.completedToday } : r))
    );
  };

  // Reset & Export
  const resetToSampleData = () => {
    setProfile(initialProfile);
    setMedications(initialMedications);
    setDoseLogs(initialDoseLogs);
    setAppointments(initialAppointments);
    setHealthRecords(initialHealthRecords);
    setWellnessData(initialWellnessData);
    setMobilityRoutines(initialMobilityRoutines);
    localStorage.clear();
    setActiveNotification({
      title: 'Restored to Sample Data',
      message: 'Default senior health profile and sample records have been loaded.',
      type: 'info',
    });
  };

  const exportDocxReport = async () => {
    try {
      await generateHealthReportDocx({
        profile,
        medications,
        appointments,
        healthRecords,
        wellnessData,
      });
      setActiveNotification({
        title: 'Word Document (.docx) Downloaded',
        message: 'Your personal Medicine List, Doctors List, and Health Records have been saved to your downloads folder.',
        type: 'success',
      });
    } catch (err) {
      console.error('Error generating docx:', err);
      alert('Could not generate Word document: ' + err);
    }
  };

  const exportAllData = () => {
    // Generates formatted Word document version of Medicine, Doctors, and Records
    exportDocxReport();
  };

  return (
    <HealthContext.Provider
      value={{
        profile,
        updateProfile,
        medications,
        addMedication,
        updateMedication,
        deleteMedication,
        recordDosageChange,
        doseLogs,
        markDose,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        toggleChecklistItem,
        addChecklistItem,
        savePostVisitNotes,
        healthRecords,
        addRecord,
        deleteRecord,
        wellnessData,
        todayWellness,
        updateTodayWellness,
        incrementWater,
        decrementWater,
        mobilityRoutines,
        toggleRoutine,
        fontSize,
        setFontSize,
        highContrast,
        toggleHighContrast,
        simpleMode,
        toggleSimpleMode,
        speakText,
        isSpeaking,
        stopSpeaking,
        playReminderChime,
        activeTab,
        setActiveTab,
        activeNotification,
        dismissNotification,
        triggerSampleReminder,
        resetToSampleData,
        exportAllData,
        exportDocxReport,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

