import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuSkeleton } from "@/components/ui/sidebar";

export function ThreadListSkeleton() {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Últimas conversas</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuSkeleton showIcon />
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
