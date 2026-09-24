CREATE TABLE "applications" (
	"id" serial PRIMARY KEY,
	"user_id" text DEFAULT 'personal' NOT NULL,
	"company" text NOT NULL,
	"role" text NOT NULL,
	"source" text DEFAULT 'Direct' NOT NULL,
	"status" text DEFAULT 'Saved' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
