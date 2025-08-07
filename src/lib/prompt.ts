
export type ResumeData = {
    personalInfo: {
        title: "Personal Information";
        imageUrl: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
        location: string;
        dateOfBirth: string;
        nationality: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        website: string;
        bio: string;
    };
    workExperience: {
        title: "Work Experience";
        items: Array<{
            companyName: string;
            position: string;
            startDate: string;
            endDate: string;
            isCurrent: boolean;
            description: string;
            city: string;
            country: string;
        }>;
    };
    education: {
        title: "Education";
        items: Array<{
            institutionName: string;
            degree: string;
            fieldOfStudy: string;
            startDate: string;
            endDate: string;
            city: string;
            isCurrentlyStudying: boolean;
            description: string;
            grade: string;
        }>;
    };
    skills: {
        title: "Skills";
        items: Array<{
            skillCategory: string;
            skillTags: string[];
        }>;
    };
    achievements: {
        title: "Achievements";
        items: Array<{
            achievementTitle: string;
            achievementDate: string;
            achievementDescription: string;
        }>;
    };
    awards: {
        title: "Awards";
        items: Array<{
            title: string;
            date: string;
            url: string;
            issuer: string;
            description: string;
        }>;
    };
    references: {
        title: "References";
        items: Array<{
            name: string;
            position: string;
            company: string;
            email: string;
            phoneNumber: string;
            relationship: string;
        }>;
    };
    publications: {
        title: "Publications";
        items: Array<{
            title: string;
            date: string;
            url: string;
            description: string;
        }>;
    };
    projects: {
        title: "Projects";
        items: Array<{
            projectName: string;
            description: string;
            projectLink: string;
            city: string;
            country: string;
            startDate: string;
            endDate: string;
            isCurrent: boolean;
        }>;
    };
    languages: {
        title: "Languages";
        items: Array<{
            language: string;
            proficiency: string
        }>;
    };
    socialMedia: {
        title: "Social Media";
        items: Array<{
            platform: string;
            url: string;
        }>;
    };
    goals: {
        title: "Goals";
        items: Array<{
            goal: string;
        }>;
    };
    voluntaryWork: {
        title: "Voluntary Work";
        items: Array<{
            organizationName: string;
            role: string;
            startDate: string;
            endDate: string;
            isCurrent: boolean;
            description: string;
        }>;
    };
    certifications: {
        title: "Certifications";
        items: Array<{
            certificationName: string;
            certificationDate: string;
            certificationAuthority: string;
            certificationLink: string;
            description: string;
        }>;
    };
};


