"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/cn";
import {
  Archive,
  ChevronDown,
  CreditCardIcon,
  HeadsetIcon,
  HelpCircle,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function SettingsNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      href: "/settings/account",
      icon: <UserIcon className="size-4" />,
      label: "Minha conta",
    },
    {
      href: "/settings/archived",
      icon: <Archive className="size-4" />,
      label: "Chats Arquivados",
    },
    {
      href: "/settings/subscription",
      icon: <CreditCardIcon className="size-4" />,
      label: "Assinaturas",
    },
    {
      href: "/settings/faq",
      icon: <HelpCircle className="size-4" />,
      label: "FAQ",
    },
    {
      href: "/settings/support",
      icon: <HeadsetIcon className="size-4" />,
      label: "Contato com Suporte",
    },
  ];

  const currentRoute = navItems.find((item) => item.href === pathname);
  const currentTabIndex = navItems.findIndex((item) => item.href === pathname);
  const activeTab = currentTabIndex >= 0 ? `tab-${currentTabIndex}` : "tab-0";

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild className="lg:hidden">
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              {currentRoute?.icon}
              <span>{currentRoute?.label}</span>
            </div>
            <ChevronDown className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Configurações</DrawerTitle>
          </DrawerHeader>
          <div className="mx-auto w-full max-w-sm">
            <nav className="flex flex-col gap-2 p-4">
              {navItems.map(({ href, icon, label }) => (
                <Button
                  key={href}
                  asChild
                  variant="ghost"
                  className="flex items-center justify-start gap-4 w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link
                    href={href}
                    className={pathname !== href ? "text-muted-foreground" : ""}
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        </DrawerContent>
      </Drawer>

      <Tabs value={activeTab} className="hidden lg:block">
        <TabsList className="w-full flex items-center justify-start h-auto rounded-none border-b border-border bg-transparent p-0">
          {navItems.map(({ href, icon, label }, index) => (
            <TabsTrigger
              key={href}
              asChild
              value={`tab-${index}`}
              className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
            >
              <Link
                href={href}
                className={cn(
                  "space-x-2",
                  pathname !== href && "text-muted-foreground",
                )}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  );
}
