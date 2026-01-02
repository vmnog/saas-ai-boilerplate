import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export default function FAQPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Perguntas Frequentes</h3>
                <p className="text-sm text-muted-foreground">
                    Respostas para as dúvidas mais comuns sobre o ACME.
                </p>
            </div>
            <Separator />

            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Como inicio uma nova conversa com o ACME?</AccordionTrigger>
                    <AccordionContent>
                        Para iniciar uma nova conversa, clique no botão 'Nova Conversa' no canto superior esquerdo da tela. Em seguida, digite sua pergunta ou solicitação médica na caixa de texto na parte inferior da tela e pressione 'Enter' ou clique no botão de enviar.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>O ACME pode fornecer diagnósticos?</AccordionTrigger>
                    <AccordionContent>
                        O ACME foi projetado para auxiliar profissionais médicos, fornecendo informações e sugestões com base nos dados inseridos. No entanto, ele não fornece diagnósticos definitivos. Sempre use seu julgamento profissional e considere as respostas do ACME como informações complementares.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>Como envio exames ou arquivos em anexo?</AccordionTrigger>
                    <AccordionContent>
                        Para enviar um arquivo em anexo, clique no ícone de clipe de papel ao lado da caixa de mensagem. Você pode selecionar múltiplos arquivos como PDFs, documentos do Word, apresentações e arquivos de texto. Os arquivos serão analisados e incluídos no contexto da conversa para uma resposta mais precisa.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger>Como posso arquivar e gerenciar minhas conversas?</AccordionTrigger>
                    <AccordionContent>
                        Para arquivar uma conversa, clique no menu de opções (três pontos) ao lado da conversa e selecione 'Arquivar'. Todas as conversas arquivadas podem ser acessadas na seção 'Chats Arquivados' nas configurações. Arquivar conversas ajuda a manter seu histórico organizado, facilitando encontrar conversas importantes posteriormente e mantendo sua lista principal de chats mais limpa e focada nas conversas atuais. Você pode restaurar ou excluir permanentemente conversas arquivadas a qualquer momento.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                    <AccordionTrigger>Como renomeio o título de uma conversa?</AccordionTrigger>
                    <AccordionContent>
                        Para renomear uma conversa, clique no menu de opções (três pontos) ao lado da conversa e selecione 'Renomear'. Digite o novo título desejado e confirme. O título será atualizado imediatamente, ajudando você a identificar melhor o conteúdo de cada conversa.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                    <AccordionTrigger>Minha conversa com o ACME é confidencial?</AccordionTrigger>
                    <AccordionContent>
                        Sim, todas as conversas com o ACME são confidenciais e criptografadas. Aderimos a rigorosos padrões de proteção de dados médicos. No entanto, sempre certifique-se de estar usando o ACME em um ambiente privado e evite inserir informações específicas de identificação do paciente.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                    <AccordionTrigger>Como obtenho suporte técnico se estiver tendo problemas com o ACME?</AccordionTrigger>
                    <AccordionContent>
                        Para suporte técnico, visite nossa página 'Contato com Suporte' no menu de configurações. Lá você encontrará nosso endereço de e-mail de suporte e instruções sobre como entrar em contato com nossa equipe de suporte dedicada.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

