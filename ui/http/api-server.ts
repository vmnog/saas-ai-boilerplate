"server only";

import type {
  Billing,
  CheckoutSession,
  Limits,
  Message,
  Product,
  Profile,
  Subscription,
  Terms,
  Thread,
} from "./schemas";
import { http } from "./server";

export async function fetchMessagesFromThreadById(
  openaiThreadId: string,
  options: RequestInit,
) {
  const messages = await http<Message[]>(
    `/threads/${openaiThreadId}/messages`,
    options,
  );
  return messages;
}

export async function fetchThreads(options: RequestInit) {
  const threads = await http<Thread[]>("/threads", options);
  return threads;
}

export async function createThread(options: RequestInit) {
  const thread = await http<Thread>("/threads", { method: "POST", ...options });
  return thread;
}

export async function getProfile(options: RequestInit) {
  const profile = await http<Profile>("/users/me", options);
  return profile;
}

export async function getLimits(options: RequestInit) {
  const limits = await http<Limits>("/users/me/limits", options);
  return limits;
}

export async function getSubscription(options: RequestInit) {
  const subscription = await http<Subscription>(
    "/users/me/subscription",
    options,
  );
  return subscription;
}

export async function archiveThread(
  openaiThreadId: string,
  options: RequestInit,
) {
  const response = await http(`/threads/${openaiThreadId}`, {
    method: "PATCH",
    body: JSON.stringify({ archive: true }),
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  return response;
}

export async function renameThread(
  openaiThreadId: string,
  newName: string,
  options: RequestInit,
) {
  const response = await http(`/threads/${openaiThreadId}`, {
    method: "PATCH",
    body: JSON.stringify({ title: newName }),
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  return response;
}

export async function getThreadById(
  openaiThreadId: string,
  options: RequestInit,
) {
  const thread = await http<Thread>(`/threads/${openaiThreadId}`, options);
  return thread;
}

export async function fetchArchivedThreads(options: RequestInit) {
  const threads = await http<
    {
      thread: Thread;
      messagesAmount: number;
    }[]
  >("/threads/archived", options);
  return threads;
}

export async function restoreThread(
  openaiThreadId: string,
  options: RequestInit,
) {
  const response = await http<void>(`/threads/${openaiThreadId}`, {
    method: "PATCH",
    body: JSON.stringify({ archive: false }),
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  return response;
}

export async function deleteThread(
  openaiThreadId: string,
  options: RequestInit,
) {
  const response = await http<void>(`/threads/${openaiThreadId}`, {
    method: "DELETE",
    ...options,
  });
  return response;
}

export async function deleteAllArchivedChats(options: RequestInit) {
  const response = await http<void>("/threads/archived", {
    method: "DELETE",
    ...options,
  });
  return response;
}

export async function updateProfile(
  username: Profile["name"],
  options: RequestInit,
) {
  const response = await http<void>("/users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: username }),
    ...options,
  });
  return response;
}

export async function updateSubscription(
  planId: string,
  recurrence: "monthly" | "yearly",
  options: RequestInit,
) {
  const response = await http<{
    subscription: Subscription;
    limits: {
      sendMessageUsed: number;
      sendMessageLimit: number;
      sendMessageLimitResetAt: string | null;
    };
  }>(`/users/subscription`, {
    method: "PATCH",
    body: JSON.stringify({ planId, recurrence }),
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  return response;
}

export async function createCheckoutSession(
  price: { id: string; type: string; trial_period_days: number },
  redirectUrl: string,
  cancelUrl: string,
  options: RequestInit,
) {
  const response = await http<{ sessionId: string }>("/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price,
      redirectUrl,
      cancelUrl,
    }),
    ...options,
  });
  return response;
}

export async function getCheckoutSession(
  sessionId: string,
  options: RequestInit,
) {
  const session = await http<CheckoutSession>(
    `/stripe/checkout/${sessionId}`,
    options,
  );
  return session;
}

export async function getProducts(options: RequestInit) {
  const products = await http<Product[]>("/products", options);
  return products;
}

export async function createCustomerPortal(
  returnUrl: string,
  options: RequestInit,
) {
  const response = await http<{ url: string }>("/stripe/portal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      returnUrl,
    }),
    ...options,
  });
  return response;
}

export async function listBillingHistory(options: RequestInit) {
  const response = await http<Billing[]>("/stripe/history", options);
  return response;
}

export async function getUserTerms(options: RequestInit) {
  const response = await http<Terms>("/terms", options);
  return response;
}

export async function acceptTerms(options: RequestInit) {
  const response = await http<void>("/terms", {
    method: "POST",
    ...options,
  });
  return response;
}
