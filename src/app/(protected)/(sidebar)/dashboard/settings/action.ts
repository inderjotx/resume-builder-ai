"use server"

import { auth, signOut } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";


export async function deleteAccount() {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    try {
        await db.delete(users).where(eq(users.id, session.user.id));
        await signOut();
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete account" };
    }

    redirect("/");
}


