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

// Import ALL demo components
import DataGenerator from '../demo/DataGenerator';
import GuidedTour from '../demo/GuidedTour';
import ROICalculator from '../demo/ROICalculator';
import ScenarioBuilder from '../demo/ScenarioBuilder';

export default function DemoModeTab() {
  const [activeSection, setActiveSection] = useState('roi');
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [showScenarioBuilder, setShowScenarioBuilder] = useState(false);

  const sections = [
    { id: 'roi', label: 'ROI Calculator', icon: DollarSign },
    { id: 'tour', label: 'Guided Tour', icon: Book },
    { id: 'generator', label: 'Sample Data', icon: Rocket },
    { id: 'scenarios', label: 'Scenario Builder', icon: Play },
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

      {/* ALL Demo Component Sections */}
      {activeSection === 'roi' && (
        <div style={{ marginTop: spacing[6] }}>
          <ROICalculator />
        </div>
      )}

      {activeSection === 'generator' && (
        <div style={{ marginTop: spacing[6] }}>
          <DataGenerator
            onGenerate={(data) => console.log('Generated data:', data)}
          />
        </div>
      )}

      {showGuidedTour && (
        <GuidedTour
          onComplete={() => setShowGuidedTour(false)}
          onSkip={() => setShowGuidedTour(false)}
        />
      )}

      {showScenarioBuilder && (
        <ScenarioBuilder
          onSave={(scenario) => {
            console.log('Scenario saved:', scenario);
            setShowScenarioBuilder(false);
          }}
          onClose={() => setShowScenarioBuilder(false)}
        />
      )}
    </div>
  );
}
