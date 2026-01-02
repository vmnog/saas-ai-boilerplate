import type { Message } from "@/http/schemas";
import { cn } from "@/lib/cn";
import { getTruncatedFilename } from "@/utils/get-truncate-filename";
import { ArrowUpRightIcon, FileIcon, GlobeIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "../../../../components/ui/scroll-area";

interface Props {
  message: Message;
}

export function MessageAttachments({ message }: Props) {
  const isUserMessage = message.role === "user";
  const hasSources = message.attachments.length > 0;

  return (
    <div className="mt-6 text-xs text-muted-foreground">
      {hasSources && isUserMessage && (
        <p className="text-primary-foreground dark:text-muted-foreground mb-1">
          Anexos
        </p>
      )}
      {hasSources && !isUserMessage && <p className="mb-1">Fontes</p>}

      <ScrollArea className="w-72 sm:w-full sm:max-w-[38rem] whitespace-nowrap rounded-md">
        <div className="flex gap-4">
          {message.attachments.map((attachment, index) => (
            // TODO: maybe add a link if attachment is a url
            // TODO: if attachment is a file, what can I offer to the user?
            // maybe possible actions:
            // - download
            // - check file data (size, type, when was it created), etc
            // - manage uploaded files and it's related threads
            <a
              // biome-ignore lint/a11y/useValidAnchor: <explanation>
              href="#"
              key={index}
              className={cn(
                isUserMessage && "bg-background dark:bg-background/50",
                "border p-2 rounded grid gap-2 group",
              )}
            >
              <header className="flex items-center justify-between gap-8 text-foreground">
                <div className="flex items-center gap-2">
                  {attachment.mimetype === "text/html" ? (
                    <GlobeIcon className="min-w-5 min-h-5 size-5 bg-primary dark:bg-muted text-primary-foreground dark:text-foreground rounded-full flex-0 p-1" />
                  ) : (
                    <FileIcon className="min-w-5 min-h-5 size-5 bg-primary dark:bg-muted text-primary-foreground dark:text-foreground rounded-full flex-0 p-1" />
                  )}
                  <span className="w-fit whitespace-nowrap truncate text-ellipsis font-semibold lowercase">
                    {getTruncatedFilename(attachment.filename)}
                  </span>
                </div>

                <span className="group-hover:hidden flex items-center justify-center text-center text-xs flex-0 min-w-3 min-h-3 size-3 bg-muted text-muted-foreground rounded-full flex-0 p-2">
                  {index + 1}
                </span>

                <ArrowUpRightIcon className="hidden group-hover:block p-[0.10rem] min-w-4 min-h-4 size-4 bg-muted text-muted-foreground rounded-full flex-0" />
              </header>
              {/* <span className="max-w-40 whitespace-nowrap truncate"> */}
              {/*   This is a resume of the content from this example source, this */}
              {/*   may be long or not but the UI is supposed to handle this. */}
              {/* </span> */}
            </a>
          ))}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
