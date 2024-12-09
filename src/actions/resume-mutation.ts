"use server"
import { resume, type ResumeSettings, type ResumeData, SectionKeys } from "@/server/db/schema"
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





export async function updateResume({ resumeId, data, order, settings }: { resumeId: string, data: Partial<ResumeData>, order?: { id: SectionKeys, title: string }[], settings?: Partial<ResumeSettings> }) {

    try {
        const session = await auth()

        if (!session?.user?.id) {
            return {
                error: "Unauthorized"
            }
        }

        await db.update(resume).set({ data, order, settings }).where(and(eq(resume.id, resumeId), eq(resume.userId, session.user.id)))
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