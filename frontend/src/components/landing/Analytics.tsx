
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
    <section id="analytics" className="py-20 px-6 bg-gray-50">
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

          {/* Call Volume */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Call Volume</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={callVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="day" stroke="#666666" />
                  <YAxis stroke="#666666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E5E5',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="outbound" fill="#2563EB" radius={[4, 4, 0, 0]} name="Outbound" />
                  <Bar dataKey="inbound" fill="#10B981" radius={[4, 4, 0, 0]} name="Inbound" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">1,847 calls</div>
                <div className="text-sm text-gray-700">This week • 94% AI resolution rate</div>
              </div>
            </Card>
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
