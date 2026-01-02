"use client";

import { Button } from "@/components/ui/button";
import { CookieIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export default function CookiesAlert() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    setIsVisible(!hasAccepted);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="sm:max-w-screen-sm fixed bottom-4 inset-x-4 z-20 rounded-lg border border-border bg-background px-4 py-3 shadow-lg shadow-black/5">
      <div className="px-4 py-3 text-foreground">
        <div className="flex gap-2 md:items-center">
          <div className="flex grow gap-3 md:items-center">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 max-md:mt-0.5"
              aria-hidden="true"
            >
              <CookieIcon className="opacity-80" size={16} strokeWidth={2} />
            </div>
            <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Nós usamos cookies para melhorar sua experiência, analisar uso
                  do site, e mostrar conteúdo personalizado.
                </p>
              </div>
              <div className="flex gap-2 max-md:flex-wrap">
                <Button size="sm" className="text-sm" onClick={handleAccept}>
                  Aceitar
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            onClick={() => setIsVisible(false)}
            aria-label="Close banner"
          >
            <X
              size={16}
              strokeWidth={2}
              className="opacity-60 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
