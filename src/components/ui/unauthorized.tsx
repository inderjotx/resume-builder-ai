import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <AlertCircle className="bg-destructive/10 text-destructive" />
        </div>
        <h1 className="mb-4 text-center text-2xl font-bold">
          Unauthorized Access
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Sorry, you don&apos;t have permission to access this page. Please
          contact your administrator if you believe this is an error.
        </p>
        <div className="flex justify-center">
          <Link
            href="/"
            className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
