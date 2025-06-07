'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import useSession from '@/utils/supabase/use-session'

export default function Account() {
  const user = useSession()?.user
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const [loadingLogout, setLoadingLogout] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(true)

  // Wait for session to load before redirecting
  useEffect(() => {
    if (user === undefined) {
      // Session is still loading
      setSessionLoading(true)
    } else {
      setSessionLoading(false)
      if (!user) {
        router.replace('/')
      }
    }
  }, [user, router])

  const handleLogout = async () => {
    setLoadingLogout(true)
    try {
      await supabase.auth.signOut()
      router.replace("/")
      window.location.reload()
    } catch (error) {
      console.error('Logout error:', error)
      setLoadingLogout(false)
    }
  }

  if (sessionLoading) {
    return <p className="text-center mt-20 text-gray-500">Loading user info...</p>
  }

  if (!user) {
    // Redirecting, but this shouldn't flash because of above
    return <p className="text-center mt-20 text-gray-500">Redirecting...</p>
  }

  return (
    <main className="bg-white px-6 py-12 max-w-xl mx-auto flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">User Information</h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow w-full">
        <p className="text-lg text-gray-800 mb-2">
          <strong>Name:</strong> {user.user_metadata?.full_name || 'N/A'}
        </p>
        <p className="text-lg text-gray-800">
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <button
        onClick={() => router.back()}
        className="mt-8 px-6 py-2 rounded-md bg-zinc-600 hover:bg-zinc-700 text-white font-medium transition"
      >
        Go Back
      </button>

      <button
        onClick={handleLogout}
        disabled={loadingLogout}
        className="mt-4 px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:opacity-50"
      >
        {loadingLogout ? 'Logging out...' : 'Logout'}
      </button>
    </main>
  )
}
