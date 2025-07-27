import React from "react";
import FeatureCard from "./feature-card";

export default function Features() {
  const features = [
    {
      icon: "⚡",
      title: "Real-Time Collaboration",
      description:
        "Work together simultaneously with live cursors, instant updates, and seamless synchronization across all devices.",
    },
    {
      icon: "📁",
      title: "Organized Workspaces",
      description:
        "Create dedicated workspaces for different projects, teams, or purposes to keep your content organized and accessible.",
    },
    {
      icon: "📝",
      title: "Rich Text Editing",
      description:
        "Advanced text editor with formatting options, code blocks, tables, and media support for comprehensive content creation.",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description:
        "Enterprise-grade security with encryption, access controls, and privacy settings to protect your sensitive information.",
    },
    {
      icon: "📱",
      title: "Cross-Platform",
      description:
        "Access your workspaces from any device - desktop, tablet, or mobile - with full feature synchronization.",
    },
    {
      icon: "💾",
      title: "Auto-Save & History",
      description:
        "Never lose your work with automatic saving and comprehensive version history to track all changes.",
    },
  ];

  return (
    <div className="bg-background-light py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Everything you need for{" "}
            <span className="text-brand">seamless collaboration</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-text-secondary">
            SyncPad combines powerful features with intuitive design to make
            real-time collaboration effortless for teams of any size.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title + index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
