'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Phone,
  Mail,
  MapPin,
  Twitter,
  Facebook,
  AlertTriangle,
  BookOpen,
  Clock,
  CheckCircle,
  Send,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface FormState {
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
}

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

const SUBJECT_OPTIONS = [
  { value: '', label: 'Select a subject…' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'account', label: 'Account Issues' },
  { value: 'complaint', label: 'Service Complaint' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
]

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormState>>({})

  /* ── Validation ── */
  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required'
    if (!form.email.trim()) {
      next.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email address'
    }
    if (!form.subject) next.subject = 'Please select a subject'
    if (!form.message.trim()) next.message = 'Message is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Simulate a 1-second API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  function handleReset() {
    setForm(INITIAL_FORM)
    setErrors({})
    setSubmitted(false)
  }

  /* ── Shared input class ── */
  const inputCls = (field: keyof FormState) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
      errors[field]
        ? 'border-red-400 dark:border-red-500'
        : 'border-border focus:border-green-500'
    }`

  return (
    <PublicLayout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white py-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Contact Us</h1>
        <p className="text-xl text-green-100">We&rsquo;re here to help</p>
      </section>

      {/* ── Two-column body ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-background">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12">

          {/* ─── LEFT: Contact information ───────────────────────────────── */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Get in Touch</h2>
              <p className="text-muted-foreground text-sm">
                Reach us through any of the channels below. Our support team is ready to assist.
              </p>
            </div>

            {/* Toll-free helpline */}
            <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4 hover:border-green-300 dark:hover:border-green-700 transition-colors">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-0.5">Toll-Free Helpline</p>
                <a
                  href="tel:0800221000"
                  className="text-lg font-bold text-green-600 dark:text-green-400 hover:underline"
                >
                  0800 221 000
                </a>
                <p className="text-xs text-muted-foreground mt-0.5">Monday – Friday, 8:00 AM – 5:00 PM EAT</p>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4 hover:border-green-300 dark:hover:border-green-700 transition-colors">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-0.5">Email Support</p>
                <a
                  href="mailto:support@ecitizen.go.ke"
                  className="text-green-600 dark:text-green-400 hover:underline font-medium text-sm"
                >
                  support@ecitizen.go.ke
                </a>
                <p className="text-xs text-muted-foreground mt-0.5">We aim to respond within 1 business day</p>
              </div>
            </div>

            {/* Physical address */}
            <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4 hover:border-green-300 dark:hover:border-green-700 transition-colors">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-0.5">Physical Address</p>
                <p className="text-sm text-foreground font-medium">Harambee House</p>
                <p className="text-xs text-muted-foreground">Harambee Avenue, Nairobi, Kenya</p>
              </div>
            </div>

            {/* Social media */}
            <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4 hover:border-green-300 dark:hover:border-green-700 transition-colors">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                <Twitter className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-2">Social Media</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://twitter.com/eCitizenKenya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-3 py-1.5 text-xs font-medium hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors"
                  >
                    <Twitter className="h-3.5 w-3.5" />
                    @eCitizenKenya
                  </a>
                  <a
                    href="https://facebook.com/eCitizenKenya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    <Facebook className="h-3.5 w-3.5" />
                    /eCitizenKenya
                  </a>
                </div>
              </div>
            </div>

            {/* Emergency escalation */}
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-1">Emergency Escalation</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For urgent matters that cannot wait, please contact your{' '}
                  <span className="font-medium text-foreground">
                    County Director of e-Government Services
                  </span>{' '}
                  at your nearest County Headquarters.
                </p>
              </div>
            </div>

            {/* Office hours */}
            <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 p-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-1">Office Hours</p>
                <p className="text-sm text-foreground font-medium">Monday – Friday</p>
                <p className="text-sm text-muted-foreground">8:00 AM – 5:00 PM (East Africa Time)</p>
                <p className="text-xs text-muted-foreground mt-1">Closed on Public Holidays</p>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Contact form ──────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            {submitted ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center justify-center h-full min-h-[420px] text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Message Sent Successfully</h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-8">
                  Thank you for reaching out. Our support team will review your message and respond
                  within 1 business day at the email address you provided.
                </p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-lg border border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 px-5 py-2.5 text-sm font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <>
                <h2 className="text-xl font-bold text-foreground mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Jane Wanjiru Mwangi"
                      value={form.fullName}
                      onChange={handleChange}
                      className={inputCls('fullName')}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className={inputCls('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                      Phone Number <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+254 7XX XXX XXX"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputCls('phone')}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={inputCls('subject')}
                    >
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Describe your inquiry in detail…"
                      value={form.message}
                      onChange={handleChange}
                      className={`${inputCls('message')} resize-none`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 text-white px-6 py-3 text-sm font-semibold hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ quick link ───────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-green-50 dark:bg-green-900/10 border-t border-border">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-5">
            <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Looking for Quick Answers?</h2>
          <p className="text-muted-foreground mb-6">
            Before contacting us, check our Knowledge Base — most common questions are already
            answered there with step-by-step guides.
          </p>
          <Link
            href="/knowledge-base"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-6 py-3 text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            Visit our Knowledge Base
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
