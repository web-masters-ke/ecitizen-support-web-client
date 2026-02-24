import Link from 'next/link'
import { Scale, ChevronRight } from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'

/* ─── Table of contents entries ─────────────────────────────────────────────── */

const TOC = [
  { id: 'acceptance',         label: '1. Acceptance of Terms' },
  { id: 'eligibility',        label: '2. Eligibility' },
  { id: 'account',            label: '3. Account Registration' },
  { id: 'permitted-use',      label: '4. Permitted Use' },
  { id: 'fees',               label: '5. Service Fees &amp; Payments' },
  { id: 'ip',                 label: '6. Intellectual Property' },
  { id: 'liability',          label: '7. Limitation of Liability' },
  { id: 'termination',        label: '8. Termination' },
  { id: 'governing-law',      label: '9. Governing Law' },
  { id: 'changes',            label: '10. Changes to Terms' },
  { id: 'contact',            label: '11. Contact' },
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

export default function TermsOfServicePage() {
  return (
    <PublicLayout>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium mb-6">
            <Scale className="h-4 w-4" />
            Government of Kenya
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Terms of Service
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
            <span className="text-foreground font-medium">Terms of Service</span>
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
                Table of Contents
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
            </div>
          </aside>

          {/* ── Article ── */}
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-muted-foreground prose-li:text-muted-foreground">

            {/* Introduction banner */}
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 mb-8">
              <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                Please read these Terms of Service carefully before using the eCitizen portal. These terms
                constitute a legally binding agreement between you and the Government of Kenya. If you do not
                agree to these terms, you must not use the platform.
              </p>
            </div>

            {/* 1 */}
            <SectionHeading id="acceptance">1. Acceptance of Terms</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the eCitizen Kenya digital services portal (the &quot;Platform&quot;),
              including through our website at{' '}
              <span className="font-medium text-foreground">ecitizen.go.ke</span> or our official mobile
              applications, you confirm that you have read, understood, and agree to be bound by these Terms of
              Service and our{' '}
              <Link href="/privacy" className="text-green-600 dark:text-green-400 hover:underline">
                Privacy Policy
              </Link>
              , which is incorporated herein by reference. These terms apply to all visitors, registered users,
              and any other persons who access or use the Platform.
            </p>

            {/* 2 */}
            <SectionHeading id="eligibility">2. Eligibility</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              To register for and use eCitizen you must satisfy all of the following eligibility requirements:
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                'You must be at least 18 years of age, or be acting as a duly authorised parent or legal guardian applying on behalf of a minor. Where a guardian is acting on behalf of a minor, the guardian assumes full responsibility for all submissions made.',
                'You must be a Kenyan citizen, lawful permanent resident, or a business entity duly registered under the Laws of Kenya and holding a valid registration number.',
                'You must have the legal capacity to enter into binding contracts under Kenyan law.',
                'You must not have been previously suspended or banned from the Platform for violation of these Terms.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* 3 */}
            <SectionHeading id="account">3. Account Registration</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              To access most government services on the Platform, you must register for an eCitizen account.
              When registering, you agree to:
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                'Provide accurate, current, and complete information during the registration process. Providing false information, including a false National ID number, is a criminal offence under the National Registration Act and related laws.',
                'Maintain only one account per citizen, linked to your valid National Identification Number (National ID card or Kenyan passport). Creating multiple accounts for the same individual is prohibited.',
                'Keep your account credentials strictly confidential. You are solely responsible for all activity that occurs under your account, whether or not authorised by you.',
                'Notify us immediately at support@ecitizen.go.ke if you suspect any unauthorised access to or use of your account.',
                'Keep your registered email address and phone number up to date to receive important service notifications.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* 4 */}
            <SectionHeading id="permitted-use">4. Permitted Use</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              You may use eCitizen only for lawful purposes in accordance with these Terms. The following
              activities are expressly permitted:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground mb-6">
              {[
                'Applying for and accessing government services that you are legally entitled to as a citizen, resident, or registered business.',
                'Tracking the status of your applications and downloading documents issued to you.',
                'Making authorised fee payments for government services.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              The following activities are strictly prohibited and may result in immediate account termination
              and criminal prosecution:
            </p>
            <div className="mt-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  'Submitting fraudulent, forged, or misleading documents or information in support of any service application.',
                  'Impersonating another person, citizen, official, or government agency.',
                  'Using automated scripts, bots, crawlers, or scraping tools to access, harvest, or index content from the Platform.',
                  'Attempting to gain unauthorised access to any part of the Platform, its servers, or connected government databases.',
                  'Engaging in any activity that disrupts or interferes with the proper functioning of the Platform.',
                  'Reselling, brokering, or charging third parties to submit applications on their behalf without official authorisation.',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-red-500 shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5 */}
            <SectionHeading id="fees">5. Service Fees &amp; Payments</SectionHeading>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Certain government services accessible through eCitizen require the payment of statutory fees set
                by the respective government agencies. The following applies to all fee payments:
              </p>
              {[
                { title: 'Fee Schedule', desc: 'All applicable fees are set by the respective government ministry, department, or agency in accordance with applicable legislation. eCitizen displays the current fees as provided to us by each agency.' },
                { title: 'Platform Fees', desc: 'The eCitizen platform does not charge any additional platform, convenience, or subscription fees. You pay only the statutory government fee for the service requested.' },
                { title: 'Payment Methods', desc: 'Payments may be made via M-PESA (Paybill), Visa, Mastercard, or other methods enabled on the platform. All transactions are processed by licensed payment service providers.' },
                { title: 'Refund Policy', desc: 'Refund eligibility and procedures are governed by the policy of the relevant government agency. eCitizen will assist in facilitating refund requests but the decision rests with the agency.' },
                { title: 'Payment Receipts', desc: 'A digital receipt is generated for every completed payment. You should retain this receipt as proof of payment for the duration of your application.' },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-card p-4">
                  <p className="font-semibold text-foreground mb-1">{item.title}</p>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* 6 */}
            <SectionHeading id="ip">6. Intellectual Property</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              All content on the eCitizen Platform, including but not limited to text, graphics, logos, icons,
              images, data compilations, software, and the overall design and presentation (&quot;Platform
              Content&quot;), is the property of the Government of Kenya and is protected by the laws of Kenya,
              including the Copyright Act (Cap. 130, Laws of Kenya) and applicable international treaties.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              You may not reproduce, distribute, publicly display, modify, transmit, or create derivative works
              from any Platform Content without the express written permission of the Government of Kenya or the
              relevant agency. Downloading official documents issued to you personally (such as a licence or
              certificate) for personal use is permitted.
            </p>

            {/* 7 */}
            <SectionHeading id="liability">7. Limitation of Liability</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by applicable Kenyan law, the Government of Kenya and the ICT
              Authority of Kenya disclaim all liability for the following:
            </p>
            <div className="mt-4 space-y-3">
              {[
                { title: 'Agency Processing Delays', desc: 'eCitizen is a technology platform. We are not responsible for delays by individual government agencies in processing service applications or issuing documents. Processing timelines are determined by each agency.' },
                { title: 'Service Availability', desc: 'The Platform is provided on a best-effort basis. We strive for 99.9% uptime but do not warrant uninterrupted or error-free availability. Scheduled maintenance will be announced in advance.' },
                { title: 'Third-Party Failures', desc: 'We are not liable for failures or interruptions in third-party services such as telecommunications networks, M-PESA, or other payment providers that may affect your ability to access services.' },
                { title: 'Consequential Losses', desc: 'We shall not be liable for any indirect, incidental, special, or consequential losses arising from your use of or inability to use the Platform, including loss of data or business opportunities.' },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* 8 */}
            <SectionHeading id="termination">8. Termination</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or permanently terminate your access to eCitizen in the following
              circumstances:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {[
                'Detection of fraudulent activity, including submission of forged documents or misrepresentation of identity.',
                'Material violation of any provision of these Terms of Service.',
                'Receipt of a valid court order directing the suspension or closure of your account.',
                'National security concerns escalated by a competent authority.',
                'Non-payment of fees owed to any government agency through the Platform.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              You may voluntarily close your eCitizen account at any time by accessing the account settings and
              selecting &quot;Delete Account&quot;. Closure of your account does not remove records of government
              service applications or transactions, which are retained per our data retention policy.
            </p>

            {/* 9 */}
            <SectionHeading id="governing-law">9. Governing Law &amp; Dispute Resolution</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service are governed by and construed in accordance with the laws of the Republic
              of Kenya, without regard to its conflict of law provisions. Any dispute arising out of or in
              connection with these Terms — including any question regarding their existence, validity, or
              termination — shall be subject to the exclusive jurisdiction of the courts of the Republic of
              Kenya. The parties agree to attempt to resolve any dispute through good-faith negotiation before
              initiating formal legal proceedings.
            </p>

            {/* 10 */}
            <SectionHeading id="changes">10. Changes to Terms</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to amend these Terms of Service at any time. For changes that materially
              affect your rights or obligations, we will provide at least 30 days&apos; prior notice by sending
              an email to your registered address and by displaying a prominent notice on the Platform. Minor
              changes (such as typographical corrections or clarifications that do not affect your rights) may
              be made without prior notice. The revised Terms will be published on this page with an updated
              &quot;Last updated&quot; date. Your continued use of the Platform after the effective date of any
              changes constitutes your acceptance of the revised Terms.
            </p>

            {/* 11 */}
            <SectionHeading id="contact">11. Contact</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, wish to report a violation, or require
              legal correspondence, please contact:
            </p>
            <div className="mt-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6 space-y-2 text-sm">
              <p className="font-semibold text-foreground text-base">Legal Services</p>
              <p className="text-muted-foreground">ICT Authority of Kenya</p>
              <p className="text-muted-foreground">Telposta Towers, Kenyatta Avenue</p>
              <p className="text-muted-foreground">P.O. Box 27150 — 00100, Nairobi, Kenya</p>
              <div className="pt-2 border-t border-green-200 dark:border-green-800 space-y-1">
                <p>
                  <span className="font-medium text-foreground">Email: </span>
                  <a href="mailto:legal@ecitizen.go.ke" className="text-green-600 dark:text-green-400 hover:underline">
                    legal@ecitizen.go.ke
                  </a>
                </p>
                <p>
                  <span className="font-medium text-foreground">Toll-Free: </span>
                  <a href="tel:0800221000" className="text-green-600 dark:text-green-400 hover:underline">
                    0800 221 000
                  </a>
                </p>
              </div>
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
                  href="/accessibility"
                  className="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  Accessibility Statement
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </PublicLayout>
  )
}
