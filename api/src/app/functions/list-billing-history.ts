import { type Either, makeLeft, makeRight } from "@/core/either";
import { z } from "zod";
import { ResourceNotFound } from "../errors/resource-not-found";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { retrieveStripeBillingHistory } from "@/stripe/retrieve-stripe-billing-history";

const listBillingHistoryInput = z.object({
  userId: z.string(),
});

const listBillingHistoryOutput = z.array(
  z.object({
    id: z.string(),
    date: z.string(),
    status: z.string().nullable(),
    price: z.number(),
    downloadUrl: z.string().nullable(),
  }),
);

export type ListBillingHistoryOutput = z.output<
  typeof listBillingHistoryOutput
>;

export async function listBillngHistory(
  input: z.infer<typeof listBillingHistoryInput>,
): Promise<Either<ResourceNotFound, ListBillingHistoryOutput>> {
  const { userId } = input;

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId));

  if (!user) {
    return makeLeft(new ResourceNotFound("Usuário não encontrado"));
  }

  const [customer] = await db
    .select({ customerId: schema.customers.stripeCustomerId })
    .from(schema.customers)
    .where(eq(schema.customers.userId, userId));

  if (!customer) {
    return makeLeft(new ResourceNotFound("Customer não encontrado"));
  }

  const retrievedBillingHistory = await retrieveStripeBillingHistory(
    customer.customerId,
  );

  const mapStatusLabel = {
    draft: "Rascunho",
    open: "Em aberto",
    paid: "Pago",
    uncollectible: "Não paga",
    void: "Não paga",
  };

  const transformInvoice = (invoice: Stripe.Invoice) => ({
    id: invoice.id,
    date: new Date(invoice.created * 1000).toISOString(),
    status: invoice.status ? mapStatusLabel[invoice.status] : null,
    price: invoice.total / 100,
    downloadUrl: invoice.invoice_pdf || null,
  });

  const transformedInvoices =
    retrievedBillingHistory.data.map(transformInvoice);

  return makeRight(transformedInvoices);
}
