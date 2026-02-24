'use client'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Shield } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold">eCitizen Kenya</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Centered content */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </div>

      {/* Footer note */}
      <p className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Republic of Kenya. All rights reserved.
      </p>
    </div>
  )
}
