import preview from '@/assets/preview.png'
import { Logo } from '@/components/logo'
import { ArrowRight, BookOpen, Bot, Brain } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ACME | AI-Powered Chat Assistant',
  description:
    'The ideal platform for professionals, offering AI-powered support for quick consultations and continuous learning.',
  keywords: 'ai assistant, chatbot, virtual assistant, ai chat, saas',
  openGraph: {
    title: 'ACME | AI-Powered Chat Assistant',
    description:
      'The ideal platform for professionals, offering AI-powered support for quick consultations and continuous learning.',
    type: 'website',
    locale: 'pt-BR',
    images: [
      {
        url: 'assets/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'ACME Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACME | AI-Powered Chat Assistant',
    description:
      'The ideal platform for professionals, offering AI-powered support for quick consultations and continuous learning.',
  },
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-black text-foreground text-balance text-center sm:text-start bg-fixed bg-cover bg-center flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 lg:py-24">
        <div className="relative grid gap-12 sm:grid-cols-[400px_1fr] xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <Logo className="mb-8 mx-auto sm:mx-0" />
              <h1 className="text-4xl font-bold md:leading-tight tracking-tighter md:text-5xl lg:text-6xl">
                Seu assistente médico
                <span className="text-blue-500"> potencializado por IA</span>
              </h1>
              <p className="hidden sm:block text-lg text-muted-foreground md:text-xl">
                A plataforma ideal para profissionais e estudantes <br />
                especializados na área da saúde.
              </p>
              <p className="block sm:hidden text-balance text-lg text-muted-foreground md:text-xl">
                A plataforma ideal para profissionais da área da saúde.
              </p>
            </div>
            <div className="text-start mx-auto grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <Brain className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold">IA Especializada</h3>
                  <p className="text-sm text-muted-foreground">
                    Tecnologia de ponta para suporte médico
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Bot className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Respostas Precisas</h3>
                  <p className="text-sm text-muted-foreground">
                    Suporte baseado em evidências científicas
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex items-start gap-2">
                <BookOpen className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Educação Contínua</h3>
                  <p className="text-sm text-muted-foreground">
                    Atualizações constantes da literatura médica
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-8 border-t border-gray-700/70 pt-8">
              <p className="text-lg text-balance">
                Quer melhorar sua{' '}
                <span className="text-blue-500">prática clínica</span> <br />{' '}
                com <span className="text-blue-500">suporte inteligente</span>?
              </p>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors shadow-2xl shadow-blue-600 hover:bg-blue-600 "
              >
                Comece agora gratuitamente
                <ArrowRight className="h-4 w-4 animate-move" />
              </Link>
            </div>
          </div>
          <div className="relative w-full">
            <div className="aspect-square">
              <Image
                src={preview}
                alt="ACME Interface"
                fill
                className="object-contain xl:object-cover z-10"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 -right-6 -top-6 z-0 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:to-purple-500/10 blur-2xl" />
          </div>
        </div>
      </main>
      <footer className="mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>ACME Inc. All rights reserved. &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
