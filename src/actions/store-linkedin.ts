'use server'
import { auth } from "@/server/auth";
import resumeService from "@/services/resume";
import subscriptionService from "@/lib/subscription";

const COST_PER_LINKEDIN_PROFILE = 2
const DESCRIPTION = "Accessing LinkedIn profile"

export async function storeLinkedIn(linkedId: string) {

    try {


        const session = await auth();
        if (!session?.user?.id || !session?.user?.email || !linkedId || linkedId.length === 0) {
            return { error: "Unauthorized", success: false };
        }

        const credits = await subscriptionService.getUserCredits(session.user.id);

        if (!credits) {
            return { error: "Failed to fetch credits", success: false };
        }

        if (credits.credits! < COST_PER_LINKEDIN_PROFILE) {
            return { error: "Insufficient credits", success: false };
        }

        await resumeService.saveLinkedInProfile(linkedId, session.user.id, session.user.email);
        await subscriptionService.deductCredits(session.user.id, COST_PER_LINKEDIN_PROFILE, DESCRIPTION);

        return { success: true };

    } catch (error) {
        console.error(error);
        return { error: "Something went wrong", success: false };
    }

}