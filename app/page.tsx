'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  UserPlus,
  FileText,
  CheckCircle,
  ArrowRight,
  Clock,
  Lock,
  Headphones,
  Bell,
  BookOpen,
  Building2,
  Smartphone,
  Download,
  ChevronDown,
  MessageSquare,
  Users,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HomepageKBSection } from '@/components/sections/HomepageKBSection'

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description:
      'Register in under 2 minutes using your email address and National ID. Your account gives you access to the full Command Centre.',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Submit Your Request',
    description:
      'Raise a support ticket for any eCitizen service issue. Describe the problem, attach documents if needed, and submit.',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Get It Resolved',
    description:
      'A dedicated government support officer reviews your request. You receive real-time updates by SMS and email until it is fully resolved.',
  },
]

const news = [
  {
    tag: 'NTSA',
    title: 'Driving Licence Support Now Handled Within 24 Hours',
    date: 'April 2026',
    excerpt:
      'NTSA has committed to a 24-hour first-response SLA for all driving licence support tickets raised through the Command Centre.',
  },
  {
    tag: 'Update',
    title: 'Command Centre Now Available in Kiswahili',
    date: 'March 2026',
    excerpt:
      'Citizens can now raise and track support tickets in Kiswahili, making the Command Centre more accessible to every Kenyan.',
  },
  {
    tag: 'Civil Reg',
    title: 'Marriage Certificate Queries Now Routed to Civil Registration',
    date: 'February 2026',
    excerpt:
      'The Civil Registration Service is now fully integrated with the Command Centre — all marriage certificate delays are resolved here.',
  },
]

