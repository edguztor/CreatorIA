'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Menu, X } from 'lucide-react'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-violet-600">
            <Sparkles className="h-5 w-5" />
            PostGenius
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              How it works
            </Link>
            <Link href="#pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              FAQ
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 flex flex-col gap-4">
          <Link href="#how-it-works" className="text-sm text-gray-600 dark:text-gray-400" onClick={() => setMobileOpen(false)}>How it works</Link>
          <Link href="#pricing" className="text-sm text-gray-600 dark:text-gray-400" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="#faq" className="text-sm text-gray-600 dark:text-gray-400" onClick={() => setMobileOpen(false)}>FAQ</Link>
          <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Link href="/login" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">Log in</Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button size="sm" className="w-full">Get started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
