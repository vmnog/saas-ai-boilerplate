import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRightIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

export async function ChatSidebarUpgrade() {
  return (
    <Link href="/plans">
      <Card className="group p-3 rounded-md hover:bg-muted hover:cursor-pointer">
        <CardHeader className="p-0">
          <CardTitle className="text-base flex items-center justify-between">
            Experimente Plus
            <SparklesIcon className="ml-2 size-4 text-muted-foreground" />
          </CardTitle>
          <CardDescription className="text-sm">
            Faça upgrade para upload de arquivos, IA mais inteligente e uso
            ilimitado de mensagens.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <Button>
            <ArrowUpRightIcon className="size-4" />
            Saber mais
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
