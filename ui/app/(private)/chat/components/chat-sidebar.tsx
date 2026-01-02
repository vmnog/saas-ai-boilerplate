import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getSubscription } from '@/http/api-server'
import { PenBox } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  ChatSidebarFooterMenu,
  ChatSidebarFooterMenuSkeleton,
} from './chat-sidebar-footer-menu'
import { ChatSidebarMessagesLeft } from './chat-sidebar-messages-left'
import { ChatSidebarMessagesLeftSkeleton } from './chat-sidebar-messages-left-skeleton'
import { ChatSidebarToggleButton } from './chat-sidebar-toggle-button'
import { ChatSidebarUpgrade } from './chat-sidebar-upgrade'
import { DialogFeedback } from './dialog-feedback'
import { ThreadListSkeleton } from './thread-list-skeleton'
import { ThreadsList } from './threads-list'

export async function ChatSidebar() {
  const subscription = await getSubscription({
    next: {
      tags: ['subscription'],
    },
  })
  return (
    <Sidebar className="w-64 border-r z-20">
      <SidebarHeader className="px-2 mt-0 flex flex-row items-center justify-between">
        <Link href="/">
          <Logo variant="icon" />
        </Link>
        <ChatSidebarToggleButton isOutside={false} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Button asChild className="w-full justify-start mb-2">
                <Link href="/chat">
                  <PenBox className="mr-2 h-4 w-4" />
                  Nova Conversa
                </Link>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <DialogFeedback />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <Suspense fallback={<ThreadListSkeleton />}>
          <ThreadsList />
        </Suspense>
      </SidebarContent>
      <SidebarFooter className="gap-2">
        <SidebarMenu>
          {subscription.product.monthlyPrice === 0 && <ChatSidebarUpgrade />}
        </SidebarMenu>
        <SidebarMenu>
          <Suspense fallback={<ChatSidebarMessagesLeftSkeleton />}>
            <ChatSidebarMessagesLeft />
          </Suspense>
        </SidebarMenu>
        <SidebarMenu>
          <Suspense fallback={<ChatSidebarFooterMenuSkeleton />}>
            <ChatSidebarFooterMenu />
          </Suspense>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
