import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { getProfile, updateProfile } from '@/http/api-server'
import { getNameInitials } from '@/utils/get-name-initials'
import { InfoIcon } from 'lucide-react'
import { revalidateTag } from 'next/dist/server/web/spec-extension/revalidate'
import type { z } from 'zod'
import { DeleteAccountForm } from './delete-account-form'
import { UpdateAccountForm, type UpdateFormSchema } from './update-account-form'

export default async function AccountPage() {
    const profile = await getProfile({
        next: {
            tags: ['profile'],
        },
    })

    async function onUpdateProfile(data: z.infer<typeof UpdateFormSchema>) {
        'use server'
        await updateProfile(data.name, {
            next: { tags: ['update-profile'] },
        })
        revalidateTag('profile')
    }

    return (
        <main className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Minha conta</h3>
                <p className="text-sm text-muted-foreground">
                    Gerencie suas informações pessoais e configurações da conta.
                </p>
            </div>
            <Separator />
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                        {getNameInitials(profile.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <p className="font-medium capitalize">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
            </div>
            <div className="space-y-6">
                <UpdateAccountForm
                    profile={profile}
                    handleUpdateProfile={onUpdateProfile}
                />
                <div className="flex items-center justify-between">
                    <div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="flex items-center gap-1">
                                    <p className="font-medium">Endereço de email </p>
                                    <InfoIcon className="size-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Entre em contato com o suporte para alterar seu email</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-1 text-destructive">
                                <p className="font-medium">Excluir minha conta</p>
                                <InfoIcon className="size-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Entre em contato com o suporte para excluir sua conta</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <p className="text-sm text-muted-foreground">
                        Isso excluirá permanentemente sua conta e todos os dados associados.
                        Esta ação não pode ser desfeita.
                    </p>
                </div>
                <DeleteAccountForm />
            </div>
        </main>
    )
}
