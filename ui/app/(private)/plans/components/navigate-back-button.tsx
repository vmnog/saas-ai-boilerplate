"use client";

import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function NavigateBackButton() {
  const router = useRouter();

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleNavigateBack();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  function handleNavigateBack() {
    router.push("/settings/subscription");
  }

  return (
    <Button variant="ghost" onClick={handleNavigateBack}>
      <XIcon className="size-6" />
    </Button>
  );
}

