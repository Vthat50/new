import { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Calculator,
  Download,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { colors, spacing } from '../../lib/design-system';
import { api } from '../../services/api';

export default function OutcomesTab() {
  const [loading, setLoading] = useState(true);
  const [effectivenessData, setEffectivenessData] = useState<any>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('90');
  const [roiInputs, setRoiInputs] = useState({
    interventions_count: 100,
    intervention_cost: 50,
    baseline_adherence: 45,
    intervention_adherence: 70,
    annual_revenue_per_patient: 150000,
  });
  const [roiResults, setRoiResults] = useState<any>(null);
  const [abandonmentCurves, setAbandonmentCurves] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [selectedDateRange]);

  useEffect(() => {
    calculateROI();
  }, [roiInputs]);

  const loadData = async () => {
    setLoading(true);

    // Hardcoded mock data
    setTimeout(() => {
      setEffectivenessData({
        summary: {
          total_interventions: 234,
          total_revenue_saved: 8750000,
          total_cost: 15650,
          overall_roi: 55800
        },
        by_intervention_type: [
          {
            intervention_type: "copay_enrollment",
            total_interventions: 87,
            unique_patients: 87,
            adherence_rate_with_intervention: 75.2,
            adherence_rate_without_intervention: 45.1,
            improvement_percentage: 30.1,
            patients_retained: 26.2,
            revenue_saved: 3930000,
            total_cost: 3915,
            roi_percentage: 100300,
            cost_per_intervention: 45
          },
          {
            intervention_type: "prior_auth_support",
            total_interventions: 52,
            unique_patients: 52,
            adherence_rate_with_intervention: 78.4,
            adherence_rate_without_intervention: 45.1,
            improvement_percentage: 33.3,
            patients_retained: 17.3,
            revenue_saved: 2595000,
            total_cost: 6240,
            roi_percentage: 41470,
            cost_per_intervention: 120
          },
          {
            intervention_type: "nurse_callback",
            total_interventions: 63,
            unique_patients: 63,
            adherence_rate_with_intervention: 70.5,
            adherence_rate_without_intervention: 45.1,
            improvement_percentage: 25.4,
            patients_retained: 16.0,
            revenue_saved: 2400000,
            total_cost: 4725,
            roi_percentage: 50700,
            cost_per_intervention: 75
          },
          {
            intervention_type: "educational_material",
            total_interventions: 32,
            unique_patients: 32,
            adherence_rate_with_intervention: 62.8,
            adherence_rate_without_intervention: 45.1,
            improvement_percentage: 17.7,
            patients_retained: 5.7,
            revenue_saved: 855000,
            total_cost: 480,
            roi_percentage: 178025,
            cost_per_intervention: 15
          },
        ]
      });

      setAbandonmentCurves({
        time_points_days: [0, 30, 60, 90, 120, 150, 180],
        survival_curves: {
          copay_enrollment: [
            { days: 0, adherence_rate: 100 },
            { days: 30, adherence_rate: 90 },
            { days: 60, adherence_rate: 85 },
            { days: 90, adherence_rate: 80 },
            { days: 120, adherence_rate: 78 },
            { days: 150, adherence_rate: 75 },
            { days: 180, adherence_rate: 73 }
          ],
          nurse_callback: [
            { days: 0, adherence_rate: 100 },
            { days: 30, adherence_rate: 88 },
            { days: 60, adherence_rate: 82 },
            { days: 90, adherence_rate: 77 },
            { days: 120, adherence_rate: 74 },
            { days: 150, adherence_rate: 71 },
            { days: 180, adherence_rate: 69 }
          ],
          educational_material: [
            { days: 0, adherence_rate: 100 },
            { days: 30, adherence_rate: 82 },
            { days: 60, adherence_rate: 72 },
            { days: 90, adherence_rate: 65 },
            { days: 120, adherence_rate: 60 },
            { days: 150, adherence_rate: 57 },
            { days: 180, adherence_rate: 55 }
          ],
          no_intervention: [
            { days: 0, adherence_rate: 100 },
            { days: 30, adherence_rate: 75 },
            { days: 60, adherence_rate: 60 },
            { days: 90, adherence_rate: 48 },
            { days: 120, adherence_rate: 40 },
            { days: 150, adherence_rate: 35 },
            { days: 180, adherence_rate: 32 }
          ]
        }
      });

      setLoading(false);
    }, 500);
  };

  const calculateROI = async () => {
    // Hardcoded ROI calculation
    const patientsRetained = roiInputs.interventions_count * ((roiInputs.intervention_adherence - roiInputs.baseline_adherence) / 100);
    const revenueSaved = patientsRetained * roiInputs.annual_revenue_per_patient;
    const totalCost = roiInputs.interventions_count * roiInputs.intervention_cost;
    const netBenefit = revenueSaved - totalCost;
    const roiPercentage = totalCost > 0 ? (netBenefit / totalCost * 100) : 0;
    const paybackMonths = (revenueSaved / 12) > 0 ? totalCost / (revenueSaved / 12) : 0;

    setRoiResults({
      inputs: roiInputs,
      results: {
        patients_retained: patientsRetained,
        revenue_saved: revenueSaved,
        total_cost: totalCost,
        net_benefit: netBenefit,
        roi_percentage: roiPercentage,
        payback_period_months: paybackMonths
      },
      per_patient: {
        revenue_per_retained_patient: roiInputs.annual_revenue_per_patient,
        cost_per_patient: roiInputs.intervention_cost,
        net_value_per_patient: (revenueSaved - totalCost) / roiInputs.interventions_count
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading outcomes data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ padding: spacing[6] }}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Intervention Outcomes</h1>
          <p className="text-neutral-600">
            Measure the effectiveness of interventions and calculate ROI
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
            style={{ borderColor: colors.neutral[300] }}
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={() => alert('Exporting outcomes report...')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Total Interventions</span>
            <Target className="text-blue-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-neutral-900">
            {effectivenessData?.summary?.total_interventions || 0}
          </p>
          <p className="text-sm text-neutral-600 mt-1">Last {selectedDateRange} days</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Revenue Saved</span>
            <DollarSign className="text-green-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${(effectivenessData?.summary?.total_revenue_saved || 0).toLocaleString()}
          </p>
          <p className="text-sm text-neutral-600 mt-1">From interventions</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Total Cost</span>
            <Calculator className="text-amber-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-neutral-900">
            ${(effectivenessData?.summary?.total_cost || 0).toLocaleString()}
          </p>
          <p className="text-sm text-neutral-600 mt-1">Program expenses</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Overall ROI</span>
            <TrendingUp className="text-purple-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {effectivenessData?.summary?.overall_roi || 0}%
          </p>
          <p className="text-sm text-neutral-600 mt-1">Return on investment</p>
        </div>
      </div>

      {/* Intervention Effectiveness Comparison */}
      <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
        <h3 className="text-lg font-semibold mb-4">Intervention Effectiveness - Before vs After</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={effectivenessData?.by_intervention_type || []}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="intervention_type"
              tickFormatter={(value) => value.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            />
            <YAxis label={{ value: 'Adherence Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: any) => [`${value}%`, '']}
              labelFormatter={(label) => label.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            />
            <Legend />
            <Bar
              dataKey="adherence_rate_without_intervention"
              fill="#ef4444"
              name="Without Intervention"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="adherence_rate_with_intervention"
              fill="#10b981"
              name="With Intervention"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Intervention Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
        <h3 className="text-lg font-semibold mb-4">Detailed Intervention Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: colors.neutral[200] }}>
                <th className="text-left py-3 px-4 text-sm font-semibold">Intervention Type</th>
                <th className="text-right py-3 px-4 text-sm font-semibold">Total</th>
                <th className="text-right py-3 px-4 text-sm font-semibold">Adherence Improvement</th>
                <th className="text-right py-3 px-4 text-sm font-semibold">Patients Retained</th>
                <th className="text-right py-3 px-4 text-sm font-semibold">Revenue Saved</th>
                <th className="text-right py-3 px-4 text-sm font-semibold">Cost</th>
                <th className="text-right py-3 px-4 text-sm font-semibold">ROI</th>
              </tr>
            </thead>
            <tbody>
              {effectivenessData?.by_intervention_type?.map((intervention: any, index: number) => (
                <tr
                  key={index}
                  className="border-b hover:bg-neutral-50 cursor-pointer"
                  style={{ borderColor: colors.neutral[200] }}
                  onClick={() => alert(`Detailed view for ${intervention.intervention_type}\n\nClick to see patient list and drill-down analytics.`)}
                >
                  <td className="py-3 px-4">
                    <span className="font-medium capitalize">
                      {intervention.intervention_type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-600">
                    {intervention.total_interventions}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      intervention.improvement_percentage >= 30
                        ? 'bg-green-100 text-green-700'
                        : intervention.improvement_percentage >= 20
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      +{intervention.improvement_percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-600">
                    {intervention.patients_retained.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right text-green-600 font-medium">
                    ${intervention.revenue_saved.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-600">
                    ${intervention.total_cost.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-purple-600">
                      {intervention.roi_percentage.toLocaleString()}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="text-blue-600" size={24} />
          <h3 className="text-lg font-semibold">Interactive ROI Calculator</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Number of Interventions
              </label>
              <input
                type="number"
                value={roiInputs.interventions_count}
                onChange={(e) => setRoiInputs({ ...roiInputs, interventions_count: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: colors.neutral[300] }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Cost per Intervention ($)
              </label>
              <input
                type="number"
                value={roiInputs.intervention_cost}
                onChange={(e) => setRoiInputs({ ...roiInputs, intervention_cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: colors.neutral[300] }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Baseline Adherence Rate (%)
              </label>
              <input
                type="number"
                value={roiInputs.baseline_adherence}
                onChange={(e) => setRoiInputs({ ...roiInputs, baseline_adherence: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: colors.neutral[300] }}
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Post-Intervention Adherence Rate (%)
              </label>
              <input
                type="number"
                value={roiInputs.intervention_adherence}
                onChange={(e) => setRoiInputs({ ...roiInputs, intervention_adherence: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: colors.neutral[300] }}
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Annual Revenue per Patient ($)
              </label>
              <input
                type="number"
                value={roiInputs.annual_revenue_per_patient}
                onChange={(e) => setRoiInputs({ ...roiInputs, annual_revenue_per_patient: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: colors.neutral[300] }}
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <h4 className="font-semibold text-neutral-900 mb-4">ROI Results</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: colors.neutral[300] }}>
                  <span className="text-neutral-700">Patients Retained</span>
                  <span className="font-bold text-lg">{roiResults?.results?.patients_retained || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: colors.neutral[300] }}>
                  <span className="text-neutral-700">Revenue Saved</span>
                  <span className="font-bold text-lg text-green-600">
                    ${(roiResults?.results?.revenue_saved || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: colors.neutral[300] }}>
                  <span className="text-neutral-700">Total Cost</span>
                  <span className="font-bold text-lg text-red-600">
                    ${(roiResults?.results?.total_cost || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: colors.neutral[300] }}>
                  <span className="text-neutral-700">Net Benefit</span>
                  <span className="font-bold text-lg text-purple-600">
                    ${(roiResults?.results?.net_benefit || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-white rounded-lg px-4 mt-4">
                  <span className="font-semibold text-neutral-900">ROI</span>
                  <span className="font-bold text-2xl text-purple-600">
                    {roiResults?.results?.roi_percentage || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-neutral-600">Payback Period</span>
                  <span className="font-medium">
                    {(roiResults?.results?.payback_period_months || 0).toFixed(1)} months
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
              <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Key Findings:</p>
                <p>
                  For every ${roiInputs.intervention_cost} spent on intervention, you generate{' '}
                  ${((roiResults?.results?.revenue_saved || 0) / (roiResults?.results?.total_cost || 1)).toFixed(2)} in revenue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time to Abandonment Curves */}
      <div className="bg-white rounded-xl p-6 shadow-sm border" style={{ borderColor: colors.neutral[200] }}>
        <h3 className="text-lg font-semibold mb-4">Time to Abandonment - Survival Curves</h3>
        <p className="text-sm text-neutral-600 mb-4">
          Shows percentage of patients still adherent over time, by intervention type
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="days"
              label={{ value: 'Days Since Start', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Patients Still Adherent (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip formatter={(value: any) => [`${value}%`, '']} />
            <Legend />
            {abandonmentCurves?.survival_curves && Object.entries(abandonmentCurves.survival_curves).map(([type, data]: [string, any], index) => {
              const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
              return (
                <Line
                  key={type}
                  data={data}
                  type="monotone"
                  dataKey="adherence_rate"
                  stroke={colors[index % colors.length]}
                  name={type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  strokeWidth={2}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
