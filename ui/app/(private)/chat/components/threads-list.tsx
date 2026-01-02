import { archiveThread, fetchThreads, renameThread } from "@/http/api-server";
import { revalidateTag } from "next/cache";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "../../../../components/ui/sidebar";
import { ThreadListMenuButton } from "./thread-list-menu-button";

export async function ThreadsList() {
	const threads = await fetchThreads({
		next: {
			tags: ["threads"],
		},
	});

	async function handleArchiveThread(openaiThreadId: string) {
		"use server"
		await archiveThread(openaiThreadId, {
			next: {
				tags: ['last-archived-thread'],
			},
		});
		revalidateTag('threads')
		revalidateTag('archived-threads')
	}

	async function handleRenameThread(openaiThreadId: string, newName: string) {
		"use server"
		await renameThread(openaiThreadId, newName, {
			next: {
				tags: ['threads'],
			},
		})
		revalidateTag('threads')
		revalidateTag(`thread-${openaiThreadId}`)
	}

	if (threads.length === 0) {
		return null;
	}

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Últimas conversas</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{threads.map((thread) => {
						return (
							<SidebarMenuItem key={thread.id}>
								<ThreadListMenuButton
									thread={thread}
									onArchiveThread={handleArchiveThread}
									onRenameThread={handleRenameThread}
								/>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
