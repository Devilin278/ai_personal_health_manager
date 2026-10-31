export type MedicationType = 'prescription' | 'otc' | 'supplement' | 'vitamin';

export type DoseStatus = 'pending' | 'taken' | 'skipped' | 'snoozed';

export interface DoseLog {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string; // "08:00 AM"
  date: string; // "YYYY-MM-DD"
  status: DoseStatus;
  takenAt?: string; // ISO timestamp or formatted time
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  strength: string; // e.g. "10 mg"
  form: 'tablet' | 'capsule' | 'liquid' | 'inhaler' | 'topical' | 'injection';
  pillColor: string; // for visual cue e.g. "#F3F4F6", "#FDE047", "#93C5FD"
  pillShape: 'round' | 'oval' | 'capsule' | 'dropper';
  type: MedicationType;
  instructions: string; // e.g. "Take 1 tablet by mouth daily in the morning with water"
  frequency: string; // e.g. "Once daily", "Twice daily"
  timesOfDay: string[]; // ["Morning (8:00 AM)", "Evening (8:00 PM)"]
  scheduledHours: string[]; // ["08:00", "20:00"]
  prescribingClinician?: string;
  clinicName?: string;
  startDate: string;
  stopDate?: string;
  takeWithFood: 'food' | 'empty' | 'either';
  purpose: string; // e.g. "Blood pressure control"
  notes?: string;
  refillReminder?: {
    pillsRemaining: number;
    refillDate?: string;
    pharmacyPhone?: string;
  };
  dosageChangeHistory?: {
    date: string;
    previousDose: string;
    newDose: string;
    changedBy: string;
    reason: string;
  }[];
}

export interface Appointment {
  id: string;
  providerName: string;
  specialty: string;
  clinicName: string;
  location: string;
  phone: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "10:30 AM"
  visitType: 'in-person' | 'telehealth' | 'home-visit';
  reminderLeadHours: number[]; // [24, 2]
  status: 'upcoming' | 'completed' | 'cancelled';
  telehealthLink?: string;
  transitNotes?: string;
  checklist: {
    id: string;
    text: string;
    completed: boolean;
    category: 'question' | 'symptom' | 'document';
  }[];
  postVisitNotes?: {
    summary: string;
    followUpTasks: string[];
    nextAppointmentNeeded?: string;
  };
}

export interface HealthRecord {
  id: string;
  title: string;
  category: 'lab_results' | 'discharge_summary' | 'care_plan' | 'eye_exam' | 'vaccination' | 'imaging';
  provider: string;
  date: string;
  summary: string;
  keyFindings: string[];
  normalValues?: { name: string; value: string; status: 'normal' | 'attention' | 'optimal' }[];
  fileSize?: string;
  fileName?: string;
  doctorComments?: string;
}

export interface WellnessData {
  date: string;
  waterGlasses: number; // target: 8
  sleepHours: number; // target: 7.5
  sleepQuality: 'great' | 'good' | 'fair' | 'poor';
  activityMinutes: number; // target: 30
  activityType: string;
  mood: 'great' | 'good' | 'neutral' | 'tired' | 'unwell';
  notes?: string;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    pulse: number;
    time: string;
  };
  weightLbs?: number;
}

export interface MobilityRoutine {
  id: string;
  title: string;
  durationMinutes: number;
  recommendedBy: string;
  difficulty: 'gentle' | 'easy' | 'moderate';
  targetArea: string;
  instructions: string[];
  safetyTip: string;
  completedToday: boolean;
  icon: string;
}

export interface CaregiverInfo {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  alertDelayHours: number; // e.g. 2 hours
  notifyOnMissedMedication: boolean;
  notifyOnMissedAppointment: boolean;
}

export interface UserProfile {
  name: string;
  preferredName: string;
  dateOfBirth: string;
  bloodType: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  secondaryContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  primaryDoctor: {
    name: string;
    clinic: string;
    phone: string;
  };
  preferredPharmacy: {
    name: string;
    address: string;
    phone: string;
  };
  chronicConditions: string[];
  allergies: { allergen: string; reaction: string; severity: 'mild' | 'moderate' | 'severe' }[];
  caregiver?: CaregiverInfo | null;
  caregiverNotificationsEnabled: boolean;
  caregiverContact?: string;
  accessibility: {
    fontSize: 'normal' | 'large' | 'xl';
    highContrast: boolean;
    audioAssistance: boolean;
    simpleMode: boolean;
  };
}

