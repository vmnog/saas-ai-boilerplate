import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export default function EmailConfirmationPage() {
    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex w-full items-center justify-center px-4">
                <div className="max-w-md space-y-6">
                    <div className="flex items-center justify-center">
                        <div className="rounded-full bg-muted p-3">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">E-mail Enviado</h1>
                        <p className="text-sm text-muted-foreground text-balance">
                            Verifique sua caixa de entrada e siga as instruções para concluir o processo.
                        </p>
                    </div>
                    <div className="rounded-lg bg-muted p-4 text-sm text-foreground text-center">
                        <p>
                            Não recebeu? Verifique sua pasta de spam.
                        </p>
                    </div>
                    <Link href="/auth/sign-in" passHref>
                        <Button className="w-full mt-6">
                            Voltar
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}