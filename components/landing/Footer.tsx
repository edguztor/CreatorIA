import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-violet-600">
          <Sparkles className="h-4 w-4" />
          PostGenius
        </Link>

        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="#pricing" className="hover:text-violet-600 transition-colors">Pricing</Link>
          <Link href="#faq" className="hover:text-violet-600 transition-colors">FAQ</Link>
          <Link href="/login" className="hover:text-violet-600 transition-colors">Login</Link>
          <Link href="/register" className="hover:text-violet-600 transition-colors">Sign up</Link>
        </div>

        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} PostGenius. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
