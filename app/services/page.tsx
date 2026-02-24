'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, ExternalLink } from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const SERVICE_CATEGORIES = [
  {
    id: 'identity',
    name: 'Identity & Civil Registration',
    icon: '🪪',
    services: [
      'National ID Application',
      'Passport Application',
      'Birth Certificate',
      'Death Certificate',
      'Marriage Certificate',
    ],
  },
  {
    id: 'driving',
    name: 'Driving & Transport',
    icon: '🚗',
    services: [
      'Driving Licence',
      'Vehicle Registration',
      'PSV Licence',
      'NTSA Services',
      'Logbook Transfer',
    ],
  },
  {
    id: 'business',
    name: 'Business & Trade',
    icon: '🏢',
    services: [
      'Business Name Registration',
      'Company Registration',
      'KRA PIN',
      'VAT Registration',
      'Business Permit',
    ],
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    services: [
      'HELB Loan Application',
      'KNEC Results',
      'University Admission',
      'NHIF Student',
      'Teaching License',
    ],
  },
  {
    id: 'land',
    name: 'Land & Property',
    icon: '🏡',
    services: [
      'Land Search',
      'Title Deed',
      'Stamp Duty',
      'Land Rates',
      'Land Subdivision',
    ],
  },
  {
    id: 'health',
    name: 'Health',
    icon: '🏥',
    services: [
      'NHIF Registration',
      'NHIF Contribution',
      'Hospital Records',
      'Medical Certificate',
      'Health Facility Licence',
    ],
  },
  {
    id: 'courts',
    name: 'Courts & Legal',
    icon: '⚖️',
    services: [
      'Police Abstract',
      'Certificate of Good Conduct',
      'Court Records',
      'Bail Bond',
      'Legal Aid',
    ],
  },
  {
    id: 'county',
    name: 'County Services',
    icon: '🗺️',
    services: [
      'County Business Permit',
      'Building Approval',
      'Single Business Permit',
      'County Rates',
      'Waste Management',
    ],
  },
  {
    id: 'social',
    name: 'Social Services',
    icon: '🤝',
    services: [
      'NSSF Registration',
      'NSSF Contributions',
      'Social Welfare',
      'Bursary Application',
      'Disability Certificate',
    ],
  },
  {
    id: 'environment',
    name: 'Environment',
    icon: '🌿',
    services: [
      'NEMA Licence',
      'Environmental Impact Assessment',
      'Water Permit',
      'Forest Licence',
      'Wildlife Permit',
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    services: [
      'KRA Returns',
      'Customs Declaration',
      'Insurance Certificate',
      'Pension Records',
      'Tax Compliance',
    ],
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: '🌾',
    services: [
      'Vet Certificate',
      'Phytosanitary Certificate',
      'Fertilizer Permit',
      'Dairy Licence',
      'Coffee Licence',
    ],
  },
]

const TOTAL_SERVICES = SERVICE_CATEGORIES.reduce((sum, cat) => sum + cat.services.length, 0)

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function ServicesPage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return SERVICE_CATEGORIES

    return SERVICE_CATEGORIES.map((cat) => {
      const catMatches = cat.name.toLowerCase().includes(q)
      const matchedServices = cat.services.filter((s) =>
        s.toLowerCase().includes(q)
      )
      if (catMatches) return cat
      if (matchedServices.length > 0)
        return { ...cat, services: matchedServices }
      return null
    }).filter(Boolean) as typeof SERVICE_CATEGORIES
  }, [search])

  const visibleServiceCount = filtered.reduce(
    (sum, cat) => sum + cat.services.length,
    0
  )

  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
            Government Services
          </h1>
          <p className="text-green-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Access all {TOTAL_SERVICES}+ government services in one place.
            Search below or browse by category.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search services e.g. Passport, KRA PIN, NHIF…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-0 bg-white/10 backdrop-blur pl-12 pr-4 py-3.5 text-white placeholder:text-green-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
            />
          </div>
        </div>
      </section>

      {/* ── Results summary ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <p className="text-sm text-muted-foreground">
          {search.trim() ? (
            <>
              Showing{' '}
              <span className="font-semibold text-foreground">
                {visibleServiceCount}
              </span>{' '}
              service{visibleServiceCount !== 1 ? 's' : ''} across{' '}
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{' '}
              categor{filtered.length !== 1 ? 'ies' : 'y'} matching &ldquo;
              <span className="italic">{search.trim()}</span>&rdquo;
            </>
          ) : (
            <>
              Browsing all{' '}
              <span className="font-semibold text-foreground">
                {TOTAL_SERVICES}
              </span>{' '}
              services across{' '}
              <span className="font-semibold text-foreground">
                {SERVICE_CATEGORIES.length}
              </span>{' '}
              categories
            </>
          )}
        </p>
      </div>

      {/* ── Categories + service cards ────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-16 space-y-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-semibold text-foreground mb-1">
              No services found
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Try a different search term or browse all categories.
            </p>
            <button
              onClick={() => setSearch('')}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          filtered.map((category) => (
            <section key={category.id}>
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl leading-none" aria-hidden="true">
                  {category.icon}
                </span>
                <h2 className="text-xl font-bold text-foreground">
                  {category.name}
                </h2>
                <span className="ml-auto text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-0.5 font-medium">
                  {category.services.length} service
                  {category.services.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Service cards grid */}
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {category.services.map((service) => (
                  <div
                    key={service}
                    className="group relative flex flex-col justify-between bg-white dark:bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-green-200 dark:hover:border-green-800 transition-all duration-200"
                  >
                    <p className="text-sm font-medium text-foreground leading-snug mb-4">
                      {service}
                    </p>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors group-hover:gap-2"
                    >
                      Apply
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>

                    {/* External link hint */}
                    <ExternalLink className="absolute top-3 right-3 h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-green-400 transition-colors" />
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* ── CTA banner ────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/40 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Ready to get started?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Create a free eCitizen account to apply for services, track your
            requests and receive updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-sm"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Track a Request
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
