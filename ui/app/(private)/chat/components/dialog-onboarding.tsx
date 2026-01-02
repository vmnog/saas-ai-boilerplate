"use client";

import { AnimatedShineButton } from "@/components/ui/animated-shine-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { cn } from "@/lib/cn";
import {
  ArrowRight,
  BookIcon,
  FileIcon,
  MessageSquareIcon,
  SparklesIcon,
  TableIcon,
} from "lucide-react";
import { type ReactNode, useState } from "react";

interface StepContent {
  title: string;
  description: string;
  videoSrc: string;
  thumbnailSrc: string;
  actionComponent?: ReactNode;
}

export default function DialogOnboarding() {
  const [step, setStep] = useState(1);

  const stepContent: StepContent[] = [
    {
      title: "Por onde começar?",
      description:
        "Assista ao vídeo introdutório para descobrir como o ACME pode transformar sua rotina clínica, tornando-a mais eficiente e produtiva com nossas ferramentas inovadoras.",
      videoSrc:
        "https://www.youtube.com/embed/SwpN-XAGoZw?si=D_sbuvLSSsPZ7Pp0&amp",
      thumbnailSrc:
        "https://pub-f7a63830c0b34f06ac710fce75e8259b.r2.dev/01_tutorial_completo_thumb.png",
      actionComponent: (
        <Button variant="outline" className="invisible w-full sm:w-fit">
          <SparklesIcon className="mr-2 size-4 text-amber-500" />
          Começar demonstração
        </Button>
      ),
    },
    {
      title: "Análise exames de uma só vez",
      description:
        "Envie múltiplos exames laboratoriais de uma só vez e receba instantaneamente uma análise detalhada e personalizada de cada parâmetro.",
      videoSrc: "https://www.youtube.com/embed/ruW5JLo8aJM?si=x-czDfcvJA5kbnlK",
      thumbnailSrc:
        "https://pub-f7a63830c0b34f06ac710fce75e8259b.r2.dev/02_como_anexar_arquivos_thumb.png",
      actionComponent: (
        <Button variant="outline" className="w-full sm:w-fit">
          <FileIcon className="mr-2 size-4" />
          Experimentar análise de exames
        </Button>
      ),
    },
    {
      title: "Transforme exames em tabelas",
      description:
        "Visualize os resultados dos exames em tabelas organizadas e exporte-as facilmente nos formatos CSV, Excel ou PDF para seus registros e relatórios.",
      videoSrc: "https://www.youtube.com/embed/Fg8YrqSAdT4?si=XrqpTH6WXvamJCyf",
      thumbnailSrc:
        "https://pub-f7a63830c0b34f06ac710fce75e8259b.r2.dev/03_como_user_campo_de_texto.png",
      actionComponent: (
        <Button variant="outline" className="w-full sm:w-fit">
          <TableIcon className="mr-2 size-4" />
          Transformar exames em tabelas
        </Button>
      ),
    },
    {
      title: "Que tal uma ajuda nos estudos?",
      description:
        "Podemos te ajudar com seus estudos, peça explicações sobre qualquer matéria, ajuda para resolver exercícios e dicas para se preparar para vestibulares, concursos e outras provas importantes.",
      videoSrc: "https://www.youtube.com/embed/1T2ejaezqFw?si=vXSUnZzTldnMgcz_",
      thumbnailSrc:
        "https://pub-f7a63830c0b34f06ac710fce75e8259b.r2.dev/04_como_usar_os_atalhos.png",
      actionComponent: (
        <Button variant="outline" className="w-full sm:w-fit">
          <BookIcon className="mr-2 size-4" />
          Começar a estudar com IA
        </Button>
      ),
    },
    {
      title: "Deixe tudo organizado",
      description:
        "Mantenha suas consultas organizadas com histórico completo das conversas. Você pode facilmente renomear, arquivar e acessar todo o histórico quando precisar.",
      videoSrc: "https://www.youtube.com/embed/NeLnBtJSDvU?si=vl9NvLmhCsJ8kMAq",
      thumbnailSrc:
        "https://pub-f7a63830c0b34f06ac710fce75e8259b.r2.dev/05_gerenciador_de_chats.png",
      actionComponent: (
        <Button variant="outline" className="w-full sm:w-fit">
          <MessageSquareIcon className="mr-2 size-4" />
          Gerenciar conversas
        </Button>
      ),
    },
    {
      title: "Utilize gratuitamente por quanto tempo quiser",
      description:
        "Experimente o ACME gratuitamente sem necessidade de cartão de crédito. Para acesso a mais mensagens e recursos exclusivos, conheça o plano ACME Plus.",
      videoSrc: "https://www.youtube.com/embed/nfhDcZ9z0eY?si=XP3sOsueiu1Z_Pfl",
      thumbnailSrc:
        "https://pub-f7a63830c0b34f06ac710fce75e8259b.r2.dev/06_uso_gratis.jpg",
      actionComponent: (
        <Button variant="outline" className="w-full sm:w-fit">
          <SparklesIcon className="mr-2 size-4" />
          Conhecer opções de planos
        </Button>
      ),
    },
  ];

  const totalSteps = stepContent.length;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const currentStep = stepContent[step - 1];

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setStep(1);
      }}
    >
      <DialogTrigger asChild>
        <AnimatedShineButton />
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 [&>button:last-child]:text-white">
        <div className="p-2 w-full h-full">
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc={currentStep.videoSrc}
            thumbnailSrc={currentStep.thumbnailSrc}
            thumbnailAlt={`${currentStep.title} preview`}
          />
        </div>
        <div className="space-y-4 px-6 pb-6 pt-3">
          <DialogHeader>
            <DialogTitle>{currentStep.title}</DialogTitle>
            <DialogDescription>{currentStep.description}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 sm:gap-4">
            {/* {currentStep.actionComponent && currentStep.actionComponent} */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex justify-center space-x-1.5 max-sm:order-1">
                {[...Array(totalSteps)].map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full bg-primary",
                      index + 1 === step ? "bg-primary" : "opacity-20",
                    )}
                  />
                ))}
              </div>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  Voltar
                </Button>
                {step < totalSteps ? (
                  <Button
                    className="group"
                    type="button"
                    onClick={handleContinue}
                  >
                    Próximo
                    <ArrowRight
                      className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Button>
                ) : (
                  <DialogClose asChild>
                    <Button type="button">Concluir</Button>
                  </DialogClose>
                )}
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
