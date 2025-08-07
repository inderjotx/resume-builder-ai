"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Marquee from "@/components/ui/marquee";
import { Star } from "lucide-react";
import Image from "next/image";

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

export const TestimonialsSection = () => {
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

export const ResumeExamplesSection = () => {
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
