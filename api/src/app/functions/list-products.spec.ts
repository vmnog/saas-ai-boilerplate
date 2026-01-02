import { isRight, unwrapEither } from "@/core/either";
import { stripe } from "@/stripe/config";
import { makePrice } from "@/test/factories/make-price";
import { makeProduct } from "@/test/factories/make-product";
import { faker } from "@faker-js/faker";
import type Stripe from "stripe";
import { describe, expect, it, vi } from "vitest";
import { type ListProductsOutput, listProducts } from "./list-products";

vi.mock("@/stripe/config", () => ({
  stripe: {
    products: {
      list: vi.fn(),
      retrieve: vi.fn(),
    },
    prices: {
      retrieve: vi.fn(),
    },
  },
}));

describe("list products", () => {
  it("should be able to list products", async () => {
    const productListData: Stripe.ApiList<Stripe.Product> = {
      data: [
        // @ts-ignore
        {
          id: faker.string.uuid(),
          default_price: faker.string.uuid(),
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          images: [faker.image.url()],
          active: true,
          metadata: {
            sendMessageLimit: "100",
            benefits: faker.commerce.productDescription(),
            shouldHighlight: String(faker.datatype.boolean()),
            off: "20",
          },
        },
      ],
    };
    // @ts-ignore
    const productRetrieveData: Stripe.Product = productListData.data[0];
    // @ts-ignore
    const priceRetrieveData: Stripe.Price = {
      id: faker.string.uuid(),
      product: productRetrieveData.id,
      active: true,
      currency: "brl",
      type: "recurring",
      unit_amount: 1000,
      // @ts-ignore
      recurring: {
        interval: "month",
        interval_count: 1,
        trial_period_days: 7,
      },
    };
    vi.mocked(stripe.products.list).mockResolvedValueOnce(
      // @ts-ignore
      productListData,
    );
    vi.mocked(stripe.products.retrieve).mockResolvedValueOnce(
      // @ts-ignore
      productRetrieveData,
    );
    vi.mocked(stripe.prices.retrieve).mockResolvedValueOnce(
      // @ts-ignore
      priceRetrieveData,
    );

    // Create paid product
    const paidProduct = await makeProduct({
      stripeProductId: productRetrieveData.id,
      name: productRetrieveData.name,
      description: productRetrieveData.description,
      image: productRetrieveData.images[0],
      active: true,
      metadata: {
        sendMessageLimit: Number(productRetrieveData.metadata.sendMessageLimit),
        benefits: productRetrieveData.metadata.benefits,
        shouldHighlight: Boolean(
          productRetrieveData.metadata.shouldHighlight === "true",
        ),
        off: Number(productRetrieveData.metadata.off),
      },
    });
    await makePrice({
      stripeProductId: paidProduct.stripeProductId,
      stripePriceId: priceRetrieveData.id,
      type: priceRetrieveData.type,
      unitAmount: priceRetrieveData.unit_amount,
      active: true,
      trialPeriodDays: priceRetrieveData.recurring?.trial_period_days ?? 0,
      interval: priceRetrieveData.recurring?.interval ?? "month",
    });

    const sut = await listProducts();

    expect(isRight(sut)).toBe(true);
    const products = unwrapEither(sut) as ListProductsOutput;
    const existingProduct = products[0];

    expect(existingProduct).toEqual({
      id: expect.any(String),
      stripeProductId: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      active: true,
      image: expect.any(String),
      metadata: {
        sendMessageLimit: expect.any(Number),
        benefits: expect.any(String),
        shouldHighlight: expect.any(Boolean),
        off: expect.any(Number),
      },
      price: {
        id: expect.any(String),
        stripePriceId: expect.any(String),
        type: "recurring",
        unitAmount: expect.any(Number),
        trialPeriodDays: expect.any(Number),
        interval: expect.any(String),
        intervalCount: expect.any(Number),
      },
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
