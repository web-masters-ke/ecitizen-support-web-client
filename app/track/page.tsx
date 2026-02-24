'use client'
import { useState, FormEvent } from 'react'
import Link from 'next/link'
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import apiClient from '@/lib/api'
import { formatDate, statusStr } from '@/lib/utils'

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface TrackedTicket {
  id: string
  ticketNumber: string
  subject: string
  status: string
  createdAt: string
  updatedAt: string
  agency?: { agencyName: string }
}

/* ─── Status config ─────────────────────────────────────────────────────────── */

type StatusKey = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'ESCALATED'

const STATUS_CONFIG: Record<
  StatusKey,
  {
    label: string
    badgeClass: string
    icon: React.ElementType
    iconClass: string
  }
> = {
  OPEN: {
    label: 'Open',
    badgeClass:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    icon: AlertCircle,
    iconClass: 'text-blue-500',
  },
  ASSIGNED: {
    label: 'Assigned',
    badgeClass:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Clock,
    iconClass: 'text-amber-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    badgeClass:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    icon: RefreshCw,
    iconClass: 'text-purple-500',
  },
  RESOLVED: {
    label: 'Resolved',
    badgeClass:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle,
    iconClass: 'text-green-500',
  },
  CLOSED: {
    label: 'Closed',
    badgeClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    icon: XCircle,
    iconClass: 'text-gray-400',
  },
  ESCALATED: {
    label: 'Escalated',
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    icon: AlertCircle,
    iconClass: 'text-red-500',
  },
}

function getStatusConfig(status: unknown) {
  const s = statusStr(status)
  return (
    STATUS_CONFIG[s as StatusKey] ?? {
      label: s.replace('_', ' '),
      badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      icon: Clock,
      iconClass: 'text-gray-400',
    }
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function TrackPage() {
  const [ref, setRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState<TrackedTicket | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = ref.trim().toUpperCase()
    if (!trimmed) return

    setLoading(true)
    setTicket(null)
    setNotFound(false)
    setError('')

    try {
      const res = await apiClient.get('/tickets', {
        params: { ticketNumber: trimmed },
      })

      // The API wraps data: the result may be paginated or a single item
      const payload = res.data?.data
      let found: TrackedTicket | null = null

      if (Array.isArray(payload)) {
        found = payload[0] ?? null
      } else if (payload?.items) {
        found = payload.items[0] ?? null
      } else if (payload?.tickets) {
        found = payload.tickets[0] ?? null
      } else if (payload?.id) {
        // Direct ticket object
        found = payload as TrackedTicket
      }

      if (found) {
        setTicket(found)
      } else {
        setNotFound(true)
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number } }
      if (axiosErr?.response?.status === 404) {
        setNotFound(true)
      } else {
        setError('Something went wrong. Please try again in a moment.')
      }
    } finally {
      setLoading(false)
    }
  }

  const statusCfg = ticket ? getStatusConfig(ticket.status) : null
  const StatusIcon = statusCfg?.icon ?? Clock

  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/10 mb-4">
            <Search className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
            Track Your Request
          </h1>
          <p className="text-green-100 text-sm sm:text-base max-w-md mx-auto">
            Enter your ticket reference number to check the latest status of
            your service request.
          </p>
        </div>
      </section>

      {/* ── Lookup form ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 pb-4">
        <div className="rounded-2xl border border-border bg-card shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="ref"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Ticket Reference Number
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground pointer-events-none h-4 w-4" />
                <input
                  id="ref"
                  type="text"
                  placeholder="e.g. TKT-A1B2C3D4"
                  value={ref}
                  onChange={(e) => {
                    setRef(e.target.value)
                    setTicket(null)
                    setNotFound(false)
                    setError('')
                  }}
                  className="flex h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono tracking-wider uppercase"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Your reference number was sent to your email when you submitted
                the request.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !ref.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Track Request
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── Results area ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pb-16 space-y-4">

        {/* General error */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Not found */}
        {notFound && (
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <XCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-semibold text-foreground mb-1">
              No ticket found
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              We could not find a ticket matching{' '}
              <span className="font-mono font-medium">
                &ldquo;{ref.trim().toUpperCase()}&rdquo;
              </span>
              . Please double-check the reference number and try again.
            </p>
            <button
              onClick={() => { setRef(''); setNotFound(false) }}
              className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              Clear and try again
            </button>
          </div>
        )}

        {/* Ticket status card */}
        {ticket && statusCfg && (
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Status bar */}
            <div
              className={`px-6 py-3 flex items-center gap-2 ${
                statusStr(ticket.status) === 'RESOLVED'
                  ? 'bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800'
                  : statusStr(ticket.status) === 'ESCALATED'
                  ? 'bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800'
                  : statusStr(ticket.status) === 'CLOSED'
                  ? 'bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-700'
                  : 'bg-muted/50 border-b border-border'
              }`}
            >
              <StatusIcon className={`h-5 w-5 flex-shrink-0 ${statusCfg.iconClass}`} />
              <span className="text-sm font-medium text-foreground">
                Status:
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusCfg.badgeClass}`}
              >
                {statusCfg.label}
              </span>
            </div>

            {/* Details */}
            <div className="px-6 py-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Ticket Number" value={ticket.ticketNumber} mono />
                <DetailRow
                  label="Agency"
                  value={ticket.agency?.agencyName ?? 'Not assigned'}
                />
                <DetailRow
                  label="Submitted On"
                  value={formatDate(ticket.createdAt)}
                />
                <DetailRow
                  label="Last Updated"
                  value={formatDate(ticket.updatedAt)}
                />
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Subject
                </p>
                <p className="text-sm text-foreground font-medium leading-relaxed">
                  {ticket.subject}
                </p>
              </div>

              {/* Action links */}
              <div className="border-t border-border pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors flex-1 sm:flex-none"
                >
                  Login to View Full Details
                </Link>
                <button
                  onClick={() => { setTicket(null); setRef('') }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors flex-1 sm:flex-none"
                >
                  Track Another Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Don't have a reference section ──────────────────────────── */}
        {!ticket && !loading && (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 mt-6">
            <p className="text-sm font-semibold text-foreground mb-2">
              Don&apos;t have a reference number?
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              You receive a ticket reference number by email once you submit a
              service request. If you haven&apos;t submitted a request yet, you
              can create one below.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
              >
                Create an Account
              </Link>
              <Link
                href="/tickets/new"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Submit a New Request
              </Link>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}

/* ─── Helper ────────────────────────────────────────────────────────────────── */

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p
        className={`text-sm text-foreground font-medium ${
          mono ? 'font-mono tracking-wider' : ''
        }`}
      >
        {value}
      </p>
    </div>
  )
}
