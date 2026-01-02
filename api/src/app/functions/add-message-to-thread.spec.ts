import { isLeft, isRight, unwrapEither } from "@/core/either";
import { makeThread } from "@/test/factories/make-thread";
import { makeUpload } from "@/test/factories/make-upload";
import { makeUser } from "@/test/factories/make-user";
import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";
import { addMessageToThread } from "./add-message-to-thread";
import { ResourceNotFound } from "../errors/resource-not-found";
import { NotAuthorized } from "../errors/not-authorized";

describe("add message to thread", () => {
  it("should be able to add a message to a thread", async () => {
    const user = await makeUser();
    const thread = await makeThread({ userId: user.id });
    const message = {
      openaiMessageId: faker.string.uuid(),
      openaiThreadId: thread.openaiThreadId,
      role: faker.helpers.arrayElement(["user", "assistant"]) as
        | "user"
        | "assistant",
      text: faker.lorem.paragraph(),
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };

    const sut = await addMessageToThread({
      ...message,
      userId: user.id,
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        openaiThreadId: message.openaiThreadId,
        openaiMessageId: message.openaiMessageId,
        role: message.role,
        text: message.text,
      }),
    );
  });

  it("should return attachments files uploaded to the messages", async () => {
    const user = await makeUser();
    const thread = await makeThread({ userId: user.id });
    const upload = await makeUpload();
    const openaiMessageId = faker.string.uuid();

    const message = {
      openaiThreadId: thread.openaiThreadId,
      role: "user" as "user" | "assistant",
      text: faker.lorem.paragraph(),
      openaiMessageId,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };

    const sut = await addMessageToThread({
      ...message,
      userId: user.id,
      attachments: [{ id: upload.id, fileId: upload.fileId }],
    });

    expect(isRight(sut)).toBe(true);
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        openaiMessageId: expect.any(String),
        text: expect.any(String),
        role: expect.any(String),
        openaiThreadId: expect.any(String),
        attachments: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            createdAt: expect.any(Date),
            uploadId: expect.any(String),
            messageId: expect.any(String),
          }),
        ]),
        createdAt: expect.any(Date),
      }),
    );
  });

  it("should not be able to add a message to a thread that does not exist", async () => {
    const user = await makeUser();
    const message = {
      openaiMessageId: faker.string.uuid(),
      openaiThreadId: "non-existent-thread",
      role: faker.helpers.arrayElement(["user", "assistant"]) as
        | "user"
        | "assistant",
      text: faker.lorem.paragraph(),
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
    const sut = await addMessageToThread({
      ...message,
      userId: user.id,
    });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound);
  });

  it("should not be able to add a message to a thread that is archived", async () => {
    const user = await makeUser();
    const thread = await makeThread({
      userId: user.id,
      archivedAt: new Date(),
    });
    const message = {
      openaiThreadId: thread.openaiThreadId,
      role: "user" as "user" | "assistant",
      text: faker.lorem.paragraph(),
      openaiMessageId: faker.string.uuid(),
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
    const sut = await addMessageToThread({
      ...message,
      userId: user.id,
    });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(NotAuthorized);
  });

  it("should not be able to add a message to a thread that is deleted", async () => {
    const user = await makeUser();
    const thread = await makeThread({ userId: user.id, deletedAt: new Date() });

    const message = {
      openaiThreadId: thread.openaiThreadId,
      role: "user" as "user" | "assistant",
      text: faker.lorem.paragraph(),
      openaiMessageId: faker.string.uuid(),
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };

    const sut = await addMessageToThread({
      ...message,
      userId: user.id,
    });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound);
  });

  it("should not be able to add a message to a thread that does not belong to the user", async () => {
    const user = await makeUser();
    const thread = await makeThread({ userId: user.id });
    const anotherUser = await makeUser();

    const message = {
      openaiThreadId: thread.openaiThreadId,
      role: "user" as "user" | "assistant",
      text: faker.lorem.paragraph(),
      openaiMessageId: faker.string.uuid(),
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };

    const sut = await addMessageToThread({
      ...message,
      userId: anotherUser.id,
    });

    expect(isLeft(sut)).toBe(true);
    expect(unwrapEither(sut)).toBeInstanceOf(NotAuthorized);
  });
});
