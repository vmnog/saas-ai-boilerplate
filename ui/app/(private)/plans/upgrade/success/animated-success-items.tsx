"use client";

import logo from "@/assets/logo-light.svg";
import { Confetti } from "@/components/confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CheckoutSession } from "@/http/schemas";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AnimatedSuccessItemsProps {
  session: CheckoutSession | undefined;
}

export function AnimatedSuccessItems({ session }: AnimatedSuccessItemsProps) {
  if (!session) {
    throw new Error("Checkout session not found");
  }

  return (
    <div className="flex w-full flex-col items-center justify-center p-4 sm:p-0">
      <Confetti />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-lg w-full shadow-none border-none">
          <CardContent className="text-center space-y-2">
            <motion.div
              className="flex justify-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Image
                src={logo}
                alt="ACME Logo"
                width={180}
                height={100}
                className="mb-8 mx-auto sm:mx-0 dark:invert"
              />
            </motion.div>
            <motion.div
              className="flex justify-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Image
                src={session.image_url}
                alt={session.name}
                width={180}
                height={100}
                className="size-24 mx-auto rounded-lg"
              />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-primary">
                <span>
                  Bem-vindo ao{" "}
                  <span className="capitalize">{session.name}</span>!
                </span>
              </h1>

              <p className="text-pretty text-xl text-muted-foreground">
                <span>{session.description}</span>
              </p>
            </div>

            <motion.div
              className="bg-muted rounded-lg p-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold mb-2">
                <span>Benefícios Desbloqueados:</span>
              </h2>
              <ul className="text-left space-y-2">
                {session.benefits.split("|").map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.2, duration: 0.3 }}
                  >
                    <CheckCircle2 className="h-5 w-5 min-w-5 text-primary mr-2" />
                    <span className="-mt-1">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <div className="space-y-4">
              <Button className="w-full" asChild>
                <Link href="/chat">
                  Começar a usar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button variant="link" className="w-full" asChild>
                <Link href="/settings/subscription">
                  Gerenciar minha assinatura
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
