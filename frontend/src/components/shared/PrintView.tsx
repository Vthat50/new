import React, { ReactNode } from 'react';
import { Printer } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface PrintViewProps {
  title: string;
  children: ReactNode;
  onPrint?: () => void;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
}

export default function PrintView({
  title,
  children,
  onPrint,
  headerContent,
  footerContent,
}: PrintViewProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    }
    window.print();
  };

  return (
    <>
      {/* Print Button (visible on screen only) */}
      <button
        onClick={handlePrint}
        style={{
          padding: `${spacing[2]} ${spacing[4]}`,
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[300]}`,
          borderRadius: '6px',
          fontSize: typography.fontSize.sm,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
        }}
        className="no-print"
      >
        <Printer style={{ width: '16px', height: '16px' }} />
        Print
      </button>

      {/* Print Content */}
      <div className="print-view">
        {/* Print Header */}
        {headerContent && <div className="print-header">{headerContent}</div>}

        {/* Main Content */}
        <div className="print-content">{children}</div>

        {/* Print Footer */}
        {footerContent && <div className="print-footer">{footerContent}</div>}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          /* Hide non-print elements */
          .no-print {
            display: none !important;
          }

          /* Reset page */
          @page {
            margin: 1cm;
            size: A4;
          }

          body {
            margin: 0;
            padding: 0;
          }

          /* Print-specific styles */
          .print-view {
            width: 100%;
            margin: 0;
            padding: 0;
          }

          .print-header {
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #000;
          }

          .print-footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ccc;
            font-size: 10px;
            color: #666;
          }

          /* Avoid page breaks inside important content */
          .print-content > * {
            page-break-inside: avoid;
          }

          /* Table print styles */
          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }

          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }

          /* Remove shadows and transitions for print */
          * {
            box-shadow: none !important;
            transition: none !important;
          }
        }

        @media screen {
          .print-header,
          .print-footer {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

// Specific print layouts
export function PrintPatientReport({ patient, data }: { patient: any; data: ReactNode }) {
  return (
    <PrintView
      title={`Patient Report - ${patient.name}`}
      headerContent={
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>PharmAI Voice Hub</h1>
          <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>Patient Report</h2>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Generated on {new Date().toLocaleString()}
          </div>
        </div>
      }
      footerContent={
        <div style={{ textAlign: 'center' }}>
          <div>Confidential Patient Information - Do Not Distribute</div>
          <div>Page 1</div>
        </div>
      }
    >
      {data}
    </PrintView>
  );
}

export function PrintCallTranscript({ call, transcript }: { call: any; transcript: ReactNode }) {
  return (
    <PrintView
      title={`Call Transcript - ${call.id}`}
      headerContent={
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>PharmAI Voice Hub</h1>
          <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>Call Transcript</h2>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Call ID: {call.id} | Duration: {call.duration} | Date: {new Date(call.date).toLocaleString()}
          </div>
        </div>
      }
      footerContent={
        <div style={{ textAlign: 'center' }}>
          <div>Confidential - PharmAI Voice Hub</div>
        </div>
      }
    >
      {transcript}
    </PrintView>
  );
}

export function PrintAnalyticsReport({ title, dateRange, data }: { title: string; dateRange: string; data: ReactNode }) {
  return (
    <PrintView
      title={title}
      headerContent={
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>PharmAI Voice Hub</h1>
          <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>{title}</h2>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Period: {dateRange} | Generated: {new Date().toLocaleString()}
          </div>
        </div>
      }
      footerContent={
        <div style={{ textAlign: 'center' }}>
          <div>© {new Date().getFullYear()} PharmAI Voice Hub - All Rights Reserved</div>
        </div>
      }
    >
      {data}
    </PrintView>
  );
}
