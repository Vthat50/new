import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Phone,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Send,
  BarChart3,
  Map,
  Activity,
  Target,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';
import { Card, CardHeader, CardContent } from '../shared/Card';
import InteractiveUSMap from '../shared/InteractiveUSMap';

type TabType = 'performance' | 'friction' | 'geographic' | 'chatbot';

export default function AnalyticsTab() {
  const [activeTab, setActiveTab] = useState<TabType>('performance');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [chatInput, setChatInput] = useState('');

  // Performance metrics
  const kpiMetrics = [
    {
      label: 'Total Call Volume',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Phone,
      description: 'Last 30 days',
    },
    {
      label: 'First Call Resolution',
      value: '87%',
      change: '+5%',
      trend: 'up',
      icon: CheckCircle,
      description: 'Up from 82%',
    },
    {
      label: 'Avg Handle Time',
      value: '8:24',
      change: '-12s',
      trend: 'down',
      icon: Clock,
      description: 'Decreased',
    },
    {
      label: 'Patient Satisfaction',
      value: '4.6/5',
      change: '+0.3',
      trend: 'up',
      icon: Activity,
      description: 'Excellent rating',
    },
  ];

  // Call volume trend data (last 7 days)
  const callVolumeData = [
    { day: 'Mon', inbound: 145, outbound: 89 },
    { day: 'Tue', inbound: 167, outbound: 102 },
    { day: 'Wed', inbound: 189, outbound: 98 },
    { day: 'Thu', inbound: 178, outbound: 112 },
    { day: 'Fri', inbound: 195, outbound: 124 },
    { day: 'Sat', inbound: 98, outbound: 45 },
    { day: 'Sun', inbound: 87, outbound: 38 },
  ];

  // Agent performance data
  const agentPerformance = [
    { name: 'AI Agent 1', resolutionRate: 94, avgHandleTime: '7:42', sentiment: 0.89, escalationRate: 6 },
    { name: 'AI Agent 2', resolutionRate: 91, avgHandleTime: '8:15', sentiment: 0.87, escalationRate: 9 },
    { name: 'AI Agent 3', resolutionRate: 88, avgHandleTime: '9:03', sentiment: 0.82, escalationRate: 12 },
    { name: 'Human Agent Avg', resolutionRate: 78, avgHandleTime: '12:34', sentiment: 0.71, escalationRate: 22 },
  ];

  // Friction topics data
  const frictionTopics = [
    { topic: 'Prior Authorization Delays', count: 289, severity: 'critical', change: '+67%' },
    { topic: 'High Out-of-Pocket Costs', count: 234, severity: 'critical', change: '+23%' },
    { topic: 'Insurance Coverage Issues', count: 187, severity: 'high', change: '+15%' },
    { topic: 'Injection Site Reactions', count: 156, severity: 'high', change: '+8%' },
    { topic: 'Shipping Delays', count: 134, severity: 'medium', change: '-5%' },
    { topic: 'Pharmacy Issues', count: 98, severity: 'medium', change: '+12%' },
  ];

  // Friction by insurance provider
  const insuranceFriction = [
    { provider: 'UnitedHealthcare', paDelays: 89, coverage: 45, cost: 67 },
    { provider: 'Aetna', paDelays: 72, coverage: 38, cost: 54 },
    { provider: 'Blue Cross', paDelays: 65, coverage: 42, cost: 49 },
    { provider: 'Cigna', paDelays: 58, coverage: 31, cost: 43 },
    { provider: 'Humana', paDelays: 43, coverage: 28, cost: 38 },
  ];

  // Geographic data
  const stateData = [
    { state: 'California', patients: 234, frictionScore: 67, avgAdherence: 82 },
    { state: 'Texas', patients: 198, frictionScore: 72, avgAdherence: 78 },
    { state: 'Florida', patients: 187, frictionScore: 69, avgAdherence: 80 },
    { state: 'New York', patients: 176, frictionScore: 74, avgAdherence: 76 },
    { state: 'Pennsylvania', patients: 145, frictionScore: 65, avgAdherence: 84 },
  ];

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages([...chatMessages, { role: 'user', content: userMessage }]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      let response = '';
      if (userMessage.toLowerCase().includes('adherence')) {
        response = "Based on the last 30 days, average adherence across all patients is 84%, up 3% from the previous period. California leads with 82% adherence, while New York has the lowest at 76%. High-risk patients average 68% adherence.";
      } else if (userMessage.toLowerCase().includes('insurance') || userMessage.toLowerCase().includes('pa')) {
        response = "UnitedHealthcare has the highest number of PA delays with 89 incidents this month, representing a 67% increase. Average PA processing time is 7.4 days across all payers. Recommend prioritizing outreach to UHC patients.";
      } else if (userMessage.toLowerCase().includes('cost') || userMessage.toLowerCase().includes('saving')) {
        response = "Total cost savings this month: $47,200 from reduced call center operations. Average cost per AI call: $2.40 vs $18.50 for human agents. ROI is currently 312% with breakeven achieved in month 3.";
      } else {
        response = "I can help you analyze call volume trends, adherence patterns, friction analysis, insurance comparisons, and cost savings. What specific metric would you like to explore?";
      }
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx}>
              <CardContent style={{ padding: spacing[4] }}>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="rounded-lg flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: colors.primary[50],
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
                  </div>
                  <div className="flex items-center" style={{ gap: spacing[1], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: metric.trend === 'up' ? colors.status.success : colors.status.error }}>
                    {metric.trend === 'up' ? <TrendingUp style={{ width: '14px', height: '14px' }} /> : <TrendingDown style={{ width: '14px', height: '14px' }} />}
                    {metric.change}
                  </div>
                </div>
                <div className="text-neutral-500" style={{ fontSize: typography.fontSize.xs, marginBottom: spacing[1] }}>
                  {metric.label}
                </div>
                <div className="text-neutral-900" style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                  {metric.value}
                </div>
                <div className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                  {metric.description}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call Volume Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
              Call Volume Trends (7 Days)
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between" style={{ height: '200px', gap: spacing[2] }}>
              {callVolumeData.map((day, idx) => {
                const maxValue = 200;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1" style={{ gap: spacing[2] }}>
                    <div className="w-full flex flex-col items-center" style={{ gap: spacing[1], height: '100%', justifyContent: 'flex-end' }}>
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: `${(day.inbound / maxValue) * 100}%`,
                          backgroundColor: colors.primary[400],
                          minHeight: '8px',
                        }}
                        title={`Inbound: ${day.inbound}`}
                      />
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: `${(day.outbound / maxValue) * 100}%`,
                          backgroundColor: colors.primary[200],
                          minHeight: '8px',
                        }}
                        title={`Outbound: ${day.outbound}`}
                      />
                    </div>
                    <div className="text-neutral-600" style={{ fontSize: typography.fontSize.xs }}>
                      {day.day}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center mt-4" style={{ gap: spacing[4] }}>
              <div className="flex items-center" style={{ gap: spacing[2] }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: colors.primary[400], borderRadius: '2px' }} />
                <span className="text-xs text-neutral-600">Inbound</span>
              </div>
              <div className="flex items-center" style={{ gap: spacing[2] }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: colors.primary[200], borderRadius: '2px' }} />
                <span className="text-xs text-neutral-600">Outbound</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* First Call Resolution by Type */}
        <Card>
          <CardHeader>
            <h3 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
              First Call Resolution by Type
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Refill Request', rate: 95, color: colors.status.success },
                { type: 'Medication Questions', rate: 89, color: colors.status.success },
                { type: 'Financial Assistance', rate: 82, color: colors.status.warning },
                { type: 'Prior Authorization', rate: 76, color: colors.status.warning },
                { type: 'Adverse Events', rate: 68, color: colors.status.error },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-700">{item.type}</span>
                    <span className="text-sm font-semibold text-neutral-900">{item.rate}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${item.rate}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Matrix */}
      <Card>
        <CardHeader>
          <h3 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Agent Performance Matrix
          </h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Resolution Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Avg Handle Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Sentiment Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Escalation Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {agentPerformance.map((agent, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-neutral-900">{agent.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" style={{ gap: spacing[2] }}>
                        <span className="text-sm font-medium text-neutral-900">{agent.resolutionRate}%</span>
                        <div className="w-20 bg-neutral-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${agent.resolutionRate}%`,
                              backgroundColor: agent.resolutionRate >= 90 ? colors.status.success : colors.status.warning,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-700">{agent.avgHandleTime}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" style={{ gap: spacing[2] }}>
                        <span className="text-sm font-medium text-neutral-900">{(agent.sentiment * 100).toFixed(0)}%</span>
                        <div className="w-20 bg-neutral-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${agent.sentiment * 100}%`,
                              backgroundColor: agent.sentiment >= 0.85 ? colors.status.success : agent.sentiment >= 0.7 ? colors.status.warning : colors.status.error,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: agent.escalationRate <= 10 ? colors.status.successBg : colors.status.warningBg,
                          color: agent.escalationRate <= 10 ? colors.status.success : colors.status.warning,
                        }}
                      >
                        {agent.escalationRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFrictionTab = () => (
    <div className="space-y-6">
      {/* Top Friction Points */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
              Top Friction Points
            </h3>
            <span className="text-xs text-neutral-500">Last 30 days</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {frictionTopics.map((topic, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center flex-1" style={{ gap: spacing[3] }}>
                  <AlertTriangle
                    style={{
                      width: '20px',
                      height: '20px',
                      color: topic.severity === 'critical' ? colors.status.error : topic.severity === 'high' ? colors.status.warning : colors.status.info,
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-900 mb-1">{topic.topic}</div>
                    <div className="text-xs text-neutral-500">{topic.count} occurrences</div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{
                        color: topic.change.startsWith('+') ? colors.status.error : colors.status.success,
                      }}
                    >
                      {topic.change}
                    </div>
                    <span
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize"
                      style={{
                        backgroundColor: topic.severity === 'critical' ? colors.status.errorBg : topic.severity === 'high' ? colors.status.warningBg : colors.status.infoBg,
                        color: topic.severity === 'critical' ? colors.status.error : topic.severity === 'high' ? colors.status.warning : colors.status.info,
                      }}
                    >
                      {topic.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Friction by Insurance Provider */}
      <Card>
        <CardHeader>
          <h3 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Friction Analysis by Insurance Provider
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insuranceFriction.map((provider, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-900">{provider.provider}</span>
                  <span className="text-xs text-neutral-500">
                    Total: {provider.paDelays + provider.coverage + provider.cost} issues
                  </span>
                </div>
                <div className="flex items-center" style={{ gap: spacing[1], height: '24px' }}>
                  <div
                    className="h-full rounded-l flex items-center justify-center text-xs font-medium text-white"
                    style={{
                      width: `${(provider.paDelays / 150) * 100}%`,
                      backgroundColor: colors.status.error,
                      minWidth: provider.paDelays > 0 ? '40px' : '0',
                    }}
                  >
                    {provider.paDelays > 0 && `${provider.paDelays}`}
                  </div>
                  <div
                    className="h-full flex items-center justify-center text-xs font-medium text-white"
                    style={{
                      width: `${(provider.coverage / 150) * 100}%`,
                      backgroundColor: colors.status.warning,
                      minWidth: provider.coverage > 0 ? '40px' : '0',
                    }}
                  >
                    {provider.coverage > 0 && `${provider.coverage}`}
                  </div>
                  <div
                    className="h-full rounded-r flex items-center justify-center text-xs font-medium text-white"
                    style={{
                      width: `${(provider.cost / 150) * 100}%`,
                      backgroundColor: colors.primary[500],
                      minWidth: provider.cost > 0 ? '40px' : '0',
                    }}
                  >
                    {provider.cost > 0 && `${provider.cost}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-6" style={{ gap: spacing[4] }}>
            <div className="flex items-center" style={{ gap: spacing[2] }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: colors.status.error, borderRadius: '2px' }} />
              <span className="text-xs text-neutral-600">PA Delays</span>
            </div>
            <div className="flex items-center" style={{ gap: spacing[2] }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: colors.status.warning, borderRadius: '2px' }} />
              <span className="text-xs text-neutral-600">Coverage Issues</span>
            </div>
            <div className="flex items-center" style={{ gap: spacing[2] }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: colors.primary[500], borderRadius: '2px' }} />
              <span className="text-xs text-neutral-600">Cost Concerns</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGeographicTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            State-by-State Analysis
          </h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Patients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Friction Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Avg Adherence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {stateData.map((state, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-neutral-900">{state.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" style={{ gap: spacing[2] }}>
                        <Users style={{ width: '14px', height: '14px', color: colors.neutral[400] }} />
                        <span className="text-sm text-neutral-700">{state.patients}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" style={{ gap: spacing[2] }}>
                        <span className="text-sm font-medium text-neutral-900">{state.frictionScore}</span>
                        <div className="w-24 bg-neutral-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${state.frictionScore}%`,
                              backgroundColor: state.frictionScore >= 70 ? colors.status.error : state.frictionScore >= 60 ? colors.status.warning : colors.status.success,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" style={{ gap: spacing[2] }}>
                        <span className="text-sm font-medium text-neutral-900">{state.avgAdherence}%</span>
                        <div className="w-24 bg-neutral-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${state.avgAdherence}%`,
                              backgroundColor: state.avgAdherence >= 80 ? colors.status.success : colors.status.warning,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: state.frictionScore < 70 ? colors.status.successBg : colors.status.warningBg,
                          color: state.frictionScore < 70 ? colors.status.success : colors.status.warning,
                        }}
                      >
                        {state.frictionScore < 70 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Geographic Heat Map */}
      <Card>
        <CardHeader>
          <h3 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Geographic Heat Map
          </h3>
          <p className="text-neutral-500" style={{ fontSize: typography.fontSize.xs, marginTop: spacing[1] }}>
            Click any state to drill down into detailed metrics. Hover for quick stats.
          </p>
        </CardHeader>
        <CardContent>
          <div style={{ height: '400px' }}>
            <InteractiveUSMap stateData={stateData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChatbotTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
          <CardHeader>
            <div className="flex items-center" style={{ gap: spacing[2] }}>
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: colors.primary[50],
                }}
              >
                <MessageSquare style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
              </div>
              <div>
                <h3 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                  AI Analytics Assistant
                </h3>
                <p className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                  Ask questions about your data
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col" style={{ overflow: 'hidden' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4" style={{ minHeight: 0 }}>
              {chatMessages.length === 0 ? (
                <div className="text-center" style={{ padding: spacing[6] }}>
                  <div className="text-neutral-500" style={{ fontSize: typography.fontSize.sm, marginBottom: spacing[4] }}>
                    Ask me anything about your analytics data
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Show me adherence trends by state',
                      'Which insurance causes most PA delays?',
                      'What are our cost savings this month?',
                      'Analyze friction points',
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setChatInput(suggestion);
                          setTimeout(() => handleChatSubmit(), 100);
                        }}
                        className="text-left border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                        style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className="flex"
                    style={{
                      gap: spacing[3],
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <div
                        className="rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: colors.primary[100],
                        }}
                      >
                        <MessageSquare style={{ width: '16px', height: '16px', color: colors.primary[700] }} />
                      </div>
                    )}
                    <div
                      className="rounded-lg max-w-lg"
                      style={{
                        padding: spacing[3],
                        backgroundColor: msg.role === 'user' ? colors.primary[500] : colors.neutral[50],
                        color: msg.role === 'user' ? 'white' : colors.neutral[900],
                        fontSize: typography.fontSize.sm,
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="flex items-center" style={{ gap: spacing[2] }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Ask about your analytics..."
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ fontSize: typography.fontSize.sm }}
              />
              <button
                onClick={handleChatSubmit}
                className="rounded-lg transition-colors"
                style={{
                  padding: spacing[3],
                  backgroundColor: colors.primary[500],
                  color: 'white',
                }}
                disabled={!chatInput.trim()}
              >
                <Send style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Query Examples */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <h3 className="text-neutral-900" style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
              Example Queries
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-neutral-700">
              <div>
                <div className="font-medium text-neutral-900 mb-1">Performance</div>
                <ul className="text-xs space-y-1 text-neutral-600">
                  <li>• Call volume trends</li>
                  <li>• Resolution rates by type</li>
                  <li>• Agent performance comparison</li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-neutral-900 mb-1">Patient Data</div>
                <ul className="text-xs space-y-1 text-neutral-600">
                  <li>• Adherence by state</li>
                  <li>• High-risk patient count</li>
                  <li>• Journey stage distribution</li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-neutral-900 mb-1">Friction Analysis</div>
                <ul className="text-xs space-y-1 text-neutral-600">
                  <li>• Top friction topics</li>
                  <li>• Insurance-specific issues</li>
                  <li>• Geographic pain points</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.background.page, display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      {/* Header */}
      <div>
        <h1 className="text-neutral-900" style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
          Analytics
        </h1>
        <p className="text-neutral-500" style={{ fontSize: typography.fontSize.sm }}>
          Comprehensive insights and performance metrics
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex" style={{ gap: spacing[2] }}>
          {[
            { id: 'performance' as TabType, label: 'Performance Dashboard', icon: BarChart3 },
            { id: 'friction' as TabType, label: 'Friction Analysis', icon: AlertTriangle },
            { id: 'geographic' as TabType, label: 'Geographic Insights', icon: Map },
            { id: 'chatbot' as TabType, label: 'AI Assistant', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="transition-colors flex items-center"
                style={{
                  gap: spacing[2],
                  padding: `${spacing[3]} ${spacing[4]}`,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: activeTab === tab.id ? colors.primary[600] : colors.neutral[600],
                  borderBottom: activeTab === tab.id ? `2px solid ${colors.primary[600]}` : '2px solid transparent',
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'performance' && renderPerformanceTab()}
      {activeTab === 'friction' && renderFrictionTab()}
      {activeTab === 'geographic' && renderGeographicTab()}
      {activeTab === 'chatbot' && renderChatbotTab()}
    </div>
  );
}
