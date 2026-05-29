import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-violet-600 mb-8">
        <Sparkles className="h-5 w-5" />
        PostGenius
      </Link>
      {children}
      <p className="mt-8 text-xs text-gray-400 text-center">
        By signing up you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}
