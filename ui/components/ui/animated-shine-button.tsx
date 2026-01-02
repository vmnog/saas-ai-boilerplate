import { AnimatedShinyText } from "./animated-shiny-text";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "./button";
import type { ComponentProps } from "react";

interface AnimatedShineButtonProps extends ComponentProps<typeof Button> {}

export function AnimatedShineButton({ ...props }: AnimatedShineButtonProps) {
  return (
    <Button variant="outline" className="group rounded-full px-0" {...props}>
      <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
        <span>✨ Primeira vez por aqui?</span>
        <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </AnimatedShinyText>
    </Button>
  );
}
