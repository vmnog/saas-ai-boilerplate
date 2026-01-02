'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const DeleteFormSchema = z.object({
    confirmation: z.string({ required_error: "Frase de confirmação é obrigatória" }).refine(val => val === "excluir minha conta", {
        message: "Digite exatamente 'excluir minha conta' para confirmar."
    })
})

export function DeleteAccountForm() {
    const deleteForm = useForm<z.infer<typeof DeleteFormSchema>>({
        resolver: zodResolver(DeleteFormSchema),
        defaultValues: {
            confirmation: undefined
        }
    })

    async function onSubmitDeleteAccount(data: z.infer<typeof DeleteFormSchema>) {
        // Aqui você implementaria a lógica de exclusão
        console.log("Excluindo conta", data)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled variant="destructive" className="w-full sm:w-auto">
                    Excluir conta
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Excluir conta</DialogTitle>
                    <DialogDescription>
                        Digite <span className="font-bold">excluir minha conta</span> para confirmar.
                    </DialogDescription>
                </DialogHeader>
                <Form {...deleteForm}>
                    <form onSubmit={deleteForm.handleSubmit(onSubmitDeleteAccount)} className="space-y-4">
                        <FormField
                            control={deleteForm.control}
                            name="confirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="excluir minha conta" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="sm:justify-end">
                            <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" className="w-full sm:w-auto">Cancelar</Button>
                                </DialogClose>
                                <Button type="submit" variant="destructive" className="w-full sm:w-auto">
                                    Confirmar exclusão
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
