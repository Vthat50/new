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
