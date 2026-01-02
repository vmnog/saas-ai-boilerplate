"use client";

import logoLight from "@/assets/logo-light.svg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-8 text-center bg-background">
      <Link href="/">
        <Image src={logoLight} alt="ACME" className="w-32 dark:invert" />
      </Link>

      <span className="font-serif font-bold text-[10rem] leading-none">
        Ops!
      </span>

      <div className="space-y-2 max-w-sm">
        <p className="max-w-120 leading-relaxed">
          Algum erro inesperado ocorreu em nosso sistema, estaremos corrigindo o
          mais breve possível.
        </p>
        <p className="text-sm text-muted-foreground">
          Se possível, envie um feedback para nós através do email{" "}
          <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com"}`}>
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com"}
          </a>.
        </p>
      </div>
      <Button asChild>
        <Link href="/chat">Voltar ao Início</Link>
      </Button>
    </div>
  );
}
