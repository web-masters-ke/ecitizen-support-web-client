'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Loader2, CheckCheck, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { CitizenLayout } from '@/components/layout/CitizenLayout'
import { notificationsApi } from '@/lib/api'
import { timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  type?: string
}

const notificationTypeIcon = (type?: string) => {
  switch (type) {
    case 'TICKET_UPDATE': return '🎫'
    case 'ASSIGNMENT': return '👤'
    case 'RESOLUTION': return '✅'
    case 'ESCALATION': return '⚠️'
    default: return '🔔'
  }
}

export default function NotificationsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [notifications, setNotifications] = useState<Notification[]>([])
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
        setNotifications(Array.isArray(d) ? d : (d?.items ?? []))
      })
      .catch(() => setError('Failed to load notifications'))
      .finally(() => setFetching(false))
  }, [isAuthenticated])

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    } catch {
      // silently fail
    }
  }

  const handleMarkAllRead = async () => {
    setMarkingAll(true)
    try {
      await notificationsApi.markAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch {
      setError('Failed to mark all as read')
    } finally {
      setMarkingAll(false)
    }
  }

  if (loading || !isAuthenticated) return null

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <CitizenLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
            >
              {markingAll ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
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
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                className={cn(
                  'relative flex gap-4 rounded-xl border bg-card p-5 transition-all cursor-pointer',
                  notif.isRead
                    ? 'border-border opacity-70 hover:opacity-100'
                    : 'border-primary/30 border-l-4 border-l-primary shadow-sm hover:shadow-md'
                )}
              >
                {/* Icon */}
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg',
                  notif.isRead ? 'bg-muted' : 'bg-primary/10'
                )}>
                  {notificationTypeIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm leading-snug', notif.isRead ? 'text-foreground font-normal' : 'text-foreground font-semibold')}>
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-primary mt-1" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground/70">{timeAgo(notif.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CitizenLayout>
  )
}
