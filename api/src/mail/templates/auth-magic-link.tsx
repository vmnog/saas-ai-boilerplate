import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  Img,
  Link,
} from "@react-email/components";
import { env } from "@/env";

interface AuthMagicLinkMailProps {
  authUrl: string;
}

export const AuthMagicLinkMail = ({
  authUrl,
}: AuthMagicLinkMailProps) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const squareLogoUrl = env.EMAIL_LOGO_SQUARE_URL;
  const logoUrl = env.EMAIL_LOGO_URL;

  return (
    <Html>
      <Head />
      <Preview>Seu Código de Acesso do ACME</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite text-base font-sans">
          <Container className="bg-white p-45">
            {squareLogoUrl && (
              <Img
                src={squareLogoUrl}
                width="80"
                height="80"
                alt="ACME"
                className="mb-8 mx-auto"
              />
            )}

            <Heading className="text-center my-0 leading-8">
              Você solicitou acesso ao ACME!
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  Para acessar sua conta, por favor utilize o link do botão
                  abaixo:
                </Text>

                <Section className="text-center">
                  <Text className="text-2xl font-medium bg-brand text-white rounded-md py-3 px-[18px] inline-block">
                    <Link className="text-white" href={authUrl}>Clique aqui para acessar</Link>
                  </Text>
                </Section>

                <Text className="text-sm text-gray-500 mt-2 text-center">
                  Se o botão não funcionar, copie e cole este link no seu navegador:<br />
                  {authUrl}
                </Text>

                <Text className="text-base">
                  Se você não solicitou este acesso, por favor ignore este
                  e-mail.
                </Text>

                <Text className="text-base">
                  Estamos ansiosos para ajudá-lo(a) com suas necessidades.
                  Se precisar de qualquer assistência, não hesite em nos
                  contatar.
                </Text>

                <Text className="mt-12 text-base">Atenciosamente,</Text>

                <Text className="text-base">Equipe ACME</Text>

                <Text className="text-sm text-gray-500">
                  Acesso solicitado em {currentDate}
                </Text>

                {logoUrl && (
                  <Img
                    src={logoUrl}
                    width="192"
                    height="40"
                    alt="ACME"
                    className="my-8"
                  />
                )}
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

AuthMagicLinkMail.PreviewProps = {
  authUrl: `${process.env.WEB_URL}/auth/authenticate?code=123`,
} satisfies AuthMagicLinkMailProps;

export default AuthMagicLinkMail;