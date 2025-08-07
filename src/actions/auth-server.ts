"use server"

import { signIn, signOut } from '@/server/auth'


export async function signInWithEmail(email: string) {
    await signIn('resend', {
        email,
        redirectTo: '/dashboard',
    });
}

export async function signInWithGoogle() {
    await signIn('google', { redirectTo: '/dashboard' });
}




export async function signOutAction() {
    await signOut({ redirect: true, redirectTo: '/' });
}