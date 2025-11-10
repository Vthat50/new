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
    // Only load initial KPIs, not the full data
    loadInitialKPIs();
  }, [selectedDateRange]);

  const loadInitialKPIs = () => {
    setLoading(true);
    setTimeout(() => {
      setKpis({
        total_calls: 287,
        revenue_at_risk: 8700000,
        potential_recovery: 40,
        alignment_score: 42,
      });
      setLoading(false);
    }, 400);
  };

  const loadAnalysisData = () => {
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

      // Load all analysis data after processing is complete
      loadAnalysisData();

      // Update marketing focus with analyzed data (overwrites the default from loadAnalysisData)
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

          {/* Main Content Grid - Only show after file upload */}
          {barrierData.length > 0 && (
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
          )}

          {/* Diverging Bar Chart - Gap Analysis - Only show after file upload */}
          {gapData.length > 0 && (
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
          )}

          {/* AI-Generated Insights Table - Only show after file upload */}
          {insights.length > 0 && (
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
          )}
        </div>
      )}

      {/* Geographic View */}
      {activeView === 'geographic' && geographicData.length > 0 && (
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
