import React, { useState } from 'react';
import { colors, spacing, typography } from '../../lib/design-system';

interface StateData {
  state: string;
  patients: number;
  frictionScore: number;
  avgAdherence: number;
}

interface InteractiveUSMapProps {
  stateData: StateData[];
}

export default function InteractiveUSMap({ stateData }: InteractiveUSMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getStateColor = (stateName: string) => {
    const state = stateData.find(s => s.state === stateName);
    if (!state) return colors.neutral[200];

    if (state.frictionScore >= 70) return colors.status.error;
    if (state.frictionScore >= 60) return colors.status.warning;
    return colors.status.success;
  };

  const getStateData = (stateName: string) => {
    return stateData.find(s => s.state === stateName);
  };

  const handleMouseEnter = (stateName: string, event: React.MouseEvent) => {
    setHoveredState(stateName);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setHoveredState(null);
  };

  const handleStateClick = (stateName: string) => {
    const state = getStateData(stateName);
    if (state) {
      alert(`Drilling down into ${stateName}\n\nPatients: ${state.patients}\nFriction Score: ${state.frictionScore}\nAdherence: ${state.avgAdherence}%`);
    }
  };

  // Simplified US map with main states - using approximate SVG paths
  const states = [
    {
      name: 'California',
      path: 'M 120,180 L 110,190 L 105,210 L 95,230 L 90,250 L 85,270 L 95,280 L 110,285 L 125,275 L 135,260 L 140,240 L 145,220 L 140,200 L 130,185 Z'
    },
    {
      name: 'Texas',
      path: 'M 280,240 L 270,255 L 265,275 L 270,295 L 285,310 L 305,315 L 330,310 L 345,295 L 350,275 L 345,255 L 335,245 L 315,240 L 295,238 Z'
    },
    {
      name: 'Florida',
      path: 'M 420,290 L 415,310 L 410,330 L 408,350 L 410,365 L 418,380 L 425,365 L 430,345 L 435,325 L 438,305 L 435,290 Z'
    },
    {
      name: 'New York',
      path: 'M 480,110 L 470,115 L 465,125 L 470,140 L 485,145 L 500,140 L 510,130 L 508,115 L 495,108 Z'
    },
    {
      name: 'Pennsylvania',
      path: 'M 460,140 L 450,145 L 445,155 L 450,165 L 465,170 L 485,168 L 500,162 L 502,150 L 490,143 Z'
    },
    // Additional states for visual completeness
    {
      name: 'Washington',
      path: 'M 80,40 L 70,50 L 75,70 L 90,75 L 110,70 L 120,55 L 115,42 L 95,38 Z'
    },
    {
      name: 'Oregon',
      path: 'M 75,75 L 65,90 L 70,110 L 85,120 L 105,115 L 118,100 L 115,82 L 95,78 Z'
    },
    {
      name: 'Nevada',
      path: 'M 105,115 L 95,135 L 100,160 L 115,175 L 130,170 L 140,150 L 135,130 L 120,118 Z'
    },
    {
      name: 'Arizona',
      path: 'M 130,200 L 120,220 L 125,245 L 140,260 L 160,255 L 175,240 L 170,215 L 155,202 Z'
    },
    {
      name: 'Montana',
      path: 'M 180,50 L 170,65 L 175,85 L 195,90 L 220,88 L 240,82 L 245,65 L 235,52 L 210,48 Z'
    },
    {
      name: 'Idaho',
      path: 'M 145,80 L 135,100 L 140,125 L 155,135 L 170,130 L 180,110 L 175,88 L 160,83 Z'
    },
    {
      name: 'Wyoming',
      path: 'M 185,95 L 175,110 L 180,130 L 200,135 L 225,133 L 240,128 L 242,108 L 225,95 Z'
    },
    {
      name: 'Colorado',
      path: 'M 195,145 L 185,160 L 190,180 L 210,185 L 240,183 L 255,178 L 258,158 L 240,148 Z'
    },
    {
      name: 'New Mexico',
      path: 'M 210,200 L 200,220 L 205,250 L 220,270 L 245,268 L 260,258 L 262,228 L 248,205 Z'
    },
    {
      name: 'North Dakota',
      path: 'M 280,55 L 270,70 L 275,90 L 295,95 L 320,93 L 335,88 L 338,68 L 325,57 Z'
    },
    {
      name: 'South Dakota',
      path: 'M 280,100 L 270,115 L 275,135 L 295,140 L 320,138 L 335,133 L 338,113 L 325,102 Z'
    },
    {
      name: 'Nebraska',
      path: 'M 270,145 L 260,160 L 265,180 L 285,185 L 315,183 L 335,178 L 338,158 L 320,147 Z'
    },
    {
      name: 'Kansas',
      path: 'M 270,190 L 260,205 L 265,225 L 285,230 L 315,228 L 335,223 L 338,203 L 320,192 Z'
    },
    {
      name: 'Oklahoma',
      path: 'M 270,235 L 265,250 L 275,270 L 300,272 L 330,268 L 343,258 L 342,240 L 320,237 Z'
    },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 600 400"
        style={{ width: '100%', height: '100%', backgroundColor: colors.neutral[50] }}
        onMouseMove={handleMouseMove}
      >
        {/* US Map Background */}
        <rect x="0" y="0" width="600" height="400" fill={colors.neutral[100]} />

        {/* State Paths */}
        {states.map((state) => {
          const isHovered = hoveredState === state.name;
          const hasData = stateData.some(s => s.state === state.name);

          return (
            <path
              key={state.name}
              d={state.path}
              fill={hasData ? getStateColor(state.name) : colors.neutral[200]}
              stroke={isHovered ? colors.primary[700] : colors.neutral[300]}
              strokeWidth={isHovered ? "2" : "1"}
              opacity={isHovered ? 0.9 : 0.7}
              style={{
                cursor: hasData ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => hasData && handleMouseEnter(state.name, e)}
              onMouseLeave={handleMouseLeave}
              onClick={() => hasData && handleStateClick(state.name)}
            />
          );
        })}

        {/* State Labels for data states */}
        {stateData.map((state) => {
          const stateInfo = states.find(s => s.state === state.state);
          if (!stateInfo) return null;

          // Calculate approximate center of state path
          const pathElement = stateInfo.path;
          const coords = pathElement.match(/\d+/g);
          if (!coords || coords.length < 2) return null;

          const x = parseInt(coords[0]);
          const y = parseInt(coords[1]);

          return (
            <text
              key={state.state}
              x={x + 20}
              y={y + 15}
              fontSize="10"
              fill={colors.neutral[700]}
              fontWeight="600"
              pointerEvents="none"
            >
              {state.frictionScore}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredState && getStateData(hoveredState) && (
        <div
          style={{
            position: 'absolute',
            left: tooltipPos.x + 15,
            top: tooltipPos.y + 15,
            backgroundColor: 'white',
            border: `1px solid ${colors.neutral[300]}`,
            borderRadius: '8px',
            padding: spacing[3],
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            pointerEvents: 'none',
            zIndex: 1000,
            minWidth: '200px'
          }}
        >
          <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
            {hoveredState}
          </div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
            <span style={{ fontWeight: typography.fontWeight.medium }}>Patients:</span> {getStateData(hoveredState)?.patients}
          </div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
            <span style={{ fontWeight: typography.fontWeight.medium }}>Friction Score:</span> {getStateData(hoveredState)?.frictionScore}
          </div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
            <span style={{ fontWeight: typography.fontWeight.medium }}>Adherence:</span> {getStateData(hoveredState)?.avgAdherence}%
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: spacing[4],
          right: spacing[4],
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[300]}`,
          borderRadius: '8px',
          padding: spacing[3],
        }}
      >
        <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
          Friction Score
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: colors.status.success, borderRadius: '2px' }} />
            <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>&lt; 60 (Good)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: colors.status.warning, borderRadius: '2px' }} />
            <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>60-70 (Warning)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: colors.status.error, borderRadius: '2px' }} />
            <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>&gt; 70 (Critical)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
