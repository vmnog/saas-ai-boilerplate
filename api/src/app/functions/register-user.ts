import {
  type Either,
  isLeft,
  makeLeft,
  makeRight,
  unwrapEither,
} from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ResourceNotFound } from "../errors/resource-not-found";
import { UserAlreadyExists } from "../errors/user-already-exists";
import { createOrRetrieveCustomer } from "./create-or-retrieve-customer";

const registerUserInput = z.object({
  name: z.string(),
  email: z.string().email(),
});

const registerUserOutput = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    avatarUrl: z.string().nullable(),
  }),
  subscription: z.object({
    id: z.string(),
  }),
  limits: z.object({
    id: z.string(),
    userId: z.string(),
    sendMessageLimit: z.number(),
    sendMessageUsed: z.number(),
    sendMessageLimitResetAt: z.date().nullable(),
  }),
});

type RegisterUserInput = z.infer<typeof registerUserInput>;
type RegisterUserOutput = z.infer<typeof registerUserOutput>;

export async function registerUser(
  input: RegisterUserInput,
): Promise<Either<UserAlreadyExists | ResourceNotFound, RegisterUserOutput>> {
  const { name, email } = registerUserInput.parse(input);

  const [existingUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  if (existingUser) {
    return makeLeft(new UserAlreadyExists());
  }

  const [createdUser] = await db
    .insert(schema.users)
    .values({ name, email })
    .returning();

  // TODO: get free product
  const [freeProduct] = await db
    .select({
      priceId: schema.prices.id,
      stripePriceId: schema.prices.stripePriceId,
      stripeProductId: schema.products.stripeProductId,
      unitAmount: schema.prices.unitAmount,
      metadata: schema.products.metadata,
    })
    .from(schema.products)
    .where(eq(schema.prices.unitAmount, 0))
    .innerJoin(
      schema.prices,
      eq(schema.products.stripeProductId, schema.prices.stripeProductId),
    );

  const customer = await createOrRetrieveCustomer({
    userId: createdUser.id,
    email: createdUser.email,
  });

  if (isLeft(customer)) {
    const error = unwrapEither(customer);
    return makeLeft(error);
  }

  // TODO: create new subscription to free product
  const [createdSubscription] = await db
    .insert(schema.newSubscriptions)
    .values({
      userId: createdUser.id,
      priceId: freeProduct.priceId,
      status: "active",
      quantity: 1,
    })
    .returning();

  if (!freeProduct.metadata?.sendMessageLimit) {
    return makeLeft(
      new ResourceNotFound("Free Product Metadata sendMessageLimit not found"),
    );
  }

  const [createdLimits] = await db
    .insert(schema.limits)
    .values({
      userId: createdUser.id,
      sendMessageLimit: freeProduct.metadata.sendMessageLimit,
      sendMessageUsed: 0,
      sendMessageLimitResetAt: null,
    })
    .returning();

  return makeRight({
    user: createdUser,
    subscription: createdSubscription,
    limits: createdLimits,
  });
}
