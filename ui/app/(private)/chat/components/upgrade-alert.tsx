"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";
import Link from "next/link";

export function UpgradeAlert() {
  return (
    <Alert className="flex flex-col sm:flex-row items-center gap-2 p-6 max-w-2xl mx-auto">
      <div className="flex flex-col">
        <AlertTitle className="font-bold flex items-center gap-2">
          <SparklesIcon className="size-4" />
          Que tal ter acesso ilimitado ao ACME?
        </AlertTitle>
        <AlertDescription className="text-pretty">
          Faça o upgrade do seu plano e tenha acesso a nossas funcionalidades
          exclusivas.
        </AlertDescription>
      </div>

      <Link href="/plans">
        <Button className="w-full sm:w-fit">
          <SparklesIcon className="size-4" />
          Fazer Upgrade
        </Button>
      </Link>
    </Alert>
  );
}
