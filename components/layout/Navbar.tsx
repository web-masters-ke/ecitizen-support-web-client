'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  LayoutDashboard,
  Ticket,
  LogOut,
  Home,
  Search,
  BookOpen,
  FileText,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { notificationsApi } from '@/lib/api'

const publicNavLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: FileText },
  { href: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { href: '/track', label: 'Track Request', icon: Search },
]

const authNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tickets', label: 'My Tickets', icon: Ticket },
  { href: '/tickets/new', label: 'Submit Request', icon: FileText },
  { href: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
]

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    if (!isAuthenticated) return
    const fetch = () =>
      notificationsApi.list({ page: 1, limit: 1 })
        .then((r) => setUnreadCount(r.data?.meta?.unreadCount ?? 0))
        .catch(() => {})
    fetch()
    const interval = setInterval(fetch, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  const navLinks = isAuthenticated ? authNavLinks : publicNavLinks
  const homeHref = isAuthenticated ? '/dashboard' : '/'

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    setMobileOpen(false)
    window.location.href = '/'
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link
              href={homeHref}
              className="flex items-center gap-2 select-none"
              aria-label="eCitizen Service Command Centre"
            >
              <Image
                src="/ecitizen-logo.png"
                alt="eCitizen Kenya"
                width={140}
                height={30}
                className="h-8 w-auto object-contain hidden sm:block"
                priority
              />
              <Image
                src="/ecitizen-logo.png"
                alt="eCitizen Kenya"
                width={100}
                height={22}
                className="h-7 w-auto object-contain sm:hidden"
                priority
              />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {isAuthenticated && user ? (
                <>
                  {/* Notification bell (desktop) */}
                  <Link
                    href="/notifications"
                    className="relative hidden sm:flex rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* User avatar dropdown (desktop) */}
                  <div className="relative hidden sm:block">
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase">
                        {(user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')}
                      </div>
                      <span className="hidden sm:block max-w-[100px] truncate text-foreground">
                        {user.firstName}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
                          userMenuOpen && 'rotate-180'
                        )}
                      />
                    </button>

                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                        <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-border bg-card shadow-lg">
                          <div className="px-3 py-2.5 border-b border-border">
                            <p className="text-sm font-semibold truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <div className="py-1">
                            <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />Dashboard
                            </Link>
                            <Link href="/my-tickets" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                              <Ticket className="h-4 w-4 text-muted-foreground" />My Tickets
                            </Link>
                            <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                              <User className="h-4 w-4 text-muted-foreground" />Profile
                            </Link>
                            <div className="my-1 border-t border-border" />
                            <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                              <LogOut className="h-4 w-4" />Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button size="sm" asChild>
                    <Link href="/login">Sign in with eCitizen</Link>
                  </Button>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Full-Screen Drawer ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel — slides from top */}
          <div className="relative bg-background border-b border-border shadow-2xl rounded-b-3xl overflow-y-auto max-h-[92dvh]">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <Link href={homeHref} onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                <Image src="/ecitizen-logo.png" alt="eCitizen Kenya" width={120} height={26} className="h-7 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-2 bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User card (when authenticated) */}
            {isAuthenticated && user && (
              <div className="mx-4 mt-4 rounded-2xl bg-primary/5 border border-primary/10 px-4 py-3 flex items-center gap-3">
                <div className="h-11 w-11 flex-shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm uppercase">
                  {(user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-medium transition-colors',
                    pathname === href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Auth / user actions */}
            <div className="px-4 pb-6 space-y-1 border-t border-border pt-3 mt-1">
              {!isAuthenticated ? (
                <div className="pt-1">
                  <Button size="sm" className="w-full h-12 text-base rounded-2xl" asChild>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in with eCitizen</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <Link
                    href="/notifications"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
