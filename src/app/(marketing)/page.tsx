import { type ColorScheme } from "@/components/ui/use-case-card";
import Image from "next/image";
import { TestimonialsSection } from "@/app/_components/hero-sections";
import UseCaseCard from "@/components/ui/use-case-card";

import { HeroTextAnimate } from "@/app/_components/hero-text-animate";
import Marquee from "@/components/ui/marquee";
import { Button } from "@/components/ui/button";
import {
  FileCheck,
  Linkedin,
  Layout,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { ResumeExamplesSection } from "@/app/_components/hero-sections";

export default function Home() {
  return (
    <div className="min-h-screen font-psSlim">
      <HeroSection />
      <CompaniesSection />
      <UseCasesSection />
      <ResumeExamplesSection />
      <TestimonialsSection />
    </div>
  );
}

const HeroSection = () => {
  return (
    <section className="relative flex h-[800px] items-center justify-center overflow-x-hidden">
      <div className="relative">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-center">
          <h1 className="mx-auto mb-6 max-w-4xl font-psMedian text-8xl font-bold tracking-tight">
            Create Your Resume in Minutes
          </h1>
          <div className="flex flex-col gap-16">
            <HeroTextAnimate />
            <p className="mx-auto max-w-2xl text-2xl text-muted-foreground">
              AI-powered resume builder that helps you create professional
              resumes tailored to your industry and experience.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button size="2xl" variant="dark">
              Build Your Resume
            </Button>
            <Button size="2xl" variant="dark-outline">
              Sign In
            </Button>
          </div>
        </div>
      </div>
      <img
        src="/gradient/hero.png"
        className="absolute -right-28 -top-40 -z-10 h-[800px] w-auto"
      />
    </section>
  );
};

const CompaniesSection = () => {
  const CompanyImages = [
    "/companies/ahrefs.svg",
    "/companies/beehiiv.svg",
    "/companies/devrev.svg",
    "/companies/jenni.svg",
    "/companies/opal.svg",
    "/companies/scispace.svg",
    "/companies/substack.svg",
    "/companies/ycombinator.svg",
    "/companies/axios.svg",
    "/companies/chegg.svg",
    "/companies/front.svg",
    "/companies/linkedin.svg",
    "/companies/posthog.svg",
    "/companies/staffbase.svg",
    "/companies/trainual.svg",
    "/companies/bcg.svg",
    "/companies/deshaw-co.svg",
    "/companies/gitlab.svg",
    "/companies/nextcloud.svg",
    "/companies/productboard.svg",
    "/companies/storyblok.svg",
    "/companies/usertesting.svg",
  ];

  return (
    <section className="mb-20 py-12">
      <Marquee className="py-4 [--duration:80s]">
        {CompanyImages.map((company) => (
          <Image
            key={company}
            src={company}
            alt={company}
            width={150}
            height={150}
            className="mx-8"
          />
        ))}
      </Marquee>
    </section>
  );
};

const UseCasesSection = () => {
  const userCase = [
    {
      ImageComponent: (
        <div className="relative h-[400px] w-auto">
          <Image
            src="/features/linkedin-down.png"
            alt="LinkedIn Profile to Resume"
            width={500}
            height={900}
            unoptimized
            className="aspect-auto rounded-2xl"
            quality={100}
          />

          <Image
            src="/features/linkedin-up.png"
            alt="LinkedIn Profile to Resume"
            unoptimized
            width={500}
            height={900}
            className="absolute -left-10 top-1/3 aspect-auto h-[350px] w-auto rounded-2xl"
            quality={100}
          />
        </div>
      ),
      title: "LinkedIn Profile to Resume",
      description:
        "Import your LinkedIn profile and convert it into a professional resume instantly.",
      features: [
        "One-click import from your LinkedIn profile",
        "Automatic formatting and organization of experience",
        "Smart content extraction and optimization",
        "Customizable sections based on LinkedIn data",
        "Professional summary generation",
        "Skills and endorsements integration",
      ],
      colorScheme: "blue",
      icon: <Linkedin className="text-blue-700" />,
      direction: "left",
      gridLayout: "wide-content",
    },
    {
      ImageComponent: (
        <Image
          src="/features/template-designs.png"
          alt="Resume Transformation"
          width={500}
          height={900}
          className="h-[400px] w-auto rounded-2xl object-contain"
          quality={100}
        />
      ),
      title: "Resume Transformation",
      description:
        "Select from a range of templates and transform your resume.",
      features: [
        "Multiple professional template designs",
        "Customizable colors and fonts",
        "Modern and traditional layout options",
        "Industry-specific templates",
        "Export in multiple formats (PDF, Word, TXT)",
        "Real-time preview of changes",
      ],
      colorScheme: "green",
      icon: <Layout className="text-green-700" />,
      direction: "right",
      gridLayout: "equal",
    },
    {
      ImageComponent: (
        <Image
          src="/features/ai-content.png"
          alt="Resume Transformation"
          width={500}
          height={900}
          className="h-[400px] w-auto rounded-2xl object-contain"
          quality={100}
        />
      ),
      title: "AI Integration",
      description: "AI to instantly add sections and proofread resume",
      features: [
        "AI-powered content suggestions",
        "Grammar and style checking",
        "Achievement bullet point generation",
        "Keyword optimization for job matches",
        "Smart formatting recommendations",
        "Professional tone adjustment",
      ],
      colorScheme: "purple",
      icon: <RefreshCw className="text-purple-700" />,
      direction: "left",
      gridLayout: "equal",
    },
    {
      ImageComponent: (
        <Image
          src="/features/ats-friendly.png"
          alt="ATS Friendly Resume"
          width={500}
          height={900}
          className="h-[400px] w-auto rounded-2xl object-contain"
          quality={100}
        />
      ),
      title: "ATS Friendly Resume",
      description:
        "Optimized for Applicant Tracking Systems to increase your chances of getting noticed.",
      features: [
        "ATS compatibility verification",
        "Keyword optimization for job descriptions",
        "Clean and parseable formatting",
        "Industry-standard section headers",
        "Machine-readable font selection",
        "PDF format optimization",
      ],
      colorScheme: "yellow",
      icon: <FileCheck className="text-yellow-700" />,
      direction: "right",
      gridLayout: "equal",
    },
    {
      ImageComponent: (
        <Image
          src="/features/step-by-step.png"
          alt="Step by Step Resume Builder"
          width={500}
          height={900}
          className="h-[400px] w-auto rounded-2xl object-contain"
          quality={100}
        />
      ),
      title: "Step by Step Resume Builder",
      description: "AI to instantly add sections and proofread resume",
      features: [
        "Guided resume building process",
        "Section-by-section instructions",
        "Progress tracking",
        "Contextual tips and examples",
        "Easy content organization",
        "Final review checklist",
      ],
      colorScheme: "pink",
      icon: <CheckCircle className="text-pink-700" />,
      direction: "left",
    },
  ];

  return (
    <div className="mx-auto mb-20 grid max-w-7xl grid-cols-1 gap-10 lg:gap-20">
      {userCase.map((item, index) => (
        <UseCaseCard
          key={index}
          features={item.features}
          colorScheme={item.colorScheme as ColorScheme}
          icon={item.icon}
          title={item.title}
          description={item.description}
          ImageComponent={item.ImageComponent}
          imageDirection={item.direction as "left" | "right"}
        />
      ))}
    </div>
  );
};
