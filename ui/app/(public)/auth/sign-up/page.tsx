import { TermsOfAgreements } from "../components/terms-of-agreements"
import { UserAuthForm } from "./user-auth-form"

export default function SignUpPage() {
    return (
        <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Criar uma conta
                </h1>
                <p className="text-sm text-muted-foreground">
                    Preencha os campos abaixo para se cadastrar
                </p>
            </div>
            <UserAuthForm />
            <TermsOfAgreements />
        </div>
    )
}