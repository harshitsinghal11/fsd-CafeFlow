"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#f8f8f8] p-4 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
        <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-[#653100] mb-4">
          Oops! Something went wrong.
        </h1>
        <p className="text-gray-500 mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="w-full bg-[#DA944B] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#c3813e] transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all block"
          >
            Go to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