const faqs = [
  {
    question: 'What is the eCitizen Command Centre?',
    answer:
      'The eCitizen Command Centre is the Government of Kenya\'s official support and oversight platform for eCitizen digital services. When you encounter a problem with an eCitizen service — a delayed passport, a failed payment, a registration issue — you raise it here and a dedicated government support officer resolves it for you.',
  },
  {
    question: 'How do I create an account?',
    answer:
      "Click 'Submit a Request' above and fill in your name, email address, and account type. You'll receive a confirmation email. Registration takes under 2 minutes and is completely free.",
  },
  {
    question: 'Who handles my support request?',
    answer:
      'Your ticket is routed to the relevant government agency (e.g., Immigration for passport issues, NTSA for licence issues) and assigned to a qualified officer. You can see who is handling your request at all times.',
  },
  {
    question: 'How long does it take to resolve my issue?',
    answer:
      'Resolution times depend on the service and complexity. The Command Centre enforces strict SLA targets — most tickets receive a first response within 4 hours and are resolved within 48 hours. Critical issues are escalated automatically.',
  },
  {
    question: 'Is my personal information safe?',
    answer:
      'Yes. The Command Centre uses bank-grade encryption to protect all data. The platform complies with the Kenya Data Protection Act 2019. Your personal information is only shared with the assigned government agency handling your request.',
  },
  {
    question: 'Can I track my request on mobile?',
    answer:
      'Absolutely. The Command Centre is fully mobile-responsive and works in any browser. You can also download the Command Centre mobile app from Google Play or the Apple App Store.',
  },
]

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    // Validate the token before redirecting — avoids infinite /login loop on expired sessions
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => {
      if (r.ok) router.replace('/dashboard')
      else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('authUser')
      }
    }).catch(() => {})
  }, [router])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white">
        {/* Hero background — Nairobi skyline */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/nairobi-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm border border-white/15">
            <span className="text-base">🇰🇪</span>
            <span>Republic of Kenya — eCitizen Command Centre</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            eCitizen Command Centre
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Supporting the Government of Kenya&apos;s Digital Service Delivery.
            Raise a ticket, track your request, and get it resolved — all in one place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-[#1a6b3a] px-8 py-3.5 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <UserPlus className="h-5 w-5" />
              Submit a Request
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-8 py-3.5 text-base font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
            >
              Track Your Ticket
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { icon: Users, label: '14M+ Citizens', sub: 'Supported nationwide' },
              { icon: Building2, label: '47 Counties', sub: 'Full national coverage' },
              { icon: Clock, label: 'Under 48 Hours', sub: 'Average resolution time' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="h-6 w-6 text-white/70 mb-1" />
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-xs text-white/60">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How the Command Centre Works ───────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
              How the Command Centre Works
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-base">
              Three steps to getting your government service issue resolved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div
                key={number}
                className="relative flex flex-col items-center text-center bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                  {number}
                </div>
                <div className="mt-4 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Serving the Country ─────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Updates
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
                Serving the Country
              </h2>
              <p className="mt-2 text-muted-foreground text-base">
                Service improvements and announcements from the Command Centre.
              </p>
            </div>
            <Link
              href="/knowledge-base"
              className="inline-flex items-center gap-2 rounded-xl border border-primary text-primary px-5 py-2.5 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
            >
              <Bell className="h-4 w-4" />
              All Announcements
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map(({ tag, title, date, excerpt }) => (
              <Link
                key={title}
                href="/knowledge-base"
                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1">
                    {tag}
                  </span>
                  <span className="text-xs text-muted-foreground">{date}</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 leading-snug flex-1 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Knowledge Base ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Self-Service
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
                Guides &amp; Knowledge Base
              </h2>
              <p className="mt-2 text-muted-foreground text-base">
                Step-by-step guides for the most common service issues.
              </p>
            </div>
            <Link
              href="/knowledge-base"
              className="inline-flex items-center gap-2 rounded-xl border border-primary text-primary px-5 py-2.5 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
            >
              <BookOpen className="h-4 w-4" />
              View All Articles
            </Link>
          </div>

          <HomepageKBSection />
        </div>
      </section>

      {/* ── Command Centre on Your Phone ─────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                Mobile App
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">
                Command Centre on Your Phone
              </h2>
              <p className="mt-4 text-white/80 leading-relaxed max-w-lg text-base">
                Download the Command Centre mobile app. Raise tickets, track resolutions,
                receive push notifications, and communicate with your assigned officer —
                from wherever you are.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md">
                {[
                  'Submit support tickets on the go',
                  'Real-time push notifications',
                  'Chat with your support officer',
                  'Track ticket status and history',
                  'Secure login with biometrics',
                  'Works across all 47 counties',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle className="h-4 w-4 text-white/60 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-white text-[#1a6b3a] rounded-xl px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Download className="h-4 w-4" />
                  Google Play Store
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 border-2 border-white/40 bg-white/10 rounded-xl px-6 py-3 text-sm font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                >
                  <Smartphone className="h-4 w-4" />
                  Apple App Store
                </Link>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-96 bg-white/10 rounded-[2.5rem] border-2 border-white/20 backdrop-blur-sm flex flex-col overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center px-6 py-3 bg-white/5">
                  <span className="text-[10px] text-white/70">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 rounded-sm bg-white/50" />
                    <div className="w-1 h-1.5 rounded-sm bg-white/50" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg leading-tight">Command Centre</p>
                    <p className="text-white/60 text-xs">eCitizen Kenya</p>
                  </div>
                  <div className="w-full space-y-2 mt-2">
                    {[
                      { label: 'Passport Delay', status: 'In Progress' },
                      { label: 'KRA PIN Issue', status: 'Resolved' },
                      { label: 'NTSA Query', status: 'Open' },
                    ].map(({ label, status }) => (
                      <div
                        key={label}
                        className="w-full bg-white/10 rounded-lg px-3 py-2 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-3 w-3 text-white/60" />
                          <span className="text-white/80 text-xs">{label}</span>
                        </div>
                        <span className="text-[9px] text-white/50">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center pb-3">
                  <div className="w-20 h-1 rounded-full bg-white/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Help Centre
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-base">
              Everything you need to know about using the eCitizen Command Centre.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map(({ question, answer }) => (
              <details
                key={question}
                className="group bg-card border border-border rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-foreground text-base list-none select-none">
                  {question}
                  <ChevronDown className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-5 text-base text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {answer}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-muted-foreground mb-4">
              Need direct support?
            </p>
            <Link
              href="/tickets/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Headphones className="h-4 w-4" />
              Raise a Support Ticket
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-foreground dark:bg-card">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Shield className="h-4 w-4" />
            Trusted by 14 Million Kenyans
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-background dark:text-foreground mb-4">
            Ready to Raise Your Request?
          </h2>
          <p className="text-background/70 dark:text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Create your free Command Centre account and get your government service issue
            resolved by a dedicated support officer — within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-10 py-4 text-base font-semibold shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
            >
              <UserPlus className="h-5 w-5" />
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-background/20 dark:border-border text-background dark:text-foreground px-10 py-4 text-base font-semibold hover:bg-background/10 dark:hover:bg-muted transition-colors"
            >
              Sign In
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
