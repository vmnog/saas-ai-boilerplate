"use client"

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SidebarMenuAction, SidebarMenuButton } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import type { Thread } from "@/http/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArchiveIcon, CheckIcon, EditIcon, MessageSquareIcon, MoreHorizontal, XIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RenameFormSchema = z.object({
    title: z.string()
        .min(2, {
            message: "O título deve ter pelo menos 2 caracteres.",
        })
        .max(50, {
            message: "O título deve ter no máximo 50 caracteres.",
        }),
});

function truncateText({ truncatedTitle, maxLength }: { truncatedTitle: string, maxLength: number }) {
    const isTruncated = truncatedTitle.length > maxLength;
    return {
        truncatedTitle: isTruncated ? `${truncatedTitle.substring(0, maxLength)}` : truncatedTitle,
        isTruncated,
    };
}

interface ThreadListMenuButtonProps {
    thread: Thread
    onArchiveThread: (openaiThreadId: string) => Promise<void>
    onRenameThread: (openaiThreadId: string, newName: string) => Promise<void>
}

export function ThreadListMenuButton({ thread, onArchiveThread, onRenameThread }: ThreadListMenuButtonProps) {
    const params = useParams()
    const router = useRouter()
    const [isRenaming, setIsRenaming] = useState(false)
    const renameInputRef = useRef<HTMLInputElement>(null)
    const { truncatedTitle, isTruncated } = truncateText({ truncatedTitle: thread.title ?? thread.openaiThreadId, maxLength: 17 });

    const form = useForm<z.infer<typeof RenameFormSchema>>({
        resolver: zodResolver(RenameFormSchema),
        defaultValues: {
            title: thread.title ?? "",
        },
    });

    const handleRenameThread = async (data: z.infer<typeof RenameFormSchema>) => {
        try {
            await onRenameThread(thread.openaiThreadId, data.title)
            setIsRenaming(false)
            if (params.openaiThreadId === thread.openaiThreadId) {
                window.location.href = `/chat/${thread.openaiThreadId}`
            }
            toast({
                title: "Conversa renomeada!",
                description: "O nome da conversa foi atualizado com sucesso.",
            })
        } catch (error) {
            console.error("Error renaming thread:", error)
            toast({
                title: "Erro ao renomear",
                description: "Não foi possível renomear a conversa.",
                variant: "destructive",
            })
        }
    }

    const handleArchiveThread = async () => {
        try {
            if (params.openaiThreadId === thread.openaiThreadId) {
                router.replace("/chat")
            }
            await onArchiveThread(thread.openaiThreadId)
            toast({
                title: "Conversa arquivada!",
                description: <p>A conversa foi arquivada e não será mais exibida na lista. <br />
                    <Link className="underline font-bold" href="/settings/archived">Clique aqui para gerenciar</Link> seus chats arquivados.
                </p>,
            })
        } catch (error) {
            console.error("Error archiving thread:", error)
            toast({
                title: "Erro ao arquivar",
                description: "Não foi possível arquivar a conversa.",
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        const isRenamingButTitleIsNotSet = isRenaming && thread.title && form.getValues('title') !== thread.title
        if (isRenamingButTitleIsNotSet) {
            form.setValue('title', thread.title ?? '')
        }
    }, [isRenaming, thread.title, form])

    return (
        <>
            <SidebarMenuButton isActive={params.openaiThreadId === thread.openaiThreadId} asChild>
                {isRenaming ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRenameThread)} className="flex items-start justify-between gap-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                ref={renameInputRef}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-end gap-1 pt-1">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="p-0 flex items-center justify-center size-6"
                                    onClick={() => setIsRenaming(false)}
                                >
                                    <XIcon className="size-4" />
                                </Button>
                                <Button type="submit" className="p-0 flex items-center justify-center size-6">
                                    <CheckIcon className="size-4" />
                                </Button>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <SidebarMenuButton isActive={params.openaiThreadId === thread.openaiThreadId} asChild>
                                    <Link href={`/chat/${thread.openaiThreadId}`}>
                                        <MessageSquareIcon className="mr-2 h-4 w-4" />
                                        {truncatedTitle}
                                        {isTruncated && <span className="-ml-2 text-xs">...</span>}
                                    </Link>
                                </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <span>{thread.title ?? thread.openaiThreadId}</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </SidebarMenuButton>

            {!isRenaming && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Ações da conversa</span>
                        </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem onClick={() => {
                            setIsRenaming(true)
                            setTimeout(() => {
                                renameInputRef.current?.focus()
                            }, 300)
                        }}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            <span>Renomear</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={handleArchiveThread}>
                            <ArchiveIcon className="mr-2 h-4 w-4" />
                            <span>Arquivar</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}
