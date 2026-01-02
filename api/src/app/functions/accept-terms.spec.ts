import { isLeft, isRight, unwrapEither } from "@/core/either";
import { makeUser } from "@/test/factories/make-user";
import { describe, expect, it } from "vitest";

import { faker } from "@faker-js/faker";
import { ResourceNotFound } from "../errors/resource-not-found";
import { acceptTerms } from "./accept-terms";
import { NotAuthorized } from "../errors/not-authorized";
import { makeTerms } from "@/test/factories/make-terms";

describe("accept terms", () => {
  it("should be able to accept a new terms", async () => {
    const user = await makeUser();

    const sut = await acceptTerms({
      userId: user.id,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        terms: expect.objectContaining({
          id: expect.any(String),
          userId: user.id,
          termsOfUse: true,
          privacyPolicy: true,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      }),
    );
  });

  it("should not be able to register a terms with an unexistent user", async () => {
    const sut = await acceptTerms({
      userId: "non-existing-user",
    });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound);
  });

  it("should not be able to register a terms twice", async () => {
    const user = await makeUser();
    await makeTerms({ userId: user.id });

    const sut = await acceptTerms({
      userId: user.id,
    });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(NotAuthorized);
  });
});
