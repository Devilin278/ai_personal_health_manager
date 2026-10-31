import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  UserProfile,
  Medication,
  Appointment,
  HealthRecord,
  WellnessData,
} from '../types/health';
import { getTodayDateString } from '../data/mockData';

// Color Palette matching CareCompanion Theme
const COLORS = {
  TEAL_DARK: [15, 118, 110] as [number, number, number], // #0F766E
  TEAL_MAIN: [13, 148, 136] as [number, number, number], // #0D9488
  TEAL_LIGHT: [240, 253, 250] as [number, number, number], // #F0FDFA
  TEAL_ACCENT: [45, 212, 191] as [number, number, number],
  SLATE_DARK: [15, 23, 42] as [number, number, number], // #0F172A
  SLATE_BODY: [51, 65, 85] as [number, number, number], // #334155
  SLATE_MUTED: [100, 116, 139] as [number, number, number], // #64748B
  BORDER_GRAY: [203, 213, 225] as [number, number, number], // #CBD5E1
  RED_ALERT: [185, 28, 28] as [number, number, number], // #B91C1C
  RED_LIGHT: [254, 242, 242] as [number, number, number], // #FEF2F2
};

export const generateHealthReportPdf = (data: {
  profile: UserProfile;
  medications: Medication[];
  appointments: Appointment[];
  healthRecords: HealthRecord[];
  wellnessData?: WellnessData[];
}): void => {
  const { profile, medications, appointments, healthRecords, wellnessData } = data;
  const todayStr = getTodayDateString();
  const latestWellness = wellnessData && wellnessData[0];

  // Initialize PDF in Portrait Letter size (units in pt: 612 x 792)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36; // 0.5 inch margins
  const contentWidth = pageWidth - margin * 2;
  let currentY = 36;

  // Helper for Section Titles
  const addSectionHeader = (title: string, color: [number, number, number] = COLORS.TEAL_DARK) => {
    // Check if space needed for next section
    if (currentY > 710) {
      doc.addPage();
      currentY = 36;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(title, margin, currentY);
    currentY += 4;
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(1.2);
    doc.line(margin, currentY, margin + contentWidth, currentY);
    currentY += 14;
  };

  // ==========================================
  // HEADER BANNER
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(COLORS.TEAL_DARK[0], COLORS.TEAL_DARK[1], COLORS.TEAL_DARK[2]);
  doc.text('CareCompanion', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(COLORS.SLATE_MUTED[0], COLORS.SLATE_MUTED[1], COLORS.SLATE_MUTED[2]);
  doc.text(`Generated: ${todayStr} | Confidential Personal Medical Summary`, pageWidth - margin, currentY, {
    align: 'right',
  });
  currentY += 16;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(COLORS.SLATE_DARK[0], COLORS.SLATE_DARK[1], COLORS.SLATE_DARK[2]);
  doc.text('Personal Health, Medication & Doctor Visit Summary', margin, currentY);
  currentY += 16;

  // ==========================================
  // PATIENT & EMERGENCY OVERVIEW BOX
  // ==========================================
  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 5,
      textColor: COLORS.SLATE_BODY,
      lineColor: COLORS.BORDER_GRAY,
      lineWidth: 0.5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: COLORS.SLATE_DARK, cellWidth: 90 },
      1: { cellWidth: 180 },
      2: { fontStyle: 'bold', textColor: COLORS.SLATE_DARK, cellWidth: 110 },
      3: { cellWidth: 160 },
    },
    body: [
      [
        'Patient Name:',
        profile.name,
        'Primary Doctor:',
        `${profile.primaryDoctor.name} (${profile.primaryDoctor.phone})`,
      ],
      [
        'Date of Birth:',
        `${profile.dateOfBirth} (Blood: ${profile.bloodType})`,
        'Clinic / Hospital:',
        profile.primaryDoctor.clinic,
      ],
      [
        'Preferred Pharmacy:',
        `${profile.preferredPharmacy.name} (${profile.preferredPharmacy.phone})`,
        'Emergency Contact:',
        `${profile.emergencyContact.name} (${profile.emergencyContact.relationship}) - ${profile.emergencyContact.phone}`,
      ],
      [
        'Active Diagnoses:',
        { content: profile.chronicConditions.join('; '), colSpan: 3 },
      ],
    ],
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 18;

  // ==========================================
  // 1. MEDICATIONS & SUPPLEMENTS LIST (FIRST!)
  // ==========================================
  addSectionHeader(`1. Current Medications & Supplements (${medications.length} Active Items)`);

  const medTableRows = medications.map((med) => [
    `${med.name}\n(${med.genericName || med.type.toUpperCase()})`,
    `${med.strength}\n${med.form}`,
    `${med.instructions}\nSchedule: ${med.timesOfDay.join(', ')}`,
    med.takeWithFood === 'food'
      ? 'Take with food'
      : med.takeWithFood === 'empty'
      ? 'Empty stomach'
      : 'With/without food',
    `${med.purpose}\nPrescriber: ${med.prescribingClinician || 'Over-The-Counter'}`,
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'striped',
    head: [['Medication / Product', 'Strength', 'Instructions & Schedule', 'Food Guidance', 'Purpose / Prescriber']],
    body: medTableRows,
    headStyles: {
      fillColor: COLORS.TEAL_DARK,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: COLORS.TEAL_LIGHT,
    },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 4.5,
      textColor: COLORS.SLATE_BODY,
      lineColor: COLORS.BORDER_GRAY,
      lineWidth: 0.5,
      valign: 'middle',
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: COLORS.SLATE_DARK, cellWidth: 105 },
      1: { cellWidth: 65 },
      2: { cellWidth: 170 },
      3: { cellWidth: 80 },
      4: { cellWidth: 120 },
    },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 18;

  // ==========================================
  // 2. ALLERGIES & ADVERSE REACTIONS (SECOND!)
  // ==========================================
  addSectionHeader('2. Known Allergies & Adverse Drug Reactions', COLORS.RED_ALERT);

  const allergyRows = profile.allergies.map((a) => [
    a.allergen,
    a.reaction,
    a.severity.toUpperCase(),
    a.severity === 'severe'
      ? 'Strictly Avoid; High Risk Reaction. Notify triage immediately.'
      : 'Avoid; monitor carefully if alternative required.',
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    head: [['Allergen / Substance', 'Reaction & Symptoms Experienced', 'Severity', 'Clinical Precaution']],
    body: allergyRows,
    headStyles: {
      fillColor: COLORS.RED_ALERT,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: COLORS.RED_LIGHT,
    },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 4.5,
      textColor: COLORS.SLATE_BODY,
      lineColor: [252, 165, 165], // Soft red border
      lineWidth: 0.5,
      valign: 'middle',
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: COLORS.RED_ALERT, cellWidth: 110 },
      1: { cellWidth: 180 },
      2: { fontStyle: 'bold', textColor: COLORS.RED_ALERT, cellWidth: 70 },
      3: { cellWidth: 180 },
    },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 18;

  // ==========================================
  // 3. DOCTORS & APPOINTMENTS (LASTLY!)
  // ==========================================
  addSectionHeader('3. Healthcare Providers & Upcoming Appointments');

  const aptRows = appointments.map((apt) => [
    `${apt.providerName}\n${apt.specialty}`,
    `${apt.clinicName}\n${apt.location}\nPhone: ${apt.phone}`,
    `${apt.date}\n${apt.time} (${apt.visitType.toUpperCase()})`,
    apt.checklist.length > 0
      ? apt.checklist
          .slice(0, 3)
          .map((c) => `[${c.completed ? 'X' : ' '}] ${c.text}`)
          .join('\n')
      : 'Routine follow-up',
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'striped',
    head: [['Doctor / Specialist', 'Clinic, Location & Contact', 'Date & Time', 'Preparation Checklist']],
    body: aptRows,
    headStyles: {
      fillColor: COLORS.TEAL_DARK,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: COLORS.TEAL_LIGHT,
    },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 4.5,
      textColor: COLORS.SLATE_BODY,
      lineColor: COLORS.BORDER_GRAY,
      lineWidth: 0.5,
      valign: 'middle',
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: COLORS.SLATE_DARK, cellWidth: 120 },
      1: { cellWidth: 160 },
      2: { fontStyle: 'bold', textColor: COLORS.TEAL_DARK, cellWidth: 100 },
      3: { cellWidth: 160 },
    },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 18;

  // ==========================================
  // 4. HEALTH RECORDS & DIAGNOSTIC FINDINGS
  // ==========================================
  addSectionHeader('4. Health Records & Diagnostic Reports');

  const recordRows = healthRecords.map((rec) => [
    `${rec.title}\n${rec.date} — ${rec.provider}`,
    rec.summary,
    rec.keyFindings && rec.keyFindings.length > 0 ? rec.keyFindings.join('\n• ') : 'Archived record',
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    head: [['Document / Report', 'Plain-Language Summary', 'Key Clinical Findings & Numbers']],
    body: recordRows,
    headStyles: {
      fillColor: COLORS.TEAL_DARK,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: COLORS.TEAL_LIGHT,
    },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 4.5,
      textColor: COLORS.SLATE_BODY,
      lineColor: COLORS.BORDER_GRAY,
      lineWidth: 0.5,
      valign: 'middle',
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: COLORS.SLATE_DARK, cellWidth: 130 },
      1: { cellWidth: 200 },
      2: { cellWidth: 210 },
    },
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 14;

  // ==========================================
  // 5. RECENT VITALS & CLINICIAN NOTES
  // ==========================================
  if (currentY > 670) {
    doc.addPage();
    currentY = 36;
  }

  if (latestWellness && latestWellness.bloodPressure) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(COLORS.TEAL_DARK[0], COLORS.TEAL_DARK[1], COLORS.TEAL_DARK[2]);
    doc.text(
      `Latest Self-Monitored Vitals: Blood Pressure ${latestWellness.bloodPressure.systolic}/${latestWellness.bloodPressure.diastolic} mmHg (Pulse: ${latestWellness.bloodPressure.pulse} bpm)  |  Weight: ${latestWellness.weightLbs || 148} lbs  |  Hydration: ${latestWellness.waterGlasses}/8 glasses`,
      margin,
      currentY
    );
    currentY += 16;
  }

  // Physician Visit Notes Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(COLORS.SLATE_DARK[0], COLORS.SLATE_DARK[1], COLORS.SLATE_DARK[2]);
  doc.text('Doctor / Clinician Visit Notes & Instructions:', margin, currentY);
  currentY += 10;

  doc.setDrawColor(COLORS.BORDER_GRAY[0], COLORS.BORDER_GRAY[1], COLORS.BORDER_GRAY[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 12, margin + contentWidth, currentY + 12);
  doc.line(margin, currentY + 28, margin + contentWidth, currentY + 28);
  doc.line(margin, currentY + 44, margin + contentWidth, currentY + 44);
  currentY += 56;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(COLORS.SLATE_MUTED[0], COLORS.SLATE_MUTED[1], COLORS.SLATE_MUTED[2]);
  doc.text('Clinician Signature: ___________________________________      Date: ________________', margin, currentY);
  currentY += 14;

  // ==========================================
  // PAGE NUMBERS & FOOTER ON ALL PAGES
  // ==========================================
  const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(COLORS.SLATE_MUTED[0], COLORS.SLATE_MUTED[1], COLORS.SLATE_MUTED[2]);
    doc.text(
      'Notice: Prepared by patient using CareCompanion for medical appointment discussions. Does not replace official hospital charts or 911 emergency services.',
      margin,
      778
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 778, { align: 'right' });
  }

  // Trigger Instant Browser PDF Download
  doc.save(`CareCompanion_Health_Summary_${todayStr}.pdf`);
};
