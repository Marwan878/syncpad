import React from "react";
import { SignUpButton, SignInButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-br from-brand/30 via-brand-light/20 to-transparent opacity-60 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-2xl py-32 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-6xl">
          Collaborate in <span className="text-brand">Real-Time</span> with{" "}
          <span className="text-accent">SyncPad</span>
        </h1>

        <p className="mt-6 text-lg leading-8 text-text-secondary">
          Create workspaces, build pages together, and collaborate seamlessly
          with your team. SyncPad brings real-time editing and synchronization
          to your collaborative workflow.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <SignUpButton>
            <button className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-text-inverted shadow-sm hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-colors">
              Get Started Free
            </button>
          </SignUpButton>

          <SignInButton>
            <button className="text-sm font-semibold leading-6 text-text-primary hover:text-brand transition-colors">
              Sign In <span aria-hidden="true">→</span>
            </button>
          </SignInButton>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tl from-brand-dark/25 via-brand/15 to-transparent opacity-50 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
