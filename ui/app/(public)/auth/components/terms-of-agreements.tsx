import Link from "next/link"

export function TermsOfAgreements() {
    return (
        <p className="px-8 text-center text-sm text-muted-foreground text-balance">
            Ao continuar, você concorda com nossos{" "}
            <Link
                href="/politicas/termos-de-servico"
                className="underline underline-offset-4 hover:text-primary"
            >
                Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link
                href="/politicas/politica-de-privacidade"
                className="underline underline-offset-4 hover:text-primary"
            >
                Política de Privacidade
            </Link>
            .
        </p>
    )
}