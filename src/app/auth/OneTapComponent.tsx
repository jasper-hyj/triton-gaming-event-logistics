'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { CredentialResponse } from 'google-one-tap'
import { useRouter } from 'next/navigation'

const OneTapPrompt = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  const initOneTap = () => {
    if (!window.google?.accounts?.id) return

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (credentialResponse: CredentialResponse) => {
        try {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: credentialResponse.credential,
          })
          if (error) throw error
          router.refresh() // or push to /dashboard, etc.
        } catch (err) {
          console.error('One Tap sign-in failed:', err)
        }
      },
      auto_select: true,
      cancel_on_tap_outside: true,
    })

    window.google.accounts.id.prompt()
  }

  useEffect(() => {
    const checkSessionAndPrompt = async () => {
      const { data } = await supabase.auth.getSession()
      const isLoggedIn = !!data.session

      if (!isLoggedIn && scriptLoaded) {
        initOneTap()
      }
    }

    checkSessionAndPrompt()
  }, [scriptLoaded])

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => setScriptLoaded(true)}
    />
  )
}

export default OneTapPrompt
