"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <span className="text-xl font-bold">ResumeX</span>
        </Link>

        <div className="hidden items-center space-x-6 md:flex">
          <Link
            href="/templates"
            className="text-sm font-medium hover:text-primary"
          >
            Templates
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium hover:text-primary"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
