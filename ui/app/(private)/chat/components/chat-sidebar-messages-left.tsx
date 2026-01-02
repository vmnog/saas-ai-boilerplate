import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLimits } from "@/http/api-server";
import { dayjs } from "@/lib/dayjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export async function ChatSidebarMessagesLeft() {
  const limits = await getLimits({
    next: {
      tags: ["limits"],
    },
  });

  const isOverLimit = limits.used >= limits.limit;
  const isBeforeResetAt = limits.resetAt && dayjs().isBefore(limits.resetAt);
  const remainingMessages = limits.limit - limits.used;

  const limitMessageOverLimit = "Suas mensagens diárias esgotaram.";
  const limitMessageUnderLimit = `Ainda restam ${remainingMessages} mensage${remainingMessages === 1 ? "m" : "ns"}.`;
  const limitMessageIsZero = "Você já pode enviar mensagens.";

  const limitMessage = isOverLimit
    ? isBeforeResetAt
      ? limitMessageOverLimit
      : limitMessageIsZero
    : limitMessageUnderLimit;

  return (
    <Link href="/settings/subscription">
      <Card className="group p-3 rounded-md hover:cursor-pointer hover:bg-muted">
        <CardHeader className="p-0 space-y-0">
          <CardTitle className="text-sm flex items-center justify-between">
            Mensagens disponíveis
            <ArrowRight className="ml-2 size-4 text-muted-foreground" />
          </CardTitle>
          <CardDescription className="text-xs">{limitMessage}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Progress
            className="mt-2 group-hover:dark:bg-gray-700 group-hover:bg-gray-200"
            value={(limits.used / limits.limit) * 100}
          />
        </CardContent>
      </Card>
    </Link>
  );
}

