import { Logo } from '@/components/logo'

export default function PoliticaDePrivacidade() {
  return (
    <div className="max-w-screen-lg mx-auto space-y-6 px-6 py-8">
      <Logo />
      <h1 className="text-2xl font-bold">Política de Privacidade</h1>
      <div className="space-y-4 [&_strong]:font-semibold [&_strong]:text-foreground">
        <p>
          Prezando pela sua privacidade, nesta Política de Privacidade
          ("Política de Privacidade"), nós da ACME Inc., pessoa jurídica de
          direito privado, com sede em [YOUR ADDRESS], inscrita no CNPJ sob o nº
          XX.XXX.XXX/XXXX-XX ("ACME" ou "Nós"), trazemos informações e
          esclarecimentos importantes sobre a coleta e o tratamento dos seus
          dados pessoais ao acessar nosso software ("software"). Demonstraremos
          quais dos seus dados serão coletados, por qual motivo e como serão
          protegidos.
        </p>

        <div className="space-y-2">
          <p>
            <strong>1. Quais dados pessoais coletamos e por quê?</strong>
          </p>
          <p>
            Para que possamos assegurar e customizar a sua experiência no nosso
            App, podemos coletar os seguintes dados pessoais:
          </p>
          <ul className="list-disc pl-6">
            <li>
              Nome e e-mail;
              <br />
              <span className="text-sm text-muted-foreground">
                Finalidade: Cadastro no software, contato conosco e recebimento
                de materiais publicitários, auxiliando-nos em sua identificação
                e individualização.
              </span>
            </li>
            <li>
              Dados do cartão de crédito e informações financeiras;
              <br />
              <span className="text-sm text-muted-foreground">
                Finalidade: Processar pagamentos.
              </span>
            </li>
            <li>
              Dados de acesso – log in/log out (ex.: horário, localização, IP e
              meio de acesso);
              <br />
              <span className="text-sm text-muted-foreground">
                Finalidade: Identificação do Usuário, evitando, assim, que
                ocorram fraudes.
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p>
            <strong>
              2. Quem realiza o tratamento dos seus dados pessoais?
            </strong>
          </p>
          <p>O tratamento é realizado por diversas pessoas:</p>
          <ul className="list-disc pl-6">
            <li>
              A Controladora, responsável por tomar as decisões referentes ao
              tratamento dos dados, é a ACME, já qualificada acima;
            </li>
            <li>
              Nosso Operador, membro especializado do setor de tecnologia de
              informação, possuindo toda a experiência necessária para o
              tratamento de seus dados pessoais e adotando as medidas de
              segurança cabíveis;
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p>
            <strong>3. Com quem compartilhamos os seus dados pessoais?</strong>
          </p>
          <p>
            Nós não emprestamos ou vendemos os seus dados pessoais para ninguém.
            No entanto, podemos compartilhá-los - quando realmente necessário -
            com parceiros, prestadores de serviços, autoridades competentes e
            fornecedores de tecnologia, sempre visando ao seu próprio interesse
            e para fins legítimos, nos limites das finalidades aqui contidas.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>
              4. Por quanto tempo os seus dados pessoais serão armazenados?
            </strong>
          </p>
          <p>
            Pelo tempo necessário para cumprirmos com as finalidades para as
            quais os coletamos. Na maioria dos casos manteremos os seus dados
            por até 02 (dois) anos após a nossa última interação com Você. No
            entanto, poderemos manter os seus dados por um período maior se
            previsto em lei.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>
              5. Como funciona a segurança da ACME quanto aos seus dados
              pessoais?
            </strong>
          </p>
          <p>
            Nós utilizamos modernos instrumentos técnicos para manutenção de
            seus dados pessoais de forma segura, restrita e confidencial,
            incluindo métodos de criptografia e proteção contra acessos não
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
            Você possui o direito de requerer, a qualquer tempo, a confirmação,
            correção, modificação, portabilidade, eliminação, informações de
            compartilhamento e acesso a seus dados pessoais, o que será
            analisado e ponderado por Nós para a tomada das medidas necessárias.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>
              7. Como posso contatar a ACME para falar sobre os meus Dados
              Pessoais?
            </strong>
          </p>
          <p>
            Para mais informações acerca do tratamento de dados pessoais, entre
            em contato conosco através dos seguintes canais:
          </p>
          <ul className="list-disc pl-6">
            <li>
              E-mail:{' '}
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@example.com'}
            </li>
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">
          Política de Privacidade atualizada em [DATE]
        </p>
      </div>
    </div>
  )
}
