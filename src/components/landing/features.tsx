import { features } from "@/constants/features";
import { Container } from "../ui";
import FeatureCard from "./feature-card";

export default function Features() {
  return (
    <div className="bg-background-light">
      <Container className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Built for Simplicity and <span className="text-brand">Privacy</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-text-secondary">
            SyncPad is designed around the principles that matter most: keeping
            things simple, respecting your privacy, and staying completely free.
          </p>
        </div>
        <div className="mx-auto mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title + index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
