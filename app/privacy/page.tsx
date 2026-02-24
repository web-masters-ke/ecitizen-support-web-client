import Link from 'next/link'
import { Shield, ChevronRight } from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'

/* ─── Table of contents entries ─────────────────────────────────────────────── */

const TOC = [
  { id: 'information-we-collect',       label: '1. Information We Collect' },
  { id: 'how-we-use',                   label: '2. How We Use Your Information' },
  { id: 'legal-basis',                  label: '3. Legal Basis for Processing' },
  { id: 'data-sharing',                 label: '4. Data Sharing' },
  { id: 'data-retention',               label: '5. Data Retention' },
  { id: 'your-rights',                  label: '6. Your Rights' },
  { id: 'cookies',                      label: '7. Cookies' },
  { id: 'security',                     label: '8. Security' },
  { id: 'children',                     label: '9. Children' },
  { id: 'changes',                      label: '10. Changes to This Policy' },
  { id: 'contact',                      label: '11. Contact Us' },
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

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Government of Kenya
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Privacy Policy
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
            <span className="text-foreground font-medium">Privacy Policy</span>
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
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Article ── */}
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-muted-foreground prose-li:text-muted-foreground">

            {/* Introduction */}
            <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6 mb-8">
              <p className="text-sm text-green-900 dark:text-green-100 leading-relaxed">
                The Government of Kenya is committed to protecting the privacy and personal data of every citizen
                who uses the eCitizen digital services portal. This Privacy Policy explains how we collect, use,
                store, and safeguard your personal information in compliance with the{' '}
                <span className="font-semibold">Kenya Data Protection Act 2019</span> and all subsidiary
                regulations made thereunder. By using eCitizen, you acknowledge that you have read and understood
                this policy.
              </p>
            </div>

            {/* 1 */}
            <SectionHeading id="information-we-collect">1. Information We Collect</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              We collect personal information that is necessary to provide you with government services. The
              categories of information we collect include:
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Identity &amp; Contact Information</h3>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>National Identification Number (National ID or Passport Number)</li>
                  <li>Full legal name as it appears on government-issued identification</li>
                  <li>Email address and mobile phone number</li>
                  <li>Physical address and county of residence</li>
                  <li>Date of birth and gender</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Service &amp; Transaction Data</h3>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>History of government service applications submitted through eCitizen</li>
                  <li>Payment records, M-PESA transaction references, and fee receipts</li>
                  <li>Uploaded supporting documents (e.g., photographs, certificates)</li>
                  <li>Application status updates and correspondence records</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Technical &amp; Usage Data</h3>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>IP address and approximate geolocation derived from it</li>
                  <li>Browser type, version, and operating system</li>
                  <li>Pages visited, session duration, and navigation patterns</li>
                  <li>Device identifiers for mobile application users</li>
                </ul>
              </div>
            </div>

            {/* 2 */}
            <SectionHeading id="how-we-use">2. How We Use Your Information</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              Personal information collected through eCitizen is used exclusively for the following purposes:
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                'Processing your government service applications and issuing documents or permits.',
                'Verifying your identity against national databases to prevent fraud and impersonation.',
                'Sending transactional notifications such as application status updates, payment confirmations, and document readiness alerts via SMS and email.',
                'Improving the platform through aggregated, anonymised analytics to understand usage patterns and service bottlenecks.',
                'Complying with our legal and regulatory obligations as a government entity, including audit and record-keeping requirements.',
                'Detecting, investigating, and preventing fraudulent transactions and other illegal activities.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* 3 */}
            <SectionHeading id="legal-basis">3. Legal Basis for Processing</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              Under the Kenya Data Protection Act 2019, we process your personal data on the following lawful bases:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-green-50 dark:bg-green-900/20">
                    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Legal Basis</th>
                    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">When Applied</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ['Consent', 'When you voluntarily provide optional information (e.g., newsletter subscription preferences) or enable optional analytics cookies.'],
                    ['Contractual Necessity', 'To create and manage your eCitizen account and process the government services you have requested.'],
                    ['Legal Obligation', 'Where we are required by Kenyan law to collect, retain, or disclose personal data, including tax obligations and public records laws.'],
                    ['Public Interest', 'For tasks carried out in the exercise of official government functions, including identity verification and national statistics.'],
                  ].map(([basis, desc]) => (
                    <tr key={basis} className="even:bg-muted/30">
                      <td className="border border-border px-4 py-2 font-medium text-foreground align-top whitespace-nowrap">{basis}</td>
                      <td className="border border-border px-4 py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4 */}
            <SectionHeading id="data-sharing">4. Data Sharing</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal data to any third party under any circumstances. We may share your
              information only in the following limited circumstances:
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                'With the specific government agency or department responsible for processing your service request (e.g., sharing your data with NTSA when you apply for a driving licence).',
                'With courts, tribunals, law enforcement agencies, or regulatory bodies where we are legally compelled to do so by a court order, subpoena, or applicable law.',
                'With payment service providers (such as the Central Bank of Kenya-licensed payment processors) solely to facilitate transaction processing.',
                'With authorised data processors who act on our behalf under strict data processing agreements and are bound by the same data protection obligations.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* 5 */}
            <SectionHeading id="data-retention">5. Data Retention</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal data only for as long as is necessary for the purposes stated in this policy
              or as required by Kenyan law. Our retention schedule is as follows:
            </p>
            <div className="mt-4 space-y-3">
              {[
                {
                  category: 'Active Account Data',
                  period: 'Duration of account',
                  detail: 'Your profile information and linked documents are retained for as long as your eCitizen account remains active.',
                },
                {
                  category: 'Service Application Records',
                  period: '7 years',
                  detail: 'Records of all government service applications are retained for seven years in accordance with the Kenya Government Records Management Policy.',
                },
                {
                  category: 'Payment Transaction Records',
                  period: '7 years',
                  detail: 'Financial transaction records are retained for seven years as required by the Central Bank of Kenya regulations.',
                },
                {
                  category: 'System Audit Logs',
                  period: '5 years',
                  detail: 'Security and access audit logs are retained for five years to support cybersecurity investigations and compliance audits.',
                },
                {
                  category: 'Deleted Account Data',
                  period: '90 days',
                  detail: 'Upon account deletion, your data is anonymised within 90 days. Some records may be retained longer where legally required.',
                },
              ].map((item) => (
                <div key={item.category} className="rounded-lg border border-border bg-card px-4 py-3 flex flex-col sm:flex-row sm:items-start gap-2">
                  <div className="sm:w-56 shrink-0">
                    <p className="text-sm font-semibold text-foreground">{item.category}</p>
                    <span className="inline-block mt-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 font-medium">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>

            {/* 6 */}
            <SectionHeading id="your-rights">6. Your Rights Under the Kenya Data Protection Act</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              The Kenya Data Protection Act 2019 grants you the following rights with respect to your personal data.
              You can exercise any of these rights by contacting our Data Protection Officer (see Section 11).
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                { right: 'Right to Access', desc: 'Request a copy of the personal data we hold about you.' },
                { right: 'Right to Rectification', desc: 'Request correction of inaccurate or incomplete personal data.' },
                { right: 'Right to Erasure', desc: 'Request deletion of your data where there is no compelling reason for its continued processing.' },
                { right: 'Right to Object', desc: 'Object to the processing of your data for purposes based on public interest or legitimate interests.' },
                { right: 'Right to Portability', desc: 'Receive your data in a structured, machine-readable format and transfer it to another controller.' },
                { right: 'Right to Restrict Processing', desc: 'Request that we limit how we use your data while a complaint or query is being resolved.' },
              ].map((item) => (
                <div key={item.right} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">{item.right}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              To exercise your rights, contact the Data Protection Officer at{' '}
              <a href="mailto:dpo@ecitizen.go.ke" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                dpo@ecitizen.go.ke
              </a>
              . We will respond to your request within 21 days as required by the Act. If you are dissatisfied with our
              response, you have the right to lodge a complaint with the{' '}
              <span className="font-medium text-foreground">Office of the Data Protection Commissioner of Kenya</span>.
            </p>

            {/* 7 */}
            <SectionHeading id="cookies">7. Cookies</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              eCitizen uses cookies and similar technologies to ensure the platform functions correctly and to
              understand how citizens use our services. We use the following types of cookies:
            </p>
            <div className="mt-4 space-y-3">
              {[
                {
                  type: 'Strictly Necessary Cookies',
                  canOptOut: false,
                  desc: 'Session cookies required for authentication and to maintain your logged-in state. These cannot be disabled as the platform cannot function without them.',
                },
                {
                  type: 'Analytics Cookies',
                  canOptOut: true,
                  desc: 'Used to understand how citizens navigate the platform, identify popular services, and detect errors. Data is aggregated and anonymised. You can opt out via the Cookie Preferences link in the footer.',
                },
                {
                  type: 'Third-Party Tracking Cookies',
                  canOptOut: false,
                  desc: 'eCitizen does not use third-party advertising or tracking cookies. No citizen data is shared with advertising networks.',
                },
              ].map((item) => (
                <div key={item.type} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{item.type}</p>
                    {item.canOptOut ? (
                      <span className="text-xs rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 font-medium">Optional</span>
                    ) : (
                      <span className="text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 font-medium">Required</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* 8 */}
            <SectionHeading id="security">8. Security</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              The Government of Kenya takes the security of your personal data seriously. We implement a layered
              approach to security comprising:
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                'SSL/TLS encryption for all data in transit between your device and our servers.',
                'AES-256 encryption for all personally identifiable information stored in our databases.',
                'Data centres certified to ISO 27001 Information Security Management System standard.',
                'Regular independent security audits and penetration testing conducted at least annually.',
                'Multi-factor authentication (MFA) required for all administrative access to production systems.',
                'Role-based access controls ensuring staff can only access data necessary for their function.',
                'Automated intrusion detection systems with 24/7 security monitoring.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              In the event of a data breach that is likely to result in a high risk to your rights and freedoms,
              we will notify the Office of the Data Protection Commissioner within 72 hours and notify affected
              citizens without undue delay, as required by law.
            </p>

            {/* 9 */}
            <SectionHeading id="children">9. Children</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              eCitizen services are intended for persons aged 18 years and above. Minors under the age of 18 may
              not create an independent eCitizen account. However, a parent or legal guardian may apply for
              government services on behalf of a minor child — for example, applying for a child&apos;s birth
              certificate or minor&apos;s passport — provided the guardian is the registered account holder and
              provides the required parental or guardian consent documentation. In all such cases, it is the
              guardian&apos;s responsibility to ensure the accuracy of information submitted on behalf of the minor.
            </p>

            {/* 10 */}
            <SectionHeading id="changes">10. Changes to This Policy</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in law, technology, or our
              service offerings. For material changes that significantly affect your rights or how we use your data,
              we will provide at least 30 days&apos; prior notice by sending an email to the address registered on
              your eCitizen account. The updated policy will be published on this page with a revised &quot;Last
              updated&quot; date. We encourage you to review this policy periodically. Continued use of the platform
              after the effective date of changes constitutes your acceptance of the revised policy.
            </p>

            {/* 11 */}
            <SectionHeading id="contact">11. Contact Us</SectionHeading>
            <p className="text-muted-foreground leading-relaxed">
              For any questions, concerns, or requests relating to this Privacy Policy or your personal data,
              please contact our Data Protection Officer:
            </p>
            <div className="mt-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6 space-y-2 text-sm">
              <p className="font-semibold text-foreground text-base">Data Protection Officer</p>
              <p className="text-muted-foreground">ICT Authority of Kenya</p>
              <p className="text-muted-foreground">Telposta Towers, Kenyatta Avenue</p>
              <p className="text-muted-foreground">P.O. Box 27150 — 00100, Nairobi, Kenya</p>
              <div className="pt-2 border-t border-green-200 dark:border-green-800 space-y-1">
                <p>
                  <span className="font-medium text-foreground">Email: </span>
                  <a href="mailto:dpo@ecitizen.go.ke" className="text-green-600 dark:text-green-400 hover:underline">
                    dpo@ecitizen.go.ke
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
          </article>
        </div>
      </div>
    </PublicLayout>
  )
}
