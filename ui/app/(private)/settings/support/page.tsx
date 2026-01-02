import { Separator } from "@/components/ui/separator"
import { BookOpen, Clock, ExternalLink, Mail } from "lucide-react"
import Link from "next/link"

export default function SupportContactPage() {
    return (
        <div className="container mx-auto space-y-6">
            <div>
                <h3 className="text-lg font-medium">Como entrar em contato conosco?</h3>
                <p className="text-sm text-muted-foreground">
                    Para obter assistência, por favor, siga as instruções abaixo:
                </p>
            </div>
            <Separator />
            <div className="space-y-8">
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold">Passos para obter suporte:</h3>
                    <ol className="list-decimal list-inside space-y-4">
                        <ContactStep
                            icon={<BookOpen className="h-5 w-5 text-primary" />}
                            content={
                                <>
                                    Verifique nossa{" "}
                                    <Link href="/settings/faq" className="text-primary hover:underline font-medium">
                                        base de conhecimento
                                    </Link>{" "}
                                    para respostas rápidas às perguntas mais comuns.
                                </>
                            }
                        />
                        <ContactStep
                            icon={<Mail className="h-5 w-5 text-primary" />}
                            content="Se você não encontrar a resposta que procura, entre em contato com nossa equipe de suporte via email."
                        />
                        <ContactStep
                            icon={<ExternalLink className="h-5 w-5 text-primary" />}
                            content="Ao enviar um email, inclua detalhes específicos sobre seu problema ou dúvida para que possamos ajudá-lo mais eficientemente."
                        />
                    </ol>
                </section>

                <Separator />

                <section className="space-y-4">
                    <h3 className="text-lg font-semibold">Informações de Contato</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <ContactInfo
                            icon={<Mail className="h-5 w-5 text-primary" />}
                            title="Email de Suporte"
                            content={
                                <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com"}`} className="text-primary hover:underline flex items-center">
                                    {process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com"}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            }
                        />
                        <ContactInfo
                            icon={<Clock className="h-5 w-5 text-primary" />}
                            title="Horário de Atendimento"
                            content={
                                <>
                                    <p>Segunda a sexta, das 9h às 18h</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Faremos o possível para responder a todas as solicitações dentro de 24 horas úteis.
                                    </p>
                                </>
                            }
                        />
                    </div>
                </section>
            </div>
        </div>
    )
}

function ContactStep({ icon, content }) {
    return (
        <li className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="bg-primary/10 p-2 rounded-full mt-1">{icon}</div>
            <span className="text-base">{content}</span>
        </li>
    )
}

function ContactInfo({ icon, title, content }) {
    return (
        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
            <div>
                <p className="font-medium">{title}</p>
                <div className="text-sm text-muted-foreground">{content}</div>
            </div>
        </div>
    )
}

