import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ColorScheme = "blue" | "green" | "yellow" | "purple" | "pink";

interface FeatureCardProps {
  imageDirection?: "left" | "right";
  features: string[];
  colorScheme: ColorScheme;
  icon: React.ReactNode;
  title: string;
  description: string;
  ImageComponent: React.ReactNode;
}

export default function UseCaseCard({
  features,
  colorScheme,
  icon,
  title,
  description,
  ImageComponent,
  imageDirection = "left",
}: FeatureCardProps) {
  const colorClasses = {
    blue: {
      gradient: "from-blue-100 via-blue-50 to-white",
      text: "text-blue-700",
      shadow: "rgba(59, 130, 246, 0.1)", // blue-100 as rgba
    },
    green: {
      gradient: "from-green-100 via-green-50 to-white",
      text: "text-green-700",
      shadow: "rgba(16, 185, 129, 0.1)", // green-100 as rgba
    },
    yellow: {
      gradient: "from-yellow-100 via-yellow-50 to-white",
      text: "text-yellow-700",
      shadow: "rgba(252, 211, 77, 0.1)", // yellow-100 as rgba
    },
    purple: {
      gradient: "from-purple-100 via-purple-50 to-white",
      text: "text-purple-700",
      shadow: "rgba(167, 139, 250, 0.1)", // purple-100 as rgba
    },
    pink: {
      gradient: "from-pink-100 via-pink-50 to-white",
      text: "text-pink-700",
      shadow: "rgba(236, 72, 153, 0.1)", // pink-100 as rgba
    },
  };

  const { gradient, text, shadow } = colorClasses[colorScheme];

  return (
    <div
      className={cn(
        "sticky top-20 mx-2 flex w-full flex-col items-center justify-center gap-12 overflow-hidden rounded-xl border bg-gradient-to-b p-6 lg:mx-auto lg:p-12",
        gradient,
      )}
    >
      <div
        className={cn(
          "custom-shadow-color mx-auto flex items-center justify-between gap-2 rounded-full bg-white p-3 px-5 text-xl font-semibold sm:text-2xl",
          `custom-shadow-${colorScheme}`,
        )}
      >
        {icon}
        <h1 className="font-psMedian text-center font-thin">{title}</h1>
      </div>
      <div className="grid w-full grid-cols-3 gap-x-10">
        <div className={cn("col-span-3 w-full lg:col-span-2", "lg:ml-24")}>
          <div className={cn("flex flex-col gap-6")}>
            <h1 className="max-w-lg text-xl font-thin sm:text-3xl">
              {description}
            </h1>
            <div className="flex flex-col gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <CheckCircle className={cn("size-6", text)} />
                  <h1 className="text-base sm:text-lg">{feature}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "hidden w-full overflow-hidden lg:flex lg:items-center lg:justify-center",
            imageDirection === "left" && "order-first",
          )}
        >
          {ImageComponent}
        </div>
      </div>
    </div>
  );
}
