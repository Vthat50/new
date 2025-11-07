import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Download,
  Play,
  Book,
  Rocket,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Button from '../shared/Button';

export default function DemoModeTab() {
  const [activeSection, setActiveSection] = useState('roi');

  const sections = [
    { id: 'roi', label: 'ROI Calculator', icon: DollarSign },
    { id: 'tour', label: 'Guided Tour', icon: Book },
    { id: 'generator', label: 'Sample Data', icon: Rocket },
  ];

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.background.page }}>
      {/* Header */}
      <div style={{ marginBottom: spacing[6] }}>
        <h1 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
          Demo Mode
        </h1>
        <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500] }}>
          Demonstration tools, ROI calculator, and guided tours
        </p>
      </div>

      {/* Section Nav */}
      <div className="flex border-b" style={{ gap: spacing[4], marginBottom: spacing[6], borderColor: colors.neutral[200] }}>
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="flex items-center transition-colors"
              style={{
                gap: spacing[2],
                padding: `${spacing[3]} ${spacing[2]}`,
                fontSize: typography.fontSize.sm,
                fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.normal,
                color: isActive ? colors.primary[600] : colors.neutral[600],
                borderBottom: isActive ? `2px solid ${colors.primary[600]}` : '2px solid transparent',
                marginBottom: '-1px'
              }}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeSection === 'roi' && <ROICalculator />}
      {activeSection === 'tour' && <GuidedTour />}
      {activeSection === 'generator' && <SampleDataGenerator />}
    </div>
  );
}

