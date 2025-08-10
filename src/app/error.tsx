"use client";

import { Button } from "@/components/ui";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Readonly<ErrorProps>) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-state-error/10 rounded-full">
          <AlertTriangle
            className="w-8 h-8 text-state-error"
            aria-hidden="true"
          />
        </div>

        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          Something went wrong!
        </h1>
        <p className="text-text-secondary mb-6 leading-relaxed">
          We encountered an unexpected error. Please try again or go back to the
          previous page.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 p-4 bg-background-muted rounded-lg text-left">
            <h3 className="text-sm font-medium text-text-primary mb-2">
              Error Details (Development):
            </h3>
            <code className="text-xs text-state-error break-all">
              {error.message}
            </code>
            {error.digest && (
              <p className="text-xs text-text-secondary mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            as={Link}
            href="/"
            variant="secondary"
            size="md"
            className="inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Go Home</span>
          </Button>
          <Button
            onClick={reset}
            variant="primary"
            size="md"
            className="inline-flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Try Again</span>
          </Button>
        </div>

        {/* Additional Help */}
        <p className="text-xs text-text-secondary mt-6">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
