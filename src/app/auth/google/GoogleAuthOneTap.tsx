'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { CredentialResponse } from 'google-one-tap'

const GoogleAuthOneTap = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false) // Check if the Script is loaded


  const supabase = createSupabaseBrowserClient()
  const handleCredential = async (credential: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credential,
      })
      if (error) throw error
      window.location.reload()
    } catch (err) {
      console.error('Google One Tap error:', err)
    }
  }

  useEffect(() => {
    if (!scriptLoaded || !window.google?.accounts?.id) return

    const setupOneTap = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) return

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: (res: CredentialResponse) => {
          if (res.credential) handleCredential(res.credential)
        },
        auto_select: true,
        cancel_on_tap_outside: true,
      })

      window.google.accounts.id.prompt()
    }

    setupOneTap()
  }, [scriptLoaded])

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => setScriptLoaded(true)}
    />
  )
}

export default GoogleAuthOneTap
