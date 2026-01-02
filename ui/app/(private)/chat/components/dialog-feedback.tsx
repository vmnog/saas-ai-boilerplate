"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { registerFeedback } from "@/http/api-client";
import { cn } from "@/lib/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { FlagIcon, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const feedbackSchema = z.object({
  content: z
    .string({ required_error: "Feedback é obrigatório" })
    .min(10, { message: "Insira ao menos 10 caracteres" })
    .max(160, { message: "Insira no máximo 160 caracteres" }),
  rating: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Informe uma nota",
  }),
});

export function DialogFeedback() {
  const [open, setOpen] = useState(false);
  const [isLoading, startLoadingTransition] = useTransition();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
  });

  function onSubmit(values: z.infer<typeof feedbackSchema>) {
    if (isLoading) return;

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    startLoadingTransition(async () => {
      try {
        await registerFeedback(values.content, values.rating);
        form.reset();
        setOpen(false);
        toast({
          title: "Muito Obrigado! Recebemos seu feedback.",
          description:
            "Caso seja necessário entraremos em contato pelo seu e-mail.",
        });
      } catch (err) {
        console.error("Failed to registerFeedback");
        toast({
          variant: "destructive",
          title: "Ops! Não foi possível enviar seu feedback",
          description:
            "Nosso time estará analisando este problema o quanto antes, enquanto isso tente novamente mais tarde.",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start mb-2" variant="ghost">
          <FlagIcon className="mr-2 h-4 w-4" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="flex items-center gap-2 border-b border-border px-6 py-4 text-base">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
              aria-hidden="true"
            >
              <FlagIcon className="opacity-80" size={16} strokeWidth={2} />
            </div>
            Nos ajude a melhorar
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-6 py-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Qual nota você daria pra sua experiência até agora?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-0"
                    >
                      <div className="flex w-full gap-0 -space-x-px rounded-lg shadow-sm shadow-black/5">
                        {[1, 2, 3, 4, 5].map((number) => (
                          <FormItem key={number} className="flex-1">
                            <FormControl>
                              <RadioGroupItem
                                id={`rating-${number}`}
                                className="peer sr-only"
                                value={number.toString()}
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor={`rating-${number}`}
                              className={cn(
                                "relative flex w-full py-2 cursor-pointer flex-col items-center justify-center gap-3 border border-input text-center text-xs outline-offset-2 transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                "peer-data-[state=checked]:z-10 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                number === 1 && "rounded-s-lg",
                                number === 5 && "rounded-e-lg",
                              )}
                            >
                              {number}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <p>Péssimo</p>
                        <p>Sensacional</p>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual foi o motivo dessa nota?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nos informe como podemos melhorar a ACME?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Você pode dar sugestão de novas funcionalidades ou reportar
                    erros.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading && <Loader2 className="size-5 animate-spin" />}
              {!isLoading && "Enviar feedback"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
