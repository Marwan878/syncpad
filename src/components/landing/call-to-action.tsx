import React from "react";
import { SignUpButton, SignInButton } from "@clerk/nextjs";

export default function CallToAction() {
  return (
    <div className="bg-brand">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-inverted sm:text-4xl">
            Ready to transform your collaboration?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-text-inverted/90">
            Join thousands of teams already using SyncPad to create,
            collaborate, and build amazing things together.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <SignUpButton>
              <button className="rounded-md bg-text-inverted px-6 py-3 text-sm font-semibold text-brand shadow-sm hover:bg-text-inverted/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-inverted transition-colors">
                Start Free Today
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="text-sm font-semibold leading-6 text-text-inverted hover:text-text-inverted/80 transition-colors">
                Already have an account? Sign in{" "}
                <span aria-hidden="true">→</span>
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    </div>
  );
}
