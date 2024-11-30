ALTER TABLE "resume-builder_resume" ADD COLUMN "thumbnail" varchar(255);--> statement-breakpoint
ALTER TABLE "resume-builder_user" DROP COLUMN IF EXISTS "thumbnail";