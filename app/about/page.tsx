import Link from 'next/link'
import {
  Shield,
  Users,
  Globe,
  Clock,
  Smartphone,
  Headphones,
  Cpu,
  CheckCircle,
  MapPin,
  ArrowRight,
  Building2,
  TrendingUp,
  Lock,
} from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const stats = [
  { label: 'Registered Citizens', value: '14M+' },
  { label: 'Services Available', value: '5,000+' },
  { label: 'Counties Served', value: '47' },
  { label: 'Platform Uptime', value: '99.9%' },
]

const timeline = [
  {
    year: '2014',
    title: 'Platform Launch',
    desc: 'eCitizen officially launched by the Government of Kenya, offering the first batch of digital government services.',
  },
  {
    year: '2016',
    title: 'Mobile App Released',
    desc: 'The eCitizen mobile application launched on Android and iOS, bringing government services to citizens\' pockets.',
  },
  {
    year: '2018',
    title: '50+ Agencies Integrated',
    desc: 'Major expansion milestone reached as over 50 government agencies joined the unified platform.',
  },
  {
    year: '2020',
    title: 'COVID-19 Digital Push',
    desc: 'Rapid expansion of digital services during the pandemic ensured citizens could access critical services safely from home.',
  },
  {
    year: '2022',
    title: '10 Million Users Milestone',
    desc: 'The platform crossed 10 million registered users, cementing its position as Africa\'s leading e-government portal.',
  },
  {
    year: '2024',
    title: 'Next-Generation Platform',
    desc: 'Launch of AI-powered support, enhanced mobile experience, and deeper integration across all 47 county governments.',
  },
]

const features = [
  {
    icon: Lock,
    title: 'Secure Authentication',
    desc: 'Multi-factor authentication and end-to-end encryption protect every citizen\'s data and transactions.',
  },
  {
    icon: Building2,
    title: 'Multi-Agency Integration',
    desc: 'Seamless access to 60+ government agencies through a single, unified login — no more agency-hopping.',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Tracking',
    desc: 'Track the status of every application and service request in real time with automated status notifications.',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    desc: 'Fully responsive web and dedicated mobile apps ensure a flawless experience on any device, anywhere.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    desc: 'Government services are available around the clock — apply at midnight or dawn, whenever it suits you.',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Support',
    desc: 'An intelligent assistant guides citizens through complex service requirements and answers queries instantly.',
  },
]

