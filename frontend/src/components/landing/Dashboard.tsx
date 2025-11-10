
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  Phone,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import Card from './Card'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('live')

  const liveCallsData = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      medication: 'Humira',
      type: 'Refill Reminder',
      duration: '2:34',
      status: 'active',
      sentiment: 'positive'
    },
    {
      id: 2,
      patient: 'Michael Chen',
      medication: 'Enbrel',
      type: 'Side Effect Check-in',
      duration: '1:12',
      status: 'active',
      sentiment: 'neutral'
    },
    {
      id: 3,
      patient: 'Emma Davis',
      medication: 'Dupixent',
      type: 'Copay Enrollment',
      duration: '3:45',
      status: 'escalated',
      sentiment: 'concerned'
    },
  ]

  const metrics = [
    {
      label: 'Active Calls',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: Phone,
      color: 'primary'
    },
    {
      label: 'Adherence Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'success'
    },
    {
      label: 'Avg. Call Duration',
      value: '2:45',
      change: '-15s',
      trend: 'down',
      icon: Clock,
      color: 'primary'
    },
    {
      label: 'Escalation Rate',
      value: '4.3%',
      change: '-0.8%',
      trend: 'down',
      icon: AlertCircle,
      color: 'success'
    },
  ]

  const recentPatients = [
    { name: 'Sarah Johnson', adherence: 98, lastContact: '2 hours ago', risk: 'low' },
    { name: 'Michael Chen', adherence: 87, lastContact: '1 day ago', risk: 'medium' },
    { name: 'Emma Davis', adherence: 76, lastContact: '3 days ago', risk: 'high' },
    { name: 'John Williams', adherence: 95, lastContact: '5 hours ago', risk: 'low' },
  ]

  return (
    <section id="dashboard" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-medium text-primary">REAL-TIME MONITORING</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Interactive Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor patient engagement, track adherence trends, and manage interventions
            in real-time with our comprehensive analytics platform.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {metrics.map((metric, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 bg-${metric.color}/10 rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`w-5 h-5 text-${metric.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-success' : 'text-primary'
                }`}>
                  {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {metric.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Main Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-8">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('live')}
                className={`pb-3 px-2 font-medium transition-colors relative ${
                  activeTab === 'live' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Live Calls
                {activeTab === 'live' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`pb-3 px-2 font-medium transition-colors relative ${
                  activeTab === 'patients' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Patient Management
                {activeTab === 'patients' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            </div>

            {/* Live Calls View */}
            {activeTab === 'live' && (
              <div className="space-y-4">
                {liveCallsData.map((call) => (
                  <motion.div
                    key={call.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        call.status === 'active' ? 'bg-success/10' : 'bg-orange-500/10'
                      }`}>
                        <Phone className={`w-5 h-5 ${
                          call.status === 'active' ? 'text-success' : 'text-orange-500'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{call.patient}</div>
                        <div className="text-sm text-gray-600">{call.type} • {call.medication}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{call.duration}</div>
                        <div className="text-xs text-gray-600 capitalize">{call.sentiment}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        call.status === 'active'
                          ? 'bg-success/10 text-success'
                          : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {call.status === 'active' ? 'Active' : 'Escalated'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Patient Management View */}
            {activeTab === 'patients' && (
              <div className="space-y-4">
                {recentPatients.map((patient, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-600">Last contact: {patient.lastContact}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              patient.adherence >= 90
                                ? 'bg-success'
                                : patient.adherence >= 80
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${patient.adherence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12">
                          {patient.adherence}%
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.risk === 'low'
                          ? 'bg-success/10 text-success'
                          : patient.risk === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-700'
                          : 'bg-red-500/10 text-red-600'
                      }`}>
                        {patient.risk} risk
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
