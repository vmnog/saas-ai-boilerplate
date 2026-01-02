import { Confetti } from "@/components/confetti";
import { SettingsSidebarSubMenu } from "@/components/settings-sidebar-sub-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfile, getSubscription } from "@/http/api-server";
import { dayjs } from "@/lib/dayjs";
import { getFirstAndLastName } from "@/utils/get-first-and-last-name";
import { getNameInitials } from "@/utils/get-name-initials";
import { ChevronsUpDownIcon, LogOut, SparklesIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function ChatSidebarFooterMenu() {
  const profile = await getProfile({
    next: { tags: ["profile"] },
  });

  const subscription = await getSubscription({
    next: { tags: ["subscription"] },
  });

  const handleSignOut = async () => {
    "use server";

    cookies().delete("token");

    redirect("/auth/sign-out");
  };

  return (
    <SidebarMenuItem>
      {profile.email === "garbasneto@gmail.com" &&
        dayjs().isAfter(dayjs("2024-12-23")) &&
        dayjs().isBefore(dayjs("2024-12-25")) && <Confetti />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="py-6 border">
            <div className="flex items-center w-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{getNameInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <div className="ml-3 w-full">
                <p className="text-sm font-medium capitalize flex items-center justify-between">
                  {getFirstAndLastName(profile.name)}
                  <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {subscription.product.name}
                </p>
              </div>
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="flex flex-col p-2">
            <p className="text-xs text-muted-foreground mb-2">
              {profile.email}
            </p>
            <p className="text-sm font-medium capitalize">
              {getFirstAndLastName(profile.name)}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {subscription.product.name}
            </p>
          </div>

          {subscription.product.monthlyPrice === 0 && (
            <div className="p-2">
              <Button asChild className="w-full">
                <Link href="/plans">
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  Fazer Upgrade
                </Link>
              </Button>
            </div>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <form action={handleSignOut}>
                <Button type="submit" variant="ghost" className="h-fit p-0">
                  <LogOut className=" size-4" />
                  Encerrar sessão
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <SettingsSidebarSubMenu />
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

export function ChatSidebarFooterMenuSkeleton() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton className="py-6" disabled>
        <div className="flex items-center">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="ml-3">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
