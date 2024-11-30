import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { resume } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const getUserResumes = async () => {


    const session = await auth();
    if (!session?.user) return [];


    await db.query.resume.findMany({
        where: eq(resume.userId, session.user.id),
        columns: {
            id: true,
            name: true,
            createdAt: true,
            thumbnail: true,
        },
        limit: 10,
    });

    return fakeResumes;

};

const fakeResumes = [
    {
        id: "1",
        name: "Resume 1",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
        thumbnail: "/resume/resume1.png",
    },
    {
        id: "2",
        name: "Resume 2",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 60)),
        thumbnail: "/resume/resume2.png",
    },
    {
        id: "3",
        name: "Resume 3",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 90)),
        thumbnail: "/resume/resume3.png",
    },
];