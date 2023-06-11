CREATE TABLE IF NOT EXISTS "characters" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"guildRank" integer NOT NULL,
	"classId" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "classes" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "specializations" (
	"id" integer PRIMARY KEY NOT NULL,
	"classId" integer NOT NULL,
	"name" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "sync_history" (
	"report_name" varchar PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "wishlist_uploads" (
	"character_id" integer NOT NULL,
	"specialization_id" integer NOT NULL,
	"normal" timestamp,
	"heroic" timestamp,
	"mythic" timestamp
);
--> statement-breakpoint
ALTER TABLE "wishlist_uploads" ADD CONSTRAINT "wishlist_uploads_character_id_specialization_id" PRIMARY KEY("character_id","specialization_id");

DO $$ BEGIN
 ALTER TABLE "characters" ADD CONSTRAINT "characters_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "specializations" ADD CONSTRAINT "specializations_classId_classes_id_fk" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "wishlist_uploads" ADD CONSTRAINT "wishlist_uploads_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "wishlist_uploads" ADD CONSTRAINT "wishlist_uploads_specialization_id_specializations_id_fk" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
