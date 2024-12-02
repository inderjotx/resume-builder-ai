CREATE TABLE IF NOT EXISTS "resume-builder_linkedin_profile" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"data" jsonb DEFAULT '{"personalInfo":{"title":"Personal Info"},"workExperience":{"title":"Work Experience","items":[]},"education":{"title":"Education","items":[]},"skills":{"title":"Skills","items":[]},"projects":{"title":"Projects","items":[]},"achievements":{"title":"Achievements","items":[]},"awards":{"title":"Awards","items":[]},"graphs":{"title":"Graphs","items":[]},"goals":{"title":"Goals","items":[]},"references":{"title":"References","items":[]},"publications":{"title":"Publications","items":[]},"voluntaryWork":{"title":"Voluntary Work","items":[]},"certifications":{"title":"Certifications","items":[]},"languages":{"title":"Languages","items":[]},"socialMedia":{"title":"Social Media","items":[]}}'::jsonb,
	"linkedin_id" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume-builder_linkedin_profile" ADD CONSTRAINT "resume-builder_linkedin_profile_user_id_resume-builder_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."resume-builder_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
