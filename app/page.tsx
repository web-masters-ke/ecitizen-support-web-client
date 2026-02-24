import Link from 'next/link'
import {
  Shield,
  UserPlus,
  FileText,
  CheckCircle,
  Globe,
  Briefcase,
  Calculator,
  Heart,
  BookOpen,
  ArrowRight,
  Star,
  Clock,
  Lock,
  Headphones,
  Car,
  GraduationCap,
  Fingerprint,
  Baby,
  Scale,
  Users,
  Building2,
  Smartphone,
  Download,
  Award,
  Leaf,
  Wifi,
  Home,
  ChevronDown,
  Bell,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const quickServices = [
  {
    icon: Shield,
    title: 'National ID',
    description: 'Apply or replace your National Identity Card',
    href: '/tickets/new',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Globe,
    title: 'Passport',
    description: 'New passport or renewal applications',
    href: '/tickets/new',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: Car,
    title: 'Driving Licence',
    description: 'Apply, renew or replace your driving licence',
    href: '/tickets/new',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: Briefcase,
    title: 'Business Registration',
    description: 'Register companies, partnerships and sole traders',
    href: '/tickets/new',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: Calculator,
    title: 'KRA PIN',
    description: 'Apply for or retrieve your KRA tax PIN',
    href: '/tickets/new',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  {
    icon: Heart,
    title: 'NHIF',
    description: 'Register and manage your health insurance cover',
    href: '/tickets/new',
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    icon: Fingerprint,
    title: 'Police Clearance',
    description: 'Certificate of good conduct from the DCI',
    href: '/tickets/new',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-900/20',
  },
  {
    icon: Baby,
    title: 'Birth Certificate',
    description: 'Apply for birth and death certificates online',
    href: '/tickets/new',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
]

const categories = [
  {
    icon: Shield,
    title: 'Identity & Civil Registration',
    description: 'National ID, birth, marriage, and death certificates.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    count: '12 services',
  },
  {
    icon: Globe,
    title: 'Passport & Immigration',
    description: 'Passports, visas, work permits, and travel documents.',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    count: '18 services',
  },
  {
    icon: Car,
    title: 'Transport & Vehicles',
    description: 'Driving licences, motor vehicle registration, NTSA services.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    count: '24 services',
  },
  {
    icon: Briefcase,
    title: 'Business & Investment',
    description: 'Company registration, permits, and investment incentives.',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    count: '21 services',
  },
  {
    icon: Calculator,
    title: 'Tax & Revenue',
    description: 'KRA PIN, tax returns, customs duties, and levies.',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    count: '15 services',
  },
  {
    icon: Heart,
    title: 'Health & Social Services',
    description: 'NHIF cover, NSSF, health certificates, and social welfare.',
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    count: '19 services',
  },
  {
    icon: GraduationCap,
    title: 'Education & Examinations',
    description: 'KNEC certificates, HELB loans, and academic transcripts.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    count: '11 services',
  },
  {
    icon: Home,
    title: 'Land & Housing',
    description: 'Land registration, title deeds, property searches, NLC.',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    count: '16 services',
  },
  {
    icon: Scale,
    title: 'Justice & Legal',
    description: 'Court filing fees, legal aid, DCI records, and police services.',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-900/20',
    count: '9 services',
  },
  {
    icon: Leaf,
    title: 'Environment & Natural Resources',
    description: 'NEMA permits, water rights, forestry, and mining licences.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    count: '14 services',
  },
  {
    icon: Wifi,
    title: 'Communications & Technology',
    description: 'CAK licences, frequency allocation, and digital services.',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    count: '8 services',
  },
  {
    icon: Building2,
    title: 'County Government Services',
    description: 'Single business permits, county rates, and local licences.',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    count: '47 counties',
  },
]

const agencies = [
  {
    acronym: 'NTSA',
    name: 'National Transport and Safety Authority',
    description: 'Driving licences, vehicle inspection, and road safety services.',
    icon: Car,
  },
  {
    acronym: 'KRA',
    name: 'Kenya Revenue Authority',
    description: 'Tax registration, returns filing, customs, and duty payments.',
    icon: Calculator,
  },
  {
    acronym: 'NHIF',
    name: 'National Hospital Insurance Fund',
    description: 'Health insurance registration, contributions, and claims.',
    icon: Heart,
  },
  {
    acronym: 'NSSF',
    name: 'National Social Security Fund',
    description: 'Social security contributions, benefits, and retirement savings.',
    icon: Users,
  },
  {
    acronym: 'NRB',
    name: 'National Registration Bureau',
    description: 'National Identity Cards, alien registration, and ID verification.',
    icon: Shield,
  },
  {
    acronym: 'Immigration',
    name: 'Department of Immigration Services',
    description: 'Passports, visas, work permits, and residency documents.',
    icon: Globe,
  },
  {
    acronym: 'KNEC',
    name: 'Kenya National Examinations Council',
    description: 'Examination certificates, result verification, and transcripts.',
    icon: GraduationCap,
  },
  {
    acronym: 'HELB',
    name: 'Higher Education Loans Board',
    description: 'Student loan applications, repayment management, and clearances.',
    icon: BookOpen,
  },
  {
    acronym: 'Judiciary',
    name: 'Judiciary of Kenya',
    description: 'Court filing fees, case tracking, and legal aid services.',
    icon: Scale,
  },
  {
    acronym: 'DCI',
    name: 'Directorate of Criminal Investigations',
    description: 'Certificate of good conduct and criminal record searches.',
    icon: Fingerprint,
  },
  {
    acronym: 'BRS',
    name: 'Business Registration Service',
    description: 'Company, NGO, and society registration and compliance.',
    icon: Briefcase,
  },
  {
    acronym: 'NLC',
    name: 'National Land Commission',
    description: 'Land registration, title deeds, property searches, and transfers.',
    icon: Home,
  },
  {
    acronym: 'KEBS',
    name: 'Kenya Bureau of Standards',
    description: 'Product standards certification and quality assurance marks.',
    icon: Award,
  },
  {
    acronym: 'NEMA',
    name: 'National Environment Management Authority',
    description: 'Environmental impact assessments and waste management permits.',
    icon: Leaf,
  },
  {
    acronym: 'CAK',
    name: 'Communications Authority of Kenya',
    description: 'Telecommunications licences, frequency allocation, and cybersecurity.',
    icon: Wifi,
  },
  {
    acronym: 'PPB',
    name: 'Pharmacy and Poisons Board',
    description: 'Pharmacy licences, drug registration, and pharmaceutical services.',
    icon: Heart,
  },
]

const stats = [
  { icon: Users, value: '14M+', label: 'Registered Citizens' },
  { icon: CheckCircle, value: '5,000+', label: 'Services Available' },
  { icon: Building2, value: '47', label: 'Counties Served' },
  { icon: Star, value: '99.9%', label: 'Platform Uptime' },
]

const news = [
  {
    tag: 'NTSA',
    title: 'Driving Licence Renewal Now Available 24/7 Online',
    date: 'Jan 2026',
    excerpt:
      'NTSA has digitised the complete driving licence renewal process. Citizens can now renew at any time without visiting NTSA offices.',
  },
  {
    tag: 'Update',
    title: 'eCitizen Portal Now Available in Kiswahili',
    date: 'Dec 2025',
    excerpt:
      'The eCitizen portal now offers a full Kiswahili interface, making government services more accessible to every Kenyan.',
  },
  {
    tag: 'Civil Reg',
    title: 'Marriage Certificates Can Now Be Applied For Online',
    date: 'Nov 2025',
    excerpt:
      'The Civil Registration Service has integrated marriage certificate applications into eCitizen, eliminating manual visits.',
  },
]

const faqs = [
  {
    question: 'What is eCitizen Kenya?',
    answer:
      "eCitizen is the Government of Kenya's official online service portal that allows citizens and residents to access over 5,000 government services across all 47 counties. You can apply for, pay for, and track government services from any device, anytime.",
  },
  {
    question: 'How do I create an eCitizen account?',
    answer:
      "Click 'Get Started' above and fill in your name, email address, and National ID details. You'll receive a confirmation email to activate your account. Registration takes under 2 minutes and is completely free.",
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'eCitizen accepts M-Pesa, Airtel Money, credit and debit cards (Visa, Mastercard), and direct bank transfers. Most fees can be paid instantly via mobile money.',
  },
  {
    question: 'How long does it take to process requests?',
    answer:
      "Processing times vary by service. Simple requests like KRA PIN registration are instant. Passports typically take 10 working days, National IDs up to 20 days. You'll receive SMS and email updates at every stage.",
  },
  {
    question: 'Is my personal data secure on eCitizen?',
    answer:
      'Yes. eCitizen uses bank-grade 256-bit SSL encryption to protect all data. The platform is hosted on government-certified secure infrastructure and complies with the Kenya Data Protection Act 2019.',
  },
  {
    question: 'Can I access eCitizen on my mobile phone?',
    answer:
      'Absolutely. eCitizen is fully mobile-responsive and works on any smartphone browser. You can also download the official eCitizen mobile app from Google Play Store or Apple App Store for an optimised experience.',
  },
]

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Free Account',
    description: 'Register in under 2 minutes using your email and National ID details.',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Submit Your Request',
    description: 'Choose your service, fill in the required details, upload documents, and pay any fees.',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Track & Receive',
    description: "Get real-time SMS and email updates. Collect your document when it's ready.",
  },
]

const kbArticles = [
  {
    id: '1',
    title: 'How to Apply for a National ID Card',
    excerpt:
      'Step-by-step guide covering required documents, processing times, and how to check your application status.',
    category: 'Identity',
  },
  {
    id: '2',
    title: 'Passport Application Guide 2025',
    excerpt:
      'Everything you need — booking an appointment, required photos, fees, and collection procedure.',
    category: 'Travel',
  },
  {
    id: '3',
    title: 'Complete Guide to Business Registration in Kenya',
    excerpt:
      'How to register your company, partnership, or sole proprietorship through the BRS online portal.',
    category: 'Business',
  },
]

const counties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
  'Kiambu', 'Machakos', 'Kilifi', 'Nyeri', 'Meru', 'Kakamega',
  'Kitui', 'Garissa', 'Kisii', 'Migori', 'Homa Bay', 'Siaya',
  'Bomet', 'Kericho', 'Nandi', 'Uasin Gishu', 'Trans Nzoia', 'Bungoma',
  'Busia', 'Vihiga', 'Laikipia', 'Nyandarua', 'Kirinyaga', "Murang'a",
  'Embu', 'Tharaka', 'Isiolo', 'Marsabit', 'Wajir', 'Mandera',
  'Kwale', 'Taita Taveta', 'Tana River', 'Lamu', 'Kajiado', 'Narok',
  'Nyamira', 'West Pokot', 'Samburu', 'Elgeyo-Marakwet', 'Baringo',
]

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(170,80%,18%)] via-[hsl(170,75%,24%)] to-[hsl(175,70%,30%)] text-white">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/[0.03] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="text-base">🇰🇪</span>
            <span>Republic of Kenya — Official eCitizen Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Kenya&apos;s Digital Government{' '}
            <span className="text-white/80">Service Platform</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Access over 5,000 government services from all 47 counties and 50+ national agencies —
            anytime, anywhere. Fast, secure, and completely free.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-[hsl(170,80%,22%)] px-8 py-3.5 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <UserPlus className="h-5 w-5" />
              Get Started — Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-8 py-3.5 text-base font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
            >
              Track Your Request
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Users, label: '14M+ Citizens', sub: 'Registered nationwide' },
              { icon: Building2, label: '47 Counties', sub: 'Full national coverage' },
              { icon: Clock, label: '< 48hr', sub: 'Average resolution time' },
              { icon: Lock, label: 'Secure & Encrypted', sub: 'Bank-grade protection' },
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

      {/* ── Most Requested Services ─────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Popular Services
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
              Most Requested Services
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              The services Kenyans need most — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickServices.map(({ icon: Icon, title, description, href, color, bg }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col items-center text-center p-5 rounded-2xl bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-3`}
                >
                  <Icon className={`h-7 w-7 ${color}`} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed hidden sm:block">
                  {description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Simple Process
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
              How eCitizen Works
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Getting government services has never been this easy. Three simple steps.
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
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Categories ───────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              All Services
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
              Government Service Categories
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Browse all 12 service categories covering every aspect of life in Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map(({ icon: Icon, title, description, color, bg, count }) => (
              <Link
                key={title}
                href="/tickets/new"
                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{description}</p>
                <span className={`text-xs font-medium ${color}`}>{count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Government Agencies ─────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Partner Agencies
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
              Government Agencies on eCitizen
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              We integrate with 50+ national government agencies and all 47 county governments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agencies.map(({ acronym, name, description, icon: Icon }) => (
              <Link
                key={acronym}
                href="/tickets/new"
                className="group bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-primary leading-tight">{acronym}</p>
                </div>
                <p className="text-xs font-medium text-foreground mb-1 leading-snug">{name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/tickets/new"
              className="inline-flex items-center gap-2 rounded-xl border border-primary text-primary px-6 py-3 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Building2 className="h-4 w-4" />
              View All 50+ Agencies
            </Link>

          </div>
        </div>
      </section>

      {/* ── Impact Stats ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[hsl(170,80%,18%)] via-[hsl(170,75%,24%)] to-[hsl(175,70%,30%)] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              Our Impact
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">
              eCitizen Kenya by the Numbers
            </h2>
            <p className="mt-3 text-white/70 max-w-xl mx-auto">
              Trusted by millions of Kenyans across the nation every day.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-2">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <span className="text-4xl font-extrabold text-white">{value}</span>
                <span className="text-sm text-white/70">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── County Coverage ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="flex-1 lg:sticky lg:top-24">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                County Services
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
                Serving All 47 Counties
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
                From Mombasa to Mandera, Kisumu to Garissa — eCitizen delivers government services
                in every corner of Kenya. Apply for county services without ever leaving home.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2.5 max-w-sm">
                {[
                  'Single Business Permits',
                  'County Trade Licences',
                  'Land Rates Payment',
                  'Cess and County Levies',
                  'Public Health Certificates',
                  'County Housing Services',
                ].map((service) => (
                  <div key={service} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    {service}
                  </div>
                ))}
              </div>
              <Link
                href="/tickets/new"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Access County Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* County grid */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                {counties.map((county) => (
                  <Link
                    key={county}
                    href="/tickets/new"
                    className="rounded-lg bg-muted/50 border border-border px-2 py-2 text-center text-[11px] text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors leading-tight block"
                  >
                    {county}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── News & Updates ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Latest News
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
                Service Updates &amp; Announcements
              </h2>
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
                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col block"
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
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Self-Service
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
                Guides &amp; Knowledge Base
              </h2>
              <p className="mt-2 text-muted-foreground">
                Step-by-step guides for every service.
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kbArticles.map(({ id, title, excerpt, category }) => (
              <div
                key={id}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col"
              >
                <span className="inline-flex w-fit rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1 mb-4">
                  {category}
                </span>
                <h3 className="text-base font-semibold text-foreground mb-2 leading-snug">
                  {title}
                </h3>
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

      {/* ── Mobile App ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[hsl(170,80%,18%)] via-[hsl(170,75%,24%)] to-[hsl(175,70%,30%)] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                Mobile App
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">
                eCitizen on Your Phone
              </h2>
              <p className="mt-4 text-white/80 leading-relaxed max-w-lg">
                Download the official eCitizen Kenya mobile app. Access all government services,
                receive push notifications, make payments via M-Pesa, and carry your digital
                documents wherever you go.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md">
                {[
                  'Submit service requests on the go',
                  'M-Pesa & mobile money payments',
                  'Push notifications for updates',
                  'Digital document wallet',
                  'Biometric authentication',
                  'Works offline — syncs when connected',
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
                  className="inline-flex items-center gap-2 bg-white text-[hsl(170,80%,22%)] rounded-xl px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
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
                {/* Status bar */}
                <div className="flex justify-between items-center px-6 py-3 bg-white/5">
                  <span className="text-[10px] text-white/70">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 rounded-sm bg-white/50" />
                    <div className="w-1 h-1.5 rounded-sm bg-white/50" />
                  </div>
                </div>
                {/* App content */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg leading-tight">eCitizen</p>
                    <p className="text-white/60 text-xs">Republic of Kenya</p>
                  </div>
                  <div className="w-full space-y-2 mt-2">
                    {['National ID', 'Passport', 'KRA PIN'].map((s) => (
                      <div
                        key={s}
                        className="w-full bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-white/80 text-xs">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Home indicator */}
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
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about using eCitizen Kenya.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map(({ question, answer }) => (
              <details
                key={question}
                className="group bg-card border border-border rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-foreground text-sm list-none select-none">
                  {question}
                  <ChevronDown className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {answer}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-muted-foreground mb-4">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <Link
              href="/knowledge-base"
              className="inline-flex items-center gap-2 rounded-xl border border-primary text-primary px-6 py-3 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Headphones className="h-4 w-4" />
              Visit Full Help Centre
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
            Ready to Access Government Services?
          </h2>
          <p className="text-background/70 dark:text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Create your free eCitizen account in under 2 minutes and access over 5,000 government
            services from the comfort of your home.
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
          <p className="mt-6 text-sm text-background/50 dark:text-muted-foreground">
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
