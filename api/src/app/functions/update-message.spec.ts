import { makeMessage } from "@/test/factories/make-message";
import { describe, expect, it } from "vitest";
import { updateMessage } from "./update-message";
import { isRight, unwrapEither } from "@/core/either";
import { makeThread } from "@/test/factories/make-thread";
import { makeUser } from "@/test/factories/make-user";

describe("update message", () => {
  it("should update message", async () => {
    const user = await makeUser();
    const thread = await makeThread({ userId: user.id });
    const message = await makeMessage({
      openaiThreadId: thread.openaiThreadId,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    });

    const sut = await updateMessage({
      openaiThreadId: thread.openaiThreadId,
      usage: {
        prompt_tokens: 1000,
        completion_tokens: 1000,
        total_tokens: 1000,
      },
    });

    expect(isRight(sut)).toEqual(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        message: expect.objectContaining({
          ...message,
          usage: {
            prompt_tokens: 1000,
            completion_tokens: 1000,
            total_tokens: 1000,
          },
        }),
      }),
    );
  });

  it("should update message sum existing usage with new usage", async () => {
    const user = await makeUser();
    const thread = await makeThread({ userId: user.id });
    const message = await makeMessage({
      openaiThreadId: thread.openaiThreadId,
      usage: {
        prompt_tokens: 1000,
        completion_tokens: 1000,
        total_tokens: 1000,
      },
    });

    const sut = await updateMessage({
      openaiThreadId: thread.openaiThreadId,
      usage: {
        prompt_tokens: 1000,
        completion_tokens: 1000,
        total_tokens: 1000,
      },
    });

    expect(isRight(sut)).toEqual(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        message: expect.objectContaining({
          ...message,
          usage: {
            prompt_tokens: 2000,
            completion_tokens: 2000,
            total_tokens: 2000,
          },
        }),
      }),
    );
  });
});
