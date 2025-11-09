import { useState } from 'react';
import { AlertTriangle, TrendingUp, Info, X } from 'lucide-react';
import { colors, spacing } from '../../lib/design-system';

interface Trigger {
  trigger_type: string;
  count: number;
  avg_confidence: number;
  severity: string;
}

interface RiskBreakdown {
  patient_id: string;
  patient_name: string;
  risk_score: number;
  risk_level: string;
  call_count: number;
  triggers_found: Record<string, Trigger>;
  total_trigger_count: number;
  last_call_date: string | null;
  sdoh_risk_score: number;
  journey_stage: string;
}

interface AbandonmentRiskScoreProps {
  riskScore: number;
  patientId: string;
  riskBreakdown?: RiskBreakdown;
  onCalculate?: (patientId: string) => Promise<RiskBreakdown>;
}

export default function AbandonmentRiskScore({
  riskScore,
  patientId,
  riskBreakdown,
  onCalculate,
}: AbandonmentRiskScoreProps) {
  const [showModal, setShowModal] = useState(false);
  const [breakdown, setBreakdown] = useState<RiskBreakdown | null>(riskBreakdown || null);
  const [loading, setLoading] = useState(false);

  const getRiskColor = (score: number) => {
    if (score >= 70) return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
    if (score >= 40) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' };
    return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
  };

  const color = getRiskColor(riskScore);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!breakdown && onCalculate) {
      setLoading(true);
      try {
        const data = await onCalculate(patientId);
        setBreakdown(data);
      } catch (error) {
        console.error('Failed to calculate risk:', error);
      } finally {
        setLoading(false);
      }
    }

    setShowModal(true);
  };

  const getTriggerLabel = (triggerType: string) => {
    const labels: Record<string, string> = {
      cost_concern: 'Cost Concerns',
      injection_anxiety: 'Injection Anxiety',
      side_effect_fear: 'Side Effect Fear',
      insurance_denial: 'Insurance Denial',
      access_barrier: 'Access Barriers',
      complexity_concern: 'Complexity Concerns',
    };
    return labels[triggerType] || triggerType;
  };

  const getTriggerIcon = (triggerType: string) => {
    const icons: Record<string, string> = {
      cost_concern: '💰',
      injection_anxiety: '💉',
      side_effect_fear: '⚠️',
      insurance_denial: '🚫',
      access_barrier: '🚗',
      complexity_concern: '🤔',
    };
    return icons[triggerType] || '📌';
  };

  return (
    <>
      {/* Risk Score Badge */}
      <button
        onClick={handleClick}
        className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${color.bg} ${color.text} ${color.border} hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2`}
      >
        <span>{riskScore}</span>
        <Info size={14} />
      </button>

      {/* Risk Breakdown Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-start" style={{ borderColor: colors.neutral[200] }}>
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Abandonment Risk Analysis</h3>
                {breakdown && (
                  <p className="text-sm text-neutral-600 mt-1">
                    {breakdown.patient_name}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-neutral-600">Analyzing patient risk...</p>
                </div>
              ) : breakdown ? (
                <>
                  {/* Risk Score Summary */}
                  <div className={`p-6 rounded-xl ${color.bg} border-2 ${color.border}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-700 mb-1">Abandonment Risk Score</p>
                        <p className={`text-4xl font-bold ${color.text}`}>{breakdown.risk_score}</p>
                        <p className="text-sm text-neutral-600 mt-1 capitalize">
                          {breakdown.risk_level} Risk
                        </p>
                      </div>
                      <AlertTriangle size={48} className={color.text} />
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Total Calls Analyzed</p>
                      <p className="text-2xl font-bold text-neutral-900">{breakdown.call_count}</p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Triggers Detected</p>
                      <p className="text-2xl font-bold text-neutral-900">{breakdown.total_trigger_count}</p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">SDOH Risk Score</p>
                      <p className="text-2xl font-bold text-neutral-900">{breakdown.sdoh_risk_score}</p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Journey Stage</p>
                      <p className="text-lg font-semibold text-neutral-900 capitalize">
                        {breakdown.journey_stage?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Detected Triggers */}
                  {Object.keys(breakdown.triggers_found).length > 0 && (
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-3">Detected Abandonment Triggers</h4>
                      <div className="space-y-3">
                        {Object.entries(breakdown.triggers_found)
                          .sort((a, b) => b[1].count - a[1].count)
                          .map(([triggerType, trigger]) => {
                            const severityColor =
                              trigger.severity === 'high'
                                ? 'bg-red-50 border-red-200'
                                : trigger.severity === 'medium'
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-blue-50 border-blue-200';

                            return (
                              <div
                                key={triggerType}
                                className={`p-4 rounded-lg border ${severityColor}`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl">{getTriggerIcon(triggerType)}</span>
                                    <div>
                                      <p className="font-medium text-neutral-900">
                                        {getTriggerLabel(triggerType)}
                                      </p>
                                      <p className="text-xs text-neutral-600 capitalize">
                                        {trigger.severity} severity
                                      </p>
                                    </div>
                                  </div>
                                  <span className="px-2 py-1 bg-white rounded text-sm font-semibold">
                                    {trigger.count}x
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-neutral-600">
                                  <span>Confidence: {(trigger.avg_confidence * 100).toFixed(0)}%</span>
                                  <div className="flex-1 bg-neutral-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${trigger.avg_confidence * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-medium text-blue-900 mb-2">Recommended Actions</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {breakdown.risk_score >= 70 && (
                            <>
                              <li>• Immediate outreach by patient support team</li>
                              <li>• Enroll in high-touch support program</li>
                              <li>• Schedule nurse callback within 48 hours</li>
                            </>
                          )}
                          {breakdown.risk_score >= 40 && breakdown.risk_score < 70 && (
                            <>
                              <li>• Schedule follow-up call within 1 week</li>
                              <li>• Send targeted educational materials</li>
                              <li>• Monitor for additional triggers</li>
                            </>
                          )}
                          {breakdown.risk_score < 40 && (
                            <>
                              <li>• Continue standard support cadence</li>
                              <li>• Monitor quarterly for changes</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Last Call Info */}
                  {breakdown.last_call_date && (
                    <div className="text-sm text-neutral-600 border-t pt-4" style={{ borderColor: colors.neutral[200] }}>
                      <p>
                        Last call: {new Date(breakdown.last_call_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-neutral-600">
                  <p>No detailed risk data available.</p>
                  <p className="text-sm mt-2">Click to analyze patient call history.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-neutral-50 border-t px-6 py-4 flex justify-end gap-3" style={{ borderColor: colors.neutral[200] }}>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => alert('Creating intervention plan...\n\nThis would launch the intervention workflow.')}
              >
                Create Intervention Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
