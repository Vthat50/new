import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';
// Fixed: Props interface mismatch causing undefined filter arrays

interface FilterSidebarProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onSave: () => void;
  onReset: () => void;
}

interface FilterState {
  journeyStages: string[];
  riskLevel: string;
  insurance: string[];
  region: string;
  state: string;
  county: string;
  programs: string[];
  dateRange: string;
  customStartDate: string;
  customEndDate: string;
}

export default function FilterSidebar({ filters: externalFilters, onFilterChange, onSave, onReset }: FilterSidebarProps) {
  // Initialize with safe empty defaults - ALWAYS use arrays, never undefined
  const [filters, setFilters] = useState<FilterState>({
    journeyStages: [],
    riskLevel: 'all',
    insurance: [],
    region: '',
    state: '',
    county: '',
    programs: [],
    dateRange: 'all',
    customStartDate: '',
    customEndDate: '',
  });

  const [expandedSections, setExpandedSections] = useState({
    journey: true,
    risk: true,
    insurance: true,
    geography: true,
    programs: true,
    date: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      journeyStages: [],
      riskLevel: 'all',
      insurance: [],
      region: '',
      state: '',
      county: '',
      programs: [],
      dateRange: 'all',
      customStartDate: '',
      customEndDate: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '300px',
        backgroundColor: 'white',
        borderRight: `1px solid ${colors.neutral[200]}`,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header */}
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
          Filters
        </h3>
        <button
          onClick={onClose}
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

      {/* Filter Sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: spacing[4] }}>
        {/* Journey Stage */}
        <div style={{ marginBottom: spacing[4] }}>
          <button
            onClick={() => toggleSection('journey')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: spacing[2],
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            Journey Stage
            {expandedSections.journey ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expandedSections.journey && (
            <div style={{ marginTop: spacing[2] }}>
              {['New Start', 'PA Pending', 'Active Treatment', 'Established', 'At Risk', 'Churned'].map((stage) => (
                <label key={stage} style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2], cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.journeyStages.includes(stage)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, journeyStages: [...filters.journeyStages, stage] });
                      } else {
                        setFilters({ ...filters, journeyStages: filters.journeyStages.filter(s => s !== stage) });
                      }
                    }}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: typography.fontSize.sm }}>{stage}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Risk Level */}
        <div style={{ marginBottom: spacing[4] }}>
          <button
            onClick={() => toggleSection('risk')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: spacing[2],
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            Risk Level
            {expandedSections.risk ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expandedSections.risk && (
            <div style={{ marginTop: spacing[2] }}>
              {['All', 'High', 'Medium', 'Low'].map((level) => (
                <label key={level} style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2], cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="riskLevel"
                    checked={filters.riskLevel === level.toLowerCase()}
                    onChange={() => setFilters({ ...filters, riskLevel: level.toLowerCase() })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: typography.fontSize.sm }}>{level}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Insurance Type */}
        <div style={{ marginBottom: spacing[4] }}>
          <button
            onClick={() => toggleSection('insurance')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: spacing[2],
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            Insurance Type
            {expandedSections.insurance ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expandedSections.insurance && (
            <div style={{ marginTop: spacing[2] }}>
              {['Medicare', 'Medicaid', 'Commercial', 'Cash Pay'].map((type) => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2], cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.insurance.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, insurance: [...filters.insurance, type] });
                      } else {
                        setFilters({ ...filters, insurance: filters.insurance.filter(t => t !== type) });
                      }
                    }}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: typography.fontSize.sm }}>{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Geography (Hierarchical) */}
        <div style={{ marginBottom: spacing[4] }}>
          <button
            onClick={() => toggleSection('geography')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: spacing[2],
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            Geography
            {expandedSections.geography ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expandedSections.geography && (
            <div style={{ marginTop: spacing[2] }}>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value, state: '', county: '' })}
                style={{
                  width: '100%',
                  padding: spacing[2],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  marginBottom: spacing[2],
                  fontSize: typography.fontSize.sm,
                }}
              >
                <option value="">Select Region</option>
                <option value="northeast">Northeast</option>
                <option value="southeast">Southeast</option>
                <option value="midwest">Midwest</option>
                <option value="southwest">Southwest</option>
                <option value="west">West</option>
              </select>

              {filters.region && (
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({ ...filters, state: e.target.value, county: '' })}
                  style={{
                    width: '100%',
                    padding: spacing[2],
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    marginBottom: spacing[2],
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  <option value="">Select State</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="NY">New York</option>
                </select>
              )}

              {filters.state && (
                <select
                  value={filters.county}
                  onChange={(e) => setFilters({ ...filters, county: e.target.value })}
                  style={{
                    width: '100%',
                    padding: spacing[2],
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  <option value="">Select County</option>
                  <option value="los-angeles">Los Angeles</option>
                  <option value="orange">Orange</option>
                  <option value="san-diego">San Diego</option>
                </select>
              )}
            </div>
          )}
        </div>

        {/* Program Enrollment */}
        <div style={{ marginBottom: spacing[4] }}>
          <button
            onClick={() => toggleSection('programs')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: spacing[2],
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            Program Enrollment
            {expandedSections.programs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expandedSections.programs && (
            <div style={{ marginTop: spacing[2] }}>
              {['Copay Assistance', 'Foundation Support', 'Patient Assistance'].map((program) => (
                <label key={program} style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2], cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.programs.includes(program)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, programs: [...filters.programs, program] });
                      } else {
                        setFilters({ ...filters, programs: filters.programs.filter(p => p !== program) });
                      }
                    }}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: typography.fontSize.sm }}>{program}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div style={{ marginBottom: spacing[4] }}>
          <button
            onClick={() => toggleSection('date')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: spacing[2],
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            Date Range
            {expandedSections.date ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expandedSections.date && (
            <div style={{ marginTop: spacing[2] }}>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                style={{
                  width: '100%',
                  padding: spacing[2],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  marginBottom: spacing[2],
                  fontSize: typography.fontSize.sm,
                }}
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>

              {filters.dateRange === 'custom' && (
                <div>
                  <input
                    type="date"
                    value={filters.customStartDate}
                    onChange={(e) => setFilters({ ...filters, customStartDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing[2],
                      border: `1px solid ${colors.neutral[300]}`,
                      borderRadius: '6px',
                      marginBottom: spacing[2],
                      fontSize: typography.fontSize.sm,
                    }}
                  />
                  <input
                    type="date"
                    value={filters.customEndDate}
                    onChange={(e) => setFilters({ ...filters, customEndDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing[2],
                      border: `1px solid ${colors.neutral[300]}`,
                      borderRadius: '6px',
                      fontSize: typography.fontSize.sm,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div
        style={{
          padding: spacing[4],
          borderTop: `1px solid ${colors.neutral[200]}`,
          display: 'flex',
          gap: spacing[2],
        }}
      >
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            padding: spacing[3],
            border: `1px solid ${colors.neutral[300]}`,
            backgroundColor: 'white',
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          style={{
            flex: 1,
            padding: spacing[3],
            border: 'none',
            backgroundColor: colors.primary[500],
            color: 'white',
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            cursor: 'pointer',
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
