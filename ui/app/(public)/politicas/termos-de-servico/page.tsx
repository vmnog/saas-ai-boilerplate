import { Logo } from '@/components/logo'

export default function TermosDeServico() {
  return (
    <div className="max-w-screen-lg mx-auto space-y-6 px-6 py-8">
      <Logo />
      <h1 className="text-2xl font-bold">Termos de Uso</h1>
      <div className="space-y-4 [&_strong]:font-semibold [&_strong]:text-foreground">
        <div className="space-y-2">
          <p>
            <strong>Sobre a ACME</strong>
          </p>
          <p>
            Nós da ACME Inc., pessoa jurídica de direito privado, com sede em
            [YOUR ADDRESS], inscrita no CNPJ sob o nº XX.XXX.XXX/XXXX-XX ("ACME"
            ou "Nós"), somos um software que possui o objetivo de otimizar o
            tempo de trabalho empregando ferramentas tecnológicas ("software"),
            e, preocupados com os nossos usuários, através destes termos de uso
            ("Termos de Uso"), apresentamos as nossas e as suas
            responsabilidades na utilização e acesso do nosso software.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>1. O software</strong>
          </p>
          <p>
            Você deve se cadastrar e utilizá-lo conforme os manuais de uso, a
            fim de alcançar os resultados que nos propomos a entregar.
          </p>
          <p>
            Atuamos com base nos dados e informações que Você mesmo(a) insere no
            software.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>2. Como posso me cadastrar no software?</strong>
          </p>
          <p>
            Basta Você acessar nosso website e realizar o cadastro da sua conta,
            pessoal e intransferível, aceitando estes Termos de Uso e nossa
            Política de Privacidade, informando-nos: Nome; E-mail. Na sequência,
            Você terá acesso a diversas informações sobre Nós, como benefícios,
            tutoriais de uso, etc.
          </p>
          <p>
            <strong>Importante!</strong> Para isso Você deverá ser maior de 18
            anos de idade.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>3. Conexão e utilização do software</strong>
          </p>
          <p>
            O seu equipamento deve estar conectado a uma rede de internet.
            Faremos o possível para que o software funcione em todos os momentos
            do seu dia, mas pode ocorrer de o funcionamento ser prejudicado nas
            seguintes hipóteses: Pela forma com que Você utiliza a internet; e
            Por eventuais indisponibilidades técnicas, que independem de Nós.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>4. Pagamentos</strong>
          </p>
          <p>
            Todos os planos deverão ser pagos através de cartão de crédito, com
            exceção do plano gratuito que não requer pagamento. A confirmação do
            pagamento ocorrerá em até 7 (sete) dias úteis, através do envio de
            comunicado ao e-mail do Usuário, já cadastrado no software.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>5. Suas Responsabilidades</strong>
          </p>
          <p>Ao utilizar nosso software, Você:</p>
          <ul className="list-disc pl-6">
            <li>
              Se responsabiliza por inserir os dados corretos, autênticos,
              completos e atualizados;
            </li>
            <li>
              Garante a confidencialidade e se responsabiliza por todas as
              atividades relacionadas ao seu usuário, senha e conta;
            </li>
            <li>
              Se compromete a não utilizar o software para violar a lei,
              direitos de terceiros e as condições aqui previstas;
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p>
            <strong>6. Limites da Nossa Responsabilidade</strong>
          </p>
          <p>
            Nós (e todo e qualquer um de nossos acionistas, funcionários e
            demais pessoais e sociedades relacionadas) não nos responsabilizamos
            por quaisquer danos, diretos ou indiretos, demora ou incapacidade
            que possam advir do uso ou desempenho, regular ou irregular, do
            software por Você.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>7. Proteção de Dados Pessoais</strong>
          </p>
          <p>
            A segurança de seus dados pessoais é muito importante para Nós.
            Assim, tratamos todos os seus dados pessoais com ética e
            transparência, cumprindo com toda a legislação vigente sobre
            segurança da informação, privacidade e proteção de dados.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>8. Propriedade Intelectual</strong>
          </p>
          <p>
            Somos muito apegados à nossa criação ACME, à nossa marca e ao nosso
            nome. Assim, aceitando estes Termos de Uso, Você reconhece e
            concorda que não possui qualquer licença ou cessão de direitos de
            Propriedade Intelectual.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>9. Contato</strong>
          </p>
          <p>
            Para entrar em contato conosco ou esclarecer dúvidas sobre estes
            Termos de Uso, você pode utilizar os seguintes canais:
          </p>
          <ul className="list-disc pl-6">
            <li>
              E-mail:{' '}
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@example.com'}
            </li>
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">
          Termos de Uso atualizados em [DATE]
        </p>
      </div>
    </div>
  )
}
