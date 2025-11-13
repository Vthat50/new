
import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import Card from './Card'

function HeatmapCard() {
  const [hoveredCell, setHoveredCell] = useState<{ date: Date; hour: number; calls: number } | null>(null);

  // Memoize data generation to prevent re-calculation on hover
  const heatmapData = useMemo(() => {
    const today = new Date();
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }

    const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

    const getCallCount = (hour: number, dayOfWeek: number): number => {
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (isWeekend) {
        if (hour >= 10 && hour <= 16) return Math.floor(Math.random() * 8) + 2;
        if (hour >= 9 && hour <= 18) return Math.floor(Math.random() * 4);
        return Math.floor(Math.random() * 2);
      } else {
        if (hour >= 8 && hour <= 10) return Math.floor(Math.random() * 20) + 15;
        if (hour >= 11 && hour <= 14) return Math.floor(Math.random() * 25) + 20;
        if (hour >= 15 && hour <= 17) return Math.floor(Math.random() * 18) + 12;
        if (hour >= 18 && hour <= 21) return Math.floor(Math.random() * 12) + 5;
        if (hour >= 6 && hour <= 22) return Math.floor(Math.random() * 6);
        return Math.floor(Math.random() * 3);
      }
    };

    // Generate all call counts once
    const callData: Record<string, number> = {};
    dates.forEach(date => {
      hours.forEach(hour => {
        const key = `${date.toDateString()}-${hour}`;
        callData[key] = getCallCount(hour, date.getDay());
      });
    });

    return { dates, hours, callData };
  }, []);

  const getHeatColor = (calls: number): string => {
    if (calls === 0) return '#ebedf0';
    const maxCalls = 45;
    const intensity = calls / maxCalls;

    if (intensity > 0.75) return '#0e4429';
    if (intensity > 0.5) return '#006d32';
    if (intensity > 0.25) return '#26a641';
    return '#39d353';
  };

  const formatDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;
  const formatHour = (hour: number) => {
    if (hour === 12) return '12p';
    if (hour < 12) return `${hour}a`;
    return `${hour - 12}p`;
  };

  const { dates, hours, callData } = heatmapData;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Call Volume</h3>
      <div style={{ height: '300px', overflowX: 'auto', overflowY: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', gap: '8px', height: '100%' }}>
          {/* Hour labels */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingTop: '35px', paddingBottom: '5px' }}>
            {hours.filter((_, idx) => idx % 2 === 0).map(hour => (
              <div key={hour} style={{ fontSize: '10px', color: '#666', textAlign: 'right', minWidth: '24px' }}>
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Date labels */}
            <div style={{ display: 'flex', gap: '3px', marginBottom: '4px', height: '30px' }}>
              {dates.map((date, idx) => (
                <div key={idx} style={{ width: '12px', fontSize: '9px', color: '#666', textAlign: 'center' }}>
                  {idx % 5 === 0 ? formatDate(date).split('/')[1] : ''}
                </div>
              ))}
            </div>

            {/* Day labels */}
            <div style={{ display: 'flex', gap: '3px', marginBottom: '2px' }}>
              {dates.map((date, idx) => (
                <div key={idx} style={{ width: '12px', fontSize: '8px', color: '#999', textAlign: 'center', fontWeight: date.getDay() === 1 ? 'bold' : 'normal' }}>
                  {date.getDay() === 1 ? 'M' : date.getDay() === 3 ? 'W' : date.getDay() === 5 ? 'F' : ''}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              {hours.map(hour => (
                <div key={hour} style={{ display: 'flex', gap: '3px' }}>
                  {dates.map((date, idx) => {
                    const key = `${date.toDateString()}-${hour}`;
                    const calls = callData[key];
                    const isHovered = hoveredCell?.date.toDateString() === date.toDateString() && hoveredCell?.hour === hour;

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredCell({ date, hour, calls })}
                        onMouseLeave={() => setHoveredCell(null)}
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: getHeatColor(calls),
                          borderRadius: '2px',
                          border: '1px solid rgba(0,0,0,0.05)',
                          boxShadow: isHovered ? '0 0 0 2px #333' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          position: 'relative',
                          zIndex: isHovered ? 10 : 1,
                          opacity: isHovered ? 1 : 0.95
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Tooltip */}
            {hoveredCell && (
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '6px 12px',
                backgroundColor: '#333',
                color: 'white',
                borderRadius: '6px',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                <span style={{ fontWeight: 'bold' }}>
                  {hoveredCell.calls} call{hoveredCell.calls !== 1 ? 's' : ''}
                </span>
                {' • '}
                <span style={{ opacity: 0.9 }}>
                  {hoveredCell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {formatHour(hoveredCell.hour)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-primary/10 rounded-lg">
        <div className="text-2xl font-bold text-primary mb-1">1,847 calls</div>
        <div className="text-sm text-gray-700">This week • 94% AI resolution rate</div>
      </div>
    </Card>
  );
}

export default function Analytics() {
  const adherenceData = [
    { month: 'Jan', adherence: 88, baseline: 72 },
    { month: 'Feb', adherence: 89, baseline: 73 },
    { month: 'Mar', adherence: 91, baseline: 74 },
    { month: 'Apr', adherence: 92, baseline: 74 },
    { month: 'May', adherence: 93, baseline: 75 },
    { month: 'Jun', adherence: 94, baseline: 75 },
  ]

  const callVolumeData = [
    { day: 'Mon', outbound: 245, inbound: 156 },
    { day: 'Tue', outbound: 267, inbound: 178 },
    { day: 'Wed', outbound: 289, inbound: 192 },
    { day: 'Thu', outbound: 256, inbound: 168 },
    { day: 'Fri', outbound: 234, inbound: 145 },
    { day: 'Sat', outbound: 156, inbound: 98 },
    { day: 'Sun', outbound: 123, inbound: 87 },
  ]

  const sideEffectsData = [
    { severity: 'Mild', count: 234, color: '#10B981' },
    { severity: 'Moderate', count: 89, color: '#F59E0B' },
    { severity: 'Severe', count: 12, color: '#EF4444' },
  ]

  return (
    <section id="analytics" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-medium text-primary">INSIGHTS & ANALYTICS</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Data-Driven Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track patient outcomes, measure program effectiveness, and demonstrate
            ROI with comprehensive analytics and reporting.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Adherence Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Adherence Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={adherenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="month" stroke="#666666" />
                  <YAxis stroke="#666666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E5E5',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="adherence"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ fill: '#2563EB', r: 4 }}
                    name="With Vevara"
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="#A3A3A3"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#A3A3A3', r: 3 }}
                    name="Industry Baseline"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success mb-1">+19% improvement</div>
                <div className="text-sm text-gray-700">vs. industry baseline adherence rates</div>
              </div>
            </Card>
          </motion.div>

          {/* Call Volume Heatmap */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <HeatmapCard />
          </motion.div>
        </div>

        {/* Side Effects Monitoring & Cost Savings */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Side Effect Reports</h3>
              <div className="space-y-4">
                {sideEffectsData.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{item.severity}</span>
                        <span className="text-sm font-medium text-gray-700">{item.count} reports</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${(item.count / 335) * 100}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Total Reports This Month</div>
                <div className="text-3xl font-bold text-gray-900">335</div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="text-success font-medium">12 escalated</span> to healthcare providers
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6 h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Cost Savings</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Live Agent Cost Reduction</div>
                  <div className="text-3xl font-bold text-primary mb-2">$124K</div>
                  <div className="text-xs text-gray-600">Saved this month</div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Improved Adherence ROI</div>
                  <div className="text-3xl font-bold text-success mb-2">$2.1M</div>
                  <div className="text-xs text-gray-600">Annual projected value</div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Per-Patient Efficiency</div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">$87</div>
                  <div className="text-xs text-gray-600">Annual savings per patient</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
