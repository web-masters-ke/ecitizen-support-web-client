import Link from 'next/link'
import { Eye, ChevronRight, CheckCircle, AlertTriangle, Monitor } from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'

/* ─── Table of contents entries ─────────────────────────────────────────────── */

const TOC = [
  { id: 'commitment',         label: 'Our Commitment' },
  { id: 'conformance',        label: 'Conformance Status' },
  { id: 'technical-specs',    label: 'Technical Specifications' },
  { id: 'limitations',        label: 'Known Limitations' },
  { id: 'assistive-tech',     label: 'Assistive Technologies' },
  { id: 'feedback',           label: 'Feedback &amp; Reporting' },
  { id: 'complaints',         label: 'Formal Complaints' },
  { id: 'assessment',         label: 'Assessment Approach' },
]

/* ─── Reusable section header ───────────────────────────────────────────────── */

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="flex items-center gap-3 text-xl font-bold text-foreground mt-12 mb-4 scroll-mt-24"
    >
      <span className="block h-6 w-1 rounded-full bg-green-600 dark:bg-green-400 shrink-0" />
      {children}
    </h2>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function AccessibilityPage() {
  return (
    <PublicLayout>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium mb-6">
            <Eye className="h-4 w-4" />
            Government of Kenya
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Accessibility Statement
          </h1>
          <p className="text-green-100 text-lg">
            Last updated: <span className="font-semibold text-white">January 2026</span>
          </p>
        </div>
      </section>

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">Accessibility Statement</span>
          </nav>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">

          {/* ── Sidebar ToC (sticky on desktop) ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                On This Page
              </p>
              <nav className="space-y-1">
                {TOC.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-colors"
                    dangerouslySetInnerHTML={{ __html: item.label }}
                  />
                ))}
              </nav>

              {/* Quick report card in sidebar */}
              <div className="mt-6 pt-5 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Report an Issue
                </p>
                <a
                  href="mailto:accessibility@ecitizen.go.ke"
                  className="block rounded-lg bg-green-600 text-white text-center text-sm font-medium px-3 py-2 hover:bg-green-700 transition-colors"
                >
                  accessibility@ecitizen.go.ke
                </a>
                <a
                  href="tel:0800221000"
                  className="block mt-2 rounded-lg border border-green-600 text-green-600 dark:text-green-400 dark:border-green-500 text-center text-sm font-medium px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  0800 221 000
                </a>
              </div>
            </div>
          </aside>

          {/* ── Article ── */}
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-muted-foreground prose-li:text-muted-foreground">

            {/* Commitment */}
            <SectionHeading id="commitment">Our Commitment</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              The Government of Kenya is committed to ensuring that the eCitizen digital services portal is
              accessible to all citizens, including people with disabilities. Access to government services is a
              fundamental right, and we believe that no citizen should be excluded from using public services
              due to a disability or impairment.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our accessibility efforts are aligned with the{' '}
              <span className="font-medium text-foreground">
                Web Content Accessibility Guidelines (WCAG) 2.1, Level AA
              </span>
              , published by the World Wide Web Consortium (W3C). We continuously work to improve the
              accessibility of eCitizen and welcome feedback from citizens with disabilities to help us
              identify and resolve barriers.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Target Standard', value: 'WCAG 2.1 AA' },
                { label: 'Last Audit', value: 'December 2025' },
                { label: 'Response Time', value: '5 Business Days' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 text-center">
                  <p className="text-lg font-bold text-green-700 dark:text-green-300">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Conformance */}
            <SectionHeading id="conformance">Conformance Status</SectionHeading>
            <div className="rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Partially Conformant</p>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                eCitizen is <span className="font-medium">partially conformant</span> with WCAG 2.1 Level AA.
                Partial conformance means that some parts of the content do not fully conform to the accessibility
                standard. We are actively working to address all identified gaps.
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The main areas where we currently meet or exceed WCAG 2.1 AA requirements include:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {[
                'Sufficient colour contrast ratios across all primary text and interactive elements (minimum 4.5:1 for normal text, 3:1 for large text).',
                'Text alternatives (alt attributes) for all meaningful images and icons throughout the platform.',
                'Logical heading hierarchy (H1–H6) used consistently across all pages for screen reader navigation.',
                'All interactive elements are reachable and operable via keyboard alone.',
                'Forms include visible labels, error messages, and descriptive ARIA attributes for all input fields.',
                'Focus indicators are visible on all interactive elements for keyboard-only users.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* Technical Specs */}
            <SectionHeading id="technical-specs">Technical Specifications</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              The eCitizen platform is built using modern web standards that support accessibility:
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                { title: 'HTML5', desc: 'Semantic HTML5 markup is used throughout the platform to convey the meaning and structure of content to assistive technologies.' },
                { title: 'WAI-ARIA', desc: 'Accessible Rich Internet Applications (WAI-ARIA) attributes are applied to dynamic content and custom interface components to communicate state and role information to screen readers.' },
                { title: 'CSS3', desc: 'Responsive CSS3 layouts ensure the interface adapts correctly to different screen sizes, zoom levels, and viewport configurations without loss of functionality.' },
                { title: 'Next.js / React', desc: 'The platform uses Next.js with server-side rendering, ensuring content is accessible even before JavaScript executes — important for users of older assistive technologies.' },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Monitor className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The platform has been tested with the following screen reader and browser combinations:
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-green-50 dark:bg-green-900/20">
                    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Screen Reader</th>
                    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Browser</th>
                    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Platform</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ['NVDA', 'Google Chrome', 'Windows'],
                    ['JAWS', 'Microsoft Edge', 'Windows'],
                    ['VoiceOver', 'Safari', 'macOS / iOS'],
                    ['TalkBack', 'Chrome', 'Android'],
                  ].map(([sr, browser, platform]) => (
                    <tr key={sr} className="even:bg-muted/30">
                      <td className="border border-border px-4 py-2 font-medium text-foreground">{sr}</td>
                      <td className="border border-border px-4 py-2">{browser}</td>
                      <td className="border border-border px-4 py-2">{platform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Known Limitations */}
            <SectionHeading id="limitations">Known Limitations</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              Despite our efforts, some content on eCitizen has known accessibility limitations. We are actively
              working to address all of the following issues. Where a reasonable alternative is not yet available,
              citizens may contact our accessibility support line for assistance.
            </p>
            <div className="mt-4 space-y-3">
              {[
                {
                  title: 'Legacy PDF Forms',
                  status: 'In Progress',
                  desc: 'Some older government forms available for download are PDFs generated by third-party agencies and may not be fully tagged for screen reader accessibility. We are working with the respective agencies to replace these with accessible versions.',
                  eta: 'Q2 2026',
                },
                {
                  title: 'Knowledge Base Video Content',
                  status: 'In Progress',
                  desc: 'Video tutorials in our Knowledge Base may not have full closed captions or audio descriptions. Automatic captions have been enabled as an interim measure. Human-reviewed captions are being added progressively.',
                  eta: 'Q1 2026',
                },
                {
                  title: 'Complex Data Tables in Reports',
                  status: 'Planned',
                  desc: 'Some dynamically generated application status tables in the citizen dashboard may not include proper table headers and summary attributes for screen reader users.',
                  eta: 'Q3 2026',
                },
                {
                  title: 'Third-Party Payment Widget',
                  status: 'Under Review',
                  desc: 'The embedded payment processing widget is provided by a third-party payment processor. We are engaging the provider to ensure WCAG AA compliance. As an alternative, citizens may use the USSD payment option via *XXX#.',
                  eta: 'TBC',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <span className="text-xs rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 font-medium">
                      {item.status}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">Target: {item.eta}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Assistive Technologies */}
            <SectionHeading id="assistive-tech">Assistive Technologies Supported</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              eCitizen is designed to work with a wide range of assistive technologies. We officially support
              and test against:
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                {
                  category: 'Screen Readers',
                  items: ['JAWS (Windows)', 'NVDA (Windows, free)', 'VoiceOver (macOS, iOS)', 'TalkBack (Android)'],
                },
                {
                  category: 'Keyboard Navigation',
                  items: [
                    'Full keyboard operability without a mouse',
                    'Logical, predictable tab order throughout all pages',
                    'Keyboard shortcuts for common actions',
                    'Skip navigation link to bypass repetitive headers',
                  ],
                },
                {
                  category: 'Display Adaptations',
                  items: [
                    'High contrast mode (Windows/macOS system setting)',
                    'Forced colours mode (Windows)',
                    'Text resize up to 200% without horizontal scrolling',
                    'Dark mode supported natively',
                  ],
                },
                {
                  category: 'Motor Accessibility',
                  items: [
                    'Switch access compatible interface',
                    'Large click/tap target areas (minimum 44×44px)',
                    'No time limits on form sessions (configurable)',
                    'No flashing content that could trigger seizures',
                  ],
                },
              ].map((group) => (
                <div key={group.category} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">{group.category}</p>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <SectionHeading id="feedback">Feedback &amp; Reporting Barriers</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              We welcome feedback from citizens who encounter accessibility barriers when using eCitizen. Your
              reports help us continuously improve the platform and ensure no citizen is excluded from accessing
              government services.
            </p>
            <div className="mt-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6">
              <p className="text-sm font-semibold text-foreground mb-4">How to Report an Accessibility Issue</p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold shrink-0">1</span>
                  <span>Describe the accessibility barrier you encountered, including the page or feature affected.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold shrink-0">2</span>
                  <span>Include the assistive technology and browser or app you were using when the issue occurred.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold shrink-0">3</span>
                  <span>Send your report to us via any of the contact channels below.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold shrink-0">4</span>
                  <span>We aim to acknowledge all reports within 2 business days and resolve or provide a workaround within 5 business days.</span>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-green-200 dark:border-green-800 grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Email</p>
                  <a href="mailto:accessibility@ecitizen.go.ke" className="text-sm text-green-600 dark:text-green-400 hover:underline font-medium">
                    accessibility@ecitizen.go.ke
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Toll-Free Phone</p>
                  <a href="tel:0800221000" className="text-sm text-green-600 dark:text-green-400 hover:underline font-medium">
                    0800 221 000
                  </a>
                  <p className="text-xs text-muted-foreground">Monday–Friday, 8 AM–5 PM EAT</p>
                </div>
              </div>
            </div>

            {/* Formal Complaints */}
            <SectionHeading id="complaints">Formal Complaints</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              If you have reported an accessibility barrier to us and are not satisfied with our response, or
              if you believe we have not addressed your concern within a reasonable time, you may escalate your
              complaint to:
            </p>
            <div className="mt-4 rounded-xl border border-border bg-card p-6 space-y-2 text-sm">
              <p className="font-semibold text-foreground text-base">ICT Authority of Kenya</p>
              <p className="text-muted-foreground">Attn: Digital Accessibility Compliance</p>
              <p className="text-muted-foreground">Telposta Towers, Kenyatta Avenue</p>
              <p className="text-muted-foreground">P.O. Box 27150 — 00100, Nairobi, Kenya</p>
              <div className="pt-2 border-t border-border">
                <p>
                  <span className="font-medium text-foreground">Website: </span>
                  <a href="https://www.ict.go.ke" className="text-green-600 dark:text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    www.ict.go.ke
                  </a>
                </p>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed text-sm">
              Citizens may also seek recourse through the{' '}
              <span className="font-medium text-foreground">Kenya National Commission on Human Rights (KNCHR)</span>{' '}
              if they believe their right of access to government services has been infringed due to an
              unresolved accessibility barrier.
            </p>

            {/* Assessment */}
            <SectionHeading id="assessment">Assessment Approach</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              The Government of Kenya assesses the accessibility of eCitizen through the following ongoing
              activities:
            </p>
            <div className="mt-4 space-y-3">
              {[
                {
                  title: 'Self-Evaluation',
                  desc: 'Our internal development and quality assurance teams conduct regular accessibility reviews as part of the software development lifecycle. All new features are tested against WCAG 2.1 AA criteria before release.',
                },
                {
                  title: 'Third-Party Audit',
                  desc: 'An independent accessibility audit was conducted in December 2025 by a certified accessibility specialist. The audit covered a representative sample of all major user journeys on the platform.',
                },
                {
                  title: 'User Testing',
                  desc: 'We periodically invite citizens with disabilities to participate in user testing sessions to provide direct feedback on the accessibility of the platform from a real-world usage perspective.',
                },
                {
                  title: 'Automated Scanning',
                  desc: 'Automated accessibility scanning tools are integrated into our CI/CD pipeline to catch regressions and common issues with every code deployment.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Related links */}
            <div className="mt-10 rounded-xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground mb-3">Related Policies</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  Privacy Policy
                </Link>
                <span className="text-border">|</span>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </PublicLayout>
  )
}
