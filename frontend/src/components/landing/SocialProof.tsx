
import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

export default function SocialProof() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full mb-6">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-gray-700">TRUSTED BY INNOVATORS</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Trusted by innovative biotech companies
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We&apos;re partnering with forward-thinking pharma companies launching the next generation of specialty therapies.
          </p>

          {/* Placeholder for logos - can be added later */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-40">
            <div className="h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500 font-medium">Partner Logo</span>
            </div>
            <div className="h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500 font-medium">Partner Logo</span>
            </div>
            <div className="h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500 font-medium">Partner Logo</span>
            </div>
            <div className="h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500 font-medium">Partner Logo</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
