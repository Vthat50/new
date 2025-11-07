import React, { useState, useEffect } from 'react';
import { DollarSign, Calculator, TrendingDown, Info, RefreshCw } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface CostCalculatorProps {
  medication: {
    name: string;
    dosage: string;
    ndc?: string;
    quantity: number;
    daysSupply: number;
  };
  insurance?: {
    provider: string;
    memberId: string;
    tier: number;
    deductibleMet: number;
    deductible: number;
    outOfPocketMet: number;
    outOfPocketMax: number;
  };
  onCalculate?: (costBreakdown: CostBreakdown) => void;
}

interface CostBreakdown {
  awp: number; // Average Wholesale Price
  wac: number; // Wholesale Acquisition Cost
  estimatedRetail: number;
  insurancePays: number;
  patientCopay: number;
  withCopayCard: number;
  totalSavings: number;
  breakdown: {
    label: string;
    amount: number;
    description: string;
  }[];
}

export default function CostCalculator({ medication, insurance, onCalculate }: CostCalculatorProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    calculateCost();
  }, [medication, insurance]);

  const calculateCost = async () => {
    setIsCalculating(true);

    try {
      // Simulate API call to pricing database
      const response = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ndc: medication.ndc,
          quantity: medication.quantity,
          daysSupply: medication.daysSupply,
          insurance,
        }),
      });

      // Mock data for demo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const awp = 8500; // Average Wholesale Price
      const wac = 7200; // Wholesale Acquisition Cost
      const estimatedRetail = 9500;

      let insurancePays = 0;
      let patientCopay = estimatedRetail;

      if (insurance) {
        // Calculate based on insurance tier and benefits
        const coveragePercent = insurance.tier === 1 ? 0.9 : insurance.tier === 2 ? 0.75 : 0.6;
        const remainingDeductible = Math.max(0, insurance.deductible - insurance.deductibleMet);

        if (remainingDeductible > 0) {
          // Patient pays deductible first
          const deductibleAmount = Math.min(estimatedRetail, remainingDeductible);
          patientCopay = deductibleAmount;
          const afterDeductible = estimatedRetail - deductibleAmount;
          insurancePays = afterDeductible * coveragePercent;
          patientCopay += afterDeductible - insurancePays;
        } else {
          // Deductible met, apply coverage
          insurancePays = estimatedRetail * coveragePercent;
          patientCopay = estimatedRetail - insurancePays;
        }

        // Cap at out-of-pocket max
        const remainingOOP = Math.max(0, insurance.outOfPocketMax - insurance.outOfPocketMet);
        if (patientCopay > remainingOOP) {
          insurancePays += patientCopay - remainingOOP;
          patientCopay = remainingOOP;
        }
      }

      // Apply copay assistance card (typical 75% reduction, max $5,000/year)
      const copayCardDiscount = Math.min(patientCopay * 0.75, 5000);
      const withCopayCard = Math.max(0, patientCopay - copayCardDiscount);
      const totalSavings = estimatedRetail - withCopayCard;

      const breakdown: CostBreakdown = {
        awp,
        wac,
        estimatedRetail,
        insurancePays,
        patientCopay,
        withCopayCard,
        totalSavings,
        breakdown: [
          {
            label: 'Estimated Retail Price',
            amount: estimatedRetail,
            description: 'Full cash price without any discounts',
          },
          {
            label: 'Insurance Coverage',
            amount: -insurancePays,
            description: `${insurance ? `Tier ${insurance.tier} coverage` : 'No insurance'}`,
          },
          {
            label: 'Patient Copay',
            amount: patientCopay,
            description: 'Amount patient pays with insurance',
          },
          {
            label: 'Copay Card Assistance',
            amount: -copayCardDiscount,
            description: 'Manufacturer copay assistance program',
          },
          {
            label: 'Final Patient Cost',
            amount: withCopayCard,
            description: 'Total out-of-pocket after all assistance',
          },
        ],
      };

      setCostBreakdown(breakdown);
      if (onCalculate) {
        onCalculate(breakdown);
      }
    } catch (err) {
      console.error('Cost calculation failed:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const getSavingsPercentage = () => {
    if (!costBreakdown) return 0;
    return ((costBreakdown.totalSavings / costBreakdown.estimatedRetail) * 100).toFixed(0);
  };

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        padding: spacing[4],
        backgroundColor: 'white',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing[4],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <Calculator style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Real-Time Cost Calculator
          </h3>
        </div>
        <button
          onClick={calculateCost}
          disabled={isCalculating}
          style={{
            padding: spacing[2],
            border: 'none',
            backgroundColor: 'transparent',
            cursor: isCalculating ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
          }}
        >
          <RefreshCw
            style={{
              width: '18px',
              height: '18px',
              color: colors.neutral[600],
              animation: isCalculating ? 'spin 1s linear infinite' : 'none',
            }}
          />
        </button>
      </div>

      {/* Medication Info */}
      <div
        style={{
          padding: spacing[3],
          backgroundColor: colors.neutral[50],
          borderRadius: '6px',
          marginBottom: spacing[4],
        }}
      >
        <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[1] }}>
          {medication.name} {medication.dosage}
        </div>
        <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
          Quantity: {medication.quantity} | Days Supply: {medication.daysSupply}
        </div>
      </div>

      {isCalculating && (
        <div style={{ textAlign: 'center', padding: spacing[8] }}>
          <Calculator style={{ width: '48px', height: '48px', color: colors.primary[500], margin: '0 auto', animation: 'pulse 2s infinite' }} />
          <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginTop: spacing[3] }}>
            Calculating real-time pricing...
          </div>
        </div>
      )}

      {!isCalculating && costBreakdown && (
        <>
          {/* Main Cost Display */}
          <div
            style={{
              padding: spacing[6],
              backgroundColor: colors.primary[50],
              border: `2px solid ${colors.primary[500]}`,
              borderRadius: '8px',
              marginBottom: spacing[4],
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[2] }}>
              Final Patient Cost
            </div>
            <div
              style={{
                fontSize: '48px',
                fontWeight: typography.fontWeight.bold,
                color: colors.primary[600],
                marginBottom: spacing[2],
              }}
            >
              {formatCurrency(costBreakdown.withCopayCard)}
            </div>
            {costBreakdown.totalSavings > 0 && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: `${spacing[2]} ${spacing[4]}`,
                  backgroundColor: colors.status.successBg,
                  border: `1px solid ${colors.status.success}`,
                  borderRadius: '20px',
                  fontSize: typography.fontSize.sm,
                  color: colors.status.success,
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                <TrendingDown style={{ width: '16px', height: '16px' }} />
                {getSavingsPercentage()}% savings • Save {formatCurrency(costBreakdown.totalSavings)}
              </div>
            )}
          </div>

          {/* Cost Comparison */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: spacing[3],
              marginBottom: spacing[4],
            }}
          >
            <div
              style={{
                padding: spacing[3],
                backgroundColor: colors.neutral[50],
                borderRadius: '6px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Retail Price
              </div>
              <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                {formatCurrency(costBreakdown.estimatedRetail)}
              </div>
            </div>
            <div
              style={{
                padding: spacing[3],
                backgroundColor: colors.neutral[50],
                borderRadius: '6px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Insurance Pays
              </div>
              <div
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.status.success,
                }}
              >
                {formatCurrency(costBreakdown.insurancePays)}
              </div>
            </div>
            <div
              style={{
                padding: spacing[3],
                backgroundColor: colors.neutral[50],
                borderRadius: '6px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Copay Card Saves
              </div>
              <div
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.status.success,
                }}
              >
                {formatCurrency(costBreakdown.patientCopay - costBreakdown.withCopayCard)}
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              width: '100%',
              padding: spacing[3],
              border: `1px solid ${colors.neutral[300]}`,
              backgroundColor: 'white',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
              marginBottom: spacing[4],
            }}
          >
            <Info style={{ width: '16px', height: '16px' }} />
            {showDetails ? 'Hide' : 'Show'} Detailed Breakdown
          </button>

          {/* Detailed Breakdown */}
          {showDetails && (
            <div
              style={{
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              {costBreakdown.breakdown.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: spacing[4],
                    borderBottom: index < costBreakdown.breakdown.length - 1 ? `1px solid ${colors.neutral[200]}` : 'none',
                    backgroundColor: item.label === 'Final Patient Cost' ? colors.primary[50] : 'white',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: spacing[1],
                    }}
                  >
                    <div
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: item.label === 'Final Patient Cost' ? typography.fontWeight.semibold : typography.fontWeight.medium,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: typography.fontSize.md,
                        fontWeight: typography.fontWeight.semibold,
                        color:
                          item.amount < 0
                            ? colors.status.success
                            : item.label === 'Final Patient Cost'
                            ? colors.primary[600]
                            : colors.neutral[900],
                      }}
                    >
                      {item.amount < 0 && '-'}
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reference Prices */}
          <div
            style={{
              marginTop: spacing[4],
              padding: spacing[3],
              backgroundColor: colors.neutral[50],
              borderRadius: '6px',
            }}
          >
            <div
              style={{
                fontSize: typography.fontSize.xs,
                color: colors.neutral[500],
                marginBottom: spacing[2],
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1],
              }}
            >
              <Info style={{ width: '12px', height: '12px' }} />
              Reference Pricing
            </div>
            <div style={{ display: 'flex', gap: spacing[4] }}>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>AWP</div>
                <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                  {formatCurrency(costBreakdown.awp)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>WAC</div>
                <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                  {formatCurrency(costBreakdown.wac)}
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div
            style={{
              marginTop: spacing[4],
              padding: spacing[3],
              backgroundColor: colors.status.warningBg,
              border: `1px solid ${colors.status.warning}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.xs,
              color: colors.neutral[700],
            }}
          >
            <strong>Note:</strong> This is an estimate based on current pricing and benefit information. Actual costs may vary.
            Contact the pharmacy or insurance provider for exact pricing.
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
