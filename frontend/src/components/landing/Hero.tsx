
import { motion } from 'framer-motion'
import { Phone, MessageSquare, Shield, Sparkles } from 'lucide-react'
import Button from './Button'

export default function Hero() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      {/* Minimal gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white -z-10" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-gray-700">AI-Powered Patient Hubs</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Launch Your Patient Support Program in Weeks, Not Months
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
              AI-powered patient hubs that guide patients through complex treatment journeys—from diagnosis to adherence. Purpose-built for specialty pharma and biotech.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="shadow-lg shadow-primary/20">
                See How It Works
              </Button>
              <Button variant="outline" size="lg">
                Book a Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-gray-700">HIPAA Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <Phone className="w-3 h-3 text-success" />
                </div>
                <span className="text-sm font-medium text-gray-700">24/7 Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-gray-700">Human-Like Interaction</span>
              </div>
            </div>
          </motion.div>

          {/* Right visual - cleaner, more minimal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main card */}
            <div className="relative bg-white rounded-3xl shadow-xl p-8 border border-gray-200/60 backdrop-blur">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Patient Support AI</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span className="text-xs text-gray-500">Live Call in Progress</span>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-success/10 rounded-full">
                  <span className="text-xs font-medium text-success">Active</span>
                </div>
              </div>

              {/* Conversation */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Hi Michael! Just checking in on your refill. Need any help understanding your dosage schedule?
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <div className="bg-primary/10 rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Yes, I'm confused about when to take it with meals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      I can help clarify that. Let me walk you through the timing...
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-sm font-medium text-gray-700">
                  <MessageSquare className="w-4 h-4" />
                  Transfer to Agent
                </button>
                <button className="px-4 py-2.5 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all">
                  <span className="text-primary">•••</span>
                </button>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-white border border-success/20 text-success px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Compliant</span>
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -left-6 top-1/4 bg-white rounded-2xl shadow-lg border border-gray-200/60 p-4 backdrop-blur"
            >
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-xs text-gray-600 mt-1">Adherence Rate</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -right-6 bottom-1/4 bg-white rounded-2xl shadow-lg border border-gray-200/60 p-4 backdrop-blur"
            >
              <div className="text-2xl font-bold text-gray-900">&lt;2s</div>
              <div className="text-xs text-gray-600 mt-1">Response Time</div>
            </motion.div>

            {/* Subtle glow effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-purple-500/5 rounded-3xl blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
