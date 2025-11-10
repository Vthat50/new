import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-gray-200 p-6 ${
        hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
