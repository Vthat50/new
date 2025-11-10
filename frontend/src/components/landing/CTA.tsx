
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import Button from './Button'

export default function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 -z-10" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_50%)] -z-10" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full mb-8 backdrop-blur-sm">
            <Phone className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-medium text-white">Get Started Today</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Let&apos;s Design Your<br />Patient Hub Together
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            We partner with biotech companies to build AI patient support tailored to your therapy, your patients, and your launch timeline.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl shadow-black/20 px-8"
            >
              Schedule a Design Session
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8"
            >
              See a Demo
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-gray-400 leading-relaxed">
              Our voice AI is designed to support patient journeys and enhance medication adherence—but it doesn't replace professional medical advice. Patients should always consult their healthcare provider for medical decisions.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
