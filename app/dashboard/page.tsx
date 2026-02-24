'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FileText,
  BookOpen,
  Bell,
  Ticket,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { CitizenLayout } from '@/components/layout/CitizenLayout'
import { ticketsApi, notificationsApi } from '@/lib/api'
import { getStatusColor, getGreeting, formatDate, statusStr } from '@/lib/utils'

interface TicketRow {
  id: string
  ticketNumber: string
  subject: string
  agency?: { agencyName: string }
  status: string
  priority: string
  createdAt: string
}

interface Notification {
  id: string
  isRead: boolean
}

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  const [tickets, setTickets] = useState<TicketRow[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [ticketsLoading, setTicketsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return
    Promise.all([
      ticketsApi.list({ limit: 5, page: 1 }),
      notificationsApi.list(),
    ])
      .then(([ticketsRes, notifRes]) => {
        const t = ticketsRes.data.data
        setTickets(Array.isArray(t) ? t : (t?.items ?? t?.tickets ?? []))
        const notifs: Notification[] = notifRes.data.data
        if (Array.isArray(notifs)) {
          setUnreadCount(notifs.filter((n) => !n.isRead).length)
        }
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setTicketsLoading(false))
  }, [isAuthenticated])

  if (loading || !isAuthenticated) return null

  const openTickets = tickets.filter((t) => ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED'].includes(statusStr(t.status))).length
  const resolvedTickets = tickets.filter((t) => ['RESOLVED', 'CLOSED'].includes(statusStr(t.status))).length

  const stats = [
    { label: 'Total Tickets', value: tickets.length, icon: Ticket, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Open Tickets', value: openTickets, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Resolved', value: resolvedTickets, icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Notifications', value: unreadCount, icon: Bell, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ]

  return (
    <CitizenLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {getGreeting()}, {user?.firstName}! 👋
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Submit New Request
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-5">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Recent Tickets */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">My Recent Tickets</h2>
            <Link href="/tickets" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {ticketsLoading ? (
            <div className="space-y-0">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                  <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No tickets yet</p>
              <p className="text-sm text-muted-foreground mb-4">Submit your first service request to get started</p>
              <Link
                href="/tickets/new"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Submit Your First Request
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Ticket #</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Agency</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Created</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium text-primary">
                        {ticket.ticketNumber}
                      </td>
                      <td className="px-6 py-4 max-w-[200px] truncate text-foreground">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">
                        {ticket.agency?.agencyName ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(statusStr(ticket.status))}`}>
                          {statusStr(ticket.status).replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/tickets/${ticket.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
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

        {/* Quick Actions */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: FileText,
                title: 'Submit New Request',
                description: 'Create a new service request to any government agency',
                href: '/tickets/new',
                color: 'text-primary',
                bg: 'bg-primary/10',
              },
              {
                icon: BookOpen,
                title: 'Browse Knowledge Base',
                description: 'Find answers to common questions and service guides',
                href: '/knowledge-base',
                color: 'text-purple-600 dark:text-purple-400',
                bg: 'bg-purple-50 dark:bg-purple-900/20',
              },
              {
                icon: Bell,
                title: 'View Notifications',
                description: 'Check updates and alerts about your service requests',
                href: '/notifications',
                color: 'text-amber-600 dark:text-amber-400',
                bg: 'bg-amber-50 dark:bg-amber-900/20',
              },
            ].map(({ icon: Icon, title, description, href, color, bg }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                  Get started <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CitizenLayout>
  )
}
