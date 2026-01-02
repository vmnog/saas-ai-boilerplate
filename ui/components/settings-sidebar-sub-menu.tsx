"use client"

import { ArchiveIcon, ComputerIcon, CreditCardIcon, HeadsetIcon, HelpCircleIcon, Moon, SettingsIcon, Sun, UserIcon } from "lucide-react"
import { useTheme } from "next-themes"

import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function SettingsSidebarSubMenu() {
    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenuGroup>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                </DropdownMenuSubTrigger>

                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                            <Link href="/settings/account">
                                <DropdownMenuItem>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Minha conta</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/settings/archived">
                                <DropdownMenuItem>
                                    <ArchiveIcon className="mr-2 h-4 w-4" />
                                    <span>Chats Arquivados</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/settings/subscription">
                                <DropdownMenuItem>
                                    <CreditCardIcon className="mr-2 h-4 w-4" />
                                    <span>Assinaturas</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <Link href="/settings/faq">
                                <DropdownMenuItem>
                                    <HelpCircleIcon className="mr-2 h-4 w-4" />
                                    <span>FAQ</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/settings/support">
                                <DropdownMenuItem>
                                    <HeadsetIcon className="mr-2 h-4 w-4" />
                                    <span>Contato com Suporte</span>
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Sun className="mr-2 h-4 w-4" />
                                <span>Tema</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                        <DropdownMenuRadioItem value="light">
                                            <Sun className="mr-2 h-4 w-4" />
                                            Claro
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="dark">
                                            <Moon className="mr-2 h-4 w-4" />
                                            Escuro
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="system">
                                            <ComputerIcon className="mr-2 h-4 w-4" />
                                            Sistema
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
        </DropdownMenuGroup>
    )
}
