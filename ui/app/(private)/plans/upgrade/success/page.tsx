import { getCheckoutSession } from "@/http/api-server";
import { AnimatedSuccessItems } from "./animated-success-items";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string; planId: string };
}) {
  const session = await getCheckoutSession(searchParams.session_id, {
    next: {
      tags: ["checkout-session"],
    },
  });

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-background max-w-screen-lg mx-auto">
      <AnimatedSuccessItems session={session} />
    </div>
  );
}
