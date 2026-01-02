import { fetchMessagesFromThreadById, getThreadById } from "@/http/api-server";
import type { Metadata } from "next";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ThreadMessagesForm } from "./thread-messages-form";

export async function generateMetadata({
  params,
}: {
  params: { openaiThreadId: string };
}): Promise<Metadata> {
  const thread = await getThreadById(params.openaiThreadId, {
    next: {
      tags: [`thread-${params.openaiThreadId}`],
    },
  });
  return {
    title: `${thread?.title || thread.openaiThreadId}`,
  };
}

export default async function ThreadId({
  params,
}: {
  params: { openaiThreadId: string };
}) {
  const thread = await getThreadById(params.openaiThreadId, {
    next: {
      tags: [`thread-${params.openaiThreadId}`],
    },
  });

  if (thread?.archivedAt !== null) {
    redirect("/chat");
  }

  const fetchedMessages = await fetchMessagesFromThreadById(
    params.openaiThreadId,
    {
      next: {
        tags: [`messages-${params.openaiThreadId}`],
      },
    },
  );

  async function onThreadCompleted() {
    "use server";
    revalidateTag(`messages-${params.openaiThreadId}`);
    revalidateTag("threads");
    revalidateTag("limits");
    revalidateTag("subscription");
  }

  return (
    <ThreadMessagesForm
      thread={thread}
      messages={fetchedMessages}
      onThreadCompleted={onThreadCompleted}
    />
  );
}
