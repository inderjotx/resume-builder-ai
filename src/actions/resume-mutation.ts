"use server"
import { resume, type ResumeData } from "@/server/db/schema"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { and, eq } from "drizzle-orm"


export async function deleteResume({ resumeId }: { resumeId: string }) {

    try {
        const session = await auth()

        if (!session?.user?.id) {
            return {
                error: "Unauthorized"
            }
        }

        await db.delete(resume).where(and(eq(resume.id, resumeId), eq(resume.userId, session.user.id)))
        return {
            success: true
        }

    } catch (error) {
        console.error(error)
        return {
            error: "Failed to delete resume"
        }
    }
}




export async function renameResume({ resumeId, name }: { resumeId: string, name: string }) {

    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
        const session = await auth()

        if (!session?.user?.id) {
            return {
                error: "Unauthorized"
            }
        }

        await db.update(resume).set({ name }).where(and(eq(resume.id, resumeId), eq(resume.userId, session.user.id)))
        return {
            success: true
        }

    } catch (error) {
        console.error(error)
        return {
            error: "Failed to rename resume"
        }
    }
}





export async function updateResume({ resumeId, name, data }: { resumeId: string, name: string, data: Partial<ResumeData> }) {

    try {
        const session = await auth()

        if (!session?.user?.id) {
            return {
                error: "Unauthorized"
            }
        }

        await db.update(resume).set({ name, data }).where(and(eq(resume.id, resumeId), eq(resume.userId, session.user.id)))
        return {
            success: true
        }

    } catch (error) {
        console.error(error)
        return {
            error: "Failed to update resume"
        }
    }
}