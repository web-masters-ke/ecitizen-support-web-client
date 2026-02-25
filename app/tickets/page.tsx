'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Search,
  Eye,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { CitizenLayout } from '@/components/layout/CitizenLayout'
import { ticketsApi } from '@/lib/api'
import { getStatusColor, getPriorityColor, formatDate, statusStr } from '@/lib/utils'

interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  agency?: { agencyName: string }
  status: unknown  // API returns {id, name, isClosedStatus}
  priority: unknown // API returns {id, name, severityScore}
  createdAt: string
  updatedAt: string
}

const STATUS_OPTIONS = ['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED']
const PRIORITY_OPTIONS = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export default function TicketsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  const fetchTickets = useCallback(async () => {
    setFetching(true)
    setError('')
    try {
      const params: Record<string, string | number> = { page, limit: 10 }
      if (search) params.search = search
      if (statusFilter !== 'ALL') params.status = statusFilter
      if (priorityFilter !== 'ALL') params.priority = priorityFilter

      const res = await ticketsApi.list(params)
      const payload = res.data.data
      if (Array.isArray(payload)) {
        setTickets(payload)
        setTotalPages(1)
      } else {
        setTickets(payload?.items ?? payload?.tickets ?? [])
        setTotalPages(payload?.meta?.totalPages ?? payload?.totalPages ?? 1)
      }
    } catch {
      setError('Failed to load tickets. Please try again.')
    } finally {
      setFetching(false)
    }
  }, [page, search, statusFilter, priorityFilter])

  useEffect(() => {
    if (!isAuthenticated) return
    fetchTickets()
  }, [isAuthenticated, fetchTickets])

  const priorityBadgeColor = (p: string) => {
    const map: Record<string, string> = {
      CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      LOW: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    }
    return map[p] ?? 'bg-gray-100 text-gray-600'
  }

  if (loading || !isAuthenticated) return null

  return (
    <CitizenLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Service Requests</h1>
            <p className="text-sm text-muted-foreground mt-0.5">View and manage all your submitted requests</p>
          </div>
          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Submit New Request
          </Link>
        </div>

        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by ticket number or subject…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="flex h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}</option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setPage(1) }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p === 'ALL' ? 'All Priorities' : p}</option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Tickets table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {fetching ? (
            <div className="space-y-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-20 rounded bg-muted animate-pulse hidden sm:block" />
                  <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
                  <div className="h-6 w-16 rounded-full bg-muted animate-pulse hidden md:block" />
                  <div className="h-4 w-20 rounded bg-muted animate-pulse hidden lg:block" />
                </div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <Inbox className="h-14 w-14 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No tickets found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {search || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                  ? 'Try adjusting your search or filters'
                  : 'Submit your first service request to get started'}
              </p>
              <Link
                href="/tickets/new"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Submit First Request
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">Ticket #</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Agency</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Priority</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell whitespace-nowrap">Created</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell whitespace-nowrap">Updated</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                    >
                      <td className="px-6 py-4 font-mono text-xs font-medium text-primary whitespace-nowrap">
                        {ticket.ticketNumber}
                      </td>
                      <td className="px-6 py-4 max-w-[220px] truncate text-foreground">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                        {ticket.agency?.agencyName ?? '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(statusStr(ticket.status))}`}>
                          {statusStr(ticket.status).replace('_', ' ')}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-xs font-medium hidden md:table-cell whitespace-nowrap`}>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadgeColor(statusStr(ticket.priority))}`}>
                          {statusStr(ticket.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell whitespace-nowrap text-xs">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell whitespace-nowrap text-xs">
                        {formatDate(ticket.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/tickets/${ticket.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline whitespace-nowrap"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!fetching && tickets.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </CitizenLayout>
  )
}
