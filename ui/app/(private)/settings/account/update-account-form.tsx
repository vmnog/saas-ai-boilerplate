'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Profile } from "@/http/schemas"
import { cn } from "@/lib/cn"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const UpdateFormSchema = z.object({
    name: z.string({ required_error: "Nome é obrigatório" }).min(1, { message: "Nome é obrigatório" }),
    // email: z.string({ required_error: "E-mail é obrigatório" }).email({ message: "E-mail inválido" }).min(1, { message: "E-mail é obrigatório" })
})

interface UpdateAccountFormProps {
    profile: Profile
    handleUpdateProfile: (data: z.infer<typeof UpdateFormSchema>) => Promise<void>
}

export function UpdateAccountForm({ profile, handleUpdateProfile }: UpdateAccountFormProps) {
    const [isLoading, startLoadingTransition] = useTransition()
    const [dialogOpen, setDialogOpen] = useState(false)
    const { toast } = useToast()

    const updateForm = useForm<z.infer<typeof UpdateFormSchema>>({
        resolver: zodResolver(UpdateFormSchema),
        defaultValues: {
            name: profile.name,
            // email: profile.email
        }
    })

    async function onSubmitUpdateAccount(data: z.infer<typeof UpdateFormSchema>) {
        startLoadingTransition(async () => {
            await handleUpdateProfile(data)
            setDialogOpen(false)
            updateForm.reset()
            toast({
                title: "Informações atualizadas com sucesso!",
                description: "As informações foram atualizadas com sucesso.",
            })
        })
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Nome completo</p>
                        <p className="text-sm text-muted-foreground capitalize">{profile.name}</p>
                    </div>
                    <Button disabled={isLoading} variant="ghost">Atualizar</Button>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Atualizar informações</DialogTitle>
                    <DialogDescription>
                        Atualize suas informações pessoais abaixo.
                    </DialogDescription>
                </DialogHeader>
                <Form {...updateForm}>
                    <form onSubmit={updateForm.handleSubmit(onSubmitUpdateAccount)} className="space-y-4 py-4">
                        <FormField
                            control={updateForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Seu nome completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={updateForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Seu melhor e-mail" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button disabled={isLoading} type="button" variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button
                                onClick={updateForm.handleSubmit(onSubmitUpdateAccount)}
                                type="submit"
                                disabled={isLoading}
                                className="relative"
                            >
                                <span className={cn("text-sm", isLoading && "invisible")}>Salvar alterações</span>
                                {isLoading && <Loader className="size-4 animate-spin absolute" />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}