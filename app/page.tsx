import Link from 'next/link'
import {
  Shield,
  UserPlus,
  FileText,
  CheckCircle,
  Globe,
  MapPin,
  Briefcase,
  Calculator,
  Heart,
  BookOpen,
  ArrowRight,
  Star,
  Clock,
  Lock,
  Headphones,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const services = [
  {
    icon: Shield,
    title: 'National ID & Identity',
    description: 'Apply for national ID, ID replacements, and identity verification services.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Globe,
    title: 'Passport & Travel',
    description: 'Apply for passports, travel documents, and visa support services.',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: MapPin,
    title: 'Land & Property',
    description: 'Land registration, title deeds, property transfers and searches.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: Briefcase,
    title: 'Business Registration',
    description: 'Register companies, partnerships, and get business permits online.',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: Calculator,
    title: 'Tax & Revenue',
    description: 'File tax returns, pay levies, and access KRA services seamlessly.',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  {
    icon: Heart,
    title: 'Health Services',
    description: 'NHIF registration, medical facility queries, and health certificate requests.',
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
  },
]

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Account',
    description: 'Register in under 2 minutes using your email and national ID details.',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Submit Request',
    description: 'Choose your service, fill in the required details, and submit your request.',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Track Progress',
    description: 'Receive real-time updates via SMS, email, or directly on the portal.',
  },
]

const kbArticles = [
  {
    id: '1',
    title: 'How to Apply for a National ID Card',
    excerpt: 'Learn the complete step-by-step process for applying for your Kenyan national identity card, including required documents and processing times.',
    category: 'Identity',
  },
  {
    id: '2',
    title: 'Passport Application Guide 2024',
    excerpt: 'Everything you need to know about applying for a Kenyan passport — from booking an appointment to collecting your document.',
    category: 'Travel',
  },
  {
    id: '3',
    title: 'Business Registration Process',
    excerpt: 'A comprehensive guide to registering your business in Kenya through the Business Registration Service (BRS) online portal.',
    category: 'Business',
  },
]

const stats = [
  { icon: Star, value: '10,000+', label: 'Tickets Resolved' },
  { icon: CheckCircle, value: '98%', label: 'Satisfaction Rate' },
  { icon: Briefcase, value: '47', label: 'Government Agencies' },
  { icon: Clock, value: '< 48hr', label: 'Average Resolution' },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(170,80%,18%)] via-[hsl(170,75%,24%)] to-[hsl(175,70%,30%)] text-white">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          {/* Kenya flag accent */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="text-base">🇰🇪</span>
            <span>Republic of Kenya — Official eCitizen Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Access Government Services{' '}
            <span className="text-white/80">with Ease</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Submit and track service requests across all government agencies — anytime, anywhere. Fast, secure, and free.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-[hsl(170,80%,22%)] px-8 py-3.5 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <UserPlus className="h-5 w-5" />
              Submit a Request
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-8 py-3.5 text-base font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
            >
              Track Your Request
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Mini stats bar */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: FileText, label: '50+ Services', sub: 'Available online' },
              { icon: Headphones, label: '24/7 Support', sub: 'Always here for you' },
              { icon: Clock, label: 'Fast Resolution', sub: 'Under 48 hours' },
              { icon: Lock, label: 'Secure Platform', sub: 'Bank-grade encryption' },
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

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Simple Process</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">How It Works</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Getting your government service has never been this easy. Three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />

            {steps.map(({ number, icon: Icon, title, description }) => (
              <div key={number} className="relative flex flex-col items-center text-center bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                  {number}
                </div>
                <div className="mt-4 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">What We Offer</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">Government Service Categories</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Browse services across all major government agencies in Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
                <Link
                  href="/register"
                  className={`inline-flex items-center gap-1 text-sm font-medium ${color} group-hover:gap-2 transition-all`}
                >
                  Browse Services <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Knowledge Base Preview ────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Self-Service</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">Find Answers Quickly</h2>
              <p className="mt-2 text-muted-foreground">Browse our knowledge base for guides and FAQs.</p>
            </div>
            <Link
              href="/knowledge-base"
              className="inline-flex items-center gap-2 rounded-xl border border-primary text-primary px-5 py-2.5 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
            >
              <BookOpen className="h-4 w-4" />
              View All Articles
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kbArticles.map(({ id, title, excerpt, category }) => (
              <div key={id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col">
                <span className="inline-flex w-fit rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1 mb-4">
                  {category}
                </span>
                <h3 className="text-base font-semibold text-foreground mb-2 leading-snug">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{excerpt}</p>
                <Link
                  href={`/knowledge-base/${id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                >
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <Icon className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold text-foreground">{value}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-foreground dark:bg-card">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-background dark:text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-background/70 dark:text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Create your free account in under 2 minutes and access government services from the comfort of your home.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-10 py-4 text-base font-semibold shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
          >
            <UserPlus className="h-5 w-5" />
            Create Free Account
          </Link>
          <p className="mt-4 text-sm text-background/50 dark:text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
