'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft, Loader2, Send, AlertCircle, Clock, User,
  Phone, PhoneOff, PhoneMissed, MicOff, Mic, Volume2, Paperclip, X,
} from 'lucide-react'
import { io } from 'socket.io-client'
import { useAuth } from '@/contexts/AuthContext'
import { CitizenLayout } from '@/components/layout/CitizenLayout'
import { ticketsApi, callsApi, mediaApi } from '@/lib/api'
import { useWebRTCCall } from '@/hooks/useWebRTCCall'
import { getStatusColor, formatDate, formatDateTime, timeAgo, getInitials, statusStr, normalizeMediaUrl } from '@/lib/utils'

interface TicketDetail {
  id: string
  ticketNumber: string
  subject: string
  description: string
  status: unknown
  priority: unknown
  channel: string
  createdAt: string
  updatedAt: string
  agency?: { id: string; agencyName: string }
  category?: { name: string }
  assignee?: { id: string; firstName: string; lastName: string; email: string }
  slaResponseDueAt?: string
  slaResolutionDueAt?: string
  slaTracking?: { slaStatus?: string }
  tagMappings?: Array<{ tag?: { name: string } }>
}

interface MessageAttachment {
  id: string
  storageUrl: string
  fileName?: string | null
  fileType?: string | null
}

interface Message {
  id: string
  messageText?: string | null
  senderId?: string
  sender: { id: string; firstName: string; lastName: string; email?: string; userType?: string }
  createdAt: string
  isInternal?: boolean
  attachments?: MessageAttachment[]
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
  const [uploadingFile, setUploadingFile] = useState(false)
  const [pendingFile, setPendingFile] = useState<{ url: string; name: string; type: string } | null>(null)
  const [recording, setRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // ── Call state ─────────────────────────────────────────────────────────────
  const [callLogId, setCallLogId] = useState<string | null>(null)
  const [callStartedAt, setCallStartedAt] = useState<Date | null>(null)
  const [callError, setCallError] = useState('')
  const localAudioRef = useRef<HTMLAudioElement>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)

  const { status: callStatus, remoteStream, isMuted, startCall, hangup, toggleMute } = useWebRTCCall({
    userId: (user as any)?.id ?? '',
    userName: `${(user as any)?.firstName ?? ''} ${(user as any)?.lastName ?? ''}`.trim(),
    onConnected: (id) => { setCallLogId(id); setCallStartedAt(new Date()) },
    onCallEnded: () => { setCallLogId(null); setCallStartedAt(null) },
  })

