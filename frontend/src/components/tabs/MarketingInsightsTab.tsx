import { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  AlertTriangle,
  TrendingUp,
  Target,
  CheckCircle,
  XCircle,
  Activity,
  DollarSign,
  Users,
  PhoneCall,
  ArrowRight,
  BarChart3,
  Zap,
  MessageSquare,
  Brain,
  Download,
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  roi: number;
}

export default function MarketingInsightsTab() {
  const [uploadedMaterials, setUploadedMaterials] = useState<UploadedMaterial[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [loading, setLoading] = useState(false);

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
      roi: 3.2,
    },
    {
      barrier: 'Injection anxiety',
      intervention: 'Nurse callback + training video',
      adherenceImprovement: 35,
      patientCount: 892,
      roi: 2.8,
    },
    {
      barrier: 'Side effect fears',
      intervention: 'Educational outreach + MD consult',
      adherenceImprovement: 28,
      patientCount: 674,
      roi: 2.1,
    },
    {
      barrier: 'Access barriers',
      intervention: 'Home delivery setup',
      adherenceImprovement: 32,
      patientCount: 543,
      roi: 2.5,
    },
  ];

  // Key metrics
  const keyMetrics = {
    totalCallsAnalyzed: 47823,
    patientsAtRisk: 8934,
    averageAbandonmentRate: 48.3,
    potentialRevenueLoss: 637000000,
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
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getGapScore = () => {
    // Calculate how misaligned marketing is with reality
    const marketingOnCost = marketingFocusData.find((m) => m.category.includes('Cost'))?.percentage || 0;
    const realityCost = actualPatientBarriers.find((b) => b.category.includes('Cost'))?.percentage || 0;
    const gap = Math.abs(marketingOnCost - realityCost);
    return Math.round(gap);
  };

  return (
    <div className="space-y-6" style={{ padding: spacing[6] }}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Message-Reality Gap Analysis</h1>
          <p className="text-neutral-600 max-w-3xl">
            Transform patient support calls into actionable intelligence. Identify abandonment triggers in
            real-time and optimize marketing spend based on actual patient behavior, not assumptions.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => alert('Generating comprehensive gap analysis report...')}
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Key Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-red-600 rounded-lg">
              <DollarSign size={24} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-red-700 bg-red-200 px-2 py-1 rounded-full">
              CRITICAL
            </span>
          </div>
          <p className="text-sm text-red-700 mb-1">Annual Revenue at Risk</p>
          <p className="text-3xl font-bold text-red-900">
            ${(keyMetrics.potentialRevenueLoss / 1000000).toFixed(0)}M
          </p>
          <p className="text-xs text-red-600 mt-2">From {keyMetrics.averageAbandonmentRate}% abandonment rate</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-amber-600 rounded-lg">
              <Users size={24} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-200 px-2 py-1 rounded-full">HIGH</span>
          </div>
          <p className="text-sm text-amber-700 mb-1">Patients at Risk</p>
          <p className="text-3xl font-bold text-amber-900">{keyMetrics.patientsAtRisk.toLocaleString()}</p>
          <p className="text-xs text-amber-600 mt-2">Identified abandonment triggers</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <PhoneCall size={24} className="text-white" />
            </div>
          </div>
          <p className="text-sm text-blue-700 mb-1">Calls Analyzed</p>
          <p className="text-3xl font-bold text-blue-900">{keyMetrics.totalCallsAnalyzed.toLocaleString()}</p>
          <p className="text-xs text-blue-600 mt-2">Extracting abandonment signals</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <Zap size={24} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded-full">LIVE</span>
          </div>
          <p className="text-sm text-green-700 mb-1">Real-Time Interventions</p>
          <p className="text-3xl font-bold text-green-900">{keyMetrics.realTimeInterventions}</p>
          <p className="text-xs text-green-600 mt-2">{keyMetrics.interventionSuccessRate}% success rate</p>
        </div>
      </div>

      {/* Upload Marketing Materials Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-1">Upload Marketing Materials</h2>
            <p className="text-sm text-neutral-600">
              Upload brand materials, campaign content, patient brochures, or sales collateral for AI analysis
            </p>
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload size={18} />
            <span>Upload Files</span>
            <input type="file" multiple className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" />
          </label>
        </div>

        {uploadedMaterials.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-neutral-700 mb-2">Uploaded Materials ({uploadedMaterials.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {uploadedMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-neutral-50 transition-colors"
                  style={{ borderColor: colors.neutral[200] }}
                >
                  <div className="p-2 bg-blue-100 rounded">
                    <FileText size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{material.name}</p>
                    <p className="text-xs text-neutral-500">{formatFileSize(material.size)}</p>
                    {material.analyzed ? (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle size={12} className="text-green-600" />
                        <span className="text-xs text-green-600 font-medium">Analyzed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 mt-1">
                        <Activity size={12} className="text-amber-600 animate-pulse" />
                        <span className="text-xs text-amber-600">Processing...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadedMaterials.length === 0 && (
          <div className="mt-4 p-8 border-2 border-dashed rounded-lg text-center" style={{ borderColor: colors.neutral[300] }}>
            <Upload size={48} className="mx-auto text-neutral-400 mb-3" />
            <p className="text-neutral-600 mb-1">No materials uploaded yet</p>
            <p className="text-sm text-neutral-500">Upload marketing materials to begin gap analysis</p>
          </div>
        )}
      </div>

      {/* Message-Reality Gap Analysis - HERO SECTION */}
      <div className="bg-gradient-to-br from-red-50 via-white to-blue-50 rounded-xl p-8 shadow-lg border-2 border-red-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-600 rounded-lg">
            <AlertTriangle size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Message-Reality Gap Analysis</h2>
            <p className="text-neutral-600">What Marketing Says vs. What Patients Actually Struggle With</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-neutral-600">Gap Score</p>
            <p className="text-4xl font-bold text-red-600">{getGapScore()}%</p>
            <p className="text-xs text-neutral-500">Misalignment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Marketing Focus */}
          <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Marketing Focus Areas</h3>
              <span className="text-xs text-neutral-500 ml-auto">(from brand materials)</span>
            </div>

            <div className="space-y-4">
              {marketingFocusData.map((focus, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-neutral-900">{focus.category}</span>
                    <span className="text-lg font-bold text-blue-600">{focus.percentage}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${focus.percentage}%` }}
                    ></div>
                  </div>
                  <ul className="space-y-1 text-xs text-neutral-600 ml-4">
                    {focus.keyMessages.map((message, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Actual Patient Barriers */}
          <div className="bg-white rounded-xl p-6 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={20} className="text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Actual Patient Barriers</h3>
              <span className="text-xs text-neutral-500 ml-auto">(from support calls)</span>
            </div>

            <div className="space-y-4">
              {actualPatientBarriers.map((barrier, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          barrier.severity === 'high'
                            ? 'bg-red-600'
                            : barrier.severity === 'medium'
                            ? 'bg-amber-600'
                            : 'bg-green-600'
                        }`}
                      ></span>
                      <span className="font-medium text-neutral-900">{barrier.category}</span>
                      {barrier.abandonmentTrigger && (
                        <AlertTriangle size={14} className="text-red-600" title="Major abandonment trigger" />
                      )}
                    </div>
                    <span className="text-lg font-bold text-red-600">{barrier.percentage}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        barrier.severity === 'high'
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : barrier.severity === 'medium'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                          : 'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${barrier.percentage}%` }}
                    ></div>
                  </div>
                  {index < 2 && (
                    <div className="text-xs text-neutral-600 italic bg-red-50 p-2 rounded mt-1">
                      "{barrier.examples[0]}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gap Insights */}
        <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-600 rounded">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-700 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-2">Critical Misalignment Detected</h4>
              <div className="space-y-1 text-sm text-red-800">
                <p>
                  • <strong>34% of patients abandon due to cost/insurance</strong> — yet this receives minimal
                  marketing focus
                </p>
                <p>
                  • <strong>19% abandon due to injection anxiety</strong> — while dosing convenience messaging
                  doesn't address fear/anxiety
                </p>
                <p>
                  • <strong>Only 8% question efficacy</strong> — but 45% of marketing content focuses on efficacy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Abandonment Trigger Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time Abandonment Detection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-red-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Real-Time Abandonment Detection</h3>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold animate-pulse">
              LIVE
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                trigger: 'Insurance denial mentioned',
                patient: 'PT-8823',
                time: '2 min ago',
                action: 'Copay assistance offered',
                status: 'intervened',
              },
              {
                trigger: 'Expressed needle fear',
                patient: 'PT-7734',
                time: '5 min ago',
                action: 'Nurse callback scheduled',
                status: 'intervened',
              },
              {
                trigger: 'High out-of-pocket cost',
                patient: 'PT-9012',
                time: '8 min ago',
                action: 'Financial counselor engaged',
                status: 'in-progress',
              },
              {
                trigger: 'Side effect concerns',
                patient: 'PT-6745',
                time: '12 min ago',
                action: 'Educational materials sent',
                status: 'intervened',
              },
            ].map((alert, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 border-l-4 border-red-500 bg-red-50 rounded"
              >
                <AlertTriangle size={16} className="text-red-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-red-900">{alert.trigger}</p>
                    <span className="text-xs text-neutral-500">{alert.time}</span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-1">Patient {alert.patient}</p>
                  <div className="flex items-center gap-2">
                    <ArrowRight size={12} className="text-green-600" />
                    <p className="text-xs text-green-700 font-medium">{alert.action}</p>
                    {alert.status === 'intervened' && (
                      <CheckCircle size={12} className="text-green-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>{keyMetrics.realTimeInterventions}</strong> interventions deployed this month •{' '}
              <strong>{keyMetrics.interventionSuccessRate}%</strong> prevented abandonment
            </p>
          </div>
        </div>

        {/* Intervention Effectiveness */}
        <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-neutral-900">Intervention Effectiveness</h3>
          </div>

          <p className="text-sm text-neutral-600 mb-4">
            Proven interventions that reduce abandonment and improve adherence
          </p>

          <div className="space-y-4">
            {interventionEffectiveness.map((intervention, index) => (
              <div key={index} className="border rounded-lg p-4" style={{ borderColor: colors.neutral[200] }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-neutral-900">{intervention.barrier}</p>
                    <p className="text-sm text-neutral-600">{intervention.intervention}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">+{intervention.adherenceImprovement}%</p>
                    <p className="text-xs text-neutral-500">adherence</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t" style={{ borderColor: colors.neutral[200] }}>
                  <div>
                    <p className="text-xs text-neutral-500">Patients Helped</p>
                    <p className="text-lg font-semibold text-neutral-900">{intervention.patientCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">ROI</p>
                    <p className="text-lg font-semibold text-green-600">{intervention.roi}x</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 shadow-sm border-2 border-green-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-600 rounded-lg">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Actionable Recommendations</h2>
            <p className="text-neutral-600">Based on {keyMetrics.totalCallsAnalyzed.toLocaleString()} analyzed calls</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-5 border-l-4 border-red-600">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">PRIORITY 1</span>
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">Shift Marketing to Address Cost</h4>
            <p className="text-sm text-neutral-600 mb-3">
              34% of patients abandon due to cost, but marketing doesn't emphasize copay assistance programs.
            </p>
            <ul className="space-y-1 text-xs text-neutral-700">
              <li className="flex items-start gap-2">
                <CheckCircle size={12} className="text-green-600 mt-0.5" />
                <span>Create cost-focused campaign materials</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={12} className="text-green-600 mt-0.5" />
                <span>Lead with "$0 copay" messaging</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={12} className="text-green-600 mt-0.5" />
                <span>Train reps on same-call enrollment</span>
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-green-700 font-semibold">Projected Impact: 25-30% abandonment reduction</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border-l-4 border-amber-600">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">PRIORITY 2</span>
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">Address Injection Anxiety Head-On</h4>
            <p className="text-sm text-neutral-600 mb-3">
              19% cite needle fear as abandonment driver. Current "convenience" messaging doesn't help.
            </p>
            <ul className="space-y-1 text-xs text-neutral-700">
              <li className="flex items-start gap-2">
                <CheckCircle size={12} className="text-green-600 mt-0.5" />
                <span>Develop anxiety-specific patient education</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={12} className="text-green-600 mt-0.5" />
                <span>Offer proactive nurse training calls</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={12} className="text-green-600 mt-0.5" />
                <span>Create video testimonials from anxious patients</span>
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-green-700 font-semibold">Projected Impact: 35% persistence improvement</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border-l-4 border-blue-600">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">PRIORITY 3</span>
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">Reduce Efficacy Messaging</h4>
            <p className="text-sm text-neutral-600 mb-3">
              Only 8% question efficacy, yet 45% of content focuses on it. Reallocate resources.
            </p>
            <ul className="space-y-1 text-xs text-neutral-700">
              <li className="flex items-start gap-2">
                <CheckCircle size={12} className="text-green-600 mt-0.5" />
                <span>Trim efficacy content to 15-20%</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={12} className="text-green-600 mt-0.5" />
                <span>Redirect budget to cost/access messaging</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={12} className="text-green-600 mt-0.5" />
                <span>A/B test new content mix</span>
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-green-700 font-semibold">Projected Impact: Optimized marketing spend</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Impact Summary */}
      <div className="bg-neutral-900 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Financial Impact Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-neutral-400 text-sm mb-1">Current Annual Loss</p>
            <p className="text-3xl font-bold text-red-400">${(keyMetrics.potentialRevenueLoss / 1000000).toFixed(0)}M</p>
            <p className="text-xs text-neutral-500 mt-1">From 48.3% abandonment</p>
          </div>
          <div>
            <p className="text-neutral-400 text-sm mb-1">Recoverable Revenue</p>
            <p className="text-3xl font-bold text-green-400">
              ${((keyMetrics.potentialRevenueLoss * 0.28) / 1000000).toFixed(0)}M
            </p>
            <p className="text-xs text-neutral-500 mt-1">With 25-30% reduction</p>
          </div>
          <div>
            <p className="text-neutral-400 text-sm mb-1">Support Program Spend</p>
            <p className="text-3xl font-bold text-blue-400">$5B</p>
            <p className="text-xs text-neutral-500 mt-1">Industry-wide annually</p>
          </div>
          <div>
            <p className="text-neutral-400 text-sm mb-1">ROI from Interventions</p>
            <p className="text-3xl font-bold text-green-400">2.8x</p>
            <p className="text-xs text-neutral-500 mt-1">Average across programs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
