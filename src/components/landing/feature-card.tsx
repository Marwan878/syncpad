import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: Readonly<FeatureCardProps>) {
  return (
    <div className="relative p-6 bg-white rounded-xl shadow-sm border border-background-muted hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mb-4">
        <div className="text-brand text-xl">{icon}</div>
      </div>

      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>

      <p className="text-text-secondary">{description}</p>
    </div>
  );
}
