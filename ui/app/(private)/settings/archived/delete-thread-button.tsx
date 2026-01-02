'use client'

import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { Loader, Trash2 } from "lucide-react";
import { useTransition } from "react";

interface DeleteThreadButtonProps {
    onDeleteThread: (openaiThreadId: string) => Promise<void>
    openaiThreadId: string
}

export function DeleteThreadButton({ onDeleteThread, openaiThreadId }: DeleteThreadButtonProps) {
    const [isLoading, startLoadingTransition] = useTransition()

    async function handleDeleteThread() {
        startLoadingTransition(async () => {
            await onDeleteThread(openaiThreadId)
        })
    }

    return (
        <Button asChild variant="destructive" className="relative" onClick={handleDeleteThread} disabled={isLoading}>
            <AlertDialogAction >
                {isLoading ? (
                    <Loader className="size-4 mx-auto animate-spin absolute" />
                ) : (
                    <Trash2 className={cn("size-4", isLoading && "invisible")} />
                )}
                <span className={cn("text-sm", isLoading && "invisible")}>Excluir</span>
            </AlertDialogAction>
        </Button>
    )
}