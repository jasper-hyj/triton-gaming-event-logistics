'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { CredentialResponse } from 'google-one-tap'

const GoogleAuth = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const pathname = usePathname()

  // Handles credential from both One Tap and Button
  const handleCredential = async (credential: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credential,
      })
      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error('Google Auth error:', err)
    }
  }

  const initOneTap = () => {
    if (!window.google?.accounts?.id) return

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: (res: CredentialResponse) => {
        if (res.credential) handleCredential(res.credential)
      },
      auto_select: false,
      cancel_on_tap_outside: false,
    })

    window.google.accounts.id.prompt()
  }

  const renderButton = () => {
    const buttonDiv = document.getElementById('google-signin-button')
    if (!buttonDiv || !window.google?.accounts?.id) return

    buttonDiv.innerHTML = ''
    window.google.accounts.id.renderButton(buttonDiv, {
      theme: 'outline',
      size: 'large',
      width: 240,
    })
  }

  useEffect(() => {
    if (!scriptLoaded) return

    // Global One Tap login for all pages
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) initOneTap()
    }

    checkSession()

    // Show login button only on /login
    if (pathname === '/login') {
      renderButton()
    }
  }, [scriptLoaded, pathname])

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      {pathname === '/login' && (
        <div className="my-6 flex justify-center">
          <div id="google-signin-button" />
        </div>
      )}
    </>
  )
}

export default GoogleAuth
