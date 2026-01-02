import { deletePrice } from "@/app/functions/delete-price";
import { deleteProduct } from "@/app/functions/delete-product";
import { manageSubscriptionStatusChange } from "@/app/functions/manage-subscription-status-change";
import { upsertPrice } from "@/app/functions/upsert-price";
import { upsertProduct } from "@/app/functions/upsert-product";
import { unwrapEither } from "@/core/either";
import { stripe } from "@/stripe/config";
import type { FastifyReply } from "fastify";
import type { FastifyRequest } from "fastify";
import type Stripe from "stripe";

// Change to control trial period length
export const TRIAL_PERIOD_DAYS = 0;

// List of relevant events to listen to
const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export const listenWebhooksRoute = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const signature = request.headers["stripe-signature"] as string;
  const rawBody = request.body as { raw: string };
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      console.log("❌ Webhook secret not found.");
      return reply.status(400).send({ message: "Webhook secret not found." });
    }

    event = stripe.webhooks.constructEvent(
      rawBody.raw,
      signature,
      webhookSecret,
    );
    console.log(`🔔  Event Type: ${event.type}`);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (err: any) {
    console.log(`❌ Error Constructing Event: ${err.message}`);
    return reply
      .status(400)
      .send({ message: `Error Constructing Event: ${err.message}` });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated": {
          console.log("Product created or updated");
          const product = {
            ...event.data.object,
            stripeProductId: event.data.object.id,
            image: event.data.object.images[0] ?? null,
            metadata: {
              sendMessageLimit: Number(
                event.data.object.metadata.sendMessageLimit,
              ),
              benefits: event.data.object.metadata.benefits,
              shouldHighlight: Boolean(
                event.data.object.metadata.shouldHighlight === "true",
              ),
            },
          };
          const result = await upsertProduct({ product });
          console.log("Product upserted", unwrapEither(result));
          break;
        }
        case "price.created":
        case "price.updated": {
          console.log("Price created or updated");
          const price = {
            id: event.data.object.id,
            product_id:
              typeof event.data.object.product === "string"
                ? event.data.object.product
                : "",
            active: event.data.object.active,
            currency: event.data.object.currency,
            type: event.data.object.type,
            unit_amount: event.data.object.unit_amount ?? null,
            interval: event.data.object.recurring?.interval ?? null,
            interval_count: event.data.object.recurring?.interval_count ?? null,
            trial_period_days:
              event.data.object.recurring?.trial_period_days ??
              TRIAL_PERIOD_DAYS,
          };
          const result = await upsertPrice({ price });
          console.log("Price upserted", unwrapEither(result));
          break;
        }
        case "price.deleted": {
          console.log("Price deleted");
          const result = await deletePrice({
            stripePriceId: event.data.object.id,
          });
          console.log("Price deleted", unwrapEither(result));
          break;
        }
        case "product.deleted": {
          console.log("Product deleted");
          const result = await deleteProduct({
            productId: event.data.object.id,
          });
          console.log("Product deleted", unwrapEither(result));
          break;
        }
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          console.log("Subscription created, updated, or deleted");
          const subscription = event.data.object as Stripe.Subscription;
          const result = await manageSubscriptionStatusChange({
            subscriptionStripeId: subscription.id,
            customerStripeId: subscription.customer as string,
          });
          console.log(
            "Subscription created, updated, or deleted",
            unwrapEither(result),
          );
          break;
        }
        case "checkout.session.completed": {
          console.log("Checkout session completed");
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            const result = await manageSubscriptionStatusChange({
              subscriptionStripeId: subscriptionId as string,
              customerStripeId: checkoutSession.customer as string,
            });
            console.log("Checkout session completed", unwrapEither(result));
          }
          break;
        }
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log("❌ Error: Webhook handler failed.", error);
      return reply.status(400).send({ message: "Webhook handler failed." });
    }
  } else {
    console.log("❌ Error: Unsupported event type.", event.type);
    return reply
      .status(400)
      .send({ message: `Unsupported event type: ${event.type}` });
  }

  console.log("✅ Webhook received successfully.");
  return reply.status(200).send({ received: true });
};
