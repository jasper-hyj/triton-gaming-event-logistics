'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import useSession from '@/utils/supabase/use-session'

export default function Account() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const user = useSession()?.user

  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (user === undefined) return
    setLoading(false)
    if (!user) router.replace('/')
  }, [user, router])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.replace('/')
      window.location.reload()
    } catch (err) {
      console.error('Logout error:', err)
      setLoggingOut(false)
    }
  }

  if (loading)
    return (
      <p className="text-center mt-24 text-gray-500 text-lg font-light tracking-wide">
        Loading user info...
      </p>
    )

  if (!user)
    return (
      <p className="text-center mt-24 text-gray-500 text-lg font-light tracking-wide">
        Redirecting...
      </p>
    )

  return (
    <main className="bg-white px-8 py-16 max-w-lg mx-auto rounded-lg shadow-lg flex flex-col items-center text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
        User Information
      </h1>

      <div className="bg-gray-50 p-8 rounded-xl shadow-md w-full border border-gray-200 text-left">
        <p className="text-xl text-gray-700 mb-4">
          <span className="font-semibold">Name:</span>{' '}
          {user.user_metadata?.full_name || 'N/A'}
        </p>
        <p className="text-xl text-gray-700">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => router.back()}
          className="w-full px-6 py-3 rounded-md bg-zinc-700 hover:bg-zinc-800 text-white font-semibold transition-shadow shadow-md hover:shadow-lg"
          aria-label="Go back"
        >
          Go Back
        </button>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={`w-full px-6 py-3 rounded-md text-white font-semibold transition-shadow shadow-md ${
            loggingOut
              ? 'bg-red-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 hover:shadow-lg'
          }`}
          aria-label="Logout"
        >
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </main>
  )
}
