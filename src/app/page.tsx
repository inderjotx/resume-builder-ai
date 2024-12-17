"use client";

import { type ColorScheme } from "@/components/ui/use-case-card";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
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

const resumeExamples = [
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=300",
  "https://images.unsplash.com/photo-1574100004472-e536d3b6bacc?q=80&w=300",
  "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=300",
];

const supportFeatures = [
  "Train instantly on your support content",
  "Serve global customers in 50+ languages",
  "Integrate on the web, WhatsApp, SMS, and other channels",
  "Automatically measure resolutions",
  "Seamless live agent handoff for complex queries",
  "Understand the impact on key metrics like CSAT",
];

export default function Home() {
  return (
    <div className="font-psSlim min-h-screen">
      <Navbar />
      <HeroSection />
      <CompaniesSection />
      <UseCasesSection />
      <ResumeExamplesSection />
    </div>
  );
}

const HeroSection = () => {
  return (
    <section className="relative flex h-[800px] items-center justify-center overflow-x-hidden">
      <div className="relative">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-center">
          <h1 className="font-psMedian mx-auto mb-6 max-w-4xl text-8xl font-bold tracking-tight">
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
        <div className="h-[400px] w-auto overflow-hidden">
          <Image
            src="/features/linkedin-down.png"
            alt="LinkedIn Profile to Resume"
            width={500}
            height={900}
            className="aspect-auto rounded-2xl"
            quality={100}
          />
        </div>
      ),
      title: "LinkedIn Profile to Resume",
      description:
        "Import your LinkedIn profile and convert it into a professional resume instantly.",
      features: supportFeatures,
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
          className="w-auto rounded-2xl object-contain"
          quality={100}
        />
      ),
      title: "Resume Transformation",
      description:
        "Select from a range of templates and transform your resume.",
      features: supportFeatures,
      colorScheme: "green",
      icon: <Layout className="text-green-700" />,
      direction: "right",
      gridLayout: "equal",
    },
    {
      ImageComponent: (
        <Image
          src="/features/ai-content.png"
          alt="AI Integration"
          width={500}
          height={900}
          className="h-[300px] w-auto rounded-2xl object-contain"
          quality={100}
        />
      ),
      title: "AI Integration",
      description: "AI to instantly add sections and proofread resume",
      features: supportFeatures,
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
          className="h-[300px] w-auto rounded-2xl object-contain"
          quality={100}
        />
      ),
      title: "ATS Friendly Resume",
      description:
        "Optimized for Applicant Tracking Systems to increase your chances of getting noticed.",
      features: supportFeatures,
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
          className="h-[300px] w-auto rounded-2xl object-contain"
          quality={100}
        />
      ),
      title: "Step by Step Resume Builder",
      description: "AI to instantly add sections and proofread resume",
      features: supportFeatures,
      colorScheme: "pink",
      icon: <CheckCircle className="text-pink-700" />,
      direction: "left",
    },
  ];

  return (
    <div className="mx-auto mb-20 grid max-w-7xl grid-cols-1 gap-20">
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

const ResumeExamplesSection = () => {
  return (
    <section className="bg-muted/50 py-20">
      <h2 className="mb-12 text-center text-3xl font-bold">Resume Examples</h2>
      <Marquee className="py-4" speed={50}>
        {resumeExamples.map((url, index) => (
          <div key={index} className="mx-4">
            <Image
              src={url}
              width={300}
              height={400}
              alt={`Resume example ${index + 1}`}
              className="h-[400px] w-[300px] rounded-lg object-cover shadow-lg"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
};
