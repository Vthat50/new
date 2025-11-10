
import { motion } from 'framer-motion'
import {
  Phone,
  PhoneCall,
  MessageCircle,
  GraduationCap,
  CreditCard,
  Activity,
  Users
} from 'lucide-react'
import FeatureCard from './FeatureCard'

export default function Features() {
  const features = [
    {
      icon: Users,
      title: 'Instant Patient Navigation',
      description: 'Guide patients from diagnosis through treatment. AI-powered navigation helps patients understand their journey and next steps at every stage.',
    },
    {
      icon: CreditCard,
      title: 'Automated Access Support',
      description: 'Streamline prior authorization and co-pay assistance. Automated workflows remove barriers and accelerate patient access to therapy.',
    },
    {
      icon: GraduationCap,
      title: 'Personalized Education',
      description: 'Answer treatment questions in real-time. Interactive Q&A for dosing questions, administration instructions, and common concerns—accessible 24/7.',
    },
    {
      icon: MessageCircle,
      title: 'Proactive Adherence',
      description: 'Smart reminders and check-ins that actually work. Intelligent scheduling adapts to individual routines and preferences to keep patients on track.',
    },
    {
      icon: Activity,
      title: 'Safety Monitoring & Alerts',
      description: 'Proactive side effect tracking with intelligent severity assessment. Automatic escalation protocols for critical situations that require immediate attention.',
    },
    {
      icon: PhoneCall,
      title: 'Scale Patient Support',
      description: 'Handle thousands of patient interactions simultaneously without compromising quality. Integrates seamlessly with your existing CRM and health systems.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full mb-6">
            <span className="text-xs font-medium text-gray-700">INTELLIGENT AI AGENTS</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Intelligent AI Agents That Support Patients 24/7
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Built specifically for rare disease, oncology, gene therapy, and specialty medicines.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </motion.div>

        {/* Integration callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 p-10 lg:p-16"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Integrates With Your Ecosystem
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Deploy across your existing infrastructure—pharmacy networks, CRM systems, and patient hubs. Enterprise-grade security with full HIPAA compliance and end-to-end encryption.
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  Pharmacy Networks
                </div>
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  CRM Platforms
                </div>
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  Patient Portals
                </div>
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  EHR Systems
                </div>
                <div className="px-4 py-2 bg-primary/10 rounded-full text-sm font-semibold text-primary">
                  +25 More
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-gray-900 mb-2">15x</div>
                <div className="text-sm text-gray-600">Enrollment Increase</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-gray-900 mb-2">92%</div>
                <div className="text-sm text-gray-600">Patient Satisfaction</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
                <div className="text-sm text-gray-600">Languages Supported</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Always Available</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
