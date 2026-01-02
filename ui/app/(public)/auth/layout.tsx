import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'
import { Toaster } from '@/components/ui/toaster'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthenticated } from './actions'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    if (isAuthenticated()) {
        redirect('/chat')
    }

    return (
        <>
            <div className="bg-background relative min-h-dvh grid grid-cols-1 items-center justify-center p-4 sm:p-0 lg:grid-cols-2">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-foreground dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                    <Link href="/" className="z-10">
                        <Image src={logoDark} alt="ACME" className="w-32" />
                    </Link>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg text-white">
                                &ldquo;Não consigo imaginar trabalhar com meus pacientes sem esta ferramenta.
                                É um verdadeiro divisor de águas, proporcionando diagnósticos precisos e economizando horas de trabalho.&rdquo;
                            </p>
                            <footer className="text-sm text-gray-400">Dr. Marcio Mattos</footer>
                        </blockquote>
                    </div>
                </div>
                <div className="flex flex-col gap-4 items-center justify-center w-full">
                    <Link href="/" className="z-10">
                        <Image src={logoLight} alt="ACME" className="w-32 dark:invert" />
                    </Link>
                    {children}
                </div>
            </div>
            <Toaster />
        </>
    )
}