'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, LayoutDashboard, Wand2, Clock, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/generate', label: 'Generate', icon: Wand2, exact: false },
  { href: '/dashboard/history', label: 'History', icon: Clock, exact: false },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, exact: false },
]

function NavLink({ href, label, icon: Icon, exact }: typeof navItems[0]) {
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-violet-600 text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </Link>
  )
}

export function Sidebar() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4 border-b border-gray-200 dark:border-gray-800">
        <Sparkles className="h-5 w-5 text-violet-600" />
        <span className="font-bold text-lg text-violet-600">PostGenius</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile header + drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-600" />
          <span className="font-bold text-lg text-violet-600">PostGenius</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-600 dark:text-gray-300" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-white dark:bg-gray-950 flex flex-col shadow-xl">
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-600" />
                <span className="font-bold text-lg text-violet-600">PostGenius</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-600 dark:text-gray-300" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1" onClick={() => setMobileOpen(false)}>
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
