"use client";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";

interface TermsDialogProps {
  userNeedsToAcceptTerms: boolean;
  onAccept(): Promise<void>;
}

export function TermsDialog({
  userNeedsToAcceptTerms,
  onAccept,
}: TermsDialogProps) {
  const [isLoading, startLoading] = useTransition();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(userNeedsToAcceptTerms);
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const totalSteps = 2;

  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight);
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      setHasReadToBottom(false);
    } else {
      startLoading(async () => {
        try {
          await onAccept();
          setOpen(false);
          toast({
            title: "Obrigado por aceitar nossos termos e políticas",
            description: (
              <p>
                Qualquer dúvida ou solicitação entre em{" "}
                <Link
                  className="underline underline-offset-4 font-semibold"
                  href="settings/support"
                >
                  contato com o suporte
                </Link>
              </p>
            ),
          });
        } catch (err) {
          console.error("Error on accepting terms", err);
          toast({
            variant: "destructive",
            title: "Ops! Não foi possível aceitar os termos",
            description: (
              <p>
                Tente novamente mais tarde ou entre em{" "}
                <Link
                  className="underline underline-offset-4 font-semibold"
                  href="settings/support"
                >
                  contato com o suporte
                </Link>
              </p>
            ),
          });
        }
      });
    }
  };

  return (
    <Credenza
      open={open}
      onOpenChange={(open) => {
        if (open) setStep(1);
      }}
    >
      <CredenzaContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        {step === 1 && (
          <CredenzaHeader className="contents space-y-0 text-left">
            <CredenzaTitle className="border-b border-border px-6 py-4 text-base space-x-2 flex items-center justify-between">
              <span>Termos de Uso</span>
              {!hasReadToBottom && (
                <span className="grow text-xs text-muted-foreground max-sm:text-center">
                  Leia até o final antes de aceitar
                </span>
              )}
            </CredenzaTitle>
            <CredenzaBody>
              <ScrollArea
                ref={contentRef}
                onScroll={handleScroll}
                className="max-h-96 overflow-y-auto"
              >
                <CredenzaDescription asChild>
                  <div className="px-6 py-4">
                    <div className="space-y-4 [&_strong]:font-semibold [&_strong]:text-foreground">
                      <div className="space-y-2">
                        <p>
                          <strong>Sobre a ACME</strong>
                        </p>
                        <p>
                          Nós da ACME Inc., pessoa jurídica de direito
                          privado, com sede em [YOUR ADDRESS],
                          inscrita no CNPJ sob o nº XX.XXX.XXX/XXXX-XX
                          ("ACME" ou "Nós"), somos um software que possui o
                          objetivo de otimizar o tempo de trabalho do
                          profissional de saúde empregando ferramentas
                          tecnológicas ("software"), e, preocupados com os
                          nossos usuários, através destes termos de uso ("Termos
                          de Uso"), em conformidade com a Lei 12.965/2014 (Marco
                          Civil da Internet), apresentamos as nossas e as suas
                          responsabilidades na utilização e acesso do nosso
                          software.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>1. O software</strong>
                        </p>
                        <p>
                          Você deve se cadastrar e utilizá-lo conforme os
                          manuais de uso, a fim de alcançar os resultados que
                          nos propomos a entregar.
                        </p>
                        <p>
                          Desde já queremos deixar muito claro: ACME não
                          possui parceria, acordo ou qualquer tipo de
                          relacionamento com fornecedores de prontuário
                          eletrônico. Ou seja, atuamos com base nos dados e
                          informações que Você mesmo(a) insere no software.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>
                            2. Como posso me cadastrar no software?
                          </strong>
                        </p>
                        <p>
                          Basta Você acessar nosso website e realizar o cadastro
                          da sua conta, pessoal e intransferível, aceitando
                          estes Termos de Uso e nossa Política de Privacidade,
                          informando-nos: Nome; Telefone; E-mail. Na sequência,
                          Você terá acesso a diversas informações sobre Nós,
                          como benefícios, tutoriais de uso, etc.
                        </p>
                        <p>
                          <strong>Importante!</strong> Para isso Você deverá (i)
                          ser maior de 18 anos de idade e estar regularmente
                          inscrito no conselho de classe referente à sua
                          atividade profissional.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>3. Conexão e utilização do software</strong>
                        </p>
                        <p>
                          O seu equipamento deve estar conectado a uma rede de
                          internet. Faremos o possível para que o software
                          funcione em todos os momentos do seu dia, mas pode
                          ocorrer de o funcionamento ser prejudicado nas
                          seguintes hipóteses: Pela forma com que Você utiliza a
                          internet; e Por eventuais indisponibilidades técnicas,
                          que independem de Nós.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>4. Pagamentos</strong>
                        </p>
                        <p>
                          Todos os planos deverão ser pagos através de cartão de
                          crédito, com exceção do plano gratuito que não requer
                          pagamento. A confirmação do pagamento ocorrerá em até
                          7 (sete) dias úteis, através do envio de comunicado ao
                          e-mail do Usuário, já cadastrado no software.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>5. Suas Responsabilidades</strong>
                        </p>
                        <p>Ao utilizar nosso software, Você:</p>
                        <ul className="list-disc pl-6">
                          <li>
                            Se responsabiliza por inserir os dados corretos,
                            autênticos, completos e atualizados;
                          </li>
                          <li>
                            Garante a confidencialidade e se responsabiliza por
                            todas as atividades relacionadas ao seu usuário,
                            senha e conta;
                          </li>
                          <li>
                            Se compromete a não utilizar o software para violar
                            a lei, direitos de terceiros e as condições aqui
                            previstas;
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>6. Limites da Nossa Responsabilidade</strong>
                        </p>
                        <p>
                          Nós (e todo e qualquer um de nossos acionistas,
                          funcionários e demais pessoais e sociedades
                          relacionadas) não nos responsabilizamos por quaisquer
                          danos, diretos ou indiretos, demora ou incapacidade
                          que possam advir do uso ou desempenho, regular ou
                          irregular, do software por Você.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>7. Proteção de Dados Pessoais</strong>
                        </p>
                        <p>
                          A segurança de seus dados pessoais é muito importante
                          para Nós. Assim, tratamos todos os seus dados pessoais
                          com ética e transparência, cumprindo com toda a
                          legislação vigente sobre segurança da informação,
                          privacidade e proteção de dados.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>8. Propriedade Intelectual</strong>
                        </p>
                        <p>
                          Somos muito apegados à nossa criação ACME, à nossa
                          marca e ao nosso nome. Assim, aceitando estes Termos
                          de Uso, Você reconhece e concorda que não possui
                          qualquer licença ou cessão de direitos de Propriedade
                          Intelectual.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>9. Contato</strong>
                        </p>
                        <p>
                          Para entrar em contato conosco ou esclarecer dúvidas
                          sobre estes Termos de Uso, você pode utilizar os
                          seguintes canais:
                        </p>
                        <ul className="list-disc pl-6">
                          <li>E-mail: contact@example.com</li>
                          <li>Telefone: [YOUR PHONE]</li>
                          <li>
                            Endereço: [YOUR ADDRESS]
                          </li>
                        </ul>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Termos de Uso atualizados em 20/01/2025
                      </p>
                    </div>
                  </div>
                </CredenzaDescription>
              </ScrollArea>
            </CredenzaBody>
          </CredenzaHeader>
        )}

        {step === 2 && (
          <CredenzaHeader className="contents space-y-0 text-left">
            <CredenzaTitle className="border-b border-border px-6 py-4 text-base space-x-2 flex items-center justify-between">
              <span>Política de Privacidade</span>
              {!hasReadToBottom && (
                <span className="grow text-xs text-muted-foreground max-sm:text-center">
                  Leia até o final antes de aceitar
                </span>
              )}
            </CredenzaTitle>
            <CredenzaBody>
              <ScrollArea
                ref={contentRef}
                onScroll={handleScroll}
                className="max-h-96 overflow-y-auto"
              >
                <CredenzaDescription asChild>
                  <div className="px-6 py-4">
                    <div className="space-y-4 [&_strong]:font-semibold [&_strong]:text-foreground">
                      <p>
                        Prezando pela sua privacidade, nesta Política de
                        Privacidade ("Política de Privacidade"), nós da ACME
                        AI LTDA, pessoa jurídica de direito privado, com sede na
                        [YOUR ADDRESS], inscrita no CNPJ sob o
                        nº XX.XXX.XXX/XXXX-XX ("ACME" ou "Nós"), trazemos
                        informações e esclarecimentos importantes sobre a coleta
                        e o tratamento dos seus dados pessoais ao acessar nosso
                        software ("software"). Demonstraremos quais dos seus
                        dados serão coletados, por qual motivo e como serão
                        protegidos, sempre observando o disposto na Lei Geral de
                        Proteção de Dados Pessoais – Lei Federal n. 13.709/18.
                      </p>

                      <div className="space-y-2">
                        <p>
                          <strong>
                            1. Quais dados pessoais coletamos e por quê?
                          </strong>
                        </p>
                        <p>
                          Para que possamos assegurar e customizar a sua
                          experiência no nosso App, podemos coletar os seguintes
                          dados pessoais:
                        </p>
                        <ul className="list-disc pl-6">
                          <li>
                            Nome, telefone e e-mail;
                            <br />
                            <span className="text-sm text-muted-foreground">
                              Finalidade: Cadastro no software, contato conosco
                              e recebimento de materiais publicitários,
                              auxiliando-nos em sua identificação e
                              individualização.
                            </span>
                          </li>
                          <li>
                            Dados profissionais: profissão, número de registro
                            no conselho de classe e especialidades;
                            <br />
                            <span className="text-sm text-muted-foreground">
                              Finalidade: validar situação de regularidade para
                              exercício da profissão declarada.
                            </span>
                          </li>
                          <li>
                            Dados do cartão de crédito e informações
                            financeiras;
                            <br />
                            <span className="text-sm text-muted-foreground">
                              Finalidade: Processar pagamentos.
                            </span>
                          </li>
                          <li>
                            Dados de acesso – log in/log out (ex.: horário,
                            localização, IP e meio de acesso);
                            <br />
                            <span className="text-sm text-muted-foreground">
                              Finalidade: Identificação do Usuário, evitando,
                              assim, que ocorram fraudes.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>
                            2. Quem realiza o tratamento dos seus dados
                            pessoais?
                          </strong>
                        </p>
                        <p>O tratamento é realizado por diversas pessoas:</p>
                        <ul className="list-disc pl-6">
                          <li>
                            A Controladora, responsável por tomar as decisões
                            referentes ao tratamento dos dados, é a ACME, já
                            qualificada acima;
                          </li>
                          <li>
                            Nosso Operador, membro especializado do setor de
                            tecnologia de informação, possuindo toda a
                            experiência necessária para o tratamento de seus
                            dados pessoais e adotando as medidas de segurança
                            cabíveis;
                          </li>
                          <li>
                            O Encarregado, responsável por atuar como um canal
                            de comunicação entre Nós, Você e a Autoridade
                            Nacional de Proteção de Dados (ANPD).
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>
                            3. Com quem compartilhamos os seus dados pessoais?
                          </strong>
                        </p>
                        <p>
                          Nós não emprestamos ou vendemos os seus dados pessoais
                          para ninguém. No entanto, podemos compartilhá-los -
                          quando realmente necessário - com parceiros,
                          prestadores de serviços, autoridades competentes e
                          fornecedores de tecnologia, sempre visando ao seu
                          próprio interesse e para fins legítimos, nos limites
                          das finalidades aqui contidas.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>
                            4. Por quanto tempo os seus dados pessoais serão
                            armazenados?
                          </strong>
                        </p>
                        <p>
                          Pelo tempo necessário para cumprirmos com as
                          finalidades para as quais os coletamos. Na maioria dos
                          casos manteremos os seus dados por até 02 (dois) anos
                          após a nossa última interação com Você. No entanto,
                          poderemos manter os seus dados por um período maior se
                          previsto em lei.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>
                            5. Como funciona a segurança da ACME quanto aos
                            seus dados pessoais?
                          </strong>
                        </p>
                        <p>
                          Nós utilizamos modernos instrumentos técnicos para
                          manutenção de seus dados pessoais de forma segura,
                          restrita e confidencial, incluindo métodos de
                          criptografia e proteção contra acessos não
                          autorizados.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>
                            6. Quais são os seus direitos como titular de dados?
                          </strong>
                        </p>
                        <p>
                          Você possui o direito de requerer, a qualquer tempo, a
                          confirmação, correção, modificação, portabilidade,
                          eliminação, informações de compartilhamento e acesso a
                          seus dados pessoais, o que será analisado e ponderado
                          por Nós para a tomada das medidas necessárias.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>
                            7. Como posso contatar a ACME para falar sobre os
                            meus Dados Pessoais?
                          </strong>
                        </p>
                        <p>
                          Para mais informações acerca do tratamento de dados
                          pessoais, entre em contato conosco através dos
                          seguintes canais:
                        </p>
                        <ul className="list-disc pl-6">
                          <li>E-mail: contact@example.com</li>
                          <li>Telefone: [YOUR PHONE]</li>
                          <li>
                            Endereço: [YOUR ADDRESS]
                          </li>
                        </ul>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Política de Privacidade atualizada em 22/01/2025
                      </p>
                    </div>
                  </div>
                </CredenzaDescription>
              </ScrollArea>
            </CredenzaBody>
          </CredenzaHeader>
        )}

        <CredenzaFooter className="flex flex-col-reverse sm:flex-row border-t border-border px-6 py-4 sm:items-center">
          <div className="sm:mr-auto flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full bg-primary",
                    index + 1 === step ? "bg-primary" : "opacity-20",
                  )}
                />
              ))}
            </div>
          </div>
          {step > 1 && (
            <Button
              onClick={() => setStep((step) => step - 1)}
              type="button"
              variant="ghost"
            >
              Voltar
            </Button>
          )}
          <Button
            disabled={!hasReadToBottom || isLoading}
            className="group"
            type="button"
            onClick={handleContinue}
          >
            {isLoading ? (
              <Loader2 className="size-5" />
            ) : (
              <>
                Eu aceito
                <ArrowRight
                  className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </>
            )}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
