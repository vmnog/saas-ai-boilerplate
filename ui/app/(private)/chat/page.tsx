import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { createThread, getSubscription } from "@/http/api-server";
import { FileIcon, HeartPulse, NotepadTextIcon, UsersIcon } from "lucide-react";
import { revalidateTag } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import DialogOnboarding from "./components/dialog-onboarding";
import { SendMessage } from "./components/send-message";
import { UpgradeAlert } from "./components/upgrade-alert";

export default async function NewChatPage() {
  const subscription = await getSubscription({
    next: {
      tags: ["subscription"],
    },
  });

  if (subscription.product.monthlyPrice === null) {
    throw new Error("Could not fetch user subscription product monthlyPrice ");
  }

  async function onAddMessage() {
    "use server";
    const thread = await createThread({
      next: {
        tags: ["last-created-thread"],
      },
    });
    revalidateTag("threads");
    redirect(`/chat/${thread.openaiThreadId}?start=true`);
  }

  async function onUpdateLastMessage() {
    "use server";
    console.log("onUpdateLastMessage");
  }

  async function onThreadCompleted() {
    "use server";
    console.log("onThreadCompleted");
  }

  async function onAddMessageFails() {
    "use server";
    console.log("onAddMessageFails");
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 sm:gap-4 min-h-dvh pb-14 px-4 sm:px-0">
      <DialogOnboarding />
      <TextEffect
        per="word"
        preset="slide"
        as="h1"
        className="text-4xl font-bold text-primary"
      >
        Como posso ajudar?
      </TextEffect>
      <SendMessage
        openaiThreadId={null}
        onAddMessage={onAddMessage}
        onUpdateLastMessage={onUpdateLastMessage}
        onThreadCompleted={onThreadCompleted}
        onAddMessageFails={onAddMessageFails}
      />
      {subscription.product.monthlyPrice === 0 && <UpgradeAlert />}
      <ActionButtons />
    </div>
  );
}

const actions = [
  {
    icon: <UsersIcon className="size-4 text-pink-500" />,
    text: "Consulta Clínica",
    message:
      "Atue como assistente clínico para me ajudar durante uma consulta. Faça perguntas relevantes e sugira abordagens baseadas nas informações que eu fornecer sobre o paciente. Se eu compartilhar algum arquivo ou exame, por favor considere essas informações na análise.",
  },
  {
    icon: <HeartPulse className="size-4 text-indigo-500" />,
    text: "Análise de Caso",
    message:
      "Me ajude a analisar este caso clínico de forma estruturada, considerando: 1) Sintomas principais 2) História pregressa 3) Exame físico 4) Resultados de exames anexados 5) Diagnósticos diferenciais 6) Plano terapêutico sugerido. Analise quaisquer arquivos que eu compartilhar durante nossa discussão.",
  },
  {
    icon: <FileIcon className="size-4 text-amber-500" />,
    text: "Análisar Exames",
    message:
      "Analise os exames e documentos que vou compartilhar, destacando: 1) Valores alterados e sua relevância 2) Correlações clínicas importantes 3) Comparação com exames anteriores, se disponíveis 4) Sugestões de investigações complementares. Por favor, considere o contexto clínico que eu fornecer.",
  },
  {
    icon: <NotepadTextIcon className="size-4 text-green-500" />,
    text: "Revisão Científica",
    message:
      "Forneça uma análise baseada em evidências sobre este caso/condição, incluindo: 1) Guidelines atuais 2) Estudos relevantes dos últimos 5 anos 3) Meta-análises disponíveis 4) Recomendações práticas. Se eu compartilhar artigos ou documentos, por favor os inclua na análise.",
  },
];

function ActionButtons() {
  return (
    <div className="flex sm:flex-row w-full gap-2 sm:gap-4">
      {actions.map(({ icon, text, message }) => (
        <Button
          key={text}
          asChild
          variant="outline"
          className="w-full rounded-full flex items-center md:items-start gap-2 text-left h-fit"
        >
          <Link href={`/chat?text=${message}`}>
            {icon}
            <span className="hidden sm:block whitespace-nowrap text-xs">
              {text}
            </span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
