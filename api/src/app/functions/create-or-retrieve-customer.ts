import { type Either, makeLeft, makeRight } from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { listStripeCustomersByEmail } from "@/stripe/list-stripe-customers-by-email";
import { registerStripeCustomer } from "@/stripe/register-stripe-customer";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ResourceNotFound } from "../errors/resource-not-found";

const createOrRetrieveCustomerInput = z.object({
  userId: z.string(),
  email: z.string().email(),
});

const createOrRetrieveCustomerOutput = z.object({
  stripeCustomerId: z.string(),
});

type CreateOrRetrieveCustomerInput = z.infer<
  typeof createOrRetrieveCustomerInput
>;
type CreateOrRetrieveCustomerOutput = z.infer<
  typeof createOrRetrieveCustomerOutput
>;

export async function createOrRetrieveCustomer(
  input: CreateOrRetrieveCustomerInput,
): Promise<Either<ResourceNotFound, CreateOrRetrieveCustomerOutput>> {
  const { userId, email } = createOrRetrieveCustomerInput.parse(input);

  const users = await db
    .select({
      email: schema.users.email,
    })
    .from(schema.users)
    .where(eq(schema.users.id, userId));

  if (users.length === 0) {
    return makeLeft(new ResourceNotFound("User not found"));
  }

  const customers = await db
    .select({ stripeCustomerId: schema.customers.stripeCustomerId })
    .from(schema.customers)
    .where(eq(schema.customers.userId, userId));

  let stripeCustomerId: string | undefined;

  if (customers.length === 0) {
    const stripeCustomers = await listStripeCustomersByEmail(email);

    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;

    if (!stripeCustomerId) {
      const newStripeCustomerId = await registerStripeCustomer(userId, email);
      const [newCustomer] = await db
        .insert(schema.customers)
        .values({
          userId,
          stripeCustomerId: newStripeCustomerId,
        })
        .returning();

      return makeRight({ stripeCustomerId: newCustomer.stripeCustomerId });
    }

    const [customer] = await db
      .insert(schema.customers)
      .values({
        userId,
        stripeCustomerId,
      })
      .returning({ stripeCustomerId: schema.customers.stripeCustomerId });

    return makeRight({ stripeCustomerId: customer.stripeCustomerId });
  }

  const existingCustomer = customers[0];

  return makeRight(existingCustomer);
}
