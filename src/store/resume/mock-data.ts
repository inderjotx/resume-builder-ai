import { type ResumeData } from "@/server/db/schema";

export const mockResumeData: { data: Partial<ResumeData> } = {
    data: {
        personalInfo: {
            title: "Personal Info",
            firstName: "Richard",
            lastName: "Sanchez",
            title: "Marketing Manager",
            phoneNumber: "+123-456-7890",
            email: "richard.sanchez@example.com",
            address: "123 Anywhere St.",
            city: "Any City",
            country: "USA",
            website: "https://reallygreatsite.com",
            bio: "<p>Experienced marketing manager with a passion for brand growth and data-driven campaigns. Adept at leading cross-functional teams to deliver measurable results.</p>",
            imageUrl: "/avatars/user-image.png",
        },
        workExperience: {
            title: "Work Experience",
            items: [
                {
                    companyName: "Borcelle Studio",
                    position: "Marketing Manager & Specialist",
                    startDate: "2030-01",
                    isCurrent: true,
                    description:
                        "<ul><li>Develop and execute comprehensive marketing strategies</li><li>Lead and mentor a high-performing team</li><li>Monitor brand consistency across channels</li></ul>",
                    city: "",
                    country: "",
                },
                {
                    companyName: "Fauget Studio",
                    position: "Marketing Manager & Specialist",
                    startDate: "2025-01",
                    endDate: "2029-12",
                    description:
                        "<ul><li>Manage marketing budget, optimize ROI</li><li>Oversee market research and competitor analysis</li></ul>",
                },
                {
                    companyName: "Studio Shodwe",
                    position: "Marketing Manager & Specialist",
                    startDate: "2024-01",
                    endDate: "2025-01",
                    description:
                        "<ul><li>Maintain relationships with partners and vendors</li><li>Ensure brand consistency across materials</li></ul>",
                },
            ],
        },
        education: {
            title: "Education",
            items: [
                {
                    institutionName: "Wardiere University",
                    degree: "Master of Business Management",
                    startDate: "2029-01",
                    endDate: "2030-01",
                    city: "",
                    isCurrentlyStudying: false,
                },
                {
                    institutionName: "Wardiere University",
                    degree: "Bachelor of Business",
                    startDate: "2025-01",
                    endDate: "2029-01",
                    city: "",
                    isCurrentlyStudying: false,
                    description: "GPA: 3.8 / 4.0",
                },
            ],
        },
        skills: {
            title: "Skills",
            items: [
                { skillCategory: "Core", skillTags: ["Project Management", "Public Relations", "Teamwork", "Time Management", "Leadership", "Communication", "Critical Thinking"] },
            ],
        },
        languages: {
            title: "Languages",
            items: [
                { language: "English", proficiency: "native" as any },
                { language: "French", proficiency: "advanced" as any },
                { language: "German", proficiency: "beginner" as any },
                { language: "Spanish", proficiency: "intermediate" as any },
            ],
        },
        projects: {
            title: "Projects",
            items: [
                {
                    projectName: "Brand Revamp",
                    description: "<p>Led a cross-channel brand refresh improving awareness by 25%.</p>",
                },
            ],
        },
        achievements: {
            title: "Achievements",
            items: [
                {
                    achievementTitle: "Top 1% ROI Campaign",
                    achievementDate: "2029-06",
                    achievementDescription: "<p>Achieved top percentile ROI among company campaigns.</p>",
                },
            ],
        },
        awards: {
            title: "Awards",
            items: [
                {
                    title: "Marketer of the Year",
                    date: "2028-12",
                    issuer: "Marketing Guild",
                    description: "Recognized for outstanding leadership and results",
                },
            ],
        },
        certifications: {
            title: "Certifications",
            items: [
                {
                    certificationName: "Google Analytics Professional",
                    certificationAuthority: "Google",
                    certificationDate: "2028-01",
                    certificationLink: "https://example.com",
                },
            ],
        },
        references: {
            title: "References",
            items: [
                {
                    name: "Estelle Darcy",
                    position: "CTO",
                    company: "Wardiere Inc.",
                    email: "hello@reallygreatsite.com",
                    phoneNumber: "123-456-7890",
                    relationship: "Former Manager",
                },
                {
                    name: "Harper Richard",
                    position: "CEO",
                    company: "Wardiere Inc.",
                    email: "hello@reallygreatsite.com",
                    phoneNumber: "123-456-7890",
                    relationship: "Executive Sponsor",
                },
            ],
        },
        publications: {
            title: "Publications",
            items: [
                {
                    title: "Marketing in the AI Era",
                    date: "2029-04",
                    url: "https://example.com/pub",
                    description: "Exploring data-driven strategies for brand growth.",
                },
            ],
        },
        socialMedia: {
            title: "Social Media",
            items: [
                { platform: "website" as any, url: "https://reallygreatsite.com" },
            ],
        },
        voluntaryWork: {
            title: "Voluntary Work",
            items: [
                {
                    organizationName: "Community Org",
                    role: "Mentor",
                    startDate: "2027-01",
                    endDate: "2028-01",
                    description: "Supported youth entrepreneurship programs.",
                },
            ],
        },
        goals: {
            title: "Goals",
            items: [{ goal: "Lead brand growth to new markets" }],
        },
    },
};


