import React, { useState } from 'react';
import { FileText, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Printer, X } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface PDFViewerProps {
  url: string;
  filename: string;
  onClose?: () => void;
}

export default function PDFViewer({ url, filename, onClose }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: spacing[4],
          backgroundColor: colors.neutral[900],
          borderBottom: `1px solid ${colors.neutral[700]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left: File Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <FileText style={{ width: '20px', height: '20px', color: 'white' }} />
          <div>
            <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: 'white' }}>
              {filename}
            </div>
            <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[400] }}>
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          {/* Zoom Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
              padding: spacing[2],
              backgroundColor: colors.neutral[800],
              borderRadius: '6px',
            }}
          >
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              style={{
                padding: spacing[1],
                border: 'none',
                backgroundColor: 'transparent',
                color: zoom <= 50 ? colors.neutral[600] : 'white',
                cursor: zoom <= 50 ? 'not-allowed' : 'pointer',
                borderRadius: '4px',
              }}
            >
              <ZoomOut style={{ width: '16px', height: '16px' }} />
            </button>
            <span style={{ fontSize: typography.fontSize.sm, color: 'white', minWidth: '50px', textAlign: 'center' }}>
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              style={{
                padding: spacing[1],
                border: 'none',
                backgroundColor: 'transparent',
                color: zoom >= 200 ? colors.neutral[600] : 'white',
                cursor: zoom >= 200 ? 'not-allowed' : 'pointer',
                borderRadius: '4px',
              }}
            >
              <ZoomIn style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* Page Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
              padding: spacing[2],
              backgroundColor: colors.neutral[800],
              borderRadius: '6px',
            }}
          >
            <button
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              style={{
                padding: spacing[1],
                border: 'none',
                backgroundColor: 'transparent',
                color: currentPage <= 1 ? colors.neutral[600] : 'white',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                borderRadius: '4px',
              }}
            >
              <ChevronLeft style={{ width: '16px', height: '16px' }} />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              style={{
                padding: spacing[1],
                border: 'none',
                backgroundColor: 'transparent',
                color: currentPage >= totalPages ? colors.neutral[600] : 'white',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                borderRadius: '4px',
              }}
            >
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleDownload}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              border: 'none',
              backgroundColor: colors.neutral[800],
              color: 'white',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Download style={{ width: '16px', height: '16px' }} />
            Download
          </button>
          <button
            onClick={handlePrint}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              border: 'none',
              backgroundColor: colors.neutral[800],
              color: 'white',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Printer style={{ width: '16px', height: '16px' }} />
            Print
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: spacing[2],
                border: 'none',
                backgroundColor: colors.neutral[800],
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          )}
        </div>
      </div>

      {/* PDF Content */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: colors.neutral[800],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing[4],
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            width: `${zoom}%`,
            maxWidth: '100%',
            position: 'relative',
          }}
        >
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <FileText style={{ width: '48px', height: '48px', color: colors.neutral[400], margin: '0 auto', animation: 'pulse 2s infinite' }} />
                <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginTop: spacing[3] }}>
                  Loading PDF...
                </div>
              </div>
            </div>
          )}

          {/*
            In a real implementation, you would use a library like:
            - react-pdf: https://github.com/wojtekmaj/react-pdf
            - @react-pdf-viewer/core: https://react-pdf-viewer.dev/

            For this demo, we'll use an iframe or embed
          */}
          <iframe
            src={`${url}#page=${currentPage}`}
            title={filename}
            onLoad={() => setIsLoading(false)}
            style={{
              width: '100%',
              height: '842px', // A4 height at 96 DPI
              border: 'none',
              display: isLoading ? 'none' : 'block',
            }}
          />

          {/* Alternative: Use embed tag */}
          {/* <embed
            src={`${url}#page=${currentPage}`}
            type="application/pdf"
            width="100%"
            height="842px"
            style={{
              border: 'none',
              display: isLoading ? 'none' : 'block',
            }}
          /> */}
        </div>
      </div>

      {/* Page Thumbnails Sidebar (Optional enhancement) */}
      {/* Could add a collapsible sidebar here with page thumbnails */}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
