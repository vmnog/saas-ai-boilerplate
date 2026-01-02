import { type Either, makeLeft, makeRight } from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { sendAuthMagicLink } from "@/mail/messages/send-auth-magic-link";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { ResourceNotFound } from "../errors/resource-not-found";
import { env } from "@/env";

const sendAuthenticationLinkInput = z.object({
  email: z.string().email(),
});

const sendAuthenticationLinkOutput = z.null();

type SendAuthenticationLinkInput = z.infer<typeof sendAuthenticationLinkInput>;
type SendAuthenticationLinkOutput = z.infer<
  typeof sendAuthenticationLinkOutput
>;

export async function sendAuthenticationLink(
  input: SendAuthenticationLinkInput,
): Promise<Either<ResourceNotFound, SendAuthenticationLinkOutput>> {
  const { email } = sendAuthenticationLinkInput.parse(input);

  const result = await db
    .select({
      user: getTableColumns(schema.users),
    })
    .from(schema.users)
    .where(and(eq(schema.users.email, email)));

  if (result.length === 0) {
    return makeLeft(new ResourceNotFound("Usuário não encontrado."));
  }

  const { user } = result[0];

  const [{ code }] = await db
    .insert(schema.authCodes)
    .values({ userId: user.id })
    .returning();

  const authUrl = new URL("/auth/authenticate", env.WEB_URL);
  authUrl.searchParams.set("code", code);

  console.log(`✉️ Authenticate using: ${authUrl.toString()}`);

  try {
    await sendAuthMagicLink({
      code,
      to: {
        name: user.name,
        email,
      },
    });
  } catch (err) {
    console.error("Failed to send auth magic link, ", err);
  }

  return makeRight(null);
}
