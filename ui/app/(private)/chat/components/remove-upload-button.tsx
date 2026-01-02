'use client'

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { XIcon } from "lucide-react";

export function RemoveUploadButton({ file, removeFile }: { file: File, removeFile: (filename: string) => void }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="z-10 bg-primary-foreground hover:bg-muted border shadow rounded-full absolute size-5 p-2 -right-3 -top-2"
                    onClick={() => removeFile(file.name)}
                >
                    <XIcon className="max-w-3 text-foreground" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                Remover
            </TooltipContent>
        </Tooltip>
    )
}
