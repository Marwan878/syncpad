import React from "react";
import Image from "next/image";
import { Container } from "../ui";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// TODO: Add an actual video and move FloatingElement to a separate file unless you didn't come here and removed it elsewhere

export default function ImageShowcase() {
  return (
    <Container as="section" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center mb:16 sm:mb-32">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          See SyncPad in <span className="text-yellow-500">Action</span>
        </h2>
        <p className="mt-6 text-lg leading-8 text-text-secondary">
          Experience the clean, intuitive interface designed for seamless
          collaboration and distraction-free productivity.
        </p>
      </div>

      <div className="relative rounded-xl p-2 ring-1 ring-inset ring-background-muted/10 lg:-m-4 lg:rounded-2xl lg:p-4 overflow-hidden bg-white shadow-2xl">
        <Image
          src="/brand.png"
          alt="SyncPad interface showcasing clean design and collaborative features"
          width={2432}
          height={1442}
          className="w-full object-cover object-center"
          priority
        />

        <FloatingElement
          text="Live Collaboration"
          className="left-4 top-4 sm:left-6 sm:top-6 text-accent"
        />

        <FloatingElement
          text="Auto-saved"
          className="right-4 top-4 sm:right-6 sm:top-6 text-brand"
        />
      </div>
    </Container>
  );
}

function FloatingElement({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute rounded-lg bg-white/90 backdrop-blur-sm px-3 py-2 shadow-lg ring-1 ring-background-muted/10 flex items-center space-x-2",
        className
      )}
    >
      <Circle
        fill="currentColor"
        className="text-inherit animate-pulse size-2"
        aria-hidden="true"
      />
      <span className="text-xs font-medium text-text-primary select-none">
        {text}
      </span>
    </div>
  );
}
