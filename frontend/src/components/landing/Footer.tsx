import { Shield, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">Vevara</div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Voice AI technology that bridges pharmaceutical support and patient care.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900 text-sm">Solutions</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Patient Adherence</a></li>
              <li><a href="#dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">Program Enrollment</a></li>
              <li><a href="#analytics" className="text-gray-600 hover:text-gray-900 transition-colors">Safety Monitoring</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">CRM Integration</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900 text-sm">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Resources</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900 text-sm">Trust & Security</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-600">
                <Shield className="w-4 h-4 text-success" />
                HIPAA Compliant
              </li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Security Overview</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2025 Vevara. All rights reserved. | Built to support patient journeys.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-gray-900 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              (123) 456-7890
            </a>
            <a href="mailto:hello@vevara.com" className="flex items-center gap-2 hover:text-gray-900 transition-colors">
              <Mail className="w-3.5 h-3.5" />
              hello@vevara.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
