
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200'
          : 'bg-white/50 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
            Vevara
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Solutions
            </a>
            <a href="#dashboard" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Platform
            </a>
            <a href="#analytics" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Analytics
            </a>
            <a href="https://calendly.com/vedantagrawal752/vevara-introduction" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </a>
          </div>

          <Link to="/signin">
            <button className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md">
              Dashboard
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
