
import { motion } from 'framer-motion'
import { CheckCircle2, Clock } from 'lucide-react'
import VoiceAgent from './VoiceAgent'

export default function WhyNow() {
  const idealFor = [
    'Recent FDA approvals requiring immediate patient support',
    'Upcoming launches in the next 12 months',
    'Gene therapies requiring intensive patient education',
    'Rare diseases with complex patient finding needs'
  ]

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">PERFECT TIMING</span>
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Perfect for companies with:
          </h2>
        </motion.div>

        {/* Voice Agent */}
        <div className="mb-8">
          <VoiceAgent />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-2xl p-8 lg:p-12 shadow-lg"
        >
          <div className="space-y-5">
            {idealFor.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
