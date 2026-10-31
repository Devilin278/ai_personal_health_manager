import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  HeadingLevel,
} from 'docx';
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
  TEAL_DARK: '0F766E', // Primary deep teal
  TEAL_MAIN: '0D9488', // Brand teal
  TEAL_LIGHT: 'F0FDFA', // Soft teal background
  TEAL_BORDER: '99F6E4', // Soft teal border
  SLATE_DARK: '0F172A', // Heading text
  SLATE_BODY: '334155', // Regular body text
  SLATE_MUTED: '64748B', // Muted/helper text
  BORDER_GRAY: 'CBD5E1', // Table borders
  RED_ALERT: 'B91C1C', // Allergy red
  RED_BG: 'FEF2F2', // Allergy light red
};

export const generateHealthReportDocx = async (data: {
  profile: UserProfile;
  medications: Medication[];
  appointments: Appointment[];
  healthRecords: HealthRecord[];
  wellnessData?: WellnessData[];
}): Promise<void> => {
  const { profile, medications, appointments, healthRecords, wellnessData } = data;
  const todayStr = getTodayDateString();
  const latestWellness = wellnessData && wellnessData[0];

  const tableBorderConfig = {
    top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.BORDER_GRAY },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.BORDER_GRAY },
    left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.BORDER_GRAY },
    right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.BORDER_GRAY },
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch margins for spacious printing
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // Header / Banner
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'CareCompanion',
                bold: true,
                size: 36, // 18pt
                color: COLORS.TEAL_DARK,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: 'Personal Health & Medication Management Summary',
                bold: true,
                size: 26, // 13pt
                color: COLORS.SLATE_DARK,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `Prepared for: ${profile.name}  |  Generated on: ${todayStr}`,
                size: 20, // 10pt
                color: COLORS.SLATE_MUTED,
                font: 'Arial',
                italics: true,
              }),
            ],
          }),

          // Section 1: Patient Details & Medical ID Grid
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({
                text: '1. Patient Overview & Emergency Contacts',
                bold: true,
                size: 24,
                color: COLORS.TEAL_DARK,
                font: 'Arial',
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: tableBorderConfig,
                    shading: { fill: COLORS.TEAL_LIGHT, type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        spacing: { after: 60 },
                        children: [
                          new TextRun({ text: 'Patient: ', bold: true, size: 20, color: COLORS.SLATE_DARK }),
                          new TextRun({ text: profile.name, size: 20, bold: true }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 60 },
                        children: [
                          new TextRun({ text: 'Date of Birth: ', bold: true, size: 20, color: COLORS.SLATE_DARK }),
                          new TextRun({ text: profile.dateOfBirth, size: 20 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Blood Type: ', bold: true, size: 20, color: COLORS.SLATE_DARK }),
                          new TextRun({ text: profile.bloodType, size: 20, bold: true }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: tableBorderConfig,
                    shading: { fill: COLORS.TEAL_LIGHT, type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        spacing: { after: 60 },
                        children: [
                          new TextRun({ text: 'Primary Doctor: ', bold: true, size: 20, color: COLORS.SLATE_DARK }),
                          new TextRun({ text: `${profile.primaryDoctor.name} (${profile.primaryDoctor.phone})`, size: 20 }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 60 },
                        children: [
                          new TextRun({ text: 'Clinic: ', bold: true, size: 20, color: COLORS.SLATE_DARK }),
                          new TextRun({ text: profile.primaryDoctor.clinic, size: 20 }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Family Contact: ', bold: true, size: 20, color: COLORS.SLATE_DARK }),
                          new TextRun({ text: `${profile.emergencyContact.name} (${profile.emergencyContact.relationship}) - ${profile.emergencyContact.phone}`, size: 20, bold: true }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Allergies & Conditions Callout
          new Paragraph({
            spacing: { before: 140, after: 80 },
            children: [
              new TextRun({
                text: 'CRITICAL DRUG ALLERGIES: ',
                bold: true,
                size: 20,
                color: COLORS.RED_ALERT,
              }),
              new TextRun({
                text: profile.allergies.map((a) => `${a.allergen} (${a.reaction})`).join('; ') || 'No known allergies',
                bold: true,
                size: 20,
                color: COLORS.RED_ALERT,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Active Conditions: ', bold: true, size: 20, color: COLORS.SLATE_DARK }),
              new TextRun({ text: profile.chronicConditions.join('; '), size: 20 }),
            ],
          }),

          // Section 2: Complete Medication & Supplement List
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
            children: [
              new TextRun({
                text: `2. Medications & Supplements List (${medications.length} Active Items)`,
                bold: true,
                size: 24,
                color: COLORS.TEAL_DARK,
                font: 'Arial',
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header Row
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    borders: tableBorderConfig,
                    shading: { fill: COLORS.TEAL_DARK, type: ShadingType.CLEAR },
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Medication / Supplement', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorderConfig,
                    shading: { fill: COLORS.TEAL_DARK, type: ShadingType.CLEAR },
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Dose & Form', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorderConfig,
                    shading: { fill: COLORS.TEAL_DARK, type: ShadingType.CLEAR },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Instructions & Schedule', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorderConfig,
                    shading: { fill: COLORS.TEAL_DARK, type: ShadingType.CLEAR },
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Food Notes', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorderConfig,
                    shading: { fill: COLORS.TEAL_DARK, type: ShadingType.CLEAR },
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Prescriber / Purpose', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                ],
              }),

              // Data Rows
              ...medications.map(
                (med, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        borders: tableBorderConfig,
                        shading: { fill: index % 2 === 0 ? 'FFFFFF' : COLORS.TEAL_LIGHT, type: ShadingType.CLEAR },
                        children: [
                          new Paragraph({
                            spacing: { after: 30 },
                            children: [new TextRun({ text: med.name, bold: true, size: 20, color: COLORS.SLATE_DARK })],
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `${med.type.toUpperCase()}${med.genericName ? ` (${med.genericName})` : ''}`,
                                size: 16,
                                color: COLORS.SLATE_MUTED,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        borders: tableBorderConfig,
                        shading: { fill: index % 2 === 0 ? 'FFFFFF' : COLORS.TEAL_LIGHT, type: ShadingType.CLEAR },
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: `${med.strength} (${med.form})`, size: 19 })],
                          }),
                        ],
                      }),
                      new TableCell({
                        borders: tableBorderConfig,
                        shading: { fill: index % 2 === 0 ? 'FFFFFF' : COLORS.TEAL_LIGHT, type: ShadingType.CLEAR },
                        children: [
                          new Paragraph({
                            spacing: { after: 30 },
                            children: [new TextRun({ text: med.instructions, size: 19 })],
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `Schedule: ${med.timesOfDay.join(', ')}`,
                                bold: true,
                                size: 17,
                                color: COLORS.TEAL_DARK,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        borders: tableBorderConfig,
                        shading: { fill: index % 2 === 0 ? 'FFFFFF' : COLORS.TEAL_LIGHT, type: ShadingType.CLEAR },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text:
                                  med.takeWithFood === 'food'
                                    ? 'Take with food'
                                    : med.takeWithFood === 'empty'
                                    ? 'Empty stomach'
                                    : 'With or without food',
                                size: 18,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        borders: tableBorderConfig,
                        shading: { fill: index % 2 === 0 ? 'FFFFFF' : COLORS.TEAL_LIGHT, type: ShadingType.CLEAR },
                        children: [
                          new Paragraph({
                            spacing: { after: 30 },
                            children: [new TextRun({ text: med.purpose, size: 18, bold: true })],
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: med.prescribingClinician || 'Over-The-Counter',
                                size: 16,
                                color: COLORS.SLATE_MUTED,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),

          // Section 3: Healthcare Providers & Doctor Appointments
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 260, after: 120 },
            children: [
              new TextRun({
                text: '3. Healthcare Providers & Upcoming Appointments',
                bold: true,
                size: 24,
                color: COLORS.TEAL_DARK,
                font: 'Arial',
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    borders: tableBorderConfig,
                    shading: { fill: COLORS.TEAL_DARK, type: ShadingType.CLEAR },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Doctor / Provider', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorderConfig,
                    shading: { fill: COLORS.TEAL_DARK, type: ShadingType.CLEAR },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Clinic & Contact', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorderConfig,
                    shading: { fill: COLORS.TEAL_DARK, type: ShadingType.CLEAR },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Date & Time', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorderConfig,
                    shading: { fill: COLORS.TEAL_DARK, type: ShadingType.CLEAR },
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Preparation Checklist', bold: true, color: 'FFFFFF', size: 19 })],
                      }),
                    ],
                  }),
                ],
              }),

              ...appointments.map(
                (apt, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        borders: tableBorderConfig,
                        shading: { fill: index % 2 === 0 ? 'FFFFFF' : COLORS.TEAL_LIGHT, type: ShadingType.CLEAR },
                        children: [
                          new Paragraph({
                            spacing: { after: 30 },
                            children: [new TextRun({ text: apt.providerName, bold: true, size: 20, color: COLORS.SLATE_DARK })],
                          }),
                          new Paragraph({
                            children: [new TextRun({ text: apt.specialty, size: 17, color: COLORS.TEAL_DARK })],
                          }),
                        ],
                      }),
                      new TableCell({
                        borders: tableBorderConfig,
                        shading: { fill: index % 2 === 0 ? 'FFFFFF' : COLORS.TEAL_LIGHT, type: ShadingType.CLEAR },
                        children: [
                          new Paragraph({
                            spacing: { after: 30 },
                            children: [new TextRun({ text: apt.clinicName, size: 18, bold: true })],
                          }),
                          new Paragraph({
                            spacing: { after: 20 },
                            children: [new TextRun({ text: apt.location, size: 16, color: COLORS.SLATE_MUTED })],
                          }),
                          new Paragraph({
                            children: [new TextRun({ text: `Phone: ${apt.phone}`, size: 17, bold: true, color: COLORS.SLATE_DARK })],
                          }),
                        ],
                      }),
                      new TableCell({
                        borders: tableBorderConfig,
                        shading: { fill: index % 2 === 0 ? 'FFFFFF' : COLORS.TEAL_LIGHT, type: ShadingType.CLEAR },
                        children: [
                          new Paragraph({
                            spacing: { after: 20 },
                            children: [new TextRun({ text: `${apt.date}`, bold: true, size: 19 })],
                          }),
                          new Paragraph({
                            children: [new TextRun({ text: `${apt.time} (${apt.visitType})`, size: 17, color: COLORS.TEAL_DARK })],
                          }),
                        ],
                      }),
                      new TableCell({
                        borders: tableBorderConfig,
                        shading: { fill: index % 2 === 0 ? 'FFFFFF' : COLORS.TEAL_LIGHT, type: ShadingType.CLEAR },
                        children: apt.checklist.slice(0, 3).map(
                          (item) =>
                            new Paragraph({
                              spacing: { after: 20 },
                              children: [
                                new TextRun({
                                  text: `[${item.completed ? 'X' : ' '}] ${item.text}`,
                                  size: 16,
                                  color: COLORS.SLATE_BODY,
                                }),
                              ],
                            })
                        ),
                      }),
                    ],
                  })
              ),
            ],
          }),

          // Section 4: Health Records & Diagnostic Summaries
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 260, after: 120 },
            children: [
              new TextRun({
                text: '4. Health Records & Diagnostic Reports',
                bold: true,
                size: 24,
                color: COLORS.TEAL_DARK,
                font: 'Arial',
              }),
            ],
          }),

          ...healthRecords.flatMap((rec) => [
            new Paragraph({
              spacing: { before: 120, after: 40 },
              children: [
                new TextRun({ text: `• ${rec.title}`, bold: true, size: 21, color: COLORS.SLATE_DARK }),
                new TextRun({ text: ` (${rec.date} — ${rec.provider})`, size: 18, color: COLORS.SLATE_MUTED }),
              ],
            }),
            new Paragraph({
              spacing: { after: 60 },
              indent: { left: 360 },
              children: [
                new TextRun({ text: 'Summary: ', bold: true, size: 18, color: COLORS.TEAL_DARK }),
                new TextRun({ text: rec.summary, size: 18 }),
              ],
            }),
            ...(rec.keyFindings && rec.keyFindings.length > 0
              ? [
                  new Paragraph({
                    spacing: { after: 120 },
                    indent: { left: 360 },
                    children: [
                      new TextRun({ text: 'Key Findings: ', bold: true, size: 18, color: COLORS.SLATE_DARK }),
                      new TextRun({ text: rec.keyFindings.join(' | '), size: 18, color: COLORS.SLATE_BODY }),
                    ],
                  }),
                ]
              : []),
          ]),

          // Recent Vitals note if present
          ...(latestWellness && latestWellness.bloodPressure
            ? [
                new Paragraph({
                  spacing: { before: 180, after: 60 },
                  children: [
                    new TextRun({ text: 'Latest Vitals (Self-Monitored): ', bold: true, size: 20, color: COLORS.TEAL_DARK }),
                    new TextRun({
                      text: `Blood Pressure: ${latestWellness.bloodPressure.systolic}/${latestWellness.bloodPressure.diastolic} mmHg (Pulse: ${latestWellness.bloodPressure.pulse} bpm)  |  Weight: ${latestWellness.weightLbs || 148} lbs`,
                      size: 19,
                    }),
                  ],
                }),
              ]
            : []),

          // Clinician Blank Notes Section
          new Paragraph({
            spacing: { before: 260, after: 100 },
            children: [
              new TextRun({
                text: 'Physician / Clinician Consultation Notes:',
                bold: true,
                size: 20,
                color: COLORS.SLATE_DARK,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '__________________________________________________________________________________________________',
                color: COLORS.BORDER_GRAY,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: '__________________________________________________________________________________________________',
                color: COLORS.BORDER_GRAY,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: '__________________________________________________________________________________________________',
                color: COLORS.BORDER_GRAY,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Clinician Signature: ____________________________        Date: ______________', size: 18, color: COLORS.SLATE_MUTED }),
            ],
          }),

          // Disclaimer
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({
                text: 'Notice: This personal health summary was generated by the patient using CareCompanion. It is intended to assist medical conversations and does not replace official clinical records or emergency medical advice.',
                size: 16,
                color: COLORS.SLATE_MUTED,
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `CareCompanion_Health_Summary_${todayStr}.docx`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
};
