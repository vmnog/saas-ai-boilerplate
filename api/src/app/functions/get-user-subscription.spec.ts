import { isRight, unwrapEither } from "@/core/either";
import { makeLimit } from "@/test/factories/make-limit";
import { makeNewSubscription } from "@/test/factories/make-new-subscription";
import { makePrice } from "@/test/factories/make-price";
import { makeProduct } from "@/test/factories/make-product";
import { makeUser } from "@/test/factories/make-user";
import { describe, expect, it } from "vitest";
import { ResourceNotFound } from "../errors/resource-not-found";
import { getUserSubscription } from "./get-user-subscription";

describe("get user subscription", () => {
  it("should be able to get the user subscription", async () => {
    const user = await makeUser();
    const product = await makeProduct({
      metadata: {
        sendMessageLimit: 100,
        benefits: "Some benefits"
      }
    });
    const price = await makePrice({
      stripeProductId: product.stripeProductId,
      unitAmount: 1000,
    });
    const subscription = await makeNewSubscription({
      userId: user.id,
      priceId: price.id,
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(),
      cancelAtPeriodEnd: false,
      cancelAt: null,
      canceledAt: null,
    });
    await makeLimit({
      userId: user.id,
      sendMessageLimit: product.metadata?.sendMessageLimit,
      sendMessageUsed: 0,
      sendMessageLimitResetAt: null,
    });

    const sut = await getUserSubscription({
      userId: user.id,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        id: subscription.id,
        product: expect.objectContaining({
          id: product.id,
          name: product.name,
          monthlyPrice: price.unitAmount,
          metadata: {
            sendMessageLimit: product.metadata?.sendMessageLimit,
            benefits: product.metadata?.benefits,
          },
        }),
        startsAt: subscription.currentPeriodStart,
        endsAt: subscription.currentPeriodEnd,
      }),
    );
  });

  it("should not be able to get subscription from non existing user", async () => {
    const sut = await getUserSubscription({
      userId: "non-existing-user",
    });

    expect(isRight(sut)).toBe(false);
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound);
  });
});
