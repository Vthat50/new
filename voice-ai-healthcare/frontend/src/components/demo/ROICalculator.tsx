import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Download, FileText } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface ROIInputs {
  monthlyCallVolume: number;
  averageCallCost: number;
  automationRate: number;
  conversionIncrease: number;
  averageOrderValue: number;
  currentStaffCost: number;
}

interface ROIResults {
  monthlySavings: number;
  annualSavings: number;
  additionalRevenue: number;
  totalBenefit: number;
  roi: number;
  paybackMonths: number;
}

interface ROICalculatorProps {
  onExportPDF?: (results: ROIResults) => void;
}

export default function ROICalculator({ onExportPDF }: ROICalculatorProps) {
  const [inputs, setInputs] = useState<ROIInputs>({
    monthlyCallVolume: 5000,
    averageCallCost: 12,
    automationRate: 60,
    conversionIncrease: 15,
    averageOrderValue: 150,
    currentStaffCost: 15000,
  });

  const platformCost = 2500; // Monthly platform cost

  const results = useMemo((): ROIResults => {
    const automatedCalls = (inputs.monthlyCallVolume * inputs.automationRate) / 100;
    const costPerAutomatedCall = inputs.averageCallCost * 0.3; // 70% cost reduction
    const monthlySavings = automatedCalls * (inputs.averageCallCost - costPerAutomatedCall);

    const additionalConversions = (inputs.monthlyCallVolume * inputs.conversionIncrease) / 100;
    const additionalRevenue = additionalConversions * inputs.averageOrderValue;

    const netMonthlySavings = monthlySavings - platformCost;
    const totalBenefit = netMonthlySavings + additionalRevenue;
    const annualSavings = totalBenefit * 12;
    const roi = ((totalBenefit * 12) / (platformCost * 12)) * 100;
    const paybackMonths = platformCost / totalBenefit;

    return {
      monthlySavings: netMonthlySavings,
      annualSavings,
      additionalRevenue,
      totalBenefit,
      roi,
      paybackMonths,
    };
  }, [inputs]);

  const handleInputChange = (key: keyof ROIInputs, value: number) => {
    setInputs({ ...inputs, [key]: value });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '12px',
        padding: spacing[6],
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: colors.primary[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary[700],
            }}
          >
            <DollarSign style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                margin: 0,
              }}
            >
              ROI Calculator
            </h3>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], margin: 0 }}>
              Calculate your potential return on investment
            </p>
          </div>
        </div>

        {onExportPDF && (
          <button
            onClick={() => onExportPDF(results)}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              backgroundColor: colors.primary[500],
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Download style={{ width: '16px', height: '16px' }} />
            Export Report
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[6] }}>
        {/* Inputs */}
        <div>
          <h4
            style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[4],
            }}
          >
            Your Inputs
          </h4>

          {/* Monthly Call Volume */}
          <div style={{ marginBottom: spacing[4] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Monthly Call Volume
            </label>
            <input
              type="number"
              value={inputs.monthlyCallVolume}
              onChange={(e) => handleInputChange('monthlyCallVolume', parseInt(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            />
          </div>

          {/* Average Call Cost */}
          <div style={{ marginBottom: spacing[4] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Average Cost Per Call ($)
            </label>
            <input
              type="number"
              value={inputs.averageCallCost}
              onChange={(e) => handleInputChange('averageCallCost', parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            />
          </div>

          {/* Automation Rate */}
          <div style={{ marginBottom: spacing[4] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Automation Rate: {inputs.automationRate}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={inputs.automationRate}
              onChange={(e) => handleInputChange('automationRate', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Conversion Increase */}
          <div style={{ marginBottom: spacing[4] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Conversion Rate Increase: {inputs.conversionIncrease}%
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={inputs.conversionIncrease}
              onChange={(e) => handleInputChange('conversionIncrease', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Average Order Value */}
          <div style={{ marginBottom: spacing[4] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Average Order Value ($)
            </label>
            <input
              type="number"
              value={inputs.averageOrderValue}
              onChange={(e) => handleInputChange('averageOrderValue', parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            />
          </div>

          {/* Current Staff Cost */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Current Monthly Staff Cost ($)
            </label>
            <input
              type="number"
              value={inputs.currentStaffCost}
              onChange={(e) => handleInputChange('currentStaffCost', parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            />
          </div>
        </div>

        {/* Results */}
        <div>
          <h4
            style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[4],
            }}
          >
            Projected Results
          </h4>

          {/* Key Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {/* Monthly Savings */}
            <div
              style={{
                padding: spacing[4],
                backgroundColor: colors.status.successBg,
                border: `1px solid ${colors.status.success}`,
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700], marginBottom: spacing[1] }}>
                Net Monthly Savings
              </div>
              <div
                style={{
                  fontSize: typography.fontSize['3xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.status.success,
                }}
              >
                {formatCurrency(results.monthlySavings)}
              </div>
            </div>

            {/* Additional Revenue */}
            <div
              style={{
                padding: spacing[4],
                backgroundColor: colors.primary[50],
                border: `1px solid ${colors.primary[200]}`,
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700], marginBottom: spacing[1] }}>
                Additional Monthly Revenue
              </div>
              <div
                style={{
                  fontSize: typography.fontSize['3xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.primary[700],
                }}
              >
                {formatCurrency(results.additionalRevenue)}
              </div>
            </div>

            {/* Total Monthly Benefit */}
            <div
              style={{
                padding: spacing[4],
                backgroundColor: colors.secondary[50],
                border: `1px solid ${colors.secondary[200]}`,
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700], marginBottom: spacing[1] }}>
                Total Monthly Benefit
              </div>
              <div
                style={{
                  fontSize: typography.fontSize['3xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.secondary[700],
                }}
              >
                {formatCurrency(results.totalBenefit)}
              </div>
            </div>

            {/* Annual Savings */}
            <div
              style={{
                padding: spacing[4],
                backgroundColor: colors.neutral[50],
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700], marginBottom: spacing[1] }}>
                Annual Benefit
              </div>
              <div
                style={{
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                }}
              >
                {formatCurrency(results.annualSavings)}
              </div>
            </div>

            {/* ROI */}
            <div
              style={{
                padding: spacing[4],
                backgroundColor: 'white',
                border: `2px solid ${colors.primary[500]}`,
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[1] }}>
                <TrendingUp style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
                <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700] }}>Return on Investment</div>
              </div>
              <div
                style={{
                  fontSize: typography.fontSize['3xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.primary[700],
                }}
              >
                {results.roi.toFixed(0)}%
              </div>
            </div>

            {/* Payback Period */}
            <div
              style={{
                padding: spacing[4],
                backgroundColor: 'white',
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700], marginBottom: spacing[1] }}>
                Payback Period
              </div>
              <div
                style={{
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                }}
              >
                {results.paybackMonths.toFixed(1)} months
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
