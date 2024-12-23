import { Button } from "@/components/ui/button";
import { SignInForm } from "./form.client";
import { signInWithGoogle } from "@/actions/auth-server";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Google } from "@/components/icons";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-indigo-300 via-white to-indigo-300 p-4">
      <div className="w-ful mt-32 max-w-[440px] rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          Create your first ResumeX resume in seconds
        </h1>

        <form action={signInWithGoogle}>
          <Button type="submit" variant="outline" className="mb-6 h-12 w-full">
            <Google className="mr-2 h-5 w-5" />
            Sign up with Google
          </Button>
        </form>

        <div className="mb-6 flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <div className="space-y-4">
          <SignInForm />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing up, you acknowledge that you have read and understood,
            and agree to ResumeX &apos;s{" "}
            <Link href="#" className="text-blue-600 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link href="#" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>

      <div className="mt-12 flex max-w-[440px] items-center gap-3">
        <div className="flex-shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&q=80"
            alt="Profile"
            width={400}
            height={400}
            quality={80}
            className="size-10 rounded-full object-cover"
          />
        </div>
        <blockquote className="text-sm italic text-gray-600">
          I&apos;ve sent teams externally three times this month instead of
          scheduling a meeting and the first response is always, &quot;This is
          great, why don&apos;t more people do this?&quot;
        </blockquote>
      </div>
      <div className="mt-2 text-sm font-medium">
        Colin Howard
        <span className="block text-sm font-normal text-muted-foreground">
          Founding Partner, Penguin Intel
        </span>
      </div>
    </main>
  );
}
