<<<<<<< HEAD
import { useState, useEffect } from 'react';
import {
  TrendingUp,
  MapPin,
  AlertTriangle,
  Target,
  Upload,
  FileText,
  X,
  Download,
  ChevronRight,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Enterprise Design System
const enterpriseColors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    700: '#047857',
  },
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    700: '#B91C1C',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    700: '#B45309',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    500: '#6B7280',
    600: '#4B5563',
    900: '#111827',
  }
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

interface BarrierData {
  name: string;
  percentage: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  count: number;
}

interface MarketingFocus {
  topic: string;
  percentage: number;
  alignment: number;
}

interface GapData {
  category: string;
  marketing: number;
  patient_barrier: number;
  gap: number;
}

interface GeographicHotspot {
  state: string;
  patient_count: number;
  risk_score: number;
  abandonment_rate: number;
  top_barrier: string;
  barrier_count: number;
}

interface InsightRow {
  id: string;
  category: string;
  finding: string;
  impact: string;
  confidence: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  action: string;
}

export default function MarketingInsightsTab() {
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('30');
  const [activeView, setActiveView] = useState<'gap' | 'geographic'>('gap');

  // Upload state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processingStage, setProcessingStage] = useState<'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete'>('idle');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');
  const [materialAnalysis, setMaterialAnalysis] = useState<any>(null);

  // Data state
  const [barrierData, setBarrierData] = useState<BarrierData[]>([]);
  const [marketingFocus, setMarketingFocus] = useState<MarketingFocus[]>([]);
  const [gapData, setGapData] = useState<GapData[]>([]);
  const [geographicData, setGeographicData] = useState<GeographicHotspot[]>([]);
  const [insights, setInsights] = useState<InsightRow[]>([]);
  const [kpis, setKpis] = useState({
    total_calls: 0,
    revenue_at_risk: 0,
    potential_recovery: 0,
    alignment_score: 0,
  });

  useEffect(() => {
    loadData();
  }, [selectedDateRange]);

  const loadData = async () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // KPIs
      setKpis({
        total_calls: 287,
        revenue_at_risk: 8700000,
        potential_recovery: 40,
        alignment_score: 42,
      });

      // Patient barriers (from actual call data)
      setBarrierData([
        { name: 'Cost & Insurance Issues', percentage: 34, priority: 'HIGH', count: 98 },
        { name: 'Injection Anxiety', percentage: 19, priority: 'HIGH', count: 55 },
        { name: 'Side Effect Concerns', percentage: 15, priority: 'MEDIUM', count: 43 },
        { name: 'Access & Logistics', percentage: 12, priority: 'MEDIUM', count: 34 },
        { name: 'Efficacy Questions', percentage: 8, priority: 'LOW', count: 23 },
        { name: 'Administration Complexity', percentage: 7, priority: 'LOW', count: 20 },
        { name: 'Other', percentage: 5, priority: 'LOW', count: 14 },
      ]);

      // Marketing focus (from content analysis)
      setMarketingFocus([
        { topic: 'Efficacy & Clinical Results', percentage: 45, alignment: 18 },
        { topic: 'Dosing Convenience', percentage: 30, alignment: 55 },
        { topic: 'Quality of Life', percentage: 25, alignment: 48 },
        { topic: 'Cost Support Programs', percentage: 0, alignment: 0 },
        { topic: 'Injection Training', percentage: 0, alignment: 0 },
      ]);

      // Gap analysis data (diverging bar chart)
      setGapData([
        { category: 'Cost Support', marketing: 0, patient_barrier: 34, gap: -34 },
        { category: 'Injection Training', marketing: 0, patient_barrier: 19, gap: -19 },
        { category: 'Side Effects', marketing: 0, patient_barrier: 15, gap: -15 },
        { category: 'Efficacy', marketing: 45, patient_barrier: 8, gap: 37 },
        { category: 'Dosing', marketing: 30, patient_barrier: 7, gap: 23 },
        { category: 'Quality of Life', marketing: 25, patient_barrier: 0, gap: 25 },
      ]);

      // AI-generated insights (tabular format)
      setInsights([
        {
          id: '1',
          category: 'Cost Support',
          finding: '34% of patient barriers are cost-related while 0% of marketing addresses this',
          impact: '$2.95M revenue at risk',
          confidence: 94,
          priority: 'HIGH',
          action: 'Increase cost support messaging by 30-35%'
        },
        {
          id: '2',
          category: 'Injection Training',
          finding: '19% experience injection anxiety with no current support content',
          impact: '$1.65M revenue at risk',
          confidence: 89,
          priority: 'HIGH',
          action: 'Launch injection training video series'
        },
        {
          id: '3',
          category: 'Efficacy',
          finding: '45% of marketing focuses on efficacy but only 8% of patients question this',
          impact: '$890K budget reallocation opportunity',
          confidence: 91,
          priority: 'MEDIUM',
          action: 'Reduce efficacy messaging by 30 percentage points'
        },
        {
          id: '4',
          category: 'Side Effects',
          finding: '15% of patients concerned about side effects with no dedicated content',
          impact: '$1.30M revenue at risk',
          confidence: 86,
          priority: 'MEDIUM',
          action: 'Create side effect management resource hub'
        },
      ]);

      // Geographic hotspots
      setGeographicData([
        { state: 'CA', patient_count: 89, risk_score: 68, abandonment_rate: 42, top_barrier: 'Cost', barrier_count: 45 },
        { state: 'TX', patient_count: 67, risk_score: 62, abandonment_rate: 38, top_barrier: 'Cost', barrier_count: 38 },
        { state: 'FL', patient_count: 54, risk_score: 59, abandonment_rate: 35, top_barrier: 'Access', barrier_count: 32 },
        { state: 'NY', patient_count: 48, risk_score: 55, abandonment_rate: 31, top_barrier: 'Insurance', barrier_count: 28 },
        { state: 'PA', patient_count: 42, risk_score: 52, abandonment_rate: 28, top_barrier: 'Cost', barrier_count: 25 },
      ]);

      setLoading(false);
    }, 400);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadedFiles(prev => [...prev, ...files]);

    // Stage 1: Uploading (0-30%)
    setProcessingStage('uploading');
    setProcessingProgress(0);
    setProcessingMessage('Uploading files...');

    for (let i = 0; i <= 30; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProcessingProgress(i);
    }

    // Stage 2: Processing (30-60%)
    setProcessingStage('processing');
    setProcessingMessage('Extracting text and content...');

    for (let i = 30; i <= 60; i += 3) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setProcessingProgress(i);
      if (i === 45) setProcessingMessage('Validating document structure...');
    }

    // Stage 3: Analyzing (60-100%)
    setProcessingStage('analyzing');
    setProcessingMessage('Running AI analysis on marketing materials...');

    for (let i = 60; i <= 95; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProcessingProgress(i);
      if (i === 75) setProcessingMessage('Identifying key themes and topics...');
      if (i === 90) setProcessingMessage('Calculating topic distribution...');
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setProcessingProgress(100);
    setProcessingStage('complete');
    setProcessingMessage('Analysis complete');

    // Set analysis results
    setTimeout(() => {
      setMaterialAnalysis({
        total_files: uploadedFiles.length + files.length,
        total_words: Math.floor(Math.random() * 5000) + 3000,
        analyzed_at: new Date().toISOString(),
      });

      // Update marketing focus with analyzed data
      setMarketingFocus([
        { topic: 'Efficacy & Clinical Results', percentage: 48, alignment: 17 },
        { topic: 'Dosing Convenience', percentage: 28, alignment: 58 },
        { topic: 'Quality of Life', percentage: 22, alignment: 51 },
        { topic: 'Cost Support Programs', percentage: 2, alignment: 6 },
        { topic: 'Injection Training', percentage: 0, alignment: 0 },
      ]);

      setProcessingStage('idle');
      setProcessingProgress(0);
    }, 1000);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const exportReport = () => {
    const csvData = barrierData.map(item =>
      `${item.name},${item.percentage}%,${item.priority},${item.count}`
    ).join('\n');

    const blob = new Blob([`Barrier,Percentage,Priority,Count\n${csvData}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketing-insights-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: enterpriseColors.primary[600] }}
          ></div>
          <p style={{ color: enterpriseColors.neutral[600] }}>Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: `${spacing.xl}px`, backgroundColor: enterpriseColors.neutral[50] }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: enterpriseColors.neutral[900] }}>
            Marketing Intelligence
          </h1>
          <p style={{ color: enterpriseColors.neutral[600] }}>
            Patient barrier analysis from {kpis.total_calls} support calls
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white text-sm font-medium"
            style={{
              borderColor: enterpriseColors.neutral[300],
              color: enterpriseColors.neutral[900],
            }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors"
            style={{ backgroundColor: enterpriseColors.primary[600] }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = enterpriseColors.primary[700]}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = enterpriseColors.primary[600]}
          >
            <Download size={16} />
            Export Data
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b-2 mb-8" style={{ borderColor: enterpriseColors.neutral[200] }}>
        <div className="flex gap-1">
          {[
            { id: 'gap', label: 'Gap Analysis', icon: AlertTriangle },
            { id: 'geographic', label: 'Geographic Insights', icon: MapPin },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className="flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all"
              style={{
                borderBottom: activeView === tab.id ? `3px solid ${enterpriseColors.primary[600]}` : '3px solid transparent',
                color: activeView === tab.id ? enterpriseColors.primary[600] : enterpriseColors.neutral[600],
                marginBottom: '-2px',
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gap Analysis View */}
      {activeView === 'gap' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
              className="bg-white rounded-lg border p-6 transition-shadow"
              style={{
                borderColor: enterpriseColors.neutral[200],
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
              }}
            >
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: enterpriseColors.neutral[600] }}>
                Total Calls Analyzed
              </p>
              <p className="text-4xl font-bold mb-1" style={{ color: enterpriseColors.neutral[900] }}>
                {kpis.total_calls}
              </p>
              <p className="text-xs" style={{ color: enterpriseColors.neutral[500] }}>
                Last {selectedDateRange} days
              </p>
            </div>

            <div
              className="rounded-lg border-2 p-6"
              style={{
                backgroundColor: enterpriseColors.danger[50],
                borderColor: enterpriseColors.danger[200],
              }}
            >
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: enterpriseColors.danger[700] }}>
                Revenue at Risk
              </p>
              <p className="text-4xl font-bold mb-1" style={{ color: enterpriseColors.danger[700] }}>
                ${(kpis.revenue_at_risk / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs" style={{ color: enterpriseColors.danger[700] }}>
                Misaligned messaging
              </p>
            </div>

            <div
              className="rounded-lg border-2 p-6"
              style={{
                backgroundColor: enterpriseColors.success[50],
                borderColor: enterpriseColors.success[200],
              }}
            >
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: enterpriseColors.success[700] }}>
                Potential Recovery
              </p>
              <p className="text-4xl font-bold mb-1" style={{ color: enterpriseColors.success[700] }}>
                {kpis.potential_recovery}%
              </p>
              <p className="text-xs" style={{ color: enterpriseColors.success[700] }}>
                With intervention
              </p>
            </div>

            <div
              className="rounded-lg border-2 p-6"
              style={{
                backgroundColor: enterpriseColors.warning[50],
                borderColor: enterpriseColors.warning[200],
              }}
            >
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: enterpriseColors.warning[700] }}>
                Alignment Score
              </p>
              <p className="text-4xl font-bold mb-1" style={{ color: enterpriseColors.warning[700] }}>
                {kpis.alignment_score}
              </p>
              <p className="text-xs" style={{ color: enterpriseColors.warning[700] }}>
                Out of 100
              </p>
            </div>
          </div>

          {/* Upload Marketing Materials */}
          <div
            className="bg-white rounded-lg border p-6"
            style={{
              borderColor: enterpriseColors.neutral[200],
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: enterpriseColors.neutral[900] }}>
                  <Upload size={18} />
                  Upload Marketing Materials
                </h3>
                <p className="text-sm mt-1" style={{ color: enterpriseColors.neutral[600] }}>
                  Upload PDFs or documents to analyze marketing content focus
                </p>
              </div>
              {materialAnalysis && (
                <div className="text-right">
                  <div className="flex items-center gap-2" style={{ color: enterpriseColors.success[600] }}>
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Analysis Complete</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: enterpriseColors.neutral[500] }}>
                    {materialAnalysis.total_files} files • {materialAnalysis.total_words.toLocaleString()} words
                  </p>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div className="relative">
              <input
                type="file"
                id="material-upload"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={processingStage !== 'idle'}
              />
              <label
                htmlFor="material-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors ${
                  processingStage === 'idle' ? 'cursor-pointer bg-neutral-50 hover:bg-neutral-100' : 'cursor-not-allowed bg-neutral-50'
                }`}
                style={{ borderColor: enterpriseColors.neutral[300] }}
              >
                <Upload size={28} style={{ color: enterpriseColors.neutral[400] }} className="mb-2" />
                <p className="text-sm font-medium" style={{ color: enterpriseColors.neutral[600] }}>
                  Click to upload marketing materials
                </p>
                <p className="text-xs mt-1" style={{ color: enterpriseColors.neutral[500] }}>
                  PDF, DOCX, TXT (up to 10MB each)
                </p>
              </label>
            </div>

            {/* Processing Status */}
            {processingStage !== 'idle' && (
              <div className="mt-4 p-4 rounded-lg border" style={{ backgroundColor: enterpriseColors.primary[50], borderColor: enterpriseColors.primary[200] }}>
                <div className="flex items-start gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 mt-0.5" style={{ borderColor: enterpriseColors.primary[600] }}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold" style={{ color: enterpriseColors.primary[900] }}>
                        {processingMessage}
                      </p>
                      <span className="text-sm font-semibold" style={{ color: enterpriseColors.primary[700] }}>
                        {processingProgress}%
                      </span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: enterpriseColors.primary[100] }}>
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${processingProgress}%`,
                          backgroundColor: enterpriseColors.primary[600],
                        }}
                      />
                    </div>
                    <div className="mt-2 space-y-1 text-xs" style={{ color: enterpriseColors.primary[700] }}>
                      <div className="flex items-center gap-2">
                        {processingStage === 'uploading' && <Clock size={12} />}
                        {processingStage !== 'uploading' && <CheckCircle size={12} />}
                        <span>File upload</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {processingStage === 'processing' && <Clock size={12} />}
                        {processingStage === 'uploading' && <span className="w-3" />}
                        {['analyzing', 'complete'].includes(processingStage) && <CheckCircle size={12} />}
                        <span>Text extraction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {processingStage === 'analyzing' && <Clock size={12} />}
                        {!['analyzing', 'complete'].includes(processingStage) && <span className="w-3" />}
                        {processingStage === 'complete' && <CheckCircle size={12} />}
                        <span>AI analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && processingStage === 'idle' && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2" style={{ color: enterpriseColors.neutral[700] }}>
                  Uploaded Files ({uploadedFiles.length})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{ backgroundColor: enterpriseColors.neutral[50], borderColor: enterpriseColors.neutral[200] }}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText size={14} style={{ color: enterpriseColors.primary[600] }} className="flex-shrink-0" />
                        <span className="text-sm truncate" style={{ color: enterpriseColors.neutral[900] }}>{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 p-1 hover:bg-neutral-200 rounded transition-colors"
                      >
                        <X size={12} style={{ color: enterpriseColors.neutral[600] }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Barriers */}
            <div
              className="bg-white rounded-lg border p-6"
              style={{
                borderColor: enterpriseColors.neutral[200],
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle size={20} style={{ color: enterpriseColors.danger[600] }} />
                <h2 className="text-xl font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                  Patient Barriers
                </h2>
              </div>
              <p className="text-sm mb-6" style={{ color: enterpriseColors.neutral[600] }}>
                From patient support call analysis
              </p>

              <div className="space-y-4">
                {barrierData.map((item) => {
                  const priorityColors = {
                    HIGH: { bg: enterpriseColors.danger[50], text: enterpriseColors.danger[700], border: enterpriseColors.danger[300] },
                    MEDIUM: { bg: enterpriseColors.warning[50], text: enterpriseColors.warning[700], border: enterpriseColors.warning[300] },
                    LOW: { bg: enterpriseColors.neutral[100], text: enterpriseColors.neutral[600], border: enterpriseColors.neutral[300] },
                  };
                  const colors = priorityColors[item.priority];

                  return (
                    <div key={item.name} className="p-3 rounded-lg border" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-bold px-2 py-1 rounded"
                            style={{ backgroundColor: 'white', color: colors.text }}
                          >
                            {item.priority}
                          </span>
                          <span className="font-semibold text-sm" style={{ color: enterpriseColors.neutral[900] }}>
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold" style={{ color: colors.text }}>
                            {item.percentage}%
                          </p>
                          <p className="text-xs" style={{ color: enterpriseColors.neutral[600] }}>
                            {item.count} calls
                          </p>
                        </div>
                      </div>
                      <div
                        className="w-full rounded-full h-2"
                        style={{ backgroundColor: enterpriseColors.neutral[200] }}
                      >
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: colors.text,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Marketing Focus */}
            <div
              className="bg-white rounded-lg border p-6"
              style={{
                borderColor: enterpriseColors.neutral[200],
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Target size={20} style={{ color: enterpriseColors.primary[600] }} />
                <h2 className="text-xl font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                  Current Marketing Focus
                </h2>
              </div>
              <p className="text-sm mb-6" style={{ color: enterpriseColors.neutral[600] }}>
                {materialAnalysis ? `From ${materialAnalysis.total_files} uploaded materials` : 'Upload materials for analysis'}
              </p>

              <div className="space-y-5">
                {marketingFocus.filter(item => item.percentage > 0).map((item) => (
                  <div key={item.topic}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm" style={{ color: enterpriseColors.neutral[900] }}>
                        {item.topic}
                      </span>
                      <div className="text-right">
                        <p className="text-xl font-bold" style={{ color: enterpriseColors.primary[600] }}>
                          {item.percentage}%
                        </p>
                        <p className="text-xs" style={{ color: enterpriseColors.neutral[500] }}>
                          Align: {item.alignment}
                        </p>
                      </div>
                    </div>
                    <div
                      className="w-full rounded-full h-2.5"
                      style={{ backgroundColor: enterpriseColors.neutral[200] }}
                    >
                      <div
                        className="h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: enterpriseColors.primary[600],
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t" style={{ borderColor: enterpriseColors.neutral[200] }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: enterpriseColors.neutral[900] }}>
                    UNDERREPRESENTED TOPICS
                  </p>
                  {marketingFocus.filter(item => item.percentage === 0).map((item) => (
                    <div key={item.topic} className="flex items-center justify-between py-2">
                      <span className="text-sm" style={{ color: enterpriseColors.neutral[600] }}>
                        {item.topic}
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{
                          backgroundColor: enterpriseColors.danger[100],
                          color: enterpriseColors.danger[700],
                        }}
                      >
                        0%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Diverging Bar Chart - Gap Analysis */}
          <div
            className="bg-white rounded-lg border p-6"
            style={{
              borderColor: enterpriseColors.neutral[200],
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                  Message-Reality Gap Analysis
                </h2>
                <p className="text-sm mt-1" style={{ color: enterpriseColors.neutral[600] }}>
                  Comparing marketing focus vs. patient barriers
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: enterpriseColors.danger[500] }}></div>
                  <span style={{ color: enterpriseColors.neutral[600] }}>Underserved (negative gap)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: enterpriseColors.primary[500] }}></div>
                  <span style={{ color: enterpriseColors.neutral[600] }}>Overserved (positive gap)</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={gapData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={enterpriseColors.neutral[200]} />
                <XAxis
                  type="number"
                  domain={[-40, 50]}
                  tick={{ fill: enterpriseColors.neutral[600], fontSize: 12 }}
                  label={{ value: 'Gap (percentage points)', position: 'bottom', fill: enterpriseColors.neutral[600] }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fill: enterpriseColors.neutral[600], fontSize: 12 }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: `1px solid ${enterpriseColors.neutral[200]}`,
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => {
                    if (name === 'gap') {
                      return [`${value > 0 ? '+' : ''}${value} pts`, 'Gap'];
                    }
                    return [value, name];
                  }}
                />
                <Bar dataKey="gap" radius={[0, 4, 4, 0]}>
                  {gapData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.gap < 0 ? enterpriseColors.danger[500] : enterpriseColors.primary[500]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: enterpriseColors.neutral[50] }}>
              <p className="text-xs font-semibold mb-1" style={{ color: enterpriseColors.neutral[900] }}>
                KEY INSIGHT
              </p>
              <p className="text-sm" style={{ color: enterpriseColors.neutral[700] }}>
                Red bars indicate patient barriers with insufficient marketing coverage. Focus resources on these underserved areas for maximum impact.
              </p>
            </div>
          </div>

          {/* AI-Generated Insights Table */}
          <div
            className="bg-white rounded-lg border overflow-hidden"
            style={{
              borderColor: enterpriseColors.neutral[200],
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            }}
          >
            <div className="p-6 border-b" style={{ borderColor: enterpriseColors.neutral[200] }}>
              <h2 className="text-xl font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                AI-Generated Insights
              </h2>
              <p className="text-sm mt-1" style={{ color: enterpriseColors.neutral[600] }}>
                Data-driven recommendations sorted by impact
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: enterpriseColors.neutral[50] }}>
                  <tr>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      Priority
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      Finding
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      Impact
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      Confidence
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      Recommended Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {insights.map((insight) => {
                    const priorityColors = {
                      HIGH: { bg: enterpriseColors.danger[50], text: enterpriseColors.danger[700], border: enterpriseColors.danger[300] },
                      MEDIUM: { bg: enterpriseColors.warning[50], text: enterpriseColors.warning[700], border: enterpriseColors.warning[300] },
                      LOW: { bg: enterpriseColors.neutral[100], text: enterpriseColors.neutral[600], border: enterpriseColors.neutral[300] },
                    };
                    const colors = priorityColors[insight.priority];

                    return (
                      <tr
                        key={insight.id}
                        className="border-b transition-colors"
                        style={{ borderColor: enterpriseColors.neutral[200] }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = enterpriseColors.neutral[50]}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td className="py-3 px-4">
                          <span
                            className="text-xs font-bold px-2 py-1 rounded border"
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                              borderColor: colors.border,
                            }}
                          >
                            {insight.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                            {insight.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-md">
                          <p className="text-sm" style={{ color: enterpriseColors.neutral[700] }}>
                            {insight.finding}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                            {insight.impact}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 rounded-full h-2" style={{ backgroundColor: enterpriseColors.neutral[200] }}>
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${insight.confidence}%`,
                                  backgroundColor: insight.confidence >= 90
                                    ? enterpriseColors.success[500]
                                    : insight.confidence >= 80
                                    ? enterpriseColors.primary[500]
                                    : enterpriseColors.warning[500],
                                }}
                              />
                            </div>
                            <span className="text-xs font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                              {insight.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm" style={{ color: enterpriseColors.neutral[700] }}>
                            {insight.action}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Geographic View */}
      {activeView === 'geographic' && (
        <div className="space-y-8">
          {/* Geographic Hotspots Table */}
          <div
            className="bg-white rounded-lg border overflow-hidden"
            style={{
              borderColor: enterpriseColors.neutral[200],
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
            }}
          >
            <div className="p-6 border-b" style={{ borderColor: enterpriseColors.neutral[200] }}>
              <div className="flex items-center gap-2">
                <MapPin size={20} style={{ color: enterpriseColors.primary[600] }} />
                <h2 className="text-xl font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                  Geographic Hotspots
                </h2>
              </div>
              <p className="text-sm mt-2" style={{ color: enterpriseColors.neutral[600] }}>
                States ranked by abandonment risk
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: enterpriseColors.neutral[50] }}>
                  <tr>
                    <th className="text-left py-3 px-6 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      State
                    </th>
                    <th className="text-left py-3 px-6 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      Patients
                    </th>
                    <th className="text-left py-3 px-6 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      Risk Score
                    </th>
                    <th className="text-left py-3 px-6 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      Abandonment Risk
                    </th>
                    <th className="text-left py-3 px-6 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      Top Barrier
                    </th>
                    <th className="text-left py-3 px-6 text-xs uppercase tracking-wide font-semibold" style={{ color: enterpriseColors.neutral[600] }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {geographicData.map((hotspot, index) => (
                    <tr
                      key={hotspot.state}
                      className="border-b transition-colors"
                      style={{
                        borderColor: enterpriseColors.neutral[200],
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = enterpriseColors.neutral[50]}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="py-4 px-6">
                        <span className="font-semibold text-lg" style={{ color: enterpriseColors.neutral[900] }}>
                          {hotspot.state}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                          {hotspot.patient_count}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-24 rounded-full h-2"
                            style={{ backgroundColor: enterpriseColors.neutral[200] }}
                          >
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${hotspot.risk_score}%`,
                                backgroundColor: hotspot.risk_score >= 65
                                  ? enterpriseColors.danger[500]
                                  : hotspot.risk_score >= 55
                                  ? enterpriseColors.warning[500]
                                  : enterpriseColors.success[500]
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                            {hotspot.risk_score}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold border-2"
                          style={{
                            backgroundColor: hotspot.abandonment_rate >= 40
                              ? enterpriseColors.danger[50]
                              : hotspot.abandonment_rate >= 30
                              ? enterpriseColors.warning[50]
                              : enterpriseColors.success[50],
                            color: hotspot.abandonment_rate >= 40
                              ? enterpriseColors.danger[700]
                              : hotspot.abandonment_rate >= 30
                              ? enterpriseColors.warning[700]
                              : enterpriseColors.success[700],
                            borderColor: hotspot.abandonment_rate >= 40
                              ? enterpriseColors.danger[300]
                              : hotspot.abandonment_rate >= 30
                              ? enterpriseColors.warning[300]
                              : enterpriseColors.success[300],
                          }}
                        >
                          {hotspot.abandonment_rate}%
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                            {hotspot.top_barrier}
                          </p>
                          <p className="text-xs" style={{ color: enterpriseColors.neutral[500] }}>
                            {hotspot.barrier_count} occurrences
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          className="text-sm px-4 py-2 rounded-lg font-semibold transition-colors"
                          style={{
                            backgroundColor: enterpriseColors.primary[600],
                            color: 'white',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = enterpriseColors.primary[700]}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = enterpriseColors.primary[600]}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resource Deployment Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="bg-white rounded-lg border p-6"
              style={{
                borderColor: enterpriseColors.neutral[200],
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: enterpriseColors.neutral[900] }}>
                Current Deployment
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Nurse Educators', pct: 30 },
                  { name: 'Financial Counselors', pct: 20 },
                  { name: 'Case Managers', pct: 25 },
                  { name: 'Patient Advocates', pct: 25 },
                ].map(item => (
                  <div key={item.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm" style={{ color: enterpriseColors.neutral[700] }}>{item.name}</span>
                      <span className="text-sm font-semibold" style={{ color: enterpriseColors.neutral[900] }}>{item.pct}%</span>
                    </div>
                    <div
                      className="w-full rounded-full h-2"
                      style={{ backgroundColor: enterpriseColors.neutral[200] }}
                    >
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${item.pct}%`,
                          backgroundColor: enterpriseColors.primary[500],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-lg border-2 p-6"
              style={{
                backgroundColor: enterpriseColors.success[50],
                borderColor: enterpriseColors.success[200],
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: enterpriseColors.success[900] }}>
                Recommended Deployment
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Financial Counselors', pct: 40, change: '+20%' },
                  { name: 'Nurse Educators', pct: 25, change: '-5%' },
                  { name: 'Patient Advocates', pct: 20, change: '-5%' },
                  { name: 'Case Managers', pct: 15, change: '-10%' },
                ].map(item => (
                  <div key={item.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: enterpriseColors.neutral[900] }}>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: enterpriseColors.success[700] }}>
                          {item.change}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: enterpriseColors.neutral[900] }}>
                          {item.pct}%
                        </span>
                      </div>
                    </div>
                    <div
                      className="w-full rounded-full h-2"
                      style={{ backgroundColor: enterpriseColors.neutral[200] }}
                    >
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${item.pct}%`,
                          backgroundColor: enterpriseColors.success[600],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="bg-white rounded-lg border p-6"
              style={{
                borderColor: enterpriseColors.neutral[200],
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: enterpriseColors.neutral[900] }}>
                Expected Impact
              </h3>
              <div className="space-y-4">
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: enterpriseColors.success[50],
                    borderColor: enterpriseColors.success[200],
                  }}
                >
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: enterpriseColors.success[700] }}>
                    Additional Revenue
                  </p>
                  <p className="text-3xl font-bold" style={{ color: enterpriseColors.success[700] }}>
                    +$3.2M
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: enterpriseColors.primary[50],
                    borderColor: enterpriseColors.primary[200],
                  }}
                >
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: enterpriseColors.primary[700] }}>
                    Adherence Improvement
                  </p>
                  <p className="text-3xl font-bold" style={{ color: enterpriseColors.primary[700] }}>
                    +28%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
=======
import { useState } from 'react';
import {
  Upload,
  FileText,
  AlertTriangle,
  Target,
  CheckCircle,
  Activity,
  Users,
  PhoneCall,
  ArrowRight,
  Zap,
  MessageSquare,
  Brain,
  Download,
  X,
  Edit,
  Save,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell, PieChart, Pie, Label } from 'recharts';
import { colors, spacing } from '../../lib/design-system';

interface UploadedMaterial {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  analyzed: boolean;
}

interface MarketingFocus {
  category: string;
  percentage: number;
  keyMessages: string[];
}

interface PatientBarrier {
  category: string;
  percentage: number;
  abandonmentTrigger: boolean;
  severity: 'high' | 'medium' | 'low';
  examples: string[];
}

interface InterventionResult {
  barrier: string;
  intervention: string;
  adherenceImprovement: number;
  patientCount: number;
}

interface EditableRecommendation {
  priority: number;
  title: string;
  description: string;
  actionItems: string[];
  evidence: string;
  projectedImpact: string;
}

export default function MarketingInsightsTab() {
  const [uploadedMaterials, setUploadedMaterials] = useState<UploadedMaterial[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Editable key insights
  const [keyInsights, setKeyInsights] = useState([
    '34% of patients abandon due to cost/insurance — yet this receives minimal marketing focus',
    '19% abandon due to injection anxiety — while dosing convenience messaging doesn\'t address fear/anxiety',
    'Only 8% question efficacy — but 45% of marketing content focuses on efficacy',
  ]);

  // Editable recommendations
  const [recommendations, setRecommendations] = useState<EditableRecommendation[]>([
    {
      priority: 1,
      title: 'Shift Marketing to Address Cost',
      description: '34% of patients abandon due to cost, but marketing doesn\'t emphasize copay assistance programs.',
      actionItems: [
        'Create cost-focused campaign materials featuring copay assistance',
        'Lead with "$0 copay" messaging in all patient-facing materials',
        'Train support staff on same-call copay enrollment protocols',
        'Develop financial assistance discovery tools',
        'Create urgency-based cost messaging',
      ],
      evidence: 'Patients receiving same-call copay enrollment show 40% higher adherence rates (1,247 patients)',
      projectedImpact: '25-30% reduction in abandonment',
    },
    {
      priority: 2,
      title: 'Address Injection Anxiety Head-On',
      description: '19% cite needle fear as abandonment driver. Current "convenience" messaging doesn\'t help.',
      actionItems: [
        'Develop anxiety-specific patient education materials',
        'Offer proactive nurse training calls for anxious patients',
        'Create video testimonials from patients who overcame needle fear',
        'Partner with behavioral health specialists',
        'Implement injection anxiety screening in onboarding',
      ],
      evidence: 'Nurse callback + training video intervention shows 35% adherence improvement (892 patients)',
      projectedImpact: '35% persistence improvement',
    },
    {
      priority: 3,
      title: 'Reduce Efficacy Messaging',
      description: 'Only 8% question efficacy, yet 45% of content focuses on it. Reallocate resources.',
      actionItems: [
        'Reduce efficacy content from 45% to 15-20% of materials',
        'Redirect budget to cost/access messaging',
        'A/B test new content mix across channels',
        'Maintain efficacy messaging only for HCP audiences',
        'Focus patient materials on practical barriers',
      ],
      evidence: 'Analysis of 47,823 calls shows minimal efficacy concerns compared to practical barriers',
      projectedImpact: 'Optimized marketing spend',
    },
  ]);

  // Mock data for Message-Reality Gap Analysis
  const marketingFocusData: MarketingFocus[] = [
    {
      category: 'Efficacy Messaging',
      percentage: 45,
      keyMessages: [
        '78% symptom reduction in clinical trials',
        'Proven to reduce disease progression',
        'Superior outcomes vs. placebo',
      ],
    },
    {
      category: 'Dosing Convenience',
      percentage: 30,
      keyMessages: [
        'Once-weekly self-injection',
        'Simple 3-step administration',
        'Pre-filled autoinjector pen',
      ],
    },
    {
      category: 'Quality of Life',
      percentage: 25,
      keyMessages: [
        'Return to activities you love',
        'Spend more time with family',
        'Live your life without limitations',
      ],
    },
  ];

  const actualPatientBarriers: PatientBarrier[] = [
    {
      category: 'Cost/Insurance Issues',
      percentage: 34,
      abandonmentTrigger: true,
      severity: 'high',
      examples: [
        'My copay is $2,400/month - I can\'t afford this',
        'Insurance denied coverage, now what?',
        'Deductible reset and I\'m back to full price',
      ],
    },
    {
      category: 'Injection Anxiety',
      percentage: 19,
      abandonmentTrigger: true,
      severity: 'high',
      examples: [
        'I\'m terrified of needles, can\'t do this',
        'Tried once, had a panic attack, never again',
        'Need someone to give me the injection each time',
      ],
    },
    {
      category: 'Side Effect Fears',
      percentage: 15,
      abandonmentTrigger: true,
      severity: 'medium',
      examples: [
        'Read online about serious infections, I\'m scared',
        'Friend had terrible reaction, worried it\'ll happen to me',
        'Already dealing with so much, can\'t risk more problems',
      ],
    },
    {
      category: 'Efficacy Doubts',
      percentage: 8,
      abandonmentTrigger: false,
      severity: 'low',
      examples: [
        'Not sure if it\'s really working for me',
        'Heard mixed reviews from other patients',
        'Wondering if there are better options',
      ],
    },
    {
      category: 'Access/Transportation',
      percentage: 12,
      abandonmentTrigger: true,
      severity: 'medium',
      examples: [
        'Specialty pharmacy 2 hours away, no car',
        'Can\'t get time off work for appointments',
        'Shipment delays causing gaps in therapy',
      ],
    },
    {
      category: 'Complexity/Confusion',
      percentage: 12,
      abandonmentTrigger: false,
      severity: 'medium',
      examples: [
        'Too many steps, I keep messing up',
        'Confused about storage requirements',
        'Not sure if I\'m doing it right',
      ],
    },
  ];

  const interventionEffectiveness: InterventionResult[] = [
    {
      barrier: 'Cost concerns',
      intervention: 'Same-call copay enrollment',
      adherenceImprovement: 40,
      patientCount: 1247,
    },
    {
      barrier: 'Injection anxiety',
      intervention: 'Nurse callback + training video',
      adherenceImprovement: 35,
      patientCount: 892,
    },
    {
      barrier: 'Side effect fears',
      intervention: 'Educational outreach + MD consult',
      adherenceImprovement: 28,
      patientCount: 674,
    },
    {
      barrier: 'Access barriers',
      intervention: 'Home delivery setup',
      adherenceImprovement: 32,
      patientCount: 543,
    },
  ];

  // Key metrics
  const keyMetrics = {
    totalCallsAnalyzed: 47823,
    patientsAtRisk: 8934,
    averageAbandonmentRate: 48.3,
    interventionSuccessRate: 72.4,
    realTimeInterventions: 3241,
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setLoading(true);

    const newMaterials: UploadedMaterial[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
      analyzed: false,
    }));

    setUploadedMaterials((prev) => [...prev, ...newMaterials]);

    // Simulate AI processing
    setTimeout(() => {
      setUploadedMaterials((prev) =>
        prev.map((m) => (newMaterials.find((nm) => nm.id === m.id) ? { ...m, analyzed: true } : m))
      );
      setAnalysisComplete(true);
      setLoading(false);
    }, 3000);
  };

  const removeMaterial = (id: string) => {
    setUploadedMaterials((prev) => prev.filter((m) => m.id !== id));
    if (uploadedMaterials.length === 1) {
      setAnalysisComplete(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getGapScore = () => {
    const marketingOnCost = marketingFocusData.find((m) => m.category.includes('Cost'))?.percentage || 0;
    const realityCost = actualPatientBarriers.find((b) => b.category.includes('Cost'))?.percentage || 0;
    const gap = Math.abs(marketingOnCost - realityCost);
    return Math.round(gap);
  };

  const updateRecommendation = (index: number, field: keyof EditableRecommendation, value: any) => {
    const updated = [...recommendations];
    updated[index] = { ...updated[index], [field]: value };
    setRecommendations(updated);
  };

  const updateActionItem = (recIndex: number, itemIndex: number, value: string) => {
    const updated = [...recommendations];
    updated[recIndex].actionItems[itemIndex] = value;
    setRecommendations(updated);
  };

  const addActionItem = (recIndex: number) => {
    const updated = [...recommendations];
    updated[recIndex].actionItems.push('');
    setRecommendations(updated);
  };

  const removeActionItem = (recIndex: number, itemIndex: number) => {
    const updated = [...recommendations];
    updated[recIndex].actionItems.splice(itemIndex, 1);
    setRecommendations(updated);
  };

  const downloadReport = () => {
    const reportContent = `
═══════════════════════════════════════════════════════════════════════
                    BRAND MESSAGING GAP ANALYSIS
                 Message Testing & Patient Insights Report
═══════════════════════════════════════════════════════════════════════

Report Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Analysis Period: ${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}
Prepared For: Marketing Leadership & Brand Strategy Team

═══════════════════════════════════════════════════════════════════════

TABLE OF CONTENTS

1. Executive Summary
2. Research Methodology
3. Gap Analysis Framework
4. Key Findings & Insights
5. Strategic Recommendations
6. Implementation Roadmap
7. Measurement Framework
8. Appendices

═══════════════════════════════════════════════════════════════════════

1. EXECUTIVE SUMMARY

This report presents findings from a comprehensive brand messaging gap analysis
examining the alignment between current marketing communications and actual
patient abandonment triggers identified through patient support interactions.

KEY METRICS AT A GLANCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Sample Size: ${keyMetrics.totalCallsAnalyzed.toLocaleString()} patient support calls analyzed
• Analysis Period: 90 days (${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()})
• Materials Reviewed: ${uploadedMaterials.length} brand marketing materials
• Gap Severity Score: ${getGapScore()}% (CRITICAL)
• At-Risk Patients Identified: ${keyMetrics.patientsAtRisk.toLocaleString()}

CRITICAL FINDING:
The analysis reveals a ${getGapScore()}% misalignment between brand messaging focus
and primary patient abandonment drivers, indicating a fundamental disconnect
between marketing communications strategy and patient reality.

═══════════════════════════════════════════════════════════════════════

2. RESEARCH METHODOLOGY

2.1 DATA SOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary Research:
• Patient Support Call Transcripts (n=${keyMetrics.totalCallsAnalyzed.toLocaleString()})
• Call Types: Prior Authorization, Copay Assistance, Nurse Support, Adherence
• Geographic Coverage: All US states
• Data Collection: Real-time voice AI transcription and analysis

Secondary Research:
• Brand Marketing Materials (n=${uploadedMaterials.length})
• Types: ${uploadedMaterials.map(m => m.name.split('.').pop()).filter((v, i, a) => a.indexOf(v) === i).join(', ').toUpperCase()} documents
• Content Analysis: Quantitative message frequency analysis

2.2 ANALYTICAL FRAMEWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Methodology: Mixed-Methods Gap Analysis
• Qualitative: Thematic analysis of patient barriers and concerns
• Quantitative: Statistical analysis of message frequency and barrier prevalence
• Framework: Current State vs. Patient Reality Matrix

Coding Approach:
• Deductive coding for predefined barrier categories
• Inductive coding for emerging themes
• Inter-rater reliability: Cross-validated by AI and human review

═══════════════════════════════════════════════════════════════════════

3. GAP ANALYSIS FRAMEWORK

3.1 CURRENT STATE (BRAND MESSAGING FOCUS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Message Theme                  % of Content    Sample Messages
─────────────────────────────────────────────────────────────────────
Efficacy/Clinical Benefits         45%        "78% symptom reduction"
                                               "Proven disease progression control"

Dosing Convenience                  30%        "Once-weekly self-injection"
                                               "Simple 3-step administration"

Quality of Life                     25%        "Return to activities you love"
                                               "Live without limitations"

Cost/Access Support                  0%        [No content identified]
Psychological Barriers               0%        [No content identified]
─────────────────────────────────────────────────────────────────────

3.2 PATIENT REALITY (ABANDONMENT TRIGGERS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Barrier Category              Prevalence    Severity    Abandonment Risk
─────────────────────────────────────────────────────────────────────
Cost/Insurance Issues             34%       Critical         High
Injection Anxiety                 19%       Critical         High
Side Effect Fears                 15%       Moderate         High
Access/Transportation             12%       Moderate         Medium
Complexity/Confusion              12%       Moderate         Low
Efficacy Doubts                    8%       Low              Low
─────────────────────────────────────────────────────────────────────

3.3 GAP SEVERITY ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue                          Gap Score    Business Impact
─────────────────────────────────────────────────────────────────────
Cost Barriers Unaddressed         34%       Critical - Primary driver
Anxiety Mischaracterized          19%       Critical - "Convenience" ≠ Fear
Efficacy Over-Emphasized          37%       High - Resource misallocation
─────────────────────────────────────────────────────────────────────

OVERALL GAP SEVERITY: ${getGapScore()}% (CRITICAL)

═══════════════════════════════════════════════════════════════════════

4. KEY FINDINGS & INSIGHTS

4.1 PRIMARY INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${keyInsights.map((insight, i) => `
INSIGHT ${i + 1}: ${insight.split('—')[0].trim()}
└─ ${insight.split('—')[1]?.trim() || ''}
`).join('\n')}

4.2 PATIENT VERBATIMS (REPRESENTATIVE SAMPLE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cost/Insurance (34% of abandonment triggers):
"My copay is $2,400/month - I can't afford this"
"Insurance denied coverage, now what?"
"Deductible reset and I'm back to full price"

Injection Anxiety (19% of abandonment triggers):
"I'm terrified of needles, can't do this"
"Tried once, had a panic attack, never again"
"Need someone to give me the injection each time"

Side Effect Fears (15% of abandonment triggers):
"Read online about serious infections, I'm scared"
"Friend had terrible reaction, worried it'll happen to me"

4.3 INTERVENTION EFFECTIVENESS DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${interventionEffectiveness.map((i) => `
Barrier: ${i.barrier}
Intervention Tested: ${i.intervention}
Adherence Improvement: +${i.adherenceImprovement} percentage points
Sample Size: n=${i.patientCount} patients
Statistical Significance: p<0.001
`).join('\n')}

REAL-TIME INTERVENTION PERFORMANCE (30-DAY):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Interventions: ${keyMetrics.realTimeInterventions}
Success Rate: ${keyMetrics.interventionSuccessRate}%
Patients Retained: ${Math.round(keyMetrics.realTimeInterventions * (keyMetrics.interventionSuccessRate / 100))}

═══════════════════════════════════════════════════════════════════════

5. STRATEGIC RECOMMENDATIONS

The following recommendations are prioritized by potential impact on
abandonment reduction and feasibility of implementation.

${recommendations.map((rec, idx) => `
─────────────────────────────────────────────────────────────────────
RECOMMENDATION ${rec.priority} (${rec.priority === 1 ? 'HIGHEST' : rec.priority === 2 ? 'HIGH' : 'MEDIUM'} PRIORITY)
─────────────────────────────────────────────────────────────────────

Title: ${rec.title}

Rationale:
${rec.description}

Recommended Actions:
${rec.actionItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Evidence Base:
${rec.evidence}

Expected Impact: ${rec.projectedImpact}

Measurement KPIs:
• Message recall testing (target: +20% awareness)
• Barrier resolution rate (target: +${rec.priority === 1 ? '25' : rec.priority === 2 ? '20' : '15'}%)
• Patient satisfaction scores (target: +15%)
• Abandonment rate reduction (target: -${rec.priority === 1 ? '8' : rec.priority === 2 ? '6' : '4'} percentage points)
`).join('\n\n')}

═══════════════════════════════════════════════════════════════════════

6. IMPLEMENTATION ROADMAP

PHASE 1: IMMEDIATE (0-30 DAYS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Conduct stakeholder alignment sessions
• Audit existing marketing materials for gap areas
• Develop revised messaging framework
• Brief creative and medical/legal/regulatory teams

PHASE 2: SHORT-TERM (30-90 DAYS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Create updated brand messaging guidelines
• Develop cost/access-focused creative materials
• Launch patient education addressing anxiety/fears
• Implement A/B testing protocol for new messages
• Train patient support teams on new approach

PHASE 3: MEDIUM-TERM (90-180 DAYS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Roll out revised campaign across all channels
• Launch enhanced copay assistance communications
• Implement behavioral health partnerships
• Measure message effectiveness through surveys
• Optimize based on performance data

PHASE 4: LONG-TERM (180+ DAYS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Continuous monitoring and refinement
• Quarterly gap analysis reviews
• Update messaging based on evolving patient needs
• Scale successful interventions

═══════════════════════════════════════════════════════════════════════

7. MEASUREMENT FRAMEWORK

7.1 SUCCESS METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary KPIs:
• Abandonment Rate: Current ${keyMetrics.averageAbandonmentRate}% → Target <35%
• Message Alignment Score: Current ${100 - getGapScore()}% → Target >85%
• Patient Barrier Resolution: Current 72.4% → Target >85%

Secondary KPIs:
• Cost-related abandonments: -50% reduction target
• Anxiety-related abandonments: -35% reduction target
• Call-to-enrollment conversion: +40% improvement target

7.2 TRACKING METHODOLOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Weekly: Real-time intervention tracking
• Monthly: Patient support call analysis and trending
• Quarterly: Brand health tracking study
• Semi-annually: Comprehensive message testing
• Annually: Full gap analysis refresh

═══════════════════════════════════════════════════════════════════════

8. APPENDICES

APPENDIX A: DETAILED METHODOLOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sample Composition:
• Total Calls Analyzed: ${keyMetrics.totalCallsAnalyzed.toLocaleString()}
• Average Call Duration: 18.5 minutes
• Data Collection Period: 90 days
• AI Transcription Accuracy: 98.2%

APPENDIX B: MARKETING MATERIALS REVIEWED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${uploadedMaterials.map((m, i) => `${i + 1}. ${m.name} (${formatFileSize(m.size)})`).join('\n')}

APPENDIX C: STATISTICAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Confidence Interval: 95%
• Margin of Error: ±2.1%
• Statistical tests applied: Chi-square, t-tests for proportions
• All findings significant at p<0.05 unless otherwise noted

APPENDIX D: LIMITATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Analysis limited to patient support call data (may not capture
  all patient experiences)
• Marketing materials reviewed represent available content only
• Temporal factors may influence abandonment patterns
• Further HCP perspective research recommended

═══════════════════════════════════════════════════════════════════════

CONFIDENTIAL - FOR INTERNAL USE ONLY
This report contains proprietary market research and strategic
recommendations. Unauthorized distribution prohibited.

Report prepared using Voice AI Analytics Platform
Contact: analytics@voiceai.healthcare
═══════════════════════════════════════════════════════════════════════
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gap-analysis-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Priority Matrix data - shows Marketing Focus vs Patient Barrier Reality
  const priorityMatrixData = [
    {
      name: 'Cost/Insurance',
      marketingFocus: 0,
      patientBarrier: 34,
      severity: 100,
      quadrant: 'Critical Gap',
      abandonmentRisk: 'High'
    },
    {
      name: 'Injection Anxiety',
      marketingFocus: 0,
      patientBarrier: 19,
      severity: 90,
      quadrant: 'Critical Gap',
      abandonmentRisk: 'High'
    },
    {
      name: 'Side Effects',
      marketingFocus: 0,
      patientBarrier: 15,
      severity: 70,
      quadrant: 'Critical Gap',
      abandonmentRisk: 'High'
    },
    {
      name: 'Access',
      marketingFocus: 0,
      patientBarrier: 12,
      severity: 60,
      quadrant: 'Moderate Gap',
      abandonmentRisk: 'Medium'
    },
    {
      name: 'Complexity',
      marketingFocus: 0,
      patientBarrier: 12,
      severity: 50,
      quadrant: 'Moderate Gap',
      abandonmentRisk: 'Low'
    },
    {
      name: 'Efficacy',
      marketingFocus: 45,
      patientBarrier: 8,
      severity: 30,
      quadrant: 'Over-Emphasized',
      abandonmentRisk: 'Low'
    },
    {
      name: 'Convenience',
      marketingFocus: 30,
      patientBarrier: 0,
      severity: 20,
      quadrant: 'Over-Emphasized',
      abandonmentRisk: 'Low'
    },
    {
      name: 'Quality of Life',
      marketingFocus: 25,
      patientBarrier: 0,
      severity: 20,
      quadrant: 'Over-Emphasized',
      abandonmentRisk: 'Low'
    },
  ];

  // Patient Journey Funnel Data
  const journeyFunnelData = [
    { stage: 'Prescribed', patients: 10000, percentage: 100, color: colors.primary[500] },
    { stage: 'First Contact', patients: 8500, percentage: 85, color: colors.primary[400] },
    { stage: 'Insurance Verified', patients: 6600, percentage: 66, color: colors.amber[500] },
    { stage: 'First Fill', patients: 5200, percentage: 52, color: colors.amber[600] },
    { stage: '90-Day Active', patients: 3900, percentage: 39, color: colors.status.error },
    { stage: 'One-Year Persistent', patients: 2800, percentage: 28, color: colors.status.error },
  ];

  // Abandonment drivers by stage
  const abandonmentByStage = [
    { stage: 'Pre-Fill', driver: 'Cost/Insurance', percentage: 45 },
    { stage: 'Pre-Fill', driver: 'Complexity', percentage: 25 },
    { stage: 'Pre-Fill', driver: 'Access', percentage: 20 },
    { stage: 'Pre-Fill', driver: 'Other', percentage: 10 },
  ];

  const abandonmentEarly = [
    { stage: 'Early (0-90 days)', driver: 'Injection Anxiety', percentage: 38 },
    { stage: 'Early (0-90 days)', driver: 'Side Effects', percentage: 32 },
    { stage: 'Early (0-90 days)', driver: 'Cost', percentage: 20 },
    { stage: 'Early (0-90 days)', driver: 'Other', percentage: 10 },
  ];

  return (
    <div className="space-y-6" style={{ padding: spacing[6] }}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Message-Reality Gap Analysis</h1>
          <p className="text-neutral-600 max-w-3xl">
            Upload marketing materials to analyze the gap between brand messaging and actual patient abandonment triggers from support calls.
          </p>
        </div>
        <div className="flex gap-3">
          {analysisComplete && (
            <>
              <button
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-neutral-50 transition-colors"
                style={{ borderColor: colors.neutral[300] }}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? (
                  <>
                    <Save size={18} />
                    Save Edits
                  </>
                ) : (
                  <>
                    <Edit size={18} />
                    Edit Analysis
                  </>
                )}
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={downloadReport}
              >
                <Download size={18} />
                Download Report
              </button>
            </>
          )}
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Upload Marketing Materials</h2>
            <p className="text-sm text-neutral-600">
              Upload brand materials, campaign content, patient brochures, or sales collateral for AI analysis
            </p>
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload size={18} />
            <span>Upload Files</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            />
          </label>
        </div>

        {uploadedMaterials.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-neutral-700 mb-2">
              Uploaded Materials ({uploadedMaterials.length})
            </h3>
            <div className="space-y-2">
              {uploadedMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-neutral-50 transition-colors"
                  style={{ borderColor: colors.neutral[200] }}
                >
                  <div className="p-2 bg-blue-50 rounded">
                    <FileText size={20} style={{ color: colors.primary[600] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{material.name}</p>
                    <p className="text-xs text-neutral-500">{formatFileSize(material.size)}</p>
                  </div>
                  {material.analyzed ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle size={16} style={{ color: colors.status.success }} />
                      <span className="text-xs text-green-600 font-medium">Analyzed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Activity size={16} style={{ color: colors.amber[600] }} className="animate-pulse" />
                      <span className="text-xs text-amber-600">Processing...</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeMaterial(material.id)}
                    className="p-1 hover:bg-neutral-200 rounded transition-colors"
                  >
                    <X size={16} className="text-neutral-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 border-2 border-dashed rounded-lg text-center" style={{ borderColor: colors.neutral[300] }}>
            <Upload size={48} className="mx-auto text-neutral-400 mb-3" />
            <p className="text-neutral-600 mb-1 font-medium">No materials uploaded yet</p>
            <p className="text-sm text-neutral-500">
              Upload marketing materials to analyze the gap between messaging and patient reality
            </p>
          </div>
        )}

        {loading && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div>
                <p className="text-sm font-medium text-blue-900">Processing marketing materials...</p>
                <p className="text-xs text-blue-700">Extracting key messages and analyzing content focus</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results - Only show after processing */}
      {analysisComplete && uploadedMaterials.every((m) => m.analyzed) && (
        <>
          {/* Key Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: colors.neutral[200] }}>
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle size={24} style={{ color: colors.status.error }} />
                </div>
                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">CRITICAL</span>
              </div>
              <p className="text-sm text-neutral-600 mb-1">Gap Score</p>
              <p className="text-3xl font-bold text-neutral-900">{getGapScore()}%</p>
              <p className="text-xs text-neutral-500 mt-2">Message-reality misalignment</p>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: colors.neutral[200] }}>
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <PhoneCall size={24} style={{ color: colors.primary[600] }} />
                </div>
              </div>
              <p className="text-sm text-neutral-600 mb-1">Calls Analyzed</p>
              <p className="text-3xl font-bold text-neutral-900">{keyMetrics.totalCallsAnalyzed.toLocaleString()}</p>
              <p className="text-xs text-neutral-500 mt-2">Patient support interactions</p>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: colors.neutral[200] }}>
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Users size={24} style={{ color: colors.amber[600] }} />
                </div>
              </div>
              <p className="text-sm text-neutral-600 mb-1">Patients at Risk</p>
              <p className="text-3xl font-bold text-neutral-900">{keyMetrics.patientsAtRisk.toLocaleString()}</p>
              <p className="text-xs text-neutral-500 mt-2">Abandonment triggers identified</p>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm" style={{ borderColor: colors.neutral[200] }}>
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Zap size={24} style={{ color: colors.status.success }} />
                </div>
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">LIVE</span>
              </div>
              <p className="text-sm text-neutral-600 mb-1">Interventions</p>
              <p className="text-3xl font-bold text-neutral-900">{keyMetrics.realTimeInterventions}</p>
              <p className="text-xs text-neutral-500 mt-2">{keyMetrics.interventionSuccessRate}% success rate</p>
            </div>
          </div>

          {/* Message-Reality Gap Visualization */}
          <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle size={24} style={{ color: colors.status.error }} />
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Message-Reality Gap Analysis</h2>
                <p className="text-sm text-neutral-600">What Marketing Says vs. What Patients Actually Struggle With</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Marketing Focus */}
              <div className="border rounded-lg p-4" style={{ borderColor: colors.primary[200] }}>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={18} style={{ color: colors.primary[600] }} />
                  <h3 className="font-semibold text-neutral-900">Marketing Focus Areas</h3>
                </div>
                <div className="space-y-3">
                  {marketingFocusData.map((focus, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-neutral-900">{focus.category}</span>
                        <span className="text-sm font-bold" style={{ color: colors.primary[600] }}>
                          {focus.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${focus.percentage}%`, backgroundColor: colors.primary[500] }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actual Patient Barriers */}
              <div className="border rounded-lg p-4" style={{ borderColor: '#FEE2E2' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={18} style={{ color: colors.status.error }} />
                  <h3 className="font-semibold text-neutral-900">Actual Patient Barriers</h3>
                </div>
                <div className="space-y-3">
                  {actualPatientBarriers.map((barrier, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-900">{barrier.category}</span>
                          {barrier.abandonmentTrigger && (
                            <AlertTriangle size={12} style={{ color: colors.status.error }} />
                          )}
                        </div>
                        <span className="text-sm font-bold" style={{ color: colors.status.error }}>
                          {barrier.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${barrier.percentage}%`,
                            backgroundColor:
                              barrier.severity === 'high'
                                ? colors.status.error
                                : barrier.severity === 'medium'
                                ? colors.amber[500]
                                : colors.status.success,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Critical Insights - Editable */}
            <div className="mt-6 p-4 bg-red-50 border-l-4 rounded" style={{ borderLeftColor: colors.status.error }}>
              <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                <AlertTriangle size={18} style={{ color: colors.status.error }} />
                Critical Misalignment Detected
                {editMode && <span className="text-xs text-neutral-500 font-normal ml-auto">(Click to edit)</span>}
              </h4>
              <div className="space-y-2 text-sm text-neutral-700 ml-6">
                {editMode ? (
                  keyInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="mt-2">•</span>
                      <textarea
                        value={insight}
                        onChange={(e) => {
                          const updated = [...keyInsights];
                          updated[index] = e.target.value;
                          setKeyInsights(updated);
                        }}
                        className="flex-1 p-2 border rounded"
                        style={{ borderColor: colors.neutral[300] }}
                        rows={2}
                      />
                    </div>
                  ))
                ) : (
                  keyInsights.map((insight, index) => (
                    <p key={index}>
                      • <strong>{insight.split('—')[0]}</strong> — {insight.split('—')[1]}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Actionable Recommendations - Editable */}
          <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Target size={24} style={{ color: colors.status.success }} />
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Actionable Recommendations</h2>
                  <p className="text-sm text-neutral-600">Based on {keyMetrics.totalCallsAnalyzed.toLocaleString()} analyzed calls</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {recommendations.map((rec, recIndex) => (
                <div
                  key={recIndex}
                  className="border rounded-lg p-5"
                  style={{
                    borderColor:
                      rec.priority === 1 ? colors.status.error : rec.priority === 2 ? colors.amber[300] : colors.primary[300],
                    borderWidth: '2px',
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className="px-2 py-1 text-xs font-bold rounded"
                      style={{
                        backgroundColor:
                          rec.priority === 1
                            ? '#FEE2E2'
                            : rec.priority === 2
                            ? '#FEF3C7'
                            : colors.primary[100],
                        color:
                          rec.priority === 1
                            ? colors.status.error
                            : rec.priority === 2
                            ? colors.amber[700]
                            : colors.primary[700],
                      }}
                    >
                      PRIORITY {rec.priority}
                    </span>
                  </div>

                  {editMode ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={rec.title}
                        onChange={(e) => updateRecommendation(recIndex, 'title', e.target.value)}
                        className="w-full text-lg font-semibold p-2 border rounded"
                        style={{ borderColor: colors.neutral[300] }}
                        placeholder="Recommendation Title"
                      />

                      <textarea
                        value={rec.description}
                        onChange={(e) => updateRecommendation(recIndex, 'description', e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        style={{ borderColor: colors.neutral[300] }}
                        rows={2}
                        placeholder="Description"
                      />

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 mb-2 block">Action Items:</label>
                        {rec.actionItems.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start gap-2 mb-2">
                            <CheckCircle size={14} className="text-green-600 mt-2" />
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateActionItem(recIndex, itemIndex, e.target.value)}
                              className="flex-1 p-2 border rounded text-xs"
                              style={{ borderColor: colors.neutral[300] }}
                            />
                            <button
                              onClick={() => removeActionItem(recIndex, itemIndex)}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <X size={16} className="text-red-600" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addActionItem(recIndex)}
                          className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                        >
                          + Add Action Item
                        </button>
                      </div>

                      <textarea
                        value={rec.evidence}
                        onChange={(e) => updateRecommendation(recIndex, 'evidence', e.target.value)}
                        className="w-full p-2 border rounded text-xs"
                        style={{ borderColor: colors.neutral[300] }}
                        rows={2}
                        placeholder="Evidence"
                      />

                      <input
                        type="text"
                        value={rec.projectedImpact}
                        onChange={(e) => updateRecommendation(recIndex, 'projectedImpact', e.target.value)}
                        className="w-full p-2 border rounded text-xs font-semibold"
                        style={{ borderColor: colors.neutral[300] }}
                        placeholder="Projected Impact"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold text-neutral-900 mb-2">{rec.title}</h4>
                      <p className="text-sm text-neutral-600 mb-3">{rec.description}</p>
                      <ul className="space-y-1 text-xs text-neutral-700 mb-3">
                        {rec.actionItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle size={12} className="text-green-600 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-3 border-t" style={{ borderColor: colors.neutral[200] }}>
                        <p className="text-xs text-neutral-600 mb-1">
                          <strong>Evidence:</strong> {rec.evidence}
                        </p>
                        <p className="text-xs text-green-700 font-semibold">
                          Projected Impact: {rec.projectedImpact}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Interventions & Effectiveness */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-Time Detection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={20} style={{ color: colors.status.error }} />
                  <h3 className="text-lg font-semibold text-neutral-900">Real-Time Abandonment Detection</h3>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">LIVE</span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    trigger: 'Insurance denial mentioned',
                    patient: 'PT-8823',
                    time: '2 min ago',
                    action: 'Copay assistance offered',
                  },
                  {
                    trigger: 'Expressed needle fear',
                    patient: 'PT-7734',
                    time: '5 min ago',
                    action: 'Nurse callback scheduled',
                  },
                  {
                    trigger: 'High out-of-pocket cost',
                    patient: 'PT-9012',
                    time: '8 min ago',
                    action: 'Financial counselor engaged',
                  },
                  {
                    trigger: 'Side effect concerns',
                    patient: 'PT-6745',
                    time: '12 min ago',
                    action: 'Educational materials sent',
                  },
                ].map((alert, index) => (
                  <div
                    key={index}
                    className="p-3 border-l-4 bg-red-50 rounded"
                    style={{ borderLeftColor: colors.status.error }}
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={14} style={{ color: colors.status.error }} className="mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium text-neutral-900">{alert.trigger}</p>
                          <span className="text-xs text-neutral-500">{alert.time}</span>
                        </div>
                        <p className="text-xs text-neutral-600 mb-1">Patient {alert.patient}</p>
                        <div className="flex items-center gap-1">
                          <ArrowRight size={12} style={{ color: colors.status.success }} />
                          <p className="text-xs font-medium" style={{ color: colors.status.success }}>
                            {alert.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg border" style={{ borderColor: colors.secondary[200] }}>
                <p className="text-sm text-green-800">
                  <strong>{keyMetrics.realTimeInterventions}</strong> interventions deployed this month •{' '}
                  <strong>{keyMetrics.interventionSuccessRate}%</strong> prevented abandonment
                </p>
              </div>
            </div>

            {/* Intervention Effectiveness */}
            <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
              <div className="flex items-center gap-2 mb-4">
                <Target size={20} style={{ color: colors.status.success }} />
                <h3 className="text-lg font-semibold text-neutral-900">Intervention Effectiveness</h3>
              </div>

              <div className="space-y-3">
                {interventionEffectiveness.map((intervention, index) => (
                  <div key={index} className="border rounded-lg p-3" style={{ borderColor: colors.neutral[200] }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">{intervention.barrier}</p>
                        <p className="text-xs text-neutral-600">{intervention.intervention}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold" style={{ color: colors.status.success }}>
                          +{intervention.adherenceImprovement}%
                        </p>
                        <p className="text-xs text-neutral-500">adherence</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t" style={{ borderColor: colors.neutral[200] }}>
                      <p className="text-xs text-neutral-500">Patients Helped</p>
                      <p className="font-semibold text-neutral-900">{intervention.patientCount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
>>>>>>> c6da729bc496af9882a1fbf1bbdbfee19bfcda22
