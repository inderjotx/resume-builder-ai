import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { resume } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const getUserResumes = async () => {


    const session = await auth();
    if (!session?.user) return [];


    const userResume = await db.query.resume.findMany({
        where: eq(resume.userId, session.user.id),
        columns: {
            id: true,
            name: true,
            createdAt: true,
            thumbnail: true,
        },
        limit: 10,
    });

    return userResume;

};
