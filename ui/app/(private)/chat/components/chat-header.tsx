"use client";

import logoLight from "@/assets/logo-light.svg";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getThreadById } from "@/http/api-client";
import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatSidebarToggleButton } from "./chat-sidebar-toggle-button";

export function ChatHeader() {
  const params = useParams();
  const { open } = useSidebar();
  const [threadTitle, setThreadTitle] = useState<string>("");

  // Effect for initial thread fetch
  useEffect(() => {
    async function fetchThread() {
      if (!params.openaiThreadId) {
        setThreadTitle("");
        return;
      }

      const thread = await getThreadById(params.openaiThreadId as string);
      setThreadTitle(thread.title || thread.openaiThreadId);
    }

    fetchThread();
  }, [params.openaiThreadId]);

  // Separate effect for polling when no title
  useEffect(() => {
    if (!params.openaiThreadId || threadTitle !== params.openaiThreadId) {
      return;
    }

    const interval = setInterval(async () => {
      const thread = await getThreadById(params.openaiThreadId as string);
      if (thread.title) {
        setThreadTitle(thread.title);
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [params.openaiThreadId, threadTitle]);

  return (
    <header className="z-10 fixed top-0 right-0 h-14 w-full flex items-center p-4 gap-4 bg-background">
      <ChatSidebarToggleButton isOutside={true} />

      {threadTitle && (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <h1
                className={cn(
                  "text-sm font-medium truncate",
                  open && "md:pl-64",
                )}
              >
                {threadTitle || params.openaiThreadId}
              </h1>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>{threadTitle || params.openaiThreadId}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Link href="/" className="ml-auto">
        <Image
          src={logoLight}
          alt="ACME"
          className="min-w-28 w-28 dark:invert"
        />
      </Link>
    </header>
  );
}
