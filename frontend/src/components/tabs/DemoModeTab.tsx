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
