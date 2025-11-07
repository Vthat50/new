import React, { useState } from 'react';
import { Download, Image, FileText, Table } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface WidgetExportProps {
  widgetId: string;
  widgetTitle: string;
  onExport: (format: 'png' | 'svg' | 'csv' | 'pdf') => void;
}

export default function WidgetExport({ widgetId, widgetTitle, onExport }: WidgetExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      id: 'png' as const,
      name: 'PNG Image',
      description: 'High-quality image file',
      icon: <Image style={{ width: '20px', height: '20px' }} />,
    },
    {
      id: 'svg' as const,
      name: 'SVG Vector',
      description: 'Scalable vector graphic',
      icon: <Image style={{ width: '20px', height: '20px' }} />,
    },
    {
      id: 'csv' as const,
      name: 'CSV Data',
      description: 'Raw data in spreadsheet format',
      icon: <Table style={{ width: '20px', height: '20px' }} />,
    },
    {
      id: 'pdf' as const,
      name: 'PDF Document',
      description: 'Printable document',
      icon: <FileText style={{ width: '20px', height: '20px' }} />,
    },
  ];

  const handleExport = async (format: 'png' | 'svg' | 'csv' | 'pdf') => {
    setIsExporting(true);
    try {
      await onExport(format);
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: spacing[2],
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[300]}`,
          borderRadius: '6px',
          cursor: 'pointer',
          color: colors.neutral[600],
        }}
        title="Export widget"
      >
        <Download style={{ width: '16px', height: '16px' }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
            }}
          />

          {/* Menu */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: spacing[2],
              width: '280px',
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 999,
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: spacing[3],
                borderBottom: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <h4
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  margin: 0,
                }}
              >
                Export {widgetTitle}
              </h4>
            </div>

            {/* Export Options */}
            <div style={{ padding: spacing[2] }}>
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handleExport(format.id)}
                  disabled={isExporting}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isExporting ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: spacing[3],
                    transition: 'background-color 0.2s',
                    opacity: isExporting ? 0.5 : 1,
                  }}
                  className="export-option"
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: colors.primary[50],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.primary[600],
                      flexShrink: 0,
                    }}
                  >
                    {format.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.neutral[900],
                        marginBottom: spacing[1],
                      }}
                    >
                      {format.name}
                    </div>
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[600],
                      }}
                    >
                      {format.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <style>{`
            .export-option:not(:disabled):hover {
              background-color: ${colors.neutral[50]};
            }
          `}</style>
        </>
      )}
    </div>
  );
}

// Utility functions for actual export implementation
export const exportWidgetHelpers = {
  // Export widget as PNG
  exportAsPNG: async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      // Using html2canvas (would need to be installed)
      // const canvas = await html2canvas(element);
      // const url = canvas.toDataURL('image/png');
      // const link = document.createElement('a');
      // link.download = `${filename}.png`;
      // link.href = url;
      // link.click();

      console.log('PNG export would happen here for:', filename);
    } catch (error) {
      console.error('PNG export failed:', error);
    }
  },

  // Export widget as SVG
  exportAsSVG: async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      const svgElements = element.querySelectorAll('svg');
      if (svgElements.length > 0) {
        const svgData = new XMLSerializer().serializeToString(svgElements[0]);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${filename}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('SVG export failed:', error);
    }
  },

  // Export widget data as CSV
  exportAsCSV: (data: any[], filename: string) => {
    try {
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map((row) =>
          headers.map((header) => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',')
              ? `"${value}"`
              : value;
          }).join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${filename}.csv`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export failed:', error);
    }
  },

  // Export widget as PDF
  exportAsPDF: async (elementId: string, filename: string) => {
    // Would use jsPDF and html2canvas
    console.log('PDF export would happen here for:', filename);
  },
};
