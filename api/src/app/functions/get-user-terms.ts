import { type Either, makeLeft, makeRight } from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ResourceNotFound } from "../errors/resource-not-found";

const getUserTermsInput = z.object({
  userId: z.string(),
});

const getUserTermsOutput = z.object({
  hasAccepted: z.boolean().nullable(),
});

type GetUserTermsInput = z.infer<typeof getUserTermsInput>;
type GetUserTermsOutput = z.infer<typeof getUserTermsOutput>;

export async function getUserTerms(
  input: GetUserTermsInput,
): Promise<Either<ResourceNotFound, GetUserTermsOutput>> {
  const { userId } = getUserTermsInput.parse(input);

  const users = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId));

  if (users.length === 0) {
    return makeLeft(new ResourceNotFound("Usuário não encontrado."));
  }

  const [existingTerms] = await db
    .select()
    .from(schema.terms)
    .where(eq(schema.terms.userId, userId));

  if (!existingTerms) {
    return makeRight({
      hasAccepted: false,
    });
  }

  return makeRight({
    hasAccepted: existingTerms.privacyPolicy && existingTerms.termsOfUse,
  });
}
