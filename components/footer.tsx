import Link from 'next/link'
import { Instagram, Mail, Phone } from 'lucide-react'
import { contactEmail, contactPhone, contactPhoneDisplay, instagramUrl, companyName } from '@/lib/contact'

export function Footer() {
  return (
    <footer className="bg-linear-to-b from-gray-900 to-black text-white pt-10 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 items-center justify-center">
          {/* Brand */}
          <div>
            <Link href="/">
              <img src="/images/LOGO.png" alt={companyName} className="w-28 h-28 rounded-full cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Curating extraordinary journeys for explorers who demand more. Every adventure is a story waiting to unfold.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary transition-colors flex items-center justify-center">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/trips" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  All Trips
                </Link>
              </li>

              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  About Wanderphilia
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/why-us" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Why Wanderphilia
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary mt-0.5 shrink-0" />
                <a href={`mailto:${contactEmail}`} className="text-gray-400 hover:text-primary transition-colors text-sm">
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary mt-0.5 shrink-0" />
                <a href={`tel:${contactPhone}`} className="text-gray-400 hover:text-primary transition-colors text-sm">
                  {contactPhoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Instagram size={18} className="text-primary mt-0.5 shrink-0" />
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Follow us on Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2026 {companyName}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Facebook
              </a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
