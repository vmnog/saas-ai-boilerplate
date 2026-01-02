import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export function ChatSidebarMessagesLeftSkeleton() {
    return (
        <Link href="/settings/subscription">
            <Card className="p-3 rounded-md hover:cursor-pointer hover:bg-muted">
                <CardHeader className="p-0 space-y-0">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                </CardHeader>
                <CardContent className="p-0">
                    <Skeleton className="h-2 w-full mt-2" />
                </CardContent>
            </Card>
        </Link>
    )
}