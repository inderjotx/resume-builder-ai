
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import subscriptionService from "@/lib/subscription";

export const GET = async () => {

    try {
        const session = await auth();
        const credits = await subscriptionService.getUserCredits(session?.user?.id);
        return NextResponse.json(credits);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

};