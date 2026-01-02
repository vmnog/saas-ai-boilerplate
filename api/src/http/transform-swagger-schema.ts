import { jsonSchemaTransform } from "fastify-type-provider-zod";

export function transformSwaggerSchema(
  data: Parameters<typeof jsonSchemaTransform>[0],
) {
  const { schema, url } = jsonSchemaTransform(data);

  if (schema?.consumes?.includes("multipart/form-data")) {
    schema.body = {
      type: "object",
      required: ["file"],
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    };
  }

  return { schema, url };
}
