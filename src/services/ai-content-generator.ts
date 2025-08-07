import { generateObject, generateText } from "ai";
// import { openai } from "@ai-sdk/openai";
import { env } from "@/env";
import { z } from "zod";
import { type ResumeData } from "@/server/db/schema";
import { google } from "@ai-sdk/google";


const resumeDataSchema = z.object({
    personalInfo: z.object({
        iconId: z.string().optional(),
        title: z.string().optional(),
        imageUrl: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().optional(),
        location: z.string().optional(),
        dateOfBirth: z.string().optional(),
        nationality: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        website: z.string().optional(),
        bio: z.string().optional(),
    }),
    // workExperience: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         companyName: z.string().optional(),
    //         position: z.string().optional(),
    //         startDate: z.string().optional(),
    //         endDate: z.string().optional(),
    //         isCurrent: z.boolean().optional(),
    //         description: z.string().optional(),
    //         city: z.string().optional(),
    //         country: z.string().optional(),
    //     })).optional(),
    // }).optional(),
    // education: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         institutionName: z.string().optional(),
    //         degree: z.string().optional(),
    //         fieldOfStudy: z.string().optional(),
    //         startDate: z.string().optional(),
    //         endDate: z.string().optional(),
    //         city: z.string().optional(),
    //         isCurrentlyStudying: z.boolean().optional(),
    //         description: z.string().optional(),
    //         grade: z.string().optional(),
    //     })).optional(),
    // }),
    // skills: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         skillCategory: z.string().optional(),
    //         skillTags: z.array(z.string()).optional(),
    //     })).optional(),
    // }).optional(),
    // projects: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         projectName: z.string().optional(),
    //         description: z.string().optional(),
    //         projectLink: z.string().optional(),
    //         city: z.string().optional(),
    //         country: z.string().optional(),
    //         startDate: z.string().optional(),
    //         endDate: z.string().optional(),
    //         isCurrent: z.boolean().optional(),
    //     })).optional(),
    // }),
    // graphs: z.object({
    //     title: z.string().optional(),
    //     iconId: z.string().optional(),
    //     items: z.array(z.object({
    //         graphType: z.string().optional(),
    //         graphData: z.string().optional(),
    //     })).optional(),
    // }).optional(),
    // achievements: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         achievementTitle: z.string().optional(),
    //         achievementDate: z.string().optional(),
    //         achievementDescription: z.string().optional(),
    //     })).optional(),
    // }).optional(),
    // awards: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         title: z.string().optional(),
    //         date: z.string().optional(),
    //         url: z.string().optional(),
    //         issuer: z.string().optional(),
    //         description: z.string().optional(),
    //     })).optional(),
    // }).optional(),
    // references: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         name: z.string().optional(),
    //         position: z.string().optional(),
    //         company: z.string().optional(),
    //         email: z.string().optional(),
    //         phoneNumber: z.string().optional(),
    //         relationship: z.string().optional(),
    //     })).optional(),
    // }).optional(),
    // publications: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         title: z.string().optional(),
    //         date: z.string().optional(),
    //         url: z.string().optional(),
    //         description: z.string().optional(),
    //     })).optional(),
    // }).optional(),
    // languages: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         language: z.string().optional(),
    //         proficiency: z.string().optional(),
    //     })).optional(),
    // }).optional(),
    // socialMedia: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         platform: z.string().optional(),
    //         url: z.string().optional(),
    //     })).optional(),
    // }).optional(),
    // goals: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         goal: z.string().optional(),
    //     })).optional(),
    // }).optional(),
    // voluntaryWork: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         organizationName: z.string().optional(),
    //         role: z.string().optional(),
    //         startDate: z.string().optional(),
    //         endDate: z.string().optional(),
    //         isCurrent: z.boolean().optional(),
    //         description: z.string().optional(),
    //     })).optional(),
    // }).optional(),
    // certifications: z.object({
    //     iconId: z.string().optional(),
    //     title: z.string().optional(),
    //     items: z.array(z.object({
    //         certificationName: z.string().optional(),
    //         certificationDate: z.string().optional(),
    //         certificationAuthority: z.string().optional(),
    //         certificationLink: z.string().optional(),
    //         description: z.string().optional(),
    //     })).optional(),
    // }).optional(),
});



export async function generateResumeData(resumeData: Partial<ResumeData>, jobDescription: string) {
    const { systemPrompt, userPrompt } = generatePrompt(resumeData, jobDescription);
    const result = await generateText({
        model: google('gemini-1.5-pro-latest'),
        // schema: resumeDataSchema,
        prompt: userPrompt,
        system: systemPrompt,
    });

    return result.text;
}

function generatePrompt(resumeData: Partial<ResumeData>, jobDescription: string) {
    const systemPrompt = `
<SystemPrompt>
You are a highly skilled resume writing assistant specializing in creating professional, ATS-compliant resumes. Your tasks include:
1. Aligning the user's resume data with the job description.
2. Enhancing phrasing to showcase the candidate's qualifications and achievements in a compelling and professional manner.
3. Tailoring the resume to highlight key skills and experiences relevant to the job.
4. Ensuring proper formatting, logical structure, and concise, action-oriented language.
5. Adding relevant, well-phrased details that are likely to impress recruiters, while maintaining accuracy.
</SystemPrompt>
`;

    const userPrompt = `
<UserPrompt>
Given the following details, generate a tailored resume:
    
<Data>
${JSON.stringify(resumeData, null, 2)}
</Data>

<JobDescription>
${jobDescription}
</JobDescription>

<Important>
- Make the resume highly professional and tailored to the job description.
- Ensure the language aligns with industry standards and conveys the candidate's expertise.
- Use ATS-compliant formatting, with proper use of headings, bullet points, and action verbs.
- Enhance or adjust data where necessary to align closely with the job description.
</Important>

<Example>
If the job description emphasizes "team leadership" and the user has experience leading a project team, frame it as "Successfully led a cross-functional team of X members to achieve Y."
</Example>

<Avoid>
- Avoid including skills or experiences not present in the resume data unless they logically enhance alignment with the job description.
- Avoid over-exaggeration or inaccuracies in the information provided.
</Avoid>

</UserPrompt>
`;

    return { systemPrompt, userPrompt };
}
