"use client";

import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import type { Product } from "@/http/schemas";
import { cn } from "@/lib/cn";
import { getStripe } from "@/lib/stripe";
import { Loader, SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface ChangePlanButtonProps {
  product: Product;
  price: { id: string; type: string; trialPeriodDays: number };
  onCreateCheckoutSession: (
    price: { id: string; type: string; trialPeriodDays: number },
    redirectUrl: string,
    cancelUrl: string,
  ) => Promise<{ sessionId: string }>;
  shouldHighlight?: boolean;
}

export function ChangePlanButton({
  product,
  price,
  onCreateCheckoutSession,
  shouldHighlight,
}: ChangePlanButtonProps) {
  const [isLoading, startLoadingTransition] = useTransition();
  const router = useRouter();

  async function handleChangePlan() {
    startLoadingTransition(async () => {
      const { sessionId } = await onCreateCheckoutSession(
        price,
        "/plans/upgrade/success",
        "/plans",
      );

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    });
  }

  if (shouldHighlight) {
    return (
      <RainbowButton
        className="w-full gap-1"
        onClick={handleChangePlan}
        disabled={isLoading}
      >
        <div
          className={cn(
            "w-full flex justify-center items-center gap-1",
            isLoading && "hidden",
          )}
        >
          <SparklesIcon className="size-4" />
          Assinar
          <span className="capitalize">{product.name}</span>
        </div>
        <Loader
          className={cn("size-4 animate-spin hidden", isLoading && "block")}
        />
      </RainbowButton>
    );
  }

  return (
    <Button
      className="w-full gap-1"
      onClick={handleChangePlan}
      disabled={isLoading}
      variant="default"
    >
      <div
        className={cn(
          "w-full flex justify-center items-center gap-1",
          isLoading && "hidden",
        )}
      >
        <SparklesIcon className="size-4" />
        Assinar
        <span className="capitalize">{product.name}</span>
      </div>
      <Loader
        className={cn("size-4 animate-spin hidden", isLoading && "block")}
      />
    </Button>
  );
}
