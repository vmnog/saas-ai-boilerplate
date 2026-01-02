import { isRight, unwrapEither } from "@/core/either";
import { makeUser } from "@/test/factories/make-user";
import { describe, expect, it } from "vitest";
import { ResourceNotFound } from "../errors/resource-not-found";
import { getUserLimits } from "./get-user-limits";
import { getUserTerms } from "./get-user-terms";
import { makeTerms } from "@/test/factories/make-terms";

describe("get user terms", () => {
  it("should be able to get the user terms", async () => {
    const user = await makeUser();
    await makeTerms({
      userId: user.id,
      privacyPolicy: true,
      termsOfUse: true,
    });

    const sut = await getUserTerms({
      userId: user.id,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual({
      hasAccepted: true,
    });
  });

  it("should be able to get the user terms as false", async () => {
    const user = await makeUser();

    const sut = await getUserTerms({
      userId: user.id,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual({
      hasAccepted: false,
    });
  });

  it("should not be able to get user terms from non existing user", async () => {
    const sut = await getUserLimits({
      userId: "non-existing-user",
    });

    expect(isRight(sut)).toBe(false);
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound);
  });
});
