import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { TermsDialog } from "../components/terms-dialog";
import { ChatHeader } from "./components/chat-header";
import { ChatSidebar } from "./components/chat-sidebar";
import { acceptTerms, getUserTerms } from "@/http/api-server";
import { revalidateTag } from "next/cache";
import CookiesAlert from "./components/cookies-alert";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const terms = await getUserTerms({
    next: {
      tags: ["terms"],
    },
  });

  async function handleAccept() {
    "use server";
    console.log("accept");
    await acceptTerms({
      next: {
        tags: ["accept-terms"],
      },
    });
    revalidateTag("terms");
  }

  return (
    <>
      <SidebarProvider>
        <ChatSidebar />
        <ChatHeader />
        <CookiesAlert />
        <TermsDialog
          userNeedsToAcceptTerms={!terms.hasAccepted}
          onAccept={handleAccept}
        />
        <main className="w-full min-h-dvh bg-background">{children}</main>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
