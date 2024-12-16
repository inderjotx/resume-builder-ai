"use client";

import Image from "next/image";
import { Navbar } from "@/components/navbar";
import UseCaseCard from "@/components/ui/use-case-card";

import { HeroTextAnimate } from "@/app/_components/hero-text-animate";
import { FeatureCard } from "@/components/feature-card";
import Marquee from "@/components/ui/marquee";
import { Button } from "@/components/ui/button";
import {
  FileCheck,
  Linkedin,
  Layout,
  RefreshCw,
  CheckCircle,
  MessageCircle,
  Users,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Grammar Checking",
    description:
      "Advanced AI-powered grammar and spell checking to ensure your resume is error-free.",
    icon: <FileCheck className="h-6 w-6" />,
  },
  {
    title: "ATS Friendly Resume",
    description:
      "Optimized for Applicant Tracking Systems to increase your chances of getting noticed.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    title: "LinkedIn Profile to Resume",
    description:
      "Import your LinkedIn profile and convert it into a professional resume instantly.",
    icon: <Linkedin className="h-6 w-6" />,
  },
  {
    title: "Multiple Templates",
    description:
      "Choose from a wide variety of professional templates for any industry.",
    icon: <Layout className="h-6 w-6" />,
  },
  {
    title: "Resume Transformation",
    description:
      "Transform your old resume into a modern, professional format.",
    icon: <RefreshCw className="h-6 w-6" />,
  },
];

const companies = [
  "Microsoft",
  "Google",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Tesla",
  "IBM",
];

const resumeExamples = [
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=300",
  "https://images.unsplash.com/photo-1574100004472-e536d3b6bacc?q=80&w=300",
  "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=300",
];

const emplyeeFeatures = [
  "Empower your workforce by enabling instant access to information",
  "Easy access to HR and company resources via any device",
  "Accelerate onboarding with personalized learning paths",
  "Automate workflows across your business systems",
  "Navigate time-off, benefits, and payroll effortlessly",
  "Support employees in their native language",
];

const supportFeatures = [
  "Train instantly on your support content",
  "Serve global customers in 50+ languages",
  "Integrate on the web, WhatsApp, SMS, and other channels",
  "Automatically measure resolutions",
  "Seamless live agent handoff for complex queries",
  "Understand the impact on key metrics like CSAT",
];

const salesSupportFeatures = [
  "Engage customers with personalized recommendations",
  "Provide support and upsell services across web, mobile, and social media",
  "Expand your market reach with multilingual sales support",
  "Reduce operational costs by up to 60%",
  "Automate and streamline the shopping experience on any platform",
  "Generate high-quality leads through intelligent interaction",
];

export default function Home() {
  const [text, setText] = useState("Professional");
  const phrases = ["Professional", "ATS-Friendly", "Modern", "Impressive"];

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prev) => {
        const currentIndex = phrases.indexOf(prev);
        return phrases[(currentIndex + 1) % phrases.length];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 blur-3xl" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-6xl font-bold tracking-tight">
              Create Your Resume in Minutes
            </h1>
            <HeroTextAnimate />
            <p className="mb-8 text-xl text-muted-foreground">
              AI-powered resume builder that helps you create professional
              resumes tailored to your industry and experience.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">Build Your Resume</Button>
              <Button size="lg" variant="outline">
                View Templates
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="bg-muted/50 py-12">
        <h2 className="mb-8 text-center text-lg text-muted-foreground">
          Trusted by professionals from leading companies
        </h2>
        <Marquee pauseOnHover className="py-4 [--duration:20s]">
          {companies.map((company) => (
            <div
              key={company}
              className="mx-8 font-semibold text-muted-foreground"
            >
              {company}
            </div>
          ))}
        </Marquee>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Everything you need to create the perfect resume
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-20">
        <UseCaseCard
          features={supportFeatures}
          colorScheme="pink"
          targetKey="ai-support-agent"
          icon={<MessageCircle className="text-pink-700" />}
          title="24x7 Customer Support"
          description="Resolve 70% of customer questions. Instantly."
          imageSrc="/features/pink.png"
          imageDirection="right"
        />

        <UseCaseCard
          features={emplyeeFeatures}
          targetKey="ai-employee-agent"
          colorScheme="purple"
          icon={<Users className="text-purple-600" />}
          title="Automated Employee Support"
          description="Enhance Workplace Efficiency and Morale. Effortlessly."
          imageSrc="/features/blue.png"
          imageDirection="right"
        />

        <UseCaseCard
          features={salesSupportFeatures}
          colorScheme="yellow"
          targetKey="ai-sales-agent"
          icon={<ShoppingCart className="text-yellow-600" />}
          title="AI-Enhanced Conversational Commerce"
          description="Revolutionize Customer Engagement and Drive Sales"
          imageSrc="/features/yellow.png"
          imageDirection="left"
        />
      </div>

      {/* Resume Examples Section */}
      <section className="bg-muted/50 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Resume Examples
        </h2>
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

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Guide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Examples
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
            <p>© 2024 ResumeX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
