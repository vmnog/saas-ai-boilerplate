import { env } from "@/env";
import { OpenAI } from "openai";

export const openai = new OpenAI({
  fetch: async (url, init) => {
    console.log("Request URL:", url);
    console.log("Request Headers:", init?.headers);
    console.log("Request Body:", init?.body);

    // Make the actual request
    const response = await fetch(url, {
      ...init,
      // @ts-ignore
      duplex: "half",
    });
    return response;
  },
  apiKey: env.OPENAI_API_KEY,
});
