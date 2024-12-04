import { db } from "@/server/db";
import { generateResumeData } from "@/services/ai-content-generator";
import { NextResponse } from "next/server";

const jobDescription = `At Coinbase, our mission is to increase economic freedom in the world. It’s a massive, ambitious opportunity that demands the best of us, every day, as we build the emerging onchain platform — and with it, the future global financial system.
To achieve our mission, we’re seeking a very specific candidate.We want someone who is passionate about our mission and who believes in the power of crypto and blockchain technology to update the financial system.We want someone who is eager to leave their mark on the world, who relishes the pressure and privilege of working with high caliber colleagues, and who actively seeks feedback to keep leveling up.We want someone who will run towards, not away from, solving the company’s hardest problems.
Our work culture is intense and isn’t for everyone.But if you want to build the future alongside others who excel in their disciplines and expect the same from you, there’s no better place to be. 
Coinbase is seeking experienced frontend engineers to join our team to build out the next generation of crypto - forward products and features.You will help build the next generation of systems to make cryptocurrency accessible to everyone across the globe.
Coinbase One(CB1) redefines what it means to be a member of the crypto community by providing an array of unparalleled benefits like zero trading fees, boosted staking rewards, account protection, and priority support to members.Our vision is to create the Amazon Prime experience for all Coinbase users, by creating a membership that users can't afford not to get, and becomes a reason users choose Coinbase over all other competitors. 


The Trading and Security team is a pod within the Trust & Loyalty team that owns some of the most impactful Coinbase One subscription benefits in Trading(both Simple and Advanced) and Account Protection.
What you'll be doing:



Building and helping design elegant and functional user experiences.
Owning and implementing product experiences that directly drive revenue for the company.
Working with engineers, product managers and senior leadership to turn our vision into a tangible roadmap every quarter.
Adding positive energy in every meeting, and making your coworkers feel included in every interaction.

What we look for in you:



You have at least 2 + years of experience in developing web apps and shipping user - facing features with JavaScript and modern, component - based JS frameworks like React.

    You've developed and shipped user-facing features using component-based UI frameworks.
You’re familiar with current trends and best practices in front - end architecture, including performance, security and usability.
    You’re familiar with product and design lifecycles, and collaborating closely with designers, engineers, and product managers.
You write high quality, well tested code to meet the needs of your customers.

Nice to haves:



Experience with application security, specifically around two - factor authentication.
Experience with crypto or financial exchanges.
Crypto - forward experience, including familiarity with onchain activity such as interacting with Ethereum addresses, using ENS, and engaging with dApps or blockchain - based services.`;

export const GET = async () => {

    const linkedInData = await db.query.linkedInProfile.findFirst({
        where: (data, { eq }) => eq(data.linkedInId, "inderjotx"),
    });

    if (!linkedInData?.data) {
        return new Response("LinkedIn data not found", { status: 404 });
    }

    const resumeData = await generateResumeData(linkedInData.data, jobDescription);

    return NextResponse.json({ data: resumeData });



}