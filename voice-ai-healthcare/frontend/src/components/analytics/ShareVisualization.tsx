import React, { useState } from 'react';
import { Share2, Link2, Mail, Download, Check } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface ShareVisualizationProps {
  title: string;
  description?: string;
  shareUrl?: string;
  onShare?: (method: 'link' | 'email' | 'embed') => void;
}

export default function ShareVisualization({
  title,
  description,
  shareUrl,
  onShare,
}: ShareVisualizationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = shareUrl || window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onShare) onShare('link');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out: ${title}`);
    const body = encodeURIComponent(
      `I thought you might be interested in this:\n\n${title}\n${description || ''}\n\n${fullUrl}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    if (onShare) onShare('email');
    setIsOpen(false);
  };

  const embedCode = `<iframe src="${fullUrl}" width="800" height="600" frameborder="0"></iframe>`;

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      if (onShare) onShare('embed');
    } catch (error) {
      console.error('Failed to copy embed code:', error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: `${spacing[2]} ${spacing[3]}`,
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[300]}`,
          borderRadius: '6px',
          fontSize: typography.fontSize.sm,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          color: colors.neutral[700],
        }}
      >
        <Share2 style={{ width: '16px', height: '16px' }} />
        Share
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
              width: '360px',
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 999,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: spacing[4],
                borderBottom: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <h4
                style={{
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.semibold,
                  marginBottom: spacing[1],
                }}
              >
                Share Visualization
              </h4>
              <p
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[600],
                  margin: 0,
                }}
              >
                {title}
              </p>
            </div>

            {/* Share Options */}
            <div style={{ padding: spacing[4] }}>
              {/* Copy Link */}
              <div style={{ marginBottom: spacing[4] }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    marginBottom: spacing[2],
                  }}
                >
                  Share Link
                </label>
                <div style={{ display: 'flex', gap: spacing[2] }}>
                  <input
                    type="text"
                    value={fullUrl}
                    readOnly
                    style={{
                      flex: 1,
                      padding: spacing[2],
                      border: `1px solid ${colors.neutral[300]}`,
                      borderRadius: '6px',
                      fontSize: typography.fontSize.sm,
                      backgroundColor: colors.neutral[50],
                    }}
                  />
                  <button
                    onClick={handleCopyLink}
                    style={{
                      padding: `${spacing[2]} ${spacing[3]}`,
                      backgroundColor: copied ? colors.status.success : colors.primary[500],
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[1],
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {copied ? (
                      <>
                        <Check style={{ width: '16px', height: '16px' }} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Link2 style={{ width: '16px', height: '16px' }} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Share Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                <button
                  onClick={handleEmailShare}
                  style={{
                    padding: spacing[3],
                    backgroundColor: 'white',
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    transition: 'all 0.2s',
                  }}
                  className="share-option"
                >
                  <Mail style={{ width: '18px', height: '18px', color: colors.primary[600] }} />
                  Share via Email
                </button>

                <button
                  onClick={handleCopyEmbed}
                  style={{
                    padding: spacing[3],
                    backgroundColor: 'white',
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    transition: 'all 0.2s',
                  }}
                  className="share-option"
                >
                  <Download style={{ width: '18px', height: '18px', color: colors.primary[600] }} />
                  Copy Embed Code
                </button>
              </div>

              {/* Embed Code Preview */}
              <div style={{ marginTop: spacing[4] }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    marginBottom: spacing[2],
                  }}
                >
                  Embed Code
                </label>
                <textarea
                  value={embedCode}
                  readOnly
                  rows={3}
                  style={{
                    width: '100%',
                    padding: spacing[2],
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.xs,
                    fontFamily: 'monospace',
                    backgroundColor: colors.neutral[50],
                    resize: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          <style>{`
            .share-option:hover {
              background-color: ${colors.neutral[50]};
              border-color: ${colors.primary[300]};
            }
          `}</style>
        </>
      )}
    </div>
  );
}