const partners = [
  {
    abbr: 'NTSA',
    name: 'National Transport & Safety Authority',
    desc: 'Driving licences, vehicle registration & transport permits',
  },
  {
    abbr: 'KRA',
    name: 'Kenya Revenue Authority',
    desc: 'Tax PIN, iTax filings & customs services',
  },
  {
    abbr: 'NRB',
    name: 'National Registration Bureau',
    desc: 'National ID cards & civil registration services',
  },
  {
    abbr: 'Immigration',
    name: 'Department of Immigration Services',
    desc: 'Passports, visas & work permits',
  },
  {
    abbr: 'KNEC',
    name: 'Kenya National Examinations Council',
    desc: 'Examination results, certificates & transcripts',
  },
  {
    abbr: 'HELB',
    name: 'Higher Education Loans Board',
    desc: 'Student loan applications & repayment management',
  },
  {
    abbr: 'Judiciary',
    name: 'Judiciary of Kenya',
    desc: 'Court services, case tracking & legal documents',
  },
  {
    abbr: 'DCI',
    name: 'Directorate of Criminal Investigations',
    desc: 'Certificate of Good Conduct & police clearance',
  },
]

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Government of Kenya
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            About eCitizen Kenya
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Transforming Government Service Delivery
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-green-50 dark:bg-green-900/10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <Globe className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Provide a unified digital platform for Kenyan citizens to access all government services
            seamlessly, reducing bureaucracy, saving time, and improving transparency across all
            levels of government. We believe every Kenyan deserves efficient, dignified, and
            equitable access to public services — regardless of where they live.
          </p>
        </div>
      </section>

      {/* ── What is eCitizen ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-background">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">What is eCitizen?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Launched in 2014 by the Government of Kenya under the Ministry of ICT, eCitizen
              consolidates services from 60+ government agencies into one unified portal.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Citizens can apply for National IDs, passports, business permits, land searches,
              court services, and much more — entirely online, without visiting physical offices.
              The platform eliminates queues, reduces processing times, and brings the full power
              of the Kenyan government to your fingertips.
            </p>
            <ul className="space-y-3">
              {[
                'Single sign-on for all government services',
                'Secure online payments via M-PESA and cards',
                'Real-time document processing and delivery',
                'Available in English and Kiswahili',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual block */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">eCitizen Portal</p>
                <p className="text-xs text-muted-foreground">ecitizen.go.ke</p>
              </div>
            </div>
            <div className="space-y-3">
              {['Identity Services', 'Business Permits', 'Land Registry', 'Tax Services', 'Immigration', 'Education'].map((svc, i) => (
                <div
                  key={svc}
                  className="flex items-center justify-between rounded-lg bg-white dark:bg-card px-4 py-3 border border-border shadow-sm"
                >
                  <span className="text-sm font-medium text-foreground">{svc}</span>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {i % 2 === 0 ? 'Online' : 'Available'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-green-50 dark:bg-green-900/10">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Journey</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-green-200 dark:bg-green-800 -translate-x-px" />
            <div className="space-y-10">
              {timeline.map((item, idx) => (
                <div
                  key={item.year}
                  className={`relative flex gap-6 md:gap-0 ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`md:w-[calc(50%-2rem)] pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400 mb-1">
                      {item.year}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Dot — absolute on mobile, absolute in the middle on desktop */}
                  <div className="absolute left-6 md:left-1/2 top-1.5 w-4 h-4 rounded-full bg-green-600 border-2 border-white dark:border-background shadow -translate-x-1/2" />

                  {/* Spacer for the other side on desktop */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Features ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-background">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">Key Features</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Built with citizens at the centre, eCitizen combines security, speed, and simplicity
            into one world-class government services platform.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20 mb-4">
                  <f.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Government Partners ──────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-green-50 dark:bg-green-900/10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">
            Government Partners
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            eCitizen integrates with 60+ agencies. Here are key partners powering citizen services.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {partners.map((p) => (
              <div
                key={p.abbr}
                className="rounded-xl border border-green-200 dark:border-green-800 bg-white dark:bg-card p-5 text-center hover:border-green-400 dark:hover:border-green-600 hover:shadow-md transition-all"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white font-bold text-sm">
                  {p.abbr.slice(0, 4)}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-background">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Leadership &amp; Governance</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-foreground">Government of Kenya</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                eCitizen is operated by the Government of Kenya under the{' '}
                <span className="font-medium text-foreground">
                  Ministry of Information, Communications and the Digital Economy
                </span>
                , responsible for overall policy direction and strategic oversight of the platform.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-foreground">ICT Authority of Kenya</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In partnership with the{' '}
                <span className="font-medium text-foreground">ICT Authority of Kenya</span>, the
                platform is technically managed, maintained, and continuously improved to meet the
                evolving needs of Kenyan citizens and government agencies.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6 flex items-start gap-4">
            <MapPin className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground text-sm mb-1">Official Headquarters</p>
              <p className="text-sm text-muted-foreground">
                Telposta Towers, Kenyatta Avenue, Nairobi, Kenya. P.O. Box 30025 — 00100 Nairobi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
          <p className="text-green-100 mb-8 text-lg">
            Join over 14 million Kenyans who already enjoy fast, secure, and convenient access to
            government services — all from one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white text-green-700 px-6 py-3 font-semibold hover:bg-green-50 transition-colors"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 text-white px-6 py-3 font-semibold hover:bg-white/20 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
