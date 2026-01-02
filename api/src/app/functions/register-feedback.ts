import { type Either, makeLeft, makeRight } from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ResourceNotFound } from "../errors/resource-not-found";

const registerFeedbackInput = z.object({
  content: z.string(),
  rating: z.string(),
  userId: z.string(),
});

const registerFeedbackOutput = z.object({
  feedback: z.object({
    id: z.string(),
    userId: z.string(),
    content: z.string(),
    rating: z.number(),
    createdAt: z.date(),
  }),
});

type RegisterFeedbackInput = z.infer<typeof registerFeedbackInput>;
type RegisterFeedbackOutput = z.infer<typeof registerFeedbackOutput>;

export async function registerFeedback(
  input: RegisterFeedbackInput,
): Promise<Either<ResourceNotFound, RegisterFeedbackOutput>> {
  const { content, rating, userId } = registerFeedbackInput.parse(input);

  const [existingUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId));

  if (!existingUser) {
    return makeLeft(new ResourceNotFound("Usuário não existe"));
  }

  const ratingAsNumber = Number(rating);

  if (typeof ratingAsNumber !== "number") {
    return makeLeft(new ResourceNotFound("Rating inválido existe"));
  }

  const [feedback] = await db
    .insert(schema.feedbacks)
    .values({
      userId,
      content,
      rating: ratingAsNumber,
    })
    .returning();

  return makeRight({ feedback });
}
