
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import Button from './Button'

export default function CTA() {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We partner with biotech companies to build AI patient support tailored to your therapy, your patients, and your launch timeline.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
