DO $$ BEGIN
 CREATE TYPE "public"."message_role" AS ENUM('user', 'assistant');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attachments" (
	"id" text PRIMARY KEY NOT NULL,
	"message_id" text,
	"upload_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_codes" (
	"code" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" text,
	"user_id" text NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "limits" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"send_message_limit" integer NOT NULL,
	"send_message_used" integer DEFAULT 0 NOT NULL,
	"send_message_limit_reset_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"openai_message_id" text NOT NULL,
	"text" varchar NOT NULL,
	"role" "message_role" NOT NULL,
	"openai_thread_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "messages_openai_message_id_unique" UNIQUE("openai_message_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "new_subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"price_id" text,
	"stripe_subscription_id" text,
	"metadata" jsonb,
	"status" text,
	"quantity" integer,
	"cancel_at_period_end" boolean,
	"cancel_at" timestamp,
	"canceled_at" timestamp,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prices" (
	"id" text PRIMARY KEY NOT NULL,
	"stripe_price_id" text NOT NULL,
	"stripe_product_id" text NOT NULL,
	"active" boolean NOT NULL,
	"currency" varchar(3) NOT NULL,
	"type" varchar(255) NOT NULL,
	"unit_amount" integer,
	"interval" varchar(255),
	"interval_count" integer,
	"trial_period_days" integer,
	CONSTRAINT "prices_stripe_price_id_unique" UNIQUE("stripe_price_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" text PRIMARY KEY NOT NULL,
	"stripe_product_id" text NOT NULL,
	"active" boolean NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"image" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_stripe_product_id_unique" UNIQUE("stripe_product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "threads" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"openai_thread_id" text NOT NULL,
	"user_id" text NOT NULL,
	"archived_at" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "threads_openai_thread_id_unique" UNIQUE("openai_thread_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "uploads" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"storage" text NOT NULL,
	"file_id" text NOT NULL,
	"bytes" integer NOT NULL,
	"filename" text NOT NULL,
	"mimetype" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"avatar_url" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attachments" ADD CONSTRAINT "attachments_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attachments" ADD CONSTRAINT "attachments_upload_id_uploads_id_fk" FOREIGN KEY ("upload_id") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_codes" ADD CONSTRAINT "auth_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "limits" ADD CONSTRAINT "limits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_openai_thread_id_threads_openai_thread_id_fk" FOREIGN KEY ("openai_thread_id") REFERENCES "public"."threads"("openai_thread_id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "new_subscriptions" ADD CONSTRAINT "new_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "new_subscriptions" ADD CONSTRAINT "new_subscriptions_price_id_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "public"."prices"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threads" ADD CONSTRAINT "threads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
