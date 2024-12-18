"use client";

import { type ColorScheme } from "@/components/ui/use-case-card";
import Image from "next/image";
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
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ResponsiveModalDrawer } from "@/components/ui/responsive-modal";

const resumeExamples = [
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=300",
  "https://images.unsplash.com/photo-1574100004472-e536d3b6bacc?q=80&w=300",
  "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=300",
];

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

const ResumeExamplesSection = () => {
  const resumePicture = [
    "/resume/bookmark.png",
    "/resume/classy.png",
    "/resume/doodle.png",
    "/resume/gradient.png",
    "/resume/postcard.png",
    "/resume/sharp.png",
    "/resume/smart.png",
    "/resume/soft.png",
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-20">
      <h2 className="mb-12 text-center font-tobe text-5xl font-thin">
        Resume Examples
      </h2>
      <div className="relative mx-auto max-w-5xl">
        <Marquee pauseOnHover className="py-4" speed={50}>
          {resumePicture.map((url, index) => (
            <div
              key={index}
              className="relative mx-4 cursor-pointer rounded-md ring-black ring-offset-2 transition-transform hover:scale-105 hover:ring-2"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <Image
                src={url}
                width={300}
                height={400}
                quality={80}
                alt={`Resume example ${index + 1}`}
                className="h-[300px] w-[220px] rounded-lg object-cover shadow-lg"
              />
              <div
                className={`absolute inset-0 flex items-end justify-center p-3 transition-opacity duration-200 ${activeIndex === index ? "opacity-100" : "opacity-0"}`}
              >
                <Button size="xs" variant="default" className="rounded-sm">
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "John Doe",
      title: "Software Engineer",
      personImage: "/people/person-1.png",
      companyLogo: "/companies/axios.svg",
      testimonial:
        "Trust the process of allowing someone else who offers this expertise to help you. They know what they are doing.",
    },
    {
      name: "John Doe",
      title: "Software Engineer",
      personImage: "/people/person-2.png",
      companyLogo: "/companies/linkedin.svg",
      testimonial:
        "I already recommended Enhancv to all of my friends. I am still using their service to update my resume, even after finding a job. ",
    },
    {
      name: "John Doe",
      title: "Software Engineer",
      personImage: "/people/person-3.png",
      companyLogo: "/companies/ycombinator.svg",
      testimonial:
        "Enhancv Executive has changed my life: One week & four interviews later, I will be making 150% more doing the job I chose.",
    },
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(testimonials[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(
        testimonials[Math.floor(Math.random() * testimonials.length)],
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-end justify-center overflow-hidden pb-16 pt-36">
      <Image
        src="/gradient/feature.png"
        alt="Testimonial"
        width={500}
        height={500}
        className="absolute inset-x-0 top-0 -z-10 h-[600px] w-[2000px] bg-white object-center"
      />

      <div className="mx-auto grid max-w-5xl grid-cols-1 rounded-lg bg-black p-6 lg:h-[300px] lg:grid-cols-3">
        <TestimonialCard
          name={activeTestimonial!.name}
          title={activeTestimonial!.title}
          personImage={activeTestimonial!.personImage}
          companyLogo={activeTestimonial!.companyLogo}
          testimonial={activeTestimonial!.testimonial}
        />
        <div className="col-span-1 flex flex-col justify-start gap-4 pt-6 lg:col-span-2">
          <h4 className="max-w-xl text-center font-psMedian text-3xl text-white lg:text-left">
            Your resume is an extension of yourself make one that&apos;s truly
            you
          </h4>
          <div className="flex justify-center lg:justify-start">
            <Button size="2xl" variant="secondary">
              Build Your Resume
            </Button>
          </div>
          <div className="inline-flex justify-center gap-2 p-2 lg:justify-start">
            <Star className="fill-yellow-500 text-yellow-500" />
            <Star className="fill-yellow-500 text-yellow-500" />
            <Star className="fill-yellow-500 text-yellow-500" />
            <Star className="fill-yellow-500 text-yellow-500" />
            <Star className="fill-yellow-500 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({
  name,
  title,
  personImage,
  companyLogo,
  testimonial,
}: {
  name: string;
  title: string;
  personImage: string;
  companyLogo: string;
  testimonial: string;
}) => {
  return (
    <div className="relative mx-auto flex h-[350px] w-[250px] flex-col rounded-md border bg-[#FFEEF1] p-6 lg:-translate-y-28">
      <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 items-center justify-center">
        <Image
          src={personImage}
          alt="Person image"
          width={100}
          height={100}
          className="z-10 size-24 rounded-full border-2 object-contain"
        />
      </div>

      <div className="mt-10 flex flex-col justify-around gap-4">
        <div className="flex flex-wrap">
          <p className="text-sm leading-relaxed text-gray-700">
            &quot; {testimonial} &quot;
          </p>
        </div>

        <div className="">
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{title}</p>

          <div className="my-4 h-[1px] w-full bg-gray-300"></div>

          <div className="">
            <Image
              src={companyLogo}
              alt="Company logo"
              width={80}
              height={24}
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
