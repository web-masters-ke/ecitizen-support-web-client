import Link from 'next/link'
import { Shield, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
                <Shield className="h-4 w-4" />
              </div>
              <p className="font-bold text-sm text-white">eCitizen Command Centre</p>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              The Government of Kenya&apos;s official support platform for eCitizen digital services — serving citizens across all 47 counties.
            </p>
            <div className="space-y-1.5 pt-1">
              <a href="tel:+254800221000" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors">
                <Phone className="h-3.5 w-3.5" /> 0800 221 000 (Toll Free)
              </a>
              <a href="mailto:support@ecitizen.go.ke" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors">
                <Mail className="h-3.5 w-3.5" /> support@ecitizen.go.ke
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Support</p>
            <ul className="space-y-2">
              {[
                { href: '/tickets/new', label: 'Submit a Request' },
                { href: '/track', label: 'Track My Ticket' },
                { href: '/knowledge-base', label: 'Help Centre' },
                { href: '/contact', label: 'Contact Us' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-zinc-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Legal</p>
            <ul className="space-y-2">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Use' },
                { href: '/accessibility', label: 'Accessibility' },
                { href: '/about', label: 'About' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-zinc-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🇰🇪</span>
            <p className="text-xs text-zinc-500" suppressHydrationWarning>
              &copy; {new Date().getFullYear()} Republic of Kenya &mdash; eCitizen Service Command Centre
            </p>
          </div>
          <p className="text-xs text-zinc-600">Data Protection Act 2019 Compliant</p>
        </div>
      </div>
    </footer>
  )
}
