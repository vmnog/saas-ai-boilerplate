import { MDXComponent } from "@/components/mdx-components";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { Message } from "@/http/schemas";
import { cn } from "@/lib/cn";
import { AlertTriangleIcon, BotIcon, UserIcon } from "lucide-react";
import { ChatMessagesScrollToBottom } from "./chat-messages-scroll-to-bottom";
import { MessageAttachments } from "./message-attachments";
import { TextLoop } from "@/components/ui/text-loop";
import { TextShimmer } from "@/components/ui/text-shimmer";

interface ChatMessagesProps {
  messages: Message[];
  hasReachedLimit: boolean;
}

export function ChatMessages({ messages, hasReachedLimit }: ChatMessagesProps) {
  if (messages.length === 0) {
    return <ChatMessagesSkeleton />;
  }

  return (
    <ChatMessagesWrapper hasReachedLimit={hasReachedLimit}>
      {messages.map((message) => {
        const isUserMessage = message.role === "user";
        const isAssistantMessage = message.role === "assistant";
        const isError = message.role === "error";

        return (
          <div key={message.id} className="flex my-4">
            <div
              className={cn(
                "flex space-x-2 max-w-full",
                isError &&
                  "mx-auto justify-center items-center text-destructive bg-destructive/10 border-destructive/20 border p-3 rounded-lg",
              )}
            >
              {isUserMessage && <UserIcon className="min-w-5 size-5" />}
              {isAssistantMessage && (
                <BotIcon
                  className={cn(
                    "min-w-5 size-5",
                    !message.text && "animate-pulse",
                  )}
                />
              )}
              {isError && <AlertTriangleIcon className="min-w-5 size-5" />}

              <div
                className={cn(
                  "overflow-x-auto whitespace-pre-wrap p-3 rounded-lg",
                  {
                    "prose-a:no-underline bg-primary dark:bg-muted text-primary-foreground dark:text-foreground rounded-tl-none":
                      isUserMessage,
                  },
                )}
              >
                {isUserMessage ? (
                  <p>{message.text}</p>
                ) : message.text ? (
                  <MDXComponent content={message.text} />
                ) : (
                  <AssistantMessageLoadingState />
                )}

                {message.attachments?.length > 0 && (
                  <MessageAttachments message={message} />
                )}
              </div>
            </div>
          </div>
        );
      })}
      <ChatMessagesScrollToBottom messages={messages} />
    </ChatMessagesWrapper>
  );
}

function AssistantMessageLoadingState() {
  return (
    <TextLoop className="overflow-hidden">
      <TextShimmer className="overflow-hidden" duration={2}>
        Processando...
      </TextShimmer>
      <TextShimmer className="overflow-hidden" duration={2}>
        Carregando dados...
      </TextShimmer>
      <TextShimmer className="overflow-hidden" duration={2}>
        Analisando solicitação...
      </TextShimmer>
      <TextShimmer className="overflow-hidden" duration={2}>
        Verificando anexos...
      </TextShimmer>
      <TextShimmer className="overflow-hidden" duration={2}>
        Calculando resposta...
      </TextShimmer>
    </TextLoop>
  );
}

export function ChatMessagesSkeleton() {
  return (
    <ChatMessagesWrapper hasReachedLimit={false}>
      {[...Array(Math.floor(Math.random() * 2) + 5)].map((_, index) => {
        return (
          <div key={index} className="flex flex-col gap-4">
            <div className="flex my-4 gap-4">
              <Skeleton className="min-w-5 size-5 rounded-full" />
              <Skeleton className="w-96 h-10" />
            </div>
            <div className="flex my-4 gap-4">
              <Skeleton className="min-w-5 size-5 rounded-full" />
              <Skeleton className="w-72 h-10" />
            </div>
          </div>
        );
      })}
    </ChatMessagesWrapper>
  );
}

function ChatMessagesWrapper({
  children,
  hasReachedLimit,
}: {
  children: React.ReactNode;
  hasReachedLimit: boolean;
}) {
  return (
    <ScrollArea
      className={cn(
        "h-full w-full max-w-2xl mx-auto pt-14 pb-48 flex flex-col justify-center",
        hasReachedLimit && "pb-72",
      )}
    >
      {children}
    </ScrollArea>
  );
}
