import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TriangleAlertIcon } from "lucide-react"
import Link from "next/link"
import { TermsOfAgreements } from "../components/terms-of-agreements"
import { UserAuthForm } from "./user-auth-form"

interface SignInPageProps {
    searchParams: {
        code?: string
    }
}

export default function SignInPage({ searchParams }: SignInPageProps) {
    const errorCodes = ['jwt-expired', 'no-token', 'server-error']

    return (
        <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[400px]">
            {errorCodes.includes(searchParams.code ?? '') && (
                <Link href="/auth/sign-in">
                    <Alert variant="destructive">
                        <TriangleAlertIcon className="h-4 w-4" />
                        <AlertTitle>
                            {searchParams.code === 'jwt-expired' && 'Sua sessão expirou'}
                            {searchParams.code === 'no-token' && 'Você precisa estar logado para acessar esta página'}
                            {searchParams.code === 'server-error' && 'Estamos enfrentando alguns problemas técnicos, por favor, tente novamente mais tarde.'}
                        </AlertTitle>
                        <AlertDescription>
                            Por favor, faça login novamente.
                        </AlertDescription>
                    </Alert>
                </Link>
            )}
            <UserAuthForm />
            <TermsOfAgreements />
        </div>
    )
}