// ROI Calculator Component
function ROICalculator() {
  const [inputs, setInputs] = useState({
    numPatients: 1000,
    callsPerMonth: 2.5,
    callCenterCost: 45,
    currentAdherence: 72,
  });

  const [results, setResults] = useState<any>(null);

  const calculateROI = () => {
    const monthlyCallVolume = inputs.numPatients * inputs.callsPerMonth;
    const currentMonthlyCost = monthlyCallVolume * (inputs.callCenterCost / 60) * 5; // 5 min avg call
    const aiMonthlyCost = monthlyCallVolume * 0.50; // $0.50 per AI call
    const monthlySavings = currentMonthlyCost - aiMonthlyCost;
    const annualSavings = monthlySavings * 12;

    const adherenceImprovement = 12; // 12% improvement
    const newAdherence = Math.min(100, inputs.currentAdherence + adherenceImprovement);

    // Revenue impact calculation (simplified)
    const avgPatientValue = 15000; // annual medication value
    const churnReduction = 0.15; // 15% reduction in churn
    const revenueImpact = inputs.numPatients * avgPatientValue * churnReduction;

    const implementationCost = 50000; // one-time
    const monthsToROI = implementationCost / monthlySavings;

    setResults({
      monthlySavings,
      annualSavings,
      adherenceImprovement,
      newAdherence,
      revenueImpact,
      monthsToROI,
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Input Parameters
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block" style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                Number of Patients
              </label>
              <input
                type="number"
                value={inputs.numPatients}
                onChange={(e) => setInputs({ ...inputs, numPatients: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                style={{ fontSize: typography.fontSize.sm, borderColor: colors.neutral[300] }}
              />
            </div>
            <div>
              <label className="block" style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                Average Calls per Patient/Month
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.callsPerMonth}
                onChange={(e) => setInputs({ ...inputs, callsPerMonth: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                style={{ fontSize: typography.fontSize.sm, borderColor: colors.neutral[300] }}
              />
            </div>
            <div>
              <label className="block" style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                Current Call Center Cost/Hour ($)
              </label>
              <input
                type="number"
                value={inputs.callCenterCost}
                onChange={(e) => setInputs({ ...inputs, callCenterCost: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                style={{ fontSize: typography.fontSize.sm, borderColor: colors.neutral[300] }}
              />
            </div>
            <div>
              <label className="block" style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                Current Adherence Rate (%)
              </label>
              <input
                type="number"
                value={inputs.currentAdherence}
                onChange={(e) => setInputs({ ...inputs, currentAdherence: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                style={{ fontSize: typography.fontSize.sm, borderColor: colors.neutral[300] }}
              />
            </div>
          </div>
          <Button variant="primary" style={{ marginTop: spacing[6] }} onClick={calculateROI}>
            Calculate ROI
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <div className="grid grid-cols-2 gap-6 animate-fade-in">
          <Card>
            <CardContent style={{ padding: spacing[6] }}>
              <div className="flex items-center" style={{ gap: spacing[3], marginBottom: spacing[4] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: colors.primary[100]
                  }}
                >
                  <DollarSign style={{ width: '24px', height: '24px', color: colors.primary[600] }} />
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Cost Savings
                  </div>
                  <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                    ${results.monthlySavings.toLocaleString()}/mo
                  </div>
                </div>
              </div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                Annual savings: <span style={{ fontWeight: typography.fontWeight.semibold }}>${results.annualSavings.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: spacing[6] }}>
              <div className="flex items-center" style={{ gap: spacing[3], marginBottom: spacing[4] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: colors.status.successBg
                  }}
                >
                  <TrendingUp style={{ width: '24px', height: '24px', color: colors.status.success }} />
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Adherence Improvement
                  </div>
                  <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                    +{results.adherenceImprovement}%
                  </div>
                </div>
              </div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                New adherence rate: <span style={{ fontWeight: typography.fontWeight.semibold }}>{results.newAdherence}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: spacing[6] }}>
              <div className="flex items-center" style={{ gap: spacing[3], marginBottom: spacing[4] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#ECFDF5'
                  }}
                >
                  <Users style={{ width: '24px', height: '24px', color: '#10B981' }} />
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Revenue Impact
                  </div>
                  <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                    ${(results.revenueImpact / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                From reduced patient churn
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: spacing[6] }}>
              <div className="flex items-center" style={{ gap: spacing[3], marginBottom: spacing[4] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: colors.status.warningBg
                  }}
                >
                  <Calendar style={{ width: '24px', height: '24px', color: colors.status.warning }} />
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Time to ROI
                  </div>
                  <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                    {results.monthsToROI.toFixed(1)} mo
                  </div>
                </div>
              </div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                Break-even point reached quickly
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Download Report */}
      {results && (
        <Card>
          <CardContent style={{ padding: spacing[6] }}>
            <div className="flex items-center justify-between">
              <div>
                <h4 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                  Download Full ROI Report
                </h4>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  Get a detailed PDF report with assumptions, methodology, and projections
                </p>
              </div>
              <Button variant="primary">
                <Download style={{ width: '16px', height: '16px', marginRight: spacing[2] }} />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Guided Tour Component
function GuidedTour() {
  const tourSteps = [
    {
      title: 'Dashboard Overview',
      description: 'Start with the executive dashboard showing real-time metrics and live call monitoring',
      duration: '30 sec'
    },
    {
      title: 'Patient Journey Tracking',
      description: 'Navigate to Patients tab to see journey stages and adherence scores',
      duration: '1 min'
    },
    {
      title: 'Live Conversation Monitoring',
      description: 'Watch active calls with real-time sentiment analysis and friction detection',
      duration: '1 min'
    },
    {
      title: 'Analytics Deep Dive',
      description: 'Explore performance metrics, friction analysis, and geographic insights',
      duration: '2 min'
    },
    {
      title: 'ROI Calculation',
      description: 'Calculate your potential ROI based on your patient population',
      duration: '1 min'
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent style={{ padding: spacing[8], textAlign: 'center' }}>
          <div
            className="mx-auto rounded-full flex items-center justify-center"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: colors.primary[100],
              marginBottom: spacing[4]
            }}
          >
            <Book style={{ width: '40px', height: '40px', color: colors.primary[600] }} />
          </div>
          <h3 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
            Interactive Product Tour
          </h3>
          <p style={{ fontSize: typography.fontSize.base, color: colors.neutral[600], marginBottom: spacing[6], maxWidth: '600px', margin: '0 auto' }}>
            Take a guided tour through all features of the PharmAI Voice Hub platform
          </p>
          <Button variant="primary" size="lg">
            <Play style={{ width: '20px', height: '20px', marginRight: spacing[2] }} />
            Start Guided Tour (5 minutes)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Tour Steps
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tourSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-start rounded-lg border"
                style={{ padding: spacing[4], borderColor: colors.neutral[200] }}
              >
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: colors.primary[100],
                    color: colors.primary[700],
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    marginRight: spacing[4]
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between" style={{ marginBottom: spacing[1] }}>
                    <h4 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
                      {step.title}
                    </h4>
                    <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                      {step.duration}
                    </span>
                  </div>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Sample Data Generator Component
function SampleDataGenerator() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Generate Sample Patients
          </h3>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[4] }}>
            Create realistic patient data for demonstration purposes
          </p>
          <div className="grid grid-cols-3 gap-4">
            <Button variant="primary">Generate 50 Patients</Button>
            <Button variant="primary">Generate 200 Patients</Button>
            <Button variant="primary">Generate 500 Patients</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Generate Call History
          </h3>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[4] }}>
            Create conversation history with realistic transcripts and outcomes
          </p>
          <div className="grid grid-cols-3 gap-4">
            <Button variant="secondary">7 Days of Calls</Button>
            <Button variant="secondary">30 Days of Calls</Button>
            <Button variant="secondary">90 Days of Calls</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Clear Demo Data
          </h3>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[4] }}>
            Reset the database and remove all sample data
          </p>
          <Button variant="secondary" style={{ color: colors.status.error, borderColor: colors.status.error }}>
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
