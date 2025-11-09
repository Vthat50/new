import { useState, useEffect } from 'react';
import {
  TrendingUp,
  MapPin,
  MessageSquare,
  Filter,
  Download,
  Calendar,
  AlertTriangle,
  Target,
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { colors, spacing } from '../../lib/design-system';
import { api } from '../../services/api';

export default function MarketingInsightsTab() {
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('30');
  const [patientVoiceData, setPatientVoiceData] = useState<any>(null);
  const [barrierTrends, setBarrierTrends] = useState<any>(null);
  const [geographicData, setGeographicData] = useState<any>(null);
  const [competitorData, setCompetitorData] = useState<any>(null);
  const [activeView, setActiveView] = useState<'overview' | 'voice' | 'barriers' | 'geography' | 'competitors'>('overview');

  useEffect(() => {
    loadData();
  }, [selectedDateRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - parseInt(selectedDateRange) * 24 * 60 * 60 * 1000).toISOString();

      const [voice, barriers, geo, competitors] = await Promise.all([
        api.get(`/api/marketing/patient-voice-themes?start_date=${startDate}&end_date=${endDate}`),
        api.get(`/api/marketing/barrier-trends?start_date=${startDate}&end_date=${endDate}&interval=week`),
        api.get(`/api/marketing/geographic-insights`),
        api.get(`/api/marketing/competitor-mentions?start_date=${startDate}&end_date=${endDate}`),
      ]);

      setPatientVoiceData(voice.data);
      setBarrierTrends(barriers.data);
      setGeographicData(geo.data);
      setCompetitorData(competitors.data);
    } catch (error) {
      console.error('Failed to load marketing insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Mock PDF export
    alert('Generating Marketing Insights Report PDF...\n\nThis would download a comprehensive report including:\n- Patient voice analysis\n- Barrier trends\n- Geographic hotspots\n- Competitive intelligence');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading marketing insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ padding: spacing[6] }}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Marketing Insights</h1>
          <p className="text-neutral-600">
            Transform patient call data into actionable marketing intelligence
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
            style={{ borderColor: colors.neutral[300] }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="180">Last 6 months</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex gap-2 border-b" style={{ borderColor: colors.neutral[200] }}>
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'voice', label: 'Patient Voice', icon: MessageSquare },
          { id: 'barriers', label: 'Barrier Trends', icon: TrendingUp },
          { id: 'geography', label: 'Geography', icon: MapPin },
          { id: 'competitors', label: 'Competitors', icon: Target },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeView === view.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <view.icon size={18} />
            {view.label}
          </button>
        ))}
      </div>

      {/* Overview View */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
            <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-neutral-600">Calls Analyzed</p>
                  <p className="text-2xl font-bold text-blue-900">{patientVoiceData?.total_calls_analyzed || 0}</p>
                </div>
                <MessageSquare size={32} className="text-blue-600" />
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <div>
                  <p className="text-sm text-neutral-600">Unique Keywords</p>
                  <p className="text-2xl font-bold text-amber-900">{patientVoiceData?.total_keywords || 0}</p>
                </div>
                <Filter size={32} className="text-amber-600" />
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm text-neutral-600">High-Risk States</p>
                  <p className="text-2xl font-bold text-red-900">{geographicData?.hotspots?.length || 0}</p>
                </div>
                <AlertTriangle size={32} className="text-red-600" />
              </div>
            </div>
          </div>

          {/* Top Patient Concerns */}
          <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
            <h3 className="text-lg font-semibold mb-4">Top Patient Concerns</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(patientVoiceData?.categorized_themes || {}).map(([theme, words]: [string, any]) => ({
                    name: theme.charAt(0).toUpperCase() + theme.slice(1),
                    value: Object.values(words).reduce((a: any, b: any) => a + b, 0),
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Geographic Hotspots */}
          <div className="bg-white rounded-xl p-6 shadow-sm border lg:col-span-2" style={{ borderColor: colors.neutral[200] }}>
            <h3 className="text-lg font-semibold mb-4">Geographic Abandonment Hotspots</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: colors.neutral[200] }}>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">State</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Patients</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Calls</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Abandonment Risk</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Top Barrier</th>
                  </tr>
                </thead>
                <tbody>
                  {geographicData?.hotspots?.slice(0, 5).map((hotspot: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-neutral-50" style={{ borderColor: colors.neutral[200] }}>
                      <td className="py-3 px-4">
                        <span className="font-medium">{hotspot.state}</span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{hotspot.patient_count}</td>
                      <td className="py-3 px-4 text-neutral-600">{hotspot.call_count}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          hotspot.estimated_abandonment_rate >= 40
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {hotspot.estimated_abandonment_rate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {Object.entries(hotspot.trigger_breakdown).sort((a: any, b: any) => b[1] - a[1])[0]?.[0]?.replace('_', ' ') || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Patient Voice View */}
      {activeView === 'voice' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Word Cloud Simulation (using sized text) */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
            <h3 className="text-lg font-semibold mb-4">Patient Voice - Top Keywords</h3>
            <div className="flex flex-wrap gap-3 items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg min-h-[400px]">
              {Object.entries(patientVoiceData?.top_keywords || {})
                .slice(0, 30)
                .map(([word, count]: [string, any], index) => {
                  const size = Math.max(14, Math.min(48, (count / 5) + 16));
                  const colors = ['text-blue-600', 'text-purple-600', 'text-amber-600', 'text-red-600', 'text-green-600'];
                  return (
                    <button
                      key={word}
                      className={`font-semibold hover:opacity-70 transition-opacity cursor-pointer ${colors[index % colors.length]}`}
                      style={{ fontSize: `${size}px` }}
                      onClick={() => alert(`Keyword: "${word}"\nMentioned ${count} times\n\nClick to filter calls containing this keyword.`)}
                      title={`${count} mentions`}
                    >
                      {word}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Categorized Themes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
            <h3 className="text-lg font-semibold mb-4">Categorized Themes</h3>
            <div className="space-y-4">
              {Object.entries(patientVoiceData?.categorized_themes || {}).map(([theme, words]: [string, any]) => {
                const totalCount = Object.values(words).reduce((a: any, b: any) => a + b, 0);
                return (
                  <div key={theme} className="border-b pb-3" style={{ borderColor: colors.neutral[200] }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{theme}</span>
                      <span className="text-sm text-neutral-600">{totalCount} mentions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(words).slice(0, 5).map(([word, count]: [string, any]) => (
                        <span
                          key={word}
                          className="text-xs px-2 py-1 bg-neutral-100 text-neutral-700 rounded"
                        >
                          {word} ({count})
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Barrier Trends View */}
      {activeView === 'barriers' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
          <h3 className="text-lg font-semibold mb-4">Barrier Trends Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={barrierTrends?.trend_data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value: any) => [value, 'Count']}
              />
              <Legend />
              <Line type="monotone" dataKey="cost_concern" stroke="#ef4444" name="Cost Concerns" strokeWidth={2} />
              <Line type="monotone" dataKey="injection_anxiety" stroke="#f59e0b" name="Injection Anxiety" strokeWidth={2} />
              <Line type="monotone" dataKey="side_effect_fear" stroke="#8b5cf6" name="Side Effect Fear" strokeWidth={2} />
              <Line type="monotone" dataKey="insurance_denial" stroke="#3b82f6" name="Insurance Denial" strokeWidth={2} />
              <Line type="monotone" dataKey="access_barrier" stroke="#10b981" name="Access Barrier" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Geography View */}
      {activeView === 'geography' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
            <h3 className="text-lg font-semibold mb-4">State-Level Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: colors.neutral[200] }}>
                    <th className="text-left py-3 px-4">State</th>
                    <th className="text-right py-3 px-4">Patients</th>
                    <th className="text-right py-3 px-4">Avg SDOH Risk</th>
                    <th className="text-right py-3 px-4">Total Triggers</th>
                    <th className="text-right py-3 px-4">Abandonment Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(geographicData?.state_breakdown || {})
                    .sort((a: any, b: any) => b[1].estimated_abandonment_rate - a[1].estimated_abandonment_rate)
                    .map(([state, data]: [string, any]) => (
                      <tr key={state} className="border-b hover:bg-neutral-50" style={{ borderColor: colors.neutral[200] }}>
                        <td className="py-3 px-4 font-medium">{state}</td>
                        <td className="py-3 px-4 text-right">{data.patient_count}</td>
                        <td className="py-3 px-4 text-right">{data.avg_sdoh_risk}</td>
                        <td className="py-3 px-4 text-right">{data.total_triggers}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            data.estimated_abandonment_rate >= 40
                              ? 'bg-red-100 text-red-700'
                              : data.estimated_abandonment_rate >= 25
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {data.estimated_abandonment_rate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Competitors View */}
      {activeView === 'competitors' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
            <h3 className="text-lg font-semibold mb-4">Competitor Drug Mentions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={competitorData?.competitor_mentions || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="drug_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mention_count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Competitor Contexts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitorData?.competitor_mentions?.slice(0, 4).map((comp: any) => (
              <div key={comp.drug_name} className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold capitalize">{comp.drug_name}</h4>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {comp.mention_count} mentions
                  </span>
                </div>
                <div className="space-y-3">
                  {comp.example_contexts?.map((context: any, idx: number) => (
                    <div key={idx} className="p-3 bg-neutral-50 rounded-lg text-sm text-neutral-700">
                      "{context.context}..."
                      <div className="text-xs text-neutral-500 mt-1">
                        {context.date ? new Date(context.date).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LayoutDashboard(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
