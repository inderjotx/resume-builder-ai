"use server"

import { signIn, signOut } from '@/server/auth'


export async function signInWithEmail(email: string) {
    await signIn('resend', {
        email,
        redirectTo: '/',
        redirect: false,
    });
}

export async function signInWithGoogle() {
    await signIn('google', { redirectTo: '/' });
}




export async function signOutAction() {
    await signOut({ redirect: true, redirectTo: '/sign-in' });
}