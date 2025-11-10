
import { motion } from 'framer-motion'
import { AlertCircle, FileText, GraduationCap, Stethoscope, Calendar } from 'lucide-react'

export default function ProblemStatement() {
  const challenges = [
    {
      icon: FileText,
      text: 'Complex enrollment and reimbursement processes'
    },
    {
      icon: GraduationCap,
      text: 'Treatment education and side effect management'
    },
    {
      icon: Calendar,
      text: 'Adherence and refill coordination'
    },
    {
      icon: Stethoscope,
      text: 'Finding specialists and getting appointments'
    }
  ]

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full mb-6">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">THE CHALLENGE</span>
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Your therapy just got approved.<br />Now comes the hard part.
          </h2>

          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Patients need help navigating:
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-4 mb-12"
        >
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon
            return (
              <div
                key={index}
                className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                <div className="mt-0.5 rounded-lg bg-primary/10 p-2 flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {challenge.text}
                </p>
              </div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
        >
          <p className="text-lg font-semibold text-gray-900">
            Traditional patient support programs take <span className="text-primary">6-12 months to build</span> and cost <span className="text-primary">millions to scale</span>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
