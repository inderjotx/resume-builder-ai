import { OnboardingForm } from "@/app/(protected)/onboarding/_components/onboarding-form";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-indigo-300 via-indigo-200 to-pink-100/50">
      <div className="flex flex-col items-center justify-center gap-10 px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-indigo-900">
            Welcome Aboard!
          </h1>
          <p className="text-indigo-700">
            Let&apos;s get started with your profile setup
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
