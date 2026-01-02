import { Toaster } from "@/components/ui/toaster";
import { redirect } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { isAuthenticated } from "../(public)/auth/actions";
import { Providers } from "./providers";

interface PrivateLayoutProps {
  children: ReactNode;
}

export const dynamic = "force-dynamic";

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  if (!isAuthenticated()) {
    console.error("Not authenticated, redirecting to sign-out");
    redirect("/auth/sign-out?code=no-token");
  }

  return (
    <div className="min-h-dvh bg-background">
      <Providers>
        <NuqsAdapter>{children}</NuqsAdapter>
      </Providers>
      <Toaster />
    </div>
  );
}
