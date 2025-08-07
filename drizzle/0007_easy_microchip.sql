ALTER TABLE "resume-builder_linkedin_profile" DROP CONSTRAINT "resume-builder_linkedin_profile_linkedin_id_unique";--> statement-breakpoint
ALTER TABLE "resume-builder_post" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "resume-builder_post" ALTER COLUMN "id" DROP IDENTITY;