import { isLeft, isRight, unwrapEither } from "@/core/either";
import { makeUser } from "@/test/factories/make-user";
import { describe, expect, it } from "vitest";

import { faker } from "@faker-js/faker";
import { registerFeedback } from "./register-feedback";
import { ResourceNotFound } from "../errors/resource-not-found";

describe("register feedback", () => {
  it("should be able to register a new feedback", async () => {
    const user = await makeUser();

    const feedback = {
      content: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 1, max: 5 }),
    };

    const sut = await registerFeedback({
      content: feedback.content,
      rating: feedback.rating.toString(),
      userId: user.id,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        feedback: expect.objectContaining({
          id: expect.any(String),
          userId: user.id,
          content: feedback.content,
          rating: feedback.rating,
          createdAt: expect.any(Date),
        }),
      }),
    );
  });

  it("should not be able to register a feedback with an unexistent user", async () => {
    const feedback = {
      content: faker.lorem.paragraph(),
      rating: String(faker.number.int({ min: 1, max: 5 })),
    };

    const sut = await registerFeedback({
      content: feedback.content,
      rating: feedback.rating,
      userId: "non-existing-user",
    });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound);
  });
});
