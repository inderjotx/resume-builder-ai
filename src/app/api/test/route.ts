import { Client, Profile } from 'linkedin-private-api';
import { NextResponse } from 'next/server';
import { env } from '@/env';



export const GET = async () => {
    const client = new Client();
    await client.login.userCookie({
        username: env.LINKEDIN_USERNAME,
        cookies: {
            JSESSIONID: env.LINKEDIN_JSESSIONID,
            li_at: env.LINKEDIN_LI_AT,
        }
    })

    const profileId = "williamhgates"
    const response = await client.profile.getProfile({
        publicIdentifier: profileId,
    });

    return NextResponse.json(response);
};


const mapProfileToResumeData = (profile: Profile) => {

    const firstName = profile?.firstName
    const lastName = profile?.lastName
    const bio = (profile as any)?.multiLocaleSummary?.en_US
    const headline = profile?.headline



}