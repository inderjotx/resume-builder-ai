import { auth } from "@/server/auth";
import subscriptionService from "@/lib/subscription";
import { type NextRequest, NextResponse } from "next/server";
import resumeService from "@/services/resume";

const COST_PER_LINKEDIN_PROFILE = 2
const DESCRIPTION = "Accessing LinkedIn profile"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { linkedId } = body;

        if (!linkedId) {
            return NextResponse.json(
                { error: "LinkedIn ID is required", success: false },
                { status: 400 }
            );
        }

        const session = await auth();

        if (!session?.user.id) {
            return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
        }

        const credits = await subscriptionService.getUserCredits(session.user.id);

        if (!credits) {
            return NextResponse.json({ error: "Failed to fetch credits", success: false }, { status: 500 });
        }

        if (credits.credits! < COST_PER_LINKEDIN_PROFILE) {
            return NextResponse.json({ error: "Insufficient credits", success: false }, { status: 400 });
        }

        await resumeService.saveLinkedInProfile(linkedId, session.user.id, session.user.email);
        await subscriptionService.deductCredits(session.user.id, COST_PER_LINKEDIN_PROFILE, DESCRIPTION);


        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong", success: false }, { status: 500 });
    }
}