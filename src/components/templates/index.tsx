// import {
//   DateFormat,
//   HeadlineCapitalization,
//   ResumeStatus,
//   Proficiency,
//   IconType,
//   PageSize,
//   PageNumber,
//   DEFAULT_SECTIONS,
// } from "@/server/db/schema";
// import type { ResumeData, ResumeSettings, Resume } from "@/server/db/schema";

// const sampleData: ResumeData = {
//   personalInfo: {
//     title: "Personal Info",
//     firstName: "John",
//     lastName: "Doe",
//     phoneNumber: "+1 234 567 890",
//     email: "john.doe@example.com",
//     location: "New York, USA",
//     dateOfBirth: "1990-01-01",
//     nationality: "American",
//     address: "123 Main St",
//     city: "New York",
//     postalCode: "10001",
//     country: "USA",
//     website: "https://johndoe.com",
//     bio: "Experienced software engineer with a passion for building scalable applications.",
//   },
//   workExperience: {
//     title: "Work Experience",
//     items: [
//       {
//         companyName: "Tech Corp",
//         position: "Senior Software Engineer",
//         startDate: "2020-01",
//         isCurrent: true,
//         description: "Leading development of cloud-native applications.",
//         city: "New York",
//         country: "USA",
//       },
//     ],
//   },
//   education: {
//     title: "Education",
//     items: [
//       {
//         institutionName: "University of Technology",
//         degree: "Bachelor of Science",
//         fieldOfStudy: "Computer Science",
//         startDate: "2014-09",
//         endDate: "2018-06",
//         city: "Boston",
//         isCurrentlyStudying: false,
//         description: "Focus on software engineering and distributed systems.",
//       },
//     ],
//   },
//   skills: {
//     title: "Skills",
//     items: [
//       {
//         skillCategory: "Programming Languages",
//         skillTags: ["JavaScript", "TypeScript", "Python", "Java"],
//       },
//       {
//         skillCategory: "Frameworks",
//         skillTags: ["React", "Node.js", "Express", "Next.js"],
//       },
//     ],
//   },
//   languages: {
//     title: "Languages",
//     items: [
//       {
//         language: "English",
//         proficiency: Proficiency.Native,
//       },
//       {
//         language: "Spanish",
//         proficiency: Proficiency.Advanced,
//       },
//     ],
//   },
//   projects: {
//     title: "Projects",
//     items: [
//       {
//         projectName: "E-commerce Platform",
//         description:
//           "Built a scalable e-commerce platform using React and Node.js",
//         projectLink: "https://github.com/johndoe/ecommerce",
//         startDate: "2022-01",
//         endDate: "2022-06",
//         isCurrent: false,
//       },
//     ],
//   },
//   achievements: {
//     title: "Achievements",
//     items: [],
//   },
//   awards: {
//     title: "Awards",
//     items: [],
//   },
//   references: {
//     title: "References",
//     items: [],
//   },
//   publications: {
//     title: "Publications",
//     items: [],
//   },
//   socialMedia: {
//     title: "Social Media",
//     items: [],
//   },
//   goals: {
//     title: "Goals",
//     items: [],
//   },
//   voluntaryWork: {
//     title: "Voluntary Work",
//     items: [],
//   },
//   certifications: {
//     title: "Certifications",
//     items: [],
//   },
// };

// const sampleSettings: ResumeSettings = {
//   color: "#2563eb",
//   format: 1,
//   fontFace: "Inter",
//   fontSize: "16px",
//   lineHeight: "1.5",
//   headlineCapitalization: HeadlineCapitalization.Capitalize,
//   iconType: IconType.Regular,
//   pageFormat: PageSize.A4,
//   pageNumber: PageNumber.NumbersShown,
//   dateFormat: DateFormat.MonthDayYear,
//   background: {
//     className: "bg-white",
//     opacity: 1,
//   },
//   addressFormat: {
//     order: [["street"], ["postalCode", "city"], ["country"]],
//     delimiter: ", ",
//   },
// };

// export const resumeData: Resume = {
//   id: "28409jfwpjie",
//   name: "Modern Resume",
//   data: sampleData,
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   userId: "user_123",
//   status: ResumeStatus.Draft,
//   isPublic: true,
//   settings: sampleSettings,
//   order: [
//     "personalInfo",
//     "workExperience",
//     "education",
//     "skills",
//     "projects",
//     "languages",
//     "achievements",
//     "awards",
//     "references",
//     "publications",
//     "socialMedia",
//     "goals",
//     "voluntaryWork",
//     "certifications",
//   ],
// };
