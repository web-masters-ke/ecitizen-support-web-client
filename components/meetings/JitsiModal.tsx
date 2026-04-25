'use client'

import { useEffect, useRef } from 'react'
import { X, ExternalLink } from 'lucide-react'

interface JitsiModalProps {
  roomName: string
  displayName: string
  onClose: () => void
}

export function JitsiModal({ roomName, displayName, onClose }: JitsiModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const domain = 'meet.jit.si'
    const options = {
      roomName,
      parentNode: containerRef.current,
      width: '100%',
      height: '100%',
      userInfo: { displayName },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
        prejoinPageEnabled: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup', 'chat', 'tileview', 'fullscreen'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
      },
    }

    const init = () => {
      apiRef.current = new (window as any).JitsiMeetExternalAPI(domain, options)
      apiRef.current.addEventListener('readyToClose', onClose)
    }

    if (!(window as any).JitsiMeetExternalAPI) {
      const script = document.createElement('script')
      script.src = 'https://meet.jit.si/external_api.js'
      script.onload = init
      document.head.appendChild(script)
    } else {
      init()
    }

    return () => { apiRef.current?.dispose(); apiRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName])

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold text-white">Meeting with Support Agent</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={`https://meet.jit.si/${roomName}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-700">
            <ExternalLink className="h-3.5 w-3.5" /> Open in browser
          </a>
          <button onClick={onClose}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-700">
            <X className="h-3.5 w-3.5" /> Leave
          </button>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  )
}
