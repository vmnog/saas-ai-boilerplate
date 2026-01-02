CREATE TABLE IF NOT EXISTS "terms" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"terms-of-use" boolean,
	"privacy-policy" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "terms" ADD CONSTRAINT "terms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
