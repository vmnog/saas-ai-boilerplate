import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { env } from "@/env";
import { fastifyCors } from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";

import {
  type ZodTypeProvider,
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { fastifyCookie } from "@fastify/cookie";
import { fastifyMultipart } from "@fastify/multipart";
import fastifyWebsocket from "@fastify/websocket";
import { acceptTermsRoute } from "./routes/accept-terms";
import { addMessageToThreadRoute } from "./routes/add-message-to-thread";
import { authenticateFromCodeRoute } from "./routes/authenticate-from-code";
import { createCheckoutRoute } from "./routes/create-checkout";
import { createCustomerPortalRoute } from "./routes/create-customer-portal";
import { createUploadFileRoute } from "./routes/create-upload-file";
import { deleteAllArchivedThreadsRoute } from "./routes/delete-all-archived-thread";
import { deleteThreadRoute } from "./routes/delete-thread";
import { deleteUploadFileRoute } from "./routes/delete-upload-file";
import { getLastThreadRunRoute } from "./routes/get-last-thread-run";
import { getThreadRoute } from "./routes/get-thread";
import { getUserLimitsRoute } from "./routes/get-user-limits";
import { getUserProfileRoute } from "./routes/get-user-profile";
import { getUserSubscriptionRoute } from "./routes/get-user-subscription";
import { getUserTermsRoute } from "./routes/get-user-terms";
import { healthCheckRoute } from "./routes/health-check";
import { listArchivedThreadsRoute } from "./routes/list-archived-threads";
import { listBillingHistoryRoute } from "./routes/list-billing-history";
import { listProductsRoute } from "./routes/list-products";
import { listThreadMessagesRoute } from "./routes/list-thread-messages";
import { listThreadsRoute } from "./routes/list-threads";
import { listenWebhooksRoute } from "./routes/listen-webhooks";
import { registerFeedbackRoute } from "./routes/register-feedback";
import { registerUserRoute } from "./routes/register-user";
import { retrieveCheckoutRoute } from "./routes/retrieve-checkout";
import { sendAuthenticationLinkRoute } from "./routes/send-authentication-link";
import { startThreadRoute } from "./routes/start-thread";
import { transcribeAudioFileRoute } from "./routes/transcribe-audio-file";
import { updateThreadRoute } from "./routes/update-thread";
import { updateUserProfileRoute } from "./routes/update-user-profile";
import { transformSwaggerSchema } from "./transform-swagger-schema";

const envLoggerConfig = {
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
};

const envToLogger = {
  development: envLoggerConfig,
  production: false,
  test: false,
};

const server = fastify({
  logger: envToLogger[env.NODE_ENV] ?? true, // defaults to true if no entry matches in the map
}).withTypeProvider<ZodTypeProvider>();

server.setErrorHandler((err, req, reply) => {
  if (hasZodFastifySchemaValidationErrors(err)) {
    return reply.code(400).send({
      error: "Response Validation Error",
      message: err.message,
      statusCode: 400,
      details: {
        issues: err.validation,
        method: req.method,
        url: req.url,
      },
    });
  }

  if (isResponseSerializationError(err)) {
    return reply.code(500).send({
      error: "Internal Server Error",
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: {
        issues: err.cause.issues,
        method: err.method,
        url: err.url,
      },
    });
  }

  console.error("🚨 Global Error Handler:\n", err, "\n");
  return reply.code(err.statusCode ?? 500).send({
    error: err.name,
    message: err.message,
    statusCode: err.statusCode ?? 500,
  });
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors, { origin: "*" });
server.register(fastifyJwt, { secret: env.USER_JWT_SECRET });
server.register(fastifyMultipart, {
  limits: { fileSize: 1024 * 1024 * 2 }, // 2mb
});
server.register(fastifyCookie);
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "ACME",
      version: "1.0.0",
    },
  },
  transform: transformSwaggerSchema,
});
server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});
server.register(fastifyWebsocket, {
  options: {
    maxPayload: 1048576,
  },
});

server.register(healthCheckRoute);
server.register(authenticateFromCodeRoute);
server.register(sendAuthenticationLinkRoute);
server.register(startThreadRoute);
server.register(addMessageToThreadRoute);
server.register(listThreadsRoute);
server.register(registerUserRoute);
server.register(listThreadMessagesRoute);
server.register(getUserProfileRoute);
server.register(createUploadFileRoute);
server.register(deleteUploadFileRoute);
server.register(updateThreadRoute);
server.register(getThreadRoute);
server.register(getLastThreadRunRoute);
server.register(listArchivedThreadsRoute);
server.register(deleteThreadRoute);
server.register(deleteAllArchivedThreadsRoute);
server.register(updateUserProfileRoute);
server.register(getUserLimitsRoute);
server.register(getUserSubscriptionRoute);
server.register(createCheckoutRoute);
server.register(retrieveCheckoutRoute);
server.register(listProductsRoute);
server.register(createCustomerPortalRoute);
server.register(listBillingHistoryRoute);
server.register(registerFeedbackRoute);
server.register(acceptTermsRoute);
server.register(getUserTermsRoute);
server.register(transcribeAudioFileRoute);

server.register((fastify, _opts, next) => {
  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "buffer" },
    (_req, body, done) => {
      try {
        const newBody = {
          raw: body,
        };
        done(null, newBody);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        error.statusCode = 400;
        done(error, undefined);
      }
    },
  );

  fastify.post("/webhook", {
    handler: listenWebhooksRoute,
  });

  next();
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
process.on("unhandledRejection", (error: any, promise: Promise<never>) => {
  if (error?.name) {
    console.error("Server Unhandled Rejection:", {
      error: {
        name: error?.name,
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
      },
      promise,
    });
    // throw new Error(error);
  }
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
process.on("uncaughtException", (error: any, origin: string) => {
  if (error?.name) {
    console.error("Server Uncaught Exception:", {
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      },
      origin,
    });
    // throw new Error(error);
  }
});

function gracefulShutdown(signal: string) {
  return () => {
    console.info(`Received ${signal}. Starting graceful shutdown...`);
    server.close(() => {
      console.info("Server closed. Process terminating...");
      process.exit(0);
    });
  };
}

process.on("SIGTERM", gracefulShutdown("SIGTERM"));
process.on("SIGINT", gracefulShutdown("SIGINT"));

server
  .listen({
    port: env.PORT || 8080,
    host: "0.0.0.0",
  })
  .then((address) => {
    console.info(`Server running on ${address}`);
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });

if (env.NODE_ENV === "development") {
  const spec = "./swagger.json";
  const specFile = resolve(import.meta.dirname, "../..", spec);

  server.ready(() => {
    const apiSpec = JSON.stringify(server.swagger() || {}, null, 2);

    writeFile(specFile, apiSpec).then(() => {
      console.log(`Swagger specification file write to ${spec}`);
    });
  });
}
