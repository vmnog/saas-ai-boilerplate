import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function ArchivedLoading() {
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
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-full sm:w-72" />
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-36" />
                            <Skeleton className="h-10 w-36" />
                        </div>
                    </div>
                ))}
            </div>

            <Separator />

            <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Skeleton className="h-4 w-full sm:w-72" />
                    <Skeleton className="h-4 w-full sm:w-72" />
                </div>
                <Skeleton className="h-10 w-full sm:w-36" />
            </div>
        </div>
    )
}