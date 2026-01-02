"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CommandIcon, PanelLeft, PanelRight } from "lucide-react"

interface ChatSidebarToggleButtonProps {
    isOutside: boolean
}

export function ChatSidebarToggleButton({ isOutside }: ChatSidebarToggleButtonProps) {
    const { toggleSidebar, open, isMobile } = useSidebar()

    return (
        <TooltipProvider>
            <Tooltip>
                {isMobile && (
                    <SidebarButton IconComponent={PanelRight} size="size-3" onClick={toggleSidebar} />
                )}
                {!isMobile && open && !isOutside && (
                    <SidebarButton IconComponent={PanelRight} size="size-3" onClick={toggleSidebar} />
                )}
                {!isMobile && !open && isOutside && (
                    <SidebarButton IconComponent={PanelLeft} size="size-8" onClick={toggleSidebar} />
                )}
            </Tooltip>
        </TooltipProvider>
    )
}

interface SidebarButtonProps {
    IconComponent: React.ElementType
    size: string
    onClick: () => void
}

function SidebarButton({ IconComponent, size, onClick }: SidebarButtonProps) {
    return (
        <>
            <TooltipTrigger asChild>
                <Button variant="outline" onClick={onClick} className="text-muted-foreground p-2 h-fit">
                    <IconComponent className={size} />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <span className="flex items-center gap-2">
                    <CommandIcon className="size-3" />
                    + B
                </span>
            </TooltipContent>
        </>
    )
}