const exampleInputAndOutput = `

<input>

Supercoder is an AI-powered career development platform that connects developers worldwide to remote job opportunities with competitive pay.
Our client, based in Korea, is seeking an experienced Fullstack React Developer with the details below to join their innovative team.
Type of role: 100% Full-time remote
About the Company
We are an established online education provider specializing in personalized 1:1 English lessons since 2016. With a team of experienced instructors, we deliver tailored lessons via Zoom, ensuring effective learning through continuously updated educational materials and systems. Our goal is to provide an optimal online learning environment tailored to students' needs.
Our website and system require ongoing maintenance and development as we currently operate without in-house developers. This role involves addressing various website issues, implementing additional features, and ensuring overall system maintenance.
Role Overview
We are seeking a skilled Full-Stack Developer to manage and enhance our platform. This includes fixing errors, refactoring existing code, developing new features, and maintaining our website and system. Candidates must be proficient in both frontend and backend technologies and be comfortable managing physical servers on AWS.
Key Responsibilities
Troubleshoot and fix errors on the platform.
Refactor and optimize existing code for better performance.
Develop and implement new features as required.
Maintain and improve the overall system and website functionality.
Collaborate with stakeholders to understand and prioritize system needs.
Required Qualifications
Proficiency in development tools: IntelliJ and VSCode.
Expertise in managing physical servers on AWS.
Hands-on experience with frontend technologies: React, NextJS, TypeScript, JavaScript.
Strong backend experience with NodeJS.
Ability to switch between TypeScript and JavaScript seamlessly.
Fluency in English (essential for effective communication).
Preferred Qualifications
4+ years of experience with AWS, React, NextJS, TypeScript, JavaScript, and NodeJS.
Proven ability to work on both backend and frontend tasks.
Experience working with minimal supervision and managing multiple priorities.
Tech Stack
Development Tools: IntelliJ, VSCode
Physical Server: AWS
Frontend: React, NextJS, TypeScript, JavaScript
Backend: NodeJS
What We Offer
Opportunity to work with a dedicated and innovative team.
Remote position with flexible work arrangements.
Potential for a long-term partnership based on performance.

</input>

<output>
{
  "personalInfo": {
    "title": "Personal Information",
    "imageUrl": "https://example.com/profile.jpg",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "email": "johndoe@example.com",
    "location": "Seoul, South Korea",
    "dateOfBirth": "1990-05-15",
    "nationality": "American",
    "address": "123 Developer Lane",
    "city": "Seoul",
    "postalCode": "10001",
    "country": "South Korea",
    "website": "https://johndoe.dev",
    "bio": "Experienced Full-Stack Developer with expertise in React, Next.js, and AWS. Passionate about building scalable and efficient systems with a focus on user experience and code quality."
  },
  "workExperience": {
    "title": "Work Experience",
    "items": [
      {
        "companyName": "Tech Solutions Inc.",
        "position": "Full-Stack Developer",
        "startDate": "2019-06-01",
        "endDate": "2023-12-01",
        "isCurrent": false,
        "description": "Developed and maintained scalable web applications using React, Next.js, and Node.js. Optimized server performance on AWS and collaborated with cross-functional teams to deliver client-specific solutions.",
        "city": "San Francisco",
        "country": "USA"
      },
      {
        "companyName": "CodeCraft Studios",
        "position": "Frontend Developer",
        "startDate": "2016-04-01",
        "endDate": "2019-05-31",
        "isCurrent": false,
        "description": "Led the frontend development team to create interactive web interfaces using React and TypeScript. Implemented responsive designs and improved application performance.",
        "city": "New York",
        "country": "USA"
      }
    ]
  },
  "education": {
    "title": "Education",
    "items": [
      {
        "institutionName": "University of California, Berkeley",
        "degree": "Bachelor's Degree",
        "fieldOfStudy": "Computer Science",
        "startDate": "2012-08-01",
        "endDate": "2016-05-01",
        "city": "Berkeley",
        "isCurrentlyStudying": false,
        "description": "Focused on software development, data structures, and cloud computing.",
        "grade": "3.8/4.0"
      }
    ]
  },
  "skills": {
    "title": "Skills",
    "items": [
      {
        "skillCategory": "Frontend Development",
        "skillTags": ["React", "Next.js", "JavaScript", "TypeScript", "CSS", "HTML"]
      },
      {
        "skillCategory": "Backend Development",
        "skillTags": ["Node.js", "Express.js", "REST API", "GraphQL"]
      },
      {
        "skillCategory": "DevOps & Cloud",
        "skillTags": ["AWS", "Server Management", "CI/CD", "Docker", "Kubernetes"]
      },
      {
        "skillCategory": "Tools",
        "skillTags": ["IntelliJ", "VSCode", "Git"]
      }
    ]
  },
  "achievements": {
    "title": "Achievements",
    "items": [
      {
        "achievementTitle": "Implemented Scalable Learning Management System",
        "achievementDate": "2022-07-01",
        "achievementDescription": "Redesigned an LMS to handle 10,000+ concurrent users, increasing reliability and performance by 30%."
      }
    ]
  },
  "awards": {
    "title": "Awards",
    "items": [
      {
        "title": "Best Developer Award",
        "date": "2021-06-01",
        "url": "",
        "issuer": "Tech Solutions Inc.",
        "description": "Recognized for outstanding contributions to web application development and system optimization."
      }
    ]
  },
  "references": {
    "title": "References",
    "items": [
      {
        "name": "Jane Smith",
        "position": "CTO",
        "company": "Tech Solutions Inc.",
        "email": "janesmith@example.com",
        "phoneNumber": "+1987654321",
        "relationship": "Former Manager"
      }
    ]
  },
  "publications": {
    "title": "Publications",
    "items": []
  },
  "projects": {
    "title": "Projects",
    "items": [
      {
        "projectName": "Online Education Platform",
        "description": "Developed a platform with real-time video lessons, user management, and secure payment integration using React, Next.js, and AWS.",
        "projectLink": "https://example.com/online-education",
        "city": "Seoul",
        "country": "South Korea",
        "startDate": "2022-01-01",
        "endDate": "2023-01-01",
        "isCurrent": false
      }
    ]
  },
  "languages": {
    "title": "Languages",
    "items": [
      {
        "language": "English",
        "proficiency": "Native"
      },
      {
        "language": "Korean",
        "proficiency": "Intermediate"
      }
    ]
  },
  "socialMedia": {
    "title": "Social Media",
    "items": [
      {
        "platform": "LinkedIn",
        "url": "https://linkedin.com/in/johndoe"
      },
      {
        "platform": "GitHub",
        "url": "https://github.com/johndoe"
      }
    ]
  },
  "goals": {
    "title": "Goals",
    "items": [
      {
        "goal": "To contribute to the growth of an innovative online learning platform by leveraging my expertise in full-stack development."
      }
    ]
  },
  "voluntaryWork": {
    "title": "Voluntary Work",
    "items": [
      {
        "organizationName": "Code for All",
        "role": "Mentor",
        "startDate": "2020-03-01",
        "endDate": "2021-12-01",
        "isCurrent": false,
        "description": "Mentored aspiring developers, conducting workshops on full-stack development and best practices."
      }
    ]
  },
  "certifications": {
    "title": "Certifications",
    "items": [
      {
        "certificationName": "AWS Certified Solutions Architect",
        "certificationDate": "2023-03-01",
        "certificationAuthority": "AWS",
        "certificationLink": "https://aws.amazon.com/certification/",
        "description": "Validated expertise in designing and deploying scalable, highly available, and fault-tolerant systems on AWS."
      }
    ]
  }
}


</output>


`

const exmpleInputandOutput2 = ``