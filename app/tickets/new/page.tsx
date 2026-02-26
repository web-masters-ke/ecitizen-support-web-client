'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { CitizenLayout } from '@/components/layout/CitizenLayout'
import { ticketsApi, agenciesApi } from '@/lib/api'

interface Agency {
  id: string
  agencyName: string
}

interface Category {
  id: string
  name: string
}

interface Priority {
  id: string
  name: string
  severityScore: number
}

export default function NewTicketPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefilledSubject = searchParams.get('subject') ?? ''

  const [agencies, setAgencies] = useState<Agency[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [loadingAgencies, setLoadingAgencies] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(false)

  const [form, setForm] = useState({
    subject: prefilledSubject,
    agencyId: '',
    categoryId: '',
    priorityId: '',
    description: '',
    tags: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ ticketNumber: string; ticketId: string } | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login?redirect=/tickets/new')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return
    // Load agencies and priorities in parallel
    agenciesApi
      .list()
      .then((res) => {
        const d = res.data.data
        setAgencies(Array.isArray(d) ? d : (d?.items ?? []))
      })
      .catch(() => {})
      .finally(() => setLoadingAgencies(false))

    ticketsApi
      .priorities()
      .then((res) => {
        const d = res.data.data
        const list: Priority[] = Array.isArray(d) ? d : (d?.items ?? [])
        // Sort by severity so LOW→CRITICAL
        list.sort((a, b) => a.severityScore - b.severityScore)
        setPriorities(list)
        // Default to MEDIUM
        const medium = list.find((p) => p.name === 'MEDIUM')
        if (medium) setForm((prev) => ({ ...prev, priorityId: medium.id }))
      })
      .catch(() => {})
  }, [isAuthenticated])

  // Fetch categories when agency changes
  useEffect(() => {
    if (!form.agencyId) {
      setCategories([])
      return
    }
    setLoadingCategories(true)
    ticketsApi
      .categories({ agencyId: form.agencyId })
      .then((res) => {
        const d = res.data.data
        setCategories(Array.isArray(d) ? d : (d?.items ?? []))
      })
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false))
  }, [form.agencyId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.description.length < 20) {
      setError('Description must be at least 20 characters.')
      return
    }
    setSubmitting(true)
    try {
      const payload: Record<string, unknown> = {
        subject: form.subject,
        agencyId: form.agencyId,
        description: form.description,
        channel: 'WEB',
      }
      if (form.priorityId) payload.priorityId = form.priorityId
      if (form.categoryId) payload.categoryId = form.categoryId
      if (form.tags) {
        payload.tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      }
      const res = await ticketsApi.create(payload)
      const ticket = res.data.data
      setSuccess({
        ticketNumber: ticket.ticketNumber ?? ticket.id,
        ticketId: ticket.id,
      })
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string | string[]; error?: { message?: string | string[] } } } })?.response?.data
      const raw = data?.error?.message ?? data?.message
      const msg = Array.isArray(raw) ? raw.join(', ') : raw
      setError(msg || 'Failed to submit request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !isAuthenticated) return null

  if (success) {
    return (
      <CitizenLayout>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="rounded-2xl border border-border bg-card shadow-sm px-8 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Request Submitted!</h2>
            <p className="text-muted-foreground mb-2">
              Your ticket has been successfully submitted and is being processed.
            </p>
            <p className="text-sm font-medium text-foreground mb-6">
              Ticket Number:{' '}
              <span className="font-mono text-primary">{success.ticketNumber}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/tickets/${success.ticketId}`}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <FileText className="h-4 w-4" />
                View Ticket
              </Link>
              <button
                onClick={() => {
                  setSuccess(null)
                  const medium = priorities.find((p) => p.name === 'MEDIUM')
                  setForm({ subject: '', agencyId: '', categoryId: '', priorityId: medium?.id ?? '', description: '', tags: '' })
                }}
                className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </CitizenLayout>
    )
  }

  return (
    <CitizenLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/tickets"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <nav className="text-xs text-muted-foreground mb-1">
              <Link href="/tickets" className="hover:text-foreground">My Tickets</Link>
              <span className="mx-1.5">/</span>
              <span>New Request</span>
            </nav>
            <h1 className="text-2xl font-bold text-foreground">Submit New Service Request</h1>
          </div>
        </div>

        {/* Contact details hint */}
        {user && (!(user as any).phoneNumber || !(user as any).nationalId) && (
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              Your profile is missing{[!(user as any).phoneNumber && 'phone number', !(user as any).nationalId && 'national ID'].filter(Boolean).join(' and ')}.{' '}
              <Link href="/profile" className="font-semibold underline underline-offset-2">Update profile</Link> to help the agency contact you.
            </span>
          </div>
        )}

        {/* Form card */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Subject <span className="text-destructive">*</span>
              </label>
              <input
                name="subject"
                type="text"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder="Brief description of your request"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Agency */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Government Agency <span className="text-destructive">*</span>
              </label>
              <select
                name="agencyId"
                required
                value={form.agencyId}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">
                  {loadingAgencies ? 'Loading agencies…' : 'Select agency'}
                </option>
                {agencies.map((a) => (
                  <option key={a.id} value={a.id}>{a.agencyName}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            {form.agencyId && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Category <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  disabled={loadingCategories}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  <option value="">
                    {loadingCategories ? 'Loading categories…' : 'Select category (optional)'}
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Priority <span className="text-destructive">*</span>
              </label>
              <select
                name="priorityId"
                value={form.priorityId}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {priorities.length === 0 && <option value="">Loading priorities…</option>}
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.charAt(0) + p.name.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={5}
                value={form.description}
                onChange={handleChange}
                placeholder="Provide as much detail as possible about your request (minimum 20 characters)…"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {form.description.length} characters {form.description.length < 20 && <span className="text-destructive">(min 20)</span>}
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Tags <span className="text-muted-foreground text-xs">(optional, comma-separated)</span>
              </label>
              <input
                name="tags"
                type="text"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. urgent, renewal, ID"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
              <Link
                href="/tickets"
                className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </CitizenLayout>
  )
}
