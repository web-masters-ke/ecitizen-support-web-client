import Link from 'next/link'
import { Shield, Phone, Mail, MapPin, Globe } from 'lucide-react'

const popularServices = [
  { href: '/tickets/new', label: 'National ID Application' },
  { href: '/tickets/new', label: 'Passport Application' },
  { href: '/tickets/new', label: 'Driving Licence' },
  { href: '/tickets/new', label: 'Business Registration' },
  { href: '/tickets/new', label: 'KRA PIN' },
  { href: '/tickets/new', label: 'NHIF Registration' },
  { href: '/tickets/new', label: 'Police Clearance' },
  { href: '/tickets/new', label: 'Birth Certificate' },
]

const keyAgencies = [
  { href: '/tickets/new', label: 'NTSA' },
  { href: '/tickets/new', label: 'KRA' },
  { href: '/tickets/new', label: 'NHIF' },
  { href: '/tickets/new', label: 'NSSF' },
  { href: '/tickets/new', label: 'Immigration Dept' },
  { href: '/tickets/new', label: 'KNEC' },
  { href: '/tickets/new', label: 'HELB' },
  { href: '/tickets/new', label: 'DCI' },
]

const quickLinks = [
  { href: '/about', label: 'About eCitizen' },
  { href: '/services', label: 'All Services' },
  { href: '/knowledge-base', label: 'Help Centre' },
  { href: '/track', label: 'Track My Request' },
  { href: '/contact', label: 'Contact Us' },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/accessibility', label: 'Accessibility' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand — takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="font-bold text-base text-primary">eCitizen Kenya</p>
                <p className="text-[10px] text-muted-foreground leading-none">
                  Official Government Service Portal
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The Government of Kenya&apos;s official digital services portal — serving over 14
              million Kenyans across all 47 counties and 50+ national agencies.
            </p>

            {/* Contact info */}
            <div className="space-y-2 pt-1">
              <a
                href="tel:+254800221000"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                0800 221 000 (Toll Free)
              </a>
              <a
                href="mailto:support@ecitizen.go.ke"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                support@ecitizen.go.ke
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                Harambee House, Harambee Avenue, Nairobi, Kenya
              </div>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Popular Services</h3>
            <ul className="space-y-2.5">
              {popularServices.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Agencies */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Key Agencies</h3>
            <ul className="space-y-2.5">
              {keyAgencies.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links + Legal */}
          <div className="space-y-7">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2.5">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇰🇪</span>
            <p className="text-xs text-muted-foreground">
              &copy; 2026 Republic of Kenya &mdash; eCitizen Service Command Centre. All rights
              reserved.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Regulated by the ICT Authority of Kenya
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
