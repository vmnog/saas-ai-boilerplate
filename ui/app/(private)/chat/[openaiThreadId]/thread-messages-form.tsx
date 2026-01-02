"use client";

import { getLimits } from "@/http/api-client";
import type { Message, Thread } from "@/http/schemas";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ChatMessages } from "../components/chat-messages";
import { SendMessage } from "../components/send-message";

interface ThreadMessagesFormProps {
  thread: Thread;
  messages: Message[];
  onThreadCompleted: () => Promise<void>;
}

export function ThreadMessagesForm({
  thread,
  messages: initialMessages,
  onThreadCompleted,
}: ThreadMessagesFormProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  useEffect(() => {
    if (messages.length === 0 || hasReachedLimit) return;

    getLimits().then((limits) => {
      const isOverLimit =
        limits.resetAt !== null && dayjs(limits.resetAt).isAfter(dayjs());
      setHasReachedLimit(isOverLimit);
    });
  }, [messages, hasReachedLimit]);

  async function onAddMessage(newMessage: Message) {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  async function onAddMessageFails() {
    await onUpdateLastMessage(
      "Falha ao enviar mensagem, recarregue a página e tente novamente.",
      true,
    );
  }

  async function onUpdateLastMessage(updatedContent: string, isError = false) {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        lastMessage.text = updatedContent;
        if (isError) {
          lastMessage.role = "error";
        }
      }
      return newMessages;
    });
  }

  return (
    <div className="flex flex-col min-h-dvh px-4 lg:px-0">
      <ChatMessages
        hasReachedLimit={hasReachedLimit}
        messages={messages}
      />
      <SendMessage
        openaiThreadId={thread.openaiThreadId}
        onAddMessage={onAddMessage}
        onUpdateLastMessage={onUpdateLastMessage}
        onThreadCompleted={onThreadCompleted}
        onAddMessageFails={onAddMessageFails}
      />
    </div>
  );
}
