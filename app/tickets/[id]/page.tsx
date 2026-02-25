'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Loader2,
  Send,
  AlertCircle,
  Clock,
  User,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { CitizenLayout } from '@/components/layout/CitizenLayout'
import { ticketsApi } from '@/lib/api'
import { getStatusColor, formatDate, formatDateTime, timeAgo, getInitials, statusStr } from '@/lib/utils'

interface TicketDetail {
  id: string
  ticketNumber: string
  subject: string
  description: string
  status: unknown  // API returns {id, name, isClosedStatus}
  priority: unknown // API returns {id, name, severityScore}
  channel: string
  createdAt: string
  updatedAt: string
  agency?: { id: string; agencyName: string }
  category?: { name: string }
  assignee?: { firstName: string; lastName: string; email: string }
  slaResponseDueAt?: string
  slaResolutionDueAt?: string
  slaTracking?: { slaStatus?: string }
  tagMappings?: Array<{ tag?: { name: string } }>
}

interface Message {
  id: string
  content: string
  sender: { id: string; firstName: string; lastName: string; role: string }
  createdAt: string
  isInternal?: boolean
}

interface HistoryEntry {
  id: number | string
  changeReason?: string
  changedAt: string
  changer?: { firstName: string; lastName: string }
  newStatus?: { id: string; name: string }
}

const priorityBadge: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
}

export default function TicketDetailPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const ticketId = params.id as string

  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated || !ticketId) return
    Promise.all([
      ticketsApi.get(ticketId),
      ticketsApi.getMessages(ticketId),
      ticketsApi.getHistory(ticketId),
    ])
      .then(([ticketRes, msgRes, histRes]) => {
        setTicket(ticketRes.data.data)
        const msgs = msgRes.data.data
        setMessages(Array.isArray(msgs) ? msgs : (msgs?.items ?? []))
        const hist = histRes.data.data
        setHistory(Array.isArray(hist) ? hist : (hist?.items ?? []))
      })
      .catch(() => setError('Failed to load ticket details'))
      .finally(() => setFetching(false))
  }, [isAuthenticated, ticketId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!reply.trim() || sending) return
    setSending(true)
    try {
      const res = await ticketsApi.addMessage(ticketId, reply.trim())
      setMessages((prev) => [...prev, res.data.data])
      setReply('')
    } catch {
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (loading || !isAuthenticated) return null

  if (fetching) {
    return (
      <CitizenLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CitizenLayout>
    )
  }

  if (error && !ticket) {
    return (
      <CitizenLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <p className="text-sm text-destructive">{error}</p>
          <Link href="/tickets" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to tickets
          </Link>
        </div>
      </CitizenLayout>
    )
  }

  if (!ticket) return null

  const statusLabel = statusStr(ticket.status)
  const priorityLabel = statusStr(ticket.priority)
  const tags = ticket.tagMappings?.map((m) => m.tag?.name).filter(Boolean) ?? []
  const slaStatus = ticket.slaTracking?.slaStatus

  return (
    <CitizenLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/tickets" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            My Tickets
          </Link>
          <span>/</span>
          <span className="font-mono text-foreground font-medium">{ticket.ticketNumber}</span>
        </nav>

        {/* Ticket header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-sm font-semibold text-primary">{ticket.ticketNumber}</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(statusLabel)}`}>
              {statusLabel.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadge[priorityLabel] ?? ''}`}>
              {priorityLabel}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{ticket.subject}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submitted {formatDateTime(ticket.createdAt)}
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Description + Messages + Reply */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold text-foreground mb-3">Description</h2>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
              {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted text-muted-foreground text-xs px-2.5 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Messages thread */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Messages</h2>
              </div>

              <div className="p-4 max-h-[500px] overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No messages yet. Send a message below.
                  </p>
                ) : (
                  messages.map((msg) => {
                    const isCitizen = msg.sender.id === user?.id || msg.sender.role === 'CITIZEN'
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${isCitizen ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isCitizen ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                          {getInitials(msg.sender.firstName, msg.sender.lastName)}
                        </div>
                        {/* Bubble */}
                        <div className={`max-w-[75%] ${isCitizen ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isCitizen ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                            {msg.content}
                          </div>
                          <span className="text-xs text-muted-foreground px-1">
                            {msg.sender.firstName} · {timeAgo(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply box */}
              {['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED'].includes(statusLabel) && (
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend()
                      }}
                      placeholder="Type a message… (Ctrl+Enter to send)"
                      className="flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[60px]"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!reply.trim() || sending}
                      className="self-end flex items-center justify-center rounded-md bg-primary p-2.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* Status card */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Status</h3>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(statusLabel)}`}>
                {statusLabel.replace('_', ' ')}
              </span>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground text-xs">{formatDate(ticket.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-foreground text-xs">{formatDate(ticket.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ticket #</span>
                  <span className="font-mono text-xs text-primary">{ticket.ticketNumber}</span>
                </div>
              </div>
            </div>

            {/* Assignment card */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Assignment</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Agency</p>
                  <p className="font-medium text-foreground">{ticket.agency?.agencyName ?? 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Assigned Agent</p>
                  {ticket.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {getInitials(ticket.assignee.firstName, ticket.assignee.lastName)}
                      </div>
                      <span className="font-medium">{ticket.assignee.firstName} {ticket.assignee.lastName}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Pending assignment</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SLA card */}
            {(ticket.slaResponseDueAt || ticket.slaResolutionDueAt) && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">SLA</h3>
                <div className="space-y-2 text-sm">
                  {slaStatus && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SLA Status</span>
                      <span className={`text-xs font-medium ${slaStatus === 'BREACHED' ? 'text-destructive' : 'text-green-600 dark:text-green-400'}`}>
                        {slaStatus}
                      </span>
                    </div>
                  )}
                  {ticket.slaResponseDueAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response By</span>
                      <span className="text-xs text-foreground">{formatDateTime(ticket.slaResponseDueAt)}</span>
                    </div>
                  )}
                  {ticket.slaResolutionDueAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolve By</span>
                      <span className="text-xs text-foreground">{formatDateTime(ticket.slaResolutionDueAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History timeline */}
            {history.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">History</h3>
                <div className="space-y-3">
                  {history.map((entry, idx) => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                        {idx < history.length - 1 && (
                          <div className="flex-1 w-px bg-border mt-1" />
                        )}
                      </div>
                      <div className="pb-3">
                        <p className="text-xs font-medium text-foreground">
                          {entry.newStatus?.name ?? entry.changeReason ?? 'Status changed'}
                        </p>
                        {entry.changeReason && entry.newStatus?.name && (
                          <p className="text-xs text-muted-foreground mt-0.5">{entry.changeReason}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {timeAgo(entry.changedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CitizenLayout>
  )
}
