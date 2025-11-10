import React from 'react'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color?: string
}

export default function FeatureCard({ icon: Icon, title, description, color = 'primary' }: FeatureCardProps) {
  return (
    <div className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      <div className={`w-12 h-12 bg-${color}/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
