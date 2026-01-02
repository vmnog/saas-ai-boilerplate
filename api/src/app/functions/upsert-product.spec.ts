import { isRight, unwrapEither } from "@/core/either";
import { makeProduct } from "@/test/factories/make-product";
import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";
import { upsertProduct } from "./upsert-product";

describe("upsert product", () => {
  it("should be able to create a new product", async () => {
    const product = {
      stripeProductId: faker.string.uuid(),
      active: true,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: faker.image.url(),
      metadata: {
        sendMessageLimit: 100,
        benefits: "Some benefits",
        shouldHighlight: false,
      },
    };

    const sut = await upsertProduct({ product });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        stripeProductId: product.stripeProductId,
        active: product.active,
        name: product.name,
        description: product.description,
        image: product.image,
        metadata: product.metadata,
      }),
    );
  });

  it("should be able to update an existing product", async () => {
    const product = await makeProduct({
      name: "old name",
      metadata: {
        sendMessageLimit: 100,
        benefits: "Some benefits",
        shouldHighlight: false,
      },
    });

    await upsertProduct({ product });
    const sut = await upsertProduct({
      product: { ...product, name: "new name" },
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        id: product.id,
        name: "new name",
        active: product.active,
        description: product.description,
        image: product.image,
        metadata: product.metadata,
      }),
    );
  });
});
