'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Loader2, CheckCheck, AlertCircle, Mail, MessageSquare } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { CitizenLayout } from '@/components/layout/CitizenLayout'
import { notificationsApi } from '@/lib/api'
import { timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface NotificationRecipient {
  recipientEmail?: string
  recipientPhone?: string
  deliveryStatus: string
}

interface NotificationItem {
  id: string
  triggerEvent?: string
  channel: string
  status: string
  createdAt: string
  recipients: NotificationRecipient[]
  ticket?: { ticketNumber?: string; subject?: string } | null
  template?: { templateName?: string } | null
}

// Map triggerEvent to human-readable title
function getNotificationTitle(item: NotificationItem): string {
  const eventTitles: Record<string, string> = {
    REGISTRATION: 'Account Created Successfully',
    TICKET_CREATED: 'New Service Request Submitted',
    TICKET_ASSIGNED: 'Your Ticket Has Been Assigned',
    TICKET_ESCALATED: 'Ticket Escalated',
    TICKET_RESOLVED: 'Your Ticket Has Been Resolved',
    TICKET_CLOSED: 'Ticket Closed',
    TICKET_STATUS_CHANGED: 'Ticket Status Updated',
    PASSWORD_RESET: 'Password Reset',
    SLA_BREACH: 'SLA Breach Alert',
  }
  if (item.triggerEvent && eventTitles[item.triggerEvent]) {
    return eventTitles[item.triggerEvent]
  }
  if (item.template?.templateName) return item.template.templateName
  return 'System Notification'
}

// Build descriptive message from available fields
function getNotificationMessage(item: NotificationItem): string {
  if (item.ticket?.subject) {
    return `Re: "${item.ticket.subject}" (${item.ticket.ticketNumber ?? ''})`
  }
  const recipient = item.recipients?.[0]
  const via = item.channel === 'EMAIL' ? `via email${recipient?.recipientEmail ? ` to ${recipient.recipientEmail}` : ''}` : `via ${item.channel.toLowerCase()}`
  if (item.status === 'FAILED') return `Delivery failed ${via}. We'll retry automatically.`
  if (item.status === 'SENT') return `Sent successfully ${via}`
  return `Pending delivery ${via}`
}

function getNotificationIcon(triggerEvent?: string) {
  switch (triggerEvent) {
    case 'TICKET_CREATED':
    case 'TICKET_ASSIGNED':
    case 'TICKET_ESCALATED':
    case 'TICKET_RESOLVED':
    case 'TICKET_CLOSED':
    case 'TICKET_STATUS_CHANGED': return '🎫'
    case 'REGISTRATION': return '🎉'
    case 'PASSWORD_RESET': return '🔐'
    case 'SLA_BREACH': return '⚠️'
    default: return '🔔'
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'SENT': return <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-full px-2 py-0.5">Delivered</span>
    case 'FAILED': return <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-full px-2 py-0.5">Failed</span>
    case 'PENDING': return <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-full px-2 py-0.5">Pending</span>
    default: return null
  }
}

export default function NotificationsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set())
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [markingAll, setMarkingAll] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return
    notificationsApi
      .list()
      .then((res) => {
        const d = res.data.data
        const items = Array.isArray(d) ? d : (d?.items ?? d?.data ?? [])
        setNotifications(items)
      })
      .catch(() => setError('Failed to load notifications'))
      .finally(() => setFetching(false))
  }, [isAuthenticated])

  const handleAcknowledge = (id: string) => {
    setAcknowledged((prev) => new Set([...prev, id]))
    notificationsApi.markRead(id).catch(() => {})
  }

  const handleAcknowledgeAll = async () => {
    setMarkingAll(true)
    try {
      await notificationsApi.markAllRead()
      setAcknowledged(new Set(notifications.map((n) => n.id)))
    } catch {
      setError('Failed to mark all as read')
    } finally {
      setMarkingAll(false)
    }
  }

  if (loading || !isAuthenticated) return null

  const unacknowledgedCount = notifications.filter((n) => !acknowledged.has(n.id)).length

  return (
    <CitizenLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {unacknowledgedCount > 0
                ? `${unacknowledgedCount} unread notification${unacknowledgedCount !== 1 ? 's' : ''}`
                : 'All caught up!'}
            </p>
          </div>
          {unacknowledgedCount > 0 && (
            <button
              onClick={handleAcknowledgeAll}
              disabled={markingAll}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
            >
              {markingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
              Mark All Read
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Notifications list */}
        {fetching ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5 flex gap-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">All caught up</p>
            <p className="text-sm text-muted-foreground">No notifications to show</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const isRead = acknowledged.has(notif.id)
              return (
                <div
                  key={notif.id}
                  onClick={() => !isRead && handleAcknowledge(notif.id)}
                  className={cn(
                    'relative flex gap-4 rounded-xl border bg-card p-5 transition-all cursor-pointer',
                    isRead
                      ? 'border-border opacity-70 hover:opacity-100'
                      : 'border-primary/30 border-l-4 border-l-primary shadow-sm hover:shadow-md'
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg',
                    isRead ? 'bg-muted' : 'bg-primary/10'
                  )}>
                    {getNotificationIcon(notif.triggerEvent)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className={cn('text-sm leading-snug', isRead ? 'text-foreground font-normal' : 'text-foreground font-semibold')}>
                        {getNotificationTitle(notif)}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(notif.status)}
                        {/* Channel icon */}
                        {notif.channel === 'EMAIL'
                          ? <Mail className="h-3.5 w-3.5 text-muted-foreground/60" />
                          : <MessageSquare className="h-3.5 w-3.5 text-muted-foreground/60" />
                        }
                        {!isRead && <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {getNotificationMessage(notif)}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground/70">{timeAgo(notif.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </CitizenLayout>
  )
}
