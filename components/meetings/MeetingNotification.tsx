'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Video, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { JitsiModal } from './JitsiModal'

interface MeetingInvite {
  meetingId: string
  ticketId: string
  roomName: string
  jitsiUrl: string
  startedBy: string
}

export function MeetingNotification() {
  const { user, isAuthenticated } = useAuth()
  const [invite, setInvite] = useState<MeetingInvite | null>(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || ''
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (!token) return

    const socket: Socket = io(`${baseUrl}/ws`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    socket.on('meeting:started', (data: MeetingInvite) => {
      setInvite(data)
    })

    return () => { socket.disconnect() }
  }, [isAuthenticated, user?.id])

  if (!invite) return null

  if (joining) {
    return (
      <JitsiModal
        roomName={invite.roomName}
        displayName={user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email : 'Citizen'}
        onClose={() => { setJoining(false); setInvite(null) }}
      />
    )
  }

  return (
    <div className="fixed bottom-6 left-6 z-[9998] w-80 rounded-2xl bg-white border border-border shadow-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
            <Video className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Meeting Invitation</p>
            <p className="text-xs text-muted-foreground">from {invite.startedBy || 'Support Agent'}</p>
          </div>
        </div>
        <button onClick={() => setInvite(null)} className="text-muted-foreground hover:text-foreground p-1 rounded">
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-foreground mb-4">
        Your support agent has started a video meeting for your ticket. Join now to speak with them directly.
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => setJoining(true)}
          className="flex-1 rounded-lg bg-blue-600 text-white text-sm font-semibold py-2 hover:bg-blue-700 transition-colors"
        >
          Join Meeting
        </button>
        <button
          onClick={() => setInvite(null)}
          className="flex-1 rounded-lg border border-border text-sm font-medium py-2 hover:bg-muted/30 transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  )
}
