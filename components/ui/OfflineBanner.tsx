'use client'
import { useEffect, useState } from 'react'
import { WifiOff, Wifi } from 'lucide-react'

export function OfflineBanner() {
  const [online, setOnline] = useState(true)
  const [justCameBack, setJustCameBack] = useState(false)

  useEffect(() => {
    setOnline(navigator.onLine)

    const handleOnline = () => {
      setOnline(true)
      setJustCameBack(true)
      setTimeout(() => setJustCameBack(false), 3000)
    }
    const handleOffline = () => {
      setOnline(false)
      setJustCameBack(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (online && !justCameBack) return null

  if (justCameBack) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700 p-3 text-sm text-green-800 dark:text-green-300 mb-5">
        <Wifi className="h-4 w-4 shrink-0" />
        <span>Connection restored. You&apos;re back online.</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-3 text-sm text-amber-800 dark:text-amber-300 mb-5">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>
        No internet connection. Please check your network before submitting.
      </span>
    </div>
  )
}
