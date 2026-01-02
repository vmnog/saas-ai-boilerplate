import { type Either, makeRight } from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import type { newSubscriptions } from "@/db/schema/new-subscription";
import { toDateTime } from "@/http/utils/helpers";
import { retrieveStripeSubscription } from "@/stripe/retrieve-stripe-subscription";
import { eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import type { ResourceNotFound } from "../errors/resource-not-found";
import type { limits } from "@/db/schema/limits";

const manageSubscriptionStatusChangeInput = z.object({
  subscriptionStripeId: z.string(),
  customerStripeId: z.string(),
});

const manageSubscriptionStatusChangeOutput = z.object({
  subscription: z.object({
    id: z.string(),
    stripeSubscriptionId: z.string().nullable(),
    userId: z.string().nullable(),
    priceId: z.string().nullable(),
    metadata: z.unknown().nullable(),
    status: z.string().nullable(),
    quantity: z.number().nullable(),
    cancelAtPeriodEnd: z.boolean().nullable(),
    cancelAt: z.date().nullable(),
    canceledAt: z.date().nullable(),
    currentPeriodStart: z.date().nullable(),
    currentPeriodEnd: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  limits: z.object({
    id: z.string(),
    userId: z.string(),
    sendMessageUsed: z.number().nullable(),
    sendMessageLimit: z.number().nullable(),
    sendMessageLimitResetAt: z.date().nullable(),
  }),
});

type ManageSubscriptionStatusChangeInput = z.infer<
  typeof manageSubscriptionStatusChangeInput
>;
export type ManageSubscriptionStatusChangeOutput = z.infer<
  typeof manageSubscriptionStatusChangeOutput
>;

export async function manageSubscriptionStatusChange(
  input: ManageSubscriptionStatusChangeInput,
): Promise<Either<ResourceNotFound, ManageSubscriptionStatusChangeOutput>> {
  const { subscriptionStripeId, customerStripeId } =
    manageSubscriptionStatusChangeInput.parse(input);

  const [existingCustomer] = await db
    .select({
      userId: schema.customers.userId,
    })
    .from(schema.customers)
    .where(eq(schema.customers.stripeCustomerId, customerStripeId));

  const customerUserId = existingCustomer.userId;

  // Retrieve the subscription from Stripe
  const stripeSubscription =
    await retrieveStripeSubscription(subscriptionStripeId);

  // Find the price from the subscription
  const [existingPrice] = await db
    .select(getTableColumns(schema.prices))
    .from(schema.prices)
    .where(
      eq(
        schema.prices.stripePriceId,
        stripeSubscription.items.data[0].price.id,
      ),
    );

  const price = existingPrice;

  // Map subscription from stripe to database
  const subscriptionData = {
    stripeSubscriptionId: stripeSubscription.id,
    userId: customerUserId,
    metadata: stripeSubscription.metadata,
    status: stripeSubscription.status,
    priceId: price.id,
    quantity: stripeSubscription.items.data[0].quantity,
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    cancelAt: stripeSubscription.cancel_at
      ? toDateTime(stripeSubscription.cancel_at)
      : null,
    canceledAt: stripeSubscription.canceled_at
      ? toDateTime(stripeSubscription.canceled_at)
      : null,
    currentPeriodStart: toDateTime(stripeSubscription.current_period_start),
    currentPeriodEnd: toDateTime(stripeSubscription.current_period_end),
    createdAt: toDateTime(stripeSubscription.created),
    endedAt: stripeSubscription.ended_at
      ? toDateTime(stripeSubscription.ended_at)
      : null,
    trialStart: stripeSubscription.trial_start
      ? toDateTime(stripeSubscription.trial_start)
      : null,
    trialEnd: stripeSubscription.trial_end
      ? toDateTime(stripeSubscription.trial_end)
      : null,
  };

  let subscription: typeof newSubscriptions.$inferSelect;

  // Retrieve the subscription from the database
  const [existingSubscription] = await db
    .select()
    .from(schema.newSubscriptions)
    .where(
      eq(schema.newSubscriptions.stripeSubscriptionId, subscriptionStripeId),
    );

  // If the subscription does not exist, we need to create it using stripe data
  if (!existingSubscription) {
    const [newSubscription] = await db
      .insert(schema.newSubscriptions)
      .values(subscriptionData)
      .returning();

    subscription = newSubscription;
  } else {
    // If the subscription exists, we need to update it using stripe data
    const [updatedSubscription] = await db
      .update(schema.newSubscriptions)
      .set(subscriptionData)
      .where(
        eq(schema.newSubscriptions.stripeSubscriptionId, subscriptionStripeId),
      )
      .returning();

    subscription = updatedSubscription;
  }

  // Retrieve the product from the database
  const [existingProduct] = await db
    .select(getTableColumns(schema.products))
    .from(schema.products)
    .where(eq(schema.products.stripeProductId, price.stripeProductId))
    .innerJoin(
      schema.prices,
      eq(schema.products.stripeProductId, schema.prices.stripeProductId),
    );

  let userLimits: typeof limits.$inferSelect;

  // Check if the user has limits
  const [existingLimits] = await db
    .select({ id: schema.limits.id })
    .from(schema.limits)
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    .where(eq(schema.limits.userId, subscription.userId!));

  // Create limits if not exists
  if (!existingLimits) {
    const [createdLimits] = await db
      .insert(schema.limits)
      .values({
        userId: existingCustomer.userId,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        sendMessageLimit: existingProduct.metadata?.sendMessageLimit!,
        sendMessageUsed: 0,
        sendMessageLimitResetAt: null,
      })
      .returning();

    userLimits = createdLimits;
  } else {
    const [updatedLimits] = await db
      .update(schema.limits)
      .set({
        sendMessageLimit: existingProduct.metadata?.sendMessageLimit,
        sendMessageUsed: 0,
        sendMessageLimitResetAt: null,
      })
      .returning();

    userLimits = updatedLimits;
  }

  return makeRight({
    subscription,
    limits: userLimits,
  });
}
