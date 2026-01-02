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

const signUpSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    email: z.string().email({
        message: "Por favor, insira um endereço de e-mail válido.",
    }),
})

type SignUpSchema = z.infer<typeof signUpSchema>

export function UserAuthForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    })

    async function onSubmit(values: SignUpSchema) {
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            if (!response.ok || response.status !== 201) {
                const errorData = await response.json()
                toast({
                    variant: "destructive",
                    title: "Não foi possível cadastrar",
                    description: errorData.message || 'Ocorreu um erro ao processar o cadastro.',
                })
                return
            }

            const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: values.email }),
            })

            if (!authResponse.ok) {
                const errorData = await authResponse.json()
                toast({
                    variant: "destructive",
                    title: "Ops! Algo de errado aconteceu",
                    description: errorData.message || 'Ocorreu um erro ao enviar o e-mail de confirmação.',
                })
                return
            }

            toast({
                title: "Cadastro realizado com sucesso!",
                description: "Um e-mail de confirmação foi enviado.",
            })
            router.push('/auth/email-confirmation')
        } catch (_error) {
            toast({
                variant: "destructive",
                title: "Ops! Algo de errado aconteceu",
                description: 'Ocorreu um erro ao processar o cadastro.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Seu nome completo"
                                        type="text"
                                        autoCapitalize="words"
                                        autoComplete="name"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                        Cadastrar
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
                <Link href="/auth/sign-in">
                    Já tem uma conta? Entrar
                </Link>
            </Button>
        </div>
    )
}

