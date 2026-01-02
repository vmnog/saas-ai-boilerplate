import { isLeft, isRight, makeRight, unwrapEither } from "@/core/either";
import { makeUser } from "@/test/factories/make-user";
import { describe, expect, it, vi } from "vitest";
import { registerUser } from "./register-user";

import { faker } from "@faker-js/faker";
import { UserAlreadyExists } from "../errors/user-already-exists";
import { createOrRetrieveCustomer } from "./create-or-retrieve-customer";

vi.mock("./create-or-retrieve-customer");

describe("register user", () => {
  it("should be able to register a new user and subscribe to free plan", async () => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };

    const createOrRetrieveCustomerMock = vi.mocked(createOrRetrieveCustomer);
    createOrRetrieveCustomerMock.mockResolvedValueOnce(
      makeRight({ stripeCustomerId: "mocked-customer-id" }),
    );

    const sut = await registerUser(user);

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(String),
          name: user.name,
          email: user.email,
          avatarUrl: null,
        }),
        subscription: expect.objectContaining({
          id: expect.any(String),
          userId: expect.any(String),
          priceId: expect.any(String),
          stripeSubscriptionId: null,
          metadata: null,
          status: "active",
          quantity: 1,
          cancelAtPeriodEnd: null,
          cancelAt: null,
          canceledAt: null,
          currentPeriodStart: null,
          currentPeriodEnd: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
        limits: expect.objectContaining({
          id: expect.any(String),
          userId: expect.any(String),
          sendMessageLimit: expect.any(Number),
          sendMessageUsed: 0,
          sendMessageLimitResetAt: null,
        }),
      }),
    );
  });

  it("should not be able to register a user with an existing email", async () => {
    const { name, email } = await makeUser();

    await registerUser({ name, email });

    const sut = await registerUser({ name, email });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(UserAlreadyExists);
  });
});
