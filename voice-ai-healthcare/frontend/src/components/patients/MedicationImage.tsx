import React, { useState } from 'react';
import { Pill, Image as ImageIcon, AlertCircle, ZoomIn, X } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface MedicationImageProps {
  medication: {
    name: string;
    dosage: string;
    form: string;
    ndc?: string;
    rxcui?: string;
  };
  size?: 'small' | 'medium' | 'large';
}

interface MedicationImageData {
  imageUrl: string;
  description: string;
  shape?: string;
  color?: string;
  imprint?: string;
  score?: string;
}

export default function MedicationImage({ medication, size = 'medium' }: MedicationImageProps) {
  const [imageData, setImageData] = useState<MedicationImageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeMap = {
    small: { width: 60, height: 60 },
    medium: { width: 100, height: 100 },
    large: { width: 150, height: 150 },
  };

  const dimensions = sizeMap[size];

  React.useEffect(() => {
    loadMedicationImage();
  }, [medication.name, medication.dosage]);

  const loadMedicationImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch from RxImage API (NIH)
      let imageUrl = '';

      if (medication.rxcui) {
        // Use RxCUI to fetch image from RxImage
        const response = await fetch(
          `https://rximage.nlm.nih.gov/api/rximage/1/rxnav?resolution=300&rxcui=${medication.rxcui}`
        );
        const data = await response.json();

        if (data.nlmRxImages && data.nlmRxImages.length > 0) {
          imageUrl = data.nlmRxImages[0].imageUrl;
        }
      }

      // Fallback to mock data for demo
      const mockData: MedicationImageData = {
        imageUrl: imageUrl || '/api/placeholder/150/150',
        description: `${medication.name} ${medication.dosage}`,
        shape: 'Round',
        color: 'White',
        imprint: 'LOGO 100',
        score: 'No score',
      };

      setImageData(mockData);
    } catch (err) {
      setError('Failed to load medication image');

      // Still show placeholder with info
      setImageData({
        imageUrl: '/api/placeholder/150/150',
        description: `${medication.name} ${medication.dosage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        style={{
          display: 'inline-block',
          position: 'relative',
        }}
      >
        {/* Main Image Container */}
        <div
          onClick={handleImageClick}
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            border: `2px solid ${colors.neutral[200]}`,
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: colors.neutral[50],
            cursor: imageData ? 'pointer' : 'default',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isLoading && (
            <div style={{ textAlign: 'center' }}>
              <Pill
                style={{
                  width: '24px',
                  height: '24px',
                  color: colors.neutral[400],
                  animation: 'pulse 2s infinite',
                }}
              />
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[2] }}>
                Loading...
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div style={{ textAlign: 'center', padding: spacing[2] }}>
              <AlertCircle style={{ width: '24px', height: '24px', color: colors.status.error, margin: '0 auto' }} />
              <div
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.status.error,
                  marginTop: spacing[2],
                }}
              >
                Image unavailable
              </div>
            </div>
          )}

          {!isLoading && imageData && !error && (
            <>
              {imageData.imageUrl ? (
                <img
                  src={imageData.imageUrl}
                  alt={imageData.description}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageLoaded(false);
                    setError('Failed to load image');
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: imageLoaded ? 'block' : 'none',
                  }}
                />
              ) : (
                <Pill style={{ width: '32px', height: '32px', color: colors.neutral[400] }} />
              )}

              {/* Zoom overlay on hover */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}
                className="zoom-overlay"
              >
                <ZoomIn style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
            </>
          )}
        </div>

        {/* Info Label */}
        {size !== 'small' && imageData && (
          <div
            style={{
              marginTop: spacing[2],
              fontSize: typography.fontSize.xs,
              color: colors.neutral[600],
              textAlign: 'center',
              maxWidth: `${dimensions.width}px`,
            }}
          >
            {medication.name}
            <br />
            {medication.dosage}
          </div>
        )}
      </div>

      {/* Modal for Enlarged View */}
      {showModal && imageData && (
        <div
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing[8],
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: spacing[4],
                borderBottom: `1px solid ${colors.neutral[200]}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                Medication Image
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: spacing[2],
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: spacing[6] }}>
              {/* Large Image */}
              <div
                style={{
                  width: '100%',
                  height: '300px',
                  backgroundColor: colors.neutral[50],
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing[6],
                }}
              >
                {imageData.imageUrl ? (
                  <img
                    src={imageData.imageUrl}
                    alt={imageData.description}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Pill style={{ width: '64px', height: '64px', color: colors.neutral[400] }} />
                )}
              </div>

              {/* Medication Details */}
              <div style={{ marginBottom: spacing[4] }}>
                <h4
                  style={{
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.semibold,
                    marginBottom: spacing[3],
                  }}
                >
                  Medication Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3] }}>
                  <div>
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[500],
                        marginBottom: spacing[1],
                      }}
                    >
                      Name
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                      {medication.name}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[500],
                        marginBottom: spacing[1],
                      }}
                    >
                      Dosage
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                      {medication.dosage}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[500],
                        marginBottom: spacing[1],
                      }}
                    >
                      Form
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                      {medication.form}
                    </div>
                  </div>
                  {medication.ndc && (
                    <div>
                      <div
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[500],
                          marginBottom: spacing[1],
                        }}
                      >
                        NDC
                      </div>
                      <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                        {medication.ndc}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Physical Characteristics */}
              {(imageData.shape || imageData.color || imageData.imprint) && (
                <div>
                  <h4
                    style={{
                      fontSize: typography.fontSize.md,
                      fontWeight: typography.fontWeight.semibold,
                      marginBottom: spacing[3],
                    }}
                  >
                    Physical Characteristics
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3] }}>
                    {imageData.shape && (
                      <div>
                        <div
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral[500],
                            marginBottom: spacing[1],
                          }}
                        >
                          Shape
                        </div>
                        <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                          {imageData.shape}
                        </div>
                      </div>
                    )}
                    {imageData.color && (
                      <div>
                        <div
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral[500],
                            marginBottom: spacing[1],
                          }}
                        >
                          Color
                        </div>
                        <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                          {imageData.color}
                        </div>
                      </div>
                    )}
                    {imageData.imprint && (
                      <div>
                        <div
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral[500],
                            marginBottom: spacing[1],
                          }}
                        >
                          Imprint
                        </div>
                        <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                          {imageData.imprint}
                        </div>
                      </div>
                    )}
                    {imageData.score && (
                      <div>
                        <div
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral[500],
                            marginBottom: spacing[1],
                          }}
                        >
                          Score
                        </div>
                        <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                          {imageData.score}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .zoom-overlay:hover {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
}
