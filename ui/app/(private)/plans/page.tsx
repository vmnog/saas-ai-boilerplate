import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ShineBorder } from "@/components/ui/shine-border";
import { SparklesText } from "@/components/ui/sparkles-text";
import {
  createCheckoutSession,
  getProducts,
  getSubscription,
} from "@/http/api-server";
import { cn } from "@/lib/cn";
import { Check, Users } from "lucide-react";
import { ChangePlanButton } from "./change-plan-button";
import { NavigateBackButton } from "./components/navigate-back-button";

export default async function PlansPage() {
  const subscription = await getSubscription({
    next: {
      tags: ["subscription"],
    },
  });
  const products = await getProducts({
    next: {
      tags: ["products"],
    },
  });

  if (!products.length) return;

  async function handleCreateCheckoutSession(price: {
    id: string;
    type: string;
    trialPeriodDays: number;
  }) {
    "use server";
    const { sessionId } = await createCheckoutSession(
      {
        id: price.id,
        type: price.type,
        trial_period_days: price.trialPeriodDays,
      },
      "/plans/upgrade/success",
      "/plans",
      {
        next: {
          tags: ["create-checkout-session"],
        },
      },
    );

    return { sessionId };
  }

  function getIntervalLabel(interval: string) {
    if (interval === "month") return "mês";
    if (interval === "year") return "mês";
    if (interval === "week") return "semana";
    if (interval === "day") return "dia";
    return interval;
  }

  return (
    <div className="overflow-x-hidden flex min-h-dvh w-full flex-col items-center justify-center bg-background p-8/off max-w-screen-xl mx-auto">
      <header className="w-full flex justify-end">
        <NavigateBackButton />
      </header>
      <div className="mx-auto w-full max-w-[1200px] space-y-8">
        <div className="text-center">
          <h1 className="mb-6 text-3xl font-semibold text-foreground">
            Faça upgrade do seu plano
          </h1>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-8 md:grid-cols-2",
            products.length > 2 && "md:grid-cols-3",
          )}
        >
          {products.map((product) => (
            <Card key={product.id} className="relative">
              <ShineBorder
                className="relative w-full h-full rounded-lg bg-transparent dark:bg-transparent"
                color={
                  product.metadata.shouldHighlight
                    ? ["#A07CFE", "#FE8FB5", "#FFBE7B"]
                    : []
                }
              >
                {product.metadata.shouldHighlight && (
                  <BorderBeam duration={3} />
                )}
                {product.metadata.off > 0 && (
                  <div className="absolute -top-3 -right-5 bg-primary text-primary-foreground text-xs font-bold py-1 px-3 rounded-full shadow-md transform rotate-12 z-10">
                    {product.metadata.off}% OFF
                  </div>
                )}
                <CardHeader className="flex flex-col items-center">
                  {product.metadata.shouldHighlight ? (
                    <SparklesText
                      text={product.name}
                      className="text-xl font-normal capitalize"
                    />
                  ) : (
                    <h3 className="text-xl font-semibold capitalize">
                      {product.name}
                    </h3>
                  )}
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      R$
                      {(product.price.unitAmount / 100 / (product.price.intervalCount || 1) / (product.price.interval === "year" ? 12 : 1)).toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </span>
                    {product.price.unitAmount > 0 && (
                      <span className="ml-1 text-sm text-muted-foreground">
                        {/* TODO: get if price is monthly or yearly  */}
                        /{getIntervalLabel(product.price.interval)}
                      </span>
                    )}
                  </div>
                  {/* <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p> */}
                </CardHeader>
                <CardContent className="space-y-4 w-full">
                  {subscription?.product.id === product.id ||
                    (product.price.unitAmount === 0 &&
                      subscription.product.monthlyPrice === 0) ? (
                    <Button disabled variant="secondary" className="w-full">
                      Seu plano atual
                    </Button>
                  ) : (
                    <ChangePlanButton
                      shouldHighlight={product.metadata.shouldHighlight}
                      product={product}
                      price={{
                        id: product.price.stripePriceId,
                        type: product.price.type,
                        trialPeriodDays: product.price.trialPeriodDays,
                      }}
                      onCreateCheckoutSession={handleCreateCheckoutSession}
                    />
                  )}
                  <ul className="space-y-2 text-sm">
                    {product.metadata.benefits.length > 0 &&
                      product.metadata.benefits.split("|").map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2">
                          <Check className="h-5 w-5 min-w-5 text-primary" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
                <CardFooter className="w-full">
                  {product.price.unitAmount === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Já tem um plano?{" "}
                      <a
                        href="/settings/support"
                        className="text-primary underline hover:text-primary/80"
                      >
                        Acesse ajuda com cobrança
                      </a>
                    </p>
                  )}
                  {product.price.unitAmount !== 0 && (
                    <div className="space-y-2 pt-4">
                      <p className="text-xs text-muted-foreground">
                        Limites aplicáveis
                      </p>
                      <p className="text-xs">
                        <a
                          href="/settings/subscription"
                          className="text-primary underline hover:text-primary/80"
                        >
                          Gerenciar minha assinatura
                        </a>
                      </p>
                      <p className="text-xs">
                        <a
                          href="/settings/support"
                          className="text-primary underline hover:text-primary/80"
                        >
                          Precisa de ajuda com uma cobrança
                        </a>
                      </p>
                    </div>
                  )}
                </CardFooter>
              </ShineBorder>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="mb-2 text-sm text-muted-foreground">
            Precisa de mais capacidades para o seu negócio?
          </p>
          <a
            href="/settings/support"
            className="inline-flex items-center gap-2 text-sm text-primary underline hover:text-primary/80"
          >
            <Users className="h-4 w-4" />
            Confira ACME Enterprise
          </a>
        </div>
      </div>
    </div>
  );
}
