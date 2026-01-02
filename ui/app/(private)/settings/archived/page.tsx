import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { deleteAllArchivedChats, deleteThread, fetchArchivedThreads, restoreThread } from "@/http/api-server"
import { dayjs } from "@/lib/dayjs"
import { Archive, Trash2 } from 'lucide-react'
import { revalidateTag } from "next/cache"
import { DeleteAllArchivedChatsForm } from "./delete-all-archived-chats-form"
import { DeleteThreadButton } from "./delete-thread-button"
import { RestoreThreadButton } from "./restore-thread-button"

export default async function ArchivedChatsPage() {
    const archiveds = await fetchArchivedThreads({
        next: {
            tags: ['archived-chats']
        }
    })

    async function handleRestoreThread(openaiThreadId: string) {
        "use server"

        await restoreThread(openaiThreadId, {
            next: {
                tags: ['last-restored-thread']
            }
        })

        revalidateTag('archived-threads')
        revalidateTag('threads')
    }

    async function handleDeleteThread(openaiThreadId: string) {
        "use server"
        await deleteThread(openaiThreadId, {
            next: {
                tags: ['last-deleted-thread']
            }
        })
        revalidateTag('archived-threads')
        revalidateTag('threads')
    }

    async function handleDeleteAllArchivedChats() {
        "use server"
        await deleteAllArchivedChats({
            next: {
                tags: ['last-deleted-all-archived-chats']
            }
        })
        revalidateTag('archived-threads')
        revalidateTag('threads')
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Chats Arquivados</h3>
                <p className="text-sm text-muted-foreground">
                    Gerencie suas conversas arquivadas e histórico de chat.
                </p>
            </div>
            <Separator />

            <div className="space-y-8">
                {archiveds.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        Você ainda não possui nenhum chat arquivado.
                    </p>
                )}

                {archiveds.map((archived) => (
                    <div key={archived.thread.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="font-medium">{archived.thread.title ?? 'Sem título'}</p>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Archive className="h-4 w-4" />
                                    <span>Arquivado em {dayjs(archived.thread.archivedAt).format('DD/MM/YYYY [às] HH:mm')}</span>
                                </div>
                                <span className="hidden sm:inline">•</span>
                                <span>{archived.messagesAmount} mensagens</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <RestoreThreadButton onRestoreThread={handleRestoreThread} openaiThreadId={archived.thread.openaiThreadId} />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Excluir
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Tem certeza que deseja excluir este chat?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <DeleteThreadButton onDeleteThread={handleDeleteThread} openaiThreadId={archived.thread.openaiThreadId} />
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>

            <Separator />

            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-medium text-destructive">Excluir todos os chats arquivados</h4>
                    <p className="text-sm text-muted-foreground">
                        Isso excluirá permanentemente todos os seus chats arquivados. Esta ação não pode ser desfeita.
                    </p>
                </div>
                <DeleteAllArchivedChatsForm onDeleteAllArchivedChats={handleDeleteAllArchivedChats} archivedThreadsIsEmpty={archiveds.length === 0} />
            </div>
        </div>
    )
}
