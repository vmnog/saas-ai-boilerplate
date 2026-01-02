'use client'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from 'react'
import { useForm } from "react-hook-form"
import * as z from 'zod'

const signInSchema = z.object({
    email: z.string().email({
        message: "Por favor, insira um endereço de e-mail válido.",
    }),
})

type SignInSchema = z.infer<typeof signInSchema>

export function UserAuthForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: SignInSchema) {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: values.email }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                toast({
                    variant: "destructive",
                    title: "Não foi possível enviar o e-mail de autenticação",
                    description: errorData.message || 'Ocorreu um erro ao enviar o e-mail de autenticação.',
                })
                return
            }

            toast({
                title: "E-mail de autenticação enviado!",
                description: "Um e-mail de autenticação foi enviado.",
            })
            router.push('/auth/email-confirmation')
        } catch (_error) {
            toast({
                variant: "destructive",
                title: "Ops! Algo de errado aconteceu",
                description: 'Ocorreu um erro ao enviar o e-mail de autenticação.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Entrar na sua conta
                </h1>
                <p className="text-sm text-muted-foreground">
                    Digite seu e-mail para receber um link de autenticação
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="nome@exemplo.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-full" disabled={isLoading}>
                        {isLoading && (
                            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Entrar
                    </Button>
                </form>
            </Form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Ou
                    </span>
                </div>
            </div>
            <Button asChild variant="link" type="button" disabled={isLoading}>
                <Link href="/auth/sign-up">
                    Não tem uma conta? Cadastre-se
                </Link>
            </Button>
        </div>
    )
}

