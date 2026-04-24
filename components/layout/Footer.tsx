import Link from 'next/link'
import { Shield, Phone, Mail, MapPin } from 'lucide-react'

const supportLinks = [
  { href: '/tickets/new', label: 'Submit a Request' },
  { href: '/track', label: 'Track My Ticket' },
  { href: '/knowledge-base', label: 'Help Centre' },
  { href: '/contact', label: 'Contact Us' },
]

const platformLinks = [
  { href: '/about', label: 'About the Command Centre' },
  { href: '/dashboard', label: 'My Dashboard' },
  { href: '/tickets', label: 'My Tickets' },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand — takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="font-bold text-base text-primary">eCitizen Command Centre</p>
                <p className="text-[10px] text-muted-foreground leading-none">
                  Supporting Kenya&apos;s Digital Service Delivery
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The eCitizen Command Centre is the Government of Kenya&apos;s official support
              and oversight platform for eCitizen digital services — serving citizens
              across all 47 counties.
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

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
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

          {/* Platform + Legal */}
          <div className="space-y-7">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-2.5">
                {platformLinks.map((link) => (
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
              &copy; {new Date().getFullYear()} Republic of Kenya &mdash; eCitizen Service Command Centre. All rights reserved.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Data Protection Act 2019 Compliant
          </p>
        </div>
      </div>
    </footer>
  )
}
