import { type Either, makeLeft, makeRight } from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { ResourceNotFound } from "../errors/resource-not-found";

const getUserSubscriptionInput = z.object({
  userId: z.string(),
});

const getUserSubscriptionOutput = z.object({
  id: z.string(),
  startsAt: z.date().nullable(),
  endsAt: z.date().nullable(),
  status: z.string().nullable(),
  cancelAtPeriodEnd: z.boolean().nullable(),
  cancelAt: z.date().nullable(),
  canceledAt: z.date().nullable(),
  currentPeriodStart: z.date().nullable(),
  currentPeriodEnd: z.date().nullable(),
  product: z.object({
    id: z.string(),
    name: z.string(),
    monthlyPrice: z.number().nullable(),
    metadata: z
      .object({
        sendMessageLimit: z.number(),
        benefits: z.string(),
      })
      .nullable(),
  }),
});

type GetUserSubscriptionInput = z.infer<typeof getUserSubscriptionInput>;
type GetUserSubscriptionOutput = z.infer<typeof getUserSubscriptionOutput>;

export async function getUserSubscription(
  input: GetUserSubscriptionInput,
): Promise<Either<ResourceNotFound, GetUserSubscriptionOutput>> {
  const { userId } = getUserSubscriptionInput.parse(input);

  const users = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId));

  if (users.length === 0) {
    return makeLeft(new ResourceNotFound("Usuário não encontrado."));
  }

  const subscriptions = await db
    .select({
      id: schema.newSubscriptions.id,
      startsAt: schema.newSubscriptions.currentPeriodStart,
      endsAt: schema.newSubscriptions.currentPeriodEnd,
      status: schema.newSubscriptions.status,
      cancelAtPeriodEnd: schema.newSubscriptions.cancelAtPeriodEnd,
      cancelAt: schema.newSubscriptions.cancelAt,
      canceledAt: schema.newSubscriptions.canceledAt,
      currentPeriodStart: schema.newSubscriptions.currentPeriodStart,
      currentPeriodEnd: schema.newSubscriptions.currentPeriodEnd,
      product: {
        id: schema.products.id,
        name: schema.products.name,
        monthlyPrice: schema.prices.unitAmount,
        metadata: schema.products.metadata,
      },
    })
    .from(schema.newSubscriptions)
    .where(
      and(
        eq(schema.newSubscriptions.userId, userId),
        eq(schema.newSubscriptions.status, "active"),
      ),
    )
    .innerJoin(
      schema.prices,
      eq(schema.newSubscriptions.priceId, schema.prices.id),
    )
    .innerJoin(
      schema.products,
      eq(schema.prices.stripeProductId, schema.products.stripeProductId),
    )
    .innerJoin(
      schema.users,
      eq(schema.newSubscriptions.userId, schema.users.id),
    )
    .orderBy(desc(schema.newSubscriptions.createdAt));

  if (subscriptions.length === 0) {
    return makeLeft(new ResourceNotFound("Assinatura não encontrada."));
  }

  const subscription = subscriptions[0];

  if (subscription.product.monthlyPrice === 0) {
    const [latestFreeProduct] = await db
      .select({ priceId: schema.prices.id })
      .from(schema.prices)
      .where(eq(schema.prices.unitAmount, 0))
      .innerJoin(
        schema.products,
        eq(schema.prices.stripeProductId, schema.products.stripeProductId),
      )
      .orderBy(desc(schema.products.updatedAt));

    await db
      .update(schema.newSubscriptions)
      .set({
        priceId: latestFreeProduct.priceId,
      })
      .where(eq(schema.newSubscriptions.id, subscription.id));
  }

  if (process.env.NODE_ENV !== "production") {
    const limits = await db
      .select()
      .from(schema.limits)
      .where(eq(schema.limits.userId, userId));

    if (limits.length === 0) {
      return makeLeft(new ResourceNotFound("Limites não encontrados."));
    }

    const limit = limits[0];

    if (
      limit.sendMessageLimit !== subscription.product.metadata?.sendMessageLimit
    ) {
      await db
        .update(schema.limits)
        .set({
          sendMessageLimit: subscription.product.metadata?.sendMessageLimit,
          sendMessageUsed: 0,
          sendMessageLimitResetAt: null,
        })
        .where(eq(schema.limits.userId, userId));
    }
  }
  return makeRight(subscription);
}
