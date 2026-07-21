"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

export default function AdaptiveBotChallenge({ onToken }: { onToken: (token: string) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !siteKey || !containerRef.current || !window.turnstile) return;
    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: "login",
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
    return () => window.turnstile?.remove(widgetId);
  }, [onToken, ready, siteKey]);

  if (!siteKey) {
    return <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Security challenge is not configured. Please try again later.</p>;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <Script id="cloudflare-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={() => setReady(true)} />
      <p className="mb-3 text-sm text-slate-700">Please complete this security check to continue.</p>
      <div ref={containerRef} className="min-h-[65px] overflow-hidden" />
    </div>
  );
}
