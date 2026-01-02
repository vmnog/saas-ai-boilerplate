'use client'

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { Loader, RotateCcw } from "lucide-react";
import { useTransition } from "react";

interface RestoreThreadButtonProps {
    onRestoreThread: (openaiThreadId: string) => Promise<void>
    openaiThreadId: string
}

export function RestoreThreadButton({ onRestoreThread, openaiThreadId }: RestoreThreadButtonProps) {
    const [isLoading, startLoadingTransition] = useTransition()

    async function handleRestoreThread() {
        startLoadingTransition(async () => {
            await onRestoreThread(openaiThreadId)
        })
    }

    return (
        <Button variant="outline" size="sm" className="relative" onClick={handleRestoreThread} disabled={isLoading}>
            {isLoading ? (
                <Loader className="size-4 mx-auto animate-spin absolute" />
            ) : (
                <RotateCcw className={cn("size-4", isLoading && "invisible")} />
            )}
            <span className={cn("text-sm", isLoading && "invisible")}>Restaurar</span>
        </Button>
    )
}