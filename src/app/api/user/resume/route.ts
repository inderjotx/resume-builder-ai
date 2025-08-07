import { getUserResumes } from "@/services/user";
import { NextResponse } from "next/server";

export const GET = async () => {

    try {

        const resumes = await getUserResumes()
        return NextResponse.json({ data: resumes, success: true });
    }

    catch (error) {
        return NextResponse.json({ error: "Failed to fetch resumes", success: false }, { status: 500 });
    }


}