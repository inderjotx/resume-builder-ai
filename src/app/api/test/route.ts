import { Client, Profile } from 'linkedin-private-api';
import { NextResponse } from 'next/server';
import { env } from '@/env';



export const GET = async () => {
    try {
        const client = new Client();

        // 1. First verify your cookies are valid and not expired
        await client.login.userCookie({
            username: env.LINKEDIN_USERNAME,
            cookies: {
                JSESSIONID: env.LINKEDIN_JSESSIONID,
                li_at: env.LINKEDIN_LI_AT,
            }
        })

        // 2. Add error handling
        const myProfile = await client.profile.getOwnProfile()
        const profileId = "williamhgates"
        const response = await client.profile.getProfile({
            publicIdentifier: profileId,
        });

        return NextResponse.json(response);
    } catch (error) {
        console.error('LinkedIn API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch LinkedIn profile' },
            { status: 500 }
        );
    }
};


const mapProfileToResumeData = (profile: Profile) => {

    const firstName = profile?.firstName
    const lastName = profile?.lastName
    const bio = (profile as any)?.multiLocaleSummary?.en_US
    const headline = profile?.headline



}