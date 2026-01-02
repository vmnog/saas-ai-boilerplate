import logoLight from "@/assets/logo-light.svg";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import Link from "next/link";
import { ChatSidebar } from "../chat/components/chat-sidebar";
import { ChatSidebarToggleButton } from "../chat/components/chat-sidebar-toggle-button";
import { SettingsNavigation } from "./components/settings-navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>
        <ChatSidebar />
        <main className="w-full bg-background">
          <header className="h-14 w-full flex items-center p-4 gap-4">
            <ChatSidebarToggleButton isOutside={true} />

            <Link href="/" className="ml-auto">
              <Image
                src={logoLight}
                alt="ACME"
                className="min-w-28 w-28 dark:invert"
              />
            </Link>
          </header>
          <div className="p-4">
            <div className="mx-auto grid grid-cols-1 gap-4 max-w-screen-md">
              <h1 className="text-2xl font-bold">Configurações</h1>
              <SettingsNavigation />
              {children}
            </div>
          </div>
        </main>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
