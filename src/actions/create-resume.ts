'use server'

import { auth } from "@/server/auth";

const CREDITS_PER_RESUME = 10;
const description = "Creating Resume";

import subscriptionService from "@/lib/subscription";
import { db } from "@/server/db";
import { resume, type ResumeData } from "@/server/db/schema";
import { redirect } from "next/navigation";
interface CreateResumeInput {
    name: string,
    templateId: string,
    data?: ResumeData
}


export const createResume = async ({ name, templateId, data }: CreateResumeInput) => {

    let resumeId: string | undefined;
    templateId = "jfaklsr8w03842jdsjafl";
    try {

        const session = await auth();

        if (!session?.user?.id) {
            return {
                error: "Unauthorized",
                success: false,
            };

        }

        const credits = await subscriptionService.getUserCredits(session.user.id);

        if (!credits?.credits || credits.credits < CREDITS_PER_RESUME) {
            return {
                error: "Insufficient credits",
                success: false,
            };
        }

        const newResume = data ? {
            name,
            templateId,
            data,
            userId: session.user.id,
        } : {
            name,
            templateId,
            userId: session.user.id,
        }


        const resumeData = await db.insert(resume).values(newResume).returning({ id: resume.id });

        resumeId = resumeData?.[0]?.id;


        await subscriptionService.deductCredits(session.user.id, CREDITS_PER_RESUME, description);

    } catch (error) {
        console.error(error);
        return {
            error: "Internal server error",
            success: false,
        };
    }

    redirect(`/resume/${resumeId}/editor`);

}
