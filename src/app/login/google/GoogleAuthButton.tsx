"use client";

import { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { CredentialResponse } from "google-one-tap";

const GoogleAuthButton = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const handleCredential = useCallback(
    async (credential: string) => {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: credential,
      });
      if (error) return;
      router.refresh();
    },
    [supabase, router],
  );

  const initialize = useCallback(() => {
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: (res: CredentialResponse) => {
        if (res.credential) handleCredential(res.credential);
      },
    });
  }, [handleCredential]);

  const renderButton = useCallback(() => {
    const buttonDiv = document.getElementById("google-signin-button");
    if (!buttonDiv) return;

    window.google.accounts.id.renderButton(buttonDiv, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "pill",
      logo_alignment: "left",
      width: 350,
    });
  }, []);

  useEffect(() => {
    if (!window.google?.accounts?.id) return;
    initialize();
    renderButton();
  }, [scriptLoaded, initialize, renderButton]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="my-6 flex justify-center">
        <div id="google-signin-button" />
      </div>
    </>
  );
};

export default GoogleAuthButton;
