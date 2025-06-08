"use client";

import { useEffect, useState, useCallback } from "react";
import Script from "next/script";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { CredentialResponse } from "google-one-tap";
import { useUser } from "../UserContext";

const GoogleAuthOneTap = () => {
  const { user } = useUser();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const handleCredential = useCallback(
    async (credential: string) => {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: credential,
      });

      if (!error) {
        window.location.reload();
      }
    },
    [supabase],
  );

  useEffect(() => {
    if (!scriptLoaded || !window.google?.accounts?.id) return;

    const setupOneTap = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || data.session) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: (res: CredentialResponse) => {
          if (res.credential) handleCredential(res.credential);
        },
        auto_select: true,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt();
    };

    setupOneTap();
  }, [scriptLoaded, supabase, handleCredential]);

  return (
    <>
      {!user && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={() => setScriptLoaded(true)}
        />
      )}
    </>
  );
};

export default GoogleAuthOneTap;
