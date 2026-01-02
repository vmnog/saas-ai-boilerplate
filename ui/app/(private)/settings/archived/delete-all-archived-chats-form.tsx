'use client'

import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { Loader } from "lucide-react";
import { useState, useTransition } from "react";

const DeleteFormSchema = z.object({
    confirmation: z.string({ required_error: "Frase de confirmação é obrigatória" }).refine(val => val === "excluir todos arquivados", {
        message: "Digite exatamente 'excluir todos arquivados' para confirmar."
    })
})

interface DeleteAllArchivedChatsFormProps {
    onDeleteAllArchivedChats: () => Promise<void>
    archivedThreadsIsEmpty: boolean
}

export function DeleteAllArchivedChatsForm({ onDeleteAllArchivedChats, archivedThreadsIsEmpty }: DeleteAllArchivedChatsFormProps) {
    const [isLoading, startLoadingTransition] = useTransition()
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof DeleteFormSchema>>({
        resolver: zodResolver(DeleteFormSchema),
        defaultValues: {
            confirmation: undefined
        }
    })

    function onSubmit(data: z.infer<typeof DeleteFormSchema>) {
        startLoadingTransition(async () => {
            await onDeleteAllArchivedChats()
            form.reset()
            setOpen(false)
            toast({
                title: "Chats arquivados excluídos",
                description: "Todos os chats arquivados foram excluídos com sucesso."
            })
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={isLoading || archivedThreadsIsEmpty} variant="destructive" className="w-full sm:w-auto">
                    Excluir
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Excluir todos os chats arquivados</DialogTitle>
                    <DialogDescription>
                        Digite <span className="font-bold">excluir todos arquivados</span> para confirmar.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="confirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="excluir todos arquivados" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="sm:justify-end">
                            <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
                                <DialogClose asChild>
                                    <Button disabled={isLoading} type="button" variant="outline" className="w-full sm:w-auto">Cancelar</Button>
                                </DialogClose>
                                <Button disabled={!form.formState.isValid && form.formState.isDirty || isLoading} type="submit" variant="destructive" className="w-full sm:w-auto">
                                    <span className={cn("text-sm", isLoading && "invisible")}>Confirmar exclusão</span>
                                    {isLoading && <Loader className="size-4 mx-auto animate-spin absolute" />}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}