  useEffect(() => {
    if (remoteStream && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  const fetchTicket = useCallback(async () => {
    if (!isAuthenticated || !ticketId) return
    try {
      const [ticketRes, msgRes, histRes] = await Promise.all([
        ticketsApi.get(ticketId),
        ticketsApi.getMessages(ticketId),
        ticketsApi.getHistory(ticketId),
      ])
      const rawTicket = ticketRes.data.data
      setTicket(rawTicket?.data ?? rawTicket)
      const msgs = msgRes.data.data
      const msgList = Array.isArray(msgs) ? msgs : (msgs?.items ?? msgs?.data ?? [])
      setMessages(msgList)
      const hist = histRes.data.data
      setHistory(Array.isArray(hist) ? hist : (hist?.items ?? hist?.data ?? []))
    } catch {
      setError('Failed to load ticket details')
    } finally {
      setFetching(false)
    }
  }, [isAuthenticated, ticketId])

  useEffect(() => { fetchTicket() }, [fetchTicket])

  // Real-time: listen for new messages from agent via WebSocket
  useEffect(() => {
    if (!isAuthenticated || !ticketId) return
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || ''
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (!token) return
    const socket = io(`${baseUrl}/ws`, { auth: { token }, transports: ['websocket', 'polling'] })
    socket.on('ticket:newMessage', (data: { ticketId: string; message: Message }) => {
      if (data.ticketId === ticketId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === data.message.id)) return prev
          return [...prev, data.message]
        })
      }
    })
    return () => { socket.disconnect() }
  }, [isAuthenticated, ticketId])

  useEffect(() => {
    const el = messagesContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const handleSend = async () => {
    if ((!reply.trim() && !pendingFile) || sending) return
    setSending(true)
    try {
      const res = await ticketsApi.addMessage(
        ticketId,
        reply.trim(),
        pendingFile?.url,
        pendingFile?.name,
        pendingFile?.type,
      )
      const raw = res.data.data
      const newMsg = raw?.data ?? raw
      setMessages((prev) => [...prev, newMsg])
      setReply('')
      setPendingFile(null)
    } catch {
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await mediaApi.upload(fd)
      const raw = res.data.data ?? res.data
      const url = raw?.storageUrl ?? raw?.url ?? raw?.fileUrl ?? ''
      setPendingFile({ url, name: file.name, type: file.type })
    } catch {
      setError('File upload failed')
    } finally {
      setUploadingFile(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleVoiceToggle = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop()
      setRecording(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      audioChunksRef.current = []
      mr.ondataavailable = (e) => audioChunksRef.current.push(e.data)
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const fd = new FormData()
        fd.append('file', blob, `voice-${Date.now()}.webm`)
        setUploadingFile(true)
        try {
          const res = await mediaApi.upload(fd)
          const raw = res.data.data ?? res.data
          const url = raw?.storageUrl ?? raw?.url ?? raw?.fileUrl ?? ''
          setPendingFile({ url, name: `Voice note ${new Date().toLocaleTimeString()}`, type: 'audio/webm' })
        } catch {
          setError('Voice upload failed')
        } finally {
          setUploadingFile(false)
        }
      }
      mr.start()
      mediaRecorderRef.current = mr
      setRecording(true)
    } catch {
      setError('Microphone access denied')
    }
  }

  const handleStartCall = async () => {
    if (!ticket?.assignee?.id) return
    setCallError('')
    try {
      const res = await callsApi.start(ticket.assignee.id, ticketId, ticket.agency?.id)
      const log = res.data.data
      const logId = log?.id ?? log?.data?.id ?? null
      setCallLogId(logId)
      await startCall({ targetUserId: ticket.assignee.id, callLogId: logId ?? '' })
    } catch {
      setCallError('Could not start call. Please try again.')
    }
  }

  const handleEndCall = async () => {
    if (ticket?.assignee?.id) hangup(ticket.assignee.id)
    if (callLogId) {
      const dur = callStartedAt ? Math.round((Date.now() - callStartedAt.getTime()) / 1000) : 0
      await callsApi.updateStatus(callLogId, 'ENDED', dur).catch(() => {})
    }
    setCallLogId(null)
    setCallStartedAt(null)
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
  const isActive = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED'].includes(statusLabel)
  const canCall = isActive && !!ticket.assignee?.id
  const isOnCall = callStatus === 'calling' || callStatus === 'ringing' || callStatus === 'connected'

  return (
    <CitizenLayout>
      {/* Hidden audio elements for WebRTC */}
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/tickets" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            My Tickets
          </Link>
          <span>/</span>
          <span className="font-mono text-foreground font-medium">{ticket.ticketNumber.replace(/-/g, ' ')}</span>
        </nav>

        {/* Ticket header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-mono text-sm font-semibold text-foreground tracking-wide">
                {ticket.ticketNumber.replace(/-/g, ' ')}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm font-medium text-foreground">
                {statusLabel.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm font-medium text-foreground">
                {priorityLabel.charAt(0).toUpperCase() + priorityLabel.slice(1).toLowerCase()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{ticket.subject}</h1>
            <p className="text-sm text-muted-foreground mt-1">Submitted {formatDateTime(ticket.createdAt)}</p>
          </div>

          {/* Call button */}
          <div className="flex flex-col items-end gap-2">
            {isOnCall ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  {callStatus === 'connected' ? 'On call' : callStatus === 'calling' ? 'Calling…' : 'Incoming…'}
                </div>
                <button
                  onClick={toggleMute}
                  className="flex items-center justify-center rounded-full border border-border bg-card p-2 text-muted-foreground hover:bg-muted transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleEndCall}
                  className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  <PhoneOff className="h-4 w-4" /> End Call
                </button>
              </div>
            ) : canCall ? (
              <button
                onClick={handleStartCall}
                className="flex items-center gap-2 rounded-full border-2 border-green-600 bg-transparent px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-400 hover:bg-green-600 hover:text-white transition-all"
              >
                <Phone className="h-4 w-4" />
                Call Agent
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <PhoneMissed className="h-4 w-4" />
                {isActive ? 'Awaiting agent assignment' : 'Call unavailable'}
              </div>
            )}
            {callError && <p className="text-xs text-destructive">{callError}</p>}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Description + Messages */}
          <div className="lg:col-span-2 space-y-6">

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold text-foreground mb-3">Description</h2>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
              {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted text-muted-foreground text-xs px-2.5 py-0.5">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Messages thread */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Messages</h2>
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </div>

              <div ref={messagesContainerRef} className="p-4 max-h-[500px] overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">No messages yet. Send a message below.</p>
                ) : (
                  messages.map((msg) => {
                    const isCitizen = msg.sender?.id === (user as any)?.id || msg.sender?.userType === 'CITIZEN' || msg.sender?.userType === 'BUSINESS'
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isCitizen ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isCitizen ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                          {getInitials(msg.sender?.firstName ?? '?', msg.sender?.lastName ?? '')}
                        </div>
                        <div className={`max-w-[75%] flex flex-col gap-1.5 ${isCitizen ? 'items-end' : 'items-start'}`}>
                          {msg.messageText && (
                            <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isCitizen ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                              <p>{msg.messageText}</p>
                            </div>
                          )}
                          {(msg.attachments ?? []).map((att) => {
                            const isAudio = att.fileType?.startsWith('audio/')
                            const isImage = att.fileType?.startsWith('image/')
                            return (
                              <div key={att.id}>
                                {isAudio ? (
                                  <div className="rounded-2xl border border-border bg-card px-3 py-2">
                                    <audio controls src={normalizeMediaUrl(att.storageUrl)} className="max-w-[220px] h-8" />
                                  </div>
                                ) : isImage ? (
                                  <img src={normalizeMediaUrl(att.storageUrl)} alt={att.fileName ?? 'image'}
                                    className="max-w-[220px] rounded-2xl cursor-pointer"
                                    onClick={() => window.open(normalizeMediaUrl(att.storageUrl)!, '_blank')} />
                                ) : (
                                  <div className="rounded-xl border border-border bg-card px-3 py-2 flex items-center gap-2 text-xs">
                                    <Paperclip className="h-3 w-3 shrink-0 text-muted-foreground" />
                                    <a href={normalizeMediaUrl(att.storageUrl)} target="_blank" rel="noopener noreferrer" className="underline truncate text-foreground">{att.fileName ?? 'Attachment'}</a>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                          <span className="text-xs text-muted-foreground px-1">
                            {msg.sender?.firstName} · {timeAgo(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {isActive && (
                <div className="border-t border-border p-4">
                  {error && <p className="text-xs text-destructive mb-2">{error}</p>}
                  {pendingFile && (
                    <div className="flex items-center gap-2 mb-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-primary">
                      <Paperclip className="h-3.5 w-3.5 shrink-0" />
                      <span className="flex-1 truncate">{pendingFile.name}</span>
                      <button onClick={() => setPendingFile(null)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  )}
                  <div className="flex gap-2 items-end">
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingFile}
                      className="shrink-0 h-10 w-10 rounded-xl border border-input flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                      title="Attach file"
                    >
                      {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                    </button>
                    <textarea
                      rows={2}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                      placeholder="Type your message… (Enter to send)"
                      className="flex-1 resize-none rounded-xl border border-input bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={handleVoiceToggle}
                      disabled={uploadingFile}
                      className={`shrink-0 h-10 w-10 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-50 ${recording ? 'border-red-500 bg-red-50 text-red-500 animate-pulse' : 'border-input text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      title={recording ? 'Stop recording' : 'Record voice note'}
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={(!reply.trim() && !pendingFile) || sending || uploadingFile}
                      className="shrink-0 h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Status</h3>
              <span className="text-sm font-medium text-foreground">
                {statusLabel.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
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
                  <span className="font-mono text-xs text-primary">{ticket.ticketNumber.replace(/-/g, ' ')}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Assignment</h3>
              <div className="space-y-3 text-sm">
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

            {(ticket.slaResponseDueAt || ticket.slaResolutionDueAt) && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">SLA</h3>
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

            {user && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Your Contact Details
                </h3>
                <div className="space-y-2 text-sm">
                  {([
                    { label: 'Name', value: `${(user as any).firstName ?? ''} ${(user as any).lastName ?? ''}`.trim() },
                    { label: 'Email', value: (user as any).email ?? '' },
                    { label: 'Phone', value: (user as any).phoneNumber ?? '' },
                    { label: 'National ID', value: (user as any).nationalId ?? '' },
                  ] as { label: string; value: string }[]).filter(({ value }) => value).map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-foreground font-medium text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">History</h3>
                <div className="space-y-3">
                  {history.map((entry, idx) => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                        {idx < history.length - 1 && <div className="flex-1 w-px bg-border mt-1" />}
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
