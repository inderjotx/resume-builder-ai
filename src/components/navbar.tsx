import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import { Framer } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Suspense } from "react";

export function Navbar() {
  return (
    <div className="fixed inset-x-0 top-2 z-50">
      <nav className="sticky top-2 z-50 mx-4 w-full rounded-xl border bg-background/95 px-4 py-1 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 md:mx-auto md:max-w-4xl">
        <div className="flex h-12 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Framer className="h-6 w-6" />
            <span className="text-xl font-bold">ResumeX</span>
          </Link>

          <div className="hidden items-center space-x-6 md:flex">
            <Link href="/templates" className="font-medium hover:text-primary">
              Templates
            </Link>
            <Link href="/features" className="font-medium hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="font-medium hover:text-primary">
              Pricing
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Suspense fallback={<SignInButton />}>
              <SignInButtonAsync />
            </Suspense>
            <Button variant="default">
              <Link href={"/dashboard"}>Dashboard</Link>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export const SignInButtonAsync = async () => {
  const session = await auth();

  if (session) {
    return (
      <Link href={"/dashboard"}>
        <Avatar>
          <AvatarImage src={session.user?.image ?? ""} />
          <AvatarFallback className="border">
            {session.user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </Link>
    );
  } else {
    return <SignInButton />;
  }
};

const SignInButton = () => {
  return (
    <Button variant="outline">
      <Link href={"/sign-in"}>Sign In</Link>
    </Button>
  );
};
