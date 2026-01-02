import { type Either, makeLeft, makeRight } from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ResourceNotFound } from "../errors/resource-not-found";
import { NotAuthorized } from "../errors/not-authorized";

const acceptTermsInput = z.object({
  userId: z.string(),
});

const acceptTermsOutput = z.object({
  terms: z.object({
    id: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

type AcceptTermsInput = z.infer<typeof acceptTermsInput>;
type AcceptTermsOutput = z.infer<typeof acceptTermsOutput>;

export async function acceptTerms(
  input: AcceptTermsInput,
): Promise<Either<ResourceNotFound | NotAuthorized, AcceptTermsOutput>> {
  const { userId } = acceptTermsInput.parse(input);

  const [existingUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId));

  if (!existingUser) {
    return makeLeft(new ResourceNotFound("Usuário não existe"));
  }

  const existingTerms = await db
    .select()
    .from(schema.terms)
    .where(eq(schema.terms.userId, userId));

  if (existingTerms.length > 0) {
    return makeLeft(new NotAuthorized("Termos já foram aceitos"));
  }

  const [terms] = await db
    .insert(schema.terms)
    .values({
      userId,
      termsOfUse: true,
      privacyPolicy: true,
    })
    .returning();

  return makeRight({ terms });
}
