import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createCustomerPortal,
  getLimits,
  getSubscription,
  listBillingHistory,
} from "@/http/api-server";
import { dayjs } from "@/lib/dayjs";
import { formatBRL } from "@/utils/format-brl";
import { getRelativeTime } from "@/utils/get-relative-time";
import {
  AlertCircleIcon,
  CalendarDays,
  CircleXIcon,
  FileText,
  MessageCircle,
  RefreshCw,
  Settings2,
  SparklesIcon
} from "lucide-react";
import Link from "next/link";

export default async function SubscriptionPage() {
  const subscription = await getSubscription({
    next: { tags: ["subscription"] },
  });
  const limits = await getLimits({
    next: { tags: ["limits"] },
  });
  const customerPortal = await createCustomerPortal("/settings/subscription", {
    next: {
      tags: ["customer-portal"],
    },
  });
  const billingHistory = await listBillingHistory({
    next: {
      tags: ["billing-history"],
    },
  });

  return (
    <div className="space-y-6">
      <Card className="border-none space-y-6">
        <CardHeader className="space-y-1 p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg">Plano Atual</CardTitle>
              <CardDescription className="text-sm">
                Seus detalhes sobre sua inscrição e estatísticas de uso
              </CardDescription>
            </div>
            <Badge variant="secondary" className="w-fit h-fit">
              {subscription.product.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <Alert>
            <AlertCircleIcon className="size-4" />
            <AlertTitle>
              Seu plano tem um número limitado de mensagens
            </AlertTitle>
            <AlertDescription className="text-pretty">
              Mas não se preocupe, depois de um tempo após atingir seu limite de
              mensagens nós resetamos seu bloqueio temporário automaticamente.
            </AlertDescription>
          </Alert>
          {/* Usage Statistics */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Mensagens Disponíveis</span>
              <span className="font-medium">
                {limits.used}/{limits.limit} mensagens
              </span>
            </div>
            <Progress
              value={(limits.used / limits.limit) * 100}
              className="h-2"
            />
            {limits.resetAt && (
              <p className="text-xs text-muted-foreground">
                Seu plano se renovará em {getRelativeTime(limits.resetAt)}
              </p>
            )}
          </div>

          {/* Plan Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {subscription.startsAt && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Plano iniciado em:</p>
                  <p className="text-xs text-muted-foreground">
                    {dayjs(subscription.startsAt).format(
                      "DD/MM/YYYY [às] HH:mm",
                    )}
                  </p>
                </div>
              </div>
            )}
            {subscription.cancelAtPeriodEnd && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CircleXIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    Plano será cancelado em:
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dayjs(subscription.cancelAt || new Date()).format(
                      "DD/MM/YYYY [às] HH:mm",
                    )}
                  </p>
                </div>
              </div>
            )}
            {!subscription.cancelAtPeriodEnd && subscription.endsAt && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <RefreshCw className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Plano será renovado em:</p>
                  <p className="text-xs text-muted-foreground">
                    {dayjs(subscription.endsAt).format("DD/MM/YYYY [às] HH:mm")}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Limite de Mensagens</p>
                <p className="text-xs text-muted-foreground">
                  {limits.limit} mensagens por dia
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Settings2 className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">
                  Funcionalidades Disponíveis
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-xs text-muted-foreground">
                        {subscription.product.metadata.benefits.length >= 40
                          ? subscription.product.metadata.benefits
                            .split("|")
                            .join(", ")
                            .slice(0, 40)
                            .concat("...")
                          : subscription.product.metadata.benefits}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-60">
                      {subscription.product.metadata.benefits
                        .split("|")
                        .join(", ")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 p-0">
          {subscription.product.monthlyPrice === 0 ? (
            <>
              <Button variant="default" asChild className="w-full sm:w-fit">
                <Link href="/plans">
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  Fazer Upgrade
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-fit">
                <Link href={customerPortal.url}>Gerenciar Assinatura</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" asChild className="w-full sm:w-fit">
                <Link href={customerPortal.url}>Gerenciar Assinatura</Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-fit">
                <Link href="/plans">Ver Outros Planos</Link>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Compras</CardTitle>
          <CardDescription>
            Veja seu histórico de compras recentes e seus comprovantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingHistory.length === 0 ? (
            <BillingHistoryEmptyState />
          ) : (
            <div className="space-y-4">
              {billingHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {dayjs(item.date).format("DD/MM/YYYY [às] HH:mm")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.id.slice(0, 10)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="h-fit">
                      {item.status}
                    </Badge>
                    <span className="text-sm font-medium">
                      {formatBRL(item.price)}
                    </span>
                    <Button
                      disabled={item.downloadUrl === null}
                      variant="link"
                      size="sm"
                    >
                      {item.downloadUrl ? (
                        <Link href={item.downloadUrl}>Baixar</Link>
                      ) : (
                        <span>Indisponível</span>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BillingHistoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center bg-background border border-dashed rounded-lg p-8 text-center">
      <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <FileText className="size-6 text-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        Histórico de Cobrança Vazio
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Você ainda não tem nenhum histórico de cobrança. Faça sua primeira
        inscrição para começar a acompanhar suas transações.
      </p>
      <Button asChild>
        <Link href="/plans">
          <SparklesIcon className="mr-2 h-4 w-4" />
          Fazer Upgrade
        </Link>
      </Button>
    </div>
  );
